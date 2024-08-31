// apiClient.ts
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  GenericAbortSignal,
} from 'axios';

// Type definitions remain the same
export type FetchOptions = Omit<RequestInit, 'body' | 'signal'> & {
  body?: Record<string, any> | FormData; // Allow both JSON objects and FormData
  signal?: GenericAbortSignal; // Ensure signal is of the correct type
};

// Create an Axios instance
const axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Modify request config before sending
    console.log('Request:', config);
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response or handle common tasks
    console.log('Response:', response);
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors, logging, or refresh token logic
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response error:', error.response);
      return Promise.reject(error.response.data); // Pass the error data
    }
    return Promise.reject(error);
  }
);

export const apiFetch = async <T>(
  url: string,
  { body, headers, signal, method = 'GET', ...customConfig }: FetchOptions = {}
): Promise<T> => {
  const isFormData = body instanceof FormData;

  // Use AxiosHeaders to create headers
  const axiosHeaders = new AxiosHeaders();

  if (!isFormData) {
    axiosHeaders.set('Content-Type', 'application/json');
  }

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        axiosHeaders.set(key, value);
      }
    });
  }

  // Convert Fetch API options to Axios options
  const axiosConfig: InternalAxiosRequestConfig = {
    url,
    method: method || (body ? 'POST' : 'GET'), // Default method, allows for explicit method in customConfig
    headers: axiosHeaders,
    data: body && !isFormData ? JSON.stringify(body) : body, // Set data for Axios
    signal, // Pass signal directly as it should be of type GenericAbortSignal
    ...customConfig,
  };

  try {
    const response = await axiosInstance.request<T>(axiosConfig);
    return response.data; // Return the data directly
  } catch (error) {
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};
