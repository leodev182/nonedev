import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { API_ROUTES } from '@portfolio/contracts'
import type {
  Project, Article, ContactMessage,
  CreateProjectInput, UpdateProjectInput,
  CreateArticleInput, UpdateArticleInput,
  PaginatedResponse, ApiResponse,
} from '@portfolio/contracts'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient)

  // Projects
  getProjects(page = 1, pageSize = 10) {
    return this.http.get<ApiResponse<PaginatedResponse<Project>>>(
      `${API_ROUTES.projects.list}?page=${page}&pageSize=${pageSize}&all=true`,
    )
  }
  createProject(body: CreateProjectInput) {
    return this.http.post<ApiResponse<Project>>(API_ROUTES.projects.create, body)
  }
  updateProject(id: string, body: UpdateProjectInput) {
    return this.http.patch<ApiResponse<Project>>(API_ROUTES.projects.update(id), body)
  }
  deleteProject(id: string) {
    return this.http.delete<void>(API_ROUTES.projects.delete(id))
  }

  // Articles
  getArticles(page = 1, pageSize = 10) {
    return this.http.get<ApiResponse<PaginatedResponse<Article>>>(
      `${API_ROUTES.articles.list}?page=${page}&pageSize=${pageSize}&all=true`,
    )
  }
  createArticle(body: CreateArticleInput) {
    return this.http.post<ApiResponse<Article>>(API_ROUTES.articles.create, body)
  }
  updateArticle(id: string, body: UpdateArticleInput) {
    return this.http.patch<ApiResponse<Article>>(API_ROUTES.articles.update(id), body)
  }
  deleteArticle(id: string) {
    return this.http.delete<void>(API_ROUTES.articles.delete(id))
  }

  // Contact
  getMessages(page = 1, pageSize = 20) {
    return this.http.get<ApiResponse<PaginatedResponse<ContactMessage>>>(
      `${API_ROUTES.contact.list}?page=${page}&pageSize=${pageSize}`,
    )
  }
  markRead(id: string) {
    return this.http.patch<ApiResponse<ContactMessage>>(API_ROUTES.contact.markRead(id), {})
  }
}
