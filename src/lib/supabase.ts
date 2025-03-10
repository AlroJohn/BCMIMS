// supabase.ts
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Print environment variables for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Initialize Supabase auth listener
export function initSupabaseAuth() {
  if (typeof window !== 'undefined') {
    // Setup auth state change listener to sync with cookies
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.id);
      
      if (session) {
        // When we get a session, store the access token in a cookie that middleware can access
        const expires = new Date(session.expires_at! * 1000).toUTCString();
        document.cookie = `sb-access-token=${session.access_token}; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; expires=${expires}; SameSite=Lax; secure`;
      } else if (event === 'SIGNED_OUT') {
        // Clear cookies on sign out
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    });
  }
}

// Hook to ensure auth is initialized
export function useSupabaseAuth() {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  
  useEffect(() => {
    console.log("Initializing Supabase auth...");
    initSupabaseAuth();
    setIsAuthInitialized(true);
  }, []);

  return { isAuthInitialized };
}