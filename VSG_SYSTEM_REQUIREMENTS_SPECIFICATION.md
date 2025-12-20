# **Visual Social Graph: System Requirements Specification**
## **Version 1.0 - Complete Technical Foundation**

*"Architecture is frozen music. Every line of code should sing."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 (Complete & Condensed) |
| **Date** | December 2025 |
| **Status** | Living Document - Technical Foundation |
| **Owner** | Engineering / Architecture |
| **Review Cycle** | Weekly (Phase 0-1), Bi-weekly (Phase 2+), Monthly (Phase 3+) |
| **Classification** | Internal - Technical |
| **Scope** | Phase 0-2 (detailed), Phase 3-4 (directional) |

**Document Hierarchy:**
```
Product Strategy Document v1.1 (strategic constitution)
    ↓ constrains
Product Requirements Document v2.1-E (what we're building)
    ↓ defines
System Requirements Specification v1.0 (THIS DOCUMENT - how we build it)
    ↓ guides
Architecture Document (technical design)
    ↓ implements
Code & Infrastructure (actual system)
```

**Purpose:**

This SRS translates product requirements into technical specifications that:
- Define **functional requirements** (what the system must do)
- Define **non-functional requirements** (how well it must do it)
- Enforce **architectural constraints** (privacy-first, no account access)
- Retire **technical risks** systematically
- Enable **quality obsession** through measurable criteria

---

## **Table of Contents**

