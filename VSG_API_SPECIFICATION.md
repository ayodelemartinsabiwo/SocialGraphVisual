# **Visual Social Graph: API Specification**
## **Version 1.0 - Phase 1 Foundation (Standard Mode + Opt-In Server Fallback)**

| Field | Value |
|---|---|
| **Product** | Visual Social Graph (VSG) |
| **Owner** | Product + Engineering |
| **Status** | Draft - Ready for Review |
| **Last Updated** | December 26, 2025 |
| **Source of Truth** | SRS v1.3 + Architecture v1.0 + Data & Intelligence Framework v1.1 + UX Interaction Spec v1.1 |

---

## **0. Scope & Modes**

### **0.1 Two Modes (User-Facing Contract)**

- **Standard Mode (Account-based)**
  - Uses the VSG backend to persist **pseudonymized graph snapshots** and (optionally) precomputed insights.
  - Default pipeline targets **minimal server data transfer**: only pseudonymized graph structure + metadata.

- **Offline / Local-Only Mode (No account)**
  - **No API usage**. No network requests.
  - All parsing, graph building, visualization, and local exports happen on-device.

### **0.2 Server-Side Fallback (Standard Mode, Opt-In)**

To protect low-end devices, Standard Mode can offer an **opt-in server-side processing fallback**.

- Triggered only when:
  - user explicitly opts in (“Process on server instead?”), or
  - client detects failure (memory guardrails).
- In fallback, the client uploads the **raw ZIP** to the server via **Tus**.
- The server deletes the raw upload after processing (short retention); the stored artifact remains the **pseudonymized graph**.

---

## **1. API Principles (Non-Negotiables)**

- **Privacy-first / data minimization**
  - Standard path sends **pseudonymized graph only**.
  - No social-platform OAuth scopes (Google OAuth is allowed only for VSG authentication).

- **Algorithm-first, deterministic intelligence**
  - Insight generation must be explainable and reproducible.
  - No external AI dependency required for core functionality.

- **Graceful degradation + partial success**
  - APIs support partial outcomes (e.g., some records skipped) and return warnings.

### **1.1 API Versioning Strategy**

**Approach:** URL-based versioning

- All API endpoints include a version prefix: `/api/v1/*`, `/api/v2/*`, etc.
- The current production version is **v1** (paths shown in this document use `/api` for brevity but implement as `/api/v1`).

**Version Lifecycle:**

- **Major versions** (v1 → v2): Introduce breaking changes (schema incompatibilities, removed fields, behavior changes).
- **Minor updates** (non-breaking): Handled within the same major version (additive fields, new optional parameters).
- **Deprecation policy**: When a new major version is released, the previous version remains supported for a **12-month transition period** with clear deprecation warnings in response headers and documentation.

**Breaking Change Examples:**
- Removing a required field from a request schema
- Changing error code enums
- Modifying authentication mechanisms

**Non-Breaking Change Examples:**
- Adding optional fields to responses
- Introducing new endpoints
- Adding new error codes (existing codes unchanged)

**Migration Strategy:**
- Deprecation notices provided via:
  - `X-API-Deprecated: true` response header
  - `X-API-Sunset: 2026-12-31T23:59:59Z` (ISO 8601 date when version will be removed)
  - Email notifications to affected users (Creator tier with API keys)
- Migration guides published 6 months before sunset date

---

## **2. Base URL, Auth, and Headers**

### **2.1 Base URL**

- Base: `https://{host}`
- API prefix: `/api`

### **2.2 Authentication**

- Session is represented by a **JWT** stored in an **httpOnly cookie**.
- Cookie requirements:
  - `httpOnly`, `Secure`, `SameSite=Lax`

### **2.3 Common Request Headers**

- `Content-Type: application/json` (for JSON bodies)
- `Accept: application/json`
- Optional idempotency for POST endpoints that create resources:
  - `Idempotency-Key: <uuid>`

---

## **3. Error Model (Taxonomy-Aligned)**

### **3.1 Standard Error Envelope**

```json
{
  "error": {
    "id": "01J...",
    "level": "TRANSIENT|RECOVERABLE|PARTIAL|CRITICAL|INTEGRITY",
    "code": "STRING_ENUM",
    "message": "Human readable summary",
    "details": { "any": "json" },
    "retryable": true,
    "suggestedAction": "Optional user-facing next step"
  }
}
```

### **3.2 Partial Success Envelope (When Applicable)**

Some endpoints may return `200` with warnings:

```json
{
  "data": { "...": "..." },
  "warnings": [
    {
      "code": "PARTIAL_IMPORT_SOME_RECORDS_SKIPPED",
      "message": "Some records were skipped due to missing fields",
      "count": 183
    }
  ]
}
```

---

## **4. Core Data Schemas (Conceptual)**

> These types are aligned to the Data & Intelligence Framework. Dates are **ISO 8601 UTC strings** in persisted JSON.

### **4.1 Platform**

```ts
type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';
```

### **4.2 Pseudonymized Graph Payload**

```ts
interface GraphCreateRequest {
  platform: Platform;
  parseVersion: string; // e.g. "twitter_v2.1"

  // Pseudonymized graph structure ONLY
  graph: {
    nodes: Array<{
      id: string;           // hashed ID
      type: 'self' | 'user';
      displayName: string;  // pseudonymized
      username: string;     // pseudonymized

      // Optional, if privacy model allows
      followerCount?: number;
      followingCount?: number;

      // Computed (optional)
      degree?: number;
      pageRank?: number;
      betweenness?: number;
      communityId?: number;

      addedAt?: string; // ISO 8601 UTC
      lastInteraction?: string; // ISO 8601 UTC
    }>;

    edges: Array<{
      source: string;
      target: string;
      type: 'follows' | 'followed_by' | 'mutual' | 'engages_with';
      weight: number; // 0..1
      interactions?: {
        likes?: number;
        comments?: number;
        shares?: number;
        messages?: number;
      };
      createdAt?: string; // ISO 8601 UTC
    }>;

    metadata: {
      statistics: {
        nodeCount: number;
        edgeCount: number;
        density?: number;
        averageDegree?: number;
      };
      timePeriod?: { start?: string; end?: string };
      parsingErrors?: Array<{ code: string; message: string }>;
    };
  };
}

interface GraphCreateResponse {
  id: string; // graph_id
  uploadId?: string; // present if created from server-side fallback pipeline
  platform: Platform;
  nodeCount: number;
  edgeCount: number;
  isLatest: boolean;
  createdAt: string;
  warnings?: Array<{ code: string; message: string; count?: number }>;
}
```

