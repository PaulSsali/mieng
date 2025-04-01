import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

interface AddEditRefereeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referee: Referee | null
  onSave: (values: any) => void
  onDelete: () => void
}

export function AddEditRefereeModal({
  open,
  onOpenChange,
  referee,
  onSave,
  onDelete,
}: AddEditRefereeModalProps) {
  const [values, setValues] = useState({
    title: "Mr.",
    firstName: "",
    lastName: "",
    qualifications: "",
    email: "",
    phone: "",
    position: "",
    company: "",
    registrationType: "ECSA",
    registrationNumber: "",
    notes: "",
  })

  useEffect(() => {
    if (referee) {
      setValues({
        title: referee.title || "Mr.",
        firstName: referee.firstName || "",
        lastName: referee.lastName || "",
        qualifications: referee.qualifications || "",
        email: referee.email || "",
        phone: referee.phone || "",
        position: referee.position || "",
        company: referee.company || "",
        registrationType: referee.registrationType || "ECSA",
        registrationNumber: referee.registrationNumber || "",
        notes: referee.notes || "",
      })
    } else {
      setValues({
        title: "Mr.",
        firstName: "",
        lastName: "",
        qualifications: "",
        email: "",
        phone: "",
        position: "",
        company: "",
        registrationType: "ECSA",
        registrationNumber: "",
        notes: "",
      })
    }
  }, [referee, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
    onOpenChange(false)
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete ${values.firstName} ${values.lastName} as a referee?`)) {
      onDelete()
      onOpenChange(false)
    }
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
          <h2 className="text-xl font-bold">{referee ? "Edit Referee" : "Add New Referee"}</h2>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <select
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Qualifications</label>
                <Input
                  name="qualifications"
                  value={values.qualifications}
                  onChange={handleChange}
                  placeholder="e.g. Pr.Eng"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <Input
                    name="position"
                    value={values.position}
                    onChange={handleChange}
                    placeholder="e.g. Senior Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company/Organization</label>
                  <Input
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Type</label>
                  <select
                    name="registrationType"
                    value={values.registrationType}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="ECSA">ECSA</option>
                    <option value="SACNASP">SACNASP</option>
                    <option value="SACPCMP">SACPCMP</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <Input
                    name="registrationNumber"
                    value={values.registrationNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  placeholder="Additional information about this referee..."
                />
              </div>
            </div>

            <div className="flex justify-between p-4 border-t">
              {referee ? (
                <Button type="button" variant="outline" onClick={handleDeleteClick} className="text-red-600">
                  Delete Referee
                </Button>
              ) : (
                <div></div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {referee ? "Save Changes" : "Add Referee"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 