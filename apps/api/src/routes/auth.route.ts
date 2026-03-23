import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.middleware.js'
import * as ctrl from '../controllers/auth.controller.js'

export const authRouter = new Hono()

authRouter.post('/login',   ctrl.login)
authRouter.post('/refresh', ctrl.refresh)
authRouter.get('/me',       authMiddleware, ctrl.me)
