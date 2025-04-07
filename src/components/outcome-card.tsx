import { CheckCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Outcome {
  id: number
  title: string
  shortDescription: string
  description: string
  keywords: string[]
  recommendedActions: string[]
}

interface OutcomeCardProps {
  outcome: Outcome
  isComplete: boolean
  onClick: () => void
}

export function OutcomeCard({ outcome, isComplete, onClick }: OutcomeCardProps) {
  return (
    <Card className={`${isComplete ? "border-green-200" : "border-amber-200"} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={`${
                isComplete ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
              } h-7 w-7 rounded-full flex items-center justify-center font-medium text-sm`}
            >
              {outcome.id}
            </div>
            <h3 className="font-semibold">{outcome.title}</h3>
          </div>
          {isComplete && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{outcome.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {outcome.keywords.slice(0, 3).map((keyword, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {keyword}
            </span>
          ))}
          {outcome.keywords.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{outcome.keywords.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-primary"
          onClick={onClick}
        >
          <span>View Details</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 