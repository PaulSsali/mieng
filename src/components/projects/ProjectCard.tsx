import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Image from "next/image"

interface ProjectCardProps {
  project: {
    id: number
    name: string
    description: string
    startDate: string
    endDate: string
    status: "In Progress" | "Completed" | "Pending Review"
    discipline: string
    role: string
    company: string
    image?: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <div className="aspect-video relative">
        <Image 
          src={project.image || "/placeholder-project.jpg"}
          alt={project.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.company}</p>
          </div>
          <Badge>{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p>{project.discipline}</p>
            <p>{project.role}</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 