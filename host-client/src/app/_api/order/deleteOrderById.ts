import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the function to delete an order by ID
const deleteOrderById = async (orderId: string): Promise<void> => {
  // Perform the DELETE request
  await apiFetch<void>(`${endpoints.order.getOrders}/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Export the function
export { deleteOrderById };
