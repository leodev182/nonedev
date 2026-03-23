import { Hono } from 'hono'
import { createArticleSchema, updateArticleSchema } from '@portfolio/contracts'
import { validate } from '../middleware/validate.middleware.js'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js'
import * as ctrl from '../controllers/articles.controller.js'

export const articlesRouter = new Hono()

// Public (token is read if present so `all=true` works for admin)
articlesRouter.get('/',       optionalAuthMiddleware, ctrl.listArticles)
articlesRouter.get('/:slug',  ctrl.getArticleBySlug)

// Protected
articlesRouter.post('/',      authMiddleware, validate(createArticleSchema), ctrl.createArticle)
articlesRouter.patch('/:id',  authMiddleware, validate(updateArticleSchema), ctrl.updateArticle)
articlesRouter.delete('/:id', authMiddleware, ctrl.deleteArticle)
