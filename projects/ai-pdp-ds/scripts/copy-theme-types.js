import { copyFile, readFile, writeFile } from 'node:fs/promises';

await copyFile('src/theme/styled.d.ts', 'dist/theme/styled.d.ts');
const declaration = await readFile('dist/theme/index.d.ts', 'utf8');
await writeFile('dist/theme/index.d.ts', `import type {} from './styled';\n${declaration}`);
