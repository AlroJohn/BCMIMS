// app/api/project-proposal/current-month-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        // Get the committee from query params
        const { searchParams } = new URL(request.url);
        const committeeParam = searchParams.get('committee');

        // Convert URL path format to UserRole enum
        const getCommitteeRole = (committeeStr: string | null): UserRole | undefined => {
            if (!committeeStr) return undefined;

            // Map URL path segments to enum values
            const committeeMap: Record<string, UserRole> = {
                "education": UserRole.Education,
                "environment": UserRole.Environment,
                "finance": UserRole.Finance,
                "health-services": UserRole.HealthServices,
                "peace-order": UserRole.PeaceOrder,
                "public-works": UserRole.PublicWorks,
                "women": UserRole.Women
            };

            return committeeMap[committeeStr];
        };

        // Get the proper enum value for the committee
        const committeeRole = getCommitteeRole(committeeParam);

        // For display purposes
        const getDisplayName = (role?: UserRole): string => {
            if (!role) return "All Committees";

            // Convert enum values to display names
            const displayMap: Record<UserRole, string> = {
                [UserRole.Admin]: "Admin",
                [UserRole.Education]: "Education",
                [UserRole.Environment]: "Environment",
                [UserRole.Finance]: "Finance",
                [UserRole.HealthServices]: "Health Services",
                [UserRole.PeaceOrder]: "Peace Order",
                [UserRole.PublicWorks]: "Public Works",
                [UserRole.Women]: "Women",
            };

            return displayMap[role];
        };

        // Get the current date
        const now = new Date();

        // Calculate the first day of the current month
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate the first day of the next month (end bound)
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // Calculate the first day of the previous month
        const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Base filter for current month
        const baseFilter: Prisma.ProjectProposalWhereInput = {
            createdAt: {
                gte: firstDayCurrentMonth,
                lt: firstDayNextMonth
            },
        };

        // Add committee filter if specified
        const committeeFilter: Prisma.ProjectProposalWhereInput = committeeRole ? {
            ...baseFilter,
            committee: committeeRole
        } : baseFilter;

        // Previous month filter
        const prevMonthBaseFilter: Prisma.ProjectProposalWhereInput = {
            createdAt: {
                gte: firstDayPreviousMonth,
                lt: firstDayCurrentMonth
            },
        };

        // Add committee filter for previous month if specified
        const prevMonthCommitteeFilter: Prisma.ProjectProposalWhereInput = committeeRole ? {
            ...prevMonthBaseFilter,
            committee: committeeRole
        } : prevMonthBaseFilter;

        // Get counts for this month by status
        const pendingCount = await prisma.projectProposal.count({
            where: {
                ...committeeFilter,
                votes: {
                    some: {
                        vote: 'Approved'
                    }
                }
            }
        });

        const approvedCount = await prisma.projectProposal.count({
            where: {
                ...committeeFilter,
                approvedBy: {
                    some: {
                        status: 'Approved'
                    }
                }
            }
        });

        const rejectedCount = await prisma.projectProposal.count({
            where: {
                ...committeeFilter,
                approvedBy: {
                    some: {
                        status: 'Rejected'
                    }
                }
            }
        });

        // Get previous month total for trend calculation
        const previousMonthTotal = await prisma.projectProposal.count({
            where: prevMonthCommitteeFilter
        });

        return NextResponse.json({
            counts: {
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            },
            previousMonthTotal,
            currentMonth: now.toLocaleString('default', { month: 'long' }),
            currentYear: now.getFullYear(),
            committee: getDisplayName(committeeRole)
        });
    } catch (error) {
        console.error("Error fetching proposal status:", error);
        return NextResponse.json(
            { message: "Error fetching proposal status" },
            { status: 500 }
        );
    }
}