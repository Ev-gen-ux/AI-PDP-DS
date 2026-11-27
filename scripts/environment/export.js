import {
  existsSync,
  lstatSync,
  realpathSync,
  readdirSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  mkdtempSync,
  renameSync,
  rmSync,
  chmodSync,
} from 'node:fs';
import { resolve, dirname, basename, join, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { readProject, safePath } from './project.js';

const excludedNames = new Set([
  '.git',
  'node_modules',
  '.local',
  'dist',
  'coverage',
  'storybook-static',
  '.cache',
  '.eslintcache',
  '.DS_Store',
]);
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const within = (path, parent) => path === parent || path.startsWith(parent + sep);
function destinationPath(path) {
  let ancestor = resolve(path);
  const missing = [];
  while (!existsSync(ancestor)) {
    try {
      lstatSync(ancestor);
      throw Error('Dangling destination link');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    missing.unshift(basename(ancestor));
    ancestor = dirname(ancestor);
  }
  return join(realpathSync(ancestor), ...missing);
}
export function exportProject(factoryRoot, selected, output) {
  if (typeof output !== 'string' || !output.trim())
    throw Error('Export requires an explicit --out folder');
  factoryRoot = realpathSync(factoryRoot);
  const project = readProject(selected.root);
  if (project.environment || project.legacy)
    throw Error('Export requires a standalone project with system.json');
  const root = project.root,
    destination = destinationPath(output);
  if (within(destination, root) || within(root, destination))
    throw Error('Export destination overlaps its source');
  if (within(destination, join(factoryRoot, 'projects')))
    throw Error('Export outside the factory projects collection');
  if (existsSync(destination)) throw Error('Export destination already exists');
  for (const path of [
    'package.json',
    'package-lock.json',
    'src',
    'tokens',
    '.storybook',
    'docs',
    'scripts',
    'product-discovery',
  ])
    safePath(root, path);
  const pkg = JSON.parse(readFileSync(safePath(root, 'package.json'), 'utf8'));
  if (typeof pkg.name !== 'string' || typeof pkg.version !== 'string')
    throw Error('Project package identity is missing');
  const files = [],
    excluded = [];
  const scan = (folder = '') => {
    for (const entry of readdirSync(folder ? safePath(root, folder) : root, {
      withFileTypes: true,
    })) {
      const path = folder ? folder + '/' + entry.name : entry.name;
      if (
        excludedNames.has(entry.name) ||
        path === '.husky/_' ||
        (entry.name.startsWith('.env') && entry.name !== '.env.example') ||
        path === 'handoff-manifest.json'
      ) {
        excluded.push(path);
        continue;
      }
      const full = safePath(root, path),
        stat = lstatSync(full);
      if (stat.isDirectory()) scan(path);
      else if (stat.isFile()) {
        const bytes = readFileSync(full);
        files.push({ path, bytes, sha256: digest(bytes), mode: stat.mode & 0o777 });
      } else throw Error('Unsupported export entry: ' + path);
    }
  };
  scan();
  files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const entries = files.map(({ path, sha256, bytes, mode }) => ({
    path,
    sha256,
    size: bytes.length,
    mode,
  }));
  const manifest = {
    schemaVersion: 1,
    project: project.id,
    package: { name: pkg.name, version: pkg.version },
    fingerprint: digest(JSON.stringify(entries)),
    files: entries,
    excluded: excluded.sort(),
    sourceSnapshotOnly: true,
    buildVerifiedByExport: false,
  };
  const parent = dirname(destination);
  mkdirSync(parent, { recursive: true });
  const staging = mkdtempSync(join(parent, '.ds-export-'));
  try {
    for (const file of files) {
      const target = join(staging, file.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.bytes, { flag: 'wx', mode: file.mode });
      chmodSync(target, file.mode);
    }
    writeFileSync(
      join(staging, 'handoff-manifest.json'),
      JSON.stringify(manifest, null, 2) + '\n',
      { flag: 'wx' },
    );
    // Do not overwrite a concurrently created destination.
    mkdirSync(destination);
    try {
      for (const name of readdirSync(staging))
        renameSync(join(staging, name), join(destination, name));
    } catch (error) {
      rmSync(destination, { recursive: true, force: true });
      throw error;
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  return {
    project: project.id,
    directory: destination,
    files: entries.length,
    fingerprint: manifest.fingerprint,
    manifest: join(destination, 'handoff-manifest.json'),
    gitInitialized: false,
    pushed: false,
    limitations: ['Source snapshot only; export does not install dependencies, build or publish'],
  };
}
