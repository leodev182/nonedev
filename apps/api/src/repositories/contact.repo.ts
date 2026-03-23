import { eq, desc } from 'drizzle-orm'
import { db } from '../db/client.js'
import { contactMessages } from '../db/schema.js'
import type { ContactInput } from '@portfolio/contracts'

export async function create(input: ContactInput) {
  const [row] = await db.insert(contactMessages).values(input).returning()
  return row!
}

export async function findAll(opts: { page: number; pageSize: number }) {
  const { page, pageSize } = opts
  const offset = (page - 1) * pageSize

  const data = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(pageSize)
    .offset(offset)

  const total = await db.$count(contactMessages)

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function markRead(id: string) {
  const [row] = await db
    .update(contactMessages)
    .set({ read: true })
    .where(eq(contactMessages.id, id))
    .returning()
  return row ?? null
}
