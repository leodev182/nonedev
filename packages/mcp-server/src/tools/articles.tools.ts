import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { API_ROUTES, createArticleSchema, updateArticleSchema } from '@portfolio/contracts'
import { apiClient } from '../client.js'

const text = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
})

const err = (e: unknown) => ({
  content: [{ type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
  isError: true as const,
})

export function registerArticleTools(server: McpServer) {
  server.tool(
    'list_articles',
    'Lista todos los artículos del portafolio. Acepta filtro opcional por status (published/draft).',
    { status: z.enum(['published', 'draft']).optional() },
    async ({ status }) => {
      try {
        const path = status
          ? `${API_ROUTES.articles.list}?status=${status}`
          : API_ROUTES.articles.list
        return text(await apiClient.get(path))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'get_article',
    'Obtiene un artículo completo (incluyendo contenido markdown) por su slug.',
    { slug: z.string().min(1) },
    async ({ slug }) => {
      try {
        return text(await apiClient.get(API_ROUTES.articles.bySlug(slug)))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'create_article',
    'Crea un artículo nuevo en el portafolio. El contenido debe estar en markdown.',
    createArticleSchema.shape,
    async (input) => {
      try {
        return text(await apiClient.post(API_ROUTES.articles.create, input))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'update_article',
    'Edita un artículo existente por su id. Solo se actualizan los campos enviados.',
    { id: z.string().uuid(), ...updateArticleSchema.shape },
    async ({ id, ...body }) => {
      try {
        return text(await apiClient.patch(API_ROUTES.articles.update(id), body))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'publish_article',
    'Cambia el status de un artículo a "published" y registra la fecha de publicación.',
    { id: z.string().uuid() },
    async ({ id }) => {
      try {
        return text(await apiClient.patch(API_ROUTES.articles.update(id), { status: 'published' }))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'delete_article',
    'Elimina permanentemente un artículo por su id.',
    { id: z.string().uuid() },
    async ({ id }) => {
      try {
        return text(await apiClient.delete(API_ROUTES.articles.delete(id)))
      } catch (e) { return err(e) }
    },
  )
}
