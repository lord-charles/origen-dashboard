import { User } from "./user";

export enum PaymentMethod {
  MPESA = "MPESA",
  BANK = "BANK",
  CASH = "CASH",
}

export type AdvanceStatus = "pending" | "approved" | "declined" | "repaying" | "repaid";

export interface Advance {
  id: string;
  employee: string | User;
  amount: number;
  amountRepaid: number;
  purpose: string;
  status: AdvanceStatus;
  requestedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  repaymentPeriod: number;
  interestRate: number;
  totalRepayment: number;
  installmentAmount: number;
  comments?: string;
  approvedBy?: string | User;
  preferredPaymentMethod: PaymentMethod;
  disbursedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAdvances {
  data: Advance[];
  total: number;
  page: number;
  limit: number;
}
