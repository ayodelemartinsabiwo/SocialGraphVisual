# **Visual Social Graph: Architecture Document**
## **Version 1.0 - Algorithm-First Foundation**

*"Every component should sing. Every interface should breathe. Every abstraction should feel inevitable."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 (Algorithm-First Edition) |
| **Date** | December 21, 2025 |
| **Status** | Living Document - Technical Design Foundation |
| **Owner** | Engineering / Architecture |
| **Review Cycle** | Weekly (Phase 0-1), Bi-weekly (Phase 2+) |
| **Classification** | Internal - Technical |
| **Scope** | Phase 0-2 (detailed), Phase 3-4 (directional) |

**Document Hierarchy:**
```
Product Strategy Document v1.1 (strategic constitution)
    ↓ constrains
Product Requirements Document v2.2 (what we're building)
    ↓ defines
System Requirements Specification v1.3 (functional/non-functional requirements)
    ↓ guides
Architecture Document v1.0 (THIS DOCUMENT - how we build it elegantly)
    ↓ implements
Code & Infrastructure (actual system)
```

**Purpose:**

This Architecture Document translates the SRS into **elegant, implementable design**. It defines:
- **Component architecture** (what each piece does, how they communicate)
- **Data flow** (how information moves through the system)
- **Algorithm design** (graph analysis, template matching, narrative generation)
- **Interface contracts** (APIs, schemas, protocols)
- **Design patterns** (reusable solutions to recurring problems)

---

