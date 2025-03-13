// app/api/project-proposal/project-status/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { userId, proposalId, status, comment } = await request.json();

    // Validate input data
    if (
      typeof userId !== 'string' ||
      typeof proposalId !== 'string' ||
      typeof status !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Validate that status is one of the allowed enum values
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Cast the status to the enum type
    const approvedStatus = status as 'Pending' | 'Approved' | 'Rejected';

    const updatedApproval = await prisma.approvedBy.upsert({
      where: {
        // Make sure your Prisma schema defines a composite unique constraint with this name.
        userId_proposalId: { userId, proposalId },
      },
      update: {
        status: approvedStatus,
        comment,
        updatedAt: new Date(), // This will update the timestamp if the record exists.
      },
      create: {
        userId,
        proposalId,
        status: approvedStatus,
        comment,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedApproval, { status: 200 });
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
