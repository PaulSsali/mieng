"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainHeader } from "@/components/MainHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Steps, Step } from "@/components/ui/steps"
import { Sparkles, Loader2, FileText, PlusCircle, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/DashboardLayout"

// Mock project data
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Bridge Construction Project",
    description: "Design and supervision of a 100m bridge construction",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "In Progress",
    discipline: "Civil Engineering",
    role: "Project Engineer",
    company: "Engineering Corp",
    outcomes: [1, 2, 3, 5]
  },
  {
    id: 2,
    name: "Industrial Plant Upgrade",
    description: "Mechanical systems upgrade for improved efficiency",
    startDate: "2023-06-01",
    endDate: "2024-03-31",
    status: "In Progress",
    discipline: "Mechanical Engineering",
    role: "Lead Engineer",
    company: "Manufacturing Co",
    outcomes: [1, 2, 4, 5, 7]
  },
  {
    id: 3,
    name: "Power Grid Optimization",
    description: "Smart grid implementation for better power distribution",
    startDate: "2023-03-15",
    endDate: "2023-09-30",
    status: "Completed",
    discipline: "Electrical Engineering",
    role: "Senior Engineer",
    company: "Power Solutions Inc",
    outcomes: [2, 3, 4, 5, 8]
  },
  {
    id: 4,
    name: "Building Safety Assessment",
    description: "Comprehensive safety assessment of commercial structures",
    startDate: "2024-01-10",
    endDate: "2024-05-30",
    status: "Pending Review",
    discipline: "Structural Engineering",
    role: "Safety Engineer",
    company: "Engineering Corp",
    outcomes: [3, 4, 6, 10]
  },
  {
    id: 5,
    name: "Environmental Impact Assessment",
    description: "EIA for a proposed development project",
    startDate: "2023-08-15",
    endDate: "2023-11-30",
    status: "Completed",
    discipline: "Environmental Engineering",
    role: "Environmental Engineer",
    company: "Eco Consultants",
    outcomes: [4, 7, 10, 11]
  }
]

