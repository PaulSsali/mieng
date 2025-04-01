"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  ChevronDown,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Download,
  Send,
  Eye,
  ArrowUpDown,
  Sparkles,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MainHeader } from "@/components/MainHeader"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { UpdateReportModal } from "@/components/update-report-modal"
import { ExportReportModal } from "@/components/export-report-modal"
import { DashboardLayout } from "@/components/DashboardLayout"

// Sample report data
const MOCK_REPORTS = [
  {
    id: 1,
    title: "ECSA Outcomes Report",
    type: "Outcomes",
    creationDate: "Mar 28, 2025",
    lastUpdated: "Mar 30, 2025",
    status: "Draft",
    outcomes: [1, 2, 3, 4, 5, 6, 7],
    projects: ["Water Treatment Plant Upgrade", "Highway Expansion Project"],
    referee: "Pending Assignment",
    aiGenerated: true,
    description: "Comprehensive report covering 7 ECSA outcomes based on multiple projects",
    content: "# ECSA Outcomes Report\n\nThis report details my experience in meeting 7 ECSA outcomes through my work on multiple engineering projects..."
  },
  {
    id: 2,
    title: "Training Experience Report (TER) 2",
    type: "TER",
    creationDate: "Feb 15, 2025",
    lastUpdated: "Feb 20, 2025",
    status: "Submitted",
    outcomes: [1, 2, 3, 5, 6, 8],
    projects: ["Highway Expansion Project", "Bridge Design and Construction"],
    referee: "Robert Mkhize, Pr.Eng",
    aiGenerated: true,
    description: "TER covering the second year of professional experience",
    content: "# Training Experience Report (TER) 2\n\nThis report covers my second year of professional experience as an engineer..."
  },
  {
    id: 3,
    title: "Training Experience Report (TER) 1",
    type: "TER",
    creationDate: "Jul 10, 2024",
    lastUpdated: "Jul 15, 2024",
    status: "Approved",
    outcomes: [1, 2, 4, 5, 9],
    projects: ["Bridge Design and Construction", "Solar Power Installation"],
    referee: "Lisa Naidoo, Pr.Eng",
    aiGenerated: true,
    description: "TER covering the first year of professional experience",
    content: "# Training Experience Report (TER) 1\n\nThis report covers my first year of professional experience as an engineer..."
  },
  {
    id: 4,
    title: "Bridge Project Technical Report",
    type: "Technical",
    creationDate: "Jan 05, 2024",
    lastUpdated: "Jan 10, 2024",
    status: "Rejected",
    outcomes: [1, 2, 3],
    projects: ["Bridge Design and Construction"],
    referee: "Lisa Naidoo, Pr.Eng",
    aiGenerated: false,
    description: "Detailed technical report on bridge design methodology and implementation",
    content: "# Bridge Project Technical Report\n\nThis report outlines the technical aspects of the bridge design and construction project..."
  },
  {
    id: 5,
    title: "Environmental Impact Assessment Report",
    type: "Technical",
    creationDate: "May 20, 2025",
    lastUpdated: "May 22, 2025",
    status: "Draft",
    outcomes: [4, 7, 10],
    projects: ["Environmental Impact Assessment"],
    referee: "Pending Assignment",
    aiGenerated: true,
    description: "Report on environmental considerations and impact assessment methodologies",
    content: "# Environmental Impact Assessment Report\n\nThis report details the environmental impact assessment conducted for the proposed project..."
  },
]

