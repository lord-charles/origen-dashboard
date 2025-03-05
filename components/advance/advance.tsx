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
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Balance, PaginatedAdvances } from "@/types/advance";
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
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

interface AdvanceModuleProps {
  initialData: PaginatedAdvances;
  balanceData: Balance;
}

const AdvanceModule = ({ initialData, balanceData }: AdvanceModuleProps) => {
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
      <div className=" p-4">
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                {formatCurrency(stats?.totalAmountDisbursed)}
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
          <Card className="p-3">
            <div className="space-y-0 pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-semibold flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                    Recent Advances
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Here is a list of all Advances
                  </CardDescription>
                </div>
                {balanceData ? (
                  <div className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-10 w-10 text-primary" />
                            <div>
                              <div className="text-2xl font-bold">
                                {balanceData?.accountBalances?.utility?.balance?.toLocaleString()}{" "}
                                {balanceData?.accountBalances?.utility?.currency}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Organization Utility Balance
                              </div>
                            </div>
                            <Separator orientation="vertical" className="h-10"/>
                            <div>
                              <div className="text-2xl font-bold">
                                {balanceData?.pendingWithdrawals?.toLocaleString()}{" "}
                                {balanceData?.accountBalances?.utility?.currency}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Pending Withdrawals
                              </div>
                            </div>
                            <Separator orientation="vertical" className="h-10"/>
                            <div>
                              <div className="text-2xl font-bold">
                                {(balanceData?.accountBalances?.utility?.balance - balanceData?.pendingWithdrawals)?.toLocaleString()}{" "}
                                {balanceData?.accountBalances?.utility?.currency}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Available For Disbursal
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <div className="text-xs">
                            Last updated:{" "}
                            {new Date(
                              balanceData?.accountBalances?.utility?.lastUpdated
                            ).toLocaleString()}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <Separator className="mb-4" />
              <AdvanceTable advances={advances.data} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvanceModule;
