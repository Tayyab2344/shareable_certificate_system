export async function hashString(input: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getExpectedSessionToken(): Promise<string> {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'super-secret-password-123'
  const secret = process.env.JWT_SECRET || 'cf_certifypro_secret_token_salt_2026'
  
  return hashString(`${username}:${password}:${secret}`)
}

export async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false
  const expected = await getExpectedSessionToken()
  return token === expected
}

export async function verifySession(cookieHeader: string | null | undefined): Promise<boolean> {
  if (!cookieHeader) return false
  const match = cookieHeader.match(/admin_session=([^;]+)/)
  if (!match) return false
  return verifyToken(match[1])
}
