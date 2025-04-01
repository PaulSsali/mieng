"use client";

import { MainHeader } from "@/components/MainHeader";
import { useRouter } from "next/navigation";
import { ProjectFormData } from "@/components/projects/ProjectForm";
import { ProjectFormMultiStep } from "@/components/projects/ProjectFormMultiStep";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = (data: ProjectFormData) => {
    // TODO: Implement form submission
    console.log(data);
    router.push("/projects");
  };

  const handleCancel = () => {
    router.back();
  };

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
          />
        </div>
      </main>
    </div>
  );
} 