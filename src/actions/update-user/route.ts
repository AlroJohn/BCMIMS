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

// Fetch all users
export async function fetchUsers(): Promise<UserData[]> {
  try {
    const users = await prisma.user.findMany({
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

    // Update the user without any role-based restrictions
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