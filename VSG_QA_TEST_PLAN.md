# **Visual Social Graph: Quality Assurance & Test Plan**
## **Version 1.0 - Comprehensive Testing Strategy**

*"Quality is not an act, it is a habit. Every test is a contract with our users."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 (Initial Release) |
| **Date** | December 28, 2025 |
| **Status** | Living Document - Quality Foundation |
| **Owner** | QA Engineering / Testing |
| **Review Cycle** | Bi-weekly (Phase 0-1), Monthly (Phase 2+) |
| **Classification** | Internal - Technical |
| **Scope** | Phase 0-3 (comprehensive coverage) |

**Document Hierarchy:**
```
Product Strategy Document v1.1 (strategic constitution)
    ↓ constrains
Product Requirements Document v2.2 (what we're building)
    ↓ defines
System Requirements Specification v1.3 (functional/non-functional requirements)
    ↓ guides
Architecture Document v1.0 (system design)
Security & Privacy Specification (security requirements)
    ↓ validates
QA & Test Plan v1.0 (THIS DOCUMENT - how we ensure quality)
    ↓ implements
Test Suites & Test Cases (actual tests)
```

**Purpose:**

This QA & Test Plan translates product requirements and architectural design into **comprehensive quality assurance strategy** that:
- Defines **testing philosophy** aligned with ultrathink principles
- Establishes **test strategy** across all testing levels
- Specifies **quality gates** and acceptance criteria
- Documents **test coverage requirements** by phase
- Ensures **security testing** compliance with VSG_SECURITY_PRIVACY.md
- Enables **continuous quality improvement** through metrics

---

## **Table of Contents**

