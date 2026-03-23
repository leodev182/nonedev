import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://leodev182.github.io',
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
