import { User } from "firebase/auth";

// This interface represents the user profile data structure
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  discipline: string;
  experience: string;
  completionTimeline: string;
  hasMentor: boolean;
  hoursPerWeek: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock implementation for demonstration purposes
 * In a real application, this would fetch from Firestore
 */
const mockUserProfiles: Record<string, Partial<UserProfile>> = {
  "user1@example.com": {
    discipline: "Civil Engineering",
    experience: "5+ years"
  },
  "user2@example.com": {
    discipline: "Mechanical Engineering",
    experience: "2-5 years"
  },
  "demo@example.com": {
    discipline: "Electrical Engineering",
    experience: "0-2 years"
  }
};

/**
 * Get the user's profile data
 * @param user The Firebase user object
 * @returns A promise that resolves to the user's profile data
 */
export async function getUserProfile(user: User | null): Promise<Partial<UserProfile> | null> {
  if (!user) return null;
  
  // In a real app, this would be a Firestore query
  // Example:
  // const userDoc = await getDoc(doc(db, "users", user.uid));
  // return userDoc.exists() ? userDoc.data() as UserProfile : null;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfiles[user.email || ""] || { discipline: "Civil Engineering" });
    }, 100); // Simulate network delay
  });
}

/**
 * Update the user's profile data
 * @param user The Firebase user object
 * @param data The profile data to update
 */
export async function updateUserProfile(
  user: User | null, 
  data: Partial<UserProfile>
): Promise<void> {
  if (!user) return;
  
  // In a real app, this would be a Firestore update
  // Example:
  // await updateDoc(doc(db, "users", user.uid), {
  //   ...data,
  //   updatedAt: serverTimestamp()
  // });
  
  // Mock implementation
  console.log("Updating user profile:", user.email, data);
  
  // Update the mock data
  mockUserProfiles[user.email || ""] = {
    ...mockUserProfiles[user.email || ""],
    ...data
  };
} 