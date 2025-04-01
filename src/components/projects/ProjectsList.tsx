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

interface ProjectsListProps {
  viewMode: "grid" | "list"
  searchQuery: string
  statusFilter: string
  companyFilter: string
}

type ProjectStatus = "In Progress" | "Completed" | "Pending Review";

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: ProjectStatus
  discipline: string
  role: string
  company: string
  image?: string
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Bridge Construction Project",
    description: "Design and supervision of a 100m bridge construction",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "In Progress",
    discipline: "Civil Engineering",
    role: "Project Engineer",
    company: "Engineering Corp",
  },
  {
    id: 2,
    name: "Industrial Plant Upgrade",
    description: "Mechanical systems upgrade for improved efficiency",
    startDate: "2023-06-01",
    endDate: "2024-03-31",
    status: "In Progress",
    discipline: "Mechanical Engineering",
    role: "Lead Engineer",
    company: "Manufacturing Co",
  },
  {
    id: 3,
    name: "Power Grid Optimization",
    description: "Smart grid implementation for better power distribution",
    startDate: "2023-03-15",
    endDate: "2023-09-30",
    status: "Completed",
    discipline: "Electrical Engineering",
    role: "Senior Engineer",
    company: "Power Solutions Inc",
  },
  {
    id: 4,
    name: "Building Safety Assessment",
    description: "Comprehensive safety assessment of commercial structures",
    startDate: "2024-01-10",
    endDate: "2024-05-30",
    status: "Pending Review",
    discipline: "Structural Engineering",
    role: "Safety Engineer",
    company: "Engineering Corp",
  }
]

export function ProjectsList({ viewMode, searchQuery, statusFilter, companyFilter }: ProjectsListProps) {
  // Filter projects based on search query and filters
  const filteredProjects = MOCK_PROJECTS.filter(project => {
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

  if (filteredProjects.length === 0) {
    return <ProjectsEmptyState />
  }

  if (viewMode === "list") {
    return (
      <div className="rounded-md border">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
} 