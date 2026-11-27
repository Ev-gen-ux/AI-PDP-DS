import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  cpSync,
  rmSync,
  mkdirSync,
  symlinkSync,
  readdirSync,
  existsSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { checkEnvironment, routeTask, links, skillMetadata } from '../environment/check.js';
import { createProject } from '../environment/projects.js';
import { initJournal, updateJournal } from '../environment/journal.js';
import { linked } from '../environment/links.js';
const root = process.cwd();
function fixture(t) {
  const folder = mkdtempSync(join(tmpdir(), 'ds-environment-'));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  for (const path of [
    'AGENTS.md',
    'README.md',
    'PROCESS.md',
    'ARCHITECTURE.md',
    'config',
    'directives',
    'docs/standards',
    'projects/ai-pdp-ds/docs/library-conventions.md',
    'projects/ai-pdp-ds/docs/library-setup.md',
    'projects/ai-pdp-ds/system.json',
    'projects/ai-pdp-ds/README.md',
    'skills',
    'agents',
    'templates',
    'scripts',
  ])
    cpSync(join(root, path), join(folder, path), { recursive: true, verbatimSymlinks: true });
  const registry = JSON.parse(readFileSync(join(root, 'config/routes.json'), 'utf8'));
  const documents = [
    ...registry.entrypoints,
    ...registry.directives,
    ...registry.standards.map((s) => s.path),
    ...registry.skills.map((s) => s.path),
  ];
  for (const source of documents)
    for (const path of linked(root, source))
      if (!existsSync(join(folder, path)))
        cpSync(join(root, path), join(folder, path), { recursive: true, verbatimSymlinks: true });
  return folder;
}
function changeRegistry(folder, fn) {
  const path = join(folder, 'config/routes.json'),
    data = JSON.parse(readFileSync(path, 'utf8'));
  fn(data);
  writeFileSync(path, JSON.stringify(data));
}
function edit(folder, path, fn) {
  const p = join(folder, path);
  writeFileSync(p, fn(readFileSync(p, 'utf8')));
}
test('a copied factory reads visible skills and roles without discovery adapters', (t) => {
  const folder = fixture(t);
  assert.equal(existsSync(join(folder, '.agents')), false);
  assert.equal(existsSync(join(folder, '.codex')), false);
  assert.ok(readFileSync(join(folder, 'skills/ds-component/SKILL.md'), 'utf8'));
  assert.ok(readFileSync(join(folder, 'agents/ds-library-reader.toml'), 'utf8'));
  assert.equal(checkEnvironment(folder).passed, true);
});
test('active structure passes without retired wrappers, migration files or local task scanning', (t) => {
  const folder = fixture(t);
  mkdirSync(join(folder, '.local'));
  writeFileSync(join(folder, '.local/bad.md'), '[secret](missing)');
  assert.equal(checkEnvironment(folder).passed, true);
  const before = readFileSync(join(folder, 'config/routes.json'));
  assert.equal(checkEnvironment(folder).passed, true);
  assert.deepEqual(readFileSync(join(folder, 'config/routes.json')), before);
});
test('routes include system creation and keep exploratory audits read-only', () => {
  assert.match(routeTask(root, { action: 'create', object: 'system' }).skills[0], /ds-system/);
  const audit = routeTask(root, { action: 'audit', object: 'component', mode: 'parity' });
  assert.equal(audit.implementationRoute, false);
  assert.ok(audit.skills.some((p) => p.includes('ds-figma-parity')));
  assert.ok(audit.skills.some((p) => p.includes('ds-quality-audit')));
  const research = routeTask(root, { action: 'research', object: 'tokens' });
  assert.equal(research.implementationRoute, false);
  for (const object of ['icons', 'chart'])
    assert.equal(routeTask(root, { action: 'create', object }).supported, false);
  assert.throws(() => routeTask(root, { action: 'publish', object: 'system' }), /Unknown/);
  assert.throws(
    () => routeTask(root, { action: 'create', object: 'documentation', mode: 'parity' }),
    /incompatible/,
  );
});
for (const [label, mutate] of [
  ['duplicate skill', (d) => d.skills.push(d.skills[0])],
  ['missing action route', (d) => delete d.actionSkills.audit],
  ['unknown standard', (d) => d.targets[0].standards.push('missing')],
  ['mismatched standard path', (d) => (d.standards[0].path = 'README.md')],
  ['unknown manifest target', (d) => (d.tooling = '../external.json')],
])
  test('rejects ' + label, (t) => {
    const folder = fixture(t);
    changeRegistry(folder, mutate);
    assert.equal(checkEnvironment(folder).passed, false);
  });
