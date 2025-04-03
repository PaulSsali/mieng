'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#48bb78',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#f56565',
            color: '#fff',
          },
        },
      }}
    />
  );
} 