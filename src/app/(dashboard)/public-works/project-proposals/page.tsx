"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";

export default function PublicWorksProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <CommitteeProjectProposalsTemplate 
    committee="PUBLIC_WORKS_COMMITTEE" 
    initialTab={status || 'all'} 
  />;
}
