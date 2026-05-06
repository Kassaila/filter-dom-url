# Setup

Setup for development and contribution.

## Prerequisites

- Node.js `>=24`
- npm

## Install

```sh
git clone https://github.com/Kassaila/filter-dom-url
cd filter-dom-url
npm i
```

## Common scripts

| Script                    | What it does                                            |
| ------------------------- | ------------------------------------------------------- |
| `npm run build`           | Build `dist/` (ESM + CJS + types, minified, sourcemaps) |
| `npm run build:dev`       | Build without minification                              |
| `npm run test`            | Run vitest in watch mode                                |
| `npm run test:run`        | Run vitest once                                         |
| `npm run test:coverage`   | Run vitest with v8 coverage                             |
| `npm run lint`            | ESLint (report only)                                    |
| `npm run lint:fix`        | ESLint with `--fix`                                     |
| `npm run format`          | Prettier write                                          |
| `npm run format:check`    | Prettier check                                          |
| `npm run check:types`     | `tsc --noEmit`                                          |
| `npm run check:size`      | size-limit budget check                                 |
| `npm run check:all`       | format + lint + types + tests + build + size            |
| `npm run release:check`   | `check:all` + `npm pack --dry-run`                      |
| `npm run release:publish` | Publish to npm                                          |
| `npm run docs:dev`        | VitePress dev server (`docs/`)                          |
| `npm run docs:build`      | Build the static docs site to `docs/.vitepress/dist`    |
| `npm run docs:preview`    | Preview the built docs site locally                     |

## Documentation

Docs live in `docs/` and are built with VitePress. The interactive demo at `/examples/live-demo`
imports `Filter` directly from `src/index.ts`, so it doubles as a manual regression check during
development. The site is auto-deployed to GitHub Pages on push to `master` via
`.github/workflows/docs.yml`.
