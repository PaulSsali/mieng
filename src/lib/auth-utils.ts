import { User } from 'firebase/auth';
import { redirect } from 'next/navigation';

// Import MockUser type from auth-context or define it here
interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  getIdToken: () => Promise<string>;
}

type AuthUser = User | MockUser | null;

/**
 * Get the current user's auth token for API requests
 * @param user Firebase user or MockUser object
 * @returns The auth headers for API requests
 */
export async function getAuthHeaders(user: AuthUser): Promise<HeadersInit | undefined> {
  if (!user) return undefined;
  
  try {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return undefined;
  }
}

/**
 * Safely make an authenticated API request
 * @param url API endpoint URL
 * @param options Fetch options
 * @param user Firebase user or MockUser object
 * @returns Response from the API or null if unauthorized
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  user: AuthUser
): Promise<Response | null> {
  try {
    if (!user) {
      console.error('No user provided for authenticatedFetch');
      return null;
    }
    
    const headers = await getAuthHeaders(user);
    
    if (!headers) {
      console.error('No auth headers available');
      return null;
    }
    
    // For local development mode, add additional user identification in headers
    if (process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true' && 
        user && user.uid) {
      // Add user ID in a custom header for local dev mode
      (headers as any)['x-user-id'] = user.uid; 
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...headers,
      },
    });
    
    // Handle auth-related errors
    if (response.status === 401) {
      console.error('Unauthorized request - token may be invalid or expired');
      
      // If we're in the browser environment, we can redirect
      if (typeof window !== 'undefined') {
        // Force redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
      
      return response;
    }
    
    return response;
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    return null;
  }
} 