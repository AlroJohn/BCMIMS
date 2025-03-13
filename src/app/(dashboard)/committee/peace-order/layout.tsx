import CommitteeLayoutTemplate from "@/components/custom/dashboard/committee-layout-template"

export default async function PeaceOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommitteeLayoutTemplate committee="PEACE_ORDER_COMMITTEE">{children}</CommitteeLayoutTemplate>
}