"use client"

import Image from "next/image";
import Link from "next/link";
import SmoothScroll from "./components/SmoothScroll";
import NavLink from "./components/NavLink";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { auth } from '@/lib/firebase';

// Client component to display the Firebase warning
function FirebaseWarning() {
  const { authInitialized } = useAuth();
  const [isDevelopment, setIsDevelopment] = useState(false);
  
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);
  
  if (authInitialized || !isDevelopment) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-amber-50 border border-amber-200 text-amber-700 rounded-md p-4 shadow-lg z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Firebase Not Configured</h3>
          <div className="mt-2 text-sm">
            <p>Firebase authentication is not properly configured. Update your .env.local file with valid Firebase credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display the Firebase Authentication status
function FirebaseAuthStatus() {
  const [authStatus, setAuthStatus] = useState<string>('Checking Firebase Auth status...');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Check Firebase auth status
    if (auth) {
      setAuthStatus('Firebase Auth is properly initialized!');
      
      // Hide the status message after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    } else {
      setAuthStatus('Firebase Auth is NOT properly initialized. Check configuration.');
    }
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 max-w-md rounded-md p-4 shadow-lg z-50 border"
         style={{
           backgroundColor: authStatus.includes('NOT') ? '#fee2e2' : '#d1fae5',
           borderColor: authStatus.includes('NOT') ? '#ef4444' : '#10b981',
           color: authStatus.includes('NOT') ? '#b91c1c' : '#047857'
         }}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {authStatus.includes('NOT') ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{authStatus}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-auto bg-transparent text-current hover:bg-gray-200 rounded-full p-1"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="flex flex-col min-h-screen">
      <SmoothScroll />
      <FirebaseWarning />
      <FirebaseAuthStatus />
      {/* Header/Navigation */}
      <header className="py-4 fixed w-full top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Ed60 Logo" 
              width={100} 
              height={100}
              className="rounded-sm"
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLink 
              href="#top" 
              isHomeLink={true}
              className="text-gray-700 hover:text-primary transition-colors duration-300 scroll-smooth"
            >
              Home
            </NavLink>
            <NavLink 
              href="#features" 
              className="text-gray-700 hover:text-primary transition-colors duration-300 scroll-smooth"
            >
              Features
            </NavLink>
            <NavLink 
              href="#pricing" 
              className="text-gray-700 hover:text-primary transition-colors duration-300 scroll-smooth"
            >
              Pricing
            </NavLink>
            <NavLink 
              href="#testimonials" 
              className="text-gray-700 hover:text-primary transition-colors duration-300 scroll-smooth"
            >
              Testimonials
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-primary transition-all duration-300 px-4 py-2 hover:scale-105"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:translate-y-[-2px]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          {/* Background gradient (now behind grid) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white -z-20"></div>
          
          {/* Fading Grid Background (now slightly more visible and in front of gradient) */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: 
                'linear-gradient(to right, rgba(209, 213, 219, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(209, 213, 219, 0.5) 1px, transparent 1px)', // Darker color, less transparent
              backgroundSize: '40px 40px', 
              maskImage: 'radial-gradient(ellipse at center, white 10%, transparent 80%)', // Softer fade
              WebkitMaskImage: 'radial-gradient(ellipse at center, white 10%, transparent 80%)' 
            }}
          ></div>
          
          {/* New feature announcement */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-primary/20">
              <span className="bg-primary text-white text-xs py-0.5 px-2 rounded-full">New</span>
              <span>We've just released AI-powered report drafting</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                You Built the Experience. <span className="text-gradient">Let AI Build the Report.</span>
              </h1>
              <p className="text-text-gray md:text-xl mb-10 leading-relaxed">
                One platform to track, draft, and own your ECSA submission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="btn-primary flex items-center justify-center gap-1 mx-auto sm:mx-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:translate-y-[-2px]"
                >
                  Get Started 
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link 
                  href="/login" 
                  className="btn-login flex items-center justify-center mx-auto sm:mx-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:translate-y-[-2px]"
                >
                  Login
                </Link>
              </div>
            </div>
            
            {/* Dashboard preview - updated to be larger and more responsive */}
            <div className="relative w-full max-w-5xl mx-auto rounded-lg shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-[1.01] transition-transform duration-500">
              <div className="bg-gray-100 flex items-center px-4 py-2 border-b space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="relative group">
                <Image 
                  src="/dashboard-screenshot.png" 
                  alt="Ed60 Dashboard Preview" 
                  width={1200} 
                  height={675}
                  className="w-full object-cover" 
                  priority
                />
                {/* Add a subtle glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 transition-opacity duration-700"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] -z-10"></div>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium border border-red-200">
                  Challenges
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
                The <span className="text-red-600">Frustrations</span> Engineers Face
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The journey to ECSA registration is filled with obstacles that can make the process overwhelming and time-consuming.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Challenge 1 */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-red-600"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6" />
                      <path d="M8 18v-1" />
                      <path d="M16 18v-3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Lost Project Details</h3>
                </div>
                <p className="text-muted-foreground">
                  Engineers often forget critical project details, responsibilities, and contributions over time, making it difficult to document them accurately for ECSA.
                </p>
              </div>
              
              {/* Challenge 2 */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-red-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Complex ECSA Process</h3>
                </div>
                <p className="text-muted-foreground">
                  The ECSA registration process is notoriously complicated, with strict requirements and outcomes that can be confusing to navigate without guidance.
                </p>
              </div>
              
              {/* Challenge 3 */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-red-600"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                      <path d="M12 11h4" />
                      <path d="M12 16h4" />
                      <path d="M8 11h.01" />
                      <path d="M8 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Report Structuring</h3>
                </div>
                <p className="text-muted-foreground">
                  Writing professional Training and Experience Reports (TERs) that meet ECSA's strict formatting requirements is time-consuming and often requires multiple revisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white scroll-mt-20 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] -z-10"></div>
          
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200">
                  Solutions
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">How Ed60 <span className="text-green-600">Solves</span> These Challenges</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our platform is specifically designed to address the pain points engineers face during their ECSA registration journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Solution 1 */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      <path d="m9 11 3 3 3-3" />
                      <path d="M12 14V6.5" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">AI Report Drafting</h3>
                    <span className="bg-violet-100 text-violet-800 text-xs py-0.5 px-2 rounded-full">Popular</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-base mb-5">
                  <span className="text-green-600 font-semibold">Solution:</span> Our AI transforms your project notes into professionally structured TERs that meet ECSA's exact requirements.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Generate complete reports instantly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Editable content to refine results</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">ECSA-compliant formatting</span>
                  </li>
                </ul>
              </div>
              
              {/* Solution 2 */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-green-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Outcome Tracking</h3>
                </div>
                <p className="text-muted-foreground text-base mb-5">
                  <span className="text-green-600 font-semibold">Solution:</span> Our system clearly maps your experience to ECSA outcomes, guiding you through the complex registration process.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Real-time progress tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Identify experience gaps</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Customized recommendations</span>
                  </li>
                </ul>
              </div>
              
              {/* Solution 3 - Project Tracking */}
              <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start mb-5">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M2 17a5 5 0 0 1 10 0c0 2.5-2 3-2 3H4s-2-.5-2-3Z" />
                      <path d="M12 17a5 5 0 0 1 10 0c0 2.5-2 3-2 3h-6s-2-.5-2-3Z" />
                      <path d="M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
                      <path d="M17 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Project Tracking</h3>
                </div>
                <p className="text-muted-foreground text-base mb-5">
                  <span className="text-green-600 font-semibold">Solution:</span> Never forget project details again with our comprehensive tracking system that documents your experience as you go.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Log and categorize projects</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Document responsibilities</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Quantify experience hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 scroll-mt-20 relative">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200">
                  Simple Pricing
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">One Plan, All <span className="text-primary">Features</span></h2>
              <p className="text-text-gray max-w-2xl mx-auto">
                Unlock the full power of AI for your engineering registration journey
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {/* Pro Plan */}
              <div className="relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md">
                    Full Access • No Limits
                  </div>
                </div>
              
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className="grid md:grid-cols-5">
                    {/* Price Panel */}
                    <div className="md:col-span-1 bg-[#f8f7ff] p-8 flex flex-col items-center justify-center text-center">
                      <h3 className="text-xl font-bold mb-2">PRO<br/>AI<br/>PLAN</h3>
                      <div className="mt-4 mb-3">
                        <span className="text-5xl font-bold">R299</span>
                        <div className="text-gray-700 text-sm mt-1">
                          per month
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-6">
                        No contracts.<br/>Cancel anytime.
                      </div>
                      <Link 
                        href="/signup?plan=pro" 
                        className="w-full rounded-full bg-[#6961fb] text-white py-3 px-4 text-center font-medium transition-all hover:bg-[#5a52e0] text-sm"
                      >
                        Get Started
                      </Link>
                    </div>
                    
                    {/* Features Panel */}
                    <div className="md:col-span-4 p-8">
                      <h4 className="text-lg font-semibold mb-6">Everything You Need:</h4>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-start">
                          <div className="bg-green-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">Project Experience Logging</h5>
                            <p className="text-sm text-gray-600">Document all your projects in one place</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">Full Outcome Tracking</h5>
                            <p className="text-sm text-gray-600">Map experience to ECSA requirements</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-purple-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">CPD Tracking</h5>
                            <p className="text-sm text-gray-600">Monitor your continuing professional development</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-[#6961fb]/10 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-[#6961fb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">AI Report Drafting</h5>
                            <p className="text-sm text-gray-600">Generate professional reports instantly</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-amber-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">TER Generation</h5>
                            <p className="text-sm text-gray-600">ECSA-compliant training reports</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-rose-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">Referee Management</h5>
                            <p className="text-sm text-gray-600">Collect endorsements easily</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start col-span-2">
                          <div className="bg-teal-100 p-3 rounded-full mr-3 flex-shrink-0">
                            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-medium">PDF & Word Exports</h5>
                            <p className="text-sm text-gray-600">Download professionally formatted documents for submission</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50 scroll-mt-20 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] -z-10"></div>
          
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                  Testimonials
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by <span className="text-blue-600">Engineers</span></h2>
              <p className="text-text-gray max-w-2xl mx-auto">
                Engineers throughout South Africa are using Ed60 to streamline their registration process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Testimonial 1 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-slow">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "The AI report drafting feature saved me countless hours of documentation work. I was able to generate my TER in a fraction of the time."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-primary text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      JM
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">John Mthembu</h4>
                      <p className="text-sm text-gray-500">Civil Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-moderate">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "The outcome tracking feature helped me identify gaps in my experience that I needed to address before finalizing my ECSA application."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-blue-600 text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      SP
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Sarah Patel</h4>
                      <p className="text-sm text-gray-500">Electrical Engineer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-fast">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "The ECSA registration process was daunting until I found Ed60. The platform guided me through every step of the process."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-green-600 text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      DV
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">David van der Merwe</h4>
                      <p className="text-sm text-gray-500">Mechanical Engineer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-moderate md:col-span-3 lg:col-span-1">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "Ed60 has been invaluable for my ECSA registration. The project tracking is excellent, keeping everything organized in one place."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-purple-600 text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      TN
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Thabo Nkosi</h4>
                      <p className="text-sm text-gray-500">Industrial Engineer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-slow md:col-span-3 lg:col-span-1">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "As a mentor to several candidate engineers, Ed60 has simplified how I track their progress. The platform's interface is intuitive."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-primary text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      LM
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Lerato Mokoena</h4>
                      <p className="text-sm text-gray-500">Chemical Engineer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 6 */}
              <div className="testimonial-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-float-fast md:col-span-3 lg:col-span-1">
                <div className="flex flex-col items-start">
                  <svg width="45" height="36" className="text-blue-500 mb-6" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 0C6.06 0 0 6.24 0 13.95C0 25.5 12.33 35.01 13.5 36C14.67 35.79 18 33.75 18 31.5C18 30.45 16.83 29.37 16.83 28.32C16.83 27.27 17.76 26.4 18.9 26.4H22.5C29.7 26.4 36 20.22 36 13.05V9C36 3.93 31.92 0 27 0H13.5Z" />
                  </svg>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "The referee management system made it easy to collect endorsements from supervisors. Everything is tracked in one place."
                  </p>
                  
                  <div className="mt-auto flex items-center">
                    <div className="bg-cyan-600 text-white font-bold h-12 w-12 rounded-full flex items-center justify-center">
                      RJ
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">Ryan Johnson</h4>
                      <p className="text-sm text-gray-500">Mining Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero -z-10 opacity-50"></div>
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight">
              Ready to Simplify Your <span className="text-gradient">ECSA Registration</span>?
            </h2>
            <Link 
              href="/signup" 
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:translate-y-[-3px]"
            >
              Get Started Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4"> 
                <Image 
                  src="/logo.svg" 
                  alt="Ed60 Logo" 
                  width={100} 
                  height={100} 
                  className="rounded-sm"
                />
              </div>
              <p className="text-gray-600 mb-4 pr-4">
                Empowering engineers with AI-powered tools for ECSA registration and reporting.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" className="text-gray-400 hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Site Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#top" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-base text-gray-600 hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">support@ed60.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">+27 12 345 6789</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">Pretoria, South Africa</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Ed60. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              Designed and developed with ❤️ for engineers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
