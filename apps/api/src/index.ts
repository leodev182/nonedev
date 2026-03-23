import { serve } from '@hono/node-server'
import { env } from './config/env.js'
import { createLogger } from '@portfolio/logger/server'
import { app } from './app.js'

const log = createLogger('api')

serve({ fetch: app.fetch, port: env.PORT }, () => {
  log.info(`API running on http://localhost:${env.PORT}`)
})

export default app
