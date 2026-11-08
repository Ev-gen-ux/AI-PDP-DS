import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { build } from 'vite';

const root = process.cwd();
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const entry of Object.values(pkg.exports)) {
  for (const target of Object.values(typeof entry === 'string' ? { default: entry } : entry)) {
    if (!existsSync(target))
      throw new Error(`Missing package export: ${target}. Run npm run build first.`);
  }
}
mkdirSync('.local/package-check', { recursive: true });
const directory = mkdtempSync(resolve('.local/package-check/run-'));
const consumer = join(directory, 'consumer');
mkdirSync(consumer);
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(' ')} failed:\n${result.error?.message ?? ''}\n${result.stderr?.slice(-4000)}\n${result.stdout?.slice(-2000)}`,
    );
  return result.stdout;
}
const packed = JSON.parse(
  run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', directory], root),
)[0];
const files = new Set(packed.files.map((file) => file.path));
for (const file of ['dist/theme/variables.css', 'dist/theme/styled.d.ts']) {
  if (!files.has(file)) throw new Error(`Missing from archive: ${file}`);
}
writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const peers = Object.keys(pkg.peerDependencies).map((name) => {
  const installed = JSON.parse(
    readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8'),
  );
  return `${name}@${installed.version}`;
});
run(
  'npm',
  [
    'install',
    '--ignore-scripts',
    '--prefer-offline',
    '--no-audit',
    '--no-fund',
    join(directory, packed.filename),
    ...peers,
  ],
  consumer,
);
const source = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { styled, ThemeProvider } from 'styled-components';
import { Button } from '${pkg.name}';
import { theme } from '${pkg.name}/theme';
import '${pkg.name}/theme/variables.css';
const Heading = styled.h1\`font-size: \${({ theme }) => theme.typography.fontSize.heading.h1};\`;
const App = () => <ThemeProvider theme={theme}><div data-theme="dark"><Heading>Package consumer</Heading><Button text="Works" /></div></ThemeProvider>;
createRoot(document.getElementById('root')!).render(<App />);\n`;
writeFileSync(join(consumer, 'main.tsx'), source);
writeFileSync(
  join(consumer, 'index.html'),
  '<html><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
);
writeFileSync(
  join(consumer, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      skipLibCheck: true,
      jsx: 'react-jsx',
      module: 'ESNext',
      moduleResolution: 'bundler',
      target: 'ES2022',
      noEmit: true,
      typeRoots: [join(root, 'node_modules/@types')],
    },
    include: ['main.tsx'],
  }),
);
run(
  process.execPath,
  [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(consumer, 'tsconfig.json')],
  root,
);
writeFileSync(
  join(consumer, 'ssr.mjs'),
  `import React from 'react';
import {renderToString} from 'react-dom/server';
import {ThemeProvider} from 'styled-components';
import {createRequire} from 'node:module';
import {Button,theme} from '${pkg.name}';
import {theme as subtheme} from '${pkg.name}/theme';
const require=createRequire(import.meta.url);
if (typeof require('${pkg.name}').Button !== 'function') throw Error('CJS import failed');
if (!subtheme.typography) throw Error('Theme export failed');
if (!renderToString(React.createElement(ThemeProvider,{theme},React.createElement(Button,{text:'Works'}))).includes('Works')) throw Error('SSR failed');
`,
);
run(process.execPath, [join(consumer, 'ssr.mjs')], consumer);
await build({ root: consumer, configFile: false, logLevel: 'warn', build: { outDir: 'dist' } });
writeFileSync(
  '.local/package-check/latest.json',
  JSON.stringify(
    {
      consumer,
      package: packed.filename,
      files: packed.files.length,
      checks: ['archive', 'npm install', 'typecheck', 'ESM', 'CJS', 'SSR', 'Vite + CSS'],
      passed: true,
    },
    null,
    2,
  ),
);
console.log(
  `Package verified: installed archive, ESM/CJS, SSR, types, theme augmentation, CSS/fonts and Vite build.\nConsumer: ${consumer}`,
);
