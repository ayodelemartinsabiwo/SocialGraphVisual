/**
 * Bridge Node Insight Templates
 * @module services/insights/templates/bridge
 */

import type { InsightTemplate } from '../matcher.js';

export const bridgeTemplates: InsightTemplate[] = [
  // Strong bridge connections
  {
    id: 'bridge-strong-connectors',
    category: 'NETWORK',
    type: 'strong_bridges',
    title: 'Key Network Connectors Identified',
    description:
      'You have {{bridgeCount}} accounts that act as bridges between your different communities. These connections are crucial for information flow across your network.',
    conditions: [
      { field: 'bridgeNodes.length', operator: 'gte', value: 3 },
      { field: 'bridgeNodes.0.score', operator: 'gte', value: 0.1 },
    ],
    priority: 85,
    requiredVariables: ['bridgeCount', 'bridgeNodes'],
  },

  // Single dominant bridge
  {
    id: 'bridge-dominant',
    category: 'NETWORK',
    type: 'dominant_bridge',
    title: 'Critical Network Bridge',
    description:
      'One account serves as the primary bridge in your network with a betweenness score of {{topBridge.score}}. This connection is essential for keeping your communities linked.',
    conditions: [
      { field: 'bridgeNodes.0.score', operator: 'gte', value: 0.2 },
      { field: 'bridgeNodes.1.score', operator: 'lt', value: 0.1 },
    ],
    priority: 80,
    requiredVariables: ['topBridge'],
  },

  // Distributed bridge structure
  {
    id: 'bridge-distributed',
    category: 'NETWORK',
    type: 'distributed_bridges',
    title: 'Resilient Network Structure',
    description:
      'Your network has {{bridgeCount}} bridge accounts with similar importance, creating a resilient structure. If one connection weakens, others can maintain network cohesion.',
    conditions: [
      { field: 'bridgeNodes.length', operator: 'gte', value: 5 },
      { field: 'bridgeNodes.0.score', operator: 'lt', value: 0.15 },
    ],
    priority: 75,
    requiredVariables: ['bridgeCount'],
  },

  // No clear bridges (isolated communities)
  {
    id: 'bridge-missing',
    category: 'NETWORK',
    type: 'isolated_communities',
    title: 'Limited Cross-Community Connections',
    description:
      'Your communities have few bridges between them. Consider building connections that span different social circles to increase information diversity.',
    conditions: [
      { field: 'communities.length', operator: 'gte', value: 3 },
      { field: 'bridgeNodes.0.score', operator: 'lt', value: 0.05 },
    ],
    priority: 70,
    requiredVariables: [],
  },

  // Bridge influence correlation
  {
    id: 'bridge-influential',
    category: 'NETWORK',
    type: 'influential_bridges',
    title: 'Bridges are Also Influencers',
    description:
      'Your top bridge accounts also rank highly for influence. These connections are both structurally important and highly engaged with.',
    conditions: [
      { field: 'bridgeNodes.0.score', operator: 'gte', value: 0.1 },
      { field: 'topInfluencers.0.score', operator: 'gte', value: 0.1 },
    ],
    priority: 70,
    requiredVariables: [],
  },

  // Network centralization
  {
    id: 'bridge-centralized',
    category: 'NETWORK',
    type: 'centralized',
    title: 'Centralized Network Structure',
    description:
      'Your network flows through a small number of key accounts. This creates efficiency but also vulnerability if these connections change.',
    conditions: [
      { field: 'bridgeNodes.0.score', operator: 'gte', value: 0.25 },
    ],
    priority: 75,
    requiredVariables: [],
  },

  // Decentralized network
  {
    id: 'bridge-decentralized',
    category: 'NETWORK',
    type: 'decentralized',
    title: 'Decentralized Network',
    description:
      'No single account dominates your network structure. Information and influence are spread across many connections.',
    conditions: [
      { field: 'nodeCount', operator: 'gte', value: 50 },
      { field: 'bridgeNodes.0.score', operator: 'lt', value: 0.1 },
    ],
    priority: 65,
    requiredVariables: [],
  },

  // Peripheral bridges
  {
    id: 'bridge-peripheral',
    category: 'NETWORK',
    type: 'peripheral_bridges',
    title: 'Bridges at the Edges',
    description:
      'Your bridge accounts connect to peripheral parts of your network, potentially linking you to new and diverse communities.',
    conditions: [
      { field: 'bridgeNodes.length', operator: 'gte', value: 2 },
      { field: 'density', operator: 'lt', value: 0.1 },
    ],
    priority: 60,
    requiredVariables: [],
  },
];

export default bridgeTemplates;
