import { getCurrentToken } from './firebase/token';

/**
 * Create headers with authentication token for API requests
 */
export const createAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await getCurrentToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Make an authenticated API request
 * @param url The API endpoint URL
 * @param options The fetch options
 * @returns The API response
 */
export const authFetch = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const authHeaders = await createAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      // Handle unauthenticated response (could redirect to login)
      if (response.status === 401) {
        // Optional: redirect to login
        // window.location.href = '/admin/login';
        throw new Error('Authentication required');
      }
      
      // Handle other error responses
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: Error | unknown) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Make an authenticated GET request
 */
export const authGet = <T>(url: string): Promise<T> => {
  return authFetch<T>(url, { method: 'GET' });
};

/**
 * Make an authenticated POST request
 */
export const authPost = <T, D = Record<string, unknown>>(url: string, data: D): Promise<T> => {
  return authFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Make an authenticated PUT request
 */
export const authPut = <T, D = Record<string, unknown>>(url: string, data: D): Promise<T> => {
  return authFetch<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Make an authenticated DELETE request
 */
export const authDelete = <T>(url: string): Promise<T> => {
  return authFetch<T>(url, { method: 'DELETE' });
}; 