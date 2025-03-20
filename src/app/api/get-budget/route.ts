import { NextResponse } from 'next/server';
import { PrismaClient, ApprovedStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all project proposals where at least one approval status is Approved
    const projectProposals = await prisma.projectProposal.findMany({
      where: {
        approvedBy: {
          some: {
            status: ApprovedStatus.Approved, // Filter only approved proposals
          },
        },
      },
      include: {
        approvedBy: true, // Include the approvedBy relation to get approval details
      },
    });

    // Group the proposals by committee and calculate the total approved budget for each committee
    const groupedByCommittee = projectProposals.reduce((acc, proposal) => {
      // Filter out the approvedBy entries and calculate the total approved budget
      const approvedApprovals = proposal.approvedBy.filter(
        (approval) => approval.status === ApprovedStatus.Approved
      );

      // Calculate the total approved budget for this proposal
      const totalApprovedBudget = approvedApprovals.reduce(
        (sum, approval) => sum + proposal.budget, 0
      );

      // Group by committee
      if (!acc[proposal.committee]) {
        acc[proposal.committee] = {
          committee: proposal.committee,
          totalApprovedBudget: 0,
          approvedProposalsCount: 0,
        };
      }

      // Add the current proposal's budget to the committee's total
      acc[proposal.committee].totalApprovedBudget += totalApprovedBudget;
      acc[proposal.committee].approvedProposalsCount += approvedApprovals.length;

      return acc;
    }, {});

    // Convert the grouped data into an array
    const result = Object.values(groupedByCommittee);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching data.' }, { status: 500 });
  }
}
