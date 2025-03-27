'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Interface for update user data, now including middleName, lastName and suffixName
interface UpdateUserData {
  id: string;
  name: string;
  middleName?: string;  // Optional middle name
  lastName: string;     // Required last name
  suffixName?: string;  // Optional suffix name
  phone: string | null;
  profile: string | null;
  role: UserRole;
  subRole?: boolean;    // Optional sub-role field
  metadata?: any;       // For storing additional user data (e.g., sub-role name)
}

// Update user function including new name fields
export async function updateUser(data: UpdateUserData): Promise<any> {
  try {
    const {
      id,
      name,
      middleName,
      lastName,
      suffixName,
      phone,
      profile,
      role,
      subRole,
      metadata,
    } = data;

    // Validate required fields (id, name, and lastName)
    if (!id || !name || !lastName) {
      throw new Error('Missing required fields');
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        middleName, // Updated field
        lastName,   // Updated field
        suffixName, // Updated field
        phone,
        profile,
        role,
        subRole: subRole || false, // Set the subRole field directly
        metadata,  // Store additional info in metadata
      },
      select: {
        id: true,
        name: true,
        middleName: true, // Include middleName in response
        lastName: true,   // Include lastName in response
        suffixName: true, // Include suffixName in response
        email: true,
        phone: true,
        profile: true,
        role: true,
        subRole: true,
        metadata: true,
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

// Fetch all users including the new name fields
export async function fetchUsers(): Promise<any[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        middleName: true, // Fetch middleName
        lastName: true,   // Fetch lastName
        suffixName: true, // Fetch suffixName
        email: true,
        phone: true,
        profile: true,
        role: true,
        subRole: true,
        metadata: true,
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
