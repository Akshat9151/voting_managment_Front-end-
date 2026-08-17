import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  MessageSquare,
  UserCheck,
  Receipt,
  Vote,
  Sparkles,
  Activity,
  Award,
  Radio,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InteractiveBoothMap } from '../components/map/InteractiveBoothMap';
import { Candidate, AudienceSplit, BudgetSummary } from '../types';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [audienceSplit, setAudienceSplit] = useState<AudienceSplit>({ total: 3500, whatsapp: 2850, sms: 650, whatsappPercent: 81, smsPercent: 19 });
  const [budget, setBudget] = useState<BudgetSummary>({ budgetLimit: 150000, totalSpent: 68450, remaining: 81550, utilizedPercent: 46 });
  const [turnoutTarget, setTurnoutTarget] = useState<number>(85);
  const [projectedMargin, setProjectedMargin] = useState<number>(420);

  useEffect(() => {
    const loadData = async () => {
      const [candData, splitData, budgetData] = await Promise.all([
        api.getCandidates(),
        api.getAudienceSplit(),
        api.getBudgetSummary()
      ]);
      setCandidates(candData);
      setAudienceSplit(splitData);
      setBudget(budgetData);
    };
    loadData();
  }, []);

  const handleTurnoutChange = (val: number) => {
    setTurnoutTarget(val);
    const calculatedMargin = Math.round((val * 35 * 0.15) - 30);
    setProjectedMargin(calculatedMargin);
  };

  const activityFeed = [
    { title: '1,200 voters added via photo scan', sub: 'Kailash Saini scanned Ward 02 official roll', time: '5m ago', icon: <CheckCircle className="w-3.5 h-3.5 text-sky-600" /> },
    { title: 'Banner approved for Rameshwar Patel', sub: '3x6 ft Hoarding sent to Rampur local printer', time: '22m ago', icon: <Award className="w-3.5 h-3.5 text-emerald-600" /> },
    { title: 'SMS fallback dispatched to 240 non-WhatsApp voters', sub: 'Morning voting reminder delivered successfully', time: '1h ago', icon: <Radio className="w-3.5 h-3.5 text-violet-600" /> },
    { title: 'Campaign bolero fuel expense logged (₹1,500)', sub: 'Ward 01 to 06 village tour', time: '3h ago', icon: <Receipt className="w-3.5 h-3.5 text-amber-600" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              {t('commandCenter')}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> LIVE WAR ROOM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{t('commandCenterSub')}</p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/broadcast')}
            leftIcon={<Radio className="w-3.5 h-3.5 text-sky-600" />}
          >
            Launch Broadcast
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/studio')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-200" />}
          >
            Create Banner Poster
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('totalVoters')}
          value={audienceSplit.total.toLocaleString()}
          subtext="100% Ward Coverage"
          trend="+12% this week"
          trendPositive={true}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
          onClick={() => navigate('/voters')}
        />
        <StatCard
          title={t('whatsappReached')}
          value={`${audienceSplit.whatsappPercent}%`}
          subtext={`${audienceSplit.whatsapp} verified WhatsApp`}
          trend="+840 reached"
          trendPositive={true}
          icon={<MessageSquare className="w-5 h-5" />}
          color="mint"
          onClick={() => navigate('/broadcast')}
        />
        <StatCard
          title={t('activeTeam')}
          value="6 Members"
          subtext="24 Panna Pramukhs"
          trend="6 Booths Assigned"
          trendPositive={true}
          icon={<UserCheck className="w-5 h-5" />}
          color="purple"
          onClick={() => navigate('/team')}
        />
        <StatCard
          title={t('budgetUtilized')}
          value={`₹${budget.totalSpent.toLocaleString()}`}
          subtext={`${budget.utilizedPercent}% of EC ₹1.5L Limit`}
          trend={`₹${budget.remaining.toLocaleString()} left`}
          trendPositive={budget.utilizedPercent < 80}
          icon={<Receipt className="w-5 h-5" />}
          color="amber"
          onClick={() => navigate('/expenses')}
        />
      </div>

      {/* Main Grid: Map & Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Vector Radar Booth Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Interactive 3D Booth Radar Map
                </h3>
                <p className="text-xs text-slate-500">Live ward voter density &amp; polling station coverage</p>
              </div>
              <Badge variant="cyan">Gram Panchayat Rampur</Badge>
            </div>

            <InteractiveBoothMap />
          </Card>

          {/* Turnout Victory Simulator */}
          <Card className="space-y-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h3 className="font-heading font-extrabold text-sm text-white">
                  Live Victory Margin &amp; Turnout Simulator
                </h3>
              </div>
              <Badge variant="purple" className="bg-violet-950/80 text-violet-300 border-violet-700">
                AI Prediction
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Turnout Target: {turnoutTarget}%</span>
                <span>Expected Votes: {Math.round(3500 * (turnoutTarget / 100))}</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={turnoutTarget}
                onChange={(e) => handleTurnoutChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Votes</div>
                <div className="text-base font-extrabold text-sky-400 mt-0.5">
                  {Math.round(3500 * (turnoutTarget / 100) * 0.58)}
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Opponent Est.</div>
                <div className="text-base font-extrabold text-rose-400 mt-0.5">
                  {Math.round(3500 * (turnoutTarget / 100) * 0.42)}
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Lead Margin</div>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  +{projectedMargin} Votes
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Contesting Candidates & Activity Stream */}
        <div className="space-y-6">
          {/* Contesting Candidates Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Vote className="w-4 h-4 text-sky-600" />
                <span>Contesting Profiles</span>
              </h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/candidates')}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => navigate('/candidates')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cand.photo}
                      alt={cand.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 shadow-xs"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 leading-tight">{cand.name}</div>
                      <div className="text-[11px] text-slate-500">{cand.post}</div>
                    </div>
                  </div>
                  <div className="text-xl p-1.5 rounded-xl bg-slate-100 border border-slate-200 shadow-xs">
                    {cand.symbol}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Activity Feed */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Ground Activity Feed</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-3">
              {activityFeed.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="mt-0.5 p-1 rounded-lg bg-slate-100 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 leading-tight">{item.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">{item.sub}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{item.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
