"use client";

import { useState, useEffect } from "react";
import { getAdvanceConfig, addSuspensionPeriod, updateSuspensionPeriod, deleteSuspensionPeriod, updateAdvanceConfig } from "@/services/advance-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Plus, Trash, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { AdvanceConfig } from "@/types/advance";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  advanceDefaultInterestRate: z.number().min(0).max(100),
  advanceMinRepaymentPeriod: z.number().int().positive(),
  advanceMaxRepaymentPeriod: z.number().int().positive(),
  maxAdvancePercentage: z.number().min(0).max(100),
  maxActiveAdvances: z.number().int().positive(),
});

type SuspensionPeriod = {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  isActive: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

interface AdvanceConfigPageProps {
  initialConfig: AdvanceConfig;
}

export default function AdvanceConfigPage({
  initialConfig,
}: AdvanceConfigPageProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [suspensionPeriods, setSuspensionPeriods] = useState<
    SuspensionPeriod[]
  >(
    initialConfig.suspensionPeriods.map((period) => ({
      id: period._id,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      reason: period.reason,
      isActive: period.isActive ?? true,
      createdBy: period.createdBy,
      updatedBy: period.updatedBy,
    }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advanceDefaultInterestRate: initialConfig.data.advanceDefaultInterestRate,
      advanceMinRepaymentPeriod: initialConfig.data.advanceMinRepaymentPeriod,
      advanceMaxRepaymentPeriod: initialConfig.data.advanceMaxRepaymentPeriod,
      maxAdvancePercentage: initialConfig.data.maxAdvancePercentage,
      maxActiveAdvances: initialConfig.data.maxActiveAdvances,
    },
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [editingPeriod, setEditingPeriod] = useState<SuspensionPeriod | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const periodsPerPage = 5;
  const [reason, setReason] = useState("");
  const [configSaving, setConfigSaving] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setConfigSaving(true);
      await updateAdvanceConfig(values);
      
      toast({
        title: "Success",
        description: "Advance configurations updated successfully",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to update advance configurations:", error);
      toast({
        title: "Error",
        description: "Failed to update advance configurations",
        variant: "destructive",
      });
    } finally {
      setConfigSaving(false);
    }
  }

  async function addNewSuspensionPeriod() {
    if (dateRange.from && dateRange.to && reason) {
      try {
        setLoading(true);

        // Format start date to start of day
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);

        // Format end date to end of day
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);

        const newPeriod = await addSuspensionPeriod({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reason: reason,
          isActive: true,

        });

        const startDateNew = new Date(newPeriod.startDate);
        const endDateNew = new Date(newPeriod.endDate);

        setSuspensionPeriods([
          ...suspensionPeriods,
          {
            id: newPeriod._id,
            startDate: startDateNew,
            endDate: endDateNew,
            reason: newPeriod.reason,
            isActive: newPeriod.isActive ?? true,
            createdBy: newPeriod.createdBy,
            updatedBy: newPeriod.updatedBy,
          },
        ]);

        setDateRange({ from: undefined, to: undefined });
        setReason("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Failed to add suspension period:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function updateSuspensionPeriodHandler(period: SuspensionPeriod) {
    try {
      setUpdateLoading(period.id);

      // Format dates to ISO string with correct time
      const startDate = new Date(period.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(period.endDate);
      endDate.setHours(23, 59, 59, 999);

      const updatedPeriod = await updateSuspensionPeriod({
        _id: period.id.toString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reason: period.reason,
        isActive: period.isActive,
      });

      setSuspensionPeriods(
        suspensionPeriods.map((p) =>
          p.id === period.id
            ? {
              ...period,
              updatedBy: updatedPeriod.updatedBy,
            }
            : p
        )
      );

      setEditingPeriod(null);
      toast({
        title: "Success",
        description: "Suspension period updated successfully",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to update suspension period:", error);
      toast({
        title: "Error",
        description: "Failed to update suspension period",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(null);
    }
  }

  async function handleDeleteSuspensionPeriod(id: string) {
    try {
      setDeleteLoading(id);
      await deleteSuspensionPeriod(id);

      setSuspensionPeriods(
        suspensionPeriods.filter((period) => period.id !== id)
      );

      toast({
        title: "Success",
        description: "Suspension period deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete suspension period:", error);
      toast({
        title: "Error",
        description: "Failed to delete suspension period",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  }

  const indexOfLastPeriod = currentPage * periodsPerPage;
  const indexOfFirstPeriod = indexOfLastPeriod - periodsPerPage;
  const currentPeriods = suspensionPeriods.slice(
    indexOfFirstPeriod,
    indexOfLastPeriod
  );

  const totalPages = Math.ceil(suspensionPeriods.length / periodsPerPage);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div >
            <CardTitle className="text-2xl">Advance Salary Configuration</CardTitle>
            <CardDescription>
              Configure advanced settings for salary advances
            </CardDescription>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={configSaving}>
            {configSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>

      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="advanceDefaultInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Set the default interest rate for advances
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="advanceMinRepaymentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Repayment Period (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="advanceMaxRepaymentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Repayment Period (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxActiveAdvances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Active Advances</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Set the maximum number of active advances allowed per
                      employee
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maxAdvancePercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Advance Percentage</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-grow"
                      />
                      <span className="font-medium">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set the maximum percentage of salary that can be advanced
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Suspension Periods</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" /> Add Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Suspension Period</DialogTitle>
                      <DialogDescription>
                        Set the date range and reason for the suspension period.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date-range">Date Range</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-range"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={dateRange}
                              onSelect={(range) => {
                                setDateRange({
                                  from: range?.from,
                                  to: range?.to,
                                });
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Input
                          id="reason"
                          placeholder="Enter reason for suspension"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addNewSuspensionPeriod}>Add Period</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell>
                        {period.startDate && !isNaN(period.startDate.getTime())
                          ? format(period.startDate, "LLL dd, y")
                          : "Invalid date"}
                      </TableCell>
                      <TableCell>
                        {period.endDate && !isNaN(period.endDate.getTime())
                          ? format(period.endDate, "LLL dd, y")
                          : "Invalid date"}
                      </TableCell>
                      <TableCell>{period.reason}</TableCell>
                      <TableCell>
                        <Select
                          value={period.isActive.toString()}
                          onValueChange={(value) => {
                            const updatedPeriod = {
                              ...period,
                              isActive: value === "true",
                            };
                            updateSuspensionPeriodHandler(updatedPeriod);
                          }}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${period.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {period.isActive ? "Active" : "Inactive"}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {period.createdBy
                          ? `${period.createdBy.firstName} ${period.createdBy.lastName}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {period.updatedBy
                          ? `${period.updatedBy.firstName} ${period.updatedBy.lastName}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPeriod(period)}
                            disabled={updateLoading === period.id}
                          >
                            {updateLoading === period.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Pencil className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSuspensionPeriod(period.id)}
                            disabled={deleteLoading === period.id || updateLoading === period.id}
                          >
                            {deleteLoading === period.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={
                        currentPage === 1
                          ? undefined
                          : () =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      isActive={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>


          </form>
        </Form>
      </CardContent>
      <Dialog
        open={!!editingPeriod}
        onOpenChange={() => setEditingPeriod(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Suspension Period</DialogTitle>
            <DialogDescription>
              Update the date range and reason for the suspension period.
            </DialogDescription>
          </DialogHeader>
          {editingPeriod && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date-range">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-date-range"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(editingPeriod.startDate, "LLL dd, y")} -{" "}
                      {format(editingPeriod.endDate, "LLL dd, y")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={editingPeriod.startDate}
                      selected={{
                        from: editingPeriod.startDate,
                        to: editingPeriod.endDate,
                      }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setEditingPeriod({
                            ...editingPeriod,
                            startDate: range.from,
                            endDate: range.to,
                          });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reason">Reason</Label>
                <Input
                  id="edit-reason"
                  value={editingPeriod.reason}
                  onChange={(e) =>
                    setEditingPeriod({
                      ...editingPeriod,
                      reason: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() =>
                editingPeriod && updateSuspensionPeriodHandler(editingPeriod)
              }
              disabled={updateLoading === editingPeriod?.id}
            >
              {updateLoading === editingPeriod?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Update Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
