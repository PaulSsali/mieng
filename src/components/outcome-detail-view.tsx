import { ArrowLeft, Check, ChevronRight, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Outcome {
  id: number
  title: string
  shortDescription: string
  description: string
  keywords: string[]
  recommendedActions: string[]
  examples?: {
    title: string
    description: string
  }[]
  resources?: {
    title: string
    link: string
    type: "download" | "external"
  }[]
}

interface OutcomeDetailViewProps {
  outcome: Outcome
  onBack: () => void
}

export function OutcomeDetailView({ outcome, onBack }: OutcomeDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Outcome {outcome.id}: {outcome.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{outcome.description}</p>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-1">
              {outcome.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demonstration Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            To demonstrate competence in this outcome, you should provide specific examples from your engineering experience. Here are some guidelines:
          </p>
          
          <div className="space-y-3">
            {outcome.recommendedActions.map((action, i) => (
              <div key={i} className="flex gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {outcome.examples && outcome.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outcome.examples.map((example, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">{example.title}</h3>
                <p className="text-sm text-gray-700">{example.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {outcome.resources && outcome.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {outcome.resources.map((resource, i) => (
                <a 
                  key={i}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium">{resource.title}</span>
                  {resource.type === "download" ? (
                    <Download className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  )}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Related Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Consider adding projects that demonstrate this outcome. Here are some project types that commonly demonstrate this outcome:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Design Projects</p>
                <p className="text-sm text-gray-600">Projects involving detailed design work, calculations, and specifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Analysis Work</p>
                <p className="text-sm text-gray-600">Projects requiring in-depth analysis, simulation, or modeling.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Implementation Projects</p>
                <p className="text-sm text-gray-600">Projects where you managed the implementation of engineering solutions.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Add New Project Demonstrating This Outcome
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 