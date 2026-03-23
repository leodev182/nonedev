import type { MiddlewareHandler } from 'hono'
import type { ZodSchema } from 'zod'

export function validate(schema: ZodSchema): MiddlewareHandler {
  return async (c, next) => {
    const result = schema.safeParse(await c.req.json())
    if (!result.success) {
      return c.json(
        { error: 'Validation error', details: result.error.flatten().fieldErrors },
        422,
      )
    }
    c.set('body', result.data)
    await next()
  }
}
