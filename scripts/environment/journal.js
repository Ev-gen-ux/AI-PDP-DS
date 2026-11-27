import {
  realpathSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
  lstatSync,
  openSync,
  closeSync,
  fsyncSync,
  renameSync,
  unlinkSync,
} from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { identifier, safePath, projectContext } from './project.js';

const START = '<!-- STATE:START -->';
const END = '<!-- STATE:END -->';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const now = () => new Date().toISOString();
const statuses = [
  'discovery',
  'ready',
  'implementation',
  'review',
  'accepted',
  'blocked',
  'paused',
  'cancelled',
];
const actions = ['create', 'refine', 'repair', 'audit', 'research', 'document', 'release'];
const objects = ['system', 'component', 'tokens', 'documentation', 'environment'];
const transitions = {
  discovery: ['discovery', 'ready', 'blocked', 'paused', 'cancelled'],
  ready: ['ready', 'discovery', 'implementation', 'blocked', 'paused', 'cancelled'],
  implementation: ['implementation', 'discovery', 'review', 'blocked', 'paused', 'cancelled'],
  review: ['review', 'discovery', 'implementation', 'accepted', 'blocked', 'paused', 'cancelled'],
  accepted: ['accepted', 'review'],
  blocked: statuses.filter((s) => s !== 'accepted'),
  paused: statuses.filter((s) => s !== 'accepted'),
  cancelled: ['cancelled', 'discovery'],
};
const editable = new Set([
  'title',
  'scope',
  'status',
  'nextStep',
  'questions',
  'decisions',
  'inputs',
  'evidence',
  'exceptions',
  'acceptance',
  'blockedReason',
]);
const fields = [
  'version',
  'id',
  'system',
  'title',
  'action',
  'object',
  'status',
  'revision',
  'updatedAt',
  'scope',
  'brief',
  'spec',
  'nextStep',
  'questions',
  'decisions',
  'inputs',
  'evidence',
  'exceptions',
  'specApproval',
  'acceptance',
  'blockedReason',
  'returnStatus',
];

export function reference(root, path) {
  if (path.split('/').some((p) => p.startsWith('.env') && p !== '.env.example'))
    throw Error('Private environment files cannot be task evidence');
  const full = safePath(root, path);
  if (!lstatSync(full).isFile()) throw Error('Reference must be a file');
  return { path, sha256: hash(readFileSync(full)) };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])]),
    );
  return value;
}

export function journalFingerprint(state) {
  const { id, system, title, action, object, scope, brief, spec, inputs, decisions } = state;
  return hash(
    JSON.stringify(
      canonical({ id, system, title, action, object, scope, brief, spec, inputs, decisions }),
    ),
  );
}

export function parseJournal(text) {
  if (text.split(START).length !== 2 || text.split(END).length !== 2)
    throw Error('Journal must contain exactly one STATE block');
  const start = text.indexOf(START),
    end = text.indexOf(END);
  if (end < start) throw Error('Invalid STATE block order');
  const data = {};
  for (const line of text.slice(start + START.length, end).split('\n')) {
    if (!line.trim() || line === '## STATE') continue;
    const match = /^- ([A-Za-z]+): (.+)$/.exec(line);
    if (!match || !fields.includes(match[1]) || Object.hasOwn(data, match[1]))
      throw Error('Unknown, duplicate or invalid STATE field');
    data[match[1]] = JSON.parse(match[2]);
  }
  if (fields.some((key) => !Object.hasOwn(data, key))) throw Error('Incomplete STATE');
  return data;
}

function renderState(state) {
  return (
    START +
    '\n## STATE\n\n' +
    fields
      .map((key) => '- ' + key + ': ' + JSON.stringify(state[key]).replaceAll('<', '\\u003c'))
      .join('\n') +
    '\n' +
    END
  );
}

function validRef(root, ref, inspect = true) {
  if (
    !ref ||
    Object.keys(ref).sort().join(',') !== 'path,sha256' ||
    !/^[a-f0-9]{64}$/.test(ref.sha256)
  )
    throw Error('Invalid file reference');
  if (!inspect) {
    if (
      typeof ref.path !== 'string' ||
      ref.path.split('/').some((p) => p.startsWith('.env') && p !== '.env.example')
    )
      throw Error('Invalid or private file reference');
    safePath(root, ref.path, true);
    return ref;
  }
  return reference(root, ref.path);
}

