"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for password update validation
const passwordUpdateSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

/**
 * Updates a user's password in Supabase Auth only
 * This doesn't require bcrypt since we're not storing the password in our database
 */
export async function updateUserPassword(userId: string, data: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}) {
    try {
        // Validate input data
        const validatedData = passwordUpdateSchema.parse(data);

        // Find the user in Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }

        // Verify the user's current password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: validatedData.currentPassword,
        });

        if (signInError || !signInData?.user) {
            return {
                success: false,
                message: "Current password is incorrect",
            };
        }

        // Get the Supabase UID from the session
        const supabaseUserId = signInData.user.id;

        // Update password in Supabase Auth using the admin client
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            supabaseUserId,
            { password: validatedData.newPassword }
        );

        if (updateError) {
            return {
                success: false,
                message: updateError.message || "Failed to update password",
            };
        }

        // Only update the timestamp in your database, not the actual password
        await prisma.user.update({
            where: { id: userId },
            data: {
                updatedAt: new Date(),
            },
        });

        // Revalidate affected paths to update UI
        revalidatePath("/profile");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Password updated successfully",
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(e => e.message).join(", ");
            return {
                success: false,
                message: `Validation error: ${errorMessage}`,
            };
        }

        console.error("Error updating user password:", error);
        return {
            success: false,
            message: "Failed to update password",
        };
    }
}