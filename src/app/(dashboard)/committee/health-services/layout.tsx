import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"
import SessionGuard from "@/components/custom/guard/session-guard"

export default async function HealthServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <CommitteeLayoutTemplate committee="HEALTH_SERVICES_COMMITTEE">{children}</CommitteeLayoutTemplate>
  )
}