## **Table of Contents**

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [System Overview](#2-system-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Insight Engine - Algorithm-First Design](#5-insight-engine---algorithm-first-design)
6. [Data Architecture](#6-data-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Performance Architecture](#8-performance-architecture)
9. [Testing Architecture](#9-testing-architecture)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Observability Architecture](#11-observability-architecture)
12. [Evolution Strategy](#12-evolution-strategy)

---

## **1. Architecture Philosophy**

### **1.1 Ultrathink Principles Applied to Architecture**

**"Craft, Don't Code"**
```
Every component name should reveal intent
Every abstraction should reduce cognitive load
Every interface should feel natural
Every error should guide recovery
Every file should have a single, clear purpose

Translation to Architecture:
├─ Components: Single responsibility, composable
├─ Naming: Ubiquitous language (same terms everywhere)
├─ Interfaces: Minimal, explicit contracts
├─ Error handling: Graceful degradation + clear messages
└─ File structure: Flat hierarchy, intuitive navigation
```

**"Simplicity Is Sophistication"**
```
YAGNI: Build for known requirements, design for evolution
Boring technology: Proven tools > bleeding edge
Minimal abstractions: Only abstract when pattern repeats 3+ times
Flat hierarchy: Max 3 levels deep (directories, components)
Celebrate deletions: Removing code is progress

Translation to Architecture:
├─ Monolithic start: Complexity deferred until needed
├─ Standard patterns: Express + React + PostgreSQL
├─ Direct communication: No message buses (yet)
├─ Clear boundaries: Frontend ↔ API ↔ Database
└─ No premature optimization: Build simple, measure, optimize
```

**"Performance Is a Feature"**
```
Performance budget from Day 1
<2.5s page load (retention driver)
60 FPS visualization (smooth interactions)
<500ms API responses (feels instant)
Progressive enhancement: Works on slow connections

Translation to Architecture:
├─ Client-heavy: 80% processing client-side (reduce latency)
├─ Web Workers: Non-blocking heavy computation
├─ Caching layers: Redis (backend), Service Worker (frontend)
├─ Code splitting: Load only what's needed
└─ Monitoring: Real User Monitoring (RUM) + synthetic
```

**"Privacy by Design"**
```
80% client-side processing (minimize data transfer)
No account access (architectural enforcement)
Algorithm-first (no external AI dependencies)
Data minimization (only store necessary)
User control (delete/export anytime)

Translation to Architecture:
├─ Web Worker parsing: User data never leaves browser (mostly)
├─ Anonymized server storage: Hashed node IDs only
├─ Insight Engine: On-premise algorithms (no third-party AI)
├─ Clear data flow: User sees exactly what's sent
└─ Cascade deletes: User deletion removes all data
```

**"Algorithm-First Philosophy"**
```
AI is a design tool, not a runtime dependency
Core intelligence from deterministic algorithms
Templates provide narrative quality
Explainability builds trust
Independence ensures longevity

Translation to Architecture:
├─ Insight Engine: Graph algorithms + template matcher + interpolator
├─ No external AI APIs: Self-contained intelligence
├─ Template Library: Versioned, A/B testable narratives
├─ Traceable insights: Every recommendation links to graph metric
└─ Graceful degradation: System functions without "smart" features
```

---

### **1.2 Architectural Constraints (From SRS)**

**Tier-1 Constraints (Constitutional - Cannot Violate):**
```
C1: No Account Access
├─ No OAuth for social platforms
├─ Manual upload only
└─ No social API keys stored

C2: User Data Ownership
├─ Data minimization
├─ User can delete anytime
└─ No data selling or AI training (with external LLMs)

C3: Client-Side Processing (80% Rule)
├─ Parsing, graph construction client-side
├─ Web Workers for heavy computation
└─ Minimal server data transfer

DESIGN PRINCIPLE: Algorithm-First (No External AI)
├─ Insight Engine: Algorithms + templates (not LLM APIs)
├─ System remains functional without external AI
└─ Explainable, deterministic, cost-free intelligence
```

**Architectural Implications:**
- Frontend is **not thin client** - it's the primary computation engine
- Backend is **coordination layer** - auth, storage, server-side fallback
- Privacy is **architectural** - can't be violated without rebuilding
- Intelligence is **on-premise** - no vendor lock-in, no AI API costs

---

### **1.3 Design Patterns & Principles**

**Separation of Concerns:**
```
Presentation ← Domain Logic ← Data Access
(React)      (Business logic) (API/DB)

├─ Presentation: React components (UI only, no business logic)
├─ Domain: Pure functions, algorithms, state management
└─ Data: API client, database queries, external services
```

**Dependency Inversion:**
```
High-level modules should not depend on low-level modules
Both should depend on abstractions

Example:
├─ Insight Engine (high-level) depends on IGraphAlgorithm interface
├─ Louvain Algorithm (low-level) implements IGraphAlgorithm
└─ Easy to swap algorithms without changing Insight Engine
```

**Composition Over Inheritance:**
```
Favor composing small, focused components over class hierarchies

Example (React):
<GraphVisualization>
  <ForceSimulation />
  <ZoomControls />
  <FilterPanel />
</GraphVisualization>

Not:
class GraphVisualization extends BaseVisualization extends Component
```

**Fail Fast, Fail Gracefully:**
```
Detect errors early (fail fast)
Recover elegantly (fail gracefully)

Example:
├─ Parser detects invalid format → Immediate clear error message
├─ API call fails → Show cached data + retry option
└─ Graph too large → Auto-enable sampling + warn user
```

---

## **2. System Overview**

### **2.1 High-Level Architecture Diagram**

```
┌───────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                              │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                 Next.js Frontend (React 18)                   │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │  Presentation Layer (UI Components)                     │  │ │
│  │  │  ├─ Upload Flow (Tus client, progress)                  │  │ │
│  │  │  ├─ Visualization (D3.js + Canvas)                      │  │ │
│  │  │  ├─ Insights Dashboard (template-rendered narratives)   │  │ │
│  │  │  └─ Export Panel (PDF, social cards, data)             │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                          ↕                                    │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │  Domain Logic Layer (Business Rules)                    │  │ │
│  │  │  ├─ Parser Service (Web Worker) - 80% client-side       │  │ │
│  │  │  │  ├─ TwitterParser, InstagramParser, LinkedInParser   │  │ │
│  │  │  │  ├─ Version detector, format validator              │  │ │
│  │  │  │  └─ Error recovery, progress reporting              │  │ │
│  │  │  ├─ Graph Builder (Web Worker)                          │  │ │
│  │  │  │  ├─ Node/edge construction from parsed data          │  │ │
│  │  │  │  ├─ Deduplication, normalization                     │  │ │
│  │  │  │  └─ Basic metrics (degree, connectivity)             │  │ │
│  │  │  ├─ Visualization Engine (D3.js)                        │  │ │
│  │  │  │  ├─ Force simulation (physics)                       │  │ │
│  │  │  │  ├─ Rendering (SVG <1K nodes, Canvas 1K-5K)          │  │ │
│  │  │  │  └─ Interactions (zoom, pan, hover, click)           │  │ │
│  │  │  └─ Template Renderer (Client-side narratives)          │  │ │
│  │  │     ├─ Fetch matched templates from API                 │  │ │
│  │  │     ├─ Variable interpolation ({{metric}} → value)      │  │ │
│  │  │     └─ Markdown-to-React rendering                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                          ↕                                    │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │  Data Access Layer (API Client)                         │  │ │
│  │  │  ├─ Authentication (JWT management)                     │  │ │
│  │  │  ├─ Graph API (save/retrieve graphs)                    │  │ │
│  │  │  ├─ Insights API (request template-based insights)      │  │ │
│  │  │  └─ Export API (PDF, social cards)                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                        ↕ HTTPS (JWT auth)                         │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│              API Backend (Node.js + Express + TypeScript)          │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  API Gateway (Express Middleware)                            │ │
│  │  ├─ Authentication: JWT verification                         │ │
│  │  ├─ Authorization: Feature gating (tier-based)               │ │
│  │  ├─ Rate limiting: Per-user, per-IP                          │ │
│  │  ├─ Error handling: Standardized error responses            │ │
│  │  └─ Logging: Structured JSON logs                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                          ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Service Layer (Business Logic)                              │ │
│  │  ├─ Auth Service                                             │ │
│  │  │  ├─ Magic link generation/validation                      │ │
│  │  │  ├─ Google OAuth flow                                     │ │
│  │  │  └─ Session management (JWT + Redis)                      │ │
│  │  ├─ Upload Service                                           │ │
│  │  │  ├─ Tus protocol server (resumable uploads)               │ │
│  │  │  ├─ File validation, virus scanning                       │ │
│  │  │  └─ Temporary storage (R2)                                │ │
│  │  ├─ Insight Engine ⭐ ALGORITHM-FIRST CORE                    │ │
│  │  │  ├─ Graph Analyzer (graphology + algorithms)              │ │
│  │  │  │  ├─ Louvain (community detection)                      │ │
│  │  │  │  ├─ Betweenness centrality (bridge identification)     │ │
│  │  │  │  ├─ PageRank (influence measurement)                   │ │
│  │  │  │  └─ Jaccard coefficient (similarity analysis)          │ │
│  │  │  ├─ Statistical Profiler (simple-statistics)              │ │
│  │  │  │  ├─ Engagement distribution (percentiles)              │ │
│  │  │  │  ├─ Correlations (metric relationships)                │ │
│  │  │  │  └─ Significance testing (pattern validation)          │ │
│  │  │  ├─ Template Matcher (rule-based selection)               │ │
│  │  │  │  ├─ IF echoScore > 0.8 → "echo_chamber" templates      │ │
│  │  │  │  ├─ IF bridges.length > 0 → "bridge_accounts"          │ │
│  │  │  │  └─ IF communities > 5 → "fragmented_network"          │ │
│  │  │  ├─ Template Interpolator (narrative generation)          │ │
│  │  │  │  ├─ Variable substitution ({{count}} → "3")            │ │
│  │  │  │  ├─ Variant selection (randomize for natural feel)     │ │
│  │  │  │  └─ Confidence level assignment (high/medium/low)      │ │
│  │  │  └─ Action Generator (conditional suggestions)            │ │
│  │  │     ├─ Prioritize by impact (estimated reach increase)    │ │
│  │  │     ├─ Add context (explain reasoning)                    │ │
│  │  │     └─ Format as structured JSON                          │ │
│  │  ├─ Export Service                                           │ │
│  │  │  ├─ PDF generation (Puppeteer)                            │ │
│  │  │  ├─ Social card rendering (Canvas)                        │ │
│  │  │  └─ Data export (CSV, JSON)                               │ │
│  │  └─ Webhook Service (Stripe)                                 │ │
│  │     ├─ Payment event handling (idempotent)                   │ │
│  │     ├─ Subscription status sync                              │ │
│  │     └─ Tier updates (upgrade/downgrade)                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                          ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Data Access Layer (Prisma ORM)                              │ │
│  │  ├─ User repository (CRUD, soft delete)                      │ │
│  │  ├─ Graph repository (versioning, lifecycle)                 │ │
│  │  ├─ Template repository (fetch, version, A/B variants)       │ │
│  │  ├─ Subscription repository (Stripe sync)                    │ │
│  │  └─ Analytics repository (usage metrics)                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│                      Data Layer                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL 15 (Primary Data Store)                          │ │
│  │  ├─ users (authentication, tier, metadata)                   │ │
│  │  ├─ uploads (file tracking, status)                          │ │
│  │  ├─ graphs (versioned, JSONB, lifecycle)                     │ │
│  │  ├─ insights (generated, cached, linked to graph)            │ │
│  │  ├─ templates (narrative library, A/B variants) ⭐ NEW        │ │
│  │  ├─ subscriptions (Stripe sync, tier management)             │ │
│  │  └─ analytics_events (usage tracking, anonymized)            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                          ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Redis (Cache + Session Store + Job Queue)                   │ │
│  │  ├─ Session storage (JWT invalidation, 7-day TTL)            │ │
│  │  ├─ Graph metrics cache (1-hour TTL)                         │ │
│  │  ├─ Template recommendations cache (15-min TTL)              │ │
│  │  ├─ Rate limiting counters (sliding window)                  │ │
│  │  └─ Background job queue (Bull) - exports, emails            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                          ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Cloudflare R2 (S3-Compatible Object Storage)                │ │
│  │  ├─ /uploads/{user_id}/{upload_id}/file.zip (1-hour TTL)     │ │
│  │  ├─ /exports/{user_id}/{export_id}/report.pdf (7-day TTL)    │ │
│  │  └─ /graphs/{graph_id}/thumbnail.png (permanent)             │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│           External Services (Privacy-Preserved)                    │
│  ├─ Sentry (error tracking, performance monitoring)               │
│  ├─ PostHog (privacy-friendly analytics, feature flags)           │
│  ├─ Resend (transactional email, magic links)                     │
│  ├─ Stripe (payments, subscriptions, webhooks)                    │
│  └─ UptimeRobot (uptime monitoring, status page)                  │
│  [NO external AI APIs - all intelligence on-premise] ⭐           │
└───────────────────────────────────────────────────────────────────┘
```

---

### **2.2 Data Flow Diagram (Upload → Visualize → Insights)**

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 1: UPLOAD & PARSE                     │
└─────────────────────────────────────────────────────────────────┘

USER                BROWSER (Web Worker)           SERVER (Optional)
 │                         │                              │
 │  Select ZIP file        │                              │
 │────────────────────────>│                              │
 │                         │                              │
 │                         │  1. Validate file            │
 │                         │     (size, type, magic bytes)│
 │                         │                              │
 │                         │  2. Extract ZIP (JSZip)      │
 │                         │                              │
 │                         │  3. Detect platform/version  │
 │                         │     (file structure analysis)│
 │                         │                              │
 │                         │  4. Select parser            │
 │                         │     (TwitterV2, InstagramV3) │
 │                         │                              │
 │                         │  5. Parse files (streaming)  │
 │  Progress: 45%          │     ├─ account.js            │
 │<────────────────────────│     ├─ followers.json        │
 │                         │     └─ tweets-part0.js       │
 │                         │                              │
 │                         │  6. Build graph              │
 │                         │     ├─ Dedupe nodes          │
 │                         │     ├─ Construct edges       │
 │                         │     └─ Calculate basic metrics│
 │                         │                              │
 │                         │  7. Anonymize (if uploading) │
 │                         │     ├─ Hash node IDs         │
 │                         │     └─ Remove PII            │
 │                         │                              │
 │  Option: Process locally│                              │
 │  or upload to server?   │                              │
 │<────────────────────────│                              │
 │                         │                              │
 │  "Keep local" (default) │                              │
 │────────────────────────>│                              │
 │                         │                              │
 │         OR              │                              │
 │                         │                              │
 │  "Upload" (opt-in)      │   POST /api/graphs           │
 │────────────────────────>│─────────────────────────────>│
 │                         │   (anonymized graph JSON)    │
 │                         │                              │
 │                         │   201 Created + graph_id     │
 │                         │<─────────────────────────────│
 │                         │                              │
 │  Graph ready!           │                              │
 │<────────────────────────│                              │
 │                         │                              │

┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 2: VISUALIZE & EXPLORE                   │
└─────────────────────────────────────────────────────────────────┘

USER                BROWSER (Main Thread)          D3.js
 │                         │                         │
 │  View graph             │                         │
 │────────────────────────>│                         │
 │                         │                         │
 │                         │  1. Initialize D3 force │
 │                         │────────────────────────>│
 │                         │     ├─ Charge: -300     │
 │                         │     ├─ Link: by weight  │
 │                         │     └─ Center: weak     │
 │                         │                         │
 │                         │  2. Render (progressive)│
 │                         │<────────────────────────│
 │  Animation: Stage 1     │     Empty canvas (2s)   │
 │<────────────────────────│                         │
 │  - User node appears    │                         │
 │                         │                         │
 │  Animation: Stage 2     │     First connections   │
 │<────────────────────────│     emerge (3s)         │
 │                         │                         │
 │  Animation: Stage 3     │     Full network (3s)   │
 │<────────────────────────│                         │
 │                         │                         │
 │                         │  3. Detect communities  │
 │                         │     (Louvain, client)   │
 │                         │                         │
 │  Animation: Stage 4     │     Color-code (2s)     │
 │<────────────────────────│                         │
 │                         │                         │
 │  Animation: Stage 5     │     Interactive (∞)     │
 │<────────────────────────│                         │
 │                         │                         │
 │  Zoom, pan, hover       │                         │
 │────────────────────────>│  D3-zoom, hover handlers│
 │                         │────────────────────────>│
 │                         │                         │
 │  Click node             │  Fetch node details     │
 │────────────────────────>│  (local state)          │
 │                         │                         │
 │  Detail panel slides in │                         │
 │<────────────────────────│                         │
 │                         │                         │

┌─────────────────────────────────────────────────────────────────┐
│              PHASE 3: GENERATE INSIGHTS (Algorithm-First)        │
└─────────────────────────────────────────────────────────────────┘

USER          BROWSER           SERVER (Insight Engine)      DATABASE
 │               │                      │                        │
 │  "Show Insights"                    │                        │
 │──────────────>│                      │                        │
 │               │                      │                        │
 │               │  POST /api/insights  │                        │
 │               │─────────────────────>│                        │
 │               │  {graph_id, types}   │                        │
 │               │                      │                        │
 │               │                      │  1. Fetch graph        │
 │               │                      │────────────────────────>│
 │               │                      │  SELECT * FROM graphs  │
 │               │                      │                        │
 │               │                      │<────────────────────────│
 │               │                      │  graph_data (JSONB)    │
 │               │                      │                        │
 │               │                      │  2. Graph Analysis     │
 │               │                      │     (graphology)       │
 │               │                      │     ├─ Louvain →       │
 │               │                      │     │  communities: 5  │
 │               │                      │     ├─ Betweenness →   │
 │               │                      │     │  bridges: [...]  │
 │               │                      │     └─ PageRank →      │
 │               │                      │        influence: {...}│
 │               │                      │                        │
 │               │                      │  3. Statistical Profile│
 │               │                      │     (simple-statistics)│
 │               │                      │     ├─ Engagement →    │
 │               │                      │     │  p25/p50/p75     │
 │               │                      │     └─ Echo score →    │
 │               │                      │        homogeneity: 0.67│
 │               │                      │                        │
 │               │                      │  4. Template Matching  │
 │               │                      │     (rule-based)       │
 │               │                      │     IF echoScore > 0.6 │
 │               │                      │     → SELECT template  │
 │               │                      │────────────────────────>│
 │               │                      │  WHERE category =      │
 │               │                      │  'echo_chamber'        │
 │               │                      │                        │
 │               │                      │<────────────────────────│
 │               │                      │  template_json         │
 │               │                      │                        │
 │               │                      │  5. Interpolation      │
 │               │                      │     "You have {{score}}│
 │               │                      │      homogeneity..."   │
 │               │                      │     ↓                  │
 │               │                      │     "You have 67%      │
 │               │                      │      homogeneity..."   │
 │               │                      │                        │
 │               │                      │  6. Action Generation  │
 │               │                      │     Suggest: "Follow 5 │
 │               │                      │     diverse accounts"  │
 │               │                      │                        │
 │               │                      │  7. Cache result       │
 │               │                      │────────────────────────>│
 │               │                      │  INSERT INTO insights  │
 │               │                      │                        │
 │               │  200 OK              │                        │
 │               │<─────────────────────│                        │
 │               │  {                   │                        │
 │               │    category: "echo", │                        │
 │               │    insight: "...",   │                        │
 │               │    confidence: "high"│                        │
 │               │    actions: [...]    │                        │
 │               │  }                   │                        │
 │               │                      │                        │
 │  Render insights                     │                        │
 │<──────────────│                      │                        │
 │  (template-driven)                   │                        │
 │               │                      │                        │
```

---

### **2.3 Component Dependency Graph**

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND COMPONENTS                         │
└─────────────────────────────────────────────────────────────────┘

App (Next.js)
 ├─ AuthProvider (JWT management)
 │   ├─ LoginPage
 │   │   ├─ MagicLinkForm
 │   │   └─ GoogleOAuthButton
 │   └─ ProtectedRoute
 │
 ├─ UploadFlow
 │   ├─ FileSelector
 │   ├─ ProgressBar
 │   └─ ParserWorkerManager ───> Web Worker (ParserWorker)
 │                                    ├─ TwitterParser
 │                                    ├─ InstagramParser
 │                                    └─ LinkedInParser
 │
 ├─ VisualizationPage
 │   ├─ GraphCanvas
 │   │   ├─ D3ForceSimulation
 │   │   ├─ ZoomControls
 │   │   └─ NodeRenderer (SVG or Canvas)
 │   ├─ FilterPanel
 │   │   ├─ CommunityFilter
 │   │   ├─ EngagementFilter
 │   │   └─ SearchBox
 │   └─ NodeDetailPanel
 │       ├─ MetricsDisplay
 │       └─ ActionButtons
 │
 ├─ InsightsDashboard
 │   ├─ InsightCard (template-rendered)
 │   │   ├─ ConfidenceBadge
 │   │   ├─ NarrativeText
 │   │   └─ ActionList
 │   ├─ InsightFilters
 │   └─ InsightRequest ───> API (/api/insights)
 │
 └─ ExportPanel
     ├─ PDFExport ───> API (/api/exports/pdf)
     ├─ SocialCardExport (client-side Canvas)
     └─ DataExport (CSV/JSON, client-side)

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                            │
└─────────────────────────────────────────────────────────────────┘

Express App
 ├─ Middleware Stack
 │   ├─ CORS
 │   ├─ Helmet (security headers)
 │   ├─ JWT Authentication
 │   ├─ Rate Limiter (Redis-backed)
 │   └─ Error Handler
 │
 ├─ Routes
 │   ├─ /api/auth
 │   │   ├─ POST /magic-link ───> AuthService.sendMagicLink
 │   │   ├─ GET /verify/:token ───> AuthService.verifyToken
 │   │   └─ GET /google/callback ───> AuthService.googleOAuth
 │   │
 │   ├─ /api/uploads
 │   │   └─ POST / ───> UploadService.handleTusUpload
 │   │
 │   ├─ /api/graphs
 │   │   ├─ POST / ───> GraphService.save
 │   │   ├─ GET /:id ───> GraphService.getById
 │   │   └─ DELETE /:id ───> GraphService.delete
 │   │
 │   ├─ /api/insights ⭐ ALGORITHM-FIRST
 │   │   └─ POST / ───> InsightEngine.generate
 │   │        ├─ GraphAnalyzer.analyze
 │   │        ├─ StatisticalProfiler.profile
 │   │        ├─ TemplateMatcher.match
 │   │        ├─ TemplateInterpolator.interpolate
 │   │        └─ ActionGenerator.generate
 │   │
 │   ├─ /api/exports
 │   │   ├─ POST /pdf ───> ExportService.generatePDF
 │   │   └─ POST /social-card ───> ExportService.generateCard
 │   │
 │   └─ /webhooks/stripe
 │       └─ POST / ───> WebhookService.handleStripeEvent
 │
 └─ Services Layer
     ├─ AuthService
     │   ├─ Depends: Prisma (User), Redis (Session), Resend (Email)
     │   └─ Methods: sendMagicLink, verifyToken, createSession
     │
     ├─ GraphService
     │   ├─ Depends: Prisma (Graph), R2 (Thumbnails)
     │   └─ Methods: save, getById, delete, listByUser
     │
     ├─ InsightEngine ⭐ CORE ALGORITHM-FIRST COMPONENT
     │   ├─ Depends: Prisma (Template, Insight), graphology, simple-statistics
     │   └─ Components:
     │       ├─ GraphAnalyzer (Louvain, betweenness, PageRank)
     │       ├─ StatisticalProfiler (percentiles, correlations)
     │       ├─ TemplateMatcher (rule-based selection)
     │       ├─ TemplateInterpolator (variable substitution)
     │       └─ ActionGenerator (conditional recommendations)
     │
     ├─ UploadService
     │   ├─ Depends: Tus-node-server, R2 (File storage)
     │   └─ Methods: handleUpload, validateFile, deleteAfterProcessing
     │
     └─ ExportService
         ├─ Depends: Puppeteer (PDF), Canvas (Social cards), Prisma (Export)
         └─ Methods: generatePDF, generateSocialCard, trackExport

┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
└─────────────────────────────────────────────────────────────────┘

Prisma Client
 ├─ UserRepository
 │   ├─ create, findByEmail, updateTier, softDelete
 │   └─ Cascade deletes: graphs, insights, subscriptions
 │
 ├─ GraphRepository
 │   ├─ create (with versioning logic)
 │   ├─ findLatestByUserAndPlatform
 │   ├─ findHistoricalVersions (for comparison)
 │   └─ softDelete (30-day retention)
 │
 ├─ TemplateRepository ⭐ ALGORITHM-FIRST
 │   ├─ findByCategory (e.g., "bridge_accounts")
 │   ├─ findByTriggerConditions (rule matching)
 │   ├─ getVariant (A/B testing)
 │   └─ trackPerformance (usage analytics)
 │
 ├─ InsightRepository
 │   ├─ create (cache generated insights)
 │   ├─ findByGraphId (retrieve cached)
 │   └─ invalidateCache (on graph update)
 │
 └─ SubscriptionRepository
     ├─ createOrUpdate (Stripe webhook sync)
     ├─ findByUserId
     └─ updateStatus (active, canceled, past_due)
```

---

## **3. Frontend Architecture**

### **3.1 Technology Stack**

```
Framework: Next.js 14 (App Router)
├─ Rationale: React framework, SSR/SSG, API routes, excellent DX
├─ Routing: File-based (app directory)
└─ Rendering: Client-side (CSR) for app, SSR for landing

UI Library: React 18
├─ Functional components only (hooks)
├─ TypeScript strict mode
└─ No class components

Styling: TailwindCSS + Framer Motion
├─ Utility-first CSS (rapid development)
├─ Animations: Framer Motion (smooth, declarative)
└─ Design system: Custom Tailwind config (colors, spacing)

State Management:
├─ Server state: TanStack Query (React Query)
│   ├─ Caching: Automatic, background refetch
│   ├─ Optimistic updates: Immediate UI feedback
│   └─ Error boundaries: Graceful degradation
├─ Client state: Zustand
│   ├─ Lightweight (< 1KB)
│   ├─ Simple API (no boilerplate)
│   └─ DevTools integration
└─ Form state: React Hook Form + Zod
    ├─ Validation: Schema-based (Zod)
    ├─ Performance: Uncontrolled components
    └─ Integration: Easy API submission

Visualization: D3.js v7 + Canvas API
├─ D3.js: Force simulation, interactions
├─ SVG: <1K nodes (crisp, interactive)
├─ Canvas: 1K-5K nodes (performance)
└─ WebGL (future): >5K nodes (Phase 3+)

Heavy Computation: Web Workers
├─ Parsers: TwitterParser, InstagramParser, LinkedInParser
├─ Graph builder: Node/edge construction
└─ Communication: postMessage API

File Handling:
├─ Upload: tus-js-client (resumable)
├─ ZIP extraction: JSZip
├─ CSV parsing: PapaParse
└─ JSON parsing: Native (fast)

Testing:
├─ Unit: Vitest (fast, modern)
├─ Component: React Testing Library
├─ E2E: Playwright (cross-browser)
└─ Visual regression: Percy or Chromatic
```

---

### **3.2 Frontend Directory Structure**

```
/frontend (Next.js app)
├─ /app (App Router)
│   ├─ layout.tsx (root layout, providers)
│   ├─ page.tsx (landing page, SSR)
│   ├─ /auth
│   │   ├─ login/page.tsx (magic link + Google OAuth)
│   │   └─ verify/[token]/page.tsx (magic link verification)
│   ├─ /dashboard
│   │   ├─ layout.tsx (authenticated layout)
│   │   ├─ page.tsx (overview, recent graphs)
│   │   └─ /upload
│   │       └─ page.tsx (file upload flow)
│   ├─ /visualize/[graphId]
│   │   └─ page.tsx (graph visualization + insights)
│   └─ /settings
│       ├─ page.tsx (account settings)
│       └─ /billing
│           └─ page.tsx (subscription management)
│
├─ /components (React components, organized by feature)
│   ├─ /auth
│   │   ├─ MagicLinkForm.tsx
│   │   ├─ GoogleOAuthButton.tsx
│   │   └─ ProtectedRoute.tsx
│   ├─ /upload
│   │   ├─ FileSelector.tsx
│   │   ├─ ProgressBar.tsx
│   │   └─ ParserStatus.tsx
│   ├─ /visualization
│   │   ├─ GraphCanvas.tsx (main visualization)
│   │   ├─ D3ForceSimulation.tsx (force layout logic)
│   │   ├─ ZoomControls.tsx (zoom in/out, reset)
│   │   ├─ FilterPanel.tsx (filter by community, engagement)
│   │   └─ NodeDetailPanel.tsx (slide-out details)
│   ├─ /insights
│   │   ├─ InsightCard.tsx (template-rendered insight)
│   │   ├─ ConfidenceBadge.tsx (high/medium/low)
│   │   ├─ ActionList.tsx (suggested actions)
│   │   └─ InsightFilters.tsx (filter by type)
│   ├─ /export
│   │   ├─ PDFExportButton.tsx
│   │   ├─ SocialCardGenerator.tsx
│   │   └─ DataExportMenu.tsx
│   └─ /ui (reusable UI components)
│       ├─ Button.tsx
│       ├─ Input.tsx
│       ├─ Modal.tsx
│       ├─ Spinner.tsx
│       └─ Badge.tsx
│
├─ /workers (Web Workers for heavy computation)
│   ├─ parser.worker.ts
│   │   ├─ TwitterParser class
│   │   ├─ InstagramParser class
│   │   ├─ LinkedInParser class
│   │   └─ Version detector
│   └─ graph-builder.worker.ts
│       ├─ Node deduplication
│       ├─ Edge construction
│       └─ Basic metrics calculation
│
├─ /lib (business logic, utilities)
│   ├─ /api-client (API communication)
│   │   ├─ auth.ts (login, logout, session)
│   │   ├─ graphs.ts (CRUD graphs)
│   │   ├─ insights.ts (request insights)
│   │   └─ exports.ts (PDF, social cards)
│   ├─ /parsers (parser logic, called by worker)
│   │   ├─ twitter.ts
│   │   ├─ instagram.ts
│   │   └─ linkedin.ts
│   ├─ /graph (graph manipulation utilities)
│   │   ├─ builder.ts (construct from parsed data)
│   │   ├─ metrics.ts (basic metrics: degree, density)
│   │   └─ anonymize.ts (hash IDs, remove PII)
│   ├─ /visualization (D3 helpers)
│   │   ├─ force-config.ts (force simulation params)
│   │   ├─ color-scheme.ts (community colors)
│   │   └─ layout-helpers.ts (positioning, scaling)
│   └─ /utils
│       ├─ validation.ts (Zod schemas)
│       ├─ formatting.ts (dates, numbers)
│       └─ error-handling.ts (standardized errors)
│
├─ /hooks (custom React hooks)
│   ├─ useAuth.ts (authentication state)
│   ├─ useUpload.ts (file upload with progress)
│   ├─ useGraph.ts (fetch/cache graph data)
│   ├─ useInsights.ts (fetch/cache insights)
│   └─ useWebWorker.ts (generic worker hook)
│
├─ /stores (Zustand stores)
│   ├─ authStore.ts (user, token, tier)
│   ├─ uploadStore.ts (upload state, progress)
│   └─ visualizationStore.ts (filters, selected nodes)
│
├─ /styles
│   ├─ globals.css (Tailwind directives)
│   └─ animations.css (custom animations)
│
├─ /types
│   ├─ api.ts (API request/response types)
│   ├─ graph.ts (Graph, Node, Edge types)
│   ├─ insight.ts (Insight, Template types)
│   └─ user.ts (User, Subscription types)
│
├─ /config
│   ├─ constants.ts (API URLs, limits)
│   └─ features.ts (feature flags)
│
├─ tailwind.config.js (Tailwind customization)
├─ tsconfig.json (TypeScript config)
├─ next.config.js (Next.js config)
└─ package.json
```

**Design Principles:**
- **Flat hierarchy**: Max 3 levels deep (easy navigation)
- **Feature-based**: Components grouped by feature, not type
- **Separation of concerns**: UI (components) ← Logic (lib) ← Data (stores)
- **Type safety**: TypeScript strict mode, explicit types
- **Testability**: Pure functions in /lib, hooks extracted

---

### **3.3 Client-Side Parser Architecture (80% Rule)**

**Web Worker Implementation:**

```typescript
// /workers/parser.worker.ts

import { TwitterParser } from '@/lib/parsers/twitter';
import { InstagramParser } from '@/lib/parsers/instagram';
import { LinkedInParser } from '@/lib/parsers/linkedin';

interface ParseMessage {
  type: 'PARSE';
  file: File;
  platform: 'twitter' | 'instagram' | 'linkedin';
}

interface ProgressMessage {
  type: 'PROGRESS';
  progress: number;
  stage: string;
}

interface ResultMessage {
  type: 'RESULT';
  graph: Graph;
}

interface ErrorMessage {
  type: 'ERROR';
  error: string;
}

// Worker message handler
self.onmessage = async (e: MessageEvent<ParseMessage>) => {
  const { file, platform } = e.data;

  try {
    // 1. Detect parser version
    postProgress(0, 'Detecting format...');
    const version = await detectVersion(file, platform);

    // 2. Select appropriate parser
    let parser;
    if (platform === 'twitter') {
      parser = new TwitterParser(version);
    } else if (platform === 'instagram') {
      parser = new InstagramParser(version);
    } else {
      parser = new LinkedInParser();
    }

    // 3. Parse file (streaming for large files)
    postProgress(10, 'Extracting files...');
    const parsedData = await parser.parse(file, (progress) => {
      postProgress(10 + progress * 0.6, parser.currentStage);
    });

    // 4. Build graph
    postProgress(70, 'Building graph...');
    const graph = buildGraph(parsedData);

    // 5. Calculate basic metrics
    postProgress(90, 'Calculating metrics...');
    graph.metrics = calculateBasicMetrics(graph);

    // 6. Return result
    postProgress(100, 'Complete!');
    self.postMessage({ type: 'RESULT', graph } as ResultMessage);

  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    } as ErrorMessage);
  }
};

function postProgress(progress: number, stage: string) {
  self.postMessage({
    type: 'PROGRESS',
    progress,
    stage
  } as ProgressMessage);
}

// Version detection logic
async function detectVersion(file: File, platform: string): Promise<string> {
  const zip = await JSZip.loadAsync(file);

  if (platform === 'twitter') {
    // Check for multi-part tweets (new format)
    const hasMultiPart = zip.file(/tweets-part\d+\.js/).length > 0;
    return hasMultiPart ? 'v2' : 'v1';
  }

  if (platform === 'instagram') {
    // Check for new followers_1.json format
    const hasNewFormat = zip.file('followers_1.json') !== null;
    return hasNewFormat ? 'v3' : 'v2';
  }

  return 'v1'; // LinkedIn has stable format
}
```

**Main Thread Usage:**

```typescript
// /hooks/useWebWorker.ts

export function useParserWorker() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [result, setResult] = useState<Graph | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize worker
    const w = new Worker(new URL('../workers/parser.worker.ts', import.meta.url));

    w.onmessage = (e) => {
      if (e.data.type === 'PROGRESS') {
        setProgress(e.data.progress);
        setStage(e.data.stage);
      } else if (e.data.type === 'RESULT') {
        setResult(e.data.graph);
      } else if (e.data.type === 'ERROR') {
        setError(e.data.error);
      }
    };

    setWorker(w);

    return () => w.terminate();
  }, []);

  const parse = (file: File, platform: string) => {
    if (!worker) throw new Error('Worker not initialized');

    worker.postMessage({ type: 'PARSE', file, platform });
  };

  return { parse, progress, stage, result, error };
}
```

---

### **3.4 Mobile-Aware & Internationalization Architecture**

#### **3.4.1 Responsive Design Implementation**

**Design Constraints (SRS-C7.1, SRS-C7.2 Implementation):**

```typescript
// tailwind.config.js - Breakpoint Strategy

module.exports = {
  theme: {
    screens: {
      // Mobile-first breakpoints (SRS requirement)
      'sm': '640px',    // Large phones
      'md': '768px',    // Tablets (iPad minimum)
      'lg': '1024px',   // Desktop
      'xl': '1440px',   // Large desktop
    },
    extend: {
      spacing: {
        // Touch target minimum: 44px (iOS) / 48px (Material)
        'touch-min': '44px',
        'touch-recommended': '48px',
      },
      fontSize: {
        // Readable without zoom on mobile
        'body': ['16px', { lineHeight: '1.5' }],
      }
    }
  }
}
```

**Touch-First Interaction Patterns:**

```typescript
// /components/ui/Button.tsx - Touch-Accessible Component

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick: () => void;
}

export function Button({ size = 'md', variant, children, onClick }: ButtonProps) {
  // Minimum touch target enforcement
  const sizeClasses = {
    sm: 'min-h-[44px] px-3',     // Meets iOS minimum
    md: 'min-h-[48px] px-4',     // Recommended size
    lg: 'min-h-[56px] px-6'      // Comfortable target
  };

  return (
    <button
      className={`${sizeClasses[size]} rounded-lg transition-colors
        // Touch feedback (no hover dependency)
        active:scale-95 active:opacity-90
        // Focus visible for keyboard navigation
        focus-visible:ring-2 focus-visible:ring-offset-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**Graph Visualization Touch Support:**

```typescript
// /components/visualization/GraphCanvas.tsx - Touch Gesture Handling

import { useGesture } from '@use-gesture/react';

export function GraphCanvas({ graph }: GraphCanvasProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Support both mouse and touch gestures
  const bind = useGesture({
    // Pan gesture (drag)
    onDrag: ({ offset: [x, y] }) => {
      setTransform(prev => ({ ...prev, x, y }));
    },
    // Pinch gesture (zoom on mobile)
    onPinch: ({ offset: [scale] }) => {
      setTransform(prev => ({ ...prev, scale: Math.max(0.5, Math.min(3, scale)) }));
    },
    // Wheel (zoom on desktop)
    onWheel: ({ delta: [, dy] }) => {
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale - dy * 0.001))
      }));
    }
  });

  return (
    <div {...bind()} className="touch-none select-none">
      {/* Canvas rendering with transform */}
      <svg
        viewBox={`${-transform.x} ${-transform.y} ${width / transform.scale} ${height / transform.scale}`}
        className="w-full h-full"
      >
        {/* Graph nodes and edges */}
      </svg>
    </div>
  );
}
```

**Progressive Enhancement Strategy:**

```typescript
// /lib/utils/device-detection.ts

export function getDeviceCapabilities() {
  // Detect device capabilities
  const capabilities = {
    // RAM estimation (Chrome only)
    memory: (navigator as any).deviceMemory || 4, // GB, default 4

    // CPU cores
    cores: navigator.hardwareConcurrency || 4,

    // Touch support
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,

    // Screen size category
    screenCategory: window.innerWidth < 768 ? 'mobile' :
                   window.innerWidth < 1024 ? 'tablet' : 'desktop',

    // Network speed (experimental)
    connection: (navigator as any).connection?.effectiveType || '4g'
  };

  return capabilities;
}

export function getRecommendedSettings(capabilities: ReturnType<typeof getDeviceCapabilities>) {
  // Tablet considerations (SRS-C7.1)
  if (capabilities.screenCategory === 'tablet') {
    return {
      maxNodes: 2000,              // Limit for smooth rendering
      enableAnimations: true,      // Tablets can handle animations
      renderMode: 'svg',          // SVG works well on tablets
      enableTooltips: true,       // Touch-friendly tooltips
      forceSimulation: {
        alpha: 0.3,              // Lighter simulation
        iterations: 100          // Fewer iterations
      }
    };
  }

  // Desktop (full capabilities)
  if (capabilities.screenCategory === 'desktop') {
    return {
      maxNodes: 5000,
      enableAnimations: true,
      renderMode: 'canvas',        // Canvas for performance
      enableTooltips: true,
      forceSimulation: {
        alpha: 1.0,
        iterations: 300
      }
    };
  }

  // Mobile (conservative settings)
  return {
    maxNodes: 500,                 // Very limited
    enableAnimations: false,       // Battery saving
    renderMode: 'svg',            // Better compatibility
    enableTooltips: false,        // Avoid hover dependency
    forceSimulation: {
      alpha: 0.1,
      iterations: 50
    }
  };
}
```

**Responsive Layout Examples:**

```tsx
// /app/dashboard/page.tsx - Mobile-Aware Dashboard

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Stack vertically on mobile, grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Networks" value={5} />
        <StatCard title="Total Nodes" value={1234} />
        <StatCard title="Insights" value={42} />
      </div>

      {/* Full-width on mobile, sidebar on desktop */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        <RecentGraphs />
        <ActivityFeed className="hidden lg:block" />
      </div>
    </div>
  );
}
```

---

#### **3.4.2 Internationalization (i18n) Architecture**

**Implementation (SRS-T11.5.1, SRS-T11.5.2):**

```bash
# Install dependencies
npm install next-i18next i18next react-i18next
```

**Configuration:**

```javascript
// next-i18next.config.js

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], // Phase 1: English only
    // Future locales (Phase 3+): ['en', 'es', 'fr', 'pt-BR', 'ja', 'de']
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development'
};
```

**String Externalization:**

```json
// /public/locales/en/common.json

{
  "nav": {
    "dashboard": "Dashboard",
    "upload": "Upload Data",
    "insights": "Insights",
    "settings": "Settings"
  },
  "upload": {
    "title": "Upload Your Network Data",
    "description": "Drag and drop your ZIP file here, or click to browse",
    "button": "Select File",
    "progress": "Uploading... {{percent}}%",
    "success": "Upload successful! Processing your network...",
    "error": "Upload failed: {{message}}"
  },
  "insights": {
    "community": {
      "title": "Community Structure",
      "description": "Your network has {{count}} distinct communities",
      "recommendation": "Focus on {{communityName}} for maximum reach"
    },
    "bridge": {
      "title": "Bridge Accounts",
      "description": "{{accountName}} connects {{count}} communities",
      "action": "Consider collaborating with this account"
    }
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email",
    "fileSize": "File size must be less than {{maxSize}}MB",
    "fileType": "Only ZIP files are accepted"
  }
}
```

**Usage in Components:**

```typescript
// /components/upload/FileUploader.tsx

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export function FileUploader() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h2>{t('upload.title')}</h2>
      <p>{t('upload.description')}</p>
      <button>{t('upload.button')}</button>
    </div>
  );
}

// Server-side translation loading (Next.js App Router)
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
```

**Locale-Aware Formatting:**

```typescript
// /lib/utils/formatting.ts

export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
  // en-US: 1,234.56
  // de-DE: 1.234,56
  // fr-FR: 1 234,56
}

export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
  // en-US: "December 23, 2025"
  // de-DE: "23. Dezember 2025"
  // ja-JP: "2025年12月23日"
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
  // en-US: "$9.99"
  // de-DE: "9,99 €"
  // ja-JP: "¥999"
}

export function formatRelativeTime(date: Date, locale = 'en-US'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffInSeconds = (date.getTime() - Date.now()) / 1000;

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  }
  if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  }
  if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  }
  return rtf.format(Math.round(diffInSeconds / 86400), 'day');
  // en-US: "2 hours ago"
  // de-DE: "vor 2 Stunden"
  // ja-JP: "2時間前"
}
```

**RTL Support (CSS Logical Properties):**

```css
/* Traditional approach (hardcoded direction) */
.card {
  margin-left: 1rem;    /* Breaks in RTL languages */
  padding-right: 2rem;  /* Breaks in RTL languages */
}

/* i18n-ready approach (logical properties) */
.card {
  margin-inline-start: 1rem;   /* Adapts to text direction */
  padding-inline-end: 2rem;    /* Adapts to text direction */
}
```

**Language Switcher Component (Future):**

```typescript
// /components/settings/LanguageSwitcher.tsx

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    // Future (Phase 3+):
    // { code: 'es', name: 'Español', flag: '🇪🇸' },
    // { code: 'fr', name: 'Français', flag: '🇫🇷' },
    // { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    // { code: 'ja', name: '日本語', flag: '🇯🇵' },
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <select
      value={router.locale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

**Locale Detection Strategy:**

```typescript
// /lib/utils/locale-detection.ts

export function detectUserLocale(): string {
  // Priority 1: User preference (logged in)
  const userPreference = getUserPreferenceFromDatabase();
  if (userPreference) return userPreference;

  // Priority 2: Browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    // Map browser language to supported locale
    const supportedLocales = ['en', 'es', 'fr', 'pt-BR', 'ja', 'de'];
    const match = supportedLocales.find(locale => browserLang.startsWith(locale.split('-')[0]));
    if (match) return match;
  }

  // Priority 3: Geolocation (Cloudflare header)
  const country = getCloudflareCountryHeader();
  const countryLocaleMap: Record<string, string> = {
    'US': 'en', 'GB': 'en', 'CA': 'en',
    'ES': 'es', 'MX': 'es', 'AR': 'es',
    'FR': 'fr', 'BE': 'fr',
    'BR': 'pt-BR',
    'JP': 'ja',
    'DE': 'de', 'AT': 'de', 'CH': 'de'
  };
  if (country && countryLocaleMap[country]) {
    return countryLocaleMap[country];
  }

  // Fallback: English
  return 'en';
}
```

**Translation Workflow (Phase 3+):**

```bash
# 1. Extract translatable strings
npm run i18n:extract

# 2. Upload to translation service (e.g., Lokalise, Crowdin)
npm run i18n:upload

# 3. Translators work on platform

# 4. Download translated strings
npm run i18n:download

# 5. Commit and deploy
git add public/locales/
git commit -m "Add Spanish translations"
git push
```

**CI/CD Validation:**

```yaml
# .github/workflows/i18n-check.yml

name: i18n Validation
on: [pull_request]

jobs:
  check-hardcoded-strings:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for hardcoded strings in JSX
        run: |
          # Fail if any JSX contains hardcoded English text
          if grep -r ">[A-Z][a-z].*</" app/ components/; then
            echo "Error: Hardcoded strings found in JSX. Use t() function."
            exit 1
          fi

      - name: Validate translation keys
        run: npm run i18n:validate
        # Ensures all t() keys exist in en/common.json
```

**Phase 1 Acceptance:**
- ✅ All UI strings use `t()` function (zero hardcoded text)
- ✅ Numbers/dates formatted with `Intl` API
- ✅ CSS uses logical properties (RTL-ready)
- ✅ Language switcher component exists (even if only English)
- ✅ CI/CD fails on hardcoded strings

---

## **4. Backend Architecture**

### **4.1 Technology Stack**

```
Runtime: Node.js 20 (LTS)
├─ Rationale: JavaScript/TypeScript ecosystem, async I/O, wide support
├─ Performance: V8 engine, event loop (non-blocking)
└─ Ecosystem: npm (largest package registry)

Framework: Express.js + TypeScript
├─ Express: Minimalist, flexible, battle-tested
├─ TypeScript: Type safety, better DX, easier refactoring
└─ Middleware: Composable (CORS, Helmet, JWT, rate limiting)

Database: PostgreSQL 15
├─ Rationale: Relational data, ACID guarantees, JSONB support
├─ ORM: Prisma (type-safe, migrations, code generation)
└─ Connection pooling: pg-pool (efficient connections)

Cache + Session: Redis
├─ Session storage: JWT invalidation, 7-day TTL
├─ Caching: Graph metrics (1-hour), insights (15-min)
├─ Rate limiting: Sliding window counters
└─ Job queue: Bull (background jobs - exports, emails)

File Storage: Cloudflare R2
├─ S3-compatible API (easy migration)
├─ No egress fees (cost-effective)
└─ Lifecycle policies (auto-delete after TTL)

Authentication:
├─ Magic link: Crypto.randomBytes, Redis storage
├─ Google OAuth: Passport.js strategy
└─ Session: JWT (httpOnly cookie, Secure, SameSite=Lax)

Background Jobs: Bull (Redis-based queue)
├─ PDF generation (Puppeteer, CPU-intensive)
├─ Email sending (Resend API)
└─ File cleanup (delete expired uploads/exports)

Monitoring:
├─ Errors: Sentry (real-time error tracking)
├─ Performance: Sentry Performance or Datadog
├─ Analytics: PostHog (privacy-friendly)
└─ Logs: Structured JSON (Winston or Pino)
```

---

### **4.2 Backend Directory Structure**

```
/backend (Node.js + Express + TypeScript)
├─ /src
│   ├─ index.ts (entry point, server initialization)
│   ├─ app.ts (Express app, middleware stack)
│   │
│   ├─ /routes (API endpoints)
│   │   ├─ auth.routes.ts (POST /magic-link, GET /verify)
│   │   ├─ graphs.routes.ts (CRUD graphs)
│   │   ├─ insights.routes.ts ⭐ (POST /insights - algorithm-first)
│   │   ├─ exports.routes.ts (PDF, social cards)
│   │   └─ webhooks.routes.ts (Stripe)
│   │
│   ├─ /middleware
│   │   ├─ auth.middleware.ts (JWT verification)
│   │   ├─ feature-gate.middleware.ts (tier-based access)
│   │   ├─ rate-limit.middleware.ts (Redis-backed)
│   │   ├─ error-handler.middleware.ts (standardized errors)
│   │   └─ logger.middleware.ts (request logging)
│   │
│   ├─ /services (business logic)
│   │   ├─ AuthService.ts
│   │   │   ├─ sendMagicLink(email)
│   │   │   ├─ verifyToken(token)
│   │   │   ├─ googleOAuth(code)
│   │   │   └─ createSession(user)
│   │   │
│   │   ├─ GraphService.ts
│   │   │   ├─ save(userId, graphData)
│   │   │   ├─ getById(graphId)
│   │   │   ├─ delete(graphId)
│   │   │   └─ listByUser(userId)
│   │   │
│   │   ├─ InsightEngine.ts ⭐ ALGORITHM-FIRST CORE
│   │   │   ├─ generate(graphId, types[])
│   │   │   │   ├─ GraphAnalyzer.analyze()
│   │   │   │   ├─ StatisticalProfiler.profile()
│   │   │   │   ├─ TemplateMatcher.match()
│   │   │   │   ├─ TemplateInterpolator.interpolate()
│   │   │   │   └─ ActionGenerator.generate()
│   │   │   └─ Components:
│   │   │       ├─ /graph-analyzer
│   │   │       │   ├─ LouvainCommunityDetector.ts
│   │   │       │   ├─ BetweennessCentrality.ts
│   │   │       │   ├─ PageRankCalculator.ts
│   │   │       │   └─ JaccardSimilarity.ts
│   │   │       ├─ /statistical-profiler
│   │   │       │   ├─ EngagementAnalyzer.ts
│   │   │       │   ├─ DistributionCalculator.ts
│   │   │       │   └─ EchoScoreCalculator.ts
│   │   │       ├─ /template-matcher
│   │   │       │   ├─ RuleEngine.ts (IF-THEN logic)
│   │   │       │   ├─ ConfidenceCalculator.ts
│   │   │       │   └─ TemplateSelector.ts
│   │   │       ├─ /template-interpolator
│   │   │       │   ├─ VariableSubstitutor.ts
│   │   │       │   ├─ VariantSelector.ts (A/B testing)
│   │   │       │   └─ MarkdownRenderer.ts
│   │   │       └─ /action-generator
│   │   │           ├─ PrioritizationEngine.ts
│   │   │           ├─ ContextEnricher.ts
│   │   │           └─ JSONFormatter.ts
│   │   │
│   │   ├─ UploadService.ts
│   │   │   ├─ handleTusUpload(file)
│   │   │   ├─ validateFile(file)
│   │   │   └─ deleteTemporary(uploadId)
│   │   │
│   │   └─ ExportService.ts
│   │       ├─ generatePDF(graphId)
│   │       ├─ generateSocialCard(graphId, template)
│   │       └─ trackExport(userId, type)
│   │
│   ├─ /repositories (data access)
│   │   ├─ UserRepository.ts (Prisma client wrapper)
│   │   ├─ GraphRepository.ts (versioning, lifecycle)
│   │   ├─ TemplateRepository.ts ⭐ (fetch, A/B variants)
│   │   ├─ InsightRepository.ts (cache, invalidate)
│   │   └─ SubscriptionRepository.ts (Stripe sync)
│   │
│   ├─ /models (domain models, business entities)
│   │   ├─ User.ts
│   │   ├─ Graph.ts (versioning logic)
│   │   ├─ Insight.ts
│   │   ├─ Template.ts ⭐
│   │   └─ Subscription.ts
│   │
│   ├─ /utils
│   │   ├─ logger.ts (Winston or Pino)
│   │   ├─ crypto.ts (token generation, hashing)
│   │   ├─ validation.ts (Zod schemas, reusable)
│   │   └─ error.ts (custom error classes)
│   │
│   ├─ /types
│   │   ├─ express.d.ts (extend Express types)
│   │   ├─ api.ts (request/response types)
│   │   └─ domain.ts (domain entity types)
│   │
│   └─ /config
│       ├─ database.ts (Prisma client)
│       ├─ redis.ts (Redis client)
│       ├─ storage.ts (R2 client)
│       └─ env.ts (environment variables, validated)
│
├─ /prisma
│   ├─ schema.prisma (database schema)
│   ├─ /migrations (auto-generated)
│   └─ seed.ts (seed templates, test data)
│
├─ /tests
│   ├─ /unit
│   │   ├─ services/ (service unit tests)
│   │   └─ utils/ (utility unit tests)
│   ├─ /integration
│   │   └─ routes/ (API endpoint tests)
│   └─ /fixtures
│       └─ test-data.ts (mock data)
│
├─ tsconfig.json (TypeScript config)
├─ package.json
└─ .env.example (environment variables template)
```

**Design Principles:**
- **Layered architecture**: Routes → Services → Repositories → Database
- **Single responsibility**: Each file has one clear purpose
- **Dependency injection**: Services receive dependencies (testability)
- **Type safety**: TypeScript strict mode, Prisma-generated types
- **Error handling**: Custom error classes, standardized responses

---

## **5. Insight Engine - Algorithm-First Design**

### **5.1 Architecture Overview**

The **Insight Engine** is the core intelligence component of Visual Social Graph. It replaces external AI APIs with a sophisticated, deterministic system built on graph algorithms and template-driven narratives.

**Design Philosophy:**
```
Traditional AI-Dependent Approach:
User Data → Graph Analysis → LLM API → "Smart" Text → User
                               ↑
                          Black box
                          Expensive ($0.01-0.05/request)
                          Slow (5-15s)
                          Unexplainable

Algorithm-First Approach (Visual Social Graph):
User Data → Graph Algorithms → Template Matcher → Interpolator → User
                ↑                    ↑                  ↑
          Deterministic        Rule-based         Variables
          Fast (<500ms)        Explainable        substitution
          Free ($0/request)    Transparent        Natural language
```

**Key Components:**
1. **Graph Analyzer**: Applies classical graph algorithms (Louvain, betweenness, PageRank)
2. **Statistical Profiler**: Calculates distributions, correlations, significance
3. **Template Matcher**: Rule-based selection (IF metric > threshold → template)
4. **Template Interpolator**: Variable substitution ({{count}} → "3")
5. **Action Generator**: Conditional recommendations (prioritized, contextual)

---

### **5.2 Component Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        INSIGHT ENGINE                            │
│                    (Algorithm-First Core)                        │
└─────────────────────────────────────────────────────────────────┘

INPUT                    PROCESSING PIPELINE                   OUTPUT
  │                               │                               │
  │                               │                               │
  ▼                               ▼                               ▼
┌────────────┐          ┌──────────────────┐          ┌──────────────┐
│ Graph Data │─────────>│  GRAPH ANALYZER  │─────────>│   Metrics    │
│ (JSONB)    │          │                  │          │   Object     │
│            │          │ ├─ Louvain       │          │ {            │
│ {          │          │ │  (communities) │          │  communities:│
│   nodes:[],│          │ ├─ Betweenness   │          │    [...]     │
│   edges:[] │          │ │  (bridges)     │          │  bridges:    │
│ }          │          │ ├─ PageRank      │          │    [...]     │
└────────────┘          │ │  (influence)   │          │  influence:  │
                        │ └─ Jaccard       │          │    {...}     │
                        │    (similarity)  │          │ }            │
                        └──────────────────┘          └──────────────┘
                                 │                            │
                                 │                            │
                                 ▼                            ▼
                        ┌──────────────────┐          ┌──────────────┐
                        │STATISTICAL       │─────────>│  Statistical │
                        │  PROFILER        │          │   Profile    │
                        │                  │          │              │
                        │ ├─ Percentiles   │          │ {            │
                        │ │  (engagement)  │          │  p25: 0.02   │
                        │ ├─ Distributions │          │  p50: 0.15   │
                        │ │  (outliers)    │          │  p75: 0.45   │
                        │ ├─ Correlations  │          │  echoScore:  │
                        │ │  (patterns)    │          │    0.67      │
                        │ └─ Echo score    │          │ }            │
                        │    (homogeneity) │          │              │
                        └──────────────────┘          └──────────────┘
                                 │                            │
                                 │                            │
                                 ▼                            ▼
                        ┌──────────────────┐          ┌──────────────┐
                        │  TEMPLATE        │◄─────────│  Template    │
                        │   MATCHER        │          │  Database    │
                        │                  │          │  (Postgres)  │
                        │ Rule Engine:     │          │              │
                        │ ├─IF echoScore>0.│          │ SELECT *     │
                        │ │  THEN category:│          │ FROM         │
                        │ │  "echo_chamber"│          │ templates    │
                        │ ├─IF bridges.len>│          │ WHERE        │
                        │ │  THEN category:│          │ category=... │
                        │ │  "bridge_accts"│          │              │
                        │ └─Confidence:    │          └──────────────┘
                        │   High/Med/Low   │                 │
                        └──────────────────┘                 │
                                 │                           │
                                 ├───────────────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   TEMPLATE       │
                        │ INTERPOLATOR     │
                        │                  │
                        │ Input:           │
                        │ "You have {{count│
                        │  bridge accounts │
                        │  connecting      │
                        │  {{comm1}} to    │
                        │  {{comm2}}..."   │
                        │                  │
                        │ Variables:       │
                        │ { count: 3,      │
                        │   comm1: "Tech", │
                        │   comm2: "Design"│
                        │ }                │
                        │                  │
                        │ Output:          │
                        │ "You have 3      │
                        │  bridge accounts │
                        │  connecting Tech │
                        │  to Design..."   │
                        └──────────────────┘
                                 │
                                 │
                                 ▼
                        ┌──────────────────┐
                        │    ACTION        │
                        │   GENERATOR      │
                        │                  │
                        │ Conditional      │
                        │ Recommendations: │
                        │ ├─IF bridge_count│
                        │ │  >0:           │
                        │ │  "Engage with  │
                        │ │   @alice..."   │
                        │ ├─IF echoScore>0.│
                        │ │  "Follow 5     │
                        │ │   diverse..."  │
                        │ └─Prioritize by: │
                        │   impact estimate│
                        └──────────────────┘
                                 │
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  FINAL INSIGHT   │
                        │     (JSON)       │
                        │                  │
                        │ {                │
                        │  category:       │
                        │    "bridge_accts"│
                        │  insight:        │
                        │    "You have...", │
                        │  confidence:     │
                        │    "high",       │
                        │  actions: [      │
                        │    {             │
                        │      type:       │
                        │        "engage", │
                        │      target:     │
                        │        "@alice"  │
                        │    }             │
                        │  ]               │
                        │ }                │
                        └──────────────────┘
```

---

### **5.3 Graph Analyzer Implementation**

**Interface:**
```typescript
// /src/services/insight-engine/graph-analyzer/IGraphAnalyzer.ts

export interface GraphMetrics {
  // Community detection
  communities: Community[];
  modularity: number; // Quality of community structure (0-1)

  // Bridge identification
  bridges: BridgeNode[];
  bridgeCount: number;

  // Influence measurement
  influencers: InfluencerNode[];

  // Similarity analysis
  clusterCoefficient: number; // Network density (0-1)
  echoScore: number; // Homogeneity (0-1, higher = more echo chamber)
}

export interface Community {
  id: string;
  size: number;
  nodes: string[]; // Node IDs
  label?: string; // Optional human-readable label
}

export interface BridgeNode {
  nodeId: string;
  betweennessCentrality: number; // How often node is on shortest paths
  communitiesBridged: string[]; // Which communities it connects
  impact: number; // Estimated reach increase if engaged
}

export interface InfluencerNode {
  nodeId: string;
  pageRank: number; // Influence score (0-1)
  degree: number; // Direct connections
  reach: number; // Estimated total audience
}

export interface IGraphAnalyzer {
  analyze(graph: Graph): GraphMetrics;
}
```

**Implementation:**
```typescript
// /src/services/insight-engine/graph-analyzer/GraphAnalyzer.ts

import { Graph } from 'graphology';
import louvain from 'graphology-communities-louvain';
import { betweennessCentrality } from 'graphology-metrics/centrality/betweenness';
import pagerank from 'graphology-metrics/centrality/pagerank';
import { density } from 'graphology-metrics/graph/density';

export class GraphAnalyzer implements IGraphAnalyzer {
  analyze(graphData: GraphData): GraphMetrics {
    // 1. Convert to graphology format
    const graph = this.buildGraphologyGraph(graphData);

    // 2. Community detection (Louvain algorithm)
    const communities = this.detectCommunities(graph);
    const modularity = louvain.detailed(graph).modularity;

    // 3. Bridge identification (betweenness centrality)
    const bridges = this.identifyBridges(graph, communities);

    // 4. Influence measurement (PageRank)
    const influencers = this.identifyInfluencers(graph);

    // 5. Echo chamber detection (homophily analysis)
    const clusterCoefficient = density(graph);
    const echoScore = this.calculateEchoScore(graph, communities);

    return {
      communities,
      modularity,
      bridges,
      bridgeCount: bridges.length,
      influencers,
      clusterCoefficient,
      echoScore
    };
  }

  private buildGraphologyGraph(data: GraphData): Graph {
    const graph = new Graph({ type: 'undirected' });

    // Add nodes
    data.nodes.forEach(node => {
      graph.addNode(node.id, { label: node.label, weight: node.weight });
    });

    // Add edges
    data.edges.forEach(edge => {
      graph.addEdge(edge.source, edge.target, { weight: edge.weight });
    });

    return graph;
  }

  private detectCommunities(graph: Graph): Community[] {
    // Louvain algorithm (modularity optimization)
    const assignments = louvain(graph);

    // Group nodes by community
    const communityMap = new Map<string, string[]>();
    graph.forEachNode((node, attrs) => {
      const communityId = assignments[node];
      if (!communityMap.has(communityId)) {
        communityMap.set(communityId, []);
      }
      communityMap.get(communityId)!.push(node);
    });

    // Convert to Community objects
    return Array.from(communityMap.entries()).map(([id, nodes]) => ({
      id,
      size: nodes.length,
      nodes,
      label: this.inferCommunityLabel(graph, nodes) // Optional labeling
    }));
  }

  private identifyBridges(
    graph: Graph,
    communities: Community[]
  ): BridgeNode[] {
    // Calculate betweenness centrality for all nodes
    const betweenness = betweennessCentrality(graph);

    // Filter nodes with high betweenness (top 5%)
    const threshold = this.calculatePercentile(
      Object.values(betweenness),
      95
    );

    const bridges: BridgeNode[] = [];

    graph.forEachNode((node) => {
      const score = betweenness[node];
      if (score >= threshold) {
        // Determine which communities this node bridges
        const neighbors = graph.neighbors(node);
        const neighborCommunities = new Set(
          neighbors.map(n => this.getCommunityId(n, communities))
        );

        // Only count as bridge if connects 2+ communities
        if (neighborCommunities.size >= 2) {
          bridges.push({
            nodeId: node,
            betweennessCentrality: score,
            communitiesBridged: Array.from(neighborCommunities),
            impact: this.estimateImpact(node, graph, communities)
          });
        }
      }
    });

    // Sort by betweenness (descending)
    return bridges.sort((a, b) =>
      b.betweennessCentrality - a.betweennessCentrality
    );
  }

  private identifyInfluencers(graph: Graph): InfluencerNode[] {
    // Calculate PageRank (influence score)
    const ranks = pagerank(graph);

    // Get top 10 nodes by PageRank
    const sorted = Object.entries(ranks)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return sorted.map(([nodeId, pageRank]) => ({
      nodeId,
      pageRank,
      degree: graph.degree(nodeId),
      reach: this.estimateReach(nodeId, graph)
    }));
  }

  private calculateEchoScore(
    graph: Graph,
    communities: Community[]
  ): number {
    // Measure homophily: What % of connections are within same community?
    let intraEdges = 0;
    let totalEdges = 0;

    graph.forEachEdge((edge, attrs, source, target) => {
      totalEdges++;
      const sourceCommunity = this.getCommunityId(source, communities);
      const targetCommunity = this.getCommunityId(target, communities);
      if (sourceCommunity === targetCommunity) {
        intraEdges++;
      }
    });

    return totalEdges > 0 ? intraEdges / totalEdges : 0;
  }

  private getCommunityId(nodeId: string, communities: Community[]): string {
    return communities.find(c => c.nodes.includes(nodeId))?.id || 'unknown';
  }

  private estimateImpact(
    nodeId: string,
    graph: Graph,
    communities: Community[]
  ): number {
    // Estimate reach increase if user engages with this bridge node
    const bridgedCommunities = this.getNeighborCommunities(
      nodeId,
      graph,
      communities
    );

    // Sum sizes of bridged communities (potential new reach)
    return bridgedCommunities.reduce((sum, communityId) => {
      const community = communities.find(c => c.id === communityId);
      return sum + (community?.size || 0);
    }, 0);
  }

  private estimateReach(nodeId: string, graph: Graph): number {
    // Simple 2-hop reach estimation
    const firstHop = new Set(graph.neighbors(nodeId));
    const secondHop = new Set<string>();

    firstHop.forEach(neighbor => {
      graph.neighbors(neighbor).forEach(n => secondHop.add(n));
    });

    return firstHop.size + secondHop.size;
  }

  // Helper: Infer community label from most common keywords in bios
  private inferCommunityLabel(graph: Graph, nodes: string[]): string {
    // Placeholder - could analyze bio text, hashtags, etc.
    return `Community ${nodes.length}`;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private getNeighborCommunities(
    nodeId: string,
    graph: Graph,
    communities: Community[]
  ): string[] {
    const neighbors = graph.neighbors(nodeId);
    const neighborCommunities = new Set(
      neighbors.map(n => this.getCommunityId(n, communities))
    );
    return Array.from(neighborCommunities);
  }
}
```

**Key Design Decisions:**
1. **Graphology library**: Production-ready, performant, well-tested
2. **Louvain algorithm**: Best community detection (modularity optimization)
3. **Betweenness centrality**: Identifies bridges (nodes on shortest paths)
4. **PageRank**: Measures influence (iterative link analysis)
5. **Echo score**: Homophily measure (intra-community connections %)

---

### **5.4 Template Matcher Implementation**

**Template Structure:**
```typescript
// /src/types/template.ts

export interface Template {
  id: string;
  category: 'bridge_accounts' | 'echo_chamber' | 'engagement' | 'community' | 'growth';
  triggerConditions: TriggerCondition[];
  confidence: 'high' | 'medium' | 'low';
  narrativeTemplate: string; // With {{variables}}
  actionTemplate?: string;
  variants: string[]; // Alternative phrasings (A/B testing)
  version: number;
  active: boolean;
}

export interface TriggerCondition {
  metric: string; // e.g., "betweennessCentrality", "echoScore"
  operator: '>' | '<' | '>=' | '<=' | '==';
  threshold: number;
  required: boolean; // If true, ALL required conditions must match
}

// Example template:
const bridgeTemplate: Template = {
  id: 'bridge_001',
  category: 'bridge_accounts',
  triggerConditions: [
    { metric: 'bridgeCount', operator: '>', threshold: 0, required: true },
    { metric: 'betweennessCentrality', operator: '>=', threshold: 0.1, required: false }
  ],
  confidence: 'high',
  narrativeTemplate: `You have {{bridgeCount}} bridge account(s) connecting {{community1}} to {{community2}}. These connections are strategic—engaging with {{topBridge}} could amplify your reach by {{impactEstimate}}%.`,
  actionTemplate: `Consider: Reply to {{topBridge}}'s next 3 posts with thoughtful comments. This strengthens your bridge position and increases visibility across communities.`,
  variants: [
    `{{bridgeCount}} key connector(s) link you to {{community2}}. Engaging {{topBridge}} could expand your reach significantly.`,
    `Strategic opportunity: {{bridgeCount}} bridge account(s) span {{community1}} and {{community2}}. Focus on {{topBridge}} for maximum impact.`
  ],
  version: 1,
  active: true
};
```

**Matcher Implementation:**
```typescript
// /src/services/insight-engine/template-matcher/TemplateMatcher.ts

export class TemplateMatcher {
  constructor(
    private templateRepo: TemplateRepository
  ) {}

  async match(metrics: GraphMetrics): Promise<MatchedTemplate[]> {
    // 1. Fetch all active templates
    const templates = await this.templateRepo.findActive();

    // 2. Evaluate each template's trigger conditions
    const matches: MatchedTemplate[] = [];

    for (const template of templates) {
      const score = this.evaluateTemplate(template, metrics);

      if (score > 0) {
        matches.push({
          template,
          matchScore: score,
          variables: this.extractVariables(template, metrics)
        });
      }
    }

    // 3. Sort by match score (descending)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private evaluateTemplate(
    template: Template,
    metrics: GraphMetrics
  ): number {
    let requiredMatches = 0;
    let requiredTotal = 0;
    let optionalMatches = 0;
    let optionalTotal = 0;

    for (const condition of template.triggerConditions) {
      const value = this.getMetricValue(metrics, condition.metric);
      const matches = this.evaluateCondition(value, condition);

      if (condition.required) {
        requiredTotal++;
        if (matches) requiredMatches++;
      } else {
        optionalTotal++;
        if (matches) optionalMatches++;
      }
    }

    // All required conditions must match
    if (requiredTotal > 0 && requiredMatches < requiredTotal) {
      return 0; // No match
    }

    // Calculate score: required (weight 1.0) + optional (weight 0.5)
    const score = requiredMatches + (optionalMatches * 0.5);
    return score;
  }

  private evaluateCondition(
    value: number | undefined,
    condition: TriggerCondition
  ): boolean {
    if (value === undefined) return false;

    switch (condition.operator) {
      case '>': return value > condition.threshold;
      case '<': return value < condition.threshold;
      case '>=': return value >= condition.threshold;
      case '<=': return value <= condition.threshold;
      case '==': return value === condition.threshold;
      default: return false;
    }
  }

  private getMetricValue(
    metrics: GraphMetrics,
    metricPath: string
  ): number | undefined {
    // Support dot notation: "bridges[0].betweennessCentrality"
    const keys = metricPath.split('.');
    let value: any = metrics;

    for (const key of keys) {
      if (key.includes('[')) {
        // Array access: bridges[0]
        const [arrayKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        value = value[arrayKey]?.[index];
      } else {
        value = value[key];
      }

      if (value === undefined) return undefined;
    }

    return typeof value === 'number' ? value : undefined;
  }

  private extractVariables(
    template: Template,
    metrics: GraphMetrics
  ): Record<string, any> {
    const variables: Record<string, any> = {};

    // Extract variables based on template category
    if (template.category === 'bridge_accounts') {
      variables.bridgeCount = metrics.bridgeCount;
      variables.topBridge = metrics.bridges[0]?.nodeId || 'N/A';
      variables.impactEstimate = Math.round(
        metrics.bridges[0]?.impact || 0
      );

      // Community names (simplified)
      if (metrics.bridges[0]) {
        variables.community1 = metrics.bridges[0].communitiesBridged[0] || 'Community 1';
        variables.community2 = metrics.bridges[0].communitiesBridged[1] || 'Community 2';
      }
    } else if (template.category === 'echo_chamber') {
      variables.echoScore = Math.round(metrics.echoScore * 100);
      variables.homogeneityLevel = this.categorizaEchoScore(metrics.echoScore);
    }

    return variables;
  }

  private categorizeEchoScore(score: number): string {
    if (score >= 0.8) return 'very high';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'moderate';
    return 'low';
  }
}

export interface MatchedTemplate {
  template: Template;
  matchScore: number;
  variables: Record<string, any>;
}
```

---

### **5.5 Template Interpolator Implementation**

```typescript
// /src/services/insight-engine/template-interpolator/TemplateInterpolator.ts

export class TemplateInterpolator {
  interpolate(
    matched: MatchedTemplate,
    useVariant: boolean = false
  ): InterpolatedInsight {
    // 1. Select narrative (main template or variant)
    const narrative = useVariant && matched.template.variants.length > 0
      ? this.selectVariant(matched.template.variants)
      : matched.template.narrativeTemplate;

    // 2. Interpolate variables
    const interpolatedNarrative = this.substituteVariables(
      narrative,
      matched.variables
    );

    // 3. Interpolate action (if exists)
    let interpolatedAction: string | undefined;
    if (matched.template.actionTemplate) {
      interpolatedAction = this.substituteVariables(
        matched.template.actionTemplate,
        matched.variables
      );
    }

    return {
      category: matched.template.category,
      narrative: interpolatedNarrative,
      action: interpolatedAction,
      confidence: matched.template.confidence,
      matchScore: matched.matchScore
    };
  }

  private substituteVariables(
    template: string,
    variables: Record<string, any>
  ): string {
    let result = template;

    // Replace {{variable}} with actual values
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Warn if unreplaced placeholders remain (development only)
    if (process.env.NODE_ENV === 'development') {
      const unreplaced = result.match(/{{[^}]+}}/g);
      if (unreplaced) {
        console.warn(`Unreplaced placeholders: ${unreplaced.join(', ')}`);
      }
    }

    return result;
  }

  private selectVariant(variants: string[]): string {
    // Randomize for natural variation (A/B testing)
    const index = Math.floor(Math.random() * variants.length);
    return variants[index];
  }
}

export interface InterpolatedInsight {
  category: string;
  narrative: string;
  action?: string;
  confidence: 'high' | 'medium' | 'low';
  matchScore: number;
}
```

---

### **5.6 Insight Engine Orchestration**

```typescript
// /src/services/InsightEngine.ts

export class InsightEngine {
  constructor(
    private graphAnalyzer: GraphAnalyzer,
    private statisticalProfiler: StatisticalProfiler,
    private templateMatcher: TemplateMatcher,
    private templateInterpolator: TemplateInterpolator,
    private actionGenerator: ActionGenerator,
    private insightRepo: InsightRepository
  ) {}

  async generate(
    graphId: string,
    categories: string[] = ['all']
  ): Promise<Insight[]> {
    // 1. Fetch graph from database
    const graph = await this.graphRepo.getById(graphId);
    if (!graph) throw new Error('Graph not found');

    // 2. Check cache
    const cached = await this.insightRepo.findByGraphId(graphId);
    if (cached && !this.isStale(cached)) {
      return cached; // Return cached insights (15-min TTL)
    }

    // 3. Analyze graph (algorithms)
    const metrics = this.graphAnalyzer.analyze(graph.data);

    // 4. Statistical profiling
    const profile = this.statisticalProfiler.profile(graph.data);

    // 5. Template matching (rule-based)
    const matched = await this.templateMatcher.match({
      ...metrics,
      ...profile
    });

    // 6. Interpolate narratives
    const insights: Insight[] = [];
    for (const match of matched) {
      const interpolated = this.templateInterpolator.interpolate(match);

      // 7. Generate actions (conditional)
      const actions = this.actionGenerator.generate(
        interpolated.category,
        metrics,
        profile
      );

      insights.push({
        id: uuid(),
        graphId,
        category: interpolated.category,
        narrative: interpolated.narrative,
        confidence: interpolated.confidence,
        actions,
        createdAt: new Date()
      });
    }

    // 8. Cache results
    await this.insightRepo.create(insights);

    return insights;
  }

  private isStale(insights: Insight[]): boolean {
    const age = Date.now() - insights[0].createdAt.getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    return age > fifteenMinutes;
  }
}
```

---

## **5.7 Algorithm-First vs AI-Dependent Comparison**

| Dimension | AI-Dependent (Removed) | Algorithm-First (Implemented) |
|-----------|------------------------|-------------------------------|
| **Intelligence Source** | External LLM API (Claude, GPT-4) | On-premise graph algorithms + templates |
| **Cost** | $0.01-0.05 per recommendation | $0 per recommendation (infrastructure only) |
| **Latency** | 5-15 seconds (p95) | <500ms (p95) |
| **Explainability** | Opaque ("the AI said so") | Transparent (traceable to graph metric) |
| **Privacy** | Data sent to third-party | Data never leaves our infrastructure |
| **Vendor Risk** | Dependent on Anthropic/OpenAI | Complete independence |
| **Regulatory** | AI Act uncertainty, GDPR complexity | No AI regulations, GDPR-simple |
| **Predictability** | Non-deterministic (varies by run) | Deterministic (same input → same output) |
| **Debugging** | Difficult (prompt engineering) | Straightforward (trace logic) |
| **A/B Testing** | Expensive (costs per variant test) | Free (swap templates) |
| **Quality Control** | Subjective ("does it sound good?") | Objective (metric thresholds, user ratings) |
| **Scalability** | Linear cost increase with users | Fixed cost (infrastructure scales sublinearly) |

**Trade-offs Accepted:**
- **Narrative Variation**: Templates less varied than LLM outputs → Mitigated by 5 variants per template, A/B testing
- **Coverage**: Templates might miss edge cases → Mitigated by graceful degradation, iterative expansion (30 → 150 → 300 templates)
- **Perceived Intelligence**: Users might perceive as "less smart" → Mitigated by "algorithm-powered" branding, transparency as strength

**Strategic Advantages Gained:**
- **Privacy Moat**: Only PNI platform with no external AI
- **Cost Moat**: Can offer unlimited insights (competitors can't)
- **Performance Moat**: 20-30x faster than AI APIs
- **Trust Moat**: Explainable, audit-friendly
- **Independence Moat**: No vendor lock-in

---

## **6. Data Architecture**

### **6.1 Database Schema (PostgreSQL + Prisma)**

```prisma
// /prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════════════
// USERS & AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════

model User {
  id         String   @id @default(uuid())
  email      String   @unique
  name       String?
  tier       Tier     @default(FREE)
  googleId   String?  @unique @map("google_id")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  deletedAt  DateTime? @map("deleted_at") // Soft delete

  // Relationships
  uploads        Upload[]
  graphs         Graph[]
  insights       Insight[]
  exports        Export[]
  subscription   Subscription?

  @@map("users")
}

enum Tier {
  FREE
  PRO
  CREATOR
}

// ═══════════════════════════════════════════════════════════════════
// FILE UPLOADS
// ═══════════════════════════════════════════════════════════════════

model Upload {
  id           String       @id @default(uuid())
  userId       String       @map("user_id")
  platform     Platform
  fileSize     BigInt       @map("file_size")
  status       UploadStatus @default(PENDING)
  errorMessage String?      @map("error_message")
  createdAt    DateTime     @default(now()) @map("created_at")

  // Relationships
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  graphs Graph[]

  @@index([userId])
  @@map("uploads")
}

enum Platform {
  TWITTER
  INSTAGRAM
  LINKEDIN
}

enum UploadStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// ═══════════════════════════════════════════════════════════════════
// GRAPHS (Versioned, JSONB, Lifecycle-Managed)
// ═══════════════════════════════════════════════════════════════════

model Graph {
  id            String   @id @default(uuid())
  uploadId      String   @map("upload_id")
  userId        String   @map("user_id")
  platform      Platform
  nodeCount     Int      @map("node_count")
  edgeCount     Int      @map("edge_count")
  graphData     Json     @map("graph_data") // JSONB (anonymized)
  graphSizeBytes Int     @map("graph_size_bytes") // For monitoring
  isLatest      Boolean  @default(true) @map("is_latest") // Version flag
  createdAt     DateTime @default(now()) @map("created_at")
  deletedAt     DateTime? @map("deleted_at") // Soft delete (30-day retention)

  // Relationships
  upload   Upload    @relation(fields: [uploadId], references: [id], onDelete: Cascade)
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  insights Insight[]
  exports  Export[]

  @@index([userId, platform, isLatest]) // For latest graph queries
  @@index([userId, createdAt(sort: Desc)]) // For historical queries
  @@unique([userId, platform], name: "latest_per_platform", where: { isLatest: true, deletedAt: null })
  @@map("graphs")
}

// ═══════════════════════════════════════════════════════════════════
// INSIGHTS (Algorithm-First, Cached)
// ═══════════════════════════════════════════════════════════════════

model Insight {
  id         String   @id @default(uuid())
  graphId    String   @map("graph_id")
  userId     String   @map("user_id")
  category   String   // bridge_accounts, echo_chamber, engagement, etc.
  narrative  String   @db.Text // Template-interpolated narrative
  confidence String   // high, medium, low
  actions    Json     // Array of action objects
  createdAt  DateTime @default(now()) @map("created_at")

  // Relationships
  graph Graph @relation(fields: [graphId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([graphId])
  @@index([userId])
  @@map("insights")
}

// ═══════════════════════════════════════════════════════════════════
// TEMPLATES (Algorithm-First Narrative Library)
// ═══════════════════════════════════════════════════════════════════

model Template {
  id                String   @id @default(uuid())
  category          String   // bridge_accounts, echo_chamber, etc.
  triggerConditions Json     // Array of condition objects
  confidence        String   // high, medium, low
  narrativeTemplate String   @db.Text // With {{variables}}
  actionTemplate    String?  @db.Text // Optional action template
  variants          Json     // Array of alternative phrasings
  version           Int      @default(1)
  active            Boolean  @default(true)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@index([category, active])
  @@map("templates")
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTS (PDF, Social Cards, Data)
// ═══════════════════════════════════════════════════════════════════

model Export {
  id         String       @id @default(uuid())
  userId     String       @map("user_id")
  graphId    String?      @map("graph_id")
  format     ExportFormat
  fileUrl    String       @map("file_url") // R2 signed URL
  expiresAt  DateTime     @map("expires_at") // 7-day TTL
  createdAt  DateTime     @default(now()) @map("created_at")

  // Relationships
  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  graph Graph? @relation(fields: [graphId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@map("exports")
}

enum ExportFormat {
  PDF
  PNG
  CSV
  JSON
}

// ═══════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS (Stripe Integration)
// ═══════════════════════════════════════════════════════════════════

model Subscription {
  id                   String              @id @default(uuid())
  userId               String              @unique @map("user_id")
  stripeCustomerId     String              @unique @map("stripe_customer_id")
  stripeSubscriptionId String              @unique @map("stripe_subscription_id")
  status               SubscriptionStatus
  currentPeriodEnd     DateTime            @map("current_period_end")
  createdAt            DateTime            @default(now()) @map("created_at")

  // Relationships
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

// ═══════════════════════════════════════════════════════════════════
// ANALYTICS (Usage Tracking, Anonymized)
// ═══════════════════════════════════════════════════════════════════

model AnalyticsEvent {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id") // Nullable for anonymous events
  eventType  String   @map("event_type")
  eventData  Json     @map("event_data")
  timestamp  DateTime @default(now())

  @@index([userId])
  @@index([eventType, timestamp])
  @@map("analytics_events")
}
```

---

### **6.2 Graph Data Lifecycle**

**Immutability Model:**
```
Upload → Parse → Create New Graph (immutable)
    ↓
Re-upload (same platform) → Create New Graph (version 2)
    ↓
Old Graph: Retained for historical comparison
    ↓
Query Latest: SELECT * WHERE is_latest = TRUE
Query History: SELECT * ORDER BY created_at DESC
```

**Versioning Strategy:**
```typescript
// When user re-uploads Twitter data:

1. Mark old graph as not latest:
   UPDATE graphs
   SET is_latest = FALSE
   WHERE user_id = ? AND platform = 'TWITTER' AND is_latest = TRUE;

2. Create new graph:
   INSERT INTO graphs (user_id, platform, graph_data, is_latest)
   VALUES (?, 'TWITTER', ?, TRUE);

3. Unique constraint ensures only one latest graph per platform:
   UNIQUE (user_id, platform) WHERE is_latest = TRUE
```

**Storage Projection:**
```
Typical User (Monthly Refresh, 12 Snapshots):
├─ Graph size: 1MB average (1K-5K nodes)
├─ Snapshots: 12 graphs × 1MB = 12MB
├─ Total users: 10,000
├─ Total storage: 120GB
└─ Cost: ~$3/month (PostgreSQL)

Acceptable: Yes (predictable, scalable)
```

---

## **7. Security Architecture**

### **7.1 Threat Model (STRIDE Analysis)**

**Spoofing:**
```
Threat: Attacker impersonates legitimate user
Mitigations:
├─ Magic link: 256-bit tokens, 15-min expiry, single-use
├─ JWT: httpOnly cookie, Secure, SameSite=Lax
├─ Google OAuth: State parameter (CSRF protection)
└─ Rate limiting: 5 login attempts/hour per email
```

**Tampering:**
```
Threat: Attacker modifies data in transit or at rest
Mitigations:
├─ TLS 1.3: All HTTPS, HSTS header
├─ Database encryption: At-rest encryption enabled
├─ Signed URLs: R2 files accessed via signed URLs only
└─ CSRF tokens: State parameter, SameSite cookies
```

**Repudiation:**
```
Threat: User denies performing action
Mitigations:
├─ Structured logging: All actions logged (Winston/Pino)
├─ Audit trail: Analytics events table
└─ JWT claims: User ID in every authenticated request
```

**Information Disclosure:**
```
Threat: Sensitive data exposed
Mitigations:
├─ Client-side processing: 80% never leaves browser
├─ Anonymized storage: Node IDs hashed
├─ Access control: User can only access own data
├─ No PII in logs: User IDs only, no emails
└─ CORS: Strict origin whitelist
```

**Denial of Service:**
```
Threat: System overwhelmed, unavailable
Mitigations:
├─ Rate limiting: Per-user, per-IP (Redis-backed)
├─ File size limits: 2GB max upload
├─ Query timeouts: 30s max query execution
├─ Connection pooling: Prevent database exhaustion
└─ CDN: Cloudflare (DDoS protection)
```

**Elevation of Privilege:**
```
Threat: Attacker gains unauthorized access
Mitigations:
├─ Feature gating: Tier-based authorization (server-side)
├─ Least privilege: Database users have minimal permissions
├─ IAM policies: R2 access restricted
└─ No admin backdoors: All access logged, audited
```

---

### **7.2 Security Headers**

```typescript
// /src/middleware/security-headers.ts

import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Next.js requires inline
      styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind requires inline
      imgSrc: ["'self'", "data:", "https://cdn.visualsocialgraph.com"],
      connectSrc: ["'self'", "https://api.visualsocialgraph.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xContentTypeOptions: true, // nosniff
  xFrameOptions: { action: 'deny' }, // Clickjacking protection
  xXssProtection: true, // Legacy XSS protection
});
```

**Expected Result:**
- SSL Labs: A+
- securityheaders.com: A+
- OWASP compliance: Pass

---

## **8. Performance Architecture**

### **8.1 Performance Budget**

```
Frontend (Lighthouse Targets):
├─ First Contentful Paint (FCP): <1.5s
├─ Largest Contentful Paint (LCP): <2.5s
├─ Time to Interactive (TTI): <3.5s
├─ Cumulative Layout Shift (CLS): <0.1
├─ First Input Delay (FID): <100ms
└─ Lighthouse Score: >90

API (Response Time Targets):
├─ Authentication: <100ms (p95)
├─ Graph retrieval: <200ms (p95)
├─ Insight generation: <500ms (p95)
├─ Export generation: <5s (PDF), <2s (social card)
└─ Error rate: <1% (5xx errors)

Visualization (FPS Targets):
├─ <1K nodes: 60 FPS (SVG)
├─ 1K-5K nodes: 30 FPS (Canvas)
├─ 5K-10K nodes: 15 FPS (Canvas + sampling)
└─ Initial render: <3s (even 10K nodes)
```

---

### **8.2 Caching Strategy**

```
┌─────────────────────────────────────────────────────────────────┐
│                     CACHING LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

1. Browser Cache (Service Worker)
├─ Static assets: 1-year cache (JS, CSS, images)
├─ API responses: stale-while-revalidate (5-min)
└─ Graph data: IndexedDB (persistent local storage)

2. CDN Cache (Cloudflare)
├─ Static assets: Edge caching (global distribution)
├─ API responses: Bypass (dynamic content)
└─ Images: Cached + image optimization

3. Application Cache (Redis)
├─ Session storage: JWT invalidation list (7-day TTL)
├─ Graph metrics: Analyzed graph results (1-hour TTL)
│   Key: graph:{graph_id}:metrics
├─ Insights: Generated insights (15-min TTL)
│   Key: graph:{graph_id}:insights
├─ Rate limiting: Request counters (sliding window)
│   Key: ratelimit:{user_id}:{hour}
└─ Template library: Active templates (1-day TTL)
    Key: templates:active

4. Database Cache (PostgreSQL)
├─ Query result cache: Built-in (shared_buffers)
├─ Indexes: All foreign keys, commonly queried columns
└─ Materialized views: None (Phase 0-2, add Phase 3+ if needed)

Cache Invalidation Rules:
├─ Graph updated → Invalidate graph:*:metrics, graph:*:insights
├─ Template updated → Invalidate templates:active
├─ User logout → Invalidate session:{user_id}
└─ Subscription changed → Invalidate user:{user_id}:tier
```

---

### **8.3 Performance Monitoring**

```typescript
// /src/middleware/performance.ts

import { performance } from 'perf_hooks';

export function performanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;

    // Log slow requests (>500ms)
    if (duration > 500) {
      logger.warn('Slow request', {
        method: req.method,
        path: req.path,
        duration: Math.round(duration),
        userId: req.user?.id
      });
    }

    // Send to APM (Sentry Performance)
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${req.method} ${req.path}`,
      level: 'info',
      data: { duration, status: res.statusCode }
    });
  });

  next();
}
```

---

## **9. Testing Architecture**

### **9.1 Testing Pyramid**

```
                     ╱╲
                    ╱ E2E╲         10% (Critical user flows)
                   ╱──────╲        Tools: Playwright
                  ╱        ╲       Coverage: Login → Upload → Visualize → Export
                 ╱Integration╲    20% (API endpoints, services)
                ╱────────────╲    Tools: Vitest + Supertest
               ╱              ╲   Coverage: All API routes, database interactions
              ╱  Unit Tests    ╲ 70% (Pure functions, algorithms)
             ╱──────────────────╲ Tools: Vitest
            ╱____________________╲ Coverage: >80% for core modules
```

**Testing Strategy by Layer:**

```
Frontend Tests:
├─ Unit (Vitest + React Testing Library):
│  ├─ Pure functions: parsers, graph builders, utilities
│  ├─ Hooks: useAuth, useUpload, useGraph
│  └─ Components: Isolated component behavior
├─ Integration (Vitest):
│  ├─ API client: Mock API responses
│  └─ State management: Zustand stores
└─ E2E (Playwright):
   ├─ Upload flow: File upload → progress → success
   ├─ Visualization: Graph renders, interactions work
   └─ Export flow: PDF generation, download

Backend Tests:
├─ Unit (Vitest):
│  ├─ Services: Business logic (mocked dependencies)
│  ├─ Utilities: Crypto, validation, formatting
│  └─ Algorithms: Graph analysis, template matching
├─ Integration (Vitest + Supertest):
│  ├─ API routes: Request → response validation
│  ├─ Database: CRUD operations (test database)
│  └─ Authentication: JWT generation, verification
└─ E2E (Playwright API testing):
   └─ Full user flows: Auth → upload → insights → export

Parser Tests (Critical):
├─ Fixture-based: 30+ real platform exports
├─ Success rate: >95% (28/30 minimum)
├─ Accuracy: Spot-check parsed data vs. source
└─ Performance: <60s for 500MB file
```

---

### **9.2 CI/CD Test Pipeline**

```yaml
# .github/workflows/test.yml

name: Test Pipeline

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse-ci

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level=high
```

**Quality Gates:**
- All tests pass: ✅ Required
- Coverage >80%: ✅ Required
- No high/critical vulnerabilities: ✅ Required
- Lighthouse >90: ✅ Required
- Build succeeds: ✅ Required

---

## **10. Deployment Architecture**

### **10.1 Infrastructure Diagram (Phase 2 - Production)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GLOBAL USERS                                      │
│  (North America, Europe, Asia-Pacific)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Global Network                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Edge Services (200+ Data Centers)                                     │ │
│  │  ├─ DDoS Protection (automatic, always-on)                             │ │
│  │  ├─ WAF (Web Application Firewall)                                     │ │
│  │  ├─ SSL/TLS Termination (TLS 1.3)                                      │ │
│  │  ├─ Static Asset Caching (1-year TTL)                                  │ │
│  │  ├─ Image Optimization (WebP conversion, resizing)                     │ │
│  │  └─ Rate Limiting (per-IP, global rules)                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                     │                              │
                     ├──────────────┬───────────────┤
                     ▼              ▼               ▼
        ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐
        │  Vercel Edge    │  │   Backend    │  │  Cloudflare R2  │
        │   (Frontend)    │  │   Cluster    │  │   (Storage)     │
        │                 │  │   (Railway/  │  │                 │
        │ ┌─────────────┐ │  │    AWS)      │  │ ┌─────────────┐ │
        │ │ Edge Funcs  │ │  │              │  │ │ /uploads/   │ │
        │ │ (Serverless)│ │  │ Load         │  │ │ (1-hour TTL)│ │
        │ └─────────────┘ │  │ Balancer     │  │ └─────────────┘ │
        │                 │  │    │         │  │ ┌─────────────┐ │
        │ ┌─────────────┐ │  │    ▼         │  │ │ /exports/   │ │
        │ │ Static CDN  │ │  │ ┌──────┐    │  │ │ (7-day TTL) │ │
        │ │ (HTML/CSS/  │ │  │ │Node.js│   │  │ └─────────────┘ │
        │ │  JS assets) │ │  │ │ API   │   │  │ ┌─────────────┐ │
        │ └─────────────┘ │  │ │ #1    │   │  │ │ /graphs/    │ │
        │                 │  │ └──────┘    │  │ │ (thumbnails)│ │
        │ Auto-scaling:   │  │    │         │  │ └─────────────┘ │
        │ - Unlimited     │  │ ┌──────┐    │  │                 │
        │ - Geographic    │  │ │Node.js│   │  │ Lifecycle:      │
        │   distribution  │  │ │ API   │   │  │ - Auto-delete   │
        │                 │  │ │ #2    │   │  │ - Encryption    │
        └─────────────────┘  │ └──────┘    │  │ - Versioning    │
                             │    │         │  └─────────────────┘
                             │ ┌──────┐    │
                             │ │Node.js│   │
                             │ │ API   │   │
                             │ │ #N    │   │
                             │ └──────┘    │
                             │              │
                             │ Scaling:     │
                             │ - Min: 2     │
                             │ - Max: 10    │
                             │ - CPU >70%   │
                             │   → add inst │
                             └──────────────┘
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
              ┌────────────────┐      ┌─────────────────┐
              │  PostgreSQL    │      │     Redis       │
              │   (Primary)    │      │   (Cluster)     │
              │                │      │                 │
              │ ┌────────────┐ │      │ ┌─────────────┐ │
              │ │ Primary DB │ │      │ │  Master     │ │
              │ │ (Read/Write│ │      │ │  (Write)    │ │
              │ └────────────┘ │      │ └─────────────┘ │
              │       │         │      │       │         │
              │       ▼         │      │       ▼         │
              │ ┌────────────┐ │      │ ┌─────────────┐ │
              │ │ Read       │ │      │ │  Replica 1  │ │
              │ │ Replica    │ │      │ │  (Read)     │ │
              │ │ (Phase 3+) │ │      │ └─────────────┘ │
              │ └────────────┘ │      │       │         │
              │                │      │       ▼         │
              │ Connection:    │      │ ┌─────────────┐ │
              │ - Pool (50)    │      │ │  Replica 2  │ │
              │ - PgBouncer    │      │ │  (Read)     │ │
              │ - Auto-failover│      │ └─────────────┘ │
              │                │      │                 │
              │ Backup:        │      │ Persistence:    │
              │ - Hourly inc   │      │ - AOF (append)  │
              │ - Daily full   │      │ - RDB (snapshot)│
              │ - 30-day keep  │      │ - Auto-failover │
              └────────────────┘      └─────────────────┘
```

### **10.2 Scaling Patterns by Phase**

**Phase 0-1: Minimal (0-100 users)**
```
Frontend: Vercel Hobby (free)
└─ Serverless functions (auto-scale)

Backend: Single Railway instance
├─ 0.5 CPU, 512MB RAM
├─ No load balancer needed
└─ Manual restart if crash

Database: Railway PostgreSQL
├─ Shared instance
├─ No replicas
└─ Daily backups

Redis: Railway Redis
├─ Single instance
├─ No persistence (cache only)
└─ 256MB memory

Storage: Cloudflare R2
└─ Pay-per-use (minimal)

Cost: ~$18/month
Bottleneck: Single backend instance (acceptable for beta)
```

**Phase 2: Production (100-1,000 users)**
```
Frontend: Vercel Pro
├─ Unlimited bandwidth
├─ Edge functions
└─ Geographic distribution

Backend: Railway Pro (2-3 instances) or AWS ECS
├─ Load balancer (Railway built-in or AWS ALB)
│  ├─ Health checks (HTTP /health endpoint)
│  ├─ Round-robin distribution
│  └─ Sticky sessions (Redis-backed)
├─ Instance specs: 1 CPU, 2GB RAM each
├─ Auto-scaling rules:
│  ├─ CPU >70% for 5 min → add instance
│  ├─ CPU <30% for 10 min → remove instance
│  ├─ Min: 2 instances (redundancy)
│  └─ Max: 5 instances (cost control)
└─ Graceful shutdown (60s drain)

Database: PostgreSQL (Railway Pro or AWS RDS)
├─ Instance: 2 CPU, 8GB RAM
├─ Connection pooling: PgBouncer (300 connections)
├─ Backup strategy:
│  ├─ Hourly incremental (WAL archiving)
│  ├─ Daily full (automated snapshots)
│  ├─ Retention: 30 days
│  └─ Restore tested monthly
├─ Monitoring:
│  ├─ Slow query log (>1s)
│  ├─ Connection count alerts
│  └─ Disk usage (>80% = alert)
└─ Future: Read replica (Phase 3+)

Redis: Railway Pro or AWS ElastiCache
├─ Cluster mode (3 nodes)
├─ Persistence: AOF (append-only file)
├─ Replication: Master + 2 replicas
├─ Auto-failover: <1 minute
└─ Eviction policy: allkeys-lru (cache)

Storage: Cloudflare R2
├─ Lifecycle policies:
│  ├─ /uploads/*: Delete after 1 hour
│  ├─ /exports/*: Delete after 7 days
│  └─ /graphs/*: Keep until user deletes
├─ Encryption: Server-side (AES-256)
└─ Access: Signed URLs (1-hour expiry)

Cost: ~$100-200/month
Bottleneck: Database connections (mitigated by pooling)
Scaling headroom: 5x current capacity
```

**Phase 3: Scale (1,000-10,000 users)**
```
Frontend: Vercel Pro + Incremental Static Regeneration
├─ ISR for static pages (blog, docs)
├─ Edge middleware (geo-routing)
└─ Custom domain + SSL

Backend: AWS ECS or Kubernetes
├─ Auto-scaling group: 5-10 instances
├─ Application Load Balancer (ALB)
│  ├─ Health checks: /health (HTTP 200)
│  ├─ Target group: Weighted round-robin
│  ├─ Connection draining: 120s
│  └─ Cross-zone load balancing
├─ Instance specs: 2 CPU, 4GB RAM each
├─ Auto-scaling rules:
│  ├─ CPU >60% for 3 min → add instance
│  ├─ CPU <20% for 10 min → remove instance
│  ├─ Min: 3 instances (multi-AZ redundancy)
│  └─ Max: 10 instances (cost control)
├─ Blue-green deployments (zero downtime)
└─ Container orchestration (ECS or k8s)

Database: AWS RDS Multi-AZ
├─ Primary: 4 CPU, 16GB RAM (write)
├─ Read replica: 4 CPU, 16GB RAM (read-heavy queries)
│  ├─ Replication lag: <100ms
│  ├─ Read traffic: Insight generation, analytics
│  └─ Automatic failover to primary if needed
├─ Connection pooling: RDS Proxy (2000 connections)
├─ Backup strategy:
│  ├─ Automated backups (daily, 35-day retention)
│  ├─ Manual snapshots before major changes
│  └─ Point-in-time recovery (5-minute RPO)
├─ Monitoring:
│  ├─ Performance Insights (query analysis)
│  ├─ Enhanced monitoring (OS metrics)
│  └─ CloudWatch alarms (CPU, IOPS, connections)
└─ Disaster recovery:
   ├─ Cross-region replica (future, Phase 4)
   └─ Automated failover (<5 minutes)

Redis: AWS ElastiCache (cluster mode)
├─ Sharding: 3 shards (horizontal scaling)
├─ Replication: 2 replicas per shard
├─ Total nodes: 9 (3 shards × 3 nodes)
├─ Auto-failover: <30 seconds
├─ Backup: Daily snapshots (7-day retention)
└─ Monitoring: CloudWatch (cache hit rate, evictions)

Storage: Cloudflare R2 + CDN
├─ Multi-region distribution (automatic)
├─ CDN integration (Cloudflare)
├─ Custom domain (files.visualsocialgraph.com)
└─ Access logging (security audit trail)

Observability:
├─ Distributed tracing: Sentry or Datadog APM
│  ├─ Trace upload → parse → analyze → insight
│  ├─ Identify bottlenecks (slow queries, algorithms)
│  └─ Performance budgets enforced
├─ Metrics: Prometheus + Grafana
│  ├─ Request rate (req/s)
│  ├─ Error rate (5xx %)
│  ├─ Latency (p50, p95, p99)
│  └─ Custom metrics (graph size, template match time)
└─ Alerting: PagerDuty
   ├─ Critical: Database down, high error rate (>5%)
   ├─ Warning: Slow queries (>2s), high CPU (>80%)
   └─ On-call rotation

Cost: ~$1,000-2,000/month
Bottleneck: Insight Engine CPU (algorithm computation)
Scaling headroom: 10x current capacity
Next bottleneck: Database write throughput (Phase 4: sharding)
```

---

### **10.3 Load Balancing Strategy**

**Load Balancer Configuration (AWS ALB example):**
```typescript
// Infrastructure as Code (Terraform/Pulumi)

resource "aws_lb" "vsg_api" {
  name               = "vsg-api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2               = true
  enable_cross_zone_load_balancing = true

  tags = {
    Environment = "production"
  }
}

resource "aws_lb_target_group" "vsg_api" {
  name     = "vsg-api-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  deregistration_delay = 120 // Connection draining (2 minutes)

  stickiness {
    type            = "lb_cookie"
    cookie_duration = 86400 // 24 hours (for session consistency)
    enabled         = true
  }
}

resource "aws_lb_listener" "vsg_api_https" {
  load_balancer_arn = aws_lb.vsg_api.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.vsg.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.vsg_api.arn
  }
}
```

**Health Check Endpoint:**
```typescript
// /src/routes/health.ts

import { Router } from 'express';
import { prisma } from '@/config/database';
import { redisClient } from '@/config/redis';

const router = Router();

router.get('/health', async (req, res) => {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'unknown',
    redis: 'unknown'
  };

  try {
    // Database health check (lightweight query)
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (error) {
    checks.database = 'error';
    checks.status = 'degraded';
  }

  try {
    // Redis health check
    await redisClient.ping();
    checks.redis = 'ok';
  } catch (error) {
    checks.redis = 'error';
    checks.status = 'degraded';
  }

  // Return 200 if at least partially healthy (ALB will use this)
  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});

router.get('/ready', async (req, res) => {
  // Readiness check: Can this instance handle traffic?
  // Used for graceful shutdown and deployment

  if (global.isShuttingDown) {
    return res.status(503).json({ ready: false, reason: 'shutting_down' });
  }

  res.status(200).json({ ready: true });
});

export default router;
```

**Graceful Shutdown Pattern:**
```typescript
// /src/index.ts

import { createServer } from 'http';
import app from './app';

const server = createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown on SIGTERM (ECS/k8s sends this)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, starting graceful shutdown');

  // 1. Mark instance as not ready (fails /ready checks)
  global.isShuttingDown = true;

  // 2. Wait for ALB to drain connections (120s connection draining)
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5s buffer

  // 3. Close server (stop accepting new connections)
  server.close(async () => {
    console.log('HTTP server closed');

    // 4. Close database connections
    await prisma.$disconnect();
    console.log('Database disconnected');

    // 5. Close Redis connections
    await redisClient.quit();
    console.log('Redis disconnected');

    // 6. Exit cleanly
    process.exit(0);
  });

  // 7. Force exit after 60s if not closed
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 60000);
});
```

---

### **10.4 Upload Load Distribution**

**File Upload Strategy (Tus Protocol + Load Balancing):**

```
Problem: Large file uploads (2GB) need sticky sessions

Solution: Redis-backed session affinity

Flow:
1. Client initiates upload → ALB assigns to backend instance A
2. ALB creates sticky cookie (lb_cookie)
3. Client sends chunks → All go to instance A (cookie ensures this)
4. Upload completes → Temporary file in R2
5. Backend processes → Graph created → Client notified

Failure Handling:
├─ Instance A crashes mid-upload:
│  ├─ ALB detects unhealthy (health check fails)
│  ├─ Client retries → ALB assigns to instance B
│  ├─ Tus protocol resumes from last successful chunk
│  └─ Upload completes on instance B
└─ Network interruption:
   ├─ Client reconnects (automatic in tus-js-client)
   ├─ Tus server checks uploaded chunks (HEAD request)
   ├─ Client resumes from last chunk
   └─ No data loss, seamless recovery
```

**Tus Server Configuration:**
```typescript
// /src/services/UploadService.ts

import { Server as TusServer } from '@tus/server';
import { S3Store } from '@tus/s3-store';
import { S3Client } from '@aws-sdk/client-s3';

export class UploadService {
  private tusServer: TusServer;

  constructor() {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    this.tusServer = new TusServer({
      path: '/api/uploads',
      datastore: new S3Store({
        s3Client,
        bucket: process.env.R2_BUCKET_NAME!,
        expirationPeriod: 3600000 // 1 hour (then delete incomplete uploads)
      }),
      namingFunction: (req) => {
        // Custom file naming: user_id/upload_id.zip
        const userId = req.user?.id;
        const uploadId = crypto.randomUUID();
        return `${userId}/${uploadId}.zip`;
      },
      onUploadFinish: async (req, res, upload) => {
        // Upload complete → Trigger processing
        const { userId, uploadId } = this.parseMetadata(upload);
        await this.triggerProcessing(userId, uploadId, upload.storage.path);
      },
      maxSize: 2 * 1024 * 1024 * 1024 // 2GB limit
    });
  }

  async handleUpload(req: Request, res: Response) {
    // Tus server handles all upload logic (chunks, resume, completion)
    return this.tusServer.handle(req, res);
  }

  private async triggerProcessing(
    userId: string,
    uploadId: string,
    filePath: string
  ) {
    // Add to Bull queue for background processing
    await uploadQueue.add('process-upload', {
      userId,
      uploadId,
      filePath
    }, {
      attempts: 3, // Retry up to 3 times
      backoff: {
        type: 'exponential',
        delay: 60000 // Start with 1-minute delay
      }
    });
  }
}

---

### **10.2 Production Infrastructure (Detailed)**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  INTERNET / USERS                                    │
│                            (Global Distribution)                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE (Global Edge Network)                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Edge Services:                                                                 │ │
│  │  ├─ SSL/TLS Termination (Automatic cert renewal)                               │ │
│  │  ├─ DDoS Protection (Layer 3/4/7, automatic mitigation)                        │ │
│  │  ├─ WAF (Web Application Firewall, OWASP ruleset)                              │ │
│  │  ├─ Rate Limiting (Layer 7, geo-based)                                         │ │
│  │  ├─ Static Asset Caching (JS, CSS, images - 1 year TTL)                        │ │
│  │  ├─ Image Optimization (WebP conversion, lazy loading hints)                   │ │
│  │  └─ Bot Management (Challenge bad actors, allow legit bots)                    │ │
│  │                                                                                 │ │
│  │  Geographic Distribution:                                                       │ │
│  │  ├─ North America: 50+ edge locations                                          │ │
│  │  ├─ Europe: 40+ edge locations                                                 │ │
│  │  ├─ Asia-Pacific: 30+ edge locations                                           │ │
│  │  └─ Latency: <50ms to 95% of global population                                 │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴────────────────────┐
                    │                                        │
                    ▼                                        ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────────┐
│        VERCEL (Frontend)              │  │       RAILWAY/AWS (Backend Services)      │
│  Serverless Edge Functions            │  │    Container-based Deployment            │
│  ┌──────────────────────────────────┐ │  │  ┌────────────────────────────────────┐ │
│  │  Next.js App (React 18)          │ │  │  │  Load Balancer (Internal)          │ │
│  │  ├─ SSR (Server-Side Rendering)  │ │  │  │  ├─ Health checks: /health (30s)   │ │
│  │  │  └─ Landing pages, SEO        │ │  │  │  ├─ Algorithm: Round-robin         │ │
│  │  ├─ CSR (Client-Side Rendering)  │ │  │  │  ├─ Sticky sessions: Disabled      │ │
│  │  │  └─ App pages, visualization  │ │  │  │  └─ Drain time: 30s graceful       │ │
│  │  ├─ API Routes (lightweight)     │ │  │  └────────────────────────────────────┘ │
│  │  │  └─ /api/auth/session         │ │  │             │                             │
│  │  └─ Edge Functions (global)      │ │  │             ▼                             │
│  │     └─ Geolocation, A/B testing  │ │  │  ┌────────────────────────────────────┐ │
│  └──────────────────────────────────┘ │  │  │  Backend API Instances (Stateless)│ │
│                                        │  │  │  Node.js 20 + Express + TypeScript│ │
│  Deployment:                           │  │  │                                    │ │
│  ├─ Auto-deploy: main branch          │  │  │  Phase 2-3 Horizontal Scaling:    │ │
│  ├─ Preview: Every PR                  │  │  │  ┌──────────────┬──────────────┐  │ │
│  ├─ Rollback: Instant (Git revert)    │  │  │  │  Instance 1  │  Instance 2  │  │ │
│  └─ CDN: 300+ global edge locations   │  │  │  │  (Primary)   │  (Replica)   │  │ │
│                                        │  │  │  │  CPU: 2c/4GB │  CPU: 2c/4GB │  │ │
│  Performance:                          │  │  │  │  Req: 150/m  │  Req: 180/m  │  │ │
│  ├─ Cold start: <100ms                 │  │  │  └──────────────┴──────────────┘  │ │
│  ├─ Response: <50ms (p50)              │  │  │             │                      │ │
│  └─ Auto-scaling: 0 → 1000 instances   │  │  │             ▼                      │ │
└──────────────────────────────────────┘  │  │  ┌────────────────────────────────┐ │ │
                                           │  │  │  Service Layer (Stateless)     │ │ │
                                           │  │  │  ├─ AuthService                 │ │ │
                                           │  │  │  ├─ GraphService                │ │ │
                                           │  │  │  ├─ InsightEngine ⭐            │ │ │
                                           │  │  │  ├─ UploadService               │ │ │
                                           │  │  │  └─ ExportService               │ │ │
                                           │  │  └────────────────────────────────┘ │ │
                                           │  │                                     │ │
                                           │  │  Auto-Scaling Rules:                │ │
                                           │  │  ├─ Scale UP:                       │ │
                                           │  │  │  ├─ CPU >70% for 2 min → +1     │ │
                                           │  │  │  ├─ Memory >80% → +1             │ │
                                           │  │  │  ├─ Queue >50 requests → +1      │ │
                                           │  │  │  └─ P95 latency >500ms → +1      │ │
                                           │  │  ├─ Scale DOWN:                     │ │
                                           │  │  │  ├─ CPU <30% for 10 min → -1     │ │
                                           │  │  │  └─ Memory <50% for 10 min → -1  │ │
                                           │  │  ├─ Limits: Min 1, Max 10           │ │
                                           │  │  └─ Cooldown: 5 min between actions │ │
                                           │  │                                     │ │
                                           │  │  Deployment Strategy:               │ │
                                           │  │  ├─ Blue-Green: Zero downtime       │ │
                                           │  │  ├─ Health check before traffic     │ │
                                           │  │  ├─ Rollback: Previous Docker image │ │
                                           │  │  └─ Time: <2 minutes total          │ │
                                           │  └─────────────────────────────────────┘ │
                                           └────────────────────────────────────────────┘
                                                            │
                    ┌───────────────────────────────────────┼──────────────────────────┐
                    │                                       │                          │
                    ▼                                       ▼                          ▼
┌────────────────────────────────┐  ┌────────────────────────────────┐  ┌─────────────────────┐
│  POSTGRESQL (Railway/AWS RDS)  │  │     REDIS (Railway/ElastiCache)│  │  CLOUDFLARE R2      │
│  Primary Database              │  │     Cache + Session + Queue    │  │  Object Storage     │
│  ┌──────────────────────────┐ │  │  ┌──────────────────────────┐  │  │  ┌────────────────┐ │
│  │  Configuration:           │ │  │  │  Configuration:           │  │  │  │  Buckets:      │ │
│  │  ├─ PostgreSQL 15         │ │  │  │  ├─ Redis 7              │  │  │  │  ├─ /uploads   │ │
│  │  ├─ Storage: 50GB SSD    │ │  │  │  ├─ Memory: 1-4GB        │  │  │  │  │  (1h TTL)   │ │
│  │  ├─ Connections: 100 max │ │  │  │  ├─ Eviction: allkeys-lru│  │  │  │  ├─ /exports   │ │
│  │  ├─ Backups: Hourly      │ │  │  │  └─ Persistence: AOF     │  │  │  │  │  (7d TTL)   │ │
│  │  └─ Retention: 30 days   │ │  │  │                           │  │  │  │  └─ /graphs    │ │
│  │                           │ │  │  │  Data Patterns:           │  │  │  │     (permanent)│ │
│  │  Performance Tuning:      │ │  │  │  ├─ Sessions: 7d TTL     │  │  │  └────────────────┘ │
│  │  ├─ shared_buffers: 25%  │ │  │  │  ├─ Metrics cache: 1h    │  │  │                     │
│  │  ├─ Indexes: All FKs     │ │  │  │  ├─ Insights: 15min      │  │  │  Lifecycle:         │
│  │  └─ Query timeout: 30s   │ │  │  │  └─ Rate limits: Sliding │  │  │  ├─ Auto-cleanup   │
│  │                           │ │  │  │                           │  │  │  ├─ Versioning     │
│  │  Scaling (Phase 3):       │ │  │  │  Scaling (Phase 3):       │  │  │  └─ Multi-region  │
│  │  ├─ Read replicas: 1-2   │ │  │  │  ├─ Cluster mode         │  │  │                     │
│  │  ├─ Connection pooler    │ │  │  │  ├─ Multi-AZ replica     │  │  │  Cost Model:        │
│  │  │  (PgBouncer)          │ │  │  │  └─ Memory: 4-8GB        │  │  │  ├─ $0.015/GB/mo   │
│  │  └─ Partitioning: by    │ │  │  │                           │  │  │  ├─ $0.005/10K ops │
│  │     user_id (Phase 4+)   │ │  │  │  Cost (Phase 3):          │  │  │  └─ $0 egress ⭐  │
│  │                           │ │  │  │  └─ $50-80/month         │  │  │                     │
│  │  High Availability:       │ │  │  └──────────────────────────┘  │  └─────────────────────┘
│  │  ├─ Auto-failover (30s)  │ │
│  │  ├─ Point-in-time recov. │ │
│  │  └─ Monitoring: RDS      │ │
│  │     Insights enabled     │ │
│  └──────────────────────────┘ │
│                                │
│  Cost Model:                   │
│  ├─ Railway: $20/mo (Phase2)  │
│  ├─ AWS RDS: $100/mo (Phase3) │
│  └─ Predictable scaling        │
└────────────────────────────────┘
```

---

### **10.3 Load Balancing & Health Checks**

**Health Check Implementation:**

```typescript
// /src/routes/health.ts

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: HealthStatus;
    redis: HealthStatus;
    memory: HealthStatus;
    disk: HealthStatus;
  };
}

interface HealthStatus {
  status: 'pass' | 'fail';
  latency?: number;
  message?: string;
}

export async function healthCheck(): Promise<HealthCheckResponse> {
  const start = Date.now();

  // 1. Database connectivity (timeout: 2s)
  const dbCheck = await checkDatabase();

  // 2. Redis connectivity (timeout: 1s)
  const redisCheck = await checkRedis();

  // 3. Memory usage (<90% threshold)
  const memoryCheck = checkMemory();

  // 4. Disk usage (<85% threshold)
  const diskCheck = checkDisk();

  // Determine overall status
  const allPass = [dbCheck, redisCheck, memoryCheck, diskCheck]
    .every(c => c.status === 'pass');

  const anyFail = [dbCheck, redisCheck]
    .some(c => c.status === 'fail');

  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (allPass) {
    status = 'healthy';
  } else if (anyFail) {
    status = 'unhealthy';
  } else {
    status = 'degraded';
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: dbCheck,
      redis: redisCheck,
      memory: memoryCheck,
      disk: diskCheck
    }
  };
}

async function checkDatabase(): Promise<HealthStatus> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      status: latency < 100 ? 'pass' : 'fail',
      latency,
      message: latency < 100 ? 'Database responsive' : 'Database slow'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Database unreachable: ${error.message}`
    };
  }
}

async function checkRedis(): Promise<HealthStatus> {
  try {
    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;

    return {
      status: latency < 50 ? 'pass' : 'fail',
      latency,
      message: latency < 50 ? 'Redis responsive' : 'Redis slow'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Redis unreachable: ${error.message}`
    };
  }
}

function checkMemory(): HealthStatus {
  const used = process.memoryUsage();
  const percentUsed = (used.heapUsed / used.heapTotal) * 100;

  return {
    status: percentUsed < 90 ? 'pass' : 'fail',
    message: `Memory ${percentUsed.toFixed(1)}% used`
  };
}

function checkDisk(): HealthStatus {
  // Simplified - in production, use disk-usage library
  return {
    status: 'pass',
    message: 'Disk space sufficient'
  };
}

// Express route
router.get('/health', async (req, res) => {
  const health = await healthCheck();

  // Return appropriate HTTP status
  const statusCode = health.status === 'healthy' ? 200 :
                     health.status === 'degraded' ? 200 : // Still serve traffic
                     503; // Unhealthy - remove from pool

  res.status(statusCode).json(health);
});
```

**Load Balancer Configuration:**

```yaml
# railway.json (Phase 2)
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "numReplicas": 2,
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 5
  }
}

# AWS ALB Target Group (Phase 3)
HealthCheck:
  Path: /health
  Protocol: HTTP
  Port: 3000
  Interval: 30 # seconds
  Timeout: 5 # seconds
  HealthyThresholdCount: 2
  UnhealthyThresholdCount: 3
  Matcher:
    HttpCode: 200

Deregistration:
  DrainDuration: 30 # seconds (allow in-flight requests to complete)

Algorithm: round_robin # or least_outstanding_requests

Stickiness:
  Enabled: false # Stateless design - no session affinity needed
```

---

### **10.4 Deployment Flow**

```
Developer                GitHub                 CI/CD                Production
    │                       │                      │                      │
    │  1. Push to branch    │                      │                      │
    │──────────────────────>│                      │                      │
    │                       │                      │                      │
    │                       │  2. Trigger pipeline │                      │
    │                       │─────────────────────>│                      │
    │                       │                      │                      │
    │                       │                      │  3. Run tests        │
    │                       │                      │  (unit, integration, │
    │                       │                      │   E2E, build)        │
    │                       │                      │                      │
    │                       │                      │  4. Tests pass? ──┐  │
    │                       │                      │                   │  │
    │                       │                      │  Yes              No │
    │                       │                      │  │                │  │
    │                       │                      │  ▼                ▼  │
    │                       │                      │  Deploy preview   ❌ │
    │                       │                      │  (Vercel)            │
    │                       │                      │  │                   │
    │                       │                      │  ▼                   │
    │  5. Review preview    │                      │                      │
    │<─────────────────────────────────────────────│                      │
    │                       │                      │                      │
    │  6. Approve PR        │                      │                      │
    │──────────────────────>│                      │                      │
    │                       │                      │                      │
    │                       │  7. Merge to main    │                      │
    │                       │─────────────────────>│                      │
    │                       │                      │                      │
    │                       │                      │  8. Deploy staging   │
    │                       │                      │──────────────────────>│
    │                       │                      │  (auto)              │
    │                       │                      │                      │
    │                       │                      │  9. Smoke tests      │
    │                       │                      │  (health check)      │
    │                       │                      │                      │
    │                       │                      │  10. Pass? ──┐       │
    │                       │                      │              │       │
    │                       │                      │  Yes         No      │
    │                       │                      │  │           │       │
    │                       │                      │  ▼           ▼       │
    │                       │                      │  Deploy prod Rollback│
    │                       │                      │──────────────────────>│
    │                       │                      │  (auto)      (auto)  │
    │                       │                      │                      │
    │                       │                      │  11. Health check    │
    │                       │                      │  (post-deploy)       │
    │                       │                      │                      │
    │                       │                      │  12. Pass? ──┐       │
    │                       │                      │              │       │
    │                       │                      │  Yes         No      │
    │                       │                      │  │           │       │
    │                       │                      │  ✅          Rollback│
    │                       │                      │                      │
```

**Rollback Strategy:**
- Automatic: If health check fails post-deployment
- Manual: One-click rollback (Vercel/Railway dashboard)
- Time: <2 minutes to previous version
- Verification: Health check confirms successful rollback

---

## **11. Error & Recovery Architecture**

### **11.1 Error Taxonomy**

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR CLASSIFICATION                        │
└─────────────────────────────────────────────────────────────────┘

L1: TRANSIENT ERRORS (Retry Automatically)
├─ Network timeouts (API calls, database queries)
├─ Rate limiting (429 errors)
├─ Temporary service unavailability (503 errors)
├─ Lock contention (database row locks)
└─ Recovery: Exponential backoff (1s, 2s, 4s, max 3 retries)

L2: RECOVERABLE ERRORS (User Action Required)
├─ Invalid file format (user uploaded wrong file)
├─ File too large (>2GB)
├─ Quota exceeded (free tier upload limit)
├─ Payment failed (expired card, insufficient funds)
└─ Recovery: Clear error message + suggested action

L3: PARTIAL FAILURES (Graceful Degradation)
├─ Parser extracted 90% of data (some records corrupted)
├─ Insight generation timed out (return cached or basic insights)
├─ Export generation failed (offer retry or alternative format)
├─ Visualization too large (auto-sample, warn user)
└─ Recovery: Partial success + degraded mode + user notification

L4: CRITICAL ERRORS (System Failure)
├─ Database unavailable (connection refused, server down)
├─ Redis unavailable (cache miss, fallback to database)
├─ File storage unavailable (R2 outage)
├─ Backend instance crash (ALB detects, routes to healthy)
└─ Recovery: Automated failover + alerting + incident response

L5: DATA INTEGRITY ERRORS (No Retry)
├─ Duplicate upload (same file already processed)
├─ Deleted graph referenced (foreign key constraint)
├─ Session expired (JWT invalid, user logged out)
├─ Authorization failed (user accessing another user's data)
└─ Recovery: Return error immediately, log security event
```

---

### **11.2 Error Handling Patterns**

**Pattern 1: Retry with Exponential Backoff**
```typescript
// /src/utils/retry.ts

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000, // 1 second
    maxDelay = 30000,    // 30 seconds
    backoffFactor = 2
  } = options;

  let delay = initialDelay;
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if error is not transient
      if (!isTransientError(error)) {
        throw error;
      }

      // Last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Log retry attempt
      logger.warn('Retrying after error', {
        attempt: attempt + 1,
        maxRetries,
        delay,
        error: error.message
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));

      // Exponential backoff
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError!;
}

function isTransientError(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND') {
    return true;
  }

  // HTTP errors (rate limiting, temporary unavailability)
  if (error.response?.status === 429 ||
      error.response?.status === 503) {
    return true;
  }

  // Database errors (lock contention)
  if (error.code === '40P01') { // PostgreSQL deadlock
    return true;
  }

  return false;
}
```

**Pattern 2: Circuit Breaker**
```typescript
// /src/utils/circuit-breaker.ts

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,      // Open after 5 failures
    private timeout: number = 60000,    // Stay open for 60 seconds
    private successThreshold: number = 2 // Close after 2 successes in half-open
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // Check if timeout elapsed
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();

      // Success in half-open state
      if (this.state === 'HALF_OPEN') {
        this.failures++;
        if (this.failures >= this.successThreshold) {
          this.state = 'CLOSED';
          this.failures = 0;
        }
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      // Open circuit if threshold reached
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
        logger.error('Circuit breaker opened', {
          failures: this.failures,
          threshold: this.threshold
        });
      }

      throw error;
    }
  }
}

// Usage example: Protect external API calls
const insightEngineCircuitBreaker = new CircuitBreaker(5, 60000);

export async function generateInsight(graphId: string) {
  return insightEngineCircuitBreaker.execute(async () => {
    // Heavy computation that might fail
    return await insightEngine.generate(graphId);
  });
}
```

**Pattern 3: Bulkhead Isolation**
```typescript
// /src/utils/bulkhead.ts

export class Bulkhead {
  private activeRequests = 0;

  constructor(
    private maxConcurrent: number = 10
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeRequests >= this.maxConcurrent) {
      throw new Error(`Bulkhead limit reached (${this.maxConcurrent})`);
    }

    this.activeRequests++;

    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }
}

// Usage: Limit concurrent PDF generations (CPU-intensive)
const pdfBulkhead = new Bulkhead(3); // Max 3 concurrent PDF generations

export async function generatePDF(graphId: string) {
  return pdfBulkhead.execute(async () => {
    return await puppeteer.generatePDF(graphId);
  });
}
```

---

### **11.3 Error Recovery Strategies by Component**

**Parser Failures:**
```typescript
// /workers/parser.worker.ts

async function parseFile(file: File, platform: string) {
  try {
    // 1. Detect parser version
    const version = await detectVersion(file, platform);

    // 2. Select parser
    const parser = selectParser(platform, version);

    // 3. Parse with error recovery
    const parsedData = await parser.parse(file, {
      onPartialSuccess: (data, errors) => {
        // Some records failed, but we got most of the data
        postMessage({
          type: 'PARTIAL_SUCCESS',
          data,
          errors,
          successRate: (data.length / (data.length + errors.length)) * 100
        });
      },
      onRecordError: (record, error) => {
        // Log individual record failures (don't fail entire parse)
        logger.warn('Record parse failed', { record, error });
      }
    });

    // 4. Validation
    if (parsedData.nodes.length === 0) {
      throw new Error('No valid data extracted. File may be corrupted or wrong format.');
    }

    // 5. Success
    postMessage({ type: 'RESULT', graph: buildGraph(parsedData) });

  } catch (error) {
    // Categorize error for user-friendly message
    const errorType = categorizeParserError(error);

    postMessage({
      type: 'ERROR',
      category: errorType,
      message: getUserFriendlyMessage(errorType),
      technicalDetails: error.message // For support team
    });
  }
}

function categorizeParserError(error: Error): string {
  if (error.message.includes('Invalid ZIP')) {
    return 'INVALID_FILE_FORMAT';
  }
  if (error.message.includes('No valid data')) {
    return 'EMPTY_OR_CORRUPTED';
  }
  if (error.message.includes('Unknown version')) {
    return 'UNSUPPORTED_VERSION';
  }
  return 'UNKNOWN_ERROR';
}

function getUserFriendlyMessage(errorType: string): string {
  const messages = {
    INVALID_FILE_FORMAT: 'This doesn\'t appear to be a valid Twitter/Instagram/LinkedIn export file. Please download your data from the platform and try again.',
    EMPTY_OR_CORRUPTED: 'The file appears to be empty or corrupted. Please re-download your data and try uploading again.',
    UNSUPPORTED_VERSION: 'This export format is not yet supported. We\'re working on it! Please contact support.',
    UNKNOWN_ERROR: 'Something went wrong while processing your file. Our team has been notified. Please try again or contact support.'
  };

  return messages[errorType] || messages.UNKNOWN_ERROR;
}
```

**Partial Graph Generation:**
```typescript
// /src/services/GraphService.ts

export class GraphService {
  async save(userId: string, graphData: GraphData) {
    try {
      // Validate graph completeness
      const quality = this.assessGraphQuality(graphData);

      if (quality.completeness < 0.5) {
        // Less than 50% of expected data → Critical failure
        throw new Error('Graph quality too low. Missing critical data.');
      }

      // Create graph with quality metadata
      const graph = await prisma.graph.create({
        data: {
          userId,
          platform: graphData.platform,
          nodeCount: graphData.nodes.length,
          edgeCount: graphData.edges.length,
          graphData: {
            ...graphData,
            metadata: {
              quality: quality.completeness,
              warnings: quality.warnings,
              dataCompleteness: quality.completeness < 0.8
                ? 'PARTIAL'
                : 'COMPLETE'
            }
          },
          graphSizeBytes: JSON.stringify(graphData).length,
          isLatest: true
        }
      });

      // Notify user if partial
      if (quality.completeness < 0.8) {
        await this.notifyPartialGraph(userId, quality.warnings);
      }

      return graph;

    } catch (error) {
      // Log error with context
      logger.error('Graph save failed', {
        userId,
        platform: graphData.platform,
        nodeCount: graphData.nodes.length,
        error: error.message
      });

      throw error;
    }
  }

  private assessGraphQuality(graphData: GraphData): {
    completeness: number;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let completeness = 1.0;

    // Check for expected data
    if (graphData.nodes.length === 0) {
      warnings.push('No nodes found');
      completeness -= 0.5;
    }

    if (graphData.edges.length === 0) {
      warnings.push('No connections found');
      completeness -= 0.3;
    }

    // Check for metadata quality
    const nodesWithMetadata = graphData.nodes.filter(n => n.label).length;
    if (nodesWithMetadata / graphData.nodes.length < 0.5) {
      warnings.push('Missing metadata for many nodes');
      completeness -= 0.2;
    }

    return { completeness: Math.max(0, completeness), warnings };
  }

  private async notifyPartialGraph(userId: string, warnings: string[]) {
    // Send email notification
    await emailService.send({
      to: userId,
      subject: 'Graph uploaded with warnings',
      body: `
        Your network graph was uploaded successfully, but with some warnings:
        ${warnings.map(w => `- ${w}`).join('\n')}

        You can still visualize and analyze your network, but some features may be limited.
        If this persists, please contact support.
      `
    });
  }
}
```

**API/Database Outages:**
```typescript
// /src/middleware/error-handler.ts

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error with full context
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    body: req.body
  });

  // Categorize error
  if (err.name === 'PrismaClientKnownRequestError') {
    return handleDatabaseError(err, res);
  }

  if (err.name === 'RedisError') {
    return handleCacheError(err, res);
  }

  if (err.name === 'ValidationError') {
    return handleValidationError(err, res);
  }

  // Generic error response
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong. Our team has been notified.',
    requestId: req.id, // For support ticket tracking
    timestamp: new Date().toISOString()
  });
}

function handleDatabaseError(err: any, res: Response) {
  // Connection errors
  if (err.code === 'P1001') {
    return res.status(503).json({
      error: 'Database temporarily unavailable',
      message: 'Our database is experiencing issues. Please try again in a few moments.',
      retryAfter: 60 // seconds
    });
  }

  // Constraint violations
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'This record already exists.',
      field: err.meta?.target
    });
  }

  // Foreign key violations
  if (err.code === 'P2003') {
    return res.status(404).json({
      error: 'Referenced record not found',
      message: 'The requested resource does not exist or has been deleted.'
    });
  }

  // Generic database error
  return res.status(500).json({
    error: 'Database error',
    message: 'A database error occurred. Please try again.'
  });
}

function handleCacheError(err: any, res: Response) {
  // Redis unavailable → Degrade gracefully (continue without cache)
  logger.warn('Redis unavailable, continuing without cache', { error: err.message });

  // Don't fail the request, just skip caching
  // The request handler will fall back to database

  return res.status(503).json({
    error: 'Cache unavailable',
    message: 'Operating in degraded mode. Performance may be slower than usual.',
    degraded: true
  });
}
```

**Fallback Visualization Modes:**
```typescript
// /components/visualization/GraphCanvas.tsx

export function GraphCanvas({ graph }: { graph: Graph }) {
  const [renderMode, setRenderMode] = useState<'svg' | 'canvas' | 'sampled'>('svg');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Detect appropriate render mode based on node count
      if (graph.nodes.length < 1000) {
        setRenderMode('svg'); // High quality, interactive
      } else if (graph.nodes.length < 5000) {
        setRenderMode('canvas'); // Performance optimized
      } else {
        setRenderMode('sampled'); // Heavily sampled (show subset)
      }

      // Attempt render
      renderGraph(graph, renderMode);

    } catch (err) {
      // Rendering failed → Try degraded mode
      logger.error('Graph rendering failed', {
        nodeCount: graph.nodes.length,
        renderMode,
        error: err
      });

      if (renderMode !== 'sampled') {
        // Fall back to sampled mode
        setRenderMode('sampled');
        setError('Network too large for full rendering. Showing representative sample.');

        // Sample graph (top 1000 most connected nodes)
        const sampledGraph = sampleGraph(graph, 1000);
        renderGraph(sampledGraph, 'sampled');
      } else {
        // Even sampled mode failed → Show error
        setError('Unable to visualize this network. It may be too large or complex. Please contact support.');
      }
    }
  }, [graph, renderMode]);

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return <svg ref={svgRef} />;
}

function sampleGraph(graph: Graph, maxNodes: number): Graph {
  // Sample by degree (keep most connected nodes)
  const sortedNodes = graph.nodes.sort((a, b) => b.degree - a.degree);
  const sampledNodes = sortedNodes.slice(0, maxNodes);
  const sampledNodeIds = new Set(sampledNodes.map(n => n.id));

  // Keep edges between sampled nodes
  const sampledEdges = graph.edges.filter(
    e => sampledNodeIds.has(e.source) && sampledNodeIds.has(e.target)
  );

  return {
    nodes: sampledNodes,
    edges: sampledEdges,
    metadata: {
      ...graph.metadata,
      sampled: true,
      sampleRate: maxNodes / graph.nodes.length
    }
  };
}
```

---

### **11.4 Error Recovery Decision Tree**

```
ERROR OCCURS
    │
    ▼
┌───────────────────────┐
│ Is error transient?   │
│ (network, rate limit) │
└───────────────────────┘
    │           │
   Yes          No
    │           │
    ▼           ▼
┌─────────┐  ┌───────────────────────┐
│ RETRY   │  │ Is error recoverable? │
│ (3x)    │  │ (user can fix)        │
└─────────┘  └───────────────────────┘
    │               │           │
    │              Yes          No
    │               │           │
    ▼               ▼           ▼
┌─────────┐  ┌─────────────┐  ┌──────────────────┐
│ Success?│  │ Show clear  │  │ Is it partial    │
│         │  │ error msg + │  │ failure?         │
│         │  │ action      │  │ (some data good) │
└─────────┘  └─────────────┘  └──────────────────┘
    │               │               │           │
   Yes             No              Yes          No
    │               │               │           │
    ▼               ▼               ▼           ▼
┌─────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PROCEED │  │ LOG ERROR   │  │ DEGRADE     │  │ ALERT +     │
│         │  │ ALERT TEAM  │  │ GRACEFULLY  │  │ FAILOVER    │
│         │  │ SHOW SUPPORT│  │ NOTIFY USER │  │ (critical)  │
└─────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## **10.5 Error Taxonomy & Recovery Patterns**

### **10.5.1 Error Classification**

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR CLASSIFICATION                        │
└─────────────────────────────────────────────────────────────────┘

1. CLIENT ERRORS (4xx) - User Action Required
├─ 400 Bad Request: Invalid input (validation failed)
├─ 401 Unauthorized: Authentication required
├─ 403 Forbidden: Insufficient permissions (tier gating)
├─ 404 Not Found: Resource doesn't exist
├─ 413 Payload Too Large: File size exceeded (>2GB)
├─ 429 Too Many Requests: Rate limit exceeded
└─ Recovery: Display clear message, suggest correction

2. SERVER ERRORS (5xx) - System Issue
├─ 500 Internal Server Error: Unexpected exception
├─ 502 Bad Gateway: Upstream service unavailable
├─ 503 Service Unavailable: System overloaded or maintenance
├─ 504 Gateway Timeout: Request exceeded time limit (30s)
└─ Recovery: Automatic retry with exponential backoff

3. PARSER ERRORS - Data Format Issues
├─ UNSUPPORTED_FORMAT: Platform export format unrecognized
├─ CORRUPTED_FILE: ZIP extraction failed
├─ VERSION_MISMATCH: Parser version incompatible
├─ INCOMPLETE_DATA: Required files missing
└─ Recovery: Suggest re-download export, provide documentation link

4. GRAPH ERRORS - Analysis Failures
├─ INSUFFICIENT_DATA: Too few nodes/edges for analysis (<10 nodes)
├─ MEMORY_EXCEEDED: Graph too large for client processing
├─ ALGORITHM_TIMEOUT: Community detection exceeded time limit
├─ INVALID_STRUCTURE: Graph has no edges (isolated nodes only)
└─ Recovery: Suggest server-side fallback, enable sampling

5. EXTERNAL SERVICE ERRORS - Third-Party Failures
├─ DATABASE_UNAVAILABLE: PostgreSQL connection lost
├─ CACHE_UNAVAILABLE: Redis connection lost
├─ STORAGE_UNAVAILABLE: R2 upload/download failed
├─ EMAIL_FAILED: Magic link send failed (Resend API)
├─ PAYMENT_FAILED: Stripe webhook processing failed
└─ Recovery: Graceful degradation, queue for retry, alert ops team
```

---

### **10.5.2 Recovery Decision Tree**

```
                        Error Detected
                              │
                              ▼
                    ┌─────────────────┐
                    │ Classify Error  │
                    │ (Taxonomy above)│
                    └─────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │Client 4xx │  │Server 5xx │  │Parser Err │
        └───────────┘  └───────────┘  └───────────┘
                │             │             │
                ▼             ▼             ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │Display    │  │Retry with │  │Version    │
        │Clear      │  │Exponential│  │Detection  │
        │Message    │  │Backoff    │  │Retry      │
        └───────────┘  └───────────┘  └───────────┘
                │             │             │
                ▼             ▼             ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │Suggest    │  │Max 3      │  │Fallback   │
        │Correction │  │Retries    │  │to Generic │
        │           │  │           │  │Parser     │
        └───────────┘  └───────────┘  └───────────┘
                │             │             │
                ▼             ▼             ▼
        User corrects   Success/Fail   Success/Fail
        and retries                           │
                                              ▼
                                        ┌───────────┐
                                        │Manual     │
                                        │Intervention│
                                        │(Support)  │
                                        └───────────┘

SPECIAL CASES:

Graph Too Large (Memory Exceeded):
├─ 1. Detect: Monitor heap usage during parsing
├─ 2. Warn: "Your network is very large (10K+ nodes)"
├─ 3. Offer: "Process on server?" (opt-in, Pro tier)
├─ 4. Fallback: Auto-enable sampling (reduce to 5K nodes)
└─ 5. Notify: "Showing sample - upgrade for full analysis"

Database Unavailable:
├─ 1. Detect: Health check fails, connection error
├─ 2. Cache: Serve cached data (Redis) if available
├─ 3. Degrade: Disable features requiring DB writes
├─ 4. Alert: PagerDuty notification to ops team
├─ 5. Retry: Automatic reconnection (exponential backoff)
└─ 6. Recover: Resume normal operations when DB returns

Upload Interruption (Network Failure):
├─ 1. Detect: Tus client connection lost
├─ 2. Preserve: Save upload state in localStorage
├─ 3. Resume: Tus protocol resumes from last chunk
├─ 4. UI: Show "Resuming upload..." message
└─ 5. Timeout: After 5 minutes, prompt user to restart

Insight Generation Timeout:
├─ 1. Detect: Algorithm exceeds 30s timeout
├─ 2. Terminate: Kill long-running process
├─ 3. Fallback: Return basic metrics only (no templates)
├─ 4. Log: Record graph characteristics (size, density)
├─ 5. Optimize: Add graph to manual review queue
└─ 6. Notify: "Analysis taking longer than expected - basic insights shown"
```

---

### **10.5.3 Graceful Degradation Implementation**

```typescript
// /src/middleware/graceful-degradation.ts

/**
 * Graceful Degradation Middleware
 *
 * When dependencies fail, degrade functionality rather than fail completely
 */

interface SystemState {
  database: boolean;
  redis: boolean;
  storage: boolean;
}

let systemState: SystemState = {
  database: true,
  redis: true,
  storage: true
};

// Health monitor (runs every 30s)
setInterval(async () => {
  systemState = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage()
  };

  if (!systemState.database || !systemState.redis) {
    logger.error('System degraded', { state: systemState });
    // Alert ops team via PagerDuty
    alertOpsTeam('DEGRADED', systemState);
  }
}, 30000);

export function degradationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Attach system state to request
  req.systemState = systemState;

  // If critical systems down, return 503
  if (!systemState.database) {
    return res.status(503).json({
      error: 'SERVICE_UNAVAILABLE',
      message: 'System is temporarily unavailable. Please try again in a few minutes.',
      retryAfter: 60 // seconds
    });
  }

  // If Redis down, continue without cache (slower but functional)
  if (!systemState.redis) {
    req.cacheAvailable = false;
    logger.warn('Cache unavailable, serving without cache', {
      path: req.path,
      method: req.method
    });
  }

  next();
}

// Service-level degradation
export class InsightEngine {
  async generate(graphId: string): Promise<Insight[]> {
    try {
      // Normal path: Use full algorithm suite
      return await this.generateFull(graphId);
    } catch (error) {
      if (error.code === 'TIMEOUT') {
        // Degraded path: Return basic metrics only
        logger.warn('Insight generation timeout, returning basic metrics', {
          graphId,
          error: error.message
        });
        return await this.generateBasic(graphId);
      }

      if (error.code === 'MEMORY_EXCEEDED') {
        // Degraded path: Sample graph and retry
        logger.warn('Graph too large, sampling and retrying', {
          graphId,
          originalSize: error.nodeCount
        });
        const sampled = await this.sampleGraph(graphId, 5000);
        return await this.generateFull(sampled);
      }

      // Unrecoverable error
      throw error;
    }
  }

  private async generateBasic(graphId: string): Promise<Insight[]> {
    // Fallback: Return only basic graph metrics (no templates)
    const graph = await this.graphRepo.getById(graphId);
    const metrics = {
      nodeCount: graph.data.nodes.length,
      edgeCount: graph.data.edges.length,
      avgDegree: (graph.data.edges.length * 2) / graph.data.nodes.length
    };

    return [{
      id: uuid(),
      graphId,
      category: 'basic_metrics',
      narrative: `Your network has ${metrics.nodeCount} connections with an average of ${metrics.avgDegree.toFixed(1)} connections each.`,
      confidence: 'high',
      actions: [],
      createdAt: new Date()
    }];
  }
}
```

---

## **11. Observability Architecture**

## **11. Observability Architecture** (ENHANCED)

### **11.1 Monitoring Stack (Detailed)**

```
┌─────────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: METRICS (What is happening?)
├─ Tool: Prometheus + Grafana (or Datadog)
├─ Collection: Pull-based (Prometheus) or Push-based (Datadog)
├─ Retention: 15 days (Prometheus), 1 year (Datadog)
└─ Dashboards: Real-time + historical trends

LAYER 2: LOGS (Why did it happen?)
├─ Tool: Sentry Breadcrumbs (or ELK Stack)
├─ Format: Structured JSON (Winston/Pino)
├─ Retention: 30 days hot, 90 days archive
└─ Search: Full-text + filters (user ID, error type, time range)

LAYER 3: TRACES (How did it happen?)
├─ Tool: Sentry Performance (or Datadog APM)
├─ Sampling: 100% (Phase 0-2), 10% (Phase 3+)
├─ Retention: 7 days (full traces), 90 days (aggregated)
└─ Visualization: Waterfall charts, flame graphs

LAYER 4: ALERTS (When does it need attention?)
├─ Tool: PagerDuty + Slack
├─ Severity: Critical, Warning, Info
├─ Routing: On-call rotation (critical), team channel (warning)
└─ Escalation: 5 min (critical), 30 min (warning)

LAYER 5: UPTIME (Is it accessible?)
├─ Tool: UptimeRobot
├─ Checks: 1-minute interval, 5 global locations
├─ Status page: Public (status.visualsocialgraph.com)
└─ SLA tracking: 99.9% uptime target (Phase 3+)
```

---

### **11.2 Metrics Exposition**

**Custom Metrics (Prometheus format):**
```typescript
// /src/utils/metrics.ts

import client from 'prom-client';

// Register default metrics (CPU, memory, event loop lag)
client.collectDefaultMetrics({ timeout: 5000 });

// Custom application metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Buckets for histogram
});

export const graphProcessingDuration = new client.Histogram({
  name: 'graph_processing_duration_seconds',
  help: 'Time to process uploaded graph',
  labelNames: ['platform', 'node_count_bucket'],
  buckets: [1, 5, 10, 30, 60, 120] // seconds
});

export const insightGenerationDuration = new client.Histogram({
  name: 'insight_generation_duration_seconds',
  help: 'Time to generate insights (algorithm-first)',
  labelNames: ['category', 'node_count_bucket'],
  buckets: [0.1, 0.5, 1, 2, 5] // Target: <500ms
});

export const templateMatcherHitRate = new client.Counter({
  name: 'template_matcher_hits_total',
  help: 'Number of template matches by category',
  labelNames: ['category', 'confidence']
});

export const cacheHitRate = new client.Counter({
  name: 'cache_hits_total',
  help: 'Number of cache hits',
  labelNames: ['cache_type'] // redis, browser
});

export const cacheMissRate = new client.Counter({
  name: 'cache_misses_total',
  help: 'Number of cache misses',
  labelNames: ['cache_type']
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['type'] // database, redis, http
});

export const graphSizeBytes = new client.Histogram({
  name: 'graph_size_bytes',
  help: 'Size of stored graphs in bytes',
  labelNames: ['platform'],
  buckets: [1e5, 5e5, 1e6, 5e6, 1e7] // 100KB to 10MB
});

// Expose metrics endpoint
export function metricsEndpoint(req: Request, res: Response) {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
}
```

**Instrumentation Example:**
```typescript
// /src/routes/graphs.routes.ts

router.post('/graphs', async (req, res) => {
  const timer = httpRequestDuration.startTimer();

  try {
    const graph = await graphService.save(req.user.id, req.body);

    // Record metrics
    timer({ method: 'POST', route: '/graphs', status_code: 201 });
    graphSizeBytes.observe(
      { platform: graph.platform },
      graph.graphSizeBytes
    );

    res.status(201).json(graph);

  } catch (error) {
    timer({ method: 'POST', route: '/graphs', status_code: 500 });
    throw error;
  }
});
```

---

### **11.3 Alerting Rules**

**Critical Alerts (PagerDuty):**
```yaml
# /config/alerts.yml

alerts:
  - name: DatabaseDown
    condition: up{job="postgresql"} == 0
    duration: 1m
    severity: critical
    message: "PostgreSQL database is down for 1 minute"
    action: "Check database logs, restart if needed"

  - name: HighErrorRate
    condition: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
    duration: 5m
    severity: critical
    message: "Error rate >5% for 5 minutes"
    action: "Check Sentry for error details, rollback if recent deployment"

  - name: APILatencyHigh
    condition: histogram_quantile(0.95, http_request_duration_seconds) > 2
    duration: 5m
    severity: critical
    message: "API p95 latency >2s for 5 minutes"
    action: "Check slow query log, database connections, CPU usage"

  - name: DiskSpaceAlmostFull
    condition: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
    duration: 5m
    severity: critical
    message: "Disk space <10% available"
    action: "Clean up logs, old exports, consider scaling storage"

# Warning Alerts (Slack)
  - name: SlowQueries
    condition: rate(slow_queries_total[5m]) > 10
    duration: 5m
    severity: warning
    message: "More than 10 slow queries (>1s) detected in 5 minutes"
    action: "Review query logs, add indexes if needed"

  - name: CacheMissRateHigh
    condition: rate(cache_misses_total[5m]) / rate(cache_hits_total[5m]) > 0.5
    duration: 10m
    severity: warning
    message: "Cache miss rate >50% for 10 minutes"
    action: "Check Redis health, consider cache warming"

  - name: MemoryUsageHigh
    condition: node_memory_Active_bytes / node_memory_MemTotal_bytes > 0.85
    duration: 10m
    severity: warning
    message: "Memory usage >85% for 10 minutes"
    action: "Check for memory leaks, consider scaling up"
```

---

### **11.4 Distributed Tracing (Insight Generation)**

**Trace Spans Structure:**
```
Trace: Generate Insights (Total: 450ms)
├─ Span 1: Fetch Graph from Database (80ms)
│  ├─ Query: SELECT * FROM graphs WHERE id = ?
│  ├─ Rows returned: 1
│  └─ Graph size: 1.2MB (5000 nodes, 12000 edges)
│
├─ Span 2: Graph Analysis (200ms)
│  ├─ Span 2.1: Louvain Community Detection (100ms)
│  │  ├─ Modularity: 0.65
│  │  └─ Communities found: 8
│  ├─ Span 2.2: Betweenness Centrality (60ms)
│  │  └─ Bridges identified: 15
│  ├─ Span 2.3: PageRank (30ms)
│  │  └─ Top influencers: 10
│  └─ Span 2.4: Echo Score Calculation (10ms)
│     └─ Echo score: 0.67
│
├─ Span 3: Statistical Profiling (40ms)
│  ├─ Engagement distribution (20ms)
│  └─ Correlations (20ms)
│
├─ Span 4: Template Matching (30ms)
│  ├─ Templates evaluated: 30
│  ├─ Matches found: 5
│  └─ Top match: "echo_chamber" (score: 0.85)
│
├─ Span 5: Template Interpolation (20ms)
│  ├─ Variables substituted: 8
│  └─ Variant selected: #2 (A/B testing)
│
├─ Span 6: Action Generation (30ms)
│  ├─ Actions generated: 3
│  └─ Prioritized by impact
│
└─ Span 7: Cache Result (50ms)
   ├─ Write to Redis (30ms)
   └─ Write to PostgreSQL (20ms)
```

**Implementation:**
```typescript
// /src/services/InsightEngine.ts

import * as Sentry from '@sentry/node';

export class InsightEngine {
  async generate(graphId: string): Promise<Insight[]> {
    // Start parent span
    return Sentry.startSpan(
      {
        name: 'insight_engine.generate',
        op: 'function',
        attributes: { graphId }
      },
      async (parentSpan) => {
        // Span 1: Fetch graph
        const graph = await Sentry.startSpan(
          { name: 'fetch_graph', op: 'db.query' },
          async () => {
            const g = await this.graphRepo.getById(graphId);
            parentSpan.setAttributes({
              'graph.nodeCount': g.nodeCount,
              'graph.edgeCount': g.edgeCount,
              'graph.sizeBytes': g.graphSizeBytes
            });
            return g;
          }
        );

        // Span 2: Analyze graph
        const metrics = await Sentry.startSpan(
          { name: 'graph_analysis', op: 'compute' },
          async (span) => {
            const result = this.graphAnalyzer.analyze(graph.data);
            span.setAttributes({
              'analysis.modularity': result.modularity,
              'analysis.communities': result.communities.length,
              'analysis.bridges': result.bridgeCount
            });
            return result;
          }
        );

        // Span 3: Statistical profile
        const profile = await Sentry.startSpan(
          { name: 'statistical_profiling', op: 'compute' },
          async () => this.statisticalProfiler.profile(graph.data)
        );

        // Span 4: Match templates
        const matched = await Sentry.startSpan(
          { name: 'template_matching', op: 'compute' },
          async (span) => {
            const result = await this.templateMatcher.match({...metrics, ...profile});
            span.setAttributes({
              'templates.evaluated': 30,
              'templates.matched': result.length
            });
            return result;
          }
        );

        // Span 5: Interpolate
        const insights = matched.map(m =>
          this.templateInterpolator.interpolate(m)
        );

        // Span 6: Generate actions
        insights.forEach(insight => {
          insight.actions = this.actionGenerator.generate(
            insight.category,
            metrics,
            profile
          );
        });

        // Span 7: Cache
        await Sentry.startSpan(
          { name: 'cache_result', op: 'cache.set' },
          async () => {
            await this.insightRepo.create(insights);
          }
        );

        return insights;
      }
    );
  }
}
```

---

### **11.5 Monitoring Dashboards**

**Dashboard 1: System Health**
```
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM HEALTH DASHBOARD                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│ Request Rate     │ Error Rate       │ Latency (p95)            │
│ 125 req/s        │ 0.8% (target<1%) │ 420ms (target <500ms) ✓  │
│ ↑ 15% vs 1h ago  │ ↓ 0.2% vs 1h ago │ ↓ 80ms vs 1h ago         │
└──────────────────┴──────────────────┴──────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Active Instances: 3                                              │
│ ██████████████████ Instance 1 (CPU: 45%, Mem: 62%)              │
│ ████████████████ Instance 2 (CPU: 38%, Mem: 58%)                │
│ █████████████████ Instance 3 (CPU: 42%, Mem: 60%)               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Database Health                                                  │
│ ├─ Connections: 45/300 (15% utilization) ✓                      │
│ ├─ Slow queries: 3 in last hour (acceptable)                    │
│ ├─ Disk usage: 28GB/100GB (28%) ✓                               │
│ └─ Replication lag: <10ms ✓                                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Redis Health                                                     │
│ ├─ Memory: 1.2GB/4GB (30%) ✓                                    │
│ ├─ Cache hit rate: 85% (target >80%) ✓                          │
│ ├─ Evictions: 120 in last hour (acceptable)                     │
│ └─ Cluster status: All nodes healthy ✓                          │
└──────────────────────────────────────────────────────────────────┘
```

**Dashboard 2: Business Metrics**
```
┌─────────────────────────────────────────────────────────────────┐
│                   BUSINESS METRICS DASHBOARD                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│ Active Users     │ Uploads Today    │ Insights Generated       │
│ 342 (24h)        │ 89               │ 267                      │
│ ↑ 12% vs yest    │ ↑ 8% vs yest     │ ↑ 15% vs yest            │
└──────────────────┴──────────────────┴──────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Upload Success Rate: 94% (target >95%)                           │
│ ██████████████████████████████████████░░░░░░ 94%                │
│ Top failure reason: Invalid file format (3%)                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Algorithm-First Insight Engine Performance                       │
│ ├─ Average generation time: 380ms (target <500ms) ✓             │
│ ├─ Template match rate: 98% (graphs with ≥1 match) ✓            │
│ ├─ Top categories: echo_chamber (35%), bridge_accounts (28%)    │
│ └─ User satisfaction: 4.2/5.0 (from feedback)                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Export Usage                                                     │
│ ├─ PDFs: 42 today (avg 3.2 minutes generation time)             │
│ ├─ Social cards: 78 today (avg 1.8 seconds)                     │
│ └─ Data exports: 15 today (CSV/JSON)                            │
└──────────────────────────────────────────────────────────────────┘
```

**Dashboard 3: Algorithm Performance**
```
┌─────────────────────────────────────────────────────────────────┐
│              ALGORITHM-FIRST PERFORMANCE DASHBOARD               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Graph Analysis (Last 100 Runs)                                  │
│ ├─ Louvain (community detection): 120ms avg, 98% <200ms         │
│ ├─ Betweenness (bridge finding): 85ms avg, 95% <150ms           │
│ ├─ PageRank (influence): 45ms avg, 99% <100ms                   │
│ └─ Echo score (homogeneity): 12ms avg, 100% <50ms               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Template Matcher (Last 100 Insights)                            │
│ ├─ Templates evaluated: 30 avg                                  │
│ ├─ Match time: 28ms avg (target <50ms) ✓                        │
│ ├─ Matches per graph: 3.2 avg                                   │
│ └─ Confidence distribution: High 45%, Medium 38%, Low 17%       │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Template Quality (User Feedback)                                │
│ ├─ Overall rating: 4.2/5.0 (target ≥4.0) ✓                      │
│ ├─ Best performer: bridge_accounts (4.5/5.0)                    │
│ ├─ Needs improvement: growth_opportunities (3.8/5.0)            │
│ └─ Feedback volume: 127 ratings (24h)                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Cost Comparison (Algorithm-First vs AI-Dependent)               │
│ ├─ Current cost: $0/request (infrastructure only) ✓             │
│ ├─ If AI-dependent: ~$0.02/request × 267 = $5.34 today          │
│ ├─ Monthly savings: ~$160 (vs hypothetical AI approach)         │
│ └─ Gross margin: 98.3% (vs 96.7% if AI-dependent)               │
└──────────────────────────────────────────────────────────────────┘
```

---

### **11.6 Log Aggregation & Search**

**Structured Logging Format:**
```json
{
  "timestamp": "2025-12-21T14:32:15.234Z",
  "level": "info",
  "service": "vsg-api",
  "environment": "production",
  "requestId": "req_abc123",
  "userId": "user_xyz789",
  "event": "insight_generated",
  "duration": 450,
  "metadata": {
    "graphId": "graph_123",
    "platform": "twitter",
    "nodeCount": 5000,
    "insightCategories": ["echo_chamber", "bridge_accounts"],
    "templateMatchTime": 28
  }
}
```

**Common Log Queries:**
```
// Find all errors for a specific user (last 24 hours)
level:error AND userId:user_xyz789 AND timestamp:[now-24h TO now]

// Find slow insight generation (>1s)
event:insight_generated AND duration:>1000

// Find parser failures by platform
event:parser_error AND metadata.platform:instagram

// Find all database errors
level:error AND (event:*database* OR event:*prisma*)

// Track a specific request through distributed system
requestId:req_abc123
```

---

This enhanced observability architecture provides comprehensive visibility into system health, business metrics, algorithm performance, and operational issues. The metrics, alerting rules, and dashboards are implementation-ready and aligned with the algorithm-first approach.

---

## **11. Observability Architecture**

### **11.1 Monitoring Stack**

```
Error Tracking:
├─ Tool: Sentry
├─ Coverage: Frontend + Backend
├─ Alerts: Critical errors → PagerDuty/Slack
└─ Review: Weekly error analysis meeting

Performance Monitoring:
├─ Tool: Sentry Performance (or Datadog APM)
├─ Metrics: Response time (p50, p95, p99), throughput
├─ Alerts: p95 >500ms → Slack notification
└─ Dashboards: Real-time metrics, historical trends

Analytics:
├─ Tool: PostHog (privacy-friendly)
├─ Tracking: User actions, feature usage
├─ Privacy: Anonymized, no PII
└─ Purpose: Product analytics, A/B testing

Logs:
├─ Format: Structured JSON (Winston/Pino)
├─ Levels: ERROR, WARN, INFO, DEBUG
├─ Retention: 30 days hot, 90 days archive
└─ Search: Sentry breadcrumbs (Phase 0-2), Elasticsearch (Phase 3+)

Uptime Monitoring:
├─ Tool: UptimeRobot
├─ Frequency: 1-minute checks (5 locations)
├─ Alerts: >5 minute outage → PagerDuty
└─ Status page: Public (Phase 2+)

Real User Monitoring (RUM):
├─ Tool: Vercel Analytics + Sentry
├─ Metrics: Core Web Vitals, page load times
├─ Sampling: 100% (small user base initially)
└─ Alerts: LCP >4s → investigation
```

---

### **11.2 Metrics Exposure (Prometheus Format)**

```typescript
// /src/middleware/metrics.ts

import { register, Counter, Histogram, Gauge } from 'prom-client';

/**
 * Metrics exposed at GET /metrics (Prometheus format)
 */

// ═══════════════════════════════════════════════════════════════
// HTTP METRICS
// ═══════════════════════════════════════════════════════════════

// Request counters
const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Response time histogram
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10] // seconds
});

// Active connections gauge
const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// ═══════════════════════════════════════════════════════════════
// BUSINESS METRICS
// ═══════════════════════════════════════════════════════════════

// Upload metrics
const uploadTotal = new Counter({
  name: 'uploads_total',
  help: 'Total file uploads',
  labelNames: ['platform', 'status'] // status: success, failed
});

const parserDuration = new Histogram({
  name: 'parser_duration_seconds',
  help: 'Parser execution time',
  labelNames: ['platform', 'version'],
  buckets: [1, 5, 10, 30, 60, 120] // seconds
});

const graphSize = new Histogram({
  name: 'graph_size_nodes',
  help: 'Number of nodes in parsed graphs',
  labelNames: ['platform'],
  buckets: [10, 50, 100, 500, 1000, 5000, 10000]
});

// Insight Engine metrics
const insightGeneration = new Histogram({
  name: 'insight_generation_duration_seconds',
  help: 'Insight Engine execution time',
  labelNames: ['category'],
  buckets: [0.1, 0.5, 1, 2, 5] // seconds
});

const templateMatches = new Counter({
  name: 'template_matches_total',
  help: 'Total template matches',
  labelNames: ['category', 'confidence']
});

const algorithmDuration = new Histogram({
  name: 'algorithm_duration_seconds',
  help: 'Graph algorithm execution time',
  labelNames: ['algorithm'], // louvain, betweenness, pagerank
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]
});

