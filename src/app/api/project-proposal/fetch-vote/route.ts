// app/api/votes/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const votes = await prisma.vote.findMany({
      // Optionally include related user and proposal data:
      include: {
        user: true,
        proposal: true,
      },
    });
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}
