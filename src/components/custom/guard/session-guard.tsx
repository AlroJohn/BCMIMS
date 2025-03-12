"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import GuradLoader from "../loader/loading-guard";


interface SessionGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Roles allowed to access this route
}

export default function SessionGuard({ 
  children, 
  requiredRoles = [] 
}: SessionGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait until auth is loaded
    if (loading) return;

    // Not authenticated
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/");
      return;
    }

    // Check role-based access if requiredRoles are specified
    if (requiredRoles.length > 0) {
      // User must have one of the required roles
      const hasRequiredRole = role && requiredRoles.includes(role);
      
      if (!hasRequiredRole) {
        console.log(`Access denied: User role "${role}" not in required roles:`, requiredRoles);
        
        // Redirect based on the user's actual role
        if (role === "Admin") {
          router.replace("/Admin");
        } else if (role === "education") {
          router.replace("/Environment");
        } else if (role === "finance") {
          router.replace("/finance");
        } else if (role === "HealthServices") {
          router.replace("/health-services");
        } else if (role === "PeaceOrder") {
          router.replace("/peace-order");
        } else if (role === "PublicWorks") {
          router.replace("/public-works");
        } else if (role === "Woomen") {
          router.replace("/woomen");
        } else {
          // Fallback to home if role is invalid
          router.replace("/auth");
        }
        
        setIsAuthorized(false);
        return;
      }
    }
    
    // User is authorized
    setIsAuthorized(true);
  }, [user, role, loading, pathname, requiredRoles, router]);

  // Show loading state while checking authorization
  if (loading || isAuthorized === null) {
    return <GuradLoader />;
  }

  // If not authorized, don't render children
  if (!isAuthorized) {
    return <GuradLoader />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}