**Pseudonymization Algorithm Specification:**

To ensure privacy-first data storage, all personally identifiable information (PII) in the graph payload is pseudonymized using the following approach:

**Hashing Algorithm:**
- **Method**: SHA-256 (Secure Hash Algorithm 256-bit)
- **Salting**: Per-user salt generated at account creation and stored securely in database
- **Format**: `pseudonymId = SHA256(userId + userSalt + originalValue)`

**Pseudonymization Rules:**
1. **Node IDs**: Original platform user IDs (e.g., Twitter user ID `123456789`) hashed to produce deterministic pseudonym IDs (e.g., `node_a3f2b8c...`).
2. **Display Names**: Original display names (e.g., "Jane Doe") hashed to produce pseudonyms (e.g., "User_7a8b3c").
3. **Usernames**: Original usernames (e.g., "@janedoe") hashed similarly (e.g., "username_9d2e4f").

**Stability Across Uploads:**
- The same salt is reused for the same user across multiple graph uploads.
- This ensures that the same original user ID consistently maps to the same pseudonym ID, preserving graph structure across snapshots.
- Example: If "User A" appears in both January and March uploads, they receive the same pseudonym ID in both graphs.

**Salt Management:**
- Salt stored in `users.pseudonym_salt` column (256-bit random value, Base64-encoded).
- Salt generated once at user registration using cryptographically secure random number generator (CSPRNG).
- Salt never exposed via API; used only server-side during graph processing.

**Why SHA-256:**
- One-way hash: Cannot reverse-engineer original values from pseudonyms.
- Deterministic: Same input always produces same output (enables consistent pseudonym mapping).
- Collision-resistant: Extremely low probability of different users producing identical pseudonyms.

**Client-Side Pseudonymization (Standard Mode):**
- In Standard Mode, the client performs pseudonymization before sending graph data to server.
- Client receives the user's salt via authenticated `/api/auth/session` endpoint after login.
- Client applies SHA-256 hashing locally to all PII fields before constructing `GraphCreateRequest`.

**Server-Side Pseudonymization (Fallback Mode):**
- In Server Fallback Mode, raw ZIP uploaded to server contains original PII.
- Server applies pseudonymization during graph processing using the user's stored salt.
- Raw ZIP deleted immediately after processing (see Section 6).

### **4.3 Insight Payload**

```ts
type Confidence = 'high' | 'medium' | 'low';

interface Insight {
  id: string;
  graphId: string;
  templateId: string;
  category:
    | 'bridge_accounts'
    | 'echo_chamber'
    | 'engagement'
    | 'community'
    | 'growth'
    | 'influencers'
    | 'diversity'
    | 'anomalies';

  narrative: string;
  actions: Array<{ text: string; priority: 'high' | 'medium' | 'low'; estimatedImpact?: string; url?: string }>;

  confidence: Confidence;
  priority: number;
  explanation: {
    triggeredConditions: string[];
    metrics: Array<{ key: string; value: number | null }>;
    templateVersion: number;
  };

  createdAt: string;
}
```

---

## **5. Endpoints**

### **5.1 Auth**

#### **POST /api/auth/magic-link**
Send a magic-link login email.

Request:
```json
{ "email": "user@example.com" }
```

Responses:
- `200` `{ "ok": true }`
- `429` rate limited (TRANSIENT)

#### **GET /api/auth/verify/{token}**
Verify a magic link token and create a session cookie.

Responses:
- `302` redirect to dashboard on success
- `400` invalid/expired token (INTEGRITY)

#### **GET /api/auth/google/callback**
OAuth callback; establishes session cookie.

Responses:
- `302` redirect to dashboard on success

#### **POST /api/auth/logout**
Invalidate session.

Responses:
- `200` `{ "ok": true }`

#### **GET /api/auth/session**
Return current session state.

Responses:
- `200` `{ "authenticated": true, "user": { "id": "...", "email": "...", "tier": "free|pro|creator" } }`
- `200` `{ "authenticated": false }`

---

### **5.2 Graphs (Standard Mode)**

#### **POST /api/graphs**
Create a graph snapshot from a client-built pseudonymized graph.

Request: `GraphCreateRequest`

Responses:
- `201` `GraphCreateResponse`
- `400` invalid schema (RECOVERABLE)
- `413` graph too large (>10MB serialized for Free/Pro, >50MB for Creator) (RECOVERABLE)
- `403` tier limit exceeded (TRANSIENT) - see Appendix B for per-tier quotas

**Feature Gating by Tier:**
- **Free tier:** Max 5 graphs/day, 10 MB graph size limit, 5 total graphs stored
- **Pro tier:** Max 100 graphs/day, 10 MB graph size limit, 100 total graphs stored
- **Creator tier:** Max 500 graphs/day, 50 MB graph size limit, 500 total graphs stored

**Example Response (Free tier limit exceeded):**
```json
{
  "error": {
    "id": "err_01J...",
    "level": "TRANSIENT",
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "Daily graph creation limit exceeded for Free tier (5/day).",
    "details": { "tier": "free", "limit": 5, "used": 5, "resetAt": "2025-12-27T00:00:00Z" },
    "retryable": true,
    "suggestedAction": "Upgrade to Pro tier for 100 graphs/day or wait until quota resets."
  }
}
```

#### **GET /api/graphs**
List graphs for the authenticated user.

Query params:
- `platform` (optional)
- `limit` (default 20)
- `cursor` (optional)

