// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@zagotours/types';
import { ROLE_ACCESS, ROLE_HOME } from './config/roles.config';

// Routes that require authentication but are not role-specific
const AUTH_REQUIRED_ROUTES = ['/posts'];

// Public routes (no auth needed)
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
];

// Middleware
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Get token
  const token = await getToken({ req: request });
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as Role;

  //  Handle role-restricted routes
  const matchedRoleRoute = Object.keys(ROLE_ACCESS).find((prefix) =>
    path.startsWith(prefix),
  );

  if (matchedRoleRoute) {
    const allowedRoles = ROLE_ACCESS[matchedRoleRoute];
    if (!allowedRoles?.includes(role)) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
    return NextResponse.next();
  }

  //  Handle general auth-required routes
  if (AUTH_REQUIRED_ROUTES.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Everything else is public
  return NextResponse.next();
}

// Dashboard routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/independent-agent/:path*',
    '/corporate-agent/:path*',
    '/adventurer/:path*',
    '/affiliate/:path*',
    '/posts/:path*',
    '/posts',
  ],
};
