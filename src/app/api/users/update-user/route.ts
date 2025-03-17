'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Type definition for user data
export type UserData = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  profile?: string | null;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
};

// Fetch all users (excluding Admin users)
export async function fetchUsers(): Promise<UserData[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: UserRole.Admin // Filter out Admin users
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
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

// Interface for update user data
interface UpdateUserData {
  id: string;
  name: string;
  phone: string | null;
  profile: string | null;
  role: UserRole;
}

// Update user
export async function updateUser(data: UpdateUserData): Promise<UserData> {
  try {
    const { id, name, phone, profile, role } = data;

    // Validate required fields
    if (!id || !name) {
      throw new Error('Missing required fields');
    }

    // Get current user data to check role
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    // If the user is an Admin, prevent changes
    if (currentUser?.role === UserRole.Admin) {
      throw new Error('Admin users cannot be modified');
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        profile,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
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