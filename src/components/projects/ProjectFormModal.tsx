"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { ProjectFormData } from "./ProjectForm";
import { ProjectFormMultiStep } from "./ProjectFormMultiStep";
import { X } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

export function ProjectFormModal({ isOpen, onClose, onSubmit }: ProjectFormModalProps) {
  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
            <DialogClose className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground h-8 w-8 flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="px-6 py-6">
          <ProjectFormMultiStep 
            onSubmit={handleFormSubmit} 
            onCancel={onClose} 
            isModal={true} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 