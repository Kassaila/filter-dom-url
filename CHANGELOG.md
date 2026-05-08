# Changelog

## 0.6.0

### Tooling overhaul (no public API change)

The runtime contract of the published package is unchanged:
`import Filter from '@kassaila/filter-dom-url'` and `require('@kassaila/filter-dom-url').default`
both return the same `Filter` class with the same methods. Direct loading of
`dist/filter-dom-url.js` continues to work as a CJS file at the same path.

- **Build:** Gulp 4 + Babel 7 + `babel-preset-minify` → tsup (esbuild). Output is now minified
  `dist/filter-dom-url.js` (CJS) and `dist/filter-dom-url.mjs` (ESM), each with sourcemaps and
  TypeScript declarations (`.d.ts` / `.d.mts`).
- **Source:** ported `src/index.js` → `src/index.ts`. `Filter` is now exported both as `default` and
  as a named export.
- **Tests:** added vitest + happy-dom suite covering the public API, URL ↔ DOM round-trips for every
  supported type, popstate, and reset paths. Coverage ≥93%.
- **Lint/format:** ESLint flat config (`eslint-plugin-kassaila/configs/ts`)
  - Prettier 3 + lint-staged.
- **Hooks/CI:** husky pre-commit + commitlint (Conventional Commits). GitHub Actions `ci.yml` and
  `release.yml` replace the old Travis config.
- **Bundle budget:** `size-limit` 4 KB per format.
- **Engines:** dev requirement raised to Node `>=24`.

### Breaking

- `dist/filter-dom-url.min.js` is no longer published. The `dist/filter-dom-url.js` artifact is now
  production-ready (minified) on its own. Sourcemaps replace the unminified variant for debugging.
  The npm-import / npm-require flow is unchanged.
- Browser baseline raised from ES5 (old Babel `forceAllTransforms`) to ES2020. `.browserslistrc` is
  removed.

### Removed

- `gulp`, `gulp-config.js`, `tasks/`, `helpers/`, `system_files/`.
- `@babel/*` toolchain, `babel-preset-minify`.
- `.eslintrc`, `eslint-config-airbnb-base`, `.eslintignore`, `.browserslistrc`, `.travis.yml`.
