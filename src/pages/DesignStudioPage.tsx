import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Sparkles,
  Maximize2,
  Award
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { PosterCanvas } from '../components/studio/PosterCanvas';
import {
  SYMBOLS_DATABASE,
  LAYOUT_STYLES,
  FORMAT_DIMENSIONS
} from '../services/mockData';
import { Candidate, SymbolItem, LayoutStyle, FormatDimension } from '../types';

export const DesignStudioPage: React.FC = () => {
  const { t } = useLanguage();
  const { primaryColor } = useTheme();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Studio selections
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem>(SYMBOLS_DATABASE[0]);
  const [selectedLayout] = useState<LayoutStyle>(LAYOUT_STYLES[0]);
  const [selectedFormat, setSelectedFormat] = useState<FormatDimension>(FORMAT_DIMENSIONS[0]);
  const [slogan, setSlogan] = useState('गांव का समग्र विकास, हर घर विश्वास और खुशहाली!');
  const [customHeadline, setCustomHeadline] = useState('ग्राम पंचायत चुनाव 2026');
  const [symbolSearchQuery, setSymbolSearchQuery] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const data = await api.getCandidates();
    setCandidates(data);
    if (data.length > 0) {
      setSelectedCandidate(data[0]);
      setSlogan(data[0].slogan);
    }
  };

  const handleCandidateChange = (candId: string) => {
    const cand = candidates.find(c => c.id === candId);
    if (cand) {
      setSelectedCandidate(cand);
      setSlogan(cand.slogan);
      const matchedSymbol = SYMBOLS_DATABASE.find(s => s.symbol === cand.symbol);
      if (matchedSymbol) setSelectedSymbol(matchedSymbol);
    }
  };

  const filteredSymbols = SYMBOLS_DATABASE.filter(s =>
    s.name.toLowerCase().includes(symbolSearchQuery.toLowerCase()) ||
    s.keywords.toLowerCase().includes(symbolSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('studioTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('studioSub')}</p>
        </div>

        <Badge variant="purple" className="px-3 py-1 text-xs">
          50+ Official EC Symbols Available
        </Badge>
      </div>

      {/* Main Studio Workspace: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Controls & Asset Pickers (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Candidate & Slogan Selector */}
          <Card className="space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>1. Contesting Candidate &amp; Slogan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Select Contesting Profile"
                value={selectedCandidate?.id || ''}
                onChange={(e) => handleCandidateChange(e.target.value)}
              >
                {candidates.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.post})
                  </option>
                ))}
              </Select>

              <FormInput
                label="Banner Headline"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
              />
            </div>

            <FormInput
              label="Campaign Slogan / नारा"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
            />
          </Card>

          {/* 50+ Official Election Commission Symbols Search */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. Official Election Commission Symbol</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                Selected: {selectedSymbol.symbol} {selectedSymbol.name.split(' ')[0]}
              </span>
            </div>

            <FormInput
              placeholder="Search 50+ symbols (e.g. tractor, wheat, torch, kite, fan, gas)..."
              leftIcon={<Search className="w-4 h-4" />}
              value={symbolSearchQuery}
              onChange={(e) => setSymbolSearchQuery(e.target.value)}
            />

            {/* Symbols Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[190px] overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {filteredSymbols.map((item) => {
                const isSelected = selectedSymbol.symbol === item.symbol;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedSymbol(item)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[58px] ${
                      isSelected
                        ? 'border-sky-500 bg-sky-100 text-sky-900 ring-2 ring-sky-400 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{item.symbol}</span>
                    <span className="text-[9px] font-semibold text-slate-700 truncate w-full mt-0.5">
                      {item.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Format & Dimensions Selector */}
          <Card className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-violet-600" />
              <span>3. Print &amp; Digital Dimensions</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FORMAT_DIMENSIONS.map((f) => {
                const isSelected = selectedFormat.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormat(f)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50/50 shadow-xs ring-1 ring-violet-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{f.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{f.dims}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Interactive Canvas Render & Download (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="flex flex-col items-center justify-center space-y-4 bg-slate-50/60 p-4 sm:p-6">
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                Live High-Res Canvas Preview
              </span>
              <Badge variant="mint" size="sm">
                Ready for Print / Social
              </Badge>
            </div>

            {selectedCandidate ? (
              <PosterCanvas
                candidate={selectedCandidate}
                symbol={selectedSymbol.symbol}
                symbolName={selectedSymbol.name}
                layout={selectedLayout}
                format={selectedFormat}
                slogan={slogan}
                customHeadline={customHeadline}
                accentColor={primaryColor}
              />
            ) : (
              <div className="py-12 text-xs text-slate-400">Loading canvas...</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
