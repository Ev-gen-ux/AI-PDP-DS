import { existsSync, mkdirSync, writeFileSync, readFileSync, realpathSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { identifier, safePath, projectList, projectContext } from './project.js';
import { initJournal, templateSection } from './journal.js';
import { installTooling } from './tooling.js';
import { exportProject } from './export.js';

export function createProject(root, id, name = id) {
  identifier(id);
  if (typeof name !== 'string' || !name.trim() || /[\r\n]/.test(name))
    throw Error('System name is required');
  const path = safePath(root, 'projects/' + id, true);
  if (existsSync(path) || projectList(root).some((s) => s.id === id))
    throw Error('System already exists');
  const meta = {
    schemaVersion: 1,
    id,
    displayName: name,
    platform: 'web-react',
    paths: {
      source: 'src',
      tokens: 'tokens',
      specs: 'component-specs',
      discovery: 'product-discovery',
      storybook: '.storybook',
    },
  };
  const systemBrief = safePath(root, 'templates/specifications.md', true);
  const briefText = existsSync(systemBrief)
    ? templateSection(readFileSync(systemBrief, 'utf8'), 'system-brief').replaceAll('{{id}}', id)
    : undefined;
  if (briefText !== undefined && !briefText.includes('<!-- BRIEF:DRAFT -->'))
    throw Error('System brief template must retain its draft marker');
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, 'system.json'), JSON.stringify(meta, null, 2) + '\n', { flag: 'wx' });
  const task = initJournal({ root: path, id, name }, 'create-system', {
    title: 'Create ' + name,
    ...(briefText === undefined ? {} : { briefText }),
  });
  return {
    root: path,
    metadata: meta,
    task,
    draftOnly: true,
    nextStep:
      'Briefing and research inside product-discovery; no source generation before agreement.',
  };
}

export function runProject(project, operation, args = []) {
  const allowed = [
    'build',
    'typecheck',
    'test',
    'test:tooling',
    'lint',
    'format:check',
    'storybook',
    'storybook:build',
    'tokens:build',
    'quality:report',
    'package:check',
    'figma:check',
  ];
  if (!allowed.includes(operation)) throw Error('Unknown local system operation');
  const pkg = JSON.parse(readFileSync(safePath(project.root, 'package.json'), 'utf8'));
  if (!Object.hasOwn(pkg.scripts ?? {}, operation))
    throw Error('System does not provide operation: ' + operation);
  const result = spawnSync('npm', ['run', operation, ...(args.length ? ['--', ...args] : [])], {
    cwd: project.root,
    stdio: 'inherit',
    env: { ...process.env, PATH: dirname(process.execPath) + ':' + process.env.PATH },
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw Error('System operation failed: ' + (result.status ?? result.signal));
  return { system: project.id, operation, root: project.root, passed: true };
}

export function main(args = process.argv.slice(2)) {
  try {
    const [command, ...rest] = args,
      positionals = [],
      options = {};
    const allowedOptions = {
      list: ['root'],
      create: ['root', 'name'],
      run: ['root'],
      'install-tooling': ['root'],
      export: ['root', 'out'],
    }[command];
    if (!allowedOptions) throw Error('Unknown project command');
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '--') {
        positionals.push(...rest.slice(i + 1));
        break;
      }
      if (rest[i].startsWith('--')) {
        const key = rest[i].slice(2);
        if (
          !allowedOptions.includes(key) ||
          Object.hasOwn(options, key) ||
          !rest[i + 1] ||
          rest[i + 1].startsWith('--')
        )
          throw Error('Invalid system options');
        options[key] = rest[++i];
      } else positionals.push(rest[i]);
    }
    const root = resolve(options.root ?? process.cwd());
    let result;
    if (command === 'list' && !positionals.length) result = projectList(root);
    else if (command === 'create' && positionals.length === 1)
      result = createProject(root, positionals[0], options.name);
    else if (command === 'install-tooling' && positionals.length === 1)
      result = installTooling(root, projectContext(root, positionals[0]).root);
    else if (command === 'export' && positionals.length === 1)
      result = exportProject(
        root,
        projectContext(root, positionals[0]),
        options.out ? resolve(root, options.out) : null,
      );
    else if (command === 'run' && positionals.length >= 2)
      result = runProject(
        projectContext(root, positionals[0]),
        positionals[1],
        positionals.slice(2),
      );
    else
      throw Error(
        'env:project list|create <id> [--name name]|install-tooling <id>|export <id> --out folder|run <id> <operation> [-- args] [--root path]',
      );
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
