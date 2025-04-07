"use client";

import { useState } from "react";
import { FormData } from "../types";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PersonalInfoFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function PersonalInfoForm({ formData, updateFormData }: PersonalInfoFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Validate password match when confirmPassword changes
    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
    
    // Validate email format
    if (name === "email" && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      // In a real application, this would initiate OAuth flow with Google
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would normally populate the form with data from Google
      updateFormData({
        name: "Google User",
        email: "googleuser@gmail.com",
      });
      
      setIsGoogleLoading(false);
    } catch (error) {
      console.error("Google signup error:", error);
      setIsGoogleLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Social Login Options */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
          )}
          <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition`}
          placeholder="John Doe"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

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
          className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition`}
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 hover:bg-gray-100 rounded-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition`}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
} 