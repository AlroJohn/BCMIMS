"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function EnvironmentProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <SessionGuard requiredRoles={["Environment"]}><CommitteeProjectProposalsTemplate 
    committee="ENVIRONMENT_COMMITTEE" 
    initialTab={status || 'all'} 
  />;
  </SessionGuard>
}