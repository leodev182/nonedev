import type { Context } from 'hono'
import * as service from '../services/projects.service.js'

export const listProjects = async (c: Context) => {
  const page     = Number(c.req.query('page') ?? 1)
  const pageSize = Number(c.req.query('pageSize') ?? 10)
  const featured      = c.req.query('featured') === 'true' ? true : undefined
  const isAuthed      = !!c.get('jwtPayload')
  const all           = isAuthed && c.req.query('all') === 'true' ? true : undefined
  const data = await service.listProjects({ page, pageSize, ...(featured !== undefined && { featured }), ...(all !== undefined && { all }) })
  return c.json({ data })
}

export const getProjectBySlug = async (c: Context) => {
  const slug = c.req.param('slug')!
  const project = await service.getProjectBySlug(slug)
  if (!project) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: project })
}

export const createProject = async (c: Context) => {
  const body = c.get('body')
  const project = await service.createProject(body)
  return c.json({ data: project }, 201)
}

export const updateProject = async (c: Context) => {
  const id = c.req.param('id')!
  const body = c.get('body')
  const project = await service.updateProject(id, body)
  if (!project) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: project })
}

export const deleteProject = async (c: Context) => {
  const id = c.req.param('id')!
  await service.deleteProject(id)
  return c.body(null, 204)
}
