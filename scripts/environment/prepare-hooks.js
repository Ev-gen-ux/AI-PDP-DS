import { existsSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export function prepareHooks(root) {
  if (!existsSync(join(root, '.git')))
    return { installed: false, reason: 'No developer-owned Git directory' };
  const result = spawnSync(process.execPath, [join(root, 'node_modules/husky/bin.js')], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0)
    throw result.error ?? Error('Developer hook installation failed');
  return { installed: true };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url))
  prepareHooks(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
