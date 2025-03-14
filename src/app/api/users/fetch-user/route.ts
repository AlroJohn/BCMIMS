// app/api/users/fetch-user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map the UserRole enum to committee roles
    const committeeRoles = {
      Admin: "Admin",
      Education: "Committee on Education and Culture",
      Environment: "Committee on Environment",
      Finance: "Committee on Finance, Budget and Appropriations",
      HealthServices: "Committee on Health and Services",
      PeaceOrder: "Committee on Peace and Order",
      PublicWorks: "Committee on Public Work and Infrastructure",
      Women: "Committee on Women, Children and Family",
    };

    // Format the data to match the User type
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      position: committeeRoles[user.role] || "Staff", // Map role to committee position
      phone: user.phone || "", // Handle optional phone field
      status: "Active", // Default status (you can modify this based on your logic)
      lastActive: user.updatedAt,
      dateAdded: user.createdAt,
      image: "", // Add image URL if available
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

