import Paystack from 'paystack';
import prisma from './db/client'; // Corrected import path
import { User, SubscriptionStatus } from '@prisma/client'; // Added SubscriptionStatus import
import { randomBytes } from 'crypto'; // Import crypto for generating reference
import { addDays } from 'date-fns'; // Import date-fns for date calculation

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

if (!paystackSecretKey) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
}

const paystack = Paystack(paystackSecretKey);

interface InitializePaymentArgs {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  userId: string; // Include user ID for linking later if needed
  metadata?: Record<string, any>; // Optional metadata
  callbackUrl?: string; // Optional override for redirect URL
}

/**
 * Generates a unique transaction reference.
 */
const generateReference = (): string => {
  return `mieng_${randomBytes(12).toString('hex')}`;
};

/**
 * Initializes a Paystack transaction.
 * @param args - Payment arguments including email, amount (in kobo), and userId.
 * @returns The authorization URL for the Paystack checkout page.
 * @throws Error if Paystack API call fails.
 */
export const initializePayment = async ({
  email,
  amount,
  userId,
  metadata = {},
  callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-payment` // Default callback URL
}: InitializePaymentArgs): Promise<string> => {
  try {
    const reference = generateReference(); // Generate a unique reference

    const response = await paystack.transaction.initialize({
      email,
      amount,
      reference, // Add the unique reference
      name: email, // Add name field using email, as required by types
      metadata: {
        user_id: userId,
        custom_fields: [
          { display_name: "User ID", variable_name: "user_id", value: userId }
        ],
        ...metadata,
      },
      callback_url: callbackUrl,
    });

    if (!response.status || !response.data?.authorization_url) {
      console.error('Paystack initialization failed:', response.message);
      throw new Error(response.message || 'Failed to initialize Paystack transaction.');
    }

    console.log('Paystack initialization successful:', response.data);
    return response.data.authorization_url;

  } catch (error: any) {
    console.error('Error initializing Paystack payment:', error);
    // Consider more specific error handling based on Paystack error types
    throw new Error(`Failed to initialize payment: ${error.message || error}`);
  }
};

interface VerifyPaymentArgs {
  reference: string;
}

interface VerifyPaymentResult {
  success: boolean;
  message: string;
  user?: User | null;
}

/**
 * Verifies a Paystack transaction and updates user subscription.
 * @param reference - The Paystack transaction reference.
 * @returns Object indicating success status and optional updated user.
 * @throws Error if verification fails or user not found.
 */
export const verifyPayment = async ({
  reference,
}: VerifyPaymentArgs): Promise<VerifyPaymentResult> => {
  try {
    const paystackResponse = await paystack.transaction.verify(reference);

    console.log('Paystack verification response:', paystackResponse);

    if (!paystackResponse.status || paystackResponse.data?.status !== 'success') {
      return {
        success: false,
        message: paystackResponse.message || 'Payment verification failed or payment not successful.',
      };
    }

    const transactionData = paystackResponse.data;
    const customerData = transactionData.customer;
    const metadata = transactionData.metadata as { user_id?: string, firebase_uid?: string, [key: string]: any }; // Type assertion for metadata

    // --- IMPORTANT: Extract User Info from Paystack data --- 
    // We need the email from Paystack customer data to potentially create the user
    // And the firebase_uid from metadata if we stored it during initialization
    const userEmail = customerData?.email;
    const firebaseUid = metadata?.firebase_uid;
    const paystackCustomerId = customerData?.customer_code;

    if (!userEmail) {
      console.error('Email not found in Paystack customer data for reference:', reference);
      // This is critical, we can't link or create the user without email
      throw new Error('Customer email missing from Paystack transaction data.');
    }

    // Calculate subscription end date (e.g., 30 days from now)
    const subscriptionEndDate = addDays(new Date(), 30); 

    // --- Check if User Exists, Create or Update --- 
    let userInDb = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { // Explicitly select fields needed, including paystackCustomerId
          id: true, 
          email: true,
          paystackCustomerId: true, 
          // Add other fields if needed for the update logic
      }
    });

    let finalUser: User | null = null; // Initialize finalUser to null

    if (!userInDb) {
      // User does not exist - Create them now
      console.log(`User with email ${userEmail} not found. Creating user.`);
      try {
        finalUser = await prisma.user.create({
          data: {
            email: userEmail,
            name: metadata?.custom_fields?.find((f: any) => f.variable_name === 'name')?.[0]?.value || userEmail.split('@')[0],
            role: 'ENGINEER', // Set initial role (use string value if enum type is problematic)
            subscriptionStatus: 'ACTIVE', // Use string value 'ACTIVE'
            subscriptionEndDate: subscriptionEndDate,
            paystackCustomerId: paystackCustomerId,
          },
        });
        console.log(`User created successfully for email: ${userEmail}, ID: ${finalUser.id}`);
      } catch (createError: any) {
         console.error(`Error creating user with email ${userEmail}:`, createError);
         // If creation fails (e.g., duplicate email race condition?), try fetching again just in case
         userInDb = await prisma.user.findUnique({ 
             where: { email: userEmail },
             select: { id: true, email: true, paystackCustomerId: true } // Select again
         });
         if (!userInDb) {
            throw new Error(`Failed to create or find user in DB after payment: ${createError.message}`);
         }
         // If found, proceed to update logic below
         console.log('User found after initial creation error, proceeding with update.');
      }
    }
    
    // If user existed initially OR was found after a creation error, update them
    // Check if finalUser was already set by the create block
    if (!finalUser && userInDb) { 
      console.log(`User with email ${userEmail} found (ID: ${userInDb.id}). Updating subscription.`);
      finalUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          subscriptionStatus: 'ACTIVE', // Use string value 'ACTIVE'
          subscriptionEndDate: subscriptionEndDate,
          paystackCustomerId: paystackCustomerId ?? userInDb.paystackCustomerId, // Now userInDb should have this field
          updatedAt: new Date(),
        },
      });
      console.log(`User subscription updated successfully for email: ${userEmail}`);
    }

    // If finalUser is still null here, something went wrong
    if (!finalUser) {
        console.error('Failed to create or update user during payment verification for email:', userEmail);
        throw new Error('User record could not be created or updated after successful payment.');
    }

    return {
      success: true,
      message: 'Payment successful and subscription activated.',
      user: finalUser, // Return the created or updated user
    };

  } catch (error: any) {
    console.error('Error verifying Paystack payment:', error);
    return {
      success: false,
      message: `Failed to verify payment: ${error.message || error}`,
    };
  }
};

// --- webhook handler logic will be added later --- 