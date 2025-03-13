// app/api/project-proposal/fetch-vote/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        proposal: {
          select: {
            id: true,
            title: true,
          }
        },
      },
    });

    // Format the data to ensure user information is properly included
    const formattedVotes = votes.map(vote => ({
      ...vote,
      user: vote.user || {
        id: "unknown",
        name: "Unknown User",
        role: "Unknown",
      },
      // Ensure dates are properly serialized
      votedAt: vote.votedAt.toISOString(),
    }));

    return NextResponse.json(formattedVotes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}