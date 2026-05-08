import { tsConfig } from 'eslint-plugin-kassaila/configs/ts';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'docs/**', '.tmp/**', '*.config.*', '.size-limit.cjs'],
  },

  ...tsConfig,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['__tests__/**'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['__tests__/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
