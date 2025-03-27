import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Type definitions
export type VoteStatus = "Approved" | "Rejected";
export type ProjectVote = {
  id: string;
  userId: string;
  proposalId: string;
  vote: VoteStatus;
  votedAt: Date;
  comment: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description: string;
  committee: string;
  committeeId: number;
  budget: number;
  documentTitle: string;
  documentUrl: string;
  dueDate: Date;
  startDate?: Date;
  updatedAt?: Date;
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

// Helper function to get status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 border-green-200 text-green-800";
    case "Pending":
      return "bg-blue-100 border-blue-200 text-blue-800";
    case "Rejected":
      return "bg-red-100 border-red-200 text-red-800";
    default:
      return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

const ProjectDetailsDialog = ({
  open,
  onOpenChange,
  selectedProject,
  isAdmin,
  hasVoted,
  openVoteDialog,
  onApprove,
  onReject,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  isAdmin: boolean;
  hasVoted: (project: Project) => boolean;
  openVoteDialog: (project: Project) => void;
  onApprove?: (project: Project) => void;
  onReject?: (project: Project) => void;
}) => {
  if (!selectedProject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>
            Detailed informations for "{selectedProject.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 overflow-y-auto scroll-none flex-grow pr-2">
          <div className="space-y-6">
            {/* Project Info Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Project Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-md border">
                <p className="font-medium text-lg mb-2">
                  {selectedProject.name}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  {selectedProject.description}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Proposed by: </span>
                    <span className="font-medium">
                      {selectedProject.postedBy.name} (
                      {selectedProject.committee})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="font-medium">
                      <Badge className={getStatusBadge(selectedProject.status)}>
                        {selectedProject.status}
                      </Badge>
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500">Total Budget: </span>
                    <span className="font-medium">
                      ₱{selectedProject.budget.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Committee: </span>
                    <span className="font-medium">
                      {selectedProject.committee}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date: </span>
                    <span className="font-medium">
                      {selectedProject.startDate?.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Target Date: </span>
                    <span className="font-medium">
                      {selectedProject.dueDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Document Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Project Document
              </h3>
              <div className="bg-gray-50  rounded-md border overflow-hidden">
                <div className="flex items-center w-full h-full p-4">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium line-clamp-1">
                      {selectedProject.documentTitle}
                    </p>
                    {selectedProject.documentUrl && (
                      <Link
                        href={selectedProject.documentUrl}
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
            {/* Votes Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Committee Votes ({selectedProject.votes.length})
              </h3>
              <div className="bg-gray-50 p-4 rounded-md border">
                {selectedProject.votes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProject.votes.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between border-b pb-2 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{vote.user.name}</p>
                          <p className="text-xs text-gray-500">
                            {vote.user.role} Committee
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Voted on{" "}
                            {new Date(vote.votedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          {vote.comment && (
                            <>
                              <p className="font-medium text-md text-gray-500">
                                Comment :
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {vote.comment}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          {vote.vote === "Approved" ? (
                            <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              <ThumbsUp className="h-4 w-4 mr-1" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />{" "}
                              Disapproved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No votes yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {/* Only show Vote Now button for pending projects where user hasn't voted yet */}
          {!isAdmin &&
            selectedProject.status === "Pending" &&
            !hasVoted(selectedProject) && (
              <Button
                variant="default"
                onClick={() => {
                  onOpenChange(false);
                  openVoteDialog(selectedProject);
                }}
              >
                Vote Now
              </Button>
            )}

          {/* Only show approve/reject buttons for admin on pending projects */}
          {isAdmin && selectedProject.status === "Pending" && (
            <>
              <Button
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => {
                  onOpenChange(false);
                  if (onApprove) onApprove(selectedProject);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Project
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => {
                  onOpenChange(false);
                  if (onReject) onReject(selectedProject);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Project
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
