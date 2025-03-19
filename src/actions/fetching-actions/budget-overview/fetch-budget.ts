"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";


// Define the return type for budget overview data
export interface BudgetOverviewData {
    committeeInfo: {
        role: string;
        description: string;
        person: string;
        budget: number;
    };
    totalProjects: number;
    totalBudget: number;
    allocatedBudget: number;
    remainingBudget: number;
}

// Committee info mapping with descriptions and default budgets
const committeeInfoMap: Record<string, { description: string; defaultBudget: number }> = {
    Admin: {
        description: "Office of the Barangay Captain overseeing all barangay operations and governance.",
        defaultBudget: 500000,
    },
    Education: {
        description: "Handles educational programs and scholarships for barangay residents.",
        defaultBudget: 180000,
    },
    Environment: {
        description: "Manages environmental protection and sustainability initiatives.",
        defaultBudget: 150000,
    },
    Finance: {
        description: "Manages the financial resources and budget of the barangay.",
        defaultBudget: 200000,
    },
    HealthServices: {
        description: "Manages health programs and medical services for barangay residents.",
        defaultBudget: 250000,
    },
    PeaceOrder: {
        description: "Responsible for maintaining peace and order within the barangay.",
        defaultBudget: 220000,
    },
    PublicWorks: {
        description: "Oversees development and maintenance of barangay infrastructure and facilities.",
        defaultBudget: 300000,
    },
    Women: {
        description: "Develops programs focusing on women's welfare, rights, and empowerment.",
        defaultBudget: 170000,
    },
};

// Main function to fetch budget overview by role
export async function getBudgetOverviewByRole(
    role?: UserRole,
    userId?: string
): Promise<BudgetOverviewData> {
    try {
        // Get the current user's role if no specific role is provided
        let targetRole = role;

        if (!targetRole && userId) {
            const userRecord = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });

            if (userRecord) {
                targetRole = userRecord.role as UserRole;
            } else {
                throw new Error("User not found");
            }
        }

        if (!targetRole) {
            throw new Error("No role specified and no authenticated user");
        }

        // Fetch budget overview data for the specified role
        const currentDate = new Date();
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const budgetOverview = await prisma.budgetOverview.findFirst({
            where: {
                committeeRole: targetRole,
                month: {
                    gte: currentMonth,
                    lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
                },
            },
        });

        // Fetch total number of projects for this committee
        const projectCount = await prisma.projectProposal.count({
            where: {
                committee: targetRole,
            },
        });

        // Fetch committee person (Kagawad or Punong Barangay)
        const committeePerson = await prisma.user.findFirst({
            where: {
                role: targetRole,
            },
            select: {
                name: true,
            },
        });

        // If we don't have budget data yet, return default values
        if (!budgetOverview) {
            const roleString = targetRole.toString();
            const committeeInfo = committeeInfoMap[roleString] || {
                description: `${roleString} Committee responsibilities`,
                defaultBudget: 100000,
            };

            return {
                committeeInfo: {
                    role: roleString,
                    description: committeeInfo.description,
                    person: committeePerson?.name || "Not assigned",
                    budget: committeeInfo.defaultBudget,
                },
                totalProjects: projectCount,
                totalBudget: 0,
                allocatedBudget: 0,
                remainingBudget: committeeInfo.defaultBudget,
            };
        }

        // Return actual budget data
        return {
            committeeInfo: {
                role: targetRole.toString(),
                description: committeeInfoMap[targetRole.toString()]?.description ||
                    `${targetRole.toString()} Committee responsibilities`,
                person: committeePerson?.name || "Not assigned",
                budget: budgetOverview.totalBudget,
            },
            totalProjects: projectCount,
            totalBudget: budgetOverview.totalBudget,
            allocatedBudget: budgetOverview.allocatedBudget,
            remainingBudget: budgetOverview.remainingBudget,
        };
    } catch (error) {
        console.error("Error fetching budget overview:", error);
        throw new Error("Failed to fetch budget overview");
    }
}

// URL slug to UserRole mapping
const slugToRoleMap: Record<string, UserRole> = {
    "admin": UserRole.Admin,
    "education": UserRole.Education,
    "environment": UserRole.Environment,
    "finance": UserRole.Finance,
    "health-services": UserRole.HealthServices,
    "peace-order": UserRole.PeaceOrder,
    "public-works": UserRole.PublicWorks,
    "women": UserRole.Women,
};

// Function to get budget by committee slug from URL params
export async function getBudgetByCommitteeSlug(
    committeeSlug: string | string[] | undefined
): Promise<BudgetOverviewData> {
    try {
        if (!committeeSlug) {
            // If no slug is provided, return overall budget (Admin role)
            return getBudgetOverviewByRole(UserRole.Admin);
        }

        // Handle both string and array cases
        const slug = Array.isArray(committeeSlug) ? committeeSlug[0] : committeeSlug;

        // Normalize the slug (lowercase and trim)
        const normalizedSlug = slug.toLowerCase().trim();

        // Try to get the role directly from the mapping
        const role = slugToRoleMap[normalizedSlug];

        if (role) {
            return getBudgetOverviewByRole(role);
        }

        // If not found in mapping, try to convert the slug to a role name using our formatter
        const formattedRole = formatCommitteeSlugToRole(normalizedSlug);

        // Check if the formatted role exists in the UserRole enum
        if (!Object.values(UserRole).includes(formattedRole as UserRole)) {
            console.warn(`Invalid committee role after formatting: ${formattedRole}`);
            // Default to Admin if invalid
            return getBudgetOverviewByRole(UserRole.Admin);
        }

        // Fetch budget for the specific committee role
        return getBudgetOverviewByRole(formattedRole as UserRole);
    } catch (error) {
        console.error(`Error fetching budget for committee slug ${committeeSlug}:`, error);
        throw new Error("Failed to fetch committee budget data");
    }
}

// Helper function to format committee slug to proper role
function formatCommitteeSlugToRole(slug: string): string {
    if (!slug) return "Admin"; // Default to Admin if no slug

    // Handle compound names with special casing
    if (slug === "health-services") return "HealthServices";
    if (slug === "peace-order") return "PeaceOrder";
    if (slug === "public-works") return "PublicWorks";

    // Standard formatting for single-word committee names
    return slug
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join("");
}