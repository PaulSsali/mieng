"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectFormData } from "./ProjectForm";

export function ProjectsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = (data: ProjectFormData) => {
    // TODO: Implement project creation logic
    console.log("New project data:", data);
    // You would typically send this data to your API
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </>
  );
} 