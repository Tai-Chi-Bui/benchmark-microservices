// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidToken, getUserRole } from '@/app/_utils/auth'; // Assuming getUserRole is a utility function to get the user's role

// Define protected, restricted, and role-based routes
const protectedRoutes = ['/blogs']; // Routes that require authentication
const authRoutes = ['/sign-up', '/sign-in']; // Routes accessible only when not authenticated
const adminRoutes = ['/admin-dashboard']; // Routes accessible only by users with 'admin' role
const publicRoutes = ['/unauthenticated', '/unauthorized', '/home'];

type Roles = 'user' | 'admin'
function generateMatcher(routes: string[]) {
  // Generate the matcher array from routes
  return routes.map((route) => {
    return route.endsWith('*') ? route : `${route}*`;
  });
}

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const { pathname } = req.nextUrl;

  const isAuthenticated = isValidToken(token);
  const userRole: any = isAuthenticated ? getUserRole(token) : 'user'; // Fetch user role if authenticated

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (!authRoutes.some(route => pathname.startsWith(route)) && !publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/unauthenticated', req.url));
    }
  }

  // Handle authenticated users
  if (isAuthenticated) {
    if (authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!_next|api/auth).*)(.+)'
  ],
}

