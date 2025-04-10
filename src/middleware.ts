import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth as getFirebaseAuthAdmin } from '@/lib/firebase-admin';
import prisma from '@/lib/db/client';
// We have to use string literal 'ACTIVE' due to persistent type issues
// import { SubscriptionStatus } from '@prisma/client'; 

// Define paths that require authentication AND an active subscription
const protectedPaths = [
  '/dashboard', 
  '/projects', 
  '/reports', 
  // Add other protected routes...
  // You can also use wildcards like '/api/secure/*'
];

// Define paths that only require authentication (e.g., billing page itself)
const authenticatedPaths = [
    '/billing',
    '/api/user/profile',
    '/api/payments/initialize'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the path requires protection
  const requiresProtection = protectedPaths.some(path => pathname.startsWith(path));
  const requiresAuthOnly = authenticatedPaths.some(path => pathname.startsWith(path));

  // If the path doesn't require any authentication, proceed
  if (!requiresProtection && !requiresAuthOnly) {
    return NextResponse.next();
  }

  // 1. Get Firebase ID token (adjust based on how client sends it)
  //    Commonly from Authorization header or a cookie
  const authorization = request.headers.get('Authorization');
  const idToken = authorization?.startsWith('Bearer ') ? authorization.split('Bearer ')[1] : null;
  // TODO: Add logic to check for token in cookies if applicable

  if (!idToken) {
    console.log('Middleware: No token found, redirecting to login.');
    // Redirect to login page, preserving the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 2. Verify Firebase token
    const firebaseAuth = getFirebaseAuthAdmin();
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      throw new Error('Email missing from verified token.');
    }

    // If route only requires authentication, verification is enough
    if (requiresAuthOnly && !requiresProtection) {
       console.log(`Middleware: Auth successful for ${userEmail} on ${pathname}`);
       return NextResponse.next(); // Allow access
    }

    // --- Path requires active subscription --- 
    
    // 3. Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
      },
    });

    // 4. Check subscription status
    const isActive = user && 
                     user.subscriptionStatus === 'ACTIVE' && // Use string literal
                     user.subscriptionEndDate && 
                     new Date(user.subscriptionEndDate) > new Date();

    if (isActive) {
      // User is authenticated and has an active subscription
      console.log(`Middleware: Subscription ACTIVE for ${userEmail} on ${pathname}`);
      return NextResponse.next(); // Allow access
    } else {
      // User is authenticated but no active subscription OR not in DB yet
      console.log(`Middleware: Subscription INACTIVE or user not fully setup for ${userEmail} on ${pathname}. Redirecting to billing.`);
      const billingUrl = new URL('/billing', request.url);
      // Add a flag indicating why they were redirected
      billingUrl.searchParams.set('reason', user ? 'inactive_subscription' : 'pending_setup');
      return NextResponse.redirect(billingUrl);
    }

  } catch (error: any) {
    // Token verification failed or other error
    console.error('Middleware Error:', error.message);
    // Redirect to login on any auth error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_failed');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply middleware to all protected paths and auth-only paths
    ...protectedPaths,
    ...authenticatedPaths,
    // Ensure API routes needed for login/signup are NOT matched here if they don't require auth
    // Example: '/api/auth/.*', '/api/webhooks/.*', etc. should likely be excluded unless handled
    
    // Exclude static files and Next.js internals
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 