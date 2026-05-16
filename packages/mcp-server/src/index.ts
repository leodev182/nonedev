import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerArticleTools } from './tools/articles.tools.js'
import { registerProjectTools } from './tools/projects.tools.js'
import { registerMessageTools } from './tools/messages.tools.js'

const server = new McpServer({
  name: 'portfolio',
  version: '1.0.0',
})

registerArticleTools(server)
registerProjectTools(server)
registerMessageTools(server)

const transport = new StdioServerTransport()
await server.connect(transport)
