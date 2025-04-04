"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainHeader } from "@/components/MainHeader";
import { ProjectsHeader } from '@/components/projects/ProjectsHeader'
import { ProjectsFilters } from '@/components/projects/ProjectsFilters'
import { ProjectsList } from '@/components/projects/ProjectsList'
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { ProjectFormData } from '@/components/projects/ProjectForm';
import { createNewProject } from "@/lib/project-service";
import { toast } from "react-hot-toast";

// Component that uses searchParams wrapped in Suspense
function NewProjectChecker({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsOpen(true);
    }
  }, [searchParams, setIsOpen]);
  
  return null;
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  const handleAddProject = async (data: ProjectFormData) => {
    try {
      await createNewProject(data);
      toast.success('Project created successfully!');
      setIsNewProjectModalOpen(false);
      // We don't need to manually refresh as the ProjectsList component
      // should fetch the latest projects when it mounts
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    }
  };
  
  const handleCloseModal = () => {
    setIsNewProjectModalOpen(false);
    // Remove the 'new' query parameter from the URL without navigation
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('new');
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <DashboardLayout>
      {/* Wrap searchParams usage in Suspense */}
      <Suspense fallback={null}>
        <NewProjectChecker setIsOpen={setIsNewProjectModalOpen} />
      </Suspense>
      
      <main>
        <div className="container mx-auto px-4 py-6">
          <ProjectsHeader />
          <ProjectsFilters 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            companyFilter={companyFilter}
            onCompanyFilterChange={setCompanyFilter}
          />
          <ProjectsList 
            viewMode={viewMode}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            companyFilter={companyFilter}
          />
          
          <ProjectFormModal
            isOpen={isNewProjectModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleAddProject}
          />
        </div>
      </main>
    </DashboardLayout>
  )
} 