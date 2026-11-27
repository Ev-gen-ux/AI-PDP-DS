import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const slug = (name) => name.toLowerCase().replace(/\s+/g, '-');
const types = { color: 'COLOR', number: 'FLOAT', string: 'STRING', boolean: 'BOOLEAN' };

export async function readTokenSources(directory = 'tokens') {
  const sources = [];
  for (const layer of ['primitives', 'semantic']) {
    for (const file of (await readdir(join(directory, layer))).sort()) {
      if (!file.endsWith('.json')) continue;
      const [name, mode] = file.slice(0, -5).split('.');
      let tree = JSON.parse(await readFile(join(directory, layer, file), 'utf8'));
      if (layer === 'primitives' && Object.keys(tree).length === 1 && tree[name]) tree = tree[name];
      sources.push({ name, mode, collection: layer === 'primitives' ? `_${name}` : name, tree });
    }
  }
  return sources;
}

function flatten(tree, path = [], output = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const next = [...path, key];
    if (node && typeof node === 'object' && '$value' in node) output.push({ path: next, ...node });
    else if (node && typeof node === 'object') flatten(node, next, output);
  }
  return output;
}

export function createSyncPlan(sources, snapshot) {
  const payload = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  };
  const warnings = [];
  const collections = Object.values(snapshot.variableCollections ?? {});
  const existingVariables = Object.values(snapshot.variables ?? {});
  const keys = new Map();
  const pending = [];
  const groups = new Map();
  let nextId = 0;
  const temporaryId = () => `ai_pdp_${++nextId}`;
  for (const source of sources) {
    if (!groups.has(source.collection)) groups.set(source.collection, []);
    groups.get(source.collection).push(source);
  }
  for (const [collectionName, group] of groups) {
    const allTokens = group.map((source) => ({ source, tokens: flatten(source.tree) }));
    for (const { tokens } of allTokens)
      for (const token of tokens) {
        if (!types[token.$type] && token.$type !== 'shadow')
          throw new Error(`Unsupported token type: ${token.$type}`);
      }
    if (allTokens.every(({ tokens }) => tokens.every((token) => token.$type === 'shadow'))) {
      warnings.push(
        `${collectionName}: shadow tokens require effect styles, not Variables; omitted.`,
      );
      continue;
    }
    const matches = collections.filter((c) => !c.remote && c.name === collectionName);
    if (matches.length > 1) throw new Error(`Ambiguous collection: ${collectionName}`);
    const existing = matches[0];
    if (existing?.isExtension)
      throw new Error(`Extended collection is not supported: ${collectionName}`);
    const collectionId = existing?.id ?? temporaryId();
    const firstModeId = existing?.defaultModeId ?? temporaryId();
    const modes = [...(existing?.modes ?? [])];
    if (!existing) {
      const name = group[0].mode?.replace(/-/g, ' ') ?? 'Default';
      payload.variableCollections.push({
        action: 'CREATE',
        id: collectionId,
        name: collectionName,
        initialModeId: firstModeId,
      });
      payload.variableModes.push({
        action: 'UPDATE',
        id: firstModeId,
        variableCollectionId: collectionId,
        name,
      });
      modes.push({ modeId: firstModeId, name });
    }
    const variableIds = new Map();
    for (const { source, tokens } of allTokens) {
      const candidates = source.mode
        ? modes.filter((m) => slug(m.name) === source.mode)
        : modes.filter((m) => m.modeId === firstModeId);
      if (candidates.length > 1)
        throw new Error(`Ambiguous mode: ${collectionName}/${source.mode}`);
      let modeId = candidates[0]?.modeId;
      if (!modeId) {
        modeId = temporaryId();
        const name = source.mode.replace(/-/g, ' ');
        payload.variableModes.push({
          action: 'CREATE',
          id: modeId,
          name,
          variableCollectionId: collectionId,
        });
        modes.push({ modeId, name });
      }
      for (const token of tokens) {
        const name = token.path.join('/');
        if (token.$type === 'shadow') {
          warnings.push(`${collectionName}/${name}: shadow omitted.`);
          continue;
        }
        if (/[.{}]/.test(name)) throw new Error(`Invalid variable name: ${name}`);
        let id = variableIds.get(name);
        if (!id) {
          const matches = existingVariables.filter(
            (v) => !v.remote && v.variableCollectionId === collectionId && v.name === name,
          );
          if (matches.length > 1) throw new Error(`Ambiguous variable: ${collectionName}/${name}`);
          const variable = matches[0];
          if (variable && variable.resolvedType !== types[token.$type])
            throw new Error(`Type mismatch: ${collectionName}/${name}`);
          id = variable?.id ?? temporaryId();
          variableIds.set(name, id);
          keys.set(`${source.name}.${token.path.join('.')}`, { id, type: token.$type });
          if (!variable)
            payload.variables.push({
              action: 'CREATE',
              id,
              name,
              variableCollectionId: collectionId,
              resolvedType: types[token.$type],
              ...(token.$description ? { description: token.$description } : {}),
            });
        } else if (keys.get(`${source.name}.${token.path.join('.')}`).type !== token.$type)
          throw new Error(`Mode type mismatch: ${name}`);
        pending.push({ token, id, modeId });
      }
    }
  }
  const aliases = new Map();
  for (const { token, id } of pending) {
    const match = typeof token.$value === 'string' && token.$value.match(/^\{(.+)\}$/);
    if (match) {
      const target = keys.get(match[1]);
      if (!target || target.type !== token.$type)
        throw new Error(`Missing or incompatible alias: ${match[1]}`);
      if (!aliases.has(id)) aliases.set(id, new Set());
      aliases.get(id).add(target.id);
    }
  }
  const visit = (id, visiting = new Set(), visited = new Set()) => {
    if (visiting.has(id)) throw new Error(`Alias cycle involving ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const target of aliases.get(id) ?? []) visit(target, visiting, visited);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of aliases.keys()) visit(id);
  for (const { token, id, modeId } of pending) {
    let value = token.$value;
    const alias = typeof value === 'string' && value.match(/^\{(.+)\}$/);
    if (alias) value = { type: 'VARIABLE_ALIAS', id: keys.get(alias[1]).id };
    else if (token.$type === 'color') {
      if (!/^#[\da-f]{6}([\da-f]{2})?$/i.test(value))
        throw new Error(`Unsupported color: ${value}`);
      const bytes = value
        .slice(1)
        .match(/../g)
        .map((x) => parseInt(x, 16) / 255);
      value = { r: bytes[0], g: bytes[1], b: bytes[2], a: bytes[3] ?? 1 };
    } else if (
      typeof value !== { number: 'number', boolean: 'boolean', string: 'string' }[token.$type] ||
      (typeof value === 'number' && !Number.isFinite(value))
    )
      throw new Error(`Invalid value: ${token.path.join('/')}`);
    const old = snapshot.variables?.[id]?.valuesByMode?.[modeId];
    if (JSON.stringify(old) !== JSON.stringify(value))
      payload.variableModeValues.push({ variableId: id, modeId, value });
  }
  return { payload, warnings };
}
