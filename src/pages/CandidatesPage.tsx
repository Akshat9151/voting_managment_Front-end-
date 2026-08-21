import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Award, Plus, Sparkles, FileText, PencilLine, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Candidate, PostType } from '../types';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../context/ElectionContext';
import { candidatesApi, designTemplatesApi } from '../services/api';
import { FileDropzone } from '../components/ui/FileDropzone';
import { TransliteratingNameInput } from '../components/ui/TransliteratingNameInput';
import { TransliteratingTextInput, TransliteratingTextArea } from '../components/ui/TransliteratingTextInput';

export const CandidatesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { activeElectionId } = useElection();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<'all' | 'sarpanch' | 'panch'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [postType, setPostType] = useState<PostType>('sarpanch');
  const [constituency, setConstituency] = useState('');
  const [symbolName, setSymbolName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [symbolUrl, setSymbolUrl] = useState('');
  const [symbolPreview, setSymbolPreview] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingSymbol, setIsUploadingSymbol] = useState(false);
  const [slogan, setSlogan] = useState('');
  const [manifesto, setManifesto] = useState('');

  const labels: Record<string, Record<string, string>> = {
    en: { englishName: 'Candidate Name (English)', hindiName: 'Candidate Name (Hindi)', post: 'Contesting Post', ward: 'Constituency / Ward', symbol: 'Election Symbol', symbolName: 'Symbol Display Name', photo: 'Candidate Photo', uploadPhoto: 'Upload candidate photo', uploadSymbol: 'Upload election symbol', slogan: 'Campaign Slogan', manifesto: 'Key Manifesto Points (One per line)', choose: 'Choose file or drag and drop' },
    hi: { englishName: 'उम्मीदवार का नाम (अंग्रेज़ी)', hindiName: 'उम्मीदवार का नाम (हिंदी)', post: 'प्रतिस्पर्धी पद', ward: 'निर्वाचन क्षेत्र / वार्ड', symbol: 'चुनाव चिह्न', symbolName: 'चिह्न का नाम', photo: 'उम्मीदवार की फोटो', uploadPhoto: 'उम्मीदवार की फोटो अपलोड करें', uploadSymbol: 'चुनाव चिह्न अपलोड करें', slogan: 'अभियान का नारा', manifesto: 'घोषणापत्र के मुख्य बिंदु (हर पंक्ति में एक)', choose: 'फाइल चुनें या खींचकर छोड़ें' },
    pa: { englishName: 'ਉਮੀਦਵਾਰ ਦਾ ਨਾਮ (ਅੰਗਰੇਜ਼ੀ)', hindiName: 'ਉਮੀਦਵਾਰ ਦਾ ਨਾਮ (ਹਿੰਦੀ)', post: 'ਚੋਣ ਅਹੁਦਾ', ward: 'ਹਲਕਾ / ਵਾਰਡ', symbol: 'ਚੋਣ ਨਿਸ਼ਾਨ', symbolName: 'ਨਿਸ਼ਾਨ ਦਾ ਨਾਮ', photo: 'ਉਮੀਦਵਾਰ ਦੀ ਫੋਟੋ', uploadPhoto: 'ਉਮੀਦਵਾਰ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ', uploadSymbol: 'ਚੋਣ ਨਿਸ਼ਾਨ ਅੱਪਲੋਡ ਕਰੋ', slogan: 'ਮੁਹਿੰਮ ਦਾ ਨਾਅਰਾ', manifesto: 'ਘੋਸ਼ਣਾ ਪੱਤਰ ਦੇ ਮੁੱਖ ਬਿੰਦੂ', choose: 'ਫਾਈਲ ਚੁਣੋ ਜਾਂ ਖਿੱਚ ਕੇ ਛੱਡੋ' },
    bn: { englishName: 'প্রার্থীর নাম (ইংরেজি)', hindiName: 'প্রার্থীর নাম (হিন্দি)', post: 'প্রতিদ্বন্দ্বী পদ', ward: 'নির্বাচনী এলাকা / ওয়ার্ড', symbol: 'নির্বাচনী প্রতীক', symbolName: 'প্রতীকের নাম', photo: 'প্রার্থীর ছবি', uploadPhoto: 'প্রার্থীর ছবি আপলোড করুন', uploadSymbol: 'নির্বাচনী প্রতীক আপলোড করুন', slogan: 'প্রচার স্লোগান', manifesto: 'ইশতেহারের মূল বিষয়', choose: 'ফাইল বেছে নিন বা টেনে আনুন' },
    mr: { englishName: 'उमेदवाराचे नाव (इंग्रजी)', hindiName: 'उमेदवाराचे नाव (हिंदी)', post: 'निवडणूक पद', ward: 'मतदारसंघ / प्रभाग', symbol: 'निवडणूक चिन्ह', symbolName: 'चिन्हाचे नाव', photo: 'उमेदवाराचा फोटो', uploadPhoto: 'उमेदवाराचा फोटो अपलोड करा', uploadSymbol: 'निवडणूक चिन्ह अपलोड करा', slogan: 'प्रचार घोषणा', manifesto: 'जाहीरनाम्याचे मुख्य मुद्दे', choose: 'फाइल निवडा किंवा ओढून सोडा' },
    te: { englishName: 'అభ్యర్థి పేరు (ఆంగ్లం)', hindiName: 'అభ్యర్థి పేరు (హిందీ)', post: 'పోటీ చేసే పదవి', ward: 'నియోజకవర్గం / వార్డు', symbol: 'ఎన్నికల గుర్తు', symbolName: 'గుర్తు పేరు', photo: 'అభ్యర్థి ఫోటో', uploadPhoto: 'అభ్యర్థి ఫోటోను అప్‌లోడ్ చేయండి', uploadSymbol: 'ఎన్నికల గుర్తును అప్‌లోడ్ చేయండి', slogan: 'ప్రచార నినాదం', manifesto: 'మ్యానిఫెస్టో ముఖ్యాంశాలు', choose: 'ఫైల్ ఎంచుకోండి లేదా లాగండి' },
    ta: { englishName: 'வேட்பாளர் பெயர் (ஆங்கிலம்)', hindiName: 'வேட்பாளர் பெயர் (இந்தி)', post: 'போட்டியிடும் பதவி', ward: 'தொகுதி / வார்டு', symbol: 'தேர்தல் சின்னம்', symbolName: 'சின்னத்தின் பெயர்', photo: 'வேட்பாளர் புகைப்படம்', uploadPhoto: 'வேட்பாளர் புகைப்படத்தைப் பதிவேற்றவும்', uploadSymbol: 'தேர்தல் சின்னத்தைப் பதிவேற்றவும்', slogan: 'பிரச்சார முழக்கம்', manifesto: 'அறிக்கையின் முக்கிய குறிப்புகள்', choose: 'கோப்பைத் தேர்ந்தெடுக்கவும் அல்லது இழுக்கவும்' },
    gu: { englishName: 'ઉમેદવારનું નામ (અંગ્રેજી)', hindiName: 'ઉમેદવારનું નામ (હિન્દી)', post: 'ચૂંટણી પદ', ward: 'મતવિસ્તાર / વોર્ડ', symbol: 'ચૂંટણી ચિહ્ન', symbolName: 'ચિહ્નનું નામ', photo: 'ઉમેદવારનો ફોટો', uploadPhoto: 'ઉમેદવારનો ફોટો અપલોડ કરો', uploadSymbol: 'ચૂંટણી ચિહ્ન અપલોડ કરો', slogan: 'પ્રચાર સૂત્ર', manifesto: 'ઘોષણાપત્રના મુખ્ય મુદ્દા', choose: 'ફાઇલ પસંદ કરો અથવા ખેંચો' }
  };
  const l = labels[language] || labels.en;

  useEffect(() => {
    loadCandidates();
  }, [activeElectionId]);

  const loadCandidates = async () => {
    try {
      const data = await api.getCandidates(activeElectionId || undefined);
      if (Array.isArray(data)) {
        setCandidates(data);
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hindiName.trim() || !photoUrl || !symbolUrl) {
      showToast('English name, Hindi name, candidate photo and symbol are required.', 'error');
      return;
    }

    try {
      const payload = {
        election_id: activeElectionId || undefined,
        name: name.trim(),
        full_name: name.trim(),
        hindiName: (hindiName || name).trim(),
        post: postType === 'sarpanch' ? 'Sarpanch (Gram Panchayat)' : 'Panch (Ward)',
        postType,
        constituency: constituency.trim(),
        symbol: symbolUrl,
        symbolName: symbolName.trim(),
        photo: photoUrl,
        slogan: slogan.trim(),
        votersCount: 0,
        volunteersCount: 0,
        manifesto: manifesto.trim()
      };
      if (editingCandidate) {
        await candidatesApi.update(editingCandidate.id, payload);
      } else {
        await api.addCandidate(payload);
      }

      showToast(editingCandidate ? 'Candidate profile updated successfully!' : 'Candidate profile created successfully!', 'success');
      setIsAddModalOpen(false);
      setEditingCandidate(null);
      setName('');
      setHindiName('');
      setSymbolName('');
      setPhotoUrl(''); setPhotoPreview(''); setSymbolUrl(''); setSymbolPreview('');
      setSlogan('');
      setManifesto('');
      setConstituency('');
      await loadCandidates();
    } catch (err: any) {
      console.error('Failed to create candidate:', err);
      showToast(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to create candidate profile', 'error');
    }
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setName(candidate.name || '');
    setHindiName(candidate.hindiName || '');
    setPostType((candidate.postType as PostType) || 'sarpanch');
    setConstituency(candidate.constituency || '');
    setSymbolName(candidate.symbolName || '');
    setPhotoUrl(candidate.photo || '');
    setPhotoPreview(candidate.photo || '');
    setSymbolUrl(candidate.symbol || '');
    setSymbolPreview(candidate.symbol || '');
    setSlogan(candidate.slogan || '');
    setManifesto(candidate.manifesto || '');
    setIsAddModalOpen(true);
  };

  const handleDeleteCandidate = async (candidate: Candidate) => {
    if (!window.confirm(`Delete candidate ${candidate.name || 'profile'}? This cannot be undone.`)) return;
    try {
      await candidatesApi.remove(candidate.id);
      showToast('Candidate profile deleted successfully.', 'success');
      await loadCandidates();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || 'Failed to delete candidate profile.', 'error');
    }
  };

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
    if (file.size > MAX_SIZE_BYTES) return 'File size must be 5 MB or less.';
    return null;
  };

  const uploadCandidateAsset = async (file: File, kind: 'photo' | 'symbol') => {
    const validationError = validateImageFile(file);
    if (validationError) { showToast(validationError, 'error'); return; }
    const setter = kind === 'photo' ? setIsUploadingPhoto : setIsUploadingSymbol;
    setter(true);
    try {
      const uploaded = await designTemplatesApi.uploadAsset(file);
      const url = uploaded.url.startsWith('http') ? uploaded.url : `http://localhost:8000${uploaded.url}`;
      if (kind === 'photo') { setPhotoUrl(url); setPhotoPreview(url); } else { setSymbolUrl(url); setSymbolPreview(url); }
    } catch { showToast(kind === 'photo' ? 'Candidate photo upload failed.' : 'Symbol upload failed.', 'error'); }
    finally { setter(false); }
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
          { id: 'all', label: t('filterAllCandidates') },
          { id: 'sarpanch', label: `🏛️ ${t('filterSarpanch')}` },
          { id: 'panch', label: `👥 ${t('filterPanch')}` }
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
        {filtered.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 p-12 text-center space-y-4">
            <Award className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <h3 className="text-base font-extrabold text-slate-800">{t('emptyCandidatesTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('emptyCandidatesDesc')}</p>
            </div>
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              {t('addCandidate')}
            </Button>
          </Card>
        ) : (
          filtered.map((cand) => (
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
                    {cand.symbol?.startsWith('http') || cand.symbol?.startsWith('/') ? (
                      <img src={cand.symbol} alt={cand.symbolName || 'Symbol'} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-2xl leading-none">{cand.symbol}</span>
                    )}
                    <span className="text-[8px] font-extrabold text-amber-900 mt-0.5">SYMBOL</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs font-bold text-sky-900 italic text-center">
                  "{cand.slogan}"
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Elector Base</div>
                    <div className="font-extrabold text-slate-800">{(cand.votersCount ?? 0).toLocaleString()} Voters</div>
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

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                <Badge variant={cand.postType === 'sarpanch' ? 'purple' : 'cyan'}>
                  {cand.post}
                </Badge>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/studio?candidateId=${cand.id}`)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Generate Poster
                </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditCandidate(cand)} leftIcon={<PencilLine className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleDeleteCandidate(cand)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingCandidate(null); }}
        title={
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            <span>{editingCandidate ? 'Edit Candidate Profile' : 'Add New Candidate Profile'}</span>
          </div>
        }
      >
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TransliteratingTextInput
              label={l.englishName}
              placeholder={l.englishName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TransliteratingNameInput
              label={l.hindiName}
              placeholder={l.hindiName}
              value={hindiName}
              onChange={(e) => setHindiName(e.target.value)}
              sourceValue={name}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={l.post}
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
            >
              <option value="sarpanch">Sarpanch (Gram Panchayat)</option>
              <option value="panch">Panch (Ward Representative)</option>
            </Select>

            <TransliteratingTextInput
              label={l.ward}
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">{l.symbol}</label>
              {symbolPreview ? (
                <div className="flex flex-col items-start gap-2">
                  <img
                    src={symbolPreview}
                    alt={l.symbol}
                    className="h-28 w-28 rounded-xl border-2 border-amber-300 object-contain bg-amber-50"
                  />
                  <button
                    type="button"
                    onClick={() => { setSymbolUrl(''); setSymbolPreview(''); }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <FileDropzone
                  onFileSelect={(file) => uploadCandidateAsset(file, 'symbol')}
                  accept=".jpg,.jpeg,.png,.webp"
                  title={isUploadingSymbol ? 'Uploading...' : l.uploadSymbol}
                  subtitle={l.choose}
                  className="min-h-[110px]"
                />
              )}
            </div>

            <TransliteratingTextInput
              label={l.symbolName}
              placeholder={l.symbolName}
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">{l.photo}</label>
            {photoPreview ? (
              <div className="flex flex-col items-start gap-2">
                <img
                  src={photoPreview}
                  alt={l.photo}
                  className="h-28 w-28 rounded-xl border-2 border-sky-300 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setPhotoUrl(''); setPhotoPreview(''); }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <FileDropzone
                onFileSelect={(file) => uploadCandidateAsset(file, 'photo')}
                accept=".jpg,.jpeg,.png,.webp"
                title={isUploadingPhoto ? 'Uploading...' : l.uploadPhoto}
                subtitle={l.choose}
                className="min-h-[110px]"
              />
            )}
          </div>

          <TransliteratingTextInput
            label={l.slogan}
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
          />

          <TransliteratingTextArea
            label={l.manifesto}
            rows={3}
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              {t('noCancel')}
            </Button>
            <Button type="submit" variant="primary">
              {editingCandidate ? 'Save Changes' : t('addCandidate')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
