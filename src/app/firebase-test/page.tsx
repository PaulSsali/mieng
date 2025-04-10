'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function FirebaseTestPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking Firebase Auth status...');
  const [configDetails, setConfigDetails] = useState<string[]>([]);
  
  useEffect(() => {
    // Check Firebase auth status
    if (auth) {
      setAuthStatus('Firebase Auth is properly initialized!');
      
      // Collect configuration details
      const details = [
        `API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set'}`,
        `Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set'}`,
        `Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set'}`,
        `Storage Bucket: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Not set'}`,
        `Messaging Sender ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Not set'}`,
        `App ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Not set'}`,
        `Local Auth Mode: ${process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true' ? 'Enabled' : 'Disabled'}`
      ];
      setConfigDetails(details);
    } else {
      setAuthStatus('Firebase Auth is NOT properly initialized. Check configuration.');
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border">
        <h1 className="text-2xl font-bold mb-4 text-center">Firebase Authentication Status</h1>
        
        <div className={`p-4 rounded-md mb-6 ${authStatus.includes('NOT') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <p className="font-semibold">{authStatus}</p>
        </div>
        
        {configDetails.length > 0 && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Configuration Details:</h2>
            <ul className="space-y-2">
              {configDetails.map((detail, index) => (
                <li key={index} className="flex items-center">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 