1. [Testing Philosophy & Principles](#1-testing-philosophy--principles)
2. [Quality Objectives & Metrics](#2-quality-objectives--metrics)
3. [Test Strategy Overview](#3-test-strategy-overview)
4. [Testing Levels & Types](#4-testing-levels--types)
   - 4.1 [Unit Testing](#41-unit-testing)
   - 4.2 [Integration Testing](#42-integration-testing)
   - 4.3 [End-to-End (E2E) Testing](#43-end-to-end-e2e-testing)
   - 4.4 [Security Testing](#44-security-testing)
   - 4.5 [Performance Testing](#45-performance-testing)
   - 4.6 [Accessibility Testing](#46-accessibility-testing)
   - 4.7 [Visual Regression Testing](#47-visual-regression-testing)
   - 4.8 [API Testing](#48-api-testing)
   - 4.9 [Browser Compatibility Testing](#49-browser-compatibility-testing)
5. [Test Coverage Requirements](#5-test-coverage-requirements)
6. [Test Environment Strategy](#6-test-environment-strategy)
7. [Test Data Management](#7-test-data-management)
8. [Defect Management](#8-defect-management)
9. [CI/CD Integration](#9-cicd-integration)
10. [Phase-Specific Testing](#10-phase-specific-testing)
11. [Quality Gates](#11-quality-gates)
12. [Test Tools & Infrastructure](#12-test-tools--infrastructure)
13. [Roles & Responsibilities](#13-roles--responsibilities)
14. [Risk-Based Testing](#14-risk-based-testing)
15. [Compliance & Security Testing](#15-compliance--security-testing)
16. [Test Metrics & Reporting](#16-test-metrics--reporting)
17. [Appendices](#17-appendices)

---

## **0. API Contract Source of Truth & Drift Prevention**

**CRITICAL**: This QA test plan is NOT the source of truth for API contracts. All API request/response schemas, field names, error codes, and HTTP semantics MUST be derived from the canonical OpenAPI specification.

**Normative Contract (MUST match):**
- **OpenAPI Specification**: [`api-specs/openapi.yaml`](api-specs/openapi.yaml)

**QA Governance Rules:**

1. **MUST: Exact Schema Alignment**
   - All request payload examples in this QA plan MUST match OpenAPI `requestBody` schemas exactly
   - All response assertions MUST match OpenAPI `responses` schemas exactly
   - Field names, types, required/optional, nesting, and formats MUST align character-for-character

2. **MUST: Error Code Alignment**
   - Error codes in test assertions MUST use exact strings from OpenAPI error examples
   - NEVER invent error codes not documented in OpenAPI (lines 3228-3411)
   - If OpenAPI defines `INVALID_SCHEMA`, tests MUST use `INVALID_SCHEMA` (not `VALIDATION_ERROR`)

3. **MUST: Timestamp Format Consistency**
   - `format: date` fields (e.g., `createdAt`) → assert `/^\d{4}-\d{2}-\d{2}$/` (YYYY-MM-DD only)
   - `format: date-time` fields (e.g., `resetAt`) → assert `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}` (ISO 8601)

4. **MUST: HTTP Header Validation**
   - Only assert headers explicitly documented in OpenAPI response definitions
   - Do NOT require headers not in OpenAPI spec (avoid inventing `X-Custom-Header`)

5. **MUST: GraphNode/GraphEdge Field Naming**
   - **Requests**: Use `externalId` for nodes (NOT `originalId`), `source`/`target` for edges
   - **Responses**: Use `id` for nodes (pseudonymized), `source`/`target` for edges (same field name, different values)
   - This aligns with OpenAPI `GraphNode` (lines 2576-2646) and `GraphEdge` (lines 2648-2687)

**Drift Prevention Mechanisms:**

- **Pre-commit Hook**: Run `openapi-lint` to validate spec consistency before commits
- **CI/CD Gate**: Add `openapi-examples-validator` to fail PRs if QA examples drift from OpenAPI
- **Quarterly Audit**: Review all test assertions against OpenAPI spec (QA team responsibility)
- **Update Protocol**: If OpenAPI changes (new endpoint, field rename, error code), QA plan MUST be updated in the SAME PR

**When QA Plan Conflicts with OpenAPI:**
- OpenAPI wins. Always. Update QA plan, not OpenAPI (unless a true spec bug is found)
- Escalate ambiguities to Product/Engineering for OpenAPI amendment

---

## **1. Testing Philosophy & Principles**

### **1.1 Ultrathink Testing Principles**

**"Craft, Don't Code" Applied to Testing**

```
Every test should tell a story
Every assertion should reveal intent
Every failure should guide recovery
Every test name should be self-documenting
Test code is production code
```

**Translation to Testing:**
- ✅ **Test names are sentences**: `should_create_pseudonymized_graph_when_valid_original_ids_provided()`
- ✅ **One logical assertion per test**: Focus on single behavior
- ✅ **Clear arrange-act-assert**: Structure every test consistently
- ✅ **Meaningful error messages**: Failures explain what broke and why
- ✅ **Test code reviews**: Same rigor as production code

**"Simplicity Is Sophistication"**

```
Test the behavior, not the implementation
Avoid test duplication
Prefer integration over mocks (when fast enough)
Keep tests independent (no shared state)
Tests should run in any order
```

**Translation to Testing:**
- ✅ **Black-box testing**: Test public interfaces, not internals
- ✅ **Minimal mocking**: Only mock external dependencies (APIs, databases)
- ✅ **Fast tests**: Unit tests <100ms, integration tests <5s, E2E <60s
- ✅ **Isolated tests**: Each test sets up its own state
- ✅ **Deterministic**: Same input → same output (no flaky tests)

**"Privacy by Design" Applied to Testing**

```
Test data must respect privacy principles
No real user data in tests (synthetic only)
Server-side pseudonymization tested rigorously
Display names NEVER sent to server (test enforcement)
Original IDs transiently processed (verify no persistence)
```

**Translation to Testing:**
- ✅ **Synthetic test data**: Generated fixtures, never production data
- ✅ **Privacy compliance tests**: Verify constitutional constraints (C1, C2, C3)
- ✅ **Pseudonymization verification**: Test HMAC-SHA256 correctness
- ✅ **Data minimization tests**: Assert server NEVER stores display names
- ✅ **Security boundary tests**: Verify original IDs never persisted

**"API Standards & Versioning"**

```
All API endpoints use canonical base URL
Consistent versioning across all tests
Field naming aligns with Option B (server-side pseudonymization)
```

**Translation to Testing:**
- ✅ **Canonical API Base URL**: `https://api.visualsocialgraph.com/api/v1`
- ✅ **All endpoints versioned**: `/api/v1/graphs`, `/api/v1/auth`, `/api/v1/insights`, etc.
- ✅ **Request structure**: Nested under `graph` object: `{ platform, parseVersion, graph: { nodes, edges, metadata } }`
- ✅ **Request field naming**: `externalId` in nodes (OpenAPI spec), `source`/`target` in edges (values are original IDs)
- ✅ **Response field naming**: `id` in nodes (pseudonymized), `source`/`target` in edges (values are pseudonymized IDs)
- ✅ **Required response field**: `pseudonymMapping` ALWAYS present (maps externalId → pseudonymized id)

---

### **1.2 Testing Manifesto**

**We believe in:**

1. **Prevention over Detection**
   - Shift-left testing (test during development, not after)
   - TDD for critical algorithms (write test first)
   - Design for testability (dependency injection, pure functions)

2. **Automation over Manual**
   - Automate repetitive tests (regression suite)
   - Manual testing for exploratory/usability only
   - CI/CD runs all tests on every commit

3. **Fast Feedback over Comprehensive**
   - Run unit tests in <10 seconds (developer flow)
   - Parallel test execution (utilize all CPU cores)
   - Fail fast (stop on first critical failure)

4. **Confidence over Coverage**
   - 80% coverage is floor, not ceiling
   - Critical paths: 100% coverage (auth, pseudonymization, payment)
   - Coverage gaps guide risk assessment

5. **User-Centric Testing**
   - Test user journeys, not just functions
   - Accessibility is quality (WCAG AA compliance)
   - Performance is quality (Lighthouse >90)

---

### **1.3 Rate Limiting vs Quota Exceeded Semantics**

**Understanding the Distinction:**

Visual Social Graph distinguishes between two types of usage restrictions with different semantics and test expectations:

**RATE_LIMITED (HTTP 429):**
- **Definition**: Short-term rate window exceeded (e.g., 10 requests per minute)
- **Retryable**: `retryable: true`
- **HTTP Header**: `Retry-After` header present (indicates wait time in seconds)
- **Use Case**: Prevents abuse, smooths load
- **User Action**: Wait and retry automatically

**QUOTA_EXCEEDED (HTTP 429):**
- **Definition**: Tier-based quota limit reached (e.g., 5 graphs/day for free tier)
- **Retryable**: `retryable: false` (client should NOT retry immediately)
- **HTTP Headers**: `Retry-After` (seconds until quota reset - per OpenAPI spec)
- **Additional Info**: `details.resetAt` timestamp (ISO 8601 date-time), `suggestedAction` suggests upgrade
- **Use Case**: Enforces subscription tier limits (daily/monthly quotas)
- **User Action**: Upgrade subscription tier OR wait until quota resets (hours/days)

**Test Expectations:**

```typescript
// Rate limiting test (429):
expect(response.status).toBe(429);
expect(response.body.error).toMatchObject({
  code: 'RATE_LIMITED',
  message: expect.stringContaining('rate limit'),
  retryable: true
});
expect(response.headers['retry-after']).toBeDefined();

// Quota exceeded test (429):
expect(response.status).toBe(429);
expect(response.body.error).toMatchObject({
  code: 'QUOTA_EXCEEDED',
  message: expect.stringContaining('quota exceeded'),
  retryable: false,
  details: expect.objectContaining({
    tier: expect.any(String),
    limit: expect.any(Number),
    resetAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/) // ISO 8601 date-time
  })
});
expect(response.headers['retry-after']).toBeDefined(); // Seconds until reset (per OpenAPI)
```

---

## **2. Quality Objectives & Metrics**

### **2.1 Phase-Specific Quality Targets**

| Phase | Quality Target | Test Coverage | Defect Escape Rate | User-Facing Bugs | Uptime |
|-------|----------------|---------------|-------------------|------------------|--------|
| **Phase 0 (Prototype)** | 70% | Unit: >60%<br>Integration: >40%<br>E2E: Critical paths | <30% | Acceptable (5 users) | 95% |
| **Phase 1 (Complete Product Launch)** | 95% | Unit: >85%<br>Integration: >80%<br>E2E: >90% | <5% | Critical: 0<br>High: <3 | 99.5% |
| **Phase 2 (Scale & Monetization)** | 99% | Unit: >90%<br>Integration: >85%<br>E2E: >95% | <2% | Critical: 0<br>High: <1 | 99.9% |
| **Phase 3 (Leadership)** | 99.9% | Unit: >95%<br>Integration: >90%<br>E2E: >98% | <1% | Critical: 0<br>High: 0 | 99.99% |

**Definitions:**
- **Quality Target**: Overall product quality (subjective + objective)
- **Defect Escape Rate**: % of bugs found in production (vs caught in testing)
- **User-Facing Bugs**: Issues reported by users in production

---

### **2.2 Key Quality Metrics**

**Test Health Metrics:**
- **Test Pass Rate**: >98% (Phase 1+)
- **Test Flakiness**: <1% (no intermittent failures)
- **Test Execution Time**: Unit <10s, Integration <60s, E2E <300s
- **Code Coverage**: Line >80%, Branch >75%, Function >85%

**Defect Metrics:**
- **Mean Time to Detect (MTTD)**: <24 hours (production defects)
- **Mean Time to Resolve (MTTR)**: Critical <4h, High <24h, Medium <7d
- **Defect Density**: <0.5 defects per 1000 lines of code (Phase 1+)
- **Reopen Rate**: <10% (defects reopened after fix)

**Performance Metrics (see [Section 4.5](#45-performance-testing)):**
- **Lighthouse Score**: >90 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **API Response Time**: p95 <500ms (reads), <1000ms (writes)
- **Graph Visualization**: 60 FPS for <10K nodes, 30 FPS for <50K nodes

**Security Metrics (see [Section 4.4](#44-security-testing)):**
- **OWASP Top 10 Compliance**: 100% (no critical vulnerabilities)
- **Dependency Vulnerabilities**: 0 high/critical (automated scans)
- **Penetration Test Findings**: 0 critical, <3 high (annual assessment)
- **Security Test Coverage**: 100% for authentication, authorization, pseudonymization

---

## **3. Test Strategy Overview**

### **3.1 Testing Pyramid**

```
                     ╱╲
                    ╱ E2E╲         10% (Critical user flows)
                   ╱──────╲        Manual: Exploratory
                  ╱        ╲       Automated: Playwright
                 ╱Integration╲    20% (API + Services)
                ╱────────────╲    Tools: Vitest + Supertest
               ╱              ╲   Focus: Contracts, database
              ╱  Unit Tests    ╲ 70% (Pure logic, algorithms)
             ╱──────────────────╲ Tools: Vitest + Jest
            ╱____________________╲ Focus: Business logic

           Supplementary Tests (Cross-Cutting):
           ────────────────────────────────────
           Security | Performance | Accessibility | Visual Regression
```

### **3.2 Test Quadrants (Agile Testing)**

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│ Q1: Technology-Facing (Support Dev) │ Q2: Business-Facing (Support Dev)   │
│                                     │                                     │
│ • Unit Tests                        │ • Functional Tests (E2E)            │
│ • Component Tests                   │ • Story Tests (BDD)                 │
│ • Integration Tests                 │ • Prototypes                        │
│                                     │ • Simulations                       │
│ Automated | Continuous              │ Automated + Manual | Continuous     │
│ Tools: Vitest, Jest                 │ Tools: Playwright, Cucumber         │
└─────────────────────────────────────┴─────────────────────────────────────┘
┌─────────────────────────────────────┬─────────────────────────────────────┐
│ Q3: Business-Facing (Critique Prod) │ Q4: Technology-Facing (Critique)    │
│                                     │                                     │
│ • Exploratory Testing               │ • Performance Testing               │
│ • Usability Testing                 │ • Load Testing                      │
│ • UAT (User Acceptance)             │ • Security Testing                  │
│ • Alpha/Beta Testing                │ • Penetration Testing               │
│                                     │                                     │
│ Manual | Per Release                │ Automated + Manual | Continuous     │
│ Tools: User Sessions                │ Tools: k6, OWASP ZAP, Lighthouse    │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

---

### **3.3 Risk-Based Testing Approach**

**Critical Risk Areas (Maximum Test Investment):**

| Component | Risk Level | Test Coverage Target | Testing Focus |
|-----------|-----------|---------------------|---------------|
| **Server-Side Pseudonymization** | **CRITICAL** | 100% | • HMAC-SHA256 correctness<br>• Original IDs never persisted<br>• Mapping always returned<br>• Key management security |
| **Authentication (Magic Link)** | **CRITICAL** | 100% | • Token generation/validation<br>• Session management<br>• CSRF protection<br>• Rate limiting |
| **Payment Processing** | **CRITICAL** | 100% | • Stripe integration<br>• Webhook signature verification<br>• Idempotency enforcement<br>• Subscription state transitions |
| **Graph Visualization** | **HIGH** | >90% | • Rendering correctness<br>• Performance (60 FPS)<br>• Interaction handling<br>• Edge cases (large graphs) |
| **Platform Parsers** | **HIGH** | >95% | • Fixture-based testing (30+ real exports)<br>• Success rate >95%<br>• Data accuracy validation<br>• Error handling |
| **Insight Generation** | **MEDIUM** | >85% | • Template matching accuracy<br>• Metric calculation correctness<br>• Confidence scoring<br>• Narrative interpolation |
| **Export Generation** | **MEDIUM** | >80% | • PDF quality<br>• CSV accuracy<br>• Format validation<br>• Large graph handling |

---

### **3.4 Shift-Left Testing Strategy**

**Development Phase → Testing Activities**

```
Requirements Analysis:
├─ Testability review (can we test this?)
├─ Acceptance criteria definition
├─ Edge case identification
└─ Test case design (before coding)

Development:
├─ TDD for critical components (write test first)
├─ Unit tests written alongside code
├─ Static analysis (linting, type checking)
└─ Pre-commit hooks (lint + type check)

Code Review:
├─ Test coverage reviewed
├─ Test quality assessed
├─ Edge cases validated
└─ Test data realism checked

Merge:
├─ CI runs full test suite
├─ Coverage regression check
├─ Performance regression check
└─ Security vulnerability scan

Deployment:
├─ Smoke tests (critical paths)
├─ Integration tests (staging)
├─ Performance tests (staging)
└─ Security scans (production)

Production:
├─ Synthetic monitoring
├─ Error tracking (Sentry)
├─ Performance monitoring (Web Vitals)
└─ User feedback analysis
```

---

## **4. Testing Levels & Types**

### **4.1 Unit Testing**

**Objective**: Validate individual functions, methods, and components in isolation.

**Scope**:
- Pure functions (parsers, validators, utilities)
- Business logic (graph algorithms, metrics calculation)
- React components (isolated rendering)
- React hooks (state management, effects)
- Service classes (with mocked dependencies)

**Tools**:
- **Frontend**: Vitest + React Testing Library
- **Backend**: Vitest + Node.js test utilities
- **Mocking**: Vitest mocks, MSW (Mock Service Worker)
- **Coverage**: Vitest coverage (c8/istanbul)

**Coverage Requirements**:
- **Phase 1**: >85% line coverage, >80% branch coverage
- **Phase 2**: >90% line coverage, >85% branch coverage
- **Critical components**: 100% coverage (auth, pseudonymization, payment)

**Best Practices**:

```typescript
// ✅ GOOD: Clear test name, single assertion, AAA pattern
describe('HmacPseudonymizer', () => {
  describe('pseudonymize()', () => {
    it('should generate deterministic pseudonym for same input and key', () => {
      // Arrange
      const pseudonymizer = new HmacPseudonymizer();
      const userKey = 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6';
      const originalId = '123456789';

      // Act
      const pseudonym1 = pseudonymizer.pseudonymize(originalId, userKey);
      const pseudonym2 = pseudonymizer.pseudonymize(originalId, userKey);

      // Assert
      expect(pseudonym1).toBe(pseudonym2);
      expect(pseudonym1).toMatch(/^node_[a-f0-9]{64}$/);
    });

    it('should generate different pseudonyms for different keys', () => {
      // Arrange
      const pseudonymizer = new HmacPseudonymizer();
      const originalId = '123456789';
      const userKey1 = 'key1_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6';
      const userKey2 = 'key2_x9Y8z7W6v5U4t3S2r1Q0p9O8n7M6l5K4';

      // Act
      const pseudonym1 = pseudonymizer.pseudonymize(originalId, userKey1);
      const pseudonym2 = pseudonymizer.pseudonymize(originalId, userKey2);

      // Assert
      expect(pseudonym1).not.toBe(pseudonym2);
    });

    it('should throw error when original ID is empty', () => {
      // Arrange
      const pseudonymizer = new HmacPseudonymizer();
      const userKey = 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6';

      // Act & Assert
      expect(() => {
        pseudonymizer.pseudonymize('', userKey);
      }).toThrow('Original ID cannot be empty');
    });
  });
});

// ❌ BAD: Multiple assertions, unclear name, implementation details
it('works', () => {
  const p = new HmacPseudonymizer();
  expect(p._internalMethod()).toBeTruthy(); // Testing private method
  expect(p.pseudonymize('1', 'k')).toBeTruthy();
  expect(p.pseudonymize('2', 'k')).toBeTruthy(); // Multiple behaviors
});
```

**Critical Unit Tests**:

1. **Server-Side Pseudonymization** (100% coverage required):
   ```typescript
   // Test suite: /backend/tests/unit/services/pseudonymization.test.ts

   describe('PseudonymizationService', () => {
     it('should pseudonymize node IDs using HMAC-SHA256');
     it('should return pseudonym mapping with all original IDs');
     it('should NOT persist original IDs to database');
     it('should generate same pseudonym for same user across multiple graphs');
     it('should generate different pseudonyms for different users');
     it('should handle large ID sets (1M+ nodes) within memory limits');
     it('should throw error when user key is missing');
     it('should validate original ID format before processing');
   });
   ```

2. **Graph Algorithms** (>95% coverage):
   ```typescript
   // Test suite: /frontend/tests/unit/algorithms/graph-metrics.test.ts

   describe('GraphMetrics', () => {
     describe('calculateDegree()', () => {
       it('should calculate in-degree for directed graph');
       it('should calculate out-degree for directed graph');
       it('should calculate total degree for undirected graph');
       it('should handle isolated nodes (degree = 0)');
       it('should handle self-loops correctly');
     });

     describe('calculatePageRank()', () => {
       it('should converge to correct PageRank scores');
       it('should handle disconnected components');
       it('should normalize scores to sum = 1.0');
       it('should terminate after max iterations');
       it('should apply damping factor correctly (0.85)');
     });

     describe('calculateBetweenness()', () => {
       it('should identify bridge nodes with high betweenness');
       it('should handle graphs with no bridges');
       it('should normalize scores for graph size');
     });
   });
   ```

3. **Platform Parsers** (>95% coverage + fixture-based):
   ```typescript
   // Test suite: /frontend/tests/unit/parsers/twitter-parser.test.ts

   describe('TwitterParser', () => {
     it('should parse following.js file correctly', async () => {
       const fixture = await loadFixture('twitter-archive-sample/data/following.js');
       const parser = new TwitterParser();

       const result = await parser.parse(fixture);

       expect(result.success).toBe(true);
       expect(result.nodes).toHaveLength(250); // Known fixture size
       expect(result.nodes[0]).toMatchObject({
         externalId: expect.stringMatching(/^\d+$/),
         followerCount: expect.any(Number),
       });
     });

     it('should handle malformed JSON gracefully');
     it('should extract follower count when available');
     it('should parse timestamp with day-level granularity');
     it('should deduplicate duplicate entries');
     it('should report parsing errors with line numbers');
   });
   ```

**Test Data**:
- Use **factories** for consistent test object creation
- Use **fixtures** for complex data (real platform exports, anonymized)
- Use **property-based testing** for edge cases (fast-check library)

**Performance Requirements**:
- Unit test suite: <10 seconds total execution time
- Single unit test: <100ms (fast feedback)
- Watch mode: Run only affected tests (<2s)

---

### **4.2 Integration Testing**

**Objective**: Validate interactions between components, services, and external dependencies.

**Scope**:
- API endpoint contracts (request → response)
- Database operations (CRUD, transactions)
- Service integrations (authentication, payment)
- Message queues / event buses (if applicable)
- Third-party API mocking (Stripe, email)

**Tools**:
- **API Testing**: Supertest + Vitest
- **Database**: Test database (PostgreSQL) + Prisma migrations
- **Mocking**: MSW (Mock Service Worker) for HTTP
- **Containers**: Docker Compose for local integration env

**Coverage Requirements**:
- **Phase 1**: >80% of API endpoints + database operations
- **Phase 2**: >85% of all integration points

**Best Practices**:

```typescript
// ✅ GOOD: Integration test with real database (test isolation)
describe('POST /api/v1/graphs', () => {
  let testDb: TestDatabase;
  let testUser: User;

  beforeEach(async () => {
    // Setup: Fresh test database per test
    testDb = await TestDatabase.create();
    testUser = await testDb.createUser({
      email: 'test@example.com',
      tier: 'free'
    });
  });

  afterEach(async () => {
    // Teardown: Clean up test database
    await testDb.destroy();
  });

  it('should create graph with server-side pseudonymization', async () => {
    // Arrange
    const authToken = generateJWT(testUser.id);
    const graphPayload = {
      platform: 'twitter',
      parseVersion: 'twitter_v2.1',
      graph: {
        nodes: [
          { externalId: '123456789', followerCount: 100, type: 'user' },
          { externalId: '987654321', followerCount: 200, type: 'user' }
        ],
        edges: [
          { source: '123456789', target: '987654321', type: 'follows', weight: 1.0 }
        ],
        metadata: {
          statistics: {
            nodeCount: 2,
            edgeCount: 1
          }
        }
      }
    };

    // Act
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${authToken}`)
      .set('X-CSRF-Token', getCsrfToken())
      .send(graphPayload)
      .expect(201);

    // Assert: Response structure
    expect(response.body).toMatchObject({
      id: expect.stringMatching(/^graph_[A-Za-z0-9]{26}$/),
      platform: 'twitter',
      nodeCount: 2,
      edgeCount: 1,
      pseudonymMapping: {
        '123456789': expect.stringMatching(/^node_[a-f0-9]{64}$/),
        '987654321': expect.stringMatching(/^node_[a-f0-9]{64}$/)
      }
    });

    // Assert: Database persistence (pseudonymized only)
    const graph = await testDb.findGraph(response.body.id);
    expect(graph.nodes[0].id).toBe(response.body.pseudonymMapping['123456789']);
    expect(graph.nodes[0].externalId).toBeUndefined(); // Original externalId NOT stored (privacy guarantee)

    // Assert: Privacy guarantee
    const dbRawQuery = await testDb.query(
      `SELECT * FROM graph_nodes WHERE graph_id = $1`,
      [response.body.id]
    );
    expect(JSON.stringify(dbRawQuery)).not.toContain('123456789'); // No original IDs in DB
  });

  it('should enforce daily quota limit for free tier (429 QUOTA_EXCEEDED)', async () => {
    // Arrange: Create 5 graphs (free tier daily quota)
    const authToken = generateJWT(testUser.id);
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: `user_${i}`, type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(201);
    }

    // Act: Attempt 6th graph
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${authToken}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: 'user_6', type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(429); // 429 for tier plan quota exceeded (QuotaExceeded429)

    // Assert: Quota exceeded error (429 - tier plan quota, not retryable)
    expect(response.body.error).toMatchObject({
      code: 'QUOTA_EXCEEDED',
      message: expect.stringContaining('Daily graph creation quota exceeded'),
      retryable: false,
      details: expect.objectContaining({
        tier: 'free',
        limit: 5,
        used: 5,
        resetAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
      })
    });
    expect(response.headers['retry-after']).toBeDefined(); // Shows seconds until quota reset
    expect(response.headers['x-ratelimit-limit']).toBe('5');
    expect(response.headers['x-ratelimit-remaining']).toBe('0');
    expect(response.headers['x-ratelimit-reset']).toBeDefined();
  });
});
```

**Critical Integration Tests**:

1. **Authentication Flow** (100% coverage):
   ```typescript
   describe('Magic Link Authentication', () => {
     it('POST /api/v1/auth/magic-link - should send magic link email');
     it('POST /api/v1/auth/verify - should create session on valid token (token in body)');
     it('POST /api/v1/auth/verify - should reject expired token (>15 min)');
     it('POST /api/v1/auth/verify - should reject used token (single-use)');
     it('POST /api/v1/auth/logout - should invalidate session cookie');
   });
   ```

2. **Pseudonymization Contract** (100% coverage):
   ```typescript
   describe('Graph Creation with Pseudonymization', () => {
     it('should accept original IDs in request');
     it('should return pseudonymMapping in response (ALWAYS)');
     it('should persist ONLY pseudonymized IDs to database');
     it('should NOT persist original IDs anywhere');
     it('should reject request with display names (privacy violation)');
   });
   ```

3. **Payment Webhook** (100% coverage):
   ```typescript
   describe('Stripe Webhook Handler', () => {
     it('POST /api/v1/webhooks/stripe - should upgrade user to Pro on payment success');
     it('POST /api/v1/webhooks/stripe - should reject invalid signature');
     it('POST /api/v1/webhooks/stripe - should handle idempotent retries');
     it('POST /api/v1/webhooks/stripe - should downgrade user on subscription cancellation');
   });
   ```

**Test Environment**:
- **Database**: Dockerized PostgreSQL (ephemeral, per-test-suite)
- **Redis**: Dockerized Redis (for session testing)
- **Mock Services**: MSW for Stripe API, email service
- **Isolation**: Each test suite gets fresh database (no shared state)

**Performance Requirements**:
- Integration test suite: <60 seconds total
- Single integration test: <5 seconds
- Database setup/teardown: <1 second per test

---

### **4.3 End-to-End (E2E) Testing**

**Objective**: Validate complete user workflows from browser to backend to database.

**Scope**:
- Critical user journeys (happy paths)
- Cross-browser compatibility
- Real browser interactions (clicks, typing, file uploads)
- Visual validation (screenshots, PDFs)
- Error handling flows (network errors, validation failures)

**Tools**:
- **E2E Framework**: Playwright (Chromium, Firefox, Safari)
- **Assertions**: Playwright Test assertions
- **Visual Testing**: Playwright screenshots + Percy.io
- **Test Data**: Synthetic user accounts + fixture files

**Coverage Requirements**:
- **Phase 1**: >90% of user-facing features including critical journeys (auth, upload, visualize)
- **Phase 2**: >95% including error paths and edge cases

**Critical E2E Test Flows**:

```typescript
// Test suite: /e2e/tests/critical-user-journey.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Critical User Journey: Upload → Visualize → Export', () => {
  test('should complete full workflow as new user', async ({ page }) => {
    // ═══════════════════════════════════════════════════════════
    // STEP 1: Authentication (Magic Link)
    // ═══════════════════════════════════════════════════════════

    await test.step('User requests magic link', async () => {
      await page.goto('/');
      await page.click('text=Sign in');
      await page.fill('input[type="email"]', 'e2e-test@example.com');
      await page.click('button:has-text("Send Magic Link")');

      await expect(page.locator('text=Check your email')).toBeVisible();
    });

    await test.step('User clicks magic link and gets authenticated', async () => {
      // Simulate magic link click (get token from test email inbox)
      const magicLinkToken = await getTestMagicLinkToken('e2e-test@example.com');

      // Navigate to verification page with token in URL fragment (avoids logging/referrer leakage)
      await page.goto(`/auth/verify#token=${magicLinkToken}`);

      // Assert: Frontend extracts token from fragment and POSTs to /api/v1/auth/verify
      // (Token should NOT appear in URL query string to prevent server log leakage)
      await page.waitForRequest(request =>
        request.url().includes('/api/v1/auth/verify') &&
        request.method() === 'POST'
      );

      // Assert: URL fragment is cleaned after auth (security best practice)
      await expect(page).toHaveURL('/dashboard');
      expect(page.url()).not.toContain('token='); // Token removed from URL

      await expect(page.locator('text=Welcome')).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Graph Upload (Server-Side Pseudonymization)
    // ═══════════════════════════════════════════════════════════

    await test.step('User uploads Twitter archive', async () => {
      await page.click('text=Upload Graph');

      // Upload fixture file (real Twitter export, anonymized)
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./fixtures/twitter-archive-sample.zip');

      // Select platform
      await page.selectOption('select[name="platform"]', 'twitter');

      // Click upload
      await page.click('button:has-text("Process Archive")');

      // Wait for upload progress
      await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
      await expect(page.locator('text=Parsing archive')).toBeVisible();
      await expect(page.locator('text=Building graph')).toBeVisible();

      // Wait for completion (timeout: 30 seconds)
      await expect(page.locator('text=Graph created successfully')).toBeVisible({
        timeout: 30000
      });
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Graph Visualization
    // ═══════════════════════════════════════════════════════════

    await test.step('User views graph visualization', async () => {
      await page.click('text=View Graph');

      // Wait for graph to render
      await expect(page.locator('canvas[data-testid="graph-canvas"]')).toBeVisible();

      // Verify graph rendered (check canvas has content)
      const canvasHasContent = await page.evaluate(() => {
        const canvas = document.querySelector('canvas[data-testid="graph-canvas"]') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data.some(pixel => pixel !== 0); // Non-blank canvas
      });
      expect(canvasHasContent).toBe(true);

      // Verify nodes are interactive (hover shows label)
      await page.hover('canvas[data-testid="graph-canvas"]', { position: { x: 400, y: 300 } });
      await expect(page.locator('[data-testid="node-tooltip"]')).toBeVisible();
    });

    await test.step('User views insights', async () => {
      await page.click('text=Insights');

      // Verify insights loaded
      await expect(page.locator('[data-testid="insight-card"]')).toHaveCount(3, {
        timeout: 5000
      });

      // Verify insight categories
      await expect(page.locator('text=Network Structure')).toBeVisible();
      await expect(page.locator('text=Influence Analysis')).toBeVisible();
      await expect(page.locator('text=Community Detection')).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 4: Export
    // ═══════════════════════════════════════════════════════════

    await test.step('User exports graph as PDF', async () => {
      await page.click('button:has-text("Export")');
      await page.click('text=Export as PDF');

      // Wait for PDF generation
      await expect(page.locator('text=Generating PDF')).toBeVisible();

      // Wait for download
      const downloadPromise = page.waitForEvent('download');
      const download = await downloadPromise;

      // Verify download filename
      expect(download.suggestedFilename()).toMatch(/^graph-.*\.pdf$/);

      // Verify PDF is not empty
      const path = await download.path();
      const fs = require('fs');
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(10000); // At least 10KB
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 5: Privacy Verification (Server-Side Pseudonymization)
    // ═══════════════════════════════════════════════════════════

    await test.step('Verify display names never sent to server', async () => {
      // Intercept all network requests during upload
      const requests: string[] = [];
      page.on('request', request => {
        if (request.url().includes('/api/')) {
          requests.push(request.postData() || '');
        }
      });

      // Trigger re-upload (to capture requests)
      await page.goto('/dashboard');
      await page.click('text=Upload Graph');
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./fixtures/twitter-archive-sample.zip');
      await page.click('button:has-text("Process Archive")');

      // Wait for upload to complete
      await expect(page.locator('text=Graph created successfully')).toBeVisible({
        timeout: 30000
      });

      // Assert: No display names in any API request
      const allRequestData = requests.join(' ');
      expect(allRequestData).not.toContain('displayName');
      expect(allRequestData).not.toContain('username');
      expect(allRequestData).not.toContain('@'); // No usernames like @janedoe

      // Assert: Only external IDs sent to server
      expect(allRequestData).toContain('externalId');
      expect(allRequestData).not.toContain('originalId');
      expect(allRequestData).not.toContain('sourceOriginalId');
      expect(allRequestData).not.toContain('targetOriginalId');
    });
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    await authenticateUser(page, 'e2e-test@example.com');

    await test.step('User uploads invalid file', async () => {
      await page.goto('/dashboard');
      await page.click('text=Upload Graph');

      // Upload invalid file (not a ZIP)
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./fixtures/invalid-file.txt');
      await page.click('button:has-text("Process Archive")');

      // Should show error
      await expect(page.locator('text=Invalid file format')).toBeVisible();
      await expect(page.locator('text=Please upload a ZIP file')).toBeVisible();
    });

    await test.step('User uploads corrupted archive', async () => {
      await page.reload();

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./fixtures/corrupted-archive.zip');
      await page.click('button:has-text("Process Archive")');

      // Should show parsing error
      await expect(page.locator('text=Failed to parse archive')).toBeVisible();
      await expect(page.locator('text=Try downloading a fresh copy')).toBeVisible();
    });
  });
});
```

**E2E Test Organization**:

```
/e2e/
├── tests/
│   ├── critical-user-journey.spec.ts     # Happy paths (priority 1)
│   ├── auth-flows.spec.ts                # Magic link, OAuth, logout
│   ├── graph-upload.spec.ts              # All upload variations
│   ├── visualization.spec.ts             # Graph rendering, interactions
│   ├── insights.spec.ts                  # Insight generation, display
│   ├── exports.spec.ts                   # PDF, CSV, PNG exports
│   ├── payments.spec.ts                  # Stripe checkout, upgrades
│   ├── error-handling.spec.ts            # Network errors, validation
│   └── accessibility.spec.ts             # Keyboard nav, screen readers
├── fixtures/
│   ├── twitter-archive-sample.zip        # Real Twitter export (anonymized)
│   ├── instagram-archive-sample.zip      # Real Instagram export
│   ├── corrupted-archive.zip             # For error testing
│   └── large-graph-100k-nodes.zip        # Performance testing
├── helpers/
│   ├── auth.ts                           # Authentication helpers
│   ├── test-data.ts                      # Synthetic data generators
│   └── assertions.ts                     # Custom assertions
└── playwright.config.ts                  # Playwright configuration
```

**Browser Coverage**:
- **Phase 1**: Chromium + Firefox + Safari (full coverage)
- **Phase 2**: + Edge, mobile browsers (comprehensive)

**Performance Requirements**:
- E2E test suite: <5 minutes (parallel execution)
- Single E2E test: <60 seconds
- Critical path tests: <30 seconds

**Visual Regression** (integrated with E2E):

```typescript
test('should match visual snapshot of graph visualization', async ({ page }) => {
  await page.goto('/graphs/test-graph-id');

  // Wait for graph to fully render
  await page.waitForSelector('canvas[data-testid="graph-canvas"]');
  await page.waitForTimeout(2000); // Animation settle

  // Take screenshot and compare to baseline
  await expect(page).toHaveScreenshot('graph-visualization.png', {
    maxDiffPixels: 100, // Allow minor rendering differences
    threshold: 0.2      // 20% similarity threshold
  });
});
```

---

### **4.4 Security Testing**

**Objective**: Validate security controls, identify vulnerabilities, enforce constitutional constraints.

**Scope**:
- OWASP Top 10 vulnerability testing
- Authentication & authorization testing
- Pseudonymization verification
- Privacy constraint enforcement (C1, C2, C3)
- Dependency vulnerability scanning
- Penetration testing (annual)

**Tools**:
- **SAST** (Static Analysis): CodeQL, Semgrep, ESLint security rules
- **DAST** (Dynamic Analysis): OWASP ZAP, Burp Suite
- **Dependency Scanning**: Snyk, npm audit, Dependabot
- **Secret Scanning**: GitGuardian, Gitleaks
- **Penetration Testing**: Third-party security firm (annual)

**Coverage Requirements**:
- **OWASP Top 10**: 100% coverage (no critical vulnerabilities)
- **Authentication**: 100% of auth endpoints tested
- **Authorization**: 100% of protected resources tested
- **Pseudonymization**: 100% test coverage
- **Dependency Vulnerabilities**: 0 high/critical (continuous monitoring)

**Security Test Categories**:

#### **4.4.1 OWASP Top 10 Testing**

| OWASP Category | Test Strategy | Tools | Acceptance Criteria |
|----------------|---------------|-------|---------------------|
| **A01: Broken Access Control** | • Test IDOR vulnerabilities<br>• Test horizontal/vertical privilege escalation<br>• Test missing authorization checks | ZAP, Manual | 0 findings |
| **A02: Cryptographic Failures** | • Test TLS configuration<br>• Test encryption at rest<br>• Test password/token hashing | SSL Labs, ZAP | All A+ rating |
| **A03: Injection** | • SQL injection (parameterized queries)<br>• XSS (CSP, output encoding)<br>• Command injection | ZAP, Manual, CodeQL | 0 findings |
| **A04: Insecure Design** | • Review constitutional constraints<br>• Test privacy boundaries<br>• Threat modeling | Manual review | 100% compliance |
| **A05: Security Misconfiguration** | • Test security headers<br>• Test CORS policies<br>• Test error messages (no info leakage) | ZAP, Lighthouse | All headers present |
| **A06: Vulnerable Components** | • Dependency vulnerability scan<br>• Automated updates | Snyk, Dependabot | 0 high/critical |
| **A07: Auth Failures** | • Test magic link expiry<br>• Test session management<br>• Test CSRF protection | ZAP, Manual | 0 findings |
| **A08: Software/Data Integrity** | • Test webhook signature verification<br>• Test SRI for CDN assets | Manual, ZAP | 100% verified |
| **A09: Logging Failures** | • Test PII not in logs<br>• Test security event logging | Manual review | 100% compliant |
| **A10: SSRF** | • Test external URL validation<br>• Test upload processing | ZAP, Manual | 0 findings |

**Automated Security Tests**:

```typescript
// Test suite: /backend/tests/security/owasp-top10.test.ts

describe('OWASP A01: Broken Access Control', () => {
  it('should prevent IDOR on graph access', async () => {
    // Arrange: Create two users with separate graphs
    const user1 = await createTestUser({ email: 'user1@test.com' });
    const user2 = await createTestUser({ email: 'user2@test.com' });

    const graph1 = await createTestGraph({ userId: user1.id });
    const graph2 = await createTestGraph({ userId: user2.id });

    // Act: User 1 tries to access User 2's graph
    const response = await request(app)
      .get(`/api/v1/graphs/${graph2.id}`)
      .set('Cookie', `vsg_session=${generateJWT(user1.id)}`)
      .expect(404); // NOT 403 (prevents enumeration)

    // Assert: Error message doesn't reveal existence
    expect(response.body.error.message).toBe('Graph not found');
    expect(response.body.error.message).not.toContain('not authorized'); // No info leakage
  });

  it('should enforce tier-based feature access', async () => {
    // Arrange: Free tier user
    const freeUser = await createTestUser({ tier: 'free' });

    // Act: Free user tries to access Pro feature (Advanced Insights)
    const response = await request(app)
      .get('/api/v1/insights/advanced')
      .set('Cookie', `vsg_session=${generateJWT(freeUser.id)}`)
      .expect(403);

    // Assert: Feature restriction error
    expect(response.body.error.code).toBe('TIER_FEATURE_RESTRICTED');
    expect(response.body.error.message).toContain('Upgrade to Pro');
  });
});

describe('OWASP A03: Injection', () => {
  it('should prevent SQL injection in graph search', async () => {
    const user = await createTestUser();

    // Act: Malicious SQL in search query
    const maliciousQuery = "'; DROP TABLE graphs; --";
    const response = await request(app)
      .get(`/api/v1/graphs?search=${encodeURIComponent(maliciousQuery)}`)
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .expect(200); // Should not crash

    // Assert: Database still intact
    const graphs = await db.graph.findMany();
    expect(graphs).toBeDefined(); // Table not dropped
  });

  it('should reject unexpected fields (schema hardening against injection)', async () => {
    const user = await createTestUser();

    // Act: XSS payload in unexpected field
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        name: xssPayload,
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: '123', type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(400);

    expect(response.body.error.code).toBe('INVALID_SCHEMA');
    expect(response.body.error.message).toContain('name');
  });
});

describe('OWASP A07: Authentication Failures', () => {
  it('should expire magic link tokens after 15 minutes', async () => {
    // Arrange: Generate magic link
    const email = 'test@example.com';
    await request(app)
      .post('/api/v1/auth/magic-link')
      .send({ email })
      .expect(200);

    const token = await getTestMagicLinkToken(email);

    // Act: Wait 16 minutes (simulate with clock manipulation)
    jest.advanceTimersByTime(16 * 60 * 1000);

    const response = await request(app)
      .post('/api/v1/auth/verify')
      .send({ token })
      .expect(400);

    // Assert: Token expired
    expect(response.body.error.code).toBe('INVALID_TOKEN');
  });

  it('should invalidate magic link after single use', async () => {
    // Arrange: Generate and use magic link
    const email = 'test@example.com';
    await request(app).post('/api/v1/auth/magic-link').send({ email });
    const token = await getTestMagicLinkToken(email);

    await request(app).post('/api/v1/auth/verify').send({ token }).expect(200);

    // Act: Try to reuse same token
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .send({ token })
      .expect(400);

    // Assert: Token already used
    expect(response.body.error.code).toBe('INVALID_TOKEN');
  });

  it('should require CSRF token for state-changing operations', async () => {
    const user = await createTestUser();

    // Act: POST request without CSRF token
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      // Missing: .set('X-CSRF-Token', token)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: '123', type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(403);

    // Assert: CSRF validation failed
    expect(response.body.error.code).toBe('CSRF_VALIDATION_FAILED');
  });
});
```

#### **4.4.2 Constitutional Constraint Testing**

**Privacy Constraint Verification** (100% coverage required):

```typescript
// Test suite: /backend/tests/security/constitutional-constraints.test.ts

describe('Constitutional Constraint C1: No Account Access', () => {
  it('should NOT implement OAuth for social platforms', () => {
    // Static code analysis: Search for prohibited OAuth implementations
    const backendCode = fs.readdirSync('./backend/src', { recursive: true });
    const prohibitedPatterns = [
      /twitter.*oauth/i,
      /instagram.*oauth/i,
      /facebook.*oauth/i,
      /tiktok.*oauth/i
    ];

    backendCode.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      prohibitedPatterns.forEach(pattern => {
        expect(content).not.toMatch(pattern);
      });
    });
  });
});

describe('Constitutional Constraint C2: User Data Ownership', () => {
  it('should NOT store display names in database', async () => {
    // Arrange: Create graph with client upload
    const user = await createTestUser();
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: '123456789', followerCount: 100, type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Assert: Database query for display names returns nothing
    const dbNodes = await db.query(
      'SELECT * FROM graph_nodes WHERE graph_id = $1',
      [response.body.id]
    );

    const dbContent = JSON.stringify(dbNodes.rows);
    expect(dbContent).not.toContain('displayName');
    expect(dbContent).not.toContain('username');
    expect(dbContent).not.toContain('@'); // No Twitter handles
  });

  it('should NOT store raw social media content', async () => {
    // Database schema check
    const schema = await db.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'graph_nodes'
    `);

    const columnNames = schema.rows.map(row => row.column_name);
    expect(columnNames).not.toContain('display_name');
    expect(columnNames).not.toContain('username');
    expect(columnNames).not.toContain('tweet_content');
    expect(columnNames).not.toContain('caption');
    expect(columnNames).not.toContain('profile_photo');
  });

  it('should store only day-level timestamps', async () => {
    const user = await createTestUser();
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: '123', addedAt: '2025-12-28T14:35:22Z', type: 'user' }], // Full timestamp
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Assert: Timestamp truncated to day-level
    const graph = await db.graph.findUnique({ where: { id: response.body.id } });
    expect(graph.nodes[0].addedAt).toBe('2025-12-28'); // YYYY-MM-DD only
  });
});

describe('Constitutional Constraint C3: Client-Side Processing (80% Rule)', () => {
  it('should perform graph parsing on client-side', () => {
    // Static analysis: Verify parsers are in frontend code
    const frontendParsers = fs.readdirSync('./frontend/src/parsers');
    expect(frontendParsers).toContain('twitter-parser.ts');
    expect(frontendParsers).toContain('instagram-parser.ts');

    // Verify NO parsers in backend
    const backendSrc = fs.readdirSync('./backend/src', { recursive: true });
    const parserFiles = backendSrc.filter(f => f.includes('parser'));
    expect(parserFiles).toHaveLength(0); // No parsers in backend
  });

  it('should perform metrics computation on client-side', () => {
    // Verify graph-metrics.ts is in frontend
    const metricsPath = './frontend/src/algorithms/graph-metrics.ts';
    expect(fs.existsSync(metricsPath)).toBe(true);
  });
});
```

#### **4.4.3 Server-Side Pseudonymization Testing**

**Critical Security Tests** (100% coverage):

```typescript
// Test suite: /backend/tests/security/pseudonymization.test.ts

describe('Server-Side Pseudonymization Security', () => {
  it('should NEVER persist original IDs to database', async () => {
    const user = await createTestUser();
    const externalIds = ['123456789', '987654321'];

    // Act: Create graph with original IDs
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: externalIds.map(externalId => ({ externalId, type: 'user' })),
          edges: [],
          metadata: { statistics: { nodeCount: 2, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Assert: Database raw query contains NO original IDs
    const dbDump = await db.query('SELECT * FROM graphs WHERE id = $1', [response.body.id]);
    const dbContent = JSON.stringify(dbDump.rows);

    externalIds.forEach(externalId => {
      expect(dbContent).not.toContain(externalId);
    });

    // Assert: Only pseudonymized IDs present
    const pseudonymIds = Object.values(response.body.pseudonymMapping);
    pseudonymIds.forEach(pseudonymId => {
      expect(dbContent).toContain(pseudonymId);
    });
  });

  it('should ALWAYS return pseudonymMapping in response', async () => {
    const user = await createTestUser();

    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [
            { externalId: '111', type: 'user' },
            { externalId: '222', type: 'user' },
            { externalId: '333', type: 'user' }
          ],
          edges: [],
          metadata: { statistics: { nodeCount: 3, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Assert: pseudonymMapping is required field
    expect(response.body).toHaveProperty('pseudonymMapping');
    expect(response.body.pseudonymMapping).toMatchObject({
      '111': expect.stringMatching(/^node_[a-f0-9]{64}$/),
      '222': expect.stringMatching(/^node_[a-f0-9]{64}$/),
      '333': expect.stringMatching(/^node_[a-f0-9]{64}$/)
    });
  });

  it('should use HMAC-SHA256 for pseudonymization', async () => {
    const user = await createTestUser();
    const externalId = '123456789';

    // Act: Create graph
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: externalId, type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    const pseudonymId = response.body.pseudonymMapping[externalId];

    // Assert: Pseudonym format matches HMAC-SHA256 output
    expect(pseudonymId).toMatch(/^node_[a-f0-9]{64}$/); // 64 hex chars = SHA256

    // Assert: Deterministic (same input → same output for same user)
    const response2 = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: externalId, type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    const pseudonymId2 = response2.body.pseudonymMapping[externalId];
    expect(pseudonymId).toBe(pseudonymId2); // Same pseudonym
  });

  it('should generate different pseudonyms for different users', async () => {
    const user1 = await createTestUser({ email: 'user1@test.com' });
    const user2 = await createTestUser({ email: 'user2@test.com' });
    const externalId = '123456789';

    // Act: User 1 creates graph
    const response1 = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user1.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: externalId, type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Act: User 2 creates graph with same original ID
    const response2 = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user2.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: externalId, type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(201);

    // Assert: Different pseudonyms (different user keys)
    const pseudonymId1 = response1.body.pseudonymMapping[externalId];
    const pseudonymId2 = response2.body.pseudonymMapping[externalId];
    expect(pseudonymId1).not.toBe(pseudonymId2);
  });

  it('should reject requests with display names (privacy violation)', async () => {
    const user = await createTestUser();

    // Act: Malicious client tries to send display names
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{
            externalId: '123',
            displayName: 'Jane Doe', // ❌ NOT ALLOWED
            username: '@janedoe'       // ❌ NOT ALLOWED
          }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      })
      .expect(400);

    // Assert: Request rejected
    expect(response.body.error.code).toBe('INVALID_SCHEMA');
    expect(response.body.error.message).toContain('display');
  });
});

describe('Pseudonymization Key Management', () => {
  it('should encrypt pseudonymization keys at rest', async () => {
    const user = await createTestUser();

    // Query database directly for user's pseudonym key
    const dbUser = await db.query('SELECT pseudonym_key_encrypted FROM users WHERE id = $1', [user.id]);

    // Assert: Key is encrypted (not plaintext)
    const encryptedKey = dbUser.rows[0].pseudonym_key_encrypted;
    expect(encryptedKey).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64-encoded ciphertext
    expect(encryptedKey).not.toMatch(/^[a-f0-9]{64}$/); // NOT plaintext hex
  });

  it('should NEVER expose pseudonymization keys via API', async () => {
    const user = await createTestUser();

    // Act: Fetch user data export (contains user profile per OpenAPI)
    const response = await request(app)
      .get('/api/v1/account/data-export')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .expect(200);

    // Assert: Response does NOT contain pseudonym key
    expect(response.body.user).not.toHaveProperty('pseudonymKey');
    expect(response.body.user).not.toHaveProperty('pseudonym_key');
    expect(response.body.user).not.toHaveProperty('pseudonym_key_encrypted');
  });
});
```

#### **4.4.4 Dependency Vulnerability Scanning**

**Continuous Monitoring**:

```yaml
# .github/workflows/security-scan.yml

name: Security Vulnerability Scan

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  pull_request:
  push:
    branches: [main]

jobs:
  dependency-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: |
          npm audit --audit-level=high
          # Fail if high or critical vulnerabilities found

      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  secret-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for secret scanning

      - name: Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  sast-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript

      - name: CodeQL Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: CodeQL Analysis Results
        uses: github/codeql-action/analyze@v2
```

**Acceptance Criteria**:
- **High/Critical Vulnerabilities**: 0 allowed
- **Medium Vulnerabilities**: <5 allowed (with documented risk acceptance)
- **Dependency Updates**: Automated PRs from Dependabot reviewed within 48 hours
- **Security Advisories**: Patch within 24 hours for critical, 7 days for high

---

### **4.5 Performance Testing**

**Objective**: Validate system performance, scalability, and responsiveness under load.

**Scope**:
- Frontend performance (Lighthouse, Core Web Vitals)
- API performance (response time, throughput)
- Graph visualization performance (FPS, rendering time)
- Load testing (concurrent users, stress testing)
- Database performance (query optimization)

**Tools**:
- **Frontend**: Lighthouse CI, WebPageTest, Chrome DevTools
- **Load Testing**: k6, Artillery
- **Profiling**: Chrome DevTools Profiler, Node.js --inspect
- **Monitoring**: Vercel Analytics, Railway Metrics, Sentry Performance

**Coverage Requirements**:
- **Phase 1**: Lighthouse >90, API p95 <500ms, Graph rendering 30 FPS
- **Phase 2**: Lighthouse >95, API p95 <300ms, Graph rendering 60 FPS

**Performance Budgets**:

| Metric | Phase 1 | Phase 2 | Phase 3 | Measurement |
|--------|---------|---------|---------|-------------|
| **Lighthouse Performance** | >90 | >95 | >98 | CI on every commit |
| **Largest Contentful Paint** | <2.5s | <1.5s | <1s | Core Web Vitals |
| **First Input Delay** | <100ms | <50ms | <30ms | Core Web Vitals |
| **Cumulative Layout Shift** | <0.1 | <0.05 | <0.01 | Core Web Vitals |
| **Time to Interactive** | <3.5s | <2s | <1.5s | Lighthouse |
| **Bundle Size (gzipped)** | <300KB | <200KB | <150KB | Webpack analyzer |
| **API Response (p95)** | <500ms | <300ms | <200ms | k6 load test |
| **API Response (p99)** | <1000ms | <500ms | <300ms | k6 load test |
| **Graph Render (10K nodes)** | 30 FPS | 60 FPS | 60+ FPS | Manual benchmark |
| **Graph Render (50K nodes)** | 15 FPS | 30 FPS | 45+ FPS | Manual benchmark |

**Performance Tests**:

```typescript
// Test suite: /performance/tests/api-load-test.ts (k6)

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete in <500ms
    http_req_duration: ['p(99)<1000'], // 99% of requests must complete in <1s
    http_req_failed: ['rate<0.01'],   // Error rate must be <1%
    errors: ['rate<0.01'],
  },
};

export default function () {
  // Authenticate
  const authRes = http.post('https://api.visualsocialgraph.com/api/v1/auth/magic-link', {
    email: 'loadtest@example.com'
  });

  check(authRes, {
    'auth status is 200': (r) => r.status === 200,
  });

  // Get session token (from test magic link service)
  const sessionToken = getTestSessionToken();

  // Fetch user's graphs
  const graphsRes = http.get('https://api.visualsocialgraph.com/api/v1/graphs', {
    cookies: { vsg_session: sessionToken },
  });

  check(graphsRes, {
    'graphs status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  responseTime.add(graphsRes.timings.duration);
  errorRate.add(graphsRes.status !== 200);

  sleep(1); // Think time
}
```

**Frontend Performance Tests**:

```typescript
// Test suite: /performance/tests/lighthouse-ci.ts

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        'https://visualsocialgraph.com/',
        'https://visualsocialgraph.com/dashboard',
        'https://visualsocialgraph.com/graphs/sample-graph-id',
      ],
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Other metrics
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**Graph Visualization Performance Tests**:

```typescript
// Test suite: /frontend/tests/performance/graph-rendering.bench.ts

import { describe, bench } from 'vitest';
import { GraphRenderer } from '@/lib/graph-renderer';
import { generateRandomGraph } from '@/tests/helpers/graph-generator';

describe('Graph Rendering Performance', () => {
  bench('should render 1K nodes at 60 FPS', async () => {
    const graph = generateRandomGraph({ nodes: 1000, edges: 3000 });
    const renderer = new GraphRenderer(document.createElement('canvas'));

    const startTime = performance.now();
    renderer.render(graph);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    const fps = 1000 / renderTime;

    expect(fps).toBeGreaterThanOrEqual(60);
  }, { time: 5000 }); // Run for 5 seconds

  bench('should render 10K nodes at 30 FPS', async () => {
    const graph = generateRandomGraph({ nodes: 10000, edges: 30000 });
    const renderer = new GraphRenderer(document.createElement('canvas'));

    const startTime = performance.now();
    renderer.render(graph);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    const fps = 1000 / renderTime;

    expect(fps).toBeGreaterThanOrEqual(30);
  }, { time: 5000 });

  bench('should handle pan/zoom interactions smoothly', async () => {
    const graph = generateRandomGraph({ nodes: 5000, edges: 15000 });
    const renderer = new GraphRenderer(document.createElement('canvas'));

    // Simulate 100 pan/zoom operations
    const operations = 100;
    const startTime = performance.now();

    for (let i = 0; i < operations; i++) {
      renderer.pan(Math.random() * 100, Math.random() * 100);
      renderer.zoom(1 + Math.random() * 0.1);
      renderer.render(graph);
    }

    const endTime = performance.now();
    const avgOperationTime = (endTime - startTime) / operations;

    expect(avgOperationTime).toBeLessThan(16.67); // 60 FPS = 16.67ms per frame
  });
});
```

**Database Performance Tests**:

```typescript
// Test suite: /backend/tests/performance/database-queries.bench.ts

describe('Database Query Performance', () => {
  it('should fetch user graphs in <100ms (p95)', async () => {
    const user = await createTestUser();

    // Create 100 graphs for user
    await createTestGraphs({ userId: user.id, count: 100 });

    // Measure query performance (100 iterations)
    const durations: number[] = [];
    for (let i = 0; i < 100; i++) {
      const startTime = performance.now();

      const graphs = await db.graph.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      const endTime = performance.now();
      durations.push(endTime - startTime);
    }

    // Calculate p95
    durations.sort((a, b) => a - b);
    const p95Index = Math.floor(durations.length * 0.95);
    const p95Duration = durations[p95Index];

    expect(p95Duration).toBeLessThan(100); // <100ms at p95
  });

  it('should support 1000 concurrent graph creations', async () => {
    // Simulate 1000 concurrent requests
    const promises = [];
    for (let i = 0; i < 1000; i++) {
      const user = await createTestUser({ email: `user${i}@test.com` });
      promises.push(
        request(app)
          .post('/api/v1/graphs')
          .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
          .send({
            platform: 'twitter',
            parseVersion: 'twitter_v2.1',
            graph: {
              nodes: [{ externalId: `user_${i}`, type: 'user' }],
              edges: [],
              metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
            }
          })
      );
    }

    const startTime = performance.now();
    const responses = await Promise.all(promises);
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const throughput = 1000 / (totalTime / 1000); // Requests per second

    expect(responses.filter(r => r.status === 201)).toHaveLength(1000); // All succeeded
    expect(throughput).toBeGreaterThan(50); // >50 req/s
  });
});
```

**Performance Monitoring (Production)**:

```typescript
// Continuous performance monitoring with Sentry

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['visualsocialgraph.com', /^\//],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Web Vitals tracking
  beforeSend(event, hint) {
    if (event.transaction) {
      // Track Core Web Vitals
      if (event.measurements) {
        const lcp = event.measurements.lcp?.value;
        const fid = event.measurements.fid?.value;
        const cls = event.measurements.cls?.value;

        // Alert if exceeding thresholds
        if (lcp && lcp > 2500) {
          console.error('LCP exceeds threshold:', lcp);
        }
        if (fid && fid > 100) {
          console.error('FID exceeds threshold:', fid);
        }
        if (cls && cls > 0.1) {
          console.error('CLS exceeds threshold:', cls);
        }
      }
    }
    return event;
  },
});
```

---

### **4.6 Accessibility Testing**

**Objective**: Ensure application is accessible to users with disabilities (WCAG 2.1 AA compliance).

**Scope**:
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management
- ARIA attributes
- Form accessibility
- Error message accessibility

**Tools**:
- **Automated**: axe-core, Lighthouse Accessibility, WAVE
- **Manual**: NVDA (screen reader), VoiceOver, keyboard-only navigation
- **CI Integration**: axe-playwright, jest-axe

**Coverage Requirements**:
- **Phase 1**: Lighthouse Accessibility >90, WCAG AA compliance
- **Phase 2**: Lighthouse Accessibility >95, WCAG AAA (where possible)

**Accessibility Tests**:

```typescript
// Test suite: /frontend/tests/accessibility/wcag-compliance.test.ts

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA Compliance', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard should be keyboard navigable', async ({ page }) => {
    await page.goto('/dashboard');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toMatch(/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/);

    // Verify focus visible (outline or other indicator)
    const focusVisible = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    });
    expect(focusVisible).toBe(true);
  });

  test('forms should have accessible labels', async ({ page }) => {
    await page.goto('/upload');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Verify all inputs have associated labels
    const unlabeledInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs.filter(input => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;

        return !label && !ariaLabel && !ariaLabelledBy;
      }).length;
    });

    expect(unlabeledInputs).toBe(0);
  });

  test('error messages should be announced to screen readers', async ({ page }) => {
    await page.goto('/upload');

    // Trigger validation error
    await page.click('button:has-text("Upload")'); // Click without selecting file

    // Verify error has aria-live attribute
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();

    const ariaLive = await errorMessage.getAttribute('aria-live');
    expect(ariaLive).toBe('polite'); // Will be announced by screen reader
  });

  test('interactive elements should have sufficient color contrast', async ({ page }) => {
    await page.goto('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('button, a, input')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('modals should trap focus', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Delete Graph")'); // Opens confirmation modal

    // Modal should be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Tab should cycle within modal
    const firstFocusable = modal.locator('button, a, input').first();
    const lastFocusable = modal.locator('button, a, input').last();

    await firstFocusable.focus();
    await page.keyboard.press('Shift+Tab'); // Should wrap to last element

    const focused = page.locator(':focus');
    await expect(focused).toBe(lastFocusable);
  });
});
```

**Manual Accessibility Checklist** (per release):

- [ ] All interactive elements reachable via keyboard (Tab, Shift+Tab)
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps (user can escape all modals/menus)
- [ ] Skip links provided for main content
- [ ] Headings in logical order (h1 → h2 → h3, no skipped levels)
- [ ] Images have alt text (decorative images have alt="")
- [ ] Forms have labels and error messages
- [ ] Color not used as only means of conveying information
- [ ] Text resizable to 200% without loss of functionality
- [ ] No content flashes more than 3 times per second
- [ ] ARIA landmarks used appropriately (main, nav, aside, footer)

---

### **4.7 Visual Regression Testing**

**Objective**: Detect unintended visual changes in UI across code changes.

**Scope**:
- Component visual snapshots
- Page layout verification
- Cross-browser rendering
- Responsive design validation

**Tools**:
- **Framework**: Playwright screenshot testing
- **Cloud Service**: Percy.io (visual diff comparison)
- **Local**: pixelmatch (pixel-level comparison)
- **Storybook**: Chromatic (component-level testing)

**Coverage Requirements**:
- **Phase 1**: All pages + major components
- **Phase 2**: Full coverage including responsive breakpoints

**Visual Regression Tests**:

```typescript
// Test suite: /frontend/tests/visual/pages.visual.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing', () => {
  test('homepage should match baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('dashboard should match baseline', async ({ page }) => {
    await authenticateUser(page, 'visual-test@example.com');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('graph visualization should match baseline', async ({ page }) => {
    await authenticateUser(page, 'visual-test@example.com');
    await page.goto('/graphs/test-graph-id');

    // Wait for graph to render
    await page.waitForSelector('canvas[data-testid="graph-canvas"]');
    await page.waitForTimeout(2000); // Animation settle

    await expect(page).toHaveScreenshot('graph-visualization.png', {
      maxDiffPixels: 200, // Allow more variance for canvas rendering
      threshold: 0.2,
    });
  });

  test('responsive design at mobile breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('dark mode should match baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-dark.png', {
      fullPage: true,
    });
  });
});
```

**Percy.io Integration** (CI/CD):

```yaml
# .github/workflows/visual-regression.yml

name: Visual Regression Testing

on:
  pull_request:
  push:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Percy Storybook
        run: npx percy storybook ./storybook-static
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}

      - name: Run Playwright visual tests
        run: npx playwright test --grep @visual
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

**Baseline Management**:
- Update baselines on intentional UI changes (approved in PR)
- Baseline screenshots stored in `/tests/visual/baselines/`
- Percy.io stores historical baselines (cloud)
- Review visual diffs in Percy dashboard before merging

---

### **4.7.1 API Contract Source of Truth**

**Canonical API Specification: `/api-specs/openapi.yaml`**

All API testing MUST align with the OpenAPI specification located at `api-specs/openapi.yaml`. This specification serves as the **single source of truth** for:

- **Request schemas** (field names, types, validation rules)
- **Response schemas** (field names, types, structure)
- **Error codes** (exact error code strings, HTTP status codes)
- **HTTP methods and endpoints** (URL paths, versioning)
- **Authentication requirements** (session cookies, CSRF tokens)
- **Rate limiting semantics** (429 vs 403, retry behavior)

**Critical Alignment Requirements:**

1. **Field Naming (Server-Side Pseudonymization - Option B)**
   - **Requests use original platform IDs:**
     - `nodes[].externalId` (original platform user identifier - per OpenAPI spec)
     - `edges[].source` (source node's original platform ID - field name stays same)
     - `edges[].target` (target node's original platform ID - field name stays same)
   - **Responses use pseudonymized IDs:**
     - `nodes[].id` (HMAC-SHA256 pseudonymized identifier)
     - `edges[].source` (pseudonymized source node ID - field name stays same, value changes)
     - `edges[].target` (pseudonymized target node ID - field name stays same, value changes)
   - **Mapping is ALWAYS returned:**
     - `pseudonymMapping: { [externalId: string]: string }` (maps original externalId → pseudonymized id)

2. **Request Structure (Nested Graph Object)**
   ```typescript
   // GraphCreateRequest schema (MUST match api-specs/openapi.yaml exactly)
   {
     platform: 'twitter' | 'instagram' | 'linkedin',
     parseVersion: string,
     graph: {
       nodes: Array<{
         externalId: string,        // Original platform user ID (NOT originalId)
         type: 'self' | 'user',     // Required field
         followerCount?: number,
         followingCount?: number,
         // ...other optional fields
       }>,
       edges: Array<{
         source: string,            // Original platform ID (field name same as response)
         target: string,            // Original platform ID (field name same as response)
         type: 'follows' | 'followed_by' | 'mutual' | 'engages_with',  // Required
         weight: number,            // Required (0-1)
         // ...other optional fields
       }>,
       metadata: {                  // Required object
         statistics: {              // Required nested object
           nodeCount: number,
           edgeCount: number
         },
         // ...other optional metadata
       }
     }
   }
   ```

3. **Response Structure (Flat with Pseudonym Mapping)**
   ```typescript
   // GraphCreateResponse schema (MUST match api-specs/openapi.yaml exactly)
   {
     id: string,                    // Graph UUID (pattern: ^graph_[A-Za-z0-9]{26}$)
     uploadId?: string,             // Optional upload ID (if from server-side upload)
     platform: string,              // Platform name
     nodeCount: number,             // Total nodes
     edgeCount: number,             // Total edges
     isLatest: boolean,             // Is latest version
     createdAt: string,             // Date only (format: date, YYYY-MM-DD, NOT date-time)
     pseudonymMapping: {            // ALWAYS PRESENT (required field)
       [externalId: string]: string // externalId → pseudonymized node ID
     },
     warnings?: Array<Warning>      // Optional non-critical warnings
   }
   ```

4. **Error Code Alignment (MUST match OpenAPI exactly)**
   - `INVALID_SCHEMA` (400) - Request validation failed
   - `INVALID_TOKEN` (400) - Token validation failed
   - `AUTHENTICATION_FAILED` (401) - Not authenticated or expired session
   - `PERMISSION_DENIED` (403) - Insufficient permissions
  - `QUOTA_EXCEEDED` (429) - Tier quota exceeded (retryable: false)
   - `RESOURCE_NOT_FOUND` (404) - Resource does not exist
   - `RATE_LIMITED` (429) - Short-window rate limit (retryable: true)
   - `INTERNAL_ERROR` (500) - Unexpected server error
   - See `api-specs/openapi.yaml` lines 3228-3411 for complete error catalog

5. **API Versioning**
   - **Base URL**: `https://api.visualsocialgraph.com/api/v1`
   - **All endpoints**: `/api/v1/graphs`, `/api/v1/auth`, `/api/v1/insights`

**Preventing Contract Drift:**

- **Pre-commit Hook**: Validate tests against OpenAPI spec before commit
- **CI/CD Validation**: Run `openapi-validator` on every PR
- **Quarterly Audits**: Review QA plan alignment with OpenAPI spec
- **Contract Tests**: Use `jest-openapi` or similar to validate responses

**When to Update This Document:**

If the OpenAPI specification changes (new endpoints, field renames, error codes), this QA plan MUST be updated within the same PR. Never allow the test plan to drift from the canonical API contract.

---

### **4.7.2 Standard API Contract Test Template**

**Purpose**: This template ensures all API endpoint tests follow the same structure and validate against the OpenAPI specification consistently.

**Test Template Structure:**

```typescript
// Test suite location: /backend/tests/api/v1/{resource}-api.test.ts
// Example: /backend/tests/api/v1/graphs-api.test.ts

import request from 'supertest';
import { app } from '@/server';
import { validateSchema } from '@/tests/helpers/schema-validator';
import { createTestUser, generateJWT, getCsrfToken } from '@/tests/helpers/auth';

describe('POST /api/v1/graphs - Create Graph', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = generateJWT(testUser.id);
  });

  describe('Success Cases (2xx)', () => {
    it('should create graph with valid payload and return pseudonym mapping', async () => {
      // Arrange: Prepare valid request payload (aligned with OpenAPI GraphCreateRequest)
      const payload = {
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [
            { externalId: '123456789', followerCount: 100, type: 'user' },
            { externalId: '987654321', followerCount: 200, type: 'user' }
          ],
          edges: [
            {
              source: '123456789',
              target: '987654321',
              type: 'follows',
              weight: 1.0
            }
          ],
          metadata: {
            statistics: {
              nodeCount: 2,
              edgeCount: 1
            }
          }
        }
      };

      // Act: Send request with proper authentication
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send(payload)
        .expect(201);

      // Assert 1: Response schema validation (OpenAPI GraphCreateResponse)
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^graph_[A-Za-z0-9]{26}$/),
        platform: 'twitter',
        nodeCount: 2,
        edgeCount: 1,
        isLatest: true,
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), // format: date (YYYY-MM-DD only, per OpenAPI)
        pseudonymMapping: expect.objectContaining({
          '123456789': expect.stringMatching(/^node_[a-f0-9]{64}$/),
          '987654321': expect.stringMatching(/^node_[a-f0-9]{64}$/)
        })
      });

      // Assert 2: pseudonymMapping ALWAYS present (critical for Option B)
      expect(response.body.pseudonymMapping).toBeDefined();
      expect(Object.keys(response.body.pseudonymMapping)).toHaveLength(2);

      // Assert 3: Response headers
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.headers['location']).toBe(`/api/v1/graphs/${response.body.id}`);

      // Assert 4: Server-side pseudonymization guarantee (externalId NOT persisted)
      const dbGraph = await testDb.findGraph(response.body.id);
      expect(dbGraph.nodes[0].id).toBe(response.body.pseudonymMapping['123456789']);
      expect(dbGraph.nodes[0].externalId).toBeUndefined(); // Critical privacy check (per OpenAPI)
    });
  });

  describe('Validation Errors (400)', () => {
    it('should reject invalid platform with INVALID_SCHEMA error', async () => {
      const payload = {
        platform: 'invalid_platform', // Invalid enum value
        parseVersion: 'v1',
        graph: { nodes: [], edges: [], metadata: {} }
      };

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send(payload)
        .expect(400);

      // Assert: Error structure matches OpenAPI ErrorResponse
      expect(response.body.error).toMatchObject({
        code: 'INVALID_SCHEMA',
        message: expect.stringContaining('platform'),
        details: expect.objectContaining({
          field: 'platform',
          validation: 'enum'
        }),
        retryable: false
      });
    });

    it('should reject missing required fields with INVALID_SCHEMA error', async () => {
      const payload = {
        // Missing required 'platform' field
        parseVersion: 'v1',
        graph: { nodes: [], edges: [] }
      };

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send(payload)
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_SCHEMA');
      expect(response.body.error.details.field).toBe('platform');
      expect(response.body.error.retryable).toBe(false);
    });
  });

  describe('Authentication Errors (401)', () => {
    it('should reject unauthenticated request with AUTHENTICATION_FAILED', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        // No session cookie
        .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
        .expect(401);

      expect(response.body.error).toMatchObject({
        code: 'AUTHENTICATION_FAILED',
        message: expect.stringContaining('authenticated'),
        retryable: false
      });
    });

    it('should reject expired session token with AUTHENTICATION_FAILED', async () => {
      const expiredToken = generateJWT(testUser.id, { expiresIn: '-1h' });

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${expiredToken}`)
        .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_FAILED');
    });
  });

  describe('Authorization Errors (403)', () => {
    it('should enforce CSRF protection', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        // Missing X-CSRF-Token header
        .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
        .expect(403);

      expect(response.body.error.code).toBe('CSRF_VALIDATION_FAILED');
    });

  });

  describe('Quota Errors (429)', () => {
    it('should enforce tier-based quotas with QUOTA_EXCEEDED', async () => {
      // Arrange: Exhaust free tier quota (5 graphs/day)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/graphs')
          .set('Cookie', `vsg_session=${authToken}`)
          .set('X-CSRF-Token', getCsrfToken())
          .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
          .expect(201);
      }

      // Act: 6th request exceeds quota
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
        .expect(429);

      // Assert: Quota exceeded response
      expect(response.body.error).toMatchObject({
        code: 'QUOTA_EXCEEDED',
        message: expect.stringContaining('quota'),
        retryable: false, // NOT retryable (requires upgrade or wait for reset)
        details: {
          limit: 5,
          window: 'daily',
          resetAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
        }
      });

      // Assert: Retry-After header present
      expect(response.headers['retry-after']).toBeDefined();
    });
  });

  describe('Rate Limiting (429)', () => {
    it('should enforce short-window rate limits with RATE_LIMITED', async () => {
      // Arrange: Send 11 requests in rapid succession (10/min limit)
      const requests = Array.from({ length: 11 }, () =>
        request(app)
          .post('/api/v1/graphs')
          .set('Cookie', `vsg_session=${authToken}`)
          .set('X-CSRF-Token', getCsrfToken())
          .send({ platform: 'twitter', graph: { nodes: [], edges: [] } })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(r => r.status === 429);

      // Assert: Rate limit response
      expect(rateLimitedResponse).toBeDefined();
      expect(rateLimitedResponse.body.error).toMatchObject({
        code: 'RATE_LIMITED',
        message: expect.stringContaining('Too many requests'),
        retryable: true, // Retryable after waiting
        details: {
          limit: 10,
          window: 'minute'
        }
      });

      // Assert: Retry-After header present
      expect(rateLimitedResponse.headers['retry-after']).toBeDefined();
      expect(parseInt(rateLimitedResponse.headers['retry-after'])).toBeLessThanOrEqual(60);
    });
  });

  describe('Server Errors (5xx)', () => {
    it('should return INTERNAL_ERROR on unexpected failures', async () => {
      // Simulate database failure
      jest.spyOn(testDb, 'createGraph').mockRejectedValueOnce(new Error('DB connection lost'));

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(500);

      expect(response.body.error).toMatchObject({
        code: 'INTERNAL_ERROR',
        message: expect.stringContaining('unexpected error'),
        retryable: false
      });

      // Assert: Error details NOT leaked to client (security)
      expect(response.body.error.details).toEqual({});
    });
  });
});
```

**Key Template Principles:**

1. **Align with OpenAPI**: Every test validates against the canonical OpenAPI specification
2. **Test All Status Codes**: Cover 2xx, 4xx, 5xx response paths
3. **Validate Error Structure**: Assert `code`, `message`, `retryable`, `details` fields
4. **Check Headers**: Verify `Retry-After`, `Location`, `Content-Type` headers
5. **Privacy Guarantees**: Always assert `pseudonymMapping` present, original IDs NOT persisted
6. **Authentication/Authorization**: Test with/without auth, CSRF validation, tier restrictions
7. **Rate Limiting**: Distinguish between tier quotas and short-window throttling (both HTTP 429)
  - Tier quota exceeded: `429` + `code: QUOTA_EXCEEDED` (retryable: false)
  - Short-window throttling: `429` + `code: RATE_LIMITED` (retryable: true)

---

### **4.8 API Testing**

**Objective**: Validate API contracts, request/response schemas, error handling, and edge cases.

**Scope**:
- REST API endpoint testing
- Request validation (schema, authentication, authorization)
- Response validation (status codes, headers, body)
- Error handling (4xx, 5xx)
- Rate limiting
- API versioning

**Tools**:
- **Contract Testing**: Supertest + JSON Schema validation
- **API Documentation**: OpenAPI spec validation
- **Mock Server**: Prism (OpenAPI mock server)
- **Load Testing**: k6 (covered in Section 4.5)

**Coverage Requirements**:
- **Phase 1**: >90% of API endpoints
- **Phase 2**: 100% of API endpoints including error paths

**API Test Structure**:

```typescript
// Test suite: /backend/tests/api/v1/graphs-api.test.ts

import request from 'supertest';
import { app } from '@/server';
import { validateSchema } from '@/tests/helpers/schema-validator';
import graphCreateResponseSchema from '@/api-specs/schemas/GraphCreateResponse.json';

describe('POST /api/v1/graphs', () => {
  let authToken: string;

  beforeEach(async () => {
    const user = await createTestUser();
    authToken = generateJWT(user.id);
  });

  describe('Success Cases', () => {
    it('should create graph with valid payload', async () => {
      const payload = {
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [
            { externalId: '123456789', followerCount: 100, type: 'user' },
            { externalId: '987654321', followerCount: 200, type: 'user' }
          ],
          edges: [
            { source: '123456789', target: '987654321', type: 'follows', weight: 1.0 }
          ],
          metadata: {
            statistics: {
              nodeCount: 2,
              edgeCount: 1
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send(payload)
        .expect(201);

      // Assert: Response schema validation
      validateSchema(response.body, graphCreateResponseSchema);

      // Assert: Response content
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^graph_/),
        platform: 'twitter',
        nodeCount: 2,
        edgeCount: 1,
        pseudonymMapping: expect.objectContaining({
          '123456789': expect.stringMatching(/^node_/),
          '987654321': expect.stringMatching(/^node_/)
        })
      });

      // Assert: pseudonymMapping ALWAYS present (required field)
      expect(response.body.pseudonymMapping).toBeDefined();
      expect(Object.keys(response.body.pseudonymMapping)).toHaveLength(2);

      // Assert: Response metadata fields are correct
      expect(response.body.id).toBeDefined();
      expect(response.body.platform).toBe('twitter');
      expect(response.body.nodeCount).toBe(2);
      expect(response.body.edgeCount).toBe(1);
      expect(response.body.isLatest).toBe(true);
      expect(response.body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
    });

    it('should accept large graphs (100K nodes)', async () => {
      const nodes = Array.from({ length: 100000 }, (_, i) => ({
        externalId: `user_${i}`,
        followerCount: Math.floor(Math.random() * 1000)
      }));

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: nodes.map(n => ({ ...n, type: 'user' })),
            edges: [],
            metadata: { statistics: { nodeCount: 100000, edgeCount: 0 } }
          }
        })
        .expect(201)
        .timeout(30000); // Allow 30s for large graph

      expect(response.body.nodeCount).toBe(100000);
    });
  });

  describe('Validation Errors (4xx)', () => {
    it('should reject request with missing platform', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        }) // Missing platform
        .expect(400);

      expect(response.body.error).toMatchObject({
          code: 'INVALID_SCHEMA',
          message: expect.stringContaining('validation'),
          details: expect.objectContaining({
            field: 'platform'
          })
      });
    });

    it('should reject request with invalid platform value', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'invalid_platform',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_SCHEMA');
    });

    it('should reject request exceeding node limit (1M)', async () => {
      const nodes = Array.from({ length: 1000001 }, (_, i) => ({
        externalId: `user_${i}`
      }));

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: nodes.map(n => ({ ...n, type: 'user' })),
            edges: [],
            metadata: { statistics: { nodeCount: 1000001, edgeCount: 0 } }
          }
        })
        .expect(400);

      expect(response.body.error.code).toBe('GRAPH_TOO_LARGE');
    });
  });

  describe('Authentication Errors (401)', () => {
    it('should reject unauthenticated request', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_FAILED');
    });

    it('should reject expired session token', async () => {
      const expiredToken = generateJWT(user.id, { expiresIn: '-1h' });

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${expiredToken}`)
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_FAILED');
    });
  });

  describe('Authorization Errors (403)', () => {
    it('should reject request without CSRF token', async () => {
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        // Missing CSRF token
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(403);

      expect(response.body.error.code).toBe('CSRF_VALIDATION_FAILED');
    });
  });

  describe('Quota Limits (429)', () => {
    it('should enforce tier-based daily quota limits (Free: 5 graphs/day)', async () => {
      // Arrange: Create 5 graphs (Free tier daily quota limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/graphs')
          .set('Cookie', `vsg_session=${authToken}`)
          .set('X-CSRF-Token', getCsrfToken())
          .send({
            platform: 'twitter',
            parseVersion: 'twitter_v2.1',
            graph: {
              nodes: [{ externalId: `user_${i}`, type: 'user' }],
              edges: [],
              metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
            }
          })
          .expect(201);
      }

      // Act: 6th request should hit quota limit
      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: 'user_6', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(429); // 429 for tier quota exceeded (QuotaExceeded429)

      // Assert: Quota exceeded error
      expect(response.body.error).toMatchObject({
        code: 'QUOTA_EXCEEDED',
        message: expect.stringContaining('quota exceeded'),
        retryable: false, // Cannot retry immediately
        details: expect.objectContaining({
          tier: 'free',
          limit: 5,
          used: 5,
          resetAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
        })
      });

      expect(response.headers['retry-after']).toBeDefined(); // Seconds until quota reset
      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBe('0');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Rate Limiting (429)', () => {
    it('should enforce short-window rate limits (e.g., 10 requests/minute)', async () => {
      // Arrange: Make rapid requests within short time window
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .get('/api/v1/graphs')
            .set('Cookie', `vsg_session=${authToken}`)
        );
      }
      await Promise.all(requests);

      // Act: 11th request within same minute should be rate limited
      const response = await request(app)
        .get('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .expect(429); // 429 for short-window rate limit

      // Assert: Rate limited error
      expect(response.body.error).toMatchObject({
        code: 'RATE_LIMITED',
        message: expect.stringContaining('Too many requests'),
        retryable: true, // Can retry after window
        details: expect.objectContaining({
          limit: expect.any(Number),
          windowSeconds: expect.any(Number)
        })
      });

      expect(response.headers['retry-after']).toBeDefined(); // Seconds until window reset
      expect(response.headers['x-ratelimit-remaining']).toBe('0');
    });
  });

  describe('Server Errors (5xx)', () => {
    it('should handle database connection failure gracefully', async () => {
      // Simulate database down
      jest.spyOn(db, 'graph').mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const response = await request(app)
        .post('/api/v1/graphs')
        .set('Cookie', `vsg_session=${authToken}`)
        .set('X-CSRF-Token', getCsrfToken())
        .send({
          platform: 'twitter',
          parseVersion: 'twitter_v2.1',
          graph: {
            nodes: [{ externalId: '123', type: 'user' }],
            edges: [],
            metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
          }
        })
        .expect(500);

      expect(response.body.error).toMatchObject({
        code: 'INTERNAL_ERROR',
        message: expect.stringContaining('An unexpected error occurred'),
        // Should NOT leak internal error details
      });

      expect(response.body.error.message).not.toContain('Database');
    });
  });
});

describe('GET /api/v1/graphs/:id', () => {
  it('should return graph with pseudonymized IDs', async () => {
    const user = await createTestUser();
    const graph = await createTestGraph({ userId: user.id });

    const response = await request(app)
      .get(`/api/v1/graphs/${graph.id}`)
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .expect(200);

    // Assert: Only pseudonymized IDs in response
    expect(response.body.nodes[0].id).toMatch(/^node_/);
    expect(response.body.nodes[0]).not.toHaveProperty('externalId');
    expect(response.body.nodes[0]).not.toHaveProperty('displayName');
  });

  it('should return 404 for non-existent graph', async () => {
    const user = await createTestUser();

    const response = await request(app)
      .get('/api/v1/graphs/graph_nonexistent')
      .set('Cookie', `vsg_session=${generateJWT(user.id)}`)
      .expect(404);

    expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('should prevent IDOR (access to other user graphs)', async () => {
    const user1 = await createTestUser({ email: 'user1@test.com' });
    const user2 = await createTestUser({ email: 'user2@test.com' });
    const graph2 = await createTestGraph({ userId: user2.id });

    // User 1 tries to access User 2's graph
    const response = await request(app)
      .get(`/api/v1/graphs/${graph2.id}`)
      .set('Cookie', `vsg_session=${generateJWT(user1.id)}`)
      .expect(404); // NOT 403 to prevent enumeration

    expect(response.body.error.message).toBe('Graph not found');
  });
});
```

**OpenAPI Contract Validation**:

```typescript
// Test suite: /backend/tests/api/openapi-contract.test.ts

import { validateAgainstOpenAPI } from '@/tests/helpers/openapi-validator';
import openapiSpec from '@/api-specs/openapi.yaml';

describe('OpenAPI Contract Validation', () => {
  it('should validate all endpoints against OpenAPI spec', async () => {
    const endpoints = [
      { method: 'POST', path: '/api/v1/graphs', operationId: 'createGraph' },
      { method: 'GET', path: '/api/v1/graphs/:id', operationId: 'getGraph' },
      { method: 'DELETE', path: '/api/v1/graphs/:id', operationId: 'deleteGraph' },
      // ... all endpoints
    ];

    for (const endpoint of endpoints) {
      const validation = await validateAgainstOpenAPI(endpoint, openapiSpec);
      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.error(`${endpoint.method} ${endpoint.path}:`, validation.errors);
      }
    }
  });
});
```

---

### **4.9 Browser Compatibility Testing**

**Objective**: Ensure consistent functionality and appearance across browsers and devices.

**Scope**:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Responsive design (viewport sizes)
- Feature detection and polyfills
- CSS compatibility

**Tools**:
- **E2E Testing**: Playwright (multi-browser)
- **Cloud Testing**: BrowserStack, Sauce Labs
- **Automated**: Playwright test runner with browser matrix
- **Manual**: Physical device testing (iOS, Android)

**Coverage Requirements**:
- **Phase 1**: Chrome, Firefox, Safari (desktop + mobile)
- **Phase 2**: Full coverage including Edge, Samsung Internet

**Browser Support Matrix**:

| Browser | Version | Priority | Phase |
|---------|---------|----------|-------|
| Chrome (Desktop) | Latest 2 versions | **Critical** | Phase 1+ |
| Firefox (Desktop) | Latest 2 versions | **High** | Phase 2+ |
| Safari (Desktop) | Latest 2 versions | **High** | Phase 2+ |
| Edge (Desktop) | Latest 2 versions | **Medium** | Phase 3+ |
| Chrome (Android) | Latest version | **High** | Phase 2+ |
| Safari (iOS) | Latest 2 versions | **Critical** | Phase 2+ |
| Samsung Internet | Latest version | **Low** | Phase 3+ |

**Browser Compatibility Tests**:

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },

    // Tablets
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run tests in parallel across browsers
  workers: 4,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

```typescript
// Test suite: /e2e/tests/browser-compatibility.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Browser Compatibility', () => {
  test('critical user journey should work in all browsers', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit' && process.env.CI, 'Safari flaky in CI');

    // Same critical test from 4.3, runs across all browsers
    await page.goto('/');
    await page.click('text=Sign in');
    await page.fill('input[type="email"]', `e2e-${browserName}@test.com`);
    await page.click('button:has-text("Send Magic Link")');

    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('graph visualization should render in all browsers', async ({ page }) => {
    await authenticateUser(page);
    await page.goto('/graphs/test-graph-id');

    const canvas = page.locator('canvas[data-testid="graph-canvas"]');
    await expect(canvas).toBeVisible();

    // Verify canvas has content (cross-browser)
    const hasContent = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-testid="graph-canvas"]') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.some(pixel => pixel !== 0);
    });

    expect(hasContent).toBe(true);
  });

  test('responsive design should work at all breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },     // iPhone SE
      { width: 768, height: 1024, name: 'Tablet' },    // iPad
      { width: 1920, height: 1080, name: 'Desktop' },  // Full HD
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');

      // Verify layout adapts
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();

      // Mobile: Hamburger menu
      if (viewport.width < 768) {
        await expect(page.locator('[aria-label="Menu"]')).toBeVisible();
      }
      // Desktop: Full navigation
      else {
        await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
        await expect(page.locator('nav a:has-text("Graphs")')).toBeVisible();
      }
    }
  });
});
```

**CSS Compatibility**:

```css
/* Use autoprefixer for vendor prefixes */
/* postcss.config.js */
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['last 2 versions', 'iOS >= 12', 'Safari >= 12']
    }
  }
};
```

**Feature Detection**:

```typescript
// Feature detection for critical APIs
export function checkBrowserSupport() {
  const required = {
    indexedDB: typeof indexedDB !== 'undefined',
    webCrypto: typeof crypto.subtle !== 'undefined',
    canvas: !!document.createElement('canvas').getContext,
    fetch: typeof fetch !== 'undefined',
  };

  const missing = Object.entries(required)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  if (missing.length > 0) {
    throw new Error(`Unsupported browser. Missing features: ${missing.join(', ')}`);
  }
}
```

---

## **5. Test Coverage Requirements**

### **5.1 Coverage Targets by Phase**

| Component | Phase 1 | Phase 2 | Phase 3 | Measurement Tool |
|-----------|---------|---------|---------|------------------|
| **Unit Tests** | >80% line<br>>75% branch | >85% line<br>>80% branch | >90% line<br>>85% branch | Vitest coverage |
| **Integration Tests** | >70% endpoints | >80% endpoints | >90% endpoints | Manual tracking |
| **E2E Tests** | Critical paths | >90% user flows | >95% features | Manual tracking |
| **Security Tests** | Auth + Pseudonym | OWASP Top 10 | Full compliance | Manual checklist |
| **Performance Tests** | Lighthouse >80 | Lighthouse >90 | Lighthouse >95 | Lighthouse CI |

### **5.2 Critical Component Coverage (100% Required)**

**Authentication & Authorization**:
- Magic link generation, validation, expiry
- Session management (creation, validation, revocation)
- CSRF token validation
- Rate limiting enforcement
- Tier-based feature access

**Server-Side Pseudonymization**:
- HMAC-SHA256 pseudonymization correctness
- Original IDs never persisted to database
- pseudonymMapping always returned
- Deterministic pseudonym generation (same user)
- Different pseudonyms across users
- Key management security (encryption at rest)

**Payment Processing**:
- Stripe webhook signature verification
- Subscription state transitions (free → pro → canceled)
- Idempotency enforcement
- Error handling and retries
- Invoice generation

**Platform Parsers**:
- Fixture-based testing (>30 real archives per platform)
- Success rate >95%
- Data accuracy validation
- Error handling for malformed files
- Edge case coverage (empty archives, corrupted files)

### **5.3 Coverage Exclusions**

The following are excluded from code coverage requirements (but should still have manual testing):

- Auto-generated code (Prisma client, OpenAPI schemas)
- Third-party library code
- Development/debugging utilities
- Type definitions (.d.ts files)
- Configuration files
- Build scripts

### **5.4 Coverage Reporting**

**CI/CD Integration**:
```yaml
# .github/workflows/test-coverage.yml

name: Test Coverage Report

on:
  pull_request:
  push:
    branches: [main]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true

      - name: Coverage regression check
        run: |
          current=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$current < 80" | bc -l) )); then
            echo "Coverage below threshold: $current%"
            exit 1
          fi

      - name: Comment PR with coverage
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info
```

**Coverage Dashboard** (Codecov):
- Track coverage trends over time
- Identify uncovered code in PRs
- Set coverage thresholds per component
- Block PRs that reduce coverage

---

## **6. Test Environment Strategy**

### **6.1 Environment Types**

| Environment | Purpose | Data | Deployment | Access |
|-------------|---------|------|------------|--------|
| **Local Dev** | Development + unit tests | Synthetic | Developer machine | Developer only |
| **CI** | Automated testing (PR checks) | Synthetic | GitHub Actions | Automated |
| **Staging** | Integration + E2E testing | Synthetic + anonymized production | Vercel Preview + Railway | Team + QA |
| **Production** | Live application | Real user data | Vercel + Railway | Public |

### **6.2 Local Development Environment**

**Setup**:
```bash
# Install dependencies
npm install

# Setup local database
docker-compose up -d postgres redis

# Run database migrations
npx prisma migrate dev

# Seed test data
npm run db:seed

# Run tests
npm test

# Run with hot reload
npm run dev
```

**Test Database**:
- Dockerized PostgreSQL (ephemeral, reset per test suite)
- Separate database per test suite (parallel execution)
- Automatic teardown after tests complete

### **6.3 CI Environment (GitHub Actions)**

**Test Matrix**:
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [18.x, 20.x]

steps:
  - name: Checkout code
    uses: actions/checkout@v3

  - name: Setup Node.js ${{ matrix.node-version }}
    uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
      cache: 'npm'

  - name: Install dependencies
    run: npm ci

  - name: Run unit tests
    run: npm run test:unit

  - name: Run integration tests
    run: npm run test:integration

  - name: Run E2E tests
    run: npm run test:e2e
```

**Service Dependencies**:
- PostgreSQL (Docker service container)
- Redis (Docker service container)
- Mock email service (Ethereal)
- Mock Stripe API (stripe-mock)

### **6.4 Staging Environment**

**Purpose**: Pre-production testing with production-like setup

**Infrastructure**:
- Frontend: Vercel Preview Deployment (per PR)
- Backend: Railway Preview Environment
- Database: Railway PostgreSQL (staging instance)
- Storage: S3 (staging bucket)

**Test Data**:
- Synthetic test users (test-user-1@example.com, etc.)
- Anonymized production data (optional, privacy-scrubbed)
- Fixture files (real platform exports, anonymized)

**Access Control**:
- Basic auth (username/password)
- IP whitelist (team VPN)
- Automatic cleanup (7 days retention)

---

## **7. Test Data Management**

### **7.1 Test Data Strategy**

**Principles**:
- **Never use real user data** in tests (privacy violation)
- **Synthetic data only** (factories, fixtures, generators)
- **Deterministic data** (same seed → same output)
- **Realistic data** (mirrors production data structure)

### **7.2 Test Data Factories**

```typescript
// /tests/factories/user.factory.ts

import { faker } from '@faker-js/faker';

export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: `user_${faker.string.alphanumeric(26)}`,
    email: faker.internet.email(),
    tier: 'free',
    pseudonymKeyEncrypted: faker.string.alphanumeric(64),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

export function createTestGraph(overrides?: Partial<Graph>): Graph {
  return {
    id: `graph_${faker.string.alphanumeric(26)}`,
    userId: overrides?.userId || `user_${faker.string.alphanumeric(26)}`,
    name: faker.lorem.words(3),
    platform: faker.helpers.arrayElement(['twitter', 'instagram', 'linkedin']),
    nodeCount: faker.number.int({ min: 10, max: 1000 }),
    edgeCount: faker.number.int({ min: 20, max: 3000 }),
    createdAt: faker.date.recent(),
    ...overrides,
  };
}

// Deterministic seed for reproducible tests
faker.seed(12345);
```

### **7.3 Test Fixtures**

**Fixture Structure**:
```
/tests/fixtures/
├── twitter/
│   ├── twitter-archive-small.zip       # 100 nodes, 250 edges
│   ├── twitter-archive-medium.zip      # 1K nodes, 3K edges
│   ├── twitter-archive-large.zip       # 10K nodes, 30K edges
│   ├── twitter-malformed.zip           # Corrupted file
│   └── twitter-empty.zip               # Empty archive
├── instagram/
│   ├── instagram-archive-small.zip
│   └── instagram-archive-medium.zip
├── linkedin/
│   └── linkedin-archive-small.zip
└── README.md                           # Fixture documentation
```

**Fixture Anonymization**:
- All fixtures based on **real platform exports** (ensures parser accuracy)
- **PII scrubbed**: Display names, usernames, profile photos removed
- **IDs randomized**: Original user IDs replaced with synthetic IDs
- **Timestamps truncated**: Day-level granularity only

### **7.4 Test Data Cleanup**

**Automatic Cleanup**:
```typescript
afterEach(async () => {
  // Clean up test database
  await testDb.truncateAll();

  // Clean up test files
  await fs.rm('./tmp/test-uploads', { recursive: true, force: true });

  // Reset mocks
  jest.clearAllMocks();
});

afterAll(async () => {
  // Destroy test database connection
  await testDb.destroy();
});
```

**Staging Environment Cleanup**:
- Test users deleted after 7 days (automated cron job)
- Test graphs deleted after 24 hours
- Uploaded files deleted immediately after test completion

---

## **8. Defect Management**

### **8.1 Defect Lifecycle**

```
┌─────────┐
│   NEW   │ ← Bug reported (GitHub Issue, Sentry, user report)
└────┬────┘
     ↓
┌─────────┐
│ TRIAGED │ ← Severity/priority assigned, component labeled
└────┬────┘
     ↓
┌─────────┐
│ASSIGNED │ ← Developer assigned, sprint planned
└────┬────┘
     ↓
┌─────────┐
│IN PROGRESS│ ← Fix in development, test written
└────┬────┘
     ↓
┌─────────┐
│ IN REVIEW│ ← PR submitted, code review
└────┬────┘
     ↓
┌─────────┐
│  FIXED  │ ← PR merged, deployed to staging
└────┬────┘
     ↓
┌─────────┐
│ VERIFIED│ ← QA confirms fix, deployed to production
└────┬────┘
     ↓
┌─────────┐
│ CLOSED  │ ← Issue closed, regression test added
└─────────┘
```

### **8.2 Defect Severity Classification**

| Severity | Description | Examples | SLA |
|----------|-------------|----------|-----|
| **Critical (P0)** | System down, data loss, security breach | • Authentication broken<br>• Database corruption<br>• Payment processing failure<br>• Privacy violation (display names leaked) | **Fix: 4 hours**<br>Deploy: ASAP |
| **High (P1)** | Major feature broken, affects majority of users | • Graph visualization not rendering<br>• Upload parsing fails for all archives<br>• Insights not generating | **Fix: 24 hours**<br>Deploy: Next day |
| **Medium (P2)** | Feature partially broken, workaround exists | • Export fails for large graphs<br>• Specific platform parser fails<br>• Performance degradation (slow but functional) | **Fix: 7 days**<br>Deploy: Next release |
| **Low (P3)** | Minor issue, cosmetic bug, enhancement | • UI alignment issue<br>• Typo in error message<br>• Missing tooltip | **Fix: 30 days**<br>Deploy: Backlog |

### **8.3 Defect Tracking (GitHub Issues)**

**Issue Template**:
```markdown
### Bug Description
[Clear, concise description of the bug]

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- User Tier: [e.g., Free, Pro]
- Graph Size: [e.g., 1K nodes]

### Screenshots / Logs
[Attach screenshots, error logs, Sentry link]

### Severity
[P0 / P1 / P2 / P3]

### Additional Context
[Any other relevant information]
```

**Labels**:
- `bug` - Confirmed bug
- `p0-critical`, `p1-high`, `p2-medium`, `p3-low` - Severity
- `security` - Security vulnerability
- `privacy` - Privacy-related issue
- `regression` - Previously working, now broken
- `needs-reproduction` - Cannot reproduce
- `frontend`, `backend`, `infra` - Component labels

### **8.4 Root Cause Analysis (Post-Incident)**

For **P0/P1 defects** that reach production:

**RCA Template**:
```markdown
# Post-Incident Report: [Issue Title]

## Incident Summary
- **Date**: YYYY-MM-DD
- **Duration**: X hours
- **Impact**: X users affected, X% error rate
- **Severity**: P0 / P1

## Timeline
- **HH:MM** - Issue first detected (Sentry alert)
- **HH:MM** - Team notified, investigation started
- **HH:MM** - Root cause identified
- **HH:MM** - Fix deployed to production
- **HH:MM** - Incident resolved, monitoring resumed

## Root Cause
[Technical explanation of what went wrong]

## Contributing Factors
- [Factor 1: e.g., Insufficient test coverage for edge case]
- [Factor 2: e.g., Monitoring gap - no alert for this failure mode]
- [Factor 3: e.g., Deployment process allowed bad code to reach prod]

## Resolution
[How the issue was fixed]

## Action Items (Prevention)
- [ ] Add regression test for this scenario
- [ ] Add monitoring/alerting for this failure mode
- [ ] Update deployment checklist
- [ ] Improve documentation

## Lessons Learned
[What we learned, how we'll improve]
```

---

## **9. CI/CD Integration**

### **9.1 CI Pipeline (GitHub Actions)**

**Test Automation Workflow**:
```yaml
# .github/workflows/ci.yml

name: Continuous Integration

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
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm audit --audit-level=high
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          SIZE=$(du -sk dist | cut -f1)
          if [ $SIZE -gt 500 ]; then
            echo "Bundle size exceeds 500KB"
            exit 1
          fi
```

### **9.2 CD Pipeline (Deployment)**

**Staging Deployment** (automatic on PR):
```yaml
# .github/workflows/deploy-staging.yml

name: Deploy to Staging

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (Frontend)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Railway (Backend)
        run: |
          railway up --environment=staging
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          STAGING_URL: ${{ steps.deploy.outputs.preview-url }}
```

**Production Deployment** (manual approval):
```yaml
# .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://visualsocialgraph.com
    steps:
      - uses: actions/checkout@v3

      - name: Run full test suite
        run: |
          npm ci
          npm run test:all

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'

      - name: Deploy to Railway (Production)
        run: railway up --environment=production

      - name: Run production smoke tests
        run: npm run test:smoke
        env:
          PRODUCTION_URL: https://visualsocialgraph.com

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
```

### **9.3 Quality Gates (Automated Checks)**

**PR Requirements (must pass before merge)**:
1. ✅ All tests pass (unit, integration, E2E)
2. ✅ Code coverage ≥80% (no regression)
3. ✅ Linting passes (no errors)
4. ✅ Type checking passes (no TypeScript errors)
5. ✅ Security scan passes (no high/critical vulnerabilities)
6. ✅ Bundle size <500KB (no regression)
7. ✅ Lighthouse CI score ≥90 (no regression)
8. ✅ At least 1 approving review
9. ✅ All conversations resolved

**Deployment Gates** (production only):
1. ✅ All PR requirements met
2. ✅ Manual QA sign-off (for major releases)
3. ✅ Staging environment tested
4. ✅ Database migrations tested (if applicable)
5. ✅ Feature flags configured (if applicable)

---

## **10. Phase-Specific Testing**
### **10.1 Phase 0: Prototype (Closed Alpha)**

**Testing Focus**: Core functionality validation, early user feedback

**Test Requirements**:
- ✅ Unit tests for core algorithms (graph metrics, pseudonymization)
- ✅ Integration tests for critical APIs (POST /api/v1/graphs, authentication)
- ✅ Manual E2E testing (no automation yet)
- ✅ Security testing for pseudonymization implementation
- ⏭️ Performance testing (best effort, no hard targets)

**Quality Targets**:
| Metric | Target | Rationale |
|--------|--------|-----------|
| Unit test coverage | >60% | Prove core algorithms work |
| Integration test coverage | >40% | Validate API contracts |
| E2E test coverage | Critical path only | Manual testing acceptable |
| Defect escape rate | <30% | Learning phase, rapid iteration |
| Uptime | >95% | Small user base, downtime acceptable |

**Test Deliverables**:
- [ ] Pseudonymization test suite (100% coverage)
- [ ] Parser test suite with 3 fixtures per platform
- [ ] Manual test scripts for critical user journey
- [ ] Security checklist (OWASP Top 10 review)

---

### **10.2 Phase 1: MVP (Private Beta)**

**Testing Focus**: Feature completeness, stability, security hardening

**Test Requirements**:
- ✅ Unit tests: >80% coverage
- ✅ Integration tests: >70% of endpoints
- ✅ E2E test automation (Playwright) for critical flows
- ✅ Security testing: Full OWASP Top 10 coverage
- ✅ Performance testing: Baseline metrics established

**Quality Targets**:
| Metric | Target | Rationale |
|--------|--------|-----------|
| Unit test coverage | >80% | Comprehensive algorithm validation |
| Integration test coverage | >70% | Most API endpoints tested |
| E2E test coverage | All critical flows | Automation for regression prevention |
| Defect escape rate | <15% | Higher quality bar for paying users |
| Uptime | >98% | Beta users expect reliability |
| Lighthouse Performance | >80 | Acceptable performance |

**Test Deliverables**:
- [ ] Full unit test suite (>80% coverage)
- [ ] Integration test suite (70% endpoints)
- [ ] E2E test suite (Playwright) for 5 critical journeys
- [ ] Security test suite (OWASP Top 10)
- [ ] Performance baseline report (Lighthouse, k6)
- [ ] Test automation CI/CD pipeline

---

### **10.3 Phase 2: Public Launch**

**Testing Focus**: Scalability, performance, production readiness

**Test Requirements**:
- ✅ Unit tests: >85% coverage
- ✅ Integration tests: >80% of endpoints
- ✅ E2E tests: >90% of user flows
- ✅ Security testing: Penetration test + compliance review
- ✅ Performance testing: Load testing, stress testing
- ✅ Accessibility testing: WCAG AA compliance

**Quality Targets**:
| Metric | Target | Rationale |
|--------|--------|-----------|
| Unit test coverage | >85% | High quality code |
| Integration test coverage | >80% | Comprehensive API validation |
| E2E test coverage | >90% | Nearly all user flows automated |
| Defect escape rate | <5% | Very few production bugs |
| Uptime | >99.5% | Public-facing SLA |
| Lighthouse Performance | >90 | Competitive performance |
| Core Web Vitals | All "Good" | SEO + UX |

**Test Deliverables**:
- [ ] Complete test suite (unit + integration + E2E)
- [ ] Load test report (1000 concurrent users)
- [ ] Penetration test report (third-party)
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Performance optimization report
- [ ] Production monitoring setup (Sentry, Vercel Analytics)

---

### **10.4 Phase 3: Growth & Scale**

**Testing Focus**: Optimization, reliability, advanced features

**Test Requirements**:
- ✅ Unit tests: >90% coverage
- ✅ Integration tests: >85% coverage
- ✅ E2E tests: >95% coverage
- ✅ Chaos engineering (fault injection)
- ✅ Performance testing: 10K+ concurrent users
- ✅ Multi-region testing

**Quality Targets**:
| Metric | Target | Rationale |
|--------|--------|-----------|
| Unit test coverage | >90% | Mature codebase |
| Integration test coverage | >85% | Full API validation |
| E2E test coverage | >95% | Comprehensive automation |
| Defect escape rate | <2% | Extremely low production bugs |
| Uptime | >99.9% | Enterprise-grade SLA |
| Lighthouse Performance | >95 | Best-in-class |
| MTTR (critical bugs) | <4 hours | Fast incident response |

**Test Deliverables**:
- [ ] Chaos engineering tests (Netflix Chaos Monkey-style)
- [ ] Multi-region performance tests
- [ ] Advanced security testing (bug bounty program)
- [ ] Automated regression suite (comprehensive)
- [ ] Production synthetic monitoring

---

## **11. Quality Gates**

### **11.1 Pre-Commit Quality Gates**

**Local Development (Git Hooks)**:
```bash
# .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint:fix

# Run type checking
npm run typecheck

# Run unit tests for changed files
npm run test:changed

# Check for secrets
npx gitleaks protect --staged
```

**Acceptance Criteria**:
- ✅ No linting errors
- ✅ No TypeScript errors
- ✅ All unit tests pass
- ✅ No secrets in code

---

### **11.2 PR Quality Gates**

**Automated Checks (CI)**:

1. **Code Quality**:
   - ✅ Linting passes (ESLint, Prettier)
   - ✅ Type checking passes (TypeScript)
   - ✅ Code coverage ≥80% (no regression)

2. **Tests**:
   - ✅ All unit tests pass
   - ✅ All integration tests pass
   - ✅ All E2E tests pass
   - ✅ Test execution time <5 minutes

3. **Security**:
   - ✅ No high/critical vulnerabilities (npm audit, Snyk)
   - ✅ No secrets detected (Gitleaks)
   - ✅ SAST scan passes (CodeQL)

4. **Performance**:
   - ✅ Bundle size <500KB (no regression)
   - ✅ Lighthouse CI score ≥90

5. **Code Review**:
   - ✅ At least 1 approving review
   - ✅ All review comments addressed
   - ✅ No merge conflicts

**Acceptance Criteria**:
- All automated checks pass (green checkmarks)
- Code review approved
- Branch up-to-date with main

---

### **11.3 Deployment Quality Gates**

**Staging Deployment**:
- ✅ All PR quality gates passed
- ✅ Smoke tests pass on staging environment
- ✅ Database migrations successful (if applicable)

**Production Deployment**:
- ✅ Staging deployment successful
- ✅ Manual QA sign-off (for major releases)
- ✅ Rollback plan documented
- ✅ Feature flags configured (gradual rollout)
- ✅ Monitoring alerts configured

**Post-Deployment Validation**:
- ✅ Smoke tests pass on production
- ✅ No error rate spike (Sentry)
- ✅ Performance metrics stable (Vercel Analytics)
- ✅ User feedback monitored (first 24 hours)

---

## **12. Test Tools & Infrastructure**

### **12.1 Testing Tools Matrix**

| Category | Tool | Purpose | License |
|----------|------|---------|---------|
| **Unit Testing** | Vitest | Fast unit test runner | MIT |
| **Unit Testing** | Jest | Alternative for Node.js | MIT |
| **Component Testing** | React Testing Library | React component testing | MIT |
| **Integration Testing** | Supertest | HTTP API testing | MIT |
| **E2E Testing** | Playwright | Cross-browser E2E tests | Apache 2.0 |
| **Visual Testing** | Percy.io | Visual regression | Commercial |
| **API Testing** | Prism | OpenAPI mock server | Apache 2.0 |
| **Load Testing** | k6 | Load + stress testing | AGPL 3.0 |
| **Performance** | Lighthouse CI | Performance metrics | Apache 2.0 |
| **Accessibility** | axe-core | Accessibility testing | MPL 2.0 |
| **Security (SAST)** | CodeQL | Static analysis | MIT |
| **Security (DAST)** | OWASP ZAP | Dynamic analysis | Apache 2.0 |
| **Dependency Scan** | Snyk | Vulnerability scanning | Commercial |
| **Secret Scan** | Gitleaks | Secret detection | MIT |
| **Coverage** | Vitest Coverage | Code coverage | MIT |
| **Mocking** | MSW | API mocking | MIT |
| **Test Data** | Faker.js | Synthetic data | MIT |
| **CI/CD** | GitHub Actions | Test automation | Free (public) |

### **12.2 Test Infrastructure**

**Local Development**:
```yaml
# docker-compose.test.yml

version: '3.8'

services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: vsg_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: testpassword
    ports:
      - "5433:5432"
    volumes:
      - test-db-data:/var/lib/postgresql/data

  redis-test:
    image: redis:7
    ports:
      - "6380:6379"

  stripe-mock:
    image: stripe/stripe-mock:latest
    ports:
      - "12111:12111"

volumes:
  test-db-data:
```

**CI Environment** (GitHub Actions):
- PostgreSQL 15 (Docker service)
- Redis 7 (Docker service)
- Node.js 20.x (LTS)
- Playwright browsers (Chromium, Firefox, WebKit)

---

### **12.3 Test Data Storage**

**Fixtures Repository**:
```
/tests/fixtures/
├── platform-archives/        # Real platform exports (anonymized)
│   ├── twitter/
│   │   ├── small-100-nodes.zip
│   │   ├── medium-1k-nodes.zip
│   │   └── large-10k-nodes.zip
│   ├── instagram/
│   └── linkedin/
├── api-responses/            # Mock API responses
│   ├── stripe/
│   │   ├── webhook-payment-success.json
│   │   └── webhook-subscription-canceled.json
│   └── email/
├── database-seeds/           # Test database seeds
│   ├── users.sql
│   ├── graphs.sql
│   └── subscriptions.sql
└── visual-baselines/         # Visual regression baselines
    ├── homepage.png
    ├── dashboard.png
    └── graph-view.png
```

---

## **13. Roles & Responsibilities**

### **13.1 Testing Responsibilities**

| Role | Unit Tests | Integration Tests | E2E Tests | Security Tests | Manual QA |
|------|-----------|-------------------|-----------|----------------|-----------|
| **Software Engineer** | ✅ Write + Maintain | ✅ Write + Maintain | ⚠️ Support | ⚠️ Support | ⏭️ No |
| **QA Engineer** | ⚠️ Review | ⚠️ Review | ✅ Write + Maintain | ✅ Write + Execute | ✅ Execute |
| **Security Engineer** | ⏭️ No | ⏭️ No | ⏭️ No | ✅ Design + Review | ⚠️ Pentesting |
| **DevOps Engineer** | ⏭️ No | ⚠️ CI/CD | ⚠️ CI/CD | ⚠️ CI/CD | ⏭️ No |
| **Product Manager** | ⏭️ No | ⏭️ No | ⏭️ No | ⏭️ No | ⚠️ UAT |

**Legend**: ✅ Primary, ⚠️ Supporting, ⏭️ Not involved

---

### **13.2 Test Review Process**

**Test Code Reviews** (same rigor as production code):

**Review Checklist**:
- [ ] Test names are descriptive (what is being tested)
- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Tests are independent (no shared state)
- [ ] Edge cases covered
- [ ] Assertions are meaningful (not just "truthy")
- [ ] No test duplication
- [ ] Test data is realistic
- [ ] No flaky tests (deterministic)

**Approval Requirements**:
- At least 1 engineer approval
- QA engineer approval (for E2E tests)
- Security engineer approval (for security tests)

---

## **14. Risk-Based Testing**

### **14.1 Risk Assessment Matrix**

| Component | Business Impact | Technical Risk | Test Priority | Coverage Target |
|-----------|----------------|----------------|---------------|-----------------|
| **Server-Side Pseudonymization** | Critical | High | **P0** | 100% |
| **Authentication (Magic Link)** | Critical | High | **P0** | 100% |
| **Payment Processing** | Critical | High | **P0** | 100% |
| **Graph Visualization** | High | Medium | **P1** | >90% |
| **Platform Parsers** | High | High | **P1** | >95% |
| **Insight Generation** | Medium | Medium | **P2** | >85% |
| **Export Generation** | Medium | Low | **P2** | >80% |
| **User Profile Management** | Low | Low | **P3** | >70% |

**Risk Scoring**:
- **Business Impact**: Critical (data loss, revenue loss) > High (user frustration) > Medium (inconvenience) > Low (cosmetic)
- **Technical Risk**: High (complex, many dependencies) > Medium (moderate complexity) > Low (simple, isolated)

---

### **14.2 Test Prioritization**

**P0 (Must Test First)**:
- Server-side pseudonymization (privacy-critical)
- Authentication & authorization (security-critical)
- Payment processing (revenue-critical)

**P1 (Test Early)**:
- Graph visualization (core value proposition)
- Platform parsers (data accuracy)

**P2 (Test When Stable)**:
- Insight generation
- Export generation

**P3 (Test if Time Permits)**:
- User profile management
- Settings pages
- Documentation

---

## **15. Compliance & Security Testing**

### **15.1 Security Compliance Checklist**

**OWASP Top 10 (2021)**:
- [x] A01: Broken Access Control → Tested in Section 4.4
- [x] A02: Cryptographic Failures → TLS enforcement, encryption at rest
- [x] A03: Injection → SQL injection, XSS prevention
- [x] A04: Insecure Design → Constitutional constraints enforced
- [x] A05: Security Misconfiguration → Security headers tested
- [x] A06: Vulnerable Components → Dependency scanning (Snyk)
- [x] A07: Authentication Failures → Magic link security tested
- [x] A08: Software/Data Integrity → Webhook signature verification
- [x] A09: Logging Failures → No PII in logs verified
- [x] A10: SSRF → URL validation tested

**Constitutional Constraints**:
- [x] C1: No Account Access (OAuth prohibited) → Static analysis
- [x] C2: User Data Ownership (no display names stored) → Database schema tests
- [x] C3: Client-Side Processing (80% rule) → Architecture review

**Privacy Compliance**:
- [x] GDPR Data Minimization → Only essential data collected
- [x] Right to Deletion → Graph deletion endpoint tested
- [x] Data Portability → Export functionality tested
- [x] Pseudonymization → HMAC-SHA256 implementation verified

---

### **15.2 Penetration Testing**

**Schedule**: Annual (before Phase 2 launch, then yearly)

**Scope**:
- Web application (frontend + backend)
- API endpoints (authentication, graph CRUD)
- Infrastructure (Vercel, Railway, PostgreSQL)

**Test Types**:
- OWASP Top 10 validation
- Authentication bypass attempts
- Authorization (IDOR) testing
- Session management testing
- Input validation (XSS, SQL injection)
- Business logic flaws

**Deliverables**:
- Penetration test report (findings + severity)
- Remediation plan (timeline for fixes)
- Retest report (verify fixes)

---

### **15.3 Bug Bounty Program** (Phase 3+)

**Scope**:
- `*.visualsocialgraph.com`
- API endpoints (`api.visualsocialgraph.com`)

**Out of Scope**:
- Social engineering
- DoS attacks
- Third-party services (Stripe, Vercel)

**Rewards**:
| Severity | Reward |
|----------|--------|
| Critical (RCE, data breach) | $500 - $1000 |
| High (authentication bypass) | $200 - $500 |
| Medium (XSS, CSRF) | $50 - $200 |
| Low (info disclosure) | $25 - $50 |

---

## **16. Test Metrics & Reporting**

### **16.1 Key Metrics Dashboard**

**Test Health Metrics** (tracked weekly):
- Test pass rate (target: >98%)
- Test flakiness rate (target: <1%)
- Test execution time (target: unit <10s, E2E <5min)
- Code coverage (target: >80%)

**Defect Metrics** (tracked weekly):
- Open bugs by severity (P0/P1/P2/P3)
- Mean time to detect (MTTD)
- Mean time to resolve (MTTR)
- Defect escape rate (production bugs / total bugs)

**Performance Metrics** (tracked daily):
- Lighthouse score (target: >90)
- Core Web Vitals (LCP, FID, CLS)
- API response time (p95, p99)
- Error rate (target: <1%)

---

### **16.2 Weekly Test Report**

**Template**:
```markdown
# Weekly QA Report - Week of YYYY-MM-DD

## Test Execution Summary
- Unit Tests: XXXX passed / XXXX total (XX.X%)
- Integration Tests: XXXX passed / XXXX total (XX.X%)
- E2E Tests: XXXX passed / XXXX total (XX.X%)
- Total Execution Time: XX minutes

## Code Coverage
- Line Coverage: XX.X% (Target: >80%)
- Branch Coverage: XX.X% (Target: >75%)
- Coverage Trend: ↑ +2.3% vs last week

## Defects
- New Bugs: X (P0: X, P1: X, P2: X, P3: X)
- Fixed Bugs: X
- Open Bugs: X (P0: X, P1: X, P2: X, P3: X)
- MTTR: X hours (Critical), X days (High)

## Performance
- Lighthouse Score: XX (Target: >90)
- Core Web Vitals: LCP XX.Xs, FID XXms, CLS X.XX
- API p95 Latency: XXXms (Target: <500ms)

## Security
- Dependency Vulnerabilities: X high, X medium
- Security Scan Status: ✅ Passed

## Quality Highlights
- [Achievement 1: e.g., "Achieved 85% code coverage milestone"]
- [Achievement 2: e.g., "Reduced E2E test time by 30%"]

## Quality Concerns
- [Concern 1: e.g., "Flaky E2E test in graph visualization"]
- [Concern 2: e.g., "Coverage dropped in parser module"]

## Action Items
- [ ] Fix flaky test in graph-viz.spec.ts
- [ ] Add unit tests for new parser features
- [ ] Update Lighthouse CI baseline
```

---

### **16.3 Release Quality Report**

**Pre-Release Checklist**:
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage ≥80% (no regression)
- [ ] No P0/P1 open bugs
- [ ] Security scan passed (no high/critical vulnerabilities)
- [ ] Performance regression test passed
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Manual QA sign-off
- [ ] Rollback plan documented

**Release Report**:
```markdown
# Release Quality Report - v1.2.0

## Quality Metrics
- Code Coverage: 87.3% (+2.1% vs v1.1.0)
- Test Pass Rate: 99.8%
- Defects Fixed: 23 (P0: 0, P1: 3, P2: 12, P3: 8)
- Performance: Lighthouse 93 (+3 vs v1.1.0)

## Testing Summary
- Unit Tests: 1,234 passed
- Integration Tests: 156 passed
- E2E Tests: 67 passed
- Security Tests: 45 passed

## Known Issues
- [Minor UI bug in export modal - P3 - scheduled for v1.2.1]

## Quality Sign-Off
- ✅ QA Lead: [Name]
- ✅ Security Review: [Name]
- ✅ Engineering Lead: [Name]
```

---

## **17. Appendices**

### **17.1 Appendix A: Test Automation Setup Guide**

**Prerequisites**:
- Node.js 20+ installed
- Docker installed (for database)
- Git configured

**Setup Steps**:
```bash
# Clone repository
git clone https://github.com/org/visual-social-graph.git
cd visual-social-graph

# Install dependencies
npm install

# Setup test database
docker-compose -f docker-compose.test.yml up -d

# Run database migrations
npx prisma migrate deploy --preview-feature

# Seed test data
npm run db:seed:test

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

### **17.2 Appendix B: Common Testing Patterns**

**Pattern 1: AAA (Arrange-Act-Assert)**:
```typescript
it('should calculate PageRank correctly', () => {
  // Arrange
  const graph = createTestGraph({ nodes: 3, edges: 3 });
  const algorithm = new PageRankAlgorithm();

  // Act
  const result = algorithm.calculate(graph);

  // Assert
  expect(result).toHaveLength(3);
  expect(result[0].score).toBeCloseTo(0.33, 2);
});
```

**Pattern 2: Given-When-Then (BDD)**:
```typescript
describe('Graph Creation', () => {
  it('should create graph with pseudonymized IDs', async () => {
    // Given a user with a valid session
    const user = await createTestUser();
    const authToken = generateJWT(user.id);

    // When the user creates a graph with original IDs
    const response = await request(app)
      .post('/api/v1/graphs')
      .set('Cookie', `vsg_session=${authToken}`)
      .send({
        platform: 'twitter',
        parseVersion: 'twitter_v2.1',
        graph: {
          nodes: [{ externalId: '123', type: 'user' }],
          edges: [],
          metadata: { statistics: { nodeCount: 1, edgeCount: 0 } }
        }
      });

    // Then the response contains pseudonymized IDs
    expect(response.body.pseudonymMapping).toHaveProperty('123');
  });
});
```

**Pattern 3: Test Factories**:
```typescript
// Use factories for consistent test object creation
const user = createTestUser({ tier: 'pro' });
const graph = createTestGraph({ userId: user.id, nodeCount: 1000 });
```

---

### **17.3 Appendix C: Test Fixture Examples**

**Fixture: Twitter Archive (Small)**:
```json
{
  "name": "twitter-archive-small.zip",
  "description": "Small Twitter archive with 100 nodes, 250 edges",
  "size": "2.3 MB",
  "contents": {
    "following.js": "100 following relationships",
    "followers.js": "50 follower relationships",
    "profile.js": "User profile (anonymized)"
  },
  "anonymization": {
    "display_names": "Replaced with REDACTED",
    "usernames": "Replaced with user_XXXXX",
    "user_ids": "Randomized numeric IDs",
    "timestamps": "Truncated to day-level"
  }
}
```

---

### **17.4 Appendix D: Testing Glossary**

| Term | Definition |
|------|------------|
| **Unit Test** | Test of a single function or component in isolation |
| **Integration Test** | Test of multiple components working together |
| **E2E Test** | Test of complete user workflow from UI to database |
| **Smoke Test** | Quick test to verify basic functionality after deployment |
| **Regression Test** | Test to ensure old bugs don't reappear |
| **Flaky Test** | Test that intermittently fails (non-deterministic) |
| **Test Coverage** | Percentage of code executed by tests |
| **AAA Pattern** | Arrange-Act-Assert test structure |
| **Mock** | Fake object that simulates real dependency |
| **Stub** | Hardcoded response for testing |
| **Fixture** | Predefined test data |
| **Factory** | Function that generates test objects |

---

### **17.5 Appendix E: Testing Anti-Patterns to Avoid**

**❌ Anti-Pattern 1: Testing Implementation Details**:
```typescript
// BAD: Testing internal state
expect(component._internalCounter).toBe(5);

// GOOD: Testing behavior
expect(component.getCount()).toBe(5);
```

**❌ Anti-Pattern 2: Shared Test State**:
```typescript
// BAD: Shared state across tests
let user;
beforeAll(() => { user = createUser(); }); // WRONG

// GOOD: Independent state per test
beforeEach(() => { user = createUser(); });
```

**❌ Anti-Pattern 3: Multiple Assertions on Different Behaviors**:
```typescript
// BAD: Testing multiple things
it('should work', () => {
  expect(result.name).toBe('John');
  expect(result.age).toBe(30);
  expect(result.email).toBe('john@example.com');
});

// GOOD: Separate tests for each behavior
it('should set name correctly', () => {
  expect(result.name).toBe('John');
});
it('should set age correctly', () => {
  expect(result.age).toBe(30);
});
```

**❌ Anti-Pattern 4: Flaky Tests (Time-Dependent)**:
```typescript
// BAD: Time-dependent test
it('should expire token', async () => {
  createToken();
  await sleep(1001); // Flaky!
  expect(isExpired()).toBe(true);
});

// GOOD: Mock time
it('should expire token', () => {
  jest.useFakeTimers();
  createToken();
  jest.advanceTimersByTime(1001);
  expect(isExpired()).toBe(true);
});
```

---

### **17.6 Appendix F: References**

**Testing Frameworks Documentation**:
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)

**Security Testing Resources**:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

**Performance Testing**:
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [k6 Documentation](https://k6.io/docs/)

**Accessibility Testing**:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)

**Best Practices**:
- [Google Testing Blog](https://testing.googleblog.com/)
- [Martin Fowler - Testing Strategies](https://martinfowler.com/testing/)

---

## **Document Revision History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-28 | QA Engineering | Initial release - comprehensive QA & Test Plan |

---

**End of Document**

*This QA & Test Plan is a living document and will be updated as the project evolves.*
