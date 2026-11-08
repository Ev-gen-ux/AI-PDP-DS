import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    exclude: ['node_modules/**', 'dist/**', 'storybook-static/**', '.local/**', 'scripts/tests/**'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.figma.*',
        'src/theme/**',
        'src/test-setup.ts',
        '**/index.ts',
      ],
      reporter: ['text', 'json-summary', 'html'],
    },
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: false,
  },
});
