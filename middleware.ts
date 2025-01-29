import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check auth status from cookie
  const authStatus = request.cookies.get('authStatus')?.value === 'true'
  console.log("authStatus", authStatus)
  console.log("pathname", pathname)
  
  // Handle /login route separately
  if (pathname === '/login') {
    if (authStatus) {
      return NextResponse.redirect(new URL('/home', request.url))
    }
    return NextResponse.next()
  }

  // Handle other public routes
  if (publicRoutes.includes(pathname)) {
    if (authStatus && pathname === '/') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated for protected routes
  if (!authStatus) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .png (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}
