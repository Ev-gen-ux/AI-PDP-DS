import {
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
  openSync,
  closeSync,
  renameSync,
  unlinkSync,
  statSync,
  rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { projectContext, safePath } from './project.js';

const hash = (value) => createHash('sha256').update(value).digest('hex');
const alias = (value) => typeof value === 'string' && /^\{([^{}]+)\}$/.exec(value)?.[1];
const references = (value) => {
  if (typeof value === 'string') return [...value.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1]);
  if (value && typeof value === 'object') return Object.values(value).flatMap(references);
  return [];
};

function tokens(root) {
  const files = [],
    rows = [],
    primitives = new Map();
  const walk = (directory, primitive) => {
    for (const entry of readdirSync(safePath(root, directory), { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      const path = directory + '/' + entry.name;
      safePath(root, path); // Reject symlinks, including non-JSON files.
      if (entry.isDirectory()) walk(path, primitive);
      else if (entry.isFile() && entry.name.endsWith('.json')) {
        const text = readFileSync(safePath(root, path), 'utf8');
        const file = {
          path,
          text,
          data: JSON.parse(text),
          mode: statSync(safePath(root, path)).mode,
        };
        files.push(file);
        const visit = (node, keys, inheritedType) => {
          if (!node || typeof node !== 'object' || Array.isArray(node)) return;
          const type = node.$type ?? inheritedType;
          if (Object.hasOwn(node, '$value')) {
            const key = keys.join('.');
            if (!key) throw Error('Unnamed token in ' + path);
            const row = { key, type, value: node.$value, file: path, primitive, node };
            rows.push(row);
            if (primitive) {
              if (primitives.has(key)) throw Error('Duplicate primitive: ' + key);
              primitives.set(key, row);
            }
          } else {
            for (const [name, child] of Object.entries(node)) {
              if (!name.startsWith('$')) visit(child, [...keys, name], type);
            }
          }
        };
        visit(file.data, [], undefined);
      }
    }
  };
  walk('tokens/primitives', true);
  walk('tokens/semantic', false);
  if (!primitives.size) throw Error('No primitive tokens');
  const validated = new Set();
  const validate = (key, trail = new Set()) => {
    if (trail.has(key)) throw Error('Primitive alias cycle: ' + key);
    if (validated.has(key)) return;
    const row = primitives.get(key);
    if (!row) throw Error('Unknown primitive alias: ' + key);
    for (const ref of references(row.value)) validate(ref, new Set([...trail, key]));
    validated.add(key);
  };
  for (const key of primitives.keys()) validate(key);
  return { files, rows, primitives };
}

function editable(row) {
  const kind = typeof row.value;
  return (
    !references(row.value).length &&
    ((row.type === 'color' &&
      kind === 'string' &&
      /^#[\da-f]{3}(?:[\da-f]|[\da-f]{3}|[\da-f]{5})?$/i.test(row.value)) ||
      (row.type === 'number' && kind === 'number' && Number.isFinite(row.value)) ||
      (['string', 'fontFamily', 'fontWeight'].includes(row.type) && kind === 'string') ||
      (row.type === 'boolean' && kind === 'boolean'))
  );
}

function requestData(request) {
  if (
    !request ||
    typeof request !== 'object' ||
    Array.isArray(request) ||
    Object.keys(request).some((key) => !['values', 'sources', 'fonts'].includes(key)) ||
    !request.values ||
    typeof request.values !== 'object' ||
    Array.isArray(request.values)
  )
    throw Error('Expected request { values, sources?, fonts? }');
  const sources = request.sources ?? {},
    fonts = request.fonts ?? [];
  if (
    !sources ||
    typeof sources !== 'object' ||
    Array.isArray(sources) ||
    Object.entries(sources).some(
      ([key, value]) =>
        !Object.hasOwn(request.values, key) || typeof value !== 'string' || !value.trim(),
    )
  )
    throw Error('Sources must describe proposed keys');
  if (
    !Array.isArray(fonts) ||
    fonts.some(
      (font) =>
        !font ||
        typeof font !== 'object' ||
        Object.keys(font).some((key) => !['family', 'source', 'reference'].includes(key)) ||
        typeof font.family !== 'string' ||
        !font.family.trim() ||
        !['client', 'google-fonts', 'existing'].includes(font.source) ||
        (font.reference !== undefined &&
          (typeof font.reference !== 'string' || !font.reference.trim())),
    )
  )
    throw Error('Fonts require family, source (client/google-fonts/existing), optional reference');
  return { values: request.values, sources, fonts };
}

function report(snapshot, request) {
  const input = requestData(request);
  for (const [key, value] of Object.entries(input.values)) {
    const row = snapshot.primitives.get(key);
    if (!row) throw Error('Unknown primitive key: ' + key);
    if (!editable(row)) throw Error('Read-only alias or unsupported primitive: ' + key);
    if (
      !editable({ ...row, value }) ||
      typeof value !== typeof row.value ||
      references(value).length
    )
      throw Error('Invalid primitive value/type: ' + key);
    if (typeof value === 'string' && (!value.trim() || /[\r\n\0]/.test(value)))
      throw Error('Invalid primitive string: ' + key);
  }
  const affects = (key) => {
    const reached = new Set([key]);
    let changed;
    do {
      changed = false;
      for (const row of snapshot.primitives.values()) {
        if (!reached.has(row.key) && references(row.value).some((ref) => reached.has(ref))) {
          reached.add(row.key);
          changed = true;
        }
      }
    } while (changed);
    const aliases = [...reached].filter((ref) => ref !== key);
    // Keep all file-qualified candidates when mode files reuse a logical key.
    // This conservatively includes cross-mode candidates instead of dropping chains.
    const consumers = [],
      seen = new Set();
    do {
      changed = false;
      for (const row of snapshot.rows.filter((row) => !row.primitive)) {
        const id = row.file + ':' + row.key;
        if (!seen.has(id) && references(row.value).some((ref) => reached.has(ref))) {
          seen.add(id);
          reached.add(row.key);
          changed = true;
          consumers.push({ key: row.key, file: row.file });
        }
      }
    } while (changed);
    return { aliases, consumers };
  };
  const rows = [...snapshot.primitives.values()].map((row) => {
    const proposed = Object.hasOwn(input.values, row.key) ? input.values[row.key] : row.value;
    const aliasChain = [];
    let resolved = row.value;
    while (alias(resolved)) {
      const key = alias(resolved);
      aliasChain.push(key);
      resolved = snapshot.primitives.get(key).value;
    }
    return {
      key: row.key,
      type: row.type ?? null,
      current: row.value,
      proposed,
      unit: row.type === 'number' ? 'number (interpret units using foundation contract)' : null,
      editable: editable(row),
      alias: alias(row.value) || null,
      aliasChain,
      resolved,
      decision: Object.hasOwn(input.values, row.key) ? 'proposed' : 'retain-baseline',
      source: input.sources[row.key] ?? null,
      changed: JSON.stringify(proposed) !== JSON.stringify(row.value),
      numericNameMismatch:
        /^\d+(?:\.\d+)?$/.test(row.key.split('.').at(-1)) &&
        typeof proposed === 'number' &&
        Number(row.key.split('.').at(-1)) !== proposed,
      ...affects(row.key),
    };
  });
  const sourceHashes = snapshot.files.map((file) => ({ path: file.path, hash: hash(file.text) }));
  const normalized = {
    values: Object.fromEntries(Object.entries(input.values).sort(([a], [b]) => a.localeCompare(b))),
    sources: Object.fromEntries(
      Object.entries(input.sources).sort(([a], [b]) => a.localeCompare(b)),
    ),
    fonts: input.fonts,
  };
  return {
    fingerprint: hash(JSON.stringify({ sourceHashes, request: normalized })),
    sourceHashes,
    rows,
    changes: rows.filter((row) => row.changed),
    fonts: input.fonts,
    limitations: [
      'Static alias candidates across files; mode variants are conservatively combined. Dynamic consumers require review.',
      'Units, font availability, rendering and Figma parity require delivery checks.',
    ],
  };
}

export function primitivePlan(root, request = { values: {} }) {
  return report(tokens(root), request);
}

export function applyPrimitives(root, request, expected, note) {
  if (
    typeof expected !== 'string' ||
    !/^[a-f0-9]{64}$/.test(expected) ||
    typeof note !== 'string' ||
    !note.trim()
  )
    throw Error('Expected current plan fingerprint and actual owner approval note');
  const lock = safePath(root, 'tokens/.primitives.lock', true);
  const descriptor = openSync(lock, 'wx');
  let staged = [],
    committed = [];
  try {
    const snapshot = tokens(root),
      plan = report(snapshot, request);
    if (plan.fingerprint !== expected) throw Error('Stale primitive plan; inspect a new plan');
    for (const change of plan.changes)
      snapshot.primitives.get(change.key).node.$value = change.proposed;
    const changedFiles = new Set(
      plan.changes.map((change) => snapshot.primitives.get(change.key).file),
    );
    staged = snapshot.files
      .filter((file) => changedFiles.has(file.path))
      .map((file) => ({ ...file, temporary: file.path + '.' + randomUUID() + '.tmp' }));
    for (const file of staged)
      writeFileSync(
        safePath(root, file.temporary, true),
        JSON.stringify(file.data, null, 2) + '\n',
        { flag: 'wx', mode: file.mode },
      );
    // Recheck all sources immediately before replacing any file.
    for (const file of snapshot.files) {
      if (readFileSync(safePath(root, file.path), 'utf8') !== file.text)
        throw Error('Token sources changed during apply');
    }
    for (const file of staged) {
      renameSync(safePath(root, file.temporary), safePath(root, file.path));
      committed.push(file);
    }
    return {
      fingerprint: plan.fingerprint,
      changed: plan.changes.map((row) => row.key),
      note,
      semanticFilesUnchanged: true,
      aliasesUnchanged: true,
      nextStep:
        'Generate derived tokens; load fonts and verify the selected delivery. Figma and visual checks have not run.',
    };
  } catch (error) {
    for (const file of committed.reverse())
      writeFileSync(safePath(root, file.path), file.text, { mode: file.mode });
    throw error;
  } finally {
    try {
      for (const file of staged) rmSync(safePath(root, file.temporary, true), { force: true });
    } finally {
      closeSync(descriptor);
      unlinkSync(lock);
    }
  }
}

export function main(args = process.argv.slice(2)) {
  try {
    const [command, ...rest] = args,
      options = {};
    const allowed =
      command === 'matrix'
        ? ['root', 'project']
        : command === 'plan'
          ? ['root', 'project', 'input']
          : command === 'apply'
            ? ['root', 'project', 'input', 'expect', 'note']
            : null;
    if (!allowed)
      throw Error(
        'env:primitives matrix|plan|apply --input project-relative.json [--project id|--root path]',
      );
    for (let i = 0; i < rest.length; i++) {
      const key = rest[i].startsWith('--') ? rest[i].slice(2) : '';
      if (
        !allowed.includes(key) ||
        Object.hasOwn(options, key) ||
        !rest[i + 1] ||
        rest[i + 1].startsWith('--')
      )
        throw Error('Invalid primitive options');
      options[key] = rest[++i];
    }
    if (options.root && options.project) throw Error('Choose --root or --project');
    const project = projectContext(resolve(options.root ?? process.cwd()), options.project);
    if (project.environment) throw Error('Select a project for primitive values');
    if (command !== 'matrix' && !options.input) throw Error('--input is required');
    const request =
      command === 'matrix'
        ? { values: {} }
        : JSON.parse(readFileSync(safePath(project.root, options.input), 'utf8'));
    const result =
      command === 'apply'
        ? applyPrimitives(project.root, request, options.expect, options.note)
        : primitivePlan(project.root, request);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
