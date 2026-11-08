import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
              ssr: true,
              pure: true,
            },
          ],
        ],
      },
    }),
    dts({
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.figma.tsx', '**/*.figma.ts', '**/*.test.tsx'],
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'theme/index': resolve(__dirname, 'src/theme/index.ts'),
        'theme/styles': resolve(__dirname, 'src/theme/styles.ts'),
      },
      cssFileName: 'theme/variables',
      name: 'AiPdpDs',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2022',
  },
});
