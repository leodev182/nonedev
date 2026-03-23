import type { ContactInput } from '@portfolio/contracts'
import * as repo from '../repositories/contact.repo.js'

export const sendMessage = (input: ContactInput) =>
  repo.create(input)

export const listMessages = (opts: { page: number; pageSize: number }) =>
  repo.findAll(opts)

export const markAsRead = (id: string) =>
  repo.markRead(id)
