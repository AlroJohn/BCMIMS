"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ProfileUpdateData } from "@/types/user";

// Updated schema to include middleName, lastName, and suffixName as nullable
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  suffixName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  profile: z.string().nullable().optional(),
});

/**
 * Updates user profile information
 * @param userId The ID of the user to update
 * @param data The profile data to update
 */
export async function updateUserProfile(userId: string, data: ProfileUpdateData) {
  try {
    // Validate input data
    const validatedData = profileUpdateSchema.parse(data);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Update the user in the database with new name fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        middleName: validatedData.middleName,
        lastName: validatedData.lastName,
        suffixName: validatedData.suffixName,
        phone: validatedData.phone,
        profile: validatedData.profile,
        updatedAt: new Date(),
      },
    });

    // If user is authenticated with Supabase, sync the name there too
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        await supabase.auth.updateUser({
          data: { name: validatedData.name },
        });
      }
    } catch (error) {
      console.error("Failed to update Supabase user:", error);
      // Continue with the function, as this is not critical
    }

    // Revalidate affected paths to update UI
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      return {
        success: false,
        message: `Validation error: ${errorMessage}`,
      };
    }

    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}