Response `200`:
```json
{
  "data": [
    { "id": "...", "platform": "twitter", "nodeCount": 1234, "edgeCount": 2345, "isLatest": true, "createdAt": "..." }
  ],
  "nextCursor": "..."
}
```

#### **GET /api/graphs/{id}**
Fetch a single graph (pseudonymized payload).

Response `200`:
```json
{ "id": "...", "platform": "twitter", "graph": { "nodes": [], "edges": [], "metadata": {} }, "createdAt": "..." }
```

#### **DELETE /api/graphs/{id}**
Soft delete a graph (recoverable for retention window, per policy).

Response `200`:
```json
{ "ok": true }
```

---

### **5.3 Uploads (Opt-In Server-Side Fallback via Tus)**

> Used only for server-side fallback processing. Default Standard flow does **not** upload raw ZIP.

#### **Tus endpoint: /api/uploads**

- Protocol: Tus (resumable upload)
- Client: `tus-js-client`
- Server: `tus-node-server`

Lifecycle:
1. Client creates Tus upload.
2. Client uploads ZIP in chunks.
3. Server processes ZIP (parse → build graph → store graph).
4. Raw ZIP is deleted after processing (short retention).

Recommended companion endpoints:

#### **GET /api/uploads/{id}**
Return upload status.

Response `200`:
```json
{
  "id": "...",
  "platform": "twitter",
  "status": "queued|processing|complete|failed",
  "stage": "upload|parse|build_graph|persist_graph|generate_insights",
  "progress": { "percent": 42, "message": "Parsing archive" },
  "graphId": "...",
  "errorMessage": null
}
```

#### **GET /api/uploads/{id}/events**
Real-time progress stream for server-side fallback processing.

Implementation options:
- **WebSocket** (preferred for richer progress updates)
- **SSE** (acceptable fallback)

Event payload (conceptual):
```json
{
  "type": "progress",
  "uploadId": "...",
  "status": "processing",
  "stage": "build_graph",
  "progress": { "percent": 67, "message": "Building pseudonymized graph" }
}
```

---

### **5.4 Insights (Algorithm-First)**

#### **POST /api/insights**
Generate or retrieve cached insights for a graph.

Request:
```json
{ "graphId": "...", "types": ["community", "bridge_accounts", "engagement"] }
```

Response `200`:
```json
{ "data": { "graphId": "...", "insights": [] }, "warnings": [] }
```

Responses:
- `200` Success with insights array
- `403` tier limit exceeded or unsupported insight types (RECOVERABLE)
- `429` rate limited (TRANSIENT)

**Feature Gating by Tier:**
- **Free tier:** 10 requests/day, 3 basic insight types only (`community`, `engagement`, `influencers`)
- **Pro tier:** Unlimited requests, 8 advanced insight types (all except proprietary Creator-only types)
- **Creator tier:** Unlimited requests, all 8+ insight types including advanced analytics

**Insight Types by Tier:**

| Insight Type | Free | Pro | Creator |
|--------------|------|-----|---------|
| `community` | ✅ | ✅ | ✅ |
| `engagement` | ✅ | ✅ | ✅ |
| `influencers` | ✅ | ✅ | ✅ |
| `bridge_accounts` | ❌ | ✅ | ✅ |
| `echo_chamber` | ❌ | ✅ | ✅ |
| `growth` | ❌ | ✅ | ✅ |
| `diversity` | ❌ | ✅ | ✅ |
| `anomalies` | ❌ | ✅ | ✅ |

**Example Response (Free tier requesting unsupported insight type):**
```json
{
  "error": {
    "id": "err_01J...",
    "level": "RECOVERABLE",
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "Insight type 'bridge_accounts' not available in Free tier.",
    "details": {
      "tier": "free",
      "requestedTypes": ["community", "bridge_accounts"],
      "allowedTypes": ["community", "engagement", "influencers"],
      "blockedTypes": ["bridge_accounts"]
    },
    "retryable": false,
    "suggestedAction": "Upgrade to Pro tier for access to all 8 insight types."
  }
}
```

Notes:
- Deterministic outputs allow caching (e.g., Redis TTL).
- May return partial results (PARTIAL) if some insight types time out.

---

### **5.5 Exports**

#### **POST /api/exports/pdf**
Generate a PDF report for a graph.

Request:
```json
{ "graphId": "..." }
```

Response `201`:
```json
{ "exportId": "...", "format": "pdf", "downloadUrl": "https://...signed...", "expiresAt": "..." }
```

Responses:
- `201` Export created successfully
- `403` tier limit exceeded (TRANSIENT)
- `429` rate limited (TRANSIENT)

**Feature Gating by Tier:**
- **Free tier:** 1 PDF export/day
- **Pro tier:** 50 PDF exports/day
- **Creator tier:** 200 PDF exports/day

**Example Response (Free tier limit exceeded):**
```json
{
  "error": {
    "id": "err_01J...",
    "level": "TRANSIENT",
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "Daily PDF export limit exceeded for Free tier (1/day).",
    "details": { "tier": "free", "limit": 1, "used": 1, "resetAt": "2025-12-27T00:00:00Z" },
    "retryable": true,
    "suggestedAction": "Upgrade to Pro tier for 50 exports/day or wait until quota resets."
  }
}
```

#### **POST /api/exports/social-card**
Server-side social card generation for sharing on social media (Phase 2+). If client-side generation is used, this endpoint can be omitted.

Request:
```json
{ "graphId": "...", "template": "my-social-dna" }
```

Responses:
- `201` Social card created successfully
- `403` feature not available in Free tier (RECOVERABLE)
- `429` rate limited (TRANSIENT)

**Feature Gating by Tier:**
- **Free tier:** ❌ Not available
- **Pro tier:** ✅ Available (50/day limit)
- **Creator tier:** ✅ Available (200/day limit)

**Example Response (Free tier attempting social card export):**
```json
{
  "error": {
    "id": "err_01J...",
    "level": "RECOVERABLE",
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "Social card exports not available in Free tier.",
    "details": { "tier": "free", "feature": "social_card_export" },
    "retryable": false,
    "suggestedAction": "Upgrade to Pro tier to unlock social card exports."
  }
}
```