function validate(root, state, inspectFiles = true) {
  identifier(state.id);
  identifier(state.system);
  if (
    state.version !== 2 ||
    !statuses.includes(state.status) ||
    !actions.includes(state.action) ||
    !objects.includes(state.object)
  )
    throw Error('Invalid task version, status or route');
  if (!Number.isSafeInteger(state.revision) || state.revision < 1) throw Error('Invalid revision');
  if (state.returnStatus !== null && !statuses.includes(state.returnStatus))
    throw Error('Invalid return status');
  if (new Date(state.updatedAt).toISOString() !== state.updatedAt)
    throw Error('Invalid update date');
  for (const key of ['title', 'scope', 'nextStep'])
    if (state[key] !== null && typeof state[key] !== 'string') throw Error('Invalid ' + key);
  for (const key of ['questions', 'decisions', 'inputs', 'evidence', 'exceptions'])
    if (!Array.isArray(state[key])) throw Error('Invalid ' + key);
  if (
    state.questions.some((q) => !q || typeof q.text !== 'string' || typeof q.blocking !== 'boolean')
  )
    throw Error('Questions need text and blocking');
  if (state.decisions.some((d) => typeof d !== 'string')) throw Error('Invalid decisions');
  const refs = [state.brief, state.spec, ...state.inputs].filter(Boolean);
  if (!state.brief || new Set(refs.map((r) => r.path)).size !== refs.length)
    throw Error('Missing brief or duplicate inputs');
  refs.forEach((r) => validRef(root, r, inspectFiles));
  for (const e of state.evidence) {
    if (
      !e ||
      !['automated', 'manual'].includes(e.kind) ||
      typeof e.method !== 'string' ||
      !e.method.trim() ||
      typeof e.criterion !== 'string' ||
      !e.criterion.trim() ||
      !['pass', 'fail', 'not-run', 'not-applicable'].includes(e.result) ||
      !/^[a-f0-9]{64}$/.test(e.fingerprint) ||
      !Array.isArray(e.artifacts)
    )
      throw Error('Invalid evidence');
    e.artifacts.forEach((r) => validRef(root, r, inspectFiles));
  }
  for (const exception of state.exceptions)
    if (
      !exception ||
      typeof exception.criterion !== 'string' ||
      !exception.criterion ||
      typeof exception.note !== 'string' ||
      !exception.note.trim() ||
      exception.by !== 'owner' ||
      !/^[a-f0-9]{64}$/.test(exception.fingerprint)
    )
      throw Error('Exception needs owner decision and fingerprint');
  if (
    state.specApproval !== null &&
    (!state.spec ||
      state.specApproval.by !== 'owner' ||
      typeof state.specApproval.note !== 'string' ||
      !state.specApproval.note.trim() ||
      !/^[a-f0-9]{64}$/.test(state.specApproval.sha256))
  )
    throw Error('Invalid specification approval');
  if (
    state.acceptance !== null &&
    (state.acceptance.by !== 'owner' ||
      !state.acceptance.note?.trim() ||
      state.acceptance.fingerprint !== journalFingerprint(state))
  )
    throw Error('Invalid owner acceptance');
  if (state.status !== 'accepted' && state.acceptance !== null)
    throw Error('Acceptance belongs to accepted version only');
  if (state.status === 'blocked' && !state.blockedReason?.trim())
    throw Error('Blocked task needs a reason');
  if (state.status !== 'blocked' && state.blockedReason !== null)
    throw Error('Clear blocker explicitly');
  if (['ready', 'implementation', 'review', 'accepted'].includes(state.status)) {
    if (
      !state.title?.trim() ||
      !state.scope?.trim() ||
      !state.nextStep?.trim() ||
      state.questions.some((q) => q.blocking)
    )
      throw Error('Task is not ready: resolve scope, next step and blocking questions');
    if (
      inspectFiles &&
      readFileSync(safePath(root, state.brief.path), 'utf8').includes('<!-- BRIEF:DRAFT -->')
    )
      throw Error('Complete the brief before proceeding');
    if (
      state.status !== 'review' &&
      state.object === 'component' &&
      ['create', 'refine'].includes(state.action)
    ) {
      if (!state.specApproval || state.specApproval.sha256 !== state.spec?.sha256)
        throw Error('Owner approval of the current component specification is required');
    }
  }
  if (state.status === 'accepted') {
    if (!state.acceptance || !state.evidence.length)
      throw Error('Owner acceptance and evidence are required');
    for (const evidence of state.evidence)
      if (
        evidence.result !== 'pass' &&
        evidence.result !== 'not-applicable' &&
        !state.exceptions.some(
          (x) => x.criterion === evidence.criterion && x.fingerprint === journalFingerprint(state),
        )
      )
        throw Error('Unresolved failing or unperformed check: ' + evidence.criterion);
  }
}

