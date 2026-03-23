import type { CreateProjectInput, UpdateProjectInput } from '@portfolio/contracts'
import * as repo from '../repositories/projects.repo.js'

export const listProjects = (opts: { page: number; pageSize: number; featured?: boolean; all?: boolean }) =>
  repo.findAll(opts)

export const getProjectBySlug = (slug: string) =>
  repo.findBySlug(slug)

export const createProject = (input: CreateProjectInput) =>
  repo.create(input)

export const updateProject = (id: string, input: UpdateProjectInput) =>
  repo.update(id, input)

export const deleteProject = (id: string) =>
  repo.remove(id)