---

### **5.6 Account & Data Management**

#### **GET /api/account/data-export**
Portability export for user-owned data (pseudonymized by default).

Response `200`:
```json
{ "user": { "id": "..." }, "graphs": [], "insights": [] }
```

#### **DELETE /api/account**
Delete user account (soft delete + grace period per policy; cascades graphs/insights).

Response `200`:
```json
{ "ok": true }
```

---

### **5.7 Webhooks (Stripe Integration)**

#### **POST /api/webhooks/stripe**
Receive and process Stripe webhook events for subscription management.

**Authentication:**
- Webhook signature verification using `Stripe-Signature` header.
- HMAC-SHA256 signature computed with `STRIPE_WEBHOOK_SECRET`.
- Reject requests with invalid or missing signatures (401).

**Event Types:**
- `customer.subscription.created`: New subscription activated.
- `customer.subscription.updated`: Subscription tier changed or renewed.
- `customer.subscription.deleted`: Subscription canceled or expired.
- `invoice.payment_succeeded`: Payment processed successfully.
- `invoice.payment_failed`: Payment failed (trigger retry logic or downgrade).

**Request Format (from Stripe):**
```json
{
  "id": "evt_...",
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_...",
      "customer": "cus_...",
      "status": "active",
      "items": {
        "data": [
          {
            "price": {
              "id": "price_pro_monthly",
              "product": "prod_pro"
            }
          }
        ]
      }
    }
  }
}
```

**Response:**
- `200` `{ "received": true }` (acknowledge receipt)
- `401` Invalid signature (INTEGRITY)
- `400` Unrecognized event type (RECOVERABLE, logged for investigation)

**Processing Logic:**
1. Verify webhook signature.
2. Check event idempotency (track `event.id` in database for 24 hours to prevent duplicate processing).
3. Update user's subscription tier in database:
   - Map Stripe `price.id` to VSG tier (`free`, `pro`, `creator`).
   - Update `users.tier` and `users.subscription_status`.
4. Emit internal event for feature gating updates (invalidate cache).
5. Log event to audit log.

**Idempotency:**
- Store processed event IDs in `webhook_events` table with 24-hour TTL.
- If `event.id` already exists, return `200` without reprocessing.

**Retry Policy (Stripe-side):**
- Stripe retries failed webhooks with exponential backoff for up to 3 days.
- VSG must respond with `200` within 5 seconds to avoid retry.

**Error Handling:**
- Transient errors (database timeout): Return `500` to trigger Stripe retry.
- Permanent errors (invalid customer ID): Return `200` after logging error (prevents infinite retries).

**Security:**
- Webhook endpoint accepts requests only from Stripe IP ranges (optional additional layer).
- Signature verification is mandatory (primary security control).

---

## **6. Retention & Deletion Semantics (API-Visible)**

### **6.1 Graph Deletion**

`DELETE /api/graphs/{id}` supports two deletion modes to balance user convenience with GDPR compliance:

**Soft Delete (Default):**
- Graph removed from active views immediately (no longer appears in `GET /api/graphs` results).
- Record marked with `deleted_at` timestamp and retained for **30-day grace period**.
- User can restore graph within 30 days via support request or future `/api/graphs/{id}/restore` endpoint (Phase 2+).
- After 30 days, soft-deleted graphs are **permanently hard-deleted**.

**Hard Delete (Immediate, GDPR-compliant):**
- Optional query parameter: `DELETE /api/graphs/{id}?permanent=true`
- Graph and all associated data (insights, exports) **immediately and irreversibly deleted** from active systems.
- No grace period; cannot be restored.
- Backups purged within 90 days (compliance requirement; see 6.5).

**Request Example (Hard Delete):**
```http
DELETE /api/graphs/{id}?permanent=true
```

**Response:**
```json
{
  "ok": true,
  "deletionType": "hard",
  "message": "Graph permanently deleted. This action cannot be undone."
}
```

### **6.2 Server Fallback Raw Uploads (Tus ZIP)**

- Raw archives exist **only in the server fallback path** (when user opts in for server-side processing).
- Deleted **immediately after successful graph processing** (target retention: minutes to hours).
- If processing fails, raw ZIP retained for **7 days** to allow retry, then auto-deleted.
- Users can manually delete failed uploads via `DELETE /api/uploads/{id}`.

### **6.3 Exports (PDF, Social Cards)**

- Signed `downloadUrl` expires after **7 days**.
- Export files auto-delete from storage **7 days after creation** (regardless of download status).
- No user action required; automatic cleanup.

### **6.4 Account Deletion**

`DELETE /api/account` supports two modes:

**Soft Delete (Default, 30-day grace period):**
- Account marked as deleted; user cannot log in.
- All graphs, insights, and subscription data retained for **30 days**.
- User can contact support within 30 days to restore account.
- After 30 days, account and all associated data **permanently deleted**.

**Hard Delete (Immediate, GDPR right-to-erasure):**
- Optional query parameter: `DELETE /api/account?permanent=true`
- Account and all associated data (graphs, insights, uploads, exports, subscription metadata) **immediately deleted** from active systems.
- Cascades to all related resources (no orphaned data).
- Backups purged within 90 days (see 6.5).

**Request Example (Hard Delete):**
```http
DELETE /api/account?permanent=true
```

**Response:**
```json
{
  "ok": true,
  "deletionType": "hard",
  "message": "Account and all associated data permanently deleted. This action cannot be undone."
}
```

### **6.5 Backup Retention**

- **Database backups:** Retained for **90 days** for disaster recovery.
- Deleted data in backups is **not accessible** to users or application (logical deletion enforced).
- After 90 days, deleted data is **purged from all backups** (hard-delete completion).
- Backup purge policy disclosed in Privacy Policy and Terms of Service.

### **6.6 GDPR Compliance**

- **Right to erasure (Article 17):** Hard-delete option (`?permanent=true`) ensures immediate deletion from active systems, with backup purge within 90 days.
- **Data minimization (Article 5):** Raw uploads deleted immediately after processing; pseudonymized graphs stored with minimal PII.
- **Data portability (Article 20):** `GET /api/account/data-export` provides JSON export of all user data before deletion.

