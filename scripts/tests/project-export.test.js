import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
  realpathSync,
  symlinkSync,
  cpSync,
  chmodSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createProject } from '../environment/projects.js';
import { exportProject } from '../environment/export.js';
import { projectContext, projectList } from '../environment/project.js';
import { checkEnvironment, routeTask } from '../environment/check.js';
import { installTooling } from '../environment/tooling.js';
function temporary(t) {
  const p = realpathSync(mkdtempSync(join(tmpdir(), 'ds-project-export-')));
  t.after(() => rmSync(p, { recursive: true, force: true }));
  return p;
}
function readyProject(t, id = 'alpha') {
  const factory = temporary(t),
    p = createProject(factory, id);
  for (const name of ['src', 'tokens', '.storybook', 'docs', 'scripts'])
    mkdirSync(join(p.root, name));
  writeFileSync(
    join(p.root, 'package.json'),
    JSON.stringify({ name: id, version: '1.0.0', type: 'module' }),
  );
  writeFileSync(join(p.root, 'package-lock.json'), '{"lockfileVersion":3}\n');
  return { factory, project: projectContext(factory, id) };
}
test('project collection owns the system from briefing and blocks duplicate or ambiguous selection', (t) => {
  const root = temporary(t),
    p = createProject(root, 'alpha');
  assert.equal(p.root, join(root, 'projects/alpha'));
  assert.equal(existsSync(join(root, 'systems')), false);
  assert.equal(projectList(root)[0].id, 'alpha');
  assert.throws(() => createProject(root, 'alpha'), /exists/);
  assert.throws(() => projectContext(root, 'missing'));
});
test('task CLI selects the project explicitly and rejects conflicting selectors', (t) => {
  const root = temporary(t);
  createProject(root, 'alpha');
  const script = resolve('scripts/environment/journal.js');
  for (const flag of ['--project', '--system']) {
    const result = spawnSync(process.execPath, [script, 'list', '--root', root, flag, 'alpha'], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout)[0].id, 'create-system');
  }
  const conflict = spawnSync(
    process.execPath,
    [script, 'list', '--root', root, '--project', 'alpha', '--system', 'alpha'],
    { encoding: 'utf8' },
  );
  assert.notEqual(conflict.status, 0);
});
test('export contains only the selected standalone source with receipts and reproducible file hashes', (t) => {
  const { factory, project } = readyProject(t);
  installTooling(process.cwd(), project.root);
  mkdirSync(join(project.root, '.git'));
  writeFileSync(join(project.root, '.git/HEAD'), 'private metadata');
  writeFileSync(join(project.root, '.env'), 'PRIVATE_VALUE=do-not-export');
  writeFileSync(join(project.root, '.env.example'), 'PRIVATE_VALUE=');
  mkdirSync(join(project.root, '.husky/_'), { recursive: true });
  writeFileSync(join(project.root, '.husky/pre-commit'), 'npm test\n');
  writeFileSync(join(project.root, '.husky/_/pre-commit'), 'generated loader');
  for (const folder of ['node_modules', '.local', 'dist', 'coverage', 'storybook-static']) {
    mkdirSync(join(project.root, folder));
    writeFileSync(join(project.root, folder, 'cache'), 'not source');
  }
  const history = join(project.root, 'component-specs/button/history');
  mkdirSync(history, { recursive: true });
  writeFileSync(join(history, 'receipt.json'), '{"historical":true}');
  writeFileSync(join(history, 'check.log'), 'original result');
  const hook = join(project.root, 'scripts/local.sh');
  writeFileSync(hook, '#!/bin/sh\nexit 0\n');
  chmodSync(hook, 0o755);
  const output = join(temporary(t), 'standalone');
  const result = exportProject(factory, project, output);
  assert.equal(result.gitInitialized, false);
  assert.equal(result.pushed, false);
  for (const name of [
    '.git',
    '.env',
    'node_modules',
    '.local',
    'dist',
    'coverage',
    'storybook-static',
  ])
    assert.equal(existsSync(join(output, name)), false);
  assert.equal(readFileSync(join(output, '.env.example'), 'utf8'), 'PRIVATE_VALUE=');
  assert.equal(existsSync(join(output, '.husky/_')), false);
  assert.equal(readFileSync(join(output, '.husky/pre-commit'), 'utf8'), 'npm test\n');
  assert.equal(
    readFileSync(join(output, 'component-specs/button/history/check.log'), 'utf8'),
    'original result',
  );
  assert.equal(statSync(join(output, 'scripts/local.sh')).mode & 0o777, 0o755);
  const manifest = JSON.parse(readFileSync(result.manifest));
  assert.ok(manifest.files.some((f) => f.path === 'package-lock.json'));
  assert.equal(
    manifest.files.some((f) => f.path.includes(factory)),
    false,
  );
  const cmd = spawnSync(
    process.execPath,
    [join(output, 'scripts/environment/journal.js'), 'list'],
    { cwd: output, encoding: 'utf8' },
  );
  assert.equal(cmd.status, 0, cmd.stderr);
  assert.equal(JSON.parse(cmd.stdout)[0].id, 'create-system');
  const second = exportProject(factory, project, join(temporary(t), 'copy'));
  assert.equal(second.fingerprint, result.fingerprint);
  assert.throws(() => exportProject(factory, project, output), /exists/);
});
test('bad export destinations or source links leave the project and target untouched', (t) => {
  const { factory, project } = readyProject(t);
  assert.throws(() => exportProject(factory, project, null), /out/);
  assert.throws(() => exportProject(factory, project, join(project.root, 'copy')), /overlaps/);
  assert.throws(
    () => exportProject(factory, project, join(factory, 'projects', 'other')),
    /collection/,
  );
  const outside = temporary(t),
    target = join(temporary(t), 'copy');
  writeFileSync(join(outside, 'foreign'), 'external');
  symlinkSync(join(outside, 'foreign'), join(project.root, 'src/link'));
  assert.throws(() => exportProject(factory, project, target), /symlink/);
  assert.equal(existsSync(target), false);
  assert.equal(readFileSync(join(outside, 'foreign'), 'utf8'), 'external');
});
test('project command rejects irrelevant flags and exports only an explicit selection', (t) => {
  const { factory, project } = readyProject(t);
  const script = resolve('scripts/environment/projects.js');
  const out = join(temporary(t), 'copy');
  const good = spawnSync(
    process.execPath,
    [script, 'export', 'alpha', '--root', factory, '--out', out],
    { encoding: 'utf8' },
  );
  assert.equal(good.status, 0, good.stderr);
  assert.equal(JSON.parse(good.stdout).project, 'alpha');
  const bad = spawnSync(
    process.execPath,
    [script, 'list', '--root', factory, '--out', join(temporary(t), 'bad')],
    { encoding: 'utf8' },
  );
  assert.notEqual(bad.status, 0);
  assert.equal(existsSync(join(project.root, 'copy')), false);
});
test('route separates procedural skills and conditionally recommended workers', () => {
  const root = process.cwd(),
    simple = routeTask(root, { action: 'create', object: 'component', mode: 'intake' });
  assert.deepEqual(simple.agentRecommendations, []);
  const component = routeTask(root, { action: 'repair', object: 'component' });
  assert.ok(component.skills.some((p) => p === 'skills/ds-component/SKILL.md'));
  assert.deepEqual(
    component.agentRecommendations.map((r) => r.id),
    ['ds-library-reader', 'ds-reviewer'],
  );
  assert.ok(
    component.agentRecommendations.every((r) => r.path.startsWith('agents/') && r.when.trim()),
  );
  const research = routeTask(root, { action: 'research', object: 'system' });
  assert.ok(research.agentRecommendations.some((r) => r.id === 'ds-researcher'));
});
test('unknown worker recommendation is rejected before routing', (t) => {
  const copy = temporary(t);
  for (const name of [
    'AGENTS.md',
    'README.md',
    'PROCESS.md',
    'ARCHITECTURE.md',
    'BACKLOG.md',
    'config',
    'directives',
    'skills',
    'agents',
    'templates',
    'scripts',
    'docs',
    'projects/ai-pdp-ds/system.json',
    'projects/ai-pdp-ds/README.md',
    'projects/ai-pdp-ds/docs/library-conventions.md',
    'projects/ai-pdp-ds/docs/library-setup.md',
    'projects/ai-pdp-ds/product-discovery/evidence/standalone-migration/verification.json',
  ])
    cpSync(name, join(copy, name), { recursive: true, verbatimSymlinks: true });
  const path = join(copy, 'config/routes.json'),
    r = JSON.parse(readFileSync(path));
  r.skills[0].agents = ['missing-worker'];
  writeFileSync(path, JSON.stringify(r));
  assert.equal(checkEnvironment(copy).passed, false);
});
