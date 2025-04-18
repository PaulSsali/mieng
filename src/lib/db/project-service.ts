import prisma from './client';
import { Prisma } from '@prisma/client';

// Define types for our UI
export type ProjectStatus = 'In Progress' | 'Completed' | 'Pending Review' | 'Planning' | 'On Hold';

export interface Milestone {
  id?: string;
  title: string;
  date: string;
  description: string;
}

export interface OutcomeResponse {
  [outcomeId: number]: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  discipline: string;
  role: string;
  company: string;
  image?: string;
  userId?: string;
  responsibilities?: string;
  referee?: string;
  milestones?: Milestone[];
  outcomes?: number[];
  outcomeResponses?: OutcomeResponse;
}

// Type for database projects 
type DbProject = {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: string;
  discipline: string | null;
  role: string | null;
  company: string | null;
  image: string | null;
  responsibilities: string | null;
  referee: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  userId: string;
  milestones?: {
    id: string;
    title: string;
    date: Date;
    description: string | null;
  }[];
  outcomes?: {
    id: string;
    outcomeId: number;
    response: string | null;
  }[];
};

// Map database status to UI status
function mapStatusToUi(dbStatus: string): ProjectStatus {
  switch (dbStatus) {
    case 'ACTIVE': return 'In Progress';
    case 'COMPLETED': return 'Completed';
    case 'PENDING_REVIEW': return 'Pending Review';
    case 'PLANNING': return 'Planning';
    case 'ON_HOLD': return 'On Hold';
    default: return 'In Progress';
  }
}

// Map UI status to database status
function mapStatusToDb(uiStatus: ProjectStatus): string {
  switch (uiStatus) {
    case 'In Progress': return 'ACTIVE';
    case 'Completed': return 'COMPLETED';
    case 'Pending Review': return 'PENDING_REVIEW';
    case 'Planning': return 'PLANNING';
    case 'On Hold': return 'ON_HOLD';
    default: return 'ACTIVE';
  }
}

// Convert DB project to UI project
function mapDbProjectToUiProject(dbProject: DbProject): Project {
  // Extract outcome IDs and responses
  const outcomes: number[] = [];
  const outcomeResponses: OutcomeResponse = {};
  
  if (dbProject.outcomes) {
    dbProject.outcomes.forEach(outcome => {
      outcomes.push(outcome.outcomeId);
      if (outcome.response) {
        outcomeResponses[outcome.outcomeId] = outcome.response;
      }
    });
  }
  
  // Map milestones
  const milestones = dbProject.milestones ? dbProject.milestones.map(m => ({
    id: m.id,
    title: m.title,
    date: m.date.toISOString().split('T')[0],
    description: m.description || ''
  })) : [];

  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description || '',
    startDate: dbProject.startDate.toISOString().split('T')[0],
    endDate: dbProject.endDate ? dbProject.endDate.toISOString().split('T')[0] : '',
    status: mapStatusToUi(dbProject.status),
    discipline: dbProject.discipline || '',
    role: dbProject.role || '',
    company: dbProject.company || 'MiEng Engineering Solutions',
    image: dbProject.image || '',
    userId: dbProject.userId,
    responsibilities: dbProject.responsibilities || '',
    referee: dbProject.referee || '',
    milestones,
    outcomes,
    outcomeResponses
  };
}

