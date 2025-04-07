import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

const prisma = new PrismaClient();

// GET endpoint to retrieve a user's profile
export async function GET(request: NextRequest) {
  try {
    // Get the Firebase ID token from the Authorization header
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json({ error: 'No email found in token' }, { status: 400 });
    }

    // Find user by email
    const userProfile = await prisma.user.findUnique({
      where: { email }
    });

    // If user doesn't exist in our database but exists in Firebase Auth
    if (!userProfile) {
      // Get the user from Firebase Auth
      const firebaseUser = await getAuth().getUserByEmail(email);

      return NextResponse.json({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        profileImage: firebaseUser.photoURL
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST endpoint to update a user's profile
export async function POST(request: NextRequest) {
  try {
    // Get the Firebase ID token from the Authorization header
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json({ error: 'No email found in token' }, { status: 400 });
    }

    // Parse the request body
    const data = await request.json();

    // Find user by email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    let result;
    
    if (existingUser) {
      // Update existing user
      result = await prisma.user.update({
        where: { email },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new user with provided data
      result = await prisma.user.create({
        data: {
          email,
          name: data.name || '',
          role: 'ENGINEER',
          ...data
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 