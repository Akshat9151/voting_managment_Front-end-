import { Candidate, DesignTemplate, SymbolItem } from '../types';

const DESIGN_TEMPLATES: DesignTemplate[] = [];
const SYMBOLS_DATABASE: SymbolItem[] = [
  { symbol: '🚜', name: 'Tractor', keywords: 'tractor farming agriculture' },
  { symbol: '🌾', name: 'Wheat', keywords: 'wheat farming crop' },
  { symbol: '🌳', name: 'Tree', keywords: 'tree nature environment' },
];

/**
 * Deterministic rule-based template selector for 1-Click Poster Generation.
 *
 * Rules:
 * 1. postType === 'sarpanch':
 *    - Prefers the 'poster' category template (e.g. A4/A5 Tricolor Grand Poster).
 *    - Reasoning: Sarpanch elections are panchayat-wide campaigns requiring high-visibility,
 *      official, and formal print posters with bold candidate portraits and clear symbols.
 *
 * 2. postType === 'panch':
 *    - Prefers the 'pamphlet' or 'social' category template (e.g. A5 Manifesto Handbill or Panna Slip).
 *    - Reasoning: Ward Panch elections are ultra-local, door-to-door grassroots campaigns
 *      benefiting from compact voter slips, local agenda checklists, and mobile-friendly formats.
 *
 * 3. Fallback:
 *    - Returns DESIGN_TEMPLATES[0] if no specific rule matches or template list is custom.
 */
export function getDefaultTemplateForCandidate(
  candidate?: Partial<Candidate> | null,
  templates: DesignTemplate[] = DESIGN_TEMPLATES
): DesignTemplate {
  if (!templates || templates.length === 0) {
    throw new Error('No design templates available');
  }

  if (!candidate) {
    return templates[0];
  }

  const postType = (candidate.postType || '').toLowerCase();

  switch (postType) {
    case 'sarpanch': {
      // Prefer formal high-visibility A4/A5 print poster for sarpanch campaigns
      const sarpanchTpl =
        templates.find((t) => t.category === 'poster' && t.id === 'template-poster-tricolor') ||
        templates.find((t) => t.category === 'poster');
      return sarpanchTpl || templates[0];
    }

    case 'panch': {
      // Prefer grassroots manifesto pamphlet / voter slip for ward-level outreach
      const panchTpl =
        templates.find((t) => t.category === 'pamphlet' && t.id === 'template-pamphlet-handbill-duo') ||
        templates.find((t) => t.category === 'pamphlet') ||
        templates.find((t) => t.category === 'social');
      return panchTpl || templates[0];
    }

    default: {
      // If postType is missing or generic, check candidate post text for clues
      const postText = (candidate.post || '').toLowerCase();
      if (postText.includes('sarpanch')) {
        const sarpanchTpl = templates.find((t) => t.category === 'poster');
        if (sarpanchTpl) return sarpanchTpl;
      } else if (postText.includes('panch') || postText.includes('ward')) {
        const pamphletTpl =
          templates.find((t) => t.category === 'pamphlet') ||
          templates.find((t) => t.category === 'social');
        if (pamphletTpl) return pamphletTpl;
      }

      // Default fallback
      return templates[0];
    }
  }
}

/**
 * Format candidate display name:
 * Prefers "{hindiName} ({name})" if both exist and differ,
 * otherwise whichever is present, with fallback.
 */
export function formatCandidateDisplayName(cand?: Partial<Candidate> | null): string {
  if (!cand) return 'विक्रम सिंह गुर्जर (Vikram Singh Gurjar)';
  const hindi = cand.hindiName?.trim();
  const name = cand.name?.trim();

  if (hindi && name && hindi !== name) {
    return `${hindi} (${name})`;
  }
  return hindi || name || 'प्रत्याशी (Candidate)';
}

/**
 * Format candidate contesting post / position with respectful suffix
 */
export function formatCandidatePosition(cand?: Partial<Candidate> | null): string {
  if (!cand) return 'सरपंच पद हेतु (Sarpanch)';
  const post = (cand.post || '').trim();
  const postType = (cand.postType || '').toLowerCase();

  if (postType === 'sarpanch' || post.toLowerCase().includes('sarpanch')) {
    return 'सरपंच पद हेतु (Sarpanch)';
  }
  if (postType === 'panch' || post.toLowerCase().includes('panch')) {
    return 'वार्ड पंच पद हेतु (Ward Panch)';
  }

  if (post) {
    if (post.includes('पद') || post.includes('हेतु')) {
      return post;
    }
    return `${post} पद हेतु`;
  }

  return 'प्रत्याशी (Candidate)';
}

/**
 * Format candidate constituency with sensible fallback
 */
export function formatCandidateConstituency(cand?: Partial<Candidate> | null): string {
  if (!cand) return 'ग्राम पंचायत रामपुर (वार्ड सं. 02)';
  return cand.constituency?.trim() || 'ग्राम पंचायत रामपुर (वार्ड सं. 02)';
}

/**
 * Format candidate campaign slogan with sensible fallback
 */
export function formatCandidateSlogan(cand?: Partial<Candidate> | null): string {
  if (!cand) return 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!';
  return cand.slogan?.trim() || 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!';
}

/**
 * Resolve candidate official election symbol from database
 */
export function resolveCandidateSymbol(cand?: Partial<Candidate> | null): {
  symbolItem: SymbolItem;
  customSymbolName: string;
} {
  const defaultSymbol = SYMBOLS_DATABASE[0]; // 🚜 Tractor
  if (!cand) {
    return {
      symbolItem: defaultSymbol,
      customSymbolName: defaultSymbol.name
    };
  }

  const candSymbol = cand.symbol?.trim();
  const candSymbolName = cand.symbolName?.trim();

  let matched: SymbolItem | undefined;

  // 1. Direct emoji/character match
  if (candSymbol) {
    matched = SYMBOLS_DATABASE.find((s) => s.symbol === candSymbol);
  }

  // 2. Keyword or symbol name match
  if (!matched && (candSymbolName || candSymbol)) {
    const query = (candSymbolName || candSymbol || '').toLowerCase();
    matched = SYMBOLS_DATABASE.find(
      (s) => s.name.toLowerCase().includes(query) || s.keywords.toLowerCase().includes(query)
    );
  }

  const symbolItem = matched || defaultSymbol;
  const customSymbolName = candSymbolName || (matched ? matched.name : (candSymbol || symbolItem.name));

  return {
    symbolItem,
    customSymbolName
  };
}

/**
 * Complete autofill bundle for the Design Studio
 */
export interface CandidateAutofillData {
  candidateName: string;
  position: string;
  constituency: string;
  slogan: string;
  symbolItem: SymbolItem;
  customSymbolName: string;
  photoPreview: string | null;
  recommendedTemplate: DesignTemplate;
}

export function getCandidateStudioAutofill(
  cand: Partial<Candidate> | null | undefined,
  templates: DesignTemplate[] = DESIGN_TEMPLATES
): CandidateAutofillData {
  const { symbolItem, customSymbolName } = resolveCandidateSymbol(cand);

  return {
    candidateName: formatCandidateDisplayName(cand),
    position: formatCandidatePosition(cand),
    constituency: formatCandidateConstituency(cand),
    slogan: formatCandidateSlogan(cand),
    symbolItem,
    customSymbolName,
    photoPreview: cand?.photo?.trim() || null,
    recommendedTemplate: getDefaultTemplateForCandidate(cand, templates)
  };
}
