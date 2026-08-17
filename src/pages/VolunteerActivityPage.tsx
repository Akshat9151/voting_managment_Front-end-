import React from 'react';
import { Activity, CheckCircle2, PhoneCall, Home, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const VolunteerActivityPage: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Electors Added', val: '45', sub: 'Ward 02 Roll', icon: <Users className="w-5 h-5" />, color: 'mint' as const },
    { title: 'Calls Made', val: '128', sub: 'Verified Contacts', icon: <PhoneCall className="w-5 h-5" />, color: 'cyan' as const },
    { title: 'Door Visits', val: '84', sub: 'Patel Basti', icon: <Home className="w-5 h-5" />, color: 'purple' as const },
    { title: 'Slips Handed', val: '185', sub: 'Panna Deliveries', icon: <CheckCircle2 className="w-5 h-5" />, color: 'amber' as const }
  ];

  const recentTimeline = [
    { title: 'Marked visited & handed slip to Vikram Jat', time: '10m ago' },
    { title: 'Added new voter: Radheshyam Patel (House #45)', time: '45m ago' },
    { title: 'Called Kamla Devi Gurjar - Confirmed voting support', time: '2h ago' },
    { title: 'Completed Panna check for Booth 02', time: '4h ago' }
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
          <span>Today's Field Activity Stream</span>
        </h3>

        <div className="space-y-3">
          {recentTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">{item.title}</span>
              </div>
              <span className="text-slate-400 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
