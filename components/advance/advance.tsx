"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  UserIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { DatePickerWithRange } from "../date-range-picker";
import { PaginatedAdvances } from "@/types/advance";

interface AdvanceModuleProps {
  initialData: PaginatedAdvances;
}

const AdvanceModule = ({ initialData }: AdvanceModuleProps) => {
  return (
    <div className="min-h-screen">
      <div className=" px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Salary Advance
          </h1>
          <DatePickerWithRange />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Advances
              </CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">254</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount Disbursed
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 1,235,500</div>
              <p className="text-xs text-muted-foreground">
                +18.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">5 urgent requests</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Repayment Period
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 months</div>
              <p className="text-xs text-muted-foreground">
                -0.5 months from last quarter
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employees with Active Advances
              </CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">
                32% of total employees
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6 bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
          <CardHeader>
            <CardTitle>Recent Advances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Employee</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Purpose</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Requested Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      employee: "John Doe",
                      amount: "KES 50,000",
                      purpose: "Medical",
                      status: "Approved",
                      date: "2023-06-15",
                    },
                    {
                      employee: "Jane Smith",
                      amount: "KES 30,000",
                      purpose: "Education",
                      status: "Pending",
                      date: "2023-06-14",
                    },
                    {
                      employee: "Mike Johnson",
                      amount: "KES 75,000",
                      purpose: "Housing",
                      status: "Repaying",
                      date: "2023-06-10",
                    },
                    {
                      employee: "Sarah Brown",
                      amount: "KES 25,000",
                      purpose: "Emergency",
                      status: "Approved",
                      date: "2023-06-08",
                    },
                    {
                      employee: "Chris Lee",
                      amount: "KES 40,000",
                      purpose: "Debt Consolidation",
                      status: "Declined",
                      date: "2023-06-05",
                    },
                  ].map((advance, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{advance.employee}</td>
                      <td className="py-3 px-4">{advance.amount}</td>
                      <td className="py-3 px-4">{advance.purpose}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            advance.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : advance.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : advance.status === "Repaying"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {advance.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{advance.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvanceModule;
