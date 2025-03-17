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
import { getApprovedProjectsByMonth } from "@/actions/fetching-actions/project";


const chartConfig = {
  desktop: {
    label: "Approved Projects",
    color: "oklch(0.45 0.15 140)",
  },
} satisfies ChartConfig;

export function ApprovedProjectsRadarChart() {
  const [chartData, setChartData] = useState([
    { month: "January", desktop: 0 },
    { month: "February", desktop: 0 },
    { month: "March", desktop: 0 },
    { month: "April", desktop: 0 },
    { month: "May", desktop: 0 },
    { month: "June", desktop: 0 },
    { month: "July", desktop: 0 },
    { month: "August", desktop: 0 },
    { month: "September", desktop: 0 },
    { month: "October", desktop: 0 },
    { month: "November", desktop: 0 },
    { month: "December", desktop: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState({ value: 0, isUp: true });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getApprovedProjectsByMonth();
        setChartData(data);

        // Calculate trend (comparing current month to previous month)
        const currentMonth = new Date().getMonth();
        if (currentMonth > 0 && data.length >= currentMonth + 1) {
          const currentValue = data[currentMonth].desktop;
          const previousValue = data[currentMonth - 1].desktop;

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
          }
        }
      } catch (error) {
        console.error("Failed to fetch approved projects data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Approved Projects</CardTitle>
        <CardDescription>
          Monthly overview of approved projects for {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[250px]">
            <p>Loading data...</p>
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
          January - December {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
}
