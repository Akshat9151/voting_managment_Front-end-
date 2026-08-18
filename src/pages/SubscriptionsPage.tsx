import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Crown,
  Sparkles,
  Download
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SubscriptionPlan, CurrentSubscription, Invoice, PlanTier } from '../types';

export const SubscriptionsPage: React.FC = () => {
  const { showToast } = useToast();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<'Razorpay' | 'Stripe' | 'Cashfree' | 'PayU'>('Razorpay');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const loadData = async () => {
    const [planList, subData, invList] = await Promise.all([
      api.getSubscriptionPlans(),
      api.getCurrentSubscription(),
      api.getInvoices()
    ]);
    setPlans(planList);
    setCurrentSub(subData);
    setInvoices(invList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPlan = async (planId: PlanTier) => {
    setIsUpgrading(true);
    try {
      const updated = await api.upgradeSubscription(planId, selectedGateway);
      setCurrentSub(updated);
      showToast(`Campaign plan successfully upgraded via ${selectedGateway}!`, 'success');
      loadData();
    } catch {
      showToast('Payment processing simulated error', 'error');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              Subscription & SaaS Revenue Engine
            </h1>
            <Badge variant="cyan" size="sm">
              Section 11, 12 & 17
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent SaaS pricing tiers, multi-gateway billing checkout, and automated revenue tracking.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        {currentSub && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-sky-50 to-violet-50 border border-sky-200 p-2.5 px-4 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">Current Active Plan</div>
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Crown className="w-4 h-4 text-amber-500" />
                {currentSub.planName}
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {currentSub.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gateway Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <CreditCard className="w-4 h-4 text-sky-600" />
          <span>Select Payment Gateway Engine:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['Razorpay', 'Stripe', 'Cashfree', 'PayU'] as const).map((gw) => (
            <button
              key={gw}
              onClick={() => setSelectedGateway(gw)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                selectedGateway === gw
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {gw}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentSub?.planId === plan.id;
          const isEnterprise = plan.id === 'enterprise';

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                plan.isPopular
                  ? 'border-2 border-sky-500 shadow-lg shadow-sky-500/10'
                  : 'border border-slate-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider text-white shadow-xs ${
                      isEnterprise ? 'bg-violet-600' : 'bg-sky-600'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
                    ₹{plan.priceMonthly.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/month</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 min-h-[36px] leading-relaxed">
                  {plan.tagline}
                </p>

                <div className="my-5 border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Included Capabilities
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <Button
                    variant="outline"
                    className="w-full bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold"
                    disabled
                  >
                    ✓ Current Plan Active
                  </Button>
                ) : (
                  <Button
                    variant={plan.isPopular ? 'primary' : 'outline'}
                    className="w-full font-extrabold"
                    disabled={isUpgrading}
                    onClick={() => handleSelectPlan(plan.id)}
                    leftIcon={<Zap className="w-4 h-4" />}
                  >
                    Activate {plan.name}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add-on Modules (Section 13) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-extrabold tracking-wider uppercase mb-2">
              Section 13 • Add-On Modules
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl">
              High-Volume Communication Boosters
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Extend WhatsApp broadcast limits, SMS backup credits, or custom branding on top of any active subscription.
            </p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4 text-sky-200" />}>
            Top Up Credits
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-sky-300 font-bold">WhatsApp Broadcast Pack</div>
            <div className="text-xl font-extrabold mt-1">₹999 <span className="text-xs font-normal text-slate-300">/ 5,000 msgs</span></div>
            <p className="text-[11px] text-slate-300 mt-2">Official Meta Cloud API direct delivery with personalized candidate name.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-emerald-300 font-bold">SMS Fallback Credits</div>
            <div className="text-xl font-extrabold mt-1">₹499 <span className="text-xs font-normal text-slate-300">/ 2,500 SMS</span></div>
            <p className="text-[11px] text-slate-300 mt-2">DLT approved election sender ID with automatic non-WhatsApp routing.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-violet-300 font-bold">Custom Mobile White-Label</div>
            <div className="text-xl font-extrabold mt-1">₹4,999 <span className="text-xs font-normal text-slate-300">/ one-time</span></div>
            <p className="text-[11px] text-slate-300 mt-2">Candidate photo, party symbol, and customized APK app installer for volunteers.</p>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Billing & Transaction Invoices
            </h3>
            <p className="text-xs text-slate-500">Official tax invoices for campaign accounting and compliance.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                <th className="pb-3 px-3">Invoice No</th>
                <th className="pb-3 px-3">Billing Date</th>
                <th className="pb-3 px-3">Plan Description</th>
                <th className="pb-3 px-3">Gateway</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 px-3 text-slate-600">{inv.date}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">{inv.planName}</td>
                  <td className="py-3.5 px-3 text-slate-600">{inv.gateway}</td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">₹{inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => showToast(`Invoice ${inv.id} downloaded successfully!`, 'success')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
