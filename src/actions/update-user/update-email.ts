"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";
import { supabaseAdmin } from "@/lib/supabase-admin"; // Import your admin client
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for email update validation
const emailUpdateSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required to verify identity"),
});

/**
 * Updates a user's email address in both Supabase Auth and Prisma database
 */
export async function updateUserEmail(userId: string, data: { email: string, password: string }) {
    try {
        // Validate input data
        const validatedData = emailUpdateSchema.parse(data);

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

        // Check if email is already in use
        const existingUser = await prisma.user.findFirst({
            where: {
                email: validatedData.email,
                id: { not: userId },
            },
        });

        if (existingUser) {
            return {
                success: false,
                message: "Email is already in use",
            };
        }

        // Verify the user's password for security
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: validatedData.password,
        });

        if (signInError || !signInData?.user) {
            return {
                success: false,
                message: "Invalid password",
            };
        }

        // Get the Supabase UID from the session
        const supabaseUserId = signInData.user.id;

        // Update email in Supabase Auth using the admin client
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            supabaseUserId,
            { email: validatedData.email }
        );

        if (updateError) {
            return {
                success: false,
                message: updateError.message || "Failed to update authentication email",
            };
        }

        // Update email in Prisma database
        await prisma.user.update({
            where: { id: userId },
            data: {
                email: validatedData.email,
                updatedAt: new Date(),
            },
        });

        // Revalidate affected paths to update UI
        revalidatePath("/profile");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Email updated successfully.",
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(e => e.message).join(", ");
            return {
                success: false,
                message: `Validation error: ${errorMessage}`,
            };
        }

        console.error("Error updating user email:", error);
        return {
            success: false,
            message: "Failed to update email",
        };
    }
}