import type { NextApiRequest, NextApiResponse } from 'next'
import { getExpectedSessionToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  const { username, password } = req.body

  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'super-secret-password-123'

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Invalid username or password.' })
  }

  try {
    const sessionToken = await getExpectedSessionToken()
    
    // Set secure HttpOnly cookie (expires in 24 hours)
    const isProd = process.env.NODE_ENV === 'production'
    res.setHeader(
      'Set-Cookie',
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isProd ? '; Secure' : ''}`
    )

    return res.status(200).json({ success: true, message: 'Authentication successful.' })
  } catch (error) {
    console.error('Login API error:', error)
    return res.status(500).json({ error: 'Authentication processing failed.' })
  }
}