// ═══════════════════════════════════════════════════════════════
// DATABASE METRICS
// ═══════════════════════════════════════════════════════════════

const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['operation'], // SELECT, INSERT, UPDATE, DELETE
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1]
});

const dbConnections = new Gauge({
  name: 'db_connections_active',
  help: 'Active database connections'
});

const dbErrors = new Counter({
  name: 'db_errors_total',
  help: 'Total database errors',
  labelNames: ['type'] // connection, timeout, query
});

// ═══════════════════════════════════════════════════════════════
// CACHE METRICS
// ═══════════════════════════════════════════════════════════════

const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['key_prefix'] // graph, insight, template
});

const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['key_prefix']
});

const cacheLatency = new Histogram({
  name: 'cache_operation_duration_seconds',
  help: 'Cache operation latency',
  labelNames: ['operation'], // get, set, delete
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1]
});

// Export metrics endpoint
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Middleware to record metrics
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  // Increment active connections
  activeConnections.inc();

  res.on('finish', () => {
    // Record request
    httpRequestTotal.inc({
      method: req.method,
      path: sanitizePath(req.path), // Remove IDs for cardinality
      status: res.statusCode
    });

    // Record duration
    const duration = (Date.now() - start) / 1000; // seconds
    httpRequestDuration.observe({
      method: req.method,
      path: sanitizePath(req.path),
      status: res.statusCode
    }, duration);

    // Decrement active connections
    activeConnections.dec();
  });

  next();
}