export function journalFiles(root, environment = false) {
  const found = [];
  const walk = (path) => {
    if (!existsSync(path)) return;
    if (lstatSync(path).isSymbolicLink()) throw Error('Journal directory cannot be a symlink');
    for (const e of readdirSync(path, { withFileTypes: true })) {
      if (e.isSymbolicLink()) throw Error('Journal directory cannot contain symlinks');
      if (e.isDirectory() && !['history', 'evidence', 'research'].includes(e.name))
        walk(join(path, e.name));
      else if (e.isFile() && e.name === '_process_log.md') found.push(join(path, e.name));
    }
  };
  for (const folder of environment ? ['.local/tasks'] : ['product-discovery', 'component-specs'])
    walk(safePath(root, folder, true));
  return found;
}

export function readJournal(root, path) {
  const full = safePath(root, path),
    bytes = readFileSync(full),
    state = parseJournal(bytes.toString());
  validate(root, state, false);
  const stale = [];
  const compare = (ref, prefix = '') => {
    try {
      if (reference(root, ref.path).sha256 !== ref.sha256) stale.push(prefix + ref.path);
    } catch {
      stale.push('unavailable:' + prefix + ref.path);
    }
  };
  for (const ref of [state.brief, state.spec, ...state.inputs].filter(Boolean)) compare(ref);
  const fingerprint = journalFingerprint(state);
  for (const e of state.evidence) {
    if (e.fingerprint !== fingerprint) stale.push('evidence:' + e.criterion);
    for (const ref of e.artifacts) compare(ref, 'artifact:');
  }
  if (state.specApproval && state.specApproval.sha256 !== state.spec?.sha256)
    stale.push('specApproval');
  if (state.exceptions.some((e) => e.fingerprint !== fingerprint)) stale.push('exceptions');
  return {
    path,
    state,
    token: hash(bytes),
    fingerprint,
    stale: [...new Set(stale)],
    validForCompletion: state.status === 'accepted' && !stale.length,
  };
}

export function findJournal(root, id, environment = false) {
  identifier(id);
  const matches = journalFiles(root, environment).filter(
    (p) => parseJournal(readFileSync(p, 'utf8')).id === id,
  );
  if (matches.length !== 1)
    throw Error(matches.length ? 'Ambiguous task ID' : 'Unknown task: ' + id);
  return readJournal(root, relative(root, matches[0]).split('\\').join('/'));
}

export function templateSection(text, id) {
  if (typeof text !== 'string' || typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
    throw Error('Invalid template section');
  const start = '<!-- TEMPLATE:' + id + ':START -->';
  const end = '<!-- TEMPLATE:' + id + ':END -->';
  const lines = text.replaceAll('\r\n', '\n').split('\n');
  if (
    lines.filter((line) => line === start).length !== 1 ||
    lines.filter((line) => line === end).length !== 1
  )
    throw Error('Missing or duplicate template section: ' + id);
  const a = lines.indexOf(start),
    b = lines.indexOf(end);
  const body = lines
    .slice(a + 1, b)
    .join('\n')
    .trim();
  const match = /^(`{3,})markdown\n([\s\S]+)\n\1$/.exec(body);
  if (b <= a || !match || !match[2].startsWith('# ') || /<!-- TEMPLATE:/.test(match[2]))
    throw Error('Malformed template section: ' + id);
  if (
    [...match[2].matchAll(/^ {0,3}(`{3,})[ \t]*$/gm)].some(
      (fence) => fence[1].length >= match[1].length,
    )
  )
    throw Error('Premature closing fence in template section: ' + id);
  const draft = ['brief', 'system-brief'].includes(id)
    ? 'BRIEF'
    : id === 'component-spec'
      ? 'SPEC'
      : null;
  if (draft && !match[2].includes('<!-- ' + draft + ':DRAFT -->'))
    throw Error('Template section must retain its draft marker: ' + id);
  return match[2].trimEnd() + '\n';
}

