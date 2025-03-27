"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { updateUser } from "@/actions/update-user/update-manage-user";

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

// Sub-roles mapping
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

// Updated user type including name fields
interface User {
  id: string;
  name: string;
  middleName?: string;
  lastName: string;
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

const EditUserModal = ({ isOpen, onClose, user, onSuccess }: EditUserModalProps) => {
  // User edit form state
  const [editName, setEditName] = useState("");
  const [editMiddleName, setEditMiddleName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editSuffixName, setEditSuffixName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editProfile, setEditProfile] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditMiddleName(user.middleName || "");
      setEditLastName(user.lastName || "");
      setEditSuffixName(user.suffixName || "");
      setEditPhone(user.phone || "");
      setEditProfile(user.profile || "");
      setProfilePreview(user.profile);

      // Set the selected role based on whether it's a sub-role or main role
      if (user.subRole && user.metadata?.subRoleName) {
        // Find matching sub-role option
        const subRole = subRoleOptions.find(
          (option) =>
            option.mainRole === user.role &&
            option.label === user.metadata.subRoleName
        );

        if (subRole) {
          setSelectedRole(subRole.value);
        } else {
          // If no matching sub-role found, fallback to main role
          setSelectedRole(user.role);
        }
      } else {
        // Set to main role
        setSelectedRole(user.role);
      }
    }
  }, [user]);

  // Check if the selected role is a sub-role
  const isSubRoleSelected = selectedRole.includes(":");

  // Parse the selected role to determine main role and sub-role
  const parseSelectedRole = () => {
    // For sub-roles, format is "mainRole:subRole"
    if (isSubRoleSelected) {
      const parts = selectedRole.split(":");
      return {
        role: parts[0] as UserRole,
        subRoleName: parts[1],
      };
    } else {
      // For main roles, just return the role itself
      return {
        role: selectedRole as UserRole,
        subRoleName: undefined,
      };
    }
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

  // Handle role change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  // Handle save user
  const handleSaveUser = async () => {
    if (!user) return;
    if (uploadingImage) {
      toast.error("Please wait for image processing to complete");
      return;
    }

    setIsSubmitting(true);

    try {
      // Make sure we have a base64 string for the profile picture
      const profileData = editProfile ? editProfile : null;

      // Parse the selected role value
      const { role, subRoleName } = parseSelectedRole();

      // Create metadata for sub-role if selected
      const metadata =
        isSubRoleSelected && subRoleName ? { subRoleName } : undefined;

      // Use the server action to update the user, including new name fields
      await updateUser({
        id: user.id,
        name: editName,
        middleName: editMiddleName,
        lastName: editLastName,
        suffixName: editSuffixName,
        phone: editPhone,
        profile: profileData,
        role,
        subRole: isSubRoleSelected, // Set the subRole boolean field
        metadata, // Store the sub-role name in metadata
      });

      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting && !uploadingImage) {
          onClose();
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

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name (optional)</Label>
            <Input
              id="middleName"
              value={editMiddleName}
              onChange={(e) => setEditMiddleName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
          </div>

          {/* Suffix Name */}
          <div className="space-y-2">
            <Label htmlFor="suffixName">Suffix Name (optional)</Label>
            <Input
              id="suffixName"
              value={editSuffixName}
              onChange={(e) => setEditSuffixName(e.target.value)}
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

          {/* Combined Role Selection using SelectGroup */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={handleRoleChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {/* Main roles group */}
                <SelectGroup>
                  <SelectLabel>Main Roles</SelectLabel>
                  {Object.entries(committeeNames).map(([roleKey, roleName]) => (
                    <SelectItem key={roleKey} value={roleKey}>
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectSeparator />

                {/* Sub-roles group */}
                <SelectGroup>
                  <SelectLabel>Sub Roles</SelectLabel>
                  {subRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Show the subRole value that will be set */}
            {selectedRole && (
              <p className="text-xs text-blue-500 mt-1">
                subRole will be set to:{" "}
                <strong>{isSubRoleSelected ? "true" : "false"}</strong>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
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
  );
};

export default EditUserModal;
