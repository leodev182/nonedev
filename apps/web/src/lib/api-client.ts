import { API_ROUTES } from '@portfolio/contracts'
import type { Project, Article, ContactMessage, PaginatedResponse, ApiResponse } from '@portfolio/contracts'

const BASE_URL = import.meta.env['PUBLIC_API_URL'] ?? 'http://localhost:3000'

async function get<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`)
  const body = await res.json() as ApiResponse<T>
  return body.data
}

export const api = {
  projects: {
    list: () =>
      get<PaginatedResponse<Project>>(API_ROUTES.projects.list),
    bySlug: (slug: string) =>
      get<Project>(API_ROUTES.projects.bySlug(slug)),
  },
  articles: {
    list: () =>
      get<PaginatedResponse<Article>>(API_ROUTES.articles.list),
    bySlug: (slug: string) =>
      get<Article>(API_ROUTES.articles.bySlug(slug)),
  },
  contact: {
    send: (body: { name: string; email: string; message: string }) =>
      fetch(`${BASE_URL}${API_ROUTES.contact.send}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json() as Promise<ApiResponse<ContactMessage>>),
  },
}
