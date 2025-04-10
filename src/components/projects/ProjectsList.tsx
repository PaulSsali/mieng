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
import { authenticatedFetch } from "@/lib/auth-utils"

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
      if (!user) return; // Don't fetch if no user
      
      try {
        setLoading(true);
        
        // Use authenticatedFetch utility
        const response = await authenticatedFetch('/api/projects', {
          method: 'GET'
        }, user);
        
        // Check if response is null (could happen if auth fails)
        if (!response) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        if (response.status === 401) {
          // Unauthorized, redirect to login
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          // Try to get more details from the response body
          let errorDetails = `Status: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorDetails += ` - ${errorData.error || JSON.stringify(errorData)}`;
          } catch (jsonError) {
            // If response body is not JSON or empty
            errorDetails += ' - No details in response body';
          }
          console.error('API Error Response:', errorDetails); // Log the detailed error
          throw new Error(`Failed to fetch projects. ${errorDetails}`); // Include details in thrown error
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects (catch block):', err); // Log the caught error
        setError(err instanceof Error ? err.message : 'Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch projects when user is available or refreshTrigger changes
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