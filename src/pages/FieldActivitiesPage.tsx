import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FieldActivity, AttendanceRecord, ActivityType } from '../types';

export const FieldActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'activities' | 'attendance'>('activities');
  const [activities, setActivities] = useState<FieldActivity[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Activity Form State
  const [activityType, setActivityType] = useState<ActivityType>('Door-to-Door');
  const [location, setLocation] = useState('Patel Basti, Ward 02');
  const [description, setDescription] = useState('');
  const [votersContacted, setVotersContacted] = useState(25);
  const [slipsDistributed, setSlipsDistributed] = useState(25);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&auto=format&fit=crop&q=80');

  const loadData = async () => {
    const [acts, atts] = await Promise.all([
      api.getFieldActivities(),
      api.getAttendance()
    ]);
    setActivities(acts);
    setAttendanceList(atts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogAttendance = async () => {
    const volName = user?.name || 'Kailash Saini';
    const ward = user?.ward || 'Ward 02 – Patel Basti';
    await api.logAttendance(user?.id || 'vol_01', volName, ward, 'Ward 02 Main Field Booth');
    showToast('Daily field check-in recorded successfully!', 'success');
    loadData();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe field activity', 'info');
      return;
    }
    await api.addFieldActivity({
      volunteerId: user?.id || 'vol_01',
      volunteerName: user?.name || 'Kailash Saini (Volunteer)',
      ward: user?.ward || 'Ward 02',
      boothNo: 'Booth 01',
      activityType,
      location,
      description,
      photoUrl,
      votersContacted,
      slipsDistributed
    });
    showToast('Field activity report submitted with photo evidence!', 'success');
    setIsSubmitModalOpen(false);
    setDescription('');
    loadData();
  };

  const totalVotersContacted = activities.reduce((acc, a) => acc + (a.votersContacted || 0), 0);
  const totalSlipsHanded = activities.reduce((acc, a) => acc + (a.slipsDistributed || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              Field Activity & Attendance Monitoring
            </h1>
            <Badge variant="mint" size="sm">
              Section 7.7
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time field activity submissions with photo evidence, GPS locations, and daily volunteer check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogAttendance}
            leftIcon={<UserCheck className="w-4 h-4 text-emerald-600" />}
          >
            Mark Daily Check-In
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsSubmitModalOpen(true)}
            leftIcon={<Camera className="w-4 h-4" />}
          >
            Submit Field Activity
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Submissions</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{activities.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Voters Contacted</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{totalVotersContacted}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">Slips Handed</div>
            <div className="text-2xl font-extrabold text-violet-600 mt-1">{totalSlipsHanded}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Volunteers On Duty</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{attendanceList.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'activities'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" /> Field Activity Stream ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Daily Attendance Log ({attendanceList.length})
        </button>
      </div>

      {/* Tab 1: Activities Grid */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => (
            <Card key={act.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              {act.photoUrl && (
                <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={act.photoUrl}
                    alt={act.activityType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                      {act.status} ✓
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/70 text-white backdrop-blur-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> {act.location}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 uppercase">
                      {act.activityType}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{act.dateTime}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-sm text-slate-900 mb-1">
                    {act.volunteerName}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {act.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-slate-400">Voters Met</div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{act.votersContacted}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-slate-400">Slips Handed</div>
                    <div className="font-extrabold text-sky-600 text-sm mt-0.5">{act.slipsDistributed}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Attendance Table */}
      {activeTab === 'attendance' && (
        <Card className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                <th className="pb-3 px-3">Volunteer Name</th>
                <th className="pb-3 px-3">Assigned Ward</th>
                <th className="pb-3 px-3">Check-In Time</th>
                <th className="pb-3 px-3">Location / Field Point</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {attendanceList.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {att.volunteerName[0]}
                    </div>
                    {att.volunteerName}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{att.ward}</td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{att.checkInTime}</td>
                  <td className="py-3 px-3 text-slate-600">{att.location}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Submit Activity Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-1">
              Submit Field Activity Report
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Record ground progress with photos, elector reach count, and location tag.
            </p>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Activity Type *</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="Door-to-Door">Door-to-Door</option>
                    <option value="Panna Slip Handover">Panna Slip Handover</option>
                    <option value="Corner Meeting">Corner Meeting</option>
                    <option value="Poster Pasting">Poster Pasting</option>
                    <option value="Voter Verification">Voter Verification</option>
                    <option value="Rally Coordination">Rally Coordination</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Ward *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key topics discussed, feedback from villagers, voter response..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Voters Contacted</label>
                  <input
                    type="number"
                    value={votersContacted}
                    onChange={(e) => setVotersContacted(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slips Distributed</label>
                  <input
                    type="number"
                    value={slipsDistributed}
                    onChange={(e) => setSlipsDistributed(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Evidence URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
