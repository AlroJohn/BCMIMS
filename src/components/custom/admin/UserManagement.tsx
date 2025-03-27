"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, RefreshCw } from "lucide-react";

import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { fetchUsers } from "@/actions/update-user/update-manage-user";
import AddUserModal from "../custom-ui/add-user";
import EditUserModal from "../custom-ui/edit-user-management";

// Main role names
const committeeNames = {
  [UserRole.Admin]: "Admin",
  [UserRole.Education]: "Committee on Education and Culture",
  [UserRole.Environment]: "Committee on Environment",
  [UserRole.Finance]: "Committee on Finance, Budget and Appropriations",
  [UserRole.HealthServices]: "Committee on Health and Services",
  [UserRole.PeaceOrder]: "Committee on Peace and Order",
  [UserRole.PublicWorks]: "Committee on Public Works and Infrastructure",
  [UserRole.Women]: "Committee on Women, Children and Family",
};

// Sub-roles mapping by main role
const subRoleNames = {
  [UserRole.Admin]: "Sub-Admin",
  [UserRole.Education]: "Sub-Education",
  [UserRole.Environment]: "Sub-Environment",
  [UserRole.Finance]: "Sub-Finance",
  [UserRole.HealthServices]: "Sub-Health",
  [UserRole.PeaceOrder]: "Sub-Peace",
  [UserRole.PublicWorks]: "Sub-Public Works",
  [UserRole.Women]: "Sub-Women",
};

const subRoleOptions = [
  { value: "Admin:Sub-Admin", label: "Sub-Admin", mainRole: UserRole.Admin },
  {
    value: "Education:Sub-Education",
    label: "Sub-Education",
    mainRole: UserRole.Education,
  },
  {
    value: "Environment:Sub-Environment",
    label: "Sub-Environment",
    mainRole: UserRole.Environment,
  },
  {
    value: "Finance:Sub-Finance",
    label: "Sub-Finance",
    mainRole: UserRole.Finance,
  },
  {
    value: "HealthServices:Sub-Health",
    label: "Sub-Health",
    mainRole: UserRole.HealthServices,
  },
  {
    value: "PeaceOrder:Sub-Peace",
    label: "Sub-Peace",
    mainRole: UserRole.PeaceOrder,
  },
  {
    value: "PublicWorks:Sub-Public Works",
    label: "Sub-Public Works",
    mainRole: UserRole.PublicWorks,
  },
  { value: "Women:Sub-Women", label: "Sub-Women", mainRole: UserRole.Women },
];

// User type definition
interface User {
  id: string;
  name: string;
  lastName: string;
  middleName?: string;
  suffixName?: string;
  email: string;
  phone: string | null;
  profile: string | null;
  role: UserRole;
  subRole?: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const UserManagement = () => {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users using server action
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();

      // Process users to add sub-role information if stored in metadata
      const processedUsers = (data as User[]).map((user) => {
        // Extract sub-role name from metadata if it exists
        const metadata = user.metadata || {};
        const subRoleName = metadata.subRoleName;

        return {
          ...user,
          subRoleName,
        };
      });

      setUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Handle user edit click
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Safe way to get initials from name
  const getInitials = (name: string | undefined | null) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get display role name based on subRole flag
  const getDisplayRole = (user: User) => {
    // If user has subRole flag set to true
    if (user.subRole === true) {
      // First check if there's a specific subRoleName in metadata
      if (user.metadata?.subRoleName) {
        return user.metadata.subRoleName;
      }
      // Otherwise use the default sub-role name for their role
      else if (subRoleNames[user.role]) {
        return subRoleNames[user.role];
      }
    }

    // If subRole is false or not defined, show the main role name
    return committeeNames[user.role];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddUserOpen(true)}
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
          <Button
            onClick={loadUsers}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profile || undefined} />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name} <span>{user.middleName}</span> <span>{user.lastName}</span> <span>{user.suffixName}</span></p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{getDisplayRole(user)}</span>
                        {user.subRole && (
                          <span className="text-xs text-blue-500">
                            Sub-role
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.updatedAt)}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleEditUser(user)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={loadUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSuccess={loadUsers}
      />
    </div>
  );
};

export default UserManagement;
