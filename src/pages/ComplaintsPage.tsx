import React, { useState, useEffect, useCallback } from 'react';
import { complaintsApi } from '../services/api';
import { useElection } from '../context/ElectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Edit3, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { TransliteratingNameInput } from '../components/ui/TransliteratingNameInput';
import { TransliteratingTextArea } from '../components/ui/TransliteratingTextInput';
import { Select } from '../components/ui/Select';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';

export const ComplaintsPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();
  const { currentRole } = useAuth();
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [reportedByName, setReportedByName] = useState('');
  const [wardName, setWardName] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Water Supply');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadComplaints = useCallback(async () => {
    if (!activeElectionId) return;
    setIsLoading(true);
    try {
      const { items } = await complaintsApi.list(activeElectionId);
      setComplaints(items as Complaint[]);
    } catch {
      showToast(t('failedLoadingComplaints'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeElectionId]);

  useEffect(() => { loadComplaints(); }, [loadComplaints]);

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    try {
      await complaintsApi.updateStatus(id, { status: newStatus });
      showToast(`Grievance marked as "${newStatus}"!`, 'success');
      loadComplaints();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Status update failed', 'error');
    }
  };

  const handleLogComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElectionId || !title) return;
    try {
      const payload = {
        title,
        description: desc,
        category,
        reported_by_name: reportedByName,
        ward_name: wardName,
      };
      if (editingComplaint) await complaintsApi.update(editingComplaint.id, payload);
      else await complaintsApi.create(activeElectionId, payload);
      showToast(t('grievanceRegistered'), 'success');
      setIsLogModalOpen(false); setEditingComplaint(null);
      setTitle(''); setDesc(''); setReportedByName(''); setWardName('');
      loadComplaints();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to register grievance', 'error');
    }
  };

  const openEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint); setTitle(complaint.title ?? ''); setDesc(complaint.description ?? ''); setReportedByName(complaint.reported_by_name ?? ''); setWardName(complaint.ward_name ?? ''); setCategory(complaint.category); setIsLogModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this complaint?')) return;
    try { await complaintsApi.remove(id); showToast('Complaint deleted successfully.', 'success'); await loadComplaints(); } catch (err: any) { showToast(err?.response?.data?.detail || 'Delete failed.', 'error'); }
  };

  const filtered = complaints.filter(c => {
    if (filterCategory === 'all') return true;
    return c.category === filterCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('surveysComplaints')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track village grievances (water, roads, power) and voter redressal status live.
          </p>
        </div>

        {!isSuperAdmin && <Button
          size="sm"
          variant="primary"
          onClick={() => setIsLogModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : t('logGrievance')}
        </Button>}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'Water Supply', 'Health / School', 'Road Drainage', 'Electricity'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
              filterCategory === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Grievances' : cat}
          </button>
        ))}
      </div>

      {/* Grievance Ledger Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="p-3.5">Citizen Name</th>
                <th className="p-3.5">Ward</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Issue Description</th>
                <th className="p-3.5">Logged Date</th>
                <th className="p-3.5">Resolution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const statusValue = c.status ?? 'OPEN';
                const label = statusValue === 'RESOLVED' || statusValue === 'Resolved' ? 'Resolved' : statusValue === 'IN_PROGRESS' || statusValue === 'In Progress' ? 'In Progress' : 'Open';
                return (
                  <tr key={c.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => isSuperAdmin && setSelectedComplaint(c)}>
                    <td className="p-3.5 font-bold text-slate-900">{c.reported_by_name ?? 'Citizen'}</td>
                    <td className="p-3.5">
                      <Badge variant="purple" size="sm">{c.ward_name ?? 'Ward'}</Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="cyan" size="sm">{c.category}</Badge>
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs">{c.description ?? 'No description'}</td>
                    <td className="p-3.5 text-slate-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                    <td className="p-3.5">
                      {isSuperAdmin ? <select
                        value={label}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border transition-all cursor-pointer ${
                          label === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : label === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="Open">🔴 Open</option>
                        <option value="In Progress">🟡 In Progress</option>
                        <option value="Resolved">🟢 Resolved</option>
                      </select> : <Badge variant={label === 'Resolved' ? 'mint' : label === 'In Progress' ? 'amber' : 'rose'} size="sm">{label}</Badge>}
                    </td>
                    {!isSuperAdmin && <td className="p-3.5"><div className="flex gap-1"><Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEdit(c); }} aria-label="Edit complaint"><Edit3 className="w-3.5 h-3.5" /></Button><Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} aria-label="Delete complaint"><Trash2 className="w-3.5 h-3.5" /></Button></div></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Grievance Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-sky-600" />
            <span>{editingComplaint ? 'Edit Citizen Grievance' : 'Log Citizen Grievance & Issue'}</span>
          </div>
        }
      >
        <form onSubmit={handleLogComplaint} className="space-y-4">
          <TransliteratingNameInput
            label="Citizen Name"
            placeholder="e.g. Suraj Mal Sharma"
            value={reportedByName}
            onChange={(e) => setReportedByName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <TransliteratingTextArea
              label="Ward Location"
              value={wardName}
              onChange={(e) => setWardName(e.target.value)}
              rows={1}
              required
            />

            <Select
              label="Issue Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            >
              {[
                ['Water Supply', 'complaintWater'], ['Road / Infrastructure', 'complaintRoad'], ['Electricity', 'complaintElectricity'], ['Sanitation / Garbage Collection', 'complaintSanitation'], ['Drainage / Sewage', 'complaintDrainage'], ['Street Lighting', 'complaintLighting'], ['Public Health', 'complaintHealth'], ['Education / School Issues', 'complaintEducation'], ['Law & Order / Safety', 'complaintSafety'], ['Corruption / Bribery', 'complaintCorruption'], ['Land / Property Dispute', 'complaintLand'], ['Ration / PDS Issues', 'complaintRation'], ['Pension / Welfare Scheme Issues', 'complaintPension'], ['Employment / MGNREGA Issues', 'complaintEmployment'], ['Voter ID / EPIC Issues', 'complaintVoterId'], ['Election Malpractice', 'complaintMalpractice'], ['Other', 'complaintOther']
              ].map(([value, key]) => <option key={value} value={value}>{t(key)}</option>)}
            </Select>
          </div>

          <TransliteratingTextArea
            label="Description of Grievance"
            rows={3}
            placeholder="Describe the issue reported by the elector..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Grievance
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        title={<div className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-sky-600" /><span>Complaint Details</span></div>}
      >
        {selectedComplaint && <div className="space-y-3 text-sm">
          <div><strong>Complainant:</strong> {selectedComplaint.reported_by_name || selectedComplaint.name || 'Citizen'}</div>
          <div><strong>Mobile:</strong> {selectedComplaint.reported_by_phone || 'Not provided'}</div>
          <div><strong>Ward / Location:</strong> {selectedComplaint.ward_name || selectedComplaint.ward || 'Not provided'}</div>
          <div><strong>Category:</strong> {selectedComplaint.category}</div>
          <div><strong>Description:</strong> {selectedComplaint.description || selectedComplaint.desc || 'Not provided'}</div>
          <div><strong>Submitted by:</strong> {selectedComplaint.submitted_by_name || 'Unknown'}</div>
          <div><strong>Submitted date:</strong> {selectedComplaint.created_at ? new Date(selectedComplaint.created_at).toLocaleString() : selectedComplaint.date || 'Not provided'}</div>
          <div className="flex items-center justify-between"><strong>Status:</strong><select value={selectedComplaint.status} onChange={(e) => { void handleStatusChange(selectedComplaint.id, e.target.value as ComplaintStatus); setSelectedComplaint({ ...selectedComplaint, status: e.target.value as ComplaintStatus }); }} className="rounded-lg border border-slate-200 px-2 py-1"><option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option></select></div>
        </div>}
      </Modal>
    </div>
  );
};
