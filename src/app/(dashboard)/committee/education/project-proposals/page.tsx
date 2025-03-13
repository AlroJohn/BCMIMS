"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function EducationProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  return <SessionGuard requiredRoles={["Education"]}><CommitteeProjectProposalsTemplate
    committee="EDUCATION_COMMITTEE"
    initialTab={status || 'all'}
  />;
  </SessionGuard>
}