import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"

export default async function WomenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommitteeLayoutTemplate committee="WOMEN_COMMITTEE">{children}</CommitteeLayoutTemplate>
}