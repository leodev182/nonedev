import { Component, inject, signal, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterLink } from '@angular/router'
import { ApiService } from '../../core/http/api.service'
import { forkJoin } from 'rxjs'

interface Stat {
  label: string
  value: number | string
  icon: string
  route: string
  color: string
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  template: `
    <div class="page">
      <h1 class="page__title">Dashboard</h1>

      @if (loading()) {
        <div class="spinner-wrap">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <div class="stats-grid">
          @for (stat of stats(); track stat.label) {
            <a [routerLink]="stat.route" class="stat-card" [style.--accent]="stat.color">
              <mat-icon class="stat-icon">{{ stat.icon }}</mat-icon>
              <div class="stat-body">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem; }
    .page__title { font-size: 1.5rem; font-weight: 700; margin: 0 0 1.5rem; }
    .spinner-wrap { display: flex; justify-content: center; padding: 3rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .stat-card {
      display: flex; align-items: center; gap: 1rem;
      background: #1e293b; border-radius: 8px; padding: 1.25rem 1.5rem;
      text-decoration: none; color: inherit;
      border-left: 3px solid var(--accent, #7c3aed);
      transition: background .15s;
    }
    .stat-card:hover { background: #253347; }
    .stat-icon { font-size: 2rem; width: 2rem; height: 2rem; color: var(--accent, #7c3aed); }
    .stat-body { display: flex; flex-direction: column; }
    .stat-value { font-size: 2rem; font-weight: 700; line-height: 1; }
    .stat-label { font-size: .8rem; color: #94a3b8; margin-top: .2rem; }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService)

  readonly loading = signal(true)
  readonly stats   = signal<Stat[]>([])

  ngOnInit() {
    forkJoin({
      projects: this.api.getProjects(1, 1),
      articles: this.api.getArticles(1, 1),
      messages: this.api.getMessages(1, 1),
    }).subscribe({
      next: ({ projects, articles, messages }) => {
        this.stats.set([
          {
            label: 'Proyectos totales',
            value: projects.data.total,
            icon: 'code',
            route: '/projects',
            color: '#7c3aed',
          },
          {
            label: 'Artículos totales',
            value: articles.data.total,
            icon: 'article',
            route: '/articles',
            color: '#0891b2',
          },
          {
            label: 'Mensajes',
            value: messages.data.total,
            icon: 'mail',
            route: '/messages',
            color: '#059669',
          },
        ])
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}
