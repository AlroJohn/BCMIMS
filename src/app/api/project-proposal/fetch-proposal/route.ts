// app/api/project-proposal/fetch-proposal/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const proposals = await prisma.projectProposal.findMany({
      include: {
        postedBy: {
          select: { id: true, name: true, role: true },
        },
        votes: {
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        },
        approvedBy: {
          include: {
            approvedBy: { 
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    // Format the data to ensure all required information is present
    const formattedProposals = proposals.map(proposal => {
      // Compute overall status from approvedBy records:
      const approvalStatuses = proposal.approvedBy.map(approval => approval.status);
      let status = "Pending"; // changed default from "Pending Approval" to "Pending"
      if (approvalStatuses.includes("Rejected")) {
        status = "Rejected";
      } else if (approvalStatuses.includes("Approved")) {
        status = "Approved";
      }

      return {
        ...proposal,
        status, // add the computed status here
        postedBy: proposal.postedBy || {
          id: "unknown",
          name: "Unknown User",
          role: "Unknown",
        },
        votes: proposal.votes.map(vote => ({
          ...vote,
          user: vote.user || {
            id: "unknown",
            name: "Unknown User",
            role: "Unknown",
          },
          votedAt: vote.votedAt.toISOString(),
        })),
        approvedBy: proposal.approvedBy.map(approval => ({
          ...approval,
          status: approval.status,
          approvedBy: approval.approvedBy || {
            id: "unknown",
            name: "Unknown User",
            role: "Unknown",
          },
          updatedAt: approval.updatedAt.toISOString(),
        })),
        proposedDate: proposal.proposedDate.toISOString(),
      };
    });

    return NextResponse.json(formattedProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