export function initJournal(project, id, options = {}) {
  identifier(id);
  identifier(project.id);
  if (
    Object.keys(options).some(
      (key) =>
        ![
          'component',
          'action',
          'object',
          'title',
          'directory',
          'root',
          'project',
          'system',
          'briefText',
        ].includes(key),
    ) ||
    (options.title !== undefined && options.title !== null && typeof options.title !== 'string') ||
    (options.briefText !== undefined && typeof options.briefText !== 'string')
  )
    throw Error('Invalid task metadata');
  const { root } = project;
  if (
    journalFiles(root, project.environment).some(
      (p) => parseJournal(readFileSync(p, 'utf8')).id === id,
    )
  )
    throw Error('Task already exists');
  const component = options.component ? identifier(options.component) : null;
  const action = options.action ?? 'create',
    object = component
      ? 'component'
      : (options.object ?? (project.environment ? 'environment' : 'system'));
  if (project.environment && (component || object !== 'environment'))
    throw Error('Select a project for product tasks; factory tasks must have object=environment');
  if (!actions.includes(action) || !objects.includes(object)) throw Error('Invalid task route');
  const base = component ? 'component-specs/' + component : 'product-discovery';
  const directory =
    options.directory ??
    (project.environment
      ? '.local/tasks/' + id
      : existsSync(safePath(root, base + '/_process_log.md', true))
        ? base + '/tasks/' + id
        : base);
  const log = directory + '/_process_log.md',
    brief = directory + '/brief.md';
  if (existsSync(safePath(root, log, true)) || existsSync(safePath(root, brief, true)))
    throw Error('Task files already exist');
  const canonicalSpec = component ? base + '/spec.md' : null;
  const legacySpec =
    component && project.legacy ? 'docs/' + component + '-component-spec.md' : null;
  const spec =
    canonicalSpec && existsSync(safePath(root, canonicalSpec, true))
      ? canonicalSpec
      : legacySpec && existsSync(safePath(root, legacySpec, true))
        ? legacySpec
        : component && ['create', 'refine'].includes(action)
          ? canonicalSpec
          : null;
  if (spec && existsSync(safePath(root, spec, true)) && !lstatSync(safePath(root, spec)).isFile())
    throw Error('Invalid specification path');
  // Preflight all destinations before creating anything.
  for (const p of [directory, log, brief, ...(spec ? [spec] : [])]) safePath(root, p, true);
  const template = (name, fallback) => {
    const book = safePath(root, 'templates/specifications.md', true);
    const path = safePath(root, 'templates/' + name + '.md', true);
    return (
      existsSync(book)
        ? templateSection(readFileSync(book, 'utf8'), name)
        : existsSync(path)
          ? readFileSync(path, 'utf8')
          : fallback
    )
      .replaceAll('{{id}}', id)
      .replaceAll('{{component}}', component ?? '');
  };
  const briefText =
    options.briefText ??
    template(
      'brief',
      '# Brief: {{id}}\n\n<!-- BRIEF:DRAFT -->\n\n## Request and scope\n\n## Sources\n\n## Acceptance criteria\n',
    );
  const specText =
    spec && !existsSync(safePath(root, spec, true))
      ? template(
          'component-spec',
          '# Component specification: {{component}}\n\n<!-- SPEC:DRAFT -->\n\n## Behavior and API\n\n## States and token matrix\n\n## Accessibility\n\n## Verification\n',
        )
      : null;
  if (
    !briefText.includes('<!-- BRIEF:DRAFT -->') ||
    (specText !== null && !specText.includes('<!-- SPEC:DRAFT -->'))
  )
    throw Error('Local task template must retain its draft marker');
  mkdirSync(safePath(root, directory, true), { recursive: true });
  writeFileSync(safePath(root, brief, true), briefText, { flag: 'wx' });
  if (specText !== null) writeFileSync(safePath(root, spec, true), specText, { flag: 'wx' });
  const state = {
    version: 2,
    id,
    system: project.id,
    title: options.title ?? null,
    action,
    object,
    status: 'discovery',
    revision: 1,
    updatedAt: now(),
    scope: null,
    brief: reference(root, brief),
    spec: spec ? reference(root, spec) : null,
    nextStep: 'Complete briefing',
    questions: [],
    decisions: [],
    inputs: [],
    evidence: [],
    exceptions: [],
    specApproval: null,
    acceptance: null,
    blockedReason: null,
    returnStatus: null,
  };
  validate(root, state);
  writeFileSync(
    safePath(root, log, true),
    '# Task: ' +
      id +
      '\n\n<!-- prettier-ignore-start -->\n\n' +
      renderState(state) +
      '\n\n<!-- prettier-ignore-end -->\n\n## Journal\n\n- ' +
      now() +
      ': task created; unknown requirements remain open.\n',
    { flag: 'wx' },
  );
  return readJournal(root, log);
}

