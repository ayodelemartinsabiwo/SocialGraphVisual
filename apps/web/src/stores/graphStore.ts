/**
 * Graph Store
 * @module stores/graphStore
 *
 * Zustand store for graph state management.
 * Handles the current graph data, visualization state, and selection.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  Graph,
  GraphNode,
  GraphEdge,
  GraphSummary,
  GraphStatistics,
  Platform,
  GraphStatus,
} from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export type ViewMode = 'default' | 'communities' | 'influence' | 'engagement';
export type LayoutType = 'force' | 'radial' | 'hierarchical' | 'circular';

export interface GraphFilters {
  minDegree: number;
  communityIds: number[];
  edgeTypes: string[];
  searchQuery: string;
}

export interface VisualizationSettings {
  nodeSize: 'fixed' | 'degree' | 'pageRank' | 'betweenness';
  nodeColor: 'default' | 'community' | 'engagement' | 'type';
  edgeWidth: 'fixed' | 'weight';
  edgeColor: 'default' | 'type';
  showLabels: boolean;
  labelThreshold: number;
  showEdges: boolean;
  edgeOpacity: number;
  physics: boolean;
  zoom: number;
}

export interface SelectionState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  selectedCommunity: number | null;
  multiSelectNodeIds: Set<string>;
}

interface GraphState {
  // Current graph
  currentGraph: Graph | null;
  currentGraphId: string | null;
  isLoading: boolean;
  error: string | null;

  // Graph list
  graphs: GraphSummary[];
  graphsLoading: boolean;

  // Visualization state
  viewMode: ViewMode;
  layoutType: LayoutType;
  filters: GraphFilters;
  settings: VisualizationSettings;
  selection: SelectionState;

  // Computed/filtered data
  filteredNodes: GraphNode[];
  filteredEdges: GraphEdge[];

  // Actions - Graph data
  setCurrentGraph: (graph: Graph | null) => void;
  setCurrentGraphId: (id: string | null) => void;
  setGraphs: (graphs: GraphSummary[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - Visualization
  setViewMode: (mode: ViewMode) => void;
  setLayoutType: (layout: LayoutType) => void;
  setFilters: (filters: Partial<GraphFilters>) => void;
  setSettings: (settings: Partial<VisualizationSettings>) => void;
  resetFilters: () => void;
  resetSettings: () => void;

  // Actions - Selection
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  selectCommunity: (communityId: number | null) => void;
  toggleNodeMultiSelect: (nodeId: string) => void;
  clearMultiSelect: () => void;
  clearSelection: () => void;

  // Actions - Node manipulation
  pinNode: (nodeId: string, x: number, y: number) => void;
  unpinNode: (nodeId: string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;

  // Computed helpers
  getNodeById: (id: string) => GraphNode | undefined;
  getNeighborIds: (nodeId: string) => string[];
  getCommunityNodes: (communityId: number) => GraphNode[];
  applyFilters: () => void;
}

// ============================================================
// DEFAULT VALUES
// ============================================================

const defaultFilters: GraphFilters = {
  minDegree: 0,
  communityIds: [],
  edgeTypes: [],
  searchQuery: '',
};

const defaultSettings: VisualizationSettings = {
  nodeSize: 'degree',
  nodeColor: 'community',
  edgeWidth: 'weight',
  edgeColor: 'default',
  showLabels: true,
  labelThreshold: 10,
  showEdges: true,
  edgeOpacity: 0.6,
  physics: true,
  zoom: 1,
};

const defaultSelection: SelectionState = {
  selectedNodeId: null,
  hoveredNodeId: null,
  selectedCommunity: null,
  multiSelectNodeIds: new Set(),
};

// ============================================================
// STORE
// ============================================================

export const useGraphStore = create<GraphState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentGraph: null,
    currentGraphId: null,
    isLoading: false,
    error: null,
    graphs: [],
    graphsLoading: false,
    viewMode: 'default',
    layoutType: 'force',
    filters: { ...defaultFilters },
    settings: { ...defaultSettings },
    selection: { ...defaultSelection },
    filteredNodes: [],
    filteredEdges: [],

    // Graph data actions
    setCurrentGraph: (graph) => {
      set({ currentGraph: graph, error: null });
      // Apply filters when graph changes
      if (graph) {
        get().applyFilters();
      } else {
        set({ filteredNodes: [], filteredEdges: [] });
      }
    },

    setCurrentGraphId: (id) => set({ currentGraphId: id }),

    setGraphs: (graphs) => set({ graphs }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    // Visualization actions
    setViewMode: (mode) => set({ viewMode: mode }),

    setLayoutType: (layout) => set({ layoutType: layout }),

    setFilters: (filters) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
      }));
      get().applyFilters();
    },

    setSettings: (settings) =>
      set((state) => ({
        settings: { ...state.settings, ...settings },
      })),

    resetFilters: () => {
      set({ filters: { ...defaultFilters } });
      get().applyFilters();
    },

    resetSettings: () => set({ settings: { ...defaultSettings } }),

    // Selection actions
    selectNode: (nodeId) =>
      set((state) => ({
        selection: { ...state.selection, selectedNodeId: nodeId },
      })),

    hoverNode: (nodeId) =>
      set((state) => ({
        selection: { ...state.selection, hoveredNodeId: nodeId },
      })),

    selectCommunity: (communityId) =>
      set((state) => ({
        selection: { ...state.selection, selectedCommunity: communityId },
      })),

    toggleNodeMultiSelect: (nodeId) =>
      set((state) => {
        const newSet = new Set(state.selection.multiSelectNodeIds);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return {
          selection: { ...state.selection, multiSelectNodeIds: newSet },
        };
      }),

    clearMultiSelect: () =>
      set((state) => ({
        selection: { ...state.selection, multiSelectNodeIds: new Set() },
      })),

    clearSelection: () =>
      set({ selection: { ...defaultSelection } }),

    // Node manipulation
    pinNode: (nodeId, x, y) => {
      const graph = get().currentGraph;
      if (!graph) return;

      const updatedNodes = graph.nodes.map((node: GraphNode) =>
        node.id === nodeId ? { ...node, fx: x, fy: y } : node
      );

      set({
        currentGraph: { ...graph, nodes: updatedNodes },
      });
    },

    unpinNode: (nodeId) => {
      const graph = get().currentGraph;
      if (!graph) return;

      const updatedNodes = graph.nodes.map((node: GraphNode) =>
        node.id === nodeId ? { ...node, fx: null, fy: null } : node
      );

      set({
        currentGraph: { ...graph, nodes: updatedNodes },
      });
    },

    updateNodePosition: (nodeId, x, y) => {
      const graph = get().currentGraph;
      if (!graph) return;

      const updatedNodes = graph.nodes.map((node: GraphNode) =>
        node.id === nodeId ? { ...node, x, y } : node
      );

      set({
        currentGraph: { ...graph, nodes: updatedNodes },
      });
    },

    // Computed helpers
    getNodeById: (id) => {
      const graph = get().currentGraph;
      return graph?.nodes.find((n: GraphNode) => n.id === id);
    },

    getNeighborIds: (nodeId) => {
      const graph = get().currentGraph;
      if (!graph) return [];

      const neighborIds = new Set<string>();

      for (const edge of graph.edges) {
        if (edge.source === nodeId) {
          neighborIds.add(edge.target);
        } else if (edge.target === nodeId) {
          neighborIds.add(edge.source);
        }
      }

      return Array.from(neighborIds);
    },

    getCommunityNodes: (communityId) => {
      const graph = get().currentGraph;
      if (!graph) return [];

      return graph.nodes.filter((n: GraphNode) => n.communityId === communityId);
    },

    applyFilters: () => {
      const { currentGraph, filters } = get();
      if (!currentGraph) {
        set({ filteredNodes: [], filteredEdges: [] });
        return;
      }

      let nodes = [...currentGraph.nodes];
      let edges = [...currentGraph.edges];

      // Filter by minimum degree
      if (filters.minDegree > 0) {
        const nodeIds = new Set(
          nodes
            .filter((n) => (n.degree || 0) >= filters.minDegree)
            .map((n) => n.id)
        );
        nodes = nodes.filter((n) => nodeIds.has(n.id));
        edges = edges.filter(
          (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
        );
      }

      // Filter by community
      if (filters.communityIds.length > 0) {
        const communitySet = new Set(filters.communityIds);
        const nodeIds = new Set(
          nodes
            .filter((n) => n.communityId !== undefined && communitySet.has(n.communityId))
            .map((n) => n.id)
        );
        nodes = nodes.filter((n) => nodeIds.has(n.id));
        edges = edges.filter(
          (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
        );
      }

      // Filter by edge type
      if (filters.edgeTypes.length > 0) {
        const typeSet = new Set(filters.edgeTypes);
        edges = edges.filter((e) => typeSet.has(e.type));
      }

      // Filter by search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchingNodeIds = new Set(
          nodes
            .filter(
              (n) =>
                n.displayName.toLowerCase().includes(query) ||
                n.username.toLowerCase().includes(query)
            )
            .map((n) => n.id)
        );
        nodes = nodes.filter((n) => matchingNodeIds.has(n.id));
        edges = edges.filter(
          (e) => matchingNodeIds.has(e.source) || matchingNodeIds.has(e.target)
        );
      }

      set({ filteredNodes: nodes, filteredEdges: edges });
    },
  }))
);

// ============================================================
// SELECTORS
// ============================================================

export const selectCurrentGraph = (state: GraphState) => state.currentGraph;
export const selectGraphs = (state: GraphState) => state.graphs;
export const selectIsLoading = (state: GraphState) => state.isLoading;
export const selectViewMode = (state: GraphState) => state.viewMode;
export const selectSettings = (state: GraphState) => state.settings;
export const selectFilters = (state: GraphState) => state.filters;
export const selectSelection = (state: GraphState) => state.selection;
export const selectFilteredNodes = (state: GraphState) => state.filteredNodes;
export const selectFilteredEdges = (state: GraphState) => state.filteredEdges;

export const selectSelectedNode = (state: GraphState) => {
  const { selectedNodeId } = state.selection;
  if (!selectedNodeId || !state.currentGraph) return null;
  return state.currentGraph.nodes.find((n: GraphNode) => n.id === selectedNodeId) || null;
};

export const selectNodeCount = (state: GraphState) =>
  state.currentGraph?.nodes.length || 0;

export const selectEdgeCount = (state: GraphState) =>
  state.currentGraph?.edges.length || 0;

export const selectCommunityCount = (state: GraphState) =>
  state.currentGraph?.statistics?.communities?.count || 0;

export default useGraphStore;
