import { existsSync, realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export function prepareHooks(root = process.cwd()) {
  // A nested source folder must never install hooks into the factory/parent Git.
  if (!existsSync(join(root, '.git')))
    return { installed: false, reason: 'No project-owned Git directory' };
  const result = spawnSync(process.execPath, [join(root, 'node_modules/husky/bin.js')], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0) throw result.error ?? Error('Hook installation failed');
  return { installed: true };
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareHooks(dirname(dirname(fileURLToPath(import.meta.url))));
}
