export interface SymbolItem {
  symbol: string;
  name: string;
  keywords: string;
}

export interface LayoutStyle {
  id: string;
  name: string;
  desc: string;
  category: 'Classic' | 'Modern' | 'National' | 'Digital' | 'Bold';
}

export interface FormatDimension {
  id: string;
  name: string;
  dims: string;
  width: number;
  height: number;
  ratio: string;
  tag: 'print' | 'social';
}
