import { z } from 'zod';
import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the schema for the request body to update a product
const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  description: z.string().optional(),
  quantity: z.number().nonnegative('Quantity must be a non-negative number').optional(),
});

// Define the request body type
type UpdateProductRequest = z.infer<typeof updateProductSchema>;

// Define the function to update a product by ID
const updateProductById = async (productId: string, updateData: UpdateProductRequest): Promise<void> => {
  // Validate the request body
  const validation = updateProductSchema.safeParse(updateData);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Request validation failed');
  }

  // Perform the PATCH request
  await apiFetch<void>(`${endpoints.product.getProducts}/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: updateData,
  });
};

// Export the function
export { updateProductById };
