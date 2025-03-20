import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Project, VoteStatus } from "./ProjectDetails";

const VoteDialog = ({
  open,
  onOpenChange,
  selectedProject,
  onVote,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  onVote: (voteType: VoteStatus, comment: string) => Promise<void>;
  loading: boolean;
}) => {
  const [voteComment, setVoteComment] = useState("");

  if (!selectedProject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vote on Project Proposal</DialogTitle>
          <DialogDescription>
            Casting your vote for "{selectedProject.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium">{selectedProject.name}</h3>
            <p className="text-sm text-gray-700 mt-1">
              {selectedProject.description}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <div>Proposed by: {selectedProject.committee} Committee</div>
              <div>Budget: ₱{selectedProject.budget.toLocaleString()}</div>
              <div>
                Due Date: {selectedProject.dueDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Comment"
            value={voteComment}
            onChange={(e) => setVoteComment(e.target.value)}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => onVote("Approved", voteComment)}
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="default"
            onClick={() => onVote("Rejected", voteComment)}
            disabled={loading}
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoteDialog;
