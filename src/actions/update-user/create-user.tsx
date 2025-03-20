// actions/update-user/create-user.ts

"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin"; // Import the admin client
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Type definition for creating a user
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  profile: string | null;
  role: UserRole;
}

// Create user function that handles Supabase auth and database creation
export async function createUser(data: CreateUserParams) {
  try {
    const { name, email, password, phone, profile, role } = data;

    // Validate required fields
    if (!name || !email || !password || !role) {
      throw new Error("Missing required fields");
    }

    // Check if email already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    // 1. Create user in Supabase Auth using the admin client
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm the email
        user_metadata: {
          name,
          role,
        },
      });

    if (authError) {
      console.error("Supabase auth error:", authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("Failed to create user in authentication system");
    }

    // 2. Create user in our database with the same ID from Supabase
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        password: "supabase-auth", // We don't store actual password hash
        name,
        phone,
        profile,
        role,
      },
    });

    // Revalidate paths that might show user data
    revalidatePath("/admin/manage-users");

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// fetchUsers function remains unchanged
export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
