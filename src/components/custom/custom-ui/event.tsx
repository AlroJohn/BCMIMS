"use client";

import { useState, useEffect } from "react";
import ProjectCalendarEvents from "@/components/custom/dashboard/ui-components/ProjectCalendarEvents";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
  status?: string;
  implementation?: {
    status: string;
    completion: number;
  };
};

const CalendarOfEvents = () => {
  const searchParams = useSearchParams();
  const committeeParam = searchParams.get("committee");

  const [projectProposals, setProjectProposals] = useState<
    ProjectProposalType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch approved proposals from the API
        const response = await fetch("/api/project-proposal/fetch-proposal");

        if (!response.ok) {
          throw new Error(`Failed to fetch proposals: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched approved proposals:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        // Add implementation data if it doesn't exist
        const enhancedProposals = data.map((proposal: ProjectProposalType) => {
          if (!proposal.implementation) {
            // Determine implementation status based on proposed date
            const proposedDate = new Date(proposal.proposedDate);
            const currentDate = new Date();

            let status;
            let completion;

            if (proposedDate > currentDate) {
              // Future event - scheduled
              status = "Scheduled";
              completion = 0;
            } else {
              // Past or current event - randomly assign In Progress or Completed
              // Events older than 30 days have higher chance to be completed
              const daysDifference = Math.floor(
                (currentDate.getTime() - proposedDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              if (daysDifference > 30 || Math.random() > 0.7) {
                status = "Completed";
                completion = 100;
              } else {
                status = "In Progress";
                completion = Math.floor(Math.random() * 70) + 10; // 10-80% complete
              }
            }

            return {
              ...proposal,
              implementation: {
                status,
                completion,
              },
            };
          }
          return proposal;
        });

        setProjectProposals(enhancedProposals);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        toast.error("Failed to load project proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // If committee parameter is provided, filter proposals by committee
  const filteredProposals = committeeParam
    ? projectProposals.filter(
        (proposal) =>
          proposal.committee.toLowerCase() === committeeParam.toLowerCase()
      )
    : projectProposals;

  return (
    <div className="h-full">
      {loading ? (
        <div className="h-full flex flex-col">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-full w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error Loading Calendar
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ProjectCalendarEvents projectProposals={filteredProposals} />
      )}
    </div>
  );
};

export default CalendarOfEvents;
