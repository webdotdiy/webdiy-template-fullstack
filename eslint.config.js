import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // The neon-auth vendor dir is third-party code kept verbatim — see its README.
  { ignores: ['dist', '.wrangler', 'worker-configuration.d.ts', 'src/server/neon-auth/vendor'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/server/**'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/server/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.serviceworker },
    },
  },
);
