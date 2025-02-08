"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  UserIcon,
  AlertTriangleIcon,
  Loader2,
} from "lucide-react";
import { DatePickerWithRange } from "../date-range-picker";
import { PaginatedAdvances } from "@/types/advance";
import AdvanceTable from "./advance-table/advance";
import { calculateAdvanceStats, formatCurrency } from "@/lib/advance-stats";
import { useEffect, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { getAdvances } from "@/services/advance-service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface AdvanceModuleProps {
  initialData: PaginatedAdvances;
}

const AdvanceModule = ({ initialData }: AdvanceModuleProps) => {
  const [advances, setAdvances] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const stats = calculateAdvanceStats(advances.data, advances.total);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (date.from && date.to) {
        setIsLoading(true);
        try {
          const startDate = date.from.toISOString();
          const endDate = date.to.toISOString();
          const response = await getAdvances({
            startDate,
            endDate,
            page: 1,
            limit: 1000,
          });
          setAdvances(response);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [date]);

  return (
    <div className="min-h-screen">
      <div className=" px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Salary Advance
          </h1>
          {/* <DatePickerWithRange /> */}
          <div className="flex items-center space-x-4 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  )}
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(range) => {
                    if (range) {
                      setDate({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
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
              <div className="text-2xl font-bold">{stats.totalAdvances}</div>
              <p className="text-xs text-muted-foreground">This month</p>
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
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalAmountDisbursed)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total disbursed amount
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
              <div className="text-2xl font-bold">
                {stats.pendingApprovals.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingApprovals.urgentCount} urgent requests
              </p>
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
              <div className="text-2xl font-bold">
                {stats.averageRepaymentPeriod.toFixed(1)} months
              </div>
              <p className="text-xs text-muted-foreground">Average duration</p>
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
              <div className="text-2xl font-bold">
                {stats.activeAdvances.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeAdvances.percentageOfEmployees.toFixed(1)}% of
                total employees
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-2 pt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-medium">
                  Recent Advances
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Here is a list of all Advances
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                <AdvanceTable advances={advances.data} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvanceModule;
