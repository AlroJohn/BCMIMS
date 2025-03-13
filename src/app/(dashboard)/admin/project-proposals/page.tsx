"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SessionGuard from "@/components/custom/guard/session-guard";

type Project = {
  id: string;
  name: string;
};
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";


export default function CaptainProjectProposals() {

  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  // States for approval/rejection dialog
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionComplete, setActionComplete] = useState(false);

  // Function to handle opening the approval dialog
  const handleApprove = (project) => {
    setSelectedProject(project);
    setApprovalComment("");
    setShowApprovalDialog(true);
  };

  // Function to handle opening the rejection dialog
  const handleReject = (project) => {
    setSelectedProject(project);
    setRejectionReason("");
    setShowRejectionDialog(true);
  };

  // Function to handle final approval
  const confirmApproval = () => {
    // In a real application, this would make an API call to update the project status
    console.log("Approving project:", selectedProject ? selectedProject.id : null);
    console.log("Approval comment:", approvalComment);

    // Show success message
    setActionComplete(true);

    // Close dialog after a delay
    setTimeout(() => {
      setShowApprovalDialog(false);
      setActionComplete(false);
    }, 2000);
  };

  // Function to handle final rejection
  const confirmRejection = () => {
    // In a real application, this would make an API call to update the project status
    console.log("Rejecting project:", selectedProject?.id);
    console.log("Rejection reason:", rejectionReason);

    // Show success message
    setActionComplete(true);

    // Close dialog after a delay
    setTimeout(() => {
      setShowRejectionDialog(false);
      setActionComplete(false);
    }, 2000);
  };

  return (
    <SessionGuard requiredRoles={["Admin"]}>

      <CommitteeProjectProposalsTemplate
        committee="CAPTAIN_COMMITTEE"
        initialTab={status || 'all'}
        isAdmin={true}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Project Proposal</DialogTitle>
            <DialogDescription>
              {selectedProject ? `You are approving "${selectedProject.name}"` : ""}
            </DialogDescription>
          </DialogHeader>

          {actionComplete ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                The project has been approved successfully.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="approval-comment" className="text-sm font-medium">
                  Comments (Optional)
                </label>
                <Textarea
                  id="approval-comment"
                  placeholder="Add any additional comments about the approval..."
                  rows={3}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
              </div>

              <Alert className="bg-blue-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This action will mark the project as approved and it will move to implementation phase.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            {!actionComplete && (
              <>
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={confirmApproval}
                >
                  Confirm Approval
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Project Proposal</DialogTitle>
            <DialogDescription>
              {selectedProject && `You are rejecting "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>

          {actionComplete ? (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Project Rejected</AlertTitle>
              <AlertDescription>
                The project has been rejected successfully.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="rejection-reason" className="text-sm font-medium">
                  Rejection Reason <span className="text-red-600">*</span>
                </label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejecting this project..."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  A clear explanation helps the committee understand why their proposal was rejected.
                </p>
              </div>

              <Alert className="bg-yellow-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action will mark the project as rejected. The committee will be notified of your decision.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            {!actionComplete && (
              <>
                <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </SessionGuard>
  );
}