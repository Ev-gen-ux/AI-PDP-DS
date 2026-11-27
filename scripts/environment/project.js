import { existsSync, lstatSync, realpathSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname, isAbsolute } from 'node:path';

export function identifier(value) {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 64)
    throw Error('Expected a kebab-case identifier (up to 64 characters)');
  return value;
}

export function safePath(root, name, missing = false) {
  root = realpathSync(root);
  if (typeof name !== 'string' || !name || isAbsolute(name) || name.includes('\\'))
    throw Error('Unsafe project-relative path');
  const parts = name.split('/');
  if (parts.some((p) => !p || p === '.' || p === '..' || p === '.git'))
    throw Error('Unsafe project-relative path');
  if (parts.some((p) => /^\.env(?:\.|$)/i.test(p) && p !== '.env.example'))
    throw Error('Private environment files are not allowed as project paths');
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    if (
      existsSync(current) ||
      (() => {
        try {
          lstatSync(current);
          return true;
        } catch {
          return false;
        }
      })()
    ) {
      if (lstatSync(current).isSymbolicLink())
        throw Error('Project paths cannot traverse symlinks');
    } else if (!missing) throw Error('Missing project path: ' + name);
  }
  return current;
}

export function readProject(root) {
  root = realpathSync(root);
  if (existsSync(join(root, 'system.json'))) {
    const meta = JSON.parse(readFileSync(safePath(root, 'system.json'), 'utf8'));
    identifier(meta.id);
    if (meta.schemaVersion !== 1 || typeof meta.displayName !== 'string')
      throw Error('Unsupported system metadata');
    const paths = {
      source: 'src',
      tokens: 'tokens',
      specs: 'component-specs',
      discovery: 'product-discovery',
      storybook: '.storybook',
    };
    if (meta.paths && Object.entries(meta.paths).some(([key, value]) => paths[key] !== value))
      throw Error('Unsupported or unsafe system paths');
    return { root, id: meta.id, name: meta.displayName, legacy: false };
  }
  if (existsSync(join(root, 'package.json'))) {
    const pkg = JSON.parse(readFileSync(safePath(root, 'package.json'), 'utf8'));
    if (pkg.name === 'design-system-developer' && pkg.private === true)
      return {
        root,
        id: 'design-system-developer',
        name: 'Design System Developer',
        environment: true,
      };
    // Transitional support for the existing flat library; no second registry.
    if (pkg.name === '@evgeni_design_84/ai-pdp-ds')
      return { root, id: 'ai-pdp-ds', name: 'AI-PDP-DS', legacy: true };
  }
  throw Error('No system.json in project: ' + root);
}

export function projectContext(start = process.cwd(), system = null) {
  let current = realpathSync(start);
  if (system) {
    identifier(system);
    while (true) {
      const path = join(current, 'projects', system);
      if (existsSync(path)) {
        safePath(current, 'projects/' + system);
        const project = readProject(path);
        if (project.id !== system) throw Error('System ID does not match directory');
        return project;
      }
      try {
        const project = readProject(current);
        if (project.id === system) return project;
        throw Error('Unknown system in selected project: ' + system);
      } catch (error) {
        if (!error.message.startsWith('No system.json')) throw error;
      }
      if (
        existsSync(join(current, 'AGENTS.md')) &&
        existsSync(join(current, 'scripts/environment'))
      )
        throw Error('Unknown system: ' + system);
      const parent = dirname(current);
      if (parent === current) throw Error('Unknown system: ' + system);
      current = parent;
    }
  }
  while (true) {
    if (existsSync(join(current, 'system.json'))) return readProject(current);
    try {
      return readProject(current);
    } catch (error) {
      if (!error.message.startsWith('No system.json')) throw error;
    }
    const parent = dirname(current);
    if (parent === current) throw Error('Select a project with --project or --root');
    current = parent;
  }
}

export function projectList(root) {
  const systems = [];
  if (existsSync(join(root, 'projects'))) {
    for (const entry of readdirSync(safePath(root, 'projects'), { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw Error('System directory cannot be a symlink');
      if (entry.isDirectory()) {
        const system = readProject(join(root, 'projects', entry.name));
        if (system.id !== entry.name || systems.some((s) => s.id === system.id))
          throw Error('Duplicate or mismatched system ID');
        systems.push(system);
      }
    }
  }
  try {
    const legacy = readProject(root);
    if (legacy.legacy && !systems.some((s) => s.id === legacy.id)) systems.push(legacy);
  } catch (error) {
    if (!error.message.startsWith('No system.json')) throw error;
  }
  return systems;
}
