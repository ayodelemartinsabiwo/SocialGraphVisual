# **Visual Social Graph: SRS Amendment - Algorithm-First Recommendations**
## **Version 1.2 - Replacing External AI APIs with Elegant Algorithmic Solutions**

*"Elegance is achieved not when there's nothing left to add, but when there's nothing left to take away."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.2 (Algorithm-First Amendment) |
| **Date** | December 2025 |
| **Status** | Proposed Amendment to SRS v1.1 |
| **Amends** | Section 4.5 (AI-Powered Recommendations), Section 11 (Technology Stack) |
| **Owner** | Engineering / Architecture |
| **Philosophy** | Aligned with CLAUDE_ACE.md principles |

**Amendment Purpose:**

This document formalizes the replacement of external AI platform APIs (Anthropic Claude, OpenAI) with an algorithm-first, template-driven recommendation engine. This change:

- Strengthens the privacy-first positioning (no data to third parties)
- Eliminates unpredictable API costs ($0 vs $500-$10K/month)
- Reduces latency (500ms vs 10s)
- Increases reliability (no external dependencies)
- Embodies the "Simplify Ruthlessly" principle from CLAUDE_ACE.md

---

## **Table of Contents**

1. [Philosophy & Rationale](#1-philosophy--rationale)
2. [Architecture Changes](#2-architecture-changes)
3. [Amended Section 4.5: Algorithm-Powered Recommendations](#3-amended-section-45-algorithm-powered-recommendations)
4. [Phase 1: Core Algorithm Insights (MVP)](#4-phase-1-core-algorithm-insights-mvp)
5. [Phase 2: Rich Template System (Enhancement)](#5-phase-2-rich-template-system-enhancement)
6. [Phase 3: Optional Local Intelligence](#6-phase-3-optional-local-intelligence)
7. [Template Library Architecture](#7-template-library-architecture)
8. [Testing Strategy](#8-testing-strategy)
9. [Technology Stack Amendment](#9-technology-stack-amendment)
10. [Migration from SRS v1.1](#10-migration-from-srs-v11)

---

## **1. Philosophy & Rationale**

### **1.1 Thinking Different (CLAUDE_ACE Principle #1)**

The original SRS assumed external AI APIs were necessary for "intelligent" recommendations. But let's question this assumption:

```
Original Assumption:
"AI-powered recommendations" require Large Language Models (LLMs)

Reality Check:
├─ What makes a recommendation valuable?
│  ├─ Accuracy: Based on real data (graph metrics)
│  ├─ Actionability: Specific, executable steps
│  ├─ Personalization: Relevant to user's context
│  └─ Clarity: Easy to understand
│
├─ What do LLMs actually provide?
│  ├─ Natural language synthesis
│  ├─ Variation in phrasing
│  └─ Contextual adaptation
│
└─ Can we achieve the same outcome differently?
   YES. Templates + algorithms + rules = equivalent quality
```

**The insight:** LLMs are a solution looking for a problem. Our problem is already solved by graph algorithms. We only need LLMs for "making it sound nice" — which templates do equally well.

### **1.2 Simplifying Ruthlessly (CLAUDE_ACE Principle #6)**

```
Before (SRS v1.1):
┌─────────────────────────────────────────────────────────────┐
│  User Data → Graph Analysis → AI API → Response → Display  │
│                                  ↑                          │
│                           $0.01-0.05/req                    │
│                           10s latency                       │
│                           External dependency               │
│                           Data leaves our system            │
└─────────────────────────────────────────────────────────────┘

After (SRS v1.2):
┌─────────────────────────────────────────────────────────────┐
│  User Data → Graph Analysis → Template Engine → Display     │
│                                     ↑                       │
│                              $0/request                     │
│                              <500ms latency                 │
│                              100% internal                  │
│                              Data never leaves              │
└─────────────────────────────────────────────────────────────┘
```

**Removed complexity:**
- External API integration code
- API key management
- Rate limiting for external APIs
- Cost monitoring and circuit breakers
- Fallback provider logic
- Privacy consent for AI processing

**Preserved power:**
- Personalized recommendations
- Actionable insights
- Confidence levels
- Natural language narratives

### **1.3 Privacy as Competitive Moat**

```
Current positioning (PRD):
"We don't connect to your accounts. We respect them."

Enhanced positioning (with this amendment):
"We don't connect to your accounts. We don't send your data to AI.
Your network insights are generated entirely on our systems.
Privacy isn't a feature. It's our architecture."
```

This amendment transforms a technical decision into a marketing advantage.

---

## **2. Architecture Changes**

### **2.1 Original Architecture (SRS v1.1, Line 156-196)**

```
External Services:
├─ Sentry (error tracking)
├─ PostHog (privacy-friendly analytics)
├─ Resend (transactional email)
├─ Stripe (payments)
└─ Anthropic Claude API (AI recommendations)  ← REMOVED
```

### **2.2 Amended Architecture (SRS v1.2)**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (React 18)                           │ │
│  │  ├─ File Upload (Tus resumable)                        │ │
│  │  ├─ Web Worker (80% processing - privacy-first)        │ │
│  │  ├─ D3.js Visualization (force-directed graph)         │ │
│  │  ├─ Template Renderer (client-side narratives)  ← NEW  │ │
│  │  └─ Export Generator (client-side)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                    ↕ HTTPS (JWT auth)                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              API Backend (Node.js + Express)                 │
│  ├─ Auth Service (magic link, Google OAuth)                 │
│  ├─ Upload Service (Tus protocol)                           │
│  ├─ Insight Engine (algorithms + templates)          ← NEW  │
│  │  ├─ Graph Algorithms (graphology)                        │
│  │  ├─ Statistical Analysis (simple-statistics)             │
│  │  ├─ Template Engine (custom, rule-based)                 │
│  │  └─ Action Generator (conditional logic)                 │
│  ├─ Export Service (PDF generation)                         │
│  └─ Webhook Service (Stripe)                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ├─ PostgreSQL (metadata, user data, templates)      ← NEW  │
│  ├─ Cloudflare R2 (temporary file storage)                  │
│  └─ Redis (sessions, job queue)                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               External Services (SIMPLIFIED)                 │
│  ├─ Sentry (error tracking)                                 │
│  ├─ PostHog (privacy-friendly analytics)                    │
│  ├─ Resend (transactional email)                            │
│  └─ Stripe (payments)                                       │
│  [REMOVED: Anthropic Claude API, OpenAI fallback]           │
└─────────────────────────────────────────────────────────────┘
```

### **2.3 New Component: Insight Engine**

```
Insight Engine Architecture:
┌─────────────────────────────────────────────────────────────┐
│                     INSIGHT ENGINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  GRAPH LAYER     │  │  STATS LAYER     │                 │
│  │  ───────────     │  │  ───────────     │                 │
│  │  Louvain         │  │  Percentiles     │                 │
│  │  Betweenness     │  │  Distributions   │                 │
│  │  PageRank        │  │  Correlations    │                 │
│  │  Jaccard         │  │  Significance    │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                      │                           │
│           └──────────┬───────────┘                           │
│                      ↓                                       │
│  ┌──────────────────────────────────────────┐               │
│  │           ANALYSIS RESULTS                │               │
│  │  {                                        │               │
│  │    communities: [...],                    │               │
│  │    bridges: [...],                        │               │
│  │    engagementTiers: {...},                │               │
│  │    echoScore: 0.67,                       │               │
│  │    ...                                    │               │
│  │  }                                        │               │
│  └────────────────────┬─────────────────────┘               │
│                       ↓                                      │
│  ┌──────────────────────────────────────────┐               │
│  │         TEMPLATE SELECTOR                 │               │
│  │  ────────────────────                     │               │
│  │  • Match metrics to template categories   │               │
│  │  • Select confidence tier                 │               │
│  │  • Choose template variant (variety)      │               │
│  │  • Interpolate variables                  │               │
│  └────────────────────┬─────────────────────┘               │
│                       ↓                                      │
│  ┌──────────────────────────────────────────┐               │
│  │         ACTION GENERATOR                  │               │
│  │  ────────────────────                     │               │
│  │  • Rule-based action selection            │               │
│  │  • Context-aware suggestions              │               │
│  │  • Priority ordering                      │               │
│  └────────────────────┬─────────────────────┘               │
│                       ↓                                      │
│  ┌──────────────────────────────────────────┐               │
│  │         FINAL RECOMMENDATION              │               │
│  │  {                                        │               │
│  │    type: "bridge_accounts",               │               │
│  │    narrative: "Sarah connects 4...",      │               │
│  │    confidence: "high",                    │               │
│  │    actions: ["Engage with...", ...],      │               │
│  │    dataPoints: {...}                      │               │
│  │  }                                        │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## **3. Amended Section 4.5: Algorithm-Powered Recommendations**

**This section replaces SRS v1.1 Section 4.5 (AI-Powered Recommendations) entirely.**

### **SRS-F5.1: Insight Engine (REPLACES AI Recommendation Engine)**

```
REQUIREMENT SRS-F5.1: Algorithm-Powered Insight Engine
├─ Priority: P1 (high, Phase 2)
├─ Description: Generate personalized recommendations using graph algorithms
│  and template-based narrative synthesis (NO external AI APIs)
├─ Rationale:
│  ├─ Privacy: No user data sent to third-party AI providers
│  ├─ Cost: $0 per recommendation (vs $0.01-0.05 with AI APIs)
│  ├─ Latency: <500ms (vs <10s with AI APIs)
│  ├─ Reliability: No external API dependencies
│  └─ Philosophy: "Simplify Ruthlessly" (CLAUDE_ACE.md)
│
├─ Architecture:
│  ├─ Layer 1: Graph Algorithms
│  │  ├─ Library: graphology + graphology-communities + graphology-metrics
│  │  ├─ Algorithms: Louvain, betweenness, PageRank, Jaccard similarity
│  │  └─ Performance: <5s for 5K nodes
│  ├─ Layer 2: Statistical Analysis
│  │  ├─ Library: simple-statistics (or custom)
│  │  ├─ Functions: percentiles, distributions, significance tests
│  │  └─ Purpose: Confidence scoring, threshold detection
│  ├─ Layer 3: Template Engine
│  │  ├─ Implementation: Custom TypeScript module
│  │  ├─ Templates: 150+ pre-written narrative patterns
│  │  ├─ Selection: Rule-based matching (metrics → template)
│  │  └─ Interpolation: Variable substitution (names, numbers, %)
│  ├─ Layer 4: Action Generator
│  │  ├─ Implementation: Rule-based decision tree
│  │  ├─ Actions: 50+ pre-defined actionable suggestions
│  │  └─ Prioritization: Based on impact score (calculated)
│  └─ Output: Structured recommendation object (JSON)
│
├─ Privacy Guarantee:
│  ├─ All processing on VSG infrastructure
│  ├─ No data transmitted to external AI services
│  ├─ User data never leaves controlled environment
│  └─ Marketing claim: "100% AI-free insights"
│
├─ Performance Requirements:
│  ├─ Latency: <500ms (p95) for full recommendation set
│  ├─ Throughput: 100 concurrent requests
│  └─ Memory: <100MB per request
│
├─ Acceptance Criteria:
│  ├─ Recommendations rated "helpful" by >70% of users
│  ├─ Latency <500ms for 95th percentile
│  ├─ Zero external API calls for recommendations
│  └─ Template coverage: All insight types have 10+ variants
```

### **SRS-F5.2: Bridge Account Recommendations (Algorithm-Based)**

```
REQUIREMENT SRS-F5.2: Bridge Account Detection & Recommendations
├─ Priority: P1 (high, Phase 2)
├─ Description: Identify and explain high-value bridge accounts
│  using betweenness centrality and template narratives
│
├─ Algorithm:
│  ├─ Metric: Betweenness centrality (graphology-metrics)
│  ├─ Threshold: Top 5% of betweenness scores = "bridge"
│  ├─ Secondary: Communities connected (from Louvain)
│  └─ Tertiary: Engagement rate with user
│
├─ Confidence Scoring:
│  ├─ High (>80%): Betweenness > 0.3, connects 3+ communities
│  ├─ Medium (50-80%): Betweenness 0.15-0.3, connects 2 communities
│  └─ Low (<50%): Betweenness < 0.15, limited bridge characteristics
│
├─ Template Categories:
│  ├─ high_value_bridge (10 variants)
│  ├─ medium_value_bridge (8 variants)
│  ├─ emerging_bridge (6 variants)
│  └─ potential_bridge (5 variants)
│
├─ Example Output:
│  {
│    type: "bridge_accounts",
│    accounts: [
│      {
│        id: "hashed_id_123",
│        displayName: "Sarah",
│        betweenness: 0.42,
│        communitiesConnected: ["Tech", "Design", "Startup"],
│        engagementRate: 0.23
│      }
│    ],
│    narrative: "Sarah is a critical bridge connecting 3 distinct
│               communities in your network: Tech, Design, and Startup.
│               With a network position in the top 5%, engaging with
│               Sarah amplifies your reach across audience segments.",
│    confidence: "high",
│    actions: [
│      "Engage thoughtfully with Sarah's next 3 posts",
│      "Consider a collaboration proposal (high audience synergy)",
│      "Monitor Sarah's content themes for cross-community topics"
│    ],
│    dataPoints: {
│      betweenness: 0.42,
│      percentile: 95,
│      communitiesConnected: 3
│    }
│  }
│
├─ Acceptance Criteria:
│  ├─ Identified bridges match user intuition >80%
│  ├─ Narrative reads naturally (user testing)
│  ├─ Actions are specific and executable
│  └─ Confidence level correlates with actual bridge value
```

### **SRS-F5.3: Collaboration Suggestions (Algorithm-Based)**

```
REQUIREMENT SRS-F5.3: Collaboration Potential Analysis
├─ Priority: P2 (medium, Phase 2-3)
├─ Description: Identify high-synergy accounts for collaboration
│  using audience overlap and engagement pattern analysis
│
├─ Algorithms:
│  ├─ Audience Overlap: Jaccard similarity coefficient
│  │  └─ J(A,B) = |A ∩ B| / |A ∪ B|
│  ├─ Engagement Similarity: Cosine similarity of engagement vectors
│  ├─ Community Alignment: Shared community membership
│  └─ Complementarity Score: Inverse topic overlap (complementary > identical)
│
├─ Scoring Formula:
│  synergy_score = (
│    0.4 * audience_overlap +
│    0.3 * engagement_similarity +
│    0.2 * community_alignment +
│    0.1 * complementarity
│  )
│
├─ Thresholds:
│  ├─ High synergy: score > 0.7
│  ├─ Medium synergy: score 0.4-0.7
│  └─ Low synergy: score < 0.4 (not shown)
│
├─ Template Categories:
│  ├─ high_synergy_collab (8 variants)
│  ├─ complementary_collab (6 variants)
│  ├─ audience_expansion (6 variants)
│  └─ community_bridge_collab (5 variants)
│
├─ Action Templates:
│  ├─ Collaboration types: Joint content, newsletter swap, podcast guest
│  ├─ Outreach: Pre-written intro message templates (5 variants)
│  └─ Expected outcomes: Calculated audience expansion estimate
│
├─ Privacy Note:
│  ├─ Only shown for accounts already in user's network
│  ├─ No cross-user data analysis (each user analyzed independently)
│  └─ Synergy based on publicly visible network structure
│
├─ Acceptance Criteria:
│  ├─ Suggestions feel relevant to >70% of users
│  ├─ >5% of suggestions lead to actual outreach (tracked via export)
│  └─ Synergy score correlates with user-rated collaboration success
```

### **SRS-F5.4: Growth Opportunity Identification (Algorithm-Based)**

```
REQUIREMENT SRS-F5.4: Growth Opportunity Detection
├─ Priority: P1 (high, Phase 2)
├─ Description: Identify untapped segments and growth opportunities
│  using engagement analysis and network structure
│
├─ Opportunity Types:
│  ├─ Untapped Followers: High follower count, low engagement
│  │  ├─ Detection: Followers with engagement_rate < 1%
│  │  ├─ Analysis: Group by follow date, content type at follow time
│  │  └─ Recommendation: Re-engagement or cleanup
│  ├─ Underutilized Communities: Communities with low interaction
│  │  ├─ Detection: Community with user engagement < 5%
│  │  ├─ Analysis: Community characteristics, growth potential
│  │  └─ Recommendation: Targeted content or strategic exit
│  ├─ Bridge Opportunities: Potential connections to new communities
│  │  ├─ Detection: Accounts with high betweenness to unconnected communities
│  │  ├─ Analysis: Community size, relevance, engagement quality
│  │  └─ Recommendation: Strategic engagement to expand reach
│  └─ Engagement Optimization: Timing and format insights
│     ├─ Detection: Engagement variance by post time/type (if available)
│     ├─ Analysis: Statistical significance of patterns
│     └─ Recommendation: Optimal posting strategy
│
├─ Prioritization Algorithm:
│  priority_score = (
│    impact_potential * 0.5 +
│    effort_required_inverse * 0.3 +
│    confidence * 0.2
│  )
│
├─ Template Categories (per opportunity type):
│  ├─ untapped_followers (10 variants)
│  ├─ dormant_community (8 variants)
│  ├─ bridge_opportunity (8 variants)
│  ├─ engagement_timing (6 variants)
│  └─ cleanup_suggestion (5 variants)
│
├─ Acceptance Criteria:
│  ├─ >40% of users try at least one suggestion
│  ├─ >50% report positive results from tried suggestions
│  └─ Opportunities feel actionable and specific
```

### **SRS-F5.5: Cost & Performance (SIMPLIFIED)**

```
REQUIREMENT SRS-F5.5: Insight Engine Performance & Monitoring
├─ Priority: P1 (high, Phase 2)
├─ Description: Performance requirements and monitoring for algorithm-based
│  insight generation (NO external API cost management needed)
│
├─ Cost Structure (SIMPLIFIED):
│  ├─ Per recommendation: $0.00 (no external API)
│  ├─ Infrastructure: Included in existing server costs
│  ├─ Storage: Templates in PostgreSQL (negligible)
│  └─ Compute: Scales with server instances (predictable)
│
├─ Performance Requirements:
│  ├─ Latency:
│  │  ├─ Single insight: <100ms (p95)
│  │  ├─ Full recommendation set: <500ms (p95)
│  │  └─ Large network (>5K nodes): <2s (p95)
│  ├─ Throughput: 100 concurrent recommendation requests
│  ├─ Memory: <100MB per request
│  └─ CPU: <2s CPU time per request
│
├─ Caching Strategy:
│  ├─ Graph metrics: Cache per graph_id (Redis, 1-hour TTL)
│  ├─ Templates: Cache in memory (loaded at startup)
│  └─ Full recommendations: Cache per graph_id + insight_type (Redis, 15-min TTL)
│
├─ Rate Limiting (Abuse Prevention):
│  ├─ Per-user: 60 recommendation requests per hour
│  ├─ Per-account: 10 requests per minute
│  └─ Rationale: Prevent scraping, ensure fair usage
│
├─ Monitoring:
│  ├─ Metrics: Latency (p50, p95, p99), throughput, error rate
│  ├─ Alerts: Latency >1s (p95), error rate >1%
│  └─ Dashboard: Grafana or PostHog custom dashboard
│
├─ Acceptance Criteria:
│  ├─ Zero external API dependencies for recommendations
│  ├─ Latency <500ms for 95th percentile
│  ├─ 99.9% availability (matches overall SLA)
│  └─ Predictable cost (no usage-based surprises)
```

---

## **4. Phase 1: Core Algorithm Insights (MVP)**

### **4.1 Scope**

```
Phase 1 Focus: Foundation
├─ Timeline: Weeks 5-26 (aligned with SRS Phase 1)
├─ Goal: Prove algorithm-based insights deliver user value
├─ Constraint: Minimal template variety (focus on accuracy)
│
├─ Included:
│  ├─ Community Detection (SRS-F4.1) - Louvain algorithm
│  ├─ Engagement Circles (SRS-F4.2) - Statistical bucketing
│  ├─ Key Connectors (SRS-F4.3) - Betweenness centrality
│  ├─ Basic Confidence Levels (SRS-F4.5) - Statistical significance
│  └─ Template Engine v1 - 30 core templates
│
├─ Deferred to Phase 2:
│  ├─ Bridge Recommendations (SRS-F5.2) - Full narrative generation
│  ├─ Collaboration Suggestions (SRS-F5.3)
│  ├─ Growth Opportunities (SRS-F5.4)
│  └─ Rich Template Library (150+ templates)
│
└─ Success Criteria:
   ├─ Users understand insights (>80% comprehension)
   ├─ Insights match user intuition (>70% agreement)
   └─ Performance <500ms for basic insights
```

### **4.2 Core Algorithm Implementation**

```typescript
// Phase 1: Core Algorithm Module
// File: src/lib/insights/algorithms.ts

import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import { betweennessCentrality } from 'graphology-metrics/centrality';

interface CoreMetrics {
  communities: Record<string, number>; // nodeId -> communityId
  modularity: number;
  betweenness: Record<string, number>; // nodeId -> score
  engagementTiers: {
    superFans: string[];
    regulars: string[];
    passives: string[];
    ghosts: string[];
  };
}

export function computeCoreMetrics(graph: Graph): CoreMetrics {
  // Canonical analysis graph policy (see VSG_DATA_INTELLIGENCE_FRAMEWORK.md):
  // - Undirected, simple (no parallel edges)
  // - Multi-edges collapsed into a single tie-strength edge (summed weight)
  // - No self-loops

  // Community detection (Louvain)
  const communities: Record<string, number> = louvain(graph);
  const modularity = computeModularity(graph, communities);

  // Betweenness centrality
  const betweenness: Record<string, number> = betweennessCentrality(graph);

  // Engagement tiers (statistical bucketing)
  const engagementTiers = computeEngagementTiers(graph);

  return {
    communities,
    modularity,
    betweenness,
    engagementTiers
  };
}

function computeModularity(graph: Graph, communities: Record<string, number>): number {
  // O(m) modularity for undirected graphs:
  // Q = Σ_c [ (l_c / m) - (d_c / (2m))^2 ]
  const m = graph.edges().length;
  if (m === 0) return 0;

  const sumDegreesByCommunity = new Map<number, number>();
  const internalEdgesByCommunity = new Map<number, number>();

  graph.forEachNode(node => {
    const c = communities[node];
    if (c === undefined) return;
    sumDegreesByCommunity.set(c, (sumDegreesByCommunity.get(c) ?? 0) + graph.degree(node));
  });

  graph.forEachEdge((edge, attrs, source, target) => {
    const c1 = communities[source];
    const c2 = communities[target];
    if (c1 === undefined || c2 === undefined) return;
    if (c1 === c2) {
      internalEdgesByCommunity.set(c1, (internalEdgesByCommunity.get(c1) ?? 0) + 1);
    }
  });

  let Q = 0;
  for (const [c, d_c] of sumDegreesByCommunity.entries()) {
    const l_c = internalEdgesByCommunity.get(c) ?? 0;
    Q += (l_c / m) - Math.pow(d_c / (2 * m), 2);
  }

  return Q;
}

function computeEngagementTiers(graph: Graph) {
  const nodes = graph.nodes();
  const engagementScores = nodes.map(node => ({
    id: node,
    score: graph.getNodeAttribute(node, 'engagementRate') || 0
  }));

  // Sort by engagement
  engagementScores.sort((a, b) => b.score - a.score);

  // Bucket into tiers (percentile-based)
  const total = engagementScores.length;
  return {
    superFans: engagementScores.slice(0, Math.floor(total * 0.05)).map(n => n.id),
    regulars: engagementScores.slice(Math.floor(total * 0.05), Math.floor(total * 0.25)).map(n => n.id),
    passives: engagementScores.slice(Math.floor(total * 0.25), Math.floor(total * 0.60)).map(n => n.id),
    ghosts: engagementScores.slice(Math.floor(total * 0.60)).map(n => n.id)
  };
}
```

### **4.3 Phase 1 Template Set (30 Core Templates)**

```typescript
// Phase 1: Core Template Library
// File: src/lib/insights/templates/core.ts

export const CORE_TEMPLATES = {
  // Community Detection (6 templates)
  community_overview: {
    high_modularity: [
      "Your network has {count} distinct communities with clear boundaries.",
      "You've built {count} well-defined audience segments.",
    ],
    low_modularity: [
      "Your network is highly interconnected with {count} overlapping groups.",
    ]
  },

  // Engagement Circles (8 templates)
  engagement_summary: {
    healthy: [
      "You have {superFans} super fans who engage with over half your content.",
      "{superFans} accounts are your most dedicated supporters.",
    ],
    needs_attention: [
      "Only {superFans} accounts engage regularly. Consider re-engagement.",
    ],
    ghost_heavy: [
      "{ghosts} followers ({ghostPercent}%) haven't engaged recently.",
    ]
  },

  // Key Connectors (8 templates)
  bridge_accounts: {
    high_value: [
      "{name} connects {communities} communities in your network.",
      "{name} is a critical bridge with top {percentile}% network position.",
    ],
    medium_value: [
      "{name} bridges {communities} audience segments.",
    ]
  },

  // Confidence Explanations (8 templates)
  confidence_high: [
    "High confidence: Based on complete data and validated algorithms.",
  ],
  confidence_medium: [
    "Medium confidence: Some data limitations, but pattern is clear.",
  ],
  confidence_low: [
    "Low confidence: Limited data. Consider uploading more recent export.",
  ]
};
```

### **4.4 Phase 1 Acceptance Criteria**

```
Phase 1 Validation:
├─ Algorithm Accuracy:
│  ├─ Community detection matches user intuition >80%
│  ├─ Engagement tiers feel accurate >75%
│  └─ Bridge accounts visually connect communities
│
├─ Template Quality:
│  ├─ Narratives read naturally (user testing)
│  ├─ No grammatical errors
│  └─ Variables interpolate correctly
│
├─ Performance:
│  ├─ Core metrics computed <2s (5K nodes)
│  ├─ Template rendering <50ms
│  └─ Total insight generation <500ms
│
├─ User Feedback:
│  ├─ >70% find insights "helpful" or "very helpful"
│  ├─ >80% understand what insights mean
│  └─ NPS contribution positive
│
└─ Technical:
   ├─ Unit test coverage >80%
   ├─ No external API calls
   └─ Memory usage <100MB per request
```

---

## **5. Phase 2: Rich Template System (Enhancement)**

### **5.1 Scope**

```
Phase 2 Focus: Richness & Variety
├─ Timeline: Months 4-6 (aligned with SRS Phase 2)
├─ Goal: Production-quality recommendations matching AI output quality
├─ Expansion: 30 templates → 150+ templates
│
├─ Included:
│  ├─ Full Bridge Recommendations (SRS-F5.2)
│  ├─ Collaboration Suggestions (SRS-F5.3)
│  ├─ Growth Opportunities (SRS-F5.4)
│  ├─ Rich Template Library (150+ templates)
│  ├─ Context-Aware Selection (multi-factor matching)
│  └─ Action Generator (50+ actionable suggestions)
│
├─ New Capabilities:
│  ├─ Template variants for variety (avoid repetition)
│  ├─ Tone adaptation (professional, casual, motivational)
│  ├─ Platform-specific language (Twitter vs LinkedIn)
│  └─ Seasonal/contextual awareness (optional)
│
└─ Success Criteria:
   ├─ Recommendations indistinguishable from AI-generated
   ├─ Users rate quality >4/5 stars
   └─ <1% report "robotic" or "repetitive" feedback
```

### **5.2 Template Library Architecture**

```
Template Library Structure:
├─ /templates
│  ├─ /bridge_accounts
│  │  ├─ high_value.json (10 variants)
│  │  ├─ medium_value.json (8 variants)
│  │  ├─ emerging.json (6 variants)
│  │  └─ actions.json (12 action templates)
│  ├─ /collaboration
│  │  ├─ high_synergy.json (8 variants)
│  │  ├─ complementary.json (6 variants)
│  │  ├─ audience_expansion.json (6 variants)
│  │  ├─ intro_messages.json (5 variants)
│  │  └─ actions.json (10 action templates)
│  ├─ /growth_opportunities
│  │  ├─ untapped_followers.json (10 variants)
│  │  ├─ dormant_community.json (8 variants)
│  │  ├─ bridge_opportunity.json (8 variants)
│  │  └─ actions.json (15 action templates)
│  ├─ /engagement
│  │  ├─ super_fans.json (6 variants)
│  │  ├─ regulars.json (5 variants)
│  │  ├─ passives.json (6 variants)
│  │  ├─ ghosts.json (8 variants)
│  │  └─ actions.json (12 action templates)
│  ├─ /community
│  │  ├─ overview.json (8 variants)
│  │  ├─ largest.json (5 variants)
│  │  ├─ smallest.json (4 variants)
│  │  └─ actions.json (8 action templates)
│  └─ /confidence
│     ├─ high.json (4 variants)
│     ├─ medium.json (4 variants)
│     └─ low.json (4 variants)
│
Total: 150+ template variants + 57 action templates
```

### **5.3 Template Schema**

```typescript
// Template Schema Definition
// File: src/lib/insights/templates/schema.ts

interface Template {
  id: string;
  category: string;
  subcategory: string;
  variant: number;

  // Content
  narrative: string;  // With {variable} placeholders

  // Conditions for selection
  conditions: {
    metric: string;        // e.g., "betweenness"
    operator: ">" | "<" | "==" | "between";
    value: number | [number, number];
  }[];

  // Metadata
  tone: "professional" | "casual" | "motivational";
  platform?: "twitter" | "linkedin" | "instagram" | "all";

  // Anti-repetition
  lastUsedAt?: Date;
  usageCount: number;
}

// Example Template
const bridgeHighValueTemplate: Template = {
  id: "bridge_hv_001",
  category: "bridge_accounts",
  subcategory: "high_value",
  variant: 1,

  narrative: "{name} is a critical bridge connecting {communityCount} distinct communities in your network. With a network position in the top {percentile}%, engaging with {name} amplifies your reach across audience segments that rarely overlap.",

  conditions: [
    { metric: "betweenness", operator: ">", value: 0.3 },
    { metric: "communitiesConnected", operator: ">", value: 2 }
  ],

  tone: "professional",
  platform: "all",
  usageCount: 0
};
```

### **5.4 Context-Aware Template Selection**

```typescript
// Template Selection Engine
// File: src/lib/insights/templateSelector.ts

interface SelectionContext {
  metrics: Record<string, number>;
  platform: string;
  userPreferences?: {
    tone?: string;
  };
  previousTemplates: string[];  // Avoid repetition
}

export function selectTemplate(
  category: string,
  subcategory: string,
  context: SelectionContext
): Template {
  // 1. Filter by conditions
  const candidates = templates
    .filter(t => t.category === category && t.subcategory === subcategory)
    .filter(t => matchesConditions(t.conditions, context.metrics))
    .filter(t => !context.previousTemplates.includes(t.id));

  // 2. Score by relevance
  const scored = candidates.map(t => ({
    template: t,
    score: computeRelevanceScore(t, context)
  }));

  // 3. Add randomness for variety
  const topCandidates = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 4. Random selection from top 3
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  return selected.template;
}

function computeRelevanceScore(template: Template, context: SelectionContext): number {
  let score = 1.0;

  // Tone preference
  if (context.userPreferences?.tone === template.tone) {
    score += 0.2;
  }

  // Platform match
  if (template.platform === context.platform || template.platform === "all") {
    score += 0.1;
  }

  // Freshness (less used = higher score)
  score += Math.max(0, 0.1 - template.usageCount * 0.01);

  return score;
}
```

### **5.5 Phase 2 Acceptance Criteria**

```
Phase 2 Validation:
├─ Quality Parity with AI:
│  ├─ Blind test: Users cannot distinguish from AI-generated
│  ├─ Quality rating: >4/5 stars average
│  └─ "Robotic" complaints: <1% of feedback
│
├─ Template Coverage:
│  ├─ Every insight type has 5+ variants minimum
│  ├─ Every action type has 3+ variants
│  └─ No "template not found" errors
│
├─ Variety Metrics:
│  ├─ Same user sees same template <10% of time
│  ├─ Tone matches platform/user preference
│  └─ Seasonal templates appear correctly
│
├─ Performance:
│  ├─ Template selection <10ms
│  ├─ Full recommendation <500ms (unchanged)
│  └─ Template library loads <100ms at startup
│
└─ User Feedback:
   ├─ >75% find recommendations "helpful" or "very helpful"
   ├─ >90% understand recommendations
   └─ Recommendation-driven actions tracked
```

---

## **6. Phase 3: Optional Local Intelligence**

### **6.1 Scope (Optional Enhancement)**

```
Phase 3 Focus: Advanced Personalization (OPTIONAL)
├─ Timeline: Months 13+ (aligned with SRS Phase 3)
├─ Goal: Enhanced personalization WITHOUT external AI APIs
├─ Trigger: Only if template-based approach shows limitations
│
├─ Options (Evaluated in Order):
│  ├─ Option A: Enhanced Templates (Preferred)
│  │  └─ Add more templates, improve selection algorithm
│  ├─ Option B: Local NLP (If A insufficient)
│  │  └─ Lightweight local models for text enhancement
│  └─ Option C: Local LLM (Last resort)
│     └─ Self-hosted LLM (Ollama, llama.cpp)
│
├─ Key Constraint:
│  └─ NO external AI API calls (maintains privacy promise)
│
└─ Decision Criteria:
   ├─ Template approach fails to meet quality bar
   ├─ User feedback indicates need for more variety
   └─ Business case justifies infrastructure investment
```

### **6.2 Option A: Enhanced Template System**

```
Enhanced Templates (Preferred Path):
├─ Template Count: 150 → 500+
├─ Conditional Complexity: Multi-factor decision trees
├─ Dynamic Assembly: Combine template fragments
│
├─ Implementation:
│  ├─ Template Fragments:
│  │  └─ Break templates into composable parts
│  │     e.g., [intro] + [metric] + [explanation] + [action]
│  ├─ Dynamic Assembly:
│  │  └─ Combine fragments based on context
│  └─ Learning (Optional):
│     └─ Track which combinations get positive feedback
│     └─ Adjust selection weights over time
│
├─ Example:
│  Fragments:
│  ├─ intro: ["Consider this:", "Here's an insight:", "Key finding:"]
│  ├─ metric: ["{name} has {value}% betweenness", "With {percentile}% centrality, {name}"]
│  ├─ explanation: ["This means they connect...", "In practice, this indicates..."]
│  └─ action: ["Try engaging with...", "Consider reaching out..."]
│
│  Assembly: intro[2] + metric[1] + explanation[0] + action[1]
│  Result: "Key finding: With 95% centrality, Sarah. This means they connect... Consider reaching out..."
│
└─ Benefit: 500+ templates from ~100 fragments (combinatorial)
```

### **6.3 Option B: Local NLP Enhancement**

```
Local NLP (If Templates Insufficient):
├─ Purpose: Minor text improvements, not generation
├─ Use Cases:
│  ├─ Synonym substitution (variety)
│  ├─ Sentence restructuring (natural flow)
│  └─ Grammar polishing (edge cases)
│
├─ Libraries (No External APIs):
│  ├─ compromise.js: Lightweight NLP for JavaScript
│  ├─ natural: Node.js NLP library
│  └─ nlp.js: NLP utilities for Node
│
├─ Example:
│  Input: "Sarah has high betweenness. This means Sarah connects communities."
│  Output: "Sarah has exceptional betweenness. This indicates she connects communities."
│
│  Changes: "high" → "exceptional" (synonym), "means" → "indicates" (variety)
│
├─ Constraints:
│  ├─ No cloud APIs (OpenAI, Anthropic, etc.)
│  ├─ Processing time <50ms
│  └─ Deterministic fallback (original text if NLP fails)
│
└─ Benefit: Adds variety without template explosion
```

### **6.4 Option C: Local LLM (Last Resort)**

```
Local LLM (Only If A & B Insufficient):
├─ Purpose: On-premise language model for generation
├─ Trigger: Only if user feedback demands AI-quality text
│
├─ Technology Options:
│  ├─ Ollama: Easy-to-run local LLM server
│  │  └─ Models: Llama 3, Mistral, Phi-3
│  ├─ llama.cpp: Efficient C++ inference
│  │  └─ Low memory footprint, CPU-friendly
│  └─ vLLM: High-throughput serving (if scale needed)
│
├─ Infrastructure:
│  ├─ Dedicated server or GPU instance
│  ├─ Model: 7B-13B parameters (balance of quality/speed)
│  ├─ Inference time: <2s per recommendation
│  └─ Cost: $200-500/month server (vs $500-10K API)
│
├─ Privacy Guarantee (Maintained):
│  ├─ Model runs on VSG infrastructure
│  ├─ No data sent to external providers
│  └─ User data never leaves controlled environment
│
├─ Implementation:
│  ├─ Prompt: Structured template with metrics
│  ├─ Output: Natural language narrative
│  └─ Fallback: Template-based if LLM fails
│
└─ Decision Criteria:
   ├─ Template approach satisfaction <70%
   ├─ "Robotic" feedback >5%
   └─ Business justifies $200-500/month infrastructure
```

### **6.5 Phase 3 Decision Framework**

```
Phase 3 Evaluation (Month 13):

Step 1: Assess Template Performance
├─ User satisfaction with recommendations?
│  ├─ >75% satisfied → STOP (templates sufficient)
│  └─ <75% satisfied → Continue to Step 2
│
Step 2: Diagnose Issues
├─ What's the primary complaint?
│  ├─ "Repetitive" → Option A (more templates/fragments)
│  ├─ "Robotic" → Option B (NLP enhancement)
│  └─ "Generic" → Option C (local LLM)
│
Step 3: Implement Incrementally
├─ Try Option A first (lowest cost/complexity)
├─ If insufficient after 4 weeks, try Option B
├─ If still insufficient after 4 weeks, evaluate Option C
│
Step 4: Validate
├─ A/B test new approach vs current
├─ Measure user satisfaction delta
└─ Roll out if significant improvement (>10% satisfaction gain)
```

---

## **7. Template Library Architecture**

### **7.1 Storage & Management**

```
Template Storage Options:

Option A: JSON Files (Phase 1)
├─ Location: /src/lib/insights/templates/*.json
├─ Loading: At build time (compiled into bundle)
├─ Pros: Simple, version controlled, fast
├─ Cons: Requires deploy for changes
└─ Best for: Development, Phase 1

Option B: PostgreSQL (Phase 2+)
├─ Table: insight_templates
├─ Loading: At startup (cached in memory)
├─ Pros: Hot updates, A/B testing, analytics
├─ Cons: More infrastructure
└─ Best for: Production, experimentation

Recommended: Start with Option A, migrate to B in Phase 2
```

### **7.2 Database Schema (Phase 2+)**

```sql
-- Template Storage Schema
CREATE TABLE insight_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Classification
  category VARCHAR(50) NOT NULL,       -- e.g., "bridge_accounts"
  subcategory VARCHAR(50) NOT NULL,    -- e.g., "high_value"
  variant_number INTEGER NOT NULL,      -- 1, 2, 3...

  -- Content
  narrative TEXT NOT NULL,             -- Template with {variables}
  variables JSONB NOT NULL,            -- Required variables list

  -- Conditions
  conditions JSONB NOT NULL,           -- Selection criteria

  -- Metadata
  tone VARCHAR(20) DEFAULT 'professional',
  platform VARCHAR(20) DEFAULT 'all',

  -- Analytics
  usage_count INTEGER DEFAULT 0,
  positive_feedback INTEGER DEFAULT 0,
  negative_feedback INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,

  -- Management
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(category, subcategory, variant_number)
);

-- Action Templates
CREATE TABLE action_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  action_text TEXT NOT NULL,
  priority INTEGER DEFAULT 5,
  conditions JSONB,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_templates_category ON insight_templates(category, subcategory);
CREATE INDEX idx_templates_active ON insight_templates(is_active) WHERE is_active = TRUE;
```

### **7.3 Template Interpolation Engine**

```typescript
// Template Interpolation Engine
// File: src/lib/insights/interpolator.ts

interface InterpolationContext {
  // User data
  name?: string;
  displayName?: string;

  // Metrics
  count?: number;
  percentage?: number;
  percentile?: number;
  betweenness?: number;

  // Computed
  communityCount?: number;
  communities?: string[];

  // Lists
  superFans?: number;
  ghosts?: number;
  ghostPercent?: number;
}

export function interpolate(
  template: string,
  context: InterpolationContext
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => {
      const value = context[key as keyof InterpolationContext];

      if (value === undefined) {
        console.warn(`Missing template variable: ${key}`);
        return match; // Keep placeholder if missing
      }

      // Format based on type
      if (typeof value === 'number') {
        if (key.includes('Percent') || key.includes('percentage')) {
          return `${Math.round(value)}%`;
        }
        if (key.includes('betweenness')) {
          return value.toFixed(2);
        }
        return value.toLocaleString();
      }

      if (Array.isArray(value)) {
        if (value.length <= 3) {
          return value.join(', ');
        }
        return `${value.slice(0, 2).join(', ')}, and ${value.length - 2} more`;
      }

      return String(value);
    }
  );
}

// Example usage:
// interpolate(
//   "{name} connects {communityCount} communities ({communities})",
//   { name: "Sarah", communityCount: 3, communities: ["Tech", "Design", "Startup"] }
// )
// → "Sarah connects 3 communities (Tech, Design, Startup)"
```

---

## **8. Testing Strategy**

### **8.1 Unit Tests (Algorithm Layer)**

```typescript
// Algorithm Tests
// File: src/lib/insights/__tests__/algorithms.test.ts

import { computeCoreMetrics, detectBridges } from '../algorithms';
import Graph from 'graphology';

describe('Core Metrics', () => {
  let testGraph: Graph;

  beforeEach(() => {
    testGraph = new Graph({ type: 'undirected', multi: false, allowSelfLoops: false });
    // Create test graph with known structure
    testGraph.addNode('center', { label: 'Center' });
    testGraph.addNode('community1_a', { label: 'C1A' });
    testGraph.addNode('community1_b', { label: 'C1B' });
    testGraph.addNode('community2_a', { label: 'C2A' });
    testGraph.addNode('community2_b', { label: 'C2B' });

    // Center connects to both communities (bridge)
    testGraph.addEdge('center', 'community1_a');
    testGraph.addEdge('center', 'community2_a');

    // Intra-community connections
    testGraph.addEdge('community1_a', 'community1_b');
    testGraph.addEdge('community2_a', 'community2_b');
  });

  test('detects communities correctly', () => {
    const metrics = computeCoreMetrics(testGraph);
    const communityCount = new Set(Object.values(metrics.communities)).size;
    expect(communityCount).toBeGreaterThanOrEqual(2);
  });

  test('identifies center as bridge', () => {
    const bridges = detectBridges(testGraph);
    expect(bridges[0].id).toBe('center');
  });

  test('computes betweenness correctly', () => {
    const metrics = computeCoreMetrics(testGraph);
    const centerBetweenness = metrics.betweenness['center'];
    expect(centerBetweenness).toBeGreaterThan(0.3);
  });
});
```

### **8.2 Template Tests**

```typescript
// Template Tests
// File: src/lib/insights/__tests__/templates.test.ts

import { selectTemplate, interpolate } from '../templateSelector';
import { CORE_TEMPLATES } from '../templates/core';

describe('Template Selection', () => {
  test('selects high_value template for high betweenness', () => {
    const context = {
      metrics: { betweenness: 0.45, communitiesConnected: 4 },
      platform: 'twitter',
      previousTemplates: []
    };

    const template = selectTemplate('bridge_accounts', 'high_value', context);
    expect(template.subcategory).toBe('high_value');
  });

  test('avoids recently used templates', () => {
    const context = {
      metrics: { betweenness: 0.45 },
      platform: 'twitter',
      previousTemplates: ['bridge_hv_001', 'bridge_hv_002']
    };

    const template = selectTemplate('bridge_accounts', 'high_value', context);
    expect(['bridge_hv_001', 'bridge_hv_002']).not.toContain(template.id);
  });
});

describe('Template Interpolation', () => {
  test('interpolates all variables correctly', () => {
    const template = "{name} connects {communityCount} communities";
    const result = interpolate(template, {
      name: 'Sarah',
      communityCount: 3
    });

    expect(result).toBe('Sarah connects 3 communities');
  });

  test('formats percentages correctly', () => {
    const template = "{ghostPercent} of followers are inactive";
    const result = interpolate(template, { ghostPercent: 42.7 });

    expect(result).toBe('43% of followers are inactive');
  });

  test('handles missing variables gracefully', () => {
    const template = "Hello {name}, your score is {score}";
    const result = interpolate(template, { name: 'Test' });

    expect(result).toContain('{score}'); // Keeps placeholder
  });
});
```

### **8.3 Integration Tests**

```typescript
// Integration Tests
// File: src/lib/insights/__tests__/integration.test.ts

import { generateRecommendations } from '../insightEngine';
import { createTestGraph } from '../../../test/fixtures/graphs';

describe('Insight Engine Integration', () => {
  test('generates complete recommendation set', async () => {
    const graph = createTestGraph({ nodes: 500, communities: 4 });
    const recommendations = await generateRecommendations(graph);

    expect(recommendations).toHaveProperty('communities');
    expect(recommendations).toHaveProperty('engagementCircles');
    expect(recommendations).toHaveProperty('bridgeAccounts');
    expect(recommendations).toHaveProperty('growthOpportunities');
  });

  test('completes within performance budget', async () => {
    const graph = createTestGraph({ nodes: 5000 });

    const start = performance.now();
    await generateRecommendations(graph);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(500); // <500ms requirement
  });

  test('produces valid JSON output', async () => {
    const graph = createTestGraph({ nodes: 100 });
    const recommendations = await generateRecommendations(graph);

    // Should be serializable
    expect(() => JSON.stringify(recommendations)).not.toThrow();

    // Should have required fields
    recommendations.bridgeAccounts.forEach(rec => {
      expect(rec).toHaveProperty('narrative');
      expect(rec).toHaveProperty('confidence');
      expect(rec).toHaveProperty('actions');
      expect(rec.actions.length).toBeGreaterThan(0);
    });
  });
});
```

### **8.4 Quality Tests (User Validation)**

```
Quality Validation Process:

1. Template Quality Review (Before Deployment)
├─ Human review of all templates
├─ Grammar and clarity check
├─ Tone consistency verification
└─ Variable coverage validation

2. A/B Testing Framework (Phase 2+)
├─ Compare template variants
├─ Measure user engagement (clicks, time spent)
├─ Track "helpful" vs "not helpful" feedback
└─ Retire underperforming templates

3. User Satisfaction Tracking
├─ Post-insight rating (1-5 stars)
├─ "Was this helpful?" binary
├─ Free-text feedback (optional)
└─ Correlation analysis (which templates score highest)

4. Regression Testing
├─ Golden dataset of known-good outputs
├─ Verify no degradation on update
└─ Automated comparison on PR
```

---

## **9. Technology Stack Amendment**

### **9.1 Removed Dependencies**

```
REMOVED from SRS v1.1 (Section 11):

External AI Services:
├─ Anthropic Claude API (recommendations)
└─ OpenAI GPT-4 (fallback)

Related Infrastructure:
├─ AI API key management
├─ Cost monitoring dashboards for AI
├─ Rate limiting for AI calls
└─ Circuit breaker for AI budget
```

### **9.2 Added Dependencies**

```
ADDED to SRS v1.2:

Graph Analysis:
├─ graphology: Core graph library
├─ graphology-communities-louvain: Community detection
├─ graphology-metrics: Centrality measures
└─ graphology-operators: Graph operations

Statistics:
├─ simple-statistics: Statistical functions
└─ jstat (optional): Advanced statistics

Template Engine:
├─ Custom TypeScript module (no external library)
└─ JSON schema validation (ajv)

Optional (Phase 3):
├─ compromise.js: Local NLP (if needed)
├─ natural: Node.js NLP utilities (if needed)
└─ Ollama: Local LLM server (if needed, self-hosted only)
```

### **9.3 Updated Technology Stack Section**

```
Section 11.3 Infrastructure (AMENDED):

Hosting:
├─ Frontend: Vercel (serverless, edge caching)
├─ Backend: Railway (or AWS/GCP for scale)
└─ Database: Railway PostgreSQL or Supabase

Storage: Cloudflare R2 (S3-compatible, no egress fees)
CDN: Cloudflare (global edge network)

Monitoring:
├─ Errors: Sentry
├─ Analytics: PostHog (privacy-friendly)
├─ Uptime: UptimeRobot
└─ APM: Sentry Performance or Datadog

Email: Resend (transactional)
Payments: Stripe (checkout, webhooks, portal)

Insights: [AMENDED]
├─ Graph Analysis: graphology ecosystem
├─ Statistics: simple-statistics
├─ Templates: Custom engine (PostgreSQL storage)
└─ [REMOVED: Anthropic Claude API]
```

---

## **10. Migration from SRS v1.1**

### **10.1 Section-by-Section Changes**

```
SRS v1.1 → v1.2 Migration:

Section 2.1 (Architecture Diagram):
├─ REMOVE: Line 194 "Anthropic Claude API (AI recommendations)"
├─ ADD: "Insight Engine (algorithms + templates)"
└─ Status: Architecture simplified

Section 4.5 (AI-Powered Recommendations):
├─ RENAME: "Algorithm-Powered Recommendations"
├─ REPLACE: All AI-specific requirements
├─ ADD: Template engine specifications
└─ Status: Complete rewrite (this document)

Section 11.3 (Technology Stack):
├─ REMOVE: "AI: Anthropic Claude API"
├─ ADD: Graph and template dependencies
└─ Status: Updated

Section 10 (Phase-Specific Requirements):
├─ Phase 2: REMOVE AI recommendation engine
├─ Phase 2: ADD Template engine v2
├─ Phase 3: REMOVE AI budget scaling
└─ Status: Updated timeline/scope

Appendix (Compliance Checklist):
├─ STRENGTHEN: Privacy claims
├─ ADD: "No external AI processing" verification
└─ Status: Enhanced
```

### **10.2 Backwards Compatibility**

```
Compatibility Notes:

1. API Contracts: UNCHANGED
├─ Recommendation response format identical
├─ Clients don't know if AI or templates generate text
└─ No breaking changes to integrations

2. User Experience: IMPROVED
├─ Faster response times (<500ms vs <10s)
├─ Same quality output (validated via testing)
└─ Enhanced privacy messaging

3. Business Model: UNCHANGED
├─ Feature gating still applies
├─ Pro tier still gets "advanced insights"
└─ Pricing unchanged

4. Development: SIMPLIFIED
├─ Fewer external dependencies
├─ Easier local development (no API keys)
└─ Faster test execution
```

### **10.3 Implementation Timeline**

```
Migration Timeline:

Week 1-2: Foundation
├─ Implement core algorithms (Louvain, betweenness)
├─ Create Phase 1 template set (30 templates)
├─ Build interpolation engine
└─ Unit tests for algorithms and templates

Week 3-4: Integration
├─ Build Insight Engine (algorithm + template layers)
├─ Integrate with existing API endpoints
├─ Integration tests
└─ Performance optimization (<500ms target)

Week 5-6: Validation
├─ User testing (5 users minimum)
├─ Quality validation (readability, accuracy)
├─ A/B test vs mockup AI output
└─ Iterate based on feedback

Week 7-8: Phase 2 Prep (If Phase 1 Passes)
├─ Expand template library (30 → 150+)
├─ Build template management system
├─ Implement action generator
└─ Context-aware selection

Ongoing: Refinement
├─ Template analytics
├─ A/B testing framework
├─ User feedback integration
└─ Template library expansion
```

---

## **Document Status**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.2 (Algorithm-First Amendment) |
| **Status** | Proposed - Pending Approval |
| **Amends** | SRS v1.1, Sections 2, 4.5, 10, 11 |
| **Author** | Engineering / Architecture |
| **Philosophy** | CLAUDE_ACE.md aligned |
| **Next Step** | Review → Approve → Implement |

**Last Updated**: December 24, 2025 — aligned algorithm examples with canonical undirected/simple graph policy, modularity computation, and mapping-based algorithm outputs.

---

## **Approval**

This amendment transforms a technical constraint (no external AI) into a competitive advantage (complete privacy, predictable costs, faster performance).

By embracing the "Simplify Ruthlessly" principle from CLAUDE_ACE.md, we remove complexity while preserving—and in some cases enhancing—the user experience.

**The algorithm-first approach is not a compromise. It is the elegant solution.**

---

*"Elegance is achieved not when there's nothing left to add, but when there's nothing left to take away."*

*December 2025*
*Visual Social Graph*
