import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Pencil,
  ThumbsUp,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { Project } from "./ProjectDetails";

// Converted action buttons to dropdown menu
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Always show Details option for all projects */}
        <DropdownMenuItem onClick={() => openProjectDetails(project)}>
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>

        {/* Edit option: only for pending projects where user is the author */}
        {!isAdmin &&
          project.postedBy.id === user.id &&
          project.status === "Pending" && (
            <DropdownMenuItem onClick={() => openEditProject(project)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}

        {/* Vote option: only for pending projects where user hasn't voted yet */}
        {!isAdmin && !hasVoted(project) && project.status === "Pending" && (
          <DropdownMenuItem onClick={() => openVoteDialog(project)}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Vote
          </DropdownMenuItem>
        )}

        {/* Admin approve/reject options: only for pending projects */}
        {isAdmin && project.status === "Pending" && (
          <>
            <DropdownMenuItem
              onClick={() => {
                if (onApprove) onApprove(project);
              }}
              className="text-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onReject) onReject(project);
              }}
              className="text-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Disapprove
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButtons;
