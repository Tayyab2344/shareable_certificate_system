export async function hashStringEdge(input: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getExpectedSessionTokenEdge(): Promise<string> {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'super-secret-password-123'
  const secret = process.env.JWT_SECRET || 'cf_certifypro_secret_token_salt_2026'
  
  return hashStringEdge(`${username}:${password}:${secret}`)
}

export async function verifyTokenEdge(token: string | null | undefined): Promise<boolean> {
  if (!token) return false
  const expected = await getExpectedSessionTokenEdge()
  return token === expected
}
