import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Plus, Search, Send, Smartphone, Upload, Trash2 } from 'lucide-react';
import { broadcastGroupsApi, votersApi } from '../services/api';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';
import { TransliteratingTextArea } from '../components/ui/TransliteratingTextInput';
import { PhonePreview } from '../components/broadcast/PhonePreview';
import { Voter } from '../types';

type Segment = 'all' | 'whatsapp' | 'no-whatsapp' | 'youth' | 'women' | 'missing';
type Step = 1 | 2 | 3 | 4;

const normalizeVoter = (voter: any): Voter => ({
  ...voter,
  name: `${voter.first_name ?? voter.name ?? ''} ${voter.last_name ?? ''}`.trim(),
  ward: voter.ward_name ?? voter.ward ?? '',
  mobile: voter.phone_number ?? voter.mobile ?? '',
  channel: voter.channel ?? 'SMS Only',
});

export const BroadcastPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();
  const [step, setStep] = useState<Step>(1);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<Segment>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingVoters, setIsDeletingVoters] = useState(false);
  const [pendingImportJobId, setPendingImportJobId] = useState<string | null>(null);
  const [message, setMessage] = useState('à¤ªà¥à¤°à¤¿à¤¯ {{name}} à¤œà¥€,\n\nà¤†à¤ªà¤•à¥‡ à¤µà¤¾à¤°à¥à¤¡ {{ward}} à¤®à¥‡à¤‚ à¤šà¥à¤¨à¤¾à¤µ à¤¸à¤‚à¤¬à¤‚à¤§à¥€ à¤®à¤¹à¤¤à¥à¤µà¤ªà¥‚à¤°à¥à¤£ à¤¸à¥‚à¤šà¤¨à¤¾ à¤¹à¥ˆà¥¤');
  const [group, setGroup] = useState<any | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactWard, setContactWard] = useState('');
  const [contactChannel, setContactChannel] = useState('WhatsApp');

  const loadVoters = async () => {
    setIsLoading(true);
    try {
      const response = await votersApi.list(activeElectionId ?? undefined, { page_size: 100, search: search || undefined });
      setVoters((response.items ?? []).map(normalizeVoter));
    } catch (error: any) {
      showToast(error?.response?.data?.detail || t('failedLoadingVoters'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadVoters(); }, [activeElectionId, search]);
  

  const filteredVoters = useMemo(() => voters.filter((voter: any) => {
    const mobile = voter.mobile ?? voter.phone_number ?? '';
    const channel = voter.channel ?? 'SMS Only';
    const age = Number(voter.age ?? 0);
    const genderLower = String(voter.gender ?? '').toLowerCase();
    if (segment === 'whatsapp' && channel !== 'WhatsApp') return false;
    if (segment === 'no-whatsapp' && channel !== 'SMS Only') return false;
    if (segment === 'youth' && (age < 18 || age > 25)) return false;
    if (segment === 'women' && genderLower !== 'female' && genderLower !== 'f' && genderLower !== 'woman') return false;
    if (segment === 'missing' && mobile) return false;
    return true;
  }), [voters, segment]);

    const loadGroups = async () => {
    try {
      const g = await broadcastGroupsApi.list();
      setGroups(g);
    } catch {
      setGroups([]);
    }
  };

  useEffect(() => {
    if (step === 1) void loadGroups();
  }, [step]);

  const toggleGroup = (id: string) => setSelectedGroupIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const selectVisibleGroups = () => setSelectedGroupIds((current) => {
    const next = new Set(current);
    const visibleIds = groups.map((g) => g.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));
    visibleIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
    return next;
  });

  const allVisibleGroupsSelected = groups.length > 0 && groups.every((saved) => selectedGroupIds.has(saved.id));

  const refreshGroupsAfterDelete = async (deletedIds: string[]) => {
    const refreshedGroups = await broadcastGroupsApi.list();
    const remainingIds = new Set(refreshedGroups.map((saved) => saved.id));
    if (deletedIds.some((id) => remainingIds.has(id))) {
      throw new Error('Deleted broadcast group is still present after refresh.');
    }
    setGroups(refreshedGroups);
  };

  const deleteGroup = async (id: string) => {
    if (!window.confirm(t('confirmDeleteGroup') || 'Are you sure you want to delete this broadcast group? This cannot be undone.')) return;
    try {
      await broadcastGroupsApi.deleteGroup(id);
      await refreshGroupsAfterDelete([id]);
      showToast(t('groupDeleted') || 'Broadcast group deleted successfully.', 'success');
      setSelectedGroupIds(new Set());
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Failed to delete group.', 'error');
    }
  };

  const bulkDeleteGroups = async () => {
    if (!selectedGroupIds.size) return;
    if (!window.confirm(t('confirmBulkDeleteGroup')?.replace('{{count}}', String(selectedGroupIds.size)) || "Are you sure you want to delete ${selectedGroupIds.size} broadcast group(s)? This cannot be undone.")) return;
    try {
      await broadcastGroupsApi.bulkDeleteGroups(Array.from(selectedGroupIds));
      await refreshGroupsAfterDelete(Array.from(selectedGroupIds));
      showToast(t('groupsBulkDeleted')?.replace('{{count}}', String(selectedGroupIds.size)) || "Deleted ${selectedGroupIds.size} broadcast group(s).", 'success');
      setSelectedGroupIds(new Set());
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Failed to delete groups.', 'error');
    }
  };

  const toggle = (id: string) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const selectVisible = () => setSelectedIds((current) => {
    const next = new Set(current);
    const visibleIds = filteredVoters.map((voter) => voter.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));
    visibleIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
    return next;
  });

  const deleteSelectedVoters = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length || !window.confirm(`Delete ${ids.length} selected voter(s) from the database?`)) return;
    setIsDeletingVoters(true);
    try {
      await votersApi.deleteBulk(ids);
      setSelectedIds(new Set());
      showToast(`${ids.length} voter(s) deleted successfully.`, 'success');
      await loadVoters();
    } catch (error: any) {
      showToast(error?.response?.data?.detail || error?.response?.data?.message || 'Unable to delete selected voters.', 'error');
    } finally {
      setIsDeletingVoters(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!activeElectionId) { showToast(t('noActiveElectionSelected'), 'error'); return; }
    try {
      const preview = await votersApi.uploadBatch(activeElectionId, file);
      setPendingImportJobId(preview.job_id);
      showToast(`${preview.valid_count ?? 0} rows ready for review.`, 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.detail || error?.response?.data?.message || 'Upload failed.', 'error');
    }
  };

  const confirmImport = async () => {
    if (!pendingImportJobId) return;
    try {
      const report = await votersApi.confirmImport(pendingImportJobId);
      setPendingImportJobId(null);
      showToast(`${report.successfully_imported ?? 0} voters imported.`, 'success');
      await loadVoters();
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Import confirmation failed.', 'error');
    }
  };

  const addContact = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeElectionId || !contactName.trim() || !contactMobile.trim()) return;
    try {
      await votersApi.create({ election_id: activeElectionId, name: contactName, mobile: contactMobile, phone_number: contactMobile, ward: contactWard, ward_name: contactWard, channel: contactChannel, voter_id_number: `manual-${Date.now()}` });
      setContactName(''); setContactMobile(''); setContactWard('');
      showToast('Contact added to the voter database.', 'success');
      await loadVoters();
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Unable to add contact.', 'error');
    }
  };

  const createGroup = async () => {
    const ids = selectedIds.size ? Array.from(selectedIds) : filteredVoters.map((voter) => voter.id);
    if (!ids.length) { showToast(t('broadcastNoRecipients'), 'error'); return; }
    setIsSaving(true);
    try {
      const label = segment === 'all' ? t('filterAllVoters') : segment === 'whatsapp' ? t('filterHasWhatsApp') : segment === 'no-whatsapp' ? t('filterNoWhatsApp') : segment === 'youth' ? t('filterYouth') : segment === 'women' ? t('filterWomen') : t('filterMissingContact');
      const created = await broadcastGroupsApi.create({ voter_ids: ids, filter_criteria_snapshot: { segment, search, label } });
      setGroup(created);
      setStep(2);
      setSelectedIds(new Set());
      if (created.excluded_no_contact) showToast(`${created.excluded_no_contact} ${t('broadcastExcludedNoContact')}`, 'info');
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Unable to create broadcast group.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!group || !message.trim()) return;
    setIsSaving(true);
    try {
      const saved = await broadcastGroupsApi.saveDraft(group.id, message);
      setGroup(saved);
      setStep(3);
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Unable to save draft.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const sendNow = async () => {
    if (!group || !window.confirm(t('broadcastSendConfirm').replace('{{count}}', String(group.recipient_count)))) return;
    setIsSaving(true);
    try {
      const sent = await broadcastGroupsApi.send(group.id);
      setResult(sent);
      setStep(4);
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Broadcast send failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const insertTag = (tag: string) => setMessage((current) => `${current} {{${tag}}}`);
  const groupSummary = group && <div className="grid grid-cols-3 gap-2 text-center text-xs">
    <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-lg text-slate-900">{group.recipient_count}</strong>{t('broadcastRecipients')}</div>
    <div className="rounded-lg bg-emerald-50 p-3"><strong className="block text-lg text-emerald-800">{group.whatsapp_count}</strong>{t('broadcastWhatsAppCount')}</div>
    <div className="rounded-lg bg-sky-50 p-3"><strong className="block text-lg text-sky-800">{group.sms_count}</strong>{t('broadcastSmsCount')}</div>
  </div>;

  return <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
      <div><h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">{t('broadcastTitle')}</h1><p className="text-xs text-slate-500 mt-0.5">{t('broadcastSub')}</p></div>
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">{[t('broadcastStepGroup'), t('broadcastStepDraft'), t('broadcastStepReview')].map((label, index) => <Badge key={label} variant={step === index + 1 ? 'cyan' : 'slate'}>{index + 1}. {label}</Badge>)}</div>
    </div>

    {step === 1 && <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-3"><h2 className="font-heading font-extrabold text-sm">{t('broadcastChooseRecipients')}</h2><Button size="sm" variant="primary" onClick={createGroup} isLoading={isSaving} leftIcon={<Plus className="w-3.5 h-3.5" />}>{t('broadcastCreateGroup')}</Button></div>
          <FormInput placeholder={t('searchVoters')} leftIcon={<Search className="w-4 h-4" />} value={search} onChange={(event) => setSearch(event.target.value)} />
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">{[['all', t('filterAllVoters')], ['whatsapp', t('filterHasWhatsApp')], ['no-whatsapp', t('filterNoWhatsApp')], ['youth', t('filterYouth')], ['women', t('filterWomen')], ['missing', t('filterMissingContact')]].map(([id, label]) => <button key={id} type="button" onClick={() => setSegment(id as Segment)} className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${segment === id ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{label}</button>)}</div>
          <div className="flex items-center justify-between gap-3 text-xs text-slate-500"><span>{selectedIds.size || filteredVoters.length} selected for this group</span><div className="flex items-center gap-3"><button type="button" className="font-bold text-sky-700" onClick={selectVisible}>{t('selectAllVoters')}</button>{selectedIds.size > 0 && <button type="button" className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700" onClick={deleteSelectedVoters} disabled={isDeletingVoters}><Trash2 className="h-3.5 w-3.5" />{isDeletingVoters ? 'Deleting...' : `Delete selected (${selectedIds.size})`}</button>}</div></div>
          {selectedIds.size > 0 && <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">These voters are selected for a new group. To delete a saved group, scroll below to Saved Broadcast Groups and select its checkbox.</p>}
          <div className="max-h-80 overflow-auto divide-y divide-slate-100 border border-slate-100 rounded-lg">{filteredVoters.map((voter: any) => <label key={voter.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"><input type="checkbox" checked={selectedIds.has(voter.id)} onChange={() => toggle(voter.id)} /><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">{voter.name}</strong><span className="text-xs text-slate-500">{voter.ward || 'General Ward'} {voter.mobile ? `â€¢ ${voter.mobile}` : 'â€¢ No mobile'}</span></span><Badge variant={voter.channel === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">{voter.channel === 'WhatsApp' ? <MessageCircle className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}{voter.channel === 'WhatsApp' ? 'WhatsApp' : 'SMS'}</Badge></label>)}</div>
          {isLoading && <p className="text-xs text-slate-500">Loading voters...</p>}
        </Card>
        <div className="space-y-4">
          <Card className="space-y-3"><h2 className="font-heading font-extrabold text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-sky-600" />{t('broadcastImportVoters')}</h2><FileDropzone onFileSelect={handleFileUpload} accept=".csv,.pdf,.xlsx,.xls" title={t('uploadRoll')} subtitle={t('broadcastImportPreview')} />{pendingImportJobId && <div className="flex gap-2"><Button size="sm" variant="primary" onClick={confirmImport}>{t('confirmImport')}</Button><Button size="sm" variant="outline" onClick={async () => { await votersApi.cancelImport(pendingImportJobId); setPendingImportJobId(null); }}>{t('cancel')}</Button></div>}</Card>
          <Card className="space-y-3"><h2 className="font-heading font-extrabold text-sm">{t('broadcastAddContact')}</h2><form onSubmit={addContact} className="space-y-2"><FormInput placeholder="Name" value={contactName} onChange={(event) => setContactName(event.target.value)} required /><FormInput placeholder="Mobile number" value={contactMobile} onChange={(event) => setContactMobile(event.target.value)} required /><FormInput placeholder="Ward" value={contactWard} onChange={(event) => setContactWard(event.target.value)} /><Select value={contactChannel} onChange={(event) => setContactChannel(event.target.value)}><option value="WhatsApp">WhatsApp</option><option value="SMS Only">SMS Only</option></Select><Button type="submit" size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />}>{t('broadcastAddContact')}</Button></form></Card>
        </div>
      </div>
            {groups.length > 0 && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-sm">{t('broadcastSavedGroups')}</h2>
            {selectedGroupIds.size > 0 && (
              <Button size="sm" variant="outline" onClick={bulkDeleteGroups} className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                {t('deleteSelected') || 'Delete Selected'} ({selectedGroupIds.size})
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>{selectedGroupIds.size || groups.length} {t('groupsFound') || 'groups'}</span>
            <label className="flex items-center gap-2 font-bold text-sky-700 cursor-pointer">
              <input
                type="checkbox"
                aria-label={t('selectAllGroups') || 'Select all visible broadcast groups'}
                checked={allVisibleGroupsSelected}
                onChange={selectVisibleGroups}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              {t('selectAll') || 'Select All'}
            </label>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {groups.map((saved) => (
              <div key={saved.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedGroupIds.has(saved.id)} 
                  onChange={() => toggleGroup(saved.id)} 
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                />
                <button
                  type="button"
                  className="flex-1 flex items-center justify-between text-left"
                  onClick={() => { setGroup(saved); setMessage(saved.message_text || message); setStep(saved.status === 'READY' ? 3 : 2); }}
                >
                  <span>
                    <strong className="block text-sm text-slate-900">{saved.name}</strong>
                    <span className="text-xs text-slate-500">{saved.recipient_count} {t('broadcastRecipients')}</span>
                  </span>
                  <Badge variant="slate">{saved.status}</Badge>
                </button>
                <button 
                  type="button" 
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-md transition-colors"
                  onClick={(e) => { e.stopPropagation(); deleteGroup(saved.id); }}
                  title={t('deleteGroup') || 'Delete group'}
                  aria-label={t('deleteGroup') || 'Delete group'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>}

    {step === 2 && group && <Card className="max-w-3xl mx-auto space-y-5"><div><h2 className="text-lg font-extrabold font-heading">{t('broadcastDraftTitle')}</h2><p className="text-xs text-slate-500">{group.name}</p></div>{groupSummary}<div className="flex flex-wrap gap-2 text-xs font-bold">{['name', 'ward', 'booth'].map((tag) => <button type="button" key={tag} onClick={() => insertTag(tag)} className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-700">+ {tag}</button>)}</div><TransliteratingTextArea rows={8} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t('broadcastDraftDesc')} /><div className="flex justify-end"><Button variant="primary" size="lg" onClick={saveDraft} isLoading={isSaving} leftIcon={<Send className="w-4 h-4" />}>{t('broadcastSaveDraft')}</Button></div></Card>}

    {step === 3 && group && <Card className="max-w-3xl mx-auto space-y-5"><div><h2 className="text-lg font-extrabold font-heading">{t('broadcastReviewSend')}</h2><p className="text-xs text-slate-500">{group.name}</p></div>{groupSummary}<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm">{message}</div><div className="flex justify-end"><Button variant="primary" size="lg" onClick={sendNow} isLoading={isSaving} leftIcon={<Send className="w-4 h-4" />}>{t('broadcastSendNow')}</Button></div></Card>}

    {step === 4 && result && <Card className="max-w-3xl mx-auto space-y-5"><h2 className="text-lg font-extrabold font-heading">{t('broadcastResults')}</h2><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-lg bg-emerald-50 p-4"><strong className="block text-2xl text-emerald-800">{result.whatsapp_sent}</strong>{t('broadcastSentWhatsApp')}</div><div className="rounded-lg bg-sky-50 p-4"><strong className="block text-2xl text-sky-800">{result.sms_sent}</strong>{t('broadcastSentSms')}</div><div className="rounded-lg bg-rose-50 p-4"><strong className="block text-2xl text-rose-800">{result.failed}</strong>{t('broadcastFailed')}</div></div><Button variant="outline" onClick={() => { setGroup(null); setResult(null); setStep(1); }}>{t('broadcastCreateAnother')}</Button></Card>}

    {step === 3 && group && <div className="max-w-sm mx-auto"><PhonePreview message={message} channel="all" includePoster={false} /></div>}
  </div>;
};





