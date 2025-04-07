"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile } from "@/lib/user-service";
import { ProjectFormData } from "./ProjectForm";
import { BasicInfoStep } from "./form-steps/BasicInfoStep";
import { TimelinesStep } from "./form-steps/TimelinesStep";
import { RoleInfoStep } from "./form-steps/RoleInfoStep";
import { ECSAOutcomesStep } from "./form-steps/ECSAOutcomesStep";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProjectFormMultiStepProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isModal?: boolean;
  isSubmitting?: boolean;
  initialData?: ProjectFormData;
}

type FormStep = "basic-info" | "timelines" | "role-info" | "ecsa-outcomes" | "review";

export function ProjectFormMultiStep({ 
  onSubmit, 
  onCancel, 
  isModal = false, 
  isSubmitting = false,
  initialData
}: ProjectFormMultiStepProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("basic-info");
  
  const [formData, setFormData] = useState<ProjectFormData>(initialData || {
    name: "",
    discipline: "",
    startDate: "",
    endDate: "",
    role: "",
    company: "",
    description: "",
    outcomes: [],
    referee: "",
    milestones: [],
    responsibilities: "",
    outcomeResponses: {}
  });
  
  // Set the user's discipline as the default when the component loads
  useEffect(() => {
    // Skip if we have initial data
    if (initialData) return;
    
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userProfile = await getUserProfile(user);
        if (userProfile?.discipline) {
          setFormData(prev => ({
            ...prev,
            discipline: userProfile.discipline || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, initialData]);

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    // Validate all required fields before final submission
    if (!formData.name.trim()) {
      toast.error("Project Name is required");
      setCurrentStep("basic-info");
      return;
    }
    if (!formData.startDate) {
      toast.error("Start Date is required");
      setCurrentStep("timelines");
      return;
    }
    if (!formData.role.trim()) {
      toast.error("Your Role is required");
      setCurrentStep("role-info");
      return;
    }
    if (!formData.company.trim()) {
      toast.error("Organization/Company is required");
      setCurrentStep("role-info");
      return;
    }
    if (!formData.responsibilities.trim()) {
      toast.error("Your Responsibilities are required");
      setCurrentStep("role-info");
      return;
    }

    onSubmit(formData);
  };

  const goToNextStep = () => {
    switch (currentStep) {
      case "basic-info":
        // Validate project name before proceeding
        if (!formData.name.trim()) {
          toast.error("Project Name is required");
          return;
        }
        setCurrentStep("timelines");
        break;
      case "timelines":
        // Validate start date before proceeding
        if (!formData.startDate) {
          toast.error("Start Date is required");
          return;
        }
        setCurrentStep("role-info");
        break;
      case "role-info":
        // Validate role, company and responsibilities before proceeding
        if (!formData.role.trim()) {
          toast.error("Your Role is required");
          return;
        }
        if (!formData.company.trim()) {
          toast.error("Organization/Company is required");
          return;
        }
        if (!formData.responsibilities.trim()) {
          toast.error("Your Responsibilities are required");
          return;
        }
        setCurrentStep("ecsa-outcomes");
        break;
      case "ecsa-outcomes":
        setCurrentStep("review");
        break;
      case "review":
        handleSubmit();
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "timelines":
        setCurrentStep("basic-info");
        break;
      case "role-info":
        setCurrentStep("timelines");
        break;
      case "ecsa-outcomes":
        setCurrentStep("role-info");
        break;
      case "review":
        setCurrentStep("ecsa-outcomes");
        break;
    }
  };

  // Check if all mandatory fields are filled
  const isMissingRequiredFields = () => {
    return !formData.name.trim() || 
           !formData.startDate || 
           !formData.role.trim() || 
           !formData.company.trim() || 
           !formData.responsibilities.trim();
  };

  const steps = [
    { id: "basic-info", label: "Basic Info", number: 1 },
    { id: "timelines", label: "Timelines", number: 2 },
    { id: "role-info", label: "Role Info", number: 3 },
    { id: "ecsa-outcomes", label: "ECSA Outcomes", number: 4 },
    { id: "review", label: "Review", number: 5 }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className={`space-y-8 ${isModal ? 'max-h-[calc(100vh-160px)] overflow-y-auto pr-2' : ''}`}>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-[15px] left-0 right-0 h-[2px] bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-[15px] left-0 h-[2px] bg-primary -z-10 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Step Circles */}
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${currentStep === step.id 
                    ? 'bg-primary text-white scale-110 ring-4 ring-primary/20' 
                    : (currentStepIndex > index 
                      ? 'bg-primary/90 text-white' 
                      : 'bg-gray-100 text-gray-500 border border-gray-300')}
                `}
              >
                {currentStepIndex > index 
                  ? <CheckCircle2 className="w-4 h-4" /> 
                  : step.number}
              </div>
              <span 
                className={`text-xs mt-2 max-w-[80px] text-center transition-colors duration-300
                  ${currentStep === step.id 
                    ? 'text-primary font-medium' 
                    : (currentStepIndex > index ? 'text-primary/70' : 'text-gray-500')}
                `}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="mt-6">
        {currentStep === "basic-info" && (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            isLoading={isLoading}
          />
        )}

        {currentStep === "timelines" && (
          <TimelinesStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}

        {currentStep === "role-info" && (
          <RoleInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}

        {currentStep === "ecsa-outcomes" && (
          <ECSAOutcomesStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        )}

        {currentStep === "review" && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                  <p className="mt-1">{formData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Discipline</h4>
                  <p className="mt-1">{formData.discipline}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                  <p className="mt-1">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                  <p className="mt-1">{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Ongoing'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Role</h4>
                  <p className="mt-1">{formData.role}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Company</h4>
                  <p className="mt-1">{formData.company}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1">{formData.description}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Responsibilities</h4>
                  <p className="mt-1">{formData.responsibilities}</p>
                </div>
              </div>

              {formData.milestones && formData.milestones.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Key Milestones</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.milestones.map((milestone, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">{milestone.title}</span>
                        {milestone.date && (
                          <span className="text-gray-600"> - {new Date(milestone.date).toLocaleDateString()}</span>
                        )}
                        {milestone.description && (
                          <p className="text-gray-600 ml-2">{milestone.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.outcomes && formData.outcomes.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Selected ECSA Outcomes</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {formData.outcomes.map(outcome => (
                      <li key={outcome.id}>
                        <div className="font-medium">Outcome {outcome.id}: {outcome.title}</div>
                        {formData.outcomeResponses && formData.outcomeResponses[outcome.id] && (
                          <p className="text-gray-600 ml-2">{formData.outcomeResponses[outcome.id]}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
            
            {/* Warning for missing fields */}
            {isMissingRequiredFields() && (
              <div className="py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                <strong>Note:</strong> Some required fields are missing. Please go back and complete them before submitting.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentStep === "basic-info" ? (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button variant="outline" onClick={goToPreviousStep} disabled={isSubmitting}>
            Back
          </Button>
        )}
        
        <Button 
          onClick={goToNextStep} 
          disabled={isSubmitting}
        >
          {currentStep === "review" ? (
            isSubmitting ? "Submitting..." : "Submit Project"
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
