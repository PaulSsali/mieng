"use client"

import React from "react"
import { Card, CardContent } from "./card"
import { Input } from "./input"
import Link from "next/link"
import { Button } from "./button"
import { HelpCircle, Search, MessageSquare, Ticket } from "lucide-react"

interface HelpBannerProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  chatLabel?: string
  ticketLabel?: string
}

export function HelpBanner({
  title = "How can we help you?",
  description = "Find answers in our FAQ, chat with support, or submit a ticket for more complex issues.",
  searchPlaceholder = "Search for answers...",
  chatLabel = "Chat with Support",
  ticketLabel = "Submit a Ticket"
}: HelpBannerProps) {
  return (
    <Card className="bg-slate-50 border-0 shadow-none">
      <CardContent className="flex flex-col md:flex-row gap-4 justify-between items-start pt-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
          <div className="relative mt-4 w-full md:w-[400px]">
            <Input 
              placeholder={searchPlaceholder}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center p-4">
          <HelpCircle className="h-12 w-12 text-primary opacity-80" />
        </div>
      </CardContent>
      <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="flex-1">
          <MessageSquare className="mr-2 h-4 w-4" />
          {chatLabel}
        </Button>
        <Button variant="outline" className="flex-1">
          <Ticket className="mr-2 h-4 w-4" />
          {ticketLabel}
        </Button>
      </div>
    </Card>
  )
} 