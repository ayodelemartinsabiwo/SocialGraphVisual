# **Visual Social Graph: Data & Intelligence Framework**
## **Version 1.0 - Algorithm-First Foundation**

*Bridging data models, graph algorithms, and explainable insights*

---

## **Document Overview**

**Purpose**: Define the data structures, intelligence architecture, and analytical methods that power Visual Social Graph's core functionality.

**Audience**: Engineering team, data scientists, product managers, security auditors

**Scope**:
- Data models (graph, user, metadata)
- Algorithm-first intelligence architecture
- Graph analysis methods (Louvain, PageRank, Betweenness)
- Template-based insight generation
- Statistical profiling and metrics
- Privacy-preserving data practices
- Performance considerations for large graphs

**Related Documents**:
- VSG_DESIGN_PRINCIPLE.md - "AI as a Design Tool, Not a Dependency"
- VSG_ARCHITECTURE_DOCUMENT.md - Technical implementation
- VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md - Functional requirements
- VSG_PRODUCT_STRATEGY.md - Strategic positioning

---

## **Table of Contents**

1. [Design Philosophy](#1-design-philosophy)
2. [Data Models](#2-data-models)
3. [Intelligence Architecture](#3-intelligence-architecture)
4. [Graph Algorithms](#4-graph-algorithms)
5. [Template System](#5-template-system)
6. [Statistical Profiling](#6-statistical-profiling)
7. [Insight Generation Pipeline](#7-insight-generation-pipeline)
8. [Privacy & Anonymization](#8-privacy--anonymization)
9. [Performance Optimization](#9-performance-optimization)
10. [Evolution Strategy](#10-evolution-strategy)
11. [Quality Assurance](#11-quality-assurance)
12. [Appendices](#12-appendices)

---

## **1. Design Philosophy**

### **1.1 Core Principle: Algorithm-First Intelligence**

Visual Social Graph's intelligence layer is built on **deterministic graph algorithms** and **rule-based templates**, not external AI models. This design decision is strategic, not technical.

**Why Algorithm-First?**

```
Traditional AI-Dependent Architecture:
├─ User Data → Graph Analysis → LLM API Call ($$$) → Insight
├─ Cost: $0.01-0.05 per generation
├─ Latency: 5-15 seconds
├─ Explainability: Opaque (black box)
├─ Privacy: Third-party processing
└─ Vendor Risk: Dependent on OpenAI/Anthropic/Google

Visual Social Graph Algorithm-First Architecture:
├─ User Data → Graph Algorithms → Template Matcher → Interpolator → Insight
├─ Cost: $0.00 (deterministic computation)
├─ Latency: <500ms (client-side capable)
├─ Explainability: Transparent (traceable to metrics)
├─ Privacy: On-premise processing
└─ Vendor Risk: Zero (independent)
```

**Strategic Advantages**:

1. **Privacy Moat**: No external AI = no data leakage, unmatched privacy guarantee
2. **Cost Moat**: $0 per insight enables unlimited analysis at scale
3. **Performance Moat**: 20-30x faster than LLM-based systems
4. **Trust Moat**: Deterministic outputs build user confidence
5. **Independence Moat**: No vendor lock-in, complete strategic freedom

**Design Constraint from VSG_DESIGN_PRINCIPLE.md**:

> *"The system MUST remain functional if AI services are disabled. AI-generated insights MUST NOT obscure or replace underlying data visibility. No critical user action or system process SHALL require opaque AI inference."*

This framework operationalizes that principle.

---

### **1.2 Intelligence Layer Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE LAYER STACK                      │
└─────────────────────────────────────────────────────────────────┘

Layer 4: PRESENTATION (User-Facing)
├─ Natural language narratives
├─ Actionable recommendations
├─ Visual annotations (node highlighting, edge emphasis)
└─ Confidence indicators

         ▲
         │ Template Interpolation
         │

Layer 3: TEMPLATE MATCHING (Rule-Based)
├─ Condition evaluation: IF metric > threshold THEN template
├─ Variable extraction: {{bridgeAccounts}}, {{echoScore}}
├─ Confidence calculation: Required + optional conditions
└─ Variant selection: A/B testing (sticky buckets), deterministic variety

         ▲
         │ Statistical Profile
         │

Layer 2: STATISTICAL PROFILING (Descriptive)
├─ Distribution analysis: Percentiles, outliers, trends
├─ Correlation detection: Engagement vs. centrality
├─ Pattern recognition: Homophily, clustering, sparsity
└─ Comparative metrics: User vs. platform averages

         ▲
         │ Graph Metrics
         │

Layer 1: GRAPH ALGORITHMS (Foundational)
├─ Community detection: Louvain algorithm (modularity optimization)
├─ Centrality measures: PageRank, Betweenness, Degree
├─ Structural analysis: Clustering coefficient, path lengths
└─ Network dynamics: Homophily, preferential attachment

         ▲
         │ Parsed Social Graph
         │

Layer 0: RAW DATA (Platform Exports)
├─ Twitter: tweets.js, followers.js, following.js
├─ Instagram: followers_1.json, following.json, likes.json
├─ LinkedIn: Connections.csv, Reactions.csv
└─ Client-side parsing (Web Workers)
```

**Key Design Decisions**:

1. **No External AI at Runtime**: All intelligence generated from deterministic algorithms
2. **Client-Side Capable**: Layers 1-3 can run in browser (privacy + performance)
3. **Explainable**: Every insight traceable to specific metrics + templates
4. **Cacheable**: Deterministic outputs enable aggressive caching
5. **Testable**: Unit tests for algorithms, integration tests for templates

---

## **2. Data Models**

### **2.1 Graph Data Structure**

**Core Entity: Social Graph**

```typescript
interface SocialGraph {
  id: string; // UUID
  userId: string; // Owner
  platform: Platform; // 'twitter' | 'instagram' | 'linkedin'
  version: number; // Incremental (1, 2, 3...)
  isLatest: boolean; // Flag for quick queries

  createdAt: Date;
  updatedAt: Date;

  // Graph structure (JSONB in PostgreSQL)
  data: {
    nodes: Node[];
    edges: Edge[];
    metadata: GraphMetadata;
  };

  // Cached metrics (denormalized for performance)
  metrics: GraphMetrics | null;
}

interface Node {
  id: string; // Platform-specific ID (anonymized in storage)
  type: 'user' | 'self'; // 'self' = graph owner

  // Required attributes
  displayName: string; // Anonymized in storage (hash)
  username: string; // Anonymized in storage (hash)

  // Optional attributes (platform-dependent)
  followerCount?: number;
  followingCount?: number;
  profileImageUrl?: string; // NOT stored, reconstructed if needed

  // Computed attributes (from graph analysis)
  degree?: number; // Connection count
  pageRank?: number; // Influence score
  betweenness?: number; // Bridge score
  communityId?: number; // Louvain cluster

  // Privacy-preserving metadata
  addedAt: Date; // When connection was made (if available)
  lastInteraction?: Date; // Most recent engagement
}

interface Edge {
  source: string; // Node ID
  target: string; // Node ID
  type: EdgeType;
  weight: number; // Engagement score (0-1)

  // Interaction data (privacy-preserved)
  interactions: {
    likes?: number;
    comments?: number;
    shares?: number;
    messages?: number;
  };

  createdAt: Date; // When edge was formed
}

type EdgeType =
  | 'follows' // Directional
  | 'followed_by' // Directional
  | 'mutual' // Bidirectional
  | 'engages_with'; // Interaction-based

interface GraphMetadata {
  uploadId: string;
  parseVersion: string; // Parser version (e.g., 'twitter_v2.1')
  parsingErrors: ParsingError[];

  statistics: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    averageDegree: number;
  };

  timePeriod: {
    start: Date; // Earliest connection
    end: Date; // Most recent connection (usually upload time)
  };
}
```

**Storage note (serialization)**:
- In persisted JSON (e.g., PostgreSQL JSONB), all `Date` fields MUST be stored as ISO 8601 UTC strings.
- In application memory, they may be materialized as `Date` objects.

**Design Rationale**:

1. **Immutable Graphs**: Each upload creates a new version, old versions retained for comparison
2. **Pseudonymized Storage**: Usernames/names are pseudonymized with a user-specific keyed hash (non-reversible)
3. **JSONB for Flexibility**: Graph structure stored as JSONB for schema evolution
4. **Denormalized Metrics**: Cached to avoid recomputing on every request
5. **Platform-Agnostic**: Core structure works for Twitter, Instagram, LinkedIn, etc.

---

### **2.2 Graph Metrics Structure**

```typescript
interface GraphMetrics {
  graphId: string;
  version: number; // Metrics version (for evolution)

  computedAt: Date;
  computationTime: number; // Milliseconds

  // ═══════════════════════════════════════════════════════════════
  // STRUCTURAL METRICS
  // ═══════════════════════════════════════════════════════════════

  structure: {
    nodeCount: number;
    edgeCount: number;
    density: number; // 0-1, actual edges / possible edges
    avgDegree: number;
    avgPathLength: number; // Average shortest path
    diameter: number; // Longest shortest path
    clusteringCoefficient: number; // 0-1, how clustered
  };

  // ═══════════════════════════════════════════════════════════════
  // COMMUNITY DETECTION (Louvain Algorithm)
  // ═══════════════════════════════════════════════════════════════

  communities: {
    count: number;
    modularity: number; // 0-1, quality of community division
    sizes: number[]; // Nodes per community (sorted desc)
    distribution: {
      largest: number; // % of graph in largest community
      top3: number; // % of graph in top 3 communities
      top5: number; // % of graph in top 5 communities
    };
    isolation: {
      // Communities with <5% inter-community edges
      isolated: number[];
      echoScore: number; // 0-1, higher = more echo chamber-like
    };
  };

  // ═══════════════════════════════════════════════════════════════
  // CENTRALITY MEASURES
  // ═══════════════════════════════════════════════════════════════

  centrality: {
    // PageRank: Influence/importance
    pageRank: {
      top10: { nodeId: string; score: number }[];
      selfRank: number; // Graph owner's rank (1-indexed)
      selfPercentile: number; // 0-100, higher = more influential
    };

    // Betweenness: Bridge/broker nodes
    betweenness: {
      top10: { nodeId: string; score: number }[];
      bridgeNodes: string[]; // High betweenness = bridge
      bridgePercentage: number; // % of connections who are bridges
    };

    // Degree: Connection count
    degree: {
      max: number;
      min: number;
      median: number;
      distribution: {
        p25: number;
        p50: number;
        p75: number;
        p90: number;
        p99: number;
      };
    };
  };

  // ═══════════════════════════════════════════════════════════════
  // ENGAGEMENT ANALYSIS
  // ═══════════════════════════════════════════════════════════════

  engagement: {
    // Edge weights (interaction frequency)
    avgWeight: number; // 0-1
    weightDistribution: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };

    // Active vs. passive connections
    activeConnections: number; // Weight > threshold (e.g., 0.3)
    passiveConnections: number; // Weight < threshold
    activePercentage: number; // % of connections that are active

    // Engagement reciprocity
    reciprocal: number; // Mutual high engagement
    oneWay: number; // Only one side engages
    reciprocityScore: number; // 0-1, higher = more mutual
  };

  // ═══════════════════════════════════════════════════════════════
  // NETWORK PATTERNS
  // ═══════════════════════════════════════════════════════════════

  patterns: {
    // Homophily: Connections within same community
    homophily: {
      intraCommunityEdges: number;
      interCommunityEdges: number;
      homophilyIndex: number; // 0-1, higher = more homophilous
    };

    // Growth patterns
    growth: {
      newConnections30d: number; // Added in last 30 days
      lostConnections30d: number; // Removed in last 30 days
      growthRate: number; // % change
    };

    // Diversity
    diversity: {
      communityEntropy: number; // Higher = more diverse
      giniCoefficient: number; // 0-1, higher = more unequal attention
    };
  };
}
```

**Computation Strategy**:

```typescript
// Metrics computed in phases (progressive enhancement)

Phase 1: Structural (Fast, <1s)
├─ Node/edge count, density, avg degree
├─ Computed: Client-side during parsing
└─ Purpose: Immediate feedback

Phase 2: Communities (Medium, 1-5s)
├─ Louvain algorithm (modularity optimization)
├─ Computed: Client-side Web Worker or server-side
└─ Purpose: Primary insights (echo chambers, clusters)

Phase 3: Centrality (Slow, 5-30s for large graphs)
├─ PageRank, Betweenness (iterative algorithms)
├─ Computed: Server-side for >5K nodes, client for smaller
└─ Purpose: Advanced insights (influencers, bridges)

Phase 4: Patterns (Derived, <1s)
├─ Homophily, reciprocity (from existing metrics)
├─ Computed: Client-side from Phase 1-3 results
└─ Purpose: Behavioral insights
```

---

### **2.3 Template Data Structure**

```typescript
interface InsightTemplate {
  id: string; // UUID
  category: TemplateCategory;
  version: number; // For A/B testing and evolution

  // ═══════════════════════════════════════════════════════════════
  // TRIGGER CONDITIONS (Rule-Based Matching)
  // ═══════════════════════════════════════════════════════════════

  conditions: {
    required: Condition[]; // ALL must match
    optional: Condition[]; // Increase confidence if matched
  };

  // ═══════════════════════════════════════════════════════════════
  // NARRATIVE TEMPLATE (Variable Interpolation)
  // ═══════════════════════════════════════════════════════════════

  narrative: {
    // Primary template with {{variables}}
    template: string;

    // Alternative phrasings (A/B testing, 5 variants)
    variants: string[];

    // Variable definitions
    variables: {
      name: string; // e.g., 'bridgeAccountCount'
      source: string; // MetricPath (dot-separated) to a value (e.g., 'centrality.betweenness.bridgeNodes.length')
      formatter?: 'number' | 'percentage' | 'currency' | 'custom';
    }[];
  };

  // ═══════════════════════════════════════════════════════════════
  // ACTION RECOMMENDATIONS (Conditional)
  // ═══════════════════════════════════════════════════════════════

  actions: {
    condition?: Condition; // Show action if condition met
    text: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact?: string; // e.g., '+20% reach'
  }[];

  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string; // Team member who created
    status: 'active' | 'testing' | 'deprecated';
    confidence: 'high' | 'medium' | 'low'; // Editorial assessment

    // Performance tracking
    stats: {
      timesMatched: number;
      avgUserRating?: number; // 1-5 stars
      dismissRate?: number; // % of users who dismiss
    };
  };
}

type TemplateCategory =
  | 'bridge_accounts' // Users connecting communities
  | 'echo_chamber' // High homophily, low diversity
  | 'engagement' // Active vs. passive patterns
  | 'community' // Cluster analysis
  | 'growth' // Network expansion
  | 'influencers' // High PageRank accounts
  | 'diversity' // Network composition
  | 'anomalies'; // Outliers, unusual patterns

interface Condition {
  metric: string; // MetricPath (dot-separated) to a metric in GraphMetrics
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | [number, number]; // Single value or range
  weight?: number; // For confidence calculation (default: 1)
}
```

**Example Template: Bridge Accounts**

```typescript
{
  id: 'bridge-accounts-v1',
  category: 'bridge_accounts',
  version: 1,

  conditions: {
    required: [
      {
        metric: 'centrality.betweenness.bridgePercentage',
        operator: 'gte',
        value: 5 // At least 5% are bridges
      },
      {
        metric: 'communities.count',
        operator: 'gte',
        value: 3 // Multiple communities exist
      }
    ],
    optional: [
      {
        metric: 'communities.isolation.echoScore',
        operator: 'lte',
        value: 0.3, // Communities not too isolated
        weight: 1.5 // Higher confidence if matched
      }
    ]
  },

  narrative: {
    template: "You have {{bridgeCount}} bridge accounts connecting your {{communityCount}} network clusters. These connections help information flow across different groups, reducing echo chamber effects.",

    variants: [
      "{{bridgeCount}} of your connections act as bridges between {{communityCount}} distinct communities, facilitating cross-pollination of ideas.",
      "Your network has {{bridgeCount}} bridge accounts linking {{communityCount}} separate clusters—these are key to maintaining network diversity.",
      "{{bridgeCount}} connections serve as bridges across {{communityCount}} communities, helping you avoid isolated echo chambers.",
      "You're connected to {{bridgeCount}} bridge accounts that span {{communityCount}} network clusters, promoting diverse perspectives.",
      "{{bridgeCount}} accounts bridge your {{communityCount}} communities, acting as information conduits between different groups."
    ],

    variables: [
      {
        name: 'bridgeCount',
        source: 'centrality.betweenness.bridgeNodes.length',
        formatter: 'number'
      },
      {
        name: 'communityCount',
        source: 'communities.count',
        formatter: 'number'
      }
    ]
  },

  actions: [
    {
      condition: {
        metric: 'engagement.activePercentage',
        operator: 'lt',
        value: 50 // Less than 50% active
      },
      text: "Engage more with your bridge accounts to strengthen cross-community connections",
      priority: 'high',
      estimatedImpact: '+15% network diversity'
    },
    {
      text: "Explore the communities these bridge accounts connect you to",
      priority: 'medium'
    }
  ],

  metadata: {
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    author: 'product_team',
    status: 'active',
    confidence: 'high',
    stats: {
      timesMatched: 1247,
      avgUserRating: 4.3,
      dismissRate: 0.12
    }
  }
}
```

---

### **2.4 Insight Data Structure (Generated Output)**

```typescript
interface Insight {
  id: string; // UUID
  graphId: string;
  templateId: string;

  // ═══════════════════════════════════════════════════════════════
  // CONTENT
  // ═══════════════════════════════════════════════════════════════

  category: TemplateCategory;
  narrative: string; // Interpolated template
  actions: Action[];

  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════

  confidence: 'high' | 'medium' | 'low';
  priority: number; // 1-10, for sorting

  // Explainability (transparency)
  explanation: {
    triggeredConditions: string[]; // Which conditions matched
    metrics: { key: string; value: number }[]; // Supporting data
    templateVersion: number;
  };

  // User interaction
  userFeedback?: {
    rating?: number; // 1-5 stars
    dismissed: boolean;
    dismissedAt?: Date;
    actionsClicked: number[];
  };

  createdAt: Date;
  viewedAt?: Date;
}

interface Action {
  text: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact?: string;
  url?: string; // Deep link to specific graph view
}
```

---

## **3. Intelligence Architecture**

### **3.1 System Components**

```
┌─────────────────────────────────────────────────────────────────┐
│                      INSIGHT ENGINE                              │
│                   (Algorithm-First Core)                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  GraphAnalyzer   │  │TemplateLibrary   │  │ TemplateInterp   │
│                  │  │                  │  │                  │
│ - Louvain algo   │  │ - Load templates │  │ - Variable subst │
│ - PageRank       │  │ - Version mgmt   │  │ - Variant select │
│ - Betweenness    │  │ - A/B testing    │  │ - Format values  │
│ - Clustering     │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│StatisticalProf   │  │ TemplateMatcher  │  │  ActionGenerator │
│                  │  │                  │  │                  │
│ - Distributions  │  │ - Condition eval │  │ - Priority calc  │
│ - Correlations   │  │ - Confidence calc│  │ - Impact estimate│
│ - Outliers       │  │ - Variable extract│  │ - URL generation │
│ - Comparisons    │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### **3.2 Insight Generation Flow**

```typescript
/**
 * InsightEngine: Orchestrates algorithm-first insight generation
 */
class InsightEngine {
  constructor(
    private graphAnalyzer: GraphAnalyzer,
    private statisticalProfiler: StatisticalProfiler,
    private templateLibrary: TemplateLibrary,
    private templateMatcher: TemplateMatcher,
    private templateInterpolator: TemplateInterpolator,
    private actionGenerator: ActionGenerator,
    private cache: RedisCache
  ) {}

  /**
   * Generate insights for a graph
   *
   * @param graphId - Graph identifier
   * @returns Array of generated insights
   *
   * Process:
   * 1. Check cache (15-min TTL)
   * 2. Fetch graph data
   * 3. Compute metrics (if not cached)
   * 4. Generate statistical profile
   * 5. Match templates (rule-based)
   * 6. Interpolate narratives
   * 7. Generate actions
   * 8. Cache results
   * 9. Return insights
   */
  async generate(graphId: string): Promise<Insight[]> {
    const cacheKey = `insights:${graphId}`;

    // 1. Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.info('Insight cache hit', { graphId });
      return cached;
    }

    const start = Date.now();

    try {
      // 2. Fetch graph
      const graph = await this.graphRepo.getById(graphId);

      // 3. Compute metrics (or retrieve cached)
      let metrics = graph.metrics;
      if (!metrics) {
        metrics = await this.computeMetrics(graph);
      }

      // 4. Generate statistical profile
      const profile = await this.statisticalProfiler.profile(graph, metrics);

      // 5. Match templates
      const templates = await this.templateLibrary.getActive();
      const matched = this.templateMatcher.match(templates, metrics, profile);

      logger.info('Template matching complete', {
        graphId,
        matchCount: matched.length,
        categories: matched.map(m => m.category)
      });

      // 6. Interpolate narratives
      const insights: Insight[] = matched.map(match => {
        const narrative = this.templateInterpolator.interpolate(
          match.template,
          match.variables
        );

        // 7. Generate actions
        const actions = this.actionGenerator.generate(
          match.template.actions,
          metrics,
          profile
        );

        return {
          id: uuid(),
          graphId,
          templateId: match.template.id,
          category: match.template.category,
          narrative,
          actions,
          confidence: match.confidence,
          priority: match.priority,
          explanation: {
            triggeredConditions: match.triggeredConditions,
            metrics: match.supportingMetrics,
            templateVersion: match.template.version
          },
          createdAt: new Date()
        };
      });

      // 8. Cache results (15-min TTL)
      await this.cache.set(cacheKey, insights, 15 * 60);

      const duration = Date.now() - start;
      logger.info('Insight generation complete', {
        graphId,
        insightCount: insights.length,
        duration
      });

      // Record metrics
      insightGenerationDuration.observe({ category: 'all' }, duration / 1000);

      return insights;

    } catch (error) {
      logger.error('Insight generation failed', {
        graphId,
        error: error.message,
        stack: error.stack
      });

      // Fallback: Return basic metrics insight
      return this.generateBasicInsight(graph);
    }
  }

  /**
   * Compute graph metrics (Phase 1-3)
   */
  private async computeMetrics(graph: SocialGraph): Promise<GraphMetrics> {
    const start = Date.now();

    // Phase 1: Structural (fast)
    const structure = this.graphAnalyzer.computeStructure(graph);

    // Phase 2: Communities (medium)
    const communities = this.graphAnalyzer.detectCommunities(graph);

    // Phase 3: Centrality (slow for large graphs)
    const centrality = await this.graphAnalyzer.computeCentrality(graph);

    // Phase 4: Patterns (derived)
    const patterns = this.graphAnalyzer.analyzePatterns(
      graph,
      structure,
      communities
    );

    // Phase 4: Engagement
    const engagement = this.statisticalProfiler.analyzeEngagement(graph);

    const metrics: GraphMetrics = {
      graphId: graph.id,
      version: 1,
      computedAt: new Date(),
      computationTime: Date.now() - start,
      structure,
      communities,
      centrality,
      engagement,
      patterns
    };

    // Cache metrics (1-hour TTL)
    await this.cache.set(`metrics:${graph.id}`, metrics, 60 * 60);

    // Update graph record
    await this.graphRepo.updateMetrics(graph.id, metrics);

    return metrics;
  }

  /**
   * Fallback: Generate basic insight when main pipeline fails
   */
  private async generateBasicInsight(graph: SocialGraph): Promise<Insight[]> {
    const nodeCount = graph.data.nodes.length;
    const edgeCount = graph.data.edges.length;
    const avgDegree = (edgeCount * 2) / nodeCount;

    return [{
      id: uuid(),
      graphId: graph.id,
      templateId: 'fallback-basic',
      category: 'community',
      narrative: `Your network has ${nodeCount} connections with an average of ${avgDegree.toFixed(1)} connections each.`,
      actions: [],
      confidence: 'high',
      priority: 1,
      explanation: {
        triggeredConditions: ['fallback'],
        metrics: [
          { key: 'nodeCount', value: nodeCount },
          { key: 'edgeCount', value: edgeCount },
          { key: 'avgDegree', value: avgDegree }
        ],
        templateVersion: 0
      },
      createdAt: new Date()
    }];
  }
}
```

---

## **4. Graph Algorithms**

### **4.1 Community Detection: Louvain Algorithm**

**Purpose**: Identify clusters/communities in the social graph

**Algorithm**: Louvain method (modularity optimization)

**Implementation**:

```typescript
/**
 * GraphAnalyzer: Core graph algorithms
 */
class GraphAnalyzer {
  /**
   * Detect communities using Louvain algorithm
   *
   * Louvain algorithm (Blondel et al., 2008):
   * 1. Assign each node to its own community
   * 2. For each node, try moving to neighbor's community
   * 3. Choose move that maximizes modularity gain
   * 4. Repeat until no moves improve modularity
   * 5. Create super-graph (communities as nodes)
   * 6. Repeat from step 1 on super-graph
   *
  * Time complexity: Near-linear on sparse graphs in practice (implementation-dependent);
  * benchmark against performance budgets rather than hard-coding Big-O promises.
   *
   * @param graph - Social graph
   * @returns Community detection results
   */
  detectCommunities(graph: SocialGraph): CommunityMetrics {
    const start = Date.now();

    // Convert to graphology format
    const G = this.toGraphology(graph);

    // Run Louvain algorithm
    const communities = louvain(G);

    // Compute modularity
    const modularity = this.computeModularity(G, communities);

    // Analyze community sizes
    const sizes = Object.values(
      communities.reduce((acc, comm) => {
        acc[comm] = (acc[comm] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    ).sort((a, b) => b - a);

    // Compute distribution
    const totalNodes = graph.data.nodes.length;
    const distribution = {
      largest: sizes[0] / totalNodes,
      top3: sizes.slice(0, 3).reduce((sum, s) => sum + s, 0) / totalNodes,
      top5: sizes.slice(0, 5).reduce((sum, s) => sum + s, 0) / totalNodes
    };

    // Detect isolated communities (echo chambers)
    const isolation = this.detectEchoChambers(G, communities);

    const duration = Date.now() - start;
    algorithmDuration.observe({ algorithm: 'louvain' }, duration / 1000);

    return {
      count: sizes.length,
      modularity,
      sizes,
      distribution,
      isolation,
      computedAt: new Date(),
      duration
    };
  }

  /**
   * Compute modularity Q
   *
   * Q = (1/2m) * Σ[A_ij - (k_i * k_j / 2m)] * δ(c_i, c_j)
   *
   * Where:
   * - m = total edges
   * - A_ij = adjacency matrix
   * - k_i = degree of node i
   * - δ(c_i, c_j) = 1 if nodes in same community, 0 otherwise
   *
   * Range: [-0.5, 1.0]
   * - Q > 0.3: Strong community structure
   * - Q > 0.7: Very strong community structure
   */
  private computeModularity(
    G: Graph,
    communities: number[]
  ): number {
    // O(m) modularity computation for undirected graphs:
    // Q = Σ_c [ (l_c / m) - (d_c / (2m))^2 ]
    // where l_c = # edges inside community c, d_c = sum of degrees in c.
    const nodes = G.nodes();
    const m = G.edges().length;
    if (m === 0) return 0;

    const degreeByIdx = nodes.map(n => G.degree(n));
    const sumDegreesByCommunity = new Map<number, number>();
    const internalEdgesByCommunity = new Map<number, number>();

    for (let i = 0; i < nodes.length; i++) {
      const c = communities[i];
      sumDegreesByCommunity.set(c, (sumDegreesByCommunity.get(c) ?? 0) + degreeByIdx[i]);
    }

    // Count internal edges per community (each edge counted once)
    G.forEachEdge((edge, attrs, source, target) => {
      const sourceIdx = nodes.indexOf(source);
      const targetIdx = nodes.indexOf(target);
      if (sourceIdx < 0 || targetIdx < 0) return;

      const c1 = communities[sourceIdx];
      const c2 = communities[targetIdx];
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

  /**
   * Detect echo chambers (isolated communities)
   *
   * Echo chamber criteria:
   * - <5% of community edges go outside community
   * - High homophily (intra-community connections)
   *
   * Echo score: 0-1, higher = more echo chamber-like
   */
  private detectEchoChambers(
    G: Graph,
    communities: number[]
  ): { isolated: number[]; echoScore: number } {
    const communityCounts = communities.reduce((acc, comm) => {
      acc[comm] = (acc[comm] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const isolated: number[] = [];
    let totalIntraEdges = 0;
    let totalEdges = 0;

    Object.keys(communityCounts).forEach(commId => {
      const comm = parseInt(commId);
      const nodesInComm = communities
        .map((c, i) => c === comm ? i : null)
        .filter(i => i !== null);

      let intraEdges = 0;
      let externalEdges = 0;

      nodesInComm.forEach(nodeIdx => {
        G.forEachNeighbor(G.nodes()[nodeIdx], (neighbor) => {
          const neighborIdx = G.nodes().indexOf(neighbor);
          if (communities[neighborIdx] === comm) {
            intraEdges++;
          } else {
            externalEdges++;
          }
        });
      });

      const totalCommEdges = intraEdges + externalEdges;
      const externalPercentage = externalEdges / totalCommEdges;

      if (externalPercentage < 0.05) {
        isolated.push(comm);
      }

      totalIntraEdges += intraEdges;
      totalEdges += totalCommEdges;
    });

    const echoScore = totalIntraEdges / totalEdges;

    return { isolated, echoScore };
  }

  /**
   * Convert SocialGraph to graphology Graph
   */
  private toGraphology(graph: SocialGraph): Graph {
    const G = new Graph();

    // Add nodes
    graph.data.nodes.forEach(node => {
      G.addNode(node.id, { ...node });
    });

    // Add edges
    graph.data.edges.forEach(edge => {
      G.addEdge(edge.source, edge.target, {
        weight: edge.weight,
        type: edge.type
      });
    });

    return G;
  }
}
```

**Validation**:

```typescript
// Unit test
describe('GraphAnalyzer.detectCommunities', () => {
  it('should detect communities in Zachary Karate Club', () => {
    const graph = loadZacharyKarateClub(); // Famous test graph
    const analyzer = new GraphAnalyzer();

    const result = analyzer.detectCommunities(graph);

    expect(result.count).toBeGreaterThanOrEqual(2);
    expect(result.modularity).toBeGreaterThan(0.3); // Known result
    expect(result.duration).toBeLessThan(100); // Fast for small graph
  });

  it('should handle large graphs efficiently', () => {
    const graph = generateRandomGraph(10000, 50000); // 10K nodes
    const analyzer = new GraphAnalyzer();

    const start = Date.now();
    const result = analyzer.detectCommunities(graph);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000); // <5s for 10K nodes
    expect(result.count).toBeGreaterThan(1);
  });
});
```

---

### **4.2 Centrality Measures**

**4.2.1 PageRank: Influence Score**

```typescript
/**
 * Compute PageRank scores
 *
 * PageRank (Page & Brin, 1998):
 * PR(u) = (1-d)/N + d * Σ[PR(v) / L(v)]
 *
 * Where:
 * - d = damping factor (0.85)
 * - N = total nodes
 * - L(v) = out-degree of node v
 *
 * Interpretation:
 * - High PR = influential (many incoming connections from influential nodes)
 * - Used by Google Search (originally)
 *
 * @param graph - Social graph
 * @returns PageRank scores
 */
computePageRank(graph: SocialGraph): PageRankMetrics {
  const start = Date.now();
  const G = this.toGraphology(graph);

  // Run PageRank (iterative)
  const scores = pageRank(G, {
    alpha: 0.85, // Damping factor
    maxIterations: 100,
    tolerance: 0.000001
  });

  // Sort by score
  const sorted = Object.entries(scores)
    .map(([nodeId, score]) => ({ nodeId, score }))
    .sort((a, b) => b.score - a.score);

  // Find self rank
  const selfNodeId = graph.data.nodes.find(n => n.type === 'self')?.id;
  const selfRank = sorted.findIndex(s => s.nodeId === selfNodeId) + 1;
  const selfPercentile = (1 - selfRank / sorted.length) * 100;

  const duration = Date.now() - start;
  algorithmDuration.observe({ algorithm: 'pagerank' }, duration / 1000);

  return {
    top10: sorted.slice(0, 10),
    selfRank,
    selfPercentile,
    duration
  };
}
```

**4.2.2 Betweenness Centrality: Bridge Score**

```typescript
/**
 * Compute betweenness centrality
 *
 * Betweenness (Freeman, 1977):
 * BC(v) = Σ[σ_st(v) / σ_st]
 *
 * Where:
 * - σ_st = total shortest paths from s to t
 * - σ_st(v) = shortest paths from s to t through v
 *
 * Interpretation:
 * - High BC = bridge/broker (lies on many shortest paths)
 * - Connects different communities
 *
 * @param graph - Social graph
 * @returns Betweenness scores
 */
computeBetweenness(graph: SocialGraph): BetweennessMetrics {
  const start = Date.now();
  const G = this.toGraphology(graph);

  // Run betweenness centrality (Brandes algorithm)
  const scores = betweennessCentrality(G);

  // Sort by score
  const sorted = Object.entries(scores)
    .map(([nodeId, score]) => ({ nodeId, score }))
    .sort((a, b) => b.score - a.score);

  // Identify bridge nodes (top 10% betweenness)
  const threshold = this.percentile(
    Object.values(scores),
    0.9
  );

  const bridgeNodes = sorted
    .filter(s => s.score >= threshold)
    .map(s => s.nodeId);

  const bridgePercentage = (bridgeNodes.length / sorted.length) * 100;

  const duration = Date.now() - start;
  algorithmDuration.observe({ algorithm: 'betweenness' }, duration / 1000);

  return {
    top10: sorted.slice(0, 10),
    bridgeNodes,
    bridgePercentage,
    duration
  };
}
```

---

### **4.3 Performance Optimization for Large Graphs**

**Challenge**: PageRank and Betweenness are O(n²) or O(n³) for large graphs

**Solutions**:

```typescript
/**
 * Adaptive algorithm selection based on graph size
 */
class AdaptiveGraphAnalyzer extends GraphAnalyzer {
  async computeCentrality(graph: SocialGraph): Promise<CentralityMetrics> {
    const nodeCount = graph.data.nodes.length;

    if (nodeCount < 1000) {
      // Small graph: Full algorithms, client-side capable
      return {
        pageRank: this.computePageRank(graph),
        betweenness: this.computeBetweenness(graph)
      };
    } else if (nodeCount < 5000) {
      // Medium graph: Full algorithms, server-side
      return {
        pageRank: this.computePageRank(graph),
        betweenness: await this.computeBetweennessAsync(graph) // Web Worker
      };
    } else {
      // Large graph: Sampling + approximation
      logger.info('Using approximate algorithms for large graph', {
        nodeCount
      });

      return {
        pageRank: this.approximatePageRank(graph),
        betweenness: this.sampleBetweenness(graph, 1000) // Sample 1K nodes
      };
    }
  }

  /**
   * Approximate PageRank using power iteration (fewer iterations)
   */
  private approximatePageRank(graph: SocialGraph): PageRankMetrics {
    const G = this.toGraphology(graph);

    // Fewer iterations, lower tolerance
    const scores = pageRank(G, {
      alpha: 0.85,
      maxIterations: 20, // vs. 100
      tolerance: 0.001 // vs. 0.000001
    });

    // Continue as normal...
  }

  /**
   * Sample betweenness (compute for subset of nodes)
   */
  private sampleBetweenness(
    graph: SocialGraph,
    sampleSize: number
  ): BetweennessMetrics {
    const G = this.toGraphology(graph);

    // Stratified sampling: High-degree + random
    const highDegree = G.nodes()
      .map(n => ({ id: n, degree: G.degree(n) }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, sampleSize / 2)
      .map(n => n.id);

    const random = _.sampleSize(
      G.nodes().filter(n => !highDegree.includes(n)),
      sampleSize / 2
    );

    const sample = [...highDegree, ...random];

    // Compute betweenness for sample only
    const scores = betweennessCentrality(G, { nodes: sample });

    // Extrapolate to full graph (estimate)
    // ...
  }
}
```

---

## **5. Template System**

### **5.1 Template Matching Engine**

```typescript
/**
 * TemplateMatcher: Rule-based template selection
 */
class TemplateMatcher {
  /**
   * Match templates against metrics
   *
   * @param templates - Available templates
   * @param metrics - Computed graph metrics
   * @param profile - Statistical profile
   * @returns Matched templates with confidence scores
   */
  match(
    templates: InsightTemplate[],
    metrics: GraphMetrics,
    profile: StatisticalProfile
  ): TemplateMatch[] {
    const matches: TemplateMatch[] = [];

    for (const template of templates) {
      // Evaluate required conditions
      const requiredMatch = template.conditions.required.every(condition =>
        this.evaluateCondition(condition, metrics, profile)
      );

      if (!requiredMatch) continue; // Skip if required conditions not met

      // Evaluate optional conditions (for confidence)
      const optionalMatches = template.conditions.optional.filter(condition =>
        this.evaluateCondition(condition, metrics, profile)
      );

      // Calculate confidence score
      const confidence = this.calculateConfidence(
        template.conditions.required.length,
        optionalMatches.length,
        template.conditions.optional.length
      );

      // Extract variable values
      const variables = this.extractVariables(
        template.narrative.variables,
        metrics,
        profile
      );

      // Extract supporting metrics for explainability
      const supportingMetrics = [
        ...template.conditions.required,
        ...optionalMatches
      ].map(c => ({
        key: c.metric,
        value: this.getMetricValue(c.metric, metrics, profile)
      }));

      matches.push({
        template,
        confidence,
        priority: this.calculatePriority(template, confidence),
        variables,
        triggeredConditions: [
          ...template.conditions.required.map(c => c.metric),
          ...optionalMatches.map(c => c.metric)
        ],
        supportingMetrics
      });
    }

    // Sort by priority (descending)
    matches.sort((a, b) => b.priority - a.priority);

    // Limit to top 10 insights
    return matches.slice(0, 10);
  }

  /**
   * Evaluate single condition
   */
  private evaluateCondition(
    condition: Condition,
    metrics: GraphMetrics,
    profile: StatisticalProfile
  ): boolean {
    const value = this.getMetricValue(condition.metric, metrics, profile);

    if (value === undefined) return false;

    switch (condition.operator) {
      case 'gt':
        return value > (condition.value as number);
      case 'lt':
        return value < (condition.value as number);
      case 'eq':
        return value === (condition.value as number);
      case 'gte':
        return value >= (condition.value as number);
      case 'lte':
        return value <= (condition.value as number);
      case 'between':
        const [min, max] = condition.value as [number, number];
        return value >= min && value <= max;
      default:
        return false;
    }
  }

  /**
   * Get metric value using a dot-path (MetricPath)
   *
   * Supported forms:
   * - Explicit roots: 'metrics.<path>' or 'profile.<path>'
   * - Legacy paths: '<path>' (resolved against merged { ...metrics, ...profile })
   */
  private getMetricValue(
    path: string,
    metrics: GraphMetrics,
    profile: StatisticalProfile
  ): number | undefined {
    const trimmed = path.trim();

    const resolveDotPath = (root: any, dotPath: string): any => {
      const keys = dotPath.split('.').filter(Boolean);
      let value: any = root;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return undefined;
      }

      return value;
    };

    let value: any;
    if (trimmed.startsWith('metrics.')) {
      value = resolveDotPath(metrics, trimmed.slice('metrics.'.length));
    } else if (trimmed.startsWith('profile.')) {
      value = resolveDotPath(profile, trimmed.slice('profile.'.length));
    } else {
      // Backward-compatible legacy behavior
      value = resolveDotPath({ ...metrics, ...profile }, trimmed);
    }

    return typeof value === 'number' ? value : undefined;
  }

  /**
   * Calculate confidence score
   *
   * Formula: (required + optional * 0.5) / (required + optional)
   */
  private calculateConfidence(
    requiredCount: number,
    optionalMatchedCount: number,
    optionalTotalCount: number
  ): 'high' | 'medium' | 'low' {
    if (optionalTotalCount === 0) {
      return 'high'; // All required conditions met, no optional
    }

    const score = (requiredCount + optionalMatchedCount * 0.5) /
                  (requiredCount + optionalTotalCount);

    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }

  /**
   * Calculate priority (for sorting)
   *
   * Priority = base priority + confidence boost
   */
  private calculatePriority(
    template: InsightTemplate,
    confidence: 'high' | 'medium' | 'low'
  ): number {
    const basePriority = template.metadata.confidence === 'high' ? 8 :
                         template.metadata.confidence === 'medium' ? 5 : 3;

    const confidenceBoost = confidence === 'high' ? 2 :
                           confidence === 'medium' ? 1 : 0;

    return basePriority + confidenceBoost;
  }

  /**
   * Extract variable values for interpolation
   */
  private extractVariables(
    variableDefs: InsightTemplate['narrative']['variables'],
    metrics: GraphMetrics,
    profile: StatisticalProfile
  ): Record<string, any> {
    const variables: Record<string, any> = {};

    for (const varDef of variableDefs) {
      const value = this.getMetricValue(varDef.source, metrics, profile);

      if (value !== undefined) {
        // Apply formatter
        variables[varDef.name] = this.formatValue(value, varDef.formatter);
      }
    }

    return variables;
  }

  /**
   * Format value based on type
   */
  private formatValue(
    value: number,
    formatter?: 'number' | 'percentage' | 'currency' | 'custom'
  ): string {
    switch (formatter) {
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'currency':
        return `$${value.toFixed(2)}`;
      default:
        return value.toString();
    }
  }
}

interface TemplateMatch {
  template: InsightTemplate;
  confidence: 'high' | 'medium' | 'low';
  priority: number;
  variables: Record<string, any>;
  triggeredConditions: string[];
  supportingMetrics: { key: string; value: number }[];
}
```

---

### **5.2 Template Interpolation**

```typescript
/**
 * TemplateInterpolator: Variable substitution + variant selection
 */
class TemplateInterpolator {
  /**
   * Interpolate template with variables
   *
   * @param template - Template text with {{variables}}
   * @param variables - Variable values
   * @returns Interpolated narrative
   */
  interpolate(
    template: InsightTemplate,
    variables: Record<string, any>,
    context?: { graphId?: string; userId?: string; experimentId?: string }
  ): string {
    // Select variant deterministically (sticky A/B assignment)
    const variant = this.selectVariant(template, context);

    // Replace {{variable}} with values
    let narrative = variant;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      narrative = narrative.replace(regex, value.toString());
    }

    return narrative;
  }

  /**
   * Select variant (A/B testing, deterministic and reproducible)
   */
  private selectVariant(
    template: InsightTemplate,
    context?: { graphId?: string; userId?: string; experimentId?: string }
  ): string {
    // Deterministic variety without breaking reproducibility or caching.
    // A/B testing is implemented as sticky bucketing (user+template+version).

    const allVariants = [
      template.narrative.template,
      ...template.narrative.variants
    ];

    const seed = [
      context?.experimentId ?? 'default',
      context?.userId ?? 'anon',
      context?.graphId ?? 'no-graph',
      template.id,
      String(template.version)
    ].join(':');

    const index = this.hashToIndex(seed, allVariants.length);
    return allVariants[index];
  }

  // Fast deterministic hash (FNV-1a) → [0, mod)
  private hashToIndex(input: string, mod: number): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash) % Math.max(1, mod);
  }
}
```

---

### **5.3 Template Library Management**

```typescript
/**
 * TemplateLibrary: Manage template lifecycle
 */
class TemplateLibrary {
  constructor(
    private templateRepo: TemplateRepository,
    private cache: RedisCache
  ) {}

  /**
   * Get active templates (cached)
   */
  async getActive(): Promise<InsightTemplate[]> {
    const cacheKey = 'templates:active';

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const templates = await this.templateRepo.findByStatus('active');

    // Cache for 1 day
    await this.cache.set(cacheKey, templates, 24 * 60 * 60);

    return templates;
  }

  /**
   * Update template (invalidate cache)
   */
  async update(
    templateId: string,
    updates: Partial<InsightTemplate>
  ): Promise<void> {
    await this.templateRepo.update(templateId, updates);

    // Invalidate cache
    await this.cache.delete('templates:active');

    logger.info('Template updated', { templateId, updates });
  }

  /**
   * A/B test results (Phase 2+)
   */
  async recordFeedback(
    templateId: string,
    feedback: { rating?: number; dismissed: boolean }
  ): Promise<void> {
    await this.templateRepo.updateStats(templateId, feedback);

    logger.info('Template feedback recorded', { templateId, feedback });
  }
}
```

---

## **6. Statistical Profiling**

### **6.1 Distribution Analysis**

```typescript
/**
 * StatisticalProfiler: Descriptive statistics and patterns
 */
class StatisticalProfiler {
  /**
   * Generate statistical profile of graph
   */
  profile(
    graph: SocialGraph,
    metrics: GraphMetrics
  ): StatisticalProfile {
    return {
      distributions: this.analyzeDistributions(graph),
      correlations: this.findCorrelations(graph, metrics),
      outliers: this.detectOutliers(graph, metrics),
      comparisons: this.compareToBaseline(graph.platform, metrics)
    };
  }

  /**
   * Analyze distributions (degree, engagement, etc.)
   */
  private analyzeDistributions(graph: SocialGraph): Distributions {
    const degrees = graph.data.nodes.map(n => n.degree || 0);
    const weights = graph.data.edges.map(e => e.weight);

    return {
      degree: {
        mean: this.mean(degrees),
        median: this.median(degrees),
        std: this.std(degrees),
        percentiles: {
          p25: this.percentile(degrees, 0.25),
          p50: this.percentile(degrees, 0.50),
          p75: this.percentile(degrees, 0.75),
          p90: this.percentile(degrees, 0.90),
          p99: this.percentile(degrees, 0.99)
        }
      },
      engagement: {
        mean: this.mean(weights),
        median: this.median(weights),
        std: this.std(weights),
        percentiles: {
          p25: this.percentile(weights, 0.25),
          p50: this.percentile(weights, 0.50),
          p75: this.percentile(weights, 0.75),
          p90: this.percentile(weights, 0.90),
          p99: this.percentile(weights, 0.99)
        }
      }
    };
  }

  /**
   * Detect outliers (Z-score method)
   */
  private detectOutliers(
    graph: SocialGraph,
    metrics: GraphMetrics
  ): Outliers {
    const degrees = graph.data.nodes.map(n => n.degree || 0);
    const mean = this.mean(degrees);
    const std = this.std(degrees);

    // Z-score > 3 = outlier
    const outlierNodes = graph.data.nodes.filter(n => {
      const z = Math.abs(((n.degree || 0) - mean) / std);
      return z > 3;
    });

    return {
      highDegree: outlierNodes.map(n => n.id),
      count: outlierNodes.length,
      percentage: (outlierNodes.length / graph.data.nodes.length) * 100
    };
  }

  /**
   * Compare to platform baselines (Phase 2+)
   */
  private compareToBaseline(platform: Platform, metrics: GraphMetrics): Comparisons {
    // Baseline data from public research or aggregated user data
    const baseline = this.getBaselineForPlatform(platform);

    return {
      density: {
        user: metrics.structure.density,
        baseline: baseline.density,
        percentile: this.calculatePercentile(
          metrics.structure.density,
          baseline.densityDistribution
        )
      },
      // Similar for other metrics...
    };
  }

  // Statistical helper methods
  private mean(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private std(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(v => Math.pow(v - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }
}
```

---

## **7. Insight Generation Pipeline**

### **7.1 End-to-End Flow**

```
User uploads export → Parser (client-side) → Graph builder → Store
                                                    │
                                                    ▼
                                          ┌─────────────────┐
                                          │ Insight Request │
                                          └─────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                          ┌─────────▼────────┐          ┌──────────▼──────────┐
                          │ Check Cache      │          │ Compute Metrics     │
                          │ (Redis, 15-min)  │          │ (if not cached)     │
                          └─────────┬────────┘          └──────────┬──────────┘
                                    │                               │
                                    │ Cache hit                     │ Cache miss
                                    │                               │
                                    ├───────────────────────────────┤
                                    │                               │
                                    ▼                               ▼
                          ┌─────────────────┐          ┌──────────────────────┐
                          │ Return cached   │          │ Phase 1: Structure   │
                          │ insights        │          │ (fast, <1s)          │
                          └─────────────────┘          └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Phase 2: Communities │
                                                        │ (medium, 1-5s)       │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Phase 3: Centrality  │
                                                        │ (slow, 5-30s)        │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Phase 4: Patterns    │
                                                        │ (derived, <1s)       │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Statistical Profile  │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Template Matcher     │
                                                        │ (rule-based)         │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Interpolator         │
                                                        │ (variable subst)     │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Action Generator     │
                                                        └──────────┬───────────┘
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │ Cache Result         │
                                                        │ (Redis, 15-min TTL)  │
                                                        └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │ Return Insights      │
                                                        └──────────────────────┘
```

### **7.2 Performance Budget**

```
Target Latency (p95):
├─ Cache hit: <50ms
├─ Small graph (<1K nodes): <2s total
├─ Medium graph (1K-5K): <5s total
├─ Large graph (5K-10K): <10s total (with approximations)
└─ Very large (>10K): <15s (sampling required)

Breakdown (uncached, 5K node graph):
├─ Fetch graph: 100ms (database)
├─ Structural metrics: 200ms
├─ Louvain algorithm: 1-2s
├─ PageRank: 1-2s
├─ Betweenness: 2-3s (can approximate)
├─ Statistical profile: 200ms
├─ Template matching: 100ms
├─ Interpolation: 50ms
├─ Cache write: 50ms
└─ Total: ~5-8s
```

---

## **8. Privacy & Anonymization**

### **8.1 Data Minimization Strategy**

**Principle**: Store only what's necessary for analysis, anonymize everything else

```typescript
/**
 * Privacy-preserving graph storage
 */
class PrivacyPreservingStorage {
  /**
   * Anonymize graph before storage
   *
   * Process:
   * 1. Hash usernames/names (SHA-256 + salt)
   * 2. Remove profile images (reconstruct on-demand if needed)
   * 3. Generalize timestamps (day-level precision)
   * 4. Strip PII from metadata
   */
  async store(graph: SocialGraph, userId: string): Promise<void> {
    const salt = await this.getUserSalt(userId);

    // Anonymize nodes
    const anonymizedNodes = graph.data.nodes.map(node => ({
      ...node,
      displayName: this.hash(node.displayName, salt),
      username: this.hash(node.username, salt),
      profileImageUrl: undefined, // Remove, reconstruct if needed
    }));

    // Generalize edge timestamps
    const anonymizedEdges = graph.data.edges.map(edge => ({
      ...edge,
      createdAt: this.generalizeDate(edge.createdAt), // Day precision
    }));

    const anonymizedGraph = {
      ...graph,
      data: {
        nodes: anonymizedNodes,
        edges: anonymizedEdges,
        metadata: this.stripPII(graph.data.metadata)
      }
    };

    await this.graphRepo.create(anonymizedGraph);
  }

  /**
    * Pseudonymize value with user-specific secret (non-reversible)
   */
  private hash(value: string, salt: string): string {
    return crypto
      .createHmac('sha256', salt)
      .update(value)
      .digest('hex');
  }

  /**
   * Generalize date to day precision
   */
  private generalizeDate(date: Date): Date {
    return new Date(date.toDateString()); // Remove time
  }

  /**
   * Strip PII from metadata
   */
  private stripPII(metadata: GraphMetadata): GraphMetadata {
    return {
      ...metadata,
      parsingErrors: metadata.parsingErrors.map(e => ({
        ...e,
        // Remove any user-specific error messages
        message: this.sanitizeErrorMessage(e.message)
      }))
    };
  }
}
```

### **8.2 Client-Side Processing**

**80% Rule**: 80% of graph processing happens client-side

```typescript
// Client-side graph builder (Web Worker)

// worker.ts
importScripts('graphology.min.js', 'louvain.min.js');

self.onmessage = async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'BUILD_GRAPH':
      const graph = buildGraph(data.nodes, data.edges);
      self.postMessage({ type: 'GRAPH_BUILT', graph });
      break;

    case 'COMPUTE_METRICS':
      // Phase 1: Structural (always client-side)
      const structure = computeStructure(data.graph);

      // Phase 2: Communities (client-side for <5K nodes)
      let communities;
      if (data.graph.nodes.length < 5000) {
        communities = detectCommunities(data.graph);
      }

      self.postMessage({
        type: 'METRICS_COMPUTED',
        structure,
        communities
      });
      break;
  }
};

function buildGraph(nodes, edges) {
  const G = new Graph();
  nodes.forEach(n => G.addNode(n.id, n));
  edges.forEach(e => G.addEdge(e.source, e.target, e));
  return G.export();
}

function detectCommunities(graph) {
  const G = Graph.from(graph);
  const communities = louvain(G);
  // Compute modularity, sizes, etc.
  return { communities, modularity, sizes };
}
```

**Benefits**:
- No data sent to server for basic analysis
- Faster (no network round-trip)
- Scales with user's device (not server capacity)
- Privacy-maximizing (data never leaves browser)

---

## **9. Performance Optimization**

### **9.1 Caching Strategy**

```typescript
/**
 * Multi-layer caching
 */
class CachingStrategy {
  constructor(
    private redis: RedisCache,
    private indexedDB: IndexedDBCache
  ) {}

  /**
   * Get graph metrics (multi-layer)
   */
  async getMetrics(graphId: string): Promise<GraphMetrics | null> {
    // Layer 1: Redis (server-side, 1-hour TTL)
    const cached = await this.redis.get(`metrics:${graphId}`);
    if (cached) {
      logger.debug('Metrics cache hit (Redis)', { graphId });
      return cached;
    }

    // Layer 2: IndexedDB (client-side, persistent)
    const clientCached = await this.indexedDB.get(`metrics:${graphId}`);
    if (clientCached) {
      logger.debug('Metrics cache hit (IndexedDB)', { graphId });
      // Backfill Redis for faster access next time
      await this.redis.set(`metrics:${graphId}`, clientCached, 60 * 60);
      return clientCached;
    }

    return null;
  }

  /**
   * Store metrics (multi-layer)
   */
  async setMetrics(graphId: string, metrics: GraphMetrics): Promise<void> {
    // Redis: 1-hour TTL
    await this.redis.set(`metrics:${graphId}`, metrics, 60 * 60);

    // IndexedDB: Persistent (user can clear)
    await this.indexedDB.set(`metrics:${graphId}`, metrics);
  }
}
```

### **9.2 Progressive Rendering**

```typescript
/**
 * Progressive insight generation
 *
 * Show partial results as they become available
 */
class ProgressiveInsightEngine extends InsightEngine {
  async generateProgressive(
    graphId: string,
    onProgress: (insights: Insight[]) => void
  ): Promise<Insight[]> {
    const graph = await this.graphRepo.getById(graphId);
    const allInsights: Insight[] = [];

    // Phase 1: Quick insights (structure-based)
    const structureMetrics = this.graphAnalyzer.computeStructure(graph);
    const quickInsights = await this.matchTemplates(structureMetrics);
    allInsights.push(...quickInsights);
    onProgress(allInsights); // Show immediately

    // Phase 2: Community insights (1-5s)
    const communityMetrics = this.graphAnalyzer.detectCommunities(graph);
    const communityInsights = await this.matchTemplates({
      ...structureMetrics,
      communities: communityMetrics
    });
    allInsights.push(...communityInsights);
    onProgress(allInsights); // Update UI

    // Phase 3: Centrality insights (5-30s)
    const centralityMetrics = await this.graphAnalyzer.computeCentrality(graph);
    const centralityInsights = await this.matchTemplates({
      ...structureMetrics,
      communities: communityMetrics,
      centrality: centralityMetrics
    });
    allInsights.push(...centralityInsights);
    onProgress(allInsights); // Final update

    return allInsights;
  }

  private async matchTemplates(
    partialMetrics: Partial<GraphMetrics>
  ): Promise<Insight[]> {
    // Match only templates that can be satisfied by available metrics
    const templates = await this.templateLibrary.getActive();
    const matchable = templates.filter(t =>
      this.canMatchWithPartialMetrics(t, partialMetrics)
    );

    return this.templateMatcher.match(matchable, partialMetrics);
  }
}
```

---

## **10. Evolution Strategy**

### **10.1 Template Evolution**

**How the intelligence layer improves over time**:

```
Phase 1 (Beta Launch): Seed Templates
├─ 20-30 hand-crafted templates
├─ Categories: bridge_accounts, echo_chamber, engagement, community
├─ Conservative conditions (high precision, medium recall)
└─ Goal: Establish baseline quality

Phase 2 (Public Launch): Expansion
├─ Add 50+ templates based on user feedback
├─ Track template performance (ratings, dismiss rate)
├─ A/B test narrative variants
├─ Refine conditions based on false positives/negatives
└─ Goal: Increase coverage (more use cases)

Phase 3 (Scale): Optimization
├─ Machine learning for condition tuning (offline)
│  ├─ Train model: GraphMetrics → User rating
│  ├─ Identify optimal thresholds
│  └─ Generate new condition combinations
├─ Collaborative filtering: "Users like you found these insights useful"
├─ Personalization: User-specific template weights
└─ Goal: Maximize relevance per user

Phase 4 (Leadership): Advanced Intelligence
├─ Natural language generation (NLG) for narratives
│  ├─ Still deterministic (template + NLG rules)
│  └─ More variety, better phrasing
├─ Causal analysis: "This change in your network caused X"
├─ Predictive insights: "Your network is likely to..."
└─ Goal: Become the "intelligence layer" for all PNI tools
```

**Critical Constraint**: Never compromise explainability

Even in Phase 4, every insight must be:
- Traceable to specific metrics
- Reproducible (deterministic)
- Testable (unit tests for templates)

---

### **10.2 Algorithm Evolution**

**Phase 1-2**: Classical algorithms (Louvain, PageRank, Betweenness)

**Phase 3**: Custom algorithms for social graph patterns
```typescript
// Example: Custom "Echo Chamber Score"

function computeEchoChamberScore(graph: Graph, communities: number[]): number {
  let intraCommunityEngagement = 0;
  let totalEngagement = 0;

  graph.forEachEdge((edge, attributes, source, target) => {
    const weight = attributes.weight || 1;
    totalEngagement += weight;

    const sourceCommunity = communities[graph.nodes().indexOf(source)];
    const targetCommunity = communities[graph.nodes().indexOf(target)];

    if (sourceCommunity === targetCommunity) {
      intraCommunityEngagement += weight;
    }
  });

  return intraCommunityEngagement / totalEngagement;
}
```

**Phase 4**: Research-grade algorithms
- Temporal community detection (evolving networks)
- Multi-layer network analysis (Twitter + LinkedIn combined)
- Influence propagation modeling

---

## **11. Quality Assurance**

### **11.1 Algorithm Testing**

```typescript
// Test suite for graph algorithms

describe('GraphAnalyzer', () => {
  describe('detectCommunities', () => {
    it('should match known results on Zachary Karate Club', () => {
      const graph = loadZacharyKarateClub();
      const result = analyzer.detectCommunities(graph);

      // Known results from literature
      expect(result.count).toBe(2); // 2 communities
      expect(result.modularity).toBeCloseTo(0.42, 2); // Q ≈ 0.42
    });

    it('should handle disconnected components', () => {
      const graph = createDisconnectedGraph();
      const result = analyzer.detectCommunities(graph);

      expect(result.count).toBeGreaterThanOrEqual(2);
    });

    it('should complete in <5s for 10K node graph', () => {
      const graph = generateRandomGraph(10000, 50000);
      const start = Date.now();

      const result = analyzer.detectCommunities(graph);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(5000);
    });
  });

  describe('computePageRank', () => {
    it('should produce valid probabilities', () => {
      const graph = loadTestGraph();
      const result = analyzer.computePageRank(graph);

      const sum = result.top10.reduce((s, r) => s + r.score, 0);
      // top10 is a partial view; it MUST NOT exceed 1.0
      expect(sum).toBeLessThanOrEqual(1.0);
    });
  });
});
```

### **11.2 Template Testing**

```typescript
// Test suite for templates

describe('TemplateMatcher', () => {
  it('should match bridge accounts template', () => {
    const metrics: GraphMetrics = {
      centrality: {
        betweenness: {
          bridgePercentage: 7.5 // Above threshold (5%)
        }
      },
      communities: {
        count: 5 // Multiple communities
      }
    };

    const templates = [bridgeAccountsTemplate];
    const matches = matcher.match(templates, metrics);

    expect(matches.length).toBe(1);
    expect(matches[0].template.id).toBe('bridge-accounts-v1');
    expect(matches[0].confidence).toBe('high');
  });

  it('should not match if conditions not met', () => {
    const metrics: GraphMetrics = {
      centrality: {
        betweenness: {
          bridgePercentage: 2.5 // Below threshold
        }
      },
      communities: {
        count: 5
      }
    };

    const templates = [bridgeAccountsTemplate];
    const matches = matcher.match(templates, metrics);

    expect(matches.length).toBe(0);
  });

  it('should prioritize high-confidence matches', () => {
    const metrics = createTestMetrics();
    const templates = [
      { ...template1, conditions: { required: [/* easy */] } },
      { ...template2, conditions: { required: [/* hard */] } }
    ];

    const matches = matcher.match(templates, metrics);

    // Both match, but template1 has higher confidence
    expect(matches[0].confidence).toBe('high');
    expect(matches[1].confidence).toBe('medium');
  });
});
```

### **11.3 Integration Testing**

```typescript
// End-to-end insight generation test

describe('InsightEngine Integration', () => {
  it('should generate insights for sample graph', async () => {
    // Upload sample graph
    const graph = await uploadTestGraph('twitter_500_nodes.json');

    // Generate insights
    const insights = await engine.generate(graph.id);

    // Assertions
    expect(insights.length).toBeGreaterThan(0);
    expect(insights.length).toBeLessThanOrEqual(10);

    insights.forEach(insight => {
      expect(insight.narrative).toBeTruthy();
      expect(insight.explanation.triggeredConditions.length).toBeGreaterThan(0);
      expect(insight.confidence).toMatch(/high|medium|low/);
    });
  });

  it('should cache results', async () => {
    const graph = await uploadTestGraph('twitter_100_nodes.json');

    // First call (uncached)
    const start1 = Date.now();
    const insights1 = await engine.generate(graph.id);
    const duration1 = Date.now() - start1;

    // Second call (cached)
    const start2 = Date.now();
    const insights2 = await engine.generate(graph.id);
    const duration2 = Date.now() - start2;

    // Cached should be much faster
    expect(duration2).toBeLessThan(duration1 / 10);

    // Results should be identical
    expect(insights2).toEqual(insights1);
  });
});
```

---

## **12. Appendices**

### **A. Glossary**

**Algorithm-First**: Intelligence architecture that uses deterministic algorithms rather than AI models

**Betweenness Centrality**: Measure of how often a node lies on shortest paths between other nodes (bridge score)

**Bridge Account**: User with high betweenness centrality, connecting different communities

**Community**: Cluster of densely connected nodes (detected via Louvain algorithm)

**Echo Chamber**: Community with very few inter-community connections (high homophily)

**GraphMetrics**: Computed properties of a social graph (structure, communities, centrality, etc.)

**Homophily**: Tendency for connections to be within same community rather than across communities

**Insight**: Natural language narrative + actions generated from graph analysis

**Louvain Algorithm**: Community detection method via modularity optimization

**Modularity**: Quality measure for community division (Q = 0.3-0.7 indicates strong communities)

**PageRank**: Measure of node influence/importance (used by Google Search)

**Template**: Rule-based pattern for generating insights (conditions + narrative + actions)

**Template Matching**: Process of evaluating template conditions against graph metrics

### **B. References**

**Graph Algorithms**:
- Blondel et al. (2008). "Fast unfolding of communities in large networks." Journal of Statistical Mechanics
- Page & Brin (1998). "The anatomy of a large-scale hypertextual Web search engine." WWW Conference
- Freeman (1977). "A set of measures of centrality based on betweenness." Sociometry

**Social Network Analysis**:
- Wasserman & Faust (1994). "Social Network Analysis: Methods and Applications"
- Newman (2010). "Networks: An Introduction"
- Barabási (2016). "Network Science"

**Implementation Libraries**:
- graphology: https://graphology.github.io/ (JavaScript graph library)
- graphology-communities-louvain: Louvain algorithm implementation
- graphology-metrics: Centrality measures (PageRank, Betweenness)

### **C. Performance Benchmarks**

**Algorithm Performance (measured on M1 MacBook Pro)**:

| Graph Size | Louvain | PageRank | Betweenness | Total |
|-----------|---------|----------|-------------|-------|
| 100 nodes | 10ms | 15ms | 20ms | 45ms |
| 500 nodes | 50ms | 100ms | 200ms | 350ms |
| 1K nodes | 100ms | 250ms | 500ms | 850ms |
| 5K nodes | 1s | 2s | 5s | 8s |
| 10K nodes | 3s | 5s | 15s* | 23s* |

*With approximation, Betweenness reduced to 3s (sampling)

### **D. Template Library (Phase 1 Seed)**

```yaml
# Initial template categories

Bridge Accounts:
  - bridge-accounts-v1: Core bridge detection
  - cross-community-engagement-v1: Engagement across communities

Echo Chamber:
  - echo-chamber-detection-v1: High homophily warning
  - diversity-opportunity-v1: Suggest expanding network

Engagement:
  - active-vs-passive-v1: Engagement distribution
  - reciprocity-analysis-v1: Mutual engagement patterns
  - engagement-concentration-v1: Few accounts dominate interactions

Community:
  - community-overview-v1: Cluster summary
  - community-isolation-v1: Disconnected clusters warning
  - largest-community-v1: Dominant community analysis

Growth:
  - growth-rate-v1: Network expansion tracking
  - connection-trends-v1: New vs. lost connections

Influencers:
  - top-influencers-v1: High PageRank accounts
  - self-influence-v1: User's own influence ranking

Total: ~20 templates for Phase 1
```

---

## **Document Status**

**Version**: 1.0 (Algorithm-First Foundation)
**Status**: Living Document - Intelligence Design Foundation
**Last Updated**: December 24, 2025
**Next Review**: January 15, 2026 (post-beta launch)

**Change Log**:
- v1.0 (Dec 24, 2025): Initial version, algorithm-first architecture established

---

**This Data & Intelligence Framework document is the technical foundation for VSG's algorithm-first intelligence layer. All template creation, algorithm implementation, and insight generation must align with this framework or the document must be updated with clear rationale documented.**

*End of Document*
