import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(resolve(root, 'package.json'));
const packages = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8')).packages;

test('every installed brace-expansion retains nested and numeric expansion', () => {
  const copies = Object.entries(packages).filter(([path]) => path.endsWith('/brace-expansion'));
  assert.ok(copies.length > 0);
  for (const [path, metadata] of copies) {
    const localRequire = createRequire(resolve(root, path, '../consumer.cjs'));
    const module = localRequire('brace-expansion');
    const expand = typeof module === 'function' ? module : module.expand;
    assert.deepEqual(expand('src/{button,input-{text,password}}/{1..2}.tsx'), [
      'src/button/1.tsx', 'src/button/2.tsx',
      'src/input-text/1.tsx', 'src/input-text/2.tsx',
      'src/input-password/1.tsx', 'src/input-password/2.tsx',
    ], `${path}@${metadata.version}`);
  }
});
