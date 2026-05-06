---
title: Supported Elements
description:
  The nine DOM control types @kassaila/filter-dom-url recognizes, with markup snippets for each.
---

# Supported Elements

The library recognizes the following DOM controls. Anything else inside the form is ignored.

| Tag                       | Normalized type   |
| ------------------------- | ----------------- |
| `<select>`                | `select-single`   |
| `<select multiple>`       | `select-multiple` |
| `<input type="checkbox">` | `checkbox`        |
| `<input type="radio">`    | `radio`           |
| `<input type="color">`    | `color`           |
| `<input type="range">`    | `range`           |
| `<input type="date">`     | `date`            |
| `<input type="month">`    | `month`           |
| `<input type="week">`     | `week`            |
| `<input type="time">`     | `time`            |

## Single-value controls

These write a single value to the URL param identified by the `data-filter` attribute.

### `<select>`

```html
<select data-filter="sort">
  <option value="latest">Latest</option>
  <option value="popular">Popular</option>
</select>
```

URL: `?sort=popular`

### `<input type="radio">`

All radios sharing one filter name should share a `name` attribute too, so the browser enforces
single-selection.

```html
<label>
  <input type="radio" name="size" value="s" data-filter="size" />
  S
</label>
<label>
  <input type="radio" name="size" value="m" data-filter="size" />
  M
</label>
<label>
  <input type="radio" name="size" value="l" data-filter="size" />
  L
</label>
```

URL: `?size=m`

### `color | range | date | month | week | time`

Each writes its current `value` to the URL, removing the param when the field is cleared.

```html
<input type="color" data-filter="theme" />
<input type="range" data-filter="price" min="0" max="100" step="10" />
<input type="date" data-filter="from" />
<input type="month" data-filter="month" />
<input type="week" data-filter="week" />
<input type="time" data-filter="time" />
```

## Multi-value controls

These serialize multiple selected values into a single URL param using a **space-joined string**.
See [URL Serialization](/guide/url-serialization) for details.

### `<input type="checkbox">`

```html
<label>
  <input type="checkbox" value="news" data-filter="topic" />
  News
</label>
<label>
  <input type="checkbox" value="blog" data-filter="topic" />
  Blog
</label>
<label>
  <input type="checkbox" value="docs" data-filter="topic" />
  Docs
</label>
```

URL with two boxes ticked: `?topic=news+blog`

### `<select multiple>`

```html
<select data-filter="tags" multiple>
  <option value="tag-a">Tag A</option>
  <option value="tag-b">Tag B</option>
  <option value="tag-c">Tag C</option>
</select>
```

URL: `?tags=tag-a+tag-c`
