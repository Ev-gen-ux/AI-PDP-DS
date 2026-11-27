import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  rmSync,
  symlinkSync,
  cpSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import {
  initJournal,
  findJournal,
  updateJournal,
  reference,
  parseJournal,
} from '../environment/journal.js';
import { projectContext } from '../environment/project.js';
import { createProject, runProject } from '../environment/projects.js';
import { routeRequest } from '../environment/request-route.js';

test('retired JSON task commands cannot create a second state store', (t) => {
  const p = fixture(t);
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/environment/journal.js'), 'legacy', 'init', 'old-task', '--root', p.root],
    { encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /retired/);
  assert.equal(existsSync(join(p.root, '.local')), false);
  assert.equal(existsSync(join(p.root, 'product-discovery')), false);
});

test('factory context requires explicit system selection for product tasks', (t) => {
  const p = fixture(t);
  writeFileSync(
    join(p.root, 'package.json'),
    JSON.stringify({ name: 'design-system-developer', private: true, type: 'module' }),
  );
  rmSync(join(p.root, 'system.json'));
  assert.equal(projectContext(p.root).environment, true);
  const script = resolve('scripts/environment/journal.js');
  const result = spawnSync(process.execPath, [script, 'init', 'unexpected', '--root', p.root], {
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(p.root, 'product-discovery')), false);
  const child = createProject(p.root, 'alpha');
  assert.equal(projectContext(p.root, 'alpha').root, child.root);
});

function fixture(t, id = 'alpha') {
  const root = mkdtempSync(join(tmpdir(), 'ds-journal-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(
    join(root, 'system.json'),
    JSON.stringify({ schemaVersion: 1, id, displayName: id }),
  );
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: id, type: 'module' }));
  return projectContext(root);
}
function edit(root, path, text) {
  writeFileSync(join(root, path), text);
}
function refresh(p, s) {
  return updateJournal(p.root, s.path, s.token, {}, 'refresh');
}
function ready(p, s) {
  edit(
    p.root,
    s.state.brief.path,
    '# Brief\n\nRepair the specific behavior; preserve unrelated API.\n',
  );
  s = refresh(p, s);
  return updateJournal(p.root, s.path, s.token, {
    title: 'Fixture work',
    scope: 'One fixture only',
    nextStep: 'Perform scoped change',
    status: 'ready',
  });
}
function review(p) {
  let s = ready(p, initJournal(p, 'repair', { component: 'button', action: 'repair' }));
  s = updateJournal(p.root, s.path, s.token, { status: 'implementation' });
  return updateJournal(p.root, s.path, s.token, { status: 'review' });
}

test('default task is Markdown STATE only and survives a detached folder copy', (t) => {
  const p = fixture(t);
  const s = initJournal(p, 'create-system');
  assert.equal(s.path, 'product-discovery/_process_log.md');
  assert.equal(s.state.title, null);
  assert.equal(existsSync(join(p.root, 'product-discovery/state.json')), false);
  assert.equal(existsSync(join(p.root, '.git')), false);
  const copied = fixture(t, 'other');
  cpSync(p.root, copied.root, { recursive: true });
  const restored = findJournal(copied.root, 'create-system');
  assert.equal(restored.token, s.token);
  assert.equal(restored.state.system, 'alpha');
});

test('component specifications are siblings of discovery; later tasks preserve canonical spec', (t) => {
  const p = fixture(t),
    first = initJournal(p, 'create-password', { component: 'input-password' });
  assert.equal(first.path, 'component-specs/input-password/_process_log.md');
  assert.equal(first.state.spec.path, 'component-specs/input-password/spec.md');
  const bytes = readFileSync(join(p.root, first.state.spec.path));
  const repair = initJournal(p, 'repair-password', {
    component: 'input-password',
    action: 'repair',
  });
  assert.equal(repair.path, 'component-specs/input-password/tasks/repair-password/_process_log.md');
  assert.deepEqual(readFileSync(join(p.root, first.state.spec.path)), bytes);
  assert.throws(
    () => initJournal(p, 'create-password', { component: 'another' }),
    /already exists/,
  );
  assert.equal(existsSync(join(p.root, 'component-specs/another')), false);
});

test('invalid task metadata, ID and symlink destinations write no task files', (t) => {
  const p = fixture(t);
  for (const [id, options] of [
    ['../bad', {}],
    ['bad', { title: {} }],
    ['bad', { surprise: true }],
    ['bad', { action: 'publish' }],
  ])
    assert.throws(() => initJournal(p, id, options));
  assert.equal(existsSync(join(p.root, 'product-discovery')), false);
  const outside = fixture(t, 'outside');
  symlinkSync(outside.root, join(p.root, 'component-specs'));
  assert.throws(() => initJournal(p, 'bad', { component: 'button' }), /symlink/);
  assert.equal(existsSync(join(outside.root, 'button')), false);
});

