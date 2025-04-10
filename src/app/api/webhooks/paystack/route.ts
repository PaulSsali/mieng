import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db/client';
import { addDays } from 'date-fns';
// Using string literals due to persistent type issues
// import { SubscriptionStatus } from '@prisma/client'; 

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Helper function to safely parse JSON
async function safeJsonParse(text: string): Promise<any | null> {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Webhook JSON parse error:', e);
    return null;
  }
}


export async function POST(req: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    console.error('Webhook Error: PAYSTACK_SECRET_KEY is not set.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  // 1. Verify Paystack Signature
  const signature = req.headers.get('x-paystack-signature');
  // Read the raw body text for signature verification
  const rawBody = await req.text(); 

  if (!signature) {
    console.warn('Webhook Error: Missing x-paystack-signature header.');
    return NextResponse.json({ message: 'Missing signature.' }, { status: 400 });
  }

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Webhook Error: Invalid signature.');
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 400 });
  }

  // 2. Parse the event payload
  const event = await safeJsonParse(rawBody);

  if (!event || !event.event) {
    console.warn('Webhook Error: Invalid or missing event payload.');
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });
  }

  console.log(`Webhook Received - Event: ${event.event}`);

  // 3. Handle the specific event
  try {
    const eventData = event.data;
    let userEmail = eventData?.customer?.email;
    let paystackCustomerId = eventData?.customer?.customer_code;

    // For some events, customer info might be nested differently
    if (!userEmail && eventData?.email) {
        userEmail = eventData.email;
    }
     if (!paystackCustomerId && eventData?.customer_code) {
        paystackCustomerId = eventData.customer_code;
    }

    if (!userEmail) {
        console.warn(`Webhook Warning: Could not extract user email for event ${event.event}. Data:`, eventData);
        // Depending on the event, this might be okay, or it might be an error
        // return NextResponse.json({ message: 'Could not identify user from event.' }, { status: 400 });
    }

    switch (event.event) {
      case 'charge.success':
        // Check if it's a successful charge and amount is correct (optional)
        // const amountPaid = eventData.amount; // Amount is in kobo
        // if (amountPaid < REQUIRED_AMOUNT_KOBO) { ... }

        if (userEmail) {
            console.log(`Processing charge.success for ${userEmail}`);
            const subscriptionEndDate = addDays(new Date(), 30); // Assuming 30 days access

            // Use upsert: Create user if not exist (e.g., paid via invoice link), or update if exists
             await prisma.user.upsert({
                where: { email: userEmail },
                update: {
                    subscriptionStatus: 'ACTIVE', // Use string literal
                    subscriptionEndDate: subscriptionEndDate,
                    paystackCustomerId: paystackCustomerId ?? undefined,
                    updatedAt: new Date(),
                },
                create: {
                    email: userEmail,
                    name: eventData?.customer?.first_name || userEmail.split('@')[0],
                    role: 'ENGINEER', // Default role
                    subscriptionStatus: 'ACTIVE', // Use string literal
                    subscriptionEndDate: subscriptionEndDate,
                    paystackCustomerId: paystackCustomerId,
                },
            });
            console.log(`User subscription status updated/created for ${userEmail} via charge.success`);
        } else {
             console.warn(`Webhook Warning: charge.success event received without user email. Ref: ${eventData?.reference}`);
        }
        break;

      case 'subscription.disable':
      case 'subscription.not_renew':
      case 'invoice.payment_failed': // Handle failed recurring payments
        // These events indicate the subscription should become inactive
        if (userEmail || paystackCustomerId) {
          console.log(`Processing ${event.event} for user identified by:`, { userEmail, paystackCustomerId });

          // Find user by email if available, otherwise use paystackCustomerId with findFirst
          let user;
          if (userEmail) {
             user = await prisma.user.findUnique({ where: { email: userEmail } });
          } else if (paystackCustomerId) {
             // Use findFirst when identifying by paystackCustomerId
             user = await prisma.user.findFirst({ where: { paystackCustomerId: paystackCustomerId } });
          }

          if (user) {
            // Check if already inactive to avoid unnecessary updates
            if (user.subscriptionStatus !== 'INACTIVE') { 
                 await prisma.user.update({
                  where: { id: user.id }, // Always update using the primary ID
                  data: {
                    subscriptionStatus: 'INACTIVE', // Use string literal
                    updatedAt: new Date(),
                  },
                });
                console.log(`User subscription status set to INACTIVE for user ID: ${user.id}`);
            } else {
                 console.log(`User ${user.id} already INACTIVE, no update needed.`);
            }
          } else {
             console.warn(`Webhook Warning: User not found for ${event.event} event. Identifier:`, { userEmail, paystackCustomerId });
          }
        } else {
            console.warn(`Webhook Warning: ${event.event} received without user email or customer code.`);
        }
        break;

      // Add other cases as needed (e.g., subscription.create, subscription.cancel)
      // case 'subscription.create':
      //   // Handle initial subscription creation if using Paystack's subscription objects
      //   break;

      default:
        console.log(`Webhook Info: Received unhandled event type: ${event.event}`);
    }

    // 4. Acknowledge receipt to Paystack
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error(`Webhook Error processing event ${event.event}:`, error);
    // Don't send detailed errors back to Paystack, but log them
    return NextResponse.json({ message: 'Webhook processing error.' }, { status: 500 });
  }
} 