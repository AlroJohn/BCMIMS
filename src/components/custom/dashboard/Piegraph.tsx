"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define chart colors
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
];

// Create dynamic chart config
const createChartConfig = (committeeData: any[]) => {
  const config: Record<string, any> = {
    projects: {
      label: "Projects",
    }
  };
  
  committeeData.forEach((item, index) => {
    config[item.name.toLowerCase()] = {
      label: item.name,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });
  
  return config as ChartConfig;
};

interface PiegraphProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function Piegraph({ data }: PiegraphProps) {
  // Use the data prop instead of hardcoded data
  const committeeData = data;
  
  const id = "pie-committee-projects";
  
  // Generate committee project counts (this would be passed as props in a real implementation)
  // const committeeData = [
  //   { name: "Education", value: 3 },
  //   { name: "Environment", value: 1 },
  //   { name: "Finance", value: 1 },
  //   { name: "Health Services", value: 2 },
  //   { name: "Peace Order", value: 1 },
  //   { name: "Public Works", value: 3 },
  //   { name: "Women", value: 1 }
  // ];
  
  const totalProjects = React.useMemo(() => 
    committeeData.reduce((acc, curr) => acc + curr.value, 0), 
    [committeeData]
  );
  
  const [activeCommittee, setActiveCommittee] = React.useState(committeeData[0].name.toLowerCase());
  const chartConfig = React.useMemo(() => createChartConfig(committeeData), [committeeData]);
  
  const activeIndex = React.useMemo(
    () => committeeData.findIndex((item) => item.name.toLowerCase() === activeCommittee),
    [activeCommittee, committeeData]
  );
  
  const committees = React.useMemo(() => 
    committeeData.map((item) => item.name.toLowerCase()), 
    [committeeData]
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Committee Projects</CardTitle>
          <CardDescription>Distribution of approved projects by committee</CardDescription>
        </div>
        <Select value={activeCommittee} onValueChange={setActiveCommittee}>
          <SelectTrigger
            className="ml-auto h-7 w-[150px] rounded-lg pl-2.5"
            aria-label="Select committee"
          >
            <SelectValue placeholder="Select committee" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {committees.map((key, index) => {
              const config = chartConfig[key as keyof typeof chartConfig];
              if (!config) return null;
              
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    {committeeData[index].name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel
                  formatter={(value, name) => {
                    return [`${value} projects`, name];
                  }}
                />
              }
            />
            <Pie
              data={committeeData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              {committeeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const selectedCommittee = committeeData[activeIndex];
                    const percentage = Math.round((selectedCommittee.value / totalProjects) * 100);
                    
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {selectedCommittee.value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {percentage}% of total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}