import { Component, inject, signal, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import type { Article } from '@portfolio/contracts'
import { ApiService } from '../../core/http/api.service'
import { ArticleDialogComponent } from './article-dialog.component'

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressBarModule],
  template: `
    <div class="page">
      <div class="page__header">
        <h1 class="page__title">Artículos</h1>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon> Nuevo artículo
        </button>
      </div>

      @if (loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <table mat-table [dataSource]="articles()" class="mat-elevation-z1">

        <ng-container matColumnDef="cover">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let a">
            @if (a.coverUrl) {
              <img [src]="a.coverUrl" class="thumb" alt="" />
            } @else {
              <div class="thumb-placeholder"></div>
            }
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Título</th>
          <td mat-cell *matCellDef="let a">
            <div class="title-cell">
              <span>{{ a.title }}</span>
              <span class="slug">{{ a.slug }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="locale">
          <th mat-header-cell *matHeaderCellDef>Idioma</th>
          <td mat-cell *matCellDef="let a">
            <span class="locale-badge">{{ a.locale ?? 'es' }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let a">
            <span [class]="'chip-' + a.status">{{ a.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="readingTime">
          <th mat-header-cell *matHeaderCellDef>Lectura</th>
          <td mat-cell *matCellDef="let a">{{ a.readingTimeMin }} min</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let a">
            <button mat-icon-button (click)="openEdit(a)" title="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(a)" title="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>

        @if (!loading() && articles().length === 0) {
          <tr class="mat-row">
            <td [attr.colspan]="cols.length" class="empty-row">Sin artículos aún</td>
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
    .locale-badge { font-size: .72rem; background: #1e293b; border-radius: 4px; padding: 2px 6px; text-transform: uppercase; }
    .empty-row { text-align: center; padding: 2rem; color: #64748b; }
  `],
})
export class ArticlesComponent implements OnInit {
  private readonly api    = inject(ApiService)
  private readonly dialog = inject(MatDialog)
  private readonly snack  = inject(MatSnackBar)

  readonly articles = signal<Article[]>([])
  readonly loading  = signal(false)
  readonly cols = ['cover', 'title', 'locale', 'status', 'readingTime', 'actions']

  ngOnInit() { this.load() }

  load() {
    this.loading.set(true)
    this.api.getArticles(1, 50).subscribe({
      next: res => {
        this.articles.set(res.data.data)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  openCreate() {
    this.dialog.open(ArticleDialogComponent, { data: {}, width: '900px', maxWidth: '95vw' })
      .afterClosed().subscribe(result => {
        if (!result) return
        this.api.createArticle(result).subscribe({
          next: () => { this.snack.open('Artículo creado ✓', '', { duration: 3000 }); this.load() },
          error: () => this.snack.open('Error al crear el artículo', '', { duration: 3000 }),
        })
      })
  }

  openEdit(article: Article) {
    this.dialog.open(ArticleDialogComponent, { data: { article }, width: '900px', maxWidth: '95vw' })
      .afterClosed().subscribe(result => {
        if (!result) return
        this.api.updateArticle(article.id, result).subscribe({
          next: () => { this.snack.open('Artículo actualizado ✓', '', { duration: 3000 }); this.load() },
          error: () => this.snack.open('Error al actualizar', '', { duration: 3000 }),
        })
      })
  }

  delete(article: Article) {
    if (!confirm(`¿Eliminar "${article.title}"?`)) return
    this.api.deleteArticle(article.id).subscribe({
      next: () => { this.snack.open('Artículo eliminado', '', { duration: 3000 }); this.load() },
      error: () => this.snack.open('Error al eliminar', '', { duration: 3000 }),
    })
  }
}