test('readiness rejects unknown scope, draft briefing and unsigned component contract', (t) => {
  const p = fixture(t);
  let s = initJournal(p, 'create', { component: 'button' });
  assert.throws(() => updateJournal(p.root, s.path, s.token, { status: 'ready' }), /not ready/);
  assert.throws(
    () =>
      updateJournal(p.root, s.path, s.token, {
        status: 'ready',
        title: 'Button',
        scope: 'New button',
        nextStep: 'Code',
      }),
    /brief/,
  );
  edit(p.root, s.state.brief.path, '# Brief\nCreate approved button only.\n');
  s = refresh(p, s);
  assert.throws(
    () =>
      updateJournal(p.root, s.path, s.token, {
        status: 'ready',
        title: 'Button',
        scope: 'New button',
        nextStep: 'Code',
      }),
    /Owner approval/,
  );
  assert.throws(
    () => updateJournal(p.root, s.path, s.token, { decisions: ['Owner approved'] }, 'approve-spec'),
    /specification first/,
  );
  edit(
    p.root,
    s.state.spec.path,
    '# Button\n## API\nText button.\n## States\nDefault, disabled.\n',
  );
  s = refresh(p, s);
  s = updateJournal(
    p.root,
    s.path,
    s.token,
    { decisions: ['Owner approved the specific fixture contract'] },
    'approve-spec',
  );
  s = updateJournal(p.root, s.path, s.token, {
    status: 'ready',
    title: 'Button',
    scope: 'New button',
    nextStep: 'Code',
  });
  assert.equal(s.state.status, 'ready');
});

test('optimistic locking preserves manual journal prose and rejects stale token', (t) => {
  const p = fixture(t);
  let s = initJournal(p, 'create-system');
  const full = join(p.root, s.path);
  writeFileSync(full, readFileSync(full, 'utf8') + '\nOwner note: preserve this exact sentence.\n');
  const before = readFileSync(full);
  assert.throws(() => updateJournal(p.root, s.path, s.token, { nextStep: 'Changed' }), /conflict/);
  assert.deepEqual(readFileSync(full), before);
  s = findJournal(p.root, 'create-system');
  s = updateJournal(p.root, s.path, s.token, { nextStep: 'Ask missing questions' });
  assert.match(readFileSync(full, 'utf8'), /Owner note: preserve this exact sentence/);
  assert.equal(readdirSync(join(p.root, 'product-discovery/history')).length, 1);
  writeFileSync(full + '.lock', 'other live lock');
  assert.throws(
    () => updateJournal(p.root, s.path, s.token, { nextStep: 'Do not overwrite' }),
    /EEXIST/,
  );
  assert.equal(readFileSync(full + '.lock', 'utf8'), 'other live lock');
});

test('failed/waived checks remain truthful and acceptance binds to current inputs', (t) => {
  const p = fixture(t);
  let s = review(p);
  const acceptance = {
    by: 'owner',
    note: 'Accepted fixture with explicit browser exception',
    fingerprint: s.fingerprint,
  };
  const evidence = [
    {
      kind: 'manual',
      criterion: 'browser',
      method: 'Not performed in fixture',
      result: 'not-run',
      fingerprint: s.fingerprint,
      artifacts: [],
    },
  ];
  assert.throws(
    () => updateJournal(p.root, s.path, s.token, { status: 'accepted', acceptance, evidence }),
    /Unresolved/,
  );
  s = updateJournal(p.root, s.path, s.token, {
    status: 'accepted',
    acceptance,
    evidence,
    exceptions: [
      {
        by: 'owner',
        criterion: 'browser',
        note: 'Explicit fixture waiver',
        fingerprint: s.fingerprint,
      },
    ],
  });
  assert.equal(s.validForCompletion, true);
  assert.equal(s.state.evidence[0].result, 'not-run');
  edit(p.root, s.state.brief.path, '# Changed scope\nDifferent required behavior.\n');
  assert.ok(findJournal(p.root, 'repair').stale.length);
  s = refresh(p, s);
  assert.equal(s.state.status, 'review');
  assert.equal(s.state.acceptance, null);
  assert.ok(s.stale.includes('evidence:browser'));
  assert.ok(s.stale.includes('exceptions'));
});

