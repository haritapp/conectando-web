// Build-time cache for og:title / og:description / og:image lookups used by
// the venue-card remark plugin. Successful fetches are persisted to
// src/data/linkcards.json so repeat builds don't hit the network again.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CACHE_PATH = fileURLToPath(new URL('../data/linkcards.json', import.meta.url));

export interface LinkCardData {
  title: string;
  description: string;
  image: string;
}

let cache: Record<string, LinkCardData> | null = null;

function loadCache(): Record<string, LinkCardData> {
  if (cache) return cache;
  if (existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_PATH, 'utf-8'));
    } catch {
      cache = {};
    }
  } else {
    cache = {};
  }
  return cache!;
}

function saveCache() {
  if (!cache) return;
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf-8');
}

function extractMeta(html: string, property: string): string | undefined {
  // Matches <meta property="og:title" content="..."> in either attribute order.
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) return match[1];
  }
  return undefined;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Returns cached/fetched og data for a URL, or null if it could not be fetched. */
export async function getLinkCardData(url: string): Promise<LinkCardData | null> {
  const store = loadCache();
  if (store[url]) return store[url];

  // Cloudflare Pages builds can't reach the outside network reliably (a
  // request can hang well past its abort timeout instead of failing fast).
  // Never fetch there: only cache entries committed ahead of time are used,
  // and anything missing falls back to a photo-less card.
  if (process.env.CF_PAGES) return null;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; conectando-linkcard-bot)' },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const title = extractMeta(html, 'og:title');
    if (!title) return null;

    const data: LinkCardData = {
      title: decodeEntities(title),
      description: decodeEntities(extractMeta(html, 'og:description') ?? ''),
      image: extractMeta(html, 'og:image') ?? '',
    };

    store[url] = data;
    saveCache();
    return data;
  } catch {
    return null;
  }
}
