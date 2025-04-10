"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from 'swr';
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
  Trash2
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
import { Skeleton } from "@/components/ui/skeleton"

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

// Fetcher function that accepts auth token
const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};

export default function ReportsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  
  // Get auth token when user changes
  useEffect(() => {
    const getToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
        } catch (error) {
          console.error("Failed to get auth token:", error);
        }
      }
    };
    
    getToken();
  }, [user]);

  // Fetch reports using useSWR with polling every 5 seconds
  const { data: reports = [], error, isLoading } = useSWR<Report[]>(
    user && authToken ? ['/api/reports', authToken] : null,
    fetcher,
    { refreshInterval: 5000 } // Poll every 5 seconds
  );

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

  // --- Helper function to format date ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  // --- End Helper function ---

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <FileText className="h-7 w-7" />
                  Reports
                </h1>
                <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Manage and generate AI-powered engineering reports.
                </p>
              </div>
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

            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-950 shadow-sm rounded-lg overflow-hidden">
                    <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4 mt-1" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load reports. Please try again later. Error: {error.message}</span>
              </div>
            ) : sortedReports.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <Card className="bg-card shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 border-b bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight">{report.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Layers className="h-4 w-4" />
              <span>{report.type}</span>
            </div>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-grow space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {report.description || "No description provided."}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Last Updated: {formatDate(report.updatedAt)}</span>
        </div>
        {report.projects && report.projects.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Associated Projects:</h4>
            <div className="flex flex-wrap gap-1">
              {report.projects.map(project => (
                <Badge key={project.id} variant="secondary" className="text-xs">
                  {project.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <Link href={`/reports/${report.id}`} passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Report Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateClick(report)}>
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportClick(report)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

interface ReportsEmptyStateProps {
  onCreateClick: () => void;
}

function ReportsEmptyState({ onCreateClick }: ReportsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-muted/30">
      <Sparkles className="h-16 w-16 text-purple-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ready to streamline your ECSA reporting? Use our AI assistant to generate professional reports in minutes.
      </p>
      <Button onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Generate Your First Report
      </Button>
    </div>
  )
} 