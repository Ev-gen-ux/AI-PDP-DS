import { readFileSync, readdirSync, lstatSync, realpathSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fileReference, loadTask, validateSchema, taskSchema } from './task-state.js';

const registryPath = 'docs/environment/registry.json';
const textType = { type: 'string', minLength: 1, pattern: '\\S' };
const list = (items) => ({ type: 'array', uniqueItems: true, items });
const object = (properties) => ({
  type: 'object',
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});
const actions = ['create', 'refine', 'repair', 'audit', 'document', 'release'];
const objects = ['component', 'tokens', 'icons', 'chart', 'documentation', 'environment'];
const modes = ['work', 'intake', 'research', 'parity'];
const identifier = { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 64 };
const nullableId = { ...identifier, type: ['string', 'null'] };
const registrySchema = object({
  schemaVersion: { const: 1 },
  entrypoints: list(textType),
  taskSchema: textType,
  standards: list(object({ id: identifier, path: textType })),
  domains: list(object({ id: identifier, path: textType, standards: list(identifier) })),
  workflows: list(textType),
  skills: list(
    object({
      id: identifier,
      path: textType,
      workflow: textType,
      mode: { enum: modes },
      actions: list({ enum: actions }),
      objects: list({ enum: objects }),
    }),
  ),
  targets: list(
    object({
      object: { enum: objects },
      domain: identifier,
      createSkill: nullableId,
      modifySkill: nullableId,
    }),
  ),
  actionSkills: object({ audit: identifier, document: identifier, release: identifier }),
  migration: object({
    sourceMap: textType,
    sourceMapSha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
    ledger: textType,
    archiveData: textType,
    archives: list(
      object({
        source: textType,
        path: textType,
        sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
      }),
    ),
  }),
});
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
function ensure(condition, message) {
  if (!condition) throw Error(message);
}
function read(root, path) {
  fileReference(root, path);
  return readFileSync(resolve(root, path), 'utf8');
}
function json(root, path) {
  return JSON.parse(read(root, path));
}
function unique(rows, key) {
  const map = new Map();
  for (const row of rows) {
    ensure(!map.has(row[key]), 'Duplicate ' + key + ': ' + row[key]);
    map.set(row[key], row);
  }
  return map;
}
function files(root, folder, name) {
  const output = [];
  if (!existsSync(resolve(root, folder))) return output;
  const walk = (path) => {
    const absolute = resolve(root, path);
    ensure(!lstatSync(absolute).isSymbolicLink(), 'Directory symlink is not supported: ' + path);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const child = path + '/' + entry.name;
      ensure(!entry.isSymbolicLink(), 'Inventory symlink is not supported: ' + child);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile() && name(entry.name)) output.push(child);
    }
  };
  walk(folder);
  return output.sort();
}
// Supported repository Markdown: inline links, reference definitions and Claude @ imports.
// Fenced examples and inline code are not treated as instructions or live links.
export function links(content) {
  const prose = content
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '')
    .replace(/`[^`\n]+`/g, '');
  return [
    ...prose.matchAll(
      /\[[^\]\n]*\]\((<[^>\n]+>|[^\s)]+)(?:\s+"[^"\n]*")?\)|^\s*\[[^\]\n]+\]:\s*(\S+)|^@([^\s]+\.md)\s*$/gm,
    ),
  ].map((m) => (m[1] ?? m[2] ?? m[3]).replace(/^<|>$/g, ''));
}
function localLink(root, source, href) {
  if (/^(?:https?:|mailto:)/i.test(href) || href.startsWith('#')) return null;
  ensure(
    !/^[a-z][a-z0-9+.-]*:/i.test(href) && !isAbsolute(href) && !href.startsWith('//'),
    'Unsupported link: ' + href,
  );
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  const destination = relative(root, resolve(root, dirname(source), path))
    .split(sep)
    .join('/');
  fileReference(root, destination);
  return destination;
}
function linked(root, source) {
  return links(read(root, source))
    .map((href) => localLink(root, source, href))
    .filter(Boolean);
}
function includesLinks(root, source, expected) {
  const actual = new Set(linked(root, source));
  for (const path of expected)
    ensure(actual.has(path), 'Missing instruction link in ' + source + ': ' + path);
}
export function skillMetadata(content) {
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(content.replaceAll('\r\n', '\n'));
  ensure(match, 'Missing skill frontmatter');
  const metadata = {};
  for (const line of match[1].split('\n')) {
    const pair = /^(name|description): (.+)$/.exec(line);
    ensure(
      pair && !Object.hasOwn(metadata, pair[1]),
      'Supported skill metadata: one-line name and description only',
    );
    let value = pair[2];
    if (value.startsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'")) {
      ensure(/^'(?:[^']|'')*'$/.test(value), 'Invalid single-quoted metadata');
      value = value.slice(1, -1).replaceAll("''", "'");
    } else {
      ensure(
        !/[:]\s|\s#/.test(value) && !'[]{}>&*!|'.includes(value[0]),
        'Unsupported plain YAML scalar',
      );
      ensure(
        !/^(?:true|false|null|~|[-+]?(?:\d+(?:\.\d+)?(?:e[-+]?\d+)?|\.inf|\.nan))$/i.test(value),
        'Metadata scalar must be a string',
      );
    }
    metadata[pair[1]] = value;
  }
  validateSchema(
    metadata,
    object({ name: identifier, description: { ...textType, maxLength: 1024 } }),
  );
  ensure(!/<|>/.test(metadata.description), 'Invalid description');
  ensure(!/\[TODO:/.test(content), 'Unfinished skill scaffold');
  return metadata;
}
function routeFromRegistry(registry, { action, object: targetObject, mode = 'work' }) {
  ensure(
    actions.includes(action) && objects.includes(targetObject) && modes.includes(mode),
    'Unknown action, object or mode',
  );
  const target = registry.targets.find((t) => t.object === targetObject);
  ensure(target, 'Missing target: ' + targetObject);
  let id =
    registry.actionSkills[action] ??
    (action === 'create' ? target.createSkill : target.modifySkill);
  const selected = [];
  if (mode !== 'work') {
    const candidates = registry.skills.filter(
      (s) => s.mode === mode && s.actions.includes(action) && s.objects.includes(targetObject),
    );
    ensure(candidates.length === 1, 'Unsupported or ambiguous route mode');
    selected.push(candidates[0].id);
    // Audit remains an audit; exploratory modes never silently select an implementation.
    if (action !== 'audit') id = null;
  }
  if (id) selected.push(id);
  const ids = [...new Set(selected)];
  for (const selectedId of ids) {
    const skill = registry.skills.find((s) => s.id === selectedId);
    ensure(
      skill && skill.actions.includes(action) && skill.objects.includes(targetObject),
      'Incompatible skill route: ' + selectedId,
    );
    if (mode === 'work') ensure(skill.mode === 'work', 'Specialized mode used as a default');
  }
  const domainIds = [
    ...new Set([
      target.domain,
      ...(action === 'audit' || action === 'release' ? ['quality'] : []),
      ...(action === 'document' ? ['documentation'] : []),
      ...(mode === 'parity' ? ['figma'] : []),
    ]),
  ];
  const domainRows = domainIds.map((id) => {
    const d = registry.domains.find((d) => d.id === id);
    ensure(d, 'Unknown domain: ' + id);
    return d;
  });
  const standardIds = [...new Set(['tasks', 'quality', ...domainRows.flatMap((d) => d.standards)])];
  const standards = standardIds.map((id) => {
    const s = registry.standards.find((s) => s.id === id);
    ensure(s, 'Unknown standard: ' + id);
    return s.path;
  });
  const skillRows = ids.map((id) => registry.skills.find((s) => s.id === id));
  return {
    action,
    object: targetObject,
    mode,
    supported: ids.length > 0,
    reason: ids.length
      ? null
      : 'No specialized implementation skill registered; use the domain and agree the required pilot or environment task',
    domains: domainRows.map((d) => d.path),
    standards,
    skills: skillRows.map((s) => s.path),
    workflows: [
      ...new Set([
        'docs/environment/workflows/task-start.md',
        ...skillRows.map((s) => s.workflow),
        'docs/environment/workflows/verify-deliver.md',
      ]),
    ],
    externalAuthorization: 'not-evaluated',
  };
}
export function checkEnvironment(root, { taskId } = {}) {
  root = realpathSync(root);
  const checks = [];
  const findings = [];
  const run = (code, fn) => {
    try {
      const count = fn();
      checks.push({ code, passed: true, ...(count === undefined ? {} : { count }) });
    } catch (error) {
      checks.push({ code, passed: false });
      findings.push({ code, message: error.message });
    }
  };
  let registry;
  run('registry', () => {
    registry = json(root, registryPath);
    validateSchema(registry, registrySchema);
    for (const key of ['standards', 'domains', 'skills']) unique(registry[key], 'id');
    unique(registry.targets, 'object');
    ensure(
      objects.every((o) => registry.targets.some((t) => t.object === o)),
      'Missing target object',
    );
    ensure(
      ['AGENTS.md', 'CLAUDE.md', 'cursor_instruction.md'].every((p) =>
        registry.entrypoints.includes(p),
      ),
      'Missing entrypoint',
    );
    for (const item of [...registry.standards, ...registry.domains, ...registry.skills])
      read(root, item.path);
  });
  if (findings.length) return { passed: false, scope: 'environment-structure', checks, findings };
  run('instruction-routing', () => {
    const standards = unique(registry.standards, 'id');
    const paths = [...registry.standards, ...registry.domains, ...registry.skills].map(
      (row) => row.path,
    );
    ensure(new Set(paths).size === paths.length, 'Multiple roles use the same instruction file');
    for (const standard of registry.standards)
      ensure(
        standard.path === 'docs/environment/standards/' + standard.id + '.md',
        'Standard must use its active canonical path',
      );
    for (const domain of registry.domains) {
      ensure(
        domain.path === 'docs/environment/domains/' + domain.id + '.md',
        'Invalid domain path',
      );
      ensure(
        ['tasks', 'quality'].every((id) => domain.standards.includes(id)),
        'Missing common standard: ' + domain.id,
      );
      const required = domain.standards.map((id) => {
        ensure(standards.has(id), 'Unknown domain standard');
        return standards.get(id).path;
      });
      includesLinks(root, domain.path, required);
    }
    includesLinks(root, 'AGENTS.md', [
      'docs/environment/standards/tasks.md',
      'docs/environment/standards/quality.md',
      ...registry.domains.map((d) => d.path),
      'docs/environment/skills.md',
    ]);
    for (const p of registry.entrypoints.filter((p) => p !== 'AGENTS.md'))
      includesLinks(root, p, ['AGENTS.md']);
    for (const [dir, declared] of [
      ['standards', registry.standards.map((s) => s.path)],
      ['domains', registry.domains.map((d) => d.path)],
      ['workflows', registry.workflows],
    ]) {
      const actual = files(root, 'docs/environment/' + dir, (name) => name.endsWith('.md'));
      ensure(
        JSON.stringify([...declared].sort()) === JSON.stringify(actual),
        'Unregistered or missing ' + dir + ' instruction',
      );
    }
    for (const path of registry.workflows) {
      const required = path.endsWith('/task-state.md')
        ? []
        : path.endsWith('/task-start.md')
          ? ['docs/environment/standards/tasks.md', 'docs/environment/standards/quality.md']
          : path.endsWith('/verify-deliver.md')
            ? ['docs/environment/standards/quality.md']
            : [
                'docs/environment/workflows/task-start.md',
                'docs/environment/workflows/verify-deliver.md',
              ];
      includesLinks(root, path, required);
    }
    for (const action of actions)
      for (const object of objects) routeFromRegistry(registry, { action, object });
    return registry.domains.length;
  });
  run('skills', () => {
    const inventory = files(root, '.agents/skills', (name) => name === 'SKILL.md');
    ensure(
      JSON.stringify(inventory) === JSON.stringify(registry.skills.map((s) => s.path).sort()),
      'Unregistered or missing canonical skill',
    );
    const names = new Set();
    for (const skill of registry.skills) {
      ensure(
        skill.path === '.agents/skills/' + skill.id + '/SKILL.md',
        'Invalid canonical skill path',
      );
      const meta = skillMetadata(read(root, skill.path));
      ensure(meta.name === skill.id && !names.has(meta.name), 'Duplicate or mismatched skill name');
      names.add(meta.name);
      ensure(registry.workflows.includes(skill.workflow), 'Unknown skill workflow');
      ensure(skill.actions.length && skill.objects.length, 'Empty skill trigger scope');
      includesLinks(root, skill.path, ['docs/environment/workflows/task-start.md', skill.workflow]);
      includesLinks(root, 'docs/environment/skills.md', [skill.path]);
    }
    for (const dir of ['.claude/skills', '.cursor/skills', '.codex/skills'])
      for (const path of files(root, dir, (name) => name === 'SKILL.md'))
        ensure(!names.has(skillMetadata(read(root, path)).name), 'Duplicate client skill: ' + path);
    return names.size;
  });
  run('links', () => {
    const docs = new Set([
      ...registry.entrypoints,
      ...registry.skills.map((s) => s.path),
      ...files(root, 'docs/environment', (name) => name.endsWith('.md')).filter(
        (p) => !p.startsWith('docs/environment/references/'),
      ),
    ]);
    let count = 0;
    for (const source of docs)
      for (const href of links(read(root, source))) {
        localLink(root, source, href);
        count++;
      }
    return count;
  });
  run('migration', () => {
    const { sourceMap, sourceMapSha256, ledger, archiveData, archives } = registry.migration;
    ensure(fileReference(root, sourceMap).sha256 === sourceMapSha256, 'Frozen source map changed');
    const map = json(root, sourceMap);
    const migration = json(root, ledger);
    const archive = json(root, archiveData);
    const sources = unique(map.sources, 'path');
    const entries = unique(map.entries, 'id');
    const records = unique(migration.records, 'sourceId');
    ensure(
      entries.size > 0 &&
        entries.size === records.size &&
        [...entries.keys()].every((id) => records.has(id)),
      'Incomplete migration coverage',
    );
    ensure(
      localLink(root, ledger, migration.sourceMap) === sourceMap,
      'Ledger points to a different source map',
    );
    for (const row of migration.records) {
      const target = row.actualTarget;
      read(root, target);
      ensure(
        [
          'aligned-template',
          'archived-reference',
          'consolidated',
          'preserved-in-place',
          'preserved-with-status-note',
        ].includes(row.disposition),
        'Unknown migration disposition',
      );
      ensure(
        (row.disposition === 'archived-reference') ===
          target.startsWith('docs/environment/references/'),
        'Active/archived role mismatch',
      );
      ensure(typeof row.reason === 'string' && row.reason.trim(), 'Missing migration reason');
      read(root, 'docs/environment/decisions/' + row.decision + '.md');
    }
    const archived = unique(archive.sources, 'path');
    const archivePaths = unique(archives, 'source');
    ensure(archived.size === archivePaths.size, 'Incomplete archival inventory');
    for (const [path, row] of archived) {
      ensure(sources.has(path) && archivePaths.has(path), 'Unknown archived source');
      ensure(
        sha(row.text) === row.sha256 && row.sha256 === sources.get(path).sha256,
        'Corrupt archival source data',
      );
      ensure(
        fileReference(root, archivePaths.get(path).path).sha256 === archivePaths.get(path).sha256,
        'Changed archival Markdown',
      );
    }
    return records.size;
  });
  run('task-schema', () => {
    ensure(
      JSON.stringify(json(root, registry.taskSchema)) === JSON.stringify(taskSchema),
      'Task schema differs from the loaded runtime schema',
    );
    return taskSchema.properties.schemaVersion.const;
  });
  if (taskId !== undefined)
    run('task-state', () => {
      const t = loadTask(root, taskId);
      // Report only classifications, not private task contents or evidence methods.
      ensure(
        !t.stale.length && !t.problems.length,
        'Task has stale inputs/evidence or inconsistent state',
      );
      validateSchema(t.state, taskSchema);
      return 1;
    });
  return {
    passed: findings.length === 0,
    scope: 'environment-structure',
    checks,
    findings,
    limitations: [
      'No natural-language routing or client-discovery evaluation',
      'No semantic equivalence proof for migrated rules',
      'No Figma visual parity, accessibility certification or publication proof',
      'Markdown file links only; anchors and external URLs are not checked',
      'Local tasks are not scanned unless --task is explicitly supplied',
    ],
  };
}
export function routeTask(root, options) {
  const report = checkEnvironment(root);
  ensure(
    report.passed,
    'Environment check failed: ' + report.findings.map((f) => f.code).join(', '),
  );
  return routeFromRegistry(json(root, registryPath), options);
}
function cli(command) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    ensure(args.length === 1, 'Unexpected arguments');
    console.log(
      'env:check [--root path] [--task id]\nenv:route --action create|refine|repair|audit|document|release --object component|tokens|icons|chart|documentation|environment [--mode work|intake|research|parity] [--root path]',
    );
    return;
  }
  const allowed =
    command === 'route' ? ['--root', '--action', '--object', '--mode'] : ['--root', '--task'];
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    ensure(
      allowed.includes(args[i]) &&
        args[i + 1] &&
        !args[i + 1].startsWith('--') &&
        !Object.hasOwn(options, args[i]),
      'Unknown, duplicate or incomplete option',
    );
    options[args[i]] = args[i + 1];
  }
  const root =
    options['--root'] ??
    execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const result =
    command === 'check'
      ? checkEnvironment(root, { taskId: options['--task'] })
      : routeTask(root, {
          action: options['--action'],
          object: options['--object'],
          mode: options['--mode'] ?? 'work',
        });
  console.log(JSON.stringify(result, null, 2));
  if (result.passed === false) process.exitCode = 1;
}
export function main(command = 'check') {
  try {
    cli(command);
  } catch (error) {
    console.log(JSON.stringify({ passed: false, error: error.message }));
    process.exitCode = 1;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
