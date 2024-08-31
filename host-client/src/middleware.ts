import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/app/_utils/auth';

// Define protected, restricted, and public routes
const protectedRoutes = ['/blogs']; // Routes that require authentication
const restrictedRoutes = ['/sign-up', '/sign-in']; // Routes accessible only when not authenticated
const publicRoutes = ['/home', '/sign-out']; // Example of public routes

export default function middleware(req: NextRequest) {
  // Retrieve the token from cookies and get its value as a string
  const token = req.cookies.get('authToken')?.value;

  // Get the current pathname from the request
  const { pathname } = req.nextUrl;

  // Use the utility function to determine if authentication is required
  const { shouldRedirect, redirectUrl } = isAuthenticated(pathname, token, protectedRoutes, restrictedRoutes, publicRoutes);

  if (shouldRedirect) {
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Allow the request if no redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*', // Match all routes
  ],
};
