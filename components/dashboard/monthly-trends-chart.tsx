"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generate last 12 months of dummy data
const generateMonthlyData = () => {
  const data = [];
  const today = new Date("2025-01-08"); // Using the provided current time

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);

    // Generate realistic looking data
    const totalRequests = Math.floor(Math.random() * 300) + 200; // 200-500 requests
    const approvedRequests = Math.floor(
      totalRequests * (Math.random() * 0.3 + 0.6)
    ); // 60-90% approval rate

    data.push({
      date: date.toISOString().split("T")[0],
      totalRequests,
      approvedRequests,
      approvalRate: Math.round((approvedRequests / totalRequests) * 100),
    });
  }
  return data;
};

const monthlyData = generateMonthlyData();

const chartConfig = {
  trends: {
    label: "Monthly Trends",
  },
  totalRequests: {
    label: "Total Requests",
    color: "hsl(var(--chart-1))",
  },
  approvedRequests: {
    label: "Approved Requests",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MonthlyTrendsChart() {
  const [timeRange, setTimeRange] = React.useState("12m");

  const filteredData = React.useMemo(() => {
    const months = timeRange === "6m" ? 6 : 12;
    return monthlyData.slice(-months);
  }, [timeRange]);

  const totals = React.useMemo(
    () => ({
      requests: monthlyData.reduce((acc, curr) => acc + curr.totalRequests, 0),
      approvals: monthlyData.reduce(
        (acc, curr) => acc + curr.approvedRequests,
        0
      ),
    }),
    []
  );

  const averageApprovalRate = React.useMemo(
    () => Math.round((totals.approvals / totals.requests) * 100),
    [totals]
  );

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-3 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            Advance requests and approvals over time
          </CardDescription>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Avg. Approval Rate</p>
          <p className="text-2xl font-bold">{averageApprovalRate}%</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 12 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[348px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
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
                  year: "2-digit",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => value.toString()}
                />
              }
            />
            <Area
              dataKey="approvedRequests"
              type="monotone"
              fill="url(#fillApproved)"
              stroke="hsl(var(--chart-2))"
              stackId="1"
            />
            <Area
              dataKey="totalRequests"
              type="monotone"
              fill="url(#fillRequests)"
              stroke="hsl(var(--chart-1))"
              stackId="2"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
