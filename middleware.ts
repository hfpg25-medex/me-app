import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  //middleware is on server so can't use localStorage and can only use cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  const isLoginPage = request.nextUrl.pathname === '/'

  console.log('isAuthenticated=', isAuthenticated)
  console.log('isLoginPage=', isLoginPage)
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

