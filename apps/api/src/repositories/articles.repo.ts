import { eq, desc, and } from 'drizzle-orm'
import { db } from '../db/client.js'
import { articles } from '../db/schema.js'
import type { CreateArticleInput, UpdateArticleInput } from '@portfolio/contracts'

export async function findAll(opts: { page: number; pageSize: number; locale?: string; all?: boolean }) {
  const { page, pageSize, locale, all } = opts
  const offset = (page - 1) * pageSize

  const where = all
    ? undefined
    : locale
      ? and(eq(articles.status, 'published'), eq(articles.locale, locale))
      : eq(articles.status, 'published')

  const data = await db
    .select()
    .from(articles)
    .where(where)
    .orderBy(desc(articles.publishedAt))
    .limit(pageSize)
    .offset(offset)

  const total = await db.$count(articles, where)

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function findBySlug(slug: string) {
  const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  return row ?? null
}

export async function create(input: CreateArticleInput) {
  const readingTimeMin = Math.ceil(input.content.split(/\s+/).length / 200)
  const [row] = await db.insert(articles).values({ ...input, readingTimeMin }).returning()
  return row!
}

export async function update(id: string, input: UpdateArticleInput) {
  const { publishedAt, ...rest } = input
  const setPayload: Record<string, unknown> = {
    ...rest,
    updatedAt: new Date(),
    ...(publishedAt !== undefined ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : {}),
  }
  // Auto-set publishedAt when publishing for the first time
  if (input.status === 'published' && !('publishedAt' in input)) {
    const [existing] = await db.select({ publishedAt: articles.publishedAt }).from(articles).where(eq(articles.id, id)).limit(1)
    if (!existing?.publishedAt) setPayload.publishedAt = new Date()
  }
  const [row] = await db
    .update(articles)
    .set(setPayload)
    .where(eq(articles.id, id))
    .returning()
  return row ?? null
}

export async function remove(id: string) {
  await db.delete(articles).where(eq(articles.id, id))
}
