"use client";

import { MainHeader } from "@/components/MainHeader";
import { useRouter } from "next/navigation";
import { ProjectFormData } from "@/components/projects/ProjectForm";
import { ProjectFormMultiStep } from "@/components/projects/ProjectFormMultiStep";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { updateExistingProject } from "@/lib/project-service";
import { toast } from "react-hot-toast";
import { Project } from "@/lib/db/project-service";
import { authenticatedFetch } from "@/lib/auth-utils";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // The ID is now directly available from params
  const projectId = params.id;

  // Fetch the project data
  useEffect(() => {
    async function fetchProject() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await authenticatedFetch(`/api/projects/${projectId}`, {
          method: 'GET',
        }, user);
        
        if (!response) {
          throw new Error('Failed to fetch project - no response received');
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || 'Failed to fetch project');
        }
        
        const projectData = await response.json();
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user && !loading) {
      fetchProject();
    }
  }, [user, loading, projectId]);
  
  const handleSubmit = async (data: ProjectFormData) => {
    if (!user || !projectId) {
      toast.error('You must be logged in to update a project');
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedProject = await updateExistingProject(projectId, data);
      toast.success('Project updated successfully!');
      router.push("/projects");
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Map Project to ProjectFormData
  const mapProjectToFormData = (project: Project): ProjectFormData => {
    // Fix milestone format to match the ProjectFormData type
    const mappedMilestones = (project.milestones || []).map(milestone => ({
      id: milestone.id || `temp-${Date.now()}-${Math.random()}`, // Ensure id is always a string
      title: milestone.title,
      date: milestone.date,
      description: milestone.description
    }));

    return {
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      role: project.role,
      company: project.company,
      discipline: project.discipline,
      outcomes: project.outcomes || [],
      outcomeResponses: project.outcomeResponses || {},
      milestones: mappedMilestones,
      responsibilities: project.responsibilities || '',
      referee: project.referee || ''
    };
  };

  // Show loading states
  if (loading || isLoading) {
    return <div className="flex justify-center py-20">Loading project data...</div>;
  }

  // Show error state
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>;
  }

  // If no project found
  if (!project) {
    return <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">Project not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <MainHeader />
      
      <ProjectFormMultiStep
        initialData={mapProjectToFormData(project)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 