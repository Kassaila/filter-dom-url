import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'filter-dom-url': 'src/index.ts' },
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.js' : '.mjs' }),
  dts: true,
  clean: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
  target: 'es2020',
});
