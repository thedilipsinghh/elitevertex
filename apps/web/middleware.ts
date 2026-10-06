import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/eliteadmin4393');
  const isLoginPage = request.nextUrl.pathname === '/eliteadmin4393/login';

  // We check for admin_token cookie
  const hasToken = request.cookies.has('admin_token');

  if (isAdminPath) {
    if (!hasToken && !isLoginPage) {
      // Redirect to login if accessing protected admin route without token
      return NextResponse.redirect(new URL('/eliteadmin4393/login', request.url));
    }

    if (hasToken && isLoginPage) {
      // Redirect to courses dashboard if already logged in
      return NextResponse.redirect(new URL('/eliteadmin4393/courses', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/eliteadmin4393/:path*'],
};
