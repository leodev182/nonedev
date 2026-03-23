import type { Context } from 'hono'
import * as service from '../services/articles.service.js'

export const listArticles = async (c: Context) => {
  const page     = Number(c.req.query('page') ?? 1)
  const pageSize = Number(c.req.query('pageSize') ?? 10)
  const locale    = c.req.query('locale')  // 'es' | 'en' | undefined
  const isAuthed  = !!c.get('jwtPayload')
  const all       = isAuthed && c.req.query('all') === 'true' ? true : undefined
  const data = await service.listArticles({ page, pageSize, ...(locale !== undefined && { locale }), ...(all !== undefined && { all }) })
  return c.json({ data })
}

export const getArticleBySlug = async (c: Context) => {
  const slug = c.req.param('slug')!
  const article = await service.getArticleBySlug(slug)
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: article })
}

export const createArticle = async (c: Context) => {
  const body = c.get('body')
  const article = await service.createArticle(body)
  return c.json({ data: article }, 201)
}

export const updateArticle = async (c: Context) => {
  const id = c.req.param('id')!
  const body = c.get('body')
  const article = await service.updateArticle(id, body)
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: article })
}

export const deleteArticle = async (c: Context) => {
  const id = c.req.param('id')!
  await service.deleteArticle(id)
  return c.body(null, 204)
}
