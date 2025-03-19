import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const proposals = await prisma.projectProposal.findMany({
      where: {
        OR: [
          {
            approvedBy: {
              some: {
                status: 'Approved'
              }
            }
          },

          {
            votes: {
              some: {}
            }
          }
        ]
      },
      include: {
        postedBy: true,
        votes: {
          include: {
            user: true
          }
        },
        approvedBy: {
          include: {
            approvedBy: true
          }
        }
      },
    });

    // Then filter further in JavaScript to ensure we only get truly approved proposals
    const approvedProposals = proposals.filter(proposal => {
      // Check vote-based approval
      if (proposal.votes.length > 0) {
        const approvedVotes = proposal.votes.filter(v => v.vote === "Approved").length;
        const rejectedVotes = proposal.votes.filter(v => v.vote === "Rejected").length;
        const totalVotes = proposal.votes.length;

        if (approvedVotes > rejectedVotes && approvedVotes > totalVotes / 2) {
          return true; // This proposal is approved via votes
        }
      }

      // Check approval-based approval (if not already approved by votes)
      if (proposal.approvedBy.length > 0) {
        const latestApproval = proposal.approvedBy.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];

        if (latestApproval.status === "Approved") {
          return true; // This proposal is approved via approvals
        }
      }

      return false; // Not approved
    });

    const formattedProposals = approvedProposals.map((proposal) => {
      return {
        ...proposal,
        status: "Approved", // All proposals here are definitely approved
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