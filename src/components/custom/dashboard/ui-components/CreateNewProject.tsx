"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define types
type ProjectProposalType = {
  id: string;
  title: string;
  description: string;
  proposedDate: string;
  fileUrl: string;
  postedById: string;
  budget?: number;
  // Other fields that may be needed
};

// Define the props interface
interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void; // Optional callback
  project?: ProjectProposalType | null; // For edit mode
  isEditing?: boolean; // To determine if we're editing or creating
}

export default function CreateNewProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project = null,
  isEditing = false,
}: ProposalModalProps) {
  // Form state
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, role } = useAuth(); // Get current user info

  // Initialize form with project data if in edit mode
  useEffect(() => {
    if (isEditing && project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setBudget(project.budget ? project.budget.toString() : "");
      setDueDate(
        project.proposedDate ? new Date(project.proposedDate) : undefined
      );
      setExistingFileUrl(project.fileUrl || "");
    } else {
      // Reset form fields if not editing
      setTitle("");
      setDescription("");
      setBudget("");
      setDueDate(undefined);
      setFileToUpload(null);
      setExistingFileUrl("");
    }
  }, [isEditing, project, isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get form data
      const formData = new FormData();

      // Add project fields
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);

      if (dueDate) {
        formData.append("proposedDate", dueDate.toISOString());
      }

      // Add the current user's ID
      if (user?.id) {
        formData.append("postedById", user.id);
      } else {
        throw new Error("User not authenticated");
      }

      // Add role as committee
      if (role) {
        formData.append("committee", role);
      } else {
        throw new Error("User role not found");
      }

      // Add the file if one was selected, otherwise keep the existing file
      if (fileToUpload) {
        formData.append("file", fileToUpload);
      }

      // If editing, add the project ID and set the method to PUT
      const apiUrl = "/api/project-proposal";
      let method = "POST";

      if (isEditing && project) {
        formData.append("id", project.id);
        method = "PUT";
      }

      // Send the data to the API
      const response = await fetch(apiUrl, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message ||
            `Failed to ${isEditing ? "update" : "submit"} proposal`
        );
      }

      const result = await response.json();

      // Show success message
      toast.success(
        `Proposal ${isEditing ? "updated" : "submitted"} successfully!`
      );

      // Call the onSubmit callback if provided
      if (onSubmit) {
        // Format the data properly to update parent component's state
        const finalResult = isEditing
          ? { ...project, ...result.project } // Merge with existing project data for edits
          : result; // Use new project data for creations

        onSubmit(finalResult);
      }

      // Close the modal without refreshing the page
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "submitting"} proposal:`,
        error
      );

      // Show error message
      toast.error(
        error.message || `Failed to ${isEditing ? "update" : "submit"} proposal`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Project Proposal"
              : "Create New Project Proposal"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your project proposal details below."
              : "Fill in the details for your new project proposal. All fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Project title"
                className="col-span-3"
                required
                disabled={isSubmitting}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project proposal"
                className="col-span-3"
                rows={4}
                required
                disabled={isSubmitting}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget (₱)*
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="col-span-3"
                required
                disabled={isSubmitting}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            {/* Display Committee Info (read-only) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="committeeDisplay" className="text-right">
                Committee
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <div className="border rounded-md px-3 py-2 text-sm bg-muted/20 w-full">
                  {role || "Loading role..."}
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on your user role
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date*
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={(year) => {
                            const currentDate = dueDate || new Date();
                            const newDate = new Date(currentDate);
                            newDate.setFullYear(Number.parseInt(year));
                            setDueDate(newDate);
                          }}
                          value={
                            dueDate
                              ? dueDate.getFullYear().toString()
                              : new Date().getFullYear().toString()
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(month) => {
                            const currentDate = dueDate || new Date();
                            const newDate = new Date(currentDate);
                            newDate.setMonth(Number.parseInt(month));
                            setDueDate(newDate);
                          }}
                          value={
                            dueDate
                              ? dueDate.getMonth().toString()
                              : new Date().getMonth().toString()
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ].map((month, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      defaultMonth={dueDate}
                      className="rounded-md border-0"
                      fromDate={new Date()} // Prevent selecting dates in the past
                      disabled={isSubmitting}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                {isEditing ? "Replace File" : "Attachment*"}
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  name="file"
                  type="file"
                  className="col-span-3"
                  required={!isEditing} // Only required for new projects
                  disabled={isSubmitting}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg" // Added image formats
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, Office documents, and images (PNG, JPG,
                  JPEG)
                </p>
                {isEditing && existingFileUrl && !fileToUpload && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <span className="mr-2">Current file:</span>
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View current file
                    </a>
                  </div>
                )}
                {fileToUpload && (
                  <div className="mt-2 text-sm text-gray-500">
                    New file selected: {fileToUpload.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !dueDate ||
                (!fileToUpload && !isEditing) ||
                !title ||
                !description ||
                !budget
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : isEditing ? (
                "Update Proposal"
              ) : (
                "Submit Proposal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
