"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentTransaction } from "@/types/wallet";

import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import json2csv from "json2csv";
import { format } from "date-fns";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return "N/A";
        return format(date, "dd/MM/yyyy HH:mm:ss");
      } catch (error) {
        return "N/A";
      }
    };

    const formatAmount = (amount: number | null | undefined): string => {
      if (amount === null || amount === undefined) return "KES 0.00";
      try {
        return `KES ${amount.toLocaleString()}`;
      } catch (error) {
        return "KES 0.00";
      }
    };

    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original as PaymentTransaction;

      return {
        Employee: original?.employee || "N/A",
        "Transaction Type": original?.transactionType?.toUpperCase() || "N/A",
        Amount: formatAmount(original?.amount),
        "Phone Number": original?.phoneNumber || "N/A",
        "Account Reference": original?.accountReference || "N/A",
        Status: original?.status
          ? original.status.charAt(0).toUpperCase() + original.status.slice(1)
          : "N/A",
        "Merchant Request ID": original?.merchantRequestId || "N/A",
        "Checkout Request ID": original?.checkoutRequestId || "N/A",
        "Response Code": original?.responseCode || "N/A",
        "Response Description": original?.responseDescription || "N/A",
        "Customer Message": original?.customerMessage || "N/A",
        "Callback Status": original?.callbackStatus || "N/A",
        "Created At": formatDate(original?.createdAt),
        "Updated At": formatDate(original?.updatedAt),
        "Transaction ID": original?.transactionId || "N/A",
        "Callback Phone": original?.callbackPhoneNumber || "N/A",
        "Confirmed Amount": formatAmount(original?.confirmedAmount),
        "MPesa Receipt": original?.mpesaReceiptNumber || "N/A",
        "Result Code": original?.resultCode || "N/A",
        "Result Description": original?.resultDesc || "N/A",
        "Transaction Date": formatDate(original?.transactionDate),
        "Receiver Name": original?.receiverPartyPublicName || "N/A",
      };
    });

    const fields = [
      "Employee",
      "Transaction Type",
      "Amount",
      "Phone Number",
      "Account Reference",
      "Status",
      "Merchant Request ID",
      "Checkout Request ID",
      "Response Code",
      "Response Description",
      "Customer Message",
      "Callback Status",
      "Created At",
      "Updated At",
      "Transaction ID",
      "Callback Phone",
      "Confirmed Amount",
      "MPesa Receipt",
      "Result Code",
      "Result Description",
      "Transaction Date",
      "Receiver Name",
    ];

    const opts = { fields };
    const csvData = json2csv.parse(filteredData, opts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
    saveAs(blob, `mpesa_transactions_${timestamp}.csv`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter customer name, Transaction Id..."
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
