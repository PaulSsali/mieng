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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, FileText, CheckCircle, File, FileImage } from "lucide-react"

interface ExportReportModalProps {
  report: any
  isOpen: boolean
  onClose: () => void
}

export function ExportReportModal({ report, isOpen, onClose }: ExportReportModalProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    // Simulate API call
    setTimeout(() => {
      setIsExporting(false)
      setExportComplete(true)
      setTimeout(() => {
        setExportComplete(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Select a format to export "{report?.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={exportFormat}
            onValueChange={setExportFormat}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="pdf" className="text-base font-medium">
                    PDF Document
                  </Label>
                  <p className="text-sm text-gray-500">
                    Standard PDF format compatible with most applications.
                  </p>
                </div>
                <div className="h-10 w-10 bg-red-100 text-red-700 rounded-md flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="docx" id="docx" />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="docx" className="text-base font-medium">
                    Word Document (DOCX)
                  </Label>
                  <p className="text-sm text-gray-500">
                    Editable format for Microsoft Word and compatible applications.
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center">
                  <File className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="png" id="png" />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="png" className="text-base font-medium">
                    Image (PNG)
                  </Label>
                  <p className="text-sm text-gray-500">
                    High-quality image format for sharing screenshots.
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 text-green-700 rounded-md flex items-center justify-center">
                  <FileImage className="h-5 w-5" />
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex items-center justify-between">
          {exportComplete && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Export complete</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 