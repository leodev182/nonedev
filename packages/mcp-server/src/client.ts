import { config } from './config.js'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const url = `${config.apiUrl}${path}`
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiToken}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`
    try {
      const err = await res.json() as { message?: string }
      if (err.message) message = err.message
    } catch { /* ignore parse error */ }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
