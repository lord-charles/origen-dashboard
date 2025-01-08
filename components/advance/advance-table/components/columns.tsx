"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Advance } from "@/types/advance";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const customIncludesStringFilter = (
  row: Row<Advance>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId) as string;
  return value?.toLowerCase().includes((filterValue as string).toLowerCase());
};

export const columns: ColumnDef<Advance>[] = [
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const employee = row.getValue("employee") as any;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {employee.firstName} {employee.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
            {employee.employeeId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "approved"
              ? "bg-green-100 text-green-800"
              : status === "declined"
              ? "bg-red-100 text-red-800"
              : status === "repaying"
              ? "bg-blue-100 text-blue-800"
              : status === "repaid"
              ? "bg-purple-100 text-purple-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalRepayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Repayment" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalRepayment") as number;
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "installmentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monthly Installment" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("installmentAmount") as number;
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
      <div>{format(new Date(row.getValue("requestedDate")), "PPP")}</div>
    ),
  },
  {
    accessorKey: "approvedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("approvedDate");
      return date ? (
        <div>{format(new Date(date), "PPP")}</div>
      ) : (
        <div className="text-muted-foreground">Pending</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
