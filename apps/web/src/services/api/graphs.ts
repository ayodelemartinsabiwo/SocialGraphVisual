/**
 * Graphs API Service
 * @module services/api/graphs
 *
 * Graph CRUD operations and upload management.
 */

import { api } from './client';
import type {
  Platform,
  GraphStatus,
  InitiateUploadBody,
  InitiateUploadResponse,
  CreateGraphBody,
  CreateGraphResponse,
  ListGraphsParams,
  ListGraphsResponse,
  GetGraphResponse,
} from '@vsg/shared';

// ============================================================
// UPLOAD OPERATIONS
// ============================================================

/**
 * Initiate a file upload
 */
export async function initiateUpload(
  platform: Platform,
  fileName: string,
  fileSize: number
): Promise<InitiateUploadResponse> {
  const body: InitiateUploadBody = { platform, fileName, fileSize };
  const response = await api.post<InitiateUploadResponse>('/graphs/upload/initiate', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to initiate upload');
  }

  return response.data;
}

/**
 * Upload file to the presigned URL
 */
export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

/**
 * Cancel an upload
 */
export async function cancelUpload(uploadId: string): Promise<void> {
  await api.delete(`/graphs/upload/${uploadId}`);
}

// ============================================================
// GRAPH CRUD
// ============================================================

/**
 * Create a new graph from parsed data
 */
export async function createGraph(graphData: CreateGraphBody): Promise<CreateGraphResponse> {
  console.log('[createGraph] Sending graph data:', {
    uploadId: graphData.uploadId,
    platform: graphData.platform,
    nodeCount: graphData.nodes.length,
    edgeCount: graphData.edges.length,
  });
  
  const response = await api.post<CreateGraphResponse>('/graphs', graphData);

  if (!response.success || !response.data) {
    throw new Error('Failed to create graph');
  }

  console.log('[createGraph] Response:', response.data);
  return response.data;
}

/**
 * List graphs with optional filtering
 */
export async function listGraphs(params?: ListGraphsParams): Promise<ListGraphsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.platform) queryParams.append('platform', params.platform);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const url = queryString ? `/graphs?${queryString}` : '/graphs';

  const response = await api.get<ListGraphsResponse>(url);

  if (!response.success || !response.data) {
    throw new Error('Failed to list graphs');
  }

  return response.data;
}

/**
 * Get a specific graph by ID
 */
export async function getGraph(graphId: string): Promise<GetGraphResponse> {
  const response = await api.get<GetGraphResponse>(`/graphs/${graphId}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get graph');
  }

  return response.data;
}

/**
 * Get graph summary (lightweight)
 */
export async function getGraphSummary(
  graphId: string
): Promise<{
  id: string;
  platform: Platform;
  status: GraphStatus;
  nodeCount: number;
  edgeCount: number;
  communityCount: number | null;
}> {
  const response = await api.get<{
    id: string;
    platform: Platform;
    status: GraphStatus;
    nodeCount: number;
    edgeCount: number;
    communityCount: number | null;
  }>(`/graphs/${graphId}/summary`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get graph summary');
  }

  return response.data;
}

/**
 * Delete a graph
 */
export async function deleteGraph(graphId: string): Promise<void> {
  await api.delete(`/graphs/${graphId}`);
}

/**
 * Get the latest graph for a platform
 */
export async function getLatestGraph(platform: Platform): Promise<GetGraphResponse | null> {
  try {
    const response = await api.get<GetGraphResponse>(`/graphs/latest/${platform}`);

    if (!response.success) {
      return null;
    }

    return response.data || null;
  } catch {
    return null;
  }
}

// ============================================================
// GRAPH PROCESSING
// ============================================================

/**
 * Trigger graph reprocessing (recalculate statistics)
 */
export async function reprocessGraph(graphId: string): Promise<{ jobId: string }> {
  const response = await api.post<{ jobId: string }>(`/graphs/${graphId}/reprocess`);

  if (!response.success || !response.data) {
    throw new Error('Failed to trigger reprocessing');
  }

  return response.data;
}

/**
 * Get graph processing status
 */
export async function getProcessingStatus(
  graphId: string
): Promise<{
  status: GraphStatus;
  progress?: number;
  error?: string;
}> {
  const response = await api.get<{
    status: GraphStatus;
    progress?: number;
    error?: string;
  }>(`/graphs/${graphId}/status`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get processing status');
  }

  return response.data;
}

// ============================================================
// GRAPH VERSIONS
// ============================================================

/**
 * List all versions of a graph
 */
export async function listGraphVersions(
  graphId: string
): Promise<
  Array<{
    id: string;
    version: number;
    isLatest: boolean;
    createdAt: string;
  }>
> {
  const response = await api.get<
    Array<{
      id: string;
      version: number;
      isLatest: boolean;
      createdAt: string;
    }>
  >(`/graphs/${graphId}/versions`);

  if (!response.success || !response.data) {
    throw new Error('Failed to list graph versions');
  }

  return response.data;
}

// ============================================================
// EXPORTS
// ============================================================

export const graphsApi = {
  initiateUpload,
  uploadFile,
  cancelUpload,
  createGraph,
  listGraphs,
  getGraph,
  getGraphSummary,
  deleteGraph,
  getLatestGraph,
  reprocessGraph,
  getProcessingStatus,
  listGraphVersions,
};

export default graphsApi;
