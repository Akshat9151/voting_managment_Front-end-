import React, { useState, useEffect, useRef } from 'react';
import { designTemplatesApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useElection } from '../context/ElectionContext';
import {
  Search,
  Sparkles,
  Award,
  ImageIcon,
  X,
  Download,
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormInput';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SymbolItem, DesignTemplate } from '../types';

const SYMBOLS_DATABASE: SymbolItem[] = [
  { symbol: '🚜', name: 'Tractor', keywords: 'tractor kisan village farmer' },
  { symbol: '🌾', name: 'Wheat', keywords: 'wheat farmer field crop' },
  { symbol: '☀️', name: 'Sun', keywords: 'sun light energy progress' },
  { symbol: '🔦', name: 'Torch', keywords: 'torch light service' },
  { symbol: '🪁', name: 'Kite', keywords: 'kite sky celebration' },
  { symbol: '☕', name: 'Tea', keywords: 'tea community people' },
  { symbol: '🪷', name: 'Lotus', keywords: 'lotus purity faith' },
  { symbol: '✋', name: 'Hand', keywords: 'hand support people' },
  { symbol: '🌹', name: 'Rose', keywords: 'rose growth hope' }
];

const validateMediaFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image must be smaller than 5MB.' };
  }
  return { valid: true };
};

