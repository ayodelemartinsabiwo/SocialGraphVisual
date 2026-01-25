/**
 * Template Matcher
 * @module services/insights/matcher
 *
 * Matches analysis results to insight templates based on conditions.
 */

import type { AnalysisResult } from './analyzer.js';
import type { InsightCategory, Confidence } from '@vsg/shared';
import { communityTemplates } from './templates/community.js';
import { bridgeTemplates } from './templates/bridge.js';
import { engagementTemplates } from './templates/engagement.js';
import { growthTemplates } from './templates/growth.js';

// ============================================================
// TYPES
// ============================================================

export interface InsightTemplate {
  id: string;
  category: InsightCategory;
  type: string;
  title: string;
  description: string;
  conditions: TemplateCondition[];
  priority: number;
  requiredVariables: string[];
}

export interface TemplateCondition {
  field: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne' | 'between' | 'in';
  value: number | number[] | string | string[];
  weight?: number; // How much this condition affects confidence
}

export interface TemplateMatch {
  template: InsightTemplate;
  variables: Record<string, unknown>;
  confidence: Confidence;
  priority: number;
  score: number;
}

export interface MatchOptions {
  categories?: InsightCategory[];
  minConfidence?: Confidence;
}

// ============================================================
// ALL TEMPLATES
// ============================================================

const ALL_TEMPLATES: InsightTemplate[] = [
  ...communityTemplates,
  ...bridgeTemplates,
  ...engagementTemplates,
  ...growthTemplates,
];

// ============================================================
// TEMPLATE MATCHING
// ============================================================

/**
 * Match templates to analysis results
 */
export function matchTemplates(
  analysis: AnalysisResult,
  options?: MatchOptions
): TemplateMatch[] {
  const { categories, minConfidence = 'LOW' } = options || {};

  const matches: TemplateMatch[] = [];

  // Filter templates by category if specified
  let templates = ALL_TEMPLATES;
  if (categories && categories.length > 0) {
    templates = templates.filter((t: InsightTemplate) => categories.includes(t.category));
  }

  // Try to match each template
  for (const template of templates) {
    const match = tryMatch(template, analysis);
    if (match && meetsMinConfidence(match.confidence, minConfidence)) {
      matches.push(match);
    }
  }

  // Sort by priority and score
  matches.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return b.score - a.score;
  });

  return matches;
}

/**
 * Try to match a single template
 */
function tryMatch(
  template: InsightTemplate,
  analysis: AnalysisResult
): TemplateMatch | null {
  let totalWeight = 0;
  let matchedWeight = 0;

  // Check all conditions
  for (const condition of template.conditions) {
    const weight = condition.weight || 1;
    totalWeight += weight;

    const value = getFieldValue(analysis, condition.field);
    if (evaluateCondition(value, condition)) {
      matchedWeight += weight;
    }
  }

  // All conditions must match
  if (matchedWeight < totalWeight) {
    return null;
  }

  // Calculate confidence based on how well conditions matched
  const score = totalWeight > 0 ? matchedWeight / totalWeight : 1;
  const confidence = scoreToConfidence(score);

  // Extract variables for template interpolation
  const variables = extractVariables(template, analysis);

  return {
    template,
    variables,
    confidence,
    priority: template.priority,
    score,
  };
}

// ============================================================
// CONDITION EVALUATION
// ============================================================

/**
 * Get a field value from analysis results (supports dot notation)
 */
