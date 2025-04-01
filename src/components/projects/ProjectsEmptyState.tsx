import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function ProjectsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">No projects found</h3>
        <p className="text-muted-foreground">
          Get started by creating your first project
        </p>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>
    </div>
  )
} 