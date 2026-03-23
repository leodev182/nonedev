/**
 * Browser-side logger — structured console wrapper.
 * Designed to be swapped for Sentry later:
 *   onError → Sentry.captureException
 *   onWarn  → Sentry.captureMessage
 */

type Level = 'debug' | 'info' | 'warn' | 'error'

const COLORS: Record<Level, string> = {
  debug: 'color:#64748b',
  info:  'color:#0ea5e9',
  warn:  'color:#f59e0b',
  error: 'color:#ef4444',
}

const isProd = typeof process !== 'undefined'
  ? process.env['NODE_ENV'] === 'production'
  : location.hostname !== 'localhost'

export interface BrowserLogger {
  debug(msg: string, ctx?: Record<string, unknown>): void
  info(msg:  string, ctx?: Record<string, unknown>): void
  warn(msg:  string, ctx?: Record<string, unknown>): void
  error(msg: string, ctx?: Record<string, unknown>): void
}

export function createLogger(name: string): BrowserLogger {
  function log(level: Level, msg: string, ctx?: Record<string, unknown>) {
    if (isProd && level === 'debug') return

    const prefix = `%c[${name}] [${level.toUpperCase()}]`
    if (ctx) {
      console[level](prefix, COLORS[level], msg, ctx)
    } else {
      console[level](prefix, COLORS[level], msg)
    }

    // TODO: hook Sentry here
    // if (level === 'error') Sentry.captureException(ctx?.err ?? new Error(msg))
    // if (level === 'warn')  Sentry.captureMessage(msg, 'warning')
  }

  return {
    debug: (msg, ctx) => log('debug', msg, ctx),
    info:  (msg, ctx) => log('info',  msg, ctx),
    warn:  (msg, ctx) => log('warn',  msg, ctx),
    error: (msg, ctx) => log('error', msg, ctx),
  }
}
