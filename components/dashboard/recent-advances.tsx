"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import {
  Download,
  Search,
  MoreHorizontal,
  DollarSign,
  Users,
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  preferredPaymentMethod: PaymentMethod;
}

interface SortConfig {
  key: keyof Advance;
  direction: "asc" | "desc";
}

// Custom hooks
const useAdvanceFilters = (advances: Advance[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdvanceStatus | "all">(
    "all"
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "requestedDate",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  }, []);

  const currentMonthAdvances = useMemo(() => {
    return advances.filter((advance) =>
      isWithinInterval(new Date(advance.requestedDate), currentMonth)
    );
  }, [advances, currentMonth]);

  const filteredAdvances = useMemo(() => {
    const filtered = currentMonthAdvances
      .filter((advance) => {
        const matchesSearch = advance.employee
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || advance.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });

    return {
      data: filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [currentMonthAdvances, searchTerm, statusFilter, sortConfig, currentPage]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    currentMonth,
    filteredAdvances,
    pagination: {
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
    },
  };
};

interface RecentAdvancesProps {
  advances: Advance[];
}

const useAdvanceStats = (advances: Advance[]) => {
  return useMemo(
    () => ({
      totalAmount: advances.reduce((sum, advance) => sum + advance.amount, 0),
      approvedAmount: advances
        .filter((advance) => advance.status === "approved")
        .reduce((sum, advance) => sum + advance.amount, 0),
      pendingCount: advances.filter((advance) => advance.status === "pending")
        .length,
      employeeCount: new Set(advances.map((advance) => advance.employee)).size, // New stat
    }),
    [advances]
  );
};

// Components
const StatusBadge = ({ status }: { status: AdvanceStatus }) => {
  const variants = {
    approved: "success",
    pending: "warning",
    declined: "destructive",
    repaying: "default",
    repaid: "default",
  } as const;

  return (
    <Badge variant={variants[status] as "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const SortIcon = ({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) => {
  if (!active) return null;
  return direction === "asc" ? (
    <ChevronUp className="ml-2 h-4 w-4" />
  ) : (
    <ChevronDown className="ml-2 h-4 w-4" />
  );
};

interface RecentAdvancesProps {
  advances: Advance[];
}

export function RecentAdvances({ advances }: RecentAdvancesProps) {
  const {
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    currentMonth,
    filteredAdvances,
    pagination: { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage },
  } = useAdvanceFilters(advances);

  const stats = useAdvanceStats(advances);

  const handleSort = (key: keyof Advance) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b bg-muted/40 pb-8">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Recent Advances
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Current month advance requests from employees
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requested
              </CardTitle>
              <DollarSign className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSH {stats.totalAmount.toLocaleString()}
              </div>
              <p className="text-xs opacity-70">
                For {format(currentMonth.start, "MMMM yyyy")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-600 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Amount
              </CardTitle>
              <Users className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSH {stats.approvedAmount.toLocaleString()}
              </div>
              <p className="text-xs opacity-70">
                For {format(currentMonth.start, "MMMM yyyy")}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-600 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Clock className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs opacity-70">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-600 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employees Requested
              </CardTitle>
              <Users className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.employeeCount}</div>
              <p className="text-xs opacity-70">Unique requesters</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search advances..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              onValueChange={(value) =>
                setStatusFilter(value as AdvanceStatus | "all")
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="repaying">Repaying</SelectItem>
                <SelectItem value="repaid">Repaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("employee")}
                  >
                    Employee
                    <SortIcon
                      active={sortConfig.key === "employee"}
                      direction={sortConfig.direction}
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <SortIcon
                      active={sortConfig.key === "amount"}
                      direction={sortConfig.direction}
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <SortIcon
                      active={sortConfig.key === "status"}
                      direction={sortConfig.direction}
                    />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("requestedDate")}
                  >
                    Date
                    <SortIcon
                      active={sortConfig.key === "requestedDate"}
                      direction={sortConfig.direction}
                    />
                  </Button>
                </TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdvances.data.map((advance) => (
                <TableRow key={advance._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {advance.employee}
                  </TableCell>
                  <TableCell>${advance.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={advance.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(advance.requestedDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Update status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAdvances.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="text-muted-foreground">
                      No advances found matching your criteria
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredAdvances.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAdvances.totalItems
              )}{" "}
              of {filteredAdvances.totalItems} entries
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {filteredAdvances.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, filteredAdvances.totalPages)
                    )
                  }
                  disabled={currentPage === filteredAdvances.totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(filteredAdvances.totalPages)}
                  disabled={currentPage === filteredAdvances.totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
