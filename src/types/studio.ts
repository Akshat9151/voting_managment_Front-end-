export interface SymbolItem {
  symbol: string;
  name: string;
  keywords: string;
}

export interface LayoutStyle {
  id: string;
  name: string;
  desc: string;
  category: string;
}

// ── DB-backed template types (from backend DesignTemplateResponse) ────────────
export interface TemplateElement {
  type: 'text' | 'image' | 'shape' | 'symbol' | 'photo';
  x: number;
  y: number;
  width: number;
  height: number;
  placeholder?: string | null;   // e.g. "{{candidate_name}}"
  value?: string | null;         // static text
  font_size?: number | null;
  font_weight?: string | null;
  color?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  border_width?: number | null;
  border_radius?: number | null;
  text_align?: string | null;
  z_index: number;
}

export interface TemplateLayoutJson {
  bg_color: string;
  width: number;
  height: number;
  elements: TemplateElement[];
}

export interface DesignTemplate {
  id: string;
  organization_id: string | null;
  name: string;
  election_type: string | null;
  category: string;
  format_name: string | null;
  format_dims: string | null;
  layout_json: TemplateLayoutJson;
  thumbnail_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ── Static config types (not from DB) ─────────────────────────────────────────
export interface FormatDimension {
  id: string;
  name: string;
  dims: string;
  width: number;
  height: number;
  ratio: string;
  tag: 'print' | 'social';
}
