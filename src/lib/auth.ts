import { auth } from './firebase';

/**
 * Gets the ID of the currently authenticated user
 * For development purposes, returns a dummy ID to allow testing
 */
export function getAuthenticatedUserId(): string {
  // In a production environment, we would verify the Firebase auth token
  // and throw an error if the user is not authenticated
  
  // For development, we'll return a dummy ID if no user is authenticated
  if (!auth.currentUser) {
    // This is a development fallback and should be replaced with proper auth in production
    return "dev-user-id";
  }
  
  return auth.currentUser.uid;
} 