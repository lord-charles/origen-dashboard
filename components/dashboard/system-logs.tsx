"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  AlertCircle,
  UserCheck,
  DollarSign,
  Lock,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
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

// Dummy data for system logs
const systemLogs = [
  {
    id: "1",
    timestamp: "2023-07-25T08:30:00Z",
    event: "Employee Login",
    details: "John Doe logged in successfully",
    severity: "info",
  },
  {
    id: "2",
    timestamp: "2023-07-25T09:15:00Z",
    event: "Advance Application",
    details: "Sarah Smith applied for an advance of $2000",
    severity: "info",
  },
  {
    id: "3",
    timestamp: "2023-07-25T10:00:00Z",
    event: "Wrong Password",
    details: "Failed login attempt for user mike@example.com",
    severity: "warning",
  },
  {
    id: "4",
    timestamp: "2023-07-25T11:30:00Z",
    event: "System Update",
    details: "System updated to version 2.5.0",
    severity: "info",
  },
  {
    id: "5",
    timestamp: "2023-07-25T13:45:00Z",
    event: "Unauthorized Access Attempt",
    details: "Multiple failed login attempts from IP 192.168.1.100",
    severity: "error",
  },
  {
    id: "6",
    timestamp: "2023-07-25T15:00:00Z",
    event: "Advance Approved",
    details: "Manager approved $1500 advance for Emily Johnson",
    severity: "info",
  },

  {
    id: "8",
    timestamp: "2023-07-25T17:10:00Z",
    event: "Employee Logout",
    details: "Alex Turner logged out",
    severity: "info",
  },
];

type LogKeys = keyof (typeof systemLogs)[0];
type SortConfig = {
  key: LogKeys;
  direction: "asc" | "desc";
};

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "timestamp",
    direction: "desc",
  });

  const filteredLogs = useMemo(() => {
    return systemLogs
      .filter((log) => {
        const matchesSearch =
          log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity =
          severityFilter === "all" || log.severity === severityFilter;
        return matchesSearch && matchesSeverity;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [searchTerm, severityFilter, sortConfig]);

  const handleSort = (key: LogKeys) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const SortIcon = ({ columnKey }: { columnKey: LogKeys }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const getEventIcon = (event: string) => {
    switch (event.toLowerCase()) {
      case "employee login":
      case "employee logout":
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case "advance application":
      case "advance approved":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "wrong password":
      case "unauthorized access attempt":
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b bg-muted/40 pb-8">
        <CardTitle className="text-2xl font-bold tracking-tight">
          System Logs
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Monitor important system events and user activities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setSeverityFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">Export Logs</Button>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("timestamp")}
                  >
                    Timestamp
                    <SortIcon columnKey="timestamp" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("event")}
                  >
                    Event
                    <SortIcon columnKey="event" />
                  </Button>
                </TableHead>
                <TableHead className="w-[400px]">Details</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => handleSort("severity")}
                  >
                    Severity
                    <SortIcon columnKey="severity" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEventIcon(log.event)}
                      {log.event}
                    </div>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (log.severity === "info"
                          ? "default"
                          : log.severity === "warning"
                          ? "warning"
                          : "destructive") as "default"
                      }
                    >
                      {log.severity.charAt(0).toUpperCase() +
                        log.severity.slice(1)}
                    </Badge>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Copy Log</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
