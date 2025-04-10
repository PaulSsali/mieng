import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/project-service';
import { withErrorHandling, createAuthenticationError, createNotFoundError } from '@/lib/api-error-handler';
import { logError } from '@/lib/error-service';
import { getAuth } from '@/lib/firebase-admin';

interface RouteParams {
  params: {
    id: string;
  };
}

// Extract and verify the user ID from the Firebase token
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logError(new Error('No valid authorization header found'), 'warning', { 
        component: 'API', 
        method: 'getAuthenticatedUserId' 
      });
      return null;
    }
    
    // Extract the token
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      logError(new Error('No token found in authorization header'), 'warning', { 
        component: 'API', 
        method: 'getAuthenticatedUserId' 
      });
      return null;
    }

    try {
      // Verify the token and get the user ID
      const decodedToken = await getAuth().verifyIdToken(token);
      return decodedToken.uid;
    } catch (firebaseError) {
      // If Firebase verification fails but we're in development mode,
      // check if this is a special development token
      if (process.env.NODE_ENV === 'development') {
        // For local development mode with mock authentication
        if (process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true') {
          try {
            // Attempt to decode the token (it's a mock token in local auth mode)
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            if (payload && payload.user_id) {
              console.log("Development mode: Using user_id from local auth token:", payload.user_id);
              return payload.user_id;
            }
          } catch (error) {
            // If token parsing fails, fall back to the request headers 
            const devUserId = req.headers.get('x-user-id');
            if (devUserId) {
              console.log("Development mode: Using user_id from x-user-id header:", devUserId);
              return devUserId;
            }
          }
        }
      }
      
      // Log the original Firebase error
      logError(firebaseError as Error, 'error', { 
        component: 'API', 
        method: 'getAuthenticatedUserId',
        message: 'Firebase token verification failed'
      });
      return null;
    }
  } catch (error: unknown) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    logError(typedError, 'error', { 
      component: 'API', 
      method: 'getAuthenticatedUserId', 
      url: req.url 
    });
    return null;
  }
}

// GET project by ID
export const GET = withErrorHandling(async (req: NextRequest, { params }: RouteParams) => {
  // Ensure params.id is available
  const projectId = params.id;
  
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  const project = await getProjectById(projectId, userId);
  
  if (!project) {
    throw createNotFoundError('Project', projectId);
  }
  
  return NextResponse.json(project);
});

// PUT update project
export const PUT = withErrorHandling(async (req: NextRequest, { params }: RouteParams) => {
  // Ensure params.id is available
  const projectId = params.id;
  
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  // Verify the project exists and belongs to user
  const existingProject = await getProjectById(projectId, userId);
  
  if (!existingProject) {
    throw createNotFoundError('Project', projectId);
  }
  
  const data = await req.json();
  const updatedProject = await updateProject(projectId, data, userId);
  
  return NextResponse.json(updatedProject);
});

// DELETE project
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: RouteParams) => {
  const projectId = params.id;
  console.log(`[API DELETE /api/projects/${projectId}] Received request.`);
  
  let userId: string | null = null;
  try {
    userId = await getAuthenticatedUserId(req);
    console.log(`[API DELETE /api/projects/${projectId}] Authenticated User ID: ${userId}`);
  } catch (authError) {
    console.error(`[API DELETE /api/projects/${projectId}] Authentication error:`, authError);
    throw createAuthenticationError(); // Re-throw standard auth error
  }
  
  if (!userId) {
    console.warn(`[API DELETE /api/projects/${projectId}] Authentication returned null user ID.`);
    throw createAuthenticationError();
  }
  
  // Verify the project exists and belongs to user BEFORE attempting delete in db service
  console.log(`[API DELETE /api/projects/${projectId}] Checking existence for user ${userId}...`);
  const existingProject = await getProjectById(projectId, userId);
  
  if (!existingProject) {
    console.error(`[API DELETE /api/projects/${projectId}] Project not found by getProjectById for user ${userId}.`);
    throw createNotFoundError('Project', projectId); // Throw specific 404
  }
  console.log(`[API DELETE /api/projects/${projectId}] Project found. Proceeding with deletion.`);
  
  // Call the database service function to perform the actual deletion
  const success = await deleteProject(projectId, userId); 

  if (!success) {
    // This case might occur if deleteProject itself has internal checks that fail
    console.error(`[API DELETE /api/projects/${projectId}] deleteProject db service function returned false.`);
    // Consider throwing a more specific error if needed, otherwise rely on potential errors from deleteProject
    throw new Error('Database operation failed during project deletion.');
  }
  
  console.log(`[API DELETE /api/projects/${projectId}] Deletion successful.`);
  return NextResponse.json({ success: true });
}); 