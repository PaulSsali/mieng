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
      return null;
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

    return user?.id || null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const referees = await prisma.referee.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    
    return NextResponse.json(referees);
  } catch (error) {
    console.error("Error fetching referees:", error);
    return NextResponse.json({ error: "Failed to fetch referees" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.title || !data.company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const referee = await prisma.referee.create({
      data: {
        name: data.name,
        title: data.title,
        company: data.company,
        email: data.email,
        phone: data.phone || null,
        userId: userId
      }
    });
    
    return NextResponse.json(referee, { status: 201 });
  } catch (error) {
    console.error("Error creating referee:", error);
    return NextResponse.json({ error: "Failed to create referee" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.id || !data.name || !data.email || !data.title || !data.company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if the referee exists and belongs to the user
    const existingReferee = await prisma.referee.findFirst({
      where: {
        id: data.id,
        userId: userId
      }
    });
    
    if (!existingReferee) {
      return NextResponse.json({ error: "Referee not found" }, { status: 404 });
    }
    
    const referee = await prisma.referee.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        title: data.title,
        company: data.company,
        email: data.email,
        phone: data.phone || null
      }
    });
    
    return NextResponse.json(referee);
  } catch (error) {
    console.error("Error updating referee:", error);
    return NextResponse.json({ error: "Failed to update referee" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Missing referee ID" }, { status: 400 });
    }
    
    // Check if the referee exists and belongs to the user
    const existingReferee = await prisma.referee.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });
    
    if (!existingReferee) {
      return NextResponse.json({ error: "Referee not found" }, { status: 404 });
    }
    
    await prisma.referee.delete({
      where: {
        id: id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting referee:", error);
    return NextResponse.json({ error: "Failed to delete referee" }, { status: 500 });
  }
} 