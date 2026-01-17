export type AssetStatus = 'processing' | 'ready' | 'failed';

export interface AIAnalysis {
  tags: string[];
  dominantColors: string[];
  description: string;
  detectedObjects: string[];
}

export interface Asset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  s3Url: string;
  thumbnailUrl?: string;
  status: AssetStatus;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

export interface FilterState {
  search: string;
  tags: string[];
  mimeType: string[];
}