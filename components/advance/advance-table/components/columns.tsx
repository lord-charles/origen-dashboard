"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Advance } from "@/types/advance";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const customIncludesStringFilter = (
  row: Row<Advance>,
  columnId: string,
  filterValue: string
): boolean => {
  const value = row.getValue(columnId);
  return value ? value.toString().toLowerCase().includes(filterValue.toLowerCase()) : false;
};

export const columns: ColumnDef<Advance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => {
      const employee = row?.employee;
      if (typeof employee === "object" && employee !== null) {
        return `${employee?.firstName || ""} ${employee?.lastName || ""}`;
      }
      return "";
    },
    filterFn: customIncludesStringFilter,
    enableHiding: true, // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Employee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const employee = row.getValue("employee") as User;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {employee?.firstName} {employee?.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
            {employee?.employeeId}
          </span>
        </div>
      );
    },
    filterFn: customIncludesStringFilter,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => <div>{row.getValue("purpose")}</div>,
  },
  {
    accessorKey: "totalRepayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Receive Amount" />
    ),
    cell: ({ row }) => {
      const amount1 = row.original.amount as number;
      const interestRate = row.original.interestRate as number;
      const fee = (amount1 * interestRate) / 100;

      const amount = Math.ceil(row.getValue("totalRepayment") as number);

      const receivedAmount = amount - fee;
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(receivedAmount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "installmentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount as number;
      const interestRate = row.original.interestRate as number;
      const fee = (amount * interestRate) / 100;
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(fee);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "amountRepaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Repaid" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amountRepaid") as number;
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "requestedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested Date" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div>
          {row.getValue("requestedDate")
            ? format(new Date(row.getValue("requestedDate")), "PPP")
            : "N/A"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={
            status === "approved"
              ? "bg-green-100 text-white dark:bg-green-900 dark:text-white"
              : status === "pending"
              ? "bg-yellow-100 text-white dark:bg-yellow-900 dark:text-white"
              : status === "declined"
              ? "bg-red-100 text-white dark:bg-red-900 dark:text-white"
              : status === "repaying"
              ? "bg-blue-100 text-white dark:bg-blue-900 dark:text-white"
              : status === "repaid"
              ? "bg-green-100 text-white dark:bg-green-900 dark:text-white"
              : status === "disbursed"
              ? "bg-cyan-600 text-white dark:bg-cyan-600 dark:text-white"
              : "bg-gray-100 text-white dark:bg-gray-900 dark:text-white"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(new Date(row.getValue("createdAt")), "PPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];



