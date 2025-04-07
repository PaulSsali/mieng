"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectFormData } from "./ProjectForm";
import { useRouter } from "next/navigation";
import { createNewProject } from "@/lib/project-service";
import { toast } from "react-hot-toast";

export function ProjectsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAddProject = async (data: ProjectFormData) => {
    try {
      await createNewProject(data);
      toast.success('Project created successfully!');
      router.refresh(); // Refresh the current page to show the new project
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    }
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