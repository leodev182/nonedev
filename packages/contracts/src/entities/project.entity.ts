export type ProjectStatus = 'published' | 'draft' | 'archived'
export type ProjectPlatform = 'web' | 'mobile' | 'desktop' | 'fullstack'

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  content: string              // markdown
  coverUrl: string | null
  repoUrl: string | null
  demoUrl: string | null
  tags: string[]
  platforms: ProjectPlatform[]
  stack: string[]
  status: ProjectStatus
  featured: boolean
  createdAt: string            // ISO string
  updatedAt: string
}
