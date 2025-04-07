import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Referee } from "@/lib/referee-service"

interface ContactRefereeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referee: Referee
  onSend: (values: {
    subject: string
    message: string
    requestReport?: boolean
    reportType?: string
  }) => void
}

export function ContactRefereeModal({
  open,
  onOpenChange,
  referee,
  onSend,
}: ContactRefereeModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [requestReport, setRequestReport] = useState(false)
  const [reportType, setReportType] = useState("TER")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend({
      subject,
      message,
      requestReport,
      reportType: requestReport ? reportType : undefined,
    })
    // Reset form
    setSubject("")
    setMessage("")
    setRequestReport(false)
    setReportType("TER")
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xl my-4 max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Contact {referee.name}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Send a message to {referee.name} at {referee.email}
              </p>
            </div>

            <div>
              <Label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request for verification of engineering work"
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requestReport"
                  checked={requestReport}
                  onCheckedChange={(checked) => setRequestReport(checked === true)}
                />
                <Label htmlFor="requestReport" className="text-sm font-medium cursor-pointer">
                  Request a report for ECSA registration
                </Label>
              </div>
            </div>

            {requestReport && (
              <div>
                <Label htmlFor="reportType" className="block text-sm font-medium mb-1">
                  Report Type
                </Label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="TER">Training and Experience Report (TER)</option>
                  <option value="EPE">Engineering Practice & Experience Report</option>
                  <option value="Engineering">General Engineering Report</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 