import { User } from 'firebase/auth';
import { getAuthInstance } from './auth';

/**
 * Parse auth cookie from cookie string
 * @param cookieString The cookie string
 * @returns The auth token if found, null otherwise
 */
export const parseAuthCookie = (cookieString: string): string | null => {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
};

/**
 * Set auth token cookie
 * @param token The auth token
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 */
export const setAuthCookie = (token: string, expiresIn = 3600): void => {
  document.cookie = `auth_token=${token}; path=/; max-age=${expiresIn}; secure; samesite=strict`;
};

/**
 * Remove auth token cookie
 */
export const removeAuthCookie = (): void => {
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
};

/**
 * Get fresh auth token, refreshing if needed
 * @param user The Firebase user
 * @param forceRefresh Whether to force token refresh (default: false)
 * @returns The fresh auth token
 */
export const getFreshToken = async (user: User, forceRefresh = false): Promise<string> => {
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting fresh token:', error);
    throw new Error('Failed to refresh authentication token');
  }
};

/**
 * Setup token refresh on a timer
 * Refreshes token every 50 minutes (10 minutes before 1 hour expiry)
 * @param user The Firebase user
 * @returns Cleanup function to clear the refresh timer
 */
export const setupTokenRefresh = (user: User): () => void => {
  // Refresh every 50 minutes (3000000ms)
  const refreshInterval = 3000000;
  
  // Set up interval to refresh token
  const intervalId = setInterval(async () => {
    try {
      const token = await getFreshToken(user, true);
      setAuthCookie(token);
      console.log('Auth token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh auth token:', error);
      // If refresh fails, sign out (optional)
      // await signOut();
    }
  }, refreshInterval);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

/**
 * Get current auth token from cookies or from current user
 * @returns The current auth token or null if not available
 */
export const getCurrentToken = async (): Promise<string | null> => {
  // First try to get from cookie
  const cookieToken = parseAuthCookie(document.cookie);
  if (cookieToken) {
    return cookieToken;
  }
  
  // If not in cookie, try to get from current user
  const auth = getAuthInstance();
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      setAuthCookie(token);
      return token;
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  }
  
  return null;
}; 