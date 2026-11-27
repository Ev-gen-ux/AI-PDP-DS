import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildPlan, parseOptions, executePlan } from '../component-quality.js';

function fixture(t, withTest = true) {
  const root = mkdtempSync(join(tmpdir(), 'ds-component-quality-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, text = '') => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  put('src/components/button/Button.tsx', 'export const Button = () => null;');
  put('src/components/button/Button.stories.tsx');
  put('src/components/button/ButtonCodeConnect.figma.ts');
  put('src/components/button/index.ts');
  if (withTest) put('src/components/button/Button.test.tsx');
  put('src/components/button-icon/ButtonIcon.test.tsx');
  put('docs/button-component-spec.md', '[Source](../src/components/button/Button.tsx)');
  return root;
}

test('invalid arguments never fall back to the full pipeline; no-argument full plan retains existing order', () => {
  for (const args of [
    ['--wat'],
    ['--component', '../button', '--change', 'logic'],
    ['--change', 'docs'],
    ['--component', 'Button'],
    ['--component', 'Button', '--change', 'all'],
  ]) {
    assert.throws(() => parseOptions(args));
  }
  assert.deepEqual(
    buildPlan('.', parseOptions([])).checks.map((c) => c.name),
    [
      'env:check',
      'tokens:build',
      'typecheck',
      'lint',
      'format:check',
      'test:coverage',
      'test:tooling',
      'build',
      'package:check',
      'storybook:build',
      'figma:check',
    ],
  );
});

test('canonical component-specs contract takes precedence while legacy docs remain a migration fallback', (t) => {
  const root = fixture(t);
  assert.equal(
    buildPlan(root, { component: 'Button', change: 'docs' }).resources.spec,
    'docs/button-component-spec.md',
  );
  mkdirSync(join(root, 'component-specs/button'), { recursive: true });
  writeFileSync(join(root, 'component-specs/button/spec.md'), '# Current canonical contract\n');
  assert.equal(
    buildPlan(root, { component: 'Button', change: 'docs' }).resources.spec,
    'component-specs/button/spec.md',
  );
});

test('plans find existing materials, isolate documentation and distinguish visual review from unit checks', (t) => {
  const root = fixture(t);
  assert.throws(
    () => buildPlan(root, { component: 'Unknown', change: 'docs' }),
    /Unknown component/,
  );
  const docs = buildPlan(root, { component: 'button', change: 'docs' });
  assert.deepEqual(
    docs.checks.map((c) => c.name),
    ['format', 'links'],
  );
  assert.deepEqual(docs.resources.mappings, ['src/components/button/ButtonCodeConnect.figma.ts']);
  const logic = buildPlan(root, { component: 'Button', change: 'logic' });
  const unit = logic.checks.find((c) => c.name === 'test');
  assert.deepEqual(unit.args, [
    'scripts/component-test.js',
    'src/components/button/Button.test.tsx',
  ]);
  assert.ok(!JSON.stringify(logic).includes('ButtonIcon.test'));
  const visual = buildPlan(root, { component: 'Button', change: 'visual' });
  assert.ok(!visual.checks.some((c) => c.name === 'test'));
  assert.ok(visual.manual.some((c) => c.name === 'Visual and themes' && c.status === 'not-run'));
});

test('missing tests or Spec cannot silently become an acceptance result', (t) => {
  const root = fixture(t, false);
  let plan = buildPlan(root, { component: 'Button', change: 'logic' });
  assert.ok(plan.manual.some((c) => c.name === 'Regression' && c.status === 'not-run'));
  rmSync(join(root, 'docs/button-component-spec.md'));
  assert.throws(
    () => buildPlan(root, { component: 'Button', change: 'docs' }),
    /No canonical Spec/,
  );
  plan = buildPlan(root, { component: 'Button', change: 'logic' });
  assert.ok(plan.manual.some((c) => c.name === 'Spec' && c.status === 'not-run'));
});

test('command failures, spawn errors and broken links are retained while later checks still run', (t) => {
  const root = fixture(t);
  const plan = buildPlan(root, { component: 'Button', change: 'docs' });
  let result = executePlan(root, plan, () => ({ status: 2, stderr: 'bad format' }));
  assert.equal(result[0].passed, false);
  assert.equal(result[0].exitCode, 2);
  assert.match(result[0].output, /bad format/);
  assert.equal(result[1].passed, true);
  writeFileSync(join(root, plan.resources.spec), '[Broken](missing.md)');
  result = executePlan(root, plan, () => {
    throw new Error('cannot spawn');
  });
  assert.equal(result[0].exitCode, null);
  assert.match(result[0].output, /cannot spawn/);
  assert.equal(result[1].passed, false);
  assert.match(result[1].output, /Missing/);
});

test('CLI plan and invalid options leave existing full report and coverage untouched', (t) => {
  const root = fixture(t);
  for (const path of ['.local/quality/report.json', 'coverage/test-results.json']) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), 'sentinel');
  }
  const cli = resolve('scripts/quality-report.js');
  const run = (args) =>
    spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8' });
  const planned = run(['--component', 'Button', '--change', 'logic', '--plan']);
  assert.equal(planned.status, 0, planned.stderr);
  assert.equal(JSON.parse(planned.stdout).component, 'Button');
  assert.equal(run(['--unknown']).status, 1);
  assert.equal(run(['--component', 'Missing', '--change', 'logic']).status, 1);
  assert.equal(readFileSync(join(root, '.local/quality/report.json'), 'utf8'), 'sentinel');
  assert.equal(readFileSync(join(root, 'coverage/test-results.json'), 'utf8'), 'sentinel');
  assert.ok(!existsSync(join(root, '.local/quality/components')));
  // A real failed check (missing local formatter in this fixture) must produce a failed
  // component report and exit code, while retaining the full report and old coverage.
  const failed = run(['--component', 'Button', '--change', 'docs']);
  assert.equal(failed.status, 1, failed.stderr);
  const report = JSON.parse(
    readFileSync(join(root, '.local/quality/components/button/docs/report.json'), 'utf8'),
  );
  assert.equal(report.passed, false);
  assert.equal(report.acceptance, 'not-reviewed');
  assert.ok(report.results.some((r) => !r.passed));
  assert.ok(report.manual.every((r) => r.status === 'not-run'));
  assert.equal(readFileSync(join(root, '.local/quality/report.json'), 'utf8'), 'sentinel');
  assert.equal(readFileSync(join(root, 'coverage/test-results.json'), 'utf8'), 'sentinel');
});

test('unit launcher propagates a test failure and excludes similarly named files', (t) => {
  const root = fixture(t);
  writeFileSync(
    join(root, 'src/components/button/Button.test.tsx'),
    "throw new Error('expected selected failure');",
  );
  writeFileSync(
    join(root, 'src/components/button/ButtonExtra.test.tsx'),
    "import { writeFileSync } from 'node:fs'; writeFileSync('wrong-test-ran', 'bad'); throw new Error('wrong selection');",
  );
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/component-test.js'), 'src/components/button/Button.test.tsx'],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /expected selected failure/);
  assert.ok(!existsSync(join(root, 'wrong-test-ran')));
});
