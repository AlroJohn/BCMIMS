"use server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function signOutUser() {
  try {
    // Verify environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables in server action");
      console.log("URL defined:", !!supabaseUrl);
      console.log("Anon key defined:", !!supabaseAnonKey);
      return { 
        success: false, 
        message: "Server configuration error. Please contact support." 
      };
    }
    
    // Create a server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log("Attempting to sign out user");
    
    // Sign out on the server side
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
      return { success: false, message: error.message };
    }

    console.log("User successfully signed out on server side");

    return { 
      success: true, 
      message: "Successfully signed out!" 
    };
  } catch (error: any) {
    console.error("Unexpected error during logout:", error);
    return { 
      success: false, 
      message: `Logout failed: ${error.message || "Unknown error"}` 
    };
  }
}