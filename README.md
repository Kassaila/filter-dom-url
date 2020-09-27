# Filtering data with < input >, < select > & URLSearchParams

Make easy way for filtering data with URLSearchParams & different types of inputs, selects.

[![npm](https://img.shields.io/npm/v/@kassaila/filter-dom-url.svg)](https://www.npmjs.com/package/@kassaila/filter-dom-url)

[![release](https://img.shields.io/github/release/kassaila/filter-dom-url.svg)](/releases)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![requests](http://img.shields.io/badge/PRs-welcome-green.svg)](/pulls)

[![Build Status](https://travis-ci.org/Kassaila/filter-dom-url.svg?branch=master)](https://travis-ci.org/Kassaila/filter-dom-url)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Kassaila_filter-dom-url&metric=alert_status)](https://sonarcloud.io/dashboard?id=Kassaila_filter-dom-url)

## Example

A simple [demo](https://kassaila.github.io/filter-dom-url/) of usage `filter-dom-url`

See the code of an example - [HTML](https://github.com/Kassaila/filter-dom-url/blob/master/docs/index.html), [JS](https://github.com/Kassaila/filter-dom-url/blob/master/examples/src/js/app.js)

## Overview

### Supported DOM elements types

For tag `input`:

`<input type="...">` - `['checkbox', 'radio', 'color', 'range', 'date', 'month', 'week', 'time']`

For tag `select`:

`<select>` & `<select multiple>`

### HTML structure

Minimal structure for `filter-dom-url` initializing:

```
<form data-filter-form="form-example">
  <input value="value-example" data-filter="type-example" type="checkbox">
</form>
```

### Install

Install package from [npm](https://www.npmjs.com/package/@kassaila/filter-dom-url) and import:

```
import Filter from '@kassaila/filter-dom-url';
```

or copy [file](https://github.com/Kassaila/filter-dom-url/blob/master/dist/filter-dom-url.js) or [file.min](https://github.com/Kassaila/filter-dom-url/blob/master/dist/filter-dom-url.min.js) to your project and import:

```
import Filter from 'dist/filter-dom-url';
```

### Usage

Create `Filter` instance and initialize:

```
const filterExample = new Filter({
  formAttr: 'data-filter-form="form-example"',
  filterAttr: 'data-filter',
});

filterExample.init();
```
