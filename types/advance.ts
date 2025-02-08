export type PaymentMethod = "mpesa" | "bank" | "cash" | "wallet";

export type AdvanceStatus =
  | "pending"
  | "approved"
  | "declined"
  | "disbursed"
  | "repaying"
  | "repaid";

interface AdvanceEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
}

export interface Advance {
  _id: string;
  employee: AdvanceEmployee;
  amount: number;
  amountRepaid: number;
  purpose: string;
  status: AdvanceStatus;
  requestedDate: string;
  repaymentPeriod: number;
  interestRate: number;
  totalRepayment: number;
  installmentAmount: number;
  comments: string;
  preferredPaymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvedBy?: AdvanceEmployee;
  approvedDate?: string;
  disbursedBy?: AdvanceEmployee;
  disbursedDate?: string;
}

export interface PaginatedAdvances {
  data: Advance[];
  total: number;
  page: number;
  limit: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

interface SuspensionPeriod {
  _id: string;
  startDate: string;
  endDate: string;
  reason: string;
  isActive: boolean;
  createdBy: User;
  updatedBy: User;
}

interface AdvanceConfigData {
  advanceDefaultInterestRate: number;
  advanceMinAmount: number;
  advanceMaxAmount: number;
  advanceMinRepaymentPeriod: number;
  advanceMaxRepaymentPeriod: number;
  advancePurposes: string[];
  maxAdvancePercentage: number;
  maxActiveAdvances: number;
}

export interface AdvanceConfig {
  _id: string;
  key: string;
  type: string;
  data: AdvanceConfigData;
  isActive: boolean;
  description: string;
  updatedBy: User;
  __v: number;
  updatedAt: string;
  suspensionPeriods: SuspensionPeriod[];
}
