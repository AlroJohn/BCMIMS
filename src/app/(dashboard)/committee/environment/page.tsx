"use client";

import CommitteeDashboard from "@/components/custom/dashboard/committeedashboard";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function EnvironmentPage() {
  return (
      <SessionGuard requiredRoles={["Environment"]}>
        <CommitteeDashboard committee="ENVIRONMENT_COMMITTEE" />
      </SessionGuard>
    )
}