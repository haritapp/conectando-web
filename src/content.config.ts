import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Case studies (事例紹介)
const cases = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/case',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    slug: z.string(),
    lang: z.enum(['ja', 'en']),
    client: z.string().optional(),
    eventType: z.string().optional(),
    heroImage: z.string().optional().default(''),
    ogImage: z.string().optional().default(''),
    featured: z.boolean().default(false),
    keywords: z.array(z.string()).optional(),
  }),
});

// Blog articles (イベント運営者向けメディア)
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    slug: z.string(),
    lang: z.enum(['ja', 'en']),
    category: z.enum(['planning', 'venue', 'operations', 'global', 'tips']),
    author: z.enum(['shintaro', 'editorial']).default('editorial'),
    heroImage: z.string().optional().default(''),
    ogImage: z.string().optional().default(''),
    featured: z.boolean().default(false),
    keywords: z.array(z.string()).optional(),
  }),
});

// News / announcements (お知らせ)
const news = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/news',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    slug: z.string(),
    lang: z.enum(['ja', 'en']),
    heroImage: z.string().optional().default(''),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = { cases, blog, news };