**Deletion Timeline Summary:**

| Action | Soft Delete (Default) | Hard Delete (GDPR) |
|--------|----------------------|-------------------|
| **Graph deletion** | 30-day grace period → hard-delete | Immediate |
| **Account deletion** | 30-day grace period → hard-delete | Immediate |
| **Backup purge** | 90 days after hard-delete | 90 days after deletion |
| **Raw uploads** | N/A (auto-deleted after processing) | N/A |
| **Exports** | 7 days (auto-delete) | 7 days (auto-delete) |

---

## **7. OpenAPI (Implementation Target)**

This document is the narrative contract. The implementation should produce an OpenAPI 3.1 schema that includes:

- Paths:
  - `/api/auth/magic-link`, `/api/auth/verify/{token}`, `/api/auth/google/callback`, `/api/auth/logout`, `/api/auth/session`
  - `/api/graphs`, `/api/graphs/{id}`
  - `/api/uploads` (Tus), `/api/uploads/{id}`
  - `/api/insights`
  - `/api/exports/pdf`, `/api/exports/social-card`
  - `/api/account`, `/api/account/data-export`

- Components:
  - `ErrorEnvelope`, `Warning`, `GraphCreateRequest`, `GraphCreateResponse`, `Insight`, `ExportResponse`

---

## **8. Security Architecture**

### **8.1 Transport Security**

**Requirements:**
- **HTTPS only**: All API endpoints MUST be served over HTTPS. HTTP requests automatically redirect to HTTPS (301).
- **TLS version**: Minimum TLS 1.3 (TLS 1.2 acceptable for legacy client support during transition).
- **HSTS**: Strict-Transport-Security header enforced with `max-age=31536000; includeSubDomains; preload`.
- **Certificate**: Valid SSL/TLS certificate from a trusted Certificate Authority (Let's Encrypt, DigiCert, etc.).

### **8.2 Authentication Security**

**JWT Specification:**
- **Algorithm**: HS256 (HMAC-SHA256) for session tokens.
- **Storage**: httpOnly, Secure, SameSite=Lax cookies (prevents XSS and CSRF).
- **Token payload** (example):
  ```json
  {
    "sub": "user_01J...",
    "email": "user@example.com",
    "tier": "pro",
    "iat": 1735008000,
    "exp": 1735094400
  }
  ```
- **Expiry**: 24-hour session lifetime (refresh via `/api/auth/refresh` endpoint or re-authentication).
- **Secret management**: JWT signing secret stored as environment variable, rotated every 90 days.

**Magic Link Security:**
- One-time use tokens (invalidated after verification).
- 15-minute expiration window.
- Rate limiting: 5 requests per email per hour.

**Google OAuth:**
- Only for VSG authentication (NOT for platform data access).
- State parameter validated to prevent CSRF.
- ID token verified using Google's public keys.

### **8.3 Input Validation**

**String Length Limits:**
- Email: 255 characters
- Display names: 100 characters
- Usernames: 50 characters
- Insight narratives: 1000 characters
- Error messages: 500 characters

**File Size Limits:**
- Graph JSON payload: 10 MB (serialized)
- Server-side fallback ZIP upload: 500 MB (via Tus)
- PDF exports: 20 MB

**Validation Rules:**
- Email format: RFC 5322 compliant
- Platform enum: Must match allowed values (`twitter`, `instagram`, `linkedin`, `facebook`, `tiktok`)
- Graph IDs: UUIDv7 format (sortable, time-ordered)
- Date strings: ISO 8601 UTC format (`YYYY-MM-DDTHH:mm:ssZ`)

**Sanitization:**
- All user-provided strings HTML-escaped before rendering (prevent XSS).
- SQL injection prevention: Parameterized queries only (ORM: Prisma recommended).
- Command injection prevention: No shell execution of user input.

### **8.4 Data Encryption**

**At Rest:**
- Database: AES-256-GCM encryption for sensitive columns (email, hashed IDs).
- Backups: Encrypted using cloud provider's managed keys (AWS KMS, GCP Cloud KMS).
- File storage: S3/GCS buckets with server-side encryption enabled (SSE-S3 or SSE-KMS).

**In Transit:**
- TLS 1.3 for all API communication (see 8.1).
- Database connections: TLS-encrypted (SSL mode: require).

**Key Management:**
- Application secrets: Environment variables (never hardcoded).
- Encryption keys: Managed by cloud provider KMS (automatic rotation).
- JWT secrets: Rotated every 90 days (graceful transition: dual-key validation for 24 hours).

### **8.5 CORS Policy**

**Allowed Origins:**
- Production: `https://visualsocialgraph.com`, `https://www.visualsocialgraph.com`
- Staging: `https://staging.visualsocialgraph.com`
- Development: `http://localhost:3000`, `http://localhost:5173` (Vite default)

**CORS Headers:**
```http
Access-Control-Allow-Origin: https://visualsocialgraph.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Idempotency-Key
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**Preflight Handling:**
- `OPTIONS` requests return `204 No Content` with CORS headers.
- No authentication required for `OPTIONS` requests.

### **8.6 Audit Logging**

**Events Logged:**
- Authentication events: login, logout, failed login attempts, magic link generation, OAuth callbacks.
- Graph operations: creation (`POST /api/graphs`), deletion (`DELETE /api/graphs/{id}`), retrieval (`GET /api/graphs/{id}`).
- Account operations: data export, account deletion.
- Error events: CRITICAL and INTEGRITY level errors (see Appendix A).
- Rate limit violations.

**Log Format:**
```json
{
  "timestamp": "2025-12-26T14:32:10.123Z",
  "event": "graph.created",
  "userId": "user_01J...",
  "graphId": "graph_01J...",
  "platform": "twitter",
  "nodeCount": 1234,
  "ip": "203.0.113.42",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req_01J..."
}
```

**Retention:**
- Audit logs retained for **90 days** in active storage.
- Archived to cold storage for 1 year (compliance requirement).
- No personally identifiable information (PII) in logs beyond pseudonymized user IDs.

**Access Control:**
- Audit logs accessible only to authorized engineering/security personnel.
- Read-only access via internal admin dashboard (not exposed via public API).

### **8.7 Secrets Management**

**Environment Variables:**
- `JWT_SECRET`: HS256 signing key (256-bit random string).
- `DATABASE_URL`: PostgreSQL connection string (includes credentials).
- `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (for S3/KMS).

**Storage:**
- Development: `.env` file (never committed to version control; `.gitignore` enforced).
- Production: Cloud provider secret manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault).

