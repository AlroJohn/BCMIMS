"use server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  console.log("Login attempt started for:", data.email);

  try {
    // Verify environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables in server action");
      return {
        success: false,
        message: "Server configuration error. Please contact support."
      };
    }

    // Initialize Prisma client
    const prisma = new PrismaClient();

    // Basic validation
    if (!data.email || !data.password) {
      return { success: false, message: "Email and password are required" };
    }

    // STEP 1: First check if the email exists in the users table
    try {
      console.log("Checking if email exists in database:", data.email);
      const userRecord = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, name: true, email: true, role: true }
      });

      if (!userRecord) {
        console.log("Email not found in database:", data.email);
        await prisma.$disconnect();
        return { success: false, message: "No account found with this email" };
      }

      console.log("Email found in database. User role:", userRecord.role);

      // STEP 2: Now that we know the user exists, attempt authentication
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      console.log("Attempting authentication for:", data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Authentication error:", error.message);
        await prisma.$disconnect();
        return { success: false, message: "Invalid password" };
      }

      if (!authData?.user) {
        console.error("No user returned from authentication");
        await prisma.$disconnect();
        return { success: false, message: "Authentication failed" };
      }

      console.log("Authentication successful for user ID:", authData.user.id);

      // STEP 3: Authentication succeeded, we already have user details from Prisma
      // Get the session for cookie setting
      if (authData.session) {
        await prisma.$disconnect();

        // Return the session token, user info, and role
        return {
          success: true,
          message: "Login successful!",
          user: authData.user,
          session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at
          },
          userProfile: userRecord,
          role: userRecord.role
        };
      } else {
        console.error("Authentication succeeded but no session was created");
        await prisma.$disconnect();
        return { success: false, message: "Session creation failed" };
      }
    } catch (prismaError) {
      console.error("Database error:", prismaError);
      await prisma.$disconnect();
      return { success: false, message: "Error checking user account" };
    }
  } catch (error: any) {
    console.error("Unexpected error during login:", error);
    return {
      success: false,
      message: `Login failed: ${error.message || "Unknown error"}`
    };
  }
}