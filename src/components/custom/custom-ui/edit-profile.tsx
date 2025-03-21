"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@/types/user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { EmailUpdateModal, PasswordUpdateModal } from "./email-password";
import { updateUserProfile } from "@/actions/update-user/update-own";

interface ProfileEditModalProps {
  user: User;
  role: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({
  user,
  role,
  isOpen,
  onClose,
}: ProfileEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [profile, setProfile] = useState<string | null>(user.profile);
  const [previewImage, setPreviewImage] = useState<string | null>(user.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for email and password modals
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setPhone(user.phone || "");
      setProfile(user.profile);
      setPreviewImage(user.profile);
    }
  }, [user, isOpen]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
      setProfile(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateUserProfile(user.id, {
        name,
        phone: phone || null,
        profile,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Profile Image */}
            <div className="grid place-items-center">
              <div
                className="relative cursor-pointer group"
                onClick={handleProfileImageClick}
              >
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    className="object-cover"
                    src={previewImage || undefined}
                    alt={name}
                  />
                  <AvatarFallback className="text-lg">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="mt-2"
                onClick={handleProfileImageClick}
              >
                Change Photo
              </Button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Email (with update option) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email">Email</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEmailModalOpen(true)}
                    className="h-7 px-2 text-xs"
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    Change Email
                  </Button>
                </div>
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>

              {/* Password update option */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Password</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordModalOpen(true)}
                    className="h-7 px-2 text-xs"
                  >
                    <Lock className="mr-1 h-3 w-3" />
                    Change Password
                  </Button>
                </div>
                <Input
                  type="password"
                  value="••••••••"
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Role (read-only) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={role || "No role assigned"}
                  readOnly
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Role cannot be changed
                </p>
              </div>
            </div>

            <DialogFooter className="pt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Update Modal */}
      <EmailUpdateModal
        userId={user.id}
        currentEmail={user.email}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      {/* Password Update Modal */}
      <PasswordUpdateModal
        userId={user.id}
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}
