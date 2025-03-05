import { Metadata } from "next";
import WalletPage from "@/components/wallet/wallet-component";
import {
  getPaymentTransactions,
  getUtilityTransactions,
  getWalletTransactions,
} from "@/services/wallet-service";
import { startOfMonth, endOfMonth } from "date-fns";

export const metadata: Metadata = {
  title: "Wallet | Innova",
  description: "Wallet transactions and balance management",
};

export default async function WalletDashboard() {
  const now = new Date();
  const startDate = startOfMonth(now).toISOString();
  const endDate = endOfMonth(now).toISOString();

  const [transactions, mpesaPayments, utilityTransactions] = await Promise.all([
    getWalletTransactions({
      startDate,
      endDate,
    }),
    getPaymentTransactions({
      startDate,
      endDate,
    }),
    getUtilityTransactions({
      startDate,
      endDate,
    }),
  ]);

  return (
    <WalletPage
      transactions={transactions.data}
      mpesaPayments={mpesaPayments}
      utilityTransactions={utilityTransactions.data.transactions}
    />
  );
}
