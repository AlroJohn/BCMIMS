"use client";

import { useAuth } from "@/components/providers/auth-provider";

import { StatusPieGraph } from "./reusable-component/Piegraph";
import CommitteeCards from "./ui-components/CommitteeCards";

import { ApprovedProjectsRadarChart } from "./reusable-component/RadarApproved";
import ProjectProposals from "./ui-components/ProjectProposals";
import { RejectedProjectsRadarChart } from "./reusable-component/RadarDisapproved";

export default function CommitteeDashboard() {
  const user = useAuth();

  const iAdmin = user.role === "Admin";
  return (
    <div className="min-h-screen w-full bg-gray-50 space-y-6">
      <CommitteeCards />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <StatusPieGraph />
        </div>
        <div className="flex-1">
          <ApprovedProjectsRadarChart />
        </div>
        <div className="flex-1">
          <RejectedProjectsRadarChart />
        </div>
      </div>
      <ProjectProposals />
    </div>
  );
}
