import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add a custom header to track middleware execution
  const response = NextResponse.next()
  response.headers.set("x-middleware-cache", "no-cache")

  return response
}

// Only run middleware on API routes
export const config = {
  matcher: "/api/:path*",
}
