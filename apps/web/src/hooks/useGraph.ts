/**
 * useGraph Hook
 * @module hooks/useGraph
 *
 * Custom hook for graph data management.
 * Combines TanStack Query for data fetching with Zustand store for state.
 */

import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGraphStore } from '../stores/graphStore';
import {
  getGraph,
  listGraphs,
  getLatestGraph,
  deleteGraph,
  getProcessingStatus,
  reprocessGraph,
} from '../services/api';
import type { Platform, GraphStatus, ListGraphsParams } from '@vsg/shared';

// ============================================================
// QUERY KEYS
// ============================================================

export const graphKeys = {
  all: ['graphs'] as const,
  lists: () => [...graphKeys.all, 'list'] as const,
  list: (params?: ListGraphsParams) => [...graphKeys.lists(), params] as const,
  details: () => [...graphKeys.all, 'detail'] as const,
  detail: (id: string) => [...graphKeys.details(), id] as const,
  latest: (platform: Platform) => [...graphKeys.all, 'latest', platform] as const,
  status: (id: string) => [...graphKeys.all, 'status', id] as const,
};

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook to fetch and manage a single graph
 */
export function useGraph(graphId: string | null) {
  const queryClient = useQueryClient();
  const {
    setCurrentGraph,
    setCurrentGraphId,
    setIsLoading,
    setError,
    currentGraph,
  } = useGraphStore();

  const query = useQuery({
    queryKey: graphKeys.detail(graphId || ''),
    queryFn: () => getGraph(graphId!),
    enabled: !!graphId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync query state with store
  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading, setIsLoading]);

  useEffect(() => {
    if (query.error) {
      setError((query.error as Error).message);
    }
  }, [query.error, setError]);

  useEffect(() => {
    if (query.data) {
      // Transform API response to store format
      const graphData = {
        id: query.data.id,
        userId: query.data.userId,
        platform: query.data.platform,
        version: query.data.version,
        isLatest: query.data.isLatest,
        status: query.data.status,
        nodes: query.data.nodes.map((n) => ({
          ...n,
          displayName: n.displayName || n.username,
        })),
        edges: query.data.edges,
        metadata: query.data.metadata,
        statistics: query.data.statistics,
        createdAt: query.data.createdAt,
        updatedAt: query.data.updatedAt,
      };
      setCurrentGraph(graphData as any);
      setCurrentGraphId(query.data.id);
    }
  }, [query.data, setCurrentGraph, setCurrentGraphId]);

  const refresh = useCallback(() => {
    if (graphId) {
      queryClient.invalidateQueries({ queryKey: graphKeys.detail(graphId) });
    }
  }, [graphId, queryClient]);

  return {
    graph: currentGraph,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    refresh,
  };
}

/**
 * Hook to fetch list of graphs
 */
export function useGraphList(params?: ListGraphsParams) {
  const { setGraphs } = useGraphStore();

  const query = useQuery({
    queryKey: graphKeys.list(params),
    queryFn: () => listGraphs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  useEffect(() => {
    if (query.data?.graphs) {
      setGraphs(query.data.graphs as any);
    }
  }, [query.data, setGraphs]);

  return {
    graphs: query.data?.graphs || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get the latest graph for a platform
 */
export function useLatestGraph(platform: Platform) {
  return useQuery({
    queryKey: graphKeys.latest(platform),
    queryFn: () => getLatestGraph(platform),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to delete a graph
 */
export function useDeleteGraph() {
  const queryClient = useQueryClient();
  const { setCurrentGraph, setCurrentGraphId } = useGraphStore();

  return useMutation({
    mutationFn: (graphId: string) => deleteGraph(graphId),
    onSuccess: (_, graphId) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: graphKeys.lists() });
      // Remove from cache
      queryClient.removeQueries({ queryKey: graphKeys.detail(graphId) });
      // Clear current graph if it was the deleted one
      const currentId = useGraphStore.getState().currentGraphId;
      if (currentId === graphId) {
        setCurrentGraph(null);
        setCurrentGraphId(null);
      }
    },
  });
}

/**
 * Hook to monitor graph processing status
 */
export function useGraphStatus(graphId: string | null, enabled = true) {
  return useQuery({
    queryKey: graphKeys.status(graphId || ''),
    queryFn: () => getProcessingStatus(graphId!),
    enabled: !!graphId && enabled,
    refetchInterval: (query) => {
      // Poll every 2 seconds if still processing
      const data = query.state.data;
      if (data?.status === 'PROCESSING') {
        return 2000;
      }
      return false;
    },
  });
}

/**
 * Hook to trigger graph reprocessing
 */
export function useReprocessGraph() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (graphId: string) => reprocessGraph(graphId),
    onSuccess: (_, graphId) => {
      // Invalidate status query to start polling
      queryClient.invalidateQueries({ queryKey: graphKeys.status(graphId) });
    },
  });
}

/**
 * Combined hook for common graph operations
 */
export function useGraphOperations() {
  const deleteGraphMutation = useDeleteGraph();
  const reprocessMutation = useReprocessGraph();
  const queryClient = useQueryClient();

  return {
    deleteGraph: deleteGraphMutation.mutate,
    isDeleting: deleteGraphMutation.isPending,
    reprocessGraph: reprocessMutation.mutate,
    isReprocessing: reprocessMutation.isPending,
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: graphKeys.all }),
  };
}

export default useGraph;
