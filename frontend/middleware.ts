import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("token")?.value

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Redirect root to login if not authenticated, dashboard if authenticated
  if (request.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
}
