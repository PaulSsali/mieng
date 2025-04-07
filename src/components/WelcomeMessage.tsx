"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight, Award, Book, Lightbulb } from "lucide-react";

/**
 * A welcome message component for first-time users
 * Displays an introduction to the platform with key features and getting started steps
 */
export function WelcomeMessage() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-primary">Welcome to eMate!</CardTitle>
            <CardDescription>
              Your engineering journey management platform is ready to use
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDismissed(true)}
            className="h-8 w-8 rounded-full" 
            aria-label="Dismiss welcome message"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            We've set up your account with some sample data to help you get started. Here's what you can do next:
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Track Your Progress</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor your progress towards achieving ECSA outcomes and CPD points requirements.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Manage Projects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Document your engineering projects, track hours, and generate reports for ECSA review.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">AI-Powered Assistance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate professional reports and get guidance on meeting ECSA requirements.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <h3 className="font-medium mb-2">Getting Started</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your account has been created with a sample project.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>We've added a sample referee to get you started.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Next, add your first real engineering project and start tracking your experience.</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
        <Button variant="outline" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
        <Button asChild>
          <Link href="/projects?new=true">
            Add My First Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 