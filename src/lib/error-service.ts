// Error logging service for centralized error tracking and reporting
import * as Sentry from '@sentry/nextjs';

// Type for different error severities
export type ErrorSeverity = 'error' | 'warning' | 'info';

// Interface for error context
export interface ErrorContext {
  user?: string;
  component?: string;
  action?: string;
  url?: string;
  [key: string]: any; // Additional context data
}

// Log error to console with additional context
export function logError(
  error: Error | string,
  severity: ErrorSeverity = 'error',
  context: ErrorContext = {}
) {
  // Extract error message if it's an Error object
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Create structured log object
  const logData = {
    timestamp: new Date().toISOString(),
    severity,
    message: errorMessage,
    stack: errorStack,
    ...context,
    environment: process.env.NODE_ENV || 'development',
  };
  
  // Log to console based on severity
  switch (severity) {
    case 'error':
      console.error('Application Error:', logData);
      break;
    case 'warning':
      console.warn('Application Warning:', logData);
      break;
    case 'info':
      console.info('Application Info:', logData);
      break;
    default:
      console.log('Application Log:', logData);
  }
  
  // In production, send to external service
  if (process.env.NODE_ENV === 'production') {
    sendToExternalService(error, context);
  }
}

// Send error to external service (Sentry)
function sendToExternalService(error: Error | string, context: ErrorContext = {}) {
  try {
    // Add extra context to Sentry
    if (Object.keys(context).length > 0) {
      // Add context as tags and extras
      Object.entries(context).forEach(([key, value]) => {
        Sentry.setTag(key, String(value));
        Sentry.setExtra(key, value);
      });
    }
    
    // Log user information if available
    if (context.user) {
      Sentry.setUser({ id: context.user });
    }

    // Capture the exception
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error);
    }
  } catch (e) {
    // Fallback if Sentry throws an error
    console.error('Error while reporting to Sentry:', e);
  }
}

// Utility function to create a user-friendly error message
export function getFriendlyErrorMessage(error: any): string {
  // Network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  // Authentication errors
  if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
    return 'Invalid email or password. Please try again.';
  }
  
  // Permission errors
  if (error.code === 'permission-denied' || error.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  // Not found errors
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  
  // Server errors
  if (error.status >= 500) {
    return 'Our server is experiencing issues. Please try again later.';
  }
  
  // Default message for other errors
  return error.message || 'An unexpected error occurred. Please try again.';
}

// Function to safely handle async operations with error tracking
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  context: ErrorContext = {}
): Promise<[T | null, Error | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    logError(typedError, 'error', context);
    return [null, typedError];
  }
} 