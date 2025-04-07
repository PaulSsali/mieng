import { useState } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    setToasts((toasts) => [...toasts, newToast])
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id))
    }, 5000)
    
    return id
  }

  const dismiss = (id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
} 