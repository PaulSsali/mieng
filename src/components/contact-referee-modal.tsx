import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface Referee {
  id: number
  firstName: string
  lastName: string
  email: string
  title?: string
  qualifications?: string
  phone?: string
  position?: string
  company?: string
  registrationType?: string
  registrationNumber?: string
  notes?: string
  status?: string
  projectIds?: number[]
  reviews?: any[]
}

interface ContactRefereeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referee: Referee | null
  onSend: (values: any) => void
}

export function ContactRefereeModal({
  open,
  onOpenChange,
  referee,
  onSend,
}: ContactRefereeModalProps) {
  const [values, setValues] = useState({
    subject: "",
    message: "",
    requestReport: false,
    reportType: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const isCheckbox = type === "checkbox"
    setValues((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (referee) {
      onSend({ ...values, refereeId: referee.id })
      onOpenChange(false)
    }
  }

  // Generate default message
  const generateDefaultMessage = () => {
    if (!referee) return ""

    return `Dear ${referee.firstName},

I hope this message finds you well. I would like to request your endorsement for my professional engineering work that you have supervised or are familiar with.

Your professional feedback on my technical competencies and engineering skills would be valuable for my ECSA registration process.

Please let me know if you need any additional information or documentation.

Thank you for your consideration.

Best regards,
[Your Name]`
  }

  if (!open || !referee) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
         onClick={(e) => {
           // Close modal when clicking outside
           if (e.target === e.currentTarget) onOpenChange(false);
         }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl my-4 max-h-[calc(100vh-2rem)] overflow-hidden animate-in zoom-in-95 duration-200"
           onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Contact Referee</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm mb-4">
                  Send a message to{" "}
                  <span className="font-medium">
                    {referee.firstName} {referee.lastName}
                  </span>{" "}
                  at{" "}
                  <span className="font-medium">{referee.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  placeholder="e.g. Request for ECSA Endorsement"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  value={values.message || generateDefaultMessage()}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px]"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requestReport"
                  name="requestReport"
                  checked={values.requestReport}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="requestReport" className="text-sm">
                  Request a formal report
                </label>
              </div>

              {values.requestReport && (
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <select
                    name="reportType"
                    value={values.reportType}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required={values.requestReport}
                  >
                    <option value="">Select report type</option>
                    <option value="ter">Training and Experience Report (TER)</option>
                    <option value="ecsa">ECSA Outcomes Report</option>
                    <option value="project">Project-specific Report</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 