"use client";

import { MainHeader } from "@/components/MainHeader";
import { useRouter } from "next/navigation";
import { ProjectFormData } from "@/components/projects/ProjectForm";
import { ProjectFormMultiStep } from "@/components/projects/ProjectFormMultiStep";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { createNewProject } from "@/lib/project-service";
import { toast } from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a project');
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const newProject = await createNewProject(data);
      toast.success('Project created successfully!');
      router.push("/projects");
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
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
            <h1 className="text-3xl font-bold">Add New Project</h1>
          </div>
          
          <ProjectFormMultiStep
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
} 