import { createHash } from 'crypto'

export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function getExpectedSessionToken(): string {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'super-secret-password-123'
  const secret = process.env.JWT_SECRET || 'cf_certifypro_secret_token_salt_2026'
  
  return hashString(`${username}:${password}:${secret}`)
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false
  const expected = getExpectedSessionToken()
  return token === expected
}

export function verifySession(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) return false
  const match = cookieHeader.match(/admin_session=([^;]+)/)
  if (!match) return false
  return verifyToken(match[1])
}
