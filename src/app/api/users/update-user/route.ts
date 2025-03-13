// app/api/users/update-user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { id, name, email, phone } = await request.json();

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}