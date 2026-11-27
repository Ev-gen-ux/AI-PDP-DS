import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  unlinkSync,
  openSync,
  closeSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { safePath, readProject } from './project.js';
import { templateSection } from './journal.js';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const read = (root, path) => readFileSync(safePath(root, path));
function atomic(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = path + '.' + randomUUID() + '.tmp';
  try {
    writeFileSync(temporary, bytes, { flag: 'wx' });
    renameSync(temporary, path);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}
export function installTooling(factoryRoot, projectRoot) {
  factoryRoot = resolve(factoryRoot);
  const project = readProject(projectRoot),
    root = project.root;
  if (root === factoryRoot || project.legacy || project.environment)
    throw Error('Install into a standalone system, not the flat factory/library root');
  const lock = safePath(root, '.tooling-install.lock', true);
  const fd = openSync(lock, 'wx');
  try {
    const kit = JSON.parse(read(factoryRoot, 'templates/project/tooling.json'));
    if (
      kit.schemaVersion !== 1 ||
      !/^\d+\.\d+\.\d+$/.test(kit.version) ||
      !Array.isArray(kit.files) ||
      !kit.files.length
    )
      throw Error('Invalid tooling manifest');
    const metadata = JSON.parse(read(root, 'system.json')),
      previous = metadata.tooling;
    const pkgPath = safePath(root, 'package.json', true),
      pkg = existsSync(pkgPath)
        ? JSON.parse(readFileSync(pkgPath, 'utf8'))
        : { name: project.id, private: true, type: 'module' };
    if (pkg.type !== 'module') throw Error('Tooling requires a project with type=module');
    const seen = new Set(),
      updates = [],
      managed = {};
    for (const row of kit.files) {
      if (
        seen.has(row.target) ||
        /^(?:package\.json|system\.json|\.env(?:$|[./]))/.test(row.target)
      )
        throw Error('Invalid or duplicate tooling target');
      seen.add(row.target);
      const source = read(factoryRoot, row.source);
      const content =
          row.section === undefined
            ? source
            : Buffer.from(templateSection(source.toString('utf8'), row.section)),
        path = safePath(root, row.target, true),
        sha256 = hash(content);
      managed[row.target] = sha256;
      if (existsSync(path)) {
        const actual = hash(readFileSync(path));
        if (actual === sha256) continue;
        if (previous?.files?.[row.target] !== actual)
          throw Error('Local file conflict: ' + row.target);
      }
      updates.push({ path, content });
    }
    for (const target of Object.keys(previous?.files ?? {}))
      if (!seen.has(target))
        throw Error('Managed file removal needs explicit migration: ' + target);
    const scripts = { ...pkg.scripts };
    for (const [key, value] of Object.entries(kit.scripts)) {
      if (
        Object.hasOwn(scripts, key) &&
        scripts[key] !== value &&
        scripts[key] !== previous?.scripts?.[key]
      )
        throw Error('Local script conflict: ' + key);
      scripts[key] = value;
    }
    pkg.scripts = scripts;
    metadata.tooling = { version: kit.version, files: managed, scripts: kit.scripts };
    // All conflicts are checked before the first replacement; each file is atomic.
    // A process interruption can leave a partial installation; rerun inspects actual hashes.
    for (const { path, content } of updates) atomic(path, content);
    const packageBytes = JSON.stringify(pkg, null, 2) + '\n',
      metadataBytes = JSON.stringify(metadata, null, 2) + '\n';
    if (!existsSync(pkgPath) || readFileSync(pkgPath, 'utf8') !== packageBytes)
      atomic(pkgPath, packageBytes);
    if (read(root, 'system.json').toString() !== metadataBytes)
      atomic(safePath(root, 'system.json'), metadataBytes);
    return {
      system: project.id,
      version: kit.version,
      copied: updates.length,
      standalone: true,
      limitations: [
        'Tooling only; no React starter, dependency installation or library handoff validation',
      ],
    };
  } finally {
    closeSync(fd);
    unlinkSync(lock);
  }
}
