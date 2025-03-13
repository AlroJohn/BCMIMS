"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function PublicWorksProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <SessionGuard requiredRoles={["PublicWorks"]}><CommitteeProjectProposalsTemplate 
    committee="PUBLIC_WORKS_COMMITTEE" 
    initialTab={status || 'all'} 
  />;
  </SessionGuard>
}
