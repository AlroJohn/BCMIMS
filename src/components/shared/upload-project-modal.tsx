"use client";

import React, { useState, useRef } from "react";
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

interface UploadProjectModalProps {
  onClose: () => void;
}

export default function UploadProjectModal({ onClose }: UploadProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Import the SMS service


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

    if (!titleRef.current || !descriptionRef.current || !fileRef.current || !budgetRef.current) {
      console.error("One or more input refs are not set.");
      toast.error("One or more input fields are missing.");
      setLoading(false);
      return;
    }

    if (!selectedDate) {
      console.error("No proposed date selected.");
      toast.error("Please select a proposed date.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("postedById", user.id);
    formData.append("proposedDate", selectedDate.toISOString());
    formData.append("budget", budgetRef.current.value);

    if (fileRef.current.files && fileRef.current.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    } else {
      console.error("No file selected.");
      toast.error("Please select a file to upload.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/project-proposal", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        // Send SMS notification with proposal data
        await sendSmsNotification({
          title: titleRef.current.value,
          budget: budgetRef.current.value,
          proposedDate: selectedDate.toISOString()
        });

        toast.success("Project proposal submitted successfully!");
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Failed to upload", errorData);
        toast.error(errorData.message || "Failed to upload project proposal.");
      }
    } catch (error) {
      console.error("Error submitting proposal", error);
      toast.error("An error occurred while submitting your proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Upload Project Proposal</DialogTitle>
        <DialogDescription>
          Please fill in the details for your project proposal.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            ref={titleRef}
            required
            className="border rounded p-2"
          />
          <textarea
            placeholder="Description"
            ref={descriptionRef}
            required
            className="border rounded p-2"
          />
          <Input type="file" ref={fileRef} required />
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
              ref={budgetRef}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}