---
title: Live Demo
description:
  Working in-browser demo of @kassaila/filter-dom-url covering every supported input type. Toggle
  controls, click Apply to commit the current selection to the URL.
---

# Live Demo

Below is a real `Filter` instance mounted on this page. Toggle the controls, then click **Apply** to
push the current selection to the URL — that's the only step that updates `location.search`.
**Reset** clears both the form and the URL params. **Back / Forward** rewinds through the committed
states.

<ClientOnly>
  <FilterDemo />
</ClientOnly>

## Markup

```html
<form data-filter-form="live-demo">
  <input type="checkbox" value="checkbox-1" data-filter="checkbox" />
  <!-- … five checkboxes share the same data-filter="checkbox" -->

  <input type="radio" name="demo-radio" value="radio-1" data-filter="radio" />
  <!-- … five radios -->

  <select data-filter="select-1">
    <option value="">—</option>
    <option value="option-1-1">option-1-1</option>
    <!-- … -->
  </select>

  <select data-filter="select-multiple" multiple>
    <option value="option-1">option-1</option>
    <!-- … -->
  </select>

  <input type="color" data-filter="color" />
  <input type="range" data-filter="range" min="0" max="100" step="10" />
  <input type="date" data-filter="date" />
  <input type="month" data-filter="month" />
  <input type="week" data-filter="week" />
  <input type="time" data-filter="time" />

  <button type="reset">Reset</button>
  <button type="button">Apply</button>
</form>
```

## Setup

```ts
import Filter from '@kassaila/filter-dom-url';

const filter = new Filter({
  formAttr: 'data-filter-form="live-demo"',
  filterAttr: 'data-filter',
});

filter.init();
```

That's the entire wiring. See [Reset & Apply](/guide/reset-and-apply) for the optional
`Apply`/`Reset` button patterns shown above.
