// app/api/project-proposal/fetch-proposal/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use prisma.projectProposal instead of prisma.proposal
    const proposals = await prisma.projectProposal.findMany({
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Format the data to ensure all required information is present
    const formattedProposals = proposals.map(proposal => ({
      ...proposal,
      postedBy: proposal.postedBy || {
        id: "unknown",
        name: "Unknown User",
        role: "Unknown",
      },
      // Format votes to ensure user information is properly included
      votes: proposal.votes.map(vote => ({
        ...vote,
        user: vote.user || {
          id: "unknown",
          name: "Unknown User",
          role: "Unknown",
        },
        // Ensure dates are properly serialized
        votedAt: vote.votedAt.toISOString(),
      })),
      // Ensure dates are properly serialized
      proposedDate: proposal.proposedDate.toISOString(),
    }));

    return NextResponse.json(formattedProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}