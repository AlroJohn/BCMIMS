// app/admin/dashboard/[committee]/page.tsx
import CommitteeDashboard from "@/components/custom/dashboard/committeedashboard";

export default function CommitteeDashboardPage({
  params,
}: {
  params: { committee: string };
}) {
  // Map URL parameter to committee key
  const committeeMap: Record<string, string> = {
    education: "EDUCATION_COMMITTEE",
    environment: "ENVIRONMENT_COMMITTEE",
    finance: "FINANCE_COMMITTEE",
    "health-services": "HEALTH_SERVICES_COMMITTEE",
    "peace-order": "PEACE_ORDER_COMMITTEE",
    "public-works": "PUBLIC_WORKS_COMMITTEE",
    women: "WOMEN_COMMITTEE",
  };

  const committeeKey = committeeMap[params.committee] || "EDUCATION_COMMITTEE";

  return (
    <div className="pointer-events-none opacity-75" >
      <CommitteeDashboard committee={committeeKey} />
    </div>
  );
}