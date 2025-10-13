"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User } from "@/types/user";
import Link from "next/link";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  deleteEmployee,
  appointAsReviewer,
  appointAsApprover,
} from "@/services/employees.service";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const employee = row.original as User;
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReviewerDialog, setShowReviewerDialog] = useState(false);
  const [showApproverDialog, setShowApproverDialog] = useState(false);
  const [reviewerLevel, setReviewerLevel] = useState("1");
  const [maxApprovalAmount, setMaxApprovalAmount] = useState("100000");
  const [isAppointing, setIsAppointing] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteEmployee(employee._id);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      // Refresh the page to update the table
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAppointReviewer = async () => {
    if (isAppointing) return;
    try {
      setIsAppointing(true);
      const result = await appointAsReviewer(employee, parseInt(reviewerLevel));

      if (result.success) {
        toast({
          title: "Success",
          description: `${employee.firstName} ${employee.lastName} has been appointed as an advance reviewer`,
        });
        setShowReviewerDialog(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to appoint as reviewer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAppointing(false);
    }
  };

  const handleAppointApprover = async () => {
    if (isAppointing) return;
    try {
      setIsAppointing(true);
      const result = await appointAsApprover(
        employee,
        parseInt(maxApprovalAmount)
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `${employee.firstName} ${employee.lastName} has been appointed as an advance approver`,
        });
        setShowApproverDialog(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to appoint as approver",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAppointing(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">
                {employee.firstName} {employee.lastName}&apos;s
              </span>{" "}
              record and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Employee"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reviewer Appointment Dialog */}
      <Dialog open={showReviewerDialog} onOpenChange={setShowReviewerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appoint as Advance Reviewer</DialogTitle>
            <DialogDescription>
              Appoint {employee.firstName} {employee.lastName} as an advance
              reviewer. Set their review level (1-5, where 1 is basic and 5 is
              senior).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Review Level
              </Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="5"
                value={reviewerLevel}
                onChange={(e) => setReviewerLevel(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewerDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAppointReviewer} disabled={isAppointing}>
              {isAppointing ? "Appointing..." : "Appoint as Reviewer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approver Appointment Dialog */}
      <Dialog open={showApproverDialog} onOpenChange={setShowApproverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appoint as Advance Approver</DialogTitle>
            <DialogDescription>
              Appoint {employee.firstName} {employee.lastName} as an advance
              approver. Set their maximum approval amount in KES.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Max Amount (KES)
              </Label>
              <Input
                id="amount"
                type="number"
                min="1000"
                step="1000"
                value={maxApprovalAmount}
                onChange={(e) => setMaxApprovalAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproverDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAppointApprover} disabled={isAppointing}>
              {isAppointing ? "Appointing..." : "Appoint as Approver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <Link href={`/employees/${employee._id}`}>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </Link>
          <Link href={`/employees/${employee._id}/update`}>
            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowReviewerDialog(true)}
            disabled={isAppointing}
          >
            Appoint as Reviewer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowApproverDialog(true)}
            disabled={isAppointing}
          >
            Appoint as Approver
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
