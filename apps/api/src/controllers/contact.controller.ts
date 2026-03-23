import type { Context } from 'hono'
import * as service from '../services/contact.service.js'

export const sendMessage = async (c: Context) => {
  const body = c.get('body')
  const msg = await service.sendMessage(body)
  return c.json({ data: msg, message: 'Message sent' }, 201)
}

export const listMessages = async (c: Context) => {
  const page     = Number(c.req.query('page') ?? 1)
  const pageSize = Number(c.req.query('pageSize') ?? 20)
  const data = await service.listMessages({ page, pageSize })
  return c.json({ data })
}

export const markAsRead = async (c: Context) => {
  const id = c.req.param('id')!
  const msg = await service.markAsRead(id)
  if (!msg) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: msg })
}
