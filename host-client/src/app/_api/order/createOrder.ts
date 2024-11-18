import { z } from 'zod';
import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the schema for the POST request body
const createOrderProductSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().nonnegative('Quantity must be a non-negative number'),
});

const createOrderSchema = z.object({
  products: z.array(createOrderProductSchema),
  totalAmount: z.number().positive('Total amount must be a positive number'),
  paymentDetails: z.object({
    method: z.string(),
    status: z.string(),
    reference: z.string().optional(),
  }),
  deliveryDetails: z.object({
    recipientName: z.string(),
    recipientPhone: z.string(),
    destination: z.string(),
    tracking: z.string(),
    status: z.string(),
  }),
  status: z.string(),
});

// Define the request body type
type CreateOrderRequest = z.infer<typeof createOrderSchema>;

// Define the function to create an order
const createOrder = async (orderData: CreateOrderRequest): Promise<void> => {
  // Validate the request body
  const validation = createOrderSchema.safeParse(orderData);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Request validation failed');
  }

  // Perform the POST request
  await apiFetch<void>(endpoints.order.getOrders, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: orderData, // Stringify the request body
  });
};

// Export the function
export { createOrder };
