import { Header } from "../../components/header";
import { WalletOverview } from "../../components/wallet-overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardProvider from "../dashboard-provider";

export default function WalletPage() {
  return (
    <DashboardProvider>
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        <WalletOverview />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Last 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transaction list will be displayed here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transaction summary chart will be displayed here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Perform common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Quick action buttons will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardProvider>
  );
}
