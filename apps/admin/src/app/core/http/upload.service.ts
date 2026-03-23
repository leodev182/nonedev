import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient)

  uploadImage(file: File, folder: 'projects' | 'articles' = 'projects') {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return this.http
      .post<{ data: UploadResult }>('/api/v1/upload', form)
      .pipe(map(r => r.data))
  }
}
