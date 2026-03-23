export type ArticleStatus = 'published' | 'draft'
export type ArticleLocale = 'es' | 'en'

export interface Article {
  id: string
  slug: string
  locale: ArticleLocale
  title: string
  summary: string
  content: string              // markdown
  coverUrl: string | null
  tags: string[]
  readingTimeMin: number
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}
