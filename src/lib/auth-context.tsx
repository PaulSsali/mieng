"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, hasAuth, isLocalAuthMode } from "./firebase";
import { useRouter } from "next/navigation";

// Mock user for local development mode
interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  getIdToken: () => Promise<string>;
}

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
  authInitialized: boolean;
  firebaseAvailable: boolean;
  isLocalMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  clearError: () => {},
  authInitialized: false,
  firebaseAvailable: false,
  isLocalMode: false
});

// Create a mock user for local development
const createMockUser = (email: string, name?: string): MockUser => ({
  uid: 'local-dev-user-id',
  email,
  displayName: name || email.split('@')[0],
  photoURL: 'https://ui-avatars.com/api/?name=' + (name || email.split('@')[0]),
  emailVerified: true,
  isAnonymous: false,
  getIdToken: async () => 'mock-token-for-local-development'
});

// Function to initialize a new user's data in the database
const initializeNewUser = async (user: User, userData?: any) => {
  try {
    // Get the Firebase auth token
    const idToken = await user.getIdToken();
    
    // Call the user initialization API
    const response = await fetch('/api/user/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData || {}),
    });
    
    if (!response.ok) {
      console.error('Failed to initialize user data:', response.statusText);
      return false;
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error initializing user data:', error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [authInitialized, setAuthInitialized] = useState(hasAuth || isLocalAuthMode);
  const [firebaseAvailable, setFirebaseAvailable] = useState(!!auth || isLocalAuthMode);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (isLocalAuthMode) {
      // For local development mode, don't subscribe to Firebase auth
      // Just load user from localStorage if exists
      const localUser = localStorage.getItem('local-dev-user');
      if (localUser) {
        try {
          const userData = JSON.parse(localUser);
          setUser(createMockUser(userData.email, userData.name));
        } catch (e) {
          console.error('Error parsing local user data', e);
          localStorage.removeItem('local-dev-user');
        }
      }
      setLoading(false);
      setAuthInitialized(true);
      setFirebaseAvailable(true);
      return;
    }
    
    // Only attempt to set up auth observer if Firebase Auth is initialized
    if (auth) {
      try {
        unsubscribe = onAuthStateChanged(
          auth, 
          async (user) => {
            if (user) {
              // If user is logged in and has a profile image from social login
              if (user.photoURL) {
                try {
                  // Get ID token for API authentication
                  const idToken = await user.getIdToken();
                  
                  // Call the API to update profile image
                  const response = await fetch('/api/user/update-profile-image', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${idToken}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      profileImage: user.photoURL
                    }),
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to update profile image');
                  }
                } catch (error) {
                  console.error("Error saving profile image:", error);
                }
              }
            }
            setUser(user);
            setLoading(false);
          },
          (error) => {
            console.error("Auth state change error:", error);
            setError(error.message);
            setLoading(false);
          }
        );
      } catch (error: any) {
        console.error("Error setting up auth state observer:", error);
        setError(error?.message || "Authentication initialization failed");
        setLoading(false);
        setFirebaseAvailable(false);
      }
    } else {
      // If Firebase Auth is not available, set loading to false
      console.warn("Firebase Auth is not initialized. Authentication features will not be available.");
      setLoading(false);
      setFirebaseAvailable(false);
    }

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    // Handle local development mode
    if (isLocalAuthMode) {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple validation
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // In development mode, simulate authentication errors for testing
        // This will help developers test error scenarios
        if (email === "test@error.com") {
          throw new Error("Invalid email or password");
        }
        
        // Create mock user and save to localStorage
        const mockUser = createMockUser(email);
        localStorage.setItem('local-dev-user', JSON.stringify({ email, name: email.split('@')[0] }));
        
        // Set user state
        setUser(mockUser);
        router.push("/dashboard");
        return;
      } catch (error: any) {
        setError(error.message || 'Login failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Normal Firebase auth flow
    if (!auth) {
      setError("Authentication service is not available. Please configure Firebase in .env.local");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); 
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to login";
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many unsuccessful login attempts. Please try again later.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password sign-in is not enabled. Please contact support.";
      } else if (error.code === 'auth/api-key-not-valid' || 
                 error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' || 
                 error.code === 'auth/invalid-api-key') {
        errorMessage = "Firebase is not configured correctly. Please check the Firebase API key in your .env.local file.";
        
        if (process.env.NODE_ENV === 'development') {
          errorMessage += " Make sure NEXT_PUBLIC_FIREBASE_API_KEY is set correctly.";
        } else {
          errorMessage = "Authentication service configuration error. Please contact support.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: any) => {
    // Handle local development mode
    if (isLocalAuthMode) {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple validation
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Create mock user and save to localStorage
        const mockUser = createMockUser(email, userData?.name);
        localStorage.setItem('local-dev-user', JSON.stringify({ 
          email, 
          name: userData?.name || email.split('@')[0],
          ...userData 
        }));
        
        // Set user state
        setUser(mockUser);
        router.push("/dashboard");
        return;
      } catch (error: any) {
        setError(error.message || 'Signup failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Normal Firebase auth flow
    if (!auth) {
      setError("Authentication service is not available. Please configure Firebase in .env.local");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the display name if provided
      if (userData?.name && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: userData.name
          });
        } catch (profileError) {
          console.error("Error updating user profile:", profileError);
        }
      }
      
      // Initialize the user's data in the database
      if (userCredential.user) {
        await initializeNewUser(userCredential.user, userData);
      }
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to sign up";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. It should be at least 6 characters";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password sign-up is not enabled. Please contact support.";
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        errorMessage = "Firebase is not configured correctly. Please check your .env.local file.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Handle local development mode
    if (isLocalAuthMode) {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear local user
        localStorage.removeItem('local-dev-user');
        setUser(null);
        router.push("/");
      } catch (error: any) {
        setError(error.message || 'Logout failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Normal Firebase auth flow
    if (!auth) {
      setError("Authentication service is not available. Please configure Firebase in .env.local");
      return;
    }
    
    setError(null);
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  const loginWithGoogle = async () => {
    // Handle local development mode
    if (isLocalAuthMode) {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock Google user
        const mockUser = createMockUser('mockuser@gmail.com', 'Mock User');
        localStorage.setItem('local-dev-user', JSON.stringify({ 
          email: 'mockuser@gmail.com', 
          name: 'Mock User' 
        }));
        
        // Set user state
        setUser(mockUser);
        router.push("/dashboard");
      } catch (error: any) {
        setError(error.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Normal Firebase auth flow
    if (!auth) {
      setError("Authentication service is not available. Please configure Firebase in .env.local");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Initialize user data if it's a new user
      if (result.user) {
        try {
          // Check if this is probably a first-time login by comparing creationTime with lastLoginTime
          // Since additionalUserInfo is not available in the type, we'll use this alternative method
          const metadata = result.user.metadata;
          const isNewUser = metadata.creationTime === metadata.lastSignInTime;
          
          // Get ID token for API authentication
          const idToken = await result.user.getIdToken();
          
          // Update Firebase Auth profile with photo URL
          if (result.user.photoURL) {
            try {
              await updateProfile(result.user, {
                photoURL: result.user.photoURL
              });
            } catch (profileUpdateError) {
              console.error("Error updating Firebase profile:", profileUpdateError);
            }
          }
          
          // For new users, initialize their data
          if (isNewUser) {
            await initializeNewUser(result.user, {
              name: result.user.displayName || undefined,
              email: result.user.email || '',
              profileImage: result.user.photoURL || undefined
            });
          } else {
            // For existing users, just update their profile
            const response = await fetch('/api/user/profile', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: result.user.displayName || undefined,
                email: result.user.email || '',
                profileImage: result.user.photoURL || undefined
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to save user profile');
            }
          }
        } catch (profileError) {
          console.error("Error saving user profile from Google:", profileError);
        }
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      let errorMessage = "Failed to login with Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login popup was closed before completing the sign-in process";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "The popup has been closed by the user";
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        errorMessage = "Firebase is not configured correctly. Please check your .env.local file.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        loginWithGoogle,
        clearError,
        authInitialized,
        firebaseAvailable,
        isLocalMode: isLocalAuthMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 