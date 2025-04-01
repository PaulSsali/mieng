"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProjectFormData } from "./ProjectForm";
import { ProjectFormMultiStep } from "./ProjectFormMultiStep";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-6 pt-10">
        <ProjectFormMultiStep 
          onSubmit={handleFormSubmit} 
          onCancel={onClose} 
          isModal={true} 
        />
      </DialogContent>
    </Dialog>
  );
} 