export const DesignStudioPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic templates from API
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSavingDesign, setIsSavingDesign] = useState(false);

  // View state
  const [view, setView] = useState<'gallery' | 'editor'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const data = await designTemplatesApi.list();
        if (data && data.length > 0) {
          setTemplates(data);
        }
      } catch (err: any) {
        showToast(err?.response?.data?.detail || 'Unable to load studio templates.', 'error');
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, [showToast]);


  // Form state
  const [candidateName, setCandidateName] = useState('');
  const [position, setPosition] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [ballotNo, setBallotNo] = useState('');
  const [slogan, setSlogan] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // File uploads
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Symbol
  const [symbolTab, setSymbolTab] = useState<'preset' | 'custom'>('preset');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem>(SYMBOLS_DATABASE[0]);
  const [symbolSearchQuery, setSymbolSearchQuery] = useState('');
  const [symbolPreview, setSymbolPreview] = useState<string | null>(null);
  const [isUploadingSymbol, setIsUploadingSymbol] = useState(false);

  const filteredSymbols = SYMBOLS_DATABASE.filter(s =>
    s.name.toLowerCase().includes(symbolSearchQuery.toLowerCase()) ||
    s.keywords.toLowerCase().includes(symbolSearchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setView('editor');
    // Reset form
    setCandidateName('');
    setPosition('');
    setWardNo('');
    setBallotNo('');
    setSlogan('');
    setContactNumber('');
    setCandidatePhotoUrl(null);
    setPhotoPreview(null);
    setSymbolPreview(null);
    setSelectedSymbol(SYMBOLS_DATABASE[0]);
    setSymbolSearchQuery('');
  };

  const handlePhotoUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file', 'error');
        setIsUploadingPhoto(false);
        return;
      }

      const uploaded = await designTemplatesApi.uploadAsset(file);
      const url = toAssetUrl(uploaded.url);
      setCandidatePhotoUrl(url);
      setPhotoPreview(url);
      showToast(t('photoUploadedSuccessfully'), 'success');
    } catch (err: any) {
      showToast(t('photoUploadFailed'), 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSymbolUpload = async (file: File) => {
    setIsUploadingSymbol(true);
    try {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file', 'error');
        setIsUploadingSymbol(false);
        return;
      }

      const uploaded = await designTemplatesApi.uploadAsset(file);
      setSymbolPreview(toAssetUrl(uploaded.url));
      showToast(t('symbolUploadedSuccessfully'), 'success');
    } catch (err: any) {
      showToast(t('symbolUploadFailed'), 'error');
    } finally {
      setIsUploadingSymbol(false);
    }
  };

  const validateForm = (): boolean => {
    if (!candidateName.trim()) {
      showToast(t('candidateNameRequired'), 'error');
      return false;
    }
    if (!position.trim()) {
      showToast(t('positionRequired'), 'error');
      return false;
    }
    if (!wardNo.trim()) {
      showToast(t('wardNumberRequired'), 'error');
      return false;
    }
    if (!candidatePhotoUrl && !photoPreview) {
      showToast(t('candidatePhotoRequired'), 'error');
      return false;
    }
    return true;
  };

  const handleSaveDesign = async () => {
    if (!selectedTemplate) return;
    if (!validateForm()) return;

    setIsSavingDesign(true);
    try {
      const canvas = canvasRef.current;
      let previewImageUrl: string | undefined;
      if (canvas) {
        const previewFile = await canvasToFile(canvas, `${candidateName.replace(/\s+/g, '_')}_design.png`);
        const uploadedPreview = await designTemplatesApi.uploadAsset(previewFile);
        previewImageUrl = toAssetUrl(uploadedPreview.url);
      }

      await designTemplatesApi.saveDesign({
        template_id: selectedTemplate.id,
        election_id: activeElectionId || undefined,
        title: `${candidateName} - ${selectedTemplate.name}`,
        form_data: {
          candidateName,
          position,
          wardNo,
          ballotNo,
          slogan,
          contactNumber,
          candidatePhotoUrl,
          symbol: symbolTab === 'preset' ? selectedSymbol?.symbol : symbolPreview,
          symbolName: symbolTab === 'preset' ? selectedSymbol?.name : 'Custom symbol',
        },
        preview_image_url: previewImageUrl
      });
      showToast('Poster design saved to your library!', 'success');
    } catch (err: any) {
      showToast('Failed to save design: ' + (err?.message || 'Server error'), 'error');
    } finally {
      setIsSavingDesign(false);
    }
  };

  const handleDownload = async () => {
    if (!validateForm()) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      showToast(t('canvasNotReady'), 'error');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${candidateName.replace(/\s+/g, '_')}_poster_${Date.now()}.png`;
      link.click();
      showToast(t('posterDownloadedSuccessfully'), 'success');
    } catch (err) {
      showToast(t('posterDownloadFailed'), 'error');
    }
  };

  if (!activeElectionId) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">{t('studioTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('studioSub')}</p>
        </div>
        <EmptyState
          icon={Sparkles}
          title={t('studioEmptyTitle')}
          description={t('studioEmptyDesc')}
        />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // GALLERY VIEW
  // ──────────────────────────────────────────────────────────────────────────────
  if (view === 'gallery') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('studioTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('studioSub')}</p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Campaign Gallery – Choose Your Template
          </h2>
          {isLoadingTemplates ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="p-4 space-y-3 hover:shadow-lg transition-all group cursor-pointer border-2 border-slate-200 hover:border-sky-400">
                  {template.thumbnail_url && (
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <img
                        src={resolveAssetUrl(template.thumbnail_url)}
                        alt={template.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{template.name}</h3>
                    <p className="text-xs text-slate-500">{template.format_name}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="cyan" className="text-[10px]">{template.category.toUpperCase()}</Badge>
                      <Badge variant="mint" className="text-[10px]">{template.format_dims}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Use Template
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // EDITOR VIEW
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('gallery')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-heading text-slate-900">
              {selectedTemplate?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to customize your poster</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDesign}
            disabled={isSavingDesign}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            {isSavingDesign ? 'Saving...' : 'Save Design'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>
      </div>


      {/* Main Editor: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Basic Info */}
          <Card className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              Basic Information
            </h3>
            <FormInput
              label="Candidate Name *"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g., Rameshwar Patel"
              required
            />
            <FormInput
              label="Position / Post *"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Sarpanch, Panch, Councillor"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Ward Number *"
                type="number"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
                placeholder="e.g., 4"
                required
              />
              <FormInput
                label="Ballot Number"
                type="number"
                value={ballotNo}
                onChange={(e) => setBallotNo(e.target.value)}
                placeholder="e.g., 001"
              />
            </div>
            <FormInput
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+91 98XXXX XXXX"
            />
          </Card>

          {/* Campaign Message */}
          <Card className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">
              Campaign Message / नारा
            </h3>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Enter your campaign slogan or message"
              className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none"
              rows={3}
            />
            <p className="text-[11px] text-slate-500">
              Keep it short and impactful - max 100 characters recommended
            </p>
          </Card>

          {/* Candidate Photo */}
          <Card className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-600" />
              Candidate Photo *
            </h3>
            <p className="text-xs text-slate-600">
              JPG, PNG, WebP • Recommended: Square format, Max 5MB
            </p>
            {photoPreview ? (
              <div className="flex gap-3 items-end">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-sky-300 shadow-sm flex-shrink-0">
                  <img
                    src={photoPreview}
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCandidatePhotoUrl(null);
                    setPhotoPreview(null);
                  }}
                  disabled={isUploadingPhoto}
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <FileDropzone
                onFileSelect={handlePhotoUpload}
                accept=".jpg,.jpeg,.png,.webp"
                title={isUploadingPhoto ? 'Uploading...' : 'Upload candidate photo'}
                subtitle="Drag & drop or click to browse"
                className="min-h-[120px]"
              />
            )}
          </Card>

          {/* Election Symbol */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Election Symbol
              </h3>
              <span className="text-[10px] font-bold text-slate-500">
                {symbolTab === 'preset' && selectedSymbol ? (
                  <>Selected: {selectedSymbol.symbol}</>
                ) : (
                  <>Custom Upload</>
                )}
              </span>
            </div>

            {/* Symbol Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setSymbolTab('preset')}
                className={`px-3 py-2 text-xs font-bold transition-all relative ${
                  symbolTab === 'preset'
                    ? 'text-sky-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Preset Symbols
                {symbolTab === 'preset' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600" />
                )}
              </button>
              <button
                onClick={() => setSymbolTab('custom')}
                className={`px-3 py-2 text-xs font-bold transition-all relative ${
                  symbolTab === 'custom'
                    ? 'text-sky-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Upload
                {symbolTab === 'custom' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600" />
                )}
              </button>
            </div>

            {/* Preset Symbols */}
            {symbolTab === 'preset' && (
              <>
                <FormInput
                  placeholder="Search symbols..."
                  leftIcon={<Search className="w-4 h-4" />}
                  value={symbolSearchQuery}
                  onChange={(e) => setSymbolSearchQuery(e.target.value)}
                />
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {filteredSymbols.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => { setSelectedSymbol(item); setSymbolTab('preset'); }}
                      className={`p-2 rounded-lg border text-center transition-all text-lg ${
                        selectedSymbol.symbol === item.symbol
                          ? 'border-sky-500 bg-sky-100 ring-2 ring-sky-400'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                      title={item.name}
                    >
                      {item.symbol}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Custom Symbol */}
            {symbolTab === 'custom' && (
              <>
                {symbolPreview ? (
                  <div className="flex gap-3 items-end">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-sky-300 shadow-sm flex-shrink-0">
                      <img
                        src={symbolPreview}
                        alt="Custom Symbol"
                        className="w-full h-full object-contain bg-white"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSymbolPreview(null);
                      }}
                      disabled={isUploadingSymbol}
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <FileDropzone
                    onFileSelect={handleSymbolUpload}
                    accept=".jpg,.jpeg,.png,.webp"
                    title={isUploadingSymbol ? 'Uploading...' : 'Upload custom symbol'}
                    subtitle="Drag & drop or click to browse"
                    className="min-h-[100px]"
                  />
                )}
              </>
            )}
          </Card>
        </div>

        {/* Right Col: Live Canvas Preview (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="sticky top-6 space-y-4 bg-slate-50/60 p-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                Live Preview
              </span>
              <Badge variant="mint" className="text-[10px]">
                High-Res
              </Badge>
            </div>

            <div className="flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[600px] rounded-lg border border-slate-200 shadow-sm"
                style={{ background: '#fff' }}
              />
            </div>

            <div className="text-center text-xs text-slate-600">
              Updates as you fill in the form above
            </div>
          </Card>
        </div>
      </div>

      {/* Mock Canvas Renderer - Update canvas as form changes */}
      <RenderCanvas
        canvasRef={canvasRef}
        candidateName={candidateName}
        position={position}
        wardNo={wardNo}
        ballotNo={ballotNo}
        slogan={slogan}
        contactNumber={contactNumber}
        photoUrl={photoPreview}
        symbolMode={symbolTab}
        symbolValue={symbolTab === 'preset' ? selectedSymbol.symbol : (symbolPreview || '')}
        templateLayout={selectedTemplate?.layout_json}
      />
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// CANVAS RENDERING HELPER
// ────────────────────────────────────────────────────────────────────────────────
interface RenderCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  candidateName: string;
  position: string;
  wardNo: string;
  ballotNo: string;
  slogan: string;
  contactNumber: string;
  photoUrl: string | null;
  symbolMode: 'preset' | 'custom';
  symbolValue: string;
  templateLayout?: any;
}

