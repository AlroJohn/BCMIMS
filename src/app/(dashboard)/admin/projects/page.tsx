// app/admin/manage-users/page.tsx

import ProjectTable from "@/components/shared/projects";
import { Toaster } from "sonner";

export default function projects() {
  return (
    <>
      <Toaster position="top-right" />
        <div className="p-4">
            <ProjectTable/>
            </div>
    </>
  );
}
