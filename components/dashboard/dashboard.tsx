"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { subDays } from "date-fns";
import { DashboardStatCards } from "./statcards";
import { RecentAdvances } from "./recent-advances";
import { SystemLogs } from "./system-logs";
import { AdvanceApplicationsChart } from "./advance-applications-chart";
import { MonthlyTrendsChart } from "./monthly-trends-chart";
import { PaymentMethodsChart, RepaymentPerformanceChart } from "./charts";

// Types
type AdvanceStatus =
  | "pending"
  | "approved"
  | "declined"
  | "repaying"
  | "repaid";
type PaymentMethod = "mpesa" | "bank_transfer" | "cash";

interface Advance {
  _id: string;
  employee: string;
  amount: number;
  amountRepaid: number;
  status: AdvanceStatus;
  requestedDate: string;
  repaymentPeriod: number;
  interestRate: number;
  preferredPaymentMethod: PaymentMethod;
}

// Mock data generation functions
const generateMockAdvances = (count: number): Advance[] => {
  const statuses: AdvanceStatus[] = [
    "pending",
    "approved",
    "declined",
    "repaying",
    "repaid",
  ];
  const paymentMethods: PaymentMethod[] = ["mpesa", "bank_transfer", "cash"];

  return Array.from({ length: count }, (_, i) => ({
    _id: `adv_${i}`,
    employee: `emp_${Math.floor(Math.random() * 1000)}`,
    amount: Math.floor(Math.random() * 10000) + 1000,
    amountRepaid: Math.floor(Math.random() * 5000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    requestedDate: subDays(
      new Date(),
      Math.floor(Math.random() * 365)
    ).toISOString(),
    repaymentPeriod: Math.floor(Math.random() * 12) + 1,
    interestRate: Math.floor(Math.random() * 10) + 1,
    preferredPaymentMethod:
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
  }));
};

// Colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardComponent = () => {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockAdvances = generateMockAdvances(1000);
      setAdvances(mockAdvances);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const totalAdvanceAmount = advances.reduce((sum, adv) => sum + adv.amount, 0);
  const totalRepaidAmount = advances.reduce(
    (sum, adv) => sum + adv.amountRepaid,
    0
  );

  const statusData = [
    "pending",
    "approved",
    "declined",
    "repaying",
    "repaid",
  ].map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: advances.filter((adv) => adv.status === status).length,
  }));

  const paymentMethodData = ["mpesa", "bank_transfer", "cash"].map(
    (method) => ({
      name: method
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: advances.filter((adv) => adv.preferredPaymentMethod === method)
        .length,
    })
  );

  return (
    <div className=" p-4 space-y-6  min-h-screen">
      <DashboardStatCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recent">Recent Advances</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[400px]">
              <AdvanceApplicationsChart />
            </div>
            <Card>
              <CardHeader className="border-b pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Advance Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all advances
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold">3,900</p>
                </div>
              </CardHeader>
              <CardContent className="h-[348px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="detailed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PaymentMethodsChart data={paymentMethodData} />
            <RepaymentPerformanceChart
              totalAdvanceAmount={totalAdvanceAmount}
              totalRepaidAmount={totalRepaidAmount}
            />
          </div>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <div className="col-span-1 md:col-span-2">
            <MonthlyTrendsChart />
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentAdvances advances={advances} />
        </TabsContent>
      </Tabs>

      <SystemLogs />
    </div>
  );
};

export default DashboardComponent;
