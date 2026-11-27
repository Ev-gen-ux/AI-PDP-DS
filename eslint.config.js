import js from '@eslint/js';
export default [
  { ignores: ['node_modules/**', '.local/**', 'projects/**'] },
  js.configs.recommended,
  {
    files: ['scripts/**/*.js', 'templates/project/scripts/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        structuredClone: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
      },
    },
  },
];
