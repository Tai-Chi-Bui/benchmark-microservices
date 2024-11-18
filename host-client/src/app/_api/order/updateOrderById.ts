import { z } from 'zod';
import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the schema for the request body to update an order
const updateOrderProductSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().nonnegative('Quantity must be a non-negative number'),
});

const updateOrderSchema = z.object({
  products: z.array(updateOrderProductSchema).optional(),
  totalAmount: z.number().positive('Total amount must be a positive number').optional(),
  paymentDetails: z.object({
    method: z.string().optional(),
    status: z.string().optional(),
    reference: z.string().optional(),
  }).optional(),
  deliveryDetails: z.object({
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    destination: z.string().optional(),
    tracking: z.string().optional(),
    status: z.string().optional(),
  }).optional(),
  status: z.string().optional(),
});

// Define the request body type
type UpdateOrderRequest = z.infer<typeof updateOrderSchema>;

// Define the function to update an order by ID
const updateOrderById = async (orderId: string, updateData: UpdateOrderRequest): Promise<void> => {
  // Validate the request body
  const validation = updateOrderSchema.safeParse(updateData);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Request validation failed');
  }

  // Perform the PATCH request
  await apiFetch<void>(`${endpoints.order.getOrders}/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: updateData, // Serialize the request body
  });
};

// Export the function
export { updateOrderById };
