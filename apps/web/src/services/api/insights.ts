/**
 * Insights API Service
 * @module services/api/insights
 *
 * Insight generation and retrieval operations.
 */

import { api } from './client';
import type {
  InsightCategory,
  InsightType,
  Confidence,
  ListInsightsParams,
  ListInsightsResponse,
  GetInsightResponse,
  GenerateInsightsBody,
  GenerateInsightsResponse,
} from '@vsg/shared';

// ============================================================
// INSIGHT LISTING
// ============================================================

/**
 * List insights for a graph
 */
export async function listInsights(
  graphId: string,
  params?: Omit<ListInsightsParams, 'graphId'>
): Promise<ListInsightsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('graphId', graphId);

  if (params?.category) queryParams.append('category', params.category);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await api.get<ListInsightsResponse>(`/insights?${queryParams.toString()}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to list insights');
  }

  return response.data;
}

/**
 * Get a specific insight by ID
 */
export async function getInsight(insightId: string): Promise<GetInsightResponse> {
  const response = await api.get<GetInsightResponse>(`/insights/${insightId}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get insight');
  }

  return response.data;
}

// ============================================================
// INSIGHT GENERATION
// ============================================================

/**
 * Generate insights for a graph
 */
export async function generateInsights(
  graphId: string,
  options?: {
    categories?: InsightCategory[];
    types?: InsightType[];
    regenerate?: boolean;
  }
): Promise<GenerateInsightsResponse> {
  const body: GenerateInsightsBody = {
    graphId,
    ...options,
  };

  const response = await api.post<GenerateInsightsResponse>('/insights/generate', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to generate insights');
  }

  return response.data;
}

/**
 * Regenerate all insights for a graph
 */
export async function regenerateInsights(graphId: string): Promise<GenerateInsightsResponse> {
  return generateInsights(graphId, { regenerate: true });
}

// ============================================================
// INSIGHT FILTERING
// ============================================================

/**
 * Get insights by category
 */
export async function getInsightsByCategory(
  graphId: string,
  category: InsightCategory
): Promise<ListInsightsResponse> {
  return listInsights(graphId, { category });
}

/**
 * Get high-confidence insights only
 */
export async function getHighConfidenceInsights(
  graphId: string
): Promise<ListInsightsResponse['insights']> {
  const response = await listInsights(graphId);

  return response.insights.filter(
    (insight) => insight.confidence === 'HIGH' || insight.confidence === 'MEDIUM'
  );
}

/**
 * Get highlighted insights
 */
export async function getHighlightedInsights(
  graphId: string
): Promise<ListInsightsResponse['insights']> {
  const response = await listInsights(graphId);

  return response.insights.filter((insight) => insight.isHighlighted);
}

// ============================================================
// INSIGHT ACTIONS
// ============================================================

/**
 * Mark insight as highlighted
 */
export async function highlightInsight(insightId: string): Promise<void> {
  await api.patch(`/insights/${insightId}`, { isHighlighted: true });
}

/**
 * Remove insight highlight
 */
export async function unhighlightInsight(insightId: string): Promise<void> {
  await api.patch(`/insights/${insightId}`, { isHighlighted: false });
}

/**
 * Dismiss an insight
 */
export async function dismissInsight(insightId: string): Promise<void> {
  await api.delete(`/insights/${insightId}`);
}

// ============================================================
// INSIGHT SUMMARY
// ============================================================

/**
 * Get insight summary for a graph
 */
export async function getInsightSummary(graphId: string): Promise<{
  total: number;
  byCategory: Record<InsightCategory, number>;
  byConfidence: Record<Confidence, number>;
  highlighted: number;
}> {
  const response = await api.get<{
    total: number;
    byCategory: Record<InsightCategory, number>;
    byConfidence: Record<Confidence, number>;
    highlighted: number;
  }>(`/insights/summary/${graphId}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to get insight summary');
  }

  return response.data;
}

/**
 * Get top insights (most important)
 */
export async function getTopInsights(
  graphId: string,
  limit: number = 5
): Promise<ListInsightsResponse['insights']> {
  const response = await listInsights(graphId, {
    sortBy: 'priority',
    sortOrder: 'desc',
    pageSize: limit,
  });

  return response.insights;
}

// ============================================================
// EXPORTS
// ============================================================

export const insightsApi = {
  listInsights,
  getInsight,
  generateInsights,
  regenerateInsights,
  getInsightsByCategory,
  getHighConfidenceInsights,
  getHighlightedInsights,
  highlightInsight,
  unhighlightInsight,
  dismissInsight,
  getInsightSummary,
  getTopInsights,
};

export default insightsApi;
