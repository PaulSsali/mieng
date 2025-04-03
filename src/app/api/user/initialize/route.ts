import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

const prisma = new PrismaClient();

/**
 * API route to initialize a new user's data after registration
 * Creates default user record, empty data structures, and default settings
 */
export async function POST(request: NextRequest) {
  try {
    // Get the Firebase ID token from the Authorization header
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email;
    const displayName = decodedToken.name;
    const photoURL = decodedToken.picture;

    if (!email) {
      return NextResponse.json(
        { error: 'No email found in token' },
        { status: 400 }
      );
    }
    
    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    // If user already exists, return success without duplicating data
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already initialized',
        userId: existingUser.id,
        isNew: false
      });
    }
    
    // Parse the request body for any additional registration data
    const { discipline, experience, hasMentor, hoursPerWeek, completionTimeline } = await request.json();
    
    // Create new user with default values
    const newUser = await prisma.user.create({
      data: {
        email,
        name: displayName || email.split('@')[0],
        profileImage: photoURL || undefined,
        role: 'ENGINEER',
        // Include any additional profile data from signup process
        ...(discipline && { discipline }),
        ...(experience && { experience }),
        ...(hasMentor !== undefined && { hasMentor }),
        ...(hoursPerWeek && { hoursPerWeek }),
        ...(completionTimeline && { completionTimeline })
      }
    });
    
    // Create a default welcome project to demonstrate functionality
    const welcomeProject = await prisma.project.create({
      data: {
        name: "Welcome to eMate",
        description: "This is a sample project to help you get started. You can edit or delete it anytime.",
        startDate: new Date(),
        endDate: null,
        status: "PLANNING",
        discipline: discipline || "General Engineering",
        role: "Engineer",
        company: "My Company",
        user: {
          connect: { id: newUser.id }
        },
        // Create a default organization for the user
        organization: {
          create: {
            name: "My Organization",
            description: "My default organization",
            users: {
              connect: { id: newUser.id }
            }
          }
        }
      }
    });
    
    // Create a sample referee entry
    const sampleReferee = await prisma.referee.create({
      data: {
        name: "Sample Referee",
        title: "Senior Engineer",
        company: "Engineering Company Ltd",
        email: "referee@example.com",
        phone: "+27 123 456 7890",
        user: {
          connect: { id: newUser.id }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'User initialized successfully',
      userId: newUser.id,
      isNew: true
    });
    
  } catch (error) {
    console.error('Error initializing user:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user' },
      { status: 500 }
    );
  }
} 