export async function getAllProjects(userId?: string): Promise<Project[]> {
  try {
    // If userId is provided, filter by that user, otherwise return all projects
    const dbProjects = await prisma.project.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { startDate: 'desc' },
      include: {
        milestones: true,
        outcomes: true
      }
    });
    
    return dbProjects.map(mapDbProjectToUiProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string, userId?: string): Promise<Project | null> {
  try {
    const dbProject = await prisma.project.findFirst({
      where: { 
        id,
        ...(userId ? { userId } : {}) // Only include userId in query if provided
      },
      include: {
        milestones: true,
        outcomes: true
      }
    });
    
    if (!dbProject) return null;
    
    return mapDbProjectToUiProject(dbProject);
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

export async function createProject(projectData: Omit<Project, 'id'>, userId: string): Promise<Project | null> {
  try {
    // Extract outcome responses and milestones for separate creation
    const { outcomes = [], outcomeResponses = {}, milestones = [], ...mainProjectData } = projectData;
    
    // Log the user ID for debugging
    console.log(`Creating project for userId: ${userId}`);
    
    // Check if the organization exists, create one if it doesn't
    let organizationId;
    const firstOrg = await prisma.organization.findFirst();
    
    if (!firstOrg) {
      console.log('No organization found, creating default organization');
      // Create a default organization
      const defaultOrg = await prisma.organization.create({
        data: {
          name: 'Default Organization',
          description: 'Automatically created organization'
        }
      });
      organizationId = defaultOrg.id;
    } else {
      organizationId = firstOrg.id;
    }
    
    console.log(`Using organization ID: ${organizationId}`);
    
    // Create the main project record
    const dbProject = await prisma.project.create({
      data: {
        name: mainProjectData.name,
        description: mainProjectData.description,
        startDate: new Date(mainProjectData.startDate),
        endDate: mainProjectData.endDate ? new Date(mainProjectData.endDate) : undefined,
        status: 'ACTIVE',
        discipline: mainProjectData.discipline,
        role: mainProjectData.role,
        company: mainProjectData.company,
        image: mainProjectData.image,
        responsibilities: mainProjectData.responsibilities,
        referee: mainProjectData.referee,
        userId, // Use the provided userId
        // Connect to the organization using the ID directly
        organizationId: organizationId
      },
    });
    
    // Create milestones if any
    if (milestones && milestones.length > 0) {
      await Promise.all(milestones.map(milestone => 
        prisma.projectMilestone.create({
          data: {
            title: milestone.title,
            date: new Date(milestone.date),
            description: milestone.description,
            project: { connect: { id: dbProject.id } }
          }
        })
      ));
    }
    
    // Create outcomes if any
    if (outcomes && outcomes.length > 0) {
      await Promise.all(outcomes.map(outcomeId => 
        prisma.projectOutcome.create({
          data: {
            outcomeId: outcomeId,
            response: outcomeResponses[outcomeId] || null,
            project: { connect: { id: dbProject.id } }
          }
        })
      ));
    }
    
    // Fetch the complete project with related data
    const completeProject = await prisma.project.findUnique({
      where: { id: dbProject.id },
      include: {
        milestones: true,
        outcomes: true
      }
    });
    
    return completeProject ? mapDbProjectToUiProject(completeProject) : null;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

export async function updateProject(id: string, projectData: Partial<Project>, userId?: string): Promise<Project | null> {
  try {
    // First check if the project exists and belongs to the user
    if (userId) {
      const existingProject = await prisma.project.findFirst({
        where: { id, userId },
      });
      
      if (!existingProject) {
        console.error(`Project ${id} not found or does not belong to user ${userId}`);
        return null;
      }
    }
    
    // Extract fields that need separate handling
    const { outcomes, outcomeResponses, milestones, ...mainProjectData } = projectData;
    
    // Prepare update data for the main project
    const updateData: any = {};
    
    if (mainProjectData.name !== undefined) updateData.name = mainProjectData.name;
    if (mainProjectData.description !== undefined) updateData.description = mainProjectData.description;
    if (mainProjectData.startDate !== undefined) updateData.startDate = new Date(mainProjectData.startDate);
    if (mainProjectData.endDate !== undefined) updateData.endDate = mainProjectData.endDate ? new Date(mainProjectData.endDate) : null;
    if (mainProjectData.status !== undefined) updateData.status = mapStatusToDb(mainProjectData.status);
    if (mainProjectData.discipline !== undefined) updateData.discipline = mainProjectData.discipline;
    if (mainProjectData.role !== undefined) updateData.role = mainProjectData.role;
    if (mainProjectData.company !== undefined) updateData.company = mainProjectData.company;
    if (mainProjectData.image !== undefined) updateData.image = mainProjectData.image;
    if (mainProjectData.responsibilities !== undefined) updateData.responsibilities = mainProjectData.responsibilities;
    if (mainProjectData.referee !== undefined) updateData.referee = mainProjectData.referee;
    
    // Update the main project
    const dbProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    
    // Update milestones if provided
    if (milestones) {
      // Delete existing milestones and create new ones
      await prisma.projectMilestone.deleteMany({
        where: { projectId: id }
      });
      
      // Create new milestones
      if (milestones.length > 0) {
        await Promise.all(milestones.map(milestone => 
          prisma.projectMilestone.create({
            data: {
              title: milestone.title,
              date: new Date(milestone.date),
              description: milestone.description,
              project: { connect: { id: dbProject.id } }
            }
          })
        ));
      }
    }
    
    // Update outcomes if provided
    if (outcomes) {
      // Delete existing outcomes and create new ones
      await prisma.projectOutcome.deleteMany({
        where: { projectId: id }
      });
      
      // Create new outcomes
      if (outcomes.length > 0) {
        await Promise.all(outcomes.map(outcomeId => 
          prisma.projectOutcome.create({
            data: {
              outcomeId: outcomeId,
              response: outcomeResponses?.[outcomeId] || null,
              project: { connect: { id: dbProject.id } }
            }
          })
        ));
      }
    }
    
    // Fetch the complete updated project
    const updatedProject = await prisma.project.findUnique({
      where: { id: dbProject.id },
      include: {
        milestones: true,
        outcomes: true
      }
    });
    
    return updatedProject ? mapDbProjectToUiProject(updatedProject) : null;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    return null;
  }
}

export async function deleteProject(id: string, userId?: string): Promise<boolean> {
  console.log(`[DB deleteProject] Attempting to delete project ID: ${id} for user ID: ${userId}`);
  try {
    // First check if the project exists and belongs to the user, *if* userId is provided
    if (userId) {
      console.log(`[DB deleteProject] Verifying ownership for project ${id} and user ${userId}...`);
      const existingProject = await prisma.project.findFirst({
        where: { id, userId },
        select: { id: true } // Only select ID for efficiency
      });
      
      if (!existingProject) {
        console.error(`[DB deleteProject] Verification failed: Project ${id} not found or does not belong to user ${userId}`);
        return false; // Explicitly return false if verification fails
      }
      console.log(`[DB deleteProject] Ownership verified for project ${id} and user ${userId}.`);
    }
    
    console.log(`[DB deleteProject] Executing prisma.project.delete for ID: ${id}`);
    // Delete the project (will also delete related milestones and outcomes due to Cascade)
    await prisma.project.delete({
      where: { id },
    });
    console.log(`[DB deleteProject] Successfully deleted project ID: ${id}`);
    
    return true;
  } catch (error) {
    console.error(`[DB deleteProject] Error during prisma.project.delete for ID ${id}:`, error);
    // Check for specific Prisma errors, like P2025 (Record to delete does not exist)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      console.error(`[DB deleteProject] Prisma error P2025: Record with ID ${id} not found for deletion.`);
      // This shouldn't happen if the check above passed, but good to handle.
    }
    return false; // Return false on any error during deletion
  }
} 