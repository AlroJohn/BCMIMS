// src/app/actions/project-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ApprovedStatus } from "@prisma/client";

export async function getProjectsByStatus() {
    try {
        // Get current date and calculate date 6 months ago
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        // Subtract 6 months (adjust as needed to include the current month)
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Start at the first day of the month
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Build an array of the past 6 month names (e.g. January, February, etc.)
        const months: string[] = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - 5 + i);
            const monthName = date.toLocaleString("default", { month: "long" });
            months.push(monthName);
        }

        // Fetch all proposals within the past 6 months, including their approval records
        const proposals = await prisma.projectProposal.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                    lte: currentDate,
                },
            },
            include: {
                approvedBy: true, // returns an array of ApprovedBy records per proposal
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Initialize data structure for the chart
        const projectsByMonth = months.map((month) => ({
            month,
            approved: 0,
            rejected: 0,
            pending: 0,
            total: 0,
        }));

        // Populate the chart data with counts per status
        proposals.forEach((proposal) => {
            if (!proposal.createdAt) return;

            // Determine the month of this proposal
            const proposalDate = new Date(proposal.createdAt);
            const proposalMonth = proposalDate.toLocaleString("default", { month: "long" });
            const monthIndex = months.indexOf(proposalMonth);
            if (monthIndex !== -1) {
                // Increase the total count for the month
                projectsByMonth[monthIndex].total += 1;

                // If no approval records, treat the proposal as pending
                if (!proposal.approvedBy || proposal.approvedBy.length === 0) {
                    projectsByMonth[monthIndex].pending += 1;
                } else {
                    const hasApproved = proposal.approvedBy.some(
                        (a) => a.status === ApprovedStatus.Approved
                    );
                    const hasRejected = proposal.approvedBy.some(
                        (a) => a.status === ApprovedStatus.Rejected
                    );

                    if (hasApproved) {
                        projectsByMonth[monthIndex].approved += 1;
                    }
                    if (hasRejected) {
                        projectsByMonth[monthIndex].rejected += 1;
                    }
                    // If neither approved nor rejected, you might consider it pending.
                    if (!hasApproved && !hasRejected) {
                        projectsByMonth[monthIndex].pending += 1;
                    }
                }
            }
        });

        return projectsByMonth;
    } catch (error) {
        console.error("Error fetching projects by status:", error);
        throw new Error("Failed to fetch projects by status");
    }
}

export async function getApprovedProjectsRadarData() {
    try {
        // Get the status data
        const statusData = await getProjectsByStatus();

        // Transform to the structure needed for the radar chart.
        // Here we use the key 'desktop' to represent approved projects.
        const radarData = statusData.map((item) => ({
            month: item.month,
            desktop: item.approved,
        }));

        return radarData;
    } catch (error) {
        console.error("Error transforming data for radar chart:", error);
        throw new Error("Failed to prepare radar chart data");
    }
}



// src/app/actions/project-actions.ts
// Add this function to your existing actions file

export async function getRejectedProjectsRadarData() {
    try {
      // Get the status data using the existing function
      const statusData = await getProjectsByStatus();
  
      // Transform to the structure needed for the radar chart
      // Here we use the key 'mobile' to represent rejected projects
      const radarData = statusData.map((item) => ({
        month: item.month,
        mobile: item.rejected,
      }));
  
      return radarData;
    } catch (error) {
      console.error("Error transforming data for rejected projects radar chart:", error);
      throw new Error("Failed to prepare rejected projects radar chart data");
    }
  }