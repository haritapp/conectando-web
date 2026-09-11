// src/lib/categories.ts
// Column article categories, with display labels per language.

export const CATEGORY_LABELS = {
  cost: { ja: '費用', en: 'Cost' },
  venue: { ja: '会場', en: 'Venue' },
  language: { ja: '言語・通訳', en: 'Language' },
  planning: { ja: '準備・進め方', en: 'Planning' },
  operations: { ja: '当日運営', en: 'Operations' },
} as const;

export type ColumnCategory = keyof typeof CATEGORY_LABELS;

export function categoryLabel(category: ColumnCategory, lang: 'ja' | 'en'): string {
  return CATEGORY_LABELS[category][lang];
}
