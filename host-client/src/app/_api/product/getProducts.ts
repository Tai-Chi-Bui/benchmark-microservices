import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for product response validation with new format
const productSchema = z.object({
  _id: z.string(), // Accepts the '_id' field instead of 'id'
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(),
  __v: z.number().optional(), // Accepts the '__v' field but it's optional
});

const productsSchema = z.array(productSchema);

// Define the response type
type GetProductsResponse = z.infer<typeof productsSchema>;

// Define the function for fetching products
const fetchProducts = async (): Promise<GetProductsResponse> => {
  // Perform the fetch products API request
  const response = await apiFetch<GetProductsResponse>(endpoints.product.getProducts, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Optional: Validate the response using Zod schema
  const validatedResponse = productsSchema.safeParse(response);
  if (!validatedResponse.success) {
    const errors = validatedResponse.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Response validation failed');
  }

  return validatedResponse.data;
};

// Custom hook using TanStack Query's useQuery for fetching products
export const useGetProducts = (): UseQueryResult<GetProductsResponse, Error> => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ['getProducts'],
    queryFn: fetchProducts, // Pass the query function here
  });
};
