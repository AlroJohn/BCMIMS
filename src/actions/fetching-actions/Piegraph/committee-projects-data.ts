// app/api/proposals/current-month-status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get the current date
        const now = new Date();

        // Calculate the first day of the current month
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate the first day of the next month (end bound)
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // Calculate the first day of the previous month
        const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Get counts for this month by status
        const pendingCount = await prisma.projectProposal.count({
            where: {
                createdAt: {
                    gte: firstDayCurrentMonth,
                    lt: firstDayNextMonth
                },
                approvedBy: {
                    some: {
                        status: 'Pending'
                    }
                }
            }
        });

        const approvedCount = await prisma.projectProposal.count({
            where: {
                createdAt: {
                    gte: firstDayCurrentMonth,
                    lt: firstDayNextMonth
                },
                approvedBy: {
                    some: {
                        status: 'Approved'
                    }
                }
            }
        });

        const rejectedCount = await prisma.projectProposal.count({
            where: {
                createdAt: {
                    gte: firstDayCurrentMonth,
                    lt: firstDayNextMonth
                },
                approvedBy: {
                    some: {
                        status: 'Rejected'
                    }
                }
            }
        });

        // Get previous month total for trend calculation
        const previousMonthTotal = await prisma.projectProposal.count({
            where: {
                createdAt: {
                    gte: firstDayPreviousMonth,
                    lt: firstDayCurrentMonth
                }
            }
        });

        return NextResponse.json({
            counts: {
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            },
            previousMonthTotal,
            currentMonth: now.toLocaleString('default', { month: 'long' }),
            currentYear: now.getFullYear()
        });
    } catch (error) {
        console.error("Error fetching proposal status:", error);
        return NextResponse.json(
            { message: "Error fetching proposal status" },
            { status: 500 }
        );
    }
}