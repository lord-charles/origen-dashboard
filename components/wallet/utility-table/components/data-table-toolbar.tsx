"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UtilityTransaction } from "@/types/utility";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import json2csv from "json2csv";
import { format } from "date-fns";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const transactionTypes = [
  { label: "Recharge", value: "recharge" },
  { label: "Withdrawal", value: "b2c" },
  { label: "Deduction", value: "withdrawal" },
];

const transactionStatus = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        return format(date, "dd/MM/yyyy HH:mm:ss");
      } catch {
        return "N/A";
      }
    };

    const formatAmount = (amount: number | null | undefined): string => {
      if (amount === null || amount === undefined) return "KES 0.00";
      try {
        return `KES ${amount.toLocaleString()}`;
      } catch {
        return "KES 0.00";
      }
    };

    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original as UtilityTransaction;
      return {
        "Transaction ID": original?.transactionId || "N/A",
        "MPesa Receipt": original?.mpesaReceiptNumber || "N/A",
        "Transaction Type": original?.type?.toUpperCase() || "N/A",
        "Transaction Date": formatDate(original?.transactionDate),
        Amount: formatAmount(original?.amount),
        "Balance Before": formatAmount(original.type.toLowerCase() === 'recharge' ? (original.balanceAfterTransaction || 0)-original.amount : original.balanceBeforeTransaction),
        "Balance After": formatAmount(original?.balanceAfterTransaction),
        "Recipient Name": original?.recipientDetails?.name || "N/A",
        "Recipient Phone": original?.recipientDetails?.phoneNumber || "N/A",
        "Employee Email": original?.employee?.email || "N/A",
        "Employee ID": original?.employee?.nationalId || "N/A",
        Status: original?.status
          ? original.status.charAt(0).toUpperCase() + original.status.slice(1)
          : "N/A",
      };
    });

    const fields = [
      "Transaction ID",
      "MPesa Receipt",
      "Transaction Type",
      "Transaction Date",
      "Amount",
      "Balance Before",
      "Balance After",
      "Recipient Name",
      "Recipient Phone",
      "Employee Email",
      "Employee ID",
      "Status",
    ];

    const opts = { fields };
    const csvData = json2csv.parse(filteredData, opts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
    saveAs(blob, `utility_audit_transactions_${timestamp}.csv`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search transactions, employees, recipients..."
          value={(table.getColumn("combinedName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            const combinedColumn = table.getColumn("combinedName");
            if (combinedColumn) {
              combinedColumn.setFilterValue(value);
            }
          }}
          className="h-8 w-[150px] lg:w-[350px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Transaction Type"
            options={transactionTypes}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={transactionStatus}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button className="h-8" variant="outline" onClick={handleExport}>
          Export <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
