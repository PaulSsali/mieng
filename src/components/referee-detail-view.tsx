import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Referee, Review } from "@/lib/referee-service"

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface RefereeDetailViewProps {
  referee: Referee;
  projects: Project[];
  onContactClick: () => void;
  onProjectsClick: () => void;
  onEditClick: () => void;
}

export function RefereeDetailView({
  referee,
  projects,
  onContactClick,
  onProjectsClick,
  onEditClick,
}: RefereeDetailViewProps) {
  // Split the name into first and last name for display
  const nameParts = referee.name.split(' ');
  const firstName = nameParts.shift() || "";
  const lastName = nameParts.join(' ');
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              {referee.name}
            </h3>
            <p className="text-gray-600">
              {referee.title}, {referee.company}
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 text-sm">
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Email:</p>
            <p className="font-medium">{referee.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <p className="text-gray-500">Phone:</p>
            <p className="font-medium">{referee.phone}</p>
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
        
        <div>
          <h4 className="text-sm font-medium mb-2">Reviews</h4>
          {referee.reviews && referee.reviews.length > 0 ? (
            <ul className="text-sm space-y-2">
              {referee.reviews.map((review) => (
                <li key={review.id} className="flex items-center justify-between">
                  <span>{review.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      review.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : review.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {review.status}
                    {review.date && ` • ${review.date}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No reviews yet</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-6 pt-0 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEditClick}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onProjectsClick}>
            Projects
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onContactClick}>
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 