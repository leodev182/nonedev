import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatIconModule } from '@angular/material/icon'
import type { Project } from '@portfolio/contracts'
import { UploadService } from '../../core/http/upload.service'

export interface ProjectDialogData {
  project?: Project
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toArray(val: string) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.project ? 'Editar proyecto' : 'Nuevo proyecto' }}</h2>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form-grid">

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" (input)="onTitleChange()" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" />
          <mat-hint>URL del proyecto</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="published">Published</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Resumen</mat-label>
          <textarea matInput formControlName="summary" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="span-2">
          <mat-label>Contenido</mat-label>
          <textarea matInput formControlName="content" rows="5"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Repo URL</mat-label>
          <input matInput formControlName="repoUrl" placeholder="https://github.com/..." />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Demo URL</mat-label>
          <input matInput formControlName="demoUrl" placeholder="https://..." />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stack (separado por comas)</mat-label>
          <input matInput formControlName="stack" placeholder="React, Node.js, PostgreSQL" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tags (separado por comas)</mat-label>
          <input matInput formControlName="tags" placeholder="fullstack, web" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Plataformas</mat-label>
          <mat-select formControlName="platforms" multiple>
            <mat-option value="web">Web</mat-option>
            <mat-option value="mobile">Mobile</mat-option>
            <mat-option value="desktop">Desktop</mat-option>
            <mat-option value="fullstack">Fullstack</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="featured-row">
          <mat-checkbox formControlName="featured">Destacado</mat-checkbox>
        </div>

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
    .featured-row { display: flex; align-items: center; }
    .cover-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .cover-label { font-size: .875rem; color: #94a3b8; }
    .cover-preview { width: 120px; height: 68px; object-fit: cover; border-radius: 4px; }
    .cover-url { font-size: .7rem; color: #4ade80; word-break: break-all; }
  `],
})
export class ProjectDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>)
  readonly data: ProjectDialogData = inject(MAT_DIALOG_DATA)
  private readonly fb = inject(FormBuilder)
  private readonly upload = inject(UploadService)

  readonly uploading = signal(false)
  readonly coverPreview = signal<string | null>(null)

  readonly form = this.fb.nonNullable.group({
    title:     [this.data.project?.title ?? '', Validators.required],
    slug:      [this.data.project?.slug ?? '', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    summary:   [this.data.project?.summary ?? '', Validators.required],
    content:   [this.data.project?.content ?? ''],
    repoUrl:   [this.data.project?.repoUrl ?? ''],
    demoUrl:   [this.data.project?.demoUrl ?? ''],
    stack:     [(this.data.project?.stack ?? []).join(', ')],
    tags:      [(this.data.project?.tags ?? []).join(', ')],
    platforms: [this.data.project?.platforms ?? [] as string[]],
    status:    [this.data.project?.status ?? 'draft'],
    featured:  [this.data.project?.featured ?? false],
    coverUrl:  [this.data.project?.coverUrl ?? ''],
  })

  constructor() {
    if (this.data.project?.coverUrl) {
      this.coverPreview.set(this.data.project.coverUrl)
    }
  }

  onTitleChange() {
    if (!this.data.project) {
      this.form.patchValue({ slug: slugify(this.form.getRawValue().title) })
    }
  }

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    this.uploading.set(true)
    this.coverPreview.set(URL.createObjectURL(file))
    this.upload.uploadImage(file, 'projects').subscribe({
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
      stack:    toArray(v.stack),
      tags:     toArray(v.tags),
      coverUrl: v.coverUrl || null,
      repoUrl:  v.repoUrl  || null,
      demoUrl:  v.demoUrl  || null,
    })
  }
}
