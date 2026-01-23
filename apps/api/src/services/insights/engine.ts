/**
 * Insight Engine
 * @module services/insights/engine
 *
 * Main entry point for generating insights from graph analysis.
 * Orchestrates analysis, matching, and template interpolation.
 */

import { prisma } from '../../config/database.js';
import { getGraphInternal } from '../graph/storage.js';
import { analyzeGraph } from './analyzer.js';
import { matchTemplates } from './matcher.js';
import { interpolateTemplate } from './interpolator.js';
import type { InsightCategory, Confidence } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export interface GeneratedInsight {
  category: InsightCategory;
  type: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
  confidence: Confidence;
  priority: number;
}

export interface InsightGenerationResult {
  graphId: string;
  insights: GeneratedInsight[];
  analysisMetrics: {
    communityCount: number;
    topInfluencers: number;
    bridgeNodes: number;
    echoChamberScore: number;
  };
  generatedAt: number;
}

export interface InsightGenerationOptions {
  maxInsights?: number;
  categories?: InsightCategory[];
  minConfidence?: Confidence;
}

// ============================================================
// INSIGHT GENERATION
// ============================================================

/**
 * Generate insights for a graph
 */
export async function generateInsights(
  graphId: string,
  options?: InsightGenerationOptions
): Promise<InsightGenerationResult> {
  const {
    maxInsights = 20,
    categories,
    minConfidence = 'LOW',
  } = options || {};

  // Step 1: Get graph data
  const graph = await getGraphInternal(graphId);
  if (!graph) {
    throw new Error(`Graph not found: ${graphId}`);
  }

  // Step 2: Run analysis
  const analysis = await analyzeGraph(graph);

  // Step 3: Match templates to analysis results
  const matchedTemplates = matchTemplates(analysis, {
    ...(categories ? { categories } : {}),
    minConfidence,
  });

  // Step 4: Generate insights from matched templates
  const insights: GeneratedInsight[] = [];

  for (const match of matchedTemplates) {
    const interpolated = interpolateTemplate(match.template, match.variables);

    insights.push({
      category: match.template.category,
      type: match.template.type,
      title: interpolated.title,
      description: interpolated.description,
      data: {
        ...match.variables,
        templateId: match.template.id,
      },
      confidence: match.confidence,
      priority: match.priority,
    });
  }

  // Step 5: Sort by priority and limit
  insights.sort((a, b) => b.priority - a.priority);
  const limitedInsights = insights.slice(0, maxInsights);

  return {
    graphId,
    insights: limitedInsights,
    analysisMetrics: {
      communityCount: analysis.communities.length,
      topInfluencers: analysis.topInfluencers.length,
      bridgeNodes: analysis.bridgeNodes.length,
      echoChamberScore: analysis.echoChamberScore,
    },
    generatedAt: Date.now(),
  };
}

/**
 * Generate and save insights to database
 */
export async function generateAndSaveInsights(
  graphId: string,
  options?: InsightGenerationOptions
): Promise<InsightGenerationResult> {
  // Generate insights
  const result = await generateInsights(graphId, options);

  // Delete existing insights for this graph
  await prisma.insight.deleteMany({
    where: { graphId },
  });

  // Save new insights
  await prisma.insight.createMany({
    data: result.insights.map((insight: GeneratedInsight) => ({
      graphId,
      category: insight.category,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      data: JSON.parse(JSON.stringify(insight.data)),
      confidence: insight.confidence,
    })),
  });

  return result;
}

/**
 * Get stored insights for a graph
 */
export async function getStoredInsights(
  graphId: string,
  options?: {
    categories?: InsightCategory[];
    limit?: number;
  }
): Promise<GeneratedInsight[]> {
  const { categories, limit } = options || {};

  const where: Record<string, unknown> = { graphId };
  if (categories && categories.length > 0) {
    where['category'] = { in: categories };
  }

  const insights = await prisma.insight.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(limit !== undefined ? { take: limit } : {}),
  });

  return insights.map((i: { category: string; type: string; title: string; description: string; data: unknown; confidence: string }) => ({
    category: i.category as InsightCategory,
    type: i.type,
    title: i.title,
    description: i.description,
    data: i.data as Record<string, unknown>,
    confidence: i.confidence as Confidence,
    priority: 0, // Not stored, would need to recalculate
  }));
}

/**
 * Refresh insights for a graph (regenerate)
 */
export async function refreshInsights(
  graphId: string
): Promise<InsightGenerationResult> {
  return generateAndSaveInsights(graphId);
}

// ============================================================
// INSIGHT QUERIES
// ============================================================

/**
 * Get insights count by category
 */
export async function getInsightCountsByCategory(
  graphId: string
): Promise<Record<InsightCategory, number>> {
  const results = await prisma.insight.groupBy({
    by: ['category'],
    where: { graphId },
    _count: { id: true },
  });

  const counts: Record<string, number> = {
    NETWORK: 0,
    COMMUNITY: 0,
    ENGAGEMENT: 0,
    GROWTH: 0,
  };

  for (const result of results) {
    counts[result.category] = result._count.id;
  }

  return counts as Record<InsightCategory, number>;
}

/**
 * Get high-confidence insights only
 */
export async function getHighConfidenceInsights(
  graphId: string,
  limit: number = 5
): Promise<GeneratedInsight[]> {
  const insights = await prisma.insight.findMany({
    where: {
      graphId,
      confidence: { in: ['HIGH'] },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return insights.map((i: { category: string; type: string; title: string; description: string; data: unknown; confidence: string }) => ({
    category: i.category as InsightCategory,
    type: i.type,
    title: i.title,
    description: i.description,
    data: i.data as Record<string, unknown>,
    confidence: i.confidence as Confidence,
    priority: 0,
  }));
}

export default {
  generateInsights,
  generateAndSaveInsights,
  getStoredInsights,
  refreshInsights,
  getInsightCountsByCategory,
  getHighConfidenceInsights,
};
