import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
  cpSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createProject } from '../environment/projects.js';

function temporary(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-maintenance-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
const journal = resolve('scripts/environment/journal.js');
const cli = (root, ...args) =>
  spawnSync(process.execPath, [journal, ...args], { cwd: root, encoding: 'utf8' });

test('factory CLI owns temporary tasks and keeps project tasks out of its listing', (t) => {
  const root = temporary(t);
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'design-system-developer', private: true, type: 'module' }),
  );
  createProject(root, 'alpha');
  assert.deepEqual(JSON.parse(cli(root, 'list').stdout), []);
  const created = cli(root, 'init', 'maintain', '--object', 'environment', '--action', 'repair');
  assert.equal(created.status, 0, created.stderr);
  const task = JSON.parse(created.stdout);
  assert.equal(task.path, '.local/tasks/maintain/_process_log.md');
  assert.deepEqual(
    JSON.parse(cli(root, 'list').stdout).map((x) => x.id),
    ['maintain'],
  );
  assert.equal(JSON.parse(cli(root, 'resume', 'maintain').stdout).token, task.token);
  assert.equal(cli(root, 'init', 'maintain', '--object', 'environment').status, 1);
  assert.equal(
    cli(
      root,
      'init',
      'wrong',
      '--object',
      'environment',
      '--journal',
      '.local/tasks/other/_process_log.md',
    ).status,
    1,
  );
  assert.equal(existsSync(join(root, '.local/tasks/other')), false);
  assert.equal(
    cli(root, 'init', 'escape', '--object', 'environment', '--journal', '../outside.md').status,
    1,
  );
  const ref = cli(root, 'ref', 'package.json');
  assert.equal(ref.status, 0, ref.stderr);
  assert.equal(JSON.parse(ref.stdout).path, 'package.json');
});

test('release tasks work through the public project CLI and never imply publication', (t) => {
  const root = temporary(t);
  createProject(root, 'alpha');
  const result = cli(root, 'init', 'release-library', '--project', 'alpha', '--action', 'release');
  assert.equal(result.status, 0, result.stderr);
  const task = JSON.parse(result.stdout);
  assert.equal(task.state.action, 'release');
  assert.equal(task.state.status, 'discovery');
  assert.equal(task.state.acceptance, null);
  assert.equal(cli(root, 'check', 'release-library', '--project', 'alpha').status, 0);
});

test('hook setup recreates loaders only in the owning checkout', (t) => {
  const root = temporary(t);
  assert.equal(spawnSync('git', ['init', '--quiet', root]).status, 0);
  const child = join(root, 'child');
  mkdirSync(child);
  const script = pathToFileURL(resolve('scripts/environment/prepare-hooks.js')).href;
  const setup = (cwd) =>
    spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import {prepareHooks} from ${JSON.stringify(script)}; prepareHooks(process.argv[1]);`,
        cwd,
      ],
      { env: { ...process.env, HUSKY: '' }, encoding: 'utf8' },
    );
  assert.equal(setup(child).status, 0);
  assert.equal(
    spawnSync('git', ['-C', root, 'config', '--local', '--get', 'core.hooksPath']).status,
    1,
  );
  mkdirSync(join(root, 'node_modules'), { recursive: true });
  cpSync(resolve('node_modules/husky'), join(root, 'node_modules/husky'), { recursive: true });
  const result = setup(root);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(join(root, '.husky/_/pre-commit')), true);
  assert.equal(
    spawnSync('git', ['-C', root, 'config', '--local', '--get', 'core.hooksPath'], {
      encoding: 'utf8',
    }).stdout.trim(),
    '.husky/_',
  );
  assert.ok(readFileSync(join(root, '.husky/_/h'), 'utf8'));
});
