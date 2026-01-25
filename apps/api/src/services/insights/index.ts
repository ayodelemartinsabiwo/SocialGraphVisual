/**
 * Insights Service
 * @module services/insights
 *
 * Template-based insight generation from graph analysis.
 */

// Engine
export {
  generateInsights,
  generateAndSaveInsights,
  getStoredInsights,
  refreshInsights,
  getInsightCountsByCategory,
  getHighConfidenceInsights,
  type GeneratedInsight,
  type InsightGenerationResult,
  type InsightGenerationOptions,
} from './engine.js';

// Analyzer
export {
  analyzeGraph,
  type AnalysisResult,
  type CommunityInfo,
  type NodeRanking,
  type EngagementTier,
} from './analyzer.js';

// Matcher
export {
  matchTemplates,
  type InsightTemplate,
  type TemplateCondition,
  type TemplateMatch,
  type MatchOptions,
} from './matcher.js';

// Interpolator
export {
  interpolateTemplate,
  pluralize,
  formatPercent,
  formatNumber,
  getOrdinal,
  type InterpolatedInsight,
} from './interpolator.js';

// Templates
export { communityTemplates } from './templates/community.js';
export { bridgeTemplates } from './templates/bridge.js';
export { engagementTemplates } from './templates/engagement.js';
export { growthTemplates } from './templates/growth.js';

// Default exports
export { default as engine } from './engine.js';
