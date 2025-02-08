"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
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
  Loader2,
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
import { Checkbox } from "@/components/ui/checkbox";

import { NotificationConfig, NotificationAdmin } from "@/types/notification";
import { updateNotificationConfig, addNotificationAdmin, deleteNotificationAdmin } from "@/services/notification-service";
import { useToast } from "@/hooks/use-toast";

const adminFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  notificationTypes: z.array(z.enum(["balance_alert", "monthly_report"])).min(1, {
    message: "Select at least one notification type.",
  }),
  notes: z.string().min(1, { message: "Role/Notes is required." }),
});

const thresholdFormSchema = z.object({
  threshold: z.number().min(0, { message: "Threshold must be a positive number." }),
  reportGenerationDay: z.number().min(1).max(31, { message: "Day must be between 1 and 31" }),
  enableSMSNotifications: z.boolean(),
});

interface AdminNotificationConfigProps {
  initialConfig: NotificationConfig;
}

export default function AdminNotificationConfig({
  initialConfig,
}: AdminNotificationConfigProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState<string | null>(null);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(searchParams.get("tab") || "admins");
  const [admins, setAdmins] = useState<NotificationAdmin[]>(
    initialConfig.data.notificationAdmins
  );
  const [balanceThreshold, setBalanceThreshold] = useState(
    initialConfig.data.balanceThreshold
  );
  const [sendMonthlyReports, setSendMonthlyReports] = useState(
    initialConfig.data.enableEmailNotifications
  );
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel" | "csv">(
    initialConfig.data.reportFormat
  );
  const [reportGenerationDay, setReportGenerationDay] = useState(
    initialConfig.data.reportGenerationDay
  );
  const [enableSMSNotifications, setEnableSMSNotifications] = useState(
    initialConfig.data.enableSMSNotifications
  );

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notificationTypes: [],
      notes: "",
    },
  });

  const thresholdForm = useForm<z.infer<typeof thresholdFormSchema>>({
    resolver: zodResolver(thresholdFormSchema),
    defaultValues: {
      threshold: balanceThreshold,
      reportGenerationDay: reportGenerationDay,
      enableSMSNotifications: enableSMSNotifications,
    },
  });

  async function onAdminSubmit(values: z.infer<typeof adminFormSchema>) {
    try {
      setLoading(true);
      const newAdmin: Omit<NotificationAdmin, 'id'> = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        notificationTypes: values.notificationTypes,
        notes: values.notes,
      };

      const updatedConfig = await addNotificationAdmin(newAdmin);
      setAdmins(updatedConfig.data.notificationAdmins);
      adminForm.reset();
      
      toast({
        title: "Success",
        description: "Admin added successfully",
      });
    } catch (error) {
      console.error("Failed to add admin:", error);
      toast({
        title: "Error",
        description: "Failed to add admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onThresholdSubmit(values: z.infer<typeof thresholdFormSchema>) {
    try {
      setLoading(true);
      const updatedConfig = await updateNotificationConfig({
        balanceThreshold: values.threshold,
        reportGenerationDay: values.reportGenerationDay,
        enableSMSNotifications: values.enableSMSNotifications,
        reportFormat: reportFormat,
        enableEmailNotifications: sendMonthlyReports
      });
      setBalanceThreshold(updatedConfig.data.balanceThreshold);
      setReportGenerationDay(updatedConfig.data.reportGenerationDay);
      setEnableSMSNotifications(updatedConfig.data.enableSMSNotifications);
      
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAdmin(email: string) {
    try {
      setLoading(true);
      const updatedConfig = await deleteNotificationAdmin(email);
      setAdmins(updatedConfig.data.notificationAdmins);
      
      toast({
        title: "Success",
        description: "Admin removed successfully",
      });
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleReportSettingsChange(
    enableEmails: boolean,
    format?: "pdf" | "excel" | 'csv'
  ) {
    try {
      setLoading(true);
      if (format) {
        setFormatLoading(format);
      } else {
        setSwitchLoading(true);
      }
      const currentValues = thresholdForm.getValues();
      
      const updatedConfig = await updateNotificationConfig({
        balanceThreshold: currentValues.threshold,
        reportGenerationDay: currentValues.reportGenerationDay,
        enableSMSNotifications: currentValues.enableSMSNotifications,
        enableEmailNotifications: enableEmails,
        reportFormat: format || reportFormat
      });
      
      setSendMonthlyReports(updatedConfig.data.enableEmailNotifications);
      setReportFormat(updatedConfig.data.reportFormat);
      
      toast({
        title: "Success",
        description: "Report settings updated successfully",
      });
    } catch (error) {
      console.error("Failed to update report settings:", error);
      toast({
        title: "Error",
        description: "Failed to update report settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFormatLoading(null);
      setSwitchLoading(false);
    }
  }

  useEffect(() => {
    // Update URL when tab changes
    const url = new URL(window.location.href);
    url.searchParams.set("tab", currentTab);
    window.history.pushState({}, "", url.toString());
  }, [currentTab]);

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
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="space-y-6"
        >
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="254700000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter phone number in international format (e.g., 254...)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adminForm.control}
                  name="notificationTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Types</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="balance_alert"
                              checked={field.value.includes("balance_alert")}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, "balance_alert"]
                                  : field.value.filter((v) => v !== "balance_alert");
                                field.onChange(newValue);
                              }}
                            />
                            <label htmlFor="balance_alert">Balance Alert</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="monthly_report"
                              checked={field.value.includes("monthly_report")}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, "monthly_report"]
                                  : field.value.filter((v) => v !== "monthly_report");
                                field.onChange(newValue);
                              }}
                            />
                            <label htmlFor="monthly_report">Monthly Report</label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={adminForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role/Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. HR Manager, CEO, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Add Admin
                </Button>
              </form>
            </Form>

            <Separator className="my-6" />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Notification Types</TableHead>
                  <TableHead>Role/Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin, index) => (
                  <TableRow key={index}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {admin.notificationTypes.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type === "balance_alert" ? "Balance Alert" : "Monthly Report"}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{admin.notes}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.email)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
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

                <FormField
                  control={thresholdForm.control}
                  name="reportGenerationDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Generation Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Day of the month when reports will be generated (1-31)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={thresholdForm.control}
                  name="enableSMSNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          SMS Notifications
                        </FormLabel>
                        <FormDescription>
                          Enable or disable SMS notifications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Update Settings
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
              <Card className="flex items-center justify-between p-4 rounded-lg">
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
                <div className="flex items-center gap-2">
                  {switchLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  )}
                  <Switch
                    id="monthly-reports"
                    checked={sendMonthlyReports}
                    onCheckedChange={(checked) => handleReportSettingsChange(checked)}
                    disabled={loading || switchLoading}
                  />
                </div>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="report-format" className="text-base">
                  Report Format
                </Label>
                <div className="flex space-x-4">
                  <Button
                    variant={reportFormat === "pdf" ? "default" : "outline"}
                    onClick={() => handleReportSettingsChange(sendMonthlyReports, "pdf")}
                    disabled={!sendMonthlyReports || loading}
                  >
                    {formatLoading === "pdf" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    PDF
                  </Button>
                  <Button
                    variant={reportFormat === "excel" ? "default" : "outline"}
                    onClick={() => handleReportSettingsChange(sendMonthlyReports, "excel")}
                    disabled={!sendMonthlyReports || loading}
                  >
                    {formatLoading === "excel" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Excel
                  </Button>
                  <Button
                    variant={reportFormat === "csv" ? "default" : "outline"}
                    onClick={() => handleReportSettingsChange(sendMonthlyReports, "csv")}
                    disabled={!sendMonthlyReports || loading}
                  >
                    {formatLoading === "csv" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    CSV
                  </Button>
                </div>
              </div>

              {/* <div className="pt-4">
                <Button className="w-full" disabled={!sendMonthlyReports || loading}>
                  <Mail className="mr-2 h-4 w-4" /> Send Test Report
                </Button>
              </div> */}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 rounded-lg shadow-inner">
          <Separator />
          <h3 className="text-lg font-semibold my-4 flex items-cente">
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
                KES {balanceThreshold}
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
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">
                Report Generation Day
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                {reportGenerationDay}
              </p>
              <p className="text-sm text-gray-500">Day of the month</p>
            </Card>
            <Card className="p-4 rounded-md shadow">
              <h4 className="font-medium text-gray-400 mb-2">
                SMS Notifications
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                {enableSMSNotifications ? "Enabled" : "Disabled"}
              </p>
              <p className="text-sm text-gray-500">SMS Notification Status</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
