import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute } from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import { links } from './environment/links.js';

export const fullChecks = [
  'env:check',
  'tokens:build',
  'typecheck',
  'lint',
  'format:check',
  'test:coverage',
  'test:tooling',
  'build',
  'package:check',
  'storybook:build',
  'figma:check',
];

export function parseOptions(args) {
  const options = { plan: false };
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--plan' || flag === '--help') {
      const key = flag.slice(2);
      if (options[key]) throw new Error(`Duplicate option: ${flag}`);
      options[key] = true;
    } else if (flag === '--component' || flag === '--change') {
      const key = flag.slice(2);
      if (options[key] || !args[i + 1] || args[i + 1].startsWith('--'))
        throw new Error(`Expected one value for ${flag}`);
      options[key] = args[++i];
    } else throw new Error(`Unknown option: ${flag}`);
  }
  if (options.component && !/^[A-Za-z][A-Za-z0-9-]*$/.test(options.component))
    throw new Error('Component must be a name, not a path');
  if (Boolean(options.component) !== Boolean(options.change))
    throw new Error('Use --component <name> together with --change docs|logic|visual');
  if (options.change && !['docs', 'logic', 'visual'].includes(options.change))
    throw new Error('Unknown change type; choose docs, logic or visual');
  return options;
}

function files(root, folder) {
  if (!existsSync(resolve(root, folder))) return [];
  return readdirSync(resolve(root, folder), { withFileTypes: true })
    .flatMap((entry) => {
      const path = `${folder}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Unsupported symlink: ${path}`);
      return entry.isDirectory() ? files(root, path) : entry.isFile() ? [path] : [];
    })
    .sort();
}
const key = (name) => name.replaceAll('-', '').toLowerCase();
const slug = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const sha = (content) => createHash('sha256').update(content).digest('hex');

