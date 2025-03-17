'use server';

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";

export type CommitteeInfo = {
    role: UserRole;
    description: string;
    person: string;
    budget: number;
};

export type BudgetOverviewData = {
    committeeInfo: CommitteeInfo;
    totalProjects: number;
    totalBudget: number;
    approvedProjects: number;
    pendingProjects: number;
};

const COMMITTEE_DESCRIPTIONS = {
    [UserRole.Admin]: "System administrator with full access to all features and data.",
    [UserRole.Education]: "Responsible for educational initiatives and programs in the barangay.",
    [UserRole.Environment]: "Focuses on environmental protection, waste management, and sustainable practices.",
    [UserRole.Finance]: "Manages financial aspects, budgeting, and fiscal planning.",
    [UserRole.HealthServices]: "Oversees health programs, medical missions, and wellness initiatives.",
    [UserRole.PeaceOrder]: "Maintains peace and order, security, and conflict resolution in the community.",
    [UserRole.PublicWorks]: "Handles infrastructure development, maintenance, and public facilities.",
    [UserRole.Women]: "Advocates for women's rights, gender equality, and related programs.",
};

/**
 * Fetches budget overview data for a specific committee role.
 * If no role is provided, it uses the current user's role.
 */
export async function getBudgetOverviewByRole(role?: UserRole, userId?: string): Promise<BudgetOverviewData> {
    // If no role is provided, get the current user's role
    if (!role) {
        if (!userId) {
            // Get userId from cookie or session (this depends on your auth implementation)
            const cookieStore = cookies();
            const userIdCookie = (await cookieStore).get('userId')?.value;

            if (!userIdCookie) {
                throw new Error("Not authenticated");
            }

            userId = userIdCookie;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        role = user.role as UserRole;
    }

    // Get committee head (assuming the first user with the role might be the head)
    const committeeHead = await prisma.user.findFirst({
        where: { role },
        select: { name: true }
    });

    // Get budget overview for the role
    const budgetOverview = await prisma.budgetOverview.findFirst({
        where: { committeeRole: role },
        orderBy: { createdAt: 'desc' },
    });

    // Get total number of projects for this committee
    const totalProjects = await prisma.projectProposal.count({
        where: {
            postedBy: { role }
        }
    });

    // Get allocated budget (sum of all approved project budgets)
    const approvedProposals = await prisma.projectProposal.findMany({
        where: {
            postedBy: { role },
            approvedBy: {
                some: {
                    status: 'Approved'
                }
            }
        },
        select: {
            budget: true
        }
    });

    const totalBudget = approvedProposals.reduce((sum, proposal) => sum + proposal.budget, 0);

    // Count approved and pending projects
    const approvedProjects = await prisma.projectProposal.count({
        where: {
            postedBy: { role },
            approvedBy: {
                some: {
                    status: 'Approved'
                }
            }
        }
    });

    const pendingProjects = await prisma.projectProposal.count({
        where: {
            postedBy: { role },
            approvedBy: {
                some: {
                    status: 'Pending'
                }
            }
        }
    });

    // Create committee info object
    const committeeInfo: CommitteeInfo = {
        role,
        description: COMMITTEE_DESCRIPTIONS[role] || `Committee for ${role} initiatives.`,
        person: committeeHead?.name || "Not assigned",
        budget: budgetOverview?.totalBudget || 0,
    };

    return {
        committeeInfo,
        totalProjects,
        totalBudget,
        approvedProjects,
        pendingProjects
    };
}