/**
 * useInsights Hook
 * @module hooks/useInsights
 *
 * Custom hook for insights data management.
 * Uses TanStack Query for fetching and caching.
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
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
} from '../services/api';
import type { InsightCategory, InsightType, ListInsightsParams } from '@vsg/shared';

// ============================================================
// QUERY KEYS
// ============================================================

export const insightKeys = {
  all: ['insights'] as const,
  lists: () => [...insightKeys.all, 'list'] as const,
  list: (graphId: string, params?: Omit<ListInsightsParams, 'graphId'>) =>
    [...insightKeys.lists(), graphId, params] as const,
  details: () => [...insightKeys.all, 'detail'] as const,
  detail: (id: string) => [...insightKeys.details(), id] as const,
  summary: (graphId: string) => [...insightKeys.all, 'summary', graphId] as const,
  top: (graphId: string, limit?: number) => [...insightKeys.all, 'top', graphId, limit] as const,
  highlighted: (graphId: string) => [...insightKeys.all, 'highlighted', graphId] as const,
  byCategory: (graphId: string, category: InsightCategory) =>
    [...insightKeys.all, 'category', graphId, category] as const,
};

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook to fetch insights for a graph
 */
export function useInsights(
  graphId: string | null,
  params?: Omit<ListInsightsParams, 'graphId'>
) {
  return useQuery({
    queryKey: insightKeys.list(graphId || '', params),
    queryFn: () => listInsights(graphId!, params),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single insight
 */
export function useInsight(insightId: string | null) {
  return useQuery({
    queryKey: insightKeys.detail(insightId || ''),
    queryFn: () => getInsight(insightId!),
    enabled: !!insightId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch insight summary
 */
export function useInsightSummary(graphId: string | null) {
  return useQuery({
    queryKey: insightKeys.summary(graphId || ''),
    queryFn: () => getInsightSummary(graphId!),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch top insights
 */
export function useTopInsights(graphId: string | null, limit = 5) {
  return useQuery({
    queryKey: insightKeys.top(graphId || '', limit),
    queryFn: () => getTopInsights(graphId!, limit),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch highlighted insights
 */
export function useHighlightedInsights(graphId: string | null) {
  return useQuery({
    queryKey: insightKeys.highlighted(graphId || ''),
    queryFn: () => getHighlightedInsights(graphId!),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch insights by category
 */
export function useInsightsByCategory(
  graphId: string | null,
  category: InsightCategory
) {
  return useQuery({
    queryKey: insightKeys.byCategory(graphId || '', category),
    queryFn: () => getInsightsByCategory(graphId!, category),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch high-confidence insights
 */
export function useHighConfidenceInsights(graphId: string | null) {
  return useQuery({
    queryKey: [...insightKeys.all, 'highConfidence', graphId] as const,
    queryFn: () => getHighConfidenceInsights(graphId!),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to generate insights
 */
export function useGenerateInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      graphId,
      options,
    }: {
      graphId: string;
      options?: {
        categories?: InsightCategory[];
        types?: InsightType[];
        regenerate?: boolean;
      };
    }) => generateInsights(graphId, options),
    onSuccess: (_, { graphId }) => {
      // Invalidate all insight queries for this graph
      queryClient.invalidateQueries({
        queryKey: insightKeys.lists(),
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key.includes(graphId);
        },
      });
      queryClient.invalidateQueries({ queryKey: insightKeys.summary(graphId) });
      queryClient.invalidateQueries({ queryKey: insightKeys.top(graphId) });
    },
  });
}

/**
 * Hook to regenerate all insights
 */
export function useRegenerateInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (graphId: string) => regenerateInsights(graphId),
    onSuccess: (_, graphId) => {
      // Invalidate all insight queries for this graph
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key[0] === 'insights' && key.includes(graphId);
        },
      });
    },
  });
}

/**
 * Hook to highlight/unhighlight insights
 */
export function useInsightHighlight() {
  const queryClient = useQueryClient();

  const highlightMutation = useMutation({
    mutationFn: (insightId: string) => highlightInsight(insightId),
    onSuccess: (_, insightId) => {
      queryClient.invalidateQueries({ queryKey: insightKeys.detail(insightId) });
      queryClient.invalidateQueries({ queryKey: insightKeys.lists() });
    },
  });

  const unhighlightMutation = useMutation({
    mutationFn: (insightId: string) => unhighlightInsight(insightId),
    onSuccess: (_, insightId) => {
      queryClient.invalidateQueries({ queryKey: insightKeys.detail(insightId) });
      queryClient.invalidateQueries({ queryKey: insightKeys.lists() });
    },
  });

  return {
    highlight: highlightMutation.mutate,
    unhighlight: unhighlightMutation.mutate,
    isHighlighting: highlightMutation.isPending,
    isUnhighlighting: unhighlightMutation.isPending,
  };
}

/**
 * Hook to dismiss insights
 */
export function useDismissInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insightId: string) => dismissInsight(insightId),
    onSuccess: (_, insightId) => {
      queryClient.removeQueries({ queryKey: insightKeys.detail(insightId) });
      queryClient.invalidateQueries({ queryKey: insightKeys.lists() });
    },
  });
}

/**
 * Combined hook for common insight operations
 */
export function useInsightOperations(graphId: string | null) {
  const queryClient = useQueryClient();
  const generateMutation = useGenerateInsights();
  const regenerateMutation = useRegenerateInsights();
  const highlightOps = useInsightHighlight();
  const dismissMutation = useDismissInsight();

  const invalidateAll = useCallback(() => {
    if (graphId) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey as string[];
          return key[0] === 'insights' && key.includes(graphId);
        },
      });
    }
  }, [graphId, queryClient]);

  return {
    generate: (options?: { categories?: InsightCategory[]; types?: InsightType[] }) =>
      graphId && generateMutation.mutate({ graphId, options }),
    regenerate: () => graphId && regenerateMutation.mutate(graphId),
    highlight: highlightOps.highlight,
    unhighlight: highlightOps.unhighlight,
    dismiss: dismissMutation.mutate,
    isGenerating: generateMutation.isPending,
    isRegenerating: regenerateMutation.isPending,
    isDismissing: dismissMutation.isPending,
    invalidateAll,
  };
}

export default useInsights;
