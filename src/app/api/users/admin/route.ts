// src/app/api/users/admins/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
    try {
        // Find all users with admin roles and phone numbers
        const adminUsers = await prisma.user.findMany({
            where: {
                role: 'Admin', // Use your actual admin role value - adjust as needed
                phone: {
                    not: null, // Only get admins with phone numbers
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });

        return NextResponse.json({
            success: true,
            admins: adminUsers,
        });
    } catch (error: any) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch admin users',
                error: error.message,
            },
            { status: 500 }
        );
    }
}