import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mergeConfig } from 'vite';

const storybookDir = fileURLToPath(new URL('.', import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    './foundations/*.stories.tsx',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  async viteFinal(viteConfig) {
    const { createCatalog } = await import(
      pathToFileURL(resolve(storybookDir, '../scripts/foundations-catalog.js')).href
    );
    const catalog = await createCatalog(resolve(storybookDir, '..'));
    return mergeConfig(viteConfig, {
      plugins: [
        {
          name: 'foundation-catalog',
          resolveId(id: string) {
            if (id === 'virtual:foundation-catalog') return '\0virtual:foundation-catalog';
          },
          load(id: string) {
            if (id === '\0virtual:foundation-catalog')
              return `export default ${JSON.stringify(catalog)}`;
          },
        },
      ],
      resolve: {
        alias: {
          '@': resolve(storybookDir, '../src'),
        },
      },
    });
  },
};

export default config;
