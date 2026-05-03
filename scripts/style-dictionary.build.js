import StyleDictionary from 'style-dictionary';
import { readFile, writeFile } from 'node:fs/promises';
import baseConfig from './style-dictionary.config.js';

const runBuild = async (source, platformName) => {
  const sd = new StyleDictionary({
    ...baseConfig,
    source,
    platforms: {
      [platformName]: baseConfig.platforms[platformName],
    },
  });
  await sd.buildAllPlatforms();
};

const isAlias = (value) => typeof value === 'string' && /^\{.+\}$/.test(value);

const getNodeByPath = (tree, path) => {
  const segments = path.split('.');
  let current = tree;
  for (const segment of segments) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return undefined;
    }
    current = current[segment];
  }
  return current;
};

const resolveTokenValue = (value, context) => {
  if (!isAlias(value)) {
    return value;
  }
  const aliasPath = value.slice(1, -1);
  const aliasNode = getNodeByPath(context, aliasPath);
  if (!aliasNode || typeof aliasNode !== 'object' || !('$value' in aliasNode)) {
    return value;
  }
  return resolveTokenValue(aliasNode.$value, context);
};

const collectCssVars = (tree, context, path = [], output = []) => {
  for (const [key, value] of Object.entries(tree)) {
    const nextPath = [...path, key];
    if (value && typeof value === 'object' && '$value' in value) {
      const resolved = resolveTokenValue(value.$value, context);
      output.push({
        name: `--${nextPath.join('-')}`,
        value: resolved,
      });
      continue;
    }
    if (value && typeof value === 'object') {
      collectCssVars(value, context, nextPath, output);
    }
  }
  return output;
};

const appendTypographyOverrides = async () => {
  const cssPath = 'src/theme/variables.light.css';
  const [css, spacersRaw, typographyBaseRaw, mdRaw, xsRaw] = await Promise.all([
    readFile(cssPath, 'utf8'),
    readFile('tokens/primitives/spacers.json', 'utf8'),
    readFile('tokens/primitives/typographyBase.json', 'utf8'),
    readFile('tokens/semantic/typography.md.json', 'utf8'),
    readFile('tokens/semantic/typography.xs.json', 'utf8'),
  ]);

  const context = {
    ...JSON.parse(spacersRaw),
    ...JSON.parse(typographyBaseRaw),
  };
  const mdVars = collectCssVars(JSON.parse(mdRaw), context);
  const xsVars = collectCssVars(JSON.parse(xsRaw), context);

  const formatLines = (vars, indent) => vars.map((item) => `${indent}${item.name}: ${item.value};`);
  const blockMd = [
    '@media (max-width: 1279px) {',
    '  :root, [data-theme="light"] {',
    ...formatLines(mdVars, '    '),
    '  }',
    '}',
    '',
  ].join('\n');
  const blockXs = [
    '@media (max-width: 767px) {',
    '  :root, [data-theme="light"] {',
    ...formatLines(xsVars, '    '),
    '  }',
    '}',
    '',
  ].join('\n');

  await writeFile(cssPath, `${css.trimEnd()}\n\n${blockMd}${blockXs}`, 'utf8');
};

async function main() {
  /** Единый слой примитивов (`tokens/primitives/**`); light/dark — только в `colors.*-theme.json`. */
  const primitives = 'tokens/primitives/**/*.json';
  const semanticBase = [
    'tokens/semantic/spacing.json',
    'tokens/semantic/borderRadius.json',
    'tokens/semantic/effects.json',
  ];

  await runBuild(
    [
      primitives,
      ...semanticBase,
      'tokens/semantic/colors.light-theme.json',
      'tokens/semantic/typography.xl.json',
    ],
    'css-light',
  );

  await runBuild([primitives, 'tokens/semantic/colors.dark-theme.json'], 'css-dark');

  await runBuild(
    [
      primitives,
      ...semanticBase,
      'tokens/semantic/colors.light-theme.json',
      'tokens/semantic/typography.xl.json',
    ],
    'typescript',
  );

  await runBuild(
    [
      primitives,
      ...semanticBase,
      'tokens/semantic/colors.light-theme.json',
      'tokens/semantic/typography.xl.json',
    ],
    'figma',
  );

  await appendTypographyOverrides();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
