/**
 * Exports API Service
 * @module services/api/exports
 *
 * Export generation and download operations.
 */

import { api } from './client';
import type {
  ExportType,
  ExportFormat,
  ExportStatus,
  CreateExportBody,
  CreateExportResponse,
  GetExportResponse,
  ListExportsParams,
  ListExportsResponse,
} from '@vsg/shared';

// ============================================================
// EXPORT CREATION
// ============================================================

/**
 * Create a new export
 */
export async function createExport(
  graphId: string,
  type: ExportType,
  options: Record<string, unknown> = {}
): Promise<CreateExportResponse> {
  const body: CreateExportBody = {
    graphId,
    type,
    options,
  };

  const response = await api.post<CreateExportResponse>('/exports', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to create export');
  }

  return response.data;
}

/**
 * Create a social card export
 */
export async function createSocialCard(
  graphId: string,
  options?: {
    template?: string;
    theme?: 'light' | 'dark';
    title?: string;
    subtitle?: string;
  }
): Promise<CreateExportResponse> {
  return createExport(graphId, 'SOCIAL_CARD', options || {});
}

/**
 * Create a PDF report export
 */
export async function createPdfReport(
  graphId: string,
  options?: {
    includeInsights?: boolean;
    includeStatistics?: boolean;
    includeFullGraph?: boolean;
  }
): Promise<CreateExportResponse> {
  return createExport(graphId, 'PDF_REPORT', options || {});
}

/**
 * Create a data export (CSV)
 */
export async function createDataExportCsv(
  graphId: string,
  options?: {
    includeNodes?: boolean;
    includeEdges?: boolean;
    includeMetrics?: boolean;
  }
): Promise<CreateExportResponse> {
  return createExport(graphId, 'DATA_CSV', options || {});
}

/**
 * Create a data export (JSON)
 */
export async function createDataExportJson(
  graphId: string,
  options?: {
    includeNodes?: boolean;
    includeEdges?: boolean;
    includeMetrics?: boolean;
    includeInsights?: boolean;
  }
): Promise<CreateExportResponse> {
  return createExport(graphId, 'DATA_JSON', options || {});
}

// ============================================================
// EXPORT RETRIEVAL
// ============================================================

/**
 * Get an export by ID
 */
export async function getExport(exportId: string): Promise<GetExportResponse> {
  const response = await api.get<GetExportResponse>(`/exports/${exportId}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get export');
  }

  return response.data;
}

/**
 * List exports with optional filtering
 */
export async function listExports(params?: ListExportsParams): Promise<ListExportsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.graphId) queryParams.append('graphId', params.graphId);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const url = queryString ? `/exports?${queryString}` : '/exports';

  const response = await api.get<ListExportsResponse>(url);

  if (!response.success || !response.data) {
    throw new Error('Failed to list exports');
  }

  return response.data;
}

/**
 * List exports for a specific graph
 */
export async function listGraphExports(graphId: string): Promise<ListExportsResponse> {
  return listExports({ graphId });
}

// ============================================================
// EXPORT STATUS
// ============================================================

/**
 * Poll export status until complete
 */
export async function waitForExport(
  exportId: string,
  options?: {
    pollInterval?: number;
    maxAttempts?: number;
    onProgress?: (status: ExportStatus) => void;
  }
): Promise<GetExportResponse> {
  const { pollInterval = 2000, maxAttempts = 30, onProgress } = options || {};

  let attempts = 0;

  while (attempts < maxAttempts) {
    const exportData = await getExport(exportId);

    if (onProgress) {
      onProgress(exportData.status);
    }

    if (exportData.status === 'COMPLETED') {
      return exportData;
    }

    if (exportData.status === 'FAILED') {
      throw new Error('Export failed');
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('Export timed out');
}

// ============================================================
// EXPORT DOWNLOAD
// ============================================================

/**
 * Download an export file
 */
export async function downloadExport(exportId: string): Promise<Blob> {
  const exportData = await getExport(exportId);

  if (!exportData.fileUrl) {
    throw new Error('Export file not available');
  }

  const response = await fetch(exportData.fileUrl);

  if (!response.ok) {
    throw new Error('Failed to download export');
  }

  return response.blob();
}

/**
 * Download and save export file
 */
export async function downloadAndSaveExport(exportId: string, fileName?: string): Promise<void> {
  const exportData = await getExport(exportId);

  if (!exportData.fileUrl) {
    throw new Error('Export file not available');
  }

  const blob = await downloadExport(exportId);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || exportData.fileName || `export-${exportId}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// ============================================================
// EXPORT DELETION
// ============================================================

/**
 * Delete an export
 */
export async function deleteExport(exportId: string): Promise<void> {
  await api.delete(`/exports/${exportId}`);
}

// ============================================================
// EXPORTS
// ============================================================

export const exportsApi = {
  createExport,
  createSocialCard,
  createPdfReport,
  createDataExportCsv,
  createDataExportJson,
  getExport,
  listExports,
  listGraphExports,
  waitForExport,
  downloadExport,
  downloadAndSaveExport,
  deleteExport,
};

export default exportsApi;
