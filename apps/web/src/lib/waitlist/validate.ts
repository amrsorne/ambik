import { links } from '@ambik/catalog'

const ALLOWED_SERVICES = new Set<string>(
  Object.values(links).map((entry) => entry.service as string),
)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254
const COOLDOWN_MS = 60_000

let lastSubmitAt = 0

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return (
    email.length > 0 &&
    email.length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(email)
  )
}

export function isAllowedService(service: string): boolean {
  return ALLOWED_SERVICES.has(service)
}

export function assertSubmitCooldown(): boolean {
  return Date.now() - lastSubmitAt >= COOLDOWN_MS
}

export function markSubmitAttempt(): void {
  lastSubmitAt = Date.now()
}

export function isDuplicateKeyError(error: { code?: string }): boolean {
  return error.code === '23505'
}