test('changed evidence artifacts invalidate accepted record without overwriting past revision', (t) => {
  const p = fixture(t);
  let s = review(p);
  edit(p.root, 'proof.txt', 'original proof');
  const artifact = reference(p.root, 'proof.txt');
  s = updateJournal(p.root, s.path, s.token, {
    status: 'accepted',
    acceptance: { by: 'owner', note: 'Accepted fixture', fingerprint: s.fingerprint },
    evidence: [
      {
        kind: 'automated',
        criterion: 'regression',
        method: 'Fixture demonstration',
        result: 'pass',
        fingerprint: s.fingerprint,
        artifacts: [artifact],
      },
    ],
  });
  edit(p.root, 'proof.txt', 'replaced proof');
  assert.ok(findJournal(p.root, 'repair').stale.includes('artifact:proof.txt'));
  assert.throws(() => updateJournal(p.root, s.path, s.token, { nextStep: 'Publish' }), /Stale/);
});

test('pause, cancellation and blocking are distinct from completion', (t) => {
  const p = fixture(t);
  let s = initJournal(p, 'create-system');
  assert.throws(() => updateJournal(p.root, s.path, s.token, { status: 'blocked' }), /reason/);
  s = updateJournal(p.root, s.path, s.token, { status: 'paused' });
  assert.equal(s.state.returnStatus, 'discovery');
  s = updateJournal(p.root, s.path, s.token, { status: 'cancelled' });
  assert.equal(s.validForCompletion, false);
  assert.throws(() => updateJournal(p.root, s.path, s.token, { status: 'accepted' }), /transition/);
});

test('historical acceptance stays readable when an input or proof was moved, without recreating files', (t) => {
  const p = fixture(t);
  let s = review(p);
  edit(p.root, 'proof.txt', 'historical proof');
  s = updateJournal(p.root, s.path, s.token, {
    status: 'accepted',
    acceptance: { by: 'owner', note: 'Accepted before migration', fingerprint: s.fingerprint },
    evidence: [
      {
        kind: 'manual',
        criterion: 'review',
        method: 'Fixture review',
        result: 'pass',
        fingerprint: s.fingerprint,
        artifacts: [reference(p.root, 'proof.txt')],
      },
    ],
  });
  const bytes = readFileSync(join(p.root, s.path));
  rmSync(join(p.root, 'proof.txt'));
  rmSync(join(p.root, s.state.brief.path));
  const resumed = findJournal(p.root, 'repair');
  assert.equal(resumed.state.acceptance.note, 'Accepted before migration');
  assert.equal(resumed.state.status, 'accepted');
  assert.equal(resumed.validForCompletion, false);
  assert.ok(resumed.stale.some((s) => s.includes('proof.txt')));
  assert.ok(resumed.stale.some((s) => s.includes('brief.md')));
  assert.deepEqual(readFileSync(join(p.root, s.path)), bytes);
  assert.equal(existsSync(join(p.root, 'proof.txt')), false);
});

test('quoted STATE markers in user text cannot corrupt the journal envelope', (t) => {
  const p = fixture(t);
  let s = initJournal(p, 'discuss-state', { title: 'Explain <!-- STATE:END -->' });
  assert.equal(s.state.title, 'Explain <!-- STATE:END -->');
  s = updateJournal(p.root, s.path, s.token, {
    decisions: ['Keep literal <!-- STATE:START --> as quoted data'],
  });
  assert.equal(s.state.decisions[0], 'Keep literal <!-- STATE:START --> as quoted data');
});

test('private/escaping evidence and duplicate STATE cannot be read as valid state', (t) => {
  const p = fixture(t);
  edit(p.root, '.env', 'private');
  assert.throws(() => reference(p.root, '.env'), /Private/);
  assert.throws(() => reference(p.root, '../outside'), /Unsafe/);
  const s = initJournal(p, 'create-system');
  const text = readFileSync(join(p.root, s.path), 'utf8');
  assert.throws(() => parseJournal(text + text), /exactly one/);
});

test('new system container exists before briefing and never creates external intake workspace', (t) => {
  const factory = fixture(t, 'factory');
  const result = createProject(factory.root, 'bank', 'Bank DS');
  assert.equal(result.task.path, 'product-discovery/_process_log.md');
  assert.equal(result.draftOnly, true);
  assert.equal(existsSync(join(factory.root, 'workspace')), false);
  assert.equal(existsSync(join(result.root, 'src')), false);
  assert.throws(() => createProject(factory.root, 'bank', 'Bank again'), /already exists/);
});

test('ambiguous system selection never defaults to first listed project', (t) => {
  const factory = fixture(t, 'factory');
  createProject(factory.root, 'one');
  createProject(factory.root, 'two');
  assert.equal(projectContext(factory.root, 'two').id, 'two');
  assert.throws(() => projectContext(factory.root, 'missing'), /Unknown system/);
});