export function updateJournal(root, path, expected, patch = {}, mode = 'update') {
  const initial = readJournal(root, path);
  if (expected !== initial.token) throw Error('State conflict: reload before updating');
  if (Object.keys(patch).some((k) => !editable.has(k)))
    throw Error('Unknown or immutable task field');
  const next = { ...initial.state, ...patch };
  if (!transitions[initial.state.status].includes(next.status))
    throw Error('Invalid status transition');
  if (
    ['blocked', 'paused'].includes(next.status) &&
    !['blocked', 'paused'].includes(initial.state.status)
  )
    next.returnStatus = initial.state.status;
  if (mode === 'refresh') {
    next.brief = reference(root, next.brief.path);
    next.spec = next.spec ? reference(root, next.spec.path) : null;
    next.inputs = next.inputs.map((r) => reference(root, r.path));
    if (next.status === 'accepted' && initial.stale.length) {
      next.status = 'review';
      next.acceptance = null;
    }
  }
  if (mode === 'approve-spec') {
    if (
      !next.spec ||
      readFileSync(safePath(root, next.spec.path), 'utf8').includes('<!-- SPEC:DRAFT -->')
    )
      throw Error('Complete the component specification first');
    if (!patch.decisions?.length) throw Error('Owner decision note is required');
    next.spec = reference(root, next.spec.path);
    next.specApproval = { by: 'owner', note: patch.decisions.at(-1), sha256: next.spec.sha256 };
  }
  next.revision++;
  next.updatedAt = now();
  validate(root, next);
  const fresh = [next.brief, next.spec, ...next.inputs]
    .filter(Boolean)
    .every((r) => reference(root, r.path).sha256 === r.sha256);
  const fingerprint = journalFingerprint(next);
  if (
    mode !== 'refresh' &&
    ['ready', 'implementation', 'review', 'accepted'].includes(next.status) &&
    (!fresh ||
      next.evidence.some(
        (e) =>
          e.fingerprint !== fingerprint ||
          e.artifacts.some((r) => reference(root, r.path).sha256 !== r.sha256),
      ))
  )
    throw Error('Stale inputs/evidence: inspect changes and refresh; do not reuse checks blindly');
  const full = safePath(root, path),
    lock = full + '.lock';
  let fd, temporary;
  try {
    fd = openSync(lock, 'wx', 0o600);
    if (hash(readFileSync(full)) !== expected)
      throw Error('State conflict: reload before updating');
    const old = readFileSync(full, 'utf8');
    const revised =
      old.slice(0, old.indexOf(START)) +
      renderState(next) +
      old.slice(old.indexOf(END) + END.length);
    const history = relative(root, join(dirname(full), 'history'))
      .split('\\')
      .join('/');
    mkdirSync(safePath(root, history, true), { recursive: true });
    const saved = history + '/' + initial.state.revision + '-' + expected + '.md';
    if (!existsSync(safePath(root, saved, true)))
      writeFileSync(safePath(root, saved, true), old, { flag: 'wx' });
    temporary = full + '.' + randomUUID() + '.tmp';
    const output =
      revised +
      '\n- ' +
      now() +
      ': ' +
      initial.state.status +
      ' → ' +
      next.status +
      '; revision ' +
      next.revision +
      '.\n';
    const out = openSync(temporary, 'wx', 0o600);
    try {
      writeFileSync(out, output);
      fsyncSync(out);
    } finally {
      closeSync(out);
    }
    if (hash(readFileSync(full)) !== expected) throw Error('State conflict during write');
    renameSync(temporary, full);
    temporary = null;
  } finally {
    if (temporary && existsSync(temporary)) unlinkSync(temporary);
    if (fd !== undefined) {
      closeSync(fd);
      unlinkSync(lock);
    }
  }
  return readJournal(root, path);
}

