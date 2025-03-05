import WalletPage from '@/components/wallet/wallet-component';
import { getPaymentTransactions, getUtilityTransactions, getWalletTransactions } from '@/services/wallet-service'
import React from 'react'

export default async function Wallet() {
    const [
      transactionsResponse, mpesaPayments,
      utilityTransactions
    ] = await Promise.all([
      getWalletTransactions(),
      getPaymentTransactions(),
      getUtilityTransactions()
    ]);
  return (
    <div>
      <WalletPage transactions={transactionsResponse.data} mpesaPayments={mpesaPayments} utilityTransactions={utilityTransactions.data.transactions}/>
    </div>
  )
}

