import React, { useState, useEffect, useCallback } from 'react';
import { expensesApi } from '../services/api';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Receipt, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { TransliteratingTextInput } from '../components/ui/TransliteratingTextInput';
import { Select } from '../components/ui/Select';
import { Expense, BudgetSummary } from '../types';

export const ExpensesPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<BudgetSummary>({
    budget_limit: 150000,
    total_spent: 0,
    remaining: 150000,
    utilized_percent: 0,
    expense_count: 0,
    budgetLimit: 150000,
    totalSpent: 0,
    utilizedPercent: 0,
    expenseCount: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PRINTING');
  const [amount, setAmount] = useState<number>(5000);
  const [vendorName, setVendorName] = useState('');
  const [mode, setMode] = useState('UPI / Online');
  const [note, setNote] = useState('');

  const loadData = useCallback(async () => {
    if (!activeElectionId) return;
    try {
      const [expData, bData] = await Promise.all([
        expensesApi.list(activeElectionId),
        expensesApi.getBudgetSummary(activeElectionId),
      ]);
      setExpenses(expData.items as Expense[]);
      setBudget({
        ...bData,
        budgetLimit: bData.budget_limit ?? 150000,
        totalSpent: bData.total_spent ?? 0,
        utilizedPercent: bData.utilized_percent ?? 0,
        expenseCount: bData.expense_count ?? 0,
      } as BudgetSummary);
    } catch {
      showToast(t('failedLoadingExpenses'), 'error');
    }
  }, [activeElectionId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElectionId || !title || !amount) return;
    try {
      await expensesApi.create(activeElectionId, {
        title,
        amount,
        category,
        vendor_name: vendorName || null,
        note: note || null,
        mode,
      });
      showToast(`Expense of ₹${amount.toLocaleString()} recorded successfully!`, 'success');
      setIsAddModalOpen(false);
      setTitle(''); setNote(''); setMode('UPI / Online'); setVendorName('');
      await loadData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to record expense', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('expensesLedger')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracks expenditures against official Gram Panchayat election ceiling (₹1,50,000).
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t('addExpense')}
        </Button>
      </div>

      {/* Statutory Budget Ceiling Banner Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase text-sky-400 tracking-wider">
              Statutory Gram Panchayat Election Ceiling
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-0.5">
              ₹{(budget.totalSpent ?? budget.total_spent ?? 0).toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-400">/ ₹{(budget.budgetLimit ?? budget.budget_limit ?? 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="mint" className="bg-emerald-950 text-emerald-300 border-emerald-700">
              ₹{budget.remaining.toLocaleString()} Remaining
            </Badge>
            <Badge variant="cyan" className="bg-sky-950 text-sky-300 border-sky-700">
              {(budget.utilizedPercent ?? budget.utilized_percent ?? 0)}% Utilized
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              (budget.utilizedPercent ?? budget.utilized_percent ?? 0) > 80 ? 'bg-rose-500' : 'bg-sky-500'
            }`}
            style={{ width: `${Math.min(budget.utilizedPercent ?? budget.utilized_percent ?? 0, 100)}%` }}
          />
        </div>
      </Card>

      {/* Expenses Ledger Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Vendor &amp; Note</th>
                <th className="p-3.5">Payment Mode</th>
                <th className="p-3.5">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <Badge variant="purple" size="sm">{exp.category}</Badge>
                  </td>
                  <td className="p-3.5 font-heading font-extrabold text-sm text-rose-600">
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-500">{exp.date}</td>
                  <td className="p-3.5 text-slate-800 font-medium max-w-xs">{exp.note}</td>
                  <td className="p-3.5">
                    <Badge variant="mint" size="sm">{exp.mode}</Badge>
                  </td>
                  <td className="p-3.5 text-slate-500">{exp.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-600" />
            <span>Record Campaign Expense</span>
          </div>
        }
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Select
            label="Expense Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Pamphlet & Banner Printing">Pamphlet & Banner Printing (प्रचार सामग्री)</option>
            <option value="Sound, DJ & Mic Rental">Sound, DJ & Mic Rental (माइक/लाउडस्पीकर)</option>
            <option value="Tea, Snacks & Volunteer Food">Tea, Snacks & Volunteer Food (खान-पान)</option>
            <option value="Vehicle Fuel & Transport">Vehicle Fuel & Transport (वाहन ईंधन)</option>
            <option value="Office & Panna Supplies">Office & Panna Supplies (स्टेशनरी)</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Amount (₹ INR)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            <Select
              label="Payment Mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="UPI / Online">UPI / Online</option>
              <option value="Cash Voucher">Cash Voucher</option>
            </Select>
          </div>

          <TransliteratingTextInput
            label="Vendor &amp; Purpose Note"
            placeholder="e.g. Rampur Digital Flex Print (500 Handbills)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Expenditure
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
