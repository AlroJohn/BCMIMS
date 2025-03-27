"use client";

import { useState } from "react";
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
import { createUser } from "@/actions/update-user/create-user";

// Committee role mapping
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

// Sub-roles mapping with the same main role as key
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

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh user list after successful creation
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [profile, setProfile] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  // Reset form state
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setSelectedRole("");
    setProfile(null);
    setProfilePreview(null);
    setErrors({});
  };

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
        setProfile(base64String);
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

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!selectedRole) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (uploadingImage) {
      toast.error("Please wait for image processing to complete");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse the selected role value
      const { role, subRoleName } = parseSelectedRole();

      // Create metadata for storing sub-role name if selected
      const metadata =
        isSubRoleSelected && subRoleName ? { subRoleName } : undefined;

      await createUser({
        name,
        email,
        password,
        phone: phone || null,
        profile,
        role,
        subRole: isSubRoleSelected, // Set the subRole boolean field
        metadata, // Store the sub-role name in metadata
      });

      toast.success("User created successfully");
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    // The isSubRoleSelected variable will update automatically based on the new value
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Profile picture preview */}
          {profilePreview && (
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Profile picture upload */}
          <div className="space-y-2">
            <Label htmlFor="profile-upload">Profile Picture (Optional)</Label>
            <Input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploadingImage || isSubmitting}
            />
            <p className="text-xs text-gray-500">Maximum size: 25MB</p>

            {uploadingImage && (
              <div className="flex items-center mt-1 space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-xs">Processing image...</span>
              </div>
            )}
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Flat Role Selection using SelectGroup */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
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
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}

            {/* Show the subRole value that will be set */}
            {selectedRole && (
              <p className="text-xs text-blue-500 mt-1">
                subRole will be set to:{" "}
                <strong>{isSubRoleSelected ? "true" : "false"}</strong>
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadingImage}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </span>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
