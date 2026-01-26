# Visual Social Graph - Codebase Analysis Report

**Date:** 2026-01-26  
**Time:** 11:57 UTC  
**Analyst:** Copilot CLI  
**Session:** Deep codebase exploration and Sprint 5 review

---

## Executive Summary

The Visual Social Graph (VSG) project has achieved a **major milestone** with Sprint 5 completion. The backend API is now **fully functional** with SQLite database, CSRF protection, and JWT authentication working end-to-end. The frontend-backend integration is complete, meaning the platform is now ready for **browser-based end-to-end testing** and beta deployment preparation.

**Key Achievement:** First successful full-stack API integration - authentication flow, graph CRUD, and insights endpoints all verified working.

---

## 1. Project Architecture & Maturity

| Component | Completion | State |
|-----------|------------|-------|
| **Frontend (apps/web)** | ~95% | Production-ready React 19 + Vite + TypeScript |
| **Backend (apps/api)** | ~90% | Express + Prisma + SQLite, all routes functional |
| **Shared Package (packages/shared)** | 100% | Complete TypeScript contracts |
| **API Integration** | ✅ NEW | Frontend-backend communication working |
| **Documentation** | 95% | Extensive spec documents (20+ VSG_*.md files) |

### Directory Structure
```
SocialGraphVisual/
├── apps/
│   ├── web/                    # Frontend React app (95% complete)
│   │   ├── src/
│   │   │   ├── components/     # 25+ UI components
│   │   │   │   ├── auth/       # AuthGuard
│   │   │   │   ├── graph/      # GraphCanvas, GraphPage, FilterPanel, Legend, NodeDetails
│   │   │   │   ├── insights/   # InsightsPage
│   │   │   │   ├── landing/    # LandingPage, LandingHeader
│   │   │   │   ├── layout/     # Layout, Header, Sidebar
│   │   │   │   ├── settings/   # SettingsPage
│   │   │   │   ├── ui/         # Badge, Button, Card, Input, Progress, ConstellationBackground
│   │   │   │   └── upload/     # UploadPage, UploadZone, PlatformSelector, ParsingProgress
│   │   │   ├── hooks/          # Custom hooks (useGraph, useInsights, useParser, useUpload)
│   │   │   ├── lib/            # Graph algorithms, parsers, utilities
│   │   │   ├── services/       # API services (NEW - fully implemented)
│   │   │   │   └── api/        # client.ts, auth.ts, graphs.ts, insights.ts, exports.ts
│   │   │   ├── stores/         # Zustand stores (auth, graph, theme, upload)
│   │   │   └── workers/        # Web Workers for parsing
│   │   └── ...
│   └── api/                    # Backend Express app (90% complete)
│       ├── src/
│       │   ├── config/         # env.ts, database.ts, redis.ts
│       │   ├── middleware/     # auth, rateLimit, errorHandler, cors, csrf, logger, validation
│       │   ├── routes/         # 7 route files (auth, user, graph, insight, export, webhook, index)
│       │   └── services/       # 22 service files across 5 domains
│       │       ├── auth/       # AuthService, JwtService
│       │       ├── graph/      # storage, ingestion
│       │       ├── insights/   # engine, analyzer, matcher, interpolator, templates/*
│       │       ├── privacy/    # pseudonymizer, keyManager
│       │       └── security/   # threatScoring, alerting, blockList
│       └── prisma/
│           ├── schema.prisma   # 10 models (SQLite)
│           └── dev.db          # SQLite database (NEW)
└── packages/
    └── shared/                 # Shared TypeScript types
```

---

## 2. Sprint 5 Accomplishments (2026-01-26)

### 2.1 Database Migration to SQLite ✅

**Change:** Migrated from PostgreSQL to SQLite for simpler local development.

| Before | After |
|--------|-------|
| PostgreSQL required | SQLite (file:./dev.db) |
| `Json` field type | `String` with JSON serialization |
| Enum types | String with app-level validation |
| External DB setup | Zero-config local development |

**Modified Files:**
- `apps/api/prisma/schema.prisma` - All 10 models updated
- `apps/api/src/routes/*.ts` - JSON stringify/parse for responses
- `apps/api/src/services/graph/storage.ts` - JSON parsing

### 2.2 Environment Configuration Fixed ✅

**Problem:** ESM module imports failing for dotenv.
**Solution:** Static imports with explicit path resolution.

```typescript
// apps/api/src/config/env.ts
import dotenv from 'dotenv';
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });
```

