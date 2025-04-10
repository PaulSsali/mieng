import { Project } from './db/project-service';
import { ProjectFormData as FormData } from '@/components/projects/ProjectForm';
import { authenticatedFetch } from './auth-utils';

export type ProjectFormData = FormData;

// Service for handling project operations from the frontend
export async function createNewProject(projectData: ProjectFormData): Promise<Project | null> {
  try {
    // Get the current Firebase user
    const auth = (await import('./firebase')).auth;
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      throw new Error('You must be logged in to create a project');
    }
    
    const response = await authenticatedFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        // Map all form data to the expected API format
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: 'In Progress', // Default status for new projects
        discipline: projectData.discipline,
        role: projectData.role,
        company: projectData.company,
        responsibilities: projectData.responsibilities,
        referee: projectData.referee,
        milestones: projectData.milestones,
        outcomes: projectData.outcomes,
        outcomeResponses: projectData.outcomeResponses
      }),
    }, currentUser);

    if (!response) {
      throw new Error('Authentication failed. Please log in again.');
    }

    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateExistingProject(id: string, projectData: Partial<ProjectFormData>): Promise<Project | null> {
  try {
    // Get the current Firebase user
    const auth = (await import('./firebase')).auth;
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      throw new Error('You must be logged in to update a project');
    }
    
    // Create payload with all available fields
    const formattedData = {
      name: projectData.name,
      description: projectData.description,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      status: 'In Progress', // Default status
      discipline: projectData.discipline,
      role: projectData.role,
      company: projectData.company,
      responsibilities: projectData.responsibilities,
      referee: projectData.referee,
      milestones: projectData.milestones,
      outcomes: projectData.outcomes,
      outcomeResponses: projectData.outcomeResponses
    };

    const response = await authenticatedFetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    }, currentUser);

    if (!response) {
      throw new Error('Authentication failed. Please log in again.');
    }

    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update project');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

export async function deleteExistingProject(id: string): Promise<boolean> {
  try {
    // Get the current Firebase user
    const auth = (await import('./firebase')).auth;
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      throw new Error('You must be logged in to delete a project');
    }
    
    const response = await authenticatedFetch(`/api/projects/${id}`, {
      method: 'DELETE',
    }, currentUser);

    if (!response) {
      // Handle case where fetch itself failed or returned null (e.g., network error before response)
      throw new Error('Authentication or network request failed.');
    }

    if (!response.ok) {
      let errorMessage = 'Failed to delete project';
      try {
        // Try to get more specific error from API response
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
      } catch (parseError) {
        // Ignore if response body isn't valid JSON
        console.warn('Could not parse error response JSON from API during delete.');
      }
      // Throw a new error with the potentially more specific message
      throw new Error(errorMessage);
    }

    return true;
  } catch (error) {
    // Log the error for debugging, ensuring it's an Error object
    const errorToLog = error instanceof Error ? error : new Error(String(error));
    console.error(`Error deleting project ${id}:`, errorToLog);
    
    // Re-throw the error so the calling component (ProjectCard) can catch it
    // Ensure we throw an actual Error object with a message
    throw new Error(errorToLog.message || 'An unexpected error occurred during deletion.');
  }
}

// Helper function to map UI status strings to the enum format used by the API
function mapStatusToEnum(status: string): string {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'In Progress';
    case 'pending review':
      return 'Pending Review';
    case 'completed':
      return 'Completed';
    case 'planning':
      return 'Planning';
    case 'on hold':
      return 'On Hold';
    default:
      return 'In Progress';
  }
} 