import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, PhoneCall, Home, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { volunteerVotersApi } from '../services/api';
import { VolunteerVoter } from '../types';

export const VolunteerActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState<VolunteerVoter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await volunteerVotersApi.list();
        setVoters(data);
      } catch {
        setVoters([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const electorsAdded = voters.length;
  const callsMade = voters.filter(v => v.status === 'Called').length;
  const doorVisits = voters.filter(v => v.status === 'Visited').length;
  const slipsHanded = voters.filter(v => v.slipHanded).length;

  const metrics = [
    { title: 'Electors Added', val: electorsAdded.toString(), sub: 'Ward 02 Roll', icon: <Users className="w-5 h-5" />, color: 'mint' as const },
    { title: 'Calls Made', val: callsMade.toString(), sub: 'Verified Contacts', icon: <PhoneCall className="w-5 h-5" />, color: 'cyan' as const },
    { title: 'Door Visits', val: doorVisits.toString(), sub: 'Patel Basti', icon: <Home className="w-5 h-5" />, color: 'purple' as const },
    { title: 'Slips Handed', val: slipsHanded.toString(), sub: 'Panna Deliveries', icon: <CheckCircle2 className="w-5 h-5" />, color: 'amber' as const }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            My Field Activity Record
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Field performance report for <strong>Kailash Saini (Ward 02)</strong>
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate('/volunteer-ward')}
        >
          Return to Ward Desk
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <StatCard
            key={m.title}
            title={m.title}
            value={m.val}
            subtext={m.sub}
            icon={m.icon}
            color={m.color}
          />
        ))}
      </div>

      {/* Recent Field Timeline */}
      <Card className="space-y-4">
        <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Field Canvassing Activity Stream</span>
        </h3>

        <div className="space-y-3">
          {voters.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-xs text-slate-500">No field activity logged yet.</div>
          ) : (
            voters.slice(0, 6).map((voter) => (
              <div key={voter.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${voter.status === 'Visited' ? 'text-emerald-600' : voter.status === 'Called' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-800">
                    {voter.name} ({voter.house || 'Ward 02'}) — Status: {voter.status}
                    {voter.slipHanded ? ' • Slip Delivered' : ''}
                  </span>
                </div>
                <span className="text-slate-400 font-medium">Recorded</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
export default VolunteerActivityPage;
