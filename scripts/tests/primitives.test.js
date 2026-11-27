import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  cpSync,
  existsSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { primitivePlan, applyPrimitives } from '../environment/primitives.js';
import { createProject } from '../environment/projects.js';
import { installTooling } from '../environment/tooling.js';
import { routeRequest } from '../environment/request-route.js';

const factory = process.cwd();
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-primitives-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), JSON.stringify(value, null, 2) + '\n');
  };
  write('system.json', { schemaVersion: 1, id: 'test', displayName: 'Test' });
  write('tokens/primitives/base.json', {
    palette: { blue: { $type: 'color', $value: '#123456' } },
    spacers: { 8: { $type: 'number', $value: 8 } },
    font: { $type: 'fontFamily', $value: 'Original' },
    derived: { $type: 'number', $value: '{spacers.8}' },
  });
  write('tokens/semantic/light.json', {
    border: { $type: 'color', $value: '{palette.blue}' },
    radius: { $type: 'number', $value: '{derived}' },
    radiusAlias: { $type: 'number', $value: '{radius}' },
    body: { $type: 'fontFamily', $value: '{font}' },
  });
  return { root, write };
}
const proposal = {
  values: { 'palette.blue': '#abcdef', 'spacers.8': 10, font: 'Customer Typeface' },
  sources: { font: 'customer/fonts/spec.txt' },
  fonts: [{ family: 'Customer Typeface', source: 'client', reference: 'customer/font.woff2' }],
};

test('read-only matrix and plan expose aliases, retained defaults and static consumers', (t) => {
  const { root } = fixture(t);
  const before = readFileSync(join(root, 'tokens/primitives/base.json'));
  const baseline = primitivePlan(root);
  assert.equal(baseline.changes.length, 0);
  assert.equal(baseline.rows.find((r) => r.key === 'font').decision, 'retain-baseline');
  const derived = baseline.rows.find((r) => r.key === 'derived');
  assert.equal(derived.editable, false);
  assert.deepEqual(derived.aliasChain, ['spacers.8']);
  assert.equal(derived.resolved, 8);
  const plan = primitivePlan(root, proposal);
  assert.equal(plan.changes.length, 3);
  const spacing = plan.changes.find((r) => r.key === 'spacers.8');
  assert.equal(spacing.numericNameMismatch, true);
  assert.deepEqual(spacing.aliases, ['derived']);
  assert.deepEqual(
    spacing.consumers.map((r) => r.key),
    ['radius', 'radiusAlias'],
  );
  assert.deepEqual(readFileSync(join(root, 'tokens/primitives/base.json')), before);
  assert.equal(existsSync(join(root, 'tokens/.primitives.lock')), false);
});

test('apply modifies only approved leaf values, preserving aliases and semantic file bytes', (t) => {
  const { root } = fixture(t);
  const before = JSON.parse(readFileSync(join(root, 'tokens/primitives/base.json')));
  const semantic = readFileSync(join(root, 'tokens/semantic/light.json'));
  const plan = primitivePlan(root, proposal);
  const result = applyPrimitives(root, proposal, plan.fingerprint, 'Owner approved this plan');
  const expected = structuredClone(before);
  expected.palette.blue.$value = '#abcdef';
  expected.spacers[8].$value = 10;
  expected.font.$value = 'Customer Typeface';
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'tokens/primitives/base.json'))), expected);
  assert.deepEqual(readFileSync(join(root, 'tokens/semantic/light.json')), semantic);
  assert.equal(result.aliasesUnchanged, true);
  assert.equal(primitivePlan(root, proposal).changes.length, 0);
  assert.equal(existsSync(join(root, 'tokens/.primitives.lock')), false);
});

test('impact follows cross-file semantic chains and preserves candidates from repeated mode keys', (t) => {
  const { root, write } = fixture(t);
  write('tokens/semantic/component.json', {
    input: { padding: { $type: 'number', $value: '{radiusAlias}' } },
  });
  write('tokens/semantic/dark.json', {
    radiusAlias: { $type: 'number', $value: '{derived}' },
  });
  const plan = primitivePlan(root, { values: { 'spacers.8': 12 } });
  const consumers = plan.changes[0].consumers;
  assert.ok(consumers.some((r) => r.key === 'input.padding' && r.file.endsWith('component.json')));
  assert.equal(consumers.filter((r) => r.key === 'radiusAlias').length, 2);
});

test('invalid keys, aliases, type changes and invalid HEX cannot mutate tokens', (t) => {
  const { root } = fixture(t);
  const before = readFileSync(join(root, 'tokens/primitives/base.json'));
  for (const values of [
    { derived: 12 },
    { border: '#000' },
    { 'palette.blue': 'red' },
    { 'spacers.8': '12px' },
    { font: '{spacers.8}' },
    { unknown: 4 },
    { 'palette.blue': '#12345' },
  ]) {
    assert.throws(() => primitivePlan(root, { values }), /Unknown|Read-only|Invalid/);
  }
  assert.throws(() => primitivePlan(root, { values: {}, semantics: {} }), /Expected request/);
  assert.throws(
    () => primitivePlan(root, { values: {}, fonts: [{ family: 'Inter', source: 'guessed' }] }),
    /Fonts require/,
  );
  assert.deepEqual(readFileSync(join(root, 'tokens/primitives/base.json')), before);
});

