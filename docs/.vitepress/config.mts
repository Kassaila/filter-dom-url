import { createRequire } from 'node:module';
import { defineConfig } from 'vitepress';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string };

const HOSTNAME = 'https://kassaila.github.io';
const BASE = '/filter-dom-url/';
const SITE_URL = `${HOSTNAME}${BASE}`;
const REPO_URL = 'https://github.com/Kassaila/filter-dom-url';
const CHANGELOG_URL = `${REPO_URL}/blob/master/CHANGELOG.md`;
const MARKETING_DESCRIPTION =
  'Tiny TypeScript library that keeps DOM filter controls (input, select) in sync with URLSearchParams and window.history.';

export default defineConfig({
  title: 'filter-dom-url',
  description: MARKETING_DESCRIPTION,
  base: BASE,
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname: SITE_URL,
  },

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗜️</text></svg>',
      },
    ],
    ['meta', { name: 'author', content: 'Kassaila' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'filter, input, select, url, URLSearchParams, typescript, dom, history',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'filter-dom-url' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { property: 'og:title', content: 'filter-dom-url' }],
    ['meta', { property: 'og:description', content: MARKETING_DESCRIPTION }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        'name': '@kassaila/filter-dom-url',
        'description': MARKETING_DESCRIPTION,
        'codeRepository': REPO_URL,
        'programmingLanguage': 'TypeScript',
        'license': 'https://opensource.org/licenses/MIT',
        'downloadUrl': 'https://www.npmjs.com/package/@kassaila/filter-dom-url',
        'softwareVersion': pkg.version,
        'author': {
          '@type': 'Person',
          'name': 'Kassaila',
        },
      }),
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Live Demo', link: '/examples/live-demo' },
      { text: `v${pkg.version}`, link: CHANGELOG_URL },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What & Why', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Supported Elements', link: '/guide/supported-elements' },
            { text: 'URL Serialization', link: '/guide/url-serialization' },
            { text: 'Reset & Apply', link: '/guide/reset-and-apply' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [{ text: 'Filter', link: '/api/' }],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Live Demo', link: '/examples/live-demo' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: REPO_URL }],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: `${REPO_URL}/edit/master/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Kassaila',
    },
  },
});
