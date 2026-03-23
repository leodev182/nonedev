import { cloudinary } from '../config/cloudinary.js'

export type UploadFolder = 'projects' | 'articles'

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Sube un archivo (Buffer o base64 data URI) a Cloudinary.
 * Retorna la URL segura (https) y metadata básica.
 */
export async function uploadImage(
  source: Buffer | string,
  folder: UploadFolder = 'projects',
): Promise<UploadResult> {
  // Si viene como Buffer lo convertimos a base64 data URI
  const input =
    Buffer.isBuffer(source)
      ? `data:image/webp;base64,${source.toString('base64')}`
      : source

  const result = await cloudinary.uploader.upload(input, {
    folder:         `nonedev/${folder}`,
    transformation: [
      { width: 1200, height: 675, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  })

  return {
    url:      result.secure_url,
    publicId: result.public_id,
    width:    result.width,
    height:   result.height,
    format:   result.format,
    bytes:    result.bytes,
  }
}

/**
 * Elimina una imagen de Cloudinary por su public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
