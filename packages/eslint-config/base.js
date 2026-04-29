import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import onlyWarn from 'eslint-plugin-only-warn';
import sortExportsPlugin from 'eslint-plugin-sort-exports';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      'sort-exports': sortExportsPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      'sort-exports/sort-exports': ['warn', { ignoreCase: true, sortExportKindFirst: 'type' }],
      complexity: 'warn',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**'],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: '@src/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@mblabs-roccato-frontend/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'mblabs-roccato-frontend-commons/**',
              group: 'external',
              position: 'before',
            },

            {
              pattern: '**/*.+(css)',
              group: 'object',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'warn',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },
];
