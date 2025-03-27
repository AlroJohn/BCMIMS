"use client";

import { useSupabaseAuth } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import GuradLoader from "../custom/loader/loading-guard";
import { supabase } from "@/lib/supabase-client";

type User = any; // Replace with your User type

interface AuthContextType {
  user: User | null;
  role: string | null;
  name: string | null;
  middleName: string | null;
  lastName: string | null;
  suffixName: string | null;
  phone: string | null;
  profile: string | null;
  loading: boolean;
  refreshing: boolean; // Added for refresh operations
  isLoading: boolean; // Alias for loading to maintain compatibility
  error: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  phone: null,
  role: null,
  name: null,
  middleName: null,
  lastName: null,
  suffixName: null,
  profile: null,
  loading: true,
  refreshing: false,
  isLoading: true,
  error: null,
  signIn: async () => ({ success: false, message: "Not implemented" }),
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [suffixName, setSuffixName] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For refresh operations
  const [error, setError] = useState<string | null>(null);
  const { isAuthInitialized } = useSupabaseAuth();

  // Function to fetch user role and data
  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/user-role?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const responseText = await response.text();

      if (response.ok) {
        try {
          const userData = JSON.parse(responseText);

          if (userData && userData.role) {
            setRole(userData.role);

            if (userData.userData) {
              // Extract and set individual properties
              setPhone(userData.userData.phone || null);
              setName(userData.userData.name || null);
              setProfile(userData.userData.profile || null);
              setMiddleName(userData.userData.middleName || null);
              setLastName(userData.userData.lastName || null);
              setSuffixName(userData.userData.suffixName || null);

              // Update the user object with any additional data
              setUser((prevUser) => ({
                ...prevUser,
                ...userData.userData,
              }));
            }
            return userData;
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
    return null;
  };

  // Effect to fetch and set user on mount and auth state changes
  useEffect(() => {
    if (!isAuthInitialized) return;

    // Initial check for session
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

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
          setPhone(null);
          setName(null);
          setMiddleName(null);
          setLastName(null);
          setSuffixName(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Set user from session
        setUser(sessionData.session.user);

        // Fetch user role and data
        if (sessionData.session.user?.id) {
          await fetchUserData(sessionData.session.user.id);
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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            setUser(session.user);

            // Fetch user role and data
            if (session.user?.id) {
              await fetchUserData(session.user.id);
            }
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setRole(null);
          setPhone(null);
          setName(null);
          setMiddleName(null);
          setLastName(null);
          setSuffixName(null);
          setProfile(null);
        }
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isAuthInitialized]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        setUser(data.user);
        if (data.user.id) {
          await fetchUserData(data.user.id);
        }
        return { success: true, message: "Signed in successfully" };
      }

      return {
        success: false,
        message: "No user returned from authentication",
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setPhone(null);
      setName(null);
      setMiddleName(null);
      setLastName(null);
      setSuffixName(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user function - modified to use refreshing state
  const refreshUser = async () => {
    if (user?.id) {
      setRefreshing(true);
      try {
        await fetchUserData(user.id);
      } finally {
        setRefreshing(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        refreshing,
        user,
        role,
        phone,
        name,
        middleName,
        lastName,
        suffixName,
        profile,
        isLoading: loading, // Alias for compatibility
        error,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {loading ? <GuradLoader /> : children}
    </AuthContext.Provider>
  );
}