**Rotation Policy:**
- JWT secrets: Every 90 days (automated via cron job).
- Database passwords: Every 180 days (manual rotation with zero-downtime migration).
- OAuth secrets: On-demand if compromised (Google provides rotation mechanism).
- Stripe keys: Annual rotation (Stripe supports rolling keys).

**Access Control:**
- Secrets accessible only to production environment (not staging/dev).
- Principle of least privilege: Each service accesses only required secrets.

---

## **9. Out of Scope (For This Spec)**

- Social platform API integrations (OAuth to platforms)
- Team/organization features
- Public API access (Creator tier) beyond the internal webapp API

---

## **Appendix A: Error Code Taxonomy**

This appendix provides a complete enumeration of error codes used in the API, organized by severity level (as defined in Section 3.1).

### **A.1 TRANSIENT (Temporary failures, retry expected to succeed)**

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `NETWORK_TIMEOUT` | 504 | Request to external service (Stripe, S3) timed out | Retry after a few seconds |
| `RATE_LIMITED` | 429 | Too many requests from this user/IP | Wait for rate limit window to reset (see `X-RateLimit-Reset` header) |
| `SERVICE_UNAVAILABLE` | 503 | Backend service temporarily unavailable (maintenance, overload) | Retry after delay indicated in `Retry-After` header |
| `DATABASE_TIMEOUT` | 504 | Database query exceeded timeout threshold | Retry request |

### **A.2 RECOVERABLE (User can fix with corrected input)**

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INVALID_SCHEMA` | 400 | Request body does not match required schema | Review API documentation and correct request format |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing from request | Add missing field (e.g., `platform`, `graphId`) |
| `INVALID_ENUM_VALUE` | 400 | Field contains invalid enum value | Use allowed value (e.g., `platform` must be `twitter`, `instagram`, etc.) |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds size limit | Reduce file size or contact support for limit increase |
| `GRAPH_TOO_LARGE` | 413 | Graph JSON payload exceeds 10 MB limit | Simplify graph or use server-side fallback mode |
| `INVALID_DATE_FORMAT` | 400 | Date string not in ISO 8601 format | Use format `YYYY-MM-DDTHH:mm:ssZ` |
| `TIER_LIMIT_EXCEEDED` | 403 | Action exceeds user's subscription tier quota | Upgrade subscription or wait for quota reset |
| `UNSUPPORTED_PLATFORM` | 400 | Platform not supported in this version | Check supported platforms in documentation |

### **A.3 PARTIAL (Operation partially succeeded)**

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `PARTIAL_IMPORT_SOME_RECORDS_SKIPPED` | 200 | Graph created but some nodes/edges skipped due to validation errors | Review `warnings` array in response; skipped records listed in details |
| `PARTIAL_INSIGHT_GENERATION_TIMEOUT` | 200 | Some insight types completed, others timed out | Accept partial results or retry specific insight types |
| `PARTIAL_EXPORT_MISSING_DATA` | 200 | Export generated but some data unavailable | Review warnings; re-upload missing data if needed |

### **A.4 CRITICAL (Severe errors requiring investigation)**

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Unexpected server error | Contact support with `error.id` from response |
| `AUTHENTICATION_FAILED` | 401 | Invalid or expired session token | Re-authenticate via magic link or Google OAuth |
| `PERMISSION_DENIED` | 403 | User lacks permission to access resource | Ensure you own the resource or have required subscription tier |
| `RESOURCE_NOT_FOUND` | 404 | Requested graph, upload, or export does not exist | Verify resource ID is correct |
| `RESOURCE_DELETED` | 410 | Resource was permanently deleted | Cannot recover; create new resource |
| `PROCESSING_FAILED` | 500 | Server-side graph processing encountered fatal error | Check upload file integrity; retry upload |

### **A.5 INTEGRITY (Data consistency or security violations)**

| Code | HTTP Status | Description | User Action |
|------|-------------|-------------|-------------|
| `INVALID_TOKEN` | 401 | Magic link token invalid, expired, or already used | Request new magic link |
| `WEBHOOK_SIGNATURE_INVALID` | 401 | Stripe webhook signature verification failed | Internal error; contact support if recurring |
| `DATA_CORRUPTION` | 500 | Stored data failed integrity check | Contact support immediately with `error.id` |
| `DUPLICATE_IDEMPOTENCY_KEY` | 409 | Idempotency key already used for different request | Use unique `Idempotency-Key` for each distinct request |
| `CONFLICT` | 409 | Resource state conflict (e.g., deleting already-deleted graph) | Refresh resource state and retry |

### **A.6 Usage Examples**

**Example 1: TRANSIENT error (rate limited)**
```json
{
  "error": {
    "id": "err_01JBCD...",
    "level": "TRANSIENT",
    "code": "RATE_LIMITED",
    "message": "Too many graph creation requests. Please wait before retrying.",
    "details": {
      "limit": 5,
      "windowSeconds": 86400,
      "retryAfter": 43200
    },
    "retryable": true,
    "suggestedAction": "Wait 12 hours or upgrade to Pro tier for higher limits."
  }
}
```
**Response Headers:**
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735094400
Retry-After: 43200
```

**Example 2: RECOVERABLE error (invalid schema)**
```json
{
  "error": {
    "id": "err_01JBCE...",
    "level": "RECOVERABLE",
    "code": "INVALID_SCHEMA",
    "message": "Request body validation failed.",
    "details": {
      "field": "graph.nodes[0].id",
      "issue": "Field is required but was missing."
    },
    "retryable": false,
    "suggestedAction": "Ensure all nodes have an 'id' field."
  }
}
```

