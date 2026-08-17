export type PostType = 'sarpanch' | 'panch' | 'ward';

export interface Candidate {
  id: string;
  name: string;
  hindiName?: string;
  post: string;
  postType: PostType;
  constituency: string;
  symbol: string;
  symbolName: string;
  photo: string;
  slogan: string;
  votersCount: number;
  volunteersCount: number;
  manifesto: string;
}
