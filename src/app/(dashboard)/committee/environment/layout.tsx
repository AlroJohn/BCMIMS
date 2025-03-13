import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"

export default async function EnvironmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommitteeLayoutTemplate committee="ENVIRONMENT_COMMITTEE">{children}</CommitteeLayoutTemplate>
}