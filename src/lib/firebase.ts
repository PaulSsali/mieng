// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Check if we're in development mode and in browser
const isDevelopment = process.env.NODE_ENV === 'development';
const isBrowser = typeof window !== 'undefined';

// Check if local auth mode is enabled
export const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';

// Debug logs - Moved after variable declarations
if (isDevelopment) {
  console.log('Firebase initialization check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- NEXT_PUBLIC_ENABLE_LOCAL_AUTH:', process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH);
  console.log('- isLocalAuthMode:', isLocalAuthMode);
  console.log('Checking client-side Firebase config variables:');
  console.log('- NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `(set, length: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length})` : '(not set)');
  console.log('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? `(set, value: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN})` : '(not set)');
  console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `(set, value: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})` : '(not set)');
  console.log('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? `(set, value: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET})` : '(not set)');
  console.log('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? `(set, length: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.length})` : '(not set)');
  console.log('- NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? `(set, length: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.length})` : '(not set)');
}

// More robust validation for Firebase configuration
// Check if we have real Firebase credentials (not just any values, but valid-looking ones)
const hasValidApiKey = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 10 &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('your-') &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('placeholder');

const hasValidProjectId = 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('your-') &&
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('placeholder');

const hasValidConfig = hasValidApiKey && hasValidProjectId;

if (isDevelopment) {
  console.log(`[Debug] hasValidApiKey: ${hasValidApiKey}`);
  console.log(`[Debug] hasValidProjectId: ${hasValidProjectId}`);
  console.log(`[Debug] hasValidConfig evaluation: ${hasValidConfig}`);
}

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
const shouldInitFirebase = (firebaseConfig && (isBrowser || !isDevelopment)) || (isDevelopment && isLocalAuthMode);

// Log the configuration and initialization decision
if (isDevelopment) {
  console.log('[Debug] Firebase configuration:', firebaseConfig ? 'Valid configuration object' : 'No valid configuration');
  console.log('[Debug] Should initialize Firebase?', shouldInitFirebase);
  if (firebaseConfig) {
    console.log('[Debug] Firebase config details:');
    console.log('  - apiKey:', firebaseConfig.apiKey ? '✓ Set' : '✗ Not set');
    console.log('  - authDomain:', firebaseConfig.authDomain ? '✓ Set' : '✗ Not set');
    console.log('  - projectId:', firebaseConfig.projectId ? '✓ Set' : '✗ Not set');
    console.log('  - storageBucket:', firebaseConfig.storageBucket ? '✓ Set' : '✗ Not set');
    console.log('  - messagingSenderId:', firebaseConfig.messagingSenderId ? '✓ Set' : '✗ Not set');
    console.log('  - appId:', firebaseConfig.appId ? '✓ Set' : '✗ Not set');
  }
}

// Only initialize Firebase if we have valid config or local auth is enabled
if (shouldInitFirebase) {
  try {
    // If local auth is enabled in development, use a mock config
    const configToUse = (!firebaseConfig && isDevelopment && isLocalAuthMode) 
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
      console.log('[Debug] Initializing Firebase with config:', configToUse ? 'Valid configuration' : 'Invalid configuration');
      app = initializeApp(configToUse);
      console.log('[Debug] Firebase app initialized successfully');
    } else if (getApps().length) {
      console.log('[Debug] Firebase already initialized, getting existing app');
      app = getApp();
    }

    // Initialize Auth - with more defensive coding
    if (app) {
      try {
        console.log('[Debug] Initializing Firebase Auth');
        auth = getAuth(app);
        console.log('[Debug] Firebase Auth initialized successfully');
        
        // In development, we can use local emulators if needed
        if (isDevelopment && isBrowser) {
          if (isLocalAuthMode || process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
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
// isLocalAuthMode is already exported at the top
// export const isLocalAuthMode = isDevelopment && isLocalAuthMode; 