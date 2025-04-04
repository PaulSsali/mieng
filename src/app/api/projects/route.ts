import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db/project-service';
import { withErrorHandling, createAuthenticationError } from '@/lib/api-error-handler';
import { hasAdminAuth } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';
import prisma from '@/lib/db/client';

// Check for local development mode
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

// Make sure Firebase Admin is initialized
initAdmin();

// This is an improved auth check that supports local development mode
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  console.log('[AuthCheck] Starting authentication check...');
  try {
    // If using local auth mode in development, use the test user ID
    if (isDevelopment && isLocalAuthMode) {
      console.log('[AuthCheck] Using local dev user ID.');
      return await getOrCreateDevUser("local-test@example.com", "Local Test User");
    }
    
    // Get the Firebase ID token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null;
      
    console.log(`[AuthCheck] Received token: ${idToken ? 'Yes' : 'No'}`);

    // If we're in development without a token, use a consistent ID based on a real user
    if (isDevelopment && (!idToken || idToken === 'undefined')) {
      console.log('[AuthCheck] Development mode, no token found. Using real test user.');
      return await getOrCreateDevUser("test@example.com", "Test User");
    }
    
    // Check if Admin SDK is ready
    const isAdminSdkReady = hasAdminAuth();
    console.log(`[AuthCheck] Firebase Admin SDK Ready: ${isAdminSdkReady}`);
    
    // If we have a token and Admin SDK is ready, verify it with Firebase
    if (idToken && isAdminSdkReady) {
      try {
        console.log('[AuthCheck] Verifying Firebase token...');
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const email = decodedToken.email;
        console.log(`[AuthCheck] Token verified. Email from token: ${email}`);
        
        if (email) {
          // Find user by email
          console.log(`[AuthCheck] Looking up user in DB with email: ${email}`);
          const user = await prisma.user.findUnique({
            where: { email }
          });
          
          if (user) {
            console.log(`[AuthCheck] User found in DB. Returning ID: ${user.id}`);
            return user.id;
          } else {
            console.warn(`[AuthCheck] User with email ${email} not found in DB. Creating now.`);
            // Create user if not found
            return await createUserInDb(email, email.split('@')[0]);
          }
        } else {
           console.warn('[AuthCheck] Email not found in decoded token.');
        }
      } catch (error) {
        console.error('[AuthCheck] Error verifying Firebase token:', error);
      }
    } else if (!isAdminSdkReady) {
       console.warn('[AuthCheck] Skipping token verification because Admin SDK is not ready.');
    }
    
    // Fallback for development - use a real test user instead of "default-user-id"
    if (isDevelopment) {
      console.warn('[AuthCheck] Falling back to test user for development.');
      return await getOrCreateDevUser("nylah@example.com", "Nylah Test");
    }
    
    console.warn('[AuthCheck] Authentication failed. Returning null.');
    return null;
  } catch (error: unknown) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    console.error('[AuthCheck] Unexpected error during authentication:', typedError);
    return null;
  }
}

// Helper function to get or create a development test user
async function getOrCreateDevUser(email: string, name: string): Promise<string> {
  // Try to find the user first
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log(`[AuthCheck] Found existing test user: ${existingUser.id}`);
    return existingUser.id;
  }

  // If not found, create the user
  return await createUserInDb(email, name);
}

// Helper function to create a user in the database
async function createUserInDb(email: string, name: string): Promise<string> {
  try {
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role: 'ENGINEER'
      }
    });

    console.log(`[AuthCheck] Created new user with ID: ${newUser.id}`);
    return newUser.id;
  } catch (error) {
    console.error(`[AuthCheck] Error creating user ${email}:`, error);
    throw error;
  }
}

export const GET = withErrorHandling(async (req: NextRequest) => {
  // Get the user ID
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  // Get projects for this user
  const projects = await getAllProjects(userId);
  return NextResponse.json(projects);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  console.log('[POST /api/projects] Received request');
  
  // Get the user ID
  let userId;
  try {
    userId = await getAuthenticatedUserId(req);
    console.log(`[POST /api/projects] Authenticated User ID: ${userId}`);
  } catch (error) {
    console.error('[POST /api/projects] Error during authentication:', error);
    throw createAuthenticationError('Failed to authenticate user');
  }
  
  if (!userId) {
    console.warn('[POST /api/projects] No userId found after authentication check.');
    throw createAuthenticationError();
  }
  
  let projectData;
  try {
    projectData = await req.json();
    console.log('[POST /api/projects] Received project data:', projectData);
  } catch (error) {
    console.error('[POST /api/projects] Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  
  // Create the project
  try {
    console.log(`[POST /api/projects] Attempting to create project for userId: ${userId}`);
    const newProject = await createProject(projectData, userId);
    console.log('[POST /api/projects] Project created successfully:', newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects] Error during project creation:', error);
    // Ensure withErrorHandling catches this or return a specific error
    return NextResponse.json({ error: 'Failed to create project in database' }, { status: 500 });
  }
}); 