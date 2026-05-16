import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { API_ROUTES, createProjectSchema, updateProjectSchema } from '@portfolio/contracts'
import { apiClient } from '../client.js'

const text = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
})

const err = (e: unknown) => ({
  content: [{ type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
  isError: true as const,
})

export function registerProjectTools(server: McpServer) {
  server.tool(
    'list_projects',
    'Lista todos los proyectos del portafolio. Acepta filtro opcional por status (published/draft/archived).',
    { status: z.enum(['published', 'draft', 'archived']).optional() },
    async ({ status }) => {
      try {
        const path = status
          ? `${API_ROUTES.projects.list}?status=${status}`
          : API_ROUTES.projects.list
        return text(await apiClient.get(path))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'get_project',
    'Obtiene un proyecto completo (incluyendo contenido markdown) por su slug.',
    { slug: z.string().min(1) },
    async ({ slug }) => {
      try {
        return text(await apiClient.get(API_ROUTES.projects.bySlug(slug)))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'create_project',
    'Crea un proyecto nuevo en el portafolio.',
    createProjectSchema.shape,
    async (input) => {
      try {
        return text(await apiClient.post(API_ROUTES.projects.create, input))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'update_project',
    'Edita un proyecto existente por su id. Solo se actualizan los campos enviados.',
    { id: z.string().uuid(), ...updateProjectSchema.shape },
    async ({ id, ...body }) => {
      try {
        return text(await apiClient.patch(API_ROUTES.projects.update(id), body))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'delete_project',
    'Elimina permanentemente un proyecto por su id.',
    { id: z.string().uuid() },
    async ({ id }) => {
      try {
        return text(await apiClient.delete(API_ROUTES.projects.delete(id)))
      } catch (e) { return err(e) }
    },
  )
}
