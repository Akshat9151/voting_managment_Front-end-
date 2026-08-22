import React, { useEffect, useMemo, useState } from 'react';
import { analyticsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  Users,
  UserCheck,
  Megaphone,
  Palette,
  Plus,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ListChecks
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { currentRole } = useAuth();
  const { activeElectionId } = useElection();
  const { showToast } = useToast();

  const [dashData, setDashData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (currentRole !== 'SUPER_ADMIN' && !activeElectionId) return;

      setIsLoading(true);
      try {
        let data: any;
        if (currentRole === 'SUPER_ADMIN') {
          data = await analyticsApi.getDashboardSuperAdmin();
        } else if (currentRole === 'ADMIN' && activeElectionId) {
          data = await analyticsApi.getDashboardAdmin(activeElectionId);
        } else {
          data = await analyticsApi.getDashboardVolunteer();
        }
        setDashData(data || {});
      } catch (err) {
        showToast(t('dashboardLoadError'), 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [activeElectionId, currentRole, showToast, t]);

  const roleSummary = useMemo<any>(() => {
    if (currentRole === 'SUPER_ADMIN') {
      return {
        totalCandidates: Number(dashData?.total_candidates ?? 0),
        totalVotersAdded: Number(dashData?.total_voters ?? 0),
        activeElections: Number(dashData?.active_elections ?? 0),
        recentActivity: (Array.isArray(dashData?.recent_activity) ? dashData.recent_activity : []).slice(0, 5).map((item: any) => ({
          type: item.type ?? item.activity_type ?? item.action ?? 'Activity',
          name: item.name ?? item.title ?? item.actor ?? 'System',
          detail: item.detail ?? item.description ?? 'System update recorded',
          time: item.time ?? item.timestamp ?? (item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')
        }))
      };
    }

    if (currentRole === 'ADMIN') {
      return {
        totalVoters: Number(dashData?.total_voters ?? 0),
        volunteers: Number(dashData?.total_volunteers ?? 0),
        messagesThisWeek: Number(dashData?.messages_sent_this_week ?? 0),
        wardCoverage: Array.isArray(dashData?.ward_coverage) ? dashData.ward_coverage : [],
        quickActions: [
          { label: t('addVoter'), path: '/voters', icon: Plus },
          { label: t('createPoster'), path: '/studio', icon: Palette },
          { label: t('sendBroadcast'), path: '/broadcast', icon: Megaphone },
          { label: t('viewComplaints'), path: '/complaints', icon: AlertCircle }
        ]
      };
    }

    return {
      wardVoters: Number(dashData?.ward_voters ?? 0),
      pendingTasks: Number(dashData?.pending_tasks ?? 0),
      assignedVoters: Array.isArray(dashData?.assigned_voters) ? dashData.assigned_voters : [],
      tasks: Array.isArray(dashData?.task_summary) ? dashData.task_summary : []
    };
  }, [currentRole, dashData, t]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-32 rounded-2xl bg-slate-100" />
      ))}
    </div>
  );

  const renderSuperAdmin = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title={t('totalCandidates')}
          value={roleSummary.totalCandidates.toLocaleString()}
          subtext={t('candidates')}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
          onClick={() => navigate('/candidates')}
        />
        <StatCard
          title={t('totalVotersAdded')}
          value={roleSummary.totalVotersAdded.toLocaleString()}
          subtext={t('liveVoterDatabase')}
          icon={<UserCheck className="w-5 h-5" />}
          color="mint"
          onClick={() => navigate('/voters')}
        />
        <StatCard
          title={t('activeElections')}
          value={roleSummary.activeElections.toString()}
          subtext={t('electionPortfolio')}
          icon={<BarChart3 className="w-5 h-5" />}
          color="purple"
          onClick={() => navigate('/analytics')}
        />
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{t('recentActivity')}</h2>
            <p className="text-xs text-slate-500">{t('latestUpdates')}</p>
          </div>
          <span className="text-[11px] font-bold text-slate-500">{t('last5Updates')}</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-bold">{t('type')}</th>
                <th className="px-4 py-3 font-bold">{t('name')}</th>
                <th className="px-4 py-3 font-bold">{t('details')}</th>
                <th className="px-4 py-3 font-bold">{t('time')}</th>
              </tr>
            </thead>
            <tbody>
              {roleSummary.recentActivity.map((item: any, index: number) => (
                <tr key={`${item.type}-${index}`} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-700">{item.type}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.detail}</td>
                  <td className="px-4 py-3 text-slate-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title={t('totalVotersInElection')}
          value={roleSummary.totalVoters.toLocaleString()}
          subtext={t('currentElection')}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
          onClick={() => navigate('/voters')}
        />
        <StatCard
          title={t('volunteersCount')}
          value={roleSummary.volunteers.toString()}
          subtext={t('activeVolunteers')}
          icon={<UserCheck className="w-5 h-5" />}
          color="purple"
          onClick={() => navigate('/volunteers')}
        />
        <StatCard
          title={t('messagesSentThisWeek')}
          value={roleSummary.messagesThisWeek.toString()}
          subtext={t('campaignReach')}
          icon={<Megaphone className="w-5 h-5" />}
          color="mint"
          onClick={() => navigate('/broadcast')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('wardCoverage')}</h2>
              <p className="text-xs text-slate-500">{t('coverageSummary')}</p>
            </div>
          </div>

          <div className="space-y-3">
            {roleSummary.wardCoverage.map((ward: any) => (
              <div key={ward.label}>
                <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{ward.label}</span>
                  <span>{ward.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                    style={{ width: `${ward.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('quickActions')}</h2>
              <p className="text-xs text-slate-500">{t('dailyChecklist')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {roleSummary.quickActions.map((action: any) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="secondary"
                  className="justify-start px-4 py-3 h-auto border-slate-200 bg-white hover:bg-sky-50 text-left"
                  onClick={() => navigate(action.path)}
                  leftIcon={<Icon className="w-4 h-4 text-sky-600" />}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderVolunteer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title={t('wardVotersCount')}
          value={roleSummary.wardVoters.toLocaleString()}
          subtext={t('wardCoverageSummary')}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title={t('pendingTasks')}
          value={roleSummary.pendingTasks.toString()}
          subtext={t('todayChecklist')}
          icon={<ListChecks className="w-5 h-5" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('taskSummary')}</h2>
              <p className="text-xs text-slate-500">{t('todayChecklist')}</p>
            </div>
          </div>

          <div className="space-y-3">
            {roleSummary.tasks.map((task: any) => (
              <div key={task.title} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{task.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('assignedVoters')}</h2>
              <p className="text-xs text-slate-500">{t('assignedVoterSummary')}</p>
            </div>
          </div>

          <div className="space-y-2">
            {roleSummary.assignedVoters.map((voter: any, index: number) => (
              <div key={`${voter.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                <div>
                  <div className="text-sm font-bold text-slate-800">{voter.name}</div>
                  <div className="text-xs text-slate-500">{voter.ward}</div>
                </div>
                <span className="text-[11px] font-bold rounded-full bg-slate-100 px-2 py-1 text-slate-700">{voter.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const emptyDashboard = !dashData && !isLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 pb-2 border-b border-slate-200/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{t('dashboardOverview')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dashboardOverview')}
          </p>
        </div>
      </div>

      {isLoading ? renderSkeleton() : emptyDashboard ? (
        <EmptyState
          icon={BarChart3}
          title={t('emptyAnalyticsTitle')}
          description={t('emptyAnalyticsDesc')}
        />
      ) : (
        <>
          {currentRole === 'SUPER_ADMIN' && renderSuperAdmin()}
          {currentRole === 'ADMIN' && renderAdmin()}
          {currentRole === 'VOLUNTEER' && renderVolunteer()}
        </>
      )}
    </div>
  );
};
