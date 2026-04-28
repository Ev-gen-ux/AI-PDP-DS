/**
 * figma-tokens-pull.js
 *
 * Получает Local Variables из Figma через REST API
 * и трансформирует их в W3C DTCG JSON в /tokens.
 *
 * Запуск:  npm run tokens:pull
 * Env:     FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY
 *
 * Архитектура:
 *  - Коллекции с префиксом '_' → primitives (raw values, без alias до других слоёв)
 *  - Коллекции без префикса     → semantic (могут ссылаться на primitives)
 *  - Коллекции с несколькими модами создают отдельный файл на каждый мод:
 *      colors (light theme, dark theme)  → colors.light-theme.json + colors.dark-theme.json
 *      typography (XL, MD, XS)           → typography.xl.json + typography.md.json + typography.xs.json
 *  - Алиасы маппятся через путь {collection.path.to.token}, например {palette.blue.500}
 *  - Префикс коллекции в alias-пути = имя коллекции без ведущего '_'.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import 'dotenv/config';

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

const collectionAliasPrefix = (collectionName) => collectionName.replace(/^_/, '');

const dtcgType = (figmaType) => {
  switch (figmaType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'string';
  }
};

function rgbaToHex({ r, g, b, a = 1 }) {
  const h = (n) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ''}`;
}

function aliasFor(varId, variablesById, collectionsById) {
  const v = variablesById[varId];
  if (!v) return null;
  const c = collectionsById[v.variableCollectionId];
  if (!c) return null;
  const prefix = collectionAliasPrefix(c.name);
  const path = v.name.split('/').join('.');
  return `{${prefix}.${path}}`;
}

function dtcgValue(variable, modeId, variablesById, collectionsById) {
  const raw = variable.valuesByMode[modeId];
  if (raw === undefined) return undefined;
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
    return aliasFor(raw.id, variablesById, collectionsById);
  }
  if (variable.resolvedType === 'COLOR' && raw && typeof raw === 'object' && 'r' in raw) {
    return rgbaToHex(raw);
  }
  return raw;
}

function buildTree(vars, modeId, variablesById, collectionsById) {
  const tree = {};
  for (const v of vars) {
    const segments = v.name.split('/');
    let cursor = tree;
    for (let i = 0; i < segments.length - 1; i++) {
      cursor[segments[i]] = cursor[segments[i]] || {};
      cursor = cursor[segments[i]];
    }
    const leafName = segments[segments.length - 1];
    const value = dtcgValue(v, modeId, variablesById, collectionsById);
    if (value === undefined || value === null) continue;
    cursor[leafName] = {
      $value: value,
      $type: dtcgType(v.resolvedType),
      ...(v.description ? { $description: v.description } : {}),
    };
  }
  return tree;
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
  const collectionsById = meta.variableCollections;

  const totalCollections = Object.keys(collectionsById).length;
  console.log(
    `Found ${totalCollections} collections, ${Object.keys(variablesById).length} variables.`,
  );

  let totalFilesWritten = 0;
  for (const collection of Object.values(collectionsById)) {
    const isPrimitive = collection.name.startsWith('_');
    const folder = isPrimitive ? 'primitives' : 'semantic';
    const baseName = collectionAliasPrefix(collection.name);
    const collectionVars = Object.values(variablesById).filter(
      (v) => v.variableCollectionId === collection.id,
    );

    if (collection.modes.length === 1) {
      const tree = buildTree(
        collectionVars,
        collection.modes[0].modeId,
        variablesById,
        collectionsById,
      );
      await writeJson(join('tokens', folder, `${baseName}.json`), tree);
      totalFilesWritten++;
    } else {
      for (const mode of collection.modes) {
        const modeSlug = mode.name.toLowerCase().replace(/\s+/g, '-');
        const tree = buildTree(collectionVars, mode.modeId, variablesById, collectionsById);
        await writeJson(join('tokens', folder, `${baseName}.${modeSlug}.json`), tree);
        totalFilesWritten++;
      }
    }
  }

  console.log(
    `\nDone. Wrote ${totalFilesWritten} files. Run \`npm run tokens:build\` to regenerate theme.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
