"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import GuradLoader from "../loader/loading-guard";
import CommitteeLayoutTemplate from "../dashboard/committee-layout-template";
import { Loader2 } from "lucide-react";

interface SessionGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Roles allowed to access this route
  committee?: string; // Changed from string[] to string
}

export default function SessionGuard({
  children,
  requiredRoles = [],
  committee = "ADMIN", // Default to ADMIN, changed from array to string
}: SessionGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeCommittee, setActiveCommittee] = useState<string>(committee);

  useEffect(() => {
    // Wait until auth is loaded
    if (loading) return;

    // Not authenticated
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      setIsAuthorized(false);
      router.replace("/auth");
      return;
    }

    try {
      // Now it's safe to log user role since we've checked user isn't null
      console.log("USER ROLE", role);

      if (role === null) {
        console.log("User role is null, redirecting to login");
        setIsAuthorized(false);
        router.replace("/");
        return;
      }

      let userCommittee = "";
      let redirectPath = "";

      // Determine committee and redirect path based on role
      if (role === "Admin") {
        userCommittee = "ADMIN";
        redirectPath = "/Admin";
      } else if (role === "Education") {
        userCommittee = "EDUCATION_COMMITTEE";
        redirectPath = "/committee/education";
      } else if (role === "Environment") {
        userCommittee = "ENVIRONMENT_COMMITTEE";
        redirectPath = "/committee/environment";
      } else if (role === "Finance") {
        userCommittee = "FINANCE_COMMITTEE";
        redirectPath = "/committee/finance";
      } else if (role === "HealthServices") {
        userCommittee = "HEALTH_SERVICES_COMMITTEE";
        redirectPath = "/committee/health-services";
      } else if (role === "PeaceOrder") {
        userCommittee = "PEACE_ORDER_COMMITTEE";
        redirectPath = "/committee/peace-order";
      } else if (role === "PublicWorks") {
        userCommittee = "PUBLIC_WORKS_COMMITTEE";
        redirectPath = "/committee/public-works";
      } else if (role === "Women") {
        userCommittee = "WOMEN_COMMITTEE";
        redirectPath = "/committee/women";
      }

      // Store the committee based on user's role
      setActiveCommittee(userCommittee);

      // Check role-based access if requiredRoles are specified
      if (requiredRoles.length > 0) {
        // User must have one of the required roles
        const hasRequiredRole = role && requiredRoles.includes(role);

        if (!hasRequiredRole) {
          console.log(
            `Access denied: User role "${role}" not in required roles:`,
            requiredRoles
          );
          setIsAuthorized(false);

          // Redirect to the appropriate page based on user's role
          if (redirectPath) {
            router.replace(redirectPath);
          } else {
            router.replace("/auth");
          }
          return;
        }
      }

      // User is authorized
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error in SessionGuard:", error);
      setIsAuthorized(false);
    }
  }, [user, role, loading, pathname, requiredRoles, router, committee]);

  // Show loading state while checking authorization
  if (loading || isAuthorized === null) {
    return <GuradLoader />;
  }

  // If not authorized, show restricted access message instead of loader
  if (!isAuthorized) {
    return <></>;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}
