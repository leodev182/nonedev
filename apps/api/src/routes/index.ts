import type { Hono } from 'hono'
import { projectsRouter } from './projects.route.js'
import { articlesRouter } from './articles.route.js'
import { contactRouter } from './contact.route.js'
import { authRouter } from './auth.route.js'
import { uploadRouter } from './upload.route.js'

export function registerRoutes(app: Hono) {
  app.route('/api/v1/projects', projectsRouter)
  app.route('/api/v1/articles', articlesRouter)
  app.route('/api/v1/contact',  contactRouter)
  app.route('/api/v1/auth',     authRouter)
  app.route('/api/v1/upload',   uploadRouter)
}
