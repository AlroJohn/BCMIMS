"use client";

import CommitteeDashboard from "@/components/custom/dashboard/committeedashboard";
import SessionGuard from "@/components/custom/guard/session-guard";

export default function PublicWorksPage() {
 return (
     <SessionGuard requiredRoles={["PublicWorks"]}>
       <CommitteeDashboard committee="PUBLIC_WORKS_COMMITTEE" />
     </SessionGuard>
   )
}