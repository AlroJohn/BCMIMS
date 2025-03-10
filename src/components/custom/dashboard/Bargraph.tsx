"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"

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
import { BookingChartData, getBookingsChartData } from "@/actions/fetching-actions/fetch-booking-count"


// Updated chart config to use walkin and scheduled instead of desktop and mobile
const chartConfig = {
  views: {
    label: "Bookings",
  },
  walkin: {
    label: "Data for Walk-in",
    color: "hsl(var(--chart-1))",
  },
  scheduled: {
    label: "Data for Scheduled",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Bargraph() {
  const [chartData, setChartData] = useState<BookingChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeChart, setActiveChart] = 
    React.useState<keyof typeof chartConfig>("scheduled")

  // Fetch booking data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getBookingsChartData()
        setChartData(data)
      } catch (error) {
        console.error("Failed to fetch booking data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const total = React.useMemo(
    () => ({
      walkin: chartData.reduce((acc, curr) => acc + curr.walkin, 0),
      scheduled: chartData.reduce((acc, curr) => acc + curr.scheduled, 0),
    }),
    [chartData]
  )

  // Generate date range text for description (e.g., "March 2023 - February 2024")
  const dateRangeText = React.useMemo(() => {
    if (chartData.length === 0) return "last 12 months"
    
    const startDate = new Date(chartData[0].date + "-01")
    const endDate = new Date(chartData[chartData.length - 1].date + "-01")
    
    const startMonth = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const endMonth = endDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    
    return `${startMonth} - ${endMonth}`
  }, [chartData])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Booking Statistics</CardTitle>
          <CardDescription>
            Showing walk-in vs. scheduled bookings for {dateRangeText}
          </CardDescription>
        </div>
        <div className="flex">
          {["scheduled", "walkin"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {isLoading ? "..." : total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Loading booking data...</p>
          </div>
        ) : (
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
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                
                tickFormatter={(value) => {
                  // Convert YYYY-MM to month name
                  const date = new Date(value + "-01") // Add day to make valid date
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      // Convert YYYY-MM to month name and year
                      const date = new Date(value + "-01") // Add day to make valid date
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Bar className="rounded-t-xl bg-amber-300" dataKey={activeChart} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}