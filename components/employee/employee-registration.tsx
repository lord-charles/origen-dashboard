"use client";

import { ChevronLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../header";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmployeeDto } from "@/types/employee";
import { useToast } from "@/hooks/use-toast";
import { registerEmployee } from "@/services/employees.service";

// Define the validation schema
const employeeSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .regex(/^254[17]\d{8}$/, "Phone number must start with 254"),
    nationalId: z.string().min(6, "Invalid national ID"),
    dateOfBirth: z.date().optional(),
    payrollNumber: z.string().optional(),
    department: z.string().min(2, "Department is required"),
    position: z.string().min(2, "Position is required"),
    employmentType: z.enum(["full-time", "part-time", "contract", "intern"]),
    baseSalary: z.coerce
      .number()
      .min(0, "Base salary must be a positive number"),
    employmentStartDate: z.date(),
    employmentEndDate: z.date().optional(),
    paymentMethod: z.enum(["bank", "mpesa", "cash", "wallet"]),
    bankDetails: z
      .object({
        bankName: z.string().min(1, "Bank name is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        branchCode: z.string().min(1, "Branch code is required"),
      })
      .optional(),
    mpesaDetails: z
      .object({
        phoneNumber: z
          .string()
          .regex(/^254[17]\d{8}$/, "Phone number must start with 254")
          .nullish()
          .or(z.literal("")),
      })
      .optional(),
    emergencyContact: z
      .object({
        name: z.string().optional(),
        relationship: z.string().optional(),
        phoneNumber: z
          .string()
          // .regex(/^254[17]\d{8}$/, "Phone number must start with 254")
          .optional(),
        alternativePhoneNumber: z
          .string()
          // .regex(/^254[17]\d{8}$/, "Phone number must start with 254")
          .optional(),
      })
      .optional(),
    status: z
      .enum(["active", "inactive", "suspended", "terminated"])
      .default("active"),
    roles: z
      .array(z.enum(["employee", "admin", "hr", "finance"]))
      .default(["employee"]),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "bank" && !data.bankDetails) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide the required payment details",
      path: ["paymentMethod"],
    }
  );

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function RegisterEmployeeComponent() {
  const { toast } = useToast();

  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<
    "bank" | "mpesa" | "cash" | "wallet"
  >("mpesa");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    // watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: "active",
      roles: ["employee"],
      paymentMethod: "mpesa",
    },
    mode: "onChange",
  });

  // Debug form values
  // const formValues = watch();
  // console.log("Form values:", formValues);
  // console.log("Form errors:", errors);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      toast({
        title: "Registering Employee",
        description: "Please wait while we process your request...",
      });

      await registerEmployee(data as CreateEmployeeDto);

      toast({
        title: "Registration Successful",
        description: "Employee has been registered successfully.",
      });

      setTimeout(() => {
        router.push("/employees");
      }, 4500);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 flex min-h-screen w-full bg-card flex-col md:w-[87%] lg:w-full md:ml-[80px] lg:ml-0 sm:ml-0 overflow-x-hidden rounded-md"
      >
        {/* Header section */}
        <div className="flex items-center gap-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="rounded-sm px-1 font-normal">
            New Employee Registration
          </Badge>
          <div className="items-center gap-2 md:ml-auto flex">
            <Button
              type="submit"
              size="sm"
              className="font-bold bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Now"}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-4">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Employee identification details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className={`w-full ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className={`w-full ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`w-full ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        {...register("phoneNumber")}
                        className={`w-full ${
                          errors.phoneNumber ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID *</Label>
                      <Input
                        id="nationalId"
                        {...register("nationalId")}
                        className={`w-full ${
                          errors.nationalId ? "border-red-500" : ""
                        }`}
                      />
                      {errors.nationalId && (
                        <p className="text-sm text-red-500">
                          {errors.nationalId.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">
                        Date of Birth (Optional)
                      </Label>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const date = e.target.value
                                ? new Date(e.target.value)
                                : null;
                              field.onChange(date);
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        )}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-500">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>
                  Job role and department information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        {...register("department")}
                        className={`w-full ${
                          errors.department ? "border-red-500" : ""
                        }`}
                      />
                      {errors.department && (
                        <p className="text-sm text-red-500">
                          {errors.department.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position/Job Title *</Label>
                      <Input
                        id="position"
                        {...register("position")}
                        className={`w-full ${
                          errors.position ? "border-red-500" : ""
                        }`}
                      />
                      {errors.position && (
                        <p className="text-sm text-red-500">
                          {errors.position.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type *</Label>
                      <Controller
                        name="employmentType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="employmentType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">
                                Full-time
                              </SelectItem>
                              <SelectItem value="part-time">
                                Part-time
                              </SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.employmentType && (
                        <p className="text-sm text-red-500">
                          {errors.employmentType.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseSalary">Base Salary (KES) *</Label>
                      <Input
                        id="baseSalary"
                        type="number"
                        {...register("baseSalary", { valueAsNumber: true })}
                        className={`w-full ${
                          errors.baseSalary ? "border-red-500" : ""
                        }`}
                      />
                      {errors.baseSalary && (
                        <p className="text-sm text-red-500">
                          {errors.baseSalary.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employmentStartDate">Start Date *</Label>
                      <Controller
                        name="employmentStartDate"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const date = e.target.value
                                ? new Date(e.target.value)
                                : null;
                              field.onChange(date);
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        )}
                      />
                      {errors.employmentStartDate && (
                        <p className="text-sm text-red-500">
                          {errors.employmentStartDate.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employmentEndDate">End Date</Label>
                      <Controller
                        name="employmentEndDate"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const date = e.target.value
                                ? new Date(e.target.value)
                                : null;
                              field.onChange(date);
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payrollNumber">OR Number</Label>
                      <Input
                        id="payrollNumber"
                        {...register("payrollNumber")}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Primary emergency contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact.name">
                        Full Name (Optional)
                      </Label>
                      <Input
                        id="emergencyContact.name"
                        {...register("emergencyContact.name")}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact.relationship">
                        Relationship (Optional)
                      </Label>
                      <Controller
                        name="emergencyContact.relationship"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="emergencyContact.relationship">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Sibling">Sibling</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact.phoneNumber">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="emergencyContact.phoneNumber"
                        {...register("emergencyContact.phoneNumber")}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact.alternativePhoneNumber">
                        Alternative Phone
                      </Label>
                      <Input
                        id="emergencyContact.alternativePhoneNumber"
                        {...register("emergencyContact.alternativePhoneNumber")}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Salary payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            setPaymentMethod(
                              val as "bank" | "mpesa" | "cash" | "wallet"
                            );
                          }}
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {paymentMethod === "bank" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.bankName">
                          Bank Name (Optional)
                        </Label>
                        <Input
                          id="bankDetails.bankName"
                          {...register("bankDetails.bankName")}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.accountNumber">
                          Account Number (Optional)
                        </Label>
                        <Input
                          id="bankDetails.accountNumber"
                          {...register("bankDetails.accountNumber")}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankDetails.branchCode">
                          Branch Code (Optional)
                        </Label>
                        <Input
                          id="bankDetails.branchCode"
                          {...register("bankDetails.branchCode")}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === "mpesa" && (
                    <div className="space-y-2">
                      <Label htmlFor="mpesaDetails.phoneNumber">
                        M-Pesa Phone Number (Optional)
                      </Label>
                      <Input
                        id="mpesaDetails.phoneNumber"
                        {...register("mpesaDetails.phoneNumber")}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Employee account configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">
                              Terminated
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roles">Roles</Label>
                    <Controller
                      name="roles"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value[0]}
                          onValueChange={(val) => field.onChange([val])}
                        >
                          <SelectTrigger id="roles">
                            <SelectValue placeholder="Select roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-center gap-2 md:hidden mt-4 w-full">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full font-bold text-lg"
          >
            Discard
          </Button>
          <Button
            type="submit"
            size="lg"
            className="w-full font-bold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Now"}
          </Button>
        </div>
      </form>
    </>
  );
}
