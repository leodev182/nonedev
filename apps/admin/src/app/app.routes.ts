import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'articles',
        loadComponent: () => import('./features/articles/articles.component').then(m => m.ArticlesComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/contact/messages.component').then(m => m.MessagesComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
]
