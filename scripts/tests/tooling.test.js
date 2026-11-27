import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  rmSync,
  cpSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { installTooling } from '../environment/tooling.js';
import { createProject } from '../environment/projects.js';
const factory = process.cwd();
function temporary(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-kit-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
function target(t) {
  const root = temporary(t);
  return createProject(root, 'alpha').root;
}
const cli = (root, file, args = []) =>
  spawnSync(process.execPath, [join(root, file), ...args], { cwd: root, encoding: 'utf8' });
test('kit runs from a detached project with no factory files, Git or dependencies', (t) => {
  const root = target(t);
  assert.equal(installTooling(factory, root).copied, 14);
  const detached = join(temporary(t), 'handoff');
  cpSync(root, detached, { recursive: true });
  assert.equal(existsSync(join(detached, 'config/routes.json')), false);
  assert.equal(existsSync(join(detached, 'node_modules')), false);
  const check = cli(detached, 'scripts/environment/check-project.js');
  assert.equal(check.status, 0, check.stdout + check.stderr);
  assert.equal(JSON.parse(check.stdout).passed, true);
  let result = cli(detached, 'scripts/environment/journal.js', [
    'init',
    'add-button',
    '--component',
    'button',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const task = JSON.parse(result.stdout);
  const spec = readFileSync(join(detached, task.state.spec.path), 'utf8');
  assert.match(spec, /Numeric Map/);
  assert.equal(spec.includes('{{component}}'), false);
  result = cli(detached, 'scripts/environment/journal.js', ['resume', 'add-button']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).token, task.token);
  mkdirSync(join(detached, 'src/components/button'), { recursive: true });
  writeFileSync(
    join(detached, 'src/components/button/Button.tsx'),
    'export const Button = () => null;',
  );
  result = cli(detached, 'scripts/quality-report.js', [
    '--component',
    'Button',
    '--change',
    'docs',
    '--plan',
  ]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(JSON.parse(result.stdout).mode, 'component');
});
test('reinstall is idempotent and does not alter task records', (t) => {
  const root = target(t),
    journal = join(root, 'product-discovery/_process_log.md'),
    before = readFileSync(journal);
  installTooling(factory, root);
  const metadata = readFileSync(join(root, 'system.json'));
  assert.equal(installTooling(factory, root).copied, 0);
  assert.deepEqual(readFileSync(join(root, 'system.json')), metadata);
  assert.deepEqual(readFileSync(journal), before);
});
test('local file or npm script conflicts are detected before other replacements', (t) => {
  for (const kind of ['file', 'script']) {
    const root = target(t);
    installTooling(factory, root);
    const metadata = readFileSync(join(root, 'system.json'));
    if (kind === 'file')
      writeFileSync(join(root, 'scripts/environment/journal.js'), '// manual edit');
    else {
      const p = join(root, 'package.json'),
        pkg = JSON.parse(readFileSync(p));
      pkg.scripts['env:task'] = 'custom task';
      writeFileSync(p, JSON.stringify(pkg));
    }
    assert.throws(() => installTooling(factory, root), /conflict/);
    assert.deepEqual(readFileSync(join(root, 'system.json')), metadata);
    assert.equal(existsSync(join(root, '.tooling-install.lock')), false);
  }
});
test('unmanaged files, symlinks and foreign locks are not overwritten', (t) => {
  const root = target(t);
  writeFileSync(join(root, 'AGENTS.md'), 'User instructions');
  assert.throws(() => installTooling(factory, root), /conflict/);
  assert.equal(existsSync(join(root, 'scripts')), false);
  rmSync(join(root, 'AGENTS.md'));
  const outside = temporary(t);
  symlinkSync(outside, join(root, 'scripts'));
  assert.throws(() => installTooling(factory, root), /symlink/);
  rmSync(join(root, 'scripts'));
  writeFileSync(join(root, '.tooling-install.lock'), 'foreign lock');
  assert.throws(() => installTooling(factory, root), /EEXIST/);
  assert.equal(readFileSync(join(root, '.tooling-install.lock'), 'utf8'), 'foreign lock');
});
test('flat factory installation and invalid kit destinations are rejected', (t) => {
  assert.throws(() => installTooling(factory, factory), /standalone/);
  const root = target(t),
    fakeFactory = temporary(t);
  cpSync(join(factory, 'templates'), join(fakeFactory, 'templates'), { recursive: true });
  const path = join(fakeFactory, 'templates/project-tooling.json'),
    kit = JSON.parse(readFileSync(path));
  kit.files = [{ source: 'templates/brief.md', target: '../outside.md' }];
  writeFileSync(path, JSON.stringify(kit));
  assert.throws(() => installTooling(fakeFactory, root), /Unsafe/);
  assert.equal(existsSync(join(root, 'package.json')), false);
});
test('managed upgrades replace only unchanged prior files', (t) => {
  const root = target(t),
    source = temporary(t);
  cpSync(join(factory, 'templates'), join(source, 'templates'), { recursive: true });
  cpSync(join(factory, 'scripts'), join(source, 'scripts'), { recursive: true });
  installTooling(source, root);
  const doc = join(source, 'templates/project-development.md');
  writeFileSync(doc, readFileSync(doc, 'utf8') + '\nNew kit guidance.\n');
  const path = join(source, 'templates/project-tooling.json'),
    kit = JSON.parse(readFileSync(path));
  const [major, minor, patch] = kit.version.split('.').map(Number);
  kit.version = [major, minor, patch + 1].join('.');
  writeFileSync(path, JSON.stringify(kit));
  assert.equal(installTooling(source, root).copied, 1);
  assert.match(readFileSync(join(root, 'docs/development.md'), 'utf8'), /New kit guidance/);
});
test('task init rejects broken custom templates before writing product records', (t) => {
  const root = target(t);
  installTooling(factory, root);
  writeFileSync(join(root, 'templates/brief.md'), 'No draft marker');
  const result = cli(root, 'scripts/environment/journal.js', [
    'init',
    'bad',
    '--component',
    'button',
  ]);
  assert.equal(result.status, 1);
  assert.equal(existsSync(join(root, 'component-specs')), false);
});
