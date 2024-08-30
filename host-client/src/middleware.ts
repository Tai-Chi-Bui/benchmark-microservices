import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define your secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define protected, restricted, and public routes
const protectedRoutes = ['/blogs']; // Routes that require authentication
const restrictedRoutes = ['/sign-up', '/sign-in']; // Routes accessible only when not authenticated
const publicRoutes = ['/home', '/sign-out']; // Example of public routes

export default function middleware(req: NextRequest) {
  // Retrieve the token from cookies and get its value as a string
  const token = req.cookies.get('authToken')?.value;

  // Get the current pathname from the request
  const { pathname } = req.nextUrl;

  // Check if the route is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is a restricted route
  const isRestrictedRoute = restrictedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Function to check if token is valid
  const isValidToken = (token: string | undefined): boolean => {
    if (!token) return false;

    // try {
    //   jwt.verify(token, JWT_SECRET);
    //   return true;
    // } catch (error) {
    //   return false;
    // }
    return true
  };

  // console.log("token", token)
  // console.log("isValidToken", isValidToken(token))
  // console.log("path", pathname)

  // If the route is protected and there's no valid token, redirect to /sign-out
  if (isProtectedRoute && !isValidToken(token)) {
    return NextResponse.redirect(new URL('/sign-out', req.url));
  }

  // If the route is restricted and there is a valid token, redirect to the home page
  if (isRestrictedRoute && isValidToken(token)) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // If the route is public or if the user is authenticated for a protected route, allow the request
  if (isPublicRoute || isValidToken(token) || !isProtectedRoute) {
    return NextResponse.next();
  }

  // Default response if no conditions match
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*', // Match all routes
  ],
};

