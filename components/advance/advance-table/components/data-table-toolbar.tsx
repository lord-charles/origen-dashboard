"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const original: any = row.original;
      const amount = original.amount;
      const interestRate = original.interestRate;
      const fee = (amount * interestRate) / 100;
      const amountRepaid = original.amountRepaid || 0;
      const remainingBalance = original.totalRepayment - amountRepaid;

      return {
        "Employee ID": original?.employee?.employeeId,
        "Employee Name": `${original?.employee?.firstName} ${original?.employee?.lastName}`,
        "Employee Email": original?.employee?.email,
        "Advance Amount": `KES ${amount?.toLocaleString()}`,
        "Interest Rate": `${interestRate}%`,
        "Processing Fee": `KES ${fee?.toLocaleString()}`,
        "Amount to Receive": `KES ${(amount - fee)?.toLocaleString()}`,
        "Total Repayment": `KES ${original?.totalRepayment?.toLocaleString()}`,
        "Amount Repaid": `KES ${amountRepaid?.toLocaleString()}`,
        "Remaining Balance": `KES ${remainingBalance?.toLocaleString()}`,
        "Monthly Installment": `KES ${original?.installmentAmount?.toLocaleString()}`,
        "Repayment Period": `${original?.repaymentPeriod} months`,
        Status:
          original?.status?.charAt(0).toUpperCase() +
          original?.status?.slice(1),
        "Payment Method": original?.preferredPaymentMethod?.toUpperCase(),
        Purpose: original?.purpose,
        "Request Date": format(new Date(original?.requestedDate), "dd/MM/yyyy"),
        "Approval Date": original?.approvedDate
          ? format(new Date(original?.approvedDate), "dd/MM/yyyy")
          : "N/A",
        "Approved By": original?.approvedBy
          ? `${original?.approvedBy?.firstName} ${original?.approvedBy?.lastName}`
          : "N/A",
        "Disbursement Date": original?.disbursedDate
          ? format(new Date(original?.disbursedDate), "dd/MM/yyyy")
          : "N/A",
        "Disbursed By": original?.disbursedBy
          ? `${original?.disbursedBy?.firstName} ${original?.disbursedBy?.lastName}`
          : "N/A",
      };
    });

    const fields = [
      "Employee ID",
      "Employee Name",
      "Employee Email",
      "Advance Amount",
      "Interest Rate",
      "Processing Fee",
      "Amount to Receive",
      "Total Repayment",
      "Amount Repaid",
      "Remaining Balance",
      "Monthly Installment",
      "Repayment Period",
      "Status",
      "Payment Method",
      "Purpose",
      "Request Date",
      "Approval Date",
      "Approved By",
      "Disbursement Date",
      "Disbursed By",
    ];

    const opts = { fields };
    const csvData = json2csv.parse(filteredData, opts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
    saveAs(blob, `advance_report_${timestamp}.csv`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by names..."
          value={
            (table.getColumn("combinedName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("combinedName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "declined", label: "Declined" },
              { value: "disbursed", label: "Disbursed" },
              { value: "repaying", label: "Repaying" },
              { value: "repaid", label: "Repaid" },
            ]}
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
