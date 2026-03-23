const BASE = '/api/v1'

export const API_ROUTES = {
  projects: {
    list:     `${BASE}/projects`,
    bySlug:   (slug: string) => `${BASE}/projects/${slug}`,
    create:   `${BASE}/projects`,
    update:   (id: string)   => `${BASE}/projects/${id}`,
    delete:   (id: string)   => `${BASE}/projects/${id}`,
  },
  articles: {
    list:     `${BASE}/articles`,
    bySlug:   (slug: string) => `${BASE}/articles/${slug}`,
    create:   `${BASE}/articles`,
    update:   (id: string)   => `${BASE}/articles/${id}`,
    delete:   (id: string)   => `${BASE}/articles/${id}`,
  },
  contact: {
    send:     `${BASE}/contact`,
    list:     `${BASE}/contact`,              // admin only
    markRead: (id: string) => `${BASE}/contact/${id}/read`,
  },
  auth: {
    login:    `${BASE}/auth/login`,
    refresh:  `${BASE}/auth/refresh`,
    me:       `${BASE}/auth/me`,
  },
} as const
