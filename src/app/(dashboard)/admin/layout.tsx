import Header from "@/components/custom/admin/header";
import { AppSidebar } from "@/components/custom/custom-ui/app-sidebar";
import SessionGuard from "@/components/custom/guard/session-guard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check is fully removed
  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
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
    </SessionGuard>
  );
}