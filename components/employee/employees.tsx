"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginatedResponse } from "@/services/employees.service";

import {
  Users,
  DollarSign,
  Briefcase,
  UserCheck,
  UserMinus,
  TrendingUp,
  Plus,
} from "lucide-react";
import { User } from "@/types/user";
import EmployeeTable from "./employee-table/employee";
import { useRouter } from "next/navigation";

interface EmployeeModuleProps {
  initialData: PaginatedResponse<User>;
}

export default function EmployeeModule({ initialData }: EmployeeModuleProps) {
  const router = useRouter();
  const activeEmployees = initialData.data.filter(
    (emp) => emp.status === "active"
  );

  const stats = [
    {
      title: "Total Employees",
      value: initialData.data.length.toString(),
      icon: Users,
      color: "text-blue-600",
      trend: "Current",
      trendColor: "text-blue-500",
    },
    {
      title: "Active Employees",
      value: activeEmployees.length.toString(),
      icon: UserCheck,
      color: "text-green-600",
      trend: "Working",
      trendColor: "text-green-500",
    },
    {
      title: "Inactive Employees",
      value: initialData.data
        .filter((emp) => emp.status !== "active")
        .length.toString(),
      icon: UserMinus,
      color: "text-orange-600",
      trend: "Not Active",
      trendColor: "text-red-500",
    },
    {
      title: "Departments",
      value: [
        ...new Set(initialData.data.map((emp) => emp.department)),
      ].length.toString(),
      icon: Briefcase,
      color: "text-purple-600",
      trend: "Unique",
      trendColor: "text-purple-500",
    },
    {
      title: "Average Salary",
      value: `KES ${Math.round(
        activeEmployees.reduce((acc, emp) => acc + emp.baseSalary, 0) /
          activeEmployees.length
      ).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      trend: "Active Employees",
      trendColor: "text-emerald-500",
    },
    {
      title: "Total Payroll",
      value: `KES ${activeEmployees
        .reduce((acc, emp) => acc + emp.baseSalary, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: "text-indigo-600",
      trend: "Active Monthly",
      trendColor: "text-indigo-500",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Employee Management
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className={`h-3 w-3 ${stat.trendColor}`} />
                <span className={stat.trendColor}>{stat.trend}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 pt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>View and manage your employees</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                router.push("/employee/new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <EmployeeTable employees={initialData.data} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
