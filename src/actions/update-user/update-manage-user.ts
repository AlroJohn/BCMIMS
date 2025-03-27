'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Interface for update user data
interface UpdateUserData {
  id: string;
  name: string;
  phone: string | null;
  profile: string | null;
  role: UserRole;
  subRole?: boolean; // Add subRole field
  metadata?: any; // For storing sub-role name or other information
}

// Update user
export async function updateUser(data: UpdateUserData): Promise<any> {
  try {
    const { id, name, phone, profile, role, subRole, metadata } = data;

    // Validate required fields
    if (!id || !name) {
      throw new Error('Missing required fields');
    }

    // Update the user without any role-based restrictions
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        profile,
        role,
        subRole: subRole || false, // Set the subRole field directly
        metadata, // Store additional info in metadata
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
        subRole: true, // Include the subRole field
        metadata: true, // Include metadata for any additional info
        createdAt: true,
        updatedAt: true,
      },
    });

    // Revalidate the users page to reflect changes
    revalidatePath('/admin/manage-users');

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Fetch all users with subRole field
export async function fetchUsers(): Promise<any[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
        subRole: true, // Include the subRole field
        metadata: true, // Include metadata for sub-role name
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}