export function buildPlan(root, options) {
  if (!options.component)
    return {
      mode: 'full',
      checks: fullChecks.map((name) => ({
        name,
        command: 'npm',
        args: ['run', ...(name === 'env:check' ? ['--silent'] : []), name],
        reason: 'Existing full quality pipeline',
      })),
    };
  const candidates = ['src/components', 'src/layouts']
    .flatMap((folder) => files(root, folder))
    .filter((path) => /\.(tsx|ts)$/.test(path) && !/\.(test|stories|figma)\./.test(path))
    .filter(
      (path) =>
        key(
          path
            .split('/')
            .at(-1)
            .replace(/\.(tsx|ts)$/, ''),
        ) === key(options.component),
    );
  if (candidates.length !== 1)
    throw new Error(
      candidates.length
        ? `Ambiguous component: ${options.component}`
        : `Unknown component: ${options.component}`,
    );
  const source = candidates[0];
  const name = source
    .split('/')
    .at(-1)
    .replace(/\.(tsx|ts)$/, '');
  const directory = dirname(source);
  const siblings = files(root, directory).filter((path) => dirname(path) === directory);
  const resources = {
    source,
    spec: existsSync(resolve(root, `component-specs/${slug(name)}/spec.md`))
      ? `component-specs/${slug(name)}/spec.md`
      : existsSync(resolve(root, `docs/${slug(name)}-component-spec.md`))
        ? `docs/${slug(name)}-component-spec.md`
        : null,
    stories: siblings.filter((path) => path.startsWith(`${directory}/${name}.stories.`)),
    tests: siblings.filter((path) => path.startsWith(`${directory}/${name}.test.`)),
    mappings: siblings.filter(
      (path) =>
        path.startsWith(`${directory}/${name}.figma.`) ||
        path.startsWith(`${directory}/${name}CodeConnect.figma.`),
    ),
    exports: [`${directory}/index.ts`, 'src/index.ts'].filter((path) =>
      existsSync(resolve(root, path)),
    ),
  };
  const checks = [];
  const manual = [];
  const add = (name, command, args, reason) => checks.push({ name, command, args, reason });
  if (options.change === 'docs') {
    if (!resources.spec)
      throw new Error(
        `No canonical Spec found for ${name}; use a scoped documentation review instead`,
      );
    add(
      'format',
      process.execPath,
      ['node_modules/prettier/bin/prettier.cjs', '--check', resources.spec],
      'Documentation-only: format the canonical Spec',
    );
  } else {
    const code = [
      source,
      ...resources.stories,
      ...resources.tests,
      ...resources.exports.filter((p) => p !== 'src/index.ts'),
    ];
    add(
      'format',
      process.execPath,
      [
        'node_modules/prettier/bin/prettier.cjs',
        '--check',
        ...code,
        ...(resources.spec ? [resources.spec] : []),
      ],
      'Component implementation, examples, tests and Spec',
    );
    add(
      'typecheck',
      'npm',
      ['run', 'typecheck'],
      'Project-wide types: the current typecheck is not file-scoped',
    );
    add(
      'lint',
      process.execPath,
      ['node_modules/eslint/bin/eslint.js', ...code, '--max-warnings', '0'],
      'Lint the discovered component files without autofix',
    );
    if (options.change === 'logic' && resources.tests.length) {
      // Vitest file filters alone are substring matches. Include overrides its default discovery
      // to ensure a component run cannot accidentally select similarly named test files.
      add(
        'test',
        process.execPath,
        ['scripts/component-test.js', ...resources.tests],
        'Run only the explicitly discovered existing unit files; no coverage',
      );
    } else if (options.change === 'logic')
      manual.push({
        name: 'Regression',
        status: 'not-run',
        reason:
          'No existing unit file found; reproduce the changed behavior manually or add a justified regression test',
      });
  }
  if (resources.spec)
    add(
      'links',
      null,
      [],
      'Check local file links in the canonical Spec; anchors and remote URLs are not verified',
    );
  else
    manual.push({
      name: 'Spec',
      status: 'not-run',
      reason:
        'No dedicated canonical Spec found; locate a shared Spec or record sources before acceptance',
    });
  manual.push({
    name: 'Source and scope review',
    status: 'not-run',
    reason:
      'Compare Spec/API/stories and the actual diff; declared change type does not detect dependencies automatically',
  });
  if (options.change !== 'docs')
    manual.push({
      name: 'Behavior and accessibility',
      status: 'not-run',
      reason:
        'Review affected scenarios from Spec; unit PASS is not browser or accessibility acceptance',
    });
  if (options.change === 'visual')
    manual.push({
      name: 'Visual and themes',
      status: 'not-run',
      reason:
        'Inspect affected states/themes against the accepted design source in a browser; no screenshots are generated here',
    });
  return {
    mode: 'component',
    component: name,
    change: options.change,
    resources,
    checks,
    manual,
    notRun: [
      'Full coverage/tooling/build/package/Storybook/Code Connect pipeline and publication',
      ...(options.change === 'docs'
        ? ['Component code, stories, tests and other documentation are outside docs mode']
        : []),
      ...(options.change === 'visual'
        ? [
            'Unit tests: visual mode does not assert changed logic; use logic mode as well if needed',
          ]
        : []),
    ],
    limitations: [
      'Explicit scope only; no automatic import/token impact graph',
      'Tests in shared folders may exercise more than the named component; no new tests are created',
      'Shared tokens, dependencies, exports or build changes require broader checks',
      'Technical checks are not component acceptance or release readiness',
    ],
  };
}

