"use client"

import { useState } from "react"
import Link from "next/link"
import { MainHeader } from "@/components/MainHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Search,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Filter,
  ArrowUp,
  ListFilter,
} from "lucide-react"
import { outcomeData } from "@/lib/outcome-data"
import { OutcomeCard } from "@/components/outcome-card"
import { OutcomeDetailView } from "@/components/outcome-detail-view"
import { ReportExampleCard } from "@/components/report-example-card"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Badge } from "@/components/ui/badge"

export default function OutcomesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showCompletedOnly, setShowCompletedOnly] = useState(false)
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false)

  // Calculate user's progress
  const userProgress = {
    completedOutcomes: 9,
    totalOutcomes: 11,
    percentComplete: (9 / 11) * 100,
    outcomeStatus: [
      { id: 1, status: "complete" },
      { id: 2, status: "complete" },
      { id: 3, status: "complete" },
      { id: 4, status: "complete" },
      { id: 5, status: "complete" },
      { id: 6, status: "complete" },
      { id: 7, status: "complete" },
      { id: 8, status: "complete" },
      { id: 9, status: "complete" },
      { id: 10, status: "incomplete" },
      { id: 11, status: "incomplete" },
    ],
  }

  // Filter outcomes based on search query and completion status
  const filteredOutcomes = outcomeData.filter(
    (outcome) => {
      const matchesSearch = 
        outcome.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outcome.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outcome.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCompletionFilter = 
        (showCompletedOnly && userProgress.outcomeStatus.find(o => o.id === outcome.id)?.status === "complete") ||
        (showIncompleteOnly && userProgress.outcomeStatus.find(o => o.id === outcome.id)?.status !== "complete") ||
        (!showCompletedOnly && !showIncompleteOnly);
      
      return matchesSearch && matchesCompletionFilter;
    }
  )

  const clearFilters = () => {
    setShowCompletedOnly(false);
    setShowIncompleteOnly(false);
  }

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
              <div>
                <h1 className="text-3xl font-bold">ECSA Outcomes</h1>
                <p className="text-muted-foreground mt-1">
                  Understanding the 11 outcomes required for ECSA professional registration
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/reports/generate">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </Link>
              </div>
            </div>

            {/* Progress summary card */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-primary text-primary-foreground p-4">
                <h2 className="text-xl font-semibold">Your Progress</h2>
                <p className="text-primary-foreground/80 text-sm">Complete all 11 outcomes to qualify for ECSA registration</p>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Progress bar */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {userProgress.completedOutcomes} of {userProgress.totalOutcomes} Outcomes Complete
                      </span>
                      <Badge variant={userProgress.percentComplete === 100 ? "secondary" : "outline"}>
                        {userProgress.percentComplete}% Complete
                      </Badge>
                    </div>
                    <Progress value={userProgress.percentComplete} className="h-3" />
                    
                    <div className="grid grid-cols-11 gap-1 mt-6">
                      {userProgress.outcomeStatus.map((outcome) => (
                        <button
                          key={outcome.id}
                          onClick={() => {
                            setSelectedOutcome(outcome.id);
                            setActiveTab("detail");
                          }}
                          className={`h-10 w-full flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 ${
                            outcome.status === "complete"
                              ? "bg-green-500 text-white"
                              : "bg-amber-200 text-amber-800"
                          }`}
                        >
                          {outcome.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-3 flex flex-col">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("recommendations")}>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {showIncompleteOnly ? "Show All Outcomes" : "Show Incomplete Outcomes"}
                    </Button>
                    <Link href="/outcomes/tracking" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Update Progress
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and filter bar */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search outcomes by keyword or description..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant={showCompletedOnly ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    setShowCompletedOnly(!showCompletedOnly);
                    setShowIncompleteOnly(false);
                  }}
                  className="flex-1 md:flex-none"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </Button>
                <Button 
                  variant={showIncompleteOnly ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    setShowIncompleteOnly(!showIncompleteOnly);
                    setShowCompletedOnly(false);
                  }}
                  className="flex-1 md:flex-none"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Incomplete
                </Button>
                {(showCompletedOnly || showIncompleteOnly) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {filteredOutcomes.length === 0 && (
              <div className="py-8 text-center bg-gray-50 rounded-lg">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">No outcomes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  clearFilters();
                }}>
                  Reset search and filters
                </Button>
              </div>
            )}

            {/* Tabs content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detail">Details</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredOutcomes.map((outcome) => (
                    <OutcomeCard
                      key={outcome.id}
                      outcome={outcome}
                      isComplete={userProgress.outcomeStatus.find((o) => o.id === outcome.id)?.status === "complete"}
                      onClick={() => {
                        setSelectedOutcome(outcome.id)
                        setActiveTab("detail")
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="detail" className="mt-6">
                {selectedOutcome ? (
                  <OutcomeDetailView
                    outcome={outcomeData.find((o) => o.id === selectedOutcome)!}
                    onBack={() => setSelectedOutcome(null)}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold mb-2">ECSA Outcomes Detailed Information</h2>
                      <p className="text-muted-foreground mb-6">
                        Select an outcome to view its complete details, including demonstration guidelines and resources.
                      </p>
                    </div>
                    
                    {filteredOutcomes.map((outcome) => (
                      <Card key={outcome.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className={`${
                          userProgress.outcomeStatus.find((o) => o.id === outcome.id)?.status === "complete"
                            ? "bg-green-50 border-b border-green-100"
                            : "bg-amber-50 border-b border-amber-100"
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`${
                                userProgress.outcomeStatus.find((o) => o.id === outcome.id)?.status === "complete"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-amber-100 text-amber-600"
                                } h-8 w-8 rounded-full flex items-center justify-center font-medium`}>
                                {outcome.id}
                              </div>
                              <CardTitle>{outcome.title}</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOutcome(outcome.id)}>
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-4">
                          <p className="text-sm">{outcome.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-amber-200 shadow-sm">
                    <CardHeader className="bg-amber-50">
                      <CardTitle>Incomplete Outcomes</CardTitle>
                      <CardDescription>Focus on these outcomes to complete your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5">
                      {outcomeData
                        .filter((outcome) => 
                          userProgress.outcomeStatus.find((o) => o.id === outcome.id)?.status !== "complete"
                        )
                        .map((outcome) => (
                          <div key={outcome.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                            <div className="bg-amber-100 text-amber-600 h-7 w-7 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                              {outcome.id}
                            </div>
                            <div>
                              <h4 className="font-medium">{outcome.title}</h4>
                              <p className="text-sm text-muted-foreground">{outcome.description}</p>
                              <div className="mt-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setSelectedOutcome(outcome.id)
                                  setActiveTab("detail")
                                }}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 shadow-sm">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Recommended Project Types</CardTitle>
                      <CardDescription>Projects that can help demonstrate missing outcomes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Professional Development Activities</h4>
                          <p className="text-sm text-muted-foreground">
                            Participate in courses or workshops related to engineering professionalism and ethics to cover Outcome 10.
                          </p>
                          <Button variant="link" size="sm" className="mt-1 px-0" onClick={() => {
                            setSelectedOutcome(10)
                            setActiveTab("detail")
                          }}>
                            View Outcome 10 →
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Project Management Role</h4>
                          <p className="text-sm text-muted-foreground">
                            Seek opportunities to manage project components, budgets, schedules, or teams to address Outcome 11.
                          </p>
                          <Button variant="link" size="sm" className="mt-1 px-0" onClick={() => {
                            setSelectedOutcome(11)
                            setActiveTab("detail")
                          }}>
                            View Outcome 11 →
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Documentation Examples</h4>
                          <p className="text-sm text-muted-foreground">
                            Example report templates that effectively demonstrate professionalism and management skills.
                          </p>
                          <div className="mt-2">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download Templates
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="bg-gray-50">
                      <CardTitle>Report Examples</CardTitle>
                      <CardDescription>Sample reports demonstrating effective outcome coverage</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <ReportExampleCard 
                          title="Engineering Ethics Case Study"
                          description="Example demonstrating Outcome 10: Engineering Professionalism"
                          outcomes={[10]}
                          url="#"
                        />
                        <ReportExampleCard 
                          title="Project Management Report"
                          description="Example demonstrating Outcome 11: Engineering Management"
                          outcomes={[11]}
                          url="#"
                        />
                        <ReportExampleCard 
                          title="Comprehensive Engineering Report"
                          description="Example demonstrating multiple outcomes including ethical considerations"
                          outcomes={[5, 8, 10, 11]}
                          url="#"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button variant="outline" className="w-full">
                        View All Example Reports
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
} 