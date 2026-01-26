# Visual Social Graph - Sprint 5 Implementation Plan

**Session Date:** 2026-01-26
**Phase:** 1 - MVP Development
**Sprint:** 5 - Backend API & Beta Launch Preparation
**Previous Sprint:** Sprint 4 (Component Integration & Data Flow) - COMPLETED

---

## Current State Analysis

### Completed Work Summary

| Sprint | Focus | Status |
|--------|-------|--------|
| Phase 0 | Core Engine (Parsers, Algorithms, Visualization) | ✅ COMPLETE |
| Sprint 1 | Backend Foundation (Config, Middleware, Routes) | ✅ COMPLETE |
| Sprint 2 | Graph Processing & Privacy (Pseudonymization, Insights) | ✅ COMPLETE |
| Sprint 3 | API Services & Custom Hooks | ✅ COMPLETE |
| Sprint 4 | Component Integration & Data Flow | ✅ COMPLETE |

### What Exists Now

**Frontend (apps/web) - 95% Complete:**
- ✅ All UI components (Landing, Upload, Graph, Insights, Settings)
- ✅ Zustand stores (auth, graph, upload, theme)
- ✅ TanStack Query hooks (useGraph, useInsights, useUpload)
- ✅ API services (auth, graphs, insights, exports)
- ✅ Web Worker parsers (5 platforms)
- ✅ Client-side graph algorithms (Louvain, PageRank, Betweenness)
- ✅ D3.js graph visualization
- ⚠️ Routes accessible without auth (for demo mode)

**Backend (apps/api) - 80% Complete:**
- ✅ Express server with TypeScript
- ✅ Config (env, database, redis)
- ✅ Middleware (auth, rateLimit, errorHandler, cors, csrf, logger, validation)
- ✅ Routes (auth, user, graph, insight, export, webhook)
- ✅ Services (auth, privacy, graph, insights)
- ✅ Prisma schema defined
- ❌ Database not connected (needs migration)
- ❌ TypeScript compilation errors (module resolution)
- ❌ Server not tested end-to-end

**Shared (packages/shared) - 100% Complete:**
- ✅ All TypeScript types
- ✅ Validation utilities
- ✅ Constants

### Gap Analysis

| Component | Gap | Priority |
|-----------|-----|----------|
| Backend TypeScript | Module resolution errors | HIGH |
| Database | Prisma migrations not run | HIGH |
| Redis | Not connected | MEDIUM |
| API Testing | Endpoints untested | HIGH |
| E2E Flow | Upload→Graph→Insights untested | HIGH |
| Export | PDF/PNG/CSV not implemented | MEDIUM |
| Payments | Stripe not integrated | LOW (Week 10) |
| Deployment | Not deployed | MEDIUM |

---

## Sprint 5 Objectives

**Primary Goal:** Get the backend API running and working with the frontend

### Milestone 1: Fix Backend TypeScript Compilation
- Fix module resolution issues
- Fix graphology imports
- Verify clean TypeScript build

### Milestone 2: Database Setup & Migration
- Configure local PostgreSQL
- Run Prisma migrations
- Seed initial data (if needed)

### Milestone 3: API Server Running
- Start the Express server
- Test health check endpoint
- Verify middleware stack works

### Milestone 4: End-to-End Integration Testing
- Test authentication flow
- Test graph upload → create → retrieve
- Test insights generation

### Milestone 5: Demo Mode (If Backend Incomplete)
- Create mock API server for frontend testing
- Allow full UI flow without real backend

---

## Detailed Task Breakdown

### Task 1: Audit Backend TypeScript Errors

**Files to Check:**
```
apps/api/src/
├── index.ts
├── config/
├── middleware/
├── routes/
└── services/
```

**Common Issues to Fix:**
1. `.js` extension issues in imports (ESM vs CommonJS)
2. Graphology import issues
3. Missing type declarations
4. Circular dependencies

**Verification:**
```bash
cd apps/api && pnpm tsc --noEmit
```

### Task 2: Database Configuration

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vsg_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

**Prisma Commands:**
```bash
cd apps/api
pnpm prisma generate    # Generate Prisma client
pnpm prisma db push     # Push schema to database
# OR
pnpm prisma migrate dev # Create migration
```

### Task 3: Start API Server

**Development:**
```bash
cd apps/api && pnpm dev
```

**Expected Output:**
```
Server running on http://localhost:3001
Database connected
Redis connected
```

### Task 4: Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/api/v1/health
```

**Auth Flow:**
```bash
# Request magic link
curl -X POST http://localhost:3001/api/v1/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Graph CRUD:**
```bash
# List graphs (requires auth)
curl http://localhost:3001/api/v1/graphs \
  -H "Authorization: Bearer <token>"
```

### Task 5: Frontend Integration Test

1. Start backend: `cd apps/api && pnpm dev`
2. Start frontend: `cd apps/web && pnpm dev`
3. Test flows:
   - Landing → Upload → Select Platform → Upload File
   - Parse completes → Navigate to Graph
   - Graph renders with real data
   - Navigate to Insights → See generated insights

---

## Alternative Path: Demo Mode

If backend issues persist, create a demo mode for the frontend:

### Option A: Mock Service Worker (MSW)
```typescript
// apps/web/src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/v1/graphs', () => {
    return HttpResponse.json({ graphs: mockGraphs })
  }),
  // ... more handlers
]
```

### Option B: Local Storage Backend
```typescript
// Store parsed graph data in localStorage
// Bypass API calls entirely for demo
```

### Option C: Static Mock Data
```typescript
// Return static mock responses from hooks
// useGraph returns mock graph
// useInsights returns mock insights
```

---

## Success Criteria

### Sprint 5 Complete When:
- [ ] Backend TypeScript compiles without errors
- [ ] Prisma schema pushed to local database
- [ ] API server starts successfully
- [ ] At least one API endpoint responds correctly
- [ ] Frontend can make at least one successful API call
- [ ] OR Demo mode allows full UI flow without backend

### Stretch Goals:
- [ ] Full authentication flow works
- [ ] Graph upload and retrieval works
- [ ] Insights generation works
- [ ] Ready for beta deployment

---

## Files Likely to Modify

### Backend Fixes:
- `apps/api/tsconfig.json` - Module resolution
- `apps/api/package.json` - Dependencies
- `apps/api/src/index.ts` - Server startup
- `apps/api/src/config/*.ts` - Configuration
- `apps/api/prisma/schema.prisma` - If needed

### Demo Mode (If Needed):
- `apps/web/src/mocks/handlers.ts` - NEW
- `apps/web/src/mocks/browser.ts` - NEW
- `apps/web/src/main.tsx` - Enable mocks in dev

---

## Reference Timeline (From Master Plan)

```
Phase 1: Complete Product (12 Weeks)
├── Weeks 3-4: Backend Foundation ✅
├── Weeks 5-6: Privacy & Insights ✅
├── Weeks 7-8: Integration & Beta Launch ⬅️ WE ARE HERE
│   ├── Week 7: Frontend-Backend Integration ✅
│   └── Week 8: Beta deployment ⬅️ SPRINT 5
├── Weeks 9-10: Export & Payments (NEXT)
├── Weeks 11-12: Views & Launch
└── Weeks 13-14: Polish & Gate Review
```

---

## Notes

- User requested to wait for Sprint 5 before uploads work with real data
- Current demo mode allows viewing mock graphs at `/graph`
- Backend API services exist but server hasn't been tested end-to-end
- Priority is getting ANY backend functionality working, then iterating

---

## Session Start Checklist

1. [ ] Check current git status
2. [ ] Attempt backend TypeScript compilation
3. [ ] Identify and fix errors systematically
4. [ ] Check database connectivity requirements
5. [ ] Start API server
6. [ ] Run integration tests
7. [ ] Document progress

