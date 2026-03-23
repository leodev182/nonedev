import { z } from 'zod'

export const createArticleSchema = z.object({
  slug:       z.string().min(3).regex(/^[a-z0-9-]+$/),
  locale:     z.enum(['es', 'en']).default('es'),
  title:      z.string().min(3).max(150),
  summary:    z.string().min(10).max(400),
  content:    z.string().min(1),
  coverUrl:   z.string().url().nullable().default(null),
  tags:       z.array(z.string()).default([]),
  status:     z.enum(['published', 'draft']).default('draft'),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
