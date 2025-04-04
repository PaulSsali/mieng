import { ProjectCard } from "./ProjectCard"
import { ProjectsEmptyState } from "./ProjectsEmptyState"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Project } from "@/lib/db/project-service"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface ProjectsListProps {
  viewMode: "grid" | "list"
  searchQuery: string
  statusFilter: string
  companyFilter: string
  refreshTrigger?: number // Optional prop to trigger refresh
}

export function ProjectsList({ 
  viewMode, 
  searchQuery, 
  statusFilter, 
  companyFilter,
  refreshTrigger = 0 // Default to 0
}: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If no user, redirect to login page
    if (!user && !loading) {
      router.push('/login');
      return;
    }
    
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get the authentication token if available
        let token = null;
        if (user && 'getIdToken' in user) {
          token = await user.getIdToken();
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add the token if available
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/projects', {
          headers
        });
        
        if (response.status === 401) {
          // Unauthorized, redirect to login
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProjects();
    }
  }, [user, router, refreshTrigger]); // Add refreshTrigger to dependency array
  
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "in-progress" && project.status === "In Progress") ||
                         (statusFilter === "completed" && project.status === "Completed") ||
                         (statusFilter === "pending" && project.status === "Pending Review");
    
    const matchesCompany = companyFilter === "all" || 
                          project.company.toLowerCase() === companyFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  if (loading) {
    return <div className="flex justify-center py-10">Loading projects...</div>;
  }
  
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>;
  }

  if (filteredProjects.length === 0) {
    return <ProjectsEmptyState />
  }

  if (viewMode === "list") {
    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.company}</TableCell>
                <TableCell>{project.discipline}</TableCell>
                <TableCell>{project.role}</TableCell>
                <TableCell>{project.startDate} - {project.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredProjects.map((project) => (
        <div key={project.id} className="h-full">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
} 