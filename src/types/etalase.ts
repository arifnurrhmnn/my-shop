// Etalase type definition based on PRD database specification
export interface Etalase {
  id: string;
  etalase_number: string; // Format: 3 digit (001, 002, dst)
  thumbnail_url: string;
  affiliate_url: string;
  created_at: string;
}

export interface EtalaseCreateInput {
  thumbnail_url: string;
  affiliate_url: string;
  etalase_number: string;
}
