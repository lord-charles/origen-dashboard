"use client";

import { useState, useEffect } from "react";
import { getAdvanceConfig } from "@/services/advance-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Plus, Trash } from "lucide-react";
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
};

interface AdvanceConfigPageProps {
  initialConfig: AdvanceConfig;
}

export default function AdvanceConfigPage({
  initialConfig,
}: AdvanceConfigPageProps) {
  const [loading, setLoading] = useState(false);
  const [suspensionPeriods, setSuspensionPeriods] = useState<
    SuspensionPeriod[]
  >(
    initialConfig.suspensionPeriods.map((period) => ({
      id: period._id,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      reason: period.reason,
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the data to your API
    console.log(values);
  }

  function addSuspensionPeriod() {
    if (dateRange.from && dateRange.to) {
      const newPeriod: SuspensionPeriod = {
        id: Date.now().toString(),
        startDate: dateRange.from,
        endDate: dateRange.to,
        reason: "System maintenance and upgrades",
      };
      setSuspensionPeriods([...suspensionPeriods, newPeriod]);
      setDateRange({ from: undefined, to: undefined });
    }
  }

  function updateSuspensionPeriod(updatedPeriod: SuspensionPeriod) {
    setSuspensionPeriods(
      suspensionPeriods.map((period) =>
        period.id === updatedPeriod.id ? updatedPeriod : period
      )
    );
    setEditingPeriod(null);
  }

  function deleteSuspensionPeriod(id: string) {
    setSuspensionPeriods(
      suspensionPeriods.filter((period) => period.id !== id)
    );
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
        <CardTitle className="text-2xl">Advance Salary Configuration</CardTitle>
        <CardDescription>
          Configure advanced settings for salary advances
        </CardDescription>
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
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addSuspensionPeriod}>Add Period</Button>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell>
                        {format(period.startDate, "LLL dd, y")}
                      </TableCell>
                      <TableCell>
                        {format(period.endDate, "LLL dd, y")}
                      </TableCell>
                      <TableCell>{period.reason}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPeriod(period)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSuspensionPeriod(period.id)}
                          >
                            <Trash className="h-4 w-4" />
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

            <Button type="submit" className="w-full">
              Save Configuration
            </Button>
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
                editingPeriod && updateSuspensionPeriod(editingPeriod)
              }
            >
              Update Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
