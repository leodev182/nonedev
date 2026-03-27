import type { IncomingMessage, ServerResponse } from 'node:http'
import { app } from '../src/app.hono'

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? 'localhost'
  const url = `https://${host}${req.url ?? '/'}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue
    if (Array.isArray(value)) value.forEach(v => headers.append(key, v))
    else headers.set(key, value)
  }

  const method = req.method ?? 'GET'
  const init: RequestInit = { method, headers }

  if (method !== 'GET' && method !== 'HEAD') {
    const body = await readBody(req)
    if (body.length > 0) init.body = body
  }

  const response = await app.fetch(new Request(url, init))

  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))

  res.end(Buffer.from(await response.arrayBuffer()))
}
