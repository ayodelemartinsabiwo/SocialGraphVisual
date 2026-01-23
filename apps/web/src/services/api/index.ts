/**
 * API Services Index
 * @module services/api
 *
 * Central export point for all API service modules.
 */

// Client exports
export { api, apiClient, type ApiError, type ApiResponse } from './client';

// Auth API
export { authApi } from './auth';
export {
  requestMagicLink,
  verifyMagicLink,
  getGoogleAuthUrl,
  handleGoogleCallback,
  refreshToken,
  logout,
  getCurrentUser,
  updateCurrentUser,
  deleteAccount,
} from './auth';

// Graphs API
export { graphsApi } from './graphs';
export {
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
} from './graphs';

// Insights API
export { insightsApi } from './insights';
export {
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
} from './insights';

// Exports API
export { exportsApi } from './exports';
export {
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
} from './exports';
