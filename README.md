# Portfolio — NoneDev

> Monorepo del portfolio personal de [leodev182](https://github.com/leodev182). Construido con Astro, Angular, Hono.js y PostgreSQL.

---

## Stack

| App | Tecnología | Descripción |
|-----|-----------|-------------|
| `apps/web` | Astro v5 + Tailwind | Portfolio público con i18n (ES/EN) |
| `apps/admin` | Angular 19 + Material | Panel de administración con CRUD completo |
| `apps/api` | Hono.js + Drizzle ORM | API REST con autenticación JWT |
| `packages/contracts` | TypeScript + Zod | Tipos, schemas y rutas compartidas |
| **DB** | PostgreSQL 17 (Neon) | Base de datos serverless |
| **Storage** | Cloudinary | Imágenes de proyectos y artículos |

---

## Arquitectura

```
leodev182.github.io/
├── apps/
│   ├── web/          # Astro — portfolio público (puerto 4321)
│   ├── admin/        # Angular — panel admin (puerto 4200)
│   └── api/          # Hono.js — REST API (puerto 3000)
├── packages/
│   └── contracts/    # Tipos y schemas compartidos (Zod)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Desarrollo local

### Requisitos

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/leodev182/leodev182.github.io.git
cd leodev182.github.io
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Editar ambos archivos con tus credenciales
```

### 3. Levantar con Docker

```bash
docker compose up --build
```

| Servicio | URL |
|---------|-----|
| Web (portfolio) | http://localhost:4321 |
| Admin | http://localhost:4200 |
| API | http://localhost:3000 |

### 4. Migrar y seedear la base de datos

```bash
# Dentro del contenedor de la API:
docker exec portfolio_api sh -c "pnpm db:migrate && pnpm db:seed"

# O desde el host con tu DATABASE_URL:
DATABASE_URL="postgresql://..." pnpm --filter @portfolio/api db:migrate
DATABASE_URL="postgresql://..." pnpm --filter @portfolio/api db:seed
```

---

## Comandos útiles

```bash
# Desarrollo (sin Docker)
pnpm dev                          # todas las apps
pnpm dev --filter @portfolio/web  # solo web
pnpm dev --filter @portfolio/api  # solo api
pnpm dev --filter @portfolio/admin # solo admin

# Base de datos
pnpm --filter @portfolio/api db:generate  # generar migraciones
pnpm --filter @portfolio/api db:migrate   # aplicar migraciones
pnpm --filter @portfolio/api db:seed      # cargar datos iniciales
pnpm --filter @portfolio/api db:studio    # Drizzle Studio (GUI)

# Build
pnpm build                        # todas las apps
```

---

## API — Endpoints principales

```
POST /api/v1/auth/login           # Login admin → JWT

GET  /api/v1/projects             # Listar proyectos
POST /api/v1/projects             # Crear proyecto (auth)
PUT  /api/v1/projects/:id         # Editar proyecto (auth)
DEL  /api/v1/projects/:id         # Eliminar proyecto (auth)

GET  /api/v1/articles             # Listar artículos (?locale=es|en)
POST /api/v1/articles             # Crear artículo (auth)
PUT  /api/v1/articles/:id         # Editar artículo (auth)
DEL  /api/v1/articles/:id         # Eliminar artículo (auth)

POST /api/v1/upload               # Subir imagen → Cloudinary (auth)
POST /api/v1/contact              # Formulario de contacto
GET  /api/v1/messages             # Ver mensajes (auth)
```

---

## Deploy

| Servicio | Plataforma | Notas |
|---------|-----------|-------|
| `apps/web` | Vercel | Root dir: `apps/web` |
| `apps/admin` | Vercel | Root dir: `apps/admin` |
| `apps/api` | Vercel (serverless) | Root dir: `apps/api` |
| PostgreSQL | Neon | Región: AWS us-east-1 |
| Imágenes | Cloudinary | Folder: `nonedev/` |

### Variables de entorno en producción (API)

```
DATABASE_URL=          # Neon connection string
JWT_SECRET=            # Secret aleatorio (mínimo 32 chars)
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=
ADMIN_PASSWORD=
CORS_ORIGIN=           # URL del frontend en producción
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Features

- **i18n** — Portfolio en Español e Inglés
- **Admin panel** — CRUD completo de proyectos, artículos y mensajes
- **Upload de imágenes** — Cloudinary con transformaciones automáticas (1200×675)
- **JWT Auth** — Login seguro con expiración configurable
- **SSG** — Astro genera páginas estáticas para máximo rendimiento
- **Dark theme** — Material Design dark theme en el admin
- **Docker** — Entorno de desarrollo 100% containerizado

---

## Licencia

MIT © [leodev182](https://github.com/leodev182)
