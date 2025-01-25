import DashboardProvider from "@/app/dashboard-provider";
import { RegisterEmployeeComponent } from "@/components/employee/employee-registration";
import React from "react";

const page = () => {
  return (
    <DashboardProvider>
      <RegisterEmployeeComponent />
    </DashboardProvider>
  );
};

export default page;
