"use client"

import { useState, useEffect } from "react"
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
import { fetchReferees, createReferee, updateReferee, deleteReferee, Referee } from "@/lib/referee-service"
import { useAuth } from "@/lib/auth-context"

// Define TypeScript interfaces
interface Review {
  id: number;
  name: string;
  status: string;
  date?: string;
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
  const { user } = useAuth()
  const [referees, setReferees] = useState<Referee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReferee, setSelectedReferee] = useState<Referee | null>(null)

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isAssociateProjectsModalOpen, setIsAssociateProjectsModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  // Fetch referees on component mount
  useEffect(() => {
    async function loadReferees() {
      try {
        setLoading(true);
        const data = await fetchReferees(user);
        
        // Add fake reviews to referees for demo purposes - in a real app, this would come from the database
        const refereesWithReviews = data.map(referee => ({
          ...referee,
          projectIds: [], // Initialize empty projectIds array
          reviews: [
            { 
              id: Math.floor(Math.random() * 1000), 
              name: "Demo Report", 
              status: Math.random() > 0.5 ? "approved" : "pending",
              date: Math.random() > 0.5 ? new Date().toLocaleDateString() : undefined
            }
          ]
        }));
        
        setReferees(refereesWithReviews);
        setError(null);
      } catch (err) {
        console.error('Error loading referees:', err);
        setError('Failed to load referees. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadReferees();
  }, [user]);

  // Filter referees based on search query
  const filteredReferees = referees.filter(
    (referee) =>
      referee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.title.toLowerCase().includes(searchQuery.toLowerCase()),
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
  const handleSaveReferee = async (values: any) => {
    try {
      if (selectedReferee) {
        // Edit existing referee
        const updated = await updateReferee({
          id: selectedReferee.id,
          name: values.firstName + ' ' + values.lastName,
          title: values.position || values.title,
          company: values.company,
          email: values.email,
          phone: values.phone,
        }, user);
        
        // Update the referee in the local state
        setReferees(prev => prev.map(ref => 
          ref.id === updated.id 
            ? { ...updated, projectIds: ref.projectIds || [], reviews: ref.reviews || [] } 
            : ref
        ));
        
        toast({
          title: "Referee updated",
          description: `${values.firstName} ${values.lastName}'s information has been updated.`,
        });
      } else {
        // Add new referee
        console.log("[handleSaveReferee] Creating new referee with values:", values);
        const created = await createReferee({
          name: values.firstName + ' ' + values.lastName,
          title: values.position || values.title,
          company: values.company,
          email: values.email,
          phone: values.phone,
        }, user);
        
        // Add the new referee to the local state with empty projectIds and reviews
        setReferees(prev => [
          ...prev, 
          { 
            ...created, 
            projectIds: [], 
            reviews: [] 
          }
        ]);
        
        toast({
          title: "Referee added",
          description: `${values.firstName} ${values.lastName} has been added as a referee.`,
        });
      }
    } catch (error) {
      console.error('Error saving referee:', error);
      toast({
        title: "Error",
        description: `Failed to save referee information. Please try again.`,
        variant: "destructive",
      });
    }
  }

  // Handle deleting a referee
  const handleDeleteReferee = async () => {
    if (selectedReferee) {
      try {
        await deleteReferee(selectedReferee.id, user);
        
        // Remove the referee from the local state
        setReferees(prev => prev.filter(ref => ref.id !== selectedReferee.id));
        
        toast({
          title: "Referee deleted",
          description: `${selectedReferee.name} has been removed.`,
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error deleting referee:', error);
        toast({
          title: "Error",
          description: `Failed to delete referee. Please try again.`,
          variant: "destructive",
        });
      }
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
        description: `Updated project associations for ${selectedReferee.name}.`,
      })
    }
  }

  // Handle contacting a referee
  const handleContactReferee = (referee: Referee) => {
    setSelectedReferee(referee)
    setIsContactModalOpen(true)
  }

  // Handle sending a message to a referee
  const handleSendMessage = (_values: MessageValues) => {
    if (selectedReferee) {
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedReferee.name}.`,
      })
    }
  }

  // Render a referee card item 
  const renderRefereeItem = (referee: Referee) => {
    // Split the full name into first and last names
    const nameParts = referee.name.split(' ');
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(' ');
    
    return (
      <Card key={referee.id} className="overflow-hidden">
        <div className="flex flex-row sm:flex-col md:flex-row">
          <div className="relative w-20 h-20 sm:w-full md:w-1/4 min-h-[120px] sm:h-32 md:h-auto bg-gray-100">
            <div className="flex items-center justify-center h-full bg-primary/10 text-primary text-2xl font-bold">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{referee.name}</h3>
                <div className="text-sm text-gray-500 mb-1">
                  {referee.title}, {referee.company}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleContactReferee(referee)}>
                  Contact
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAssociateProjects(referee)}>
                  Projects
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditReferee(referee)}>
                  Edit
                </Button>
              </div>
            </div>

            <div className="mt-2 border-t pt-2">
              <div className="text-sm font-medium">Recent Reviews:</div>
              <ul className="mt-1 space-y-1">
                {referee.reviews && referee.reviews.length > 0 ? (
                  referee.reviews.map((review) => (
                    <li key={review.id} className="text-sm flex items-center justify-between">
                      <span>{review.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          review.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : review.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {review.status}
                        {review.date && ` • ${review.date}`}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No reviews yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Referees</h1>
              <Button onClick={handleAddReferee}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Referee
              </Button>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search referees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-10">Loading referees...</div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
            ) : filteredReferees.length === 0 ? (
              <EmptyState onAddClick={handleAddReferee} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {filteredReferees.map((referee) => renderRefereeItem(referee))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddEditRefereeModal
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        referee={selectedReferee}
        onSave={handleSaveReferee}
        onDelete={handleDeleteReferee}
      />

      {selectedReferee && (
        <>
          <RefereeDetailView
            referee={selectedReferee}
            projects={getRefereeProjects(selectedReferee.projectIds || [])}
            onContactClick={() => setIsContactModalOpen(true)}
            onProjectsClick={() => setIsAssociateProjectsModalOpen(true)}
            onEditClick={() => setIsAddEditModalOpen(true)}
          />

          <AssociateProjectsModal
            open={isAssociateProjectsModalOpen}
            onOpenChange={setIsAssociateProjectsModalOpen}
            referee={selectedReferee}
            allProjects={projects}
            selectedProjectIds={selectedReferee.projectIds || []}
            onSave={handleSaveProjectAssociations}
          />

          <ContactRefereeModal
            open={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            referee={selectedReferee}
            onSend={handleSendMessage}
          />
        </>
      )}
    </DashboardLayout>
  )
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center py-16 text-center">
      <div className="flex flex-col items-center max-w-md">
        <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No referees yet</h3>
        <p className="text-gray-500 mb-4">
          Add professional referees who can verify your engineering work and provide references for 
          your ECSA registration.
        </p>
        <Button onClick={onAddClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Referee
        </Button>
      </div>
    </Card>
  )
} 