"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface EmployeeModuleProps {
  initialData: PaginatedResponse<User>;
}

export default function EmployeeModule({ initialData }: EmployeeModuleProps) {
  const stats = [
    {
      title: "Total Employees",
      value: initialData.total.toString(),
      icon: Users,
      color: "text-blue-600",
      trend: "+5%",
      trendColor: "text-green-500",
    },
    {
      title: "Active Employees",
      value: initialData.data.length.toString(),
      icon: UserCheck,
      color: "text-green-600",
      trend: "+3%",
      trendColor: "text-green-500",
    },
    {
      title: "Inactive Employees",
      value: "18",
      icon: UserMinus,
      color: "text-orange-600",
      trend: "-1%",
      trendColor: "text-red-500",
    },
    {
      title: "Departments",
      value: "12",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Average Salary",
      value: "KES 120,000",
      icon: DollarSign,
      color: "text-emerald-600",
      trend: "+3.5%",
      trendColor: "text-green-500",
    },
    {
      title: "Total Payroll",
      value: "KES 29.76M",
      icon: TrendingUp,
      color: "text-indigo-600",
      trend: "+2.1%",
      trendColor: "text-green-500",
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

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Employee List</CardTitle>
            <Button size="sm">
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
