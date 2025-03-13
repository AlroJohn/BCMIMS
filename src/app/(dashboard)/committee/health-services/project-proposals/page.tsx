"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function HealthServicesProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <SessionGuard requiredRoles={["HealthServices"]}><CommitteeProjectProposalsTemplate 
    committee="HEALTH_SERVICES_COMMITTEE" 
    initialTab={status || 'all'} 
  />
  </SessionGuard>
}

