import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the function to delete a product by ID
const deleteProduct = async (productId: string): Promise<void> => {
  // Perform the DELETE request
  await apiFetch<void>(`${endpoints.product.getProducts}/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Export the function
export { deleteProduct };
