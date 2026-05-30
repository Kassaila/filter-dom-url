# Changelog

## 0.6.0

### Added

- `destroy()` — removes all `change` listeners registered on filter elements and the `popstate`
  listener on `window`. Call when the page section or component is unmounted to avoid listener leaks
  during SPA navigation or hot-reload.
- ESM output (`dist/filter-dom-url.mjs`) alongside the existing CJS entry.
- TypeScript declarations (`.d.ts` / `.d.mts`) bundled with the package.
- Named export: `Filter` is now exported both as `default` and as a named export.
- vitest + happy-dom test suite covering the public API, URL ↔ DOM round-trips for every supported
  type, popstate, and reset paths. Coverage ≥93%.
- `size-limit` bundle budget (4 KB per format).

### Changed

- Build: Gulp 4 + Babel 7 + `babel-preset-minify` → tsup (esbuild). Output is minified with
  sourcemaps. Browser baseline raised to ES2020.
- Source: ported `src/index.js` → `src/index.ts`.
- Lint/format: ESLint flat config (`eslint-plugin-kassaila/configs/ts`) + Prettier 3 + lint-staged.
- CI: GitHub Actions `ci.yml` and `release.yml` replace the old Travis config. Husky pre-commit +
  commitlint (Conventional Commits) added.
- Dev engine requirement raised to Node `>=24`.
- `#parseFiltersFromUrl` — duplicate URL keys are now merged and deduplicated via `Set` instead of
  silently dropped (previously `new Map()` kept only the last value).
- Constructor no longer resolves `$form`, `url`, or `urlFilters` — deferred to `init()`.

### Fixed

- CSS injection — URL search-param keys and values interpolated into `querySelector` attribute
  selectors are now escaped with `CSS.escape()`. A crafted URL with `"` or `]` in a param key could
  previously break the selector or match unintended elements.
- `select-multiple` empty deselect — deselecting all options now deletes the URL param instead of
  writing an empty string (`key=`).
- Checkbox deduplication — a synthetic `change` event on an already-checked checkbox no longer
  duplicates its value in the space-joined URL param.
- `URLSearchParams` double-decode — the constructor called
  `decodeURIComponent(searchParams.toString())` before re-parsing, corrupting percent-encoded values
  (e.g. `%2B` → space). Now uses `new URLSearchParams(this.url.searchParams)`.

### Removed

- `dist/filter-dom-url.min.js` — replaced by the minified `dist/filter-dom-url.js`.
- `gulp`, `gulp-config.js`, `tasks/`, `helpers/`, `system_files/`.
- `@babel/*` toolchain, `babel-preset-minify`.
- `.eslintrc`, `eslint-config-airbnb-base`, `.eslintignore`, `.browserslistrc`, `.travis.yml`.
