import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db/project-service';
import { withErrorHandling, createAuthenticationError, ApiError, ApiErrorType } from '@/lib/api-error-handler';
import { getAuth } from '@/lib/firebase-admin';
import prisma from '@/lib/db/client';

// Check for local development mode
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

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
    
    // If we have a token, verify it with Firebase using getAuth()
    if (idToken) {
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
        // If token verification fails, don't fall through, throw an error or return null
        // Depending on whether dev fallback is desired here or handled later
        if (!isDevelopment) { // Only fail hard in production
           return null;
        }
      }
    } 
    
    // Fallback for development - use a real test user instead of "default-user-id"
    if (isDevelopment) {
      console.warn('[AuthCheck] Falling back to test user for development (after potential token failure).');
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
  let userId;
  try {
    console.log('[GET /api/projects] Attempting authentication...');
    userId = await getAuthenticatedUserId(req);
    console.log(`[GET /api/projects] Authentication successful. User ID: ${userId}`);
    
    if (!userId) {
      console.warn('[GET /api/projects] Authentication check returned null/undefined user ID.');
      throw createAuthenticationError();
    }
  } catch (authError) {
    console.error('[GET /api/projects] Authentication failed:', authError);
    // Re-throw a specific error type if possible, otherwise let withErrorHandling manage it
    throw authError instanceof ApiError ? authError : createAuthenticationError('Authentication failed');
  }
  
  try {
    console.log(`[GET /api/projects] Fetching projects for user ID: ${userId}`);
    const projects = await getAllProjects(userId);
    console.log(`[GET /api/projects] Successfully fetched ${projects.length} projects for user ID: ${userId}`);
    return NextResponse.json(projects);
  } catch (dbError) {
    console.error(`[GET /api/projects] Database error fetching projects for user ID: ${userId}:`, dbError);
    // Throw a generic internal server error, letting withErrorHandling format the response
    throw new ApiError('Failed to retrieve projects from database', ApiErrorType.INTERNAL_SERVER_ERROR);
  }
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