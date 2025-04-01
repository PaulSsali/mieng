import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <h2 className="text-3xl font-bold">Not Found</h2>
      <p className="mt-4 text-gray-600">Could not find the requested resource</p>
      <Link href="/" className="mt-6 text-blue-600 hover:text-blue-800">
        Return Home
      </Link>
    </div>
  )
} 