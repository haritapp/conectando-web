// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkVenueCards } from './src/lib/remark-venue-cards.ts';

const SITE_HOSTNAMES = new Set(['conec-tando.com', 'www.conec-tando.com']);

// remark-venue-cards already renders venue-card links with their own
// target/rel (see src/lib/remark-venue-cards.ts), so this plugin skips any
// `<a>` that already has a `target` to avoid double-applying attributes.
function isPlainExternalLink(element) {
  if (typeof element.properties?.target === 'string') return false;
  const href = element.properties?.href;
  if (typeof href !== 'string') return false;
  try {
    const url = new URL(href, 'https://www.conec-tando.com');
    return !SITE_HOSTNAMES.has(url.hostname);
  } catch {
    return false;
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.conec-tando.com',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  // Column articles migrated from hand-written .astro to Markdown must render
  // with byte-identical text (straight quotes/apostrophes as written), so the
  // default smartypants typographic transform is disabled site-wide.
  markdown: {
    smartypants: false,
    remarkPlugins: [remarkVenueCards],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          test: isPlainExternalLink,
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
