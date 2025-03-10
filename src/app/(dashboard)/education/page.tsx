import { Bargraph } from "@/components/custom/dashboard/Bargraph";
import { Piegraph } from "@/components/custom/dashboard/Piegraph";
import SessionGuard from "@/components/custom/guard/session-guard";


export default function AdminDashboard() {
  return (
    <SessionGuard requiredRoles={["SUPERADMIN"]}>

      <div className="min-h-screen w-full flex flex-col gap-4">
        <Bargraph />
        <Piegraph />

      </div>

    </SessionGuard>
  )
}
