import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('authToken')

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}