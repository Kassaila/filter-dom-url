# @kassaila/filter-dom-url

Tiny TypeScript library that keeps DOM filter controls (`<input>`, `<select>`) in sync with
`URLSearchParams` and `window.history`.

[![npm](https://img.shields.io/npm/v/@kassaila/filter-dom-url.svg)](https://www.npmjs.com/package/@kassaila/filter-dom-url)
[![release](https://img.shields.io/github/release/kassaila/filter-dom-url.svg)](https://github.com/Kassaila/filter-dom-url/releases)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![requests](http://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/Kassaila/filter-dom-url/pulls)

📖 **Documentation & live demo:** <https://kassaila.github.io/filter-dom-url/>

## Install

```sh
npm i @kassaila/filter-dom-url
```

## Quick start

```html
<form data-filter-form="example">
  <label>
    <input value="news" data-filter="topic" type="checkbox" />
    News
  </label>
  <select data-filter="sort">
    <option value="latest">Latest</option>
    <option value="popular">Popular</option>
  </select>
</form>
```

```ts
import Filter from '@kassaila/filter-dom-url';

const filter = new Filter({
  formAttr: 'data-filter-form="example"',
  filterAttr: 'data-filter',
});

filter.init();
```

That's it. The form state is now mirrored to `?topic=news&sort=popular` — refreshing or sharing the
URL restores it; **Back / Forward** rewinds through filter combinations.

## Supported controls

`<select>`, `<select multiple>`, and `<input type="...">` for
`checkbox | radio | color | range | date | month | week | time`.

See the
[Supported Elements guide](https://kassaila.github.io/filter-dom-url/guide/supported-elements) and
the [Live Demo](https://kassaila.github.io/filter-dom-url/examples/live-demo) for a working form
covering every type.

## API

| Method                           | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `init()`                         | Initialize the instance — apply URL state to DOM, attach listeners |
| `updateDom()`                    | Re-apply current URL state to DOM elements                         |
| `setFiltersToUrl(newUrl)`        | Push current filter state to `window.history`                      |
| `resetUrl()`                     | Remove all known filter params from the URL                        |
| `resetDom()`                     | Reset the form (`form.reset()`)                                    |
| `getFilters()`                   | Get current filters as `{ [type]: string[] }`                      |
| `Filter.checkFilterDomType($el)` | Static — classify a DOM element to its filter type                 |

Full reference: <https://kassaila.github.io/filter-dom-url/api/>.

## Packaging

Ships ESM (`dist/filter-dom-url.mjs`) and CJS (`dist/filter-dom-url.js`) entries with bundled
TypeScript declarations. Both are minified with sourcemaps. `sideEffects: false`.

## License

[MIT](LICENSE) © Kassaila
