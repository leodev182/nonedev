import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../config/env.js'
import * as schema from './schema.js'

const queryClient = postgres(env.DATABASE_URL, {
  prepare: false,          // required for connection poolers (Neon, Supabase, PgBouncer)
  idle_timeout: 20,        // close idle connections after 20s
  max_lifetime: 60 * 5,    // recycle connections every 5min
  connect_timeout: 10,     // fail fast instead of hanging forever
})
export const db = drizzle(queryClient, { schema })
export type DB = typeof db
