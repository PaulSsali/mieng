"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Download,
  Edit,
  FileText,
  MoreVertical,
  PlusCircle,
  Search,
  Sparkles,
  Eye,
  Send,
  Calendar,
  Layers,
  Copy,
  Share,
  Trash
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { GenerateReportDialog } from "@/components/reports/GenerateReportDialog"

// Report type definition
interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  projects: {
    id: string;
    name: string;
  }[];
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch reports from API
  useEffect(() => {
    async function fetchReports() {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch('/api/reports');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReports();
  }, [user]);

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort reports based on selected sort option
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "date-asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const handleUpdateClick = (report: Report) => {
    setSelectedReport(report)
    setIsUpdateModalOpen(true)
  }

  const handleExportClick = (report: Report) => {
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
              <Button className="w-full md:w-auto" onClick={() => setIsGenerateModalOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
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
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">Loading reports...</div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
            ) : sortedReports.length > 0 ? (
              <div className="grid gap-4">
                {sortedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    getStatusBadge={getStatusBadge}
                    onUpdateClick={handleUpdateClick}
                    onExportClick={handleExportClick}
                  />
                ))}
              </div>
            ) : (
              <ReportsEmptyState onCreateClick={() => setIsGenerateModalOpen(true)} />
            )}
          </div>
        </div>
      </main>

      {selectedReport && (
        <>
          <UpdateReportModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            report={selectedReport}
          />
          <ExportReportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            report={selectedReport}
          />
        </>
      )}
      
      <GenerateReportDialog 
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />
    </DashboardLayout>
  )
}

interface ReportCardProps {
  report: Report
  getStatusBadge: (status: string) => React.ReactNode
  onUpdateClick: (report: Report) => void
  onExportClick: (report: Report) => void
}

function ReportCard({ report, getStatusBadge, onUpdateClick, onExportClick }: ReportCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h3 className="font-semibold text-lg">{report.title}</h3>
              {getStatusBadge(report.status)}
            </div>
            <p className="text-gray-500 line-clamp-2">{report.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(report.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                {report.projects.length} {report.projects.length === 1 ? "project" : "projects"}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {report.type}
              </span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => onUpdateClick(report)}>
              <Edit className="h-4 w-4 mr-2" />
              <span className="sm:hidden md:inline">Update</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => onExportClick(report)}>
              <Download className="h-4 w-4 mr-2" />
              <span className="sm:hidden md:inline">Export</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ReportsEmptyStateProps {
  onCreateClick: () => void;
}

function ReportsEmptyState({ onCreateClick }: ReportsEmptyStateProps) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center py-16 text-center">
      <div className="flex flex-col items-center max-w-md">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
        <p className="text-gray-500 mb-6">
          Create your first report using our AI engine to generate professional reports based on your projects and engineering experience.
        </p>
        <Button size="lg" onClick={onCreateClick}>
          <Sparkles className="mr-2 h-5 w-5" />
          Create New Report
        </Button>
      </div>
    </Card>
  )
} 