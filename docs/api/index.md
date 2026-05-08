---
title: API Reference
description:
  Constructor options, instance methods, and static helpers exposed by @kassaila/filter-dom-url.
---

# API Reference

The library exposes a single class, exported as both default and named:

```ts
import Filter from '@kassaila/filter-dom-url';
// or
import { Filter } from '@kassaila/filter-dom-url';
```

## `new Filter(options)`

```ts
interface FilterOptions {
  /** Selector used as `[${formAttr}]` to find the form. Pass the full attribute = value pair. */
  formAttr: string;
  /** Selector used as `[${filterAttr}]` to find every filter control inside the form. */
  filterAttr: string;
}
```

Example:

```ts
const filter = new Filter({
  formAttr: 'data-filter-form="example"',
  filterAttr: 'data-filter',
});
```

`formAttr` is the **whole attribute selector body**, including the value — that's what lets one page
host multiple independent forms (`data-filter-form="search"`, `data-filter-form="results"`, …).
`filterAttr` is just the attribute name; the param key per control is whatever value you put on
`data-filter="…"`.

Call `init()` after construction to bind listeners and apply the URL state to the DOM.

## Instance methods

### `init(): void`

- Verifies the form selector resolves to at least one element (throws otherwise).
- Applies the current URL state to the form.
- Registers `change` listeners on every `[filterAttr]` control inside the form. These update the
  internal `URLSearchParams` only — they do **not** push to the actual URL. Call `setFiltersToUrl`
  to commit.
- Registers a `popstate` listener that resets the form and re-applies URL state.

### `updateDom(): void`

Re-applies the cached URL state to the DOM. Call this if you mutated the URL outside the library
(e.g. `history.replaceState` from your data layer) and want the form to follow.

### `setFiltersToUrl(newUrl: URL): void`

Calls `history.pushState` with the current `URLSearchParams` merged onto `newUrl`. Use this to
create an explicit history entry — typically from an "Apply" button.

### `resetUrl(): void`

Removes every filter param the library knows about from the URL via `pushState`. Other params on the
URL are preserved.

### `resetDom(): void`

Calls `form.reset()`. Does not touch the URL.

### `getFilters(): Record<string, string[]>`

Returns the current URL filters as a normalized object. Single-value filters come back as a one-item
array. Param keys that don't correspond to any element with `[filterAttr="<key>"]` are dropped.

```ts
filter.getFilters();
// { topic: ['news', 'blog'], sort: ['popular'] }
```

## Static helpers

### `Filter.checkFilterDomType($el: Element): FilterDomType | null`

Maps a DOM element to its normalized filter type string.

```ts
type SupportedFilterDomType =
  | 'select-single'
  | 'select-multiple'
  | 'checkbox'
  | 'radio'
  | 'color'
  | 'range'
  | 'date'
  | 'month'
  | 'week'
  | 'time';

type FilterDomType = SupportedFilterDomType | (string & {});
```

Returns `null` if the element's tag is not `<select>` or `<input>`. Returns the input's `type`
attribute value verbatim for any `<input>` — including unsupported types — so callers can
differentiate "unknown but valid input" from "wrong tag entirely."

## Types

```ts
export interface FilterOptions {
  filterAttr: string;
  formAttr: string;
}

export type SupportedFilterDomType =
  | 'select-single'
  | 'select-multiple'
  | 'checkbox'
  | 'radio'
  | 'color'
  | 'range'
  | 'date'
  | 'month'
  | 'week'
  | 'time';

export type FilterDomType = SupportedFilterDomType | (string & {});

export type FiltersMap = Record<string, string[]>;
```
