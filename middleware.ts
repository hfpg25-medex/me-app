import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check auth status from cookie
  const authStatus = request.cookies.get('authStatus')?.value === 'true'
  
  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    // If user is already logged in, redirect to medical exam page
    if (authStatus) {
      return NextResponse.redirect(new URL('/medical-exam', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!authStatus) {
    // Redirect to login page
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
