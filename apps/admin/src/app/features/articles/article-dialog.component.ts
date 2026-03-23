import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatIconModule } from '@angular/material/icon'
import type { Article } from '@portfolio/contracts'
import { UploadService } from '../../core/http/upload.service'

export interface ArticleDialogData {
  article?: Article
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toArray(val: string) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

@Component({
  selector: 'app-article-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.article ? 'Editar artículo' : 'Nuevo artículo' }}</h2>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form-grid">

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" (input)="onTitleChange()" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" />
          <mat-hint>URL del artículo</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="published">Published</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Idioma</mat-label>
          <mat-select formControlName="locale">
            <mat-option value="es">Español</mat-option>
            <mat-option value="en">English</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tiempo de lectura (min)</mat-label>
          <input matInput type="number" formControlName="readingTimeMin" min="1" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Resumen</mat-label>
          <textarea matInput formControlName="summary" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Contenido (Markdown)</mat-label>
          <textarea matInput formControlName="content" rows="10" class="mono"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Tags (separado por comas)</mat-label>
          <input matInput formControlName="tags" placeholder="angular, typescript, web" />
        </mat-form-field>

        <!-- Cover image -->
        <div class="cover-row span-2">
          <span class="cover-label">Imagen de portada</span>
          @if (coverPreview()) {
            <img [src]="coverPreview()" class="cover-preview" alt="cover preview" />
          }
          <button type="button" mat-stroked-button (click)="fileInput.click()" [disabled]="uploading()">
            <mat-icon>upload</mat-icon>
            {{ uploading() ? 'Subiendo…' : 'Subir imagen' }}
          </button>
          <input #fileInput type="file" accept="image/*" hidden (change)="onFile($event)" />
          @if (form.get('coverUrl')?.value) {
            <span class="cover-url">✓ {{ form.get('coverUrl')?.value }}</span>
          }
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || uploading()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { width: 100%; max-height: 80vh; overflow-y: auto; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; padding: 0.5rem 0; }
    .span-2 { grid-column: span 2; }
    .cover-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .cover-label { font-size: .875rem; color: #94a3b8; }
    .cover-preview { width: 120px; height: 68px; object-fit: cover; border-radius: 4px; }
    .cover-url { font-size: .7rem; color: #4ade80; word-break: break-all; }
    textarea.mono { font-family: 'Fira Mono', 'Consolas', monospace; font-size: .8rem; }
  `],
})
export class ArticleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ArticleDialogComponent>)
  readonly data: ArticleDialogData = inject(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly upload = inject(UploadService)

  readonly uploading = signal(false)
  readonly coverPreview = signal<string | null>(null)

  readonly form = this.fb.nonNullable.group({
    title:          [this.data.article?.title ?? '', Validators.required],
    slug:           [this.data.article?.slug ?? '', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    summary:        [this.data.article?.summary ?? '', Validators.required],
    content:        [this.data.article?.content ?? '', Validators.required],
    tags:           [(this.data.article?.tags ?? []).join(', ')],
    status:         [this.data.article?.status ?? 'draft'],
    locale:         [this.data.article?.locale ?? 'es'],
    readingTimeMin: [this.data.article?.readingTimeMin ?? 5, [Validators.required, Validators.min(1)]],
    coverUrl:       [this.data.article?.coverUrl ?? ''],
  })

  constructor() {
    if (this.data.article?.coverUrl) {
      this.coverPreview.set(this.data.article.coverUrl)
    }
  }

  onTitleChange() {
    if (!this.data.article) {
      this.form.patchValue({ slug: slugify(this.form.getRawValue().title) })
    }
  }

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    this.uploading.set(true)
    this.coverPreview.set(URL.createObjectURL(file))
    this.upload.uploadImage(file, 'articles').subscribe({
      next: res => {
        this.form.patchValue({ coverUrl: res.url })
        this.uploading.set(false)
      },
      error: () => {
        this.coverPreview.set(null)
        this.uploading.set(false)
      },
    })
  }

  save() {
    if (this.form.invalid) return
    const v = this.form.getRawValue()
    this.dialogRef.close({
      ...v,
      tags:     toArray(v.tags),
      coverUrl: v.coverUrl || null,
    })
  }
}
