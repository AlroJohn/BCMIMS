// app/api/project-proposals/fetch-proposal/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const proposals = await prisma.projectProposal.findMany({
      include: {
        postedBy: true, // Include the user who posted the proposal
        votes: true,    // Include votes related to the proposal
        approvedBy: {
          include: {
            approvedBy: true, // Include the user who performed the approval
          },
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Failed to fetch project proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project proposals' },
      { status: 500 }
    );
  }
}
