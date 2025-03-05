export interface UtilityTransaction {
  transactionId: string;
  mpesaReceiptNumber?: string;
  transactionDate: string;
  amount: number;
  balanceBeforeTransaction: number;
  balanceAfterTransaction?: number;
  recipientDetails: {
    name: string;
    phoneNumber: string;
  };
  employee: {
    email: string;
    nationalId: string;
  };
  status: 'completed' | 'pending' | 'failed';
  type: 'b2c' | 'recharge' | 'withdrawal';
}

export interface UtilityTransactionResponse {
  data: {
    transactions: UtilityTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}
