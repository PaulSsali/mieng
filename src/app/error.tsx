'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console during development
    console.error('Global error caught:', error);
    
    // Report the error to monitoring service if available
    if (process.env.NODE_ENV === 'production') {
      // Send error to Sentry
      Sentry.captureException(error);
      
      // Also log to console in production
      console.error('Production error:', error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-5">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => reset()}
                variant="default" 
                className="w-full"
              >
                Try again
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-200 overflow-auto max-h-80">
                <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
} 