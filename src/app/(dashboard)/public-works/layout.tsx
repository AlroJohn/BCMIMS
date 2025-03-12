import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"

export default async function PublicWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommitteeLayoutTemplate committee="PUBLIC_WORKS_COMMITTEE">{children}</CommitteeLayoutTemplate>
}