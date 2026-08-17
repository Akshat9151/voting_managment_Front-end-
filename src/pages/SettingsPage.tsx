import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, BrandColor } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Palette, Calendar, UploadCloud, Save, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { primaryColor, setPrimaryColor } = useTheme();
  const { showToast } = useToast();

  const [campaignName, setCampaignName] = useState('Gram Panchayat Rampur Election War Room');
  const [candidateName, setCandidateName] = useState('Rameshwar Patel');
  const [electionDate, setElectionDate] = useState('2026-08-28');
  const [officialSymbol, setOfficialSymbol] = useState('🚜');

  const swatches: { color: BrandColor; label: string }[] = [
    { color: '#0284c7', label: 'Sky Blue (Official)' },
    { color: '#7c3aed', label: 'Royal Violet' },
    { color: '#059669', label: 'Victory Mint' },
    { color: '#d97706', label: 'Saffron Amber' },
    { color: '#e11d48', label: 'Crimson Rose' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform branding & campaign preferences saved!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('settingsBranding')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure campaign details, branding colors, and system preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Theme Swatches */}
        <Card className="space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-sky-600" />
            <span>Theme Accent Color (Instant Live Styling)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {swatches.map((swatch) => {
              const isSelected = primaryColor === swatch.color;
              return (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => setPrimaryColor(swatch.color)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isSelected ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-white"
                    style={{ backgroundColor: swatch.color }}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">{swatch.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Campaign Metadata */}
        <Card className="space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-600" />
            <span>Election War Room Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Campaign Title"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
            <FormInput
              label="Contesting Candidate"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Polling / Election Date"
              type="date"
              value={electionDate}
              onChange={(e) => setElectionDate(e.target.value)}
            />
            <Select
              label="Default Official Symbol"
              value={officialSymbol}
              onChange={(e) => setOfficialSymbol(e.target.value)}
            >
              <option value="🚜">🚜 Tractor (ट्रैक्टर)</option>
              <option value="🌾">🌾 Farmer (किसान)</option>
              <option value="☀️">☀️ Sun (सूरज)</option>
              <option value="🔦">🔦 Torch (मशाल)</option>
            </Select>
          </div>
        </Card>

        {/* Logo Upload */}
        <Card className="space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            <span>Official Candidate Logo / Seal</span>
          </h3>
          <FileDropzone
            title="Upload party seal or official candidate emblem"
            subtitle="PNG or SVG format with transparent background recommended"
            onFileSelect={() => showToast('Emblem logo uploaded successfully!', 'success')}
          />
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
