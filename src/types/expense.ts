// Aligned with backend ExpenseResponse schema
export type ExpenseCategory = 'PRINTING' | 'VEHICLE' | 'MANPOWER' | 'FOOD' | 'DIGITAL' | 'MISCELLANEOUS';

export interface Expense {
  id: string;
  organization_id?: string;
  election_id?: string;
  title?: string;
  amount: number;
  category: ExpenseCategory | string;
  vendor_name?: string | null;
  expense_date?: string | null;
  receipt_url?: string | null;
  recorded_by_user_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;

  // Legacy UI compatibility
  date?: string | null;
  note?: string | null;
  mode?: string | null;
  user?: string | null;
}

export interface BudgetSummary {
  budget_limit: number;
  budgetLimit?: number;
  total_spent: number;
  totalSpent?: number;
  remaining: number;
  utilized_percent: number;
  utilizedPercent?: number;
  expense_count: number;
  expenseCount?: number;
}
