import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FormInput } from '../components/ui/FormInput';
import { TransliteratingNameInput } from '../components/ui/TransliteratingNameInput';
import { TransliteratingTextInput } from '../components/ui/TransliteratingTextInput';
import { FileDropzone } from '../components/ui/FileDropzone';

export const VolunteerAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { activeElectionId } = useElection();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [age, setAge] = useState(35);
  const [mobile, setMobile] = useState('');
  const [house, setHouse] = useState('');
  const [slipHanded, setSlipHanded] = useState(false);
  const [pendingImportJobId, setPendingImportJobId] = useState<string | null>(null);
  const [isCancellingImport, setIsCancellingImport] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!activeElectionId) { showToast(t('selectActiveElectionBeforeAdding'), 'error'); return; }
    try {
      const preview = await api.uploadVolunteerVoters(activeElectionId, file);
      setPendingImportJobId(preview.job_id);
      showToast(`Preview ready: ${preview.valid_count ?? 0} valid voters found.`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || err?.response?.data?.message || 'Upload failed', 'error');
    }
  };

  const confirmImport = async () => {
    if (!pendingImportJobId) return;
    try {
      const report = await api.confirmVolunteerVoterImport(pendingImportJobId);
      setPendingImportJobId(null);
      showToast(`${report.successfully_imported ?? 0} voters imported successfully.`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Import confirmation failed', 'error');
    }
  };

  const cancelImport = async () => {
    if (!pendingImportJobId) return;
    setIsCancellingImport(true);
    try { await api.cancelVolunteerVoterImport(pendingImportJobId); setPendingImportJobId(null); showToast('Import cancelled', 'info'); }
    catch (err: any) { showToast(err?.response?.data?.detail || 'Cancel failed', 'error'); }
    finally { setIsCancellingImport(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter elector name', 'error');
      return;
    }
    if (!ward.trim()) {
      showToast('Please enter ward/area name', 'error');
      return;
    }
    if (!isAuthenticated || !activeElectionId) {
      showToast(t('selectActiveElectionBeforeAdding'), 'error');
      return;
    }

    let createdVoter: any = null;
    try {
      createdVoter = await api.addVoter({
          election_id: activeElectionId,
          first_name: name.trim(),
          last_name: '',
          age,
          gender: 'Male',
          ward_name: ward.trim(),
          phone_number: mobile.trim() || null,
          house_number: house.trim() || null,
          status: 'Valid',
          source: 'Volunteer Entry',
        });
      try {
        await api.addVolunteerVoter({
          name: name.trim(),
          age,
          mobile: mobile.trim(),
          house: house.trim(),
          status: 'Pending',
          slipHanded,
        });
      } catch (error) {
        if (createdVoter?.id) await api.deleteVoter(createdVoter.id).catch(() => undefined);
        throw error;
      }
      showToast(`Elector ${name.trim()} logged into ${ward.trim()}!`, 'success');
      navigate('/volunteer-ward');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || t('errorSavingData'), 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/volunteer-ward')}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold font-heading text-slate-900">Quick Elector Entry</h1>
          <p className="text-xs text-slate-500">Enter the ward/area for this elector</p>
        </div>
      </div>

      <Card className="p-6">
        <FileDropzone onFileSelect={handleFileUpload} accept=".csv,.pdf,.xlsx,.xls" title="Upload voter roll PDF or CSV" subtitle="Review the import before adding voters" />
        {pendingImportJobId && <div className="my-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm"><span className="font-semibold text-amber-900">Import preview ready</span><span className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={cancelImport} disabled={isCancellingImport}>Cancel</Button><Button type="button" size="sm" variant="primary" onClick={confirmImport}>Confirm Import</Button></span></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TransliteratingNameInput
            label="Elector Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TransliteratingTextInput
            label="Ward / Area Name"
            placeholder="e.g. Ward 02, Patel Basti"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Age (Years)"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
            <FormInput
              label="House / Mohalla Address"
              placeholder="e.g. House #45, Patel Chowk"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
            />
          </div>

          <FormInput
            label="Mobile Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer min-h-[48px]">
            <input
              type="checkbox"
              checked={slipHanded}
              onChange={(e) => setSlipHanded(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Panna voting slip handed over during this visit</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => navigate('/volunteer-ward')}>
              Cancel
            </Button>
            <Button type="submit" variant="success" size="lg" className="flex-1">
              Commit Entry
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
