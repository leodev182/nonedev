import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { db } from '../db/client.js'
import { admins } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export async function login(email: string, password: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
  if (!admin) return null
  const valid = await compare(password, admin.passwordHash)
  if (!valid) return null

  const token = jwt.sign({ sub: admin.id, email: admin.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
  return { token, admin: { id: admin.id, email: admin.email } }
}

export async function refresh(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string }
    const newToken = jwt.sign({ sub: payload.sub, email: payload.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
    return { token: newToken }
  } catch {
    return null
  }
}
