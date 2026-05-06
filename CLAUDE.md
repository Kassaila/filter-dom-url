# CLAUDE.md

Guidance for AI agents working in this repository. `@kassaila/filter-dom-url` is a tiny browser-only
library that keeps DOM filter controls (`<input>`, `<select>`) in sync with `URLSearchParams` and
`window.history`.

## Commands

- `npm run test` / `test:run` / `test:coverage` — vitest (watch / once / v8 coverage).
- `npm run build` / `build:dev` — tsup production build (minified, sourcemaps) / non-minified.
- `npm run lint` / `lint:fix` — ESLint flat config (typescript-eslint).
- `npm run format` / `format:check` — Prettier.
- `npm run check:types` — `tsc --noEmit`.
- `npm run check:size` — size-limit (4 KB budget per format).
- `npm run check:all` — full CI gate: format + lint + types + tests + build + size.
- `npm run docs:dev` / `docs:build` / `docs:preview` — VitePress dev server / static build / preview
  of the built site.

Single test: `npx vitest run __tests__/index.test.ts -t "<name>"`.

## Source

The library is **one file**: `src/index.ts`, exporting `Filter` as both named and default. There is
no module graph — keep changes local.

The class wires three pieces of state:

- **DOM** — a form selected by `formAttr`, with child filter elements selected by `filterAttr`.
  Supported types: `<select>`, `<select multiple>`, and `<input type="...">` for
  `checkbox | radio | color | range | date | month | week | time`.
- **`URLSearchParams`** (`this.urlFilters`) — mirrors the form state. Multi-value filters
  (`checkbox`, `select-multiple`) are serialized as **space-joined strings** in a single param, not
  as repeated keys. This serialization format is the public wire contract.
- **`window.history`** — `setFiltersToUrl()` calls `pushState`; a `popstate` listener resets the
  form and re-applies filters from the URL.

Two directions of sync live in private (`#`) methods:

- `#updateFiltersDomFromUrl` — URL → DOM.
- `#updateUrlFromFiltersDom` — DOM `change` event → URL. Checkbox handling splits the existing
  space-joined value, splices out the unchecked option, and rewrites the param.

`Filter.checkFilterDomType` is the single dispatch point mapping a DOM node to a normalized type
string. Adding a supported element type means changes here **and** in both switch statements above.

## Build invariants

`tsup.config.ts` produces dual ESM+CJS output (`dist/filter-dom-url.{mjs,js}`) plus types
(`.d.mts`/`.d.ts`), all minified with sourcemaps. Target `es2020`, `sideEffects: false`. Single file
goes through esbuild; no bundler.

Two non-obvious constraints — change cautiously:

- `package.json` does **not** declare `"type": "module"`. With it, Node would treat
  `dist/filter-dom-url.js` as ESM and break `require()` consumers.
- `src/index.ts` exports `Filter` as **both** `export class Filter` and `export default Filter`.
  esbuild only emits the `__esModule` interop marker — and therefore working `require(...).default`
  — when the source has both a named and a default export.

## Tests

`__tests__/index.test.ts` runs in **happy-dom**. happy-dom uses `http://localhost:3000` as the
document origin; `history.replaceState`/`pushState` to any other origin throws `SecurityError`. Test
helpers reuse `window.location.origin` to avoid this.

## Conventions

- ESLint config: `eslint-plugin-kassaila/configs/ts` (shared with sibling repos).
- Prettier: 2-space, single quotes, trailing commas, 100 col.
- Conventional Commits, enforced by `.husky/commit-msg`. `.husky/pre-commit` runs `lint-staged`.
- DOM nodes use `$`-prefixed names (`$form`, `$filter`).

## Documentation site

The docs live in `docs/` and are built with **VitePress 1.x**. Layout follows the sibling
`vue-router-citadel` project — `docs/.vitepress/{config.ts,theme/}` plus content under
`docs/{guide,api,examples}/`.

- The interactive demo is `docs/.vitepress/theme/components/FilterDemo.vue`. It imports `Filter`
  from `../../../../src/index` (the live source) — keep this path stable, it is what makes the demo
  a manual regression check.
- The component must stay SSR-safe: `Filter` touches `document` and `window` in its constructor, so
  instantiation lives inside `onMounted`, and the demo is wrapped in `<ClientOnly>` on the page.
- `docs/.vitepress/{dist,cache}` are build artifacts (gitignored, prettier-ignored).
- The `lint:check` ignore list still excludes `docs/**`. The TypeScript files under
  `docs/.vitepress/` are not part of the library `tsconfig.json` — VitePress runs its own type
  resolution via Vite.

Deploy: `.github/workflows/docs.yml` builds and publishes `docs/.vitepress/dist/` to GitHub Pages on
push to `master`.
