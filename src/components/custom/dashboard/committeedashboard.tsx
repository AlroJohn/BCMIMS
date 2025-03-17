"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Component } from "./reusable-component/Lawa";
import { StatusPieGraph } from "./reusable-component/Piegraph";
import CommitteeCards from "./ui-components/CommitteeCards";
import ProjectProposals from "./ui-components/ProjectProposals";

export default function CommitteeDashboard() {

  const user = useAuth();

  const iAdmin = user.role === "Admin"
  return (
    <div>
      <div className="min-h-screen w-full p-6 bg-gray-50">

      {!iAdmin && <CommitteeCards />}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 py-4">
              <StatusPieGraph />
            </div>
            <div className="flex-1">
              <Component />
            </div>
          </div>
          <ProjectProposals />
        </div>
      </div>
  );
}