**Example 3: PARTIAL success (with warnings)**
```json
{
  "data": {
    "id": "graph_01JBCF...",
    "platform": "twitter",
    "nodeCount": 1200,
    "edgeCount": 3400
  },
  "warnings": [
    {
      "code": "PARTIAL_IMPORT_SOME_RECORDS_SKIPPED",
      "message": "45 nodes skipped due to missing required fields.",
      "count": 45
    }
  ]
}
```

---

## **Appendix B: Rate Limits & Quotas**

This appendix defines per-tier rate limits and quotas to prevent abuse and ensure fair resource allocation.

### **B.1 Rate Limit Headers**

All API responses include rate limit information in response headers:

```http
X-RateLimit-Limit: 100          # Total requests allowed in window
X-RateLimit-Remaining: 73       # Requests remaining in current window
X-RateLimit-Reset: 1735094400   # Unix timestamp when limit resets
```

When rate limit is exceeded, the API returns `429 Too Many Requests` with `Retry-After` header (seconds until reset).

### **B.2 Per-Tier Quotas**

| Endpoint | Free Tier | Pro Tier | Creator Tier | Window |
|----------|-----------|----------|--------------|--------|
| **POST /api/graphs** | 5 graphs/day | 100 graphs/day | 500 graphs/day | 24 hours |
| **POST /api/insights** | 10 requests/day | Unlimited | Unlimited | 24 hours |
| **POST /api/exports/pdf** | 1 export/day | 50 exports/day | 200 exports/day | 24 hours |
| **POST /api/auth/magic-link** | 5 requests/hour | 5 requests/hour | 5 requests/hour | 1 hour |
| **GET /api/graphs** | 100 requests/hour | 500 requests/hour | 1000 requests/hour | 1 hour |
| **GET /api/graphs/{id}** | 100 requests/hour | 500 requests/hour | 1000 requests/hour | 1 hour |
| **POST /api/uploads** (Tus) | 5 uploads/day | 100 uploads/day | 500 uploads/day | 24 hours |

### **B.3 Storage Limits**

| Resource | Free Tier | Pro Tier | Creator Tier |
|----------|-----------|----------|--------------|
| **Total graphs stored** | 5 graphs | 100 graphs | 500 graphs |
| **Graph retention** | 30 days | 1 year | Unlimited |
| **Max graph size** | 10 MB | 10 MB | 50 MB |
| **Total storage** | 50 MB | 1 GB | 25 GB |

### **B.4 Feature Access by Tier**

| Feature | Free | Pro | Creator |
|---------|------|-----|---------|
| **Client-side processing (Standard Mode)** | ✅ | ✅ | ✅ |
| **Server-side fallback processing** | ✅ (5 graphs/day) | ✅ (100 graphs/day) | ✅ (500 graphs/day) |
| **Algorithm-based insights** | ✅ Basic (3 types) | ✅ Advanced (8 types) | ✅ All (8+ types) |
| **PDF exports** | ✅ (1/day) | ✅ (50/day) | ✅ (200/day) |
| **Social card exports** | ❌ | ✅ | ✅ |
| **API access** | ❌ | ❌ | ✅ (with API key) |
| **Historical graph comparisons** | ❌ | ✅ (up to 3 snapshots) | ✅ (unlimited) |
| **Priority processing** | ❌ | ❌ | ✅ (dedicated queue) |

### **B.5 Rate Limiting Implementation**

**Algorithm:** Token bucket (allows burst traffic within limits)

**Enforcement:**
- Rate limits enforced at application layer (middleware).
- Unique identifier: User ID (authenticated) or IP address (unauthenticated).
- Storage: Redis with sliding window counters.

**Grace Period:**
- Tier downgrades (Pro → Free): User retains Pro limits for 7 days after subscription expires.
- Exceeding storage limits: Soft enforcement with warning email; hard enforcement after 30 days (oldest graphs archived).

**Exemptions:**
- Webhook endpoints (`/api/webhooks/stripe`) not rate-limited (Stripe controls retry logic).
- Health check endpoints (`/health`, `/status`) not rate-limited.

### **B.6 Quota Exceeded Response Example**

**Request:**
```http
POST /api/graphs
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

**Response (429):**
```json
{
  "error": {
    "id": "err_01JBCG...",
    "level": "TRANSIENT",
    "code": "TIER_LIMIT_EXCEEDED",
    "message": "Daily graph creation limit exceeded for Free tier (5/day).",
    "details": {
      "tier": "free",
      "limit": 5,
      "used": 5,
      "resetAt": "2025-12-27T00:00:00Z"
    },
    "retryable": true,
    "suggestedAction": "Upgrade to Pro tier for 100 graphs/day or wait until quota resets."
  }
}
```

**Response Headers:**
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735257600
Retry-After: 43200
Content-Type: application/json
```

### **B.7 Monitoring & Alerts**

**User Notifications:**
- Email warning when user reaches 80% of quota.
- Dashboard banner when user reaches 90% of quota.
- Suggested upgrade CTA when quota exceeded.

**Internal Monitoring:**
- Track rate limit violations per user/tier (identify abuse).
- Alert engineering team if global rate limit violations spike (potential attack).

---

## **Appendix C: Performance Targets & Caching Strategy**

This appendix defines performance SLAs (Service Level Agreements) and caching strategies to meet user experience requirements from the SRS and UX Specification.

### **C.1 Endpoint Performance Targets (p95 Latency)**

