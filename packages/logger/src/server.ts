/**
 * Server-side logger using pino.
 * Drop-in for console.log — structured JSON in prod, pretty in dev.
 * Ready for Sentry: hook onError to capture exceptions.
 */
import pino from 'pino'

const isDev = process.env['NODE_ENV'] !== 'production'

function makeLogger(name: string) {
  return pino({
    name,
    level: process.env['LOG_LEVEL'] ?? 'info',
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, ignore: 'pid,hostname' },
      },
    }),
  })
}

export type Logger = ReturnType<typeof makeLogger>

export function createLogger(name: string): Logger {
  return makeLogger(name)
}
