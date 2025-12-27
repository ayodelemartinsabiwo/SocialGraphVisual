# **Visual Social Graph: API Specification**
## **Version 1.0 - RESTful API Design**

*"Every endpoint should sing. Every response should breathe. Every error should guide."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 (Initial Release) |
| **Date** | December 27, 2025 |
| **Status** | Ready for Implementation |
| **Owner** | Engineering / API Team |
| **Review Cycle** | Weekly (Phase 0-1), Bi-weekly (Phase 2+) |
| **Classification** | Internal - Technical |
| **Scope** | Phase 0-2 (detailed), Phase 3+ (directional) |

**Document Hierarchy:**
```
Product Strategy Document v1.1 (strategic constitution)
    ↓ constrains
Product Requirements Document v2.2 (what we're building)
    ↓ defines
System Requirements Specification v1.3 (functional requirements)
    ↓ guides
Architecture Document v1.0 (system design)
    ↓ implements
API Specification v1.0 (THIS DOCUMENT - interface contracts)
    ↓ enables
Frontend & Third-Party Integration
```

**Related Documents:**
- [VSG_DESIGN_PRINCIPLE.md](./VSG_DESIGN_PRINCIPLE.md) - Algorithm-First core principle
- [VSG_ARCHITECTURE_DOCUMENT.md](./VSG_ARCHITECTURE_DOCUMENT.md) - System architecture
- [VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md](./VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md) - Technical requirements
- [VSG_DATA_INTELLIGENCE_FRAMEWORK.md](./VSG_DATA_INTELLIGENCE_FRAMEWORK.md) - Data models & algorithms
- [VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md](./VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md) - UI/UX design
- [VSG_PRODUCT_REQUIREMENT_DOC.md](./VSG_PRODUCT_REQUIREMENT_DOC.md) - Product requirements

**Change Log:**
```
v1.0 (Dec 27, 2025) - Initial Release:
├─ RESTful API design with JSON payloads
├─ Authentication & authorization endpoints
├─ Graph upload, storage, and retrieval
├─ Insight generation (algorithm-first, template-based)
├─ Export services (PDF, social cards, CSV/JSON)
├─ Stripe webhook integration
└─ Privacy-first data handling (pseudonymization)
```

---

## **Table of Contents**

