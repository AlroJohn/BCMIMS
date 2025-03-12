import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"

export default async function HealthServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommitteeLayoutTemplate committee="HEALTH_COMMITTEE">{children}</CommitteeLayoutTemplate>
}