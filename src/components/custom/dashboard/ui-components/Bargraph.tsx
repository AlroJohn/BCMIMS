"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated chart config for budget allocation by month
const chartConfig = {
  budget: {
    label: "Budget",
  },
  value: {
    label: "Budget Allocation",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


interface BargraphProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}


export function Bargraph({ data }: BargraphProps) {
  // Use the data prop instead of generating data internally
  const chartData = data;
    // For demo purposes, generating data based on the projectProposals from parent component
  const generateMonthlyBudgetData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Sample data structure similar to what would be calculated in the parent component
    return monthNames.map((name, index) => {
      // Creating realistic budget numbers that peak in middle months
      let value = 0;
      if (index === 2) value = 15000; // March
      if (index === 3) value = 35000; // April
      if (index === 4) value = 80000; // May
      if (index === 5) value = 60000; // June
      if (index === 6) value = 75000; // July
      if (index === 7) value = 90000; // August
      if (index === 8) value = 200000; // September
      if (index === 9) value = 50000; // October
      
      return {
        name,
        value,
      }
    });
  };

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("value");

  const total = React.useMemo(
    () => ({
      value: chartData.reduce((acc, curr) => acc + curr.value, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>
            Monthly budget allocation for 2025
          </CardDescription>
        </div>
        <div className="flex">
          <div
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">
              Budget
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              ₱{total.value.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            className="rounded-t-xl"
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="budget"
                  labelFormatter={(value) => {
                    return `${value} 2025`;
                  }}
                  formatter={(value) => {
                    return [`₱${Number(value).toLocaleString()}`, "Budget"];
                  }}
                />
              }
            />
            <Bar 
              className="rounded-t-xl fill-blue-500" 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}