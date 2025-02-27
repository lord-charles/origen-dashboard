"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { User } from "@/types/user";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const customIncludesStringFilter = (
  row: Row<User>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId) as string;
  return value?.toLowerCase().includes((filterValue as string).toLowerCase());
};

export const columns: ColumnDef<User>[] = [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.firstName || ""} ${row.lastName || ""} ${row.phoneNumber || ""} ${
        row.email || ""
      } ${row.position || ""} ${row.department || ""} ${
        row.payrollNumber || ""
      }`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "employeeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("employeeId") || "N/A"}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Details" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>{row.original.email || "No email"}</span>
            <span>
              {row.original.payrollNumber
                ? `Payroll No: ${row.original.payrollNumber}`
                : "No Payroll Number Set"}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="font-medium">{row.original.phoneNumber || "N/A"}</div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <div className="font-medium">{row.original.position || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.department || "No Department"}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "employmentType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("employmentType") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {type || "Not Specified"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "baseSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Salary" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("baseSalary") || "0");
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return (
        <div className="font-medium tabular-nums">
          {amount > 0 ? formatted : "Not Set"}
        </div>
      );
    },
  },
  {
    accessorKey: "employmentStartDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("employmentStartDate") as string | undefined;

      return (
        <div className="font-medium">
          {dateStr && dateStr.length > 0
            ? format(new Date(dateStr), "PPP")
            : "Not Set"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "unknown";
      const statusStyles = {
        active: "bg-green-100 text-green-800 border-green-500",
        inactive: "bg-yellow-100 text-yellow-800 border-yellow-500",
        suspended: "bg-red-100 text-red-800 border-red-500",
        unknown: "bg-gray-100 text-gray-800 border-gray-500",
      };

      return (
        <Badge
          variant="outline"
          className={`${
            statusStyles[status as keyof typeof statusStyles]
          } border capitalize`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
