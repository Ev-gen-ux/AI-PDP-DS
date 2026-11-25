import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
  symlinkSync,
  rmSync,
  readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import {
  initTask,
  loadTask,
  updateTask,
  fingerprint,
  fileReference,
} from '../environment/task-state.js';

const script = resolve('scripts/environment/task-state.js');
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-task-state-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, '.gitignore'), '.local/\n');
  writeFileSync(join(root, 'spec.md'), '# Fixture specification\n');
  writeFileSync(join(root, 'input.txt'), 'original input\n');
  execFileSync('git', ['init', '--quiet', root]);
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', [
    '-C',
    root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  ]);
  return root;
}
const seed = {
  title: 'Fixture repair',
  scope: { summary: 'Repair only the fixture', preserve: ['public API'] },
  route: { action: 'repair', object: 'component', platform: 'web-react', delivery: ['code'] },
  spec: 'spec.md',
  inputs: ['input.txt'],
  nextStep: 'Verify the fixture',
};
const statePath = (root, id = 'task') => join(root, '.local/tasks', id, 'state.json');
function advance(root, value, status, extra = {}) {
  return updateTask(root, value.state.id, value.token, { ...extra, status });
}
function cli(root, args, cwd = root) {
  return spawnSync(process.execPath, [script, ...args, '--root', root], { cwd, encoding: 'utf8' });
}

test('unknown requirements remain null and repeat init never changes an existing task', (t) => {
  const root = fixture(t);
  const state = initTask(root, 'task');
  assert.equal(state.state.title, null);
  assert.equal(state.state.route.action, null);
  assert.equal(state.state.spec, null);
  const before = readFileSync(statePath(root));
  assert.throws(() => initTask(root, 'task', seed), /EEXIST/);
  assert.deepEqual(readFileSync(statePath(root)), before);
  assert.equal(state.validForCompletion, false);
});

test('invalid metadata or route is rejected before any task directory is created', (t) => {
  const root = fixture(t);
  for (const value of [
    { revision: 7 },
    { surprise: 'do not erase me' },
    { route: null },
    { route: { surprise: true } },
    { status: 'accepted' },
  ]) {
    assert.throws(() => initTask(root, 'bad', value));
    assert.equal(existsSync(join(root, '.local/tasks/bad')), false);
  }
});

