// src/app/actions/project-actions.ts
'use server';

import { prisma } from "@/lib/prisma";
import { ApprovedStatus } from "@prisma/client";

export async function getApprovedProjectsByMonth() {
    try {
        // Get current year
        const currentYear = new Date().getFullYear();

        // Fetch all approved projects for the current year
        const approvedProjects = await prisma.projectProposal.findMany({
            where: {
                approvedBy: {
                    some: {
                        status: ApprovedStatus.Approved
                    }
                },
                proposedDate: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`)
                }
            },
            include: {
                approvedBy: {
                    where: {
                        status: ApprovedStatus.Approved
                    }
                }
            },
            orderBy: {
                proposedDate: 'asc'
            }
        });

        // Create a map to store projects by month
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Initialize data structure for the chart
        const projectsByMonth = monthNames.map(month => ({
            month,
            desktop: 0 // Using 'desktop' to match your chart structure
        }));

        // Populate the data with approved project counts
        approvedProjects.forEach(project => {
            const month = new Date(project.proposedDate).getMonth();
            projectsByMonth[month].desktop += 1;
        });

        return projectsByMonth;
    } catch (error) {
        console.error("Error fetching approved projects by month:", error);
        throw new Error("Failed to fetch approved projects by month");
    }
}

export async function getApprovedProjectsByMonthForYear(year = new Date().getFullYear()) {
    try {
        // Fetch all approved projects for the specified year
        const approvedProjects = await prisma.projectProposal.findMany({
            where: {
                approvedBy: {
                    some: {
                        status: ApprovedStatus.Approved
                    }
                },
                proposedDate: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31`)
                }
            },
            include: {
                approvedBy: {
                    where: {
                        status: ApprovedStatus.Approved
                    }
                }
            },
            orderBy: {
                proposedDate: 'asc'
            }
        });

        // Create a map to store projects by month
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Initialize data structure for the chart
        const projectsByMonth = monthNames.map(month => ({
            month,
            desktop: 0 // Using 'desktop' to match your chart structure
        }));

        // Populate the data with approved project counts
        approvedProjects.forEach(project => {
            const month = new Date(project.proposedDate).getMonth();
            projectsByMonth[month].desktop += 1;
        });

        return projectsByMonth;
    } catch (error) {
        console.error(`Error fetching approved projects for year ${year}:`, error);
        throw new Error(`Failed to fetch approved projects for year ${year}`);
    }
}