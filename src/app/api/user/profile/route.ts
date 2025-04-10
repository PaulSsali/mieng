import { NextRequest, NextResponse } from 'next/server';
import { getAuth as getFirebaseAuthAdmin } from '@/lib/firebase-admin';
import prisma from '@/lib/db/client';
import { SubscriptionStatus } from '@prisma/client'; // Import enum

// GET endpoint to retrieve a user's profile
export async function GET(req: NextRequest) {
  try {
    // 1. Verify Firebase Auth Token
    const authorization = req.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }

    let decodedToken;
    try {
      const firebaseAuth = getFirebaseAuthAdmin();
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const firebaseUserEmail = decodedToken.email;
    if (!firebaseUserEmail) {
      return NextResponse.json({ message: 'Email missing from token' }, { status: 400 });
    }

    // 2. Find User in DB by Email
    const user = await prisma.user.findUnique({
      where: { email: firebaseUserEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
        // Select other fields you might need on the profile/settings page
      },
    });

    if (!user) {
      console.error('User not found in database for email:', firebaseUserEmail);
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // 3. Return User Profile Data
    return NextResponse.json(user);

  } catch (error: any) {
    console.error('[API /user/profile] Error:', error);
    return NextResponse.json(
      { message: `Internal Server Error: ${error.message || 'Unknown error'}` }, 
      { status: 500 }
    );
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
    const decodedToken = await getFirebaseAuthAdmin().verifyIdToken(idToken);
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