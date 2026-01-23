/**
 * Engagement Insight Templates
 * @module services/insights/templates/engagement
 */

import type { InsightTemplate } from '../matcher.js';

export const engagementTemplates: InsightTemplate[] = [
  // High echo chamber
  {
    id: 'engagement-echo-chamber-high',
    category: 'ENGAGEMENT',
    type: 'high_echo_chamber',
    title: 'Echo Chamber Alert',
    description:
      'Your network shows {{echoChamberScore}}% internal community engagement, indicating a potential echo chamber effect. Most of your connections interact within the same groups.',
    conditions: [
      { field: 'echoChamberScore', operator: 'gte', value: 80 },
    ],
    priority: 90,
    requiredVariables: ['echoChamberScore'],
  },

  // Moderate echo chamber
  {
    id: 'engagement-echo-chamber-moderate',
    category: 'ENGAGEMENT',
    type: 'moderate_echo_chamber',
    title: 'Moderate Information Clustering',
    description:
      'With {{echoChamberScore}}% intra-community engagement, your network has some clustering but maintains cross-group connections. This is a balanced pattern.',
    conditions: [
      { field: 'echoChamberScore', operator: 'between', value: [50, 80] },
    ],
    priority: 70,
    requiredVariables: ['echoChamberScore'],
  },

  // Diverse engagement
  {
    id: 'engagement-diverse',
    category: 'ENGAGEMENT',
    type: 'diverse_engagement',
    title: 'Diverse Information Flow',
    description:
      'Only {{echoChamberScore}}% of connections stay within communities. Your network has excellent cross-pollination of ideas between different groups.',
    conditions: [
      { field: 'echoChamberScore', operator: 'lt', value: 50 },
      { field: 'communities.length', operator: 'gte', value: 3 },
    ],
    priority: 85,
    requiredVariables: ['echoChamberScore'],
  },

  // Core engagers
  {
    id: 'engagement-core-group',
    category: 'ENGAGEMENT',
    type: 'core_group',
    title: 'Active Core Group',
    description:
      'Your top {{coreEngagers.percentage}}% of connections ({{coreEngagers.count}} accounts) form a highly engaged core. These are your most active and connected relationships.',
    conditions: [
      { field: 'engagementDistribution.0.percentage', operator: 'between', value: [5, 20] },
    ],
    priority: 75,
    requiredVariables: ['coreEngagers'],
  },

  // Large peripheral group
  {
    id: 'engagement-large-peripheral',
    category: 'ENGAGEMENT',
    type: 'large_peripheral',
    title: 'Many Peripheral Connections',
    description:
      '{{peripheralUsers.percentage}}% of your network ({{peripheralUsers.count}} accounts) are peripheral connections with minimal engagement. Consider whether these add value to your network.',
    conditions: [
      { field: 'engagementDistribution.3.percentage', operator: 'gte', value: 40 },
    ],
    priority: 70,
    requiredVariables: ['peripheralUsers'],
  },

  // High reciprocity
  {
    id: 'engagement-high-reciprocity',
    category: 'ENGAGEMENT',
    type: 'high_reciprocity',
    title: 'Strong Mutual Connections',
    description:
      '{{reciprocity}}% of your connections are mutual (bidirectional). This indicates strong, reciprocal relationships rather than one-way following.',
    conditions: [
      { field: 'reciprocity', operator: 'gte', value: 0.6 },
    ],
    priority: 80,
    requiredVariables: ['reciprocity'],
  },

  // Low reciprocity
  {
    id: 'engagement-low-reciprocity',
    category: 'ENGAGEMENT',
    type: 'low_reciprocity',
    title: 'One-Way Connections Dominant',
    description:
      'Only {{reciprocity}}% of your connections are mutual. Your network is largely asymmetric, with most relationships being one-directional.',
    conditions: [
      { field: 'reciprocity', operator: 'lt', value: 0.3 },
    ],
    priority: 65,
    requiredVariables: ['reciprocity'],
  },

  // Top influencer engagement
  {
    id: 'engagement-influencer-concentration',
    category: 'ENGAGEMENT',
    type: 'influencer_concentration',
    title: 'Engagement Concentrated on Influencers',
    description:
      'Your top {{topInfluencerCount}} influencers receive disproportionate engagement. The top influencer has a PageRank score of {{topInfluencer.score}}.',
    conditions: [
      { field: 'topInfluencers.0.score', operator: 'gte', value: 0.15 },
    ],
    priority: 70,
    requiredVariables: ['topInfluencerCount', 'topInfluencer'],
  },

  // Dense network engagement
  {
    id: 'engagement-dense-network',
    category: 'ENGAGEMENT',
    type: 'dense_network',
    title: 'Highly Connected Network',
    description:
      'With {{density}}% density and {{averageDegree}} average connections per node, your network is highly interconnected with frequent engagement across the board.',
    conditions: [
      { field: 'density', operator: 'gte', value: 0.1 },
    ],
    priority: 75,
    requiredVariables: ['density', 'averageDegree'],
  },

  // Sparse engagement
  {
    id: 'engagement-sparse',
    category: 'ENGAGEMENT',
    type: 'sparse_engagement',
    title: 'Sparse Connection Pattern',
    description:
      'Your network has only {{density}}% density. There are many potential connections that dont exist yet between your contacts.',
    conditions: [
      { field: 'density', operator: 'lt', value: 0.02 },
      { field: 'nodeCount', operator: 'gte', value: 50 },
    ],
    priority: 60,
    requiredVariables: ['density'],
  },
];

export default engagementTemplates;
