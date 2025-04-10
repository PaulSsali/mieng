'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Terminal, AlertCircle, BadgeCheck, BadgeX, CalendarClock } from 'lucide-react'; // Added icons
import { format } from 'date-fns'; // For date formatting
import { SubscriptionStatus } from '@prisma/client'; // Import enum for type safety

// Define the subscription amount (in Kobo)
// Example: 5000 NGN = 500000 Kobo
const SUBSCRIPTION_AMOUNT_KOBO = 500000; 
const SUBSCRIPTION_CURRENCY = "NGN"; // Or your currency

// Define a type for the fetched user profile data
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string; // Adjust if using Role enum
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string | null; // Stored as ISO string
}

function BillingContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true); // Loading state for profile fetch
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null); // Error state for profile fetch
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State for profile data

  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'success' | 'failed' | 'error' | null;
    message: string | null;
  }>({ status: null, message: null });

  // --- Fetch User Profile --- 
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.getIdToken) return;

      setProfileLoading(true);
      setProfileError(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user profile');
        }

        const profileData: UserProfile = await response.json();
        setUserProfile(profileData);

      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setProfileError(err.message || "Could not load subscription details.");
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserProfile();
    } else if (!authLoading && !user) {
      // If auth is done loading and there's no user, stop profile loading
      setProfileLoading(false);
    }
    // Dependency array ensures this runs when auth state changes
  }, [user, authLoading]);

  // --- Process Payment Status from URL --- 
  useEffect(() => {
    if (!searchParams) return;
    const status = searchParams.get('payment');
    const errorMessage = searchParams.get('error');
    const internalMessage = searchParams.get('message');
    const reason = searchParams.get('reason'); // From middleware
    const fromSignup = searchParams.get('from') === 'signup'; // Check if coming from signup

    // Clear previous statuses
    setPaymentStatus({ status: null, message: null });
    setError(null); // Clear general errors if navigating here with status params

    if (status === 'success') {
      setPaymentStatus({ status: 'success', message: 'Subscription activated successfully! Your profile is updated.' });
    } else if (status === 'failed') {
      setPaymentStatus({ status: 'failed', message: `Payment failed: ${decodeURIComponent(errorMessage || 'Unknown reason')}` });
    } else if (errorMessage === 'internal_error') {
      setPaymentStatus({ status: 'error', message: `An error occurred during verification: ${decodeURIComponent(internalMessage || 'Please try again')}` });
    } else if (errorMessage === 'missing_reference') {
        setPaymentStatus({ status: 'error', message: 'Payment verification link is invalid or expired.' });
    } else if (errorMessage === 'init_failed') {
        // Specific error message if payment initiation failed right after signup
        setPaymentStatus({ status: 'error', message: `Signup complete, but payment could not be started: ${decodeURIComponent(internalMessage || 'Please try subscribing below.')}` });
    } else if (reason === 'inactive_subscription') {
        setError('Your subscription is inactive. Please subscribe to continue.');
    } else if (reason === 'pending_setup') {
        setError('Your account setup is incomplete. Please subscribe to activate your account.');
    } else if (fromSignup) {
        // Generic message if they land here after signup without other errors
        setError('Signup successful! Please complete your subscription to activate your account.');
    }

    // Optional: Clear query params after reading them
    // router.replace('/billing', { scroll: false });

  }, [searchParams, router]);

  const handleSubscribe = async () => {
    if (!user || !user.getIdToken) {
      setError('You must be logged in to subscribe.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPaymentStatus({ status: null, message: null }); // Clear previous status

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: SUBSCRIPTION_AMOUNT_KOBO }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment.');
      }

      if (data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
        // Alternatively use router.push(data.authorization_url), but window.location might be more reliable for external redirects
      } else {
        throw new Error('Could not retrieve authorization URL.');
      }

    } catch (err: any) {
      console.error('Subscription Error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
    // Note: Loading state ideally stops when redirection happens, 
    // but we set it false in catch block for robustness.
  };

  // --- Loading States --- 
  if (authLoading || profileLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /> Loading Details...</div>;
  }

  // --- Determine Subscription Status --- 
  const isActive = userProfile?.subscriptionStatus === SubscriptionStatus.ACTIVE && 
                   userProfile?.subscriptionEndDate && 
                   new Date(userProfile.subscriptionEndDate) > new Date();
  
  const canSubscribe = !isActive && userProfile?.subscriptionStatus !== SubscriptionStatus.PENDING; // Don't allow subscribe if active or already pending

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Payment Status/Error Messages */} 
          {/* Combine payment status and general errors into one display area for simplicity */} 
          {(paymentStatus.status || error || profileError) && (
             <div className="space-y-2">
                {paymentStatus.status === 'success' && (
                  <Alert variant="default">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Payment Successful!</AlertTitle>
                    <AlertDescription>{paymentStatus.message}</AlertDescription>
                  </Alert>
                )}
                {paymentStatus.status === 'failed' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Payment Failed</AlertTitle>
                    <AlertDescription>{paymentStatus.message}</AlertDescription>
                  </Alert>
                )}
                {paymentStatus.status === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Payment Error</AlertTitle>
                    <AlertDescription>{paymentStatus.message}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Action Required</AlertTitle> {/* Changed Title */} 
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {profileError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Status</AlertTitle>
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}
            </div>
          )}

          {/* --- Updated Subscription Status Display --- */} 
          {!userProfile && !profileLoading && (
             <p className="text-gray-500">Could not load subscription status. Please login again.</p>
          )}

          {userProfile && (
            <div className="space-y-2 p-4 border rounded-md">
               <h3 className="text-lg font-semibold mb-2">Current Status</h3>
               {isActive ? (
                 <div className="flex items-center space-x-2">
                   <BadgeCheck className="h-5 w-5 text-green-600" />
                   <span className="font-medium text-green-700">Active</span>
                 </div>
               ) : userProfile.subscriptionStatus === SubscriptionStatus.PENDING ? (
                 <div className="flex items-center space-x-2">
                   <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                   <span className="font-medium text-blue-700">Pending Confirmation</span>
                 </div>
               ) : (
                 <div className="flex items-center space-x-2">
                   <BadgeX className="h-5 w-5 text-red-600" />
                   <span className="font-medium text-red-700">Inactive</span> 
                   {/* Optional: Distinguish between INACTIVE and CANCELLED if needed */}
                   {/* {userProfile.subscriptionStatus === SubscriptionStatus.CANCELLED && <span>(Cancelled)</span>} */} 
                 </div>
               )}

               {userProfile.subscriptionEndDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                     <CalendarClock className="h-4 w-4" />
                     <span>
                      {isActive ? 'Renews on:' : 'Expired on:'}{' '}
                      {format(new Date(userProfile.subscriptionEndDate), 'PPP')} {/* Format: Jan 1, 2024 */}
                     </span>
                  </div>
               )}
            </div>
          )}

          {/* Plan Details (remains the same for now) */} 
          <div className="space-y-1 p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
            <p>Plan: Premium Monthly</p>
            <p>Price: {SUBSCRIPTION_CURRENCY} {SUBSCRIPTION_AMOUNT_KOBO / 100} / month</p>
          </div>

        </CardContent>
        <CardFooter>
          {/* Show subscribe button only if user profile loaded and status allows subscribing */} 
          {canSubscribe && userProfile && (
             <Button 
              onClick={handleSubscribe} 
              disabled={isLoading || authLoading || profileLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </Button>
          )}
           {/* TODO: Add button to manage subscription if active */} 
           {isActive && (
              <Button variant="outline" className="w-full" disabled>Manage Subscription (Coming Soon)</Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Wrap the component that uses useSearchParams with Suspense
export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /> Loading Billing...</div>}>
      <BillingContent />
    </Suspense>
  );
} 