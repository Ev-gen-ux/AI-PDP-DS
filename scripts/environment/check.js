import { readFileSync, readdirSync, existsSync, realpathSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { identifier, safePath, projectContext } from './project.js';
import { findJournal, readJournal } from './journal.js';
import { linked } from './links.js';
export { links } from './links.js';

const registryPath = 'config/routes.json';
const actions = ['create', 'refine', 'repair', 'audit', 'research', 'document', 'release'];
const modes = ['work', 'intake', 'research', 'parity'];
const objects = ['system', 'component', 'tokens', 'documentation', 'environment', 'icons', 'chart'];
const ensure = (value, message) => {
  if (!value) throw Error(message);
};
const read = (root, path) => readFileSync(safePath(root, path), 'utf8');
const json = (root, path) => JSON.parse(read(root, path));
function unique(rows, key) {
  ensure(Array.isArray(rows), 'Expected registry list');
  const result = new Map();
  for (const row of rows) {
    identifier(row[key]);
    ensure(!result.has(row[key]), 'Duplicate ' + key + ': ' + row[key]);
    result.set(row[key], row);
  }
  return result;
}
function files(root, folder, name) {
  if (!existsSync(safePath(root, folder, true))) return [];
  return readdirSync(safePath(root, folder), { withFileTypes: true })
    .flatMap((entry) => {
      const path = folder + '/' + entry.name;
      safePath(root, path);
      return entry.isDirectory() ? files(root, path, name) : name(entry.name) ? [path] : [];
    })
    .sort();
}
export function skillMetadata(content) {
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(content.replaceAll('\r\n', '\n'));
  ensure(match, 'Missing skill frontmatter');
  const metadata = {};
  for (const line of match[1].split('\n')) {
    const pair = /^(name|description): (.+)$/.exec(line);
    ensure(
      pair && !Object.hasOwn(metadata, pair[1]),
      'Supported metadata: one-line name and description only',
    );
    let value = pair[2];
    if (value.startsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'")) {
      ensure(/^'(?:[^']|'')*'$/.test(value), 'Invalid quoted metadata');
      value = value.slice(1, -1).replaceAll("''", "'");
    } else {
      ensure(!/:\s|\s#/.test(value) && !'[]{}>&*!|'.includes(value[0]), 'Invalid plain metadata');
      ensure(
        !/^(?:true|false|null|~|[-+]?(?:\d+(?:\.\d+)?|\.inf|\.nan))$/i.test(value),
        'Metadata must be a string',
      );
    }
    metadata[pair[1]] = value;
  }
  identifier(metadata.name);
  ensure(
    typeof metadata.description === 'string' &&
      metadata.description.trim() &&
      metadata.description.length <= 1024 &&
      !/[<>]/.test(metadata.description),
    'Invalid description',
  );
  ensure(!/\[TODO:/.test(content), 'Unfinished scaffold');
  return metadata;
}
function routeFromRegistry(registry, { action, object, mode = 'work' }) {
  ensure(
    actions.includes(action) && objects.includes(object) && modes.includes(mode),
    'Unknown action, object or mode',
  );
  if (registry.deferredObjects.includes(object))
    return {
      action,
      object,
      mode,
      supported: false,
      reason: 'Excluded until owner explicitly reopens scope',
      skills: [],
      agentRecommendations: [],
      delegation: 'not available for deferred scope',
      workflows: [],
      standards: [],
      externalAuthorization: 'not-evaluated',
    };
  const target = registry.targets.find((t) => t.object === object);
  ensure(target, 'Missing target: ' + object);
  const ids = [];
  if (mode !== 'work') ids.push(registry.modeSkills[mode]);
  if (mode === 'work' || action === 'audit')
    ids.push(registry.actionSkills[action] ?? target.skill);
  const selected = [...new Set(ids)].map((id) => {
    const skill = registry.skills.find((s) => s.id === id);
    ensure(
      skill && skill.actions.includes(action) && skill.objects.includes(object),
      'Unsupported or incompatible skill route: ' + id,
    );
    return skill;
  });
  const standardIds = [
    ...new Set([
      'quality',
      'governance',
      ...target.standards,
      ...(action === 'release' ? ['releases'] : []),
      ...(mode === 'parity' ? ['figma'] : []),
    ]),
  ];
  return {
    action,
    object,
    mode,
    supported: selected.length > 0,
    implementationRoute: ['create', 'refine', 'repair'].includes(action) && mode === 'work',
    standards: standardIds.map((id) => {
      const row = registry.standards.find((s) => s.id === id);
      ensure(row, 'Unknown standard: ' + id);
      return row.path;
    }),
    skills: selected.map((s) => s.path),
    agentRecommendations: [...new Set(selected.flatMap((s) => s.agents))].map((id) => {
      const role = registry.roles.find((r) => r.id === id);
      ensure(role, 'Unknown recommended agent: ' + id);
      return { id, path: role.path, when: role.when };
    }),
    delegation: 'conditional; use coordination directive, not every role on every task',
    workflows: [...new Set([...registry.commonDirectives, ...selected.map((s) => s.workflow)])],
    externalAuthorization: 'not-evaluated',
  };
}
export function checkEnvironment(root, { taskId, journal, system } = {}) {
  root = realpathSync(root);
  const checks = [],
    findings = [];
  const run = (code, fn) => {
    try {
      const count = fn();
      checks.push({ code, passed: true, ...(count === undefined ? {} : { count }) });
    } catch (error) {
      checks.push({ code, passed: false });
      findings.push({ code, message: error.message });
    }
  };
  let registry,
    documents = [];
  run('registry', () => {
    registry = json(root, registryPath);
    const keys = [
      'schemaVersion',
      'entrypoints',
      'standards',
      'commonDirectives',
      'directives',
      'skills',
      'targets',
      'actionSkills',
      'modeSkills',
      'deferredObjects',
      'roles',
      'templates',
      'tooling',
    ];
    ensure(
      registry.schemaVersion === 2 &&
        Object.keys(registry).length === keys.length &&
        keys.every((k) => Object.hasOwn(registry, k)),
      'Unsupported registry structure',
    );
    for (const key of ['standards', 'skills', 'roles']) unique(registry[key], 'id');
    unique(registry.targets, 'object');
    for (const [key, expected] of [
      ['entrypoints', ['AGENTS.md', 'README.md', 'PROCESS.md', 'ARCHITECTURE.md']],
      ['deferredObjects', ['icons', 'chart']],
    ])
      ensure(
        JSON.stringify([...registry[key]].sort()) === JSON.stringify([...expected].sort()),
        'Invalid ' + key,
      );
    ensure(
      registry.targets.length === 5 &&
        objects
          .filter((o) => !registry.deferredObjects.includes(o))
          .every((o) => registry.targets.some((t) => t.object === o)),
      'Missing target',
    );
    documents = [
      ...registry.entrypoints,
      ...registry.standards.map((s) => s.path),
      ...registry.directives,
      ...registry.skills.map((s) => s.path),
    ];
    ensure(new Set(documents).size === documents.length, 'Duplicate canonical document');
    for (const path of [...documents, ...registry.templates, registry.tooling]) read(root, path);
    for (const key of ['commonDirectives', 'directives', 'templates'])
      ensure(new Set(registry[key]).size === registry[key].length, 'Duplicate ' + key);
    ensure(
      registry.commonDirectives.every((p) => registry.directives.includes(p)),
      'Unknown common directive',
    );
  });
  if (!findings.length) {
    run('instruction-routing', () => {
      for (const s of registry.standards)
        ensure(s.path === 'docs/standards/' + s.id + '.md', 'Invalid standard path');
      for (const [folder, declared] of [
        ['docs/standards', registry.standards.map((s) => s.path)],
        ['directives', registry.directives],
      ]) {
        ensure(
          JSON.stringify(files(root, folder, (n) => n.endsWith('.md'))) ===
            JSON.stringify([...declared].sort()),
          'Unregistered or missing canonical instruction: ' + folder,
        );
      }
      for (const [key, valid] of [
        ['actionSkills', actions],
        ['modeSkills', modes.filter((m) => m !== 'work')],
      ]) {
        ensure(
          Object.keys(registry[key]).every((k) => valid.includes(k)),
          'Invalid route key',
        );
        for (const id of Object.values(registry[key]))
          ensure(
            registry.skills.some((s) => s.id === id),
            'Unknown route skill',
          );
      }
      ensure(
        ['audit', 'research', 'document', 'release'].every((k) => registry.actionSkills[k]),
        'Missing action route',
      );
      ensure(
        modes.filter((m) => m !== 'work').every((k) => registry.modeSkills[k]),
        'Missing mode route',
      );
      for (const action of actions)
        for (const object of objects) routeFromRegistry(registry, { action, object });
      ensure(
        linked(root, 'AGENTS.md').includes('directives/intake.md'),
        'Missing AGENTS intake link',
      );
      for (const path of registry.entrypoints.filter((p) => p !== 'AGENTS.md'))
        ensure(linked(root, path).includes('AGENTS.md'), 'Missing entrypoint link: ' + path);
      return registry.targets.length;
    });
    run('skills', () => {
      ensure(
        JSON.stringify(files(root, 'skills', (n) => n === 'SKILL.md')) ===
          JSON.stringify(registry.skills.map((s) => s.path).sort()),
        'Unregistered or missing skill',
      );
      for (const skill of registry.skills) {
        ensure(
          Array.isArray(skill.agents) &&
            new Set(skill.agents).size === skill.agents.length &&
            skill.agents.every((id) => registry.roles.some((r) => r.id === id)),
          'Unknown or duplicate recommended agent',
        );
        ensure(
          skill.path === 'skills/' + skill.id + '/SKILL.md' &&
            skillMetadata(read(root, skill.path)).name === skill.id,
          'Mismatched canonical skill',
        );
        ensure(registry.directives.includes(skill.workflow), 'Unknown skill directive');
        ensure(
          skill.actions.length &&
            skill.actions.every((a) => actions.includes(a)) &&
            skill.objects.length &&
            skill.objects.every((o) => objects.includes(o)),
          'Invalid skill scope',
        );
        const refs = linked(root, skill.path);
        ensure(
          refs.includes('directives/intake.md') && refs.includes(skill.workflow),
          'Skill missing procedure link',
        );
      }
      return registry.skills.length;
    });
    run('roles', () => {
      ensure(
        JSON.stringify(files(root, 'agents', (n) => n.endsWith('.toml'))) ===
          JSON.stringify(registry.roles.map((s) => s.path).sort()),
        'Unregistered or missing role',
      );
      for (const role of registry.roles) {
        ensure(
          typeof role.when === 'string' && role.when.trim(),
          'Missing agent invocation condition',
        );
        ensure(role.path === 'agents/' + role.id + '.toml', 'Invalid role path');
        const text = read(root, role.path);
        ensure(
          text.includes('name = "' + role.id + '"') &&
            /^description = ".+"$/m.test(text) &&
            /developer_instructions = """\n[\s\S]+\n"""/.test(text),
          'Missing role metadata',
        );
        ensure(
          !/^(model|model_reasoning_effort|sandbox_mode)\s*=/m.test(text),
          'Unexpected role runtime override',
        );
      }
      return registry.roles.length;
    });
    run('links', () => documents.reduce((count, path) => count + linked(root, path).length, 0));
    run('tooling-manifest', () => {
      const kit = json(root, registry.tooling);
      ensure(kit.schemaVersion === 1 && /^\d+\.\d+\.\d+$/.test(kit.version), 'Invalid kit version');
      ensure(
        kit.files.length > 0 && new Set(kit.files.map((f) => f.target)).size === kit.files.length,
        'Duplicate/empty kit targets',
      );
      for (const row of kit.files) {
        read(root, row.source);
        safePath(root, row.target, true);
      }
      return kit.files.length;
    });
    if (taskId !== undefined || journal !== undefined)
      run('task-state', () => {
        const project = projectContext(root, system ?? null);
        const current = journal
          ? readJournal(project.root, journal)
          : findJournal(project.root, taskId);
        ensure(
          (!taskId || current.state.id === taskId) &&
            current.state.system === project.id &&
            !current.stale.length,
          'Task has stale or inconsistent state',
        );
        return 1;
      });
  }
  return {
    passed: !findings.length,
    scope: 'environment-structure',
    checks,
    findings,
    limitations: [
      'No client discovery, model behavior or semantic completeness proof',
      'No Figma visual parity, accessibility certification, publication or full library handoff proof',
      'Local Markdown files only; anchors/external URLs are not checked',
      'Local tasks are not scanned unless explicitly selected',
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
export function main(command = 'check') {
  try {
    const args = process.argv.slice(2),
      options = {};
    if (args.length === 1 && args[0] === '--help') {
      console.log(
        'env:check [--root path] [--task id --project id | --journal path]\nenv:route --action create|refine|repair|audit|research|document|release --object system|component|tokens|documentation|environment [--mode work|intake|research|parity] [--root path]',
      );
      return;
    }
    const allowed =
      command === 'route'
        ? ['root', 'action', 'object', 'mode']
        : ['root', 'task', 'project', 'system', 'journal'];
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i].slice(2);
      ensure(
        args[i].startsWith('--') &&
          allowed.includes(key) &&
          args[i + 1] &&
          !args[i + 1].startsWith('--') &&
          !Object.hasOwn(options, key),
        'Unknown, duplicate or incomplete option',
      );
      options[key] = args[i + 1];
    }
    ensure(!(options.project && options.system), 'Use only --project, not both project selectors');
    const root = resolve(options.root ?? dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
    const result =
      command === 'route'
        ? routeTask(root, options)
        : checkEnvironment(root, {
            taskId: options.task,
            journal: options.journal,
            system: options.project ?? options.system,
          });
    console.log(JSON.stringify(result, null, 2));
    if (result.passed === false) process.exitCode = 1;
  } catch (error) {
    console.log(JSON.stringify({ passed: false, error: error.message }));
    process.exitCode = 1;
  }
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
