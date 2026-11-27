import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(resolve(root, 'package.json'));
const packages = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')).packages;

test('no vulnerable minimatch 7–10 or incompatible legacy glob survives resolution', () => {
  for (const [path, metadata] of Object.entries(packages)) {
    const major = Number(metadata.version?.split('.')[0]);
    if (path.endsWith('/minimatch')) assert.ok(major < 7 || major >= 11, path);
    if (
      path.endsWith('/glob') &&
      metadata.name !== '@bundled-es-modules/glob' &&
      !path.endsWith('/@bundled-es-modules/glob')
    ) {
      assert.ok(major < 10 || major >= 14, path);
    }
  }
});

test('every installed brace-expansion retains nested and numeric expansion', () => {
  const copies = Object.entries(packages).filter(([path]) => path.endsWith('/brace-expansion'));
  assert.ok(copies.length > 0);
  for (const [path, metadata] of copies) {
    const localRequire = createRequire(resolve(root, path, '../consumer.cjs'));
    const module = localRequire('brace-expansion');
    const expand = typeof module === 'function' ? module : module.expand;
    assert.deepEqual(
      expand('src/{button,input-{text,password}}/{1..2}.tsx'),
      [
        'src/button/1.tsx',
        'src/button/2.tsx',
        'src/input-text/1.tsx',
        'src/input-text/2.tsx',
        'src/input-password/1.tsx',
        'src/input-password/2.tsx',
      ],
      `${path}@${metadata.version}`,
    );
  }
});

test('glob consumers find nested stories and respect ignore patterns in sync and async modes', async () => {
  const cwd = mkdtempSync(resolve(tmpdir(), 'ds-glob-'));
  try {
    for (const name of [
      'src/Button/Button.stories.tsx',
      'src/Input/nested/Input.stories.ts',
      'src/Button/Button.tsx',
      'src/ignored/Hidden.stories.tsx',
      '.hidden/Hidden.stories.tsx',
    ]) {
      const path = resolve(cwd, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, '');
    }
    const expected = ['src/Button/Button.stories.tsx', 'src/Input/nested/Input.stories.ts'];
    for (const parent of [
      '@figma/code-connect',
      '@joshwooding/vite-plugin-react-docgen-typescript',
      '@bundled-es-modules/glob',
    ]) {
      const caller = createRequire(require.resolve(parent));
      const { globSync, glob, Glob } = caller('glob');
      const options = { cwd, ignore: ['**/ignored/**'] };
      const pattern = 'src/**/+(Button|Input).stories.{ts,tsx}';
      assert.deepEqual(globSync(pattern, options).sort(), expected, parent + ' sync');
      assert.deepEqual((await glob(pattern, options)).sort(), expected, parent + ' async');
      assert.deepEqual(
        [...new Glob(pattern, options).iterateSync()].sort(),
        expected,
        parent + ' iterator',
      );
      assert.deepEqual(
        globSync('**/*.stories.{ts,tsx}', options).sort(),
        expected,
        parent + ' ignore',
      );
    }
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('direct minimatch consumers preserve package, attribute and story matching', () => {
  for (const [path, metadata] of Object.entries(packages)) {
    if (!metadata.dependencies?.minimatch || metadata.dependencies.minimatch.startsWith('^3.'))
      continue;
    const caller = createRequire(resolve(root, path, 'consumer.cjs'));
    const { minimatch, Minimatch } = caller('minimatch');
    assert.equal(minimatch('@scope/button', '@scope/*'), true, path);
    assert.equal(minimatch('data-testid', 'data-*'), true, path);
    assert.equal(
      minimatch('Input.stories.tsx', '**/*.stories.@(ts|tsx)', { matchBase: true }),
      true,
      path,
    );
    assert.equal(
      new Minimatch('**/*.{ts,tsx}', { dot: false }).match('src/.private.ts'),
      false,
      path,
    );
    assert.equal(new Minimatch('**/*.{ts,tsx}').match('src/Button.tsx'), true, path);
  }
});

test('Storybook Actions emits valid unique UUIDs and preserves payloads through both module entry points', async () => {
  const caller = createRequire(require.resolve('@storybook/addon-actions'));
  const uuid = caller('uuid');
  const { addons } = require('storybook/internal/preview-api');
  const previousChannel = addons.getChannel();
  const events = [];
  assert.equal(typeof globalThis.crypto.getRandomValues, 'function');
  addons.setChannel({ emit: (...event) => events.push(event) });
  try {
    const modules = [require('@storybook/addon-actions'), await import('@storybook/addon-actions')];
    for (const { action, EVENT_ID } of modules) {
      const handler = action('password-change');
      assert.equal(handler.isAction, true);
      handler({ value: 'example' }, 42);
      const [type, display] = events.at(-1);
      assert.equal(type, EVENT_ID);
      assert.equal(uuid.validate(display.id), true);
      assert.equal(uuid.version(display.id), 4);
      assert.deepEqual(display.data, { name: 'password-change', args: [{ value: 'example' }, 42] });
    }
    assert.equal(new Set(events.map(([, display]) => display.id)).size, 2);
    assert.throws(() => uuid.v5('example', uuid.v5.DNS, new Uint8Array(1)));
  } finally {
    addons.setChannel(previousChannel);
  }
});
