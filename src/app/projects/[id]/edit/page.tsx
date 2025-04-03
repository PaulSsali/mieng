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

  // Fetch the project data
  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchProject();
    }
  }, [params.id, user, router]);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast.error('You must be logged in to update a project');
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedProject = await updateExistingProject(params.id, data);
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

  // If not authenticated, the useEffect will redirect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Edit Project</h1>
          </div>
          
          <ProjectFormMultiStep
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            initialData={mapProjectToFormData(project)}
          />
        </div>
      </main>
    </div>
  );
} 