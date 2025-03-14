// app/api/project-proposal/updateVote/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function PUT(request: Request) {
  try {
    const { userId, proposalId, vote, comment } = await request.json();

    // Validate input data
    if (typeof userId !== 'string' || typeof proposalId !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Upsert the vote record: update if exists, or create new if not
    const updatedVote = await prisma.vote.upsert({
      where: {
        // The composite unique constraint is referenced using the generated key name.
        // Ensure that this matches your Prisma Client output.
        userId_proposalId: { userId, proposalId },
      },
      update: {
        vote,
        comment,
        votedAt: new Date(), // update timestamp if exists
      },
      create: {
        userId,
        comment,
        proposalId,
        vote,
        votedAt: new Date(),
      },
    });

    return NextResponse.json(updatedVote, { status: 200 });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
