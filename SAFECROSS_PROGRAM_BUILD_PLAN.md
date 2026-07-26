# SafeCross Nigeria — Program Build Plan

**Version:** 1.0 (Draft)
**Date:** 2026-07-26
**Source basis:** SafeCross_Nigeria_SDLC_Document_Package_v1.0 (24 documents, analysed in full)
**Status:** Engineering build plan derived from the approved planning package

> **Control note (inherited from the SDLC package):** This is a planning artefact, not legal approval. Any identity matching, subscriber-data access, penalty issuance, or transfer of public funds remains disabled until the relevant public authority, legislation, data-protection review, procurement process, and appeal mechanism are confirmed in writing.

---

## 1. What the package describes

SafeCross Nigeria is a **privacy-preserving pedestrian-safety platform** for Nigerian expressway locations where people cross active carriageways instead of using pedestrian bridges. It has three separable capabilities, each behind its own governance gate:

1. **Anonymous safety intelligence** — edge AI detects pedestrians, classifies journeys (bridge use / road crossing / aborted / uncertain), triggers real-time local warnings, and produces de-identified metrics. *No facial identification.*
2. **Voluntary seasonal rewards** — opt-in participants prove bridge use via rotating QR, NFC, USSD or assisted card (no biometric enrolment required) and earn airtime, transport credit, vouchers or draw entries during time-boxed campaigns.
3. **Future enforcement (Gate G5, out of scope for this build)** — a separately authorised, human-reviewed capability that must be *physically and logically absent* from the MVP.

The programme follows a gated lifecycle (G0 mandate → G1 problem validation → G2 anonymous MVP → G3 safety intervention → G4 voluntary rewards → G5 enforcement readiness → G6 scale), with hard non-negotiables: no automatic fines, no identity search in anonymous stages, no unapproved database linkage, no biometric-only reward participation, no operator paid per fine, and no unevaluated model promotion.

**This build plan covers the software programme for Gates G2–G4** (anonymous MVP, safety intervention, voluntary rewards), preserving — but not building — the G5 extension point.

---

## 2. System to be built

### 2.1 Architecture (from Doc 08, SRS Doc 07)

```text
┌─────────────────────────── SITE (×6 pilot) ───────────────────────────┐
│ Cameras / optional radar                                              │
│        │                                                              │
│        ▼                                                              │
│ Edge Node (offline-capable, hardened, signed updates)                 │
│   ├─ stream ingestion, health & time-sync monitor                     │
│   ├─ pedestrian/vehicle detector                                      │
│   ├─ short-lived multi-object tracker (temporary IDs)                 │
│   ├─ zone & trajectory engine (polygonal geofences)                   │
│   ├─ journey/risk classifier + near-miss estimator                    │
│   ├─ privacy filter (blur, minimal evidence packaging, buffer purge)  │
│   └─ local warning controller (≤1.5 s trigger, cooldown/dedup)        │
└──────────────── │ encrypted, store-and-forward event channel ─────────┘
                  ▼
┌────────────────────────── CENTRAL PLATFORM ───────────────────────────┐
│ ├─ event ingestion & validation API                                   │
│ ├─ site & configuration registry (signed config)                      │
│ ├─ operations dashboard + alerting                                    │
│ ├─ analytics warehouse (de-identified only)                           │
│ ├─ QA review workspace (restricted evidence vault)                    │
│ ├─ campaign / reward / anti-fraud service (separate data domain)      │
│ ├─ IAM, audit (immutable), key management, retention/deletion jobs    │
│ └─ model registry, MLOps & observability                              │
└───────────────────────────────────────────────────────────────────────┘
     Future enforcement = separate security domain, NOT built now.
```

### 2.2 Hard engineering constraints (from Docs 01, 06, 07, 10)

