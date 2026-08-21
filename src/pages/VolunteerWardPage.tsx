import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Phone, CheckSquare, Square, UserPlus, Activity, PhoneCall, Home, AlertOctagon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { VolunteerVoter, VolunteerVoterStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';

import { FileDropzone } from '../components/ui/FileDropzone';
export const VolunteerWardPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { activeElectionId } = useElection();

  const [voters, setVoters] = useState<VolunteerVoter[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'visited'>('all');
    const [pendingImportJobId, setPendingImportJobId] = useState<string | null>(null);
    const [isCancellingImport, setIsCancellingImport] = useState(false);

  useEffect(() => {
    loadWardVoters();
  }, []);

  const loadWardVoters = async () => {
    const data = await api.getVolunteerVoters();
    setVoters(data);
  };

  const handleFileUpload = async (file: File) => {
      try {
        if (!activeElectionId) { showToast('Select an active election first', 'error'); return; }
        const preview = await api.uploadVolunteerVoters(activeElectionId, file);
        setPendingImportJobId(preview.job_id);
        showToast(`Preview ready: ${preview.valid_count ?? 0} valid voters found. Confirm to add them.`, 'success');
      } catch (err: any) {
        showToast(err?.response?.data?.error?.message || err?.response?.data?.message || err?.response?.data?.detail || 'Upload failed', 'error');
      }
  };

  const handleConfirmImport = async () => {
      if (!pendingImportJobId) return;
      try {
        const report = await api.confirmVolunteerVoterImport(pendingImportJobId);
        setPendingImportJobId(null);
        showToast(`${report.successfully_imported ?? 0} voters imported successfully.`, 'success');
        await loadWardVoters();
      } catch (err: any) {
        showToast(err?.response?.data?.message || 'Import confirmation failed', 'error');
      }
  };

  const handleCancelImport = async () => {
      if (!pendingImportJobId) return;
      setIsCancellingImport(true);
      try {
        await api.cancelVolunteerVoterImport(pendingImportJobId);
        setPendingImportJobId(null);
        showToast('Import cancelled', 'info');
      } catch (err: any) {
        showToast(err?.response?.data?.message || err?.response?.data?.detail || 'Cancel failed', 'error');
      } finally {
        setIsCancellingImport(false);
      }
  };

  const handleUpdateStatus = async (id: string, newStatus: VolunteerVoterStatus) => {
    await api.updateVolunteerVoterStatus(id, newStatus);
    showToast(`Voter status marked as "${newStatus}"!`, 'info');
    loadWardVoters();
  };

  const handleToggleSlip = async (id: string, current: boolean) => {
    await api.updateVolunteerVoterStatus(id, voters.find(v => v.id === id)?.status || 'Pending', !current);
    showToast(!current ? 'Voter slip handed over!' : 'Slip marked pending', 'success');
    loadWardVoters();
  };

  const filtered = voters.filter(v => {
    if (filter === 'pending') return v.status === 'Pending' || v.status === 'Not Reachable';
    if (filter === 'visited') return v.status === 'Visited';
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Volunteer Desk Hero Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
            Dedicated Field Volunteer Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
            Ward 02 – Patel Basti
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Field Worker: <strong>Kailash Saini</strong> • Assigned Booth: <strong>Booth 02 (Community Hall)</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/volunteer-add')}
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-emerald-700" />}
          >
            + Add Elector
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-white border-white/40 hover:bg-white/10"
            onClick={() => navigate('/volunteer-activity')}
            leftIcon={<Activity className="w-3.5 h-3.5" />}
          >
            My Activity
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
        {/* File Dropzone for Bulk Voter Upload */}
        <FileDropzone
          onFileSelect={handleFileUpload}
          accept=".csv,.xlsx,.xls"
          title="Upload voter CSV/Excel file (bulk import)"
          subtitle="Accepted formats: CSV, Excel (.xlsx, .xls)"
        />

        {pendingImportJobId && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
            <span className="font-semibold text-amber-900">Voter import preview ready. Confirm to proceed?</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelImport} disabled={isCancellingImport}>
                {isCancellingImport ? 'Cancelling...' : 'Cancel'}
              </Button>
              <Button size="sm" variant="primary" onClick={handleConfirmImport}>
                Confirm Import
              </Button>
            </div>
          </div>
        )}

      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'all', label: `All Elector Cards (${voters.length})` },
          { id: 'pending', label: '⏳ Pending Visits' },
          { id: 'visited', label: '✅ Visited & Verified' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-full font-bold transition-all cursor-pointer min-h-[40px] ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Touch-Friendly Voter Card List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => {
          const isVisited = v.status === 'Visited';
          const isCalled = v.status === 'Called';
          const isNotReachable = v.status === 'Not Reachable';

          return (
            <Card key={v.id} className="flex flex-col justify-between space-y-3 p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                      {v.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {v.age} Yrs • {v.house}
                    </div>
                  </div>
                  <Badge variant={isVisited ? 'mint' : isCalled ? 'cyan' : isNotReachable ? 'rose' : 'slate'} size="sm">
                    {v.status}
                  </Badge>
                </div>

                <a
                  href={`tel:${v.mobile}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline min-h-[36px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{v.mobile}</span>
                </a>
              </div>

              {/* One-Tap Action Buttons Row (Min 44px Touch Target) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(v.id, 'Called')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1 active:scale-95 ${
                      isCalled ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    <PhoneCall className="w-3 h-3" /> Called
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(v.id, 'Visited')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1 active:scale-95 ${
                      isVisited ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <Home className="w-3 h-3" /> Visited
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(v.id, 'Not Reachable')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1 active:scale-95 ${
                      isNotReachable ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <AlertOctagon className="w-3 h-3" /> Unreached
                  </button>
                </div>

                {/* Voter Slip Checkbox */}
                <button
                  onClick={() => handleToggleSlip(v.id, v.slipHanded)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer min-h-[44px] active:scale-98"
                >
                  <span>Panna Voter Slip Handed</span>
                  {v.slipHanded ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckSquare className="w-4 h-4 text-emerald-600" /> Done
                    </span>
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
