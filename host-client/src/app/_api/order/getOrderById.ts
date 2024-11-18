import { z } from 'zod';
import { apiFetch } from '../apiClient';
import { endpoints } from '../endpoints';

// Define the schema for the order response
const orderProductSchema = z.object({
  productId: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  quantity: z.number().nonnegative('Quantity must be a non-negative number'),
  price: z.number().positive('Price must be a positive number'),
});

const orderSchema = z.object({
  _id: z.string(),
  products: z.array(orderProductSchema),
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
  createdDate: z.string(), // ISO date string
  updatedDate: z.string(), // ISO date string
  __v: z.number().optional(),
});

// Define the response type
type GetOrderByIdResponse = z.infer<typeof orderSchema>;

// Define the function to fetch an order by ID
const getOrderById = async (orderId: string): Promise<GetOrderByIdResponse> => {
  // Perform the GET request
  const response = await apiFetch<GetOrderByIdResponse>(`${endpoints.order.getOrders}/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Validate the response
  const validation = orderSchema.safeParse(response);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Response validation failed');
  }

  return validation.data;
};

// Export the function
export { getOrderById };
