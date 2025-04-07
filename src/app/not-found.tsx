import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logError } from '@/lib/error-service'

export default function NotFound() {
  // Log the 404 error for tracking
  logError('404 - Page not found', 'info', {
    url: typeof window !== 'undefined' ? window.location.href : '',
    component: 'NotFoundPage',
  })

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <span className="font-mono text-5xl font-bold text-gray-400">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <Button asChild className="min-w-40">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="min-w-40"
          >
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          
          <div className="mt-6 text-gray-500 text-sm">
            <p>If you believe this is an error, please <Link href="/contact" className="text-blue-600 hover:underline">contact support</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 