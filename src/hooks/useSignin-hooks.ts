import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { loginUser } from "@/actions/signin-action";


// Define expected role types
type UserRole = "SUPERADMIN" | "STAFF" | "CLIENT";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: any;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  userProfile?: {
    id: string;
    role: UserRole;
    name: string;
    email: string;
  };
  role?: UserRole;
  redirectUrl?: string;
}

export const useLogin = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Submitting login form...");
      const response = await loginUser(formData) as LoginResponse;
      console.log("Login response received");

      if (response.success) {
        // If we got session data from the server, set it in the browser
        if (response.session) {
          console.log("Setting client-side session");

          // Set the session in the browser using Supabase client
          await supabase.auth.setSession({
            access_token: response.session.access_token,
            refresh_token: response.session.refresh_token
          });

          // Manually set cookies for middleware
          const expires = new Date(response.session.expires_at * 1000).toUTCString();
          document.cookie = `sb-access-token=${response.session.access_token}; path=/; expires=${expires}; SameSite=Lax; secure`;
          document.cookie = `sb-refresh-token=${response.session.refresh_token}; path=/; expires=${expires}; SameSite=Lax; secure`;
        }

        setSuccess(true);

        // Safely set the role - handle undefined case
        if (response.role) {
          setUserRole(response.role);
        }

        toast.success("Logged in successfully!");
        console.log("User authenticated successfully");

        // Add a delay to ensure session is stored properly
        setTimeout(() => {
          // Use the redirectUrl from the server response
          if (response.redirectUrl) {
            console.log("Redirecting to:", response.redirectUrl);

            // Use replace instead of push for cleaner navigation
            router.push(response.redirectUrl);
          } else {
            // Fallback redirect
            console.log("Using fallback redirect to /auth");
            router.push("/auth");
          }
        }, 1000); // Increased delay to 1000ms for more reliable session persistence
      } else {
        toast.error(`Login failed: ${response.message}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success,
    userRole
  };
};