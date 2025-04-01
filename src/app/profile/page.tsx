"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainHeader } from "@/components/MainHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Award, Calendar, Clock, CheckCircle, Edit, Save, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  
  const [profileData, setProfileData] = useState({
    fullName: user?.displayName || "John Doe",
    title: "Civil Engineer",
    company: "ABC Engineering Consultants",
    location: "Johannesburg, South Africa",
    bio: "Experienced civil engineer with a focus on water infrastructure projects. Working towards ECSA registration with expertise in project management and structural design.",
    profileImage: user?.photoURL || "/placeholder.svg?height=128&width=128&text=JD"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically save the profile data to your database
    console.log("Saving profile:", profileData)
    setIsEditing(false)
    
    // In a real implementation, you would update the user profile in your auth system
    // For example with Firebase:
    // updateProfile(user, {
    //   displayName: profileData.fullName,
    //   photoURL: profileData.profileImage
    // })
  }
  
  const handleProfileImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsUploading(true)
      
      // Here you would typically upload the file to your storage service
      // For example with Firebase Storage:
      // const storageRef = ref(storage, `profile-images/${user.uid}`)
      // await uploadBytes(storageRef, file)
      // const downloadURL = await getDownloadURL(storageRef)
      
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Instead of actually uploading, we'll use a local object URL for demo purposes
      const imageUrl = URL.createObjectURL(file)
      
      setProfileData((prev) => ({
        ...prev,
        profileImage: imageUrl
      }))
      setImageError(false)
    } catch (error) {
      console.error("Error uploading profile image:", error)
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleImageError = () => {
    setImageError(true)
    // Set a fallback image
    setProfileData(prev => ({
      ...prev,
      profileImage: "/placeholder.svg?height=128&width=128&text=JD"
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <div className="h-48 w-full">
                <Image
                  src="/images/profile-background.png"
                  alt="Profile Background"
                  width={1200}
                  height={192}
                  className="w-full h-full object-cover bg-gray-200"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent h-24"></div>
              <div className="absolute -bottom-16 left-8">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background">
                  <Image
                    src={imageError ? "/placeholder.svg?height=128&width=128&text=JD" : profileData.profileImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div 
                        className={`h-32 w-32 overflow-hidden rounded-full bg-gray-100 ${isEditing ? 'cursor-pointer' : ''}`}
                        onClick={handleProfileImageClick}
                      >
                        {isUploading ? (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <span className="animate-pulse">Uploading...</span>
                          </div>
                        ) : (
                          <Image
                            src={imageError ? "/placeholder.svg?height=128&width=128&text=JD" : profileData.profileImage}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="h-full w-full object-cover"
                            onError={handleImageError}
                          />
                        )}
                      </div>
                      {isEditing && (
                        <Button 
                          size="icon" 
                          className="absolute bottom-0 right-0 rounded-full" 
                          variant="secondary"
                          onClick={handleProfileImageClick}
                        >
                          <Camera className="h-4 w-4" />
                          <span className="sr-only">Change photo</span>
                        </Button>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <h2 className="text-xl font-bold">{profileData.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{profileData.title}</p>

                    <div className="mt-4 w-full">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Registration Status</span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          In Progress
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Membership</span>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Pro Plan</Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Member Since</span>
                        <span className="text-sm">January 2023</span>
                      </div>
                    </div>

                    <div className="mt-6 w-full">
                      <Link href="/settings">
                        <Button variant="outline" className="w-full">
                          Account Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your professional details and biography</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" value={profileData.fullName} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" name="title" value={profileData.title} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input id="company" name="company" value={profileData.company} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={profileData.location} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Company/Organization</h3>
                          <p>{profileData.company}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p>{profileData.location}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Professional Bio</h3>
                        <p className="text-sm">{profileData.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ECSA Registration Progress</CardTitle>
                <CardDescription>Your journey towards professional registration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">ECSA Outcomes</h3>
                      <p className="text-2xl font-bold">9/11</p>
                      <p className="text-sm text-muted-foreground">Outcomes covered</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">Experience</h3>
                      <p className="text-2xl font-bold">3.2 years</p>
                      <p className="text-sm text-muted-foreground">Professional experience</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">CPD Points</h3>
                      <p className="text-2xl font-bold">25/25</p>
                      <p className="text-sm text-muted-foreground">Current cycle</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Missing Outcomes</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        10. Engineering professionalism
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        11. Engineering management
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Next Steps</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Complete TER 3 Report</p>
                          <p className="text-sm text-muted-foreground">Due in 14 days</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Add project with Outcome 10</p>
                          <p className="text-sm text-muted-foreground">Recommended action</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button variant="outline">View Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 