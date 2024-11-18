import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import { z } from 'zod';
import { apiFetch } from '../apiClient';

// Define schema for order response validation
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

const ordersSchema = z.array(orderSchema);

// Define the response type
type GetOrdersResponse = z.infer<typeof ordersSchema>;

// Define filters type
type OrderFilters = {
  status?: string;
  minTotalAmount?: number;
  maxTotalAmount?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
};

// Utility to construct query parameters
const buildQueryParams = (filters: OrderFilters): string => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.minTotalAmount !== undefined) params.append('minTotalAmount', filters.minTotalAmount.toString());
  if (filters.maxTotalAmount !== undefined) params.append('maxTotalAmount', filters.maxTotalAmount.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  return params.toString();
};

// Define the function for fetching orders with filters
const fetchOrders = async (filters: OrderFilters = {}): Promise<GetOrdersResponse> => {
  // Build query string from filters
  const queryParams = buildQueryParams(filters);
  const url = queryParams ? `${endpoints.order.getOrders}?${queryParams}` : endpoints.order.getOrders;

  // Perform the fetch orders API request
  const response = await apiFetch<GetOrdersResponse>(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Validate the response using Zod schema
  const validatedResponse = ordersSchema.safeParse(response);
  if (!validatedResponse.success) {
    const errors = validatedResponse.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(', ');
    throw new Error(errorMessage || 'Response validation failed');
  }

  return validatedResponse.data;
};

// Custom hook using TanStack Query's useQuery for fetching orders
export const useGetOrders = (filters: OrderFilters = {}): UseQueryResult<GetOrdersResponse, Error> => {
  return useQuery<GetOrdersResponse, Error>({
    queryKey: ['getOrders', filters], // Include filters in the query key
    queryFn: () => fetchOrders(filters), // Pass the query function with filters
  });
};
