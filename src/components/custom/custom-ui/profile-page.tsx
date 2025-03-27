"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Edit,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ProfileEditModal } from "./edit-profile";
import { useAuth } from "@/components/providers/auth-provider";

export default function ProfilePage() {
  const {
    user,
    role,
    phone,
    name,
    profile,
    isLoading,
    refreshing,
    refreshUser,
  } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Show global loading state for initial auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show local loading indicator for refresh operations
  if (localLoading || refreshing) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="flex items-center justify-center min-h-[40vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Show not logged in message
  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Not Logged In</h1>
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfileClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsEditModalOpen(false);
    // Show local loading indicator
    setLocalLoading(true);
    // Refresh user data after modal is closed
    await refreshUser();
    setLocalLoading(false);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  className="object-cover"
                  src={profile || user.profile || undefined}
                  alt={name || user.name}
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(name || user.name || "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {name || user.name || "User"}
            </CardTitle>
            <CardDescription>{role || "No Role"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={handleEditProfileClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p>{name || user.name || "Not provided"}</p>
              </div>
            </div>

            {/* New: Middle Name */}
            {user.middleName && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Middle Name</p>
                  <p>{user.middleName || "Not provided"}</p>
                </div>
              </div>
            )}


            {/* New: Last Name */}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Name</p>
                <p>{user.lastName || "Not provided"}</p>
              </div>
            </div>

            {/* New: Suffix Name */}
            {user.suffixName && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Suffix Name</p>
                  <p>{user.suffixName || "Not provided"}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{user.email || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p>{phone || user.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <p>{role || "Not assigned"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                {user.createdAt ? (
                  <p>
                    {new Date(user.createdAt).toLocaleDateString()} (
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                    )
                  </p>
                ) : (
                  <p>Unknown</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        user={user}
        role={role}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