export async function main(args = process.argv.slice(2)) {
  try {
    if (args[0] === 'legacy')
      throw Error(
        'JSON v1 runtime is retired; historical receipts are read-only evidence inside the system history.',
      );
    const [command, ...rest] = args;
    if (['--help', 'help'].includes(command)) {
      console.log(
        'env:task init|list|resume|check|update|refresh|approve-spec|ref [id] --root path [--project id] [--component name] [--action create|refine|repair|audit|research|document|release] [--object environment for factory init] [--journal path] [--patch file --expect token]',
      );
      return;
    }
    const allowed = {
      init: ['root', 'project', 'system', 'component', 'action', 'object', 'title', 'journal'],
      list: ['root', 'project', 'system'],
      resume: ['root', 'project', 'system', 'journal'],
      check: ['root', 'project', 'system', 'journal'],
      update: ['root', 'project', 'system', 'patch', 'expect', 'journal'],
      refresh: ['root', 'project', 'system', 'expect', 'journal'],
      'approve-spec': ['root', 'project', 'system', 'expect', 'note', 'journal'],
      ref: ['root', 'project', 'system'],
    };
    if (!allowed[command]) throw Error('Unknown task command; use --help');
    let id = null;
    const options = {};
    for (let i = 0; i < rest.length; i++) {
      if (!rest[i].startsWith('--') && id === null) {
        id = rest[i];
        continue;
      }
      const key = rest[i].slice(2);
      if (
        !rest[i].startsWith('--') ||
        !allowed[command].includes(key) ||
        Object.hasOwn(options, key) ||
        !rest[i + 1] ||
        rest[i + 1].startsWith('--')
      )
        throw Error('Invalid command options');
      options[key] = rest[++i];
    }
    if (options.project && options.system)
      throw Error('Use only --project, not both project selectors');
    const project = projectContext(
        options.root ?? process.cwd(),
        options.project ?? options.system ?? null,
      ),
      root = project.root;
    if (project.environment) {
      if (command === 'init' && (options.object !== 'environment' || options.component))
        throw Error('Select a project with --project; factory init requires --object environment');
      if (
        options.journal &&
        !/^\.local\/tasks\/[a-z0-9]+(?:-[a-z0-9]+)*\/_process_log\.md$/.test(options.journal)
      )
        throw Error('Factory journal must be .local/tasks/<id>/_process_log.md');
      if (
        command === 'init' &&
        options.journal &&
        options.journal !== '.local/tasks/' + id + '/_process_log.md'
      )
        throw Error('Factory journal ID must match the task ID');
    } else if (command === 'init' && options.journal)
      throw Error('Project task placement is determined by its project/component');
    let result;
    if (command === 'list')
      result = journalFiles(root, project.environment)
        .map((p) => readJournal(root, relative(root, p).split('\\').join('/')))
        .map(({ path, state, stale }) => ({
          path,
          id: state.id,
          title: state.title,
          status: state.status,
          stale,
        }));
    else if (command === 'init') {
      const { journal, ...initOptions } = options;
      void journal;
      result = initJournal(project, id, initOptions);
    } else if (command === 'ref') result = reference(root, id);
    else {
      const current = options.journal
        ? readJournal(root, options.journal)
        : findJournal(root, id, project.environment);
      const historicalEnvironment = project.environment && current.state.object === 'environment';
      if (
        current.state.id !== id ||
        (!historicalEnvironment && current.state.system !== project.id)
      )
        throw Error('Journal belongs to a different task or system');
      if (command === 'resume' || command === 'check') {
        result = current;
        if (command === 'check' && current.stale.length)
          throw Error('Stale task: ' + current.stale.join(', '));
      } else {
        const patch =
          command === 'update'
            ? JSON.parse(
                readFileSync(options.patch === '-' ? 0 : safePath(root, options.patch), 'utf8'),
              )
            : command === 'approve-spec'
              ? { decisions: [...current.state.decisions, options.note] }
              : {};
        result = updateJournal(root, current.path, options.expect, patch, command);
      }
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
