"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Advance } from "@/types/advance";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const result = await updateAdvanceStatus(advance._id, newStatus);
      console.log("Advance status updated:", result);
      if (result) {
        toast({
          title: "Success",
          description: "Advance status updated successfully",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to update advance status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating advance status:", error);

      // Extract user-friendly error message from axios error
      let errorMessage = "Failed to update advance status";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (
        error?.message &&
        !error.message.includes("Request failed with status code")
      ) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
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
