import type { MiddlewareHandler } from 'hono'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}

/** Soft auth: sets jwtPayload if token is valid, but never blocks the request */
export const optionalAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), env.JWT_SECRET)
      c.set('jwtPayload', payload)
    } catch { /* ignore */ }
  }
  await next()
}
