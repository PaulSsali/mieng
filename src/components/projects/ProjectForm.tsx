"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile } from "@/lib/user-service";

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

const ECSA_OUTCOMES = [
  { id: 1, label: "Problem Solving" },
  { id: 2, label: "Application of Scientific and Engineering Knowledge" },
  { id: 3, label: "Engineering Design" },
  { id: 4, label: "Investigations, Experiments and Data Analysis" },
  { id: 5, label: "Engineering Methods, Skills, Tools and Information Technology" },
  { id: 6, label: "Professional and Technical Communication" },
  { id: 7, label: "Sustainability and Impact" },
  { id: 8, label: "Individual, Team and Multidisciplinary Working" },
  { id: 9, label: "Independent Learning Ability" },
  { id: 10, label: "Engineering Professionalism" },
  { id: 11, label: "Engineering Management" },
];

const REFEREES = [
  { id: 1, name: "Robert Mkhize, Pr.Eng" },
  { id: 2, name: "Lisa Naidoo, Pr.Eng" },
];

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isModal?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface OutcomeResponse {
  [outcomeId: number]: string;
}

export interface ProjectFormData {
  name: string;
  discipline: string;
  startDate: string;
  endDate: string;
  role: string;
  company: string;
  description: string;
  outcomes: number[];
  referee: string;
  milestones: Milestone[];
  responsibilities: string;
  outcomeResponses: OutcomeResponse;
}

export function ProjectForm({ onSubmit, onCancel, isModal = false }: ProjectFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOutcomeToggle = (outcomeId: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: prev.outcomes.includes(outcomeId)
        ? prev.outcomes.filter(id => id !== outcomeId)
        : [...prev.outcomes, outcomeId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isModal ? 'max-h-[80vh] overflow-y-auto pr-4' : ''}`}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Engineering Discipline</label>
              <Select
                value={formData.discipline}
                onValueChange={(value) => setFormData(prev => ({ ...prev, discipline: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
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
              <p className="mt-1 text-xs text-muted-foreground">
                {isLoading ? "Loading your profile data..." : "Defaults to your engineering discipline from your profile"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Role</label>
              <Input
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company/Organization</label>
              <Input
                required
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description</label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ECSA Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {ECSA_OUTCOMES.map((outcome) => (
              <div key={outcome.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`outcome-${outcome.id}`}
                  checked={formData.outcomes.includes(outcome.id)}
                  onCheckedChange={() => handleOutcomeToggle(outcome.id)}
                />
                <label
                  htmlFor={`outcome-${outcome.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {outcome.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referee Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Select
              value={formData.referee}
              onValueChange={(value) => setFormData(prev => ({ ...prev, referee: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select referee" />
              </SelectTrigger>
              <SelectContent>
                {REFEREES.map((referee) => (
                  <SelectItem key={referee.id} value={referee.name}>
                    {referee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
} 