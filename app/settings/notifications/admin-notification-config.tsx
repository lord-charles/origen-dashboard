"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bell,
  Plus,
  Trash,
  Mail,
  DollarSign,
  FileText,
  Users,
  AlertTriangle,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const adminFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Role is required." }),
});

const thresholdFormSchema = z.object({
  threshold: z
    .number()
    .min(0, { message: "Threshold must be a positive number." }),
});

type Admin = z.infer<typeof adminFormSchema> & { id: string };

export default function AdminNotificationConfig() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [balanceThreshold, setBalanceThreshold] = useState(1000);
  const [sendMonthlyReports, setSendMonthlyReports] = useState(true);
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel">("pdf");

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const thresholdForm = useForm<z.infer<typeof thresholdFormSchema>>({
    resolver: zodResolver(thresholdFormSchema),
    defaultValues: {
      threshold: balanceThreshold,
    },
  });

  function onAdminSubmit(values: z.infer<typeof adminFormSchema>) {
    setAdmins([...admins, { ...values, id: Date.now().toString() }]);
    adminForm.reset();
  }

  function onThresholdSubmit(values: z.infer<typeof thresholdFormSchema>) {
    setBalanceThreshold(values.threshold);
  }

  function deleteAdmin(id: string) {
    setAdmins(admins.filter((admin) => admin.id !== id));
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Bell className="mr-2" />
          Admin Notification Hub
        </CardTitle>
        <CardDescription className="text-gray-100">
          Centralized management for system notifications and reports
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Tabs defaultValue="admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            <TabsTrigger value="admins" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Manage Admins
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alert Settings
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Report Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins" className="space-y-6">
            <div
              className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Admin Management</p>
              <p>
                Add, view, and manage administrators who receive system
                notifications.
              </p>
            </div>
            <Form {...adminForm}>
              <form
                onSubmit={adminForm.handleSubmit(onAdminSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={adminForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adminForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adminForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Super Admin, Finance Manager"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
              </form>
            </Form>

            <Separator className="my-6" />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{admin.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAdmin(admin.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div
              className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Balance Threshold Alert</p>
              <p>
                Set the minimum balance that triggers notifications to admins.
              </p>
            </div>

            <Form {...thresholdForm}>
              <form
                onSubmit={thresholdForm.handleSubmit(onThresholdSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={thresholdForm.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Balance Threshold</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="text-gray-500" />
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseFloat(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Admins will be notified when the balance falls below
                        this amount.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Update Threshold
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Monthly Report Settings</p>
              <p>
                Configure the delivery and format of monthly reports sent to
                admins.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="flex items-center justify-between p-4  rounded-lg">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="monthly-reports"
                    className="text-base font-medium"
                  >
                    Monthly Reports
                  </Label>
                  <p className="text-sm text-gray-500">
                    Enable or disable monthly report emails
                  </p>
                </div>
                <Switch
                  id="monthly-reports"
                  checked={sendMonthlyReports}
                  onCheckedChange={setSendMonthlyReports}
                />
              </Card>

              <div className="space-y-2">
                <Label htmlFor="report-format" className="text-base">
                  Report Format
                </Label>
                <div className="flex space-x-4">
                  <Button
                    variant={reportFormat === "pdf" ? "default" : "outline"}
                    onClick={() => setReportFormat("pdf")}
                    disabled={!sendMonthlyReports}
                  >
                    PDF
                  </Button>
                  <Button
                    variant={reportFormat === "excel" ? "default" : "outline"}
                    onClick={() => setReportFormat("excel")}
                    disabled={!sendMonthlyReports}
                  >
                    Excel
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full" disabled={!sendMonthlyReports}>
                  <Mail className="mr-2 h-4 w-4" /> Send Test Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-6  rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-4 flex items-cente">
            <FileText className="mr-2" /> Configuration Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">Admin Stats</h4>
              <p className="text-2xl font-bold text-blue-600">
                {admins.length}
              </p>
              <p className="text-sm text-gray-500">Total Administrators</p>
            </Card>
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">
                Balance Threshold
              </h4>
              <p className="text-2xl font-bold text-green-600">
                ${balanceThreshold}
              </p>
              <p className="text-sm text-gray-500">Alert Trigger Amount</p>
            </Card>
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">
                Monthly Reports
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                {sendMonthlyReports ? "Enabled" : "Disabled"}
              </p>
              <p className="text-sm text-gray-500">Report Delivery Status</p>
            </Card>
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">Report Format</h4>
              <p className="text-2xl font-bold text-orange-600">
                {reportFormat.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500">Preferred File Type</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
