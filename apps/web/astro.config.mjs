import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://nonedev-web.vercel.app',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,   // /proyectos (es) y /en/projects (en)
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
