"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";
import Link from "next/link";

// Types
type User = {
  id: string;
  name: string;
  role: string;
};

type ProjectDetails = {
  id: string;
  title?: string;
  name?: string;
  description: string;
  proposedDate?: string;
  dueDate?: string;
  fileUrl?: string;
  documentUrl?: string;
  documentTitle?: string;
  budget?: number;
  postedBy?: User;
  committee?: string;
  createdAt?: string;
  dateProposed?: string;
  status?: string;
  implementation?: {
    status: string;
    completion: number;
  };
};

interface ProjectDetailsDialogProps {
  showProjectDetails: boolean;
  setShowProjectDetails: (show: boolean) => void;
  selectedProject: ProjectDetails | null;
}

// Utility functions
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Completed":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  showProjectDetails,
  setShowProjectDetails,
  selectedProject,
}) => {
  if (!selectedProject) return null;

  // Determine if the project has implementation details
  const hasImplementation =
    selectedProject.implementation &&
    typeof selectedProject.implementation.completion !== "undefined";

  // Get date formatter function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>
            {selectedProject &&
              `Information about "${
                selectedProject.title || selectedProject.name
              }"`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 overflow-y-auto flex-grow pr-2">
          <div className="space-y-6">
            {/* Project Info Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Project Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-md border">
                <p className="font-medium text-lg mb-2">
                  {selectedProject.title || selectedProject.name}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  {selectedProject.description}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Proposed by: </span>
                    <span className="font-medium">
                      {selectedProject.postedBy?.name || "Unknown"}
                      {selectedProject.committee &&
                        ` (${selectedProject.committee})`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="font-medium">
                      <Badge
                        className={getStatusBadge(
                          selectedProject.status ||
                            selectedProject.implementation?.status ||
                            "Pending"
                        )}
                      >
                        {selectedProject.status ||
                          selectedProject.implementation?.status ||
                          "Pending"}
                      </Badge>
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget: </span>
                    <span className="font-medium">
                      ₱{selectedProject.budget?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Committee: </span>
                    <span className="font-medium">
                      {selectedProject.committee || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Implementation Date: </span>
                    <span className="font-medium">
                      {formatDate(
                        selectedProject.proposedDate || selectedProject.dueDate
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Proposed Date: </span>
                    <span className="font-medium">
                      {formatDate(
                        selectedProject.createdAt ||
                          selectedProject.dateProposed
                      )}
                    </span>
                  </div>
                </div>

                {/* Implementation progress (if available) */}
                {hasImplementation && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">
                        {selectedProject.implementation?.completion ?? 0}%
                      </span>
                    </div>
                    <Progress
                      value={selectedProject.implementation?.completion}
                      className="h-2 mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Document Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Project Document
              </h3>
              <div className="bg-gray-50 p-4 rounded-md border">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium">
                      {selectedProject.documentTitle || "Project Proposal"}
                    </p>
                    {(selectedProject.documentUrl ||
                      selectedProject.fileUrl) && (
                      <Link
                        href={selectedProject?.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Document
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setShowProjectDetails(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
