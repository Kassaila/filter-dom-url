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

## Examples folder

`examples/` is a standalone demo project with its own gulp setup (legacy). Not part of the library
build.
