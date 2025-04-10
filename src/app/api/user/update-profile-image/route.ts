import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User, Prisma } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin, hasAdminAuth } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
const adminInitialized = initAdmin();
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';

const prisma = new PrismaClient();

/**
 * API route to update a user's profile image
 * This keeps Prisma schema updates separate from the frontend code
 */
export async function POST(request: NextRequest) {
  console.log('[POST /api/user/update-profile-image] Received request');
  
  try {
    // Handle local auth mode for development
    if (isDevelopment && isLocalAuthMode) {
      console.log('[POST /api/user/update-profile-image] Local auth mode - skipping token verification');
      return NextResponse.json({ success: true, localMode: true });
    }
    
    // Check if Firebase Admin is properly initialized
    if (!adminInitialized) {
      console.warn('[POST /api/user/update-profile-image] Firebase Admin not initialized - this may be due to missing environment variables');
      if (isDevelopment) {
        return NextResponse.json(
          { 
            warning: 'Firebase Admin not initialized',
            help: 'Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local',
            success: false 
          },
          { status: 200 } // Return 200 in development to not block auth flow
        );
      } else {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
    }
    
    // Get the Firebase ID token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const idToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null;
      
    if (!idToken) {
      console.warn('[POST /api/user/update-profile-image] No token provided');
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    // Check if Admin SDK is ready
    const isAdminSdkReady = hasAdminAuth();
    console.log(`[POST /api/user/update-profile-image] Firebase Admin SDK Ready: ${isAdminSdkReady}`);
    
    if (!isAdminSdkReady) {
      console.warn('[POST /api/user/update-profile-image] Admin SDK not ready');
      if (isDevelopment) {
        return NextResponse.json(
          { 
            warning: 'Firebase Admin SDK not ready',
            success: false 
          },
          { status: 200 } // Return 200 in development to not block auth flow
        );
      } else {
        return NextResponse.json(
          { error: 'Authentication service unavailable' },
          { status: 503 }
        );
      }
    }

    // Verify the Firebase ID token
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const email = decodedToken.email;
      console.log(`[POST /api/user/update-profile-image] Token verified for: ${email}`);

      if (!email) {
        console.warn('[POST /api/user/update-profile-image] No email in token');
        return NextResponse.json(
          { error: 'No email found in token' },
          { status: 400 }
        );
      }
      
      // Parse the request body
      const body = await request.json().catch(e => {
        console.error('[POST /api/user/update-profile-image] Error parsing JSON body:', e);
        return null;
      });
      
      if (!body) {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }
      
      const { profileImage } = body;
      
      if (!profileImage) {
        return NextResponse.json(
          { error: 'profileImage is required' },
          { status: 400 }
        );
      }
      
      // Find the user by email
      const existingUser = await prisma.user.findUnique({
        where: { email }
      }).catch(e => {
        console.error('[POST /api/user/update-profile-image] Database error finding user:', e);
        return null;
      });
      
      let result;
      
      if (existingUser) {
        // Update the existing user's profile image
        console.log(`[POST /api/user/update-profile-image] Updating profile image for existing user: ${existingUser.id}`);
        
        // Use a more flexible approach to handle potential type issues
        // Using Record<string, any> to bypass TypeScript validation
        const updateData: Record<string, any> = {
          updatedAt: new Date()
        };
        
        // Add profileImage conditionally to avoid TypeScript errors
        if (typeof profileImage === 'string') {
          updateData.profileImage = profileImage;
        }
        
        result = await prisma.user.update({
          where: { email },
          data: updateData
        }).catch(e => {
          console.error('[POST /api/user/update-profile-image] Database error updating user:', e);
          return null;
        });
      } else {
        // Create a new user with the profile image
        console.log(`[POST /api/user/update-profile-image] Creating new user with email: ${email}`);
        
        // Use a more flexible approach for creation too
        const createData: Record<string, any> = {
          email,
          name: email.split('@')[0], // Set a default name based on email
          role: 'ENGINEER',
        };
        
        // Add profileImage conditionally
        if (typeof profileImage === 'string') {
          createData.profileImage = profileImage;
        }
        
        result = await prisma.user.create({
          data: createData
        }).catch(e => {
          console.error('[POST /api/user/update-profile-image] Database error creating user:', e);
          return null;
        });
      }
      
      if (!result) {
        if (isDevelopment) {
          return NextResponse.json(
            { warning: 'Database operation failed but continuing auth flow', success: false },
            { status: 200 } // Return 200 in development to not block auth flow
          );
        } else {
          return NextResponse.json(
            { error: 'Database operation failed' },
            { status: 500 }
          );
        }
      }
      
      console.log('[POST /api/user/update-profile-image] Profile image updated successfully');
      return NextResponse.json(
        { success: true, user: { email, profileImage } },
        { status: 200 }
      );
    } catch (verifyError) {
      console.error('[POST /api/user/update-profile-image] Token verification error:', verifyError);
      if (isDevelopment) {
        return NextResponse.json(
          { 
            warning: 'Token verification failed',
            error: verifyError instanceof Error ? verifyError.message : String(verifyError),
            help: 'Check your Firebase configuration in .env.local',
            success: false 
          },
          { status: 200 } // Return 200 in development to not block auth flow
        );
      } else {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.error('[POST /api/user/update-profile-image] Unhandled error:', error);
    
    // In development, return detailed error but with 200 status to not block auth flow
    if (isDevelopment) {
      return NextResponse.json(
        { 
          error: 'Failed to update profile image',
          details: error instanceof Error ? error.message : String(error),
          success: false
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile image' },
      { status: 500 }
    );
  }
} 