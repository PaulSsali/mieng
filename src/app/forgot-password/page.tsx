"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="py-4 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Ed60 Logo" 
              width={100} 
              height={100}
              className="rounded-sm" 
            />
          </Link>
          
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-primary transition-all duration-300 px-4 py-2 hover:scale-105"
          >
            Back to login
          </Link>
        </div>
      </header>

      {/* Form Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4 md:px-6">
          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
            {isSubmitted ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-gray-500 mb-6">
                  We've sent password reset instructions to {email}
                </p>
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
                  <p className="text-gray-500 text-sm md:text-base">
                    Enter your email and we'll send you instructions to reset your password
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary text-white w-full px-6 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : "Send Reset Instructions"}
                    </button>

                    <div className="text-center">
                      <Link
                        href="/login"
                        className="text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 