import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Preserve the filename as the entry ID, only stripping the .md/.mdx extension
// and collapsing trailing `/index`. Astro's default glob loader slugifies
// dots/dashes, which would turn `2026-05-27-concept-browser-0.4.md` into
// `2026-05-27-concept-browser-04`. Keeping the filename intact preserves
// the VitePress-era URL parity.
function generateId({ entry }: { entry: string }): string {
  let id = entry.replace(/\.(md|mdx)$/i, '')
  id = id.replace(/\/index$/, '')
  return id
}

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog', generateId }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString()),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs', generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const reference = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reference', generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const model = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/model', generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages', generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
})

export const collections = { blog, docs, model, reference, pages }
