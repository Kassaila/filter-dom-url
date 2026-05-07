---
layout: home
title: filter-dom-url — Form filters synced with URLSearchParams
titleTemplate: false
description:
  Tiny TypeScript library that keeps form filter controls (input, select) in sync with
  URLSearchParams and window.history.

hero:
  name: filter-dom-url
  text: Form filters in sync with the URL
  tagline:
    Tiny browser library that keeps form controls mirrored to URLSearchParams and window.history.
  image:
    src: /logo.svg
    alt: filter-dom-url
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Live Demo
      link: /examples/live-demo
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: '⭐ Star'
      link: https://github.com/Kassaila/filter-dom-url/stargazers

features:
  - icon: 🗜️
    title: Tiny & zero-dep
    details: Single TypeScript file, < 1.5 KB min+brotli. No runtime dependencies.
  - icon: 🔗
    title: URL ↔ DOM, both directions
    details: Form changes write to URLSearchParams; popstate replays URL state back into the form.
  - icon: 🧩
    title: Nine input types
    details: select, select multiple, checkbox, radio, color, range, date, month, week, time.
  - icon: 📦
    title: ESM + CJS
    details: Ships dual entries with bundled .d.ts/.d.mts type declarations and sourcemaps.
---