function sanitizePath(path: string): string {
  // Replace UUIDs with :id to reduce cardinality
  return path.replace(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    ':id'
  );
}

// Example usage in services
export class GraphAnalyzer {
  async analyze(graph: Graph): Promise<GraphMetrics> {
    const timer = algorithmDuration.startTimer({ algorithm: 'louvain' });
    try {
      const communities = await this.detectCommunities(graph);
      timer();
      return communities;
    } catch (error) {
      timer();
      throw error;
    }
  }
}
```

---

### **11.3 Distributed Tracing (Sentry)**

```typescript
// /src/middleware/tracing.ts

import * as Sentry from '@sentry/node';

/**
 * Distributed tracing for request flows
 *
 * Traces:
 * 1. Upload → Parse → Store
 * 2. Request Insights → Analyze → Match → Interpolate → Return
 * 3. Generate Export → Render → Upload to R2 → Return URL
 */

export function initializeTracing() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0, // 100% during Phase 0-2, reduce to 0.1 (10%) at scale
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
  });
}

// Trace upload flow
export async function handleUpload(req: Request, res: Response) {
  const transaction = Sentry.startTransaction({
    op: 'upload',
    name: 'File Upload Flow'
  });

  try {
    // Span 1: Receive file
    const receiveSpan = transaction.startChild({
      op: 'file.receive',
      description: 'Receive file from client'
    });
    const file = await receiveFile(req);
    receiveSpan.finish();

    // Span 2: Validate
    const validateSpan = transaction.startChild({
      op: 'file.validate',
      description: 'Validate file format'
    });
    await validateFile(file);
    validateSpan.finish();

    // Span 3: Store
    const storeSpan = transaction.startChild({
      op: 'file.store',
      description: 'Upload to R2'
    });
    const url = await storeFile(file);
    storeSpan.finish();

    res.json({ url });
  } catch (error) {
    transaction.setStatus('internal_error');
    Sentry.captureException(error);
    throw error;
  } finally {
    transaction.finish();
  }
}

