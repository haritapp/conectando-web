// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
