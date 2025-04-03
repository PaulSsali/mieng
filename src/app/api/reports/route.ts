import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

// This is a simplified auth check for development purposes
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    // For now, check the session cookie or header
    // This is a placeholder - in real app, you'd validate against your auth system
    
    // For development, we'll use a hard-coded ID
    // In production, replace this with proper session handling
    return 'default-user-id';
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

// Mock reports with more complete data for the reports page
const MOCK_REPORTS = [
  {
    id: "1",
    title: "Annual Engineering Report 2024",
    description: "Comprehensive summary of engineering work completed in 2024",
    type: "Engineering",
    status: "Draft",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    projects: [
      { id: "1", name: "Bridge Construction Project" },
      { id: "3", name: "Power Grid Optimization" }
    ]
  },
  {
    id: "2",
    title: "Project Management Overview Q1",
    description: "Analysis of project management methodologies applied in Q1",
    type: "Progress",
    status: "Published",
    createdAt: "2024-02-02T14:20:00Z",
    updatedAt: "2024-02-10T09:15:00Z",
    projects: [
      { id: "2", name: "Industrial Plant Upgrade" },
      { id: "4", name: "Building Safety Assessment" }
    ]
  },
  {
    id: "3",
    title: "Environmental Impact Study",
    description: "Detailed analysis of environmental impacts across all projects",
    type: "Environmental",
    status: "Draft",
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
    projects: [
      { id: "5", name: "Environmental Impact Assessment" }
    ]
  }
];

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // In a real implementation, fetch reports from the database
    // For now, we'll use mock data
    // const reports = await prisma.report.findMany({
    //   where: {
    //     userId: userId,
    //   },
    //   include: {
    //     projects: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     updatedAt: 'desc',
    //   },
    // });
    
    // Using mock data for now
    return NextResponse.json(MOCK_REPORTS);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { title, description, type, projectIds } = body;
    
    if (!title || !type || !projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // In a real implementation, create a report in the database
    // For now, we'll return a mock response
    // const report = await prisma.report.create({
    //   data: {
    //     title,
    //     description,
    //     type,
    //     status: "Draft",
    //     userId: userId,
    //     projects: {
    //       connect: projectIds.map((id) => ({ id })),
    //     },
    //   },
    // });
    
    // Mock response
    const newReport = {
      id: Date.now().toString(),
      title,
      description,
      type,
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projects: projectIds.map(id => ({ id, name: `Project ${id}` }))
    };
    
    return NextResponse.json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
} 