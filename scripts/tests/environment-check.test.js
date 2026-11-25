import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  mkdtempSync,
  cpSync,
  rmSync,
  existsSync,
  symlinkSync,
} from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { checkEnvironment, routeTask, links, skillMetadata } from '../environment/check.js';
import { initTask, updateTask } from '../environment/task-state.js';

const project = process.cwd();
const checker = resolve('scripts/environment/check.js');
const router = resolve('scripts/environment/route.js');
const readJson = (root, name) => JSON.parse(readFileSync(join(root, name), 'utf8'));
const saveJson = (root, name, value) =>
  writeFileSync(join(root, name), JSON.stringify(value, null, 2) + '\n');
function walk(root, folder = '') {
  return readdirSync(join(root, folder), { withFileTypes: true }).flatMap((entry) => {
    const path = folder ? folder + '/' + entry.name : entry.name;
    if (path.startsWith('.git')) return [];
    return entry.isDirectory() ? walk(root, path) : [path];
  });
}
function snapshot(root) {
  return walk(root)
    .sort()
    .map((p) => [
      p,
      createHash('sha256')
        .update(readFileSync(join(root, p)))
        .digest('hex'),
    ]);
}
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-environment-check-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const copy = (path) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(project, path), join(root, path), { recursive: true });
  };
  for (const path of [
    'docs/environment',
    '.agents/skills',
    'docs/environment-rule-map.json',
    'AGENTS.md',
    'CLAUDE.md',
    'cursor_instruction.md',
  ])
    copy(path);
  const registry = readJson(root, 'docs/environment/registry.json');
  const targets = readJson(project, registry.migration.ledger).records.map((r) => r.actualTarget);
  for (const path of new Set(targets)) if (!existsSync(join(root, path))) copy(path);
  // Copy only referenced files; never copy local tasks, credentials, build output or user data.
  for (const source of walk(root).filter(
    (p) => p.endsWith('.md') && !p.startsWith('docs/environment/references/'),
  )) {
    for (const href of links(readFileSync(join(root, source), 'utf8'))) {
      if (/^(?:https?:|mailto:|#)/.test(href)) continue;
      const path = relative(
        project,
        resolve(project, dirname(source), decodeURIComponent(href.split(/[?#]/)[0])),
      );
      if (!existsSync(join(root, path))) copy(path);
    }
  }
  return root;
}
const alterRegistry = (root, mutate) => {
  const data = readJson(root, 'docs/environment/registry.json');
  mutate(data);
  saveJson(root, 'docs/environment/registry.json', data);
};
const alterLedger = (root, mutate) => {
  const data = readJson(root, 'docs/environment/migration-ledger.json');
  mutate(data);
  saveJson(root, 'docs/environment/migration-ledger.json', data);
};
const rewrite = (root, path, change) =>
  writeFileSync(join(root, path), change(readFileSync(join(root, path), 'utf8')));
function rejected(root, code) {
  const result = checkEnvironment(root);
  assert.equal(result.passed, false);
  assert.ok(
    result.findings.some((f) => f.code === code),
    JSON.stringify(result),
  );
}

test('repository structure passes without reading or creating private task state', (t) => {
  const root = fixture(t);
  mkdirSync(join(root, '.local/tasks/private'), { recursive: true });
  writeFileSync(join(root, '.local/tasks/private/state.json'), 'private malformed input');
  const before = snapshot(root);
  const report = checkEnvironment(root);
  assert.equal(report.passed, true, JSON.stringify(report));
  assert.equal(report.checks.find((c) => c.code === 'migration').count, 959);
  assert.equal(report.checks.find((c) => c.code === 'skills').count, 9);
  assert.ok(!JSON.stringify(report).includes('private malformed input'));
  assert.deepEqual(snapshot(root), before);
});
test('audit selects report workflow and mandatory standards; repair and creation select implementation', (t) => {
  const root = fixture(t);
  const audit = routeTask(root, { action: 'audit', object: 'component' });
  assert.deepEqual(audit.skills, ['.agents/skills/ds-quality-audit/SKILL.md']);
  assert.ok(audit.standards.includes('docs/environment/standards/components.md'));
  assert.ok(audit.standards.includes('docs/environment/standards/quality.md'));
  assert.deepEqual(routeTask(root, { action: 'repair', object: 'component' }).skills, [
    '.agents/skills/ds-component-repair/SKILL.md',
  ]);
  assert.deepEqual(routeTask(root, { action: 'create', object: 'component' }).skills, [
    '.agents/skills/ds-component-create/SKILL.md',
  ]);
});
test('research and parity modes preserve requested action and do not authorize publication', (t) => {
  const root = fixture(t);
  const research = routeTask(root, { action: 'create', object: 'component', mode: 'research' });
  assert.deepEqual(research.skills, ['.agents/skills/ds-research-design/SKILL.md']);
  const parity = routeTask(root, { action: 'audit', object: 'component', mode: 'parity' });
  assert.deepEqual(parity.skills, [
    '.agents/skills/ds-figma-parity/SKILL.md',
    '.agents/skills/ds-quality-audit/SKILL.md',
  ]);
  assert.ok(parity.standards.includes('docs/environment/standards/figma.md'));
  assert.equal(
    routeTask(root, { action: 'release', object: 'component' }).externalAuthorization,
    'not-evaluated',
  );
  assert.throws(
    () => routeTask(root, { action: 'release', object: 'component', mode: 'parity' }),
    /Unsupported/,
  );
});
test('unimplemented icon and chart builders are explicit, not successful component handoffs', (t) => {
  const root = fixture(t);
  for (const object of ['icons', 'chart']) {
    const result = routeTask(root, { action: 'create', object });
    assert.equal(result.supported, false);
    assert.deepEqual(result.skills, []);
    assert.ok(result.reason);
  }
});
const mutations = [
  [
    'broken file link',
    'links',
    (r) =>
      rewrite(r, 'docs/environment/onboarding.md', (s) => s + '\n[Missing](missing-file.md)\n'),
  ],
  [
    'missing mandatory standard link',
    'instruction-routing',
    (r) =>
      rewrite(r, 'docs/environment/domains/components.md', (s) =>
        s.replace('[tokens](../standards/tokens.md)', 'tokens'),
      ),
  ],
  [
    'unknown domain standard',
    'instruction-routing',
    (r) => alterRegistry(r, (d) => d.domains[0].standards.push('missing')),
  ],
  [
    'audit misrouted to creation',
    'instruction-routing',
    (r) =>
      alterRegistry(r, (d) => {
        d.actionSkills.audit = 'ds-component-create';
      }),
  ],
  [
    'archive used as active standard',
    'instruction-routing',
    (r) =>
      alterRegistry(r, (d) => {
        d.standards[0].path = 'docs/environment/references/legacy-claude.md';
      }),
  ],
  [
    'unregistered standard',
    'instruction-routing',
    (r) => writeFileSync(join(r, 'docs/environment/standards/extra.md'), '# Extra\n'),
  ],
  [
    'skill name mismatch',
    'skills',
    (r) =>
      rewrite(r, '.agents/skills/ds-intake/SKILL.md', (s) =>
        s.replace('name: ds-intake', 'name: ds-documentation'),
      ),
  ],
  [
    'unfinished skill description',
    'skills',
    (r) =>
      rewrite(r, '.agents/skills/ds-intake/SKILL.md', (s) =>
        s.replace(/description: .*/, 'description: "[TODO: finish]"'),
      ),
  ],
  [
    'unregistered skill',
    'skills',
    (r) => {
      mkdirSync(join(r, '.agents/skills/extra'));
      writeFileSync(join(r, '.agents/skills/extra/SKILL.md'), 'extra');
    },
  ],
  [
    'duplicate client registration',
    'skills',
    (r) => {
      mkdirSync(join(r, '.claude/skills/ds-intake'), { recursive: true });
      cpSync(
        join(r, '.agents/skills/ds-intake/SKILL.md'),
        join(r, '.claude/skills/ds-intake/SKILL.md'),
      );
    },
  ],
  ['missing migration record', 'migration', (r) => alterLedger(r, (d) => d.records.pop())],
  [
    'duplicate migration ID',
    'migration',
    (r) =>
      alterLedger(r, (d) => {
        d.records[1].sourceId = d.records[0].sourceId;
      }),
  ],
  [
    'missing migrated destination',
    'migration',
    (r) =>
      alterLedger(r, (d) => {
        d.records[0].actualTarget = 'missing-target.md';
      }),
  ],
  [
    'archive marked active',
    'migration',
    (r) =>
      alterLedger(r, (d) => {
        d.records[0].actualTarget = 'docs/environment/references/legacy-claude.md';
      }),
  ],
  [
    'archival source data changed',
    'migration',
    (r) => {
      const name = 'docs/environment/references/legacy-sources.json';
      const d = readJson(r, name);
      d.sources[0].text += '\nchanged';
      saveJson(r, name, d);
    },
  ],
  [
    'archival Markdown changed',
    'migration',
    (r) => rewrite(r, 'docs/environment/references/legacy-claude.md', (s) => s + '\nchanged\n'),
  ],
  [
    'frozen requirement map changed',
    'migration',
    (r) => rewrite(r, 'docs/environment-rule-map.json', (s) => s + '\n'),
  ],
  [
    'unsupported registry field',
    'registry',
    (r) =>
      alterRegistry(r, (d) => {
        d.unreviewed = true;
      }),
  ],
  [
    'schema no longer matches runtime',
    'task-schema',
    (r) => {
      const name = 'docs/environment/schemas/task-state.schema.json';
      const d = readJson(r, name);
      d.required = d.required.filter((k) => k !== 'evidence');
      saveJson(r, name, d);
    },
  ],
];
for (const [name, code, mutate] of mutations)
  test('diagnostic rejects ' + name + ' without rewriting data', (t) => {
    const root = fixture(t);
    mutate(root);
    const before = snapshot(root);
    rejected(root, code);
    assert.deepEqual(snapshot(root), before);
  });
test('file reference cannot escape workspace through a symlink', (t) => {
  const root = fixture(t);
  const outside = mkdtempSync(join(tmpdir(), 'ds-environment-outside-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, 'data.md'), '# external');
  rmSync(join(root, 'docs/environment/standards/tasks.md'));
  symlinkSync(join(outside, 'data.md'), join(root, 'docs/environment/standards/tasks.md'));
  rejected(root, 'registry');
});
test('Markdown examples are not live links; reference definitions and Claude imports are checked', () => {
  assert.deepEqual(
    links(
      '```md\n[example](absent.md)\n```\n[real](real.md#part)\n[ref]: more.md\n@AGENTS.md\n`[inline](no.md)`',
    ),
    ['real.md#part', 'more.md', 'AGENTS.md'],
  );
  assert.throws(
    () => skillMetadata('---\nname: valid\ndescription: |\n  unsupported multiline\n---\n'),
    /Supported|Unsupported/,
  );
});
test('CLI works from subdirectories, fails closed on malformed options and emits structured failures', (t) => {
  const root = fixture(t);
  execFileSync('git', ['init', '--quiet', root]);
  const invoke = (script, args) =>
    spawnSync(process.execPath, [script, ...args], { cwd: join(root, 'docs'), encoding: 'utf8' });
  assert.equal(invoke(checker, []).status, 0);
  for (const args of [
    ['--force'],
    ['--root', root, '--root', root],
    ['--task'],
    ['--root', 'missing-root'],
  ]) {
    const r = invoke(checker, args);
    assert.notEqual(r.status, 0);
    assert.equal(JSON.parse(r.stdout).passed, false);
  }
  const badRoute = invoke(router, ['--root', root, '--action', 'unknown', '--object', 'component']);
  assert.notEqual(badRoute.status, 0);
  rewrite(root, 'docs/environment/onboarding.md', (s) => s + '\n[broken](missing.md)\n');
  const badStructure = invoke(checker, ['--root', root]);
  assert.equal(badStructure.status, 1);
  assert.equal(JSON.parse(badStructure.stdout).passed, false);
});
test('explicit task diagnostic catches stale evidence and false accepted without exposing private fields', (t) => {
  const root = fixture(t);
  writeFileSync(join(root, '.gitignore'), '.local/\n');
  execFileSync('git', ['init', '--quiet', root]);
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', [
    '-C',
    root,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  ]);
  let value = initTask(root, 'task', {
    title: 'Private fixture title',
    route: { action: 'audit', object: 'environment', platform: 'web-react', delivery: ['report'] },
    scope: { summary: 'Private context' },
    inputs: ['docs/environment/skills.md'],
    nextStep: 'Check',
  });
  for (const status of ['ready', 'implementation', 'review'])
    value = updateTask(root, 'task', value.token, { status });
  assert.equal(checkEnvironment(root, { taskId: 'task' }).passed, true);
  rewrite(root, 'docs/environment/skills.md', (s) => s + '\nchanged input\n');
  const stale = checkEnvironment(root, { taskId: 'task' });
  assert.equal(stale.passed, false);
  assert.ok(stale.findings.some((f) => f.code === 'task-state'));
  const name = '.local/tasks/task/state.json';
  const data = readJson(root, name);
  data.status = 'accepted';
  saveJson(root, name, data);
  const result = checkEnvironment(root, { taskId: 'task' });
  assert.equal(result.passed, false);
  assert.ok(!JSON.stringify(result).includes('Private fixture title'));
});

test('skill scalar validation distinguishes strings from booleans and rejects invalid metadata shapes', () => {
  for (const description of ['true', 'null', '123', '{}', "'bad'quote'"])
    assert.throws(() =>
      skillMetadata('---\nname: example\ndescription: ' + description + '\n---\n'),
    );
  assert.equal(
    skillMetadata('---\nname: example\ndescription: "Inspect: current source"\n---\n').description,
    'Inspect: current source',
  );
});
