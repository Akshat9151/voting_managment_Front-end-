import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { AlertCircle, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';

export const ComplaintsPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 04');
  const [category, setCategory] = useState<ComplaintCategory>('Water Supply');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const data = await api.getComplaints();
    setComplaints(data);
  };

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    await api.updateComplaintStatus(id, newStatus);
    showToast(`Grievance marked as "${newStatus}"!`, 'success');
    loadComplaints();
  };

  const handleLogComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc) return;
    await api.addComplaint({
      name,
      ward,
      category,
      desc,
      status: 'Open'
    });
    showToast('Citizen grievance registered successfully!', 'success');
    setIsLogModalOpen(false);
    setName('');
    setDesc('');
    loadComplaints();
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

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsLogModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t('logGrievance')}
        </Button>
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
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5">
                    <Badge variant="purple" size="sm">{c.ward}</Badge>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="cyan" size="sm">{c.category}</Badge>
                  </td>
                  <td className="p-3.5 text-slate-700 max-w-xs">{c.desc}</td>
                  <td className="p-3.5 text-slate-400">{c.date}</td>
                  <td className="p-3.5">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                      className={`text-xs font-bold rounded-lg px-2 py-1 border transition-all cursor-pointer ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Open">🔴 Open</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Resolved">🟢 Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
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
            <span>Log Citizen Grievance &amp; Issue</span>
          </div>
        }
      >
        <form onSubmit={handleLogComplaint} className="space-y-4">
          <FormInput
            label="Citizen Name"
            placeholder="e.g. Suraj Mal Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Ward Location"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="Ward 01">Ward 01</option>
              <option value="Ward 02">Ward 02</option>
              <option value="Ward 03">Ward 03</option>
              <option value="Ward 04">Ward 04</option>
              <option value="Ward 05">Ward 05</option>
              <option value="Ward 06">Ward 06</option>
            </Select>

            <Select
              label="Issue Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            >
              <option value="Water Supply">Water Supply (पेयजल)</option>
              <option value="Road Drainage">Road Drainage (सड़क-नाली)</option>
              <option value="Health / School">Health / School (स्वास्थ्य/स्कूल)</option>
              <option value="Electricity">Electricity (बिजली)</option>
              <option value="Sanitation">Sanitation (सफाई)</option>
            </Select>
          </div>

          <Textarea
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
    </div>
  );
};
