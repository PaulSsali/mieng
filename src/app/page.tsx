import Image from "next/image";
import Link from "next/link";
import SmoothScroll from "./components/SmoothScroll";
import NavLink from "./components/NavLink";

export default function Home() {
  return (
    <div id="top" className="flex flex-col min-h-screen">
      <SmoothScroll />
      {/* Header/Navigation */}
      <header className="py-4 fixed w-full top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/award-icon.svg" 
              alt="eMate Logo" 
              width={24} 
              height={24}
              className="text-primary" 
            />
            <span className="font-bold text-xl">eMate</span>
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
              className="text-gray-700 hover:text-primary transition-colors duration-300 px-4 py-2"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-hero -z-10"></div>
          
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
                Simplify Your <span className="text-gradient">ECSA Registration</span> Journey
              </h1>
              <p className="text-text-gray md:text-xl mb-10 leading-relaxed">
                Your all-in-one platform for managing ECSA registration with AI-powered tools for project tracking, report drafting, and CPD management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="btn-primary flex items-center justify-center gap-1 mx-auto sm:mx-0"
                >
                  Get Started 
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link 
                  href="/login" 
                  className="btn-login flex items-center justify-center mx-auto sm:mx-0"
                >
                  Login
                </Link>
              </div>
            </div>
            
            {/* Dashboard preview */}
            <div className="relative max-w-4xl mx-auto rounded-lg shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gray-100 flex items-center px-4 py-2 border-b space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <Image 
                src="/dashboard-image.png" 
                alt="eMate Dashboard Preview" 
                width={900} 
                height={500}
                className="w-full" 
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-text-gray max-w-2xl mx-auto">
                Our AI-powered tools help engineers streamline their ECSA registration process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-all duration-300">
                  <Image 
                    src="/file-text-icon.svg" 
                    alt="AI Report Drafting" 
                    width={28} 
                    height={28}
                    className="text-primary" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Report Drafting</h3>
                <p className="text-text-gray">
                  Generate professional training reports with our AI assistant, saving you hours of documentation work.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-all duration-300">
                  <Image 
                    src="/check-circle-icon.svg" 
                    alt="Outcome Tracking" 
                    width={28} 
                    height={28}
                    className="text-primary" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">Outcome Tracking</h3>
                <p className="text-text-gray">
                  Track your progress against ECSA outcomes and ensure you meet all registration requirements.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-all duration-300">
                  <Image 
                    src="/calendar-icon.svg" 
                    alt="CPD Management" 
                    width={28} 
                    height={28}
                    className="text-primary" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">CPD Management</h3>
                <p className="text-text-gray">
                  Plan, track and document your continuing professional development activities all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-text-gray max-w-2xl mx-auto">
                Choose the plan that works best for your registration journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300">
                <h3 className="text-2xl font-bold mb-3">Free Plan</h3>
                <div className="text-4xl font-bold mb-4">R0 <span className="text-text-gray text-base font-normal">Forever Free</span></div>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Project experience logging</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full outcome tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span> CPD tracking</span>
                  </li>
                </ul>
                
                <Link 
                  href="/signup" 
                  className="w-full btn-outline flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-primary/20 relative hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className="absolute -top-4 right-8 bg-primary text-white text-xs px-4 py-1.5 rounded-full font-medium">
                  Recommended
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Pro Ai Plan</h3>
                <div className="text-4xl font-bold mb-4">R299 <span className="text-text-gray text-base font-normal">per month</span></div>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-powered report drafting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>TER generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full CPD tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Referee management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>PDF & Word exports</span>
                  </li>
                </ul>
                
                <Link 
                  href="/signup?plan=pro" 
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Engineers Say</h2>
              <p className="text-text-gray max-w-2xl mx-auto">
                Engineers throughout South Africa are using eMate to streamline their registration process
              </p>
            </div>
          </div>
          
          <div className="testimonial-slider-container relative overflow-hidden w-full -mx-4 md:-mx-8">
            {/* First copy of testimonials */}
            <div className="testimonial-slider flex animate-scroll hover:pause-animation">
              {/* Testimonial 1 */}
              <div className="testimonial-card w-[350px] md:w-[400px] ml-8 md:ml-16 mr-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    JM
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">John Mthembu</h4>
                    <p className="text-text-gray">Civil Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The AI report drafting feature saved me countless hours of documentation work. I was able to generate my TER in a fraction of the time it would have taken manually."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    SP
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Sarah Patel</h4>
                    <p className="text-text-gray">Electrical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The outcome tracking feature helped me identify gaps in my experience that I needed to address before finalizing my ECSA application. eMate made the entire process much clearer."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    DV
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">David van der Merwe</h4>
                    <p className="text-text-gray">Mechanical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The ECSA registration process was daunting until I found eMate. The platform guided me through every step and the AI suggestions for my reports were spot on."
                </p>
              </div>

              {/* Testimonial 4 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    TN
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Thabo Nkosi</h4>
                    <p className="text-text-gray">Industrial Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The CPD management feature has been a game-changer. I can easily track all my professional development activities and generate reports for my ECSA renewal."
                </p>
              </div>

              {/* Testimonial 5 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    LM
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Lerato Mokoena</h4>
                    <p className="text-text-gray">Chemical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "As a mentor to several candidate engineers, eMate has simplified how I track their progress. The platform's interface is intuitive and the reporting features are excellent."
                </p>
              </div>

              {/* Testimonial 6 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    RJ
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Ryan Johnson</h4>
                    <p className="text-text-gray">Mining Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The referee management system made it easy to collect endorsements from supervisors. Everything is tracked in one place, which has streamlined my PR Eng application."
                </p>
              </div>

              {/* Testimonial 7 */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    FN
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Fatima Naidoo</h4>
                    <p className="text-text-gray">Environmental Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The AI assistant helped me articulate my experience in a way that perfectly aligned with ECSA requirements. This tool alone was worth the subscription fee."
                </p>
              </div>

              {/* Duplicate all testimonials to create perfect infinite loop */}
              {/* Testimonial 1 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    JM
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">John Mthembu</h4>
                    <p className="text-text-gray">Civil Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The AI report drafting feature saved me countless hours of documentation work. I was able to generate my TER in a fraction of the time it would have taken manually."
                </p>
              </div>
              
              {/* Testimonial 2 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    SP
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Sarah Patel</h4>
                    <p className="text-text-gray">Electrical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The outcome tracking feature helped me identify gaps in my experience that I needed to address before finalizing my ECSA application. eMate made the entire process much clearer."
                </p>
              </div>

              {/* Testimonial 3 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    DV
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">David van der Merwe</h4>
                    <p className="text-text-gray">Mechanical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The ECSA registration process was daunting until I found eMate. The platform guided me through every step and the AI suggestions for my reports were spot on."
                </p>
              </div>

              {/* Testimonial 4 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    TN
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Thabo Nkosi</h4>
                    <p className="text-text-gray">Industrial Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The CPD management feature has been a game-changer. I can easily track all my professional development activities and generate reports for my ECSA renewal."
                </p>
              </div>

              {/* Testimonial 5 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    LM
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Lerato Mokoena</h4>
                    <p className="text-text-gray">Chemical Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "As a mentor to several candidate engineers, eMate has simplified how I track their progress. The platform's interface is intuitive and the reporting features are excellent."
                </p>
              </div>

              {/* Testimonial 6 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    RJ
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Ryan Johnson</h4>
                    <p className="text-text-gray">Mining Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The referee management system made it easy to collect endorsements from supervisors. Everything is tracked in one place, which has streamlined my PR Eng application."
                </p>
              </div>

              {/* Testimonial 7 (duplicate) */}
              <div className="testimonial-card w-[350px] md:w-[400px] mx-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex-shrink-0">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-light text-white font-bold h-14 w-14 rounded-full flex items-center justify-center mr-4">
                    FN
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Fatima Naidoo</h4>
                    <p className="text-text-gray">Environmental Engineer</p>
                  </div>
                </div>
                <p className="text-text-gray leading-relaxed">
                  "The AI assistant helped me articulate my experience in a way that perfectly aligned with ECSA requirements. This tool alone was worth the subscription fee."
                </p>
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
              className="btn-primary inline-flex items-center gap-2 px-8 py-4"
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
      <footer className="py-12 border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Image 
                src="/award-icon.svg" 
                alt="eMate Logo" 
                width={20} 
                height={20}
                className="text-primary" 
              />
              <span className="font-bold">eMate</span>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/terms" className="text-text-gray hover:text-primary transition-colors duration-300 text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-text-gray hover:text-primary transition-colors duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-text-gray hover:text-primary transition-colors duration-300 text-sm">
                Contact
              </Link>
            </div>
            
            <div className="text-text-gray text-sm">
              &copy; {new Date().getFullYear()} eMate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
