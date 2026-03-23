import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { uploadImageHandler } from '../controllers/upload.controller.js'

export const uploadRouter = new Hono()

// POST /api/v1/upload  — protegido, solo admin
uploadRouter.post('/', authMiddleware, uploadImageHandler)
