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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch proposals on component mount and when parameters change
  useEffect(() => {
    if (user?.id) {
      fetchProposals();
    }
  }, [user?.id, committeeParam, role]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/project-proposal/fetch-proposal");
      if (!response.ok) throw new Error("Failed to fetch proposals");

      const data = await response.json();
      const currentUserRole = role;
      const userId = user?.id;
      const isAdmin = currentUserRole === "Admin";

      const filteredData = data.filter((proposal: ProjectProposalType) => {
        if (proposal.postedById === userId) return true;
        if (isAdmin && committeeParam)
          return proposal.committee === committeeParam;
        if (isAdmin && !committeeParam) return true;
        if (currentUserRole === proposal.committee) return true;
        return false;
      });

      const enhancedData = filteredData.map((proposal: ProjectProposalType) => {
        const isApproved =
          proposal.status === "Approved" ||
          getProposalStatus(proposal) === "Approved";
        if (isApproved) {
          const approvalDate = proposal.approvedBy.find(
            (a) => a.status === "Approved"
          )?.updatedAt;
          const daysSinceApproval = approvalDate
            ? Math.floor(
                (Date.now() - new Date(approvalDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : 0;

          let implementationStatus = "Scheduled";
          let completion = 0;
          if (daysSinceApproval > 30) {
            implementationStatus = "Completed";
            completion = 100;
          } else if (daysSinceApproval > 5) {
            implementationStatus = "In Progress";
            completion = Math.min(
              Math.floor((daysSinceApproval / 30) * 100),
              95
            );
          }

          return {
            ...proposal,
            implementation: { status: implementationStatus, completion },
          };
        }
        return proposal;
      });

      setProjectProposals(enhancedData);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError("Failed to load project proposals");
      toast.error("Failed to load project proposals");
    } finally {
      setLoading(false);
    }
  };

  // Simple handler that logs the project details (to be replaced with your actual implementation)
  const openProjectDetails = (project: ProjectProposalType) => {
    console.log("View project details:", project.title);
    // Instead of opening a modal, you could redirect to a details page
    // or implement any other behavior you need
  };

  if (loading && projectProposals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading calendar events...</p>
      </div>
    );
  }

  if (error && projectProposals.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        {error}
      </div>
    );
  }

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
