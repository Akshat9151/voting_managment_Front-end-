import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Receipt, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Expense, BudgetSummary } from '../types';

export const ExpensesPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<BudgetSummary>({ budgetLimit: 150000, totalSpent: 68450, remaining: 81550, utilizedPercent: 46 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState('Pamphlet & Banner Printing');
  const [amount, setAmount] = useState<number>(5000);
  const [note, setNote] = useState('');
  const [mode, setMode] = useState<'UPI / Online' | 'Cash Voucher'>('UPI / Online');
  const [user] = useState('Rajesh Kumar (Admin)');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [expData, bData] = await Promise.all([
      api.getExpenses(),
      api.getBudgetSummary()
    ]);
    setExpenses(expData);
    setBudget(bData);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !note) return;
    await api.addExpense({
      category,
      amount: Number(amount),
      note,
      mode,
      user
    });
    showToast(`Expense of ₹${amount.toLocaleString()} recorded successfully!`, 'success');
    setIsAddModalOpen(false);
    setNote('');
    loadData();
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
              ₹{budget.totalSpent.toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-400">/ ₹{budget.budgetLimit.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="mint" className="bg-emerald-950 text-emerald-300 border-emerald-700">
              ₹{budget.remaining.toLocaleString()} Remaining
            </Badge>
            <Badge variant="cyan" className="bg-sky-950 text-sky-300 border-sky-700">
              {budget.utilizedPercent}% Utilized
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budget.utilizedPercent > 80 ? 'bg-rose-500' : 'bg-sky-500'
            }`}
            style={{ width: `${Math.min(budget.utilizedPercent, 100)}%` }}
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

          <FormInput
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
