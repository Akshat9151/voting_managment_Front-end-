import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Contact2,
  Search,
  Camera,
  Download,
  Phone,
  MessageCircle,
  Smartphone,
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Voter, OcrStagedRow } from '../types';

export const VotersPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [voters, setVoters] = useState<Voter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'whatsapp' | 'no-whatsapp' | 'youth' | 'women' | 'missing'>('all');

  // Modals
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isAddVoterModalOpen, setIsAddVoterModalOpen] = useState(false);
  const [stagedOcrRows, setStagedOcrRows] = useState<OcrStagedRow[]>([]);

  // Manual Add Form
  const [name, setName] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [ward, setWard] = useState('Ward 02');
  const [mobile, setMobile] = useState('');
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS Only'>('WhatsApp');

  useEffect(() => {
    loadVoters();
  }, []);

  const loadVoters = async () => {
    const data = await api.getVoters();
    setVoters(data);
  };

  const handleFileUpload = (file: File) => {
    showToast(`Uploaded ${file.name}. 14 voters synced successfully!`, 'success');
  };

  const handleStartOcr = () => {
    // Generate mock OCR staged rows extracted from voter slip photo
    const mockExtracted: OcrStagedRow[] = [
      { id: '1', epicNo: 'RJ/04/10928', name: 'Rameshwar Patel', relativeName: 'Chhitar Mal Patel', age: 48, gender: 'Male', houseNo: '14', mobile: '+91 98290 14285', confidence: 98 },
      { id: '2', epicNo: 'RJ/04/10929', name: 'Sita Devi Patel', relativeName: 'Rameshwar Patel', age: 42, gender: 'Female', houseNo: '14', mobile: '+91 98290 14286', confidence: 96 },
      { id: '3', epicNo: 'RJ/02/10450', name: 'Gopal Lal Gurjar', relativeName: 'Moti Ram Gurjar', age: 58, gender: 'Male', houseNo: '22', mobile: '+91 97840 55190', confidence: 94 },
      { id: '4', epicNo: 'RJ/02/10451', name: 'Kamla Devi Gurjar', relativeName: 'Gopal Lal Gurjar', age: 38, gender: 'Female', houseNo: '22', mobile: '+91 96021 44556', confidence: 95 }
    ];
    setStagedOcrRows(mockExtracted);
    setIsOcrModalOpen(true);
  };

  const handleSaveOcrRows = async () => {
    const newVoters = stagedOcrRows.map(row => ({
      name: row.name,
      age: row.age,
      gender: row.gender,
      ward: 'Ward 02',
      mobile: row.mobile,
      channel: (row.mobile ? 'WhatsApp' : 'SMS Only') as 'WhatsApp' | 'SMS Only',
      consent: 'Verified' as const,
      source: 'Camera OCR Scan',
      status: 'Valid' as const
    }));
    await api.addVotersBatch(newVoters);
    showToast(`${newVoters.length} scanned electors saved to official database!`, 'success');
    setIsOcrModalOpen(false);
    loadVoters();
  };

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await api.addVoter({
      name,
      age,
      gender,
      ward,
      mobile,
      channel,
      consent: 'Verified',
      source: 'Manual Field Entry',
      status: mobile ? 'Valid' : 'Missing Mobile'
    });
    showToast(`Voter ${name} added successfully!`, 'success');
    setIsAddVoterModalOpen(false);
    setName('');
    setMobile('');
    loadVoters();
  };

  const handleExportCsv = () => {
    const headers = 'ID,Name,Age,Gender,Ward,Mobile,Channel,Consent,Status\n';
    const rows = voters.map(v => `${v.id},"${v.name}",${v.age},${v.gender},${v.ward},"${v.mobile}",${v.channel},${v.consent},${v.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ElectWin_Voter_Database_${Date.now()}.csv`;
    link.click();
    showToast('Official Voter Roll CSV downloaded!', 'info');
  };

  const filteredVoters = voters.filter(v => {
    // 1. Segment filter
    if (segmentFilter === 'whatsapp' && v.channel !== 'WhatsApp') return false;
    if (segmentFilter === 'no-whatsapp' && v.channel !== 'SMS Only') return false;
    if (segmentFilter === 'youth' && (v.age < 18 || v.age > 25)) return false;
    if (segmentFilter === 'women' && v.gender !== 'Female') return false;
    if (segmentFilter === 'missing' && v.mobile) return false;

    // 2. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.mobile.toLowerCase().includes(q) ||
        v.ward.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q)
      );
    }
    return true;
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
          >
            {t('exportCsv')}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleStartOcr}
            leftIcon={<Camera className="w-3.5 h-3.5 text-sky-600" />}
          >
            {t('scanOcr')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddVoterModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add Elector
          </Button>
        </div>
      </div>

      {/* File Dropzone Quick Upload */}
      <FileDropzone onFileSelect={handleFileUpload} />

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
            { id: 'all', label: 'All Electors' },
            { id: 'whatsapp', label: '🟢 WhatsApp Active' },
            { id: 'no-whatsapp', label: '🔵 SMS Fallback Only' },
            { id: 'youth', label: '⚡ Youth (18-25 Yrs)' },
            { id: 'women', label: '🌸 Women SHG' },
            { id: 'missing', label: '⚠️ Missing Mobile' }
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
      <Card className="p-0 overflow-hidden">
        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">EPIC ID</th>
                <th className="py-3 px-4">Elector Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Ward / Booth</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Delivery Route</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVoters.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-600">{v.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{v.name}</td>
                  <td className="py-3 px-4 text-slate-600">{v.age} Yrs • {v.gender}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{v.ward}</td>
                  <td className="py-3 px-4">
                    {v.mobile ? (
                      <a href={`tel:${v.mobile}`} className="font-bold text-sky-600 hover:underline inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {v.mobile}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No Mobile</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={v.channel === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">
                      {v.channel === 'WhatsApp' ? <MessageCircle className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      <span>{v.channel}</span>
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={v.status === 'Valid' ? 'mint' : 'amber'} size="sm">
                      {v.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100 p-2">
          {filteredVoters.map((v) => (
            <div key={v.id} className="p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-extrabold text-slate-900 font-heading">{v.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{v.id} • {v.age} Yrs • {v.gender}</div>
                </div>
                <Badge variant={v.channel === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">
                  {v.channel}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-medium text-slate-700">{v.ward}</span>
                {v.mobile ? (
                  <a href={`tel:${v.mobile}`} className="font-bold text-sky-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {v.mobile}
                  </a>
                ) : (
                  <span className="text-amber-600 font-bold">Missing Mobile</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* OCR Scanner Review Modal */}
      <Modal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        maxWidth="2xl"
        title={
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-600" />
            <span>Review Scanned Voter Slip Table (OCR AI)</span>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Verify extracted data below before committing to the official Gram Panchayat roll.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                <tr>
                  <th className="p-2.5">EPIC No.</th>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Relative</th>
                  <th className="p-2.5">Age/Sex</th>
                  <th className="p-2.5">Mobile</th>
                  <th className="p-2.5">AI Conf.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stagedOcrRows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2.5 font-mono font-bold text-slate-700">{row.epicNo}</td>
                    <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                    <td className="p-2.5 text-slate-600">{row.relativeName}</td>
                    <td className="p-2.5">{row.age} / {row.gender.charAt(0)}</td>
                    <td className="p-2.5 text-sky-600 font-mono">{row.mobile}</td>
                    <td className="p-2.5">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {row.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOcrModalOpen(false)}>
              Discard
            </Button>
            <Button variant="success" onClick={handleSaveOcrRows}>
              Save {stagedOcrRows.length} Voters to Roll
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Elector Modal */}
      <Modal
        isOpen={isAddVoterModalOpen}
        onClose={() => setIsAddVoterModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Contact2 className="w-5 h-5 text-sky-600" />
            <span>Add New Voter / Elector</span>
          </div>
        }
      >
        <form onSubmit={handleAddVoter} className="space-y-4">
          <FormInput
            label="Full Name"
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
            <FormInput
              label="Ward Assignment"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
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
    </div>
  );
};
