import * as admin from 'firebase-admin';

// Singleton pattern to avoid multiple initializations
let firebaseAdmin: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }
  
  // Check if app is already initialized
  const apps = admin.apps;
  if (apps.length > 0) {
    firebaseAdmin = apps[0]!;
    return firebaseAdmin;
  }
  
  // Initialize with credentials
  try {
    // For production, use service account from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
      );
      
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } 
    // Use individual credential environment variables if available
    else if (process.env.FIREBASE_PROJECT_ID && 
             process.env.FIREBASE_CLIENT_EMAIL && 
             process.env.FIREBASE_PRIVATE_KEY) {
      
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // The private key needs to have \n replaced with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
    }
    // For development, use a simpler initialization as fallback
    else {
      // Check if we have project ID
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        console.warn('Firebase project ID not found in environment variables');
      }
      
      // Initialize with application default credentials or minimal config
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
    
    return firebaseAdmin;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin');
  }
}

// Export the auth function for convenience
export const getAuth = () => getFirebaseAdmin().auth(); 