import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdvances, getBalance } from "@/services/advance-service";
import DashboardProvider from "../dashboard-provider";
import AdvanceModule from "@/components/advance/advance";
import { Header } from "@/components/header";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdvancePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const [initialData, balanceData] = await Promise.all([
      getAdvances({}),
      getBalance(),
    ]);

    return (
      <DashboardProvider>
        <Header />
        <AdvanceModule initialData={initialData} balanceData={balanceData} />
      </DashboardProvider>
    );
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return (
      <DashboardProvider>
        <div>Error loading data</div>
      </DashboardProvider>
    );
  }
}
