import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  UserCheck,
  Activity,
  Award,
  Radio,
  Sliders,
  CheckCircle,
  CheckSquare,
  Clock,
  Crown,
  Camera
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InteractiveBoothMap } from '../components/map/InteractiveBoothMap';
import { Candidate, AudienceSplit, Task, FieldActivity, CurrentSubscription } from '../types';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { currentRole } = useAuth();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<FieldActivity[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [audienceSplit, setAudienceSplit] = useState<AudienceSplit>({ total: 3500, whatsapp: 2850, sms: 650, whatsappPercent: 81, smsPercent: 19 });
  const [turnoutTarget, setTurnoutTarget] = useState<number>(85);
  const [projectedMargin, setProjectedMargin] = useState<number>(420);

  useEffect(() => {
    const loadData = async () => {
      const [candData, splitData, taskList, actList, subData] = await Promise.all([
        api.getCandidates(),
        api.getAudienceSplit(),
        api.getTasks(),
        api.getFieldActivities(),
        api.getCurrentSubscription()
      ]);
      setCandidates(candData);
      setAudienceSplit(splitData);
      setTasks(taskList);
      setActivities(actList);
      setCurrentSub(subData);
    };
    loadData();
  }, []);

  const handleTurnoutChange = (val: number) => {
    setTurnoutTarget(val);
    const calculatedMargin = Math.round((val * 35 * 0.15) - 30);
    setProjectedMargin(calculatedMargin);
  };

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              {currentRole === 'superadmin' && 'Parshad Super Admin War Room'}
              {currentRole === 'admin' && 'Candidate Campaign Command Center'}
              {currentRole === 'volunteer' && 'Ground Volunteer Field Desk'}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {currentRole.toUpperCase()} LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentRole === 'superadmin' && 'Complete monitoring & centralized control over all candidates, wards, tasks & revenue.'}
            {currentRole === 'admin' && 'Manage assigned field volunteers, campaign tasks, booth slips & real-time turnout.'}
            {currentRole === 'volunteer' && 'Execute your daily tasks, distribute panna slips & log field activity with photo proof.'}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentRole !== 'volunteer' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/tasks')}
                leftIcon={<CheckSquare className="w-3.5 h-3.5 text-sky-600" />}
              >
                Assign Tasks
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/broadcast')}
                leftIcon={<Radio className="w-3.5 h-3.5 text-sky-600" />}
              >
                Launch Broadcast
              </Button>
            </>
          )}

          {currentRole === 'superadmin' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/subscriptions')}
              leftIcon={<Crown className="w-3.5 h-3.5 text-amber-300" />}
            >
              Manage SaaS Plans
            </Button>
          )}

          {currentRole === 'volunteer' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/field-activities')}
              leftIcon={<Camera className="w-3.5 h-3.5 text-white" />}
            >
              Submit Field Report
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid (PDF Section 3.1 & 4.1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {currentRole === 'superadmin' ? (
          <>
            <StatCard
              title="Total Candidates"
              value={`${candidates.length} Registered`}
              subtext="Sarpanch & Panch"
              trend="+3 Active Campaigns"
              trendPositive={true}
              icon={<Award className="w-5 h-5" />}
              color="cyan"
              onClick={() => navigate('/candidates')}
            />
            <StatCard
              title="Total Volunteers"
              value="24 Field Agents"
              subtext="18 Currently On Duty"
              trend="100% Ward Coverage"
              trendPositive={true}
              icon={<Users className="w-5 h-5" />}
              color="mint"
              onClick={() => navigate('/volunteers')}
            />
            <StatCard
              title="Campaign Tasks"
              value={`${completedTasksCount} / ${tasks.length}`}
              subtext={`${pendingTasksCount} Pending Action`}
              trend="75% Completion Rate"
              trendPositive={true}
              icon={<CheckSquare className="w-5 h-5" />}
              color="purple"
              onClick={() => navigate('/tasks')}
            />
            <StatCard
              title="SaaS Revenue / Plan"
              value={currentSub ? `₹${(currentSub.planId === 'enterprise' ? 12999 : currentSub.planId === 'professional' ? 5999 : 1999).toLocaleString()}` : '₹5,999/mo'}
              subtext={currentSub?.planName || 'Professional Plan'}
              trend="Auto-Renew Active"
              trendPositive={true}
              icon={<Crown className="w-5 h-5" />}
              color="amber"
              onClick={() => navigate('/subscriptions')}
            />
          </>
        ) : currentRole === 'admin' ? (
          <>
            <StatCard
              title="Assigned Volunteers"
              value="12 Volunteers"
              subtext="Ward 01 to 06"
              trend="+2 added today"
              trendPositive={true}
              icon={<Users className="w-5 h-5" />}
              color="cyan"
              onClick={() => navigate('/volunteers')}
            />
            <StatCard
              title="Assigned Tasks"
              value={`${tasks.length} Duties`}
              subtext={`${pendingTasksCount} Pending`}
              trend={`${completedTasksCount} Completed`}
              trendPositive={true}
              icon={<CheckSquare className="w-5 h-5" />}
              color="purple"
              onClick={() => navigate('/tasks')}
            />
            <StatCard
              title="Field Submissions"
              value={`${activities.length} Logs`}
              subtext="With Photo Proof"
              trend="Real-time Verified"
              trendPositive={true}
              icon={<Activity className="w-5 h-5" />}
              color="mint"
              onClick={() => navigate('/field-activities')}
            />
            <StatCard
              title="WhatsApp Broadcast"
              value={`${audienceSplit.whatsappPercent}%`}
              subtext={`${audienceSplit.whatsapp} Electors Reached`}
              trend="DLT SMS Backup Ready"
              trendPositive={true}
              icon={<MessageSquare className="w-5 h-5" />}
              color="amber"
              onClick={() => navigate('/broadcast')}
            />
          </>
        ) : (
          <>
            <StatCard
              title="My Assigned Tasks"
              value={`${tasks.length} Assigned`}
              subtext="Ward 02 Patel Basti"
              trend={`${pendingTasksCount} Remaining`}
              trendPositive={false}
              icon={<CheckSquare className="w-5 h-5" />}
              color="purple"
              onClick={() => navigate('/tasks')}
            />
            <StatCard
              title="Slips Distributed"
              value="540 Handed"
              subtext="Ward 02 Target: 620"
              trend="87% Booth Coverage"
              trendPositive={true}
              icon={<UserCheck className="w-5 h-5" />}
              color="mint"
              onClick={() => navigate('/volunteer-ward')}
            />
            <StatCard
              title="Voters Contacted"
              value="320 Calls/Visits"
              subtext="100% Consent Verified"
              trend="+45 Today"
              trendPositive={true}
              icon={<Activity className="w-5 h-5" />}
              color="cyan"
              onClick={() => navigate('/field-activities')}
            />
            <StatCard
              title="Daily Attendance"
              value="Checked-In"
              subtext="08:45 AM at Ward Desk"
              trend="Present & On-Duty"
              trendPositive={true}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
              onClick={() => navigate('/field-activities')}
            />
          </>
        )}
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
                max="95"
                value={turnoutTarget}
                onChange={(e) => handleTurnoutChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>50% (Normal)</span>
                <span>75% (Target)</span>
                <span>95% (Record Surge)</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Projected Winning Margin</div>
                <div className="text-lg font-extrabold text-emerald-400 font-heading">
                  +{projectedMargin} Votes Lead
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/broadcast')}
                className="text-xs"
              >
                Trigger Mobilization SMS
              </Button>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Candidate Showcase & Activity Stream */}
        <div className="space-y-6">
          {/* Active Candidates List */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Active Candidates
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-sky-600 hover:text-sky-700 p-0"
                onClick={() => navigate('/candidates')}
              >
                View All →
              </Button>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all flex items-center gap-3"
                >
                  <img
                    src={cand.photo}
                    alt={cand.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                        {cand.name}
                      </h4>
                      <span className="text-base shrink-0" title={cand.symbolName}>
                        {cand.symbol}
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-600 font-bold truncate">
                      {cand.post}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {cand.constituency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Real-Time Ground Activity Stream */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Ground Activity Stream
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-sky-600 hover:text-sky-700 p-0"
                onClick={() => navigate('/field-activities')}
              >
                All Activities →
              </Button>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 3).map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {act.volunteerName} ({act.activityType})
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {act.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium flex items-center justify-between">
                      <span>{act.location}</span>
                      <span>{act.dateTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
