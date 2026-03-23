import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV:     z.enum(['development', 'production', 'test']).default('development'),
  PORT:         z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAIL:  z.string().email(),
  CORS_ORIGIN:  z.string().default('http://localhost:4321'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME:   z.string(),
  CLOUDINARY_API_KEY:      z.string(),
  CLOUDINARY_API_SECRET:   z.string(),
})

const result = envSchema.safeParse(process.env)
if (!result.success) {
  console.error('[env] Validation failed:', JSON.stringify(result.error.flatten()))
}
export const env = (result.success ? result.data : process.env) as z.infer<typeof envSchema>
export type Env = z.infer<typeof envSchema>
