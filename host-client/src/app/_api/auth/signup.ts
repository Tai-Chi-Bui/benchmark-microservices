import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for email validation
const schema = z.object({
  email: z.string().email('Invalid Email format'),
});

// Define the response and error types
type SignUpResponse = { message: string };

// Define the function for sign-up logic
const signUpHandler = async (formData: FormData): Promise<SignUpResponse> => {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm-password') as string;

  // Validate email
  const validatedFields = schema.safeParse({ email });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Validation failed');
  }

  // Validate password
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match!');
  }

  return apiFetch<SignUpResponse>(endpoints.auth.signUp, {
    method: 'POST',
    body: { username, email, password },
  });
};

// Custom hook using TanStack Query's useMutation for sign-up
export const useSignUp = (): UseMutationResult<SignUpResponse, Error, FormData> => {
  return useMutation<SignUpResponse, Error, FormData>({
    mutationFn: signUpHandler, // Pass the mutation function here
  });
};
