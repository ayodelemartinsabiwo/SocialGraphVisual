/**
 * Export-related type definitions
 * @module @vsg/shared/types/export
 */

// ============ ENUMS ============

export const ExportType = {
  PDF_REPORT: 'PDF_REPORT',
  SOCIAL_CARD: 'SOCIAL_CARD',
  DATA_CSV: 'DATA_CSV',
  DATA_JSON: 'DATA_JSON',
} as const;

export type ExportType = (typeof ExportType)[keyof typeof ExportType];

export const ExportFormat = {
  PDF: 'PDF',
  PNG: 'PNG',
  JPG: 'JPG',
  CSV: 'CSV',
  JSON: 'JSON',
} as const;

export type ExportFormat = (typeof ExportFormat)[keyof typeof ExportFormat];

export const ExportStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type ExportStatus = (typeof ExportStatus)[keyof typeof ExportStatus];

// ============ EXPORT OPTIONS ============

export interface SocialCardOptions {
  template: 'network_stats' | 'community_highlight' | 'influence_score' | 'engagement_circles';
  colorScheme: 'light' | 'dark' | 'brand';
  includeUsername: boolean;
  includeStats: boolean;
  customTitle?: string;
  customSubtitle?: string;
}

export interface PdfReportOptions {
  includeOverview: boolean;
  includeInsights: boolean;
  includeGraphVisualization: boolean;
  includeCommunityBreakdown: boolean;
  includeMetricsTable: boolean;
  pageSize: 'A4' | 'LETTER';
  orientation: 'portrait' | 'landscape';
}

export interface DataExportOptions {
  includeNodes: boolean;
  includeEdges: boolean;
  includeMetrics: boolean;
  includeInsights: boolean;
  pseudonymize: boolean; // Whether to keep pseudonymized names or reveal
  format: 'CSV' | 'JSON';
}

export type ExportOptions = SocialCardOptions | PdfReportOptions | DataExportOptions;

// ============ EXPORT (FULL MODEL) ============

export interface Export {
  id: string;
  userId: string;
  graphId: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;

  // File info (when completed)
  fileUrl: string | null;
  fileSize: number | null;
  fileName: string | null;

  // Options used
  options: ExportOptions | null;

  // Error info (when failed)
  errorMsg?: string;

  expiresAt: Date | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface ExportSummary {
  id: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  fileName: string | null;
  fileSize: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

// ============ EXPORT REQUESTS ============

export interface CreateExportRequest {
  graphId: string;
  type: ExportType;
  options: ExportOptions;
}

export interface CreateExportResponse {
  export: Export;
  estimatedTime: number; // seconds
}

// ============ SOCIAL CARD TEMPLATES ============

export interface SocialCardTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  dimensions: {
    width: number;
    height: number;
  };
  supportsColorSchemes: ('light' | 'dark' | 'brand')[];
  requiredData: string[]; // metrics needed to generate
}

export const SOCIAL_CARD_TEMPLATES: SocialCardTemplate[] = [
  {
    id: 'network_stats',
    name: 'Network Overview',
    description: 'Show your network size, communities, and key metrics',
    preview: '/templates/network-stats.png',
    dimensions: { width: 1200, height: 630 },
    supportsColorSchemes: ['light', 'dark', 'brand'],
    requiredData: ['nodeCount', 'edgeCount', 'communityCount'],
  },
  {
    id: 'community_highlight',
    name: 'Community Map',
    description: 'Visualize your network communities',
    preview: '/templates/community-highlight.png',
    dimensions: { width: 1200, height: 630 },
    supportsColorSchemes: ['light', 'dark'],
    requiredData: ['communities', 'modularity'],
  },
  {
    id: 'influence_score',
    name: 'Influence Score',
    description: 'Showcase your network influence and reach',
    preview: '/templates/influence-score.png',
    dimensions: { width: 1200, height: 630 },
    supportsColorSchemes: ['light', 'dark', 'brand'],
    requiredData: ['pageRank', 'betweenness', 'degree'],
  },
  {
    id: 'engagement_circles',
    name: 'Engagement Circles',
    description: 'Display your engagement levels and super fans',
    preview: '/templates/engagement-circles.png',
    dimensions: { width: 1200, height: 630 },
    supportsColorSchemes: ['light', 'dark'],
    requiredData: ['engagementCircles', 'superFansCount'],
  },
];
