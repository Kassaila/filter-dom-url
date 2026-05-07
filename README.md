# 🔗 filter-dom-url

> _Form state, mirrored to the URL. And back, when the user hits Back._

[![npm version](https://img.shields.io/npm/v/@kassaila/filter-dom-url.svg)](https://www.npmjs.com/package/@kassaila/filter-dom-url)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@kassaila/filter-dom-url)](https://bundlephobia.com/package/@kassaila/filter-dom-url)
[![license](https://img.shields.io/npm/l/@kassaila/filter-dom-url.svg)](https://github.com/Kassaila/filter-dom-url/blob/master/LICENSE)
[![docs](https://img.shields.io/badge/docs-VitePress-blue)](https://kassaila.github.io/filter-dom-url/)

**Tiny browser library that keeps form filter controls in sync with `URLSearchParams` and
`window.history`.**

filter-dom-url turns a plain `<form>` into a **shareable, navigable, persistable filter UI** —
without a state library, without a router, without a framework.

Form changes write to the URL via `history.pushState`. URL changes — including `popstate` from
**Back / Forward** — replay back into the form. The `<form>` and `location.search` become two views
of the same state.

    📋 Form  ⇄  🔗 URLSearchParams  ⇄  🕓 history

## ✨ Features

- 🗜️ **Tiny & zero-dep** — single TypeScript file, **< 1.5 KB min+brotli**. No runtime dependencies.
- 🔄 **Two-way sync** — DOM `change` writes to the URL; `popstate` replays URL state back into the
  form.
- 🧩 **Input types** — `select`, `select multiple`, and `<input type="...">` for `checkbox`,
  `radio`, `color`, `range`, `date`, `month`, `week`, `time`.
- 🪶 **Vanilla DOM** — works with `<form>` element, no framework adapters required.
- 📜 **Stable wire format** — multi-value filters serialized as space-joined strings under a single
  param key, not repeated keys.
- 🎯 **Apply / Reset** — explicit commit and clear actions for forms with deferred submission.
- 📦 **ESM + CJS** — dual entries with bundled `.d.ts` / `.d.mts` declarations and sourcemaps.
  `sideEffects: false`.
- 🔒 **Type-safe** — full TypeScript types, named and default exports, static classifier for DOM
  elements.

## 📦 Installation

```bash
npm install @kassaila/filter-dom-url
```

## 🚀 Quick Start

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
  <button type="reset" data-filter-reset>Reset</button>
  <button type="button" data-filter-apply>Apply</button>
</form>
```

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

`Filter` tracks form changes in an internal `URLSearchParams`. **Apply** commits that state to
`location.search` via `history.pushState` — that's what makes the URL shareable and **Back /
Forward** rewind through committed states. **Reset** clears form + URL together.

## 📖 Documentation

**[View full documentation](https://kassaila.github.io/filter-dom-url/)** — getting started,
supported elements, URL serialization, API reference, and a live demo covering every input type.

## 🤝 Contributing

Contributions are welcome! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines.

## 📄 License

MIT
