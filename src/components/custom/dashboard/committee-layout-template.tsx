// components/custom/committee-layout-template.tsx
import Header from "@/components/custom/admin/header"
import { CommitteeSidebar } from "@/components/shared/committee-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function CommitteeLayoutTemplate({
  children,
  committee,
}: {
  children: React.ReactNode,
  committee: string
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarProvider>
          <CommitteeSidebar committee={committee} />
          <SidebarInset className="space-y-4">
            {/* Header */}
            <Header />
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}