// src/app/actions/project-actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { ApprovedStatus } from "@prisma/client";

export async function getProjectsByStatus() {
    try {
        // Get current date and calculate date 6 months ago
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // -5 to include current month (total of 6 months)
        sixMonthsAgo.setDate(1); // Start from the first day of the month
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Get month names for the past 6 months
        const months: string[] = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - 5 + i);
            const monthName = date.toLocaleString('default', { month: 'long' });
            months.push(monthName);
        }

        // Fetch all projects within the past 6 months
        const projects = await prisma.projectProposal.findMany({
            where: {
                proposedDate: {
                    gte: sixMonthsAgo,
                    lte: currentDate
                }
            },
            include: {
                approvedBy: true
            },
            orderBy: {
                proposedDate: 'asc'
            }
        });

        // Initialize data structure for the chart (for all statuses)
        const projectsByMonth = months.map(month => ({
            month,
            approved: 0,
            rejected: 0,
            pending: 0,
            total: 0
        }));

        // Populate the data with project counts by status
        projects.forEach(project => {
            // Calculate which month bucket this project belongs to
            const projectDate = new Date(project.proposedDate);
            const projectMonth = projectDate.toLocaleString('default', { month: 'long' });

            // Find the corresponding month in our data
            const monthIndex = months.indexOf(projectMonth);
            if (monthIndex !== -1) {
                // Increment total count
                projectsByMonth[monthIndex].total += 1;

                // Check approval status
                if (project.approvedBy.length === 0) {
                    // No approval record means pending
                    projectsByMonth[monthIndex].pending += 1;
                } else {
                    // Count by status
                    const hasApproved = project.approvedBy.some(a => a.status === ApprovedStatus.Approved);
                    const hasRejected = project.approvedBy.some(a => a.status === ApprovedStatus.Rejected);

                    if (hasApproved) {
                        projectsByMonth[monthIndex].approved += 1;
                    }
                    if (hasRejected) {
                        projectsByMonth[monthIndex].rejected += 1;
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
        // Get data from the main function
        const statusData = await getProjectsByStatus();

        // Transform to the structure needed for the radar chart
        const radarData = statusData.map(item => ({
            month: item.month,
            desktop: item.approved  // Using 'desktop' to match the chart component structure
        }));

        return radarData;
    } catch (error) {
        console.error("Error transforming data for radar chart:", error);
        throw new Error("Failed to prepare radar chart data");
    }
}