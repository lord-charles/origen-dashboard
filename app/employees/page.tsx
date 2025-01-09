import EmployeeModule from "@/components/employee/employees";
import { Header } from "@/components/header";
import { employeesService } from "@/services/employees.service";
import { Suspense } from "react";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getEmployees() {
  try {
    return await employeesService.getEmployees();
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
}

export default async function EmployeesPage() {
  const employeesData = await getEmployees();

  return (
    <div className="w-full">
      <Header />
      <Suspense fallback={<div>Loading employees...</div>}>
        <EmployeeModule initialData={employeesData} />
      </Suspense>
    </div>
  );
}