test('missing or orphaned canonical instructions and skills fail', (t) => {
  const folder = fixture(t);
  writeFileSync(join(folder, 'directives/orphan.md'), '# orphan');
  assert.equal(checkEnvironment(folder).passed, false);
  rmSync(join(folder, 'directives/orphan.md'));
  rmSync(join(folder, 'skills/ds-component/SKILL.md'));
  assert.equal(checkEnvironment(folder).passed, false);
});
test('broken and escaping instruction links are rejected while examples are ignored', (t) => {
  const folder = fixture(t);
  edit(folder, 'directives/component.md', (s) => s + '\n[Broken](missing.md)\n');
  assert.equal(checkEnvironment(folder).passed, false);
  edit(folder, 'directives/component.md', (s) =>
    s.replace('[Broken](missing.md)', '[Outside](../../elsewhere.md)'),
  );
  assert.equal(checkEnvironment(folder).passed, false);
  assert.deepEqual(
    links('```md\n[Example](missing.md)\n```\n`[inline](missing.md)`\n[Real](../ok.md)'),
    ['../ok.md'],
  );
});
test('canonical symlinks are rejected without reading their contents', (t) => {
  const folder = fixture(t),
    file = join(folder, 'docs/standards/components.md');
  rmSync(file);
  symlinkSync(join(root, 'docs/standards/components.md'), file);
  assert.equal(checkEnvironment(folder).passed, false);
});
test('skill metadata and procedure must match the registry', (t) => {
  const folder = fixture(t);
  edit(folder, 'skills/ds-component/SKILL.md', (s) =>
    s.replace('name: ds-component', 'name: other-name'),
  );
  assert.equal(checkEnvironment(folder).passed, false);
  assert.throws(() => skillMetadata('---\nname: example\ndescription: true\n---\n'), /string/);
  assert.throws(() =>
    skillMetadata('---\nname: example\nname: duplicate\ndescription: text\n---\n'),
  );
  assert.equal(
    skillMetadata('---\nname: example\ndescription: "A valid: description"\n---\n').description,
    'A valid: description',
  );
});
test('role declarations reject unsolicited runtime overrides', (t) => {
  const folder = fixture(t);
  edit(folder, 'agents/ds-reviewer.toml', (s) => s + '\nmodel = "override"\n');
  assert.equal(checkEnvironment(folder).passed, false);
});
test('explicit task check detects stale inputs and reports no private task prose', (t) => {
  const folder = fixture(t),
    project = createProject(folder, 'alpha');
  let s = initJournal({ root: project.root, id: 'alpha' }, 'audit', { action: 'audit' });
  assert.equal(checkEnvironment(folder, { taskId: 'audit', system: 'alpha' }).passed, true);
  writeFileSync(join(project.root, s.state.brief.path), 'Private changed task title');
  const report = checkEnvironment(folder, { taskId: 'audit', system: 'alpha' });
  assert.equal(report.passed, false);
  assert.equal(JSON.stringify(report).includes('Private changed'), false);
  s = updateJournal(project.root, s.path, s.token, {}, 'refresh');
  assert.equal(s.stale.length, 0);
});
test('CLI is independent of Git/cwd and rejects incomplete flags', (t) => {
  const folder = fixture(t);
  const cli = join(root, 'scripts/environment/check.js');
  const ok = spawnSync(process.execPath, [cli, '--root', folder], {
    cwd: tmpdir(),
    encoding: 'utf8',
  });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  const bad = spawnSync(process.execPath, [cli, '--root'], { cwd: folder, encoding: 'utf8' });
  assert.equal(bad.status, 1);
  const route = spawnSync(
    process.execPath,
    [resolve('scripts/environment/route.js'), '--request', 'Исправь баг в InputPassword'],
    { cwd: tmpdir(), encoding: 'utf8' },
  );
  assert.equal(route.status, 0, route.stderr);
  assert.equal(JSON.parse(route.stdout).route.implementationRoute, true);
});
test('diagnostic does not depend on snapshot status files', (t) => {
  const folder = fixture(t);
  for (const name of readdirSync(join(folder, 'config'))) assert.ok(name.endsWith('.json'));
  assert.equal(
    checkEnvironment(folder).checks.some((c) => c.code === 'migration'),
    false,
  );
});
