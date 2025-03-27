"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { usePathname } from "next/navigation";
import { StatusPieGraph } from "./reusable-component/Piegraph";
import CommitteeCards from "./ui-components/CommitteeCards";
import { ApprovedProjectsRadarChart } from "./reusable-component/RadarApproved";
import ProjectProposals from "./ui-components/ProjectProposals";
import { RejectedProjectsRadarChart } from "./reusable-component/RadarDisapproved";
import CalendarOfEvents from "../custom-ui/event";
import { UserRole } from "@prisma/client";

export default function CommitteeDashboard() {
  const { user, role } = useAuth();
  const pathname = usePathname();

  // Extract the committee name from the URL path
  const getCommitteeFromPath = (path) => {
    if (!path) return null;

    // Get the last segment of the path
    const segments = path.split("/");
    return segments[segments.length - 1];
  };

  const committeeParam = getCommitteeFromPath(pathname);

  // Format committee param to match UserRole enum (e.g., "health-services" to "HealthServices")
  const formatCommitteeParam = (param) => {
    if (!param) return null;

    // Split by dash, capitalize each part, then join them
    return param
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  };

  const formattedCommittee = formatCommitteeParam(committeeParam);

  // Check if formatted param matches a UserRole
  const isValidCommittee = Object.values(UserRole).includes(formattedCommittee);

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

      {/* Show ProjectProposals for regular committee users */}
      {role !== "Admin" && <ProjectProposals />}

      {/* Show ProjectProposals if admin is viewing a specific committee */}
      {role === "Admin" &&
        isValidCommittee &&
        formattedCommittee !== "Admin" && <ProjectProposals />}

      {/* Show CalendarOfEvents if role is Admin */}
      {role === "Admin" && formattedCommittee === "Admin" && (
        <CalendarOfEvents />
      )}
    </div>
  );
}