| Constraint | Engineering consequence |
|---|---|
| Edge-first, no paid AI APIs for core detection | Self-hosted open models, on-device inference |
| Warning latency ≤ 1.5 s from confirmed risk | Detection→warning path is entirely local to the edge node |
| Edge autonomy during network loss | Store-and-forward event buffer; warnings never depend on the cloud |
| No persistent identity in anonymous mode | Track IDs are ephemeral, site-bounded; embeddings never leave site or persist |
| Faces/plates blurred before central transmission | Privacy filter is a mandatory pipeline stage, not an option |
| 99.5% central availability; 6 → 500 sites without re-architecture | Stateless services, per-site multi-tenancy, queue-based ingestion |
| Reward and safety data use separate identifiers and stores (PRV-003) | Two data domains; no shared join keys |
| Every event decision records model + rule version (SYS-F-063) | Versioned config/model stamps in the event schema from day one |
| Immutable audit for admin/evidence access (SYS-F-060) | Append-only audit log service in the first platform increment |
| Retention/deletion verifiable incl. replicas (PRV-009) | Deletion jobs with completion evidence; TTLs per data class |
| Enforcement interfaces physically and logically absent | No stubs, flags, or dormant code paths for enforcement |

### 2.3 Recommended technology stack

Choices favour open, self-hostable components (per the "no paid AI API" and open-interface principles); all are replaceable behind documented interfaces.

