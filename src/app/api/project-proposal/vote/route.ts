// app/api/project-proposal/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { proposalId, vote, userId } = await req.json();
    
    if (!proposalId || vote === undefined || vote === null || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if proposal exists
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: proposalId },
    });
    
    if (!proposal) {
      return NextResponse.json({ error: "Project proposal not found" }, { status: 404 });
    }
    
    // Create or update vote using upsert
    const newVote = await prisma.vote.upsert({
      where: {
        userId_proposalId: {
          userId,
          proposalId
        }
      },
      update: {
        vote,
        votedAt: new Date(),
      },
      create: {
        userId,
        proposalId,
        vote,
        votedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
    
    return NextResponse.json(newVote);
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}