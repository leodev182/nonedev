import type { Article } from '@portfolio/contracts'

export type ArticleLocale = 'es' | 'en'

export interface LocalizedArticle extends Article {
  locale: ArticleLocale
}

export const articles: LocalizedArticle[] = [
  {
    id: '1',
    slug: 'building-contx-en',
    locale: 'en',
    title: 'Building contx: a Local-First CLI for Project Context Retrieval',
    summary: 'AI tools are powerful, but developer conversations lose context surprisingly fast. After running into this problem repeatedly, I started thinking about a different approach.',
    content: `AI tools are powerful, but developer conversations lose context surprisingly fast. After running into this problem repeatedly, I started thinking about a different approach. This is how the idea for contx was born.

## Building contx: a Local-First CLI for Project Context Retrieval

Some time ago, artificial intelligence began to significantly change the way we develop software. Like many developers, I started incorporating it into my workflow: reviewing code, refactoring, debugging issues, and exploring solutions faster.

However, I soon ran into a recurring problem.

As conversations with AI became longer, context started to fade. And when I needed to start a new conversation, the problem appeared again: I had to re-explain the project, the architectural decisions, or the structure of the codebase.

In other words, the problem wasn't a lack of information.

**The problem was retrieving the right context at the right moment.**

That's when a simple idea appeared:

> What if there was a tool capable of retrieving and organizing the context of a project so it could be reused when interacting with AI?

At first, I considered building a browser extension. But as the idea evolved, it started to move in a different direction. With the growing adoption of AI APIs and terminal-based developer workflows, a more universal approach seemed more appropriate.

That's how **contx** was born.

contx is a CLI tool designed to retrieve relevant context from a project quickly and deterministically, following a local-first philosophy and remaining completely independent from whichever AI model the developer chooses to use.

The design of contx follows a few simple principles:

- local-first architecture
- deterministic context retrieval
- AI provider independence
- natural integration with developer workflows

The goal is not to replace AI, but to help developers work with it more effectively.

But... contx is not about AI. **contx is about control.**`,
    coverUrl: null,
    tags: ['cli', 'ai', 'developer-tools', 'local-first'],
    readingTimeMin: 4,
    status: 'published',
    publishedAt: '2025-03-15T00:00:00Z',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'construyendo-contx-es',
    locale: 'es',
    title: 'Construyendo contx: un CLI local-first para contextualizar proyectos',
    summary: 'He estado pensando en un problema común al trabajar con IA en desarrollo: la pérdida de contexto en proyectos reales. De esa inquietud surgió contx.',
    content: `He estado pensando en un problema común al trabajar con IA en desarrollo: la pérdida de contexto en proyectos reales. De esa inquietud surgió contx, un CLI local-first diseñado para recuperar contexto de manera rápida y determinista.

## Construyendo contx: un CLI local-first para contextualizar proyectos

Hace un tiempo la inteligencia artificial comenzó a cambiar profundamente la forma en que desarrollamos software. Como muchos desarrolladores, empecé a incorporarla a mi flujo de trabajo: para revisar código, refactorizar, depurar errores o explorar soluciones más rápido.

Sin embargo, pronto me encontré con un problema recurrente.

A medida que las conversaciones con la IA se hacían más largas, el contexto comenzaba a perderse. Y cuando necesitaba iniciar una conversación nueva, el problema se repetía: debía volver a explicar el proyecto, las decisiones tomadas o la estructura del código.

En otras palabras, el problema no era la falta de información, sino la dificultad para recuperar el contexto correcto en el momento adecuado.

Fue entonces cuando me surgió una idea simple:

> ¿y si existiera una herramienta que ayudara a recuperar y organizar el contexto de un proyecto para utilizarlo en conversaciones con IA?

Inicialmente pensé en construir una extensión de navegador. Pero a medida que la idea fue madurando, empezó a tomar una dirección diferente. Con la creciente adopción de APIs de IA y herramientas de desarrollo basadas en terminal, un enfoque más universal parecía tener más sentido.

Así nació **contx**.

contx es una herramienta CLI diseñada para recuperar contexto relevante de un proyecto de manera rápida y determinista, manteniendo una filosofía local-first y siendo completamente independiente del modelo de IA que el desarrollador decida utilizar.

El diseño de contx se basa en algunos principios simples:

- arquitectura local-first
- recuperación determinista de contexto
- independencia de proveedores de IA
- integración natural con el flujo de trabajo del desarrollador

La idea es ayudar a los desarrolladores a trabajar con la IA de manera más eficiente.

Pero... contx no es sobre IA. **contx es sobre control.**`,
    coverUrl: null,
    tags: ['cli', 'ia', 'herramientas', 'local-first'],
    readingTimeMin: 4,
    status: 'published',
    publishedAt: '2025-03-15T00:00:00Z',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
  },
]

export function getArticlesByLocale(locale: ArticleLocale): LocalizedArticle[] {
  return articles.filter(a => a.locale === locale && a.status === 'published')
}

export function getRecentArticles(locale: ArticleLocale, limit = 3): LocalizedArticle[] {
  return getArticlesByLocale(locale)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, limit)
}
