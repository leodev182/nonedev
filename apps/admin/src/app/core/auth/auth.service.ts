import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap } from 'rxjs'
import type { ApiResponse } from '@portfolio/contracts'

interface AuthResponse {
  token: string
  admin: { id: string; email: string }
}

const TOKEN_KEY = 'portfolio_admin_token'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)

  readonly isAuthenticated = signal(!!localStorage.getItem(TOKEN_KEY))

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.data.token)
        this.isAuthenticated.set(true)
      }),
    )
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    this.isAuthenticated.set(false)
    this.router.navigate(['/login'])
  }
}
