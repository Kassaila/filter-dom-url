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

Two attributes are all you need on the form, plus an Apply button to commit changes to the URL.

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

  <button type="reset" data-filter-reset>Reset</button>
  <button type="button" data-filter-apply>Apply</button>
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

document.querySelector('[data-filter-apply]')?.addEventListener('click', () => {
  filter.setFiltersToUrl(new URL(window.location.href));
});

document.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
  filter.resetUrl();
});
```

Now:

- Toggling controls updates `Filter`'s internal state.
- Clicking **Apply** writes the current state to the URL via `history.pushState` — this is what
  produces shareable URLs and a real history entry.
- Clicking **Reset** clears the form (native `<button type="reset">` behavior) and removes the
  filter params from the URL.
- Refreshing the page restores the form from the URL.
- Pressing **Back / Forward** rewinds through previously committed filter combinations.

## Teardown

`init()` registers `change` listeners on every filter element and a `popstate` listener on `window`.
Call `destroy()` to remove them when the page section or component is unmounted:

```ts
filter.destroy();
```

This is a no-op if `init()` was never called.

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
