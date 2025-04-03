"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Info } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loginWithGoogle, loading, error, clearError, authInitialized, firebaseAvailable, isLocalMode } = useAuth();
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Detect development environment
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  // Clear any existing errors when the component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Clear validation errors when inputs change
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [email, password, formSubmitted]);

  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // This effect will run only on the client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  // Helper function to get error message details
  const getErrorDescription = (errorMsg: string) => {
    if (errorMsg.includes("user not found") || errorMsg.includes("User not found")) {
      return "The email you entered is not registered. Please check your email or sign up for a new account.";
    }
    if (errorMsg.includes("invalid email") || errorMsg.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }
    if (errorMsg.includes("wrong password") || errorMsg.includes("Incorrect password") || errorMsg.includes("invalid credential") || errorMsg.includes("Invalid email or password")) {
      return "The password you entered is incorrect. Please try again or reset your password.";
    }
    if (errorMsg.includes("too many requests") || errorMsg.includes("Too many unsuccessful")) {
      return "Your account has been temporarily locked due to too many failed login attempts. Please try again later or reset your password.";
    }
    if (errorMsg.includes("not configured") || errorMsg.includes("not available") || errorMsg.includes("api-key-not-valid") || errorMsg.includes("API key") || errorMsg.includes("INVALID_ARGUMENT")) {
      if (isDevelopment) {
        return "Firebase authentication is not properly configured. Please check the FIREBASE_SETUP.md file for detailed setup instructions, or enable local development mode by setting NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true in your .env.local file.";
      }
      return "The authentication service is currently unavailable. Please try again later or contact support.";
    }
    return "There was a problem signing in. Please check your credentials and try again.";
  };

  // Determine which field has an error based on the error message
  const getErrorFields = (errorMsg: string) => {
    const result: { email?: boolean; password?: boolean } = {};
    
    if (errorMsg.includes("user not found") || errorMsg.includes("User not found") || 
        errorMsg.includes("invalid email") || errorMsg.includes("Invalid email")) {
      result.email = true;
    }
    
    if (errorMsg.includes("wrong password") || errorMsg.includes("Incorrect password") || 
        errorMsg.includes("invalid credential") || errorMsg.includes("Invalid email or password")) {
      result.password = true;
    }
    
    // If it's a general error or we can't determine which field, highlight both
    if (Object.keys(result).length === 0) {
      result.email = true;
      result.password = true;
    }
    
    return result;
  };

  // Get error fields based on current error
  const errorFields = error ? getErrorFields(error) : {};

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image 
                src="/award-icon.svg" 
                alt="eMate Logo" 
                width={36} 
                height={36}
              />
              <span className="font-bold text-3xl">eMate</span>
            </Link>
            <h1 className="text-2xl font-bold">Log in to your account</h1>
            <p className="text-gray-600 mt-2">Welcome back! Please enter your details.</p>
          </div>
          
          {/* Only render conditional elements on the client side after hydration */}
          {isClient && (
            <>
              {isLocalMode && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg relative">
                  <div className="flex">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium mb-1">Local Development Mode</h5>
                      <p className="text-sm">
                        Using mock authentication for development. Any email and password (min 6 characters) will work.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isLocalMode && !firebaseAvailable && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg relative">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium mb-1">Firebase Authentication Not Configured</h5>
                      <p className="text-sm">
                        {isDevelopment 
                          ? "Firebase authentication is not properly configured. Please see the FIREBASE_SETUP.md file for detailed setup instructions." 
                          : "The authentication service is not properly configured. Please contact the site administrator."}
                      </p>
                      {isDevelopment && (
                        <p className="mt-2 text-xs">
                          To use local development mode without Firebase, set NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true in your .env.local file.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg relative">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium mb-1">{error}</h5>
                      <p className="text-sm">
                        {getErrorDescription(error)}
                      </p>
                      {(error.includes("api-key") || error.includes("INVALID_ARGUMENT")) && isDevelopment && (
                        <div className="mt-2 text-xs p-2 bg-gray-100 rounded font-mono overflow-x-auto">
                          <p>Follow the setup guide in <code>FIREBASE_SETUP.md</code> to properly configure Firebase.</p>
                          <p className="mt-1">Or, to quickly enable local development mode without Firebase:</p>
                          <pre className="mt-1">NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email || (isClient && errorFields.email) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.password || (isClient && errorFields.password) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || (!firebaseAvailable && !isLocalMode && isClient)}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-3 flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={loading || (!firebaseAvailable && !isLocalMode && isClient)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span>Google</span>
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
            {isClient && error && error.includes("not found") && (
              <p className="mt-2 text-sm text-gray-600">
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1">
                  <span>Create a new account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 