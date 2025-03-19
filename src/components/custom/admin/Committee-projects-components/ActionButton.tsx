import { Button } from "@/components/ui/button";
import { FileText, Pencil, ThumbsUp, CheckCircle, XCircle } from "lucide-react";
import { Project } from "./ProjectDetails";

// Extracted action buttons functionality
const ActionButtons = ({
  project,
  isAdmin,
  user,
  hasVoted,
  openProjectDetails,
  openEditProject,
  openVoteDialog,
  onApprove,
  onReject,
}: {
  project: Project;
  isAdmin: boolean;
  user: any;
  hasVoted: (project: Project) => boolean;
  openProjectDetails: (project: Project) => void;
  openEditProject: (project: Project) => void;
  openVoteDialog: (project: Project) => void;
  onApprove?: (project: Project) => void;
  onReject?: (project: Project) => void;
}) => {
  // Always show Details button for all projects
  const detailsButton = (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1"
      onClick={() => openProjectDetails(project)}
    >
      <FileText className="h-4 w-4" />
      <span className="hidden sm:inline">View Details</span>
    </Button>
  );

  // For rejected or approved projects, only show details button
  if (project.status === "Rejected" || project.status === "Approved") {
    return <div className="flex gap-2">{detailsButton}</div>;
  }

  return (
    <div className="flex gap-2 w-fit">
      {detailsButton}

      {/* Edit button: only for pending projects where user is the author */}
      {!isAdmin &&
        project.postedBy.id === user.id &&
        project.status === "Pending" && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => openEditProject(project)}
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}

      {/* Vote button: only for pending projects where user hasn't voted yet (regardless of authorship) */}
      {!isAdmin && !hasVoted(project) && project.status === "Pending" && (
        <Button
          size="sm"
          variant="default"
          className="flex items-center gap-1"
          onClick={() => openVoteDialog(project)}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="hidden sm:inline">Vote</span>
        </Button>
      )}

      {/* Admin approve/reject buttons: only for pending projects */}
      {isAdmin && project.status === "Pending" && (
        <div className="flex gap-1 w-fit">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            onClick={() => {
              if (onApprove) onApprove(project);
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Approve</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            onClick={() => {
              if (onReject) onReject(project);
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Disapprove</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
