"use client";

import { useSearchParams } from "next/navigation";
import CommitteeProjectProposalsTemplate from "@/components/shared/committee-project-proposals-template";

export default function HealthServicesProjectProposals() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  
  return <CommitteeProjectProposalsTemplate 
    committee="HEALTH_COMMITTEE" 
    initialTab={status || 'all'} 
  />;
}

