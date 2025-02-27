"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const original: any = row.original;
      return {
        "Employee ID": original.employeeId,
        "First Name": original.firstName,
        "Last Name": original.lastName,
        Email: original.email,
        "Phone Number": original.phoneNumber,
        "National ID": original.nationalId,
        "Payroll Number": original.payrollNumber,
        Department: original.department,
        Position: original.position,
        "Employment Type": original.employmentType,
        "Base Salary": `KES ${original.baseSalary.toLocaleString()}`,
        Status: original.status,
        "Start Date": format(
          new Date(original.employmentStartDate),
          "dd/MM/yyyy"
        ),
        "End Date": original.employmentEndDate
          ? format(new Date(original.employmentEndDate), "dd/MM/yyyy")
          : "N/A",
        "Payment Method": original.paymentMethod,
        "Bank Name": original.bankDetails?.bankName || "N/A",
        "Account Number": original.bankDetails?.accountNumber || "N/A",
        "NHIF Deduction": original.nhifDeduction || 0,
        "NSSF Deduction": original.nssfDeduction || 0,
        "Emergency Contact": original.emergencyContact?.name || "N/A",
        "Emergency Phone": original.emergencyContact?.phoneNumber || "N/A",
      };
    });

    const fields = [
      "Employee ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "National ID",
      "Payroll Number",
      "Department",
      "Position",
      "Employment Type",
      "Base Salary",
      "Status",
      "Start Date",
      "End Date",
      "Payment Method",
      "Bank Name",
      "Account Number",
      "NHIF Deduction",
      "NSSF Deduction",
      "Emergency Contact",
      "Emergency Phone",
    ];

    const opts = { fields };
    const csvData = json2csv.parse(filteredData, opts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
    saveAs(blob, `employees_export_${timestamp}.csv`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by names | email| phone | position | payroll number | role..."
          value={
            (table.getColumn("combinedName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("combinedName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[500px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
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
