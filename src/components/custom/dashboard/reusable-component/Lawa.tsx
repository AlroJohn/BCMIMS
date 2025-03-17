"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
import { getApprovedProjectsRadarData } from "@/actions/fetching-actions/radar";

const chartConfig = {
  desktop: {
    label: "Approved Projects",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ApprovedProjectsRadarChart() {
  const [chartData, setChartData] = useState<
    { month: string; desktop: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState({ value: 0, isUp: true });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch the past 6 months of approved projects data
        const data = await getApprovedProjectsRadarData();
        setChartData(data);

        // Calculate trend (comparing current month to previous month)
        if (data.length >= 2) {
          // The last item is the current month
          const currentValue = data[data.length - 1].desktop;
          // The second-to-last item is the previous month
          const previousValue = data[data.length - 2].desktop;

          if (previousValue > 0) {
            const trendValue =
              ((currentValue - previousValue) / previousValue) * 100;
            setTrend({
              value: parseFloat(Math.abs(trendValue).toFixed(1)),
              isUp: trendValue >= 0,
            });
          } else if (currentValue > 0) {
            // If previous month was 0 but current has projects
            setTrend({
              value: 100,
              isUp: true,
            });
          } else {
            // Both months have 0 projects
            setTrend({
              value: 0,
              isUp: true,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch approved projects data:", error);
        // Fallback to sample data if the fetch fails
        const sampleData = [
          { month: "January", desktop: 12 },
          { month: "February", desktop: 19 },
          { month: "March", desktop: 15 },
          { month: "April", desktop: 10 },
          { month: "May", desktop: 14 },
          { month: "June", desktop: 17 },
        ];
        setChartData(sampleData);
        setTrend({ value: 5.2, isUp: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Get date range for the card description
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  const startMonth = sixMonthsAgo.toLocaleString("default", { month: "long" });

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Approved Projects</CardTitle>
        <CardDescription>
          {startMonth} - {currentMonth} {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarGrid className="fill-[--color-desktop] opacity-20" />
              <PolarAngleAxis dataKey="month" />
              <Radar
                dataKey="desktop"
                fill="var(--color-desktop)"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trend.isUp ? (
            <>
              Trending up by {trend.value}% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {trend.value}% this month{" "}
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Past 6 months overview
        </div>
      </CardFooter>
    </Card>
  );
}
