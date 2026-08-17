import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Award, Plus, Sparkles, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Candidate, PostType } from '../types';
import { useNavigate } from 'react-router-dom';

export const CandidatesPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<'all' | 'sarpanch' | 'panch'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [postType, setPostType] = useState<PostType>('sarpanch');
  const [constituency, setConstituency] = useState('Gram Panchayat Rampur (Ward 04)');
  const [symbol, setSymbol] = useState('🚜');
  const [symbolName, setSymbolName] = useState('Tractor (ट्रैक्टर)');
  const [slogan, setSlogan] = useState('गांव का समग्र विकास, हर घर विश्वास और खुशहाली!');
  const [manifesto, setManifesto] = useState('1. Clean 24x7 drinking water\n2. Concrete roads\n3. Power subsidy');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const data = await api.getCandidates();
    setCandidates(data);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await api.addCandidate({
      name,
      hindiName: hindiName || name,
      post: postType === 'sarpanch' ? 'Sarpanch (Gram Panchayat)' : 'Panch (Ward)',
      postType,
      constituency,
      symbol,
      symbolName,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      slogan,
      votersCount: postType === 'sarpanch' ? 3500 : 620,
      volunteersCount: postType === 'sarpanch' ? 24 : 8,
      manifesto
    });
    showToast(`Candidate ${name} registered successfully!`, 'success');
    setIsAddModalOpen(false);
    setName('');
    setHindiName('');
    loadCandidates();
  };

  const filtered = candidates.filter(c => {
    if (filter === 'sarpanch') return c.postType === 'sarpanch';
    if (filter === 'panch') return c.postType === 'panch';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('candidateCenter')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('candidateDescription')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t('addCandidate')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Candidates' },
          { id: 'sarpanch', label: '🏛️ Sarpanch Post' },
          { id: 'panch', label: '👥 Ward Panch' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as 'all' | 'sarpanch' | 'panch')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
              filter === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cand) => (
          <Card key={cand.id} variant="interactive" className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={cand.photo}
                    alt={cand.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500 shadow-sm"
                  />
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                      {cand.name}
                    </h3>
                    <div className="text-xs font-bold text-sky-600">{cand.hindiName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cand.constituency}</div>
                  </div>
                </div>

                <div
                  className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center justify-center shadow-xs shrink-0"
                  title={cand.symbolName}
                >
                  <span className="text-2xl leading-none">{cand.symbol}</span>
                  <span className="text-[8px] font-extrabold text-amber-900 mt-0.5">SYMBOL</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs font-bold text-sky-900 italic text-center">
                "{cand.slogan}"
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Elector Base</div>
                  <div className="font-extrabold text-slate-800">{cand.votersCount.toLocaleString()} Voters</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Field Team</div>
                  <div className="font-extrabold text-emerald-700">{cand.volunteersCount} Workers</div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Key Manifesto Agenda:</span>
                </div>
                <div className="text-slate-600 bg-white p-2 rounded-lg border border-slate-100 whitespace-pre-line text-[11px] leading-relaxed">
                  {cand.manifesto}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Badge variant={cand.postType === 'sarpanch' ? 'purple' : 'cyan'}>
                {cand.post}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/studio')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-600" />}
              >
                Generate Posters
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            <span>Nominate New Contesting Candidate</span>
          </div>
        }
      >
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Candidate Name (English)"
              placeholder="e.g. Rameshwar Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormInput
              label="नाम (हिंदी में)"
              placeholder="उदा. रामेश्वर पटेल"
              value={hindiName}
              onChange={(e) => setHindiName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Contesting Post"
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
            >
              <option value="sarpanch">Sarpanch (Gram Panchayat)</option>
              <option value="panch">Panch (Ward Representative)</option>
            </Select>

            <FormInput
              label="Constituency / Ward"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Official Election Symbol"
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                setSymbolName(e.target.options[e.target.selectedIndex].text);
              }}
            >
              <option value="🚜">🚜 Tractor (ट्रैक्टर)</option>
              <option value="🌾">🌾 Farmer (किसान)</option>
              <option value="☀️">☀️ Sun (सूरज)</option>
              <option value="🔦">🔦 Torch (मशाल)</option>
              <option value="🪁">🪁 Kite (पतंग)</option>
              <option value="☕">☕ Cup & Saucer (कप-प्लेट)</option>
            </Select>

            <FormInput
              label="Symbol Display Name"
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
            />
          </div>

          <FormInput
            label="Campaign Slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
          />

          <Textarea
            label="Key Manifesto Points (One per line)"
            rows={3}
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Candidate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
