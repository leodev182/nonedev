import { Hono } from 'hono'
import { createProjectSchema, updateProjectSchema } from '@portfolio/contracts'
import { validate } from '../middleware/validate.middleware.js'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js'
import * as ctrl from '../controllers/projects.controller.js'

export const projectsRouter = new Hono()

// Public (but token is read if present so `all=true` works for admin)
projectsRouter.get('/',        optionalAuthMiddleware, ctrl.listProjects)
projectsRouter.get('/:slug',   ctrl.getProjectBySlug)

// Protected
projectsRouter.post('/',       authMiddleware, validate(createProjectSchema), ctrl.createProject)
projectsRouter.patch('/:id',   authMiddleware, validate(updateProjectSchema), ctrl.updateProject)
projectsRouter.delete('/:id',  authMiddleware, ctrl.deleteProject)
