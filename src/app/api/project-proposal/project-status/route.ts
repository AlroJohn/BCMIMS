// app/api/project-proposal/project-status/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import NotificationService from '@/services/project-notification-service';


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

    // Update the approval status
    const updatedApproval = await prisma.approvedBy.upsert({
      where: {
        userId_proposalId: { userId, proposalId },
      },
      update: {
        status: approvedStatus,
        comment,
        updatedAt: new Date(),
      },
      create: {
        userId,
        proposalId,
        status: approvedStatus,
        comment,
        updatedAt: new Date(),
      },
    });

    // Only send notifications for Approved or Rejected status
    if (approvedStatus === 'Approved' || approvedStatus === 'Rejected') {
      // Send notification about the status change
      await NotificationService.sendProjectStatusNotification(
        proposalId,
        approvedStatus,
        comment
      );
    }

    // Revalidate paths that might display project data
    revalidatePath('/admin/project-proposals');

    // Get the project to revalidate committee-specific paths
    const project = await prisma.projectProposal.findUnique({
      where: { id: proposalId }
    });

    // Revalidate committee-specific paths if needed
    if (project) {
      revalidatePath(`/committee/${project.committee.toLowerCase()}`);
    }

    return NextResponse.json(updatedApproval, { status: 200 });
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}