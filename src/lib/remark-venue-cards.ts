// Remark plugin: turns a paragraph containing nothing but a bare
// https://bizintokyo.com/... URL into a venue card (photo + title +
// description), fetched from that page's og: meta tags at build time.
// Ordinary in-text links (e.g. inside a table) are left untouched because
// they are never the sole content of their paragraph.
import { visit } from 'unist-util-visit';
import type { Root, Paragraph, PhrasingContent } from 'mdast';
import { getLinkCardData } from './linkcard-cache';

const BIZINTOKYO_PREFIX = 'https://bizintokyo.com/';

function soleUrl(paragraph: Paragraph): string | undefined {
  if (paragraph.children.length !== 1) return undefined;
  const child = paragraph.children[0] as PhrasingContent;

  // GFM autolink literals turn a bare URL into a `link` node.
  if (child.type === 'link' && child.url.startsWith(BIZINTOKYO_PREFIX)) {
    return child.url;
  }
  // Fallback in case autolinking is off: a lone text node that is just the URL.
  if (child.type === 'text') {
    const value = child.value.trim();
    if (/^https:\/\/bizintokyo\.com\/\S*$/.test(value)) return value;
  }
  return undefined;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

function renderCard(url: string, data: { title: string; description: string; image: string } | null): string {
  const title = data?.title ?? url;
  const description = data?.description ?? '';
  const image = data?.image ?? '';

  return `<a class="venue-card" href="${escapeAttr(url)}" target="_blank" rel="noopener">
${image ? `  <img class="venue-card-img" src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy" />` : ''}
  <span class="venue-card-body">
    <span class="venue-card-title">${escapeHtml(title)}</span>
    ${description ? `<span class="venue-card-desc">${escapeHtml(description)}</span>` : ''}
    <span class="venue-card-domain">bizintokyo.com</span>
  </span>
</a>`;
}

export function remarkVenueCards() {
  return async (tree: Root) => {
    const jobs: { index: number; parent: any; url: string }[] = [];

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (parent == null || index == null) return;
      const url = soleUrl(node);
      if (url) jobs.push({ index, parent, url });
    });

    for (const { index, parent, url } of jobs) {
      let data = null;
      try {
        data = await getLinkCardData(url);
      } catch {
        data = null;
      }
      parent.children[index] = { type: 'html', value: renderCard(url, data) };
    }
  };
}
