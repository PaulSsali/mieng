"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Camera, Save, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useAuth } from "@/lib/auth-context"
import { authenticatedFetch } from "@/lib/auth-utils"

// Function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("daily")
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    discipline: "",
    experience: "",
    hoursPerWeek: "",
    completionTimeline: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Initialize form data from user object
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
      }))
      
      setProfileImage(user.photoURL)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsLoading(true)
      
      // Create a local preview
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
      
      // Convert file to base64 for API
      const base64 = await fileToBase64(file);
      
      // Make an authenticated API call to update the profile image
      const response = await authenticatedFetch('/api/user/update-profile-image', {
        method: 'POST',
        body: JSON.stringify({
          profileImage: base64
        }),
      }, user);
      
      if (!response || !response.ok) {
        throw new Error('Failed to update profile image');
      }
      
      toast({
        title: "Profile image updated",
        description: "Your new profile image has been saved.",
      });
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast({
        title: "Error updating profile image",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    // Here you would typically update the user's profile in Firebase and the database
    toast({
      title: "Profile image removed",
      description: "Your profile image has been removed.",
    })
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Make an authenticated API call to update the profile
      const response = await authenticatedFetch('/api/user/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.fullName,
          discipline: formData.discipline || undefined,
          experience: formData.experience || undefined,
          completionTimeline: formData.completionTimeline || undefined,
          hoursPerWeek: formData.hoursPerWeek ? parseInt(formData.hoursPerWeek) : undefined,
        }),
      }, user);
      
      if (!response || !response.ok) {
        throw new Error('Failed to save profile');
      }
      
      toast({
        title: "Profile saved",
        description: "Your profile information has been updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      // Here you would typically update the user's password in Firebase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error changing password",
        description: "There was a problem updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      // Here you would typically delete the user's account in Firebase and the database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error deleting account",
        description: "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
    // Here you would typically update the theme
    if (checked) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    toast({
      title: checked ? "Dark mode enabled" : "Light mode enabled",
      description: "Your theme preference has been saved.",
    })
  }

  const handleSignOutAllSessions = async () => {
    try {
      // Here you would typically sign out all sessions
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  return (
    <DashboardLayout>
      <main className="py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Settings</h1>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="engineering">Engineering Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="privacy">Data & Privacy</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your account details and personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Profile Image Section */}
                      <div className="flex flex-col items-center space-y-3 mb-6">
                        <div className="relative h-24 w-24 group">
                          {profileImage ? (
                            profileImage.includes('ui-avatars.com') ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="rounded-full object-cover w-24 h-24 border-2 border-primary/20"
                              />
                            ) : (
                              <Image 
                                src={profileImage} 
                                alt="Profile" 
                                width={96} 
                                height={96} 
                                className="rounded-full object-cover w-24 h-24 border-2 border-primary/20"
                              />
                            )
                          ) : (
                            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 text-primary text-xl font-medium">
                              {getInitials(formData.fullName || "User")}
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={handleUploadClick} 
                              className="text-white h-10 w-10"
                              disabled={isLoading}
                            >
                              <Camera className="h-5 w-5" />
                            </Button>
                          </div>
                          <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        {profileImage && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRemoveImage} 
                            className="text-xs"
                            disabled={isLoading}
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleChange} 
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          disabled={isLoading}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">⏳</span> Saving...
                          </span>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handlePasswordChange} disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account status and sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Sign out of all sessions</h4>
                          <p className="text-sm text-muted-foreground">
                            Sign out of all other active sessions on other devices
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleSignOutAllSessions} disabled={isLoading}>Sign Out</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Export Account Data</h4>
                          <p className="text-sm text-muted-foreground">
                            Download a copy of all your account data and reports
                          </p>
                        </div>
                        <Button variant="outline" disabled={isLoading}>Export Data</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="engineering">
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering Profile</CardTitle>
                    <CardDescription>Update your engineering discipline and experience details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="discipline">Engineering Discipline</Label>
                      <Select value={formData.discipline} onValueChange={(value) => handleSelectChange("discipline", value)}>
                        <SelectTrigger id="discipline" className="w-full">
                          <SelectValue placeholder="Select discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="civil">Civil Engineering</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                          <SelectItem value="electrical">Electrical Engineering</SelectItem>
                          <SelectItem value="chemical">Chemical Engineering</SelectItem>
                          <SelectItem value="industrial">Industrial Engineering</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                        <SelectTrigger id="experience" className="w-full">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="graduate">Graduate (0-2 years)</SelectItem>
                          <SelectItem value="junior">Junior Engineer (2-5 years)</SelectItem>
                          <SelectItem value="midlevel">Mid-level Engineer (5-10 years)</SelectItem>
                          <SelectItem value="senior">Senior Engineer (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">ECSA Registration Goals</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="completionTimeline">Target Completion Timeline</Label>
                        <Select value={formData.completionTimeline} onValueChange={(value) => handleSelectChange("completionTimeline", value)}>
                          <SelectTrigger id="completionTimeline" className="w-full">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6months">Within 6 months</SelectItem>
                            <SelectItem value="1year">Within 1 year</SelectItem>
                            <SelectItem value="2years">Within 2 years</SelectItem>
                            <SelectItem value="3years">Within 3 years</SelectItem>
                            <SelectItem value="noTarget">No specific target</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hoursPerWeek">Hours Per Week Commitment</Label>
                        <Select value={formData.hoursPerWeek} onValueChange={(value) => handleSelectChange("hoursPerWeek", value)}>
                          <SelectTrigger id="hoursPerWeek" className="w-full">
                            <SelectValue placeholder="Select weekly hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Less than 5 hours</SelectItem>
                            <SelectItem value="10">5-10 hours</SelectItem>
                            <SelectItem value="20">10-20 hours</SelectItem>
                            <SelectItem value="30">20-30 hours</SelectItem>
                            <SelectItem value="40">30+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Mentor Availability</h4>
                          <p className="text-sm text-muted-foreground">
                            Do you have a mentor for your ECSA registration?
                          </p>
                        </div>
                        <Switch id="hasMentor" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Engineering Profile"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your account via email
                        </p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">In-App Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                      </div>
                      <Switch checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Notification Frequency</h4>
                      <p className="text-sm text-muted-foreground">
                        How often would you like to receive summary notifications?
                      </p>
                      <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                        <SelectTrigger className="w-full md:w-[250px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly summary</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the application looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                    <CardDescription>Manage your personal data and privacy settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Privacy Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        Review our privacy policy to understand how we handle your data
                      </p>
                      <Button variant="outline" className="mt-2">
                        View Privacy Policy
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Data Usage</h4>
                      <p className="text-sm text-muted-foreground">
                        Control how your data is used for service improvements and analytics
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="analytics" />
                        <Label htmlFor="analytics">Allow anonymous usage data collection</Label>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">Danger Zone</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="mt-2">
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove all
                              your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isLoading}
                            >
                              {isLoading ? "Deleting..." : "Delete Account"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
} 