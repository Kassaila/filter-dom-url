import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig, type SiteConfig } from 'vitepress';
import { withMermaid } from 'vitepress-mermaid-viewer';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string };

const HOSTNAME = 'https://kassaila.github.io';
const BASE = '/filter-dom-url/';
const SITE_URL = `${HOSTNAME}${BASE}`;
const REPO_URL = 'https://github.com/Kassaila/filter-dom-url';
const CHANGELOG_URL = `${REPO_URL}/blob/master/CHANGELOG.md`;
const MARKETING_DESCRIPTION =
  'Tiny TypeScript library that keeps form filter controls (input, select) in sync with URLSearchParams and window.history.';

const LLMS_INTRO =
  '@kassaila/filter-dom-url is a tiny (< 1.5 KB min+brotli) browser-only library that mirrors form filter controls (<input>, <select>) to URLSearchParams and window.history. Each link below has a clean Markdown version optimized for LLM consumption.';

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`;

const LLMS_SECTION_ORDER = ['/guide/', '/api/', '/examples/'] as const;
const LLMS_OPTIONAL_EXTRAS: ReadonlyArray<LlmsExtraLink> = [
  {
    text: 'Changelog',
    link: CHANGELOG_URL,
    description: 'Version history.',
  },
];

interface SidebarItem {
  text: string;
  link: string;
}

interface SidebarGroup {
  text: string;
  items: ReadonlyArray<SidebarItem>;
}

interface LlmsExtraLink {
  text: string;
  link: string;
  description: string;
}

type SidebarConfig = Record<string, ReadonlyArray<SidebarGroup>>;

const pageDescriptions = new Map<string, string>();

const copyMarkdownSources = async (siteConfig: SiteConfig): Promise<void> => {
  const destDirs = new Set(
    siteConfig.pages.map((pagePath) => dirname(join(siteConfig.outDir, pagePath))),
  );
  await Promise.all([...destDirs].map((dir) => mkdir(dir, { recursive: true })));
  await Promise.all(
    siteConfig.pages.map((pagePath) =>
      copyFile(join(siteConfig.srcDir, pagePath), join(siteConfig.outDir, pagePath)),
    ),
  );
};

const toRelativePath = (link: string): string => {
  const trimmed = link.replace(/^\//, '');

  return trimmed === '' || trimmed.endsWith('/') ? `${trimmed}index.md` : `${trimmed}.md`;
};

const toMarkdownUrl = (link: string): string => {
  if (/^https?:/.test(link)) {
    return link;
  }

  return `${SITE_URL}${toRelativePath(link)}`;
};

/**
 * Strip emojis from heading text before generating anchor slugs
 */
const slugify = (str: string): string =>
  str
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .normalize('NFKD')
    .trim()
    .toLowerCase()
    .replace(/[`()]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export default withMermaid(
  defineConfig({
    title: 'filter-dom-url',
    description: MARKETING_DESCRIPTION,
    base: BASE,
    cleanUrls: true,
    lastUpdated: true,

    sitemap: {
      hostname: SITE_URL,
    },

    markdown: {
      anchor: { slugify },
    },

    transformPageData(pageData) {
      const markdownUrl = `${SITE_URL}${pageData.relativePath}`;
      const canonicalUrl = markdownUrl.replace(/index\.md$/, '').replace(/\.md$/, '');

      const { description: frontmatterDescription } = pageData.frontmatter;

      if (typeof frontmatterDescription === 'string' && frontmatterDescription.length > 0) {
        pageDescriptions.set(
          pageData.relativePath,
          frontmatterDescription.replace(/[\r\n]+/g, ' ').trim(),
        );
      }

      const isHome = pageData.frontmatter.layout === 'home';
      const siteTitle = 'filter-dom-url';
      const title = !pageData.title
        ? siteTitle
        : isHome
          ? pageData.title
          : `${pageData.title} | ${siteTitle}`;
      const description =
        typeof frontmatterDescription === 'string' && frontmatterDescription.length > 0
          ? frontmatterDescription
          : MARKETING_DESCRIPTION;

      pageData.frontmatter.head ??= [];

      pageData.frontmatter.head.push(
        ['link', { rel: 'canonical', href: canonicalUrl }],
        ['meta', { property: 'og:url', content: canonicalUrl }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { name: 'twitter:title', content: title }],
        ['meta', { name: 'twitter:description', content: description }],
        [
          'link',
          {
            rel: 'alternate',
            type: 'text/markdown',
            title: 'Markdown version',
            href: markdownUrl,
          },
        ],
      );
    },

    async buildEnd(siteConfig) {
      await copyMarkdownSources(siteConfig);

      const sidebar = siteConfig.site.themeConfig.sidebar as SidebarConfig;

      const renderItem = (item: SidebarItem, fallbackDescription?: string): string => {
        const description =
          pageDescriptions.get(toRelativePath(item.link)) ?? fallbackDescription ?? '';
        const suffix = description.length > 0 ? `: ${description}` : '';

        return `- [${item.text}](${toMarkdownUrl(item.link)})${suffix}`;
      };

      const lines: string[] = [
        `# ${siteConfig.site.title}`,
        '',
        `> ${siteConfig.site.description}`,
        '',
        LLMS_INTRO,
        '',
      ];

      for (const sectionPath of LLMS_SECTION_ORDER) {
        for (const group of sidebar[sectionPath] ?? []) {
          lines.push(`## ${group.text}`, '');

          for (const item of group.items) {
            lines.push(renderItem(item));
          }

          lines.push('');
        }
      }

      lines.push('## Optional', '');

      for (const extra of LLMS_OPTIONAL_EXTRAS) {
        lines.push(renderItem({ text: extra.text, link: extra.link }, extra.description));
      }

      lines.push('');

      await writeFile(join(siteConfig.outDir, 'llms.txt'), lines.join('\n'), 'utf8');
      await writeFile(join(siteConfig.outDir, 'robots.txt'), ROBOTS_TXT, 'utf8');
    },

    head: [
      [
        'link',
        { rel: 'icon', type: 'image/png', href: `${BASE}favicon-96x96.png`, sizes: '96x96' },
      ],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
      ['link', { rel: 'shortcut icon', href: `${BASE}favicon.ico` }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${BASE}apple-touch-icon.png` }],
      ['meta', { name: 'apple-mobile-web-app-title', content: 'filter-dom-url' }],
      ['link', { rel: 'manifest', href: `${BASE}site.webmanifest` }],
      ['meta', { name: 'robots', content: 'index, follow' }],
      ['meta', { name: 'author', content: 'Kassaila' }],
      [
        'meta',
        {
          name: 'keywords',
          content:
            'filter, input, select, url, URLSearchParams, typescript, dom, history, query string, browser',
        },
      ],
      ['meta', { name: 'theme-color', content: '#6366f1' }],
      ['link', { rel: 'dns-prefetch', href: 'https://github.com' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'filter-dom-url' }],
      ['meta', { property: 'og:locale', content: 'en_US' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
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
          'runtimePlatform': 'Browser',
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
      siteUrl: SITE_URL,
      logo: { src: '/logo.svg', alt: 'filter-dom-url' },

      nav: [
        { text: 'Guide', link: '/guide/' },
        { text: 'API', link: '/api/' },
        { text: 'Live Demo', link: '/examples/live-demo' },
        { text: `v${pkg.version}`, link: CHANGELOG_URL },
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Getting Started',
            items: [
              { text: 'Introduction', link: '/guide/' },
              { text: 'Quick Start', link: '/guide/getting-started' },
            ],
          },
          {
            text: 'Concepts',
            items: [
              { text: 'Supported Elements', link: '/guide/supported-elements' },
              { text: 'URL Serialization', link: '/guide/url-serialization' },
              { text: 'Reset & Apply', link: '/guide/reset-and-apply' },
              { text: 'Architecture', link: '/guide/architecture' },
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

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © Kassaila',
      },
    },
  }),
);
