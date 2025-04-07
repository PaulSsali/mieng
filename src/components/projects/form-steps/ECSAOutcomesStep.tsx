"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProjectFormData } from "../ProjectForm";

interface ECSAOutcomesStepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
}

// Define ECSA outcomes with details and specific questions
const ECSA_OUTCOMES = [
  { 
    id: 1, 
    label: "Problem Solving", 
    description: "Define, investigate and analyze complex engineering problems.",
    questions: [
      "What specific engineering problem did you address in this project?",
      "Describe your approach to analyzing and solving this problem.",
      "What technical knowledge did you apply in your problem-solving process?"
    ]
  },
  { 
    id: 2, 
    label: "Application of Scientific and Engineering Knowledge", 
    description: "Apply knowledge of mathematics, natural sciences, and engineering fundamentals.",
    questions: [
      "Which mathematical concepts or principles did you apply in this project?",
      "How did you utilize scientific principles in your work?",
      "Describe how you integrated engineering fundamentals into your solutions."
    ]
  },
  { 
    id: 3, 
    label: "Engineering Design", 
    description: "Perform creative, procedural and non-procedural design and synthesis of components or systems.",
    questions: [
      "What was your role in the design process?",
      "Describe any innovative or creative solutions you developed.",
      "How did you validate that your design met the requirements?"
    ]
  },
  { 
    id: 4, 
    label: "Investigations, Experiments and Data Analysis", 
    description: "Design and conduct investigations and experiments.",
    questions: [
      "What investigations or experiments did you conduct?",
      "How did you analyze and interpret the resulting data?",
      "What conclusions did you draw from your analysis?"
    ]
  },
  { 
    id: 5, 
    label: "Engineering Methods, Skills, Tools and Information Technology", 
    description: "Use appropriate techniques, resources, and modern engineering tools.",
    questions: [
      "What engineering tools or software did you use in this project?",
      "How did you apply these tools to address engineering challenges?",
      "Did you develop any specialized techniques or approaches?"
    ]
  },
  { 
    id: 6, 
    label: "Professional and Technical Communication", 
    description: "Communicate effectively with engineering audiences and the community.",
    questions: [
      "How did you communicate technical information to different stakeholders?",
      "What documentation or reports did you produce?",
      "Did you present technical findings? If so, to whom and how?"
    ]
  },
  { 
    id: 7, 
    label: "Sustainability and Impact", 
    description: "Understand the impact of engineering activities societally and environmentally.",
    questions: [
      "How did you consider environmental impacts in your engineering decisions?",
      "What sustainability factors did you address in your work?",
      "How did your work contribute to sustainable development goals?"
    ]
  },
  { 
    id: 8, 
    label: "Individual, Team and Multidisciplinary Working", 
    description: "Work effectively as an individual, in teams and in multidisciplinary environments.",
    questions: [
      "Describe your role within the project team.",
      "How did you collaborate with professionals from other disciplines?",
      "What challenges did you face in team dynamics and how did you address them?"
    ]
  },
  { 
    id: 9, 
    label: "Independent Learning Ability", 
    description: "Engage in independent learning through well-developed learning skills.",
    questions: [
      "What new skills or knowledge did you need to acquire for this project?",
      "How did you go about learning these new areas?",
      "How did you apply this newly acquired knowledge in your work?"
    ]
  },
  { 
    id: 10, 
    label: "Engineering Professionalism", 
    description: "Be critically aware of the need to act professionally and ethically.",
    questions: [
      "What ethical considerations arose in this project?",
      "How did you ensure your work met professional standards?",
      "Describe any situations where you had to make professional judgments."
    ]
  },
  { 
    id: 11, 
    label: "Engineering Management", 
    description: "Demonstrate knowledge and understanding of engineering management principles.",
    questions: [
      "What project management responsibilities did you have?",
      "How did you manage resources, timelines, or budgets?",
      "Describe how you planned and executed engineering tasks."
    ]
  },
];

export function ECSAOutcomesStep({ formData, updateFormData }: ECSAOutcomesStepProps) {
  const handleOutcomeToggle = (outcomeId: number) => {
    const newOutcomes = formData.outcomes.includes(outcomeId)
      ? formData.outcomes.filter(id => id !== outcomeId)
      : [...formData.outcomes, outcomeId];
    
    updateFormData({ outcomes: newOutcomes });
  };

  const handleResponseChange = (outcomeId: number, response: string) => {
    updateFormData({
      outcomeResponses: {
        ...formData.outcomeResponses,
        [outcomeId]: response
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-6">ECSA Outcomes</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the ECSA outcomes you demonstrated in this project and provide specific details about how you achieved each outcome.
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {ECSA_OUTCOMES.map((outcome) => {
          const isSelected = formData.outcomes.includes(outcome.id);

          return (
            <AccordionItem 
              key={outcome.id} 
              value={`outcome-${outcome.id}`} 
              className={`border rounded-md ${isSelected ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-start p-4">
                <Checkbox
                  id={`outcome-${outcome.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOutcomeToggle(outcome.id)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <label
                    htmlFor={`outcome-${outcome.id}`}
                    className="text-base font-medium cursor-pointer"
                  >
                    {outcome.label}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {outcome.description}
                  </p>
                </div>
                <AccordionTrigger className="pt-0 h-auto" />
              </div>
              
              <AccordionContent className={`px-4 pb-4 ${isSelected ? '' : 'opacity-50'}`}>
                {isSelected ? (
                  <div className="space-y-4 mt-2">
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-2">Guiding Questions:</h4>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        {outcome.questions.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Your Experience with {outcome.label}
                      </label>
                      <Textarea
                        value={formData.outcomeResponses[outcome.id] || ''}
                        onChange={(e) => handleResponseChange(outcome.id, e.target.value)}
                        placeholder={`Describe how you demonstrated ${outcome.label} in this project...`}
                        className="min-h-[200px]"
                        disabled={!isSelected}
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide specific examples, actions you took, and results you achieved
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-sm italic text-muted-foreground">
                    Select this outcome to provide details about your experience.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
} 