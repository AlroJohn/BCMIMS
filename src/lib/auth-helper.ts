// lib/auth-helpers.ts
import { cookies } from 'next/headers';

/**
 * Gets the current user ID from cookies.
 * This is a simple helper function to access the user ID stored in cookies.
 */
export async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = cookies();
    return (await cookieStore).get('userId')?.value || null;
}

/**
 * Fetches the current user's role from the API.
 * This uses the user-role API you already have set up.
 */
export async function getCurrentUserRole(): Promise<string | null> {
    const userId = getCurrentUserId();

    if (!userId) {
        return null;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/user-role?userId=${userId}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user role');
        }

        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}

/**
 * Checks if a user is authenticated by verifying if a userId cookie exists.
 */
export function isAuthenticated(): boolean {
    return !!getCurrentUserId();
}