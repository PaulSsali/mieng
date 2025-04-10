import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getAuth } from '@/lib/firebase-admin';
import { Role } from '@prisma/client';
import { ApiError, ApiErrorType, createAuthenticationError } from '@/lib/api-error-handler';
import { withErrorHandling } from '@/lib/api-error-handler';

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalAuthMode = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';

// Authentication check using Firebase admin
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  console.log('[AuthCheck Dashboard] Starting authentication check...');
  try {
    // If using local auth mode in development, use the test user ID
    if (isDevelopment && isLocalAuthMode) {
      console.log('[AuthCheck Dashboard] Using local dev user ID.');
      return await getOrCreateDevUser("local-test@example.com", "Local Test User");
    }
    
    // Get the Firebase ID token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null;
      
    console.log(`[AuthCheck Dashboard] Received token: ${idToken ? 'Yes' : 'No'}`);

    // If we're in development without a token, use a consistent ID based on a real user
    if (isDevelopment && (!idToken || idToken === 'undefined')) {
      console.log('[AuthCheck Dashboard] Development mode, no token found. Using real test user.');
      return await getOrCreateDevUser("test@example.com", "Test User");
    }
    
    // If we have a token, verify it with Firebase using getAuth()
    if (idToken) { 
      try {
        console.log('[AuthCheck Dashboard] Verifying Firebase token...');
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const email = decodedToken.email;
        console.log(`[AuthCheck Dashboard] Token verified. Email from token: ${email}`);
        
        if (email) {
          // Find user by email
          console.log(`[AuthCheck Dashboard] Looking up user in DB with email: ${email}`);
          const user = await prisma.user.findUnique({
            where: { email }
          });
          
          if (user) {
            console.log(`[AuthCheck Dashboard] User found in DB. Returning ID: ${user.id}`);
            return user.id;
          } else {
            console.warn(`[AuthCheck Dashboard] User with email ${email} not found in DB. Creating now.`);
            // Create user if not found
            return await createUserInDb(email, email.split('@')[0]);
          }
        } else {
           console.warn('[AuthCheck Dashboard] Email not found in decoded token.');
        }
      } catch (error) {
        console.error('[AuthCheck Dashboard] Error verifying Firebase token:', error);
        // Only fail hard in production if token verification fails
        if (!isDevelopment) { 
           return null;
        }
      }
    } 
    
    // Fallback for development - use a real test user instead of "default-user-id"
    if (isDevelopment) {
      console.warn('[AuthCheck Dashboard] Falling back to test user for development (after potential token failure).');
      return await getOrCreateDevUser("nylah@example.com", "Nylah Test");
    }
    
    console.warn('[AuthCheck Dashboard] Authentication failed. Returning null.');
    return null;
  } catch (error: unknown) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    console.error('[AuthCheck Dashboard] Unexpected error during authentication:', typedError);
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
    console.log(`[AuthCheck Dashboard] Found existing test user: ${existingUser.id}`);
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
        role: Role.ENGINEER
      }
    });

    console.log(`[AuthCheck Dashboard] Created new user with ID: ${newUser.id}`);
    return newUser.id;
  } catch (error) {
    console.error(`[AuthCheck Dashboard] Error creating user ${email}:`, error);
    throw error;
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

// Rename the main logic function to avoid conflict with export
async function handleGetDashboardData(req: NextRequest) {
  console.log('[GET /api/dashboard] Received request');
  let userId;
  try {
    // Authenticate user
    console.log('[GET /api/dashboard] Attempting authentication...');
    userId = await getAuthenticatedUserId(req);
    console.log(`[GET /api/dashboard] Authentication successful. User ID: ${userId}`);
    
    if (!userId) {
      console.warn('[GET /api/dashboard] Unauthorized - No User ID found');
      // Use ApiError for consistency
      throw createAuthenticationError(); 
    }
  } catch (authError) {
    console.error('[GET /api/dashboard] Authentication failed:', authError);
    throw authError instanceof ApiError ? authError : createAuthenticationError('Authentication failed');
  }
    
  let recentProjects: ProjectType[] = [];
  let projectCount = 0;
  let referees: RefereeType[] = [];
  let isFirstVisit = false;

  // Fetch data within separate try/catch blocks
  try {
    console.log(`[GET /api/dashboard] Fetching recent projects for userId: ${userId}`);
    recentProjects = await prisma.project.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        discipline: true,
        outcomes: true
      }
    }) as ProjectType[];
    console.log(`[GET /api/dashboard] Found ${recentProjects.length} recent projects`);
  } catch (projectsError) {
    console.error("[GET /api/dashboard] Error fetching recent projects:", projectsError);
    // Don't throw yet, allow other data to load if possible
  }
    
  try {
    console.log(`[GET /api/dashboard] Counting projects for userId: ${userId}`);
    projectCount = await prisma.project.count({
      where: { userId: userId }
    });
    console.log(`[GET /api/dashboard] Total project count: ${projectCount}`);
  } catch (countError) {
    console.error("[GET /api/dashboard] Error counting projects:", countError);
    // Don't throw yet
  }
    
  try {
    console.log(`[GET /api/dashboard] Fetching referees for userId: ${userId}`);
    referees = await prisma.referee.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        title: true,
        company: true
      }
    });
    console.log(`[GET /api/dashboard] Found ${referees.length} referees`);
  } catch (refError) {
    console.error("[GET /api/dashboard] Error fetching referees:", refError);
     // Don't throw yet
  }
    
  try {
    console.log(`[GET /api/dashboard] Checking if user is first visit for userId: ${userId}`);
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { createdAt: true }
    });
    
    if (user) {
      const creationTime = new Date(user.createdAt);
      const now = new Date();
      const timeDiffMs = now.getTime() - creationTime.getTime();
      const oneHourInMs = 60 * 60 * 1000;
      isFirstVisit = timeDiffMs < oneHourInMs;
      console.log(`[GET /api/dashboard] isFirstVisit: ${isFirstVisit}`);
    } else {
      console.warn(`[GET /api/dashboard] User not found for isFirstVisit check, userId: ${userId}`);
    }
  } catch (userError) {
    console.error("[GET /api/dashboard] Error checking user creation time:", userError);
     // Don't throw yet
  }
    
  // Transform data (wrap this in try/catch as well)
  try {
    console.log('[GET /api/dashboard] Transforming fetched data...');
    const transformedProjects = recentProjects.map(project => ({
      id: project.id,
      title: project.name, 
      dateRange: formatDateRange(project.startDate, project.endDate),
      discipline: project.discipline || "Other Engineering",
      outcomes: project.outcomes?.map(outcome => outcome.outcomeId) || [] // Safer mapping
    }));
    
    const totalOutcomes = 11;
    const uniqueOutcomes = new Set<number>();
    recentProjects.forEach(project => {
      project.outcomes?.forEach(outcome => { // Safer iteration
        uniqueOutcomes.add(outcome.outcomeId);
      });
    });
    
    const completedOutcomes = uniqueOutcomes.size;
    const outcomePercentage = totalOutcomes > 0 ? Math.round((completedOutcomes / totalOutcomes) * 100) : 0;
    
    const totalExperienceMonths = calculateProjectDurationInMonths(recentProjects);
    const years = Math.floor(totalExperienceMonths / 12);
    const months = totalExperienceMonths % 12;
    const durationString = `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    
    const experiencePercentage = Math.min(100, Math.round((totalExperienceMonths / 36) * 100));
    
    const responsePayload = {
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
    };

    console.log('[GET /api/dashboard] Data transformation complete. Sending response.');
    return NextResponse.json(responsePayload);

  } catch (transformError) {
    console.error("[GET /api/dashboard] Error transforming data:", transformError);
    throw new ApiError('Failed to process dashboard data', ApiErrorType.INTERNAL_SERVER_ERROR, transformError);
  }
}

// Export the GET handler wrapped with error handling
export const GET = withErrorHandling(handleGetDashboardData);

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