import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db/project-service';
import { withErrorHandling, createAuthenticationError } from '@/lib/api-error-handler';
import { hasAdminAuth } from '@/lib/firebase-admin';

// Check for local development mode
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

// This is an improved auth check that supports local development mode
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    // If using local auth mode in development, use a mock user ID
    if (isDevelopment && isLocalAuthMode) {
      return 'local-dev-user-id';
    }
    
    // For now, check the session cookie or header
    // This is a placeholder - in real app, you'd validate against your auth system
    
    // For development, we'll use a hard-coded ID
    // In production, replace this with proper session handling
    return 'default-user-id';
  } catch (error: unknown) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    console.error('Error getting authenticated user:', typedError);
    return null;
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
  // Get the user ID
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  const projectData = await req.json();
  
  // Create the project
  const newProject = await createProject(projectData, userId);
  
  return NextResponse.json(newProject, { status: 201 });
}); 