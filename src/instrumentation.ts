// instrumentation.ts
// This file is required for Next.js instrumentation
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { init as sentryInit } from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    sentryInit({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Client-only settings (will be ignored in server context)
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
      
      // Session replay is auto-configured by Sentry in newer versions
      // No need to manually configure Replay integration
    });
    
    console.log('Sentry initialized via instrumentation hook');
  } else {
    console.warn('Sentry DSN not found. Skipping Sentry initialization.');
  }
} 