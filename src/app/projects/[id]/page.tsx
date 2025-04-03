"use client";

import { MainHeader } from "@/components/MainHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Project } from "@/lib/db/project-service";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Briefcase, User, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the project data
  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchProject();
    }
  }, [params.id, user, router]);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading states
  if (loading || isLoading) {
    return <div className="flex justify-center py-20">Loading project data...</div>;
  }

  // Show error state
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>;
  }

  // If no project found
  if (!project) {
    return <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">Project not found</div>;
  }

  // If not authenticated, the useEffect will redirect
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <Link 
                href="/projects" 
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2">
                <Badge>{project.status}</Badge>
                <span className="text-muted-foreground">at {project.company}</span>
              </div>
            </div>
            <Button asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p>{project.description}</p>
                    </div>

                    {project.responsibilities && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Responsibilities</h3>
                        <p>{project.responsibilities}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {project.milestones && project.milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone) => (
                        <div key={milestone.id} className="border-l-2 border-muted pl-4 py-2">
                          <h3 className="font-medium">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{milestone.date}</p>
                          <p>{milestone.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.outcomes && project.outcomes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>ECSA Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.outcomes.map((outcomeId) => (
                        <div key={outcomeId} className="border p-3 rounded-md">
                          <h3 className="font-medium">Outcome {outcomeId}</h3>
                          {project.outcomeResponses && project.outcomeResponses[outcomeId] && (
                            <p className="mt-1">{project.outcomeResponses[outcomeId]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-sm text-muted-foreground">
                          {project.startDate} to {project.endDate || 'Present'}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground">{project.role}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Engineering Discipline</p>
                        <p className="text-sm text-muted-foreground">{project.discipline}</p>
                      </div>
                    </div>
                    {project.referee && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm font-medium">Reference</p>
                        <p className="text-sm text-muted-foreground">{project.referee}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {project.image && (
                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
} 