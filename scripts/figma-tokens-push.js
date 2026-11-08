import { readFile, mkdir, writeFile } from 'node:fs/promises';
import dotenv from 'dotenv';
import { createSyncPlan, readTokenSources } from './figma-sync-plan.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  let snapshotPath;
  let apply = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--apply') apply = true;
    else if (args[i] === '--snapshot' && args[i + 1] && !args[i + 1].startsWith('--'))
      snapshotPath = args[++i];
    else throw new Error('Usage: tokens:push [--snapshot file.json] [--apply]');
  }
  if (apply && snapshotPath) throw new Error('--apply requires a fresh snapshot from Figma.');
  const { FIGMA_ACCESS_TOKEN: token, FIGMA_FILE_KEY: key } = process.env;
  const endpoint = `https://api.figma.com/v1/files/${encodeURIComponent(key ?? '')}/variables`;
  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new Error(
        `Figma HTTP ${response.status}. Check Enterprise access, file access and file_variables read/write scopes.`,
      );
    const data = await response.json();
    if (data.error) throw new Error('Figma returned an API error; no successful sync confirmed.');
    return data;
  };
  if (!snapshotPath && (!token || !key))
    throw new Error(
      'Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in .env.local, or pass --snapshot for offline planning.',
    );
  const snapshot = snapshotPath
    ? JSON.parse(await readFile(snapshotPath, 'utf8'))
    : await request(`${endpoint}/local`);
  if (!(snapshot.meta ?? snapshot).variables || !(snapshot.meta ?? snapshot).variableCollections)
    throw new Error('Invalid Variables API snapshot.');
  const plan = createSyncPlan(await readTokenSources(), snapshot.meta ?? snapshot);
  await mkdir('.local/figma', { recursive: true });
  await writeFile('.local/figma/sync-plan.json', JSON.stringify(plan, null, 2));
  for (const warning of plan.warnings) console.warn(warning);
  const counts = Object.fromEntries(
    Object.entries(plan.payload).map(([name, items]) => [name, items.length]),
  );
  console.log('Plan:', JSON.stringify(counts), 'Saved to .local/figma/sync-plan.json');
  if (Buffer.byteLength(JSON.stringify(plan.payload)) > 4 * 1024 * 1024)
    throw new Error('Plan exceeds the Figma API payload limit.');
  if (!apply) {
    console.log('Dry run: no changes sent. Review the plan, then use tokens:push:apply.');
    return;
  }
  if (Object.values(counts).every((n) => n === 0)) {
    console.log('Already in sync.');
    return;
  }
  await request(endpoint, { method: 'POST', body: JSON.stringify(plan.payload) });
  console.log('Figma confirmed token synchronization. No variables or collections were deleted.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