// Trace insight generation flow (Algorithm-First)
export async function generateInsights(graphId: string) {
  const transaction = Sentry.startTransaction({
    op: 'insights',
    name: 'Insight Generation Flow (Algorithm-First)'
  });

  Sentry.configureScope(scope => {
    scope.setTag('graph_id', graphId);
  });

  try {
    // Span 1: Fetch graph
    const fetchSpan = transaction.startChild({
      op: 'db.query',
      description: 'Fetch graph from database'
    });
    const graph = await graphRepo.getById(graphId);
    fetchSpan.setData('node_count', graph.data.nodes.length);
    fetchSpan.finish();

    // Span 2: Analyze graph (Algorithm-First)
    const analyzeSpan = transaction.startChild({
      op: 'algorithm.analyze',
      description: 'Run graph algorithms (Louvain, Betweenness, PageRank)'
    });
    const metrics = await graphAnalyzer.analyze(graph);
    analyzeSpan.setData('communities', metrics.communities.length);
    analyzeSpan.setData('bridges', metrics.bridges.length);
    analyzeSpan.finish();

    // Span 3: Statistical profiling
    const profileSpan = transaction.startChild({
      op: 'algorithm.profile',
      description: 'Calculate statistical profile'
    });
    const profile = await statisticalProfiler.profile(graph);
    profileSpan.setData('echo_score', profile.echoScore);
    profileSpan.finish();

    // Span 4: Match templates (Rule-based)
    const matchSpan = transaction.startChild({
      op: 'template.match',
      description: 'Match rule-based templates'
    });
    const matched = await templateMatcher.match({ ...metrics, ...profile });
    matchSpan.setData('matches', matched.length);
    matchSpan.finish();

    // Span 5: Interpolate (Variable substitution)
    const interpolateSpan = transaction.startChild({
      op: 'template.interpolate',
      description: 'Generate narratives via interpolation'
    });
    const insights = matched.map(m => templateInterpolator.interpolate(m));
    interpolateSpan.finish();

    // Span 6: Cache result
    const cacheSpan = transaction.startChild({
      op: 'cache.set',
      description: 'Cache insights in Redis'
    });
    await insightRepo.create(insights);
    cacheSpan.finish();

    return insights;
  } catch (error) {
    transaction.setStatus('internal_error');
    Sentry.captureException(error);
    throw error;
  } finally {
    transaction.finish();
  }
}
```

---

### **11.4 Alerting Rules (Prometheus/Alertmanager)**

```yaml
# alertmanager.yml

