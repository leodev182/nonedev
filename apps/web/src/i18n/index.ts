import es from './locales/es.json'
import en from './locales/en.json'

export type Locale = 'es' | 'en'
export type TranslationKey = keyof typeof es

const translations = { es, en } as const

export function useTranslations(locale: Locale) {
  const t = translations[locale]

  return function get<
    S extends keyof typeof es,
    K extends keyof (typeof es)[S],
  >(section: S, key: K): string {
    return (t[section] as Record<string, string>)[key as string] ?? `${String(section)}.${String(key)}`
  }
}

export function getLocalePath(locale: Locale, path: string): string {
  if (locale === 'es') return path
  return `/en${path}`
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es'
}

export const LOCALES: Locale[] = ['es', 'en']
export const DEFAULT_LOCALE: Locale = 'es'
