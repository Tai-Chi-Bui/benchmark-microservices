import { jwtVerify } from 'jose';

// Define your secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// Function to check if token is valid
export const isValidToken = (token: string | undefined): boolean => {
  if (!token) return false;

  try {
    jwtVerify(token, JWT_SECRET_KEY);
    return true;
  } catch (error) {
    console.log("jwt verification error: ", error);
    return false;
  }
};

// Utility function to check if a route is protected, restricted, or public
export const isAuthenticated = (pathname: string, token: string | undefined, protectedRoutes: string[], restrictedRoutes: string[], publicRoutes: string[]) => {
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

  const isAuthenticated = isValidToken(token);

  if (isProtectedRoute && !isAuthenticated) {
    return { shouldRedirect: true, redirectUrl: '/sign-out' };
  }

  if (isRestrictedRoute && isAuthenticated) {
    return { shouldRedirect: true, redirectUrl: '/home' };
  }

  return { shouldRedirect: false, redirectUrl: '' };
};

export const getUserRole =  (_token: string | undefined) => 'user'