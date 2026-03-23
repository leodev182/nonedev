import { Hono } from 'hono'
import { contactSchema } from '@portfolio/contracts'
import { validate } from '../middleware/validate.middleware.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import * as ctrl from '../controllers/contact.controller.js'

export const contactRouter = new Hono()

// Public
contactRouter.post('/', validate(contactSchema), ctrl.sendMessage)

// Protected
contactRouter.get('/',          authMiddleware, ctrl.listMessages)
contactRouter.patch('/:id/read', authMiddleware, ctrl.markAsRead)
