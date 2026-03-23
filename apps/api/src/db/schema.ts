import { pgTable, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

const uuid = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID())

export const projects = pgTable('projects', {
  id:        uuid(),
  slug:      text('slug').notNull().unique(),
  title:     text('title').notNull(),
  summary:   text('summary').notNull(),
  content:   text('content').notNull(),
  coverUrl:  text('cover_url'),
  repoUrl:   text('repo_url'),
  demoUrl:   text('demo_url'),
  tags:      jsonb('tags').notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  platforms: jsonb('platforms').notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  stack:     jsonb('stack').notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  status:    text('status').notNull().default('draft'),
  featured:  boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const articles = pgTable('articles', {
  id:             uuid(),
  slug:           text('slug').notNull().unique(),
  locale:         text('locale').notNull().default('es'),
  title:          text('title').notNull(),
  summary:        text('summary').notNull(),
  content:        text('content').notNull(),
  coverUrl:       text('cover_url'),
  tags:           jsonb('tags').notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  readingTimeMin: integer('reading_time_min').notNull().default(0),
  status:         text('status').notNull().default('draft'),
  publishedAt:    timestamp('published_at'),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
  updatedAt:      timestamp('updated_at').notNull().defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id:        uuid(),
  name:      text('name').notNull(),
  email:     text('email').notNull(),
  message:   text('message').notNull(),
  read:      boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const admins = pgTable('admins', {
  id:           uuid(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})
