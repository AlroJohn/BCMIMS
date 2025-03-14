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

    const formattedProposals = proposals.map((proposal) => {
      // Compute status primarily from Vote table
      let status = "Pending";
      if (proposal.votes.length > 0) {
        const approvedVotes = proposal.votes.filter((v) => v.vote === "Approved").length;
        const rejectedVotes = proposal.votes.filter((v) => v.vote === "Rejected").length;
        const totalVotes = proposal.votes.length;

        if (approvedVotes > rejectedVotes && approvedVotes > totalVotes / 2) {
          status = "Approved";
        } else if (rejectedVotes > approvedVotes && rejectedVotes > totalVotes / 2) {
          status = "Rejected";
        }
      } else if (proposal.approvedBy.length > 0) {
        // Fallback to ApprovedBy if no votes
        const latestApproval = proposal.approvedBy.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        status = latestApproval.status;
      }

      return {
        ...proposal,
        status, // Include computed status
        postedBy: proposal.postedBy || { id: "unknown", name: "Unknown User", role: "Unknown" },
        votes: proposal.votes.map((vote) => ({
          ...vote,
          user: vote.user || { id: "unknown", name: "Unknown User", role: "Unknown" },
          votedAt: vote.votedAt.toISOString(),
        })),
        approvedBy: proposal.approvedBy.map((approval) => ({
          ...approval,
          approvedBy: approval.approvedBy || { id: "unknown", name: "Unknown User", role: "Unknown" },
          updatedAt: approval.updatedAt.toISOString(),
          createdAt: approval.createdAt?.toISOString(),
        })),
        proposedDate: proposal.proposedDate.toISOString(),
        createdAt: proposal.createdAt?.toISOString(),
      };
    });

    return NextResponse.json(formattedProposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}