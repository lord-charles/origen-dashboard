"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Generate last 30 days of dummy data
const generateLast30DaysData = () => {
  const data = [];
  const today = new Date("2025-01-08"); // Using the provided current time

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      applications: Math.floor(Math.random() * 30) + 10, // Random number between 10-40
    });
  }
  return data;
};

const advanceData = generateLast30DaysData();

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--chart-1))",
  },
};

export function AdvanceApplicationsChart() {
  const total = React.useMemo(
    () => advanceData.reduce((acc, curr) => acc + curr.applications, 0),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
        <div>
          <CardTitle>Advance Applications</CardTitle>
          <CardDescription>
            Advance requests in the last 30 days
          </CardDescription>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            data={advanceData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="applications"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
