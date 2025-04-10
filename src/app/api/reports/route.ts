import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client"; // Reverted to importing shared prisma instance
import { getAuth } from "firebase-admin/auth";
import { initAdmin, hasAdminAuth } from "@/lib/firebase-admin"; // Corrected import names

// Initialize Firebase Admin SDK
initAdmin(); // Corrected function call

// --- Authentication Helper ---
async function getAuthenticatedDatabaseUserId(req: NextRequest): Promise<string | null> {
  console.log('[AuthCheck Reports] Starting authentication check...');
  const adminReady = hasAdminAuth(); // Corrected function call
  if (!adminReady) {
    console.warn('[AuthCheck Reports] Firebase Admin SDK is not ready. Cannot authenticate.');
    // Fallback for development if needed, or return null for stricter check
    // For now, returning null as authentication is required
    return null; 
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.warn('[AuthCheck Reports] No Bearer token found in Authorization header.');
    return null;
  }

  const idToken = authorization.split("Bearer ")[1];
  if (!idToken) {
     console.warn('[AuthCheck Reports] Bearer token is empty.');
    return null;
  }

  try {
    console.log('[AuthCheck Reports] Verifying Firebase token...');
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;
    console.log(`[AuthCheck Reports] Token verified. Email from token: ${email}`);

    if (!email) {
      console.warn('[AuthCheck Reports] Email not found in decoded token.');
      return null;
    }

    // Find user in Prisma database by email
    console.log(`[AuthCheck Reports] Looking up user in DB with email: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log(`[AuthCheck Reports] User found in DB. Returning ID: ${user.id}`);
      return user.id; // Return the database ID
    } else {
      console.warn(`[AuthCheck Reports] User with email ${email} not found in DB.`);
      // Optionally create user here if needed, similar to other routes, or return null
      return null; 
    }
  } catch (error) {
    console.error('[AuthCheck Reports] Error verifying Firebase token:', error);
    return null;
  }
}
// --- End Authentication Helper ---

// Remove Mock Data and Helper
// const MOCK_REPORTS = [...];
// function getRefreshedMockReports() { ... }

export async function GET(req: NextRequest) {
  console.log('[GET /api/reports] Received request');
  try {
    const userId = await getAuthenticatedDatabaseUserId(req);

    if (!userId) {
       console.warn('[GET /api/reports] Unauthorized access attempt.');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
     console.log(`[GET /api/reports] Authenticated User DB ID: ${userId}`);

    // Fetch reports from the database for the authenticated user
    console.log(`[GET /api/reports] Fetching reports for user ID: ${userId}`);
    const reports = await prisma.report.findMany({
      where: {
        authorId: userId, // Filter by the database user ID
      },
      include: {
        project: { // Include related project details needed for the card
          select: {
            id: true,
            name: true,
          },
        },
        // Include tags if needed for filtering/display later
        // tags: { select: { id: true, name: true } } 
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

     console.log(`[GET /api/reports] Found ${reports.length} reports for user ${userId}`);
    return NextResponse.json(reports);

  } catch (error) {
    console.error("[GET /api/reports] Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
   console.log('[POST /api/reports] Received request');
  try {
    const userId = await getAuthenticatedDatabaseUserId(req);

    if (!userId) {
      console.warn('[POST /api/reports] Unauthorized access attempt.');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
     console.log(`[POST /api/reports] Authenticated User DB ID: ${userId}`);

    const body = await req.json();
    // Destructure expected fields. Note: 'type' is not in the Report model.
    const { title, description, projectIds } = body; 

     console.log('[POST /api/reports] Request body:', { title, description, projectIds });

    // Validate required fields
    if (!title || !description || !projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
       console.warn('[POST /api/reports] Missing required fields:', { title, description, projectIds });
      return NextResponse.json(
        { error: "Missing required fields: title, description, and at least one projectId are required." },
        { status: 400 }
      );
    }
    
    // --- Handling projectIds ---
    // The Report model expects a single projectId. We'll use the first one from the array.
    // Consider if multiple projects should be handled differently (e.g., multiple reports or linking via a join table if schema changes).
    const projectId = projectIds[0];
     console.log(`[POST /api/reports] Using projectId: ${projectId} (from projectIds array)`);

    // Create the report in the database
    console.log(`[POST /api/reports] Creating report for user ID: ${userId}`);
    const report = await prisma.report.create({
      data: {
        title,
        content: description, // Map description from request body to content field in DB
        status: "DRAFT", // Default status for new reports
        authorId: userId, // Use the authenticated user's database ID
        projectId: projectId, // Use the selected projectId
        // tags: Connect or create tags based on the 'type' field if needed in future
      },
       include: { // Include related project to return in response, matching GET structure
        project: { 
          select: {
            id: true,
            name: true,
          },
        },
       }
    });

     console.log(`[POST /api/reports] Successfully created report with ID: ${report.id}`);
    return NextResponse.json(report);

  } catch (error) {
     console.error("[POST /api/reports] Error creating report:", error);
     // Check for specific Prisma errors if needed (e.g., constraint violations)
     if (error instanceof Error && 'code' in error && error.code === 'P2003') { // Foreign key constraint failed
        console.warn(`[POST /api/reports] Foreign key constraint failed. Check if project ID exists. Error: ${error.message}`);
       return NextResponse.json({ error: "Invalid project ID provided." }, { status: 400 });
     }
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
} 