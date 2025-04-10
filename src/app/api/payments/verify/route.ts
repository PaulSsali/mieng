import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import { URL } from 'url'; // Import URL for parsing query parameters

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const reference = requestUrl.searchParams.get('reference');

  if (!reference) {
    console.error('[API /payments/verify] Error: Missing payment reference');
    // Redirect to a generic error or billing page
    const redirectUrl = new URL('/billing?error=missing_reference', requestUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    // 1. Verify the payment using the reference
    const result = await verifyPayment({ reference });

    let redirectPath: string;
    if (result.success) {
      // Payment successful, redirect to dashboard or success page
      console.log(`[API /payments/verify] Payment successful for reference: ${reference}`);
      redirectPath = '/dashboard?payment=success'; // Or a dedicated success page
    } else {
      // Payment failed or not successful
      console.warn(`[API /payments/verify] Payment verification failed for reference: ${reference}. Reason: ${result.message}`);
      // Encode the error message for the query parameter
      const encodedMessage = encodeURIComponent(result.message || 'Payment failed');
      redirectPath = `/billing?payment=failed&error=${encodedMessage}`;
    }

    // 2. Redirect user
    const redirectUrl = new URL(redirectPath, requestUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());

  } catch (error: any) {
    console.error('[API /payments/verify] Internal Server Error:', error);
    // Redirect to a generic error page on internal errors
    const encodedMessage = encodeURIComponent(error.message || 'Verification process failed');
    const redirectUrl = new URL(`/billing?error=internal_error&message=${encodedMessage}`, requestUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }
} 