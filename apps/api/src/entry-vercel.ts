// CJS-style entry: no ESM import statements so esbuild preserves module.exports = fn verbatim.
// When a file has import/export statements, esbuild wraps it in __toCommonJS() and
// our module.exports assignment gets overwritten with an empty object.
// Using require() keeps this file as CJS — esbuild outputs module.exports = handler directly.
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-nocheck
const { app } = require('./app.js')

// Adapts Node.js IncomingMessage/ServerResponse → Web Request/Response for Hono
async function handler(req, res) {
  const host = req.headers['host'] ?? 'localhost'
  const url = new URL(req.url ?? '/', `https://${host}`)

  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
  }

  const method = (req.method ?? 'GET').toUpperCase()
  const chunks = []
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

// Export as both plain CJS (typeof mod === 'function') and
// ESM-style default (mod.default) to satisfy Vercel's Hono adapter check
module.exports = handler
module.exports.default = handler
