import { Component, inject } from '@angular/core'
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../../core/auth/auth.service'

const NAV = [
  { path: '/dashboard', icon: 'dashboard',      label: 'Dashboard'  },
  { path: '/projects',  icon: 'folder',          label: 'Proyectos'  },
  { path: '/articles',  icon: 'article',         label: 'Artículos'  },
  { path: '/messages',  icon: 'mail',            label: 'Mensajes'   },
]

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatListModule, MatIconModule,
    MatToolbarModule, MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav__brand">Portfolio Admin</div>
        <mat-nav-list>
          @for (item of nav; track item.path) {
            <a mat-list-item [routerLink]="item.path" routerLinkActive="active">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
        <div class="sidenav__footer">
          <button mat-button (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Salir
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell { height: 100vh; }
    .sidenav {
      width: 220px;
      display: flex;
      flex-direction: column;
      background: #1e293b;
      color: #e2e8f0;
    }
    .sidenav__brand {
      padding: 1.25rem 1rem;
      font-weight: 700;
      font-size: 1rem;
      border-bottom: 1px solid #334155;
    }
    mat-nav-list { flex: 1; }
    .active { background: rgba(124, 58, 237, 0.2) !important; color: #a78bfa !important; }
    .sidenav__footer { padding: 1rem; border-top: 1px solid #334155; }
  `],
})
export class ShellComponent {
  readonly auth = inject(AuthService)
  readonly nav = NAV
}