test('source or proposal changes invalidate approval; foreign lock is preserved', (t) => {
  const { root } = fixture(t);
  const plan = primitivePlan(root, proposal);
  assert.throws(
    () => applyPrimitives(root, { values: { font: 'Other' } }, plan.fingerprint, 'Approved'),
    /Stale/,
  );
  writeFileSync(join(root, 'tokens/semantic/light.json'), '{}\n');
  assert.throws(() => applyPrimitives(root, proposal, plan.fingerprint, 'Approved'), /Stale/);
  assert.throws(
    () => applyPrimitives(root, proposal, primitivePlan(root, proposal).fingerprint, ''),
    /approval/,
  );
  writeFileSync(join(root, 'tokens/.primitives.lock'), 'another writer');
  assert.throws(() => applyPrimitives(root, proposal, plan.fingerprint, 'Approved'), /EEXIST/);
  assert.equal(readFileSync(join(root, 'tokens/.primitives.lock'), 'utf8'), 'another writer');
});

test('primitive alias cycles, missing targets, duplicate keys and symlinks fail closed', (t) => {
  for (const kind of ['cycle', 'missing', 'duplicate', 'symlink']) {
    const { root, write } = fixture(t);
    if (kind === 'cycle')
      write('tokens/primitives/extra.json', { cycle: { $type: 'number', $value: '{cycle}' } });
    if (kind === 'missing')
      write('tokens/primitives/extra.json', { invalid: { $type: 'number', $value: '{absent}' } });
    if (kind === 'duplicate')
      write('tokens/primitives/extra.json', { font: { $type: 'string', $value: 'Other' } });
    if (kind === 'symlink')
      symlinkSync(join(root, 'system.json'), join(root, 'tokens/primitives/extra.json'));
    assert.throws(() => primitivePlan(root), /cycle|Unknown primitive alias|Duplicate|symlink/);
  }
});

test('new projects receive the delivery and typography brief before technical setup', (t) => {
  const { root } = fixture(t);
  cpSync(join(factory, 'templates'), join(root, 'templates'), { recursive: true });
  const project = createProject(root, 'new-bank');
  const brief = readFileSync(join(project.root, 'product-discovery/brief.md'), 'utf8');
  assert.match(brief, /storybook \/ figma \/ both/);
  assert.match(brief, /Google Fonts/);
  assert.match(brief, /<!-- BRIEF:DRAFT -->/);
  assert.match(brief, /new-bank/);
  assert.equal(brief.includes('{{id}}'), false);
  assert.equal(existsSync(join(project.root, 'src')), false);
  assert.equal(existsSync(join(project.root, 'package.json')), false);
  const book = join(root, 'templates/specifications.md');
  writeFileSync(book, readFileSync(book, 'utf8').replace('<!-- BRIEF:DRAFT -->', ''));
  assert.throws(() => createProject(root, 'invalid-bank'), /draft marker/);
  assert.equal(existsSync(join(root, 'projects/invalid-bank')), false);
});

test('managed primitive command works detached, requires project scope and rejects unsafe input', (t) => {
  const { root, write } = fixture(t);
  installTooling(factory, root);
  write('product-discovery/request.json', proposal);
  const run = (args) =>
    spawnSync(process.execPath, [join(root, 'scripts/environment/primitives.js'), ...args], {
      cwd: root,
      encoding: 'utf8',
    });
  const result = run(['plan', '--input', 'product-discovery/request.json']);
  assert.equal(result.status, 0, result.stderr);
  const fingerprint = JSON.parse(result.stdout).fingerprint;
  const applied = run([
    'apply',
    '--input',
    'product-discovery/request.json',
    '--expect',
    fingerprint,
    '--note',
    'Owner approved',
  ]);
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(run(['plan', '--input', '../outside.json']).status, 1);
  assert.equal(run(['matrix', '--root', root, '--project', 'test']).status, 1);
  assert.equal(run(['matrix', '--root', factory]).status, 1);
});

test('existing foundation can be planned and changed on an isolated token copy', (t) => {
  const { root } = fixture(t);
  rmSync(join(root, 'tokens'), { recursive: true });
  cpSync(join(factory, 'projects/ai-pdp-ds/tokens'), join(root, 'tokens'), { recursive: true });
  const request = {
    values: {
      'palette.blue.500': '#AABBCC',
      'typographyBase.fontFamily.base': 'Customer Font, sans-serif',
    },
  };
  const plan = primitivePlan(root, request);
  assert.equal(plan.changes.length, 2);
  assert.ok(plan.changes[0].consumers.length > 0);
  const semantic = plan.sourceHashes.filter((r) => r.path.startsWith('tokens/semantic/'));
  applyPrimitives(root, request, plan.fingerprint, 'Fixture approval');
  assert.deepEqual(
    primitivePlan(root).sourceHashes.filter((r) => r.path.startsWith('tokens/semantic/')),
    semantic,
  );
});

test('primitive and font requests route to tokens without requiring Figma', () => {
  for (const request of [
    'Измени примитивы',
    'Настрой типографику',
    'Сменить шрифт',
    'Set primitive values',
    'Change font',
  ])
    assert.equal(routeRequest(request).object, 'tokens');
  for (const request of [
    'Создай новую дизайн-систему с типографикой заказчика',
    'Создай новую дизайн-систему с шрифтом Roboto',
    'Create a new design system with a customer font',
  ])
    assert.equal(routeRequest(request).object, 'system');
  assert.equal(routeRequest('Измени шрифт существующей дизайн-системы').object, 'tokens');
  assert.equal(
    routeRequest('Создай компонент InputPassword в дизайн-системе AI-PDP-DS').object,
    'component',
  );
  assert.equal(
    routeRequest('Create an Input component in the existing design system with a custom font')
      .object,
    'component',
  );
});
