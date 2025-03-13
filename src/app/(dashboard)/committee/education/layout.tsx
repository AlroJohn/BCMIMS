

// education/layout.tsx
import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"
import SessionGuard from "@/components/custom/guard/session-guard"

export default async function EducationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

      <CommitteeLayoutTemplate committee="EDUCATION_COMMITTEE">{children}</CommitteeLayoutTemplate>

  )
}