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
    .max(64, 'Password must be no more than 64 characters long')
    // Uncomment the lines below if you want to enforce stronger password rules
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[\W_]/, 'Password must contain at least one special character'),
});

// Define the response and error types
type SignUpResponse = { message: string };

// Define the function for sign-up logic
const signUpHandler = async (formData: FormData): Promise<SignUpResponse> => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm-password') as string;

  // Validate fields
  const validatedFields = schema.safeParse({ username, password });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Validation failed');
  }

  // Validate password match
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match!');
  }

  // Ensure the body is in JSON format or as expected by your API
  return apiFetch<SignUpResponse>(endpoints.auth.signUp, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // Ensure headers are set if needed
    body: { username, password }
  });
};

// Custom hook using TanStack Query's useMutation for sign-up
export const useSignUp = (): UseMutationResult<SignUpResponse, Error, FormData> => {
  return useMutation<SignUpResponse, Error, FormData>({
    mutationFn: signUpHandler, // Pass the mutation function here
  });
};
