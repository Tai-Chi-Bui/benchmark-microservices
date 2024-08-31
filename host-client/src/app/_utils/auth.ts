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

export const getUserRole =  (_token: string | undefined) => 'user'