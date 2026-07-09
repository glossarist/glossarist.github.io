import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString()),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const reference = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reference' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
})

export const collections = { blog, docs, reference, pages }
