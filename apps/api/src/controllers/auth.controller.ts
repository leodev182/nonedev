import type { Context } from 'hono'
import * as service from '../services/auth.service.js'

export const login = async (c: Context) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()
  const result = await service.login(email, password)
  if (!result) return c.json({ error: 'Invalid credentials' }, 401)
  return c.json({ data: result })
}

export const refresh = async (c: Context) => {
  const { refreshToken } = await c.req.json<{ refreshToken: string }>()
  const result = await service.refresh(refreshToken)
  if (!result) return c.json({ error: 'Invalid token' }, 401)
  return c.json({ data: result })
}

export const me = async (c: Context) => {
  const payload = c.get('jwtPayload') as { sub: string; email: string }
  return c.json({ data: { id: payload.sub, email: payload.email } })
}
