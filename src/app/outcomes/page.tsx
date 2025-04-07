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
} from "lucide-react"
import { outcomeData } from "@/lib/outcome-data"
import { OutcomeCard } from "@/components/outcome-card"
import { OutcomeDetailView } from "@/components/outcome-detail-view"
import { ReportExampleCard } from "@/components/report-example-card"
import { DashboardLayout } from "@/components/DashboardLayout"

export default function OutcomesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter outcomes based on search query
  const filteredOutcomes = outcomeData.filter(
    (outcome) =>
      outcome.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outcome.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outcome.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Tracking your ECSA outcomes coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {userProgress.completedOutcomes}/{userProgress.totalOutcomes} Outcomes
                    </span>
                    <span className="text-sm font-medium">{userProgress.percentComplete}%</span>
                  </div>
                  <Progress value={userProgress.percentComplete} className="h-2" />

                  <div className="grid grid-cols-11 gap-1 mt-4">
                    {userProgress.outcomeStatus.map((outcome) => (
                      <div
                        key={outcome.id}
                        className={`h-8 w-full flex items-center justify-center rounded-md text-xs font-medium ${
                          outcome.status === "complete"
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {outcome.id}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("recommendations")}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>ECSA Registration Requirements</CardTitle>
                  <CardDescription>Key information about professional registration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      The Engineering Council of South Africa (ECSA) requires candidates to demonstrate competence
                      across 11 outcomes for professional registration. These outcomes ensure that registered engineers
                      have the necessary skills and knowledge to practice safely and effectively.
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Minimum Experience Requirements</p>
                        <p className="text-sm text-muted-foreground">
                          At least 3 years of relevant post-qualification experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Training and Experience Reports (TERs)</p>
                        <p className="text-sm text-muted-foreground">
                          Detailed documentation of your engineering experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Engineering Report</p>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive report demonstrating your competence across all 11 outcomes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href="https://www.ecsa.co.za/register/SitePages/Professional.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      ECSA Official Requirements
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search outcomes by keyword or description..."
                className="pl-8 w-full md:w-96"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detail">Detailed Information</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="space-y-8">
                    <div className="prose max-w-none">
                      <h2>ECSA Outcomes Detailed Information</h2>
                      <p className="text-muted-foreground">
                        This section provides comprehensive information about all ECSA outcomes. 
                        Select an outcome to view its complete details.
                      </p>
                    </div>
                    
                    {filteredOutcomes.map((outcome) => (
                      <Card key={outcome.id} className="overflow-hidden">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Incomplete Outcomes</CardTitle>
                      <CardDescription>Focus on these outcomes to complete your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {outcomeData
                        .filter((outcome) => 
                          userProgress.outcomeStatus.find((o) => o.id === outcome.id)?.status !== "complete"
                        )
                        .map((outcome) => (
                          <div key={outcome.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                            <div className="bg-amber-100 text-amber-600 h-7 w-7 rounded-full flex items-center justify-center font-medium text-sm">
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Project Types</CardTitle>
                      <CardDescription>Projects that can help demonstrate missing outcomes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="rounded-full bg-primary/10 p-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Professional Development Activities</h4>
                          <p className="text-sm text-muted-foreground">
                            Participate in courses or workshops related to engineering professionalism and ethics to cover Outcome 10.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="rounded-full bg-primary/10 p-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Project Management Role</h4>
                          <p className="text-sm text-muted-foreground">
                            Seek opportunities to manage project components, budgets, schedules, or teams to address Outcome 11.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
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

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Report Examples</CardTitle>
                      <CardDescription>Sample reports demonstrating effective outcome coverage</CardDescription>
                    </CardHeader>
                    <CardContent>
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