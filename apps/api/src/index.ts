import { serve } from '@hono/node-server'
import pino from 'pino'
import { env } from './config/env.js'
import { app } from './app.js'

const log = pino({ name: 'api', level: process.env['LOG_LEVEL'] ?? 'info' })

serve({ fetch: app.fetch, port: env.PORT }, () => {
  log.info(`API running on http://localhost:${env.PORT}`)
})

export default app
