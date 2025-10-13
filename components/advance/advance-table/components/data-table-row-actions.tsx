"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Advance } from "@/types/advance";
import { useToast } from "@/hooks/use-toast";
import { updateAdvanceStatus } from "@/services/advance-service";
import { AdvanceDetailsSheet } from "./advance-details-sheet";
import { LucideMoreHorizontal } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const advance = row.original as Advance;
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    const result = await updateAdvanceStatus(advance._id, newStatus);

    if (result.success) {
      toast({
        title: "Success",
        description: "Advance status updated successfully",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update advance status",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        onClick={() => setIsDetailsOpen(true)}
      >
        <LucideMoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </Button>

      <AdvanceDetailsSheet
        advance={advance}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
