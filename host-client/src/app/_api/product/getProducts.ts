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
  quantity: z.number().nonnegative().optional(),
  __v: z.number().optional(), // Accepts the '__v' field but it's optional
});

const productsSchema = z.array(productSchema);

// Define the response type
type GetProductsResponse = z.infer<typeof productsSchema>;

// Define filters type
type ProductFilters = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  quantity?: number;
};

// Utility to construct query parameters
const buildQueryParams = (filters: ProductFilters): string => {
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.quantity !== undefined) params.append('quantity', filters.quantity.toString());
  return params.toString();
};

// Define the function for fetching products with filters
const fetchProducts = async (filters: ProductFilters = {}): Promise<GetProductsResponse> => {
  // Build query string from filters
  const queryParams = buildQueryParams(filters);
  const url = queryParams ? `${endpoints.product.getProducts}?${queryParams}` : endpoints.product.getProducts;

  // Perform the fetch products API request
  const response = await apiFetch<GetProductsResponse>(url, {
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
export const useGetProducts = (filters: ProductFilters = {}): UseQueryResult<GetProductsResponse, Error> => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ['getProducts', filters], // Include filters in the query key
    queryFn: () => fetchProducts(filters), // Pass the query function with filters
  });
};
