import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  GenericAbortSignal,
} from 'axios';

// Extend the InternalAxiosRequestConfig to include __retryCount
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

// Define a custom error interface to represent expected error structure
interface CustomError {
  message: string; // The error message
}

// Define maximum retry attempts
const MAX_RETRIES = 3;
// Define the base delay for exponential backoff in milliseconds
const BASE_DELAY = 300;
// Define the maximum timeout in milliseconds
const TIMEOUT = 5000; // 5 seconds

// Type definitions remain the same
export type FetchOptions = Omit<RequestInit, 'body' | 'signal'> & {
  body?: Record<string, any> | FormData; // Allow both JSON objects and FormData
  signal?: GenericAbortSignal; // Ensure signal is of the correct type
};

// Helper function to get cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

// Create an Axios instance with a default timeout
const axiosInstance = axios.create({
  timeout: TIMEOUT,
});

// Add request interceptors
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Retrieve auth token from cookies
    const token = getCookie('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Example: Add a custom header or modify URL for specific conditions
    // Other request modifications can be added here

    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Example: Handle specific response status codes
    if (response.status === 204) {
      //console.log('No Content - Special Handling');
    }

    return response;
  },
  async (error: AxiosError) => {
    // Enhanced retry logic for specific status codes
    if (
      error.code === 'ERR_NETWORK' ||
      error.message.includes('Network Error') ||
      error.message.includes('timeout') || // Check for timeout errors
      error.response?.status === 500
    ) {
      const config = error.config as CustomAxiosRequestConfig;

      // Initialize the retry count if it doesn't exist
      if (!config.__retryCount) {
        config.__retryCount = 0;
      }

      // Check if retry attempts have been exceeded
      if (config.__retryCount >= MAX_RETRIES) {
        return Promise.reject(error);
      }

      // Increment the retry count
      config.__retryCount += 1;

      // Calculate delay using exponential backoff strategy
      const delay = BASE_DELAY * Math.pow(2, config.__retryCount);

      console.warn(`Retrying request due to server error... Attempt ${config.__retryCount} after ${delay}ms delay`);

      // Wait for the delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Retry the request with the updated configuration
      return axiosInstance.request(config);
    }

    // Handle response errors, logging, or refresh token logic
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response?.data || error.message); // Pass the error data or message
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
  const axiosConfig: CustomAxiosRequestConfig = {
    url,
    method: method || (body ? 'POST' : 'GET'),
    headers: axiosHeaders,
    data: body && !isFormData ? JSON.stringify(body) : body,
    signal,
    ...customConfig,
  };

  let abortHandler: (() => void) | null = null;

  if (signal && typeof signal.addEventListener === 'function') {
    const controller = new AbortController();
    axiosConfig.signal = controller.signal;

    abortHandler = () => {
      controller.abort();
    };

    signal.addEventListener('abort', abortHandler);
  }

  try {
    const response = await axiosInstance.request<T>(axiosConfig);
    console.log('res data: ', response.data);
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as CustomError).message || (error as AxiosError).message || 'An unexpected error occurred';
    console.log('err message: ', errorMessage);
    throw new Error(errorMessage);
  } finally {
    if (signal && abortHandler && typeof signal.removeEventListener === 'function') {
      signal.removeEventListener('abort', abortHandler);
    }
  }
};
