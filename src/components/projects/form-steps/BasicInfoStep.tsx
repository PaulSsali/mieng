"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFormData } from "../ProjectForm";

interface BasicInfoStepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  isLoading: boolean;
}

const DISCIPLINES = [
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Industrial Engineering",
  "Aerospace Engineering",
  "Agricultural Engineering",
  "Biomedical Engineering",
  "Computer Engineering",
  "Environmental Engineering",
  "Mining Engineering",
  "Nuclear Engineering",
  "Petroleum Engineering",
  "Software Engineering",
  "Structural Engineering",
  "Systems Engineering",
  "Other"
];

export function BasicInfoStep({ formData, updateFormData, isLoading }: BasicInfoStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Basic Project Information</h2>
        <p className="text-sm text-muted-foreground">
          Start by providing essential details about your engineering project.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">Project Name</label>
          <Input
            id="project-name"
            required
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="e.g., Downtown Bridge Renovation"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a clear, descriptive name for your project
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="discipline" className="text-sm font-medium">Engineering Discipline</label>
          <Select
            value={formData.discipline}
            onValueChange={(value) => updateFormData({ discipline: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="discipline" className="w-full">
              <SelectValue placeholder={isLoading ? "Loading..." : "Select discipline"} />
            </SelectTrigger>
            <SelectContent>
              {DISCIPLINES.map((discipline) => (
                <SelectItem key={discipline} value={discipline}>
                  {discipline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? "Loading your profile data..." : "Defaults to your engineering discipline from your profile"}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Project Description</label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Briefly describe the project, its objectives, and scope..."
            className="min-h-[150px] w-full resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Provide a concise overview of what the project entails (200-300 words recommended)
          </p>
        </div>
      </div>
    </div>
  );
} 