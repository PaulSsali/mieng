import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

// Check for local development mode
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache for the initialized app
let adminApp: App | null = null;

/**
 * Initializes Firebase Admin SDK if it hasn't been initialized already
 * Returns true if initialization was successful or if using local auth mode
 */
export function initAdmin(): boolean {
  // If we already initialized the app, return it
  if (adminApp) {
    return true;
  }
  
  // If using local auth mode in development, skip Firebase initialization
  if (isDevelopment && isLocalAuthMode) {
    console.log('Using local auth mode - Firebase Admin SDK initialization skipped');
    return true;
  }

  // Only initialize if not already initialized
  if (getApps().length === 0) {
    // Parse private key correctly
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : undefined;
    
    // Check for required config
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      if (isDevelopment) {
        console.warn('Firebase Admin SDK not initialized: Missing required configuration');
        console.info('To enable development mode without Firebase, set NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true in .env.local');
        return false;
      } else {
        throw new Error('Firebase Admin SDK initialization failed: Missing required configuration');
      }
    }

    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log('Firebase Admin initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      
      if (isDevelopment) {
        console.warn('Firebase Admin failed to initialize in development mode');
        return false;
      } else {
        // In production, rethrow the error
        throw error;
      }
    }
  }
  
  // If we got here, the app was already initialized
  adminApp = getApps()[0];
  return true;
}

/**
 * Check if we have Firebase Admin initialized or if we're in local auth mode
 */
export function hasAdminAuth(): boolean {
  return (isDevelopment && isLocalAuthMode) || getApps().length > 0;
} 