test('ordinary request routing suggests a directive and preserves audit/cancel/scope boundaries', () => {
  assert.equal(routeRequest('Создадим новую дизайн-систему для банка').object, 'system');
  assert.equal(routeRequest('Исправь баг в InputPassword').action, 'repair');
  assert.equal(routeRequest('Проведи аудит Button').action, 'audit');
  assert.equal(routeRequest('Не делаем компонент').intent, 'cancel');
  assert.equal(routeRequest('Продолжай').requiresExistingTask, true);
  assert.equal(routeRequest('Создай иконки').deferredScope, true);
  assert.equal(routeRequest('Помоги пожалуйста').object, null);
});

test('default CLI uses journal and works without Git in a standalone project', (t) => {
  const p = fixture(t);
  const script = resolve('scripts/environment/journal.js');
  const run = (...args) =>
    spawnSync(process.execPath, [script, ...args, '--root', p.root], {
      cwd: p.root,
      encoding: 'utf8',
    });
  const init = run('init', 'create-system');
  assert.equal(init.status, 0, init.stderr);
  assert.equal(JSON.parse(run('resume', 'create-system').stdout).state.version, 2);
  assert.equal(JSON.parse(run('list').stdout).length, 1);
  assert.equal(existsSync(join(p.root, '.local/tasks/create-system/state.json')), false);
  const current = JSON.parse(run('resume', 'create-system').stdout);
  const updated = spawnSync(
    process.execPath,
    [
      script,
      'update',
      'create-system',
      '--root',
      p.root,
      '--expect',
      current.token,
      '--patch',
      '-',
    ],
    {
      cwd: p.root,
      encoding: 'utf8',
      input: JSON.stringify({ nextStep: 'Ask one missing question' }),
    },
  );
  assert.equal(updated.status, 0, updated.stderr);
  assert.equal(JSON.parse(updated.stdout).state.nextStep, 'Ask one missing question');
  const bad = run('init', 'other', '--unknown', 'x');
  assert.notEqual(bad.status, 0);
});

test('project journal engine closure can be copied without factory schemas or legacy modules', (t) => {
  const p = fixture(t);
  mkdirSync(join(p.root, 'scripts'));
  for (const file of ['journal.js', 'project.js'])
    cpSync(resolve('scripts/environment', file), join(p.root, 'scripts', file));
  writeFileSync(join(p.root, 'scripts/task.js'), "import {main} from './journal.js'; main();\n");
  const result = spawnSync(
    process.execPath,
    ['scripts/task.js', 'init', 'create-system', '--root', p.root],
    { cwd: p.root, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).state.version, 2);
});

test('formatting a versioned journal does not corrupt machine state or token semantics', (t) => {
  const p = fixture(t);
  const s = initJournal(p, 'create-system');
  const formatter = resolve('node_modules/prettier/bin/prettier.cjs');
  const output = spawnSync(process.execPath, [formatter, '--write', join(p.root, s.path)], {
    cwd: p.root,
    encoding: 'utf8',
  });
  assert.equal(output.status, 0, output.stderr);
  const parsed = findJournal(p.root, 'create-system');
  assert.deepEqual(parsed.state, s.state);
});

test('concurrent journal writers cannot both replace the same revision', async (t) => {
  const p = fixture(t);
  const s = initJournal(p, 'create-system');
  edit(p.root, 'patch.json', JSON.stringify({ nextStep: 'Ask the remaining question' }));
  const script = resolve('scripts/environment/journal.js');
  const run = () =>
    new Promise((resolveResult, reject) => {
      const child = spawn(process.execPath, [
        script,
        'update',
        'create-system',
        '--root',
        p.root,
        '--expect',
        s.token,
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
  assert.equal(findJournal(p.root, 'create-system').state.revision, 2);
});

test('system dispatcher runs only the selected local script in the selected project', (t) => {
  const p = fixture(t);
  edit(
    p.root,
    'package.json',
    JSON.stringify({ name: 'alpha', scripts: { build: 'node build.cjs' } }),
  );
  edit(p.root, 'build.cjs', "require('node:fs').writeFileSync('built.txt',process.cwd());\n");
  const result = runProject(p, 'build');
  assert.equal(result.passed, true);
  assert.equal(readFileSync(join(p.root, 'built.txt'), 'utf8'), p.root);
  assert.throws(() => runProject(p, 'publish'), /Unknown local/);
  edit(p.root, 'build.cjs', 'process.exit(7);\n');
  assert.throws(() => runProject(p, 'build'), /failed: 7/);
});
