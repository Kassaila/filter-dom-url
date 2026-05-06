# Filtering data with `<input>`, `<select>` & URLSearchParams

Tiny TypeScript library that keeps DOM filter controls (`<input>`, `<select>`) in sync with
`URLSearchParams` and `history`.

[![npm](https://img.shields.io/npm/v/@kassaila/filter-dom-url.svg)](https://www.npmjs.com/package/@kassaila/filter-dom-url)
[![release](https://img.shields.io/github/release/kassaila/filter-dom-url.svg)](/releases)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![requests](http://img.shields.io/badge/PRs-welcome-green.svg)](/pulls)

## Demo

A simple [demo](https://kassaila.github.io/filter-dom-url/) of usage. See the example sources:
[HTML](https://github.com/Kassaila/filter-dom-url/blob/master/docs/index.html),
[JS](https://github.com/Kassaila/filter-dom-url/blob/master/examples/src/js/app.js).

## Supported DOM elements

For `<input>`: `type` ∈ `checkbox | radio | color | range | date | month | week | time`.

For `<select>`: both `<select>` and `<select multiple>`.

## HTML structure

Minimal markup:

```html
<form data-filter-form="form-example">
  <input value="value-example" data-filter="type-example" type="checkbox" />
</form>
```

## Install

```sh
npm i @kassaila/filter-dom-url
```

## Usage

ESM (recommended):

```ts
import Filter from '@kassaila/filter-dom-url';

const filter = new Filter({
  formAttr: 'data-filter-form="form-example"',
  filterAttr: 'data-filter',
});
filter.init();
```

CommonJS:

```js
const { default: Filter } = require('@kassaila/filter-dom-url');
```

The package ships ESM (`dist/filter-dom-url.mjs`) and CJS (`dist/filter-dom-url.js`) entries with
bundled TypeScript declarations. Both are minified and shipped with sourcemaps.

## API

| Method                           | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `init()`                         | Initialize the instance — apply URL state to DOM, attach listeners |
| `updateDom()`                    | Re-apply current URL state to DOM elements                         |
| `setFiltersToUrl(newUrl)`        | Push current filter state to `window.history` (URL prototype)      |
| `resetUrl()`                     | Remove all known filter params from the URL                        |
| `resetDom()`                     | Reset the form (`form.reset()`)                                    |
| `getFilters()`                   | Get current filters as `{ [type]: string[] }`                      |
| `Filter.checkFilterDomType($el)` | Static — classify a DOM element to its filter type                 |
