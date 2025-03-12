import { Bargraph } from "@/components/custom/dashboard/Bargraph";
import { Piegraph } from "@/components/custom/dashboard/Piegraph";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-4">
      <Bargraph />
      <Piegraph />
    </div>
  );
}