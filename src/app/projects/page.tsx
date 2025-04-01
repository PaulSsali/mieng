"use client";

import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { ProjectsHeader } from '@/components/projects/ProjectsHeader'
import { ProjectsFilters } from '@/components/projects/ProjectsFilters'
import { ProjectsList } from '@/components/projects/ProjectsList'
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  return (
    <DashboardLayout>
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
        </div>
      </main>
    </DashboardLayout>
  )
} 