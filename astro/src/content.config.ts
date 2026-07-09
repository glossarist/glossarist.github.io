import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().refine(s => !isNaN(Date.parse(s)), { message: 'must be a valid ISO date' }),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const reference = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

export const collections = { blog, docs, reference }
