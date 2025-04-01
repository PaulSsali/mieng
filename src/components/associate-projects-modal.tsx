import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface Referee {
  id: number
  firstName: string
  lastName: string
  title?: string
  qualifications?: string
  email?: string
  phone?: string
  position?: string
  company?: string
  registrationType?: string
  registrationNumber?: string
  notes?: string
  status?: string
  projectIds?: number[]
  reviews?: any[]
}

interface AssociateProjectsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referee: Referee | null
  projects: Project[]
  selectedProjectIds: number[]
  onSave: (projectIds: number[]) => void
}

export function AssociateProjectsModal({
  open,
  onOpenChange,
  referee,
  projects,
  selectedProjectIds: initialSelectedProjectIds,
  onSave,
}: AssociateProjectsModalProps) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setSelectedProjectIds(initialSelectedProjectIds || [])
  }, [initialSelectedProjectIds, open])

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleToggleProject = (projectId: number) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(selectedProjectIds)
    onOpenChange(false)
  }

  if (!open || !referee) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
         onClick={(e) => {
           // Close modal when clicking outside
           if (e.target === e.currentTarget) onOpenChange(false);
         }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl my-4 max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-200"
           onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Associate Projects with Referee</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Select projects that {referee.firstName} {referee.lastName} has supervised or can provide testimony about.
              </p>
              
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="border rounded-md overflow-hidden mb-4">
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-start p-3 border-b last:border-0 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`project-${project.id}`}
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={() => handleToggleProject(project.id)}
                          className="mt-1 mr-3"
                        />
                        <label htmlFor={`project-${project.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.startDate} - {project.endDate}</div>
                          <div className="text-sm mt-1">{project.description}</div>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No projects match your search
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {selectedProjectIds.length} project{selectedProjectIds.length !== 1 ? "s" : ""} selected
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Associations
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 