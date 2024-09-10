import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for a single product response validation
const productSchema = z.object({
  _id: z.string(), // Accepts the '_id' field instead of 'id'
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(),
  quantity: z.number().nonnegative().optional(),
  __v: z.number().optional(), // Accepts the '__v' field but it's optional
});

// Define the response type for a single product
type GetProductResponse = z.infer<typeof productSchema>;

// Define the function for fetching a product by ID
const fetchProductById = async (productId: string): Promise<GetProductResponse> => {
  // Perform the fetch product by ID API request
  const response = await apiFetch<GetProductResponse>(`${endpoints.product.getProductById}/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Optional: Validate the response using Zod schema
  const validatedResponse = productSchema.safeParse(response);
  if (!validatedResponse.success) {
    const errors = validatedResponse.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Response validation failed');
  }

  return validatedResponse.data;
};

// Custom hook using TanStack Query's useQuery for fetching a product by ID
export const useGetProductById = (productId: string): UseQueryResult<GetProductResponse, Error> => {
  return useQuery<GetProductResponse, Error>({
    queryKey: ['getProductById', productId],
    queryFn: () => fetchProductById(productId), // Pass the query function with the product ID
    enabled: !!productId, // Ensure the query only runs when productId is provided
  });
};
