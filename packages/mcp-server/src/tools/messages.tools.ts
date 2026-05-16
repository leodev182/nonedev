import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { API_ROUTES } from '@portfolio/contracts'
import { apiClient } from '../client.js'

const text = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
})

const err = (e: unknown) => ({
  content: [{ type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
  isError: true as const,
})

export function registerMessageTools(server: McpServer) {
  server.tool(
    'list_messages',
    'Lista los mensajes de contacto recibidos. Filtra por "read", "unread" o "all" (por defecto "all").',
    { filter: z.enum(['all', 'read', 'unread']).default('all') },
    async ({ filter }) => {
      try {
        const path = filter !== 'all'
          ? `${API_ROUTES.contact.list}?read=${filter === 'read'}`
          : API_ROUTES.contact.list
        return text(await apiClient.get(path))
      } catch (e) { return err(e) }
    },
  )

  server.tool(
    'mark_message_read',
    'Marca un mensaje de contacto como leído por su id.',
    { id: z.string().uuid() },
    async ({ id }) => {
      try {
        return text(await apiClient.patch(API_ROUTES.contact.markRead(id), {}))
      } catch (e) { return err(e) }
    },
  )
}
