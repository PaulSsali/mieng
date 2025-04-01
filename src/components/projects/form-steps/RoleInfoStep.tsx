"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormData } from "../ProjectForm";

interface RoleInfoStepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
}

export function RoleInfoStep({ formData, updateFormData }: RoleInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-6">Your Role & Contributions</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Detail your specific role in the project and your key responsibilities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Role Title</label>
          <Input
            required
            value={formData.role}
            onChange={(e) => updateFormData({ role: e.target.value })}
            placeholder="e.g., Lead Structural Engineer"
          />
          <p className="text-xs text-muted-foreground">
            Specify your official position or title on this project
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Company/Organization</label>
          <Input
            required
            value={formData.company}
            onChange={(e) => updateFormData({ company: e.target.value })}
            placeholder="e.g., ABC Engineering Consultants"
          />
          <p className="text-xs text-muted-foreground">
            Name of the organization you were working for
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Responsibilities</label>
        <Textarea
          required
          value={formData.responsibilities}
          onChange={(e) => updateFormData({ responsibilities: e.target.value })}
          placeholder="Describe your key duties, responsibilities, and contributions to the project..."
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          Provide specific details about:
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Your specific duties and tasks</li>
            <li>What you were personally responsible for</li>
            <li>Decisions you made or influenced</li>
            <li>How your work contributed to project outcomes</li>
            <li>Any challenges you overcame</li>
          </ul>
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Referee Assignment</label>
        <select
          value={formData.referee}
          onChange={(e) => updateFormData({ referee: e.target.value })}
          className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
        >
          <option value="" disabled>Select a referee</option>
          <option value="Robert Mkhize, Pr.Eng">Robert Mkhize, Pr.Eng</option>
          <option value="Lisa Naidoo, Pr.Eng">Lisa Naidoo, Pr.Eng</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Select a referee who can verify your role in this project
        </p>
      </div>
    </div>
  );
} 