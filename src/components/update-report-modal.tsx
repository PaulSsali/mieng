"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit, Save, CheckCircle, AlertCircle } from "lucide-react"

interface UpdateReportModalProps {
  report: any
  isOpen: boolean
  onClose: () => void
}

export function UpdateReportModal({ report, isOpen, onClose }: UpdateReportModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [title, setTitle] = useState(report?.title || "")
  const [description, setDescription] = useState(report?.description || "")
  const [content, setContent] = useState(report?.content || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)
      setTimeout(() => {
        setIsSaved(false)
      }, 2000)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Update Report
          </DialogTitle>
          <DialogDescription>
            Make changes to your report. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Report Details</TabsTrigger>
            <TabsTrigger value="content">Report Content</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select defaultValue={report?.type}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TER">Training Experience Report (TER)</SelectItem>
                      <SelectItem value="Engineering">Engineering Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={report?.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="referee">Referee</Label>
                <Select defaultValue={report?.referee}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select referee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending Assignment">Pending Assignment</SelectItem>
                    <SelectItem value="Robert Mkhize, Pr.Eng">Robert Mkhize, Pr.Eng</SelectItem>
                    <SelectItem value="Lisa Naidoo, Pr.Eng">Lisa Naidoo, Pr.Eng</SelectItem>
                    <SelectItem value="James Smith, Pr.Eng">James Smith, Pr.Eng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Edit the content of your report. You can use markdown formatting.
                </span>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Enter your report content here..."
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Changes saved successfully</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 