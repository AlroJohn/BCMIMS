// app/admin/manage-users/page.tsx
import UserManagement from "@/components/custom/admin/UserManagement";
import { Toaster } from "sonner";

export default function UserManagementPage() {
  return (
    <>
      <Toaster position="top-right" />
      <UserManagement />
    </>
  );
}
