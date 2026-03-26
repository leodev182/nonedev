import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import pino from 'pino'
import { env } from './config/env.js'
import { registerRoutes } from './routes/index.js'

const log = pino({ name: 'api', level: process.env['LOG_LEVEL'] ?? 'info' })

export function createApp() {
  const app = new Hono()

  app.use('*', logger())
  app.use('*', cors({ origin: '*', credentials: true }))

  app.get('/health', (c) => c.json({ status: 'ok' }))

  registerRoutes(app)

  app.notFound((c) => c.json({ error: 'Not found' }, 404))
  app.onError((err, c) => {
    log.error({ err: err.message, stack: err.stack }, 'Unhandled error')
    return c.json({ error: 'Internal server error' }, 500)
  })

  return app
}

export const app = createApp()
