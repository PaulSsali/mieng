import { Project } from './db/project-service';
import { ProjectFormData as FormData } from '@/components/projects/ProjectForm';

export type ProjectFormData = FormData;

// Service for handling project operations from the frontend
export async function createNewProject(projectData: ProjectFormData): Promise<Project | null> {
  try {
    // Get the current Firebase user
    const auth = (await import('./firebase')).auth;
    const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add the token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers,
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
    });

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

    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

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
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete project');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
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