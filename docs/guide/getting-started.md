---
title: Getting Started
description:
  Install @kassaila/filter-dom-url and wire up your first URL-synced filter form in under a minute.
---

# Getting Started

## Install

```bash
npm install @kassaila/filter-dom-url
```

The package ships ESM (`dist/filter-dom-url.mjs`) and CJS (`dist/filter-dom-url.js`) entries with
bundled TypeScript declarations.

## Minimal markup

Two attributes are all you need: one on the form, one on each filter control.

```html
<form data-filter-form="example">
  <label>
    <input value="news" data-filter="topic" type="checkbox" />
    News
  </label>
  <label>
    <input value="blog" data-filter="topic" type="checkbox" />
    Blog
  </label>

  <select data-filter="sort">
    <option value="latest">Latest</option>
    <option value="popular">Popular</option>
  </select>

  <button type="reset">Reset</button>
</form>
```

## Wire it up

```ts
import Filter from '@kassaila/filter-dom-url';

const filter = new Filter({
  formAttr: 'data-filter-form="example"',
  filterAttr: 'data-filter',
});

filter.init();
```

That's it. Now:

- Checking a topic box appends `topic=news blog` to the URL.
- Picking a sort option sets `sort=popular`.
- Refreshing the page restores the filter state from the URL.
- Pressing **Back** rewinds to the previous filter combination.

## CommonJS consumers

```js
const { default: Filter } = require('@kassaila/filter-dom-url');
```

## See it live

Head over to the [Live Demo](/examples/live-demo) for a working form covering every supported input
type.

## Next

- [Supported Elements](/guide/supported-elements) — what `<input type="...">` and `<select>`
  variants are recognized.
- [URL Serialization](/guide/url-serialization) — how multi-value filters are encoded.
- [Reset & Apply](/guide/reset-and-apply) — explicit reset/apply buttons and the `setFiltersToUrl`
  flow.
