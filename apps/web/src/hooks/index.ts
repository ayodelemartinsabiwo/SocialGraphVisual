/**
 * Hooks Index
 * @module hooks
 *
 * Central export point for all custom hooks.
 */

// Graph hooks
export {
  useGraph,
  useGraphList,
  useLatestGraph,
  useDeleteGraph,
  useGraphStatus,
  useReprocessGraph,
  useGraphOperations,
  graphKeys,
} from './useGraph';

// Insights hooks
export {
  useInsights,
  useInsight,
  useInsightSummary,
  useTopInsights,
  useHighlightedInsights,
  useInsightsByCategory,
  useHighConfidenceInsights,
  useGenerateInsights,
  useRegenerateInsights,
  useInsightHighlight,
  useDismissInsight,
  useInsightOperations,
  insightKeys,
} from './useInsights';

// Upload hooks
export {
  useUpload,
  useMultiUpload,
  type UploadStep,
  type UploadProgress,
  type UploadResult,
  type ParsedGraphData,
} from './useUpload';