| Layer | Recommendation | Rationale |
|---|---|---|
| Edge hardware | NVIDIA Jetson Orin-class (or equivalent NPU SBC) per site | Runs detector+tracker at multi-camera real time; industrial temp range |
| Edge OS/fleet | Ubuntu Core or Yocto + **Mender/balena** OTA | Secure boot, full-disk encryption, signed A/B updates with rollback |
| Video ingestion | GStreamer / RTSP with hardware decode | Multi-camera sync, low latency |
| Detector | YOLO-family or RT-DETR (Apache/AGPL-cleared build), exported to **TensorRT/ONNX** | Open weights, edge-optimised, replaceable |
| Tracker | ByteTrack / OC-SORT | Short-lived IDs, no appearance database required |
| Zone/rule engine | Shapely-based polygon engine, versioned site geometry config | SYS-F-001/004; deterministic and auditable |
| Edge runtime | Python services under systemd; local SQLite buffer | Simplicity, offline resilience |
| Edge→centre transport | MQTT over mTLS (or gRPC) with store-and-forward | Degraded-mode requirement; per-device certs |
| Central services | **FastAPI (Python)** microservices; containers on Kubernetes (or Nomad) | Team skill alignment with CV stack; scales to 500 sites |
| Event/analytics store | PostgreSQL + **TimescaleDB**; object storage (S3/MinIO) for restricted evidence vault | Time-series metrics + segregated encrypted evidence |
| Streaming/queue | NATS JetStream or Kafka | Ingestion buffering, replay, backpressure |
| Dashboards | React/Next.js ops dashboard; Grafana for infra; public aggregate dashboard (static/SSR) | P0 dashboard + P1 public dashboard |
| IAM / audit | Keycloak (OIDC, MFA); append-only audit service (e.g., immudb or WORM bucket) | SYS-F-060/061; MFA mandate from Doc 10 |
| Rewards channels | Rotating TOTP-style QR at bridge exit; NFC reader; **USSD via Nigerian aggregator** (e.g. Africa's Talking-class); assisted card | SYS-F-041 multichannel, non-smartphone inclusion |
| MLOps | DVC or lakeFS (data), MLflow (experiments/registry), signed model artefacts (cosign) | Doc 15 controls; reproducible hashes |
| IaC / CI-CD | Terraform + Ansible; GitHub Actions with SBOM (Syft) and signing | Doc 15 "infrastructure as code", supply-chain controls |
| Observability | Prometheus + Grafana + Loki; edge health agent | Doc 15 monitoring list |

---

## 3. Build phases

Phases map to the SDLC gates and the indicative roadmap (Doc 18). Durations are the package's indicative ranges; software workstream content is expanded here.

### Phase 0 — Mobilisation & foundations (G0, 6–10 wks) — *engineering runs in parallel with governance*

**Goal:** a working skeleton of the delivery machine before any camera goes up.

- Monorepo scaffold (see §4), CI/CD with lint/test/SBOM/signing from commit one.
- Architecture Decision Records; requirements traceability matrix seeded from SRS IDs (SYS-F-xxx, PRV-xxx).
- Dev environment with **synthetic/approved de-identified data only** (Doc 15).
- Canonical **event schema v1** (site, camera, zone, track lifecycle, journey class, model+rule version stamp, quality flags) — this schema is the platform's spine; get it reviewed by DPO and architecture board.
- Edge reference device bench: flash, secure boot, OTA update, mTLS enrolment proven on 2 bench units.
- Threat model workshop → security backlog (Doc 10 minimum controls as tickets).
- DPIA v0 started with privacy engineer embedded in the team (Doc 06).

**Exit:** G0 gate — sponsor, legal basis, funding confirmed; CI green; event schema v1 approved.

### Phase 1 — Discovery & site validation (G1, 8–12 wks)

**Goal:** evidence before code commitment; calibration data for the models.

- Site audit tooling: survey sheets, camera field-of-view planner, zone-drawing tool (produces the versioned polygonal site geometry consumed by the edge rule engine).
- Collect **lawfully approved calibration footage** at candidate sites (per DPIA conditions) for the Nigeria-specific evaluation dataset: day/night, weather, crowding, mobility aids, clothing variety (Doc 08 §4).
- Annotation pipeline (CVAT or Label Studio) with dataset cards; body boxes/trajectories/zones only — minimise retained faces.
- Baseline behavioural metrics defined with research/MEL team (events per 1,000 approaches, near-miss rate, etc. from PRD §5).

**Exit:** G1 — six pilot sites selected with survey packs; locked evaluation dataset v1; per-site/per-condition model thresholds drafted (SRS §4 requires these *before* pilot release).

### Phase 2 — Anonymous MVP build (G2, 12–18 wks) — *the core software delivery*

Two parallel tracks:

**Track A — Edge pipeline**
1. Stream ingestion + health/sync monitor (obstruction, blur, clock drift, movement detection — SYS-F-006).
2. Detector + tracker integration; temporary track IDs with configurable expiry.
3. Zone/trajectory engine over site geometry; journey classifier (bridge use / road crossing / aborted / uncertain / out-of-scope — SYS-F-004).
4. Privacy filter: short rolling buffer with automatic purge (PRV-001), face/plate blur on any exported clip, evidence packager for serious events/QA samples only (SYS-F-023).
5. Local warning controller: risk-condition trigger ≤1.5 s, configurable cooldown + dedup (SYS-F-020/021), operator acknowledgement hook.
6. Store-and-forward event uplink; full degraded-mode operation (ConOps §4).

**Track B — Central platform**
1. Event ingestion + validation API; site/config registry with signed config distribution.
2. Operations dashboard: live site health, prioritised alerts (no alarm overload — PRD user need), event trends.
3. Analytics warehouse (de-identified) + exportable aggregate statistics.
4. QA review workspace against the restricted evidence vault (named-purpose access + audit entry — PRV-004; bulk export disabled — PRV-005).
5. IAM (RBAC, MFA, separation of duties), immutable audit log, retention/deletion job framework with verifiable completion (SYS-F-060/061/062, PRV-009).
6. Data-subject request workflow (must be tested before live operation — PRV-008).

**Release path (Doc 08 §5, PRD §7):** offline evaluation → recorded-video site simulation → **MVP alpha** (controlled footage + test site) → shadow deployment → safety/privacy review → **MVP beta** (one live site, anonymous only).

**Exit:** G2 — beta site meets drafted precision/recall/uncertain thresholds per condition; DPIA sign-off; security acceptance (no criticals, no shared admin accounts, signed updates, encrypted restricted data, tested recovery, access logs — Doc 10 §5).

### Phase 3 — Live anonymous pilot + safety intervention (G2/G3, 16–28 wks combined)

- Roll out to six sites, site-by-site canary with automated health checks and rollback (Doc 15 §2).
- Baseline measurement period (Observe mode) → warning activation (Warn mode) per experiment protocol (Doc 11).
- P1 features: near-miss estimation from pedestrian/vehicle trajectories, obstruction/lighting degradation alerts, bridge crowd-density alerts, public aggregate dashboard, accessibility/closure status feed.
- Drift monitoring by site/time/condition; threshold change log; model rollback drills.
- Infrastructure interventions (lighting, repairs, signage) coordinated by the programme — engineering supplies before/after metrics.

**Exit:** G3 — warnings demonstrably precise (alarm-fatigue controlled), interventions measured against baseline.

### Phase 4 — Voluntary rewards pilot (G4, 12–16 wks)

- Campaign service: sponsor, budget, dates, sites, eligibility, caps, reward rules; **automatic stop at budget exhaustion** (SYS-F-045, Doc 13 §3).
- Claim channels: rotating QR at bridge exit, NFC tap, USSD challenge, assisted card/agent; offline claim queue (P1).
- Claim↔journey matching within configurable window against the *anonymous* traversal event (SYS-F-042) — designed so no facial template and no join key between reward accounts and safety events beyond the transient match.
- Anti-fraud engine: rotating time-bound codes, plausible journey duration, device/account limits, duplicate/replay detection, daily caps, anomaly flags routed to **manual review with reason codes** — never automatic accusation (SYS-F-043/044, Doc 13 §5).
- Fulfilment integrations (airtime/transport credit/voucher partners) + sponsor reconciliation reports; participant self-service view/challenge/delete (ConOps §3.7).

**Exit:** G4 — scheme rules, finance controls, public notice approved; fraud loss and support rates within tolerance; campaign evaluation delivered.

### Phase 5 — Consolidation & scale decision (G6 input, 6–10 wks)

- Final pilot evaluation with MEL team; cost per prevented high-risk event; scale/no-scale recommendation.
- Architecture review for 500-site scale (multi-tenancy, fleet ops, per-corridor operating-mode approval).
- Decommissioning-ready posture verified (Doc 21): site suspension procedure, data disposition, exit assistance.

**Explicitly deferred (not built):** anything in Doc 19 (enforcement/appeals), cross-site re-identification, identity resolution, penalty workflows. The only concession to the future is the *documented case-transfer interface contract* — a specification, not code.

---

## 4. Proposed repository structure

```text
safecross/
├── edge/
│   ├── ingest/            # camera streams, health, time sync
│   ├── perception/        # detector, tracker, model runtime
│   ├── rules/             # zone engine, journey classifier, near-miss
│   ├── privacy/           # buffer purge, blur, evidence packager
│   ├── warning/           # local warning controller
│   └── uplink/            # store-and-forward, mTLS event channel
├── platform/
│   ├── ingestion-api/     # event validation & intake
│   ├── registry/          # sites, cameras, zones, signed config
│   ├── dashboard-api/     # ops dashboard backend
│   ├── analytics/         # de-identified warehouse, exports
│   ├── qa-review/         # evidence vault workspace
│   ├── rewards/           # campaigns, claims, anti-fraud, fulfilment  (separate DB)
│   ├── governance/        # IAM glue, audit log, retention jobs, DSR workflow
│   └── shared/            # event schema, client libs
├── web/
│   ├── ops-dashboard/     # operator UI
│   └── public-dashboard/  # aggregate public metrics
├── ml/
│   ├── datasets/          # DVC-tracked, dataset cards
│   ├── training/          # experiments (MLflow)
│   ├── evaluation/        # per-condition threshold harness, site simulation
│   └── registry/          # model cards, signed artefacts
├── infra/
│   ├── terraform/         # cloud + network
│   ├── ansible/           # edge provisioning
│   ├── k8s/               # service manifests
│   └── fleet/             # OTA update channel config
├── docs/
│   ├── adr/               # architecture decision records
│   ├── rtm/               # requirements traceability matrix
│   └── runbooks/          # SOPs from Doc 15 §5
└── tools/
    ├── site-survey/       # FOV planner, zone editor
    └── simulation/        # recorded-video replay harness
```

---

## 5. Testing & acceptance strategy (from Doc 14)

- **Unit/API/integration tests** in CI on every commit; contract tests on the event schema.
- **Model offline evaluation harness** producing per-condition (day/night, weather, crowding, angle) precision/recall/uncertain-rate reports — gate for every model promotion.
- **Recorded-video site simulation**: replay annotated footage through the full edge pipeline; regression-lock known hard cases (occlusion, wheelchairs, prams, carried objects, camera shake, road-edge walking vs entry).
- **Hardware-in-the-loop bench**: real camera + edge unit + warning device; latency budget verification (≤1.5 s).
- **Privacy/security tests as first-class suites**: deletion & backup expiry verification, role separation, bulk-export prevention, DSR workflow, signed-update tamper tests, pen test before each gate.
- **Rewards abuse suite**: replay, duplicates, budget exhaustion, channel fallback, reconciliation.
- **Shadow live-site testing** before every promotion; operational readiness + recovery drills before pilot.
- Defect policy: S1 (injury risk / unlawful processing / breach / uncontrolled financial loss) and S2 block release; every acceptance test links to requirement + model/config version + evidence (traceability rule: *code existing ≠ requirement complete*).

---

## 6. Team mapped to workstreams (Doc 18)

| Workstream | Core roles | Primary phases |
|---|---|---|
| Edge & perception | 2× CV/ML engineers, 1× edge/IoT engineer | 0–3 |
| Central platform | 2–3× platform engineers, 1× data engineer | 0–4 |
| Web/dashboards | 1–2× frontend engineers, UX/accessibility designer | 2–4 |
| Rewards & finance | 1× backend engineer + scheme ops + finance | 4 |
| MLOps/DevSecOps | 1× MLOps engineer, 1× DevSecOps engineer | 0–5 |
| Security & privacy | security lead, DPO/privacy engineer (embedded, not end-of-phase) | all |
| QA | test automation lead + suites above | all |
| Field | site technicians, operators, community engagement | 1–5 |

---

## 7. Top build risks and mitigations (from Doc 17 + analysis)

| Risk | Mitigation in this plan |
|---|---|
| Model accuracy varies badly by site/condition | Nigeria-specific locked evaluation set in Phase 1; per-condition thresholds gate promotion; uncertain class routed to QA, not warnings |
| Alarm fatigue destroys warning credibility | Precision-prioritised thresholds, cooldown/dedup in P0, warning precision tracked as a product metric |
| Connectivity/power instability at sites | Edge autonomy is a build-time requirement (Phase 2 Track A), not a hardening afterthought; store-and-forward tested in CI simulation |
| Scope creep toward identification/enforcement | No enforcement code paths; DPIA change gate on every new integration (PRV-006); purpose register |
| Reward fraud drains campaign budget | Rotating codes, caps, automatic budget stop, manual-review-only accusations, reconciliation from first campaign |
| Privacy incident destroys public trust | Blur-before-transmit, ephemeral IDs, segmented vault, immutable audit, DSR workflow tested pre-launch |
| Supply-chain / update compromise | Signed images, models and config end-to-end; SBOM in CI; A/B rollback |

---

## 8. Immediate next steps (Sprint 0 backlog)

1. Confirm G0 prerequisites with sponsor (mandate, legal basis, funding) — governance track.
2. Stand up monorepo + CI/CD with signing/SBOM; commit event schema v1 draft for DPO/architecture review.
3. Procure 2 bench edge devices + cameras; prove secure boot → OTA → mTLS enrolment loop.
4. Select and benchmark detector/tracker candidates on public pedestrian datasets (licence-cleared) against the latency budget.
5. Build the recorded-video simulation harness — it is the backbone of alpha acceptance.
6. Draft site-survey/zone-editor tool requirements with the road-safety lead.
7. Seed the requirements traceability matrix from SRS IDs and the risk register.
8. Schedule DPIA kickoff and threat-model workshop within the first two weeks.
