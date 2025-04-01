"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  
  // Update the time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const dateString = now.toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    // Update immediately and then every second
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    
    return () => clearInterval(timerId);
  }, []);
  
  // Get user's first name
  const getFirstName = () => {
    if (!user) return "Guest";
    
    if (user.displayName) {
      return user.displayName.split(' ')[0];
    }
    
    return user.email?.split('@')[0] || "Guest";
  };
  
  // Mock data - in a real app this would come from an API
  const progressData = {
    ecsa: {
      completed: 6,
      total: 11,
      percentage: 55,
    },
    cpd: {
      earned: 15,
      required: 25,
      percentage: 60,
    },
    projects: {
      count: 4,
      duration: "2 years 3 months",
      percentage: 70,
    }
  };
  
  const recentProjects = [
    {
      id: 1,
      title: "Highway Bridge Design",
      dateRange: "Jan 2023 - Apr 2023",
      discipline: "Civil Engineering",
      outcomes: [1, 2, 3, 5],
    },
    {
      id: 2,
      title: "Water Treatment Plant Upgrade",
      dateRange: "May 2023 - Aug 2023",
      discipline: "Environmental Engineering",
      outcomes: [4, 5, 6, 8],
    },
    {
      id: 3,
      title: "Commercial Building Structural Analysis",
      dateRange: "Sep 2023 - Dec 2023",
      discipline: "Structural Engineering",
      outcomes: [2, 7, 9, 10],
    },
  ];
  
  const actionItems = [
    {
      id: 1,
      priority: "warning",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      title: "Missing ECSA Outcomes",
      description: "You're missing outcomes 11, 4, and 8. Add projects that demonstrate these skills.",
      action: "View Recommendations",
      link: "/outcomes",
    },
    {
      id: 2,
      priority: "info",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Quarterly Report Due Soon",
      description: "Your Q1 2024 report is due in 14 days. Start drafting now to avoid last-minute rush.",
      action: "Start Draft",
      link: "/reports/new",
    },
    {
      id: 3,
      priority: "success",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: "CPD Compliance On Track",
      description: "You've earned 15 CPD points this year. Continue at this pace to meet your annual requirement.",
      action: "View CPD Records",
      link: "/cpd",
    },
  ];
  
  const referees = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Senior Project Manager",
      company: "Atlas Engineering",
    },
    {
      id: 2,
      name: "Eng. Michael Smith",
      title: "Principal Engineer",
      company: "Structural Solutions Ltd",
    },
  ];

  return (
    <DashboardLayout>
      {/* Dashboard Content */}
      <main>
        {/* Welcome Section with Hero Background */}
        <div className="relative bg-white border-b z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10" 
            style={{ backgroundImage: 'url("/images/dashboard-hero.png")' }}
            aria-hidden="true" 
          />
          <div className="absolute inset-0 bg-gradient-hero-dashboard" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {getFirstName()}</h1>
                <p className="text-gray-600 mt-2">{currentDate} • {currentTime}</p>
              </div>
              <Button className="bg-primary hover:bg-primary-dark flex items-center gap-2 w-full sm:w-auto">
                <PlusCircle className="h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Key Progress Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* ECSA Outcomes Progress */}
            <Card>
              <CardHeader>
                <CardTitle>ECSA Outcomes Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Outcomes Achieved</p>
                    <p className="font-medium">{progressData.ecsa.completed}/{progressData.ecsa.total}</p>
                  </div>
                  <Progress value={progressData.ecsa.percentage} className="h-2" />
                  <p className="text-sm text-gray-600">{progressData.ecsa.percentage}% Complete</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/outcomes" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* CPD Points Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>CPD Points Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Points Earned</p>
                    <p className="font-medium">{progressData.cpd.earned}/{progressData.cpd.required}</p>
                  </div>
                  <Progress value={progressData.cpd.percentage} className="h-2" />
                  <p className="text-sm text-gray-600">{progressData.cpd.percentage}% of Annual Requirement</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/cpd" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Projects Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Projects Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Projects Completed</p>
                    <p className="font-medium">{progressData.projects.count}</p>
                  </div>
                  <Progress value={progressData.projects.percentage} className="h-2" />
                  <p className="text-sm text-gray-600">Total Experience: {progressData.projects.duration}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/projects" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Projects Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
            <div className="grid gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.dateRange} • {project.discipline}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.outcomes.map((outcome) => (
                            <span key={outcome} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              Outcome {outcome}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/projects">
                <Button variant="outline" className="w-full sm:w-auto">View All Projects</Button>
              </Link>
            </div>
          </div>

          {/* Action Items and Referees in grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Action Items Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Action Items</h2>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6">
                    {actionItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {item.icon}
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <Link href={item.link} className="text-primary hover:text-primary-dark text-sm flex items-center gap-1 mt-2">
                            {item.action} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referee Management */}
            <div>
              <h2 className="text-xl font-bold mb-4">Your Referees</h2>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6">
                    {referees.map((referee) => (
                      <div key={referee.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{referee.name}</h3>
                          <p className="text-sm text-gray-600">{referee.title}, {referee.company}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/referees" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1">
                    Manage Referees <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* AI Report Assistant */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <h2 className="text-xl font-bold">AI Report Assistant</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Let our AI assistant help you generate ECSA-compliant reports by automatically referencing your projects and mapping outcomes.
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary-dark w-full sm:w-auto">
                  Start AI Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
} 