test('missing Spec and unsafe or duplicate references cannot be bound', (t) => {
  const root = fixture(t);
  for (const spec of ['../outside.md', '/etc/hosts', '.git/HEAD', 'missing.md', 'docs\\x.md']) {
    assert.throws(() => initTask(root, 'bad', { ...seed, spec }));
  }
  symlinkSync(join(root, 'spec.md'), join(root, 'alias.md'));
  assert.throws(() => initTask(root, 'bad', { ...seed, inputs: ['alias.md'] }), /Duplicate/);
  const outside = mkdtempSync(join(tmpdir(), 'ds-outside-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, 'outside.md'), 'outside');
  symlinkSync(join(outside, 'outside.md'), join(root, 'escape.md'));
  assert.throws(() => initTask(root, 'bad', { ...seed, spec: 'escape.md' }), /escapes/);
});

test('task storage symlinks are rejected without writing outside the workspace', (t) => {
  const root = fixture(t);
  const outside = mkdtempSync(join(tmpdir(), 'ds-storage-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  symlinkSync(outside, join(root, '.local'));
  assert.throws(() => initTask(root, 'task'), /Unsafe/);
  assert.deepEqual(readdirSync(outside), []);
});

test('a new session recovers decisions, questions, scope and next step without writing', (t) => {
  const root = fixture(t);
  initTask(root, 'task', {
    ...seed,
    decisions: ['Preserve the existing API'],
    questions: ['Confirm the error state'],
  });
  const before = readFileSync(statePath(root));
  mkdirSync(join(root, 'nested'));
  const result = cli(root, ['resume', 'task'], join(root, 'nested'));
  assert.equal(result.status, 0, result.stderr);
  const restored = JSON.parse(result.stdout);
  assert.deepEqual(restored.state.questions, ['Confirm the error state']);
  assert.equal(restored.state.nextStep, seed.nextStep);
  assert.equal(restored.state.scope.summary, seed.scope.summary);
  assert.equal(restored.state.decisions[0], 'Preserve the existing API');
  assert.deepEqual(readFileSync(statePath(root)), before);
  assert.equal(existsSync(join(root, '.local/tasks/task/history')), false);
});

test('stale optimistic tokens preserve manual edits and reject silent overwrites', (t) => {
  const root = fixture(t);
  const state = initTask(root, 'task', seed);
  const manual = { ...state.state, nextStep: 'A manual change' };
  writeFileSync(statePath(root), JSON.stringify(manual));
  assert.throws(() => updateTask(root, 'task', state.token, { nextStep: 'Overwrite' }), /conflict/);
  assert.equal(loadTask(root, 'task').state.nextStep, 'A manual change');
  assert.equal(existsSync(join(root, '.local/tasks/task/write.lock')), false);
});

test('unknown fields in manually edited state remain intact on validation failure', (t) => {
  const root = fixture(t);
  initTask(root, 'task', seed);
  const manual = JSON.parse(readFileSync(statePath(root), 'utf8'));
  manual.futureField = 'keep this data';
  const raw = JSON.stringify(manual);
  writeFileSync(statePath(root), raw);
  const result = cli(root, ['check', 'task']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown field/);
  assert.equal(readFileSync(statePath(root), 'utf8'), raw);
});

test('updates save the exact previous version and cannot skip review into acceptance', (t) => {
  const root = fixture(t);
  let state = initTask(root, 'task', seed);
  const before = readFileSync(statePath(root), 'utf8');
  assert.throws(() => advance(root, state, 'accepted'), /transition/);
  state = advance(root, state, 'ready');
  assert.equal(state.state.revision, 2);
  const history = join(root, '.local/tasks/task/history');
  assert.equal(readFileSync(join(history, readdirSync(history)[0]), 'utf8'), before);
  assert.throws(() => updateTask(root, 'task', state.token, { revision: 99 }), /Immutable/);
});

test('ready requires known route, resolved questions and canonical component Spec', (t) => {
  const root = fixture(t);
  let state = initTask(root, 'task');
  assert.throws(() => advance(root, state, 'ready'), /must be known/);
  state = updateTask(root, 'task', state.token, { ...seed, questions: ['Unresolved'] });
  assert.throws(() => advance(root, state, 'ready'), /Resolve questions/);
  assert.throws(
    () => advance(root, state, 'ready', { questions: [], spec: null }),
    /canonical Spec/,
  );
});

test('blocking records a concrete reason and requires explicit clearing', (t) => {
  const root = fixture(t);
  let state = initTask(root, 'task', seed);
  assert.throws(() => advance(root, state, 'blocked'), /reason/);
  state = advance(root, state, 'blocked', { blockedReason: 'Missing owner decision' });
  assert.throws(() => advance(root, state, 'ready'), /cleared/);
  state = advance(root, state, 'ready', { blockedReason: null });
  assert.equal(state.state.status, 'ready');
});

test('changed Spec is visible on resume and check fails without modifying it', (t) => {
  const root = fixture(t);
  initTask(root, 'task', seed);
  writeFileSync(join(root, 'spec.md'), 'Manual accepted change\n');
  const before = readFileSync(statePath(root));
  const state = loadTask(root, 'task');
  assert.ok(state.stale.includes('spec'));
  assert.equal(state.validForCompletion, false);
  assert.equal(cli(root, ['check', 'task']).status, 1);
  assert.deepEqual(readFileSync(statePath(root)), before);
  assert.equal(readFileSync(join(root, 'spec.md'), 'utf8'), 'Manual accepted change\n');
});

function reviewed(root) {
  let state = initTask(root, 'task', seed);
  state = advance(root, state, 'ready');
  state = advance(root, state, 'implementation');
  state = advance(root, state, 'review');
  writeFileSync(join(root, 'result.txt'), 'Fixture test result\n');
  const evidence = [
    {
      kind: 'automated',
      method: 'Fixture verification',
      result: 'pass',
      fingerprint: state.fingerprint,
      artifacts: [fileReference(root, 'result.txt')],
    },
  ];
  return updateTask(root, 'task', state.token, { evidence });
}
test('acceptance needs explicit current input binding and passing evidence', (t) => {
  const root = fixture(t);
  let state = reviewed(root);
  assert.throws(() => advance(root, state, 'accepted'), /Acceptance/);
  assert.throws(
    () =>
      advance(root, state, 'accepted', {
        acceptance: { by: 'Fixture owner', note: 'Fixture approval', fingerprint: '0'.repeat(64) },
      }),
    /Acceptance/,
  );
  state = advance(root, state, 'accepted', {
    acceptance: { by: 'Fixture owner', note: 'Fixture approval', fingerprint: state.fingerprint },
  });
  assert.equal(state.validForCompletion, true);
});

test('refresh of changed input preserves old evidence and withdraws stale acceptance', (t) => {
  const root = fixture(t);
  let state = reviewed(root);
  state = advance(root, state, 'accepted', {
    acceptance: { by: 'Fixture owner', note: 'Fixture approval', fingerprint: state.fingerprint },
  });
  const oldEvidence = state.state.evidence;
  writeFileSync(join(root, 'input.txt'), 'A new implementation\n');
  assert.equal(loadTask(root, 'task').validForCompletion, false);
  state = updateTask(root, 'task', state.token, {}, true);
  assert.equal(state.state.status, 'review');
  assert.equal(state.state.acceptance, null);
  assert.deepEqual(state.state.evidence, oldEvidence);
  assert.ok(state.stale.some((x) => x.includes('different input')));
  assert.equal(state.validForCompletion, false);
});

test('artifact changes invalidate completion even if implementation did not change', (t) => {
  const root = fixture(t);
  let state = reviewed(root);
  state = advance(root, state, 'accepted', {
    acceptance: { by: 'Fixture owner', note: 'Fixture approval', fingerprint: state.fingerprint },
  });
  assert.equal(state.validForCompletion, true);
  writeFileSync(join(root, 'result.txt'), 'Different evidence');
  assert.equal(loadTask(root, 'task').validForCompletion, false);
  assert.equal(cli(root, ['check', 'task']).status, 1);
});

test('Git revision changes are detected independently from file hashes', (t) => {
  const root = fixture(t);
  const state = initTask(root, 'task', seed);
  execFileSync('git', [
    '-C',
    root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit',
    '--quiet',
    '--allow-empty',
    '-m',
    'new revision',
  ]);
  assert.ok(loadTask(root, 'task').stale.includes('sourceCommit'));
  const refreshed = updateTask(root, 'task', state.token, {}, true);
  assert.notEqual(refreshed.state.sourceCommit, state.state.sourceCommit);
  assert.deepEqual(refreshed.stale, []);
});

test('a held writer lock prevents updates without deleting another process lock', (t) => {
  const root = fixture(t);
  const state = initTask(root, 'task', seed);
  const lock = join(root, '.local/tasks/task/write.lock');
  writeFileSync(lock, 'held by another process');
  assert.throws(() => updateTask(root, 'task', state.token, { nextStep: 'A change' }), /EEXIST/);
  assert.equal(readFileSync(lock, 'utf8'), 'held by another process');
  assert.equal(loadTask(root, 'task').token, state.token);
});

test(
  'two processes updating the same token cannot both overwrite the state',
  { timeout: 15000 },
  async (t) => {
    const root = fixture(t);
    const state = initTask(root, 'task', seed);
    writeFileSync(join(root, 'patch.json'), JSON.stringify({ nextStep: 'Concurrent change' }));
    const run = () =>
      new Promise((resolveResult, reject) => {
        const child = spawn(process.execPath, [
          script,
          'update',
          'task',
          '--root',
          root,
          '--expect',
          state.token,
          '--patch',
          'patch.json',
        ]);
        child.stdout.resume();
        child.stderr.resume();
        child.on('error', reject);
        child.on('exit', resolveResult);
      });
    const codes = await Promise.all([run(), run()]);
    assert.deepEqual(codes.sort(), [0, 1]);
    assert.equal(loadTask(root, 'task').state.revision, 2);
  },
);

test('CLI rejects wrong options and unsafe IDs without creating task data', (t) => {
  const root = fixture(t);
  assert.equal(cli(root, ['init', '../bad']).status, 1);
  assert.equal(cli(root, ['init', 'task', '--expect', '0'.repeat(64)]).status, 1);
  assert.equal(existsSync(join(root, '.local/tasks/task')), false);
  const result = cli(root, ['init', 'task']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fingerprint(JSON.parse(result.stdout).state), JSON.parse(result.stdout).fingerprint);
});

test('schema rejects malformed manual state without rewriting it', (t) => {
  const root = fixture(t);
  const initial = initTask(root, 'task', seed).state;
  for (const patch of [
    { schemaVersion: 2 },
    { revision: 'two' },
    { revision: Number.MAX_SAFE_INTEGER + 1 },
    { updatedAt: '2026-99-99T00:00:00.000Z' },
    { title: '   ' },
    { evidence: [{}] },
  ]) {
    const raw = JSON.stringify({ ...initial, ...patch });
    writeFileSync(statePath(root), raw);
    assert.equal(cli(root, ['check', 'task']).status, 1);
    assert.equal(readFileSync(statePath(root), 'utf8'), raw);
  }
});

test('failed and unperformed checks cannot support an acceptance record', (t) => {
  const root = fixture(t);
  let state = reviewed(root);
  for (const result of ['fail', 'not-run']) {
    state = updateTask(root, 'task', state.token, {
      evidence: [{ ...state.state.evidence[0], result }],
    });
    assert.throws(
      () =>
        advance(root, state, 'accepted', {
          acceptance: {
            by: 'Fixture owner',
            note: 'Fixture approval',
            fingerprint: state.fingerprint,
          },
        }),
      /passing evidence/,
    );
  }
});

test('missing artifacts or Spec never get silently recreated by resume or refresh', (t) => {
  const root = fixture(t);
  const state = reviewed(root);
  rmSync(join(root, 'spec.md'));
  const before = readFileSync(statePath(root));
  const resumed = loadTask(root, 'task');
  assert.ok(resumed.stale.some((x) => x.startsWith('spec')));
  assert.throws(() => updateTask(root, 'task', state.token, {}, true), /ENOENT/);
  assert.deepEqual(readFileSync(statePath(root)), before);
  assert.equal(existsSync(join(root, 'spec.md')), false);
});

test('resume discovers the Git root from a subdirectory without root options', (t) => {
  const root = fixture(t);
  initTask(root, 'task', seed);
  mkdirSync(join(root, 'sub'));
  const result = spawnSync(process.execPath, [script, 'resume', 'task'], {
    cwd: join(root, 'sub'),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).state.scope.summary, seed.scope.summary);
});

test('unsupported schema keywords stop the CLI before writing task data', (t) => {
  const root = fixture(t);
  const moduleDir = join(root, 'scripts/environment');
  const schemaDir = join(root, 'docs/environment/schemas');
  mkdirSync(moduleDir, { recursive: true });
  mkdirSync(schemaDir, { recursive: true });
  writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module' }));
  writeFileSync(join(moduleDir, 'task-state.js'), readFileSync(script));
  const schema = JSON.parse(
    readFileSync('docs/environment/schemas/task-state.schema.json', 'utf8'),
  );
  schema.properties.title.format = 'email';
  writeFileSync(join(schemaDir, 'task-state.schema.json'), JSON.stringify(schema));
  const result = spawnSync(
    process.execPath,
    [join(moduleDir, 'task-state.js'), 'init', 'task', '--root', root],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unsupported schema keyword: format/);
  assert.equal(existsSync(join(root, '.local')), false);
});

test('ref returns the content-bound reference without creating task storage', (t) => {
  const root = fixture(t);
  const result = cli(root, ['ref', 'spec.md']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), fileReference(root, 'spec.md'));
  assert.equal(existsSync(join(root, '.local')), false);
  assert.equal(cli(root, ['ref', '../outside']).status, 1);
});
