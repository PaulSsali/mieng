"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MessageSquare, Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MainHeader } from "@/components/MainHeader"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isPremiumUser] = useState(true) // This would typically come from user data
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    category: "",
    attachment: null as File | null,
  })
  const [chatMessages, setChatMessages] = useState([
    { sender: "system", message: "Welcome to eMate Support! How can we help you today?", time: "10:30 AM" },
  ])
  const [newMessage, setNewMessage] = useState("")

  // FAQ data
  const faqCategories = [
    {
      category: "Account & Registration",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Get Started' button on the homepage and follow the step-by-step registration process. You'll need to provide your personal information, select your engineering discipline, and set your preferences.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "You can reset your password by clicking on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. Alternatively, you can change your password in the Account section of your Settings page.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Yes, you can change your email address in the Account section of your Settings page. After updating your email, you'll need to verify the new address by clicking on the verification link sent to your new email.",
        },
      ],
    },
    {
      category: "ECSA Registration",
      questions: [
        {
          question: "What are the ECSA registration requirements?",
          answer:
            "ECSA registration typically requires a recognized engineering qualification, a minimum of 3 years of relevant post-qualification experience, and demonstration of competence across 11 outcomes. eMate helps you track and document these outcomes through your project experiences.",
        },
        {
          question: "How does eMate help with ECSA registration?",
          answer:
            "eMate provides tools to document your engineering projects, track your progress against the 11 ECSA outcomes, generate compliant reports, and manage your CPD points. Our AI assistant helps draft reports based on your project experiences, saving you time and ensuring compliance with ECSA requirements.",
        },
        {
          question: "What are the 11 ECSA outcomes?",
          answer:
            "The 11 ECSA outcomes are: 1) Problem solving, 2) Application of engineering & scientific knowledge, 3) Engineering design, 4) Investigation, experimentation and data analysis, 5) Engineering methods, skills, tools, including IT, 6) Professional & technical communication, 7) Impact of engineering activity, 8) Individual, team & multidisciplinary working, 9) Independent learning ability, 10) Engineering professionalism, and 11) Engineering management.",
        },
      ],
    },
    {
      category: "Reports & Projects",
      questions: [
        {
          question: "How do I add a new project?",
          answer:
            "To add a new project, navigate to the Projects page and click on the 'Add Project' button. Fill in the project details including name, timeline, your role, and select which ECSA outcomes the project covers. You can also assign a referee to the project.",
        },
        {
          question: "How does the AI report generation work?",
          answer:
            "Our AI report generation analyzes your project details and automatically drafts ECSA-compliant reports. Navigate to the Reports page and click 'Create New Report'. Select which projects to include, specify the report type, and the AI will generate a draft that you can review and edit before finalizing.",
        },
        {
          question: "Can I export my reports?",
          answer:
            "Yes, you can export your reports in both PDF and Word formats. On the Reports page, select the report you want to export, click the 'Export' button, and choose your preferred format. You can also customize the export to include or exclude specific sections.",
        },
      ],
    },
    {
      category: "Billing & Subscription",
      questions: [
        {
          question: "What subscription plans are available?",
          answer:
            "We offer a Free plan with basic functionality and a Pro plan at R299 per month with full AI-powered features. The Pro plan includes AI report drafting, TER generation, full CPD tracking, referee management, and PDF & Word exports.",
        },
        {
          question: "How do I upgrade to the Pro plan?",
          answer:
            "To upgrade to the Pro plan, go to your Account settings and select 'Subscription'. Click on 'Upgrade to Pro' and follow the payment instructions. Your account will be immediately upgraded once payment is processed.",
        },
        {
          question: "Can I cancel my subscription?",
          answer:
            "Yes, you can cancel your subscription at any time from your Account settings. Select 'Subscription' and click 'Cancel Subscription'. Your Pro features will remain active until the end of your current billing period.",
        },
      ],
    },
  ]

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqCategories

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTicketForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketForm((prev) => ({
        ...prev,
        attachment: e.target.files![0],
      }))
    }
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit the ticket to your backend
    console.log("Submitting ticket:", ticketForm)
    // Reset form
    setTicketForm({
      subject: "",
      description: "",
      category: "",
      attachment: null,
    })
    // Show success message
    alert("Your ticket has been submitted. We'll get back to you soon!")
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])

    // Clear input
    setNewMessage("")

    // Simulate agent response after a delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          message:
            "Thank you for your message. One of our support agents will assist you shortly. In the meantime, you might find helpful information in our FAQ section.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg -z-10" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2 items-center">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">How can we help you?</h2>
                    <p className="text-gray-600">
                      Find answers in our FAQ, chat with support, or submit a ticket for more complex issues.
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Search for answers..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Image
                      src="/support-illustration.png"
                      alt="Support Illustration"
                      width={300}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="chat">Live Chat</TabsTrigger>
                <TabsTrigger value="ticket">Submit a Ticket</TabsTrigger>
              </TabsList>

              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about eMate and ECSA registration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {filteredFAQs.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      filteredFAQs.map((category, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-semibold">{category.category}</h3>
                          <Accordion type="single" collapsible className="w-full">
                            {category.questions.map((faq, faqIndex) => (
                              <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-gray-600">{faq.answer}</p>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                          {index < filteredFAQs.length - 1 && <Separator />}
                        </div>
                      ))
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <p className="text-sm text-gray-500 mb-2">Can't find what you're looking for?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.querySelector('[data-value="chat"]')?.dispatchEvent(new MouseEvent("click"))
                        }
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat with Support
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.querySelector('[data-value="ticket"]')?.dispatchEvent(new MouseEvent("click"))
                        }
                      >
                        Submit a Ticket
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Chat Support</CardTitle>
                    <CardDescription>Chat with our support team for immediate assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isPremiumUser ? (
                      <div className="flex flex-col h-[400px]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md mb-4">
                          {chatMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p>{msg.message}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 space-y-4">
                        <div className="rounded-full bg-amber-100 p-3 inline-flex">
                          <MessageSquare className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-medium">Premium Feature</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Live chat support is available exclusively for Pro plan subscribers. Upgrade to Pro to access
                          immediate support from our team.
                        </p>
                        <Button>Upgrade to Pro</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ticket">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit a Support Ticket</CardTitle>
                    <CardDescription>Create a ticket for more complex issues or questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Brief description of your issue"
                          value={ticketForm.subject}
                          onChange={handleTicketChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={ticketForm.category}
                          onChange={handleTicketChange}
                          required
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          <option value="account">Account & Registration</option>
                          <option value="ecsa">ECSA Registration</option>
                          <option value="reports">Reports & Projects</option>
                          <option value="billing">Billing & Subscription</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Please provide as much detail as possible about your issue"
                          rows={6}
                          value={ticketForm.description}
                          onChange={handleTicketChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="attachment">Attachment (Optional)</Label>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="attachment"
                            className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          >
                            <Paperclip className="h-4 w-4" />
                            {ticketForm.attachment ? ticketForm.attachment.name : "Choose file"}
                          </Label>
                          <Input
                            id="attachment"
                            name="attachment"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {ticketForm.attachment && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setTicketForm((prev) => ({ ...prev, attachment: null }))}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Accepted file types: PDF, JPG, PNG, DOC, DOCX (max 5MB)
                        </p>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmitTicket}>
                      Submit Ticket
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">Email: support@emate.co.za</p>
                    <p className="text-sm">Phone: +27 12 345 6789</p>
                    <p className="text-sm">Hours: Monday-Friday, 8am-5pm SAST</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="#" className="text-sm text-primary hover:underline block">
                      ECSA Registration Guide
                    </Link>
                    <Link href="#" className="text-sm text-primary hover:underline block">
                      Video Tutorials
                    </Link>
                    <Link href="#" className="text-sm text-primary hover:underline block">
                      User Manual
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Support Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-sm">All systems operational</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Average response time: 2-4 hours</p>
                    <Badge variant="outline" className="mt-2">
                      {isPremiumUser ? "Pro Support" : "Standard Support"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 