groups:
  - name: vsg_performance_alerts
    interval: 30s
    rules:
      # ═══════════════════════════════════════════════════════════
      # PERFORMANCE ALERTS
      # ═══════════════════════════════════════════════════════════

      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High API latency detected"
          description: "P95 latency is {{ $value }}s (threshold: 0.5s)"
          runbook: "https://docs.vsg.com/runbooks/high-latency"

      - alert: ErrorRateHigh
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate detected"
          description: "{{ $value | humanizePercentage }} of requests failing"
          runbook: "https://docs.vsg.com/runbooks/error-rate"

      # ═══════════════════════════════════════════════════════════
      # RESOURCE ALERTS
      # ═══════════════════════════════════════════════════════════

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1e9 > 3.5
        for: 5m
        labels:
          severity: warning
          team: devops
        annotations:
          summary: "High memory usage"
          description: "Memory usage: {{ $value }}GB (threshold: 3.5GB)"
          runbook: "https://docs.vsg.com/runbooks/memory"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_active > 95
        for: 1m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "Database connection pool near limit"
          description: "{{ $value }} connections active (max: 100)"
          runbook: "https://docs.vsg.com/runbooks/db-connections"

      # ═══════════════════════════════════════════════════════════
      # BUSINESS METRICS ALERTS
      # ═══════════════════════════════════════════════════════════

      - alert: ParserFailureRateHigh
        expr: rate(uploads_total{status="failed"}[10m]) / rate(uploads_total[10m]) > 0.05
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Parser failure rate above threshold"
          description: "{{ $value | humanizePercentage }} of uploads failing"
          runbook: "https://docs.vsg.com/runbooks/parser-failures"

      - alert: InsightGenerationSlow
        expr: histogram_quantile(0.95, insight_generation_duration_seconds_bucket) > 2
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Insight generation slow"
          description: "P95 duration: {{ $value }}s (threshold: 2s)"
          runbook: "https://docs.vsg.com/runbooks/insight-performance"

      - alert: AlgorithmTimeout
        expr: rate(algorithm_duration_seconds_bucket{le="5"}[5m]) < 0.95
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Graph algorithms timing out"
          description: "{{ $value | humanizePercentage }} completing within 5s"
          runbook: "https://docs.vsg.com/runbooks/algorithm-timeout"

      # ═══════════════════════════════════════════════════════════
      # CACHE HEALTH ALERTS
      # ═══════════════════════════════════════════════════════════

      - alert: CacheHitRateLow
        expr: |
          sum(rate(cache_hits_total[5m])) /
          (sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m]))) < 0.7
        for: 10m
        labels:
          severity: info
          team: backend
        annotations:
          summary: "Cache hit rate below optimal"
          description: "Hit rate: {{ $value | humanizePercentage }} (target: >70%)"
          runbook: "https://docs.vsg.com/runbooks/cache-performance"

      - alert: RedisDown
        expr: up{job="redis"} == 0
        for: 1m
        labels:
          severity: critical
          team: devops
        annotations:
          summary: "Redis instance down"
          description: "Redis unavailable - system degraded"
          runbook: "https://docs.vsg.com/runbooks/redis-down"

      # ═══════════════════════════════════════════════════════════
      # DATABASE ALERTS
      # ═══════════════════════════════════════════════════════════

      - alert: DatabaseDown
        expr: up{job="postgresql"} == 0
        for: 1m
        labels:
          severity: critical
          team: devops
        annotations:
          summary: "Database instance down"
          description: "PostgreSQL unavailable - system unavailable"
          runbook: "https://docs.vsg.com/runbooks/database-down"

      - alert: DatabaseSlowQueries
        expr: histogram_quantile(0.95, db_query_duration_seconds_bucket) > 0.5
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "Database queries slow"
          description: "P95 query time: {{ $value }}s (threshold: 0.5s)"
          runbook: "https://docs.vsg.com/runbooks/slow-queries"
