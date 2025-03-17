'use client';

import React, { ReactNode } from 'react';
import { supabase } from "@/lib/supabase-client";
import { signOutUser } from '@/actions/signout-action';

interface LogoutWrapperProps {
  children: ReactNode;
  onLogoutSuccess?: () => void;
  onLogoutError?: (error: Error) => void;
  redirectPath?: string;
}

const LogoutWrapper: React.FC<LogoutWrapperProps> = ({ 
  children, 
  onLogoutSuccess, 
  onLogoutError,
  redirectPath = "/auth" 
}) => {
    const handleLogout = async () => {
        try {
            console.log("Starting logout process");
            
            // 1. Sign out on the client side first
            await supabase.auth.signOut();
            console.log("Client-side sign out completed");
            
            // 2. Call server-side logout to clear server-side session
            const response = await signOutUser();
            console.log("Server-side sign out response:", response);

            // 3. Clear any cookies manually
            document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            console.log("Cookies cleared");
            
            // 4. Optional callback for successful logout
            onLogoutSuccess?.();
            
            // 5. Force a complete page reload
            window.location.href = redirectPath;
        } catch (error) {
            console.error("Logout error:", error);
            
            // Optional error handling
            if (onLogoutError) {
                onLogoutError(error instanceof Error ? error : new Error('Logout failed'));
            } else {
                alert("Logout failed. Please try again.");
            }
        }
    };

    // Clone the child element and attach the onClick handler
    const childWithLogoutHandler = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { 
                onClick: (e: React.MouseEvent) => {
                    // Preserve original onClick if exists
                    if ((child as React.ReactElement<any>).props.onClick) {
                        (child as React.ReactElement<any>).props.onClick(e);
                    }
                    // Always trigger logout
                    handleLogout();
                }
            });
        }
        return child;
    });

    return <>{childWithLogoutHandler}</>;
};

export default LogoutWrapper;