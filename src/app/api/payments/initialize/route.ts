import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/paystack';
import { getAuth as getFirebaseAuthAdmin } from '@/lib/firebase-admin'; // Use Firebase Admin
import prisma from '@/lib/db/client'; // Import Prisma client

// Define expected request body structure (adjust as needed)
interface InitializePaymentRequestBody {
  amount: number; // Amount in kobo
  // Add planId or other identifiers if necessary
}

export async function POST(req: NextRequest) {
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
      // This shouldn't happen if email is required for your users
      console.error('Email not found in Firebase token for UID:', decodedToken.uid);
      return NextResponse.json({ message: 'Email missing from token' }, { status: 400 });
    }

    // 2. Find User in DB by Email
    const user = await prisma.user.findUnique({
      where: { email: firebaseUserEmail },
    });

    if (!user) {
      // Handle case where Firebase user exists but no corresponding DB user
      // Maybe create user here or throw error depending on your flow
      console.error('User not found in database for email:', firebaseUserEmail);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { id: userId, email } = user; // Use DB user ID and email

    // 3. Parse Request Body
    const body = await req.json() as InitializePaymentRequestBody;
    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'Invalid amount specified' }, { status: 400 });
    }

    // --- TODO: Add validation - check if user already has an active subscription? ---
    // Example check (add this logic if needed):
    // if (user.subscriptionStatus === 'ACTIVE' && user.subscriptionEndDate && user.subscriptionEndDate > new Date()) {
    //   return NextResponse.json({ message: 'User already has an active subscription' }, { status: 400 });
    // }

    // 4. Call Paystack Initialization Service
    const authorization_url = await initializePayment({
      email, // Use email from DB user
      amount,
      userId, // Use DB user ID
      metadata: { 
          firebase_uid: decodedToken.uid // Optionally store Firebase UID
        // plan_id: body.planId, 
      }
    });

    // 5. Return Paystack Authorization URL
    return NextResponse.json({ authorization_url });

  } catch (error: any) {
    console.error('[API /payments/initialize] Error:', error);
    // Use a more specific error handler if available
    return NextResponse.json(
      { message: `Internal Server Error: ${error.message || 'Unknown error'}` }, 
      { status: 500 }
    );
  }
} 