**Key Environment Variables:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=dev-jwt-secret-key-minimum-32-characters-for-development
MAGIC_LINK_SECRET=dev-magic-link-key-minimum-32-characters-for-development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

### 2.3 CSRF Token Integration ✅

**Problem:** Frontend POST requests failing with 403 CSRF token missing.
**Solution:** Auto-fetch CSRF token before state-changing requests.

**Frontend Implementation (`apps/web/src/services/api/client.ts`):**
```typescript
// Initialize CSRF on app startup
export const initializeCsrf = fetchCsrfToken;

// Auto-fetch before POST/PUT/PATCH/DELETE
if (isStateChanging) {
  await ensureCsrfToken();
}
```

**App Initialization (`apps/web/src/main.tsx`):**
```typescript
import { initializeCsrf } from '@/services/api/client';
initializeCsrf(); // Called before React renders
```

### 2.4 API Endpoints Verified Working ✅

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/health` | GET | ✅ | Health check |
| `/api/v1/csrf-token` | GET | ✅ | Sets CSRF cookie |
| `/api/v1/auth/magic-link/request` | POST | ✅ | Generates magic link |
| `/api/v1/auth/magic-link/verify` | POST | ✅ | Returns JWT tokens |
| `/api/v1/auth/refresh` | POST | ✅ | Token refresh |
| `/api/v1/graphs` | GET | ✅ | List graphs (auth required) |
| `/api/v1/graphs` | POST | ✅ | Create graph |
| `/api/v1/graphs/:id` | GET | ✅ | Get specific graph |
| `/api/v1/graphs/upload/initiate` | POST | ✅ | Initiate file upload |
| `/api/v1/insights/:graphId` | GET | ✅ | Get insights |

---

## 3. Frontend API Services (NEW)

**Location:** `apps/web/src/services/api/`

### 3.1 API Client Architecture

```
apps/web/src/services/api/
├── client.ts     # Axios instance with interceptors
├── auth.ts       # Authentication endpoints
├── graphs.ts     # Graph CRUD endpoints
├── insights.ts   # Insights endpoints
├── exports.ts    # Export endpoints
└── index.ts      # Barrel export
```

### 3.2 Client Features

| Feature | Implementation |
|---------|----------------|
| Base URL | `VITE_API_URL` or `http://localhost:3001/api/v1` |
| Timeout | 30 seconds |
| CSRF Protection | Auto-fetch token, add `X-CSRF-Token` header |
| Auth Token | Add `Authorization: Bearer` for protected routes |
| Token Refresh | Auto-refresh on 401, retry original request |
| Error Handling | Transform to `ApiError` format |
| Credentials | `withCredentials: true` for cookies |

---

## 4. Database Schema (SQLite)

**Location:** `apps/api/prisma/schema.prisma`

### 4.1 Models Overview

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User` | User accounts | email, tier (FREE/PRO/CREATOR), secretKey |
| `RefreshToken` | JWT refresh tokens | token, userId, expiresAt |
| `MagicLink` | Email authentication | token, email, expiresAt |
| `Graph` | Social network graphs | nodesData, edgesData, metadata, statistics |
| `Upload` | Resumable uploads | fileName, fileSize, uploadUrl, status |
| `Insight` | Generated insights | category, type, title, description, data |
| `Export` | Export jobs | type, format, status, fileUrl |
| `Subscription` | Stripe subscriptions | stripeCustomerId, status |
| `AnalyticsEvent` | Usage tracking | event, properties |

### 4.2 SQLite Adaptations

All JSON fields use `String` type with app-level serialization:
```prisma
model Graph {
  nodesData  String  // JSON stored as text
  edgesData  String  // JSON stored as text
  metadata   String  // JSON stored as text
  statistics String? // JSON stored as text
}
```

---

## 5. UI Enhancements (Session 2026-01-25)

### 5.1 ConstellationBackground Component

**Location:** `apps/web/src/components/ui/ConstellationBackground.tsx`

| Feature | Implementation |
|---------|----------------|
| Canvas rendering | 60fps requestAnimationFrame loop |
| Dynamic edges | Distance-based connections |
| Mouse interaction | Nodes repel from cursor |
| Color shifting | Occasional multi-color transitions |
| Node variety | Regular (2-4px), Bridge (3.5-5.5px), Influencer (4.5-7.5px), Major (6-10px) |

**Props:**
- `nodeCount` - Number of nodes
- `opacity` - Effect visibility
- `colorTheme` - 'orange' | 'blue' | 'purple' | 'mixed'
- `connectionDistance` - Edge connection threshold
- `showGlow` - Enable glow effects
- `speedMultiplier` - Animation speed
- `mouseDistance` - Cursor repulsion range
- `enableColorShift` - Occasional color changes

### 5.2 LandingHeader Component

**Location:** `apps/web/src/components/landing/LandingHeader.tsx`

- Sticky header with scroll shadow
- Desktop: Logo + nav (Features, How It Works, Pricing) + theme toggle + CTA
- Mobile: Hamburger menu with slide-in panel
- Anchor navigation to section IDs

### 5.3 Landing Page Hero Enhancements

- Larger hero text: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`
- Spread orange gradient overlays (4 radial gradients)
- Constellation with `enableColorShift={true}`
- Decorative blur elements across the section

