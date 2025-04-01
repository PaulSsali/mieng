"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/MainHeader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  FileText, 
  Briefcase, 
  Award, 
  UserCheck, 
  Info, 
  Search,
  CheckCircle2, 
  Archive, 
  MoreVertical,
  AlertCircle
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define types for our notifications
interface Notification {
  id: string
  type: 'report' | 'project' | 'cpd' | 'referee' | 'system'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  isArchived: boolean
  image?: string
  actionUrl?: string
}

// Sample notification data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "report",
    title: "TER 2 Draft Ready for Review",
    description: "Your AI assistant has prepared a draft of your TER 2 report. Review and submit for mentor approval.",
    timestamp: "2024-03-29T10:30:00",
    isRead: false,
    isArchived: false,
    image: "/images/report-thumbnail.png",
    actionUrl: "/reports/ter2-draft"
  },
  {
    id: "2",
    type: "referee",
    title: "New Referee Comment",
    description: "Dr. Sarah Johnson has provided feedback on your latest submission.",
    timestamp: "2024-03-28T16:45:00",
    isRead: false,
    isArchived: false,
    image: "/images/avatar-sarah.png",
    actionUrl: "/referees/feedback/2"
  },
  {
    id: "3",
    type: "project",
    title: "Project Milestone Approaching",
    description: "Project 'Highway Bridge Design' has a milestone due in 3 days.",
    timestamp: "2024-03-28T09:15:00",
    isRead: false,
    isArchived: false,
    image: "/images/project-highway.png",
    actionUrl: "/projects/1"
  },
  {
    id: "4",
    type: "cpd",
    title: "CPD Event Reminder",
    description: "Upcoming webinar on 'Sustainable Infrastructure' tomorrow at 14:00.",
    timestamp: "2024-03-27T13:20:00",
    isRead: true,
    isArchived: false,
    image: "/images/cpd-webinar.png",
    actionUrl: "/cpd/events/5"
  },
  {
    id: "5",
    type: "system",
    title: "Account Verification Complete",
    description: "Your ECSA membership number has been verified successfully.",
    timestamp: "2024-03-26T11:05:00",
    isRead: true,
    isArchived: false,
    actionUrl: "/settings/account"
  },
  {
    id: "6",
    type: "report",
    title: "Report Submission Successful",
    description: "Your TER 1 report has been submitted to your referees.",
    timestamp: "2024-03-25T15:30:00",
    isRead: true,
    isArchived: true,
    image: "/images/report-success.png",
    actionUrl: "/reports/history"
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(sampleNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filterType, setFilterType] = useState("all")

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length

  // Filter notifications based on current filters and search
  useEffect(() => {
    let filtered = [...notifications]
    
    // Filter by tab (all, unread, archived)
    if (activeTab === "unread") {
      filtered = filtered.filter(n => !n.isRead && !n.isArchived)
    } else if (activeTab === "archived") {
      filtered = filtered.filter(n => n.isArchived)
    } else {
      // All tab
      filtered = filtered.filter(n => !n.isArchived)
    }
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(n => n.type === filterType)
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        n => 
          n.title.toLowerCase().includes(query) || 
          n.description.toLowerCase().includes(query)
      )
    }
    
    setFilteredNotifications(filtered)
  }, [notifications, activeTab, filterType, searchQuery])

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      )
    )
  }
  
  // Mark a notification as unread
  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, isRead: false } : n
      )
    )
  }
  
  // Archive a notification
  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, isArchived: true } : n
      )
    )
  }
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "project":
        return <Briefcase className="h-5 w-5 text-amber-500" />
      case "cpd":
        return <Award className="h-5 w-5 text-green-500" />
      case "referee":
        return <UserCheck className="h-5 w-5 text-indigo-500" />
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }
  
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
    } else if (diffMins > 0) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`
    } else {
      return "Just now"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount === 0 
                  ? "You're all caught up!" 
                  : `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
          
          {/* Two column layout */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Left column - Filters */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search notifications"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by type
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All notifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="report">Reports</SelectItem>
                        <SelectItem value="project">Projects</SelectItem>
                        <SelectItem value="cpd">CPD</SelectItem>
                        <SelectItem value="referee">Referees</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Notification list */}
            <div className="md:col-span-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                      <p className="text-gray-500 mt-1">
                        {searchQuery ? "No matching notifications found" : "You don't have any notifications yet"}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        markAsRead={markAsRead}
                        markAsUnread={markAsUnread}
                        archiveNotification={archiveNotification}
                        formatRelativeTime={formatRelativeTime}
                        getNotificationIcon={getNotificationIcon}
                      />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="unread" className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                      <p className="text-gray-500 mt-1">
                        You don't have any unread notifications
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        markAsRead={markAsRead}
                        markAsUnread={markAsUnread}
                        archiveNotification={archiveNotification}
                        formatRelativeTime={formatRelativeTime}
                        getNotificationIcon={getNotificationIcon}
                      />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="archived" className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
                      <Archive className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No archived notifications</h3>
                      <p className="text-gray-500 mt-1">
                        Your archived notifications will appear here
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        markAsRead={markAsRead}
                        markAsUnread={markAsUnread}
                        archiveNotification={archiveNotification}
                        formatRelativeTime={formatRelativeTime}
                        getNotificationIcon={getNotificationIcon}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Notification card component
function NotificationCard({
  notification,
  markAsRead,
  markAsUnread,
  archiveNotification,
  formatRelativeTime,
  getNotificationIcon
}: {
  notification: Notification
  markAsRead: (id: string) => void
  markAsUnread: (id: string) => void
  archiveNotification: (id: string) => void
  formatRelativeTime: (timestamp: string) => string
  getNotificationIcon: (type: string) => React.ReactNode
}) {
  // Helper function to get border color based on notification type
  const getBorderColorClass = () => {
    if (notification.isRead || notification.isArchived) {
      return 'border-l-transparent';
    }
    
    switch (notification.type) {
      case 'report':
        return 'border-l-blue-500 bg-gray-50';
      case 'project':
        return 'border-l-amber-500 bg-gray-50';
      case 'cpd':
        return 'border-l-green-500 bg-gray-50';
      case 'referee':
        return 'border-l-indigo-500 bg-gray-50';
      case 'system':
        return 'border-l-purple-500 bg-gray-50';
      default:
        return 'border-l-transparent';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow border-l-4 ${getBorderColorClass()}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {notification.title}
              </h3>
              {!notification.isRead && (
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(notification.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-600 mt-1">
            {notification.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <a 
              href={notification.actionUrl} 
              className="text-primary text-sm hover:underline"
            >
              View details
            </a>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notification.isRead ? (
                  <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                    Mark as unread
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                    Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => archiveNotification(notification.id)}
                  disabled={notification.isArchived}
                >
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Disable notifications like this
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
} 