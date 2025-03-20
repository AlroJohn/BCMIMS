"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/auth-provider";

import { useParams } from "next/navigation";
import {
  BudgetOverviewData,
  getBudgetByCommitteeSlug,
} from "@/actions/fetching-actions/budget-overview/fetch-budget";

interface CommitteeDashboardProps {
  defaultCommittee?: string;
}

export default function CommitteeDashboard({
  defaultCommittee,
}: CommitteeDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const params = useParams();

  // Get committee from URL params or use default
  const committeeSlug = params?.committee || defaultCommittee || "";

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);

        // If we have a committee in URL params, fetch that specific committee's budget
        if (committeeSlug) {
          const data = await getBudgetByCommitteeSlug(committeeSlug);
          setBudgetData(data);
        }
        // Otherwise use the user's role (for their dashboard)
        else if (user?.id) {
          // Convert user role format (like HealthServices) to URL slug format (health-services)
          const roleSlug = user.role
            ? user.role
                .toString()
                // Insert dashes before capital letters and convert to lowercase
                .replace(/([A-Z])/g, "-$1")
                .toLowerCase()
                // Remove dash at the beginning if it exists
                .replace(/^-/, "")
            : "admin";

          const data = await getBudgetByCommitteeSlug(roleSlug);
          setBudgetData(data);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching committee budget data:", err);
        setError("Failed to load committee budget information");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [committeeSlug, user?.id, user?.role]);

  // Function to determine the progress bar color based on budget utilization
  const getProgressColor = () => {
    if (!budgetData) return "bg-gray-200";

    const utilizationPercentage =
      (budgetData.allocatedBudget /
        (budgetData.allocatedBudget + budgetData.remainingBudget)) *
      100;

    if (utilizationPercentage > 90) return "bg-red-500";
    if (utilizationPercentage > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading committee information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !budgetData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">
              {error || "Unable to load committee data"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { committeeInfo, totalProjects, allocatedBudget, remainingBudget } =
    budgetData;
  const totalBudget = allocatedBudget + remainingBudget;
  const utilizationPercentage = (allocatedBudget / totalBudget) * 100;

  return <></>;
}
