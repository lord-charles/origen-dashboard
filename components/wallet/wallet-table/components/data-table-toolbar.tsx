"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { statuses, transactionTypesAll } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import json2csv from "json2csv";
import { format } from "date-fns";
import {
  WalletTransaction,
  WalletUser,
  RecipientDetails,
} from "@/types/wallet";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    try {
      const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "N/A";
        try {
          const date = new Date(dateString);
          // Check if date is valid
          if (isNaN(date.getTime())) return "N/A";
          return format(date, "dd/MM/yyyy HH:mm:ss");
        } catch (error) {
          console.error("Error formatting date:", error);
          return "N/A";
        }
      };

      const formatAmount = (amount: number | null | undefined): string => {
        if (amount === null || amount === undefined) return "KES 0.00";
        try {
          return `KES ${amount.toLocaleString()}`;
        } catch (error) {
          console.error("Error formatting amount:", error);
          return "KES 0.00";
        }
      };

      const formatUser = (user: WalletUser | null | undefined): string => {
        if (!user) return "N/A";
        try {
          const firstName = user.firstName || "";
          const lastName = user.lastName || "";
          return firstName || lastName
            ? `${firstName} ${lastName}`.trim()
            : "N/A";
        } catch (error) {
          console.error("Error formatting user:", error);
          return "N/A";
        }
      };

      const formatRecipientDetails = (
        details: RecipientDetails | null | undefined
      ): string => {
        if (!details) return "N/A";
        try {
          const parts = [];
          if (details.recipientWalletId)
            parts.push(`Wallet: ${details.recipientWalletId}`);
          if (details.recipientMpesaNumber)
            parts.push(`MPesa: ${details.recipientMpesaNumber}`);
          return parts.length ? parts.join(", ") : "N/A";
        } catch (error) {
          console.error("Error formatting recipient details:", error);
          return "N/A";
        }
      };

      const filteredData = table
        .getFilteredRowModel()
        .rows.map((row) => {
          try {
            const original = row.original as WalletTransaction;
            if (!original) return null;

            return {
              "Transaction ID": original?.transactionId || "N/A",
              Employee: formatUser(original?.walletId),
              Email: original?.walletId?.email || "N/A",
              "Transaction Type":
                original?.transactionType?.toUpperCase() || "N/A",
              Amount: formatAmount(original?.amount),
              Status: original?.status
                ? original.status.charAt(0).toUpperCase() +
                  original.status.slice(1)
                : "N/A",
              "Transaction Date": formatDate(original?.transactionDate),
              "Recipient Details": formatRecipientDetails(
                original?.recipientDetails
              ),
              Description: original?.description || "N/A",
              "Created At": formatDate(original?.createdAt),
              "Updated At": formatDate(original?.updatedAt),
            };
          } catch (error) {
            console.error("Error processing row:", error);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries from errors

      if (filteredData.length === 0) {
        throw new Error("No valid data to export");
      }

      const fields = [
        "Transaction ID",
        "Employee",
        "Email",
        "Transaction Type",
        "Amount",
        "Status",
        "Transaction Date",
        "Recipient Details",
        "Description",
        "Created At",
        "Updated At",
      ];

      const opts = { fields };
      const csvData = json2csv.parse(filteredData, opts);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
      saveAs(blob, `wallet_transactions_${timestamp}.csv`);
    } catch (error) {
      console.error("Export failed:", error);
      // You might want to show a toast or alert here
      alert("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={
            (table.getColumn("combinedName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            const value = event.target.value;
            const combinedColumn = table.getColumn("combinedName");
            if (combinedColumn) {
              combinedColumn.setFilterValue(value);
            }
          }}
          className="h-8 w-[150px] lg:w-[350px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="status"
            options={statuses}
          />
        )}{" "}
        {table.getColumn("transactionType") && (
          <DataTableFacetedFilter
            column={table.getColumn("transactionType")}
            title="TransactionType"
            options={transactionTypesAll}
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
