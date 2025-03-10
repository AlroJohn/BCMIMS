"use server";
import { createClient } from "@supabase/supabase-js";

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
      console.log("URL defined:", !!supabaseUrl);
      console.log("Anon key defined:", !!supabaseAnonKey);
      return { 
        success: false, 
        message: "Server configuration error. Please contact support." 
      };
    }
    
    // Create a server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Basic validation
    if (!data.email || !data.password) {
      return { success: false, message: "Email and password are required" };
    }
    
    console.log("Attempting authentication for:", data.email);
    
    // Attempt to log in the user
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Authentication error:", error.message);
      return { success: false, message: error.message };
    }

    if (!authData?.user) {
      console.error("No user returned from authentication");
      return { success: false, message: "Authentication failed" };
    }

    console.log("Authentication successful for user ID:", authData.user.id);
    
    // Get the session for cookie setting
    if (authData.session) {
      // Return the session token so client can store it
      return { 
        success: true, 
        message: "Login successful!", 
        user: authData.user,
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at
        },
        redirectUrl: "/client"
      };
    } else {
      console.error("Authentication succeeded but no session was created");
      return { success: false, message: "Session creation failed" };
    }
  } catch (error: any) {
    console.error("Unexpected error during login:", error);
    return { 
      success: false, 
      message: `Login failed: ${error.message || "Unknown error"}` 
    };
  }
}