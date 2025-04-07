"use client"

import React from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { HelpBanner } from "@/components/ui/help-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <HelpBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create my first project?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Projects tab in the sidebar and click "Create New Project". 
                    Fill in the project details and click Save to create your first project.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I track ECSA outcomes?</AccordionTrigger>
                  <AccordionContent>
                    The Outcomes tab shows all ECSA outcomes required for registration. 
                    When you add projects and reports, they'll automatically be linked to 
                    relevant outcomes to track your progress.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is the dashboard showing?</AccordionTrigger>
                  <AccordionContent>
                    Your dashboard provides an overview of your ECSA registration progress, 
                    recent projects, and quick access to common actions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reports & AI Features</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does AI report drafting work?</AccordionTrigger>
                  <AccordionContent>
                    Our AI system uses details from your projects to generate professional 
                    training reports. Navigate to Reports and click "Generate Report" to start.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I edit AI-generated reports?</AccordionTrigger>
                  <AccordionContent>
                    Yes! AI-generated reports are just a starting point. You can edit, refine, 
                    and customize them before finalizing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What format can I export reports in?</AccordionTrigger>
                  <AccordionContent>
                    Reports can be exported as PDF or Word documents, making them ready for 
                    submission to ECSA or sharing with referees.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account & Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I upgrade my account?</AccordionTrigger>
                  <AccordionContent>
                    Go to Settings → Subscription and select the Pro AI Plan to unlock 
                    all features including AI report generation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept major credit cards and PayFast for secure payments.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                  <AccordionContent>
                    You can cancel your subscription anytime by going to Settings → Subscription 
                    and clicking "Cancel Subscription".
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 