function checkLinks(root, spec) {
  for (const href of links(readFileSync(resolve(root, spec), 'utf8'))) {
    if (/^(https?:|mailto:|#)/i.test(href)) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || isAbsolute(href))
      throw new Error(`Unsupported link: ${href}`);
    const destination = resolve(root, dirname(spec), decodeURIComponent(href.split(/[?#]/)[0]));
    const path = relative(root, destination);
    if (path === '..' || path.startsWith('../') || isAbsolute(path) || !existsSync(destination))
      throw new Error(`Missing or outside-repository link: ${href}`);
  }
}

export function executePlan(root, plan, execute = spawnSync) {
  return plan.checks.map((check) => {
    const start = Date.now();
    let result;
    if (check.name === 'links') {
      try {
        checkLinks(root, plan.resources.spec);
        result = {
          status: 0,
          stdout: 'Local file links passed; anchors and external URLs not checked',
        };
      } catch (error) {
        result = { status: 1, stderr: error.message };
      }
    } else {
      try {
        result = execute(check.command, check.args, {
          cwd: root,
          encoding: 'utf8',
          maxBuffer: 16 * 1024 * 1024,
        });
      } catch (error) {
        result = { status: null, error };
      }
    }
    const output = stripVTControlCharacters(
      `${result.stdout ?? ''}\n${result.stderr ?? ''}\n${result.error?.message ?? ''}`,
    );
    return {
      ...check,
      passed: result.status === 0 && !result.error,
      exitCode: result.status ?? null,
      seconds: Math.round((Date.now() - start) / 100) / 10,
      output,
    };
  });
}

function snapshot(root, plan) {
  const git = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  const revision = git(['rev-parse', 'HEAD']);
  const status = git(['status', '--porcelain']);
  const diff = git(['diff', 'HEAD', '--binary']);
  const manifest = [
    ...new Set(
      [
        plan.resources.source,
        plan.resources.spec,
        ...plan.resources.stories,
        ...plan.resources.tests,
        ...plan.resources.mappings,
        ...plan.resources.exports,
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'vitest.config.ts',
        'eslint.config.js',
        'scripts/quality-report.js',
        'scripts/component-quality.js',
        'scripts/component-test.js',
        ...files(root, 'tokens'),
        ...files(root, 'src/theme'),
      ].filter(Boolean),
    ),
  ]
    .sort()
    .map((file) => ({
      file,
      sha256: existsSync(resolve(root, file)) ? sha(readFileSync(resolve(root, file))) : null,
    }));
  return {
    revision: revision.status === 0 ? revision.stdout.trim() : null,
    workingTreeDirty: status.status === 0 ? Boolean(status.stdout.trim()) : null,
    trackedDiffSha256: diff.status === 0 ? sha(diff.stdout) : null,
    files: manifest,
    fingerprint: sha(JSON.stringify(manifest)),
    limitations: [
      'Fingerprint covers discovered resources, token/theme sources and listed configs; it is not a full dependency/environment hash',
    ],
  };
}

export function runComponentReport(root, plan) {
  const inputs = snapshot(root, plan);
  const results = executePlan(root, plan);
  const after = snapshot(root, plan);
  const inputsUnchanged = JSON.stringify(inputs) === JSON.stringify(after);
  const report = {
    ...plan,
    revision: inputs.revision,
    workingTreeDirty: inputs.workingTreeDirty,
    generatedAt: new Date().toISOString(),
    node: process.version,
    inputs,
    inputsUnchanged,
    passed: inputsUnchanged && results.every((r) => r.passed),
    acceptance: 'not-reviewed',
    results,
  };
  const folder = `.local/quality/components/${slug(plan.component)}/${plan.change}`;
  mkdirSync(resolve(root, folder), { recursive: true });
  for (const result of results)
    writeFileSync(resolve(root, folder, `${result.name}.log`), result.output);
  const markdown = `# AI-PDP-DS — component quality report\n\n${plan.component} · ${plan.change} · ${report.generatedAt}\n\nTechnical checks: ${report.passed ? 'PASS' : 'FAIL'}; inputs unchanged: ${inputsUnchanged}. Acceptance: not-reviewed.\n\n| Check | Result | Why |\n| --- | --- | --- |\n${results.map((r) => `| ${r.name} | ${r.passed ? 'PASS' : 'FAIL'} | ${r.reason} |`).join('\n')}\n\n## Manual checks — not run\n\n${plan.manual.map((m) => `- ${m.name}: ${m.reason}`).join('\n')}\n\n## Not run\n\n${plan.notRun.map((m) => `- ${m}`).join('\n')}\n\n## Limits\n\n${plan.limitations.map((m) => `- ${m}`).join('\n')}\n\nNo full-suite coverage counts are reused. Commands, input hashes, outputs and failures are in report.json and per-check logs.\n`;
  writeFileSync(resolve(root, folder, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  writeFileSync(resolve(root, folder, 'report.md'), markdown);
  console.log(markdown);
  console.log(`Report: ${folder}/report.json`);
  if (!report.passed) process.exitCode = 1;
  return report;
}
