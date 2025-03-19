"use client";

import { useState, useEffect } from "react";
import ProjectCalendarEvents from "@/components/custom/dashboard/ui-components/ProjectCalendarEvents";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

// Types (should match with ProjectCalendarEvents)
type User = {
  id: string;
  name: string;
  role: string;
};

type Vote = {
  id: string;
  userId: string;
  proposalId: string;
  vote: "Approved" | "Rejected";
  votedAt: string;
  comment: string;
  user: User;
};

type Approval = {
  id: string;
  updatedAt: string;
  userId: string;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  proposalId: string;
  approvedBy: User;
  createdAt?: string;
};

type ProjectProposalType = {
  id: string;
  title: string;
  description: string;
  proposedDate: string;
  fileUrl: string;
  postedById: string;
  budget: number;
  postedBy: User;
  approvedBy: Approval[];
  votes: Vote[];
  createdAt?: string;
  committee: string;
  status?: string; // Optional status field from API
  implementation?: {
    status: string;
    completion: number;
  };
};

// Utility function to determine proposal status
const getProposalStatus = (proposal: ProjectProposalType): string => {
  // First check if status is already provided by the API
  if (proposal.status) return proposal.status;

  if (proposal.votes && proposal.votes.length > 0) {
    const approvedVotes = proposal.votes.filter(
      (v) => v.vote === "Approved"
    ).length;
    const rejectedVotes = proposal.votes.filter(
      (v) => v.vote === "Rejected"
    ).length;
    const totalVotes = proposal.votes.length;

    if (approvedVotes > rejectedVotes && approvedVotes > totalVotes / 2)
      return "Approved";
    if (rejectedVotes > approvedVotes && rejectedVotes > totalVotes / 2)
      return "Rejected";
  }

  if (proposal.approvedBy && proposal.approvedBy.length > 0) {
    const latestApproval = proposal.approvedBy.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
    return latestApproval.status;
  }

  return "Pending";
};

const CalendarOfEvents = () => {
  const { user, role } = useAuth();
  const currentUser = user;
  const currentRole = role || "User";

  const searchParams = useSearchParams();
  const committeeParam = searchParams.get("committee");

  const [projectProposals, setProjectProposals] = useState<
    ProjectProposalType[]
  >([]);


  return (
    <div className="h-full">
      <ProjectCalendarEvents
        projectProposals={projectProposals}
        // onViewProject={openProjectDetails}
      />
    </div>
  );
};

export default CalendarOfEvents;