function getFieldValue(analysis: AnalysisResult, field: string): unknown {
  const parts = field.split('.');
  let value: unknown = analysis;

  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      // Handle array indexing
      const index = parseInt(part, 10);
      if (!isNaN(index)) {
        value = value[index];
      } else if (part === 'length') {
        value = value.length;
      } else {
        // Try to get property from first element
        const firstElement = value[0] as Record<string, unknown> | undefined;
        value = firstElement?.[part];
      }
    } else if (typeof value === 'object') {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Evaluate a condition against a value
 */
function evaluateCondition(
  value: unknown,
  condition: TemplateCondition
): boolean {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value));

  switch (condition.operator) {
    case 'gt':
      return numValue > (condition.value as number);
    case 'lt':
      return numValue < (condition.value as number);
    case 'gte':
      return numValue >= (condition.value as number);
    case 'lte':
      return numValue <= (condition.value as number);
    case 'eq':
      return value === condition.value;
    case 'ne':
      return value !== condition.value;
    case 'between': {
      const range = condition.value as number[];
      const min = range[0];
      const max = range[1];
      if (min === undefined || max === undefined) return false;
      return numValue >= min && numValue <= max;
    }
    case 'in':
      return (condition.value as unknown[]).includes(value);
    default:
      return false;
  }
}

// ============================================================
// VARIABLE EXTRACTION
// ============================================================

/**
 * Extract variables needed for template interpolation
 */
function extractVariables(
  template: InsightTemplate,
  analysis: AnalysisResult
): Record<string, unknown> {
  const variables: Record<string, unknown> = {};

  // Always include basic metrics
  variables['nodeCount'] = analysis.nodeCount;
  variables['edgeCount'] = analysis.edgeCount;
  variables['density'] = (analysis.density * 100).toFixed(1);
  variables['averageDegree'] = analysis.averageDegree.toFixed(1);
  variables['reciprocity'] = (analysis.reciprocity * 100).toFixed(1);

  // Community variables
  variables['communityCount'] = analysis.communities.length;
  variables['largestCommunity'] = analysis.communities[0];
  variables['largestCommunitySize'] = analysis.communities[0]?.size || 0;
  variables['largestCommunityPercentage'] =
    analysis.communities[0]?.percentage.toFixed(1) || '0';
  variables['modularity'] = analysis.modularity.toFixed(3);

  // Influencer variables
  variables['topInfluencer'] = analysis.topInfluencers[0];
  variables['topInfluencerCount'] = analysis.topInfluencers.length;
  variables['topInfluencers'] = analysis.topInfluencers.slice(0, 5);

  // Bridge node variables
  variables['topBridge'] = analysis.bridgeNodes[0];
  variables['bridgeCount'] = analysis.bridgeNodes.length;
  variables['bridgeNodes'] = analysis.bridgeNodes.slice(0, 5);

  // Engagement variables
  variables['echoChamberScore'] = analysis.echoChamberScore.toFixed(1);
  variables['engagementDistribution'] = analysis.engagementDistribution;
  variables['coreEngagers'] = analysis.engagementDistribution.find(
    (t) => t.tier === 'core'
  );
  variables['peripheralUsers'] = analysis.engagementDistribution.find(
    (t) => t.tier === 'peripheral'
  );

  // Growth variables
  variables['potentialConnections'] = analysis.potentialConnections;
  variables['networkMaturity'] = analysis.networkMaturity.toFixed(1);

  // Extract required variables from analysis
  for (const varName of template.requiredVariables) {
    if (!(varName in variables)) {
      const value = getFieldValue(analysis, varName);
      if (value !== undefined) {
        variables[varName] = value;
      }
    }
  }

  return variables;
}

// ============================================================
// CONFIDENCE CALCULATION
// ============================================================

/**
 * Convert match score to confidence level
 */
function scoreToConfidence(score: number): Confidence {
  if (score >= 0.95) return 'HIGH';
  if (score >= 0.8) return 'HIGH';
  if (score >= 0.6) return 'MEDIUM';
  if (score >= 0.4) return 'LOW';
  return 'LOW';
}

/**
 * Check if confidence meets minimum threshold
 */
function meetsMinConfidence(
  confidence: Confidence,
  minConfidence: Confidence
): boolean {
  const levels: Confidence[] = ['LOW', 'MEDIUM', 'HIGH'];
  return levels.indexOf(confidence) >= levels.indexOf(minConfidence);
}

export default matchTemplates;
