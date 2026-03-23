import { eq, desc, and } from 'drizzle-orm'
import { db } from '../db/client.js'
import { projects } from '../db/schema.js'
import type { CreateProjectInput, UpdateProjectInput } from '@portfolio/contracts'

export async function findAll(opts: { page: number; pageSize: number; featured?: boolean; all?: boolean }) {
  const { page, pageSize, featured, all } = opts
  const offset = (page - 1) * pageSize

  const where = all
    ? undefined
    : featured !== undefined
      ? and(eq(projects.featured, featured), eq(projects.status, 'published'))
      : eq(projects.status, 'published')

  const data = await db
    .select()
    .from(projects)
    .where(where)
    .orderBy(desc(projects.createdAt))
    .limit(pageSize)
    .offset(offset)

  const total = await db.$count(projects, where)

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function findBySlug(slug: string) {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
  return row ?? null
}

export async function create(input: CreateProjectInput) {
  const [row] = await db.insert(projects).values(input).returning()
  return row!
}

export async function update(id: string, input: UpdateProjectInput) {
  const [row] = await db
    .update(projects)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning()
  return row ?? null
}

export async function remove(id: string) {
  await db.delete(projects).where(eq(projects.id, id))
}
