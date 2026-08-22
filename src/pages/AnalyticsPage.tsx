import React, { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/api';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { BarChart3, Download, PieChart, TrendingUp, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(async () => {
    if (!activeElectionId) return;
    setIsLoading(true);
    try {
      const data = await analyticsApi.getTurnout(activeElectionId);
      setAnalytics(data);
    } catch {
      showToast(t('failedLoadingAnalytics'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeElectionId]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const handleExportReport = () => {
    const reportContent = `VOTEVICTORY (वोट विजय) CAMPAIGN ANALYTICS REPORT\nGenerated on: ${new Date().toLocaleString()}\n\nElection: ${activeElectionId}\n\nTurnout Data:\n${JSON.stringify(analytics, null, 2)}`;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VoteVictory_Analytics_${Date.now()}.txt`;
    link.click();
    showToast(t('analyticsReportExported'), 'info');
  };

  if (isLoading) return <div className="p-6 text-xs text-slate-400 flex items-center gap-2"><span className="w-4 h-4 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" /> Loading analytics engine...</div>;

  const hasAnalyticsData = !!analytics && (Array.isArray(analytics.wardCoverage) || Array.isArray(analytics.channelDelivery) || Array.isArray(analytics.materialPrints) || Array.isArray(analytics.volunteerProductivity));
  if (!hasAnalyticsData) return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">{t('turnoutAnalytics')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('analyticsDesc')}</p>
        </div>
      </div>
      <EmptyState
        icon={BarChart3}
        title={t('emptyAnalyticsTitle')}
        description={t('emptyAnalyticsDesc')}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('turnoutAnalytics')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voter turnout predictions, booth-wise coverage analysis, and demographic insights.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportReport}
          leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
        >
          Export War Room Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Ward-Wise Voter Roll Reach %</span>
            </h3>
            <Badge variant="cyan">86% Average</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.wardCoverage.map((item: any) => (
              <div key={item.ward} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.ward}</span>
                  <span className="text-sky-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Broadcast Delivery Channel Split</span>
            </h3>
            <Badge variant="mint">3,500 Total</Badge>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
            {analytics.channelDelivery.map((ch: any) => (
              <div key={ch.channel} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-xs font-bold text-slate-800">{ch.channel}</span>
                </div>
                <span className="text-xs font-extrabold font-mono text-slate-900">
                  {ch.count.toLocaleString()} ({Math.round((ch.count / 3500) * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Automatic fallback ensures 100% penetration across button phones and rural electors.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Design Studio Material Production</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {analytics.materialPrints.map((mat: any) => (
              <div key={mat.type} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-lg font-extrabold font-heading text-sky-600">
                  {mat.count.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{mat.type}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span>Volunteer Slip Distribution Leaderboard</span>
          </h3>

          <div className="space-y-2">
            {analytics.volunteerProductivity.map((vol: any) => (
              <div key={vol.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-900">{vol.name}</span>
                <div className="flex gap-3">
                  <span className="text-emerald-700 font-bold">{vol.slips} Slips Handed</span>
                  <span className="text-sky-700 font-bold">{vol.calls} Calls</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
