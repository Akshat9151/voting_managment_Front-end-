import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, BrandColor } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Palette, Calendar, UploadCloud, Save, Check, CreditCard, Moon, Sun } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { TransliteratingTextInput } from '../components/ui/TransliteratingTextInput';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Badge } from '../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { primaryColor, setPrimaryColor, theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'branding' | 'billing'>('branding');

  const [campaignName, setCampaignName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [electionDate, setElectionDate] = useState('');
  const [officialSymbol, setOfficialSymbol] = useState('');

  const swatches: { color: BrandColor; label: string }[] = [
    { color: '#0284c7', label: 'Sky Blue (Official)' },
    { color: '#7c3aed', label: 'Royal Violet' },
    { color: '#059669', label: 'Victory Mint' },
    { color: '#d97706', label: 'Saffron Amber' },
    { color: '#e11d48', label: 'Crimson Rose' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('allCampaignSettingsSaved'), 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-slate-100">
            {t('settingsBranding')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure campaign details, branding colors, and system preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('branding')}
          style={activeTab === 'branding' ? { borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' } : undefined}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'branding'
              ? 'border-brand-primary font-extrabold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Branding
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          style={activeTab === 'billing' ? { borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' } : undefined}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'billing'
              ? 'border-brand-primary font-extrabold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          {t('billingSubscription')}
        </button>
      </div>

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSave} className="space-y-6">
        {/* Dark Mode Toggle */}
        <Card className="space-y-4 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 dark:from-slate-800/80 dark:to-slate-900/80 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-violet-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Active)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {theme === 'dark' ? 'Easy on eyes during evening campaigns' : 'Bright & clear for daytime'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { toggleTheme(); showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode!`, 'success'); }}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </Card>

        {/* Brand Theme Swatches */}
        <Card className="space-y-4 dark:border-slate-700">
          <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span>Theme Accent Color (Instant Live Styling)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {swatches.map((swatch) => {
              const isSelected = primaryColor === swatch.color;
              return (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => { setPrimaryColor(swatch.color); showToast(`Theme changed to ${swatch.label}!`, 'success'); }}
                  style={isSelected ? { borderColor: swatch.color, boxShadow: `0 0 0 2px ${swatch.color}` } : undefined}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-800/90'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-white transition-transform hover:scale-110"
                    style={{ backgroundColor: swatch.color }}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{swatch.label}</span>
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
            <TransliteratingTextInput
              label="Campaign Title"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
            <TransliteratingTextInput
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
            onFileSelect={() => showToast(t('emblemLogoUploadedSuccessfully'), 'success')}
          />
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>
        </form>
      )}

      {/* Billing & Subscription Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 mb-4">
                {t('subscriptionPlan')}
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Choose a plan that best fits your campaign needs. Upgrade or downgrade anytime.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Plan */}
              <Card className="border-2 border-slate-200 hover:border-sky-400 transition-all space-y-4 relative">
                <div>
                  <h4 className="font-bold text-slate-900">{t('planBasic')}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">₹1,999</span>
                    <span className="text-xs text-slate-600">/month</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {t('planBasicFeatures')}
                </p>

                <Button
                  disabled
                  variant="outline"
                  className="w-full"
                >
                  {t('selectPlan')}
                </Button>
              </Card>

              {/* Professional Plan */}
              <Card className="border-2 border-sky-400 bg-sky-50 space-y-4 relative ring-2 ring-sky-400 ring-offset-2">
                <Badge className="absolute -top-3 -right-3 bg-sky-600">
                  Popular
                </Badge>
                <div>
                  <h4 className="font-bold text-slate-900">{t('planProfessional')}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">₹5,999</span>
                    <span className="text-xs text-slate-600">/month</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {t('planProFeatures')}
                </p>

                <Button
                  disabled
                  className="w-full"
                >
                  {t('comingSoon')}
                </Button>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2 border-slate-200 hover:border-emerald-400 transition-all space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">{t('planEnterprise')}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">₹12,999</span>
                    <span className="text-xs text-slate-600">/month+</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {t('planEnterpriseFeatures')}
                </p>

                <Button
                  disabled
                  variant="outline"
                  className="w-full"
                >
                  {t('comingSoon')}
                </Button>
              </Card>
            </div>
          </Card>

          {/* Current Subscription Info */}
          <Card className="space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">
              Current Subscription
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Plan:</span>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {t('planBasic')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Billing Cycle:</span>
                <span className="font-semibold text-slate-900">Monthly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Next Billing Date:</span>
                <span className="font-semibold text-slate-900">2026-09-18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Status:</span>
                <Badge className="bg-emerald-100 text-emerald-800">
                  Active
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
