import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  openSync,
  closeSync,
  fsyncSync,
  renameSync,
  unlinkSync,
  existsSync,
  lstatSync,
  realpathSync,
} from 'node:fs';
import { resolve, relative, join, isAbsolute, sep } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';

export const taskSchema = JSON.parse(
  readFileSync(
    new URL('../../docs/environment/schemas/task-state.schema.json', import.meta.url),
    'utf8',
  ),
);
const allowedKeywords = new Set([
  '$schema',
  '$defs',
  '$ref',
  'title',
  'type',
  'const',
  'enum',
  'minLength',
  'maxLength',
  'pattern',
  'minimum',
  'minItems',
  'uniqueItems',
  'items',
  'properties',
  'required',
  'additionalProperties',
]);
function fail(message) {
  throw new Error(message);
}
function schemaContract(s) {
  for (const key of Object.keys(s))
    if (!allowedKeywords.has(key)) fail('Unsupported schema keyword: ' + key);
  if (s.$ref && !/^#\/\$defs\/[a-zA-Z]+$/.test(s.$ref)) fail('Unsupported schema reference');
  if (s.additionalProperties !== undefined && s.additionalProperties !== false)
    fail('Only closed object schemas are supported');
  if (
    s.type &&
    ![]
      .concat(s.type)
      .every((t) => ['string', 'integer', 'object', 'array', 'null', 'boolean'].includes(t))
  )
    fail('Unsupported schema type');
  for (const child of Object.values(s.properties ?? {})) schemaContract(child);
  for (const child of Object.values(s.$defs ?? {})) schemaContract(child);
  if (s.items) schemaContract(s.items);
}
schemaContract(taskSchema);
export function validateSchema(value, s = taskSchema, path = '$') {
  if (s.$ref) {
    const target = taskSchema.$defs[s.$ref.split('/').at(-1)];
    if (!target) fail('Unknown schema reference');
    return validateSchema(value, target, path);
  }
  if (Object.hasOwn(s, 'const') && value !== s.const) fail(path + ': invalid constant');
  if (s.enum && !s.enum.includes(value)) fail(path + ': invalid enum');
  const type =
    value === null
      ? 'null'
      : Array.isArray(value)
        ? 'array'
        : typeof value === 'number' && Number.isSafeInteger(value)
          ? 'integer'
          : typeof value;
  if (s.type && ![].concat(s.type).includes(type)) fail(path + ': invalid type');
  if (type === 'string') {
    if (
      (s.minLength !== undefined && Array.from(value).length < s.minLength) ||
      (s.maxLength !== undefined && Array.from(value).length > s.maxLength)
    )
      fail(path + ': invalid length');
    if (s.pattern && !new RegExp(s.pattern).test(value)) fail(path + ': invalid format');
  }
  if (type === 'integer' && s.minimum !== undefined && value < s.minimum)
    fail(path + ': below minimum');
  if (type === 'array') {
    if (s.minItems !== undefined && value.length < s.minItems) fail(path + ': too few items');
    if (s.uniqueItems && new Set(value.map((x) => JSON.stringify(x))).size !== value.length)
      fail(path + ': duplicate items');
    value.forEach((x, i) => validateSchema(x, s.items, path + '[' + i + ']'));
  }
  if (type === 'object') {
    for (const key of s.required ?? [])
      if (!Object.hasOwn(value, key)) fail(path + ': missing ' + key);
    for (const [key, x] of Object.entries(value)) {
      if (!Object.hasOwn(s.properties ?? {}, key)) fail(path + ': unknown field ' + key);
      validateSchema(x, s.properties[key], path + '.' + key);
    }
  }
  return value;
}
const digest = (value) => createHash('sha256').update(value).digest('hex');
const canonical = (x) =>
  x && typeof x === 'object'
    ? Array.isArray(x)
      ? x.map(canonical)
      : Object.fromEntries(
          Object.keys(x)
            .sort()
            .map((k) => [k, canonical(x[k])]),
        )
    : x;
export function fingerprint(state) {
  const { title, route, scope, sourceCommit, spec, inputs, decisions, questions } = state;
  return digest(
    JSON.stringify(
      canonical({ title, route, scope, sourceCommit, spec, inputs, decisions, questions }),
    ),
  );
}
function filePath(root, name) {
  root = realpathSync(root);
  if (
    typeof name !== 'string' ||
    !name ||
    isAbsolute(name) ||
    name.includes('\\') ||
    name.split('/').some((p) => !p || p === '.' || p === '..' || p === '.git')
  )
    fail('Unsafe relative path');
  const full = resolve(root, name);
  const actual = realpathSync(full);
  const rel = relative(root, actual);
  if (
    rel === '..' ||
    rel.startsWith('..' + sep) ||
    isAbsolute(rel) ||
    rel.split(sep).includes('.git')
  )
    fail('Reference escapes workspace');
  if (!lstatSync(actual).isFile()) fail('Reference must be a regular file');
  return actual;
}
export function fileReference(root, name) {
  return { path: name, sha256: digest(readFileSync(filePath(root, name))) };
}
function gitHead(root) {
  return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}
function workspace(root) {
  const actual = realpathSync(root);
  const top = realpathSync(
    execFileSync('git', ['-C', actual, 'rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
    }).trim(),
  );
  if (top !== actual) fail('Root must be the Git worktree root');
  return actual;
}
function taskPath(root, id, create = false) {
  validateSchema(id, taskSchema.properties.id, 'id');
  let parent = root;
  for (const part of ['.local', 'tasks']) {
    parent = join(parent, part);
    if (create && !existsSync(parent)) mkdirSync(parent, { mode: 0o700 });
    if (lstatSync(parent).isSymbolicLink() || !lstatSync(parent).isDirectory())
      fail('Unsafe task storage');
  }
  const directory = join(parent, id);
  if (
    existsSync(directory) &&
    (lstatSync(directory).isSymbolicLink() || !lstatSync(directory).isDirectory())
  )
    fail('Unsafe task directory');
  return directory;
}
function safeFile(path) {
  if (lstatSync(path).isSymbolicLink() || !lstatSync(path).isFile()) fail('Unsafe state file');
}
const mutable = [
  'title',
  'status',
  'route',
  'scope',
  'spec',
  'inputs',
  'decisions',
  'questions',
  'evidence',
  'acceptance',
  'blockedReason',
  'nextStep',
];
function patchFields(patch, root) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) fail('Patch must be an object');
  for (const key of Object.keys(patch))
    if (!mutable.includes(key)) fail('Immutable or unknown field: ' + key);
  const result = { ...patch };
  if (typeof result.spec === 'string') result.spec = fileReference(root, result.spec);
  if (Array.isArray(result.inputs))
    result.inputs = result.inputs.map((x) => (typeof x === 'string' ? fileReference(root, x) : x));
  if (Array.isArray(result.questions))
    result.questions = result.questions.map((q) =>
      typeof q === 'string' ? { text: q, blocking: true } : q,
    );
  return result;
}
export function staleReferences(root, state) {
  const stale = [];
  if (gitHead(root) !== state.sourceCommit) stale.push('sourceCommit');
  const check = (ref, name) => {
    try {
      if (fileReference(root, ref.path).sha256 !== ref.sha256) stale.push(name);
    } catch {
      stale.push(name + ': missing or unsafe');
    }
  };
  if (state.spec) check(state.spec, 'spec');
  state.inputs.forEach((ref, i) => check(ref, 'inputs[' + i + ']'));
  const current = fingerprint(state);
  state.evidence.forEach((entry, i) => {
    if (entry.fingerprint !== current) stale.push('evidence[' + i + ']: different input');
    entry.artifacts.forEach((ref, j) => check(ref, 'evidence[' + i + '].artifacts[' + j + ']'));
  });
  if (state.acceptance && state.acceptance.fingerprint !== current)
    stale.push('acceptance: different input');
  return stale;
}
function validateState(root, state, id) {
  validateSchema(state);
  if (state.id !== id) fail('State ID does not match directory');
  if (
    !Number.isFinite(Date.parse(state.updatedAt)) ||
    new Date(state.updatedAt).toISOString() !== state.updatedAt
  )
    fail('Invalid timestamp');
  const refs = [state.spec, ...state.inputs, ...state.evidence.flatMap((x) => x.artifacts)].filter(
    Boolean,
  );
  for (const ref of refs) filePath(root, ref.path);
  const inputPaths = [state.spec, ...state.inputs]
    .filter(Boolean)
    .map((x) => filePath(root, x.path));
  if (new Set(inputPaths).size !== inputPaths.length) fail('Duplicate input or Spec reference');
  if (state.status === 'blocked' && !state.blockedReason) fail('Blocked task requires a reason');
  if (state.status !== 'blocked' && state.blockedReason !== null)
    fail('Blocker must be cleared explicitly');
  if (['ready', 'implementation', 'review', 'accepted'].includes(state.status)) {
    if (
      !state.title ||
      !state.scope.summary ||
      !state.nextStep ||
      Object.values(state.route).some((x) => x === null)
    )
      fail('Task route, scope, title and next step must be known');
    if (state.questions.some((q) => typeof q === 'string' || q.blocking))
      fail('Resolve blocking questions before proceeding');
    if (
      ['component', 'chart'].includes(state.route.object) &&
      state.route.action !== 'audit' &&
      !state.spec
    )
      fail('Component task requires one canonical Spec');
  }
  if (state.status === 'accepted') {
    if (!state.acceptance || state.acceptance.fingerprint !== fingerprint(state))
      fail('Acceptance must explicitly identify current inputs');
    if (!state.evidence.length || state.evidence.some((e) => e.result !== 'pass'))
      fail('Accepted task requires passing evidence');
    if (staleReferences(root, state).length) fail('Accepted task has stale evidence or inputs');
  } else if (state.acceptance !== null) fail('Acceptance is only valid for an accepted task');
  return state;
}
const transitions = {
  discovery: ['discovery', 'ready', 'blocked'],
  ready: ['ready', 'discovery', 'implementation', 'blocked'],
  implementation: ['implementation', 'review', 'blocked'],
  review: ['review', 'implementation', 'accepted', 'blocked'],
  accepted: ['accepted', 'review'],
  blocked: ['blocked', 'discovery', 'ready', 'implementation', 'review'],
};
export function loadTask(root, id) {
  root = workspace(root);
  const directory = taskPath(root, id);
  const path = join(directory, 'state.json');
  safeFile(path);
  const raw = readFileSync(path, 'utf8');
  const state = validateSchema(JSON.parse(raw));
  if (state.id !== id) fail('State ID does not match directory');
  const stale = staleReferences(root, state);
  const problems = [];
  try {
    validateState(root, state, id);
  } catch (error) {
    problems.push(error.message);
  }
  return {
    directory,
    state,
    token: digest(raw),
    fingerprint: fingerprint(state),
    stale,
    problems,
    validForCompletion: state.status === 'accepted' && !stale.length && !problems.length,
  };
}
export function initTask(root, id, seed = {}) {
  root = workspace(root);
  validateSchema(id, taskSchema.properties.id, 'id');
  const patch = patchFields(seed, root);
  for (const key of ['route', 'scope'])
    if (
      Object.hasOwn(patch, key) &&
      (!patch[key] || typeof patch[key] !== 'object' || Array.isArray(patch[key]))
    )
      fail('Seed ' + key + ' must be an object');
  if (patch.status && patch.status !== 'discovery') fail('New tasks start in discovery');
  const state = {
    schemaVersion: 1,
    id,
    revision: 1,
    updatedAt: new Date().toISOString(),
    title: null,
    status: 'discovery',
    route: { action: null, object: null, platform: null, delivery: null },
    scope: { summary: null, preserve: [] },
    sourceCommit: gitHead(root),
    spec: null,
    inputs: [],
    decisions: [],
    questions: [],
    evidence: [],
    acceptance: null,
    blockedReason: null,
    nextStep: null,
    ...patch,
  };
  state.route = { action: null, object: null, platform: null, delivery: null, ...patch.route };
  state.scope = { summary: null, preserve: [], ...patch.scope };
  validateState(root, state, id);
  const directory = taskPath(root, id, true);
  mkdirSync(directory, { mode: 0o700 });
  writeFileSync(join(directory, 'state.json'), JSON.stringify(state, null, 2) + '\n', {
    flag: 'wx',
    mode: 0o600,
  });
  return loadTask(root, id);
}
export function updateTask(root, id, expected, patch, refresh = false) {
  root = workspace(root);
  if (!/^[a-f0-9]{64}$/.test(expected ?? '')) fail('Expected state token is required');
  const directory = taskPath(root, id);
  const lock = join(directory, 'write.lock');
  const lockFd = openSync(lock, 'wx', 0o600);
  let temporary;
  try {
    writeFileSync(
      lockFd,
      JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }) + '\n',
    );
    const current = loadTask(root, id);
    if (current.token !== expected) fail('State conflict: reload before updating');
    const next = {
      ...current.state,
      ...patchFields(patch, root),
      revision: current.state.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    if (refresh) {
      next.sourceCommit = gitHead(root);
      if (next.spec) next.spec = fileReference(root, next.spec.path);
      next.inputs = next.inputs.map((ref) => fileReference(root, ref.path));
      if (next.status === 'accepted' && staleReferences(root, next).length) {
        next.status = 'review';
        next.acceptance = null;
      }
    }
    if (!transitions[current.state.status].includes(next.status)) fail('Invalid status transition');
    validateState(root, next, id);
    const stale = staleReferences(root, next);
    if (
      !refresh &&
      ['ready', 'implementation', 'review', 'accepted'].includes(next.status) &&
      stale.length
    )
      fail('Stale inputs/evidence: refresh and record current checks');
    const history = join(directory, 'history');
    if (!existsSync(history)) mkdirSync(history, { mode: 0o700 });
    if (lstatSync(history).isSymbolicLink() || !lstatSync(history).isDirectory())
      fail('Unsafe history directory');
    const oldRaw = readFileSync(join(directory, 'state.json'), 'utf8');
    if (digest(oldRaw) !== expected) fail('State conflict during update');
    const saved = join(history, current.state.revision + '-' + expected + '.json');
    if (existsSync(saved)) {
      safeFile(saved);
      if (readFileSync(saved, 'utf8') !== oldRaw) fail('History conflict');
    } else writeFileSync(saved, oldRaw, { flag: 'wx', mode: 0o600 });
    temporary = join(directory, '.state-' + randomUUID() + '.tmp');
    const fd = openSync(temporary, 'wx', 0o600);
    try {
      writeFileSync(fd, JSON.stringify(next, null, 2) + '\n');
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    safeFile(join(directory, 'state.json'));
    if (digest(readFileSync(join(directory, 'state.json'))) !== expected)
      fail('State conflict before commit');
    renameSync(temporary, join(directory, 'state.json'));
    temporary = undefined;
    return loadTask(root, id);
  } finally {
    if (temporary && existsSync(temporary)) unlinkSync(temporary);
    closeSync(lockFd);
    unlinkSync(lock);
  }
}
function cli() {
  const [command, id, ...args] = process.argv.slice(2);
  const usage =
    'Usage: env:task init|resume|check|update|refresh|ref <id-or-path> [--root path] [--seed file] [--patch file] [--expect token]';
  if (command === '--help' || command === 'help') {
    console.log(usage);
    return;
  }
  const permitted = {
    init: ['--root', '--seed'],
    update: ['--root', '--patch', '--expect'],
    refresh: ['--root', '--expect'],
    resume: ['--root'],
    check: ['--root'],
    ref: ['--root'],
  };
  if (!Object.hasOwn(permitted, command ?? '')) fail(usage);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!permitted[command].includes(args[i]) || !args[i + 1] || Object.hasOwn(options, args[i]))
      fail('Invalid command options');
    options[args[i]] = args[i + 1];
  }
  const root = workspace(
    options['--root'] ??
      execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(),
  );
  const read = (name) => JSON.parse(readFileSync(filePath(root, name), 'utf8'));
  let result;
  if (command === 'ref') {
    console.log(JSON.stringify(fileReference(root, id), null, 2));
    return;
  }
  if (command === 'init')
    result = initTask(root, id, options['--seed'] ? read(options['--seed']) : {});
  else if (command === 'update') {
    if (!options['--patch']) fail('update requires --patch');
    result = updateTask(root, id, options['--expect'], read(options['--patch']));
  } else if (command === 'refresh') result = updateTask(root, id, options['--expect'], {}, true);
  else if (command === 'resume' || command === 'check') {
    result = loadTask(root, id);
    if (command === 'check') {
      validateState(root, result.state, id);
      if (result.stale.length) fail('Stale references: ' + result.stale.join(', '));
    }
  } else
    fail(
      'Usage: env:task init|resume|check|update|refresh|ref <id-or-path> [--root path] [--seed file] [--patch file] [--expect token]',
    );
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    cli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
