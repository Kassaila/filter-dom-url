---
title: URL Serialization
description:
  How @kassaila/filter-dom-url encodes single- and multi-value filters into URLSearchParams, plus
  history and popstate behavior.
---

# URL Serialization

The URL is the source of truth. This page documents the wire format.

## Single-value filters

`select-single`, `radio`, `color`, `range`, `date`, `month`, `week`, `time` all use one URL param
per filter, with the literal control value:

```
?sort=popular&size=m&from=2026-01-01
```

Setting an empty value removes the param.

## Multi-value filters: space-joined

`checkbox` and `select-multiple` are serialized as a **single param** whose value is a
**space-joined string** of selected option values. They are **not** repeated keys.

```
?topic=news+blog&tags=tag-a+tag-c
```

(`+` is just URL-encoded space — `?topic=news%20blog` is the same payload.)

::: tip Wire contract

The space-joined format is the public wire contract for multi-value filters. If you parse the URL
yourself, split on space — not on `,` or repeated keys.

:::

## `getFilters()` shape

`filter.getFilters()` parses the current URL into a normalized object:

```ts
{
  topic: ['news', 'blog'],
  tags: ['tag-a', 'tag-c'],
  sort: ['popular'],
}
```

Single-value filters still come back as a one-item array.

## History integration

- `setFiltersToUrl(newUrl)` calls `window.history.pushState(null, '', updatableUrl)` with the
  current `URLSearchParams`. This is what creates a new history entry.
- A `popstate` listener (added in `init()`) reacts to **Back / Forward** by calling `form.reset()`
  and re-applying the URL filters to the DOM.

This means every navigation step the user takes through filter combinations is a real history entry
— predictable Back behavior, shareable URLs.

## Why space-joined and not repeated keys?

Two practical reasons:

- **Shorter URLs.** `?topic=news+blog+docs` is shorter than `?topic=news&topic=blog&topic=docs`.
- **Stable param order.** Repeated keys interleave with other params; a single param keeps each
  filter in one slot.

The trade-off: option values must not contain a literal space. If your options can contain spaces,
slugify them before binding to `value=""`.