1. [API Philosophy & Design Principles](#1-api-philosophy--design-principles)
2. [API Overview](#2-api-overview)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Core API Endpoints](#4-core-api-endpoints)
   - 4.1 [Authentication Endpoints](#41-authentication-endpoints)
   - 4.2 [User Management Endpoints](#42-user-management-endpoints)
   - 4.3 [Graph Upload & Processing](#43-graph-upload--processing)
   - 4.4 [Graph Retrieval & Management](#44-graph-retrieval--management)
   - 4.5 [Insights & Analysis](#45-insights--analysis)
   - 4.6 [Export Services](#46-export-services)
   - 4.7 [Subscription & Billing](#47-subscription--billing)
5. [Data Models & Schemas](#5-data-models--schemas)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting & Quotas](#7-rate-limiting--quotas)
8. [Webhooks](#8-webhooks)
9. [API Versioning Strategy](#9-api-versioning-strategy)
10. [Security Considerations](#10-security-considerations)
11. [Performance & Caching](#11-performance--caching)
12. [Testing & Validation](#12-testing--validation)
13. [Migration & Evolution](#13-migration--evolution)
14. [Appendices](#14-appendices)

---

## **1. API Philosophy & Design Principles**

### **1.1 Alignment with Core Principles**

**Algorithm-First Intelligence (from VSG_DESIGN_PRINCIPLE.md)**
```
PRINCIPLE: AI as a design tool, not a runtime dependency
API IMPLICATION: No external AI API calls at runtime
ENFORCEMENT:
├─ Insight generation uses deterministic algorithms + templates
├─ No OpenAI/Anthropic/Google AI endpoints in production code
├─ Template matching is rule-based (conditional logic)
└─ System remains functional if AI services disabled
```

**Privacy-First Architecture (from Architecture Document)**
```
PRINCIPLE: 80% client-side processing, minimal server data transfer
API IMPLICATION: Limited data sent to server
ENFORCEMENT:
├─ Raw social media files NEVER uploaded to server
├─ Client sends pseudonymized graph structure only
├─ Server stores hashed identifiers (keyed hash, non-reversible)
├─ User can delete all data via API (cascade delete)
└─ GDPR-compliant data export endpoint
```

**No Account Access Constraint (Tier 1 - Constitutional)**
```
PRINCIPLE: Never implement OAuth for social platforms
API IMPLICATION: No social platform credentials in API
ENFORCEMENT:
├─ Authentication endpoints for VSG access only (magic link, Google OAuth)
├─ NO Twitter/Instagram/LinkedIn/Facebook/TikTok OAuth endpoints
├─ Upload endpoints accept file data, not API tokens
└─ Code review blocks any social platform OAuth library
```

### **1.2 RESTful Design Principles**

**Resource-Oriented Architecture**
```
Resources (Nouns, not Verbs):
├─ /users/{userId}
├─ /graphs/{graphId}
├─ /insights/{insightId}
├─ /exports/{exportId}
└─ /subscriptions/{subscriptionId}

NOT:
├─ /getUser
├─ /createGraph
└─ /generateInsight
```

**HTTP Methods (Semantic)**
```
GET     - Retrieve resource(s)
POST    - Create new resource
PUT     - Update entire resource (replace)
PATCH   - Update partial resource (modify)
DELETE  - Remove resource
```

**Idempotency**
```
Safe (no side effects):     GET, HEAD, OPTIONS
Idempotent (same result):   GET, PUT, DELETE, HEAD, OPTIONS
Non-idempotent:             POST, PATCH

Example: PUT /graphs/{graphId} - same request = same outcome
Example: POST /graphs - same request = multiple graphs created
```

**HTTP Status Codes (Semantic)**
```
2xx Success:
├─ 200 OK - Request succeeded (GET, PUT, PATCH)
├─ 201 Created - Resource created (POST)
├─ 202 Accepted - Async processing started
├─ 204 No Content - Success, no response body (DELETE)

4xx Client Errors:
├─ 400 Bad Request - Invalid request body/parameters
├─ 401 Unauthorized - Missing or invalid authentication
├─ 403 Forbidden - Authenticated but insufficient permissions
├─ 404 Not Found - Resource doesn't exist
├─ 409 Conflict - Request conflicts with current state
├─ 422 Unprocessable Entity - Validation failed
├─ 429 Too Many Requests - Rate limit exceeded

5xx Server Errors:
├─ 500 Internal Server Error - Unhandled exception
├─ 502 Bad Gateway - Upstream service failure
├─ 503 Service Unavailable - Temporary unavailability
└─ 504 Gateway Timeout - Upstream timeout
```

### **1.3 API Design Goals**

**Developer Experience (DX)**
```
├─ Predictable: Consistent naming, structure, behavior
├─ Self-Documenting: Clear endpoint names, comprehensive schemas
├─ Forgiving: Accept flexible input, strict output
├─ Helpful Errors: Actionable error messages with recovery guidance
└─ Well-Documented: OpenAPI spec, examples, SDKs
```

**Performance**
```
├─ <500ms API response time (p95)
├─ <100ms for cached responses
├─ Pagination for large collections (limit 100 default)
├─ Efficient queries (database indexes, query optimization)
└─ CDN caching for static assets
```

**Security**
```
├─ HTTPS only (TLS 1.3)
├─ JWT authentication (short-lived tokens)
├─ Rate limiting (per user, per IP)
├─ Input validation (schema validation, sanitization)
└─ CORS configuration (whitelist origins)
```

---

## **2. API Overview**

### **2.1 Base URL**

```
Production:  https://api.visualsocialgraph.com/v1
Staging:     https://api-staging.visualsocialgraph.com/v1
Development: http://localhost:3001/v1
```

**API Versioning:**
- Version in URL path: `/v1`, `/v2`
- Current version: `v1`
- Version support policy: 12 months minimum after deprecation notice

### **2.2 API Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser/App)                      │
│  ├─ Web Worker: Client-side parsing (80% processing)        │
│  ├─ API Client: Fetch wrapper with auth, retries            │
│  └─ State Management: React Query (caching, optimistic UI)  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓ HTTPS (JWT in Authorization header)
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Express Middleware)                │
│  ├─ Authentication: JWT verification                         │
│  ├─ Authorization: Tier-based feature gating                │
│  ├─ Rate Limiting: Redis-backed (per user, per IP)          │
│  ├─ Request Validation: JSON schema validation             │
│  ├─ Error Handling: Standardized error responses           │
│  └─ Logging: Structured JSON logs (Pino)                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ├─ AuthService: Magic link, Google OAuth, JWT generation   │
│  ├─ GraphService: Graph CRUD, versioning, pseudonymization │
│  ├─ InsightService: Algorithm execution, template matching  │
│  ├─ ExportService: PDF, social cards, CSV/JSON generation   │
│  └─ BillingService: Stripe integration, subscription mgmt   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ├─ PostgreSQL: Users, graphs, insights, subscriptions      │
│  ├─ Redis: Sessions, rate limits, job queue, cache          │
│  └─ Cloudflare R2: Temporary file storage (uploads)         │
└─────────────────────────────────────────────────────────────┘
```

### **2.3 Request/Response Format**

**Content Type:**
```
Request:  application/json
Response: application/json
Errors:   application/json (problem+json inspired)
```

**Standard Response Envelope (Success):**
```json
{
  "data": {
    // Resource data here
  },
  "meta": {
    "timestamp": "2025-12-27T12:00:00Z",
    "version": "1.0"
  }
}
```

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Graph data validation failed",
    "details": [
      {
        "field": "nodes",
        "issue": "Array must contain at least 2 nodes"
      }
    ],
    "timestamp": "2025-12-27T12:00:00Z",
    "requestId": "req_abc123xyz",
    "documentation": "https://docs.visualsocialgraph.com/errors/VALIDATION_ERROR"
  }
}
```

**Pagination (for list endpoints):**
```json
{
  "data": [
    // Array of resources
  ],
  "pagination": {
    "total": 150,
    "count": 20,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "links": {
      "first": "/v1/graphs?page=1&pageSize=20",
      "last": "/v1/graphs?page=8&pageSize=20",
      "next": "/v1/graphs?page=2&pageSize=20",
      "prev": null
    }
  },
  "meta": {
    "timestamp": "2025-12-27T12:00:00Z"
  }
}
```

---

## **3. Authentication & Authorization**

### **3.1 Authentication Methods**

**1. Magic Link (Email-based, passwordless)**
```
Flow:
1. POST /auth/magic-link/request { email }
2. User receives email with time-limited link
3. User clicks link → redirected to /auth/magic-link/verify?token=xxx
4. Frontend calls POST /auth/magic-link/verify { token }
5. API returns JWT access token + refresh token
```

**2. Google OAuth (for VSG access only, NOT social platforms)**
```
Flow:
1. Frontend redirects to Google OAuth consent screen
2. User approves → Google redirects back with authorization code
3. Frontend calls POST /auth/google/callback { code }
4. API exchanges code for Google user info
5. API creates/updates user, returns JWT tokens
```

**3. JWT Token-Based Authentication**
```
Access Token:
├─ Short-lived: 15 minutes
├─ Payload: { userId, email, tier, iat, exp }
├─ Signed: HS256 (secret key)
└─ Delivered: HTTP-only cookie OR Authorization header

Refresh Token:
├─ Long-lived: 30 days
├─ Stored: Redis (revocable)
├─ Single-use: Invalidated after refresh
└─ Delivered: HTTP-only cookie (secure, sameSite)
```

### **3.2 Authorization (Tier-Based)**

**User Tiers:**
```typescript
enum UserTier {
  FREE = 'free',
  PRO = 'pro',
  CREATOR = 'creator'
}
```

**Feature Gating:**
```typescript
const featureAccess = {
  // Upload limits
  'upload.platforms': {
    free: 1,      // 1 platform
    pro: 5,       // All platforms
    creator: 5    // All platforms
  },
  'upload.refreshRate': {
    free: 'manual',          // Manual only
    pro: '30 days',          // Monthly refresh
    creator: '7 days'        // Weekly refresh
  },

  // Insight views
  'insights.views': {
    free: ['network_graph', 'basic_metrics'],
    pro: ['network_graph', 'positioning_map', 'engagement_circles',
          'content_resonance', 'growth_opportunities'],
    creator: ['*']  // All views
  },

  // Export capabilities
  'export.pdf': {
    free: false,
    pro: true,
    creator: true
  },
  'export.socialCards': {
    free: true,   // Viral loop
    pro: true,
    creator: true
  },
  'export.whiteLabel': {
    free: false,
    pro: false,
    creator: true  // Creator tier only
  },

  // API rate limits (requests per minute)
  'rateLimit.rpm': {
    free: 30,
    pro: 120,
    creator: 300
  }
};
```

### **3.3 Request Authentication**

**Authorization Header:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Authenticated Request:**
```bash
curl -X GET https://api.visualsocialgraph.com/v1/graphs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Token Refresh Flow:**
```http
POST /v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_abc123xyz"
}

Response:
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_xyz789abc",
    "expiresIn": 900
  }
}
```

---

## **4. Core API Endpoints**

### **4.1 Authentication Endpoints**

#### **POST /auth/magic-link/request**

Request a magic link for passwordless login.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "message": "Magic link sent to user@example.com. Link expires in 15 minutes.",
    "expiresAt": "2025-12-27T12:15:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid email format
- `429 Too Many Requests` - Rate limit exceeded (max 3 requests per hour per email)

---

#### **POST /auth/magic-link/verify**

Verify magic link token and obtain JWT tokens.

**Request:**
```json
{
  "token": "ml_abc123xyz789"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "Jane Doe",
      "tier": "free",
      "createdAt": "2025-12-27T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_xyz789abc",
    "expiresIn": 900
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid or expired token
- `404 Not Found` - Token not found

---

#### **POST /auth/google/callback**

Exchange Google OAuth authorization code for JWT tokens.

**Request:**
```json
{
  "code": "4/0AY0e-g7...",
  "redirectUri": "https://app.visualsocialgraph.com/auth/callback"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@gmail.com",
      "name": "Jane Doe",
      "tier": "free",
      "createdAt": "2025-12-27T10:00:00Z",
      "googleId": "117234567890123456789"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_xyz789abc",
    "expiresIn": 900,
    "isNewUser": true
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid authorization code
- `502 Bad Gateway` - Google OAuth service unavailable

---

#### **POST /auth/refresh**

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_abc123xyz"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_new789xyz",
    "expiresIn": 900
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or expired refresh token
- `403 Forbidden` - Refresh token revoked

---

#### **POST /auth/logout**

Revoke refresh token and invalidate session.

**Request:**
```json
{
  "refreshToken": "refresh_abc123xyz"
}
```

**Response: 204 No Content**

---

### **4.2 User Management Endpoints**

#### **GET /users/me**

Retrieve authenticated user's profile.

**Response: 200 OK**
```json
{
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "tier": "pro",
    "createdAt": "2025-12-27T10:00:00Z",
    "updatedAt": "2025-12-27T11:30:00Z",
    "subscription": {
      "status": "active",
      "currentPeriodEnd": "2026-01-27T10:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "usage": {
      "graphsUploaded": 3,
      "platformsConnected": ["twitter", "linkedin"],
      "lastUpload": "2025-12-26T14:20:00Z"
    }
  }
}
```

---

#### **PATCH /users/me**

Update authenticated user's profile.

**Request:**
```json
{
  "name": "Jane Smith"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "Jane Smith",
    "tier": "pro",
    "updatedAt": "2025-12-27T12:00:00Z"
  }
}
```

---

#### **DELETE /users/me**

Delete user account and all associated data (GDPR compliance).

**Response: 204 No Content**

**Side Effects:**
- Cascade delete: graphs, insights, exports
- Stripe subscription canceled
- Refresh tokens revoked
- Data purged from backups within 90 days
- Confirmation email sent

---

### **4.3 Graph Upload & Processing**

#### **POST /graphs/upload/initiate**

Initiate resumable file upload (Tus protocol).

**Request:**
```json
{
  "platform": "twitter",
  "fileName": "twitter-archive.zip",
  "fileSize": 15728640,
  "checksum": "sha256:abc123..."
}
```

**Response: 201 Created**
```json
{
  "data": {
    "uploadId": "upl_abc123",
    "uploadUrl": "https://api.visualsocialgraph.com/v1/uploads/upl_abc123",
    "expiresAt": "2025-12-27T13:00:00Z",
    "resumable": true,
    "maxChunkSize": 5242880
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid platform or file size exceeds limit
- `403 Forbidden` - Tier limit reached (free tier: 1 platform)

---

#### **POST /graphs**

Create graph from client-processed data (after client-side parsing).

**Request:**
```json
{
  "platform": "twitter",
  "uploadId": "upl_abc123",
  "data": {
    "nodes": [
      {
        "id": "hash_user1",
        "type": "self",
        "displayName": "hash_jane",
        "username": "hash_janedoe",
        "followerCount": 1250,
        "followingCount": 340
      },
      {
        "id": "hash_user2",
        "type": "user",
        "displayName": "hash_john",
        "username": "hash_johndoe",
        "followerCount": 890
      }
    ],
    "edges": [
      {
        "source": "hash_user1",
        "target": "hash_user2",
        "type": "follows",
        "weight": 0.75,
        "interactions": {
          "likes": 45,
          "comments": 12,
          "shares": 3
        },
        "createdAt": "2024-06-15T00:00:00Z"
      }
    ],
    "metadata": {
      "uploadId": "upl_abc123",
      "parseVersion": "twitter_v2.1",
      "parsingErrors": [],
      "statistics": {
        "nodeCount": 342,
        "edgeCount": 589,
        "density": 0.0051,
        "averageDegree": 3.45
      },
      "timePeriod": {
        "start": "2020-01-15T00:00:00Z",
        "end": "2025-12-27T00:00:00Z"
      }
    }
  }
}
```

**Response: 201 Created**
```json
{
  "data": {
    "id": "grp_abc123",
    "userId": "usr_abc123",
    "platform": "twitter",
    "version": 1,
    "isLatest": true,
    "createdAt": "2025-12-27T12:00:00Z",
    "status": "processing",
    "statistics": {
      "nodeCount": 342,
      "edgeCount": 589,
      "density": 0.0051
    }
  },
  "meta": {
    "estimatedProcessingTime": 15
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid graph structure
- `422 Unprocessable Entity` - Graph validation failed (details in error.details)
- `403 Forbidden` - Upload limit reached

---

#### **GET /graphs/{graphId}/status**

Check graph processing status.

**Response: 200 OK**
```json
{
  "data": {
    "graphId": "grp_abc123",
    "status": "completed",
    "progress": 100,
    "stages": [
      {
        "name": "validation",
        "status": "completed",
        "completedAt": "2025-12-27T12:00:05Z"
      },
      {
        "name": "pseudonymization",
        "status": "completed",
        "completedAt": "2025-12-27T12:00:10Z"
      },
      {
        "name": "metrics_computation",
        "status": "completed",
        "completedAt": "2025-12-27T12:00:25Z"
      },
      {
        "name": "insight_generation",
        "status": "completed",
        "completedAt": "2025-12-27T12:00:30Z"
      }
    ],
    "completedAt": "2025-12-27T12:00:30Z"
  }
}
```

**Possible Status Values:**
- `pending` - Queued for processing
- `processing` - Currently being processed
- `completed` - Successfully processed
- `failed` - Processing failed (see error details)

---

### **4.4 Graph Retrieval & Management**

#### **GET /graphs**

List user's graphs (paginated).

**Query Parameters:**
- `platform` (optional): Filter by platform (twitter, instagram, linkedin, facebook, tiktok)
- `page` (optional, default: 1): Page number
- `pageSize` (optional, default: 20, max: 100): Items per page
- `latestOnly` (optional, default: false): Only return latest version per platform

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "grp_abc123",
      "platform": "twitter",
      "version": 2,
      "isLatest": true,
      "createdAt": "2025-12-27T12:00:00Z",
      "statistics": {
        "nodeCount": 342,
        "edgeCount": 589
      },
      "hasInsights": true,
      "hasMetrics": true
    },
    {
      "id": "grp_xyz789",
      "platform": "linkedin",
      "version": 1,
      "isLatest": true,
      "createdAt": "2025-12-20T10:30:00Z",
      "statistics": {
        "nodeCount": 521,
        "edgeCount": 892
      },
      "hasInsights": true,
      "hasMetrics": true
    }
  ],
  "pagination": {
    "total": 5,
    "count": 2,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

#### **GET /graphs/{graphId}**

Retrieve specific graph with full data.

**Query Parameters:**
- `includeMetrics` (optional, default: true): Include computed metrics
- `includeNodes` (optional, default: true): Include node data
- `includeEdges` (optional, default: true): Include edge data

**Response: 200 OK**
```json
{
  "data": {
    "id": "grp_abc123",
    "userId": "usr_abc123",
    "platform": "twitter",
    "version": 2,
    "isLatest": true,
    "createdAt": "2025-12-27T12:00:00Z",
    "updatedAt": "2025-12-27T12:00:30Z",
    "data": {
      "nodes": [
        // Full node array (pseudonymized)
      ],
      "edges": [
        // Full edge array
      ],
      "metadata": {
        "uploadId": "upl_abc123",
        "parseVersion": "twitter_v2.1",
        "statistics": {
          "nodeCount": 342,
          "edgeCount": 589,
          "density": 0.0051,
          "averageDegree": 3.45
        },
        "timePeriod": {
          "start": "2020-01-15T00:00:00Z",
          "end": "2025-12-27T00:00:00Z"
        }
      }
    },
    "metrics": {
      // Full metrics object (see Section 5.3)
    }
  }
}
```

**Errors:**
- `404 Not Found` - Graph doesn't exist
- `403 Forbidden` - User doesn't own this graph

---

#### **DELETE /graphs/{graphId}**

Delete specific graph.

**Response: 204 No Content**

**Side Effects:**
- Associated insights deleted
- Cached exports invalidated
- Metrics removed

---

### **4.5 Insights & Analysis**

#### **GET /graphs/{graphId}/metrics**

Retrieve computed graph metrics.

**Response: 200 OK**
```json
{
  "data": {
    "graphId": "grp_abc123",
    "version": 1,
    "computedAt": "2025-12-27T12:00:25Z",
    "computationTime": 2340,

    "structure": {
      "nodeCount": 342,
      "edgeCount": 589,
      "density": 0.0051,
      "avgDegree": 3.45,
      "avgPathLength": 4.23,
      "diameter": 8,
      "clusteringCoefficient": 0.42
    },

    "communities": {
      "count": 8,
      "modularity": 0.76,
      "sizes": [89, 67, 52, 41, 35, 28, 19, 11],
      "distribution": {
        "largest": 26.0,
        "top3": 60.8,
        "top5": 82.2
      },
      "isolation": {
        "isolated": [4, 7],
        "echoScore": 0.34
      }
    },

    "centrality": {
      "pageRank": {
        "top10": [
          { "nodeId": "hash_user42", "score": 0.0234 },
          { "nodeId": "hash_user17", "score": 0.0198 }
        ],
        "selfRank": 23,
        "selfPercentile": 93.3
      },
      "betweenness": {
        "top10": [
          { "nodeId": "hash_user15", "score": 0.145 }
        ],
        "bridgeNodes": ["hash_user15", "hash_user28", "hash_user91"],
        "bridgePercentage": 12.5
      },
      "degree": {
        "max": 45,
        "min": 1,
        "median": 3,
        "distribution": {
          "p25": 2,
          "p50": 3,
          "p75": 6,
          "p90": 12,
          "p99": 28
        }
      }
    },

    "engagement": {
      "avgWeight": 0.42,
      "weightDistribution": {
        "p25": 0.15,
        "p50": 0.35,
        "p75": 0.68,
        "p90": 0.89
      },
      "activeConnections": 127,
      "passiveConnections": 215,
      "activePercentage": 37.1,
      "reciprocal": 89,
      "oneWay": 253,
      "reciprocityScore": 0.26
    },

    "patterns": {
      "homophily": {
        "intraCommunityEdges": 512,
        "interCommunityEdges": 77,
        "homophilyIndex": 0.87
      }
    }
  }
}
```

---

#### **GET /graphs/{graphId}/insights**

Retrieve algorithm-generated, template-based insights.

**Query Parameters:**
- `categories` (optional): Comma-separated categories (positioning, engagement, growth, community)
- `confidenceMin` (optional, default: 0.5): Minimum confidence level (0-1)

**Response: 200 OK**
```json
{
  "data": {
    "graphId": "grp_abc123",
    "generatedAt": "2025-12-27T12:00:30Z",
    "insights": [
      {
        "id": "ins_abc001",
        "category": "positioning",
        "type": "bridge_position",
        "title": "You're a Bridge Between 3 Communities",
        "summary": "Your network spans multiple distinct groups, positioning you as a connector.",
        "narrative": "Your network analysis reveals a strategic positioning advantage: **you connect 3 separate communities** that rarely interact with each other. This \"bridge\" position gives you unique value as an information broker and collaboration facilitator.\n\n**What this means:**\n- You're exposed to diverse perspectives and opportunities\n- You can introduce valuable connections between groups\n- Your content can reach audiences that don't overlap\n\n**Communities you bridge:**\n1. **Tech Entrepreneurs** (89 connections, 26% of network)\n2. **Design Professionals** (67 connections, 20% of network)\n3. **Marketing Specialists** (52 connections, 15% of network)",
        "confidence": 0.92,
        "metrics": {
          "betweennessScore": 0.145,
          "betweennessPercentile": 96.5,
          "communityCount": 8,
          "bridgedCommunities": [0, 1, 2]
        },
        "actions": [
          {
            "title": "Facilitate Cross-Community Connections",
            "description": "Introduce tech entrepreneurs to designers, or marketers to developers. Your unique position makes these introductions valuable.",
            "effort": "low",
            "impact": "high"
          },
          {
            "title": "Create Content That Bridges Topics",
            "description": "Write about the intersection of tech, design, and marketing. Your audience spans these areas.",
            "effort": "medium",
            "impact": "high"
          }
        ],
        "visualAnnotations": {
          "highlightNodes": ["hash_user1"],
          "highlightEdges": [],
          "colorCommunities": [0, 1, 2]
        }
      },
      {
        "id": "ins_abc002",
        "category": "engagement",
        "type": "super_fans",
        "title": "You Have 23 Super Fans (High Engagement)",
        "summary": "23 connections consistently engage with you. These are your core supporters.",
        "narrative": "Within your 342 connections, **23 people (6.7%) are \"super fans\"** who engage with your content significantly more than average. These aren't just followers—they're active supporters who amplify your message.\n\n**Engagement patterns:**\n- Average engagement weight: **0.82** (vs. 0.42 network average)\n- Consistent interaction over time\n- High reciprocity: You engage back with 87% of them\n\n**Why this matters:**\n- Super fans are your viral loop—they share, comment, tag others\n- They provide social proof that attracts new followers\n- They're candidates for deeper collaboration or testimonials",
        "confidence": 0.88,
        "metrics": {
          "superFanCount": 23,
          "superFanPercentage": 6.7,
          "avgSuperFanWeight": 0.82,
          "networkAvgWeight": 0.42
        },
        "actions": [
          {
            "title": "Acknowledge Your Super Fans",
            "description": "Shout out, thank, or feature your top supporters. Recognition strengthens loyalty.",
            "effort": "low",
            "impact": "medium"
          },
          {
            "title": "Create Exclusive Content for Engaged Users",
            "description": "Consider a newsletter, Discord, or early access for your most engaged connections.",
            "effort": "high",
            "impact": "high"
          }
        ],
        "visualAnnotations": {
          "highlightNodes": ["hash_user12", "hash_user34", "hash_user56"],
          "highlightEdges": [],
          "colorBy": "engagementWeight"
        }
      }
    ],
    "summary": {
      "totalInsights": 12,
      "byCategory": {
        "positioning": 3,
        "engagement": 4,
        "growth": 3,
        "community": 2
      },
      "byConfidence": {
        "high": 8,
        "medium": 3,
        "low": 1
      }
    }
  }
}
```

**Insight Categories:**
- `positioning` - Network position, influence, bridge roles
- `engagement` - Interaction patterns, super fans, reciprocity
- `growth` - Opportunities, trending connections, gaps
- `community` - Echo chambers, diversity, homophily

**Confidence Levels:**
- `high` (0.8-1.0): Strong evidence, clear pattern
- `medium` (0.5-0.8): Moderate evidence, likely accurate
- `low` (0-0.5): Weak evidence, exploratory

---

#### **POST /graphs/{graphId}/insights/regenerate**

Regenerate insights (e.g., after template updates, A/B test variant change).

**Request:**
```json
{
  "categories": ["positioning", "engagement"],
  "forceRefresh": true
}
```

**Response: 202 Accepted**
```json
{
  "data": {
    "jobId": "job_abc123",
    "status": "queued",
    "estimatedTime": 5
  }
}
```

---

### **4.6 Export Services**

#### **POST /exports/pdf**

Generate PDF report.

**Request:**
```json
{
  "graphId": "grp_abc123",
  "options": {
    "includeVisualization": true,
    "includeInsights": true,
    "includeMetrics": true,
    "template": "professional",
    "branding": {
      "logo": "https://cdn.example.com/logo.png",
      "companyName": "Jane Doe Consulting"
    }
  }
}
```

**Response: 202 Accepted**
```json
{
  "data": {
    "exportId": "exp_abc123",
    "status": "processing",
    "estimatedTime": 15
  }
}
```

**Errors:**
- `403 Forbidden` - PDF export requires Pro tier
- `403 Forbidden` - White-label branding requires Creator tier

---

#### **GET /exports/{exportId}**

Check export status and retrieve download URL.

**Response: 200 OK**
```json
{
  "data": {
    "id": "exp_abc123",
    "type": "pdf",
    "status": "completed",
    "createdAt": "2025-12-27T12:05:00Z",
    "completedAt": "2025-12-27T12:05:12Z",
    "downloadUrl": "https://cdn.visualsocialgraph.com/exports/exp_abc123.pdf?signature=xyz",
    "expiresAt": "2025-12-28T12:05:12Z",
    "fileSize": 2457600,
    "fileName": "visual-social-graph-twitter-2025-12-27.pdf"
  }
}
```

**Possible Status Values:**
- `queued` - Waiting for processing
- `processing` - Generating export
- `completed` - Ready for download
- `failed` - Generation failed

---

#### **POST /exports/social-card**

Generate shareable social media card (PNG image).

**Request:**
```json
{
  "graphId": "grp_abc123",
  "insightId": "ins_abc001",
  "template": "default",
  "customization": {
    "backgroundColor": "#F97316",
    "textColor": "#FFFFFF"
  }
}
```

**Response: 200 OK**
```json
{
  "data": {
    "imageUrl": "https://cdn.visualsocialgraph.com/cards/card_abc123.png",
    "width": 1200,
    "height": 630,
    "format": "png",
    "expiresAt": "2025-12-28T12:00:00Z"
  }
}
```

---

#### **POST /exports/data**

Export raw graph data (CSV or JSON).

**Request:**
```json
{
  "graphId": "grp_abc123",
  "format": "json",
  "includeMetrics": true,
  "includePseudonymized": false
}
```

**Response: 200 OK**
```json
{
  "data": {
    "downloadUrl": "https://cdn.visualsocialgraph.com/exports/graph_abc123.json?signature=xyz",
    "expiresAt": "2025-12-28T12:00:00Z",
    "fileSize": 524288,
    "format": "json"
  }
}
```

**Supported Formats:**
- `json` - Full graph structure (nodes, edges, metadata, metrics)
- `csv_nodes` - Node list with attributes
- `csv_edges` - Edge list with weights
- `gexf` - Graph Exchange XML Format (for Gephi)

---

### **4.7 Subscription & Billing**

#### **GET /subscriptions/plans**

List available subscription plans.

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "plan_free",
      "name": "Free",
      "price": 0,
      "currency": "USD",
      "interval": null,
      "features": {
        "platforms": 1,
        "insights": ["network_graph", "basic_metrics"],
        "exports": ["social_cards"],
        "refreshRate": "manual"
      }
    },
    {
      "id": "plan_pro",
      "name": "Pro",
      "price": 12.00,
      "currency": "USD",
      "interval": "month",
      "stripeProductId": "prod_abc123",
      "stripePriceId": "price_abc123",
      "features": {
        "platforms": 5,
        "insights": ["*"],
        "exports": ["pdf", "social_cards", "csv", "json"],
        "refreshRate": "30 days"
      }
    },
    {
      "id": "plan_creator",
      "name": "Creator",
      "price": 29.00,
      "currency": "USD",
      "interval": "month",
      "stripeProductId": "prod_xyz789",
      "stripePriceId": "price_xyz789",
      "features": {
        "platforms": 5,
        "insights": ["*"],
        "exports": ["pdf", "social_cards", "csv", "json", "white_label"],
        "refreshRate": "7 days",
        "customBranding": true
      }
    }
  ]
}
```

---

#### **POST /subscriptions/checkout**

Create Stripe checkout session for subscription.

**Request:**
```json
{
  "planId": "plan_pro",
  "successUrl": "https://app.visualsocialgraph.com/dashboard?checkout=success",
  "cancelUrl": "https://app.visualsocialgraph.com/pricing?checkout=canceled"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "sessionId": "cs_test_abc123",
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_abc123#fidkdWxOYHdg..."
  }
}
```

---

#### **GET /subscriptions/me**

Retrieve authenticated user's subscription.

**Response: 200 OK**
```json
{
  "data": {
    "id": "sub_abc123",
    "userId": "usr_abc123",
    "planId": "plan_pro",
    "status": "active",
    "currentPeriodStart": "2025-12-27T10:00:00Z",
    "currentPeriodEnd": "2026-01-27T10:00:00Z",
    "cancelAtPeriodEnd": false,
    "stripeSubscriptionId": "sub_abc123xyz",
    "createdAt": "2025-12-27T10:00:00Z"
  }
}
```

---

#### **POST /subscriptions/me/cancel**

Cancel subscription (at end of billing period).

**Response: 200 OK**
```json
{
  "data": {
    "id": "sub_abc123",
    "status": "active",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2026-01-27T10:00:00Z",
    "message": "Your subscription will remain active until 2026-01-27. You'll retain Pro features until then."
  }
}
```

---

#### **POST /subscriptions/me/reactivate**

Reactivate canceled subscription.

**Response: 200 OK**
```json
{
  "data": {
    "id": "sub_abc123",
    "status": "active",
    "cancelAtPeriodEnd": false,
    "currentPeriodEnd": "2026-01-27T10:00:00Z",
    "message": "Your subscription has been reactivated. You will be billed at the end of the current period."
  }
}
```

---

## **5. Data Models & Schemas**

### **5.1 User Model**

```typescript
interface User {
  id: string;                    // usr_abc123
  email: string;                 // unique, indexed
  name: string | null;
  tier: 'free' | 'pro' | 'creator';

  // OAuth
  googleId?: string;             // Google OAuth ID

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;

  // Soft delete
  deletedAt: Date | null;
}
```

### **5.2 Graph Model**

```typescript
interface Graph {
  id: string;                    // grp_abc123
  userId: string;                // Owner (foreign key)
  platform: 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';
  version: number;               // Incremental per platform
  isLatest: boolean;             // Quick query flag

  // Graph data (JSONB in PostgreSQL)
  data: {
    nodes: Node[];
    edges: Edge[];
    metadata: GraphMetadata;
  };

  // Cached metrics (denormalized)
  metrics: GraphMetrics | null;

  // Processing status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingError: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface Node {
  id: string;                    // Pseudonymized hash
  type: 'user' | 'self';
  displayName: string;           // Pseudonymized
  username: string;              // Pseudonymized
  followerCount?: number;
  followingCount?: number;
  degree?: number;
  pageRank?: number;
  betweenness?: number;
  communityId?: number;
  addedAt: Date;
  lastInteraction?: Date;
}

interface Edge {
  source: string;                // Node ID
  target: string;                // Node ID
  type: 'follows' | 'followed_by' | 'mutual' | 'engages_with';
  weight: number;                // 0-1
  interactions: {
    likes?: number;
    comments?: number;
    shares?: number;
    messages?: number;
  };
  createdAt: Date;
}

interface GraphMetadata {
  uploadId: string;
  parseVersion: string;
  parsingErrors: ParsingError[];
  statistics: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    averageDegree: number;
  };
  timePeriod: {
    start: Date;
    end: Date;
  };
}
```

### **5.3 Metrics Model**

```typescript
interface GraphMetrics {
  graphId: string;
  version: number;
  computedAt: Date;
  computationTime: number;       // Milliseconds

  structure: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    avgDegree: number;
    avgPathLength: number;
    diameter: number;
    clusteringCoefficient: number;
  };

  communities: {
    count: number;
    modularity: number;
    sizes: number[];
    distribution: {
      largest: number;
      top3: number;
      top5: number;
    };
    isolation: {
      isolated: number[];
      echoScore: number;
    };
  };

  centrality: {
    pageRank: {
      top10: { nodeId: string; score: number }[];
      selfRank: number | null;
      selfPercentile: number | null;
    };
    betweenness: {
      top10: { nodeId: string; score: number }[];
      bridgeNodes: string[];
      bridgePercentage: number;
    };
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

  engagement: {
    avgWeight: number;
    weightDistribution: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
    activeConnections: number;
    passiveConnections: number;
    activePercentage: number;
    reciprocal: number;
    oneWay: number;
    reciprocityScore: number;
  };

  patterns: {
    homophily: {
      intraCommunityEdges: number;
      interCommunityEdges: number;
      homophilyIndex: number;
    };
  };
}
```

### **5.4 Insight Model**

```typescript
interface Insight {
  id: string;                    // ins_abc123
  graphId: string;
  category: 'positioning' | 'engagement' | 'growth' | 'community';
  type: string;                  // bridge_position, super_fans, etc.
  title: string;
  summary: string;
  narrative: string;             // Markdown
  confidence: number;            // 0-1

  metrics: Record<string, any>;  // Relevant metrics

  actions: Action[];
  visualAnnotations: {
    highlightNodes: string[];
    highlightEdges: string[];
    colorCommunities: number[];
    colorBy?: string;
  };

  // Template tracking
  templateId: string;
  templateVersion: string;
  variantId?: string;            // A/B test variant

  createdAt: Date;
}

interface Action {
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}
```

### **5.5 Subscription Model**

```typescript
interface Subscription {
  id: string;                    // sub_abc123
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';

  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;

  // Stripe integration
  stripeSubscriptionId: string;
  stripeCustomerId: string;

  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
}
```

---

## **6. Error Handling**

### **6.1 Error Response Format**

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "fieldName",
        "issue": "Specific validation issue"
      }
    ],
    "timestamp": "2025-12-27T12:00:00Z",
    "requestId": "req_abc123xyz",
    "documentation": "https://docs.visualsocialgraph.com/errors/ERROR_CODE"
  }
}
```

### **6.2 Error Codes**

#### **Authentication Errors (401, 403)**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_MISSING_TOKEN` | 401 | Authorization header missing |
| `AUTH_INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `AUTH_EXPIRED_TOKEN` | 401 | JWT token expired (use refresh token) |
| `AUTH_REFRESH_INVALID` | 401 | Refresh token invalid or revoked |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `AUTH_TIER_REQUIRED` | 403 | Feature requires higher tier (Pro/Creator) |

#### **Validation Errors (400, 422)**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `INVALID_PLATFORM` | 400 | Unsupported platform value |
| `INVALID_GRAPH_STRUCTURE` | 422 | Graph data structure invalid |
| `FILE_TOO_LARGE` | 400 | File exceeds size limit |
| `INVALID_FORMAT` | 400 | File format not supported |

#### **Resource Errors (404, 409)**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `GRAPH_NOT_FOUND` | 404 | Graph ID not found |
| `USER_NOT_FOUND` | 404 | User ID not found |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |

#### **Rate Limiting (429)**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (see Retry-After header) |
| `UPLOAD_LIMIT_REACHED` | 403 | Tier upload limit reached |
| `EXPORT_LIMIT_REACHED` | 403 | Export quota exceeded |

#### **Server Errors (500, 502, 503)**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server error |
| `PROCESSING_FAILED` | 500 | Graph processing failed |
| `EXPORT_GENERATION_FAILED` | 500 | Export generation failed |
| `UPSTREAM_SERVICE_ERROR` | 502 | External service (Stripe, Google) failed |
| `SERVICE_UNAVAILABLE` | 503 | Temporary service unavailability |

### **6.3 Error Handling Best Practices**

**Client-Side Error Handling:**
```typescript
try {
  const response = await fetch('/v1/graphs', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.json();

    switch (error.error.code) {
      case 'AUTH_EXPIRED_TOKEN':
        // Refresh token and retry
        await refreshToken();
        return retry();

      case 'AUTH_TIER_REQUIRED':
        // Show upgrade modal
        showUpgradeModal(error.error.message);
        break;

      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        const retryAfter = response.headers.get('Retry-After');
        await sleep(parseInt(retryAfter) * 1000);
        return retry();

      default:
        // Show generic error
        showError(error.error.message);
    }
  }

  return response.json();
} catch (err) {
  // Network error
  showError('Network error. Please check your connection.');
}
```

---

## **7. Rate Limiting & Quotas**

### **7.1 Rate Limits**

Rate limits are enforced per user and per IP address.

**Per-User Limits (Authenticated Requests):**

| Tier | Requests per Minute | Requests per Hour | Requests per Day |
|------|---------------------|-------------------|------------------|
| Free | 30 | 500 | 5,000 |
| Pro | 120 | 2,000 | 20,000 |
| Creator | 300 | 5,000 | 50,000 |

**Per-IP Limits (Unauthenticated Requests):**
- 60 requests per minute
- 1,000 requests per hour

**Specific Endpoint Limits:**
- `POST /auth/magic-link/request`: 3 per hour per email
- `POST /graphs`: 10 per hour (Free), 50 per hour (Pro/Creator)
- `POST /exports/pdf`: 5 per hour (Pro), 20 per hour (Creator)

### **7.2 Rate Limit Headers**

Every API response includes rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1672154400
X-RateLimit-Tier: pro
```

**When Rate Limit Exceeded:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1672154400

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 45 seconds.",
    "retryAfter": 45,
    "limit": 120,
    "resetAt": "2025-12-27T12:00:00Z"
  }
}
```

### **7.3 Upload & Storage Quotas**

| Tier | Graphs per Platform | Total Graphs | Max File Size | Storage Limit |
|------|---------------------|--------------|---------------|---------------|
| Free | 1 version | 1 platform | 50 MB | 100 MB |
| Pro | 5 versions | 5 platforms | 200 MB | 1 GB |
| Creator | Unlimited | 5 platforms | 500 MB | 5 GB |

---

## **8. Webhooks**

### **8.1 Stripe Webhooks**

VSG receives webhook events from Stripe for subscription management.

**Webhook Endpoint:**
```
POST /v1/webhooks/stripe
```

**Handled Events:**

| Event | Description | Action |
|-------|-------------|--------|
| `customer.subscription.created` | New subscription created | Update user tier, send welcome email |
| `customer.subscription.updated` | Subscription modified | Update tier, handle plan changes |
| `customer.subscription.deleted` | Subscription canceled | Downgrade to free tier |
| `invoice.paid` | Payment successful | Record payment, extend subscription |
| `invoice.payment_failed` | Payment failed | Send notification, retry logic |
| `checkout.session.completed` | Checkout completed | Create subscription, update user |

**Webhook Signature Verification:**

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({
      error: { code: 'WEBHOOK_SIGNATURE_INVALID', message: err.message }
    });
  }

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    // ... handle other events
  }

  res.status(200).json({ received: true });
}
```

---

## **9. API Versioning Strategy**

### **9.1 Versioning Approach**

**URL Path Versioning:**
```
https://api.visualsocialgraph.com/v1/graphs
https://api.visualsocialgraph.com/v2/graphs
```

**Version Lifecycle:**
```
v1 (Current):
├─ Status: Stable
├─ Released: Dec 2025
├─ Support: Active
└─ Deprecation: TBD (minimum 12 months notice)

v2 (Future):
├─ Status: Planning
├─ Release: TBD (when breaking changes necessary)
├─ Support: TBD
└─ Migration: Parallel support for 12 months
```

### **9.2 Breaking vs. Non-Breaking Changes**

**Non-Breaking Changes (No Version Bump):**
- Adding new endpoints
- Adding optional request parameters
- Adding fields to responses
- Adding new error codes
- Performance improvements

**Breaking Changes (Version Bump Required):**
- Removing endpoints
- Removing request parameters
- Removing response fields
- Changing field types or semantics
- Changing authentication method

### **9.3 Deprecation Policy**

**Timeline:**
```
t=0:    Announce deprecation (email, docs, API headers)
t+3mo:  Warning headers on deprecated endpoints
t+6mo:  Sunset announced
t+12mo: Deprecated version removed
```

**Deprecation Headers:**
```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 27 Dec 2026 00:00:00 GMT
Link: <https://docs.visualsocialgraph.com/migration/v1-to-v2>; rel="deprecation"
```

---

## **10. Security Considerations**

### **10.1 Transport Security**

- **HTTPS Only**: All API traffic over TLS 1.3
- **Certificate Pinning**: Recommended for mobile apps
- **HSTS**: Strict-Transport-Security header enforced

### **10.2 Authentication Security**

- **JWT Tokens**: Short-lived (15 min), signed with HS256
- **Refresh Tokens**: Long-lived (30 days), single-use, revocable
- **Token Storage**: HTTP-only cookies (recommended) or localStorage (client responsibility)

### **10.3 Data Security**

- **Pseudonymization**: All node identifiers hashed with user-specific key
- **Encryption at Rest**: PostgreSQL encryption, Cloudflare R2 encryption
- **Encryption in Transit**: TLS 1.3 for all data transfer
- **Input Sanitization**: All inputs validated and sanitized

### **10.4 Privacy Compliance**

**GDPR Compliance:**
- Data export: `GET /users/me/export`
- Data deletion: `DELETE /users/me` (cascade delete)
- Data processing transparency: Privacy policy, data usage docs

**No Social Account Access:**
- Architectural enforcement (Tier 1 constraint)
- No OAuth implementation for social platforms
- Manual upload only

---

## **11. Performance & Caching**

### **11.1 Response Time Targets**

| Endpoint Type | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| Simple GET (cached) | <50ms | <100ms | <200ms |
| Simple GET (uncached) | <200ms | <500ms | <1s |
| Graph retrieval | <300ms | <800ms | <2s |
| Metrics computation | <2s | <5s | <10s |
| Insight generation | <3s | <8s | <15s |
| PDF export | <10s | <20s | <30s |

### **11.2 Caching Strategy**

**Redis Caching:**
```typescript
// Cache keys
const cacheKeys = {
  user: (userId) => `user:${userId}`,
  graph: (graphId) => `graph:${graphId}`,
  metrics: (graphId) => `metrics:${graphId}`,
  insights: (graphId) => `insights:${graphId}`,
};

// TTLs
const cacheTTL = {
  user: 3600,        // 1 hour
  graph: 86400,      // 24 hours
  metrics: 86400,    // 24 hours
  insights: 86400,   // 24 hours
};
```

**HTTP Caching Headers:**
```http
# Cacheable responses
Cache-Control: public, max-age=3600, s-maxage=7200
ETag: "abc123xyz"

# Non-cacheable responses
Cache-Control: private, no-cache, no-store, must-revalidate
```

**CDN Caching:**
- Static assets (exports, social cards): 30 days
- API responses: Varies by endpoint (1 hour - 24 hours)

---

## **12. Testing & Validation**

### **12.1 API Testing Strategy**

**Unit Tests:**
- Request validation
- Response serialization
- Business logic (pure functions)
- Algorithm correctness

**Integration Tests:**
- API endpoint contracts
- Database interactions
- External service mocking (Stripe)

**End-to-End Tests:**
- Full user flows (signup → upload → insights → export)
- Authentication flows
- Payment flows

### **12.2 OpenAPI Specification**

Full OpenAPI 3.0 specification available at:
```
https://api.visualsocialgraph.com/v1/openapi.json
https://api.visualsocialgraph.com/v1/openapi.yaml
```

**Interactive Documentation:**
```
https://docs.visualsocialgraph.com/api
```

---

## **13. Migration & Evolution**

### **13.1 Future Enhancements (Phase 3+)**

**Real-Time Updates (Phase 3):**
```
POST /graphs/{graphId}/sync
WebSocket: wss://api.visualsocialgraph.com/v1/graphs/{graphId}/stream
```

**Collaborative Features (Phase 3):**
```
POST /graphs/{graphId}/share
GET /shared-graphs/{shareId}
```

**API Access for Developers (Phase 4):**
```
POST /api-keys
GET /api-keys
DELETE /api-keys/{keyId}
```

**Webhooks for Clients (Phase 4):**
```
POST /webhooks
GET /webhooks
DELETE /webhooks/{webhookId}
```

---

## **14. Appendices**

### **14.1 HTTP Status Code Reference**

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 OK | Success | GET, PUT, PATCH |
| 201 Created | Resource created | POST |
| 202 Accepted | Async processing started | POST (long-running) |
| 204 No Content | Success, no body | DELETE |
| 400 Bad Request | Invalid request | Validation errors |
| 401 Unauthorized | Authentication required | Missing/invalid token |
| 403 Forbidden | Insufficient permissions | Tier restrictions |
| 404 Not Found | Resource not found | Unknown IDs |
| 409 Conflict | Resource conflict | Duplicates |
| 422 Unprocessable Entity | Validation failed | Schema errors |
| 429 Too Many Requests | Rate limit exceeded | Too many requests |
| 500 Internal Server Error | Server error | Unhandled exceptions |
| 502 Bad Gateway | Upstream failure | External service error |
| 503 Service Unavailable | Temporary unavailable | Maintenance |

### **14.2 Date/Time Format**

All timestamps use **ISO 8601 format** in **UTC timezone**:

```
2025-12-27T12:00:00Z
```

### **14.3 Pagination Best Practices**

**Request:**
```
GET /v1/graphs?page=2&pageSize=50
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 342,
    "count": 50,
    "page": 2,
    "pageSize": 50,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": true,
    "links": {
      "first": "/v1/graphs?page=1&pageSize=50",
      "last": "/v1/graphs?page=7&pageSize=50",
      "next": "/v1/graphs?page=3&pageSize=50",
      "prev": "/v1/graphs?page=1&pageSize=50"
    }
  }
}
```

---

## **Document Status**

- **Version:** 1.0 (Initial Release)
- **Status:** Ready for Implementation
- **Confidence:** 95%
- **Next Review:** Post-Phase 0 implementation (February 2026)
- **Alignment:** ✅ Architecture Document, ✅ SRS, ✅ Data Intelligence Framework, ✅ UX Specification

---

**End of API Specification v1.0**

*"Every endpoint should sing. Every response should breathe. Every error should guide."*

*December 27, 2025*
