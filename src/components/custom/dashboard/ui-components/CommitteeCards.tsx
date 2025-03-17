"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { useAuth } from "@/components/providers/auth-provider"; // Your auth provider context
import { BudgetOverviewData, getBudgetOverviewByRole } from "@/actions/fetching-actions/budget-overview/budget-fetch";


interface CommitteeCardsProps {
  role?: UserRole; // Optional: If not provided, server action will use current user's role
}

const CommitteeCards = ({ role }: CommitteeCardsProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BudgetOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Get current user from auth context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Pass both role and user ID
        const budgetData = await getBudgetOverviewByRole(role, user?.id);
        setData(budgetData);
        setError(null);
      } catch (err) {
        console.error("Error fetching committee data:", err);
        setError("Failed to load committee information");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a user or a specific role was provided
    if (user?.id || role) {
      fetchData();
    }
  }, [role, user?.id]);

  // Function to determine the progress bar color based on budget utilization
  const getProgressClass = () => {
    if (!data) return "bg-gray-200";

    const utilizationPercentage =
      (data.totalBudget / data.committeeInfo.budget) * 100;

    if (utilizationPercentage > 90) return "text-red-500";
    if (utilizationPercentage > 70) return "text-yellow-500";
    return "text-green-500";
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

  if (error || !data) {
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

  const { committeeInfo, totalProjects, totalBudget } = data;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              {committeeInfo.role.charAt(0).toUpperCase() +
                committeeInfo.role.slice(1)}{" "}
              Committee
            </h2>
            <p className="text-gray-600 mb-4">{committeeInfo.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Committee Head</p>
                <p className="font-medium">{committeeInfo.person}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Projects</p>
                <p className="font-medium">{totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Budget Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="font-medium">
                  ₱{committeeInfo.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Allocated</p>
                <p className="font-medium">₱{totalBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="font-medium">
                  ₱{(committeeInfo.budget - totalBudget).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Budget Utilization</p>
              <Progress
                value={(totalBudget / committeeInfo.budget) * 100}
                className={getProgressClass()}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteeCards;
