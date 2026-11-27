import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

mkdirSync('.local/figma', { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    'node_modules/@figma/code-connect/bin/figma',
    'connect',
    'parse',
    '--skip-update-check',
    '--outFile',
    '.local/figma/code-connect.json',
  ],
  { stdio: 'inherit' },
);
if (result.status !== 0) process.exit(result.status ?? 1);
const connections = JSON.parse(readFileSync('.local/figma/code-connect.json', 'utf8'));
if (!Array.isArray(connections) || connections.length === 0)
  throw new Error('No Code Connect templates recognized.');
const urls = new Set();
for (const connection of connections) {
  if (
    !connection.figmaNode?.includes('node-id=') ||
    !connection.template ||
    connection.label !== 'React'
  )
    throw new Error('Incomplete Code Connect template.');
  if (urls.has(connection.figmaNode))
    throw new Error(`Duplicate Code Connect URL: ${connection.figmaNode}`);
  urls.add(connection.figmaNode);
}
console.log(
  `Code Connect: ${connections.length} templates parsed. This does not confirm publication in Figma.`,
);
