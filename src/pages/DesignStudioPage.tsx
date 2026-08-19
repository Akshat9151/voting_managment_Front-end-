import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { api } from '../services/api';
import { SYMBOLS_DATABASE, DESIGN_TEMPLATES, INITIAL_CANDIDATES } from '../services/mockData';
import { getCandidateStudioAutofill } from '../services/templateSelector';
import { generateAIBackground } from '../services/aiBackgroundService';
import { validateMediaFile } from '../services/mediaService';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useElection } from '../context/ElectionContext';
import {
  Search,
  Sparkles,
  Award,
  Download,
  ArrowLeft,
  X,
  Upload,
  User,
  Palette,
  Wand2,
  Image as ImageIcon,
  RotateCcw,
  Layers
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { FileDropzone } from '../components/ui/FileDropzone';
import { PosterTemplate } from '../components/studio/PosterTemplate';
import { Candidate, DesignTemplate, SymbolItem } from '../types';

export const DesignStudioPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();
  const [searchParams] = useSearchParams();
  const candidateIdParam = searchParams.get('candidateId');

  // Ref to the live HTML poster container for high-res export
  const posterRef = useRef<HTMLDivElement>(null);

  // Initial candidate resolution for zero-flicker 1-click arrival
  const initialCandidate = candidateIdParam
    ? INITIAL_CANDIDATES.find((c) => c.id === candidateIdParam)
    : null;
  const initialAutofill = initialCandidate
    ? getCandidateStudioAutofill(initialCandidate, DESIGN_TEMPLATES)
    : null;

  // View state
  const [view, setView] = useState<'gallery' | 'editor'>(() => {
    return candidateIdParam ? 'editor' : 'gallery';
  });
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'poster' | 'banner' | 'social' | 'pamphlet'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>(() => {
    return initialAutofill?.recommendedTemplate || DESIGN_TEMPLATES[0];
  });

  // Candidates list for quick auto-fill
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(() => {
    return candidateIdParam || '';
  });

  // Form Fields
  const [candidateName, setCandidateName] = useState(() =>
    initialAutofill ? initialAutofill.candidateName : 'विक्रम सिंह गुर्जर (Vikram Singh Gurjar)'
  );
  const [position, setPosition] = useState(() =>
    initialAutofill ? initialAutofill.position : 'सरपंच पद हेतु (Gram Panchayat Sarpanch)'
  );
  const [constituency, setConstituency] = useState(() =>
    initialAutofill ? initialAutofill.constituency : 'ग्राम पंचायत रामपुर (वार्ड सं. 02)'
  );
  const [headline, setHeadline] = useState('ग्राम पंचायत चुनाव 2026');
  const [slogan, setSlogan] = useState(() =>
    initialAutofill ? initialAutofill.slogan : 'युवा नेतृत्व, स्वच्छ पेयजल और पक्की सड़कें!'
  );
  const [votingDate, setVotingDate] = useState('मतदान: 28 अगस्त 2026 | प्रातः 8 से सायं 5 बजे');
  const [ballotNo, setBallotNo] = useState('01');

  // Symbol
  const [symbolTab, setSymbolTab] = useState<'preset' | 'custom'>('preset');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem>(() =>
    initialAutofill ? initialAutofill.symbolItem : SYMBOLS_DATABASE[0]
  );
  const [customSymbolName, setCustomSymbolName] = useState(() =>
    initialAutofill ? initialAutofill.customSymbolName : 'Tractor (ट्रैक्टर)'
  );
  const [symbolSearchQuery, setSymbolSearchQuery] = useState('');
  const [symbolPreview, setSymbolPreview] = useState<string | null>(null);

  // Photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(() =>
    initialAutofill
      ? initialAutofill.photoPreview
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // AI Background
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [aiBgPrompt, setAiBgPrompt] = useState('Indian election campaign festive tricolor background with gold accents');

  // Apply complete candidate details to form fields
  const applyCandidate = (
    cand: Candidate,
    options?: { autoSelectTemplate?: boolean; notify?: boolean }
  ) => {
    setSelectedCandidateId(cand.id);

    const autofill = getCandidateStudioAutofill(cand, DESIGN_TEMPLATES);

    setCandidateName(autofill.candidateName);
    setPosition(autofill.position);
    setConstituency(autofill.constituency);
    setSlogan(autofill.slogan);
    setSelectedSymbol(autofill.symbolItem);
    setCustomSymbolName(autofill.customSymbolName);
    setPhotoPreview(autofill.photoPreview);
    setSymbolTab('preset');

    if (options?.autoSelectTemplate) {
      setSelectedTemplate(autofill.recommendedTemplate);
      setView('editor');
    }

    if (options?.notify) {
      showToast(`Loaded profile for ${cand.name}!`, 'success');
    }
  };

  // Load existing candidates and handle candidateId URL query param
  useEffect(() => {
    let isMounted = true;

    const fetchCandidates = async () => {
      let candidateList = INITIAL_CANDIDATES;
      try {
        const data = await api.getCandidates(activeElectionId || undefined);
        if (Array.isArray(data) && data.length > 0) {
          candidateList = data;
          if (isMounted) {
            setCandidates(data);
          }
        }
      } catch (err) {
        console.error('Failed to load candidates for studio:', err);
      }

      if (candidateIdParam && isMounted) {
        const found =
          candidateList.find((c) => c.id === candidateIdParam) ||
          INITIAL_CANDIDATES.find((c) => c.id === candidateIdParam);

        if (found) {
          applyCandidate(found, { autoSelectTemplate: true, notify: true });
        }
      }
    };

    fetchCandidates();

    return () => {
      isMounted = false;
    };
  }, [activeElectionId, candidateIdParam]);

  // When candidate is selected from dropdown, pre-populate editor
  const handleCandidateChange = (candId: string) => {
    setSelectedCandidateId(candId);
    if (!candId) return;

    const cand =
      candidates.find((c) => c.id === candId) ||
      INITIAL_CANDIDATES.find((c) => c.id === candId);

    if (cand) {
      applyCandidate(cand, { autoSelectTemplate: false, notify: true });
    }
  };

  // Select a preset template from gallery
  const handleSelectTemplate = (tpl: DesignTemplate) => {
    setSelectedTemplate(tpl);
    setView('editor');
    showToast(`Loaded template: ${tpl.name}!`, 'success');
  };

  // Photo upload
  const handlePhotoUpload = (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file format', 'error');
        setIsUploadingPhoto(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPhotoPreview(url);
        showToast('Candidate photo updated successfully!', 'success');
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch {
      showToast('Failed to upload photo', 'error');
      setIsUploadingPhoto(false);
    }
  };

  // Custom symbol upload
  const handleSymbolUpload = (file: File) => {
    try {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setSymbolPreview(url);
        setSymbolTab('custom');
        showToast('Custom election symbol uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    } catch {
      showToast('Failed to upload symbol', 'error');
    }
  };

  // Generate AI Background
  const handleGenerateAIBackground = async () => {
    setIsGeneratingBg(true);
    showToast('Generating AI background backdrop... (Pollinations.ai)', 'info');

    try {
      const prompt = aiBgPrompt || `${selectedTemplate.category} election rally backdrop with vibrant Indian festive lighting`;
      const dataUrl = await generateAIBackground({
        prompt,
        width: selectedTemplate.layout_json.width || 600,
        height: selectedTemplate.layout_json.height || 848
      });

      setBackgroundImageUrl(dataUrl);
      showToast('AI Background generated successfully!', 'success');
    } catch (err: any) {
      console.error('AI background error:', err);
      showToast(err.message || 'Failed to generate AI background', 'error');
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // Download high-resolution PNG using html-to-image
  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      showToast('Exporting high-resolution 300 DPI poster...', 'info');
      
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        quality: 1.0
      });

      const link = document.createElement('a');
      const cleanName = candidateName.replace(/[^\w\u0900-\u097F]/g, '_');
      link.download = `ElectWin_${cleanName}_${selectedTemplate.category}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Poster downloaded successfully!', 'success');
    } catch (err: any) {
      console.error('Download error:', err);
      showToast('Failed to export poster image. Please try again.', 'error');
    }
  };

  // Values map for template placeholders
  const templateValues: Record<string, string> = {
    candidate_name: candidateName,
    position: position,
    constituency: constituency,
    headline: headline,
    slogan: slogan,
    voting_date: votingDate,
    ballot_no: ballotNo || '01',
    ward_no: constituency.match(/\d+/)?.[0] || '01',
    symbol_name: customSymbolName,
    symbol: symbolTab === 'custom' ? '🚜' : selectedSymbol.symbol,
    contact: '98290 14285'
  };

  const filteredTemplates = DESIGN_TEMPLATES.filter(tpl => {
    if (categoryFilter === 'all') return true;
    return tpl.category === categoryFilter;
  });

  const filteredSymbols = SYMBOLS_DATABASE.filter(s =>
    s.name.toLowerCase().includes(symbolSearchQuery.toLowerCase()) ||
    s.keywords.toLowerCase().includes(symbolSearchQuery.toLowerCase())
  );

  // Editor Preview Scaler
  const tplWidth = selectedTemplate.layout_json.width || 600;
  const tplHeight = selectedTemplate.layout_json.height || 848;
  const editorScale = Math.min(380 / tplWidth, 540 / tplHeight);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-slate-100">
              {t('navItemDesignStudio')}
            </h1>
            <Badge variant="cyan" className="text-xs">HTML5 / CSS + AI Engine</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, customize, AI-enhance, and export print-ready Indian election campaign posters, banners & voter slips.
          </p>
        </div>

        {view === 'editor' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('gallery')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Browse Gallery
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Poster (PNG)
            </Button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 1. GALLERY VIEW                                                            */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {view === 'gallery' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: '🌟 All Templates' },
              { id: 'poster', label: '📄 A4 / A5 Posters' },
              { id: 'banner', label: '⚡ Road Hoardings & Banners' },
              { id: 'social', label: '📱 WhatsApp & Insta Story' },
              { id: 'pamphlet', label: '🏷️ Panna Voter Slips' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Templates Grid with Live Scaled Miniatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(tpl => {
              const cardW = tpl.layout_json.width || 600;
              const cardH = tpl.layout_json.height || 848;
              const galleryScale = Math.min(280 / cardW, 180 / cardH);

              return (
                <Card
                  key={tpl.id}
                  variant="interactive"
                  className="group flex flex-col justify-between overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary transition-all p-0"
                >
                  {/* Live Rendered Miniature Thumbnail Header */}
                  <div className="h-52 relative overflow-hidden bg-slate-900/90 dark:bg-slate-950 flex items-center justify-center p-3 border-b border-slate-200 dark:border-slate-800">
                    <div
                      style={{
                        width: `${cardW * galleryScale}px`,
                        height: `${cardH * galleryScale}px`,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      className="rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 pointer-events-none select-none bg-white"
                    >
                      <div
                        style={{
                          width: `${cardW}px`,
                          height: `${cardH}px`,
                          transform: `scale(${galleryScale})`,
                          transformOrigin: 'top left',
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }}
                      >
                        <PosterTemplate
                          layout={tpl.layout_json}
                          values={templateValues}
                          photoUrl={photoPreview}
                          symbolMode="preset"
                          symbolValue={selectedSymbol.symbol}
                        />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white border border-white/20">
                        {tpl.format_name || 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-primary transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {tpl.format_dims || `${cardW} × ${cardH} px`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-brand-primary" />
                        {tpl.layout_json.elements.length} Smart Elements
                      </span>
                      <Badge variant="cyan" className="text-[10px] capitalize">
                        {tpl.category}
                      </Badge>
                    </div>

                    <div>
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full"
                        onClick={() => handleSelectTemplate(tpl)}
                        leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Customize Template
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 2. EDITOR VIEW                                                             */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {view === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Editor Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">

            {/* Quick Candidate Auto-Fill */}
            {(candidates.length > 0 || INITIAL_CANDIDATES.length > 0) && (
              <Card className="space-y-2.5 bg-gradient-to-br from-sky-50/60 to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 border border-sky-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Quick Autofill from Active Candidates</span>
                  </div>
                  <Badge variant="cyan" className="text-[10px]">1-Click Autofill</Badge>
                </div>
                <Select
                  value={selectedCandidateId}
                  onChange={(e) => handleCandidateChange(e.target.value)}
                >
                  <option value="">-- Choose Candidate to load details --</option>
                  {(candidates.length > 0 ? candidates : INITIAL_CANDIDATES).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.hindiName ? `(${c.hindiName})` : ''} - {c.post || 'Candidate'} ({c.symbol || '🚜'})
                    </option>
                  ))}
                </Select>
              </Card>
            )}

            {/* 1. Candidate Info Card */}
            <Card className="space-y-4 dark:border-slate-700">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-primary" />
                <span>1. Candidate & Campaign Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Candidate Name (प्रत्याशी का नाम) *"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="विक्रम सिंह गुर्जर (Vikram Singh Gurjar)"
                  required
                />
                <FormInput
                  label="Contesting Post (पद का नाम) *"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="सरपंच पद हेतु (Sarpanch)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Constituency / Ward (पंचायत / वार्ड) *"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  placeholder="ग्राम पंचायत रामपुर (वार्ड सं. 02)"
                  required
                />
                <FormInput
                  label="Header Headline (शीर्षक संदेश)"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="ग्राम पंचायत चुनाव 2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <FormInput
                    label="Campaign Slogan (प्रचार नारा)"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="युवा नेतृत्व, स्वच्छ पेयजल और पक्की सड़कें!"
                  />
                </div>
                <FormInput
                  label="Ballot Number (क्रम सं.)"
                  value={ballotNo}
                  onChange={(e) => setBallotNo(e.target.value)}
                  placeholder="01"
                />
              </div>

              <FormInput
                label="Voting Date & Polling Time (मतदान दिनांक व समय)"
                value={votingDate}
                onChange={(e) => setVotingDate(e.target.value)}
                placeholder="मतदान: 28 अगस्त 2026 | प्रातः 8 से सायं 5 बजे"
              />
            </Card>

            {/* 2. Candidate Photo Card */}
            <Card className="space-y-4 dark:border-slate-700">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand-primary" />
                <span>2. Candidate Portrait Photo</span>
              </h3>

              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Candidate Preview"
                      className="w-20 h-20 rounded-full object-cover border-4 border-amber-500 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-sm hover:bg-rose-700"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800 text-xs font-bold">
                    No Photo
                  </div>
                )}

                <div className="flex-1">
                  <FileDropzone
                    onFileSelect={handlePhotoUpload}
                    accept=".jpg,.jpeg,.png,.webp"
                    title={isUploadingPhoto ? 'Uploading...' : 'Upload Portrait Photo'}
                    subtitle="Auto-cropped cleanly into circle frame with zero distortion"
                    className="min-h-[90px] py-2"
                  />
                </div>
              </div>
            </Card>

            {/* 3. Symbol Card */}
            <Card className="space-y-4 dark:border-slate-700">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-primary" />
                <span>3. Official Election Symbol (चुनाव चिन्ह)</span>
              </h3>

              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                <button
                  type="button"
                  onClick={() => setSymbolTab('preset')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    symbolTab === 'preset'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Preset Symbols
                </button>
                <button
                  type="button"
                  onClick={() => setSymbolTab('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    symbolTab === 'custom'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Custom Symbol Upload
                </button>
              </div>

              {symbolTab === 'preset' ? (
                <div className="space-y-3">
                  <FormInput
                    placeholder="Search symbols (e.g. Tractor, Kisan, Torch, Sun, Car)..."
                    leftIcon={<Search className="w-4 h-4" />}
                    value={symbolSearchQuery}
                    onChange={(e) => setSymbolSearchQuery(e.target.value)}
                  />

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    {filteredSymbols.map(s => {
                      const isSelected = selectedSymbol.symbol === s.symbol;
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            setSelectedSymbol(s);
                            setCustomSymbolName(s.name);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'border-brand-primary bg-sky-50 dark:bg-sky-950/60 ring-2 ring-brand-primary'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100'
                          }`}
                          title={s.name}
                        >
                          <span className="text-2xl">{s.symbol}</span>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                            {s.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <FormInput
                    label="Symbol Display Name (चिन्ह का नाम)"
                    value={customSymbolName}
                    onChange={(e) => setCustomSymbolName(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <FileDropzone
                    onFileSelect={handleSymbolUpload}
                    accept=".jpg,.jpeg,.png,.webp"
                    title="Upload Custom Symbol PNG/JPG"
                    subtitle="Transparent background PNG recommended"
                    className="min-h-[100px]"
                  />
                  <FormInput
                    label="Custom Symbol Display Name"
                    value={customSymbolName}
                    onChange={(e) => setCustomSymbolName(e.target.value)}
                    placeholder="e.g. Tractor (ट्रैक्टर)"
                  />
                </div>
              )}
            </Card>

            {/* 4. AI Background Generator Card */}
            <Card className="space-y-4 bg-gradient-to-br from-amber-50/40 via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-amber-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-500" />
                  <span>4. AI Campaign Background Generator</span>
                </h3>
                <Badge variant="amber" className="text-[10px]">Free Pollinations.ai</Badge>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate high-resolution abstract election rally backdrops, saffron-green tricolor gradients, or golden celebration patterns with zero garbled text.
              </p>

              <div className="space-y-2">
                <FormInput
                  label="AI Prompt Description"
                  value={aiBgPrompt}
                  onChange={(e) => setAiBgPrompt(e.target.value)}
                  placeholder="e.g. Indian election campaign festive tricolor background with gold accents"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateAIBackground}
                  isLoading={isGeneratingBg}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {isGeneratingBg ? 'Generating...' : 'Generate AI Background'}
                </Button>

                {backgroundImageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBackgroundImageUrl(null)}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Reset Background
                  </Button>
                )}
              </div>

              {backgroundImageUrl && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Custom AI background is applied to live poster!</span>
                </div>
              )}
            </Card>

          </div>

          {/* Right Column: Live Sticky HTML/CSS Poster Preview (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="sticky top-20 space-y-4 bg-slate-50/90 dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                    Instant Live HTML/CSS Preview
                  </span>
                </div>
                <Badge variant="mint" className="text-[10px]">
                  {tplWidth} × {tplHeight} px
                </Badge>
              </div>

              {/* Poster Container with Responsive Scaled Preview */}
              <div className="flex items-center justify-center bg-slate-950/10 dark:bg-slate-950/60 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 min-h-[480px]">
                <div
                  className="rounded-xl shadow-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white"
                  style={{
                    width: `${tplWidth * editorScale}px`,
                    height: `${tplHeight * editorScale}px`,
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      width: `${tplWidth}px`,
                      height: `${tplHeight}px`,
                      transform: `scale(${editorScale})`,
                      transformOrigin: 'top left',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  >
                    <PosterTemplate
                      ref={posterRef}
                      layout={selectedTemplate.layout_json}
                      values={templateValues}
                      photoUrl={photoPreview}
                      symbolMode={symbolTab}
                      symbolValue={symbolTab === 'custom' && symbolPreview ? symbolPreview : selectedSymbol.symbol}
                      backgroundImageUrl={backgroundImageUrl}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full shadow-lg text-sm font-bold"
                  size="lg"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download High-Res 300 DPI Poster (PNG)
                </Button>
                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                  Exported at 3x pixel ratio with HTML text wrapping & AI background backdrop.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
