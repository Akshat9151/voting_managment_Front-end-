import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toPng, toBlob } from 'html-to-image';
import { api, designTemplatesApi, usersApi } from '../services/api';
import { getCandidateStudioAutofill } from '../services/templateSelector';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useElection } from '../context/ElectionContext';
import {
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
import { TransliteratingTextInput, TransliteratingTextArea } from '../components/ui/TransliteratingTextInput';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Button } from '../components/ui/Button';
import { StudioTemplateRenderer, getTemplateDimensions } from '../components/studio/StudioTemplateRenderer';
import { DesignTemplate } from '../types';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const candidateIdParam = searchParams.get('candidateId');
  const templateIdParam = searchParams.get('templateId');

  const { t } = useLanguage();
  const { showToast } = useToast();
  const { activeElectionId } = useElection();
  const posterRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);

  // Dynamic templates from API
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // View state
  const [view, setView] = useState<'gallery' | 'editor'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [sharedDesigns, setSharedDesigns] = useState<any[]>([]);
  const [showSavedPosters, setShowSavedPosters] = useState(false);
  const [shareDesignId, setShareDesignId] = useState<string | null>(null);
  const [shareRecipientIds, setShareRecipientIds] = useState<string[]>([]);
  const [shareRecipients, setShareRecipients] = useState<any[]>([]);
  const [isSharingPoster, setIsSharingPoster] = useState(false);

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

  // Election symbol upload
  const [symbolUrl, setSymbolUrl] = useState<string | null>(null);
  const [symbolPreview, setSymbolPreview] = useState<string | null>(null);
  const [isUploadingSymbol, setIsUploadingSymbol] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const data = await designTemplatesApi.list();
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => getTemplateSortOrder(a) - getTemplateSortOrder(b));
          setTemplates(sorted);
          if (!selectedTemplate) {
            setSelectedTemplate(sorted[0]);
          }
        }
      } catch (err: any) {
        showToast(err?.response?.data?.detail || 'Unable to load studio templates.', 'error');
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, [showToast]);

  // Sync templateId with URL search params for browser back button support
  useEffect(() => {
    if (templateIdParam && templates.length > 0) {
      const found = templates.find((t) => t.id === templateIdParam || t.name.toLowerCase() === templateIdParam.toLowerCase());
      if (found) {
        setSelectedTemplate(found);
        setView('editor');
      }
    } else if (!candidateIdParam && !templateIdParam) {
      setView('gallery');
    }
  }, [templateIdParam, candidateIdParam, templates]);

  useEffect(() => {
    designTemplatesApi.listMyDesigns().then(setSavedDesigns).catch(() => setSavedDesigns([]));
    designTemplatesApi.listSharedDesigns().then(setSharedDesigns).catch(() => setSharedDesigns([]));
  }, [view, showSavedPosters]);

  useEffect(() => {
    const loadRecipients = async () => {
      try {
        const response = await usersApi.list({ page_size: 100 });
        const items = response?.items ?? [];
        const currentUser = JSON.parse(localStorage.getItem('ew_user') ?? 'null');
        setShareRecipients(items.filter((user: any) => user?.id && user.id !== currentUser?.id));
      } catch {
        setShareRecipients([]);
      }
    };
    loadRecipients();
  }, []);

  // Autofill candidate data when navigating from Candidate profile
  useEffect(() => {
    const loadCandidateData = async () => {
      if (!candidateIdParam) return;
      try {
        const candidates = await api.getCandidates(activeElectionId || undefined);
        const cand = Array.isArray(candidates) ? candidates.find((c: any) => c.id === candidateIdParam) : null;
        if (cand) {
          const autofill = getCandidateStudioAutofill(cand, templates.length > 0 ? templates : undefined);
          setCandidateName(autofill.candidateName);
          setPosition(autofill.position);
          setSlogan(autofill.slogan);

          // Extract ward number from constituency if available
          const wardMatch = cand.constituency?.match(/\d+/);
          if (wardMatch) {
            setWardNo(wardMatch[0]);
          } else if (cand.ward_no) {
            setWardNo(String(cand.ward_no));
          }

          if (cand.ballot_no || cand.ballotNo) {
            setBallotNo(String(cand.ballot_no || cand.ballotNo));
          }

          if (autofill.photoPreview) {
            const photoResolved = toAssetUrl(autofill.photoPreview);
            setCandidatePhotoUrl(photoResolved);
            setPhotoPreview(photoResolved);
          }

          // Autofill election symbol if present
          if (cand.symbol) {
            const symResolved = toAssetUrl(cand.symbol);
            setSymbolUrl(symResolved);
            setSymbolPreview(symResolved);
          }

          if (autofill.recommendedTemplate) {
            setSelectedTemplate(autofill.recommendedTemplate);
          }
          setView('editor');
          showToast(`Autofilled details for ${cand.name || 'Candidate'}`, 'info');
        }
      } catch (err) {
        console.error('Error loading candidate for design studio:', err);
      }
    };

    loadCandidateData();
  }, [candidateIdParam, templates, activeElectionId]);

  const handleSelectTemplate = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setView('editor');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('templateId', template.id || template.name);
      return next;
    });
  };

  const handleBackToGallery = () => {
    setView('gallery');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('templateId');
      next.delete('candidateId');
      return next;
    });
  };

  const handlePhotoUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    // Instant local blob preview for immediate UI feedback
    const localBlob = URL.createObjectURL(file);
    setCandidatePhotoUrl(localBlob);
    setPhotoPreview(localBlob);
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
      // Keep local blob so design preview continues to work
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSymbolUpload = async (file: File) => {
    setIsUploadingSymbol(true);
    // Instant local blob preview for immediate UI feedback
    const localBlob = URL.createObjectURL(file);
    setSymbolUrl(localBlob);
    setSymbolPreview(localBlob);
    try {
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file', 'error');
        setIsUploadingSymbol(false);
        return;
      }
      const uploaded = await designTemplatesApi.uploadAsset(file);
      const url = toAssetUrl(uploaded.url);
      setSymbolUrl(url);
      setSymbolPreview(url);
    } catch {
      // Keep local blob so design preview continues to work
    } finally {
      setIsUploadingSymbol(false);
    }
  };
  
  // Auto-fit preview scale to container width
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerW = previewContainerRef.current.clientWidth;
        const targetW = getTemplateDimensions(selectedTemplate).width;
        const calculated = Math.min(0.55, Math.max(0.18, (containerW - 32) / targetW));
        setPreviewScale(calculated);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [view, selectedTemplate]);

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
    return true;
  };

  const handleSaveDesign = async () => {
    if (isSavingDesign || isExporting) return;
    if (!validateForm()) return;

    setIsSavingDesign(true);
    try {
      const node = document.getElementById('poster-canvas-root');
      let previewImageUrl: string | undefined;
      if (node) {
        const blob = await toBlob(node, { pixelRatio: 1, cacheBust: true });
        if (blob) {
          const previewFile = new File([blob], `${candidateName.replace(/\s+/g, '_')}_poster.png`, { type: 'image/png' });
          const uploadedPreview = await designTemplatesApi.uploadAsset(previewFile);
          previewImageUrl = toAssetUrl(uploadedPreview.url);
        }
      }

      await designTemplatesApi.saveDesign({
        template_id: selectedTemplate?.id || '1080x1350-official-poster',
        election_id: activeElectionId || undefined,
        title: `${candidateName} - Campaign Poster`,
        form_data: {
          candidateName,
          position,
          wardNo,
          ballotNo,
          slogan,
          contactNumber,
          candidatePhotoUrl,
          symbolUrl,
        },
        preview_image_url: previewImageUrl
      });
      const refreshed = await designTemplatesApi.listMyDesigns();
      setSavedDesigns(refreshed);
      showToast(t('posterSavedLibrary'), 'success');
    } catch (err: any) {
      showToast('Failed to save design: ' + (err?.message || 'Server error'), 'error');
    } finally {
      setIsSavingDesign(false);
    }
  };

  const handleSharePoster = async () => {
    if (!shareDesignId || shareRecipientIds.length === 0) {
      showToast(t('noRecipientsFound'), 'error');
      return;
    }
    setIsSharingPoster(true);
    try {
      await designTemplatesApi.shareDesign(shareDesignId, shareRecipientIds);
      showToast(t('sharePosterSuccess'), 'success');
      setShareDesignId(null);
      setShareRecipientIds([]);
      const refreshed = await designTemplatesApi.listMyDesigns();
      setSavedDesigns(refreshed);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to share poster', 'error');
    } finally {
      setIsSharingPoster(false);
    }
  };

  const handleDownload = async () => {
    if (isExporting) return;
    if (!validateForm()) return;

    const node = document.getElementById('poster-canvas-root');
    if (!node) {
      showToast('Poster preview element not found.', 'error');
      return;
    }

    setIsExporting(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(Array.from(node.querySelectorAll('img')).map((image) => image.decode().catch(() => undefined)));
      const dims = getTemplateDimensions(selectedTemplate);
      const dataUrl = await toPng(node, {
        width: dims.width,
        height: dims.height,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: 'none', transformOrigin: 'top left' },
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${candidateName.replace(/\s+/g, '_')}_poster_${Date.now()}.png`;
      link.click();
      showToast(t('posterDownloadedSuccessfully'), 'success');
    } catch (err: any) {
      console.error('Poster export error:', err);
      showToast(t('posterDownloadFailed'), 'error');
    } finally {
      setIsExporting(false);
    }
  };

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
        <Button size="sm" variant="outline" onClick={() => setShowSavedPosters((value) => !value)}>
          {showSavedPosters ? t('studioTemplates') : t('savedPosters')}
        </Button>

        {showSavedPosters && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {savedDesigns.map((design) => (
                <Card key={design.id} className="space-y-3 p-3">
                  {design.preview_image_url && <img src={resolveAssetUrl(design.preview_image_url)} alt={design.title} className="aspect-[4/5] w-full rounded-lg object-cover border" />}
                  <div className="text-sm font-bold text-slate-900">{design.title}</div>
                  <div className="text-xs text-slate-500">{new Date(design.created_at).toLocaleString()}</div>
                  <div className="flex gap-2">
                    {design.preview_image_url && <a className="flex-1" href={resolveAssetUrl(design.preview_image_url)} download><Button size="sm" variant="primary" className="w-full">{t('download')}</Button></a>}
                    <Button size="sm" variant="outline" onClick={() => { setShareDesignId(design.id); setShareRecipientIds([]); }}> {t('sharePoster')} </Button>
                  </div>
                  <Button size="sm" variant="outline" onClick={async () => { await designTemplatesApi.deleteDesign(design.id); setSavedDesigns((items) => items.filter((item) => item.id !== design.id)); }}>{t('delete')}</Button>
                </Card>
              ))}
            </div>

            {sharedDesigns.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-slate-900">{t('sharedWithMe')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sharedDesigns.map((design) => (
                    <Card key={design.id} className="space-y-3 p-3">
                      {design.preview_image_url && <img src={resolveAssetUrl(design.preview_image_url)} alt={design.title} className="aspect-[4/5] w-full rounded-lg object-cover border" />}
                      <div className="text-sm font-bold text-slate-900">{design.title}</div>
                      <div className="text-xs text-slate-500">{new Date(design.created_at).toLocaleString()}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {shareDesignId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-base font-extrabold text-slate-900">{t('sharePosterTitle')}</h3>
              <div className="mt-4 space-y-3">
                {shareRecipients.length === 0 ? <p className="text-xs text-slate-500">{t('noRecipientsFound')}</p> : shareRecipients.map((user: any) => (
                  <label key={user.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm text-slate-700">
                    <input type="checkbox" checked={shareRecipientIds.includes(user.id)} onChange={(e) => {
                      setShareRecipientIds((prev) => e.target.checked ? [...prev, user.id] : prev.filter((id) => id !== user.id));
                    }} />
                    <span>{user.first_name} {user.last_name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-5 flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => { setShareDesignId(null); setShareRecipientIds([]); }}>{t('cancel')}</Button>
                <Button size="sm" variant="primary" onClick={handleSharePoster} disabled={isSharingPoster}>{isSharingPoster ? 'Sharing...' : t('sharePoster')}</Button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {t('campaignGallery')}
          </h2>
          {isLoadingTemplates ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...templates].sort((a, b) => getTemplateSortOrder(a) - getTemplateSortOrder(b)).map(template => (
                <Card key={template.id} className="p-4 space-y-3 hover:shadow-lg transition-all group cursor-pointer border-2 border-slate-200 hover:border-sky-400">
                  {getTemplateThumbnailUrl(template) && (
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <img
                        src={getTemplateThumbnailUrl(template)}
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
                    {t('useTemplate')}
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
            onClick={handleBackToGallery}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowSavedPosters(true); handleBackToGallery(); }}
          >
            {t('savedPosters')}
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-heading text-slate-900">
              {selectedTemplate?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{t('fillDetails')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDesign}
            disabled={isSavingDesign || isExporting}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            {isSavingDesign ? 'Saving...' : 'Save Design'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {isExporting ? 'Exporting...' : 'Download'}
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
            <TransliteratingTextInput
              label="Candidate Name *"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g., Rameshwar Patel"
              alwaysTransliterate={true}
              required
            />
            <TransliteratingTextInput
              label="Position / Post *"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Sarpanch, Panch, Councillor"
              alwaysTransliterate={true}
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
              type="tel"
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
            <TransliteratingTextArea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Enter your campaign slogan or message"
              className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none"
              alwaysTransliterate={true}
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
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="text-lg">🗳️</span>
              चुनाव चिह्न (Election Symbol)
            </h3>
            <p className="text-xs text-slate-600">
              JPG, PNG, WebP • Square format recommended, Max 5MB
            </p>
            {symbolPreview ? (
              <div className="flex gap-3 items-end">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-amber-300 shadow-sm flex-shrink-0 bg-amber-50">
                  <img
                    src={symbolPreview}
                    alt="Election Symbol"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setSymbolUrl(null); setSymbolPreview(null); }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ) : (
              <FileDropzone
                onFileSelect={handleSymbolUpload}
                accept=".jpg,.jpeg,.png,.webp"
                title={isUploadingSymbol ? 'Uploading...' : 'Upload election symbol'}
                subtitle="Drag & drop or click to browse"
                className="min-h-[120px]"
              />
            )}
          </Card>

        </div>

        {/* Right Col: Live Template Preview (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="sticky top-6 space-y-4 bg-slate-50/60 p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                Live Preview ({getTemplateDimensions(selectedTemplate).width} × {getTemplateDimensions(selectedTemplate).height})
              </span>
              <Badge variant="mint" className="text-[10px]">
                {selectedTemplate?.category?.toUpperCase() || 'OFFICIAL TEMPLATE'}
              </Badge>
            </div>

            <div
              ref={previewContainerRef}
              className="flex items-center justify-center bg-slate-200/50 rounded-xl border border-slate-200 p-2 overflow-hidden shadow-inner"
              style={{ minHeight: '560px' }}
            >
              <div
                style={{
                  width: `${getTemplateDimensions(selectedTemplate).width * previewScale}px`,
                  height: `${getTemplateDimensions(selectedTemplate).height * previewScale}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <StudioTemplateRenderer
                  ref={posterRef}
                  template={selectedTemplate}
                  candidateName={candidateName}
                  position={position}
                  wardNo={wardNo}
                  ballotNo={ballotNo}
                  slogan={slogan}
                  contactNumber={contactNumber}
                  photoUrl={photoPreview}
                  symbolUrl={symbolPreview}
                  scale={previewScale}
                />
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 font-medium">
              Updates in real-time • Auto-fits text without overlapping
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const resolveAssetUrl = (url: string): string => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/assets/')) return url;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('blob:')) return url;

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
  return `${apiBase.replace(/\/api\/v1\/?$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
};

const getTemplateSortOrder = (template: DesignTemplate): number => {
  const name = template.name.toLowerCase();
  const id = (template.id || '').toLowerCase();

  // Top 4 Main / Original Templates
  // 1. Campaign Poster
  if (name === 'campaign poster' || id === '1080x1350-official-poster' || (name.includes('poster') && !name.includes('youth') && !name.includes('vikas') && !name.includes('purple') && !name.includes('social') && !name.includes('rally'))) return 1;
  // 2. Campaign Pamphlet
  if (name === 'campaign pamphlet' || id.includes('pamphlet') || (name.includes('pamphlet') && !name.includes('patrika'))) return 2;
  // 3. Candidate ID Card
  if (name.includes('id card') || id.includes('id-card')) return 3;
  // 4. Campaign Banner
  if (name === 'campaign banner' || (name.includes('banner') && !name.includes('hoarding') && !name.includes('grand'))) return 4;

  // New 10 Templates follow below:
  if (name.includes('navy') || id.includes('navy')) return 10;
  if (name.includes('crimson') || id.includes('crimson') || name.includes('youth')) return 11;
  if (name.includes('emerald') || id.includes('emerald')) return 12;
  if (name.includes('tricolor') || id.includes('tricolor')) return 13;
  if (name.includes('purple') || id.includes('purple')) return 14;
  if (name.includes('maroon') || id.includes('maroon')) return 15;
  if (name.includes('whatsapp') || id.includes('whatsapp')) return 16;
  if (name.includes('square') || id.includes('square')) return 17;
  if (name.includes('hoarding') || id.includes('hoarding')) return 18;
  if (name.includes('patrika') || id.includes('patrika')) return 19;

  return 99;
};

const getTemplateThumbnailUrl = (template: DesignTemplate): string => {
  const name = template.name.toLowerCase();
  const id = (template.id || '').toLowerCase();

  // 4 Original Templates (check first)
  if (name === 'campaign poster' || id === '1080x1350-official-poster' || (name.includes('poster') && !name.includes('youth') && !name.includes('vikas') && !name.includes('purple') && !name.includes('social') && !name.includes('rally'))) return '/assets/Poster.png';
  if (name === 'campaign pamphlet' || (name.includes('pamphlet') && !name.includes('patrika'))) return '/assets/poster2.png';
  if (name.includes('id card') || id.includes('id-card')) return '/assets/Id%20Card.png';
  if (name === 'campaign banner' || (name.includes('banner') && !name.includes('hoarding') && !name.includes('grand'))) return '/assets/holdings.png';

  // 10 New Templates
  if (name.includes('navy') || id.includes('navy')) return '/assets/royal_navy_gold.png';
  if (name.includes('crimson') || id.includes('crimson') || name.includes('youth')) return '/assets/crimson_bold_youth.png';
  if (name.includes('emerald') || id.includes('emerald') || (name.includes('vikas') && name.includes('poster'))) return '/assets/emerald_gram_vikas.png';
  if (name.includes('tricolor') || id.includes('tricolor') || name.includes('gaurav')) return '/assets/tricolor_rashtriya_gaurav.png';
  if (name.includes('purple') || id.includes('purple') || name.includes('elite')) return '/assets/royal_purple_elite.png';
  if (name.includes('maroon') || id.includes('maroon') || name.includes('heritage')) return '/assets/maroon_heritage_sarpanch.png';
  if (name.includes('whatsapp') || id.includes('whatsapp') || name.includes('status')) return '/assets/whatsapp_status_story.png';
  if (name.includes('square') || id.includes('square') || name.includes('social')) return '/assets/square_social_post.png';
  if (name.includes('hoarding') || id.includes('hoarding') || (name.includes('grand') && name.includes('banner'))) return '/assets/grand_victory_hoarding.png';
  if (name.includes('patrika') || id.includes('patrika') || name.includes('manifesto')) return '/assets/gram_vikas_sankalp_patrika.png';

  if (template.thumbnail_url) return resolveAssetUrl(template.thumbnail_url);
  return '/assets/Poster.png';
};

const toAssetUrl = resolveAssetUrl;

