import type { Project, Article } from '@portfolio/contracts'

// En Docker: http://api:3000  — en local sin Docker: http://localhost:3000
// Usamos process.env directamente para garantizar que sea server-side
const BASE = process.env.API_URL ?? 'http://localhost:3000'

// ── Tipos de respuesta ────────────────────────────────────────────────────────

interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Helper ────────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  const json = (await res.json()) as { data: T }
  return json.data
}

// ── Proyectos ─────────────────────────────────────────────────────────────────

export async function getProjects(opts: { featured?: boolean; pageSize?: number } = {}): Promise<Project[]> {
  const params = new URLSearchParams()
  if (opts.featured) params.set('featured', 'true')
  if (opts.pageSize) params.set('pageSize', String(opts.pageSize))
  const result = await apiFetch<ListResponse<Project>>(`/api/v1/projects?${params}`)
  return result.data
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/api/v1/projects/${slug}`)
  } catch {
    return null
  }
}

// ── Artículos ─────────────────────────────────────────────────────────────────

export async function getArticles(opts: { locale?: string; pageSize?: number } = {}): Promise<Article[]> {
  const params = new URLSearchParams()
  if (opts.locale)   params.set('locale', opts.locale)
  if (opts.pageSize) params.set('pageSize', String(opts.pageSize))
  const result = await apiFetch<ListResponse<Article>>(`/api/v1/articles?${params}`)
  return result.data
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await apiFetch<Article>(`/api/v1/articles/${slug}`)
  } catch {
    return null
  }
}