1. [Introduction & Philosophy](#1-introduction--philosophy)
2. [System Overview](#2-system-overview)
3. [Architectural Constraints (Non-Negotiable)](#3-architectural-constraints)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Requirements](#6-data-requirements)
7. [Security & Privacy](#7-security--privacy)
8. [Testing Strategy](#8-testing-strategy)
9. [Deployment & Operations](#9-deployment--operations)
10. [Phase-Specific Requirements](#10-phase-specific-requirements)
11. [Technology Stack](#11-technology-stack)
12. [Appendices](#12-appendices)

---

## **1. Introduction & Philosophy**

### **1.1 Ultrathink Applied to Engineering**

From the "ultrathink" philosophy, translated to technical principles:

**Craft, Don't Code**
```
Every function name should sing
Every abstraction should feel natural
Every edge case handled with grace
Test coverage >80% (confidence in changes)
Code review: 2 approvals minimum
20% time per sprint: technical debt management
```

**Simplicity Is Sophistication**
```
YAGNI: Build for known requirements, design for evolution
Boring technology: Proven tools over bleeding edge
Minimal abstractions: Only abstract when pattern repeats 3+ times
Flat hierarchy: Max 3 levels deep (directories, classes)
Celebrate deletions: Removing code is progress
```

**Performance Is a Feature**
```
Performance budget from Day 1
Lighthouse >90 (every deployment)
60 FPS visualization (smooth interactions)
<2.5s page load (retention driver)
Progressive enhancement: Works on slow connections
```

**Privacy by Design**
```
80% client-side processing (minimize data transfer)
No account access (architectural enforcement)
Data minimization (only store necessary)
User control (delete/export anytime)
Transparent (user knows what we log)
```

**Test-Driven Commitment**
```
Core algorithms: Test-first
API contracts: Integration tests
User flows: E2E tests
Visual regression: Screenshot diffs
Confidence to refactor: Tests enable change
```

---

### **1.2 Technical Maturity Progression**

```
Phase 0 (Prototype):
├─ Quality: 70% (works, rough edges acceptable)
├─ Testing: Manual only (5 users)
├─ Infrastructure: Free tier (Vercel/Railway)
├─ Acceptable: Bugs, performance issues, basic error handling

Phase 1 (MVP):
├─ Quality: 85% (works well, edge cases handled)
├─ Testing: Unit tests >80%, integration tests
├─ Infrastructure: Production-grade (PostgreSQL, monitoring)
├─ Acceptable: Known bugs, some performance issues

Phase 2 (Public):
├─ Quality: 95% (insanely great, delightful)
├─ Testing: Full suite (unit, integration, E2E, visual)
├─ Infrastructure: Scalable (CDN, caching, load balancing)
├─ Acceptable: Minor bugs, performance optimized

Phase 3 (Scale):
├─ Quality: 99% (production-grade, enterprise-ready)
├─ Testing: Continuous (CI/CD, chaos engineering)
├─ Infrastructure: Highly available (multi-region, failover)
├─ Acceptable: Rare bugs (<1% error rate)

Phase 4 (Leadership):
├─ Quality: 99.9% (world-class benchmark)
├─ Testing: ML-powered (predictive, proactive)
├─ Infrastructure: Global (edge computing, multi-cloud)
├─ Acceptable: Zero data loss, <0.1% error rate
```

---

## **2. System Overview**

### **2.1 High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (React 18)                           │ │
│  │  ├─ File Upload (Tus resumable)                        │ │
│  │  ├─ Web Worker (80% processing - privacy-first)       │ │
│  │  ├─ D3.js Visualization (force-directed graph)        │ │
│  │  └─ Export Generator (client-side)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                    ↕ HTTPS (JWT auth)                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              API Backend (Node.js + Express)                 │
│  ├─ Auth Service (magic link, Google OAuth)                 │
│  ├─ Upload Service (Tus protocol)                           │
│  ├─ Analysis Service (graph algorithms, AI)                 │
│  ├─ Export Service (PDF generation)                         │
│  └─ Webhook Service (Stripe)                                │
│                    ↕ SQL queries                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ├─ PostgreSQL (metadata, user data)                        │
│  ├─ Cloudflare R2 (temporary file storage)                  │
│  └─ Redis (sessions, job queue)                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               External Services                              │
│  ├─ Sentry (error tracking)                                 │
│  ├─ PostHog (privacy-friendly analytics)                    │
│  ├─ Resend (transactional email)                            │
│  ├─ Stripe (payments)                                       │
│  └─ Anthropic Claude API (AI recommendations)               │
└─────────────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**

1. **Client-Heavy (80% processing client-side)** - Privacy-first, minimize server costs, user control
2. **Monolithic Backend (Phase 0-2)** - Simplicity, faster iteration, adequate for 10K users
3. **PostgreSQL** - Relational data, ACID guarantees, proven technology
4. **Serverless Frontend** - Vercel auto-scaling, zero DevOps, edge caching
5. **No OAuth for Social Platforms** - Manual upload only (Tier 1 constraint)

---

### **2.2 System Boundaries**

**In Scope:**
- File upload/parsing (Twitter, Instagram, LinkedIn)
- Network visualization (D3.js force-directed)
- Insight generation (algorithms + AI)
- Export (PDF, social cards, CSV/JSON)
- Authentication (magic link, Google OAuth for VSG only)
- Payments (Stripe)

**Out of Scope:**
- Real-time social media monitoring
- OAuth account access (never)
- Content posting/scheduling
- Mobile native apps (Phase 1-2)
- Enterprise collaboration (Phase 1-2)
- White-label (Phase 1-2)

**Deferred to Later Phases:**
- Additional platforms (TikTok, YouTube) - Phase 3+
- Real-time updates (browser extension option) - Phase 3+
- Mobile apps (iOS, Android) - Phase 4+
- API for developers - Phase 4+
- International localization - Phase 4+

---

## **3. Architectural Constraints**

### **3.1 Tier 1 Constraints (Constitutional - Cannot Violate)**

**C1: No Account Access**

```
REQUIREMENT SRS-C1.1: No OAuth Implementation for Social Platforms
├─ Description: System SHALL NOT implement OAuth for Twitter, Instagram, LinkedIn
├─ Rationale: Privacy promise, competitive moat, legal safety
├─ Enforcement:
│  ├─ Code review: Block any OAuth library imports for social platforms
│  ├─ CI/CD: Automated check fails if OAuth detected
│  └─ Architecture: No API clients for social platforms
├─ Exception: None (Tier 1 constraint)
├─ Validation: Grep codebase for OAuth patterns → zero matches

REQUIREMENT SRS-C1.2: Manual Upload Only
├─ Description: User authentication SHALL NOT grant social media access
├─ Implementation:
│  ├─ Auth for VSG: Email magic link or Google OAuth (for app access only)
│  ├─ Platform data: Only via manual ZIP upload
│  └─ Clear separation: Auth system independent of data ingestion
├─ User messaging: "We never connect to your accounts" (prominent)
├─ Validation: User can log into VSG without granting social media access

REQUIREMENT SRS-C1.3: No API Keys Stored
├─ Description: System SHALL NOT store platform API keys or tokens
├─ Implementation:
│  ├─ Database: No token columns
│  ├─ Environment: No platform API keys in .env
│  └─ Code: No API client initialization for social platforms
├─ Validation: Database schema audit, security review
```

**C2: User Data Ownership**

```
REQUIREMENT SRS-C2.1: Data Minimization
├─ Description: Store only data necessary for core functionality
├─ What we store:
│  ├─ Account: Email, name, tier
│  ├─ Graph: Anonymized structure (node IDs hashed, edges, weights)
│  ├─ Insights: Generated insights, confidence levels
│  └─ Analytics: Anonymized usage metrics
├─ What we DON'T store:
│  ├─ Raw ZIP files (deleted after processing)
│  ├─ Full social media content (only metadata)
│  ├─ Private messages (never parsed)
│  └─ Exact usernames (hashed or aggregated)
├─ Validation: Data inventory quarterly, GDPR compliance audit

REQUIREMENT SRS-C2.2: User Data Deletion
├─ Description: User SHALL delete all data anytime
├─ Implementation:
│  ├─ UI: "Delete My Account" button in settings
│  ├─ Execution: Cascade delete (immediate from production DB)
│  ├─ Backups: Purged within 90 days
│  └─ Verification: Email confirmation sent after deletion
├─ Validation: Test delete flow, verify data removed

REQUIREMENT SRS-C2.3: No Data Selling or AI Training
├─ Description: User data SHALL NOT be sold or used for AI training
├─ Implementation:
│  ├─ Revenue: Subscriptions only (no data sales, no ads)
│  ├─ AI models: Trained on synthetic/public data only
│  ├─ Third-party: No user data sent to AI APIs without consent
│  └─ Privacy policy: Explicit "no data selling, no AI training" clause
├─ Validation: Business model audit, privacy policy review
```

**C3: Client-Side Processing (80% Rule)**

```
REQUIREMENT SRS-C3.1: 80% Processing Client-Side
├─ Description: At least 80% of data processing SHALL occur in browser
├─ Client-side:
│  ├─ File parsing (ZIP extraction, JSON/CSV parsing)
│  ├─ Data cleaning (dedupe, normalize, filter)
│  ├─ Graph construction (nodes, edges, basic metrics)
│  └─ Visualization (D3.js rendering)
├─ Server-side (20%):
│  ├─ AI recommendations (computationally intensive)
│  ├─ Historical comparisons (database queries)
│  └─ PDF generation (headless Chrome)
├─ Validation: Measure network traffic (upload 100MB → <10MB to server)

REQUIREMENT SRS-C3.2: Web Workers for Heavy Processing
├─ Description: Heavy computation SHALL use Web Workers (non-blocking)
├─ Implementation:
│  ├─ parser-worker.js: File parsing, data cleaning
│  ├─ Communication: postMessage API
│  ├─ Progress: Report to main thread (update UI)
│  └─ Cancellation: User can cancel anytime
├─ Validation: UI stays at 60 FPS during parsing

REQUIREMENT SRS-C3.3: Minimal Server Data Transfer
├─ Description: Only anonymized graph structure sent to server
├─ What we send:
│  ├─ Graph structure: Node IDs (hashed), edges, weights
│  ├─ Metadata: Node count, edge count, platform
│  └─ User selections: Which insights requested
├─ What we DON'T send:
│  ├─ Raw ZIP file
│  ├─ Full usernames
│  ├─ Tweet/post content
│  └─ Full follower lists
├─ Validation: Network inspection, user preview before upload
```

---

### **3.2 Tier 2 Constraints (Strong Commitments)**

**C4: Freemium Business Model**

```
REQUIREMENT SRS-C4.1: Feature Gating Architecture
├─ Implementation:
│  ├─ User table: tier column (free, pro, creator)
│  ├─ Feature flags: canAccessFeature(user, feature)
│  ├─ API: Server-side validation (can't bypass)
│  └─ Frontend: Hide/disable gated features
├─ Tiers:
│  ├─ Free: 1 platform, basic insights, 1 PDF/month
│  ├─ Pro: Unlimited platforms, all insights, AI recommendations, unlimited exports
│  └─ Creator: White-label, team features, API access
├─ Validation: Test each tier's feature availability

REQUIREMENT SRS-C4.2: Stripe Integration
├─ Implementation:
│  ├─ Checkout: Stripe Checkout (hosted)
│  ├─ Webhooks: Handle payment events (idempotent)
│  ├─ Billing portal: Stripe Customer Portal (user self-service)
│  └─ Security: Never store credit card numbers
├─ Validation: Test checkout flow, webhook handling, dunning
```

**C5: No Advertising**

```
REQUIREMENT SRS-C5.1: No Ad Infrastructure
├─ Implementation:
│  ├─ No ad networks: No Google Ads, programmatic ads
│  ├─ No tracking pixels: No Facebook Pixel, LinkedIn Insight Tag
│  └─ CI/CD: Automated check for ad-related dependencies
├─ Revenue: 100% from subscriptions
├─ Validation: Code audit, network audit, revenue audit
```

---

### **3.3 Technology Constraints**

**C6: Modern Browsers Only**

```
REQUIREMENT SRS-C6.1: Browser Support
├─ Supported:
│  ├─ Chrome: Latest (evergreen)
│  ├─ Firefox: Latest (evergreen)
│  ├─ Safari: Latest (Mac/iOS)
│  ├─ Edge: Latest (Chromium)
│  └─ Brave: Latest (Chromium)
├─ NOT supported:
│  ├─ Internet Explorer (dead)
│  ├─ Safari <2 years old
│  └─ Chrome/Firefox <1 year old
├─ Requirements:
│  ├─ ES2020+ JavaScript
│  ├─ Web Workers (required)
│  ├─ Canvas/SVG (required)
│  └─ Fetch API (required)
├─ Validation: Browser detection, show warning if unsupported
```

---

## **4. Functional Requirements**

### **4.1 User Authentication**

```
SRS-F1.1: Magic Link Authentication
├─ Priority: P0 (critical, Phase 1)
├─ Flow:
│  1. User enters email → System sends magic link
│  2. User clicks link → System validates token
│  3. System creates session (JWT cookie, 7-day expiry)
│  4. User redirected to dashboard
├─ Implementation:
│  ├─ Token: Crypto.randomBytes(32), stored in Redis (15-min TTL)
│  ├─ Session: JWT in httpOnly cookie
│  ├─ Security: Rate limit (5 requests/hour per email)
│  └─ Single-use: Token invalidated after use
├─ Acceptance: Email sent <30s, token valid 15min, session persists 7 days

SRS-F1.2: Google OAuth Authentication
├─ Priority: P1 (high, Phase 1)
├─ Scopes: email, profile ONLY (NOT social media access)
├─ Flow: Standard OAuth 2.0 authorization code flow
├─ Security: State parameter (CSRF protection)
├─ Messaging: "Sign in to Visual Social Graph with Google" (clear it's for VSG, not social)
├─ Acceptance: Auth completes <30s, only email/name requested

SRS-F1.3: Session Management
├─ Token: JWT (user_id, email, tier, exp)
├─ Storage: httpOnly, Secure, SameSite=Lax cookie
├─ Expiry: 7 days (renewable on activity)
├─ Revocation: Redis-based revocation (logout, security events)
├─ Acceptance: Session persists across restarts, expires after 7 days inactivity
```

---

### **4.2 File Upload & Parsing**

```
SRS-F2.1: Multi-Platform File Upload
├─ Priority: P0 (critical, Phase 0)
├─ Protocol: Tus (resumable upload, handles interruptions)
├─ Platforms: Twitter, Instagram, LinkedIn
├─ Max size: 2GB per file
├─ Implementation:
│  ├─ Client: tus-js-client
│  ├─ Server: tus-node-server
│  ├─ Storage: Cloudflare R2 (temporary, deleted after processing)
│  └─ Progress: Real-time progress indicator
├─ Acceptance: Uploads 2GB file, resumable, progress accurate

SRS-F2.2: Twitter Parser
├─ Priority: P0 (critical, Phase 0)
├─ Format: ZIP with .js files (window.YTD.* wrapper)
├─ Files parsed:
│  ├─ account.js (username, created_at)
│  ├─ follower.js, following.js (connections)
│  ├─ tweets.js (multi-part support)
│  └─ likes.js (optional)
├─ Challenges:
│  ├─ JS wrapper: Strip before JSON.parse
│  ├─ Multi-part: Handle tweets-part0.js, tweets-part1.js, etc.
│  ├─ Version detection: Auto-detect format version
│  └─ Encoding: UTF-8 (emojis, special characters)
├─ Location: Web Worker (client-side)
├─ Performance: 500MB in <60 seconds
├─ Acceptance: >95% success rate (tested with 30+ files)

SRS-F2.3: Instagram Parser
├─ Priority: P0 (critical, Phase 0)
├─ Format: ZIP with JSON files
├─ Backward compatibility:
│  ├─ Old format (2020-2023): connections.json
│  ├─ New format (2024+): followers_1.json (string_list_data)
│  └─ Auto-detect and handle both
├─ Files parsed:
│  ├─ followers_1.json (or connections.json)
│  ├─ following.json
│  └─ profile_information.json
├─ Challenges:
│  ├─ Format change 2024: New structure
│  ├─ Multiple files: Large accounts split across files
│  └─ Timestamps: UNIX format
├─ Acceptance: >95% success rate (both formats)

SRS-F2.4: LinkedIn Parser
├─ Priority: P0 (critical, Phase 0)
├─ Format: ZIP with CSV (Connections.csv)
├─ Columns: First Name, Last Name, Email, Company, Position, Connected On
├─ Challenges:
│  ├─ Encoding: Non-Latin characters (UTF-8)
│  ├─ Missing data: Email often empty
│  └─ Duplicates: Same person multiple times
├─ Graph: Bidirectional connections (mutual)
├─ Acceptance: >95% success rate, handles 10K connections

SRS-F2.5: Parser Versioning System
├─ Priority: P1 (high, Phase 1)
├─ Implementation:
│  ├─ Version detection: Auto-detect format version
│  ├─ Parser registry: twitter_v1, twitter_v2, instagram_v1, instagram_v2, linkedin_v1
│  ├─ Fallback: Try alternative parser if first fails
│  └─ Logging: Track parser version used (analytics)
├─ Acceptance: Handles old exports, forwards-compatible with new formats
```

---

### **4.3 Network Visualization**

```
SRS-F3.1: Force-Directed Graph Layout
├─ Priority: P0 (critical, Phase 0)
├─ Library: D3.js v7 (force simulation)
├─ Forces:
│  ├─ Charge: -300 (repulsion)
│  ├─ Link: distance by edge weight
│  ├─ Center: 0.1 (weak centering)
│  └─ Collision: Prevent overlap
├─ Rendering:
│  ├─ <1K nodes: SVG (crisp, interactive)
│  ├─ 1K-5K nodes: Canvas (performance)
│  └─ >5K: WebGL or sampling (Phase 3+)
├─ Color coding: Communities (8-color palette, colorblind-friendly)
├─ Node size: Proportional to centrality
├─ Acceptance: 60 FPS <1K nodes, 30 FPS 1K-5K, stable within 10s

SRS-F3.2: Progressive Reveal (Guided Discovery)
├─ Priority: P0 (critical, Phase 1)
├─ 5 Stages:
│  1. Empty Canvas (2s): User node appears at center
│  2. First Connections (3s): Immediate connections emerge
│  3. Full Network (3s): All nodes appear, force simulation begins
│  4. Communities (2s): Color-code communities, highlight
│  5. Interactive (permanent): All controls unlocked
├─ Controls: Skip, pause, replay
├─ Animations: Framer Motion (UI), D3 transitions (graph)
├─ Acceptance: 60 FPS, 10-12s total, user can control

SRS-F3.3: Interactive Controls
├─ Zoom: Mouse wheel, pinch, +/- buttons
├─ Pan: Click-drag, touch-drag
├─ Filter: By community, engagement, time, search
├─ Highlight: Hover (node + edges), click (details panel)
├─ Acceptance: <16ms response, 60 FPS, keyboard navigable

SRS-F3.4: Node Detail View
├─ Trigger: Click node → Slide-out panel (right side)
├─ Contents:
│  ├─ Identity: Username, bio, platform
│  ├─ Metrics: Degree, centrality, community, engagement level
│  └─ Actions: View on platform, add note (Phase 2+)
├─ Performance: Lazy load data, <100ms to appear
├─ Acceptance: All data displayed, keyboard navigable

SRS-F3.5: Performance Optimization
├─ <1K nodes: SVG, no optimization needed
├─ 1K-5K nodes:
│  ├─ Canvas rendering
│  ├─ Level-of-detail (simplify distant nodes)
│  └─ Viewport culling
├─ 5K-10K nodes:
│  ├─ Aggressive culling
│  ├─ Sampling (show representative subset)
│  └─ Warning: "Large network, showing subset"
├─ Performance budget:
│  ├─ Initial render: <3s (even 10K nodes)
│  ├─ Interaction: 60 FPS <1K, 30 FPS 1K-5K, 15 FPS 5K-10K
│  └─ Memory: <500MB typical, <2GB large
├─ Acceptance: No crashes, smooth interactions, clear warnings
```

---

### **4.4 Insight Generation**

```
SRS-F4.1: Community Detection
├─ Priority: P0 (critical, Phase 1)
├─ Algorithm: Louvain (modularity optimization)
├─ Library: graphology-communities
├─ Output: Community assignments (node → community_id)
├─ Insight:
│  ├─ "You have X distinct communities"
│  ├─ "Largest: [topic] with Y members"
│  ├─ "Z% bridge multiple communities"
│  └─ Strategic action recommended
├─ Confidence:
│  ├─ High: Modularity >0.3
│  ├─ Medium: 0.2-0.3
│  └─ Low: <0.2
├─ Performance: <5s for 5K nodes
├─ Acceptance: Matches user intuition >80%, visually color-coded

SRS-F4.2: Engagement Circles
├─ Priority: P0 (critical, Phase 1)
├─ Categories:
│  ├─ Super Fans: Engage >50% of content
│  ├─ Regulars: 10-50%
│  ├─ Passives: 1-10%
│  └─ Ghosts: 0%
├─ Calculation:
│  ├─ Twitter: (likes + retweets×2 + replies×3) / follower_count
│  ├─ Instagram: likes + comments×2
│  └─ LinkedIn: reactions + comments×2 + shares×3
├─ Visualization: Concentric circles
├─ Insight: Distribution, strategic focus recommendations
├─ Acceptance: User agrees >70%, actionable recommendations

SRS-F4.3: Key Connectors (Bridge Accounts)
├─ Priority: P1 (high, Phase 1)
├─ Algorithm: Betweenness centrality
├─ Threshold: Top 5% of betweenness scores
├─ Insight:
│  ├─ "These X accounts are bridges"
│  ├─ "Engaging [Person] amplifies reach to Y communities"
│  └─ Specific action: "Engage with next 3 posts"
├─ Performance: <10s for 5K nodes
├─ Acceptance: Visually bridges communities, actionable

SRS-F4.4: Echo Chamber Detection
├─ Priority: P1 (high, Phase 1)
├─ Method: Homophily analysis (similarity of connected nodes)
├─ Proxies: Bio similarity, community overlap, engagement patterns
├─ Scoring: 0-100% homogeneity
│  ├─ 0-30%: Diverse
│  ├─ 30-60%: Moderate
│  ├─ 60-80%: Echo chamber risk
│  └─ 80-100%: Strong echo chamber
├─ Framing (positive, non-judgmental):
│  ├─ "67% of frequent engagers share similar viewpoints"
│  ├─ "Opportunity: Follow 5 people who think differently"
│  └─ Link to educational content
├─ Opt-out: User can dismiss
├─ Acceptance: Correlates with self-assessment >60%, never judgmental

SRS-F4.5: Confidence Levels
├─ Priority: P0 (critical, Phase 1)
├─ Every insight MUST show confidence
├─ Framework:
│  ├─ High (>80%): Complete data, validated algorithms
│  ├─ Medium (50-80%): Incomplete data, proxy measures
│  └─ Low (<50%): Very limited data
├─ Display: Color-coded badge, hover for explanation
├─ Acceptance: Always visible, user understands (>80% in testing)
```

---

### **4.5 AI-Powered Recommendations**

```
SRS-F5.1: AI Recommendation Engine
├─ Priority: P1 (high, Phase 2)
├─ Provider: Anthropic Claude API (Sonnet)
├─ Fallback: OpenAI GPT-4
├─ Architecture:
│  ├─ Client: Sends anonymized graph + user goal
│  ├─ Server: Graph analysis → LLM synthesis
│  ├─ Response: Structured recommendations + actions
│  └─ Privacy: No raw usernames sent to AI
├─ Cost: ~$0.01-0.05 per recommendation
├─ Acceptance: Personalized >80%, <10s generation, privacy-safe

SRS-F5.2: Bridge Account Recommendations
├─ Priority: P1 (high, Phase 2)
├─ Structure:
│  ├─ Identification: High betweenness accounts
│  ├─ Strategic value: "Connects you to X communities"
│  ├─ Specific action: "Reply to next 3 posts with [suggestions]"
│  ├─ Draft ideas: 3 tailored comment suggestions
│  └─ Expected outcome: "15-20% reach increase"
├─ Acceptance: >30% engagement rate, >70% find helpful

SRS-F5.3: Collaboration Suggestions
├─ Priority: P2 (medium, Phase 2-3)
├─ Analysis:
│  ├─ Audience overlap: Jaccard similarity
│  ├─ Content complementarity: Topic analysis
│  └─ Engagement patterns: Similar styles
├─ Suggestion:
│  ├─ Partner identification: @user4
│  ├─ Synergy data: "67% overlap, complementary content"
│  ├─ Collaboration type: Joint newsletter, podcast, workshop
│  ├─ Intro message: Draft proposal
│  └─ Expected outcome: "10-20% audience expansion"
├─ Privacy: Both parties opt-in before sharing
├─ Acceptance: Relevant >70%, >5% lead to collaborations

SRS-F5.4: Growth Opportunity Identification
├─ Priority: P1 (high, Phase 2)
├─ Types:
│  ├─ Untapped segments: Followers who don't engage
│  ├─ Underutilized connections: Communities you ignore
│  ├─ Content gaps: Topics network wants, you don't post
│  └─ Timing insights: Best posting times
├─ AI enhancement: Prioritization, specificity, personalization
├─ Acceptance: >40% try suggestions, >50% report positive results
```

---

### **4.6 Export & Sharing**

```
SRS-F6.1: PDF Report Generation
├─ Priority: P1 (high, Phase 2)
├─ Structure:
│  ├─ Cover: Title, user name, date, platforms
│  ├─ Executive summary (1 page): Key metrics, top 3 insights
│  ├─ Visualization (1 page): High-res graph, legend
│  ├─ Insights (2-3 pages): One per insight type
│  └─ Methodology (1 page): How data processed
├─ Implementation: Puppeteer (headless Chrome), HTML → PDF
├─ Quality: 300 DPI, vector graphics
├─ File size: Target <10MB
├─ Retention: 7-day expiry, then delete
├─ Acceptance: Professional quality, <30s generation

SRS-F6.2: Social Share Cards
├─ Priority: P1 (high, Phase 2)
├─ Templates:
│  ├─ "My Social DNA": Graph + key metrics
│  ├─ "My Network in Numbers": Statistics, clean typography
│  ├─ "My Positioning": 2D positioning map
│  └─ Custom (Phase 3+): User customization
├─ Dimensions: 1200×630 (Twitter, LinkedIn, Facebook optimal)
├─ Implementation: Canvas API → PNG
├─ Rendering: Client-side (no server upload)
├─ File size: <500KB
├─ Watermark: VSG logo (subtle, bottom corner)
├─ Acceptance: Beautiful, <2s generation, >30% share rate

SRS-F6.3: Raw Data Export
├─ Priority: P2 (medium, Phase 2)
├─ Formats:
│  ├─ CSV (Node List): node_id, username, degree, centrality, community
│  ├─ CSV (Edge List): source, target, weight (Gephi-compatible)
│  ├─ JSON (Graph): Full graph object (nodes, edges, metadata)
│  └─ GEXF (Phase 3+): Gephi native format
├─ Privacy: Anonymized or full (user choice)
├─ Acceptance: Opens in Excel/Gephi, complete data, <10s generation

SRS-F6.4: One-Click Social Sharing
├─ Priority: P1 (high, Phase 2)
├─ Targets:
│  ├─ Twitter/X: Pre-filled tweet, image attached, web intent
│  ├─ LinkedIn: Pre-filled post, image attached, share dialog
│  ├─ Copy link: Shareable URL (7-day expiry), clipboard
│  └─ Download: High-res PNG
├─ Viral tracking: UTM parameters, attribution
├─ Acceptance: <5s share completion, >80% completion rate
```

---

## **5. Non-Functional Requirements**

### **5.1 Performance**

```
SRS-NF1: Page Load Performance
├─ Metrics:
│  ├─ First Contentful Paint (FCP): <1.5s
│  ├─ Largest Contentful Paint (LCP): <2.5s
│  ├─ Time to Interactive (TTI): <3.5s
│  ├─ Cumulative Layout Shift (CLS): <0.1
│  └─ First Input Delay (FID): <100ms
├─ Measurement: Lighthouse CI (every deployment), Web Vitals (RUM)
├─ Optimization:
│  ├─ Code splitting, image optimization (WebP, lazy load)
│  ├─ CDN caching, Brotli compression
│  └─ Critical CSS inline
├─ Acceptance: Lighthouse >90, Core Web Vitals "Good" (75th percentile)

SRS-NF2: Parsing Performance
├─ Target: <60s for typical account (500MB, 1K-5K connections)
├─ Budget:
│  ├─ 100MB: <20s
│  ├─ 500MB: <60s
│  ├─ 1GB: <120s
│  └─ >1GB: Warning shown
├─ Optimization: Web Worker, streaming, incremental parsing
├─ Progress: Accurate estimates (within 20%)
├─ Acceptance: 95th percentile within budget, no crashes

SRS-NF3: Visualization Performance
├─ Target: 60 FPS <1K nodes, 30 FPS 1K-5K nodes
├─ Measurement: Chrome DevTools Performance profiler
├─ Optimization:
│  ├─ Canvas for >1K nodes
│  ├─ Viewport culling, level-of-detail
│  └─ RequestAnimationFrame scheduling
├─ Acceptance: Smooth interactions, no jank, no memory leaks

SRS-NF4: API Response Time
├─ Budget:
│  ├─ Authentication: <100ms (p95)
│  ├─ Metadata queries: <200ms (p95)
│  ├─ Graph retrieval: <500ms (p95)
│  ├─ Insight generation: <2s (p95)
│  ├─ AI recommendations: <10s (p95)
│  └─ Export generation: <30s (p95)
├─ Optimization: Caching (Redis), indexing, connection pooling
├─ Monitoring: APM (Sentry), alerts if p95 exceeds budget
├─ Acceptance: >95% requests within budget
```

---

### **5.2 Reliability & Availability**

```
SRS-NF5: Uptime Target
├─ Targets by phase:
│  ├─ Phase 0-1: 95% (18 days downtime/year - beta acceptable)
│  ├─ Phase 2: 99% (3.65 days/year - public launch)
│  ├─ Phase 3: 99.5% (43 hours/year - scale)
│  └─ Phase 4: 99.9% (8.76 hours/year - enterprise)
├─ Measurement: UptimeRobot (1-min checks, multiple locations)
├─ Strategies: Redundancy, health checks, graceful degradation
├─ Status page: status.visualsocialgraph.com (Phase 2+)
├─ Acceptance: Meet or exceed target, MTTR <30 minutes

SRS-NF6: Error Rate
├─ Target: <1% (5xx errors)
├─ Acceptable: 4xx <5% (client errors), 5xx <1% (server errors)
├─ Critical paths: Auth <0.1%, Upload <2%, API <1%
├─ Monitoring: Sentry (real-time), weekly error review
├─ Error handling: User-friendly messages, recovery options
├─ Acceptance: Target maintained, P0 errors fixed <4 hours

SRS-NF7: Data Durability
├─ Target: 99.999999999% (11 nines - zero data loss)
├─ Backups:
│  ├─ Database: Hourly incremental, daily full, 30-day retention
│  ├─ Location: Off-site, encrypted
│  └─ Testing: Monthly restore test
├─ File storage: Cloudflare R2 (11 nines built-in)
├─ Disaster recovery: RTO <4 hours, RPO <1 hour (Phase 3+)
├─ Acceptance: Zero data loss, 100% backups restorable
```

---

### **5.3 Scalability**

```
SRS-NF8: User Scalability
├─ Targets:
│  ├─ Phase 2: 1K concurrent users
│  ├─ Phase 3: 10K concurrent
│  └─ Phase 4: 100K concurrent
├─ Strategy:
│  ├─ Frontend: Serverless (Vercel auto-scaling)
│  ├─ Backend: Horizontal scaling (load balancer, 2-10 instances)
│  ├─ Database: Read replicas (Phase 3+)
│  └─ Caching: Redis cluster (Phase 3+)
├─ Load testing: k6 (before major releases, 2x peak load)
├─ Acceptance: Handles 2x peak, response time maintained, <1% errors

SRS-NF9: Data Scalability
├─ Estimates:
│  ├─ Per user: 200KB-1MB
│  ├─ Phase 3 (10K users): ~2GB-10GB data, <50GB DB
│  └─ Phase 4 (100K users): ~20GB-100GB data, <500GB DB
├─ Strategy:
│  ├─ Indexing: Query optimization
│  ├─ Archival: Move old data to cold storage (365 days)
│  └─ Partitioning: Shard by user_id (Phase 4+)
├─ Acceptance: Query performance <200ms (even at 100K users)
```

---

### **5.4 Security**

```
SRS-NF10: Authentication Security
├─ Magic link: 256-bit entropy, 15-min expiry, single-use
├─ Session: JWT, httpOnly cookie, Secure, SameSite=Lax
├─ Rate limiting: 5 login attempts/hour per email
├─ Brute force: Account lockout (10 failed attempts, 1 hour)
├─ OAuth: State parameter (CSRF protection)
├─ Acceptance: OWASP compliant, penetration test passes

SRS-NF11: Data Security
├─ Encryption:
│  ├─ At rest: Database encryption, R2 encryption
│  ├─ In transit: TLS 1.3, HSTS header
│  └─ Backups: Encrypted with separate keys
├─ Access control:
│  ├─ Least privilege (database users)
│  ├─ IAM policies (file storage)
│  └─ Authorization: User can only access own data
├─ Acceptance: SSL Labs A+, encryption verified, security audit passes

SRS-NF12: Application Security
├─ Protections:
│  ├─ SQL injection: Parameterized queries (ORM)
│  ├─ XSS: Output encoding, CSP headers
│  ├─ CSRF: SameSite cookies, CSRF tokens
│  └─ Clickjacking: X-Frame-Options, CSP frame-ancestors
├─ Security headers: HSTS, X-Content-Type-Options, Referrer-Policy
├─ Dependency security: npm audit (every build), Dependabot
├─ Acceptance: OWASP Top 10 tests pass, securityheaders.com A+
```

---

### **5.5 Privacy & Compliance**

```
SRS-NF13: GDPR Compliance
├─ Requirements:
│  ├─ Lawful basis: User consent
│  ├─ Data minimization: Only necessary data stored
│  ├─ Right to access: User can download all data
│  ├─ Right to erasure: User can delete all data
│  ├─ Right to portability: Export in JSON
│  └─ Breach notification: 72-hour process
├─ Implementation: Privacy by design (client-side processing)
├─ Acceptance: Legal review passes, privacy policy compliant

SRS-NF14: CCPA Compliance
├─ Requirements:
│  ├─ Right to know: User can see what data collected
│  ├─ Right to delete: User can request deletion
│  ├─ Right to opt-out: N/A (we don't sell data)
│  └─ Disclosure: Privacy policy discloses practices
├─ "Do Not Sell": Prominent statement (footer, privacy policy)
├─ Acceptance: Legal review passes, CCPA disclosures present
```

---

### **5.6 Usability & Accessibility**

```
SRS-NF15: WCAG 2.1 AA Compliance
├─ Principles:
│  ├─ Perceivable: Alt text, 4.5:1 contrast, text alternatives
│  ├─ Operable: Keyboard navigation, visible focus, no traps
│  ├─ Understandable: Clear language, consistent UI, helpful errors
│  └─ Robust: Valid HTML, ARIA attributes, screen reader compatible
├─ Testing: axe DevTools (automated), manual (NVDA, VoiceOver)
├─ CI/CD: Automated axe tests on every PR
├─ Acceptance: axe zero violations, Lighthouse >90, keyboard navigable

SRS-NF16: Browser Compatibility
├─ Supported: Chrome, Firefox, Safari, Edge, Brave (latest only)
├─ NOT supported: Internet Explorer, old browsers (<1 year)
├─ Detection: Show warning if unsupported
├─ Progressive enhancement: Core functionality works everywhere
├─ Acceptance: Works on all supported browsers, no crashes
```

---

## **6. Data Requirements**

### **6.1 Database Schema**

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  tier VARCHAR(20) DEFAULT 'free', -- free, pro, creator
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- Soft delete
);

-- Uploads
CREATE TABLE uploads (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL, -- twitter, instagram, linkedin
  file_size BIGINT,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Graphs
CREATE TABLE graphs (
  id UUID PRIMARY KEY,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  node_count INTEGER,
  edge_count INTEGER,
  graph_data JSONB, -- Anonymized structure
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insights
CREATE TABLE insights (
  id UUID PRIMARY KEY,
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  confidence VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exports
CREATE TABLE exports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  graph_id UUID REFERENCES graphs(id),
  format VARCHAR(20), -- pdf, png, csv, json
  file_url TEXT, -- R2 signed URL
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_graphs_user_id ON graphs(user_id);
CREATE INDEX idx_insights_graph_id ON insights(graph_id);
```

**Data Retention:**
- Raw ZIP files: Deleted immediately after processing (never stored long-term)
- Export files: 7-day expiry (auto-delete)
- Deleted accounts: Hard delete after 7-day grace period
- Backups: Purged from backups within 90 days
- Logs: 90-day retention

---

### **6.2 File Storage**

```
Provider: Cloudflare R2 (S3-compatible)
Rationale: Cost-effective (no egress fees), S3-compatible (portable)

Structure:
├─ /uploads/{user_id}/{upload_id}/file.zip
│  └─ Retention: 1 hour (deleted after processing)
├─ /exports/{user_id}/{export_id}/report.pdf
│  └─ Retention: 7 days (auto-delete)
└─ /assets/graphs/{graph_id}/thumbnail.png
   └─ Retention: Permanent (until user deletes)

Configuration:
├─ Private by default (no public access)
├─ Encryption: Server-side (AES-256)
├─ Signed URLs: 1-hour expiry
└─ Lifecycle rules: Auto-delete (uploads after 1 hour, exports after 7 days)
```

---

## **7. Security & Privacy**

### **7.1 Security Architecture**

**Encryption:**
- At rest: PostgreSQL native encryption, R2 encryption
- In transit: TLS 1.3, HSTS header, all HTTPS
- Backups: Encrypted with separate keys

**Authentication:**
- Magic link: 256-bit tokens, 15-min expiry, single-use
- Session: JWT in httpOnly cookie (Secure, SameSite=Lax)
- Rate limiting: 5 requests/hour (magic link), 100 req/min (API)

**Authorization:**
- User can only access own data (server-side validation)
- Feature gating: Tier-based (free/pro/creator)
- Admin access: MFA required, audited

**Application Security:**
- SQL injection: Parameterized queries (Prisma ORM)
- XSS: Output encoding, CSP headers
- CSRF: SameSite cookies, state parameter (OAuth)
- Dependencies: npm audit (CI/CD), Dependabot auto-updates

---

### **7.2 Privacy Implementation**

**GDPR Compliance:**
- Data minimization: Store only necessary data
- Right to access: User can download all data (JSON export)
- Right to erasure: "Delete My Account" button (cascade delete)
- Right to portability: Export in machine-readable format
- Breach notification: 72-hour process documented

**CCPA Compliance:**
- Transparency: Clear privacy policy
- User control: Delete, export anytime
- No data selling: Explicit statement (footer, privacy policy)
- Opt-out: N/A (we don't sell data)

**Privacy by Design:**
- 80% client-side processing (minimize data transfer)
- No account access (manual upload only)
- Anonymized storage (node IDs hashed)
- User preview (see what will be sent before upload)
- Temporary storage (files deleted after processing)

---

## **8. Testing Strategy**

### **8.1 Test Pyramid**

```
Unit Tests (70%):
├─ Scope: Pure functions, algorithms, utilities
├─ Tool: Vitest (or Jest)
├─ Coverage: >80% for core features
├─ Speed: <5ms per test
└─ Run: Every commit (CI/CD)

Integration Tests (20%):
├─ Scope: API endpoints, database operations
├─ Tool: Supertest + Jest
├─ Coverage: All API endpoints
├─ Speed: <100ms per test
└─ Run: Every PR (before merge)

E2E Tests (10%):
├─ Scope: Critical user flows
├─ Tool: Playwright (cross-browser)
├─ Coverage: Login, upload, visualize, export
├─ Speed: <5 minutes full suite
└─ Run: Nightly + before production deployment

Visual Regression Tests:
├─ Tool: Percy or Chromatic
├─ Coverage: Major pages/components
├─ Run: Every PR (manual review if differences)
└─ Purpose: Catch unintended visual changes

Performance Tests:
├─ Tool: Lighthouse CI, k6 (load testing)
├─ Coverage: Page load, API response times
├─ Run: Before production deployment
└─ Purpose: Prevent performance regressions
```

**CI/CD Integration:**
- Every commit: Lint, type check, unit tests
- Every PR: All tests + build + preview deployment
- Block merge: If any tests fail or coverage drops >5%
- Full suite: <10 minutes

---

### **8.2 Parser Testing (Critical)**

```
Test Data:
├─ 30+ real exports per platform
├─ Sizes: Small (<100 connections), Medium (1K-10K), Large (>10K)
├─ Formats: Old (2020-2023), New (2024-2025)
├─ Edge cases: Corrupted, incomplete, non-Latin characters
└─ Update: Quarterly (as formats change)

Test Cases:
├─ Success: Correct number of connections extracted
├─ Accuracy: Parsed data matches source (spot-check)
├─ Error handling: Graceful failures (clear messages)
├─ Performance: Completes within <60s
└─ Version detection: Auto-detects format correctly

Acceptance:
├─ Success rate: >95% across all test files
├─ Accuracy: 100% match for sampled connections
├─ Regression: New changes don't break existing parsers
└─ Documentation: All test files documented
```

---

## **9. Deployment & Operations**

### **9.1 CI/CD Pipeline**

```
GitHub Actions Pipeline:

On Pull Request:
├─ Lint (ESLint, Prettier)
├─ Type check (TypeScript)
├─ Unit tests (Vitest)
├─ Integration tests (Supertest)
├─ Build (verify succeeds)
├─ Security (npm audit)
└─ Deploy preview (Vercel)

On Merge to Main:
├─ All PR checks (repeat)
├─ E2E tests (Playwright)
├─ Performance tests (Lighthouse CI)
├─ Deploy to staging (automatic)
├─ Smoke tests on staging
├─ Deploy to production (automatic if staging passes)
└─ Post-deployment health check

Rollback:
├─ Automatic: If health check fails
├─ Manual: One-click rollback (Vercel/Railway)
└─ Time: <2 minutes
```

---

### **9.2 Monitoring & Observability**

```
Error Tracking:
├─ Tool: Sentry
├─ Coverage: All errors logged, triaged
├─ Alerts: Critical errors → PagerDuty
└─ Review: Weekly error analysis

Performance Monitoring:
├─ Tool: Sentry Performance or Datadog
├─ Metrics: Response time (p50, p95, p99), throughput, error rate
├─ Alerts: p95 >500ms → Slack
└─ Dashboards: Real-time metrics

Analytics:
├─ Tool: PostHog (privacy-friendly)
├─ Tracking: User actions, feature usage
├─ Privacy: Anonymized, no PII
└─ Purpose: Product analytics, not surveillance

Logs:
├─ Format: Structured JSON
├─ Levels: ERROR, WARN, INFO, DEBUG
├─ Retention: 30 days hot, 90 days archive
└─ Search: Elasticsearch (Phase 3+)

Uptime Monitoring:
├─ Tool: UptimeRobot
├─ Frequency: 1-minute checks (multiple locations)
├─ Alerts: >5 minute outage → PagerDuty
└─ Status page: Public (Phase 2+)
```

---

### **9.3 Infrastructure as Code**

```
Tool: Terraform or Pulumi (Phase 2+)
Scope:
├─ Database: PostgreSQL instance
├─ Redis: Cache instance
├─ Storage: R2 buckets
├─ DNS: Domain configuration
└─ Monitoring: Sentry, PostHog, UptimeRobot

Benefits:
├─ Reproducible: Can provision staging from code
├─ Version controlled: All changes in Git
├─ Disaster recovery: Recreate infrastructure if needed
└─ Documentation: Code is documentation
```

---

## **10. Phase-Specific Requirements**

### **10.1 Phase 0: Technical Validation Spike (2 weeks)**

**Must-Have:**
- SRS-F2.2, F2.3, F2.4: All parsers (>95% success)
- SRS-F3.1: Basic force-directed graph (D3.js)
- SRS-NF2: Parsing <60s (typical account)
- SRS-NF3: Visualization 60 FPS (<1K nodes)

**Infrastructure:**
- Minimal: Free tier (Vercel/Railway) or local
- No database: JSON files or in-memory
- No authentication: Open to test users

**Testing:**
- Manual only (5 users)
- 30 real test files (parsers)

**Quality Bar:** 70% (works, rough edges OK)

**Decision Gate:**
- Parser success >95%
- Performance <60s upload-to-viz
- Aha moment 4/5 users
- No critical blockers

---

### **10.2 Phase 1: Foundation (6 weeks)**

**Must-Have:**
- **Authentication:** SRS-F1.1, F1.2, F1.3 (magic link, Google OAuth, sessions)
- **Upload/Parsing:** SRS-F2.1-F2.5 (all parsers production-ready, versioning)
- **Visualization:** SRS-F3.1-F3.4 (force-directed, progressive reveal, interactions, details)
- **Insights:** SRS-F4.1, F4.2, F4.5 (community detection, engagement circles, confidence)
- **Database:** PostgreSQL schema (users, uploads, graphs, insights)
- **Performance:** SRS-NF1, NF2, NF3 (load time, parsing, visualization)
- **Security:** SRS-NF10, NF11, NF12 (auth, data, application security)

**Infrastructure:**
- Frontend: Vercel Pro
- Backend: Railway (Hobby or Starter)
- Database: PostgreSQL (hosted)
- Monitoring: Sentry, PostHog
- Email: Resend

**Testing:**
- Unit tests: >80% coverage (core)
- Integration tests: API endpoints
- Manual testing: 50 beta users

**Quality Bar:** 85% (works well, edge cases handled)

**Decision Gate:**
- 50 beta users onboarded
- Upload completion >60%
- Aha moment rate >40%
- NPS >40
- No P0 bugs

---

### **10.3 Phase 2: Enhancement (6 weeks)**

**Must-Have:**
- **All Phase 1** (complete)
- **Advanced Insights:** SRS-F4.3, F4.4 (key connectors, echo chamber)
- **AI Recommendations:** SRS-F5.1, F5.2, F5.4 (engine, bridges, growth)
- **Export:** SRS-F6.1, F6.2, F6.3, F6.4 (PDF, social cards, data export, sharing)
- **Monetization:** SRS-C4.1, C4.2 (feature gating, Stripe)
- **Compliance:** SRS-NF13, NF14 (GDPR, CCPA)
- **Accessibility:** SRS-NF15 (WCAG AA)
- **Testing:** E2E tests (Playwright)

**Infrastructure:**
- Frontend: Vercel Pro (scaling)
- Backend: Railway Pro or AWS (scaling)
- Database: PostgreSQL (read replicas)
- CDN: Cloudflare (assets)
- Stripe: Payment processing

**Testing:**
- Full suite: Unit, integration, E2E, visual
- Performance: Lighthouse CI

**Quality Bar:** 95% (insanely great, delightful)

**Decision Gate:**
- 1,000 users reached
- Viral coefficient >0.2
- D30 retention >10%
- Free→paid conversion >3%
- Lighthouse >90

---

### **10.4 Phase 3: Scale & Monetization (12 weeks)**

**Must-Have:**
- **All Phase 2** (complete)
- **Scalability:** SRS-NF8, NF9 (horizontal scaling, load balancing)
- **Reliability:** SRS-NF5, NF7 (99.5% uptime, disaster recovery)
- **Advanced Features:** Historical tracking, retention systems
- **Performance:** Canvas/WebGL for >5K nodes

**Infrastructure:**
- Auto-scaling (AWS/GCP) or Railway scaling
- Database: Read replicas, connection pooling
- Monitoring: Full observability (Datadog/New Relic)
- Incident response: PagerDuty

**Quality Bar:** 99% (production-grade, enterprise-ready)

**Decision Gate:**
- 10,000 users
- $10K MRR
- Product-market fit validated
- 99.5% uptime achieved

---

### **10.5 Phase 4: Market Leadership (12+ months)**

**Directional Requirements:**
- 99.9% uptime (enterprise SLA)
- Multi-region deployment
- API platform (developers)
- Mobile apps (iOS, Android)
- International (5+ languages)
- WebGL (>50K nodes)
- Enterprise features (SSO, white-label)

**Infrastructure:**
- Multi-cloud (AWS + GCP)
- Global CDN
- ML-powered monitoring

**Goal:** 100K-500K users, $1M-10M ARR, category dominance

---

## **11. Technology Stack**

### **11.1 Frontend**

```
Framework: Next.js 14 (App Router)
UI Library: React 18 (functional components, hooks)
Styling: TailwindCSS + Framer Motion (animations)
Visualization: D3.js v7, Canvas API
State Management: Zustand (client state), React Query (server state)
Forms: React Hook Form + Zod (validation)
Testing: Vitest, React Testing Library, Playwright
```

---

### **11.2 Backend**

```
Runtime: Node.js 20 (LTS)
Framework: Express.js + TypeScript
Database: PostgreSQL 15
ORM: Prisma (type-safe, migrations)
Authentication: JWT, Passport.js
File Upload: Tus protocol (resumable)
Background Jobs: Bull (Redis queue)
Testing: Vitest, Supertest
```

---

### **11.3 Infrastructure**

```
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
AI: Anthropic Claude API (recommendations)
```

---

### **11.4 Development Tools**

```
Version Control: Git + GitHub
CI/CD: GitHub Actions
Code Quality: ESLint, Prettier, TypeScript
Documentation: Markdown, OpenAPI (API spec)
API Testing: Postman or Insomnia
Load Testing: k6 or Artillery
```

---

## **12. Appendices**

### **12.1 Key Technical Decisions**

**Decision 1: Client-Side vs. Server-Side Processing**
- Decision: 80% client-side
- Rationale: Privacy-first, minimize data transfer, reduce costs
- Trade-off: Requires modern browsers, limited mobile initially
- Alternative considered: 100% server-side (rejected: privacy concerns)

**Decision 2: Monolith vs. Microservices**
- Decision: Monolithic (Phase 0-2)
- Rationale: Simplicity, faster iteration, adequate for 10K users
- Trade-off: May need refactoring at scale
- Alternative: Microservices Day 1 (rejected: premature complexity)

**Decision 3: PostgreSQL vs. NoSQL**
- Decision: PostgreSQL
- Rationale: Relational data, ACID guarantees, proven
- Trade-off: Schema changes require migrations
- Alternative: MongoDB (rejected: data is relational)

**Decision 4: Vercel vs. AWS**
- Decision: Vercel (frontend), Railway (backend) for Phase 0-2
- Rationale: Zero DevOps, fast iteration, affordable
- Trade-off: Vendor lock-in (acceptable, Next.js portable)
- Alternative: AWS Day 1 (rejected: too much DevOps overhead)

---

### **12.2 Glossary**

**Technical Terms:**
- **API:** Application Programming Interface
- **CI/CD:** Continuous Integration/Continuous Deployment
- **JWT:** JSON Web Token (stateless authentication)
- **ORM:** Object-Relational Mapping (database abstraction)
- **RUM:** Real User Monitoring
- **SLA:** Service Level Agreement (uptime guarantee)
- **Web Worker:** Background thread for heavy computation

**Domain Terms:**
- **Betweenness Centrality:** Measure of node importance (bridge metric)
- **Community Detection:** Identifying clusters in network
- **Echo Chamber:** Homogeneous network (low diversity)
- **Force-Directed Graph:** Visualization where nodes repel, edges attract
- **Louvain Algorithm:** Community detection algorithm
- **Modularity:** Quality metric for communities (0-1, higher better)

---

### **12.3 Risk-to-Requirement Mapping**

```
R1 (Platform Format Instability):
├─ Retired by: SRS-F2.2, F2.3, F2.4, F2.5 (parsers + versioning)
├─ Validation: >95% success rate (30+ test files)
└─ Phase: Retired in Phase 0-1

R2 (Manual Upload Friction):
├─ Retired by: SRS-F2.1 (resumable upload), SRS-NF2 (performance), SRS-F3.2 (progressive reveal)
├─ Validation: >60% completion rate
└─ Phase: Retired in Phase 1

R3 (No Aha Moment):
├─ Retired by: SRS-F3.1, F3.2 (graph + progressive reveal), SRS-F4.1-4.5 (insights)
├─ Validation: >40% aha moment rate
└─ Phase: Retired in Phase 1-2

R6 (Browser Limitations):
├─ Retired by: SRS-C3.2 (Web Workers), SRS-F3.5 (performance optimization)
├─ Validation: Handles 5K nodes without crash
└─ Phase: Retired in Phase 1-2
```

---

### **12.4 Compliance Checklist**

**GDPR:**
- [ ] User consent obtained (signup)
- [ ] Data minimization implemented (only necessary data)
- [ ] Right to access (download data)
- [ ] Right to erasure (delete account)
- [ ] Right to portability (JSON export)
- [ ] Privacy policy published
- [ ] Breach notification process documented

**CCPA:**
- [ ] Privacy policy discloses practices
- [ ] Right to know (data disclosure)
- [ ] Right to delete (account deletion)
- [ ] "Do Not Sell" statement prominent
- [ ] No data selling (verified)

**Security:**
- [ ] OWASP Top 10 compliance
- [ ] Encryption at rest (database, files)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Security headers configured
- [ ] Dependency scanning (npm audit)

**Accessibility:**
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Color contrast (4.5:1)
- [ ] Alt text for images

---

## **Document Status**

**Version:** 1.0 (Complete & Condensed)
**Date:** December 2025
**Status:** Living Document - Technical Foundation
**Owner:** Engineering / Architecture
**Next Review:** End of Phase 0 (Week 2, January 2026)
**Confidence:** 95% (Phase 0-2 detailed, Phase 3-4 directional)
**Completeness:** Comprehensive for MVP, will evolve with product

---

## **Next Steps**

1. **Architecture Document:** Detailed technical design (class diagrams, sequence diagrams, component architecture)
2. **Implementation:** Begin Phase 0 (technical validation spike)
3. **Review Cycle:** Weekly review during active development

**This SRS is the technical constitution. All implementation decisions must align with it, or the SRS must be updated with clear rationale documented.**

---

**End of System Requirements Specification v1.0**

*"Architecture is frozen music. Every line of code should sing."*

*December 2025*
*Visual Social Graph*
