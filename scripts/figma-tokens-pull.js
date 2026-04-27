/**
 * figma-tokens-pull.js
 *
 * Получает Local Variables из Figma через REST API
 *  и трансформирует их в W3C DTCG JSON в /tokens.
 *
 * Запуск:  npm run tokens:pull
 * Env:     FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY
 *
 * ВНИМАНИЕ: это стартовый каркас. Финальная маппинг-логика
 *           зависит от структуры твоих Figma Variables и должна
 *           согласовать имена коллекций и path-сепараторы.
 *           Дорабатывается одновременно с tokens:build.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const FIGMA_API = 'https://api.figma.com/v1';
const { FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY } = process.env;

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error('FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY are required');
  process.exit(1);
}

async function fetchVariables() {
  const res = await fetch(`${FIGMA_API}/files/${FIGMA_FILE_KEY}/variables/local`, {
    headers: { 'X-Figma-Token': FIGMA_ACCESS_TOKEN },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function rgbaToHex({ r, g, b, a = 1 }) {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ''}`;
}

function variableToDTCG(variable, modeId, variablesById) {
  const value = variable.valuesByMode[modeId];
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    const alias = variablesById[value.id];
    return { $value: `{${alias?.name?.replace(/\//g, '.')}}`, $type: variable.resolvedType.toLowerCase() };
  }
  if (value && typeof value === 'object' && 'r' in value) {
    return { $value: rgbaToHex(value), $type: 'color' };
  }
  return { $value: value, $type: variable.resolvedType.toLowerCase() };
}

function buildTree(variables, modeId, variablesById) {
  const tree = {};
  for (const v of Object.values(variables)) {
    const path = v.name.split('/');
    let cursor = tree;
    for (let i = 0; i < path.length - 1; i++) {
      cursor[path[i]] = cursor[path[i]] || {};
      cursor = cursor[path[i]];
    }
    cursor[path[path.length - 1]] = variableToDTCG(v, modeId, variablesById);
  }
  return tree;
}

const outputFileMap = {
  _palette: '_palette.json',
  _typographyBase: '_typographyBase.json',
  _spacers: '_spacers.json',
  colors: {
    'light theme': 'colors.light-theme.json',
    'dark theme': 'colors.dark-theme.json',
  },
  typography: {
    XL: 'typography.xl.json',
    MD: 'typography.md.json',
    XS: 'typography.xs.json',
  },
  spacing: 'spacing.json',
  borderRadius: 'borderRadius.json',
};

function resolveOutputFilename(collectionName, modeName, hasManyModes) {
  const mapped = outputFileMap[collectionName];
  if (typeof mapped === 'string') {
    return mapped;
  }
  if (mapped && typeof mapped === 'object') {
    return mapped[modeName] || `${collectionName}.${modeName.toLowerCase().replace(/\s+/g, '-')}.json`;
  }
  if (!hasManyModes) {
    return `${collectionName}.json`;
  }
  const modeSlug = modeName.toLowerCase().replace(/\s+/g, '-');
  return `${collectionName}.${modeSlug}.json`;
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✓ ${path}`);
}

async function main() {
  console.log(`Pulling variables from Figma file ${FIGMA_FILE_KEY}...`);
  const { meta } = await fetchVariables();
  const variablesById = meta.variables;
  const collections = meta.variableCollections;

  for (const collection of Object.values(collections)) {
    const isPrimitive = collection.name.startsWith('_');
    const folder = isPrimitive ? 'primitives' : 'semantic';
    const collectionVars = Object.fromEntries(
      Object.entries(variablesById).filter(([, v]) => v.variableCollectionId === collection.id),
    );

    for (const mode of collection.modes) {
      const filename = resolveOutputFilename(collection.name, mode.name, collection.modes.length > 1);
      const path = join('tokens', folder, filename);
      const tree = buildTree(collectionVars, mode.modeId, variablesById);
      await writeJson(path, tree);
    }
  }

  console.log('Done. Run `npm run tokens:build` to regenerate theme files.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
