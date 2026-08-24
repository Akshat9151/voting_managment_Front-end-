import React, { useState, useEffect, useCallback } from 'react';
import { votersApi } from '../services/api';
import { useElection } from '../context/ElectionContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Contact2, Search, Download, Phone,
  MessageCircle, Smartphone, Plus, Trash2, Pencil
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Voter } from '../types';
import { TransliteratingNameInput } from '../components/ui/TransliteratingNameInput';
import { TransliteratingTextInput } from '../components/ui/TransliteratingTextInput';

export const VotersPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();

  const [voters, setVoters] = useState<Voter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImportJobId, setPendingImportJobId] = useState<string | null>(null);
  const [selectedVoterIds, setSelectedVoterIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isCancellingImport, setIsCancellingImport] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'whatsapp' | 'no-whatsapp' | 'youth' | 'women' | 'missing'>('all');
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS Only'>('WhatsApp');

  // Modals
  const [isAddVoterModalOpen, setIsAddVoterModalOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [wardError, setWardError] = useState('');

  // Manual Add Form
  const [voterId, setVoterId] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [ward, setWard] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [fatherOrSpouseName, setFatherOrSpouseName] = useState('');
  const [notes, setNotes] = useState('');

  const splitName = (value: string) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    return { first_name: parts[0] || '', last_name: parts.slice(1).join(' ') };
  };

  const resetVoterForm = () => {
    setName(''); setVoterId(''); setMobile(''); setWard(''); setEmail('');
    setAddress(''); setHouseNumber(''); setFatherOrSpouseName(''); setNotes('');
    setAge(30); setGender('Male'); setChannel('WhatsApp'); setWardError('');
  };

  const openEditVoter = (voter: Voter) => {
    setEditingVoter(voter);
    setName(voter.name ?? `${voter.first_name ?? ''} ${voter.last_name ?? ''}`.trim());
    setVoterId(voter.voter_id_number ?? voter.id);
    setAge(voter.age ?? 30);
    setGender((voter.gender as 'Male' | 'Female' | 'Other') ?? 'Male');
    setWard(voter.ward_name ?? voter.ward ?? '');
    setMobile(voter.phone_number ?? voter.mobile ?? '');
    setEmail(voter.email ?? ''); setAddress(voter.address ?? '');
    setHouseNumber(voter.house_number ?? '');
    setFatherOrSpouseName(voter.father_or_spouse_name ?? ''); setNotes(voter.notes ?? '');
    setChannel((voter.channel as 'WhatsApp' | 'SMS Only') ?? 'WhatsApp'); setWardError('');
  };

  const loadVoters = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items } = await votersApi.list(activeElectionId ?? undefined, { search: searchQuery || undefined });
      // Normalize: add computed `name` field
      setVoters(items.map((v: any) => ({
        ...v,
        name: v.name ?? `${v.first_name ?? ''} ${v.last_name ?? ''}`.trim(),
        ward: v.ward_name ?? v.ward ?? '',
        mobile: v.phone_number ?? v.mobile ?? '',
        channel: v.channel ?? (v.phone_number ? 'WhatsApp' : 'SMS Only'),
        consent: v.status ?? 'Verified',
        status: v.status ?? 'Valid'
      })));
    } catch {
      showToast(t('failedLoadingVoters'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeElectionId, searchQuery]);

  useEffect(() => {
    loadVoters();
  }, [loadVoters]);

  useEffect(() => {
    setSelectedVoterIds(new Set());
  }, [segmentFilter, searchQuery, activeElectionId]);

  const handleFileUpload = async (file: File) => {
    if (!activeElectionId) { showToast(t('noActiveElectionSelected'), 'error'); return; }
    try {
      const preview = await votersApi.uploadBatch(activeElectionId, file);
      setPendingImportJobId(preview.job_id);
      const count = preview.valid_count ?? preview.valid_rows ?? preview.total_rows ?? 0;
      showToast(`Preview ready: ${count} valid rows found. Confirm the import to add them.`, 'success');
    } catch (err: any) {
      showToast(
        err?.response?.data?.error?.message
          || err?.response?.data?.message
          || err?.response?.data?.detail
          || 'Upload failed',
        'error'
      );
    } finally {
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingImportJobId) return;
    try {
      const report = await votersApi.confirmImport(pendingImportJobId);
      setPendingImportJobId(null);
      const count = report.successfully_imported ?? report.imported_count ?? report.imported_rows ?? 0;
      showToast(`${count} voters imported successfully.`, 'success');
      await loadVoters();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Import confirmation failed', 'error');
    }
  };

  const handleCancelImport = async () => {
    if (!pendingImportJobId) return;
    setIsCancellingImport(true);
    try {
      await votersApi.cancelImport(pendingImportJobId);
      setPendingImportJobId(null);
      showToast(t('voterImportCancelled'), 'info');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || t('voterImportCancelFailed'), 'error');
    } finally {
      setIsCancellingImport(false);
    }
  };

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElectionId || !name.trim()) return;
    if (!ward.trim()) { setWardError('Ward is required.'); return; }
    const nameParts = splitName(name);
    try {
      await votersApi.create({
        election_id: activeElectionId,
        voter_id_number: voterId || `${Date.now()}`,
        name: name.trim(),
        first_name: nameParts.first_name,
        last_name: nameParts.last_name,
        age,
        gender,
        ward_name: ward.trim(),
        phone_number: mobile.trim() || null,
        email: email.trim() || null, address: address.trim() || null,
        house_number: houseNumber.trim() || null, father_or_spouse_name: fatherOrSpouseName.trim() || null,
        notes: notes.trim() || null, channel,
      });
      showToast(`${t('voterAddedSuccess')}`, 'success');
      setIsAddVoterModalOpen(false);
      resetVoterForm();
      await loadVoters();
    } catch (err: any) {
      showToast(err?.response?.data?.message || t('errorSavingData'), 'error');
    }
  };

  const handleUpdateVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoter || !name.trim()) return;
    if (!ward.trim()) { setWardError('Ward is required.'); return; }
    const nameParts = splitName(name);
    try {
      await votersApi.update(editingVoter.id, {
        name: name.trim(), first_name: nameParts.first_name, last_name: nameParts.last_name,
        age, gender, ward_name: ward.trim(), phone_number: mobile.trim() || null,
        email: email.trim() || null, address: address.trim() || null,
        house_number: houseNumber.trim() || null, father_or_spouse_name: fatherOrSpouseName.trim() || null,
        notes: notes.trim() || null, channel,
      });
      showToast('Voter updated successfully.', 'success');
      setEditingVoter(null); resetVoterForm(); await loadVoters();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || 'Unable to update voter.', 'error');
    }
  };

  const handleDeleteVoter = async (voter: Voter) => {
    const displayName = voter.name ?? `${voter.first_name ?? ''} ${voter.last_name ?? ''}`.trim();
    if (!window.confirm(`Delete ${displayName || 'this voter'} from the database?`)) return;

    try {
      await votersApi.delete(voter.id);
      showToast('Voter deleted successfully.', 'success');
      await loadVoters();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || 'Unable to delete voter.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    const visibleIdSet = new Set(filteredVoters.map((v) => v.id));
    const ids = Array.from(selectedVoterIds).filter((id) => visibleIdSet.has(id));
    if (ids.length !== selectedVoterIds.size) {
      setSelectedVoterIds(new Set(ids));
    }
    if (!ids.length || !window.confirm(t('bulkDeleteVotersConfirm').replace('{{count}}', String(ids.length)))) return;
    setIsBulkDeleting(true);
    try {
      await votersApi.deleteBulk(ids);
      setSelectedVoterIds(new Set());
      showToast(t('bulkDeleteVotersSuccess'), 'success');
      await loadVoters();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || t('bulkDeleteVotersFailed'), 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleExportCsv = () => {
    const headers = 'ID,Name,Age,Gender,Ward,Mobile,Channel,Consent,Status\n';
    const rows = voters.map(v => `${v.id},"${v.name ?? ''}",${v.age ?? ''},${v.gender ?? ''},${v.ward ?? ''},"${v.mobile ?? ''}",${v.channel ?? ''},${v.consent ?? ''},${v.status ?? ''}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ElectWin_Voter_Database_${Date.now()}.csv`;
    link.click();
    showToast(t('officialVoterListDownloaded'), 'info');
  };

  const filteredVoters = voters.filter(v => {
    const safeName = v.name ?? `${v.first_name ?? ''} ${v.last_name ?? ''}`.trim();
    const safeMobile = v.mobile ?? v.phone_number ?? '';
    const safeWard = v.ward ?? v.ward_name ?? '';
    const safeAge = v.age ?? 0;
    const safeGender = v.gender ?? '';
    const safeChannel = v.channel ?? 'SMS Only';

    if (segmentFilter === 'whatsapp' && safeChannel !== 'WhatsApp') return false;
    if (segmentFilter === 'no-whatsapp' && safeChannel !== 'SMS Only') return false;
    if (segmentFilter === 'youth' && (safeAge < 18 || safeAge > 25)) return false;
    if (segmentFilter === 'women' && safeGender !== 'Female') return false;
    if (segmentFilter === 'missing' && safeMobile) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        safeName.toLowerCase().includes(q) ||
        safeMobile.toLowerCase().includes(q) ||
        safeWard.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const visibleIds = filteredVoters.map((v) => v.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedVoterIds.has(id));
  const toggleVoter = (id: string) => setSelectedVoterIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAllVisible = () => setSelectedVoterIds((current) => {
    const next = new Set(current);
    if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
    else visibleIds.forEach((id) => next.add(id));
    return next;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('voterDatabase')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('voterDatabaseDesc')}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : t('exportCsv')}
          </Button>
          {selectedVoterIds.size > 0 && (
            <Button size="sm" variant="danger" onClick={handleBulkDelete} disabled={isBulkDeleting} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              {isBulkDeleting ? t('bulkDeleteVotersLoading') : t('bulkDeleteVoters').replace('{{count}}', String(selectedVoterIds.size))}
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddVoterModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            disabled={isLoading}
          >
            + {t('addVoterManually')}
          </Button>
        </div>
      </div>

      {/* File Dropzone Quick Upload */}
      <FileDropzone
        onFileSelect={handleFileUpload}
        accept=".csv,.pdf,.xlsx,.xls"
        title="Upload official voter roll PDF or CSV"
        subtitle="PDF rows are extracted into a preview before import"
      />
      {pendingImportJobId && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <span className="font-semibold text-amber-900">{t('voterImportPreviewReady')}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelImport} disabled={isCancellingImport}>{isCancellingImport ? t('voterImportCancelling') : t('cancel')}</Button>
            <Button size="sm" variant="primary" onClick={handleConfirmImport}>{t('confirmImport')}</Button>
          </div>
        </div>
      )}

      {/* Search & Segment Filters */}
      <div className="space-y-3">
        <FormInput
          placeholder={t('searchVoters')}
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: t('filterAllVoters') },
            { id: 'whatsapp', label: `🟢 ${t('filterHasWhatsApp')}` },
            { id: 'no-whatsapp', label: `🔵 ${t('filterNoWhatsApp')}` },
            { id: 'youth', label: `⚡ ${t('filterYouth')}` },
            { id: 'women', label: `🌸 ${t('filterWomen')}` },
            { id: 'missing', label: `⚠️ ${t('filterMissingContact')}` }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSegmentFilter(pill.id as any)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                segmentFilter === pill.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Voter Table & Mobile Cards */}
      {filteredVoters.length > 0 ? (
      <Card className="p-0 overflow-hidden">
        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Sr. No.</th>
                <th className="py-3 px-4"><input type="checkbox" aria-label={t('selectAllVoters')} checked={allVisibleSelected} onChange={toggleAllVisible} /></th>
                <th className="py-3 px-4">EPIC ID</th>
                <th className="py-3 px-4">Elector Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Ward / Booth</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Delivery Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVoters.map((v, index) => {
                const displayName = v.name ?? `${v.first_name ?? ''} ${v.last_name ?? ''}`.trim();
                const displayWard = v.ward ?? v.ward_name ?? '';
                const displayMobile = v.mobile ?? v.phone_number ?? '';
                const displayChannel = v.channel ?? 'SMS Only';
                const displayStatus = v.status ?? 'Valid';

                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4"><input type="checkbox" aria-label={t('selectVoter')} checked={selectedVoterIds.has(v.id)} onChange={() => toggleVoter(v.id)} /></td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">{v.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{displayName}</td>
                    <td className="py-3 px-4 text-slate-600">{v.age ?? 0} Yrs • {v.gender ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{displayWard}</td>
                    <td className="py-3 px-4">
                      {displayMobile ? (
                        <a href={`tel:${displayMobile}`} className="font-bold text-sky-600 hover:underline inline-flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {displayMobile}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No Mobile</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={displayChannel === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">
                        {displayChannel === 'WhatsApp' ? <MessageCircle className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                        <span>{displayChannel}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={displayStatus === 'Valid' ? 'mint' : 'amber'} size="sm">
                        {displayStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditVoter(v)} leftIcon={<Pencil className="w-3.5 h-3.5" />} aria-label={`Edit ${displayName || 'voter'}`} title="Edit voter">Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteVoter(v)} leftIcon={<Trash2 className="w-3.5 h-3.5" />} aria-label={`Delete ${displayName || 'voter'}`} title="Delete voter">Delete</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100 p-2">
          {filteredVoters.map((v) => {
            const displayName = v.name ?? `${v.first_name ?? ''} ${v.last_name ?? ''}`.trim();
            const displayWard = v.ward ?? v.ward_name ?? '';
            const displayMobile = v.mobile ?? v.phone_number ?? '';
            const displayChannel = v.channel ?? 'SMS Only';

            return (
              <div key={v.id} className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <input type="checkbox" aria-label={t('selectVoter')} checked={selectedVoterIds.has(v.id)} onChange={() => toggleVoter(v.id)} />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 font-heading">{displayName}</div>
                    <div className="text-xs text-slate-500 font-mono">{v.id} • {v.age ?? 0} Yrs • {v.gender ?? 'N/A'}</div>
                  </div>
                  <Badge variant={displayChannel === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">
                    {displayChannel}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-medium text-slate-700">{displayWard}</span>
                  {displayMobile ? (
                    <a href={`tel:${displayMobile}`} className="font-bold text-sky-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {displayMobile}
                    </a>
                  ) : (
                    <span className="text-amber-600 font-bold">Missing Mobile</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditVoter(v)} leftIcon={<Pencil className="w-3.5 h-3.5" />} aria-label={`Edit ${displayName || 'voter'}`}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteVoter(v)} leftIcon={<Trash2 className="w-3.5 h-3.5" />} aria-label={`Delete ${displayName || 'voter'}`}>Delete voter</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <Contact2 className="w-12 h-12 mx-auto text-slate-300" />
          <div>
            <h3 className="text-base font-extrabold text-slate-800">{t('emptyVotersTitle')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('emptyVotersDesc')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button variant="primary" onClick={() => setIsAddVoterModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              {t('addVoterManually')}
            </Button>
          </div>
        </Card>
      )}

      {/* Add Elector Modal */}
      <Modal
        isOpen={isAddVoterModalOpen}
        onClose={() => setIsAddVoterModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Contact2 className="w-5 h-5 text-sky-600" />
            <span>{t('addVoterManually')}</span>
          </div>
        }
      >
        <form onSubmit={handleAddVoter} className="space-y-4">
          <TransliteratingNameInput
            label={t('voterDatabase')}
            placeholder="e.g. Rameshwar Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TransliteratingTextInput
              label="Ward Assignment"
              value={ward}
              onChange={(e) => { setWard(e.target.value); setWardError(''); }}
              error={wardError}
              required
            />
            <Select
              label="Primary Channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS Only">SMS Only</option>
            </Select>
          </div>

          <FormInput
            label="Mobile Number (with +91)"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddVoterModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Elector
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editingVoter} onClose={() => { setEditingVoter(null); resetVoterForm(); }} title={<div className="flex items-center gap-2"><Pencil className="w-5 h-5 text-sky-600" /><span>Edit Voter</span></div>}>
        <form onSubmit={handleUpdateVoter} className="space-y-4">
          <FormInput label="EPIC ID" value={voterId} readOnly />
          <TransliteratingNameInput label="Voter Name" placeholder="e.g. Rameshwar Patel" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value as any)}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TransliteratingTextInput label="Ward Assignment" value={ward} onChange={(e) => { setWard(e.target.value); setWardError(''); }} error={wardError} required />
            <Select label="Primary Channel" value={channel} onChange={(e) => setChannel(e.target.value as any)}><option value="WhatsApp">WhatsApp</option><option value="SMS Only">SMS Only</option></Select>
          </div>
          <FormInput label="Mobile Number (with +91)" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          <FormInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput label="House Number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
          <FormInput label="Father / Spouse Name" value={fatherOrSpouseName} onChange={(e) => setFatherOrSpouseName(e.target.value)} />
          <FormInput label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <FormInput label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="flex justify-end gap-2 pt-3"><Button type="button" variant="outline" onClick={() => { setEditingVoter(null); resetVoterForm(); }}>Cancel</Button><Button type="submit" variant="primary">Save Changes</Button></div>
        </form>
      </Modal>
    </div>
  );
};