export default function GenerateReportPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [reportType, setReportType] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [generatingStatus, setGeneratingStatus] = useState<"idle" | "analyzing" | "formatting" | "saving" | "completed" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [showOutcomesAlert, setShowOutcomesAlert] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

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
  const handleProjectSelection = (projectId: number) => {
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
        MOCK_PROJECTS.find(p => p.id === projectId)?.outcomes || []
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
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Generate New Report</h1>
            <p className="text-gray-500">
              Our AI will analyze your projects and generate a professional engineering report
            </p>
          </div>

          <div className="mb-10">
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
                          className="text-base font-medium cursor-pointer"
                        >
                          Training Experience Report (TER)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Comprehensive report documenting a period of your professional training experience.
                          Ideal for ECSA registration process.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 border p-5 rounded-md cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="Engineering" id="engineering" />
                      <div className="space-y-2 flex-1">
                        <Label 
                          htmlFor="engineering" 
                          className="text-base font-medium cursor-pointer"
                        >
                          Engineering Report
                        </Label>
                        <p className="text-sm text-gray-500">
                          Report focused on demonstrating specific engineering outcomes across multiple projects.
                          Structured to highlight technical competencies and solutions.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-center md:justify-end">
                <Button 
                  onClick={handleNextStep}
                  disabled={!reportType}
                  className="w-full md:w-auto"
                >
                  Continue to Select Projects
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Projects to Include</CardTitle>
                  <CardDescription>Choose the projects you want to include in your {reportType} report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {MOCK_PROJECTS.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No projects found</h3>
                        <p className="text-sm text-gray-500 mb-5">You need to create projects before generating a report</p>
                        <Button asChild>
                          <Link href="/projects/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Project
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="space-y-4 mb-8">
                          {MOCK_PROJECTS.map(project => (
                            <div key={project.id} className="flex items-start space-x-3 border p-4 rounded-md hover:bg-gray-50">
                              <Checkbox 
                                id={`project-${project.id}`} 
                                checked={selectedProjects.includes(project.id)}
                                onCheckedChange={() => handleProjectSelection(project.id)}
                                className="mt-1"
                              />
                              <div className="space-y-1 flex-1">
                                <Label 
                                  htmlFor={`project-${project.id}`}
                                  className="text-base font-medium cursor-pointer"
                                >
                                  {project.name}
                                </Label>
                                <p className="text-sm text-gray-500">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    {project.discipline}
                                  </span>
                                  <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    {project.role}
                                  </span>
                                  <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    {project.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedProjects.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium mb-2">ECSA Outcomes Coverage</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {combinedOutcomes.map(outcome => (
                                <span key={outcome} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                                  Outcome {outcome}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              {combinedOutcomes.length} of 11 ECSA outcomes covered by selected projects
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="w-full md:w-auto"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  disabled={selectedProjects.length === 0}
                  className="w-full md:w-auto"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Generating Your {reportType} Report</CardTitle>
                <CardDescription>
                  Our AI is analyzing your projects and creating a professional report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{getStatusText()}</p>
                    <p className="text-sm text-gray-500">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${generatingStatus === "analyzing" ? "bg-blue-500 text-white" : generatingStatus === "formatting" || generatingStatus === "saving" || generatingStatus === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                      {generatingStatus === "analyzing" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : generatingStatus === "formatting" || generatingStatus === "saving" || generatingStatus === "completed" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">1</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Analyzing projects with DeepSeek R1</p>
                      <p className="text-xs text-gray-500">
                        Examining project details and matching against ECSA requirements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${generatingStatus === "formatting" ? "bg-blue-500 text-white" : generatingStatus === "saving" || generatingStatus === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                      {generatingStatus === "formatting" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : generatingStatus === "saving" || generatingStatus === "completed" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">2</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Formatting report with Claude</p>
                      <p className="text-xs text-gray-500">
                        Structuring content according to {reportType} report standards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${generatingStatus === "saving" ? "bg-blue-500 text-white" : generatingStatus === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                      {generatingStatus === "saving" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : generatingStatus === "completed" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">3</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Saving your report</p>
                      <p className="text-xs text-gray-500">
                        Creating the final report and saving to your account
                      </p>
                    </div>
                  </div>
                </div>

                {generatingStatus === "completed" && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-4 flex flex-col md:flex-row items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Report generated successfully!</p>
                      <p className="text-xs text-green-600 mb-3">
                        Your {reportType} report has been created and saved as a draft.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" onClick={() => router.push("/reports")}>
                          View All Reports
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                          Generate Another
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {generatingStatus === "error" && (
                  <div className="bg-red-50 border border-red-100 rounded-md p-4 flex flex-col md:flex-row items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error generating report</p>
                      <p className="text-xs text-red-600 mb-3">
                        We encountered an issue while generating your report. Please try again.
                      </p>
                      <Button size="sm" variant="outline" onClick={() => startGeneration()}>
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={showOutcomesAlert} onOpenChange={setShowOutcomesAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Incomplete ECSA Outcomes Coverage
            </DialogTitle>
            <DialogDescription className="pt-2">
              Your selected projects only cover {combinedOutcomes.length} out of 11 required ECSA outcomes.
              The AI will generate the report based on the experience you've provided, but you may want to consider adding more projects to demonstrate all required outcomes.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Covered Outcomes:</p>
              <div className="flex flex-wrap gap-1">
                {combinedOutcomes.map(outcome => (
                  <span key={outcome} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                    Outcome {outcome}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Missing Outcomes:</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 11 }, (_, i) => i + 1)
                  .filter(outcome => !combinedOutcomes.includes(outcome))
                  .map(outcome => (
                    <span key={outcome} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                      Outcome {outcome}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between">
            <Button
              variant="outline"
              onClick={handleSelectMoreProjects}
              className="w-full sm:w-auto"
            >
              Select More Projects
            </Button>
            <Button
              onClick={handleContinueGeneration}
              className="w-full sm:w-auto"
            >
              Continue with Current Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
} 