```

---

### **11.5 Logging Strategy**

```typescript
// /src/utils/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'vsg-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'combined.log'
    })
  ]
});

// Structured logging example:
logger.info('User logged in', {
  userId: user.id,
  tier: user.tier,
  loginMethod: 'magic-link',
  timestamp: new Date().toISOString()
});

logger.error('Graph analysis failed', {
  graphId: graph.id,
  error: error.message,
  stack: error.stack,
  userId: user.id
});
```

---

## **12. Evolution Strategy**

### **12.1 Scaling Roadmap**

**Phase 0-1 (0-100 users):**
```
Infrastructure:
├─ Frontend: Vercel Hobby (free)
├─ Backend: Railway Hobby ($5/month)
├─ Database: Railway PostgreSQL ($5/month)
├─ Redis: Railway Redis ($5/month)
├─ Storage: Cloudflare R2 ($3/month)
└─ Total: ~$18/month

Limitations:
├─ Single backend instance (no redundancy)
├─ Shared database (acceptable performance)
└─ Manual deployment (GitHub Actions → Railway)

Sufficient for: Technical validation, early beta
```

**Phase 2 (100-1,000 users):**
```
Infrastructure:
├─ Frontend: Vercel Pro ($20/month)
├─ Backend: Railway Pro ($20/month) or AWS/GCP
│  ├─ 2-3 instances (horizontal scaling)
│  └─ Load balancer (built-in Railway or AWS ALB)
├─ Database: PostgreSQL (Railway $20/month or AWS RDS)
│  ├─ Read replica (if needed)
│  └─ Connection pooling (PgBouncer)
├─ Redis: Railway Pro ($10/month) or AWS ElastiCache
├─ Storage: Cloudflare R2 (scales automatically)
├─ CDN: Cloudflare (built-in)
└─ Total: ~$70-100/month

