"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Wallet,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: {
    value: string;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card
      className={`overflow-hidden transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
          <Icon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
        </div>
        <div
          className={`flex items-center mt-4 text-sm ${
            trend.direction === "up"
              ? "text-green-600 dark:text-green-400"
              : trend.direction === "down"
              ? "text-red-600 dark:text-red-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {trend.direction === "up" ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : trend.direction === "down" ? (
            <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
          ) : (
            <TrendingUp className="h-4 w-4 mr-1 rotate-90" />
          )}
          <span>
            {trend.value} {trend.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Employees"
        value="300"
        subtitle="Across all departments"
        trend={{
          value: "5%",
          label: "increase from last quarter",
          direction: "up",
        }}
        icon={Users}
      />
      <StatCard
        title="Total Advance Amount"
        value="KSH 2,500,000"
        subtitle="Outstanding: KSH 625,000"
        trend={{ value: "75%", label: "repayment rate", direction: "up" }}
        icon={DollarSign}
      />
      <StatCard
        title="Active Advances"
        value="85"
        subtitle="56.7% of total advances"
        trend={{ value: "25", label: "due this month", direction: "neutral" }}
        icon={Users}
      />
      <StatCard
        title="Advance Utilization"
        value="68%"
        subtitle="204 employees used advances"
        trend={{
          value: "12%",
          label: "increase from last month",
          direction: "up",
        }}
        icon={Wallet}
      />
      <StatCard
        title="Avg. Interest Rate"
        value="1.5%"
        subtitle="Monthly rate"
        trend={{
          value: "KSH 37,500",
          label: "interest earned",
          direction: "up",
        }}
        icon={TrendingUp}
      />
      <StatCard
        title="At-Risk Advances"
        value="8"
        subtitle="2.7% of total advances"
        trend={{ value: "3", label: "less than last month", direction: "down" }}
        icon={AlertCircle}
      />
    </div>
  );
}
