"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormData, Milestone } from "../ProjectForm";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TimelinesStepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
}

export function TimelinesStep({ formData, updateFormData }: TimelinesStepProps) {
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, "id">>({
    title: "",
    date: "",
    description: ""
  });

  const addMilestone = () => {
    // Validate milestone data
    if (!newMilestone.title.trim() || !newMilestone.date) {
      return; // Don't add empty milestones
    }

    const milestone: Milestone = {
      id: uuidv4(),
      ...newMilestone
    };

    updateFormData({
      milestones: [...formData.milestones, milestone]
    });

    // Reset form
    setNewMilestone({
      title: "",
      date: "",
      description: ""
    });
  };

  const removeMilestone = (id: string) => {
    updateFormData({
      milestones: formData.milestones.filter(milestone => milestone.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-6">Project Timeline</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Set the start and end dates of your project, and add key milestones.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            When did you begin work on this project?
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            When was the project completed? (Use expected date if ongoing)
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Key Milestones</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add significant events or achievements from your project timeline.
        </p>

        {/* Existing Milestones */}
        {formData.milestones.length > 0 && (
          <div className="space-y-4 mb-6">
            {formData.milestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-md p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-destructive"
                  onClick={() => removeMilestone(milestone.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Milestone */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Add New Milestone</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium">Title</label>
              <Input
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Design Phase Completed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Date</label>
              <Input
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Description</label>
            <Textarea
              value={newMilestone.description}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Briefly describe this milestone..."
              className="h-20"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-2 w-full"
            onClick={addMilestone}
            disabled={!newMilestone.title.trim() || !newMilestone.date}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>
    </div>
  );
} 