const RenderCanvas: React.FC<RenderCanvasProps> = ({
  canvasRef,
  candidateName,
  position,
  wardNo,
  ballotNo,
  slogan,
  contactNumber,
  photoUrl,
  symbolMode,
  symbolValue,
  templateLayout
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !templateLayout) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const w = templateLayout.width || 600;
    const h = templateLayout.height || 848;
    canvas.width = w;
    canvas.height = h;

    let cancelled = false;
    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = resolveAssetUrl(src);
    });

    const render = async () => {
      ctx.fillStyle = templateLayout.bg_color || '#ffffff';
      ctx.fillRect(0, 0, w, h);

      const elements = [...(templateLayout.elements || [])].sort((a: any, b: any) => (a.z_index || 0) - (b.z_index || 0));
      for (const el of elements) {
        if (cancelled) return;
        ctx.save();
        if (el.type === 'shape') {
          ctx.fillStyle = el.color || '#000000';
          ctx.fillRect(el.x, el.y, el.width, el.height);
        } else if (el.type === 'text') {
          ctx.fillStyle = el.color || '#000000';
          ctx.font = `${el.font_weight || 'normal'} ${el.font_size || 16}px sans-serif`;
          const textAlign = (el.text_align as CanvasTextAlign) || 'left';
          ctx.textAlign = textAlign;
          ctx.textBaseline = 'top';
          const values: Record<string, string> = {
            candidate_name: candidateName,
            position,
            ward_no: wardNo,
            ballot_no: ballotNo,
            slogan,
            contact: contactNumber,
          };
          const sourceText = el.placeholder || el.value || '';
          const text = sourceText.replace(/\{\{\s*([\w]+)\s*\}\}/g, (_match: string, key: string) => values[key] ?? '').trim();
          const textX = textAlign === 'center' ? el.x + (el.width || 0) / 2 : textAlign === 'right' ? el.x + (el.width || 0) : el.x;
          if (text) ctx.fillText(text, textX, el.y, el.width || undefined);
        } else if (el.type === 'symbol' && symbolValue) {
          if (symbolMode === 'preset') {
            ctx.font = `${el.font_size || 48}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000000';
            ctx.fillText(symbolValue, el.x + el.width / 2, el.y + el.height / 2);
          } else {
            try {
              const image = await loadImage(symbolValue);
              ctx.drawImage(image, el.x, el.y, el.width, el.height);
            } catch { /* Keep rendering the rest of the template. */ }
          }
        } else if (el.type === 'photo' && photoUrl) {
          try {
            const image = await loadImage(photoUrl);
            ctx.beginPath();
            ctx.arc(el.x + el.width / 2, el.y + el.height / 2, Math.min(el.width, el.height) / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(image, el.x, el.y, el.width, el.height);
          } catch { /* Keep rendering the rest of the template. */ }
        }
        ctx.restore();
      }
    };

    void render();
    return () => { cancelled = true; };
  }, [canvasRef, candidateName, position, wardNo, ballotNo, slogan, contactNumber, photoUrl, symbolMode, symbolValue, templateLayout]);

  return null;
};

const resolveAssetUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/assets/')) return url;
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
  return `${apiBase.replace(/\/api\/v1\/?$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
};

const toAssetUrl = resolveAssetUrl;

const canvasToFile = (canvas: HTMLCanvasElement, fileName: string): Promise<File> => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (!blob) {
      reject(new Error('Unable to create poster preview.'));
      return;
    }
    resolve(new File([blob], fileName, { type: 'image/png' }));
  }, 'image/png');
});
