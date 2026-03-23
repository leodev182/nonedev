/**
 * Seed completo: admins + proyectos + artículos
 * Idempotente — inserta o actualiza sin duplicar.
 *
 * Uso:
 *   tsx src/db/seed.ts
 */

import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from './client.js'
import { admins, projects, articles } from './schema.js'

// ── Admins ────────────────────────────────────────────────────────────────────

async function seedAdmins() {
  const candidates = [
    { email: process.env.ADMIN_EMAIL!, password: process.env.ADMIN_PASSWORD!, label: 'principal' },
    ...(process.env.ADMIN_EMAIL_2 && process.env.ADMIN_PASSWORD_2
      ? [{ email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2, label: 'respaldo' }]
      : []),
  ]

  if (!candidates[0].email || !candidates[0].password) {
    console.error('❌ Faltan ADMIN_EMAIL y/o ADMIN_PASSWORD')
    process.exit(1)
  }

  for (const { email, password, label } of candidates) {
    const passwordHash = await hash(password, 12)
    const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
    if (existing.length > 0) {
      await db.update(admins).set({ passwordHash }).where(eq(admins.email, email))
      console.log(`  ✓ admin [${label}] actualizado: ${email}`)
    } else {
      await db.insert(admins).values({ email, passwordHash })
      console.log(`  ✓ admin [${label}] creado: ${email}`)
    }
  }
}

// ── Proyectos ─────────────────────────────────────────────────────────────────

const projectsData = [
  {
    slug:     'esdelcarajo',
    title:    'esdelcarajo',
    summary:  'E-commerce de ropa urbana con actitud. Catálogo, carrito, autenticación con Google y panel de gestión completo.',
    content:  'Plataforma de e-commerce completa construida con Next.js en el frontend y NestJS en el backend. Incluye catálogo de productos, carrito de compras, autenticación con Google OAuth, y un panel de administración para gestión de inventario y pedidos.',
    coverUrl: null,
    repoUrl:  'https://github.com/leodev182/esdelcarajo-frontend',
    demoUrl:  'https://esdelcarajo.com',
    tags:     ['ecommerce', 'fullstack'],
    platforms: ['web', 'fullstack'],
    stack:    ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind', 'shadcn/ui'],
    status:   'published' as const,
    featured: true,
  },
  {
    slug:     'almanovaclinic',
    title:    'Alma Nova Clinic',
    summary:  'Plataforma web para clínica de salud y bienestar. Notificaciones por email, interfaz moderna con Angular Material.',
    content:  'Plataforma web para clínica de salud y bienestar construida con Angular y Firebase. Incluye sistema de notificaciones por email con Resend, interfaz moderna con Angular Material y gestión de contenido.',
    coverUrl: null,
    repoUrl:  'https://github.com/leodev182/televidasaludable',
    demoUrl:  'https://almanovaclinic.com',
    tags:     ['salud', 'angular'],
    platforms: ['web'],
    stack:    ['Angular', 'Firebase', 'Angular Material', 'Tailwind', 'Resend'],
    status:   'published' as const,
    featured: true,
  },
  {
    slug:     'baby-experiment',
    title:    'The Baby Experiment',
    summary:  'App personal para revelación de género e invitación a baby shower. Animaciones e interactividad en tiempo real con Firebase.',
    content:  'Aplicación web personal para revelación de género e invitación a baby shower. Construida con React y Vite, con animaciones interactivas y sincronización en tiempo real usando Firebase.',
    coverUrl: null,
    repoUrl:  'https://github.com/leodev182/the-baby-experiment',
    demoUrl:  'https://baby-reveal-experiment-f9bb0.web.app/',
    tags:     ['personal', 'react', 'firebase'],
    platforms: ['web'],
    stack:    ['React', 'Vite', 'Firebase', 'Tailwind'],
    status:   'published' as const,
    featured: true,
  },
  {
    slug:     'xploratuapp',
    title:    'Xplora Tu App',
    summary:  'Plataforma de turismo y actividades de aventura. Reservas, soporte multi-moneda y gestión de proveedores. Colaborador frontend.',
    content:  'Plataforma de turismo y actividades de aventura donde participé como colaborador frontend. Implementé features de reservas, soporte multi-moneda y gestión de proveedores.',
    coverUrl: null,
    repoUrl:  null,
    demoUrl:  'https://xploratuapp.com',
    tags:     ['turismo', 'angular', 'colaboracion'],
    platforms: ['web'],
    stack:    ['Angular', 'Bootstrap', 'AWS S3', 'REST API'],
    status:   'published' as const,
    featured: true,
  },
]

async function seedProjects() {
  for (const p of projectsData) {
    const existing = await db.select().from(projects).where(eq(projects.slug, p.slug)).limit(1)
    if (existing.length > 0) {
      await db.update(projects).set(p).where(eq(projects.slug, p.slug))
      console.log(`  ✓ proyecto actualizado: ${p.title}`)
    } else {
      await db.insert(projects).values(p)
      console.log(`  ✓ proyecto creado: ${p.title}`)
    }
  }
}

// ── Artículos ─────────────────────────────────────────────────────────────────

const articlesData = [
  {
    slug:   'building-contx-en',
    locale: 'en',
    title:  'Building contx: a Local-First CLI for Project Context Retrieval',
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
    coverUrl:    null,
    tags:        ['cli', 'ai', 'developer-tools', 'local-first'],
    status:      'published' as const,
    publishedAt: new Date('2025-03-15'),
  },
  {
    slug:   'construyendo-contx-es',
    locale: 'es',
    title:  'Construyendo contx: un CLI local-first para contextualizar proyectos',
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
    coverUrl:    null,
    tags:        ['cli', 'ia', 'herramientas', 'local-first'],
    status:      'published' as const,
    publishedAt: new Date('2025-03-15'),
  },
]

async function seedArticles() {
  for (const a of articlesData) {
    const readingTimeMin = Math.ceil(a.content.split(/\s+/).length / 200)
    const existing = await db.select().from(articles).where(eq(articles.slug, a.slug)).limit(1)
    if (existing.length > 0) {
      await db.update(articles).set({ ...a, readingTimeMin }).where(eq(articles.slug, a.slug))
      console.log(`  ✓ artículo actualizado: ${a.title}`)
    } else {
      await db.insert(articles).values({ ...a, readingTimeMin })
      console.log(`  ✓ artículo creado: ${a.title}`)
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding database...\n')
  await seedAdmins()
  await seedProjects()
  await seedArticles()
  console.log('\n✅ Seed completo.\n')
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})
