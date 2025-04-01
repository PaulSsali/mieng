import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface Review {
  id: number
  name: string
  status: string
  date?: string
}

interface RefereeDetailViewProps {
  referee: {
    id: number
    title: string
    firstName: string
    lastName: string
    qualifications: string
    email: string
    phone: string
    position: string
    company: string
    registrationType: string
    registrationNumber: string
    notes: string
    status: string
    projectIds: number[]
    reviews: Review[]
  }
  projects: Project[]
  reviews: Review[]
  onEdit: () => void
  onDelete: () => void
  onAssociateProjects: () => void
  onContact: () => void
  children: React.ReactNode
}

export function RefereeDetailView({
  referee,
  projects,
  reviews,
  onEdit,
  onDelete,
  onAssociateProjects,
  onContact,
  children,
}: RefereeDetailViewProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {children}
        
        <div className="grid gap-4 text-sm">
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Email:</p>
            <p className="font-medium">{referee.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Phone:</p>
            <p className="font-medium">{referee.phone}</p>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Qualification:</p>
            <p className="font-medium">{referee.title} {referee.qualifications}</p>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Registration:</p>
            <p className="font-medium">{referee.registrationType} #{referee.registrationNumber}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Associated Projects ({projects.length})</h4>
          {projects.length > 0 ? (
            <ul className="text-sm space-y-1">
              {projects.map((project) => (
                <li key={project.id} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="truncate">{project.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No projects associated yet</p>
          )}
        </div>
        
        {referee.notes && (
          <div>
            <h4 className="text-sm font-medium mb-2">Notes</h4>
            <p className="text-sm text-gray-600">{referee.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-6 pt-0 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onAssociateProjects}>
            Projects
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={onDelete}>
            Delete
          </Button>
          <Button size="sm" onClick={onContact}>
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 