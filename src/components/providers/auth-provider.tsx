"use client";

import { useSupabaseAuth } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import GuradLoader from "../custom/loader/loading-guard";
import { supabase } from "@/lib/supabase-client";

type User = any; // Replace with your User type

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthInitialized } = useSupabaseAuth();

  // Effect to fetch and set user on mount and auth state changes
  useEffect(() => {
    if (!isAuthInitialized) return;

    // Initial check for session
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (!sessionData?.session) {
          // No session found
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        // Set user from session
        setUser(sessionData.session.user);

        // Fetch user role with better error handling
        if (sessionData.session.user?.id) {
          try {
            console.log("Fetching role for user ID:", sessionData.session.user.id);

            const response = await fetch(
              `/api/users/user-role?userId=${sessionData.session.user.id}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // Add cache: 'no-store' to avoid stale data
                cache: 'no-store'
              }
            );

            // Log the raw response for debugging
            const responseText = await response.text();
            console.log("Role API response:", response.status, responseText);

            if (response.ok) {
              try {
                // Parse the response text
                const userData = JSON.parse(responseText);

                // In the checkSession function, after parsing userData
                if (userData && userData.role) {
                  console.log("Setting user role:", userData.role);
                  setRole(userData.role);

                  // Add this block to handle userData
                  if (userData.userData) {
                    setUser(prevUser => ({
                      ...prevUser,
                      ...userData.userData  // This spreads the phone and other fields directly into user
                    }));
                  }

                } else {
                  console.error("Invalid role data format:", userData);
                  setError("Invalid role data format");
                }
              } catch (parseError) {
                console.error("JSON parse error:", parseError);
                setError("Failed to parse role data");
              }
            } else {
              console.error("Failed to fetch user role, status:", response.status);

              // Log more details about the error
              try {
                const errorData = JSON.parse(responseText);
                console.error("Error details:", errorData);
              } catch (error) {
                console.error("Raw error response:", responseText);
              }

              setError(`Failed to fetch user role: ${response.status}`);
            }
          } catch (err) {
            console.error("Error fetching user role:", err);
            setError("Error fetching user role");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Run initial check
    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);

          // Fetch user role with better error handling
          if (session.user?.id) {
            try {
        
              const response = await fetch(
                `/api/users/user-role?userId=${session.user.id}`,
                {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                  cache: 'no-store'
                }
              );

              const responseText = await response.text();
            

              if (response.ok) {
                try {
                  const userData = JSON.parse(responseText);

                  if (userData && userData.role) {
                 
                    setRole(userData.role);

                    if (userData.userData) {
                      setUser(prevUser => ({
                        ...prevUser,
                        ...userData.userData
                      }));
                    }
                  } 
                } catch (parseError) {
                  console.error("Auth change: JSON parse error:", parseError);
                }
              } else {
                console.error("Auth change: Failed to fetch user role, status:", response.status);
              }
            } catch (err) {
              console.error("Auth change: Error fetching user role:", err);
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
      }
    });

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isAuthInitialized]);

  return (
    <AuthContext.Provider value={{ user, role, loading, error }}>
      {loading ? <GuradLoader /> : children}
    </AuthContext.Provider>
  );
}