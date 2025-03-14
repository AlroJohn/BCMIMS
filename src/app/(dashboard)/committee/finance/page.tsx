"use client";

import CommitteeDashboard from "@/components/custom/dashboard/committeedashboard";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function FinancePage() {
  return (
    <SessionGuard requiredRoles={["Finance"]}>
      <CommitteeDashboard />
    </SessionGuard>
  )
}