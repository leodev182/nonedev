import { app } from './app.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

// Adapts Node.js IncomingMessage/ServerResponse → Web Request/Response for Hono
async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers['host'] ?? 'localhost'
  const url = new URL(req.url ?? '/', `https://${host}`)

  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
  }

  const method = (req.method ?? 'GET').toUpperCase()
  const chunks: Buffer[] = []
  if (method !== 'GET' && method !== 'HEAD') {
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
  }
  const body = chunks.length ? Buffer.concat(chunks) : null

  const webReq = new Request(url.toString(), {
    method,
    headers,
    ...(body ? { body } : {}),
  })

  const webRes = await app.fetch(webReq)

  res.statusCode = webRes.status
  webRes.headers.forEach((v, k) => res.setHeader(k, v))
  res.end(Buffer.from(await webRes.arrayBuffer()))
}

module.exports = handler