Enhancements:
├─ Auto-scaling (based on CPU/memory)
├─ Database backups (automated, hourly)
├─ Monitoring (Sentry, PostHog, UptimeRobot)
└─ CI/CD (fully automated, <10 min deploy)

Sufficient for: Public launch, growth to 1K users
```

**Phase 3 (1,000-10,000 users):**
```
Infrastructure:
├─ Frontend: Vercel Pro + Edge Functions
├─ Backend: AWS/GCP (multi-region future)
│  ├─ 5-10 instances (auto-scaling group)
│  ├─ Load balancer (ALB)
│  └─ Health checks (automated failover)
├─ Database: AWS RDS or GCP Cloud SQL
│  ├─ Primary + read replica
│  ├─ Automated backups (daily, 30-day retention)
│  └─ Performance Insights (query optimization)
├─ Redis: AWS ElastiCache (cluster mode)
│  ├─ Replication (high availability)
│  └─ Automatic failover
├─ Storage: Cloudflare R2 (multi-region)
├─ Monitoring: Datadog or New Relic (full observability)
└─ Total: ~$500-1,000/month

Enhancements:
├─ Multi-region (future, if needed)
├─ Disaster recovery (automated, RTO <4 hours)
├─ Advanced caching (Redis cluster, materialized views)
└─ Performance optimization (database tuning, query optimization)

Sufficient for: Scaling to 10K users, $100K+ ARR
```

---

### **12.2 Technical Debt Management**

**Ultrathink Principle: "Celebrate Deletions"**

```
Technical Debt Budget: 20% of each sprint

Debt Categories:
├─ Code quality debt (duplicated code, complex functions)
├─ Test coverage debt (<80% coverage)
├─ Documentation debt (missing/outdated docs)
├─ Performance debt (known slow queries, inefficiencies)
└─ Security debt (outdated dependencies, missing protections)

Debt Tracking:
├─ Label: "tech-debt" (GitHub Issues)
├─ Prioritize: High-impact, low-effort first
├─ Review: Monthly tech debt sprint (1-2 days)
└─ Metric: Track debt reduction over time

Debt Prevention:
├─ Code review: 2 approvals required
├─ Automated checks: Linting, type checking, tests
├─ "Boy Scout Rule": Leave code better than you found it
└─ Refactoring: Continuous, small improvements
```

---

### **12.3 Migration Strategy (Monolith → Microservices)**

**When to Consider:**
- 10,000+ users
- Backend becomes bottleneck
- Team size >10 engineers

**Candidates for Extraction:**
1. **Insight Engine** (most self-contained)
   - Clear boundaries (GraphAnalyzer, TemplateMatcher)
   - High CPU usage (benefit from dedicated scaling)
   - Independent deployment (faster iteration)

2. **Export Service** (CPU-intensive)
   - PDF generation (Puppeteer, headless Chrome)
   - Background processing (async, queue-based)
   - Separate scaling needs

3. **Parser Service** (optional, Phase 4+)
   - If server-side parsing becomes common
   - Isolate parser version management

**Migration Approach:**
```
1. Identify service boundary (Insight Engine)
2. Create interface (API contract)
3. Implement service (separate repo/deployment)
4. Add feature flag (gradual rollout)
5. Dual-write (old + new service)
6. Validate (monitor errors, performance)
7. Switch traffic (feature flag → 100% new)
8. Remove old code (celebrate deletion!)
```

**Risk Mitigation:**
- Feature flags: Instant rollback if issues
- Monitoring: Comprehensive (errors, latency, throughput)
- Testing: Contract tests (API compatibility)
- Documentation: Architecture decision records (ADRs)

---

## **Document Status**

**Version:** 1.0 (Algorithm-First Edition)
**Date:** December 21, 2025
**Status:** Living Document - Technical Design Foundation
**Owner:** Engineering / Architecture
**Next Review:** End of Phase 0 (Week 3, January 2026)
**Confidence:** 95% (Phase 0-2 detailed, Phase 3-4 directional)
**Completeness:** Implementation-ready for Phase 0-1

---

## **Next Steps**

1. **Phase 0 Execution** (Week 3):
   - Implement parsers (TwitterParser, InstagramParser, LinkedInParser)
   - Build basic visualization (D3.js force-directed graph)
   - Validate aha moment (5 user tests)

2. **Architecture Validation** (Ongoing):
   - Code review: Ensure alignment with this document
   - Performance testing: Validate assumptions (parsing <60s, viz 60 FPS)
   - Security audit: Penetration testing (Phase 2)

3. **Documentation Maintenance**:
   - Update as architecture evolves
   - Add ADRs (Architecture Decision Records) for major changes
   - Keep in sync with SRS v1.3

**This Architecture Document is the technical blueprint. All implementation must align with it, or the document must be updated with clear rationale documented.**

---

**End of Architecture Document v1.0**

*"Every component should sing. Every interface should breathe. Every abstraction should feel inevitable."*

*December 21, 2025*
*Visual Social Graph - Algorithm-First Foundation*
