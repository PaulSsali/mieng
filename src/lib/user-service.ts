import { User } from "firebase/auth";

// This interface represents the user profile data structure
export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  profileImage?: string;
  discipline?: string;
  experience?: string;
  completionTimeline?: string;
  hasMentor?: boolean;
  hoursPerWeek?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Get the user's profile data from the API
 * @param user The Firebase user object
 * @returns A promise that resolves to the user's profile data
 */
export async function getUserProfile(user: User | null): Promise<Partial<UserProfile> | null> {
  if (!user) return null;
  
  try {
    // Get ID token from Firebase
    const idToken = await user.getIdToken();
    
    // Call the API endpoint
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    // Fallback to basic profile from Firebase
    return { 
      email: user.email || '',
      name: user.displayName || undefined,
      profileImage: user.photoURL || undefined
    };
  }
}

/**
 * Update the user's profile data via the API
 * @param user The Firebase user object
 * @param data The profile data to update
 */
export async function updateUserProfile(
  user: User | null, 
  data: Partial<UserProfile>
): Promise<void> {
  if (!user || !user.email) return;
  
  try {
    // Get ID token from Firebase
    const idToken = await user.getIdToken();
    
    // Call the API endpoint
    const response = await fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating user profile: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
} 