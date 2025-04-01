import { ChevronRight, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ReportExampleCardProps {
  title: string
  description: string
  outcomes: number[]
  url: string
}

export function ReportExampleCard({ title, description, outcomes, url }: ReportExampleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex -space-x-1">
            {outcomes.slice(0, 3).map((outcome) => (
              <div 
                key={outcome}
                className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border border-background"
              >
                {outcome}
              </div>
            ))}
            {outcomes.length > 3 && (
              <div className="bg-gray-100 text-gray-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border border-background">
                +{outcomes.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter>
        <Link href={url} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <span>View Example</span>
            <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 