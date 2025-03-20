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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, RefreshCw } from "lucide-react";

import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { fetchUsers, updateUser } from "@/actions/update-user/route";
import AddUserModal from "../custom-ui/add-user";

// Simplified committee role mapping
const committeeNames = {
  [UserRole.Admin]: "Admin",
  [UserRole.Education]: "Committee on Education and Culture",
  [UserRole.Environment]: "Committee on Environment",
  [UserRole.Finance]: "Committee on Finance, Budget and Appropriations",
  [UserRole.HealthServices]: "Committee on Health and Services",
  [UserRole.PeaceOrder]: "Committee on Peace and Order",
  [UserRole.PublicWorks]: "Committee on Public Works and Infrastructure",
  [UserRole.Women]: "Committee on Women, Children and Family",
  [UserRole.None]: "Sub Committee",
};

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserManagement = () => {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Add User Modal state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editProfile, setEditProfile] = useState("");
  const [editRole, setEditRole] = useState<UserRole>(UserRole.Admin);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users using server action
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data as User[]);
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
    setEditName(user.name);
    setEditPhone(user.phone || "");
    setEditProfile(user.profile || "");
    setEditRole(user.role);
    setProfilePreview(user.profile);
    setIsEditOpen(true);
  };

  // Handle file upload for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 25MB.");
        return;
      }

      setUploadingImage(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Get base64 string
        const base64String = reader.result as string;
        setEditProfile(base64String);
        setProfilePreview(base64String);
        setUploadingImage(false);
      };
      reader.onerror = () => {
        toast.error("Error reading file");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save user
  const handleSaveUser = async () => {
    if (!selectedUser) return;
    if (uploadingImage) {
      toast.error("Please wait for image processing to complete");
      return;
    }

    setIsSubmitting(true);

    try {
      // Make sure we have a base64 string for the profile picture
      const profileData = editProfile ? editProfile : null;

      // Use the server action to update the user
      await updateUser({
        id: selectedUser.id,
        name: editName,
        phone: editPhone,
        profile: profileData,
        role: editRole,
      });

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editName,
              phone: editPhone,
              profile: profileData,
              role: editRole,
            }
          : user
      );
      setUsers(updatedUsers);
      setIsEditOpen(false);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
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
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{committeeNames[user.role]}</TableCell>
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

      {/* Edit User Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!isSubmitting && !uploadingImage) {
            setIsEditOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Profile picture preview */}
            <div className="flex justify-center mb-4">
              {profilePreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {editName ? editName.charAt(0).toUpperCase() : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-upload">Profile Picture</Label>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingImage}
              />
              <p className="text-xs text-gray-500">Maximum size: 25MB</p>
              {uploadingImage && (
                <div className="flex items-center mt-1 space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="text-xs">Processing image...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editRole}
                onValueChange={(value) => setEditRole(value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(committeeNames).map(([role, name]) => (
                    <SelectItem key={role} value={role as UserRole}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmitting || uploadingImage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={isSubmitting || uploadingImage}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
