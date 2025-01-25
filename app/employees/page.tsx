import EmployeeModule from "@/components/employee/employees";
import { Header } from "@/components/header";
import { Suspense } from "react";
import DashboardProvider from "../dashboard-provider";
import { getAllEmployees } from "@/services/employees.service";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getEmployees() {
  try {
    return await getEmployees();
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
}

export default async function EmployeesPage() {
  const employeesData = await getAllEmployees();

  return (
    <DashboardProvider>
      <Header />
      <Suspense fallback={<div>Loading employees...</div>}>
        <EmployeeModule initialData={employeesData} />
      </Suspense>
    </DashboardProvider>
  );
}
