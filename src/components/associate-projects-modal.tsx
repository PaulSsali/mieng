import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Referee } from "@/lib/referee-service"

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface AssociateProjectsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referee: Referee
  allProjects: Project[]
  selectedProjectIds: number[]
  onSave: (projectIds: number[]) => void
}

export function AssociateProjectsModal({
  open,
  onOpenChange,
  referee,
  allProjects,
  selectedProjectIds,
  onSave,
}: AssociateProjectsModalProps) {
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    // Initialize selection when modal is opened
    if (open) {
      setSelected(selectedProjectIds)
    }
  }, [open, selectedProjectIds])

  const handleToggleProject = (projectId: number) => {
    setSelected((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleSubmit = () => {
    onSave(selected)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xl my-4 max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Associate Projects with {referee.name}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <p className="text-sm text-gray-500 mb-4">
            Select the projects that this referee has been involved with or can verify:
          </p>

          <div className="space-y-3">
            {allProjects.length > 0 ? (
              allProjects.map((project) => (
                <div key={project.id} className="flex items-start gap-3 border p-3 rounded-md hover:bg-gray-50">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={selected.includes(project.id)}
                    onCheckedChange={() => handleToggleProject(project.id)}
                    className="mt-1"
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={`project-${project.id}`} className="font-medium cursor-pointer">
                      {project.name}
                    </Label>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <p className="text-xs text-gray-400">
                      {project.startDate} - {project.endDate} • {project.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No projects available.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Associations
          </Button>
        </div>
      </div>
    </div>
  )
} 