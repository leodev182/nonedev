import type { Context } from 'hono'
import { uploadImage } from '../services/upload.service.js'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES     = 8 * 1024 * 1024 // 8 MB

export const uploadImageHandler = async (c: Context) => {
  const formData = await c.req.formData().catch(() => null)
  if (!formData) return c.json({ error: 'Expected multipart/form-data' }, 400)

  const file   = formData.get('file')
  const folder = (formData.get('folder') as string | null) ?? 'projects'

  if (!file || !(file instanceof File)) {
    return c.json({ error: 'Missing field: file' }, 400)
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json({ error: `Unsupported type: ${file.type}. Allowed: jpeg, png, webp, gif` }, 415)
  }

  if (file.size > MAX_BYTES) {
    return c.json({ error: 'File too large (max 8 MB)' }, 413)
  }

  if (folder !== 'projects' && folder !== 'articles') {
    return c.json({ error: 'folder must be "projects" or "articles"' }, 400)
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)

  const result = await uploadImage(buffer, folder as 'projects' | 'articles')
  return c.json({ data: result }, 201)
}
