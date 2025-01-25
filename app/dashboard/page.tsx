import DashboardComponent from "@/components/dashboard/dashboard";
import { Header } from "../../components/header";
import DashboardProvider from "../dashboard-provider";

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <Header />
      <DashboardComponent />
    </DashboardProvider>
  );
}
