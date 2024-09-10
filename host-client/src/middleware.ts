// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidToken, getUserRole } from '@/app/_utils/auth';

// Define protected, restricted, and role-based routes
const protectedRoutes = ['/products', '/cart', '/orders']; // Routes that require authentication
const authRoutes = ['/sign-up', '/sign-in']; // Routes accessible only when not authenticated
const adminRoutes = ['/admin-dashboard']; // Routes accessible only by users with 'admin' role
const publicRoutes = ['/unauthenticated', '/unauthorized', '/home'];

type Roles = 'user' | 'admin';

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const { pathname } = req.nextUrl;

  const isAuthenticated = isValidToken(token);

  const userRole: any = isAuthenticated ? getUserRole(token) : 'user';

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Check if the user is trying to access an auth route or public route
    if (!authRoutes.some(route => pathname.startsWith(route)) && !publicRoutes.some(route => pathname.startsWith(route))) {
      //console.log(`Redirecting to /unauthenticated because user is not authenticated and trying to access: ${pathname}`);
      return NextResponse.redirect(new URL('/unauthenticated', req.url));
    }
  }

  // Handle authenticated users
  if (isAuthenticated) {

    if (authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect authenticated users away from auth routes
    if (authRoutes.some(route => pathname.startsWith(route))) { 
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle role-based access for admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Additional check for protected routes if authenticated
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      //console.log(`Accessing protected route: ${pathname}. No redirect needed.`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api/auth).*)(.+)'
  ],
};