export default function ReportsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Filter reports based on search query
  const filteredReports = MOCK_REPORTS.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort reports based on selected sort option
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "date-asc":
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const handleUpdateClick = (report: any) => {
    setSelectedReport(report)
    setIsUpdateModalOpen(true)
  }

  const handleExportClick = (report: any) => {
    setSelectedReport(report)
    setIsExportModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "Submitted":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Submitted
          </Badge>
        )
      case "Draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Edit className="h-3 w-3" />
            Draft
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Reports</h1>
              <Link href="/reports/generate">
                <Button className="w-full md:w-auto">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create New Report
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort by</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-4 md:inline-flex">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid gap-4">
                  {sortedReports.length === 0 ? (
                    <ReportsEmptyState />
                  ) : (
                    sortedReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        getStatusBadge={getStatusBadge}
                        onUpdateClick={handleUpdateClick}
                        onExportClick={handleExportClick}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="draft" className="mt-4">
                <div className="grid gap-4">
                  {sortedReports.filter((r) => r.status === "Draft").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium">No draft reports found</h3>
                      <p className="text-sm text-gray-500 mt-1">Create a new report to get started.</p>
                    </div>
                  ) : (
                    sortedReports
                      .filter((report) => report.status === "Draft")
                      .map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          getStatusBadge={getStatusBadge}
                          onUpdateClick={handleUpdateClick}
                          onExportClick={handleExportClick}
                        />
                      ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="submitted" className="mt-4">
                <div className="grid gap-4">
                  {sortedReports.filter((r) => r.status === "Submitted").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium">No submitted reports found</h3>
                      <p className="text-sm text-gray-500 mt-1">Submit a report for review by a referee.</p>
                    </div>
                  ) : (
                    sortedReports
                      .filter((report) => report.status === "Submitted")
                      .map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          getStatusBadge={getStatusBadge}
                          onUpdateClick={handleUpdateClick}
                          onExportClick={handleExportClick}
                        />
                      ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                <div className="grid gap-4">
                  {sortedReports.filter((r) => r.status === "Approved").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium">No approved reports found</h3>
                      <p className="text-sm text-gray-500 mt-1">Your approved reports will appear here.</p>
                    </div>
                  ) : (
                    sortedReports
                      .filter((report) => report.status === "Approved")
                      .map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          getStatusBadge={getStatusBadge}
                          onUpdateClick={handleUpdateClick}
                          onExportClick={handleExportClick}
                        />
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {selectedReport && (
        <>
          <UpdateReportModal
            report={selectedReport}
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
          />
          <ExportReportModal
            report={selectedReport}
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
        </>
      )}
    </DashboardLayout>
  )
}

interface ReportCardProps {
  report: any
  getStatusBadge: (status: string) => React.ReactNode
  onUpdateClick: (report: any) => void
  onExportClick: (report: any) => void
}

function ReportCard({ report, getStatusBadge, onUpdateClick, onExportClick }: ReportCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/award-icon.svg"
                    alt="Report"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">{report.title}</h3>
                {report.aiGenerated && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Generated
                  </Badge>
                )}
              </div>
              <div className="mt-2 md:mt-0">
                {getStatusBadge(report.status)}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">{report.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Report Type</p>
                <p className="text-sm font-medium">{report.type} Report</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">{report.lastUpdated}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Referee</p>
                <p className="text-sm font-medium">{report.referee}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Created On</p>
                <p className="text-sm font-medium">{report.creationDate}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">ECSA Outcomes</p>
                <span className="text-xs text-gray-500">{report.outcomes.length} of 11 covered</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {report.outcomes.map((outcome: number) => (
                  <Badge key={outcome} variant="outline" className="text-xs">
                    {outcome}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between items-center gap-2 p-4 md:p-6 bg-gray-50 md:border-l">
            <Button variant="default" size="sm" className="w-full" onClick={() => onUpdateClick(report)}>
              <Edit className="mr-2 h-4 w-4" />
              Update
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => onExportClick(report)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            {report.status === "Draft" && (
              <Button variant="outline" size="sm" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <FileText className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium">No reports found</h3>
      <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new report.</p>
      <Button className="mt-6" asChild>
        <Link href="/reports/generate">
          <Sparkles className="mr-2 h-4 w-4" />
          Create Your First Report
        </Link>
      </Button>
    </div>
  )
} 