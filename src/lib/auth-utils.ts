import { User } from 'firebase/auth';

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
  const headers = await getAuthHeaders(user);
  
  if (!headers) {
    console.error('No auth headers available');
    return null;
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
  });
} 