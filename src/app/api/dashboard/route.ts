import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

// Authentication check using Firebase admin
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    // Get the Firebase ID token from the Authorization header
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      // For development fallback
      return 'default-user-id';
    }

    // Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return null;
    }

    // Find user by email to get their ID
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user?.id || 'default-user-id';
  } catch (error) {
    console.error('Error authenticating user:', error);
    // For development fallback
    return 'default-user-id';
  }
}

// Define the structure of an outcome from the database
interface OutcomeResponse {
  id: string;
  outcomeId: number;
  projectId: string;
  response: string | null;
}

// Define TypeScript types for better type safety
interface ProjectType {
  id: string;
  name: string;  // Match the actual field in the database
  startDate: Date | null;
  endDate: Date | null;
  discipline: string | null;
  outcomes: OutcomeResponse[];  // Update to match the actual database structure
}

// Referee type as returned from the database
interface RefereeType {
  id: string;
  name: string;
  title: string;
  company: string;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the 3 most recent projects
    let recentProjects: ProjectType[] = [];
    try {
      const projects = await prisma.project.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 3,
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          discipline: true,
          outcomes: true  // This will include all outcome responses for the project
        }
      });
      
      // Map database results to our ProjectType interface
      recentProjects = projects as ProjectType[];
    } catch (projectsError) {
      console.error("Error fetching recent projects:", projectsError);
      recentProjects = [];
    }
    
    // Get total completed projects count (for now just count all projects)
    let projectCount = 0;
    try {
      projectCount = await prisma.project.count({
        where: {
          userId: userId
        }
      });
    } catch (countError) {
      console.error("Error counting projects:", countError);
      projectCount = 0;
    }
    
    // Get referees from the database
    let referees: RefereeType[] = [];
    try {
      referees = await prisma.referee.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 3,
        select: {
          id: true,
          name: true,
          title: true,
          company: true
        }
      });
    } catch (refError) {
      console.error("Error fetching referees:", refError);
      referees = [];
    }
    
    // Check if this is a first-time user
    let isFirstVisit = false;
    try {
      // Get the user from the database
      const user = await prisma.user.findFirst({
        where: {
          id: userId
        },
        select: {
          createdAt: true
        }
      });
      
      if (user) {
        // Consider a user as new if created within the last hour
        const creationTime = new Date(user.createdAt);
        const now = new Date();
        const timeDiffMs = now.getTime() - creationTime.getTime();
        const oneHourInMs = 60 * 60 * 1000;
        
        isFirstVisit = timeDiffMs < oneHourInMs;
      }
    } catch (userError) {
      console.error("Error checking user creation time:", userError);
    }
    
    // Transform data for the dashboard
    try {
      const transformedProjects = recentProjects.map(project => ({
        id: project.id,
        title: project.name,  // Map name to title for the frontend
        dateRange: formatDateRange(project.startDate, project.endDate),
        discipline: project.discipline || "Other Engineering",
        outcomes: project.outcomes.map(outcome => outcome.outcomeId)  // Extract just the outcomeId numbers
      }));
      
      // Calculate ECSA outcomes coverage (example: 11 outcomes total)
      const totalOutcomes = 11;
      const uniqueOutcomes = new Set<number>();
      
      // Collect all unique outcomes from all projects
      recentProjects.forEach(project => {
        project.outcomes.forEach(outcome => {
          uniqueOutcomes.add(outcome.outcomeId);
        });
      });
      
      const completedOutcomes = uniqueOutcomes.size;
      const outcomePercentage = Math.round((completedOutcomes / totalOutcomes) * 100);
      
      // Calculate project experience duration in years and months
      const totalExperienceMonths = calculateProjectDurationInMonths(recentProjects);
      const years = Math.floor(totalExperienceMonths / 12);
      const months = totalExperienceMonths % 12;
      const durationString = `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
      
      // Calculate experience percentage (assuming 36 months / 3 years is 100%)
      const experiencePercentage = Math.min(100, Math.round((totalExperienceMonths / 36) * 100));
      
      return NextResponse.json({
        progressData: {
          ecsa: {
            completed: completedOutcomes,
            total: totalOutcomes,
            percentage: outcomePercentage
          },
          projects: {
            count: projectCount,
            duration: durationString,
            percentage: experiencePercentage
          }
        },
        recentProjects: transformedProjects,
        referees: referees,
        isFirstVisit: isFirstVisit
      });
    } catch (transformError) {
      console.error("Error transforming data:", transformError);
      return NextResponse.json({
        error: "Failed to process dashboard data"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 });
  }
}

// Helper function to format date range as a string
function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate) return "No dates specified";
  
  const start = new Date(startDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short'
  });
  
  const end = endDate 
    ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : "Present";
    
  return `${start} - ${end}`;
}

// Helper function to calculate total duration of projects in months
function calculateProjectDurationInMonths(projects: ProjectType[]): number {
  let totalMonths = 0;
  
  projects.forEach(project => {
    if (project.startDate) {
      const start = new Date(project.startDate);
      const end = project.endDate ? new Date(project.endDate) : new Date();
      
      // Calculate difference in months
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
                     
      totalMonths += Math.max(0, months);
    }
  });
  
  return totalMonths;
} 