---

## 6. Current Phase Position

### 6.1 Sprint Status

| Sprint | Focus | Status |
|--------|-------|--------|
| Phase 0 | Core Engine | ✅ COMPLETE |
| Sprint 1 | Backend Foundation | ✅ COMPLETE |
| Sprint 2 | Graph Processing & Privacy | ✅ COMPLETE |
| Sprint 3 | API Services & Custom Hooks | ✅ COMPLETE |
| Sprint 4 | Component Integration & Data Flow | ✅ COMPLETE |
| **Sprint 5** | **Backend API & Beta Launch Prep** | **✅ COMPLETE** |

### 6.2 Phase 1 Progress

```
Phase 1: Complete Product (12 Weeks)
├── Weeks 3-4: Backend Foundation ✅
├── Weeks 5-6: Privacy & Insights ✅
├── Weeks 7-8: Integration & Beta Launch
│   ├── Week 7: Frontend-Backend Integration ✅
│   └── Week 8: Beta deployment ⬅️ READY TO START
├── Weeks 9-10: Export & Payments (NEXT)
├── Weeks 11-12: Views & Launch
└── Weeks 13-14: Polish & Gate Review
```

---

## 7. Technical Architecture

### 7.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. GET /csrf-token                                        │
│      └─► Sets csrf_token cookie                             │
│                                                             │
│   2. POST /auth/magic-link/request                          │
│      ├─► Body: { email }                                    │
│      ├─► Header: X-CSRF-Token                               │
│      └─► Creates MagicLink in DB, returns { success }       │
│                                                             │
│   3. POST /auth/magic-link/verify                           │
│      ├─► Body: { token }                                    │
│      ├─► Header: X-CSRF-Token                               │
│      └─► Returns { accessToken, refreshToken, user }        │
│                                                             │
│   4. Authenticated requests                                 │
│      ├─► Header: Authorization: Bearer <accessToken>        │
│      └─► 401 triggers auto-refresh via /auth/refresh        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FULL DATA FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   File Upload (ZIP)                                         │
│        │                                                    │
│        ▼                                                    │
│   Web Worker (parser.worker.ts) [Client-side]               │
│        │                                                    │
│        ▼                                                    │
│   Platform Parser (Twitter/Instagram/LinkedIn/etc)          │
│        │                                                    │
│        ▼                                                    │
│   Graph Algorithms (Louvain, PageRank, Betweenness)         │
│        │                                                    │
│        ▼                                                    │
│   API: POST /api/v1/graphs [Server-side]                    │
│        │                                                    │
│        ▼                                                    │
│   Prisma: Create Graph record (SQLite)                      │
│        │                                                    │
│        ▼                                                    │
│   API: GET /api/v1/graphs/:id                               │
│        │                                                    │
│        ▼                                                    │
│   GraphPage + GraphCanvas (D3.js visualization)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Files Inventory

### 8.1 Backend Services (22 files)

| Domain | Files | Purpose |
|--------|-------|---------|
| auth/ | `AuthService.ts`, `JwtService.ts` | Authentication & tokens |
| graph/ | `storage.ts`, `ingestion.ts` | Graph persistence |
| insights/ | `engine.ts`, `analyzer.ts`, `matcher.ts`, `interpolator.ts` | Insight generation |
| insights/templates/ | `community.ts`, `bridge.ts`, `engagement.ts`, `growth.ts` | 30+ insight templates |
| privacy/ | `pseudonymizer.ts`, `keyManager.ts` | HMAC-SHA256 privacy |
| security/ | `threatScoring.ts`, `alerting.ts`, `blockList.ts` | Security services |

### 8.2 Frontend Components (25 files)

