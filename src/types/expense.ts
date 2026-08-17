export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  mode: 'UPI / Online' | 'Cash Voucher' | 'Bank Transfer' | 'Cheque';
  user: string;
  receiptUrl?: string;
}

export interface BudgetSummary {
  budgetLimit: number;
  totalSpent: number;
  remaining: number;
  utilizedPercent: number;
}
