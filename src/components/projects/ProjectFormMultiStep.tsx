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

interface ProjectFormMultiStepProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isModal?: boolean;
}

type FormStep = "basic-info" | "timelines" | "role-info" | "ecsa-outcomes" | "review";

export function ProjectFormMultiStep({ onSubmit, onCancel, isModal = false }: ProjectFormMultiStepProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("basic-info");
  
  const [formData, setFormData] = useState<ProjectFormData>({
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
  }, [user]);

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const goToNextStep = () => {
    switch (currentStep) {
      case "basic-info":
        setCurrentStep("timelines");
        break;
      case "timelines":
        setCurrentStep("role-info");
        break;
      case "role-info":
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

  const steps = [
    { id: "basic-info", label: "Basic Info", number: 1 },
    { id: "timelines", label: "Timelines", number: 2 },
    { id: "role-info", label: "Role Info", number: 3 },
    { id: "ecsa-outcomes", label: "ECSA Outcomes", number: 4 },
    { id: "review", label: "Review", number: 5 }
  ];

  return (
    <div className={`space-y-6 ${isModal ? 'max-h-[80vh] overflow-y-auto pr-4' : ''}`}>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium 
                  ${currentStep === step.id 
                    ? 'bg-primary text-white' 
                    : (steps.findIndex(s => s.id === currentStep) > index 
                      ? 'bg-green-100 text-green-600 border border-green-600' 
                      : 'bg-gray-100 text-gray-500')}
                `}
              >
                {steps.findIndex(s => s.id === currentStep) > index 
                  ? <CheckCircle2 className="w-5 h-5" /> 
                  : step.number}
              </div>
              <span 
                className={`text-xs mt-2 
                  ${currentStep === step.id 
                    ? 'text-primary font-medium' 
                    : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="absolute left-0 right-0 hidden sm:block">
                  <div className={`h-0.5 w-full ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <Card className="p-6">
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Your Project</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Project Name</h3>
                <p>{formData.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{formData.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Timeline</h3>
                <p>{formData.startDate} to {formData.endDate}</p>
              </div>
              <div>
                <h3 className="font-medium">Role & Company</h3>
                <p>{formData.role} at {formData.company}</p>
              </div>
              <div>
                <h3 className="font-medium">Selected ECSA Outcomes</h3>
                <p>{formData.outcomes.length} outcomes selected</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep === "basic-info" ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>
        )}
        
        <Button 
          type="button" 
          onClick={goToNextStep}
        >
          {currentStep === "review" ? "Submit" : "Continue"}
        </Button>
      </div>
    </div>
  );
} 