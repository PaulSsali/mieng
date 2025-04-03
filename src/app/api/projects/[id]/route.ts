import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/project-service';
import { withErrorHandling, createAuthenticationError, createNotFoundError } from '@/lib/api-error-handler';
import { logError } from '@/lib/error-service';

interface RouteParams {
  params: {
    id: string;
  };
}

// This is a simplified auth check for development purposes
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    // For now, check the session cookie or header
    // This is a placeholder - in real app, you'd validate against your auth system
    
    // For development, we'll use a hard-coded ID
    // In production, replace this with proper session handling
    return 'default-user-id';
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
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  const project = await getProjectById(params.id, userId);
  
  if (!project) {
    throw createNotFoundError('Project', params.id);
  }
  
  return NextResponse.json(project);
});

// PUT update project
export const PUT = withErrorHandling(async (req: NextRequest, { params }: RouteParams) => {
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  // Verify the project exists and belongs to user
  const existingProject = await getProjectById(params.id, userId);
  
  if (!existingProject) {
    throw createNotFoundError('Project', params.id);
  }
  
  const data = await req.json();
  const updatedProject = await updateProject(params.id, data, userId);
  
  return NextResponse.json(updatedProject);
});

// DELETE project
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: RouteParams) => {
  const userId = await getAuthenticatedUserId(req);
  
  if (!userId) {
    throw createAuthenticationError();
  }
  
  // Verify the project exists and belongs to user
  const existingProject = await getProjectById(params.id, userId);
  
  if (!existingProject) {
    throw createNotFoundError('Project', params.id);
  }
  
  await deleteProject(params.id, userId);
  
  return NextResponse.json({ success: true });
}); 