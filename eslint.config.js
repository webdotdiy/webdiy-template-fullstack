import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/*
 * React Router is imported from `react-router`. `react-router-dom` is the old
 * package name: it is not installed here and does not exist in React Router 8.
 */
const routerImportRule = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        { name: 'react-router-dom', message: "Import from 'react-router' instead (same API)." },
      ],
      patterns: [
        {
          group: ['react-router-dom/*'],
          message: "Import from 'react-router' instead (same API).",
        },
      ],
    },
  ],
};

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
      ...routerImportRule,
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/server/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.serviceworker },
    },
    rules: routerImportRule,
  },
);
