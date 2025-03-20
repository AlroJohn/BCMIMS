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
import { getRejectedProjectsRadarData } from "@/actions/fetching-actions/radar";

const chartConfig = {
  mobile: {
    label: "Rejected Projects",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RejectedProjectsRadarChart() {
  const [chartData, setChartData] = useState<
    { month: string; mobile: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState({ value: 0, isUp: false });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch the past 6 months of rejected projects data
        const data = await getRejectedProjectsRadarData();
        setChartData(data);

        // Calculate trend (comparing current month to previous month)
        if (data.length >= 2) {
          // The last item is the current month
          const currentValue = data[data.length - 1].mobile;
          // The second-to-last item is the previous month
          const previousValue = data[data.length - 2].mobile;

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
              isUp: false,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch rejected projects data:", error);
        // Fallback to sample data if the fetch fails
        const sampleData = [
          { month: "January", mobile: 5 },
          { month: "February", mobile: 8 },
          { month: "March", mobile: 6 },
          { month: "April", mobile: 4 },
          { month: "May", mobile: 7 },
          { month: "June", mobile: 9 },
        ];
        setChartData(sampleData);
        setTrend({ value: 6.4, isUp: true });
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
        <CardTitle>Rejected Projects</CardTitle>
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
              <PolarGrid className="fill-[--color-mobile] opacity-20" />
              <PolarAngleAxis dataKey="month" />
              <Radar
                dataKey="mobile"
                fill="var(--color-mobile)"
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
              <TrendingUp className="h-4 w-4 text-destructive" />
            </>
          ) : (
            <>
              Trending down by {trend.value}% this month{" "}
              <TrendingDown className="h-4 w-4 text-green-500" />
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
