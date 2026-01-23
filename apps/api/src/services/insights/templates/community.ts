/**
 * Community Insight Templates
 * @module services/insights/templates/community
 */

import type { InsightTemplate } from '../matcher.js';

export const communityTemplates: InsightTemplate[] = [
  // Large community detected
  {
    id: 'community-large-dominant',
    category: 'COMMUNITY',
    type: 'dominant_community',
    title: 'Dominant Community Detected',
    description:
      'Your network has a dominant community containing {{largestCommunityPercentage}}% of connections ({{largestCommunitySize}} people). This suggests a strong core group that forms the backbone of your social network.',
    conditions: [
      { field: 'communities.length', operator: 'gte', value: 1 },
      { field: 'communities.0.percentage', operator: 'gte', value: 40 },
    ],
    priority: 90,
    requiredVariables: ['largestCommunityPercentage', 'largestCommunitySize'],
  },

  // Multiple balanced communities
  {
    id: 'community-balanced',
    category: 'COMMUNITY',
    type: 'balanced_communities',
    title: 'Well-Balanced Network Structure',
    description:
      'Your network has {{communityCount}} distinct communities with relatively balanced sizes. This indicates diverse social circles without over-reliance on any single group.',
    conditions: [
      { field: 'communities.length', operator: 'between', value: [3, 10] },
      { field: 'communities.0.percentage', operator: 'lt', value: 40 },
    ],
    priority: 85,
    requiredVariables: ['communityCount'],
  },

  // High modularity
  {
    id: 'community-high-modularity',
    category: 'COMMUNITY',
    type: 'high_modularity',
    title: 'Clearly Defined Social Circles',
    description:
      'Your network shows strong community separation (modularity: {{modularity}}). Your social circles are well-defined with clear boundaries between different groups.',
    conditions: [
      { field: 'modularity', operator: 'gte', value: 0.4 },
    ],
    priority: 80,
    requiredVariables: ['modularity'],
  },

  // Dense community
  {
    id: 'community-dense',
    category: 'COMMUNITY',
    type: 'dense_community',
    title: 'Tightly-Knit Core Group',
    description:
      'Your largest community is highly interconnected with {{largestCommunity.density}}% internal density. Members in this group frequently interact with each other.',
    conditions: [
      { field: 'communities.0.density', operator: 'gte', value: 0.3 },
    ],
    priority: 75,
    requiredVariables: ['largestCommunity'],
  },

  // Single community (potential echo chamber)
  {
    id: 'community-single',
    category: 'COMMUNITY',
    type: 'single_community',
    title: 'Unified Network',
    description:
      'Your network primarily consists of a single community with {{largestCommunitySize}} members. Consider diversifying your connections to gain broader perspectives.',
    conditions: [
      { field: 'communities.length', operator: 'eq', value: 1 },
      { field: 'nodeCount', operator: 'gte', value: 10 },
    ],
    priority: 70,
    requiredVariables: ['largestCommunitySize'],
  },

  // Many small communities
  {
    id: 'community-fragmented',
    category: 'COMMUNITY',
    type: 'fragmented',
    title: 'Diverse but Fragmented Network',
    description:
      'Your network contains {{communityCount}} communities, but they tend to be small and disconnected. You might benefit from building bridges between your different social circles.',
    conditions: [
      { field: 'communities.length', operator: 'gte', value: 10 },
      { field: 'communities.0.size', operator: 'lt', value: 20 },
    ],
    priority: 65,
    requiredVariables: ['communityCount'],
  },

  // Two-community split
  {
    id: 'community-bipolar',
    category: 'COMMUNITY',
    type: 'bipolar',
    title: 'Two Major Social Circles',
    description:
      'Your network is divided into two primary communities. This could represent work/personal, online/offline, or other natural divisions in your social life.',
    conditions: [
      { field: 'communities.length', operator: 'eq', value: 2 },
      { field: 'communities.1.percentage', operator: 'gte', value: 25 },
    ],
    priority: 75,
    requiredVariables: [],
  },

  // Growing network
  {
    id: 'community-emerging',
    category: 'COMMUNITY',
    type: 'emerging',
    title: 'Emerging Social Structure',
    description:
      'With {{nodeCount}} connections and {{communityCount}} communities forming, your network is still developing its structure. Continue building connections to see clearer patterns emerge.',
    conditions: [
      { field: 'nodeCount', operator: 'between', value: [10, 50] },
    ],
    priority: 50,
    requiredVariables: ['nodeCount', 'communityCount'],
  },
];

export default communityTemplates;
