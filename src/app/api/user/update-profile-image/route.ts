import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

const prisma = new PrismaClient();

/**
 * API route to update a user's profile image
 * This keeps Prisma schema updates separate from the frontend code
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
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { error: 'No email found in token' },
        { status: 400 }
      );
    }
    
    // Parse the request body
    const { profileImage } = await request.json();
    
    if (!profileImage) {
      return NextResponse.json(
        { error: 'profileImage is required' },
        { status: 400 }
      );
    }
    
    // Find the user by email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    let result;
    
    if (existingUser) {
      // Update the existing user's profile image
      result = await prisma.user.update({
        where: { email },
        data: { 
          profileImage,
          updatedAt: new Date()
        }
      });
    } else {
      // Create a new user with the profile image
      result = await prisma.user.create({
        data: {
          email,
          profileImage,
          role: 'ENGINEER',
        }
      });
    }
    
    return NextResponse.json(
      { success: true, user: { email, profileImage } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json(
      { error: 'Failed to update profile image' },
      { status: 500 }
    );
  }
} 