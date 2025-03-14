// app/admin/dashboard/[committee]/page.tsx
import CommitteeDashboard from "@/components/custom/dashboard/committeedashboard";

export default function CommitteeDashboardPage({
  params,
}: {
  params: { committee: string };
}) {
  return <CommitteeDashboard />;
}
