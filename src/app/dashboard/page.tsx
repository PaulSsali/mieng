"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  PlusCircle,
  LayoutGrid,
  List,
  FileText,
  Building,
  Calendar,
  ChevronRight,
  BarChart,
  Award,
  Users,
  Target,
  Clock as ClockIcon,
  Lightbulb,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Zap,
  Info,
  Eye,
  Flag,
  Bell
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { authenticatedFetch } from "@/lib/auth-utils";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for dashboard data
interface DashboardData {
  progressData: {
    ecsa: {
      completed: number;
      total: number;
      percentage: number;
    };
    projects: {
      count: number;
      duration: string;
      percentage: number;
    };
  };
  recentProjects: {
    id: string;
    title: string;
    dateRange: string;
    discipline: string;
    outcomes: number[];
  }[];
  referees: {
    id: string;
    name: string;
    title: string;
    company: string;
  }[];
  isFirstVisit?: boolean;
}

// Default empty data for safety
const DEFAULT_DATA: DashboardData = {
  progressData: {
    ecsa: { completed: 0, total: 11, percentage: 0 },
    projects: { count: 0, duration: "0 years 0 months", percentage: 0 }
  },
  recentProjects: [],
  referees: [],
  isFirstVisit: false
};

export default function Dashboard() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add view toggle state
  const [projectsView, setProjectsView] = useState<"tiles" | "list">("tiles");
  const [activeTab, setActiveTab] = useState<"projects" | "referees">("projects");
  
  // Update time every minute
  useEffect(() => {
    try {
      const updateDateTime = () => {
        try {
          const now = new Date();
          setCurrentDate(now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
          setCurrentTime(now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }));
        } catch (dateError) {
          console.error("Error updating date/time:", dateError);
          setCurrentDate("Today");
          setCurrentTime("Now");
        }
      };
      
      updateDateTime(); // Call immediately
      const interval = setInterval(updateDateTime, 60000); // Then every minute
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error setting up date/time interval:", error);
    }
  }, []);
  
  // Fetch dashboard data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const response = await authenticatedFetch('/api/dashboard', {
          method: 'GET'
        }, user);
        
        if (!response || !response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response?.status || 'unknown error'}`);
        }
        
        const data = await response.json();
        
        // Check if user was recently created
        // This helps identify if this is the first dashboard visit after signup
        let isNewUser = false;
        
        // Check if it's a Firebase user with metadata
        if (user && 'metadata' in user) {
          const firebaseUser = user as FirebaseUser;
          const creationTime = firebaseUser.metadata.creationTime;
          const lastSignInTime = firebaseUser.metadata.lastSignInTime;
          
          if (creationTime) {
            // If created in the last 5 minutes, consider as a new user
            isNewUser = (new Date().getTime() - new Date(creationTime).getTime()) < 5 * 60 * 1000;
            
            // Or if creation time equals last sign in time (first login)
            if (lastSignInTime && creationTime === lastSignInTime) {
              isNewUser = true;
            }
          }
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setDashboardData({
            ...data || DEFAULT_DATA,
            isFirstVisit: data.isFirstVisit || isNewUser || false
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again later.');
          // Ensure we always have valid data structure even on error
          setDashboardData(DEFAULT_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    // Add error boundary for the fetch operation
    fetchDashboardData().catch(err => {
      console.error("Unhandled error in fetchDashboardData:", err);
      if (isMounted) {
        setError('Unexpected error occurred. Please try refreshing the page.');
        setLoading(false);
        setDashboardData(DEFAULT_DATA);
      }
    });
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user]);
  
  const getFirstName = () => {
    if (!user) return "Guest";
    
    try {
      if (user.displayName) {
        return user.displayName.split(' ')[0];
      }
      
      return user.email?.split('@')[0] || "Guest";
    } catch (error) {
      console.error("Error getting first name:", error);
      return "Guest";
    }
  };

  // Show loading state
  if (loading && !dashboardData.recentProjects.length) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin mb-2"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Use the dashboard data (either from API or default fallback)
  const data = dashboardData;

  return (
    <DashboardLayout>
      {/* Dashboard Content */}
      <main className="pb-12">
        {/* Welcome Section with solid background */}
        <div className="bg-white border-b relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Hello, {getFirstName()}</h1>
                  <p className="text-primary/70 mt-2 flex items-center text-sm">
                    <ClockIcon className="mr-2 h-4 w-4" /> 
                    {currentDate} • {currentTime}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2 flex-1 md:flex-auto shadow-sm" asChild>
                    <Link href="/projects?new=true">
                      <PlusCircle className="h-4 w-4" />
                      Add Project
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 flex-1 md:flex-auto bg-white/50 backdrop-blur-sm" asChild>
                    <Link href="/reports/generate">
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Quick Status Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="font-medium text-sm">{data.progressData.ecsa.percentage}% Complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="font-medium text-sm">{data.progressData.projects.count} Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium text-sm">{data.progressData.projects.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-full">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Outcomes</p>
                    <p className="font-medium text-sm">{data.progressData.ecsa.completed}/{data.progressData.ecsa.total} Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* First-time user welcome message */}
          {data.isFirstVisit && <WelcomeMessage />}
          
          {/* Show error message if there was one */}
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Key Progress & Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main progress visualization */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* ECSA Outcomes Visualization */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">ECSA Outcomes</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32">
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="60" 
                          fill="none" 
                          stroke="#e2e8f0" 
                          strokeWidth="8" 
                        />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="60" 
                          fill="none" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="8" 
                          strokeDasharray={`${data.progressData.ecsa.percentage * 3.77} 377`} 
                          strokeDashoffset="0" 
                          transform="rotate(-90 64 64)" 
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-bold">{data.progressData.ecsa.completed}</span>
                        <span className="text-sm text-muted-foreground block">of {data.progressData.ecsa.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{data.progressData.ecsa.percentage}%</span>
                    </div>
                    <Progress value={data.progressData.ecsa.percentage} className="h-2" />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="link" size="sm" className="px-0 text-xs" asChild>
                      <Link href="/outcomes">
                        View Details <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project Timeline & Duration */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Experience Timeline</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>0</span>
                        <span>1 year</span>
                        <span>2 years</span>
                        <span>3 years</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        {/* Create a timeline indicator */}
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          style={{ width: `${data.progressData.projects.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Projects</span>
                      <span className="font-medium">{data.progressData.projects.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Required Experience</span>
                      <span className="font-medium">{data.progressData.projects.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{data.progressData.projects.duration}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-5 gap-1">
                    {/* Experience heatmap - each block represents experience intensity */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-3 rounded-sm ${
                          i < Math.ceil(data.progressData.projects.percentage / 20) 
                            ? `bg-blue-${200 + (i * 100)}` 
                            : "bg-gray-100"
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="link" size="sm" className="px-0 text-xs" asChild>
                      <Link href="/projects">
                        View Projects <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Generated Reports Summary */}
              <Card className="sm:col-span-2 border-none bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">AI-Powered Report Generation</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Let AI compile your engineering experience into professional ECSA-ready reports
                      </p>
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                          <Link href="/reports/generate">
                            Generate Report
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/reports">
                            View Examples
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Tabs for projects and referees */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs defaultValue="projects" className="w-full" value={activeTab} onValueChange={(value) => setActiveTab(value as "projects" | "referees")}>
              <div className="flex justify-between items-center p-4 border-b">
                <TabsList className="bg-muted/60 h-9">
                  <TabsTrigger value="projects" className="text-sm px-4">
                    <Building className="h-4 w-4 mr-2" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="referees" className="text-sm px-4">
                    <Users className="h-4 w-4 mr-2" />
                    Referees
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  {activeTab === "projects" && (
                    <>
                      <div className="bg-muted/60 rounded-md p-0.5 flex items-center">
                        <ToggleGroup type="single" value={projectsView} onValueChange={(value) => value && setProjectsView(value as "tiles" | "list")}>
                          <ToggleGroupItem value="tiles" aria-label="Grid view" className="h-8 w-8 p-0">
                            <LayoutGrid className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="list" aria-label="List view" className="h-8 w-8 p-0">
                            <List className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <Button asChild size="sm" className="h-9">
                        <Link href="/projects?new=true">
                          <PlusCircle className="h-3.5 w-3.5 mr-1" />
                          New Project
                        </Link>
                      </Button>
                    </>
                  )}
                  {activeTab === "referees" && (
                    <Button asChild size="sm" className="h-9">
                      <Link href="/referees?new=true">
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        New Referee
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <TabsContent value="projects" className="p-4">
                {data.recentProjects.length > 0 ? (
                  <>
                    {projectsView === "list" ? (
                      <div className="space-y-3">
                        {data.recentProjects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-blue-700">
                                {project.title.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <Link 
                                  href={`/projects/${project.id}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {project.title}
                                </Link>
                                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 flex-shrink-0" /> {project.dateRange}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Building className="h-3 w-3 flex-shrink-0" /> {project.discipline}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {project.outcomes.length > 0 && (
                                <Badge variant="outline" className="bg-primary/5 text-xs">
                                  {project.outcomes.length} Outcomes
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={`/projects/${project.id}`}>
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.recentProjects.map((project) => (
                          <Card key={project.id} className="h-full shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">
                                <Link 
                                  href={`/projects/${project.id}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {project.title}
                                </Link>
                              </CardTitle>
                              <div className="flex gap-3 mt-1 text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3 flex-shrink-0" /> {project.dateRange}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Building className="h-3 w-3 flex-shrink-0" /> {project.discipline}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 px-4">
                              {/* Outcome badges */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {project.outcomes.length > 0 ? (
                                  project.outcomes.slice(0, 3).map((outcomeId) => (
                                    <Badge key={outcomeId} variant="outline" className="bg-primary/5 text-xs">
                                      Outcome {outcomeId}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">No outcomes mapped yet</span>
                                )}
                                {project.outcomes.length > 3 && (
                                  <Badge variant="outline" className="bg-primary/5 text-xs">
                                    +{project.outcomes.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Mini outcome visualization */}
                              {project.outcomes.length > 0 && (
                                <div className="mt-4 grid grid-cols-11 gap-1">
                                  {Array.from({ length: 11 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-1.5 rounded-sm ${
                                        project.outcomes.includes(i + 1)
                                          ? "bg-primary"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="pt-0 px-4 pb-4 border-t flex justify-between items-center mt-2 pt-3">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-xs"
                                asChild
                              >
                                <Link href={`/projects/${project.id}`}>
                                  <span className="flex items-center">View <ChevronRight className="h-3 w-3 ml-1" /></span>
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2 text-xs"
                                asChild
                              >
                                <Link href={`/projects/${project.id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/projects">
                          View All Projects
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <Card className="bg-muted/50 border-dashed border-2">
                    <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Start tracking your engineering experience by adding your first project.
                      </p>
                      <Button asChild className="mt-2">
                        <Link href="/projects?new=true">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Your First Project
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="referees" className="p-4">
                {data.referees.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.referees.map((referee) => (
                        <Card key={referee.id} className="shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                          <div className="h-1.5 bg-green-500"></div>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center text-green-700 text-lg font-semibold">
                                {referee.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
                              </div>
                              <div className="flex-1">
                                <Link href={`/referees/${referee.id}`} className="font-medium hover:text-primary">
                                  {referee.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">{referee.title}</p>
                                <p className="text-sm text-muted-foreground">{referee.company}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" asChild>
                                <Link href={`/referees/${referee.id}`}>
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/referees">
                          View All Referees
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <Card className="bg-muted/50 border-dashed border-2">
                    <CardContent className="py-6 flex flex-col items-center justify-center text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No referees added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add professionals who can verify your engineering experience.
                      </p>
                      <Button asChild>
                        <Link href="/referees?new=true">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Referee
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
} 