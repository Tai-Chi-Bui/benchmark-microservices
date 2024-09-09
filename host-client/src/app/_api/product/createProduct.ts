import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for product validation
const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(), // Optional field
});

// Define the response and error types
type CreateProductResponse = { message?: string; success: boolean; product?: any };

// Define the function for create product logic
const createProductHandler = async (formData: FormData): Promise<CreateProductResponse> => {
  // Extract product details from formData
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string | undefined;

  // Validate fields
  const validatedFields = productSchema.safeParse({ name, price, description });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Validation failed');
  }

  // Perform the create product API request
  return apiFetch<CreateProductResponse>(endpoints.product.createProduct, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name, price, description },
  });
};

// Custom hook using TanStack Query's useMutation for create product
export const useCreateProduct = (): UseMutationResult<CreateProductResponse, Error, FormData> => {
  return useMutation<CreateProductResponse, Error, FormData>({
    mutationFn: createProductHandler, // Pass the mutation function here
  });
};
