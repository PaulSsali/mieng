"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types
import { FormData } from "./types";

// Form components for each step
import PersonalInfoForm from "./components/PersonalInfoForm";
import DisciplineForm from "./components/DisciplineForm";
import ExperienceForm from "./components/ExperienceForm";
import AvailabilityForm from "./components/AvailabilityForm";
import ConfirmationScreen from "./components/ConfirmationScreen";

// Step types and initial form data
type Step = 1 | 2 | 3 | 4 | 5;

const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  discipline: "",
  experience: "",
  hasMentor: false,
  hoursPerWeek: 5,
  completionTimeline: "",
};

export default function Signup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / 4) * 100;
  
  // Step titles and descriptions
  const stepInfo = {
    1: { 
      title: "Personal Information", 
      description: "Create your account by providing your basic information" 
    },
    2: { 
      title: "Engineering Discipline", 
      description: "Tell us about your engineering field" 
    },
    3: { 
      title: "Work Experience", 
      description: "Share your professional experience details" 
    },
    4: { 
      title: "Report Completion Preferences", 
      description: "Set your preferences for tracking and completing reports" 
    },
    5: { 
      title: "Confirmation", 
      description: "Review your information before finishing setup" 
    }
  };

  // Handle form data changes
  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => (prev + 1) as Step);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as Step);
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real application, we would send the data to the backend
      console.log("Form data submitted:", formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on successful signup
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Render the current step form
  const renderStepForm = () => {
    switch(currentStep) {
      case 1:
        return (
          <PersonalInfoForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <DisciplineForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 3:
        return (
          <ExperienceForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 4:
        return (
          <AvailabilityForm 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 5:
        return (
          <ConfirmationScreen 
            formData={formData} 
          />
        );
      default:
        return null;
    }
  };

  // Check if the current step is valid to proceed
  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return (
          formData.name.trim() !== "" && 
          formData.email.trim() !== "" && 
          formData.password.trim() !== "" && 
          formData.password === formData.confirmPassword
        );
      case 2:
        return formData.discipline.trim() !== "";
      case 3:
        return formData.experience.trim() !== "";
      case 4:
        return formData.hoursPerWeek > 0 && formData.completionTimeline.trim() !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="py-4 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/award-icon.svg" 
              alt="eMate Logo" 
              width={24} 
              height={24}
              className="text-primary" 
            />
            <span className="font-bold text-xl">eMate</span>
          </Link>
          
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-primary transition-colors duration-300"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-2xl w-full mx-auto px-4 md:px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                      ${currentStep === step 
                        ? 'bg-primary text-white' 
                        : currentStep > step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'}`}
                  >
                    {currentStep > step ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden md:block">
                    {stepInfo[step as Step].title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold">{stepInfo[currentStep].title}</h1>
              <p className="text-gray-500 text-sm">{stepInfo[currentStep].description}</p>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {renderStepForm()}
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Finish Setup'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 