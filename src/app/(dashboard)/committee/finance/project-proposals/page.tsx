"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";

export default function FinanceProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <CommitteeProjectProposalsTemplate 
    committee="FINANCE_COMMITTEE" 
    initialTab={status || 'all'} 
  />;
}
