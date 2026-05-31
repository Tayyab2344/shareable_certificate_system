import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Define public pages and bypass conditions
  const isLoginPage = pathname === '/login'
  const isVerifyPage = pathname.startsWith('/verify')
  const isPublicLookupApi = pathname.startsWith('/api/certificates/') && req.method === 'GET'
  const isAuthApi = pathname.startsWith('/api/auth')
  const isStaticAsset = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon') || 
    pathname.startsWith('/public') || 
    pathname.includes('.')

  if (isLoginPage || isVerifyPage || isPublicLookupApi || isAuthApi || isStaticAsset) {
    return NextResponse.next()
  }

  // 2. Read admin_session cookie
  const sessionToken = req.cookies.get('admin_session')?.value
  const isAuthenticated = await verifyToken(sessionToken)

  if (!isAuthenticated) {
    // If API route, return 401 JSON response
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized administrative access.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // If Page route, redirect browser to /login
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Match all administrative routes
export const config = {
  matcher: [
    '/',
    '/api/certificates/:path*',
  ],
}
