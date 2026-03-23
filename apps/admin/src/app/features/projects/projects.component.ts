import { Component, inject, signal, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import type { Project } from '@portfolio/contracts'
import { ApiService } from '../../core/http/api.service'
import { ProjectDialogComponent } from './project-dialog.component'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressBarModule],
  template: `
    <div class="page">
      <div class="page__header">
        <h1 class="page__title">Proyectos</h1>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon> Nuevo proyecto
        </button>
      </div>

      @if (loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <table mat-table [dataSource]="projects()" class="mat-elevation-z1">

        <ng-container matColumnDef="cover">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p">
            @if (p.coverUrl) {
              <img [src]="p.coverUrl" class="thumb" alt="" />
            } @else {
              <div class="thumb-placeholder"></div>
            }
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Título</th>
          <td mat-cell *matCellDef="let p">
            <div class="title-cell">
              <span>{{ p.title }}</span>
              <span class="slug">{{ p.slug }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let p">
            <span [class]="'chip-' + p.status">{{ p.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="platforms">
          <th mat-header-cell *matHeaderCellDef>Plataformas</th>
          <td mat-cell *matCellDef="let p">{{ p.platforms?.join(', ') }}</td>
        </ng-container>

        <ng-container matColumnDef="featured">
          <th mat-header-cell *matHeaderCellDef>Destacado</th>
          <td mat-cell *matCellDef="let p">
            @if (p.featured) { <mat-icon class="star">star</mat-icon> }
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p">
            <button mat-icon-button (click)="openEdit(p)" title="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(p)" title="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>

        @if (!loading() && projects().length === 0) {
          <tr class="mat-row">
            <td [attr.colspan]="cols.length" class="empty-row">Sin proyectos aún</td>
          </tr>
        }
      </table>
    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; }
    table { width: 100%; }
    .page__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .page__title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .chip-published { background: #14532d; color: #4ade80; padding: .2rem .6rem; border-radius: 4px; font-size: .75rem; }
    .chip-draft     { background: #3b3000; color: #facc15; padding: .2rem .6rem; border-radius: 4px; font-size: .75rem; }
    .thumb { width: 60px; height: 34px; object-fit: cover; border-radius: 3px; display: block; }
    .thumb-placeholder { width: 60px; height: 34px; background: #1e293b; border-radius: 3px; }
    .title-cell { display: flex; flex-direction: column; }
    .slug { font-size: .72rem; color: #64748b; }
    .star { color: #facc15; font-size: 18px; }
    .empty-row { text-align: center; padding: 2rem; color: #64748b; }
  `],
})
export class ProjectsComponent implements OnInit {
  private readonly api    = inject(ApiService)
  private readonly dialog = inject(MatDialog)
  private readonly snack  = inject(MatSnackBar)

  readonly projects = signal<Project[]>([])
  readonly loading  = signal(false)
  readonly cols = ['cover', 'title', 'status', 'platforms', 'featured', 'actions']

  ngOnInit() { this.load() }

  load() {
    this.loading.set(true)
    this.api.getProjects(1, 50).subscribe({
      next: res => {
        this.projects.set(res.data.data)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  openCreate() {
    this.dialog.open(ProjectDialogComponent, { data: {}, width: '900px', maxWidth: '95vw' })
      .afterClosed().subscribe(result => {
        if (!result) return
        this.api.createProject(result).subscribe({
          next: () => { this.snack.open('Proyecto creado ✓', '', { duration: 3000 }); this.load() },
          error: () => this.snack.open('Error al crear el proyecto', '', { duration: 3000 }),
        })
      })
  }

  openEdit(project: Project) {
    this.dialog.open(ProjectDialogComponent, { data: { project }, width: '900px', maxWidth: '95vw' })
      .afterClosed().subscribe(result => {
        if (!result) return
        this.api.updateProject(project.id, result).subscribe({
          next: () => { this.snack.open('Proyecto actualizado ✓', '', { duration: 3000 }); this.load() },
          error: () => this.snack.open('Error al actualizar', '', { duration: 3000 }),
        })
      })
  }

  delete(project: Project) {
    if (!confirm(`¿Eliminar "${project.title}"?`)) return
    this.api.deleteProject(project.id).subscribe({
      next: () => { this.snack.open('Proyecto eliminado', '', { duration: 3000 }); this.load() },
      error: () => this.snack.open('Error al eliminar', '', { duration: 3000 }),
    })
  }
}
