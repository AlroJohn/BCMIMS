import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"
import SessionGuard from "@/components/custom/guard/session-guard"

export default async function EnvironmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (

       <CommitteeLayoutTemplate committee="FINANCE_COMMITTEE">{children}</CommitteeLayoutTemplate>

   )
}