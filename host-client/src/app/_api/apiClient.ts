// apiClient.ts
export type FetchOptions = Omit<RequestInit, 'body'> & {
    body?: Record<string, any> | FormData; // Allow both JSON objects and FormData
  };
  
  export const apiFetch = async <T>(
    url: string,
    { body, headers, ...customConfig }: FetchOptions = {}
  ): Promise<T> => {
    const isFormData = body instanceof FormData;
  
    const config: RequestInit = {
      method: body ? 'POST' : 'GET', // Default method
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }), // Only add JSON header if body is not FormData
        ...headers,
      },
      ...customConfig,
    };
  
    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }
  
    try {
      const response = await fetch(url, config);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown Error occurred');
    }
  };
  