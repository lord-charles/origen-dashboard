"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { UtilityTransaction } from "@/types/utility";

export default function UtilityTable({
  transactions,
}: {
  transactions: UtilityTransaction[];
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Mpesa Transactions</CardTitle>
          <CardDescription>
            View and analyze Mpesa transactions.
          </CardDescription>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable data={transactions} columns={columns} />
      </div>
    </Card>
  );
}
