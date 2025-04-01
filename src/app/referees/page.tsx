"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Search } from "lucide-react"
import { MainHeader } from "@/components/MainHeader"
import { Input } from "@/components/ui/input"
import { AddEditRefereeModal } from "@/components/add-edit-referee-modal"
import { RefereeDetailView } from "@/components/referee-detail-view"
import { AssociateProjectsModal } from "@/components/associate-projects-modal"
import { ContactRefereeModal } from "@/components/contact-referee-modal"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { DashboardLayout } from "@/components/DashboardLayout"

// Define TypeScript interfaces
interface Review {
  id: number;
  name: string;
  status: string;
  date?: string;
}

interface Referee {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  qualifications: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  registrationType: string;
  registrationNumber: string;
  notes: string;
  status: string;
  projectIds: number[];
  reviews: Review[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface MessageValues {
  subject: string;
  message: string;
  requestReport?: boolean;
  reportType?: string;
}

// Sample referee data
const initialReferees = [
  {
    id: 1,
    title: "Mr.",
    firstName: "Robert",
    lastName: "Mkhize",
    qualifications: "Pr.Eng",
    email: "robert.mkhize@abcconsulting.co.za",
    phone: "+27 82 123 4567",
    position: "Senior Engineer",
    company: "ABC Consulting",
    registrationType: "ECSA",
    registrationNumber: "20050123",
    notes: "Robert has been a mentor throughout my career and is familiar with my work on water treatment projects.",
    status: "active",
    projectIds: [1, 2],
    reviews: [
      { id: 1, name: "TER 2 Report", status: "approved", date: "Feb 10, 2024" },
      { id: 2, name: "ECSA Outcomes Report", status: "pending" },
    ],
  },
  {
    id: 2,
    title: "Ms.",
    firstName: "Lisa",
    lastName: "Naidoo",
    qualifications: "Pr.Eng",
    email: "lisa.naidoo@xyzengineering.co.za",
    phone: "+27 83 987 6543",
    position: "Project Manager",
    company: "XYZ Engineering",
    registrationType: "ECSA",
    registrationNumber: "20080456",
    notes: "",
    status: "active",
    projectIds: [3, 6],
    reviews: [
      { id: 3, name: "TER 1 Report", status: "approved", date: "Jul 15, 2022" },
      { id: 4, name: "Bridge Project Report", status: "feedback" },
    ],
  },
]

// Sample project data
const projects = [
  {
    id: 1,
    name: "Water Treatment Plant Upgrade",
    description: "Expansion of municipal water treatment facility to increase capacity by 50%",
    startDate: "Jan 2023",
    endDate: "Present",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Highway Expansion Project",
    description: "Widening of N2 highway from 2 to 4 lanes over a 15km stretch",
    startDate: "Mar 2022",
    endDate: "Dec 2022",
    status: "Completed",
  },
  {
    id: 3,
    name: "Bridge Design and Construction",
    description: "Design and construction of a 120m span bridge over the Umgeni River",
    startDate: "Jun 2021",
    endDate: "Feb 2022",
    status: "Completed",
  },
  {
    id: 4,
    name: "Solar Power Installation",
    description: "Installation of 5MW solar power system for industrial client",
    startDate: "Sep 2020",
    endDate: "Mar 2021",
    status: "Completed",
  },
  {
    id: 5,
    name: "Industrial Automation System",
    description: "Design and implementation of automation system for manufacturing plant",
    startDate: "Apr 2023",
    endDate: "Present",
    status: "In Progress",
  },
  {
    id: 6,
    name: "Environmental Impact Assessment",
    description: "Comprehensive EIA for proposed mining operation",
    startDate: "Nov 2022",
    endDate: "May 2023",
    status: "Pending Review",
  },
]

export default function RefereesPage() {
  const { toast, dismiss, toasts } = useToast()
  const [referees, setReferees] = useState<Referee[]>(initialReferees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReferee, setSelectedReferee] = useState<Referee | null>(null)

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isAssociateProjectsModalOpen, setIsAssociateProjectsModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Filter referees based on search query
  const filteredReferees = referees.filter(
    (referee) =>
      referee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get projects for a specific referee
  const getRefereeProjects = (projectIds: number[]) => {
    return projects.filter((project) => projectIds.includes(project.id))
  }

  // Handle adding a new referee
  const handleAddReferee = () => {
    setSelectedReferee(null)
    setIsAddEditModalOpen(true)
  }

  // Handle editing a referee
  const handleEditReferee = (referee: Referee) => {
    setSelectedReferee(referee)
    setIsAddEditModalOpen(true)
  }

  // Handle saving referee (add or edit)
  const handleSaveReferee = (values: Omit<Referee, 'id' | 'projectIds' | 'reviews' | 'status'>) => {
    if (selectedReferee) {
      // Edit existing referee
      setReferees((prev) => prev.map((ref) => (ref.id === selectedReferee.id ? { ...ref, ...values } : ref)))
      toast({
        title: "Referee updated",
        description: `${values.firstName} ${values.lastName}'s information has been updated.`,
      })
    } else {
      // Add new referee
      const newReferee = {
        id: referees.length + 1,
        ...values,
        status: "active",
        projectIds: [],
        reviews: [],
      }
      setReferees((prev) => [...prev, newReferee])
      toast({
        title: "Referee added",
        description: `${values.firstName} ${values.lastName} has been added as a referee.`,
      })
    }
  }

  // Handle deleting a referee
  const handleDeleteReferee = () => {
    if (selectedReferee) {
      setReferees((prev) => prev.filter((ref) => ref.id !== selectedReferee.id))
      toast({
        title: "Referee deleted",
        description: `${selectedReferee.firstName} ${selectedReferee.lastName} has been removed.`,
        variant: "destructive",
      })
    }
  }

  // Handle associating projects with a referee
  const handleAssociateProjects = (referee: Referee) => {
    setSelectedReferee(referee)
    setIsAssociateProjectsModalOpen(true)
  }

  // Handle saving project associations
  const handleSaveProjectAssociations = (projectIds: number[]) => {
    if (selectedReferee) {
      setReferees((prev) => prev.map((ref) => (ref.id === selectedReferee.id ? { ...ref, projectIds } : ref)))
      toast({
        title: "Projects associated",
        description: `Updated project associations for ${selectedReferee.firstName} ${selectedReferee.lastName}.`,
      })
    }
  }

  // Handle contacting a referee
  const handleContactReferee = (referee: Referee) => {
    setSelectedReferee(referee)
    setIsContactModalOpen(true)
  }

  // Handle sending message to referee
  const handleSendMessage = (_values: MessageValues) => {
    if (selectedReferee) {
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedReferee.firstName} ${selectedReferee.lastName}.`,
      })
    }
  }

  // Render the referee list item
  const renderRefereeItem = (referee: Referee) => {
    const refereeProjects = getRefereeProjects(referee.projectIds)
    
    return (
      <Card key={referee.id} className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {referee.title} {referee.firstName} {referee.lastName}
                    {referee.qualifications && <span className="ml-2 text-sm text-muted-foreground">({referee.qualifications})</span>}
                  </CardTitle>
                  <CardDescription>{referee.position}, {referee.company}</CardDescription>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  referee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {referee.status.charAt(0).toUpperCase() + referee.status.slice(1)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>Email: {referee.email}</p>
                    <p>Phone: {referee.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Registration Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>Type: {referee.registrationType}</p>
                    <p>Number: {referee.registrationNumber}</p>
                  </div>
                </div>
              </div>

              {referee.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{referee.notes}</p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Associated Projects ({refereeProjects.length})</h4>
                {refereeProjects.length > 0 ? (
                  <div className="space-y-1 text-sm">
                    {refereeProjects.map((project) => (
                      <div key={project.id} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'Completed' ? 'bg-green-500' : project.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                        <span>{project.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No projects associated with this referee.</p>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Review Status</h4>
                <div className="space-y-2">
                  {referee.reviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between text-sm">
                      <span>{review.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        review.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                        {review.date && ` - ${review.date}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => handleEditReferee(referee)}>
                  Edit Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAssociateProjects(referee)}>
                  Manage Projects
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleContactReferee(referee)}>
                  Contact Referee
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">My Referees</h1>
                <p className="text-muted-foreground mt-1">
                  Manage referees who can verify your engineering experience for ECSA registration
                </p>
              </div>
              <Button onClick={handleAddReferee}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Referee
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search referees by name, company, or position..."
                className="pl-8 w-full md:max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredReferees.length > 0 ? (
              <div className="grid gap-6">
                {filteredReferees.map(renderRefereeItem)}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No referees found matching your search criteria.</p>
                  <Button onClick={handleAddReferee}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Referee
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddEditRefereeModal
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        onSave={handleSaveReferee}
        onDelete={handleDeleteReferee}
        referee={selectedReferee}
      />

      <AssociateProjectsModal
        open={isAssociateProjectsModalOpen}
        onOpenChange={setIsAssociateProjectsModalOpen}
        onSave={handleSaveProjectAssociations}
        referee={selectedReferee}
        projects={projects}
        selectedProjectIds={selectedReferee?.projectIds || []}
      />

      <ContactRefereeModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        onSend={handleSendMessage}
        referee={selectedReferee}
      />
    </DashboardLayout>
  )
} 