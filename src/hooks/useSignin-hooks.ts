import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { loginUser } from "@/actions/signin-action";

// Define expected role types
type UserRole = "Admin" | "Education" | "Environment" | "Finance" | "HealthServices" | "PeaceOrder" | "PublicWorks" | "Women";

// Define loading states
type LoadingState = "idle" | "authenticating" | "redirecting";

// Define role to URL path mapping
const roleToUrlPath: Record<string, string> = {
  "Admin": "/admin",
  "Education": "/committee/education",
  "Environment": "/committee/environment",
  "Finance": "/committee/finance",
  "HealthServices": "/committee/health-services",
  "PeaceOrder": "/committee/peace-order",
  "PublicWorks": "/committee/public-works",
  "Women": "/committee/women"
};

// Define role to committee name mapping (for future use)
const roleToCommitteeName: Record<string, string> = {
  "Admin": "ADMIN",
  "Education": "EDUCATION_COMMITTEE",
  "Environment": "ENVIRONMENT_COMMITTEE",
  "Finance": "FINANCE_COMMITTEE",
  "HealthServices": "HEALTH_SERVICES_COMMITTEE",
  "PeaceOrder": "PEACE_ORDER_COMMITTEE",
  "PublicWorks": "PUBLIC_WORKS_COMMITTEE",
  "Women": "WOMEN_COMMITTEE"
};

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
}

export const useLogin = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState("authenticating");
    setError(null);
    setSuccess(false);

    try {
      console.log("Submitting login form...");
      const response = await loginUser(formData) as LoginResponse;
      console.log("Login response received:", response);

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

        // Get the user's role from server response (should always be present now)
        const role = response.role || response.userProfile?.role || null;
        setUserRole(role);

        console.log("User role detected:", role);
        toast.success("Logged in successfully!");

        // Set redirecting state
        setLoadingState("redirecting");

        // Determine redirect URL based on user role
        let redirectTo: string;
        let userCommittee: string = "";

        if (role && roleToUrlPath[role]) {
          redirectTo = roleToUrlPath[role];
          userCommittee = roleToCommitteeName[role] || "";
          console.log(`User role: ${role}, Committee: ${userCommittee}, Redirecting to: ${redirectTo}`);
        } else {
          // Fallback in case role is unknown or not found
          redirectTo = "/auth";
          console.log("Unknown role or no role detected - using fallback route");
        }

        // Add a delay to ensure session is stored properly
        setTimeout(() => {
          console.log("Executing redirect to:", redirectTo);
          router.replace(redirectTo);
        }, 1500);
      } else {
        setLoadingState("idle");
        toast.error(response.message);
        setError(response.message);
      }
    } catch (err: any) {
      setLoadingState("idle");
      console.error("Login error:", err);
      const errorMessage = err?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Get the loading message based on current state
  const getLoadingMessage = (): string => {
    switch (loadingState) {
      case "authenticating":
        return "Verifying credentials...";
      case "redirecting":
        return "Preparing your dashboard...";
      default:
        return "Login";
    }
  };

  // Check if we're in any loading state
  const isLoading = loadingState !== "idle";

  return {
    formData,
    handleChange,
    handleSubmit,
    loading: isLoading,
    loadingState,
    loadingMessage: getLoadingMessage(),
    error,
    success,
    userRole
  };
};