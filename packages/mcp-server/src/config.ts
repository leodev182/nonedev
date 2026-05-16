const API_URL = process.env.API_URL
const API_TOKEN = process.env.API_TOKEN

if (!API_URL) throw new Error('API_URL env variable is required')
if (!API_TOKEN) throw new Error('API_TOKEN env variable is required')

export const config = {
  apiUrl: API_URL.replace(/\/$/, ''),
  apiToken: API_TOKEN,
} as const
