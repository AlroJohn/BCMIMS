"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../providers/auth-provider";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { SmsService } from "@/services/twilioService";

// Define the Project type to match the structure in your main component
type ProjectVote = {
  id: string;
  userId: string;
  proposalId: string;
  vote: boolean;
  votedAt: Date;
  user: {
    id: string;
    name: string;
    role: string;
  };
};

type Project = {
  id: string;
  name: string;
  description: string;
  committee: string;
  committeeId: number;
  budget: number;
  documentTitle: string;
  documentUrl: string;
  dueDate: Date;
  dateProposed: Date;
  status: string;
  rejectionReason: string | null;
  votes: ProjectVote[];
  implementation: null;
  postedBy: {
    id: string;
    name: string;
    role: string;
  };
};

// Update the props interface to include projectToEdit
interface UploadProjectModalProps {
  onClose: () => void;
  projectToEdit?: Project | null; // Make it optional
}

export default function UploadProjectModal({ onClose, projectToEdit }: UploadProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    projectToEdit ? new Date(projectToEdit.dueDate) : null
  );
  const [budget, setBudget] = useState(projectToEdit?.budget.toString() || '');
  const [fileName, setFileName] = useState(projectToEdit?.documentTitle || '');
  
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Check if we're in edit mode
  const isEditMode = !!projectToEdit;

  // Function to send SMS notification
  const sendSmsNotification = async (proposalData: any) => {
    try {
      // Use the SMS service to send notification
      const result = await SmsService.sendProjectProposalNotification({
        title: proposalData.title,
        budget: proposalData.budget,
        proposedDate: proposalData.proposedDate
      });

      if (result.success) {
        console.log('SMS notification sent successfully');
      } else {
        console.error('Failed to send SMS notification:', result.message);
      }
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !budget) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a proposed date.");
      setLoading(false);
      return;
    }

    // Check file requirement for new projects
    if (!isEditMode && (!fileRef.current?.files || !fileRef.current.files[0])) {
      toast.error("Please select a file to upload.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("postedById", user.id);
    formData.append("proposedDate", selectedDate.toISOString());
    formData.append("budget", budget);

    // Add file if selected (optional for edit mode)
    if (fileRef.current?.files && fileRef.current.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    }
    
    // If editing, add project ID
    if (isEditMode && projectToEdit) {
      formData.append("id", projectToEdit.id);
    }

    try {
      // Same endpoint but different method for create vs update
      const method = isEditMode ? "PUT" : "POST";
      
      const res = await fetch("/api/project-proposal", {
        method: method,
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        // Only send SMS for new projects
        if (!isEditMode) {
          await sendSmsNotification({
            title,
            budget,
            proposedDate: selectedDate.toISOString()
          });
        }

        toast.success(isEditMode 
          ? "Project proposal updated successfully!" 
          : "Project proposal submitted successfully!");
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Failed to process project", errorData);
        toast.error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} project proposal.`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} proposal`, error);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'submitting'} your proposal.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{isEditMode ? 'Edit Project Proposal' : 'Upload Project Proposal'}</DialogTitle>
        <DialogDescription>
          {isEditMode 
            ? 'Update the details for your project proposal.' 
            : 'Please fill in the details for your project proposal.'}
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded p-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded p-2"
            rows={4}
          />
          
          {/* File input section with existing file name for edit mode */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">Document</span>
            {isEditMode && fileName && (
              <div className="text-sm text-gray-500 mb-2">
                Current file: {fileName}
                <p className="text-xs italic">(Upload a new file only if you want to replace the current one)</p>
              </div>
            )}
            <Input 
              type="file" 
              ref={fileRef} 
              required={!isEditMode} // Only required for new projects
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="font-medium">Proposed Date</span>
            <Input
              type="date"
              value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Budget</span>
            <input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}