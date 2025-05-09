import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

const isProtectedRoutes = ['/dashboard', '/payment']
const allowedOrigins = [ 'http://localhost:3000']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default auth((req) => {
  const origin = req.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
  const pathname = req.nextUrl.pathname

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsOptions,
      },
    })
  }

  const isAuthorized = !!req.auth;

  if (isProtectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthorized) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl.origin))
  }

  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
