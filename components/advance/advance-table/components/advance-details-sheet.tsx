"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Advance } from "@/types/advance";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { getBalance } from "@/services/advance-service";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdvanceDetailsSheetProps {
  advance: Advance;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function AdvanceDetailsSheet({
  advance,
  isOpen,
  onClose,
  onStatusChange,
}: AdvanceDetailsSheetProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: any;

    const checkBalance = async () => {
      try {
        setIsCheckingBalance(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const balanceData = await getBalance();
        setBalance(balanceData.accountBalances.utility.balance - balanceData.pendingWithdrawals);
      } catch (err) {
        setError("Failed to fetch balance. Please try again.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch utility balance",
        });
      } finally {
        setIsCheckingBalance(false);
      }
    };

    if (isOpen) {
      checkBalance();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, toast]);

  const handleStatusChange = async () => {
    const isValid = validateStatusTransition(advance.status, newStatus);
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Status Transition",
        description: `Cannot transition advance from ${advance.status} to ${newStatus}`,
      });
      return;
    }
    if (!balance) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot update status: Balance information unavailable",
      });
      return;
    }

    if (newStatus === "approved" && advance.amount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description:
          "The requested amount exceeds the available utility balance",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onStatusChange(newStatus);
      toast({
        title: "Success",
        description: "Advance status updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update advance status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "disbursed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "repaying":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "repaid":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const validateStatusTransition = (
    currentStatus: string,
    newStatus: string
  ) => {
    const validTransitions: { [key: string]: string[] } = {
      pending: ["approved", "declined"],
      approved: ["disbursed"],
      declined: [],
      disbursed: ["repaying"],
      repaying: ["repaid"],
      repaid: [],
    };

    return validTransitions[currentStatus].includes(newStatus);
  };

  const statusDisplayMap = {
    pending: "Pending",
    approved: "Approve",
    declined: "Decline",
    disbursed: "Disburse",
    repaying: "Repaying",
    repaid: "Repaid",
  } as const;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Advance Request Details
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              Submitted on{" "}
              {advance?.createdAt
                ? format(new Date(advance.createdAt), "PPP")
                : "N/A"}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status Change Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Update Status</h3>

                {isCheckingBalance ? (
                  <TextShimmer
                    className="font-mono text-sm text-muted-foreground"
                    duration={1}
                  >
                    Checking Innova M-Pesa Utility Balance...
                  </TextShimmer>
                ) : balance !== null ? (
                  <div className="text-right">
                    <div className="font-mono text-sm text-muted-foreground">
                      Available Balance
                    </div>
                    <div className="text-xl font-bold text-primary">
                      KES {balance.toLocaleString()}
                    </div>
                  </div>
                ) : null}
              </div>

              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : balance !== null &&
                advance.amount > balance &&
                (newStatus === "approved" || newStatus === "disbursed") ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Insufficient Balance
                  </AlertTitle>
                  <AlertDescription className="font-semibold">
                    The requested amount (KES {advance.amount.toLocaleString()})
                    exceeds the available balance
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex items-center space-x-4">
                <Select
                  onValueChange={setNewStatus}
                  disabled={isCheckingBalance}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "pending",
                      "approved",
                      "declined",
                      "disbursed",
                      "repaid",
                    ].map((status) => (
                      <SelectItem key={status} value={status}>
                        {
                          statusDisplayMap[
                            status as keyof typeof statusDisplayMap
                          ]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusChange}
                  disabled={
                    !newStatus ||
                    isCheckingBalance ||
                    isLoading ||
                    (newStatus === "approved" &&
                      advance.amount > (balance || 0)) ||
                    (newStatus === "disbursed" &&
                      advance.amount > (balance || 0))
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee Information */}
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Employee Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Name</span>
                  <p className="font-medium">
                    {advance?.employee?.firstName} {advance?.employee?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Employee ID
                  </span>
                  <p className="font-medium">{advance?.employee?.employeeId}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{advance?.employee?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advance Details */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Advance Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Amount Requested
                  </span>
                  <p className="font-medium">
                    {formatCurrency(advance?.amount)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Amount Repaid
                  </span>
                  <p className="font-medium">
                    {formatCurrency(advance?.amountRepaid)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Total Repayment
                  </span>
                  <p className="font-medium">
                    {formatCurrency(advance?.totalRepayment)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Monthly Installment
                  </span>
                  <p className="font-medium">
                    {formatCurrency(advance?.installmentAmount)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Repayment Period
                  </span>
                  <p className="font-medium">
                    {advance?.repaymentPeriod} months
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Interest Rate
                  </span>
                  <p className="font-medium">{advance?.interestRate}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Payment Method
                  </span>
                  <p className="font-medium capitalize">
                    {advance?.preferredPaymentMethod}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    className={`${getStatusColor(
                      advance?.status
                    )} font-semibold`}
                  >
                    {advance?.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval and Disbursement Details */}
          {(advance.approvedBy || advance.disbursedBy) && (
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Processing Details
                </h3>
                <div className="space-y-6">
                  {/* Approval Details */}
                  {advance.approvedBy && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Approval Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Approved By
                          </span>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {advance?.approvedBy?.firstName}{" "}
                              {advance?.approvedBy?.lastName}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {advance?.approvedBy?.employeeId}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Approval Date
                          </span>
                          <p className="font-medium">
                            {advance?.approvedDate
                              ? format(new Date(advance.approvedDate), "PPP")
                              : "Not yet approved"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disbursement Details */}
                  {advance.disbursedBy && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Disbursement Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Disbursed By
                          </span>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {advance?.disbursedBy?.firstName}{" "}
                              {advance?.disbursedBy?.lastName}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {advance?.disbursedBy?.employeeId}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Disbursement Date
                          </span>
                          <p className="font-medium">
                            {advance?.disbursedDate
                              ? format(new Date(advance.disbursedDate), "PPP")
                              : "Not yet disbursed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purpose and Comments */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Purpose</span>
                  <p className="font-medium">{advance?.purpose}</p>
                </div>
                {advance?.comments && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Comments
                    </span>
                    <p className="font-medium">{advance?.comments}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
