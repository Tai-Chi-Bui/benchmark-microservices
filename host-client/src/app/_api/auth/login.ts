import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for username and password validation
const schema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters long'),
  password: z
    .string()
    .min(2, 'Password must be at least 2 characters long')
    .max(64, 'Password must be no more than 64 characters long'),
    // Uncomment the lines below if you want to enforce stronger password rules
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[\W_]/, 'Password must contain at least one special character'),
});

// Define the response and error types
type LoginResponse = { message?: string, success: boolean, token: string };

// Define the function for login logic
const loginHandler = async (formData: FormData): Promise<LoginResponse> => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Validate fields
  const validatedFields = schema.safeParse({ username, password });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Validation failed');
  }

  // Perform the login API request
  return apiFetch<LoginResponse>(endpoints.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {username, password},
  });
};

// Custom hook using TanStack Query's useMutation for login
export const useLogin = (): UseMutationResult<LoginResponse, Error, FormData> => {
  return useMutation<LoginResponse, Error, FormData>({
    mutationFn: loginHandler, // Pass the mutation function here
  });
};
