/**
 * Growth Insight Templates
 * @module services/insights/templates/growth
 */

import type { InsightTemplate } from '../matcher.js';

export const growthTemplates: InsightTemplate[] = [
  // High growth potential
  {
    id: 'growth-high-potential',
    category: 'GROWTH',
    type: 'high_potential',
    title: 'High Growth Potential',
    description:
      'Your network has {{potentialConnections}} potential connection opportunities between communities. Strategic bridge-building could significantly expand your reach.',
    conditions: [
      { field: 'potentialConnections', operator: 'gte', value: 50 },
      { field: 'communities.length', operator: 'gte', value: 3 },
    ],
    priority: 85,
    requiredVariables: ['potentialConnections'],
  },

  // Network maturity
  {
    id: 'growth-mature-network',
    category: 'GROWTH',
    type: 'mature_network',
    title: 'Mature Network Structure',
    description:
      'With a maturity score of {{networkMaturity}}%, your network has well-established patterns. Focus on deepening existing relationships rather than expanding.',
    conditions: [
      { field: 'networkMaturity', operator: 'gte', value: 70 },
    ],
    priority: 75,
    requiredVariables: ['networkMaturity'],
  },

  // Growing network
  {
    id: 'growth-developing',
    category: 'GROWTH',
    type: 'developing_network',
    title: 'Developing Network',
    description:
      'Your network maturity is {{networkMaturity}}%, indicating room for growth. Continue building connections to develop stronger network effects.',
    conditions: [
      { field: 'networkMaturity', operator: 'between', value: [30, 70] },
    ],
    priority: 70,
    requiredVariables: ['networkMaturity'],
  },

  // Early stage network
  {
    id: 'growth-early-stage',
    category: 'GROWTH',
    type: 'early_stage',
    title: 'Early Stage Network',
    description:
      'With {{nodeCount}} connections and {{networkMaturity}}% maturity, your network is in early development. Focus on building quality connections across diverse areas.',
    conditions: [
      { field: 'networkMaturity', operator: 'lt', value: 30 },
      { field: 'nodeCount', operator: 'lt', value: 100 },
    ],
    priority: 65,
    requiredVariables: ['nodeCount', 'networkMaturity'],
  },

  // Bridge growth opportunity
  {
    id: 'growth-bridge-opportunity',
    category: 'GROWTH',
    type: 'bridge_opportunity',
    title: 'Community Bridge Opportunity',
    description:
      'Your {{communityCount}} communities have limited connections between them. Building bridges could unlock new opportunities and perspectives.',
    conditions: [
      { field: 'communities.length', operator: 'gte', value: 3 },
      { field: 'echoChamberScore', operator: 'gte', value: 70 },
    ],
    priority: 80,
    requiredVariables: ['communityCount'],
  },

  // Influencer connection opportunity
  {
    id: 'growth-influencer-access',
    category: 'GROWTH',
    type: 'influencer_access',
    title: 'Path to Influencers',
    description:
      'Your top {{bridgeCount}} bridge connections provide potential paths to influential accounts outside your immediate network.',
    conditions: [
      { field: 'bridgeNodes.length', operator: 'gte', value: 3 },
      { field: 'topInfluencers.length', operator: 'gte', value: 5 },
    ],
    priority: 70,
    requiredVariables: ['bridgeCount'],
  },

  // Small community expansion
  {
    id: 'growth-small-community',
    category: 'GROWTH',
    type: 'small_community_expansion',
    title: 'Smaller Communities Need Growth',
    description:
      'Some of your communities are relatively small. Expanding these groups could create a more balanced and resilient network.',
    conditions: [
      { field: 'communities.length', operator: 'gte', value: 4 },
      { field: 'communities.2.percentage', operator: 'lt', value: 10 },
    ],
    priority: 60,
    requiredVariables: [],
  },

  // Density growth opportunity
  {
    id: 'growth-density',
    category: 'GROWTH',
    type: 'density_opportunity',
    title: 'Connection Density Opportunity',
    description:
      'At {{density}}% density, many potential connections within your network dont exist. Introducing your connections to each other could strengthen your network.',
    conditions: [
      { field: 'density', operator: 'lt', value: 0.05 },
      { field: 'nodeCount', operator: 'gte', value: 50 },
    ],
    priority: 65,
    requiredVariables: ['density'],
  },

  // Reciprocity growth
  {
    id: 'growth-reciprocity',
    category: 'GROWTH',
    type: 'reciprocity_opportunity',
    title: 'Strengthen Existing Connections',
    description:
      'With {{reciprocity}}% reciprocity, many of your connections are one-way. Engaging more with these accounts could turn them into mutual relationships.',
    conditions: [
      { field: 'reciprocity', operator: 'lt', value: 0.4 },
      { field: 'edgeCount', operator: 'gte', value: 50 },
    ],
    priority: 60,
    requiredVariables: ['reciprocity'],
  },

  // Large network optimization
  {
    id: 'growth-large-network',
    category: 'GROWTH',
    type: 'optimize_large_network',
    title: 'Large Network Optimization',
    description:
      'With {{nodeCount}} connections, focus on quality over quantity. Identify and nurture your most valuable relationships.',
    conditions: [
      { field: 'nodeCount', operator: 'gte', value: 500 },
    ],
    priority: 70,
    requiredVariables: ['nodeCount'],
  },
];

export default growthTemplates;
