import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logInfo } from '@/lib/logger'

export function loggingMiddleware(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  // Log the request
  logInfo('Incoming request', {
    method: request.method,
    url: request.url,
    requestId,
    userAgent: request.headers.get('user-agent'),
  })

  const response = NextResponse.next()

  // Add timing and request ID headers
  response.headers.set('X-Request-Id', requestId)
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`)

  return response
}

export const config = {
  matcher: '/api/:path*',
}
