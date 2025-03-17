import Navbar from "@/components/custom/custom-ui/navbar-home";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check is fully removed
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 mt-10">{children}</main>
      </div>
    </div>
  );
}
