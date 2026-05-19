import type { CreateArticleInput, UpdateArticleInput } from '@portfolio/contracts'
import * as repo from '../repositories/articles.repo.js'

export const listArticles = (opts: { page: number; pageSize: number; locale?: string; all?: boolean }) =>
  repo.findAll(opts)

export const getArticleBySlug = (slug: string) =>
  repo.findBySlug(slug)

export const createArticle = (input: CreateArticleInput) =>
  repo.create(input)

export const updateArticle = (id: string, input: UpdateArticleInput) =>
  repo.update(id, input)

export const deleteArticle = (id: string) =>
  repo.remove(id)