| Endpoint | Target Latency | Notes |
|----------|----------------|-------|
| **GET /api/graphs** | <200ms | List view, pagination enabled |
| **GET /api/graphs/{id}** | <200ms | Single graph retrieval (cached after first fetch) |
| **POST /api/graphs** | <1000ms | Includes validation + persistence (excludes metrics computation) |
| **POST /api/insights** | <500ms | Per SRS requirement; uses caching for repeat requests |
| **GET /api/insights/{id}** | <200ms | Cached insights retrieval |
| **POST /api/exports/pdf** | <3000ms | Large file generation; async job option for >3s |
| **POST /api/auth/magic-link** | <300ms | Email send via async queue (actual send happens out-of-band) |
| **GET /api/auth/verify/{token}** | <200ms | Token lookup + session creation |
| **POST /api/webhooks/stripe** | <500ms | Must respond within 5s to avoid Stripe retry |
| **GET /api/uploads/{id}** | <200ms | Upload status polling |

**Performance Budget Alignment:**
- **SRS Requirement:** <500ms API latency for read operations
- **UX Spec Requirement:** <2.5s total page load time (includes API calls + rendering)
- **Strategy:** Aggressive caching + Redis for hot data + database query optimization

### **C.2 Caching Strategy**

**Redis-Based Caching:**
- **Tool:** Redis (in-memory key-value store)
- **Eviction Policy:** LRU (Least Recently Used)
- **Cluster:** Multi-node cluster for high availability

**Cache Keys by Resource:**

| Resource | Cache Key Pattern | TTL | Invalidation |
|----------|-------------------|-----|--------------|
| **Graph metadata** | `graph:{graphId}:meta` | 15 minutes | On `DELETE /api/graphs/{id}` |
| **Graph payload** | `graph:{graphId}:full` | 15 minutes | On `DELETE /api/graphs/{id}` |
| **Insights** | `insights:{graphId}:{types_hash}` | 1 hour | On graph deletion or new graph version |
| **User session** | `session:{sessionId}` | 24 hours | On logout or expiry |
| **Rate limit counters** | `ratelimit:{userId}:{endpoint}` | Per window (1h or 24h) | Automatic (TTL expiry) |
| **Upload status** | `upload:{uploadId}:status` | 5 minutes | On status change (queued → processing → complete) |

**Cache Warming:**
- On graph creation (`POST /api/graphs`), immediately cache metadata to optimize subsequent `GET` requests.
- On insight generation, cache results with 1-hour TTL (deterministic outputs allow long caching).

**Cache Invalidation:**
- **Immediate:** On `DELETE /api/graphs/{id}`, evict all related cache keys (`graph:{graphId}:*`, `insights:{graphId}:*`).
- **Lazy:** On tier downgrade, cache retains old limits until TTL expires (acceptable delay).

### **C.3 Database Query Optimization**

**Indexes:**
- `graphs.user_id` (B-tree index for user-specific queries)
- `graphs.platform` (B-tree index for platform filtering)
- `graphs.created_at` (B-tree index for sorting by recency)
- `insights.graph_id` (B-tree index for insight lookups)
- `users.email` (unique index for authentication)

**Query Patterns:**
- **Pagination:** Cursor-based pagination using `created_at` + `id` composite cursor (avoids offset performance degradation).
- **Soft deletes:** `deleted_at IS NULL` filter on all queries (exclude soft-deleted records).
- **Eager loading:** Fetch graphs with preloaded insights in single query (avoid N+1 queries).

**Connection Pooling:**
- PostgreSQL connection pool: 20 connections max (Prisma default).
- Idle timeout: 10 seconds.
- Query timeout: 5 seconds (prevent runaway queries).

### **C.4 CDN & Static Asset Caching**

**CDN Configuration:**
- **Provider:** Cloudflare / AWS CloudFront
- **Static assets:** JavaScript bundles, CSS, images, fonts
- **TTL:** 1 hour (with versioned filenames for cache busting)
- **Compression:** Brotli + Gzip enabled
- **Cache-Control headers:** `public, max-age=3600, immutable` (for versioned assets)

**API Response Caching (CDN):**
- Public, cacheable endpoints (rare in this API due to authentication):
  - None currently (all endpoints require authentication or are user-specific)
- Future consideration: Public graph viewer (Phase 2+) could use CDN caching

### **C.5 Monitoring & Alerting**

**Metrics Tracked:**
- Endpoint latency (p50, p95, p99) via OpenTelemetry + Datadog/New Relic.
- Cache hit rate (target: >80% for frequently accessed graphs/insights).
- Database query time (alert if p95 >100ms).
- API error rate (alert if >1% of requests return 5xx errors).

**Performance Alerts:**
- Alert if `GET /api/graphs/{id}` p95 exceeds 300ms for 5 consecutive minutes.
- Alert if `POST /api/insights` p95 exceeds 700ms (allows 200ms buffer above 500ms target).
- Alert if cache hit rate drops below 70% (indicates cache invalidation issues or cold cache).

**SLA Commitments:**
- **Free tier:** Best-effort (no SLA guarantees).
- **Pro tier:** 99% uptime, <500ms p95 latency for read operations.
- **Creator tier:** 99.5% uptime, <500ms p95 latency, priority support.

### **C.6 Scaling Strategy**

**Horizontal Scaling:**
- API servers: Auto-scale based on CPU (>70%) or request queue depth (>100 pending).
- Redis: Cluster mode with 3 master nodes + 3 replicas.
- PostgreSQL: Read replicas for read-heavy queries (e.g., `GET /api/graphs`).

**Vertical Scaling:**
- Database: Increase instance size if query latency consistently exceeds targets.

**Load Balancing:**
- Application Load Balancer (ALB) with health checks (`/health` endpoint).
- Round-robin distribution with session affinity (sticky sessions not required due to stateless JWT).

### **C.7 Caching Edge Cases**

**Deterministic vs. Time-Sensitive Data:**
- **Deterministic:** Insights (algorithm outputs) cached for 1 hour (safe because inputs don't change).
- **Time-Sensitive:** Upload status cached for 5 minutes (balance between freshness and performance).

**Cache Stampede Prevention:**
- Use Redis `SETNX` (set-if-not-exists) for cache warming to prevent duplicate computations.
- Example: If 100 users request the same insight simultaneously, only first request computes; others wait for cache.

**Graceful Degradation:**
- If Redis unavailable, fallback to database queries (slower but functional).
- Log cache failures for investigation but don't fail requests.

---
