// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Check if we're in development mode and in browser
const isDevelopment = process.env.NODE_ENV === 'development';
const isBrowser = typeof window !== 'undefined';

// Check if local auth mode is enabled
const localAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';

// More robust validation for Firebase configuration
// Check if we have real Firebase credentials (not just any values, but valid-looking ones)
const hasValidConfig = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 10 &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('your-') &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('placeholder') &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('your-') &&
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('placeholder');

// Your web app's Firebase configuration - even more defensive
const firebaseConfig = hasValidConfig ? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
} : null;

// Initialize Firebase app
let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

// Check if we should try to initialize Firebase
const shouldInitFirebase = (firebaseConfig && (isBrowser || !isDevelopment)) || (isDevelopment && localAuthEnabled);

// Only initialize Firebase if we have valid config or local auth is enabled
if (shouldInitFirebase) {
  try {
    // If local auth is enabled in development, use a mock config
    const configToUse = (!firebaseConfig && isDevelopment && localAuthEnabled) 
      ? {
          apiKey: "demo-api-key",
          authDomain: "demo-project.firebaseapp.com",
          projectId: "demo-project",
          storageBucket: "demo-project.appspot.com",
          messagingSenderId: "123456789012",
          appId: "1:123456789012:web:abcdef1234567890"
        } 
      : firebaseConfig;
    
    // Initialize Firebase - only if not already initialized and we have a config
    if (configToUse && !getApps().length) {
      app = initializeApp(configToUse);
    } else if (getApps().length) {
      app = getApp();
    }

    // Initialize Auth - with more defensive coding
    if (app) {
      try {
        auth = getAuth(app);
        
        // In development, we can use local emulators if needed
        if (isDevelopment && isBrowser) {
          if (localAuthEnabled || process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
            if (auth) connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            console.log('Connected to Firebase Auth emulator');
          }
        }
      } catch (authError) {
        console.error("Firebase Auth initialization error:", authError);
        auth = null; // Ensure auth is null on failure
      }
    }

    // Initialize Analytics only on client side
    if (isBrowser && app) {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.error("Analytics initialization failed:", error);
        analytics = null; // Ensure analytics is null on failure
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    
    // In development, don't crash the app, but reset everything to null
    app = undefined;
    auth = null;
    analytics = null;
    
    // In production, we still don't want to crash
    if (!isDevelopment) {
      console.error("Firebase failed in production environment:", error);
    }
  }
} else {
  if (isDevelopment) {
    console.warn("Firebase configuration is missing or incomplete. Auth features will be disabled.");
    console.info("To enable local development mode without Firebase, set NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true in .env.local");
  } else {
    console.error("Firebase configuration is required in production. Authentication will not work.");
  }
}

export { app, auth, analytics };
export const hasAuth = !!auth;
export const isLocalAuthMode = isDevelopment && localAuthEnabled; 