| Category | Components |
|----------|------------|
| Landing | `LandingPage.tsx`, `LandingHeader.tsx` |
| Graph | `GraphPage.tsx`, `GraphCanvas.tsx`, `FilterPanel.tsx`, `Legend.tsx`, `NodeDetails.tsx` |
| Upload | `UploadPage.tsx`, `UploadZone.tsx`, `PlatformSelector.tsx`, `ParsingProgress.tsx` |
| Insights | `InsightsPage.tsx` |
| Layout | `Layout.tsx`, `Header.tsx`, `Sidebar.tsx` |
| Auth | `AuthGuard.tsx` |
| UI | `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Input.tsx`, `Progress.tsx`, `LoadingScreen.tsx`, `ConstellationBackground.tsx` |
| Other | `SettingsPage.tsx`, `NotFoundPage.tsx` |

### 8.3 API Services (6 files)

| File | Purpose |
|------|---------|
| `client.ts` | Axios instance with CSRF & auth interceptors |
| `auth.ts` | `requestMagicLink`, `verifyMagicLink`, `refreshTokens`, `logout` |
| `graphs.ts` | `listGraphs`, `getGraph`, `createGraph`, `deleteGraph` |
| `insights.ts` | `getInsights`, `generateInsights` |
| `exports.ts` | `createExport`, `getExportStatus`, `downloadExport` |
| `index.ts` | Barrel exports |

---

## 9. What's Working End-to-End

### 9.1 Verified Flows

| Flow | Status | Notes |
|------|--------|-------|
| Landing page render | ✅ | Constellation background, header, all sections |
| Theme toggle | ✅ | Dark/light mode persisted |
| CSRF initialization | ✅ | Token fetched on app load |
| Magic link request | ✅ | Creates MagicLink in SQLite |
| Magic link verify | ✅ | Returns JWT tokens |
| Auth token storage | ✅ | Stored in Zustand + localStorage |
| Protected route access | ✅ | Authorization header sent |
| Graph CRUD | ✅ | Create, list, get all working |
| Upload initiation | ✅ | Returns upload ID |

### 9.2 Ready for Browser Testing

| Flow | Ready | Next Step |
|------|-------|-----------|
| Full upload → parse → graph | ✅ | Test with real ZIP file |
| Graph visualization | ✅ | Verify D3.js renders parsed data |
| Insights display | ✅ | Test insight generation |

---

## 10. Gaps & Next Steps

### 10.1 Remaining for Beta Launch

| Item | Priority | Notes |
|------|----------|-------|
| Browser E2E testing | HIGH | Test complete upload flow |
| Production database | MEDIUM | Switch to PostgreSQL for deployment |
| Email service | MEDIUM | Resend for magic links |
| Deployment | MEDIUM | Vercel (frontend) + Railway (backend) |

### 10.2 Future Sprints

| Sprint | Focus |
|--------|-------|
| Sprint 6 | Export functionality (PDF/PNG/CSV) |
| Sprint 7 | Stripe integration |
| Sprint 8 | Remaining insight views |
| Sprint 9 | Product Hunt launch preparation |

---

## 11. Recommendations

### 11.1 Immediate (This Week)

1. **Browser Testing** - Run `pnpm dev` in both apps and test:
   - Upload a real Twitter/Instagram ZIP export
   - Verify parsing completes
   - Check graph renders with data
   - Test insights page

2. **Fix Any Parser Issues** - Real data may expose edge cases

3. **Document Demo Account** - Create test user for demos

### 11.2 Short-term (Week 9)

1. **Production Database** - Switch `.env` to PostgreSQL
2. **Deploy to Staging** - Vercel + Railway
3. **Magic Link Email** - Integrate Resend API

### 11.3 Medium-term (Weeks 10-12)

1. **Export Services** - PDF reports, social cards, CSV
2. **Stripe Billing** - Pro/Creator subscriptions
3. **5 Insight Views** - PositioningMap, EngagementCircles, etc.

---

## 12. Conclusion

**Sprint 5 is a major success.** The VSG platform now has:

- ✅ Functional backend API with all core endpoints
- ✅ SQLite database with full schema
- ✅ CSRF protection working
- ✅ JWT authentication flow complete
- ✅ Frontend-backend integration verified
- ✅ Enhanced landing page with interactive constellation

The platform is **ready for beta testing**. The next critical step is browser-based end-to-end testing with real social media data exports, followed by production deployment.

---

*Report generated by Copilot CLI*  
*Session: 2026-01-26 11:57 UTC*
