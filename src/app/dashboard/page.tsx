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
  Calendar
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { authenticatedFetch } from "@/lib/auth-utils";
import { WelcomeMessage } from "@/components/WelcomeMessage";

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
        <div className="flex justify-center py-20">Loading dashboard data...</div>
      </DashboardLayout>
    );
  }

  // Use the dashboard data (either from API or default fallback)
  const data = dashboardData;

  return (
    <DashboardLayout>
      {/* Dashboard Content */}
      <main className="pb-12">
        {/* Welcome Section with gradient background */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {getFirstName()}</h1>
                <p className="text-muted-foreground mt-2">{currentDate} • {currentTime}</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2 w-full sm:w-auto shadow-sm" asChild>
                <Link href="/projects?new=true">
                  <PlusCircle className="h-4 w-4" />
                  Add Project
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* First-time user welcome message */}
          {data.isFirstVisit && <WelcomeMessage />}
          
          {/* Show error message if there was one */}
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Key Progress Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {/* ECSA Outcomes Progress */}
            <Card className="card-transition shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ECSA Outcomes Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Outcomes Achieved</p>
                    <p className="font-medium">{data.progressData.ecsa.completed}/{data.progressData.ecsa.total}</p>
                  </div>
                  <Progress value={data.progressData.ecsa.percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">{data.progressData.ecsa.percentage}% Complete</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/outcomes" className="text-primary hover:text-primary/90 text-sm flex items-center gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Projects Overview */}
            <Card className="card-transition shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Projects Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <p className="font-medium">{data.progressData.projects.count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Experience Duration</p>
                      <p className="font-medium">{data.progressData.projects.duration}</p>
                    </div>
                  </div>
                  <Progress value={data.progressData.projects.percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">{data.progressData.projects.percentage}% of required experience</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/projects" className="text-primary hover:text-primary/90 text-sm flex items-center gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent Projects Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <div className="flex items-center gap-2">
                <ToggleGroup type="single" value={projectsView} onValueChange={(value) => value && setProjectsView(value as "tiles" | "list")}>
                  <ToggleGroupItem value="tiles" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {data.recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recentProjects.map((project) => (
                  <Card key={project.id} className="h-full shadow-sm hover:shadow transition-all duration-200">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">
                        <Link 
                          href={`/projects/${project.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {project.title}
                        </Link>
                      </CardTitle>
                      <div className="flex gap-2 mt-1 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {project.dateRange}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Building className="h-3 w-3" /> {project.discipline}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                      <div className="flex flex-wrap gap-1 mt-2">
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
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs"
                          asChild
                        >
                          <Link href={`/projects/${project.id}`}>
                            View Details
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
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
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
            
            {data.recentProjects.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/projects">
                    View All Projects
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Referees Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Referees</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/referees?new=true">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Referee
                </Link>
              </Button>
            </div>
            
            {data.referees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.referees.map((referee) => (
                  <Card key={referee.id} className="shadow-sm hover:shadow transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col">
                        <h3 className="font-medium">{referee.name}</h3>
                        <p className="text-sm text-muted-foreground">{referee.title}</p>
                        <p className="text-sm text-muted-foreground">{referee.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-6 flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-medium mb-2">No referees added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add professionals who can verify your engineering experience.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/referees?new=true">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Referee
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
} 