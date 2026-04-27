/**
 * figma-tokens-push.js
 *
 * Берёт собранные DTCG-токены и пушит их в Figma Variables через REST API.
 *
 * Запуск:  npm run tokens:push
 * Env:     FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY
 *
 * ВНИМАНИЕ: Variables API позволяет создавать/обновлять/удалять переменные
 *           через POST /v1/files/:key/variables. Финальная схема зависит от
 *           конвенции имён и должна быть согласована с figma-tokens-pull.js.
 *           Этот файл — стартовый каркас.
 */

import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const FIGMA_API = 'https://api.figma.com/v1';
const { FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY } = process.env;

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error('FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY are required');
  process.exit(1);
}

// eslint-disable-next-line no-unused-vars
async function _pushVariables(payload) {
  const res = await fetch(`${FIGMA_API}/files/${FIGMA_FILE_KEY}/variables`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  console.log('Reading dist/figma.tokens.json...');
  const raw = await readFile('dist/figma.tokens.json', 'utf8');
  const tokens = JSON.parse(raw);

  // TODO: трансформация tokens → формат POST /v1/files/:key/variables
  // {
  //   variableCollections: [{ action: 'CREATE'|'UPDATE'|'DELETE', ... }],
  //   variableModes:       [{ action: 'CREATE'|'UPDATE'|'DELETE', ... }],
  //   variables:           [{ action: 'CREATE'|'UPDATE'|'DELETE', ... }],
  //   variableModeValues:  [{ variableId, modeId, value }],
  // }
  //
  // Реализуется одновременно с figma-tokens-pull.js — обе стороны
  // должны использовать одинаковый mapping имён.

  console.log('NOTE: push не реализован — это стартовый каркас.');
  console.log(`Будет залито в файл: ${FIGMA_FILE_KEY}`);
  console.log(`Корневых ключей: ${Object.keys(tokens).length}`);

  // const result = await pushVariables(payload);
  // console.log('Pushed:', result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
