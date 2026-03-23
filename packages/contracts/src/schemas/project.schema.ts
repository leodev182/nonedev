import { z } from 'zod'

export const createProjectSchema = z.object({
  slug:      z.string().min(3).regex(/^[a-z0-9-]+$/),
  title:     z.string().min(3).max(120),
  summary:   z.string().min(10).max(300),
  content:   z.string().min(1),
  coverUrl:  z.string().url().nullable().default(null),
  repoUrl:   z.string().url().nullable().default(null),
  demoUrl:   z.string().url().nullable().default(null),
  tags:      z.array(z.string()).default([]),
  platforms: z.array(z.enum(['web', 'mobile', 'desktop', 'fullstack'])).min(1),
  stack:     z.array(z.string()).min(1),
  status:    z.enum(['published', 'draft', 'archived']).default('draft'),
  featured:  z.boolean().default(false),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
