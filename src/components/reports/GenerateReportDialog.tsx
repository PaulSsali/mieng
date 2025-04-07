"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Steps, Step } from "@/components/ui/steps"
import { Sparkles, Loader2, FileText, PlusCircle, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Define Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  discipline: string;
  role: string;
  company: string;
  outcomes: number[];
}

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateReportDialog({ isOpen, onClose }: GenerateReportDialogProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [reportType, setReportType] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [generatingStatus, setGeneratingStatus] = useState<"idle" | "analyzing" | "formatting" | "saving" | "completed" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [showOutcomesAlert, setShowOutcomesAlert] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setReportType("");
      setSelectedProjects([]);
      setGeneratingStatus("idle");
      setProgress(0);
      setShowOutcomesAlert(false);
      setPendingAction(null);
    }
  }, [isOpen]);

  // Fetch projects data
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects')
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        
        // Add random outcomes to projects for demo purposes
        // In a real app, these would come from the API
        const projectsWithOutcomes = data.map((project: Project) => ({
          ...project,
          outcomes: generateRandomOutcomes()
        }))
        
        setProjects(projectsWithOutcomes)
        setError(null)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    // Helper function to generate random ECSA outcomes
    const generateRandomOutcomes = () => {
      const numOutcomes = Math.floor(Math.random() * 6) + 2 // 2-7 outcomes
      const allOutcomes = Array.from({ length: 11 }, (_, i) => i + 1)
      const shuffled = [...allOutcomes].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, numOutcomes).sort((a, b) => a - b)
    }
    
    fetchProjects()
  }, [isOpen])

  // Simulate progress updates during generation
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (generatingStatus === "analyzing") {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 40) {
            setGeneratingStatus("formatting")
            return 40
          }
          return newProgress
        })
      }, 150)
    } else if (generatingStatus === "formatting") {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 3
          if (newProgress >= 80) {
            setGeneratingStatus("saving")
            return 80
          }
          return newProgress
        })
      }, 150)
    } else if (generatingStatus === "saving") {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 100) {
            setGeneratingStatus("completed")
            return 100
          }
          return newProgress
        })
      }, 150)
    }
    
    return () => clearInterval(interval)
  }, [generatingStatus])

  // Handle the report generation workflow
  const handleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev) => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleNextStep = () => {
    if (step === 1 && reportType) {
      setStep(2)
    } else if (step === 2 && selectedProjects.length > 0) {
      // Check if it's an Engineering Report and not all outcomes are covered
      if (reportType === "Engineering" && combinedOutcomes.length < 11) {
        setShowOutcomesAlert(true)
        setPendingAction(() => () => {
          setStep(3)
          startGeneration()
        })
      } else {
        setStep(3)
        startGeneration()
      }
    }
  }

  const startGeneration = () => {
    setGeneratingStatus("analyzing")
    setProgress(0)
    
    // After generation complete, simulate the new report creation
    // In a real app, this would use the API to create a report
    setTimeout(() => {
      router.push("/reports")
      onClose()
    }, 10000) // Navigate after 10 seconds
  }

  const getStatusText = () => {
    switch (generatingStatus) {
      case "analyzing":
        return "Analyzing your projects with DeepSeek R1..."
      case "formatting":
        return "Formatting report structure with Claude..."
      case "saving":
        return "Saving your report..."
      case "completed":
        return "Report generated successfully!"
      case "error":
        return "An error occurred during generation."
      default:
        return ""
    }
  }

  // Calculate combined ECSA outcomes from selected projects
  const combinedOutcomes = Array.from(
    new Set(
      selectedProjects.flatMap(projectId => 
        projects.find(p => p.id === projectId)?.outcomes || []
      )
    )
  ).sort((a, b) => a - b)

  const handleContinueGeneration = () => {
    setShowOutcomesAlert(false)
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  const handleSelectMoreProjects = () => {
    setShowOutcomesAlert(false)
    setPendingAction(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generate New Report</DialogTitle>
          <DialogDescription>
            Our AI will analyze your projects and generate a professional engineering report
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 mb-8">
          <Steps currentStep={step}>
            <Step title="Select Report Type" />
            <Step title="Choose Projects" />
            <Step title="Generate Report" />
          </Steps>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Report Type</CardTitle>
                <CardDescription>Choose the type of report you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={reportType} 
                  onValueChange={setReportType}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-3 border p-5 rounded-md cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="TER" id="ter" />
                    <div className="space-y-2 flex-1">
                      <Label 
                        htmlFor="ter" 
                        className="text-base font-semibold cursor-pointer"
                      >
                        Training & Experience Report
                      </Label>
                      <p className="text-sm text-gray-500">
                        Comprehensive summary of your professional growth, learning, and practical experience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 border p-5 rounded-md cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="Engineering" id="engineering" />
                    <div className="space-y-2 flex-1">
                      <Label 
                        htmlFor="engineering" 
                        className="text-base font-semibold cursor-pointer"
                      >
                        Engineering Report
                      </Label>
                      <p className="text-sm text-gray-500">
                        Detailed technical documentation of your engineering work, methodologies, and outcomes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 border p-5 rounded-md cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="Progress" id="progress" />
                    <div className="space-y-2 flex-1">
                      <Label 
                        htmlFor="progress" 
                        className="text-base font-semibold cursor-pointer"
                      >
                        Progress Report
                      </Label>
                      <p className="text-sm text-gray-500">
                        Overview of milestones achieved and competencies developed over time.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!reportType}
                className={!reportType ? "opacity-50 cursor-not-allowed" : ""}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Projects to Include</CardTitle>
                <CardDescription>Choose the projects you want to include in your {reportType} Report</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p>Loading your projects...</p>
                  </div>
                ) : error ? (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                    <p className="text-center text-red-500">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-center text-gray-500">
                      You don't have any projects yet. Add some projects first.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => router.push("/projects/new")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`border rounded-md p-4 transition-colors ${
                          selectedProjects.includes(project.id)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleProjectSelection(project.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={() => handleProjectSelection(project.id)}
                            id={`project-${project.id}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`project-${project.id}`}
                              className="text-base font-medium cursor-pointer"
                            >
                              {project.name}
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              {project.company} • {project.discipline}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {new Date(project.startDate).toLocaleDateString()} - 
                              {project.endDate 
                                ? new Date(project.endDate).toLocaleDateString() 
                                : "Present"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.outcomes.map((outcome) => (
                                <span
                                  key={outcome}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                                >
                                  ECSA {outcome}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {reportType === "Engineering" && (
              <Card>
                <CardHeader>
                  <CardTitle>ECSA Outcomes Coverage</CardTitle>
                  <CardDescription>
                    The selected projects cover {combinedOutcomes.length} out of 11 ECSA outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((outcome) => (
                      <span
                        key={outcome}
                        className={`text-sm px-3 py-1 rounded-full ${
                          combinedOutcomes.includes(outcome)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {combinedOutcomes.includes(outcome) && (
                          <CheckCircle className="inline h-3 w-3 mr-1" />
                        )}
                        Outcome {outcome}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={selectedProjects.length === 0}
                className={selectedProjects.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
              >
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generating Your Report</CardTitle>
                <CardDescription>
                  {generatingStatus === "completed"
                    ? "Your report has been successfully generated"
                    : "Our AI is preparing your report. This may take a few minutes."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {getStatusText()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />

                  <div className="pt-6 flex justify-center">
                    {generatingStatus === "completed" ? (
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    ) : (
                      <div className="relative h-16 w-16">
                        <Sparkles className="h-16 w-16 text-primary opacity-20" />
                        <Loader2 className="absolute inset-0 h-16 w-16 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              {generatingStatus === "completed" ? (
                <Button onClick={onClose}>
                  Close
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Outcomes alert dialog */}
        <Dialog open={showOutcomesAlert} onOpenChange={setShowOutcomesAlert}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Missing ECSA Outcomes</DialogTitle>
              <DialogDescription>
                Your selected projects cover only {combinedOutcomes.length} out of 11 ECSA outcomes.
                For a complete Engineering Report, all outcomes should be represented.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="outline" onClick={handleSelectMoreProjects}>
                Select More Projects
              </Button>
              <Button onClick={handleContinueGeneration}>
                Continue Anyway
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
} 