"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

// Function to fetch current month's proposals data
async function fetchCurrentMonthProposals() {
  try {
    const response = await fetch("/api/project-proposal/current-month-status");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching current month proposals:", error);
    return null;
  }
}

// Define chart colors
const statusColors = {
  Pending: "oklch(0.65 0.18 85)", // Amber
  Approved: "oklch(0.55 0.15 145)", // Green
  Rejected: "oklch(0.58 0.17 25)", // Red
};

export function StatusPieGraph() {
  interface ProposalData {
    status: string;
    value: number;
    fill: string;
  }

  const [proposalData, setProposalData] = useState<ProposalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trendPercentage, setTrendPercentage] = useState(0);
  const [trendDirection, setTrendDirection] = useState("up");
  const [total, setTotal] = useState(0);

  // Create the chart config dynamically
  const chartConfig = {
    proposals: {
      label: "Proposals",
    },
    pending: {
      label: "Pending",
      color: statusColors.Pending,
    },
    approved: {
      label: "Approved",
      color: statusColors.Approved,
    },
    rejected: {
      label: "Rejected",
      color: statusColors.Rejected,
    },
  };

  // Format data for chart
  const formatChartData = (data) => {
    if (!data || !data.counts) return [];

    const formattedData = [
      {
        status: "pending",
        value: data.counts.pending,
        fill: statusColors.Pending,
      },
      {
        status: "approved",
        value: data.counts.approved,
        fill: statusColors.Approved,
      },
      {
        status: "rejected",
        value: data.counts.rejected,
        fill: statusColors.Rejected,
      },
    ];

    // Calculate total
    const newTotal = formattedData.reduce((sum, item) => sum + item.value, 0);
    setTotal(newTotal);

    // Calculate trend (comparing with previous month data)
    if (data.previousMonthTotal !== undefined) {
      if (data.previousMonthTotal === 0) {
        setTrendPercentage(100);
        setTrendDirection("up");
      } else {
        const percentChange =
          ((newTotal - data.previousMonthTotal) / data.previousMonthTotal) *
          100;
        setTrendPercentage(Math.abs(Math.round(percentChange * 10) / 10));
        setTrendDirection(percentChange >= 0 ? "up" : "down");
      }
    }

    return formattedData;
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCurrentMonthProposals();
      setProposalData(formatChartData(data));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Refresh data function
  const refreshData = async () => {
    setIsRefreshing(true);
    const data = await fetchCurrentMonthProposals();
    setProposalData(formatChartData(data));
    setIsRefreshing(false);
  };

  // Get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // Loading state
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Current Month Proposals</CardTitle>
          <CardDescription>
            {currentMonth} {currentYear}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Current Month Proposals</CardTitle>
        <CardDescription>
          {currentMonth} {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 py-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => {
                    return [
                      `${value} proposals`,
                      typeof name === "string"
                        ? name.charAt(0).toUpperCase() + name.slice(1)
                        : name,
                    ];
                  }}
                />
              }
            />
            <Pie
              data={proposalData}
              dataKey="value"
              nameKey="status"
              label={({ name, percent }) => {
                name = name.charAt(0).toUpperCase() + name.slice(1);
                return `${name} ${(percent * 100).toFixed(0)}%`;
              }}
            >
              {proposalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-2">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trendDirection === "up" ? (
            <>
              Trending up by {trendPercentage}% from last month
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {trendPercentage}% from last month
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total of {total} proposals this month
        </div>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isRefreshing}
          className="mt-2"
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button> */}
      </CardFooter>
    </Card>
  );
}
