import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { createCatalog, findReferences, resolveValue } from '../foundations-catalog.js';

test('usage scan distinguishes exact bracket access, dynamic paths and CSS template references', () => {
  const refs = findReferences(
    `
    // theme.colors.fake.value must not count
    const a = theme.spacing.height['2xSmall'];
    const b = theme.colors.button[appearance].background.enabled;
    const c = css\`color: var(--colors-text-base); padding: \${gap}; background: var(--colors-background-global-calm);\`;
  `,
    'fixture.tsx',
  );
  assert.ok(refs.some((r) => r.path?.join('.') === 'spacing.height.2xSmall'));
  assert.ok(refs.some((r) => r.path?.join('.') === 'colors.button.*.background.enabled'));
  assert.ok(refs.some((r) => r.cssVar === '--colors-text-base'));
  assert.ok(refs.some((r) => r.cssVar === '--colors-background-global-calm'));
  assert.ok(!refs.some((r) => r.path?.includes('fake')));
});

test('alias resolution rejects missing references and cycles rather than displaying false values', () => {
  const tokens = new Map([
    ['a', { raw: '{b}' }],
    ['b', { raw: 8 }],
  ]);
  assert.equal(resolveValue('{a}', tokens), 8);
  assert.throws(() => resolveValue('{missing}', tokens), /Unknown token alias/);
  tokens.set('b', { raw: '{a}' });
  assert.throws(() => resolveValue('{a}', tokens), /Circular token alias/);
});

test('every catalog token exists in generated CSS; only implementation references drive the audit', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const catalog = await createCatalog(root);
  const css = await readFile(
    new URL('../../src/theme/variables.light.css', import.meta.url),
    'utf8',
  );
  for (const token of catalog.tokens) {
    assert.ok(css.includes(`${token.cssVar}:`), `Missing CSS variable: ${token.id}`);
    for (const ref of [...token.direct, ...token.candidates]) {
      assert.match(ref.file, /^src\/(components|layouts)\//);
      assert.doesNotMatch(ref.file, /\.(stories|test|figma)\./);
    }
  }
  const modal = catalog.tokens.find((t) => t.id === 'effects.overlay.modal');
  assert.ok(modal.direct.some((ref) => ref.file.endsWith('/modal/Modal.tsx')));
  const unused = catalog.tokens.find((t) => t.id === 'effects.soft.medium');
  assert.equal(unused.direct.length + unused.candidates.length, 0);
  const usedPrimitive = catalog.tokens.find((t) => t.id === 'spacers.8');
  assert.ok(usedPrimitive.dependencies.includes('borderRadius.componentBase'));
});
