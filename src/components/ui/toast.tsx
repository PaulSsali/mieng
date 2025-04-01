import React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  return (
    <div
      className={`pointer-events-auto relative w-full max-w-sm rounded-lg p-4 shadow-lg transition-all ${
        variant === "destructive" 
          ? "bg-destructive text-destructive-foreground" 
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className={`rounded-md p-1 transition-colors ${
            variant === "destructive" 
              ? "text-destructive-foreground/70 hover:text-destructive-foreground/90" 
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[];
  dismiss: (id: string) => void;
  className?: string;
}

export function ToastContainer({ toasts, dismiss, className }: ToastContainerProps) {
  if (!toasts?.length) return null;

  return (
    <div className={cn("fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-md", className)}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
} 