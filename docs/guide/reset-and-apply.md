---
title: Reset & Apply
description:
  How to wire reset and apply buttons and choose between change-driven and explicit URL updates with
  @kassaila/filter-dom-url.
---

# Reset & Apply

The library writes to the URL on every `change` event by default. That's the right behavior for
fast-feedback dashboards; it's the wrong behavior for forms with many fields where each intermediate
state would create a useless history entry.

You have two patterns.

## Change-driven (default)

Just call `init()` and you're done. Every checkbox tick / select change writes to the URL
immediately.

```ts
const filter = new Filter({
  formAttr: 'data-filter-form="dashboard"',
  filterAttr: 'data-filter',
});

filter.init();
```

A native `<button type="reset">` inside the form will clear the inputs; you'll typically pair it
with `filter.resetUrl()` to clear the params too:

```ts
document.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
  filter.resetUrl();
});
```

## Explicit apply

If you'd rather batch multiple field changes into one history entry, prevent the change-driven
behavior from being visible to the user by calling `setFiltersToUrl` only on an explicit Apply
click:

```ts
const filter = new Filter({
  formAttr: 'data-filter-form="search"',
  filterAttr: 'data-filter',
});

filter.init();

document.querySelector('[data-filter-apply]')?.addEventListener('click', () => {
  filter.setFiltersToUrl(new URL(window.location.href));
});
```

`setFiltersToUrl` performs a single `history.pushState` from the current form state, so only one
history entry is created no matter how many fields the user changed.

## Helper methods

| Method         | Effect                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------- |
| `resetDom()`   | `form.reset()` — clears the inputs but leaves the URL alone                                  |
| `resetUrl()`   | Removes every known filter param from the URL via `pushState`                                |
| `updateDom()`  | Re-reads the URL and pushes it into the form (use after URL writes from outside the library) |
| `getFilters()` | Returns the parsed `{ [type]: string[] }` snapshot                                           |

## Combining with data fetching

The library does not fetch data. Subscribe to your own change source — typically a `popstate`
listener plus a one-shot read at app boot — and call your loader with `filter.getFilters()`:

```ts
const load = () => fetchResults(filter.getFilters());

window.addEventListener('popstate', load);
document.querySelector('[data-filter-form="search"]')!.addEventListener('change', load);

load();
```
