/**
 * Isomorphic logger entry.
 * Import from '@portfolio/logger/server' in Node apps (API).
 * Import from '@portfolio/logger/browser' in browser apps (web, admin).
 */
export { createLogger } from './browser.js'
export type { BrowserLogger } from './browser.js'
