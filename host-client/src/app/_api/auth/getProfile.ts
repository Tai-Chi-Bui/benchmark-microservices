import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for user profile response validation
const profileSchema = z.object({
  _id: z.string(), // Accepts the '_id' field instead of 'id'
  username: z.string().min(2, 'Username must be at least 2 characters long'),
  role: z.enum(['user', 'admin']), // Assuming roles are 'user' or 'admin'
});

// Define the response type for the user profile
type GetProfileResponse = z.infer<typeof profileSchema>;

// Define the function for fetching the user profile
const fetchUserProfile = async (): Promise<GetProfileResponse> => {
  // Perform the fetch user profile API request
  const response = await apiFetch<GetProfileResponse>(`${endpoints.auth.getProfile}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Optional: Validate the response using Zod schema
  const validatedResponse = profileSchema.safeParse(response);
  if (!validatedResponse.success) {
    const errors = validatedResponse.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Response validation failed');
  }

  return validatedResponse.data;
};

// Custom hook using TanStack Query's useQuery for fetching the user profile
export const useGetUserProfile = (): UseQueryResult<GetProfileResponse, Error> => {
  return useQuery<GetProfileResponse, Error>({
    queryKey: ['getUserProfile'],
    queryFn: fetchUserProfile, // Pass the query function for the user profile
  });
};
