# Visual Social Graph - Security & Privacy Specification

## Document Metadata

| Attribute | Value |
|-----------|-------|
| **Document Title** | Visual Social Graph Security & Privacy Specification |
| **Version** | 1.0.0 |
| **Status** | Production-Ready |
| **Last Updated** | 2025-12-27 |
| **Document Owner** | Security Team |
| **Classification** | Internal |
| **Related Documents** | VSG_API_SPECIFICATION.md, VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md, VSG_ARCHITECTURE_DOCUMENT.md |

---

## Document Control

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-27 | Security Team | Initial release - Comprehensive security and privacy documentation |

### Review Schedule

| Review Type | Frequency | Next Review Date |
|-------------|-----------|------------------|
| Quarterly Security Review | Every 3 months | 2026-03-27 |
| Annual Penetration Test | Annually | 2026-12-01 |
| Compliance Audit (GDPR) | Annually | 2026-12-27 |

### Approval Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Lead | Security Team | 2025-12-28 | ✅ Approved |
| Legal/Compliance | Legal Team | 2025-12-28 | ✅ Approved |
| Engineering Lead | Engineering Lead | 2025-12-28 | ✅ Approved |
| Product Lead | Product Team | 2025-12-28 | ✅ Approved |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose and Scope](#11-purpose-and-scope)
   - 1.2 [Audience](#12-audience)
   - 1.3 [Document Conventions](#13-document-conventions)
   - 1.4 [Related Documents](#14-related-documents)
   - 1.5 [Compliance Standards](#15-compliance-standards)

2. [Security Architecture Overview](#2-security-architecture-overview)
   - 2.1 [Core Security Principles](#21-core-security-principles)
   - 2.2 [Constitutional Constraints (C1-C3)](#22-constitutional-constraints-c1-c3)
   - 2.3 [Privacy-First Design Philosophy](#23-privacy-first-design-philosophy)
   - 2.4 [Trust Boundaries and Threat Model](#24-trust-boundaries-and-threat-model)
   - 2.5 [Security Lifecycle](#25-security-lifecycle)

3. [Authentication & Authorization](#3-authentication--authorization)
   - 3.1 [Authentication Mechanisms](#31-authentication-mechanisms)
     - 3.1.1 [Magic Link Authentication (Primary)](#311-magic-link-authentication-primary)
     - 3.1.2 [Google OAuth (Social Login)](#312-google-oauth-social-login)
     - 3.1.3 [Cookie-Based JWT Sessions](#313-cookie-based-jwt-sessions)
     - 3.1.4 [Bearer Token API Keys (Creator Tier)](#314-bearer-token-api-keys-creator-tier)
   - 3.2 [Session Management](#32-session-management)
     - 3.2.1 [Session Creation and Lifecycle](#321-session-creation-and-lifecycle)
     - 3.2.2 [JWT Token Specifications](#322-jwt-token-specifications)
     - 3.2.3 [Session Expiry and Renewal](#323-session-expiry-and-renewal)
     - 3.2.4 [Session Fixation Protection](#324-session-fixation-protection)
   - 3.3 [CSRF Protection](#33-csrf-protection)
     - 3.3.1 [Double-Submit Cookie Pattern](#331-double-submit-cookie-pattern)
     - 3.3.2 [Token Generation and Validation](#332-token-generation-and-validation)
     - 3.3.3 [Exempt Endpoints (GET, HEAD, OPTIONS)](#333-exempt-endpoints-get-head-options)
   - 3.4 [Authorization Model](#34-authorization-model)
     - 3.4.1 [Tier-Based Feature Gating](#341-tier-based-feature-gating)
     - 3.4.2 [Resource Ownership Validation](#342-resource-ownership-validation)
     - 3.4.3 [IDOR Prevention](#343-idor-prevention)
   - 3.5 [Password and Secret Management](#35-password-and-secret-management)
     - 3.5.1 [No Password Policy (Magic Link Only)](#351-no-password-policy-magic-link-only)
     - 3.5.2 [API Key Rotation (90-Day Maximum)](#352-api-key-rotation-90-day-maximum)
     - 3.5.3 [Secret Storage (KMS Integration)](#353-secret-storage-kms-integration)

4. [Data Privacy & Pseudonymization](#4-data-privacy--pseudonymization)
   - 4.1 [Privacy Design Principles](#41-privacy-design-principles)
     - 4.1.1 [80% Client-Side Processing Rule](#411-80-client-side-processing-rule)
     - 4.1.2 [Data Minimization](#412-data-minimization)
     - 4.1.3 [Privacy Moat (No Account Access Constraint)](#413-privacy-moat-no-account-access-constraint)
   - 4.2 [Pseudonymization Architecture](#42-pseudonymization-architecture)
     - 4.2.1 [HMAC-SHA256 Keyed Hashing](#421-hmac-sha256-keyed-hashing)
     - 4.2.2 [Per-User Secret Keys](#422-per-user-secret-keys)
     - 4.2.3 [Deterministic Mapping](#423-deterministic-mapping)
     - 4.2.4 [Server-Side Only (No Client Key Exposure)](#424-server-side-only-no-client-key-exposure)
   - 4.3 [Timestamp Privacy](#43-timestamp-privacy)
     - 4.3.1 [Day-Level Granularity (YYYY-MM-DD)](#431-day-level-granularity-yyyy-mm-dd)
     - 4.3.2 [User-Facing vs Internal Timestamps](#432-user-facing-vs-internal-timestamps)
   - 4.4 [Data Storage Policies](#44-data-storage-policies)
     - 4.4.1 [What We Store (Graph Structure, Metrics)](#441-what-we-store-graph-structure-metrics)
     - 4.4.2 [What We DON'T Store (Display Names, Usernames, Raw Uploads)](#442-what-we-dont-store-display-names-usernames-raw-uploads)
     - 4.4.3 [Temporary Data Handling](#443-temporary-data-handling)
   - 4.5 [Client-Server Data Flow](#45-client-server-data-flow)
     - 4.5.1 [Upload Processing (Server Pseudonymization at Ingestion)](#451-upload-processing-server-pseudonymization-at-ingestion)
     - 4.5.2 [Server Validation Only](#452-server-validation-only)
     - 4.5.3 [Insight Generation (Server-Side Algorithms)](#453-insight-generation-server-side-algorithms)

5. [Encryption & Transport Security](#5-encryption--transport-security)
   - 5.1 [Transport Layer Security](#51-transport-layer-security)
     - 5.1.1 [TLS 1.3 Minimum Requirement](#511-tls-13-minimum-requirement)
     - 5.1.2 [HSTS Configuration](#512-hsts-configuration)
     - 5.1.3 [Certificate Management](#513-certificate-management)
   - 5.2 [Data at Rest Encryption](#52-data-at-rest-encryption)
     - 5.2.1 [Database Encryption (AES-256-GCM)](#521-database-encryption-aes-256-gcm)
     - 5.2.2 [File Storage Encryption (S3/GCS SSE)](#522-file-storage-encryption-s3gcs-sse)
     - 5.2.3 [Backup Encryption](#523-backup-encryption)
   - 5.3 [Key Management](#53-key-management)
     - 5.3.1 [Cloud KMS Integration (AWS KMS, GCP Cloud KMS)](#531-cloud-kms-integration-aws-kms-gcp-cloud-kms)
     - 5.3.2 [Key Rotation Policy](#532-key-rotation-policy)
     - 5.3.3 [Access Control for Keys](#533-access-control-for-keys)
   - 5.4 [Redis Security](#54-redis-security)
     - 5.4.1 [TLS Connections](#541-tls-connections)
     - 5.4.2 [Password Rotation](#542-password-rotation)
     - 5.4.3 [Network Isolation](#543-network-isolation)

6. [GDPR & Data Protection Compliance](#6-gdpr--data-protection-compliance)
   - 6.1 [Lawful Basis for Processing](#61-lawful-basis-for-processing)
   - 6.2 [User Rights Implementation](#62-user-rights-implementation)
     - 6.2.1 [Right to Access (Data Export)](#621-right-to-access-data-export)
     - 6.2.2 [Right to Erasure (Dual Deletion Modes)](#622-right-to-erasure-dual-deletion-modes)
     - 6.2.3 [Right to Data Portability (JSON Export)](#623-right-to-data-portability-json-export)
     - 6.2.4 [Right to Rectification](#624-right-to-rectification)
   - 6.3 [Data Deletion Policy](#63-data-deletion-policy)
     - 6.3.1 [Soft Delete (30-Day Grace Period)](#631-soft-delete-30-day-grace-period)
     - 6.3.2 [Hard Delete (Immediate with 90-Day Backup Purge)](#632-hard-delete-immediate-with-90-day-backup-purge)
     - 6.3.3 [Cascade Deletion Rules](#633-cascade-deletion-rules)
   - 6.4 [Data Retention](#64-data-retention)
     - 6.4.1 [Active User Data (Indefinite Until Deletion)](#641-active-user-data-indefinite-until-deletion)
     - 6.4.2 [Audit Logs (90-Day Retention)](#642-audit-logs-90-day-retention)
     - 6.4.3 [Backup Retention (90-Day Maximum)](#643-backup-retention-90-day-maximum)
   - 6.5 [Cookie Consent Management](#65-cookie-consent-management)
     - 6.5.1 [Essential vs Non-Essential Cookies](#651-essential-vs-non-essential-cookies)
     - 6.5.2 [Consent Banner Implementation](#652-consent-banner-implementation)
     - 6.5.3 [Opt-Out Mechanisms](#653-opt-out-mechanisms)
   - 6.6 [Data Processing Agreements (DPAs)](#66-data-processing-agreements-dpas)
     - 6.6.1 [Third-Party Service Providers](#661-third-party-service-providers)
     - 6.6.2 [Subprocessor List](#662-subprocessor-list)

7. [Input Validation & Injection Prevention](#7-input-validation--injection-prevention)
   - 7.1 [API Input Validation](#71-api-input-validation)
     - 7.1.1 [Request Schema Validation (OpenAPI)](#711-request-schema-validation-openapi)
     - 7.1.2 [Type Coercion Prevention](#712-type-coercion-prevention)
     - 7.1.3 [Size Limits (10 MB Graph Payload)](#713-size-limits-10-mb-graph-payload)
   - 7.2 [SQL Injection Prevention](#72-sql-injection-prevention)
     - 7.2.1 [Parameterized Queries Only](#721-parameterized-queries-only)
     - 7.2.2 [ORM Best Practices](#722-orm-best-practices)
   - 7.3 [XSS Prevention](#73-xss-prevention)
     - 7.3.1 [Content Security Policy (CSP)](#731-content-security-policy-csp)
     - 7.3.2 [Output Encoding](#732-output-encoding)
     - 7.3.3 [Sanitization Libraries](#733-sanitization-libraries)
   - 7.4 [Command Injection Prevention](#74-command-injection-prevention)
   - 7.5 [Path Traversal Prevention](#75-path-traversal-prevention)
   - 7.6 [File Upload Security](#76-file-upload-security)
     - 7.6.1 [Allowed File Types (ZIP only)](#761-allowed-file-types-zip-only)
     - 7.6.2 [MIME Type Validation](#762-mime-type-validation)
     - 7.6.3 [Virus Scanning (ClamAV Integration)](#763-virus-scanning-clamav-integration)
     - 7.6.4 [Size Limits (Tus Protocol)](#764-size-limits-tus-protocol)

8. [Rate Limiting & Quota Management](#8-rate-limiting--quota-management)
   - 8.1 [Rate Limiting Strategy](#81-rate-limiting-strategy)
     - 8.1.1 [Algorithm (Token Bucket, Sliding Window)](#811-algorithm-token-bucket-sliding-window)
     - 8.1.2 [Redis-Backed Counters](#812-redis-backed-counters)
     - 8.1.3 [Rate Limit Headers (X-RateLimit-*)](#813-rate-limit-headers-x-ratelimit-)
   - 8.2 [Tier-Based Quotas](#82-tier-based-quotas)
     - 8.2.1 [Free Tier (5 graphs/day)](#821-free-tier-5-graphsday)
     - 8.2.2 [Pro Tier (100 graphs/day)](#822-pro-tier-100-graphsday)
     - 8.2.3 [Creator Tier (500 graphs/day)](#823-creator-tier-500-graphsday)
   - 8.3 [Error Handling](#83-error-handling)
     - 8.3.1 [QUOTA_EXCEEDED (429, retryable=false)](#831-quota_exceeded-429-retryablefalse)
     - 8.3.2 [RATE_LIMITED (429, retryable=true)](#832-rate_limited-429-retryabletrue)
     - 8.3.3 [Client Retry Strategy](#833-client-retry-strategy)
   - 8.4 [DDoS Protection](#84-ddos-protection)
     - 8.4.1 [Cloudflare WAF Integration](#841-cloudflare-waf-integration)
     - 8.4.2 [IP Reputation Filtering](#842-ip-reputation-filtering)
     - 8.4.3 [Geographic Rate Limiting](#843-geographic-rate-limiting)

9. [Audit Logging & Monitoring](#9-audit-logging--monitoring)
   - 9.1 [Audit Log Requirements](#91-audit-log-requirements)
     - 9.1.1 [What to Log (Authentication Events, Data Access, Modifications)](#911-what-to-log-authentication-events-data-access-modifications)
     - 9.1.2 [What NOT to Log (Passwords, PII, Raw Tokens)](#912-what-not-to-log-passwords-pii-raw-tokens)
   - 9.2 [Log Format and Structure](#92-log-format-and-structure)
     - 9.2.1 [Structured JSON Logging](#921-structured-json-logging)
     - 9.2.2 [Timestamp Format (ISO 8601 with UTC)](#922-timestamp-format-iso-8601-with-utc)
     - 9.2.3 [Required Fields (requestId, userId, action, outcome)](#923-required-fields-requestid-userid-action-outcome)
   - 9.3 [Log Retention Policy](#93-log-retention-policy)
     - 9.3.1 [90-Day Retention for Audit Logs](#931-90-day-retention-for-audit-logs)
     - 9.3.2 [Archive and Purge Procedures](#932-archive-and-purge-procedures)
   - 9.4 [Database Access Logging](#94-database-access-logging)
     - 9.4.1 [Query Logging (Slow Queries, Errors)](#941-query-logging-slow-queries-errors)
     - 9.4.2 [Admin Access Logging](#942-admin-access-logging)
   - 9.5 [Error Tracking (Sentry)](#95-error-tracking-sentry)
     - 9.5.1 [PII Scrubbing Configuration](#951-pii-scrubbing-configuration)
     - 9.5.2 [Sensitive Field Redaction](#952-sensitive-field-redaction)
     - 9.5.3 [Error Sampling Strategy](#953-error-sampling-strategy)
   - 9.6 [Security Monitoring](#96-security-monitoring)
     - 9.6.1 [Failed Authentication Attempts](#961-failed-authentication-attempts)
     - 9.6.2 [Unusual API Access Patterns](#962-unusual-api-access-patterns)
     - 9.6.3 [Alerting Thresholds](#963-alerting-thresholds)

10. [Webhook & Third-Party Integration Security](#10-webhook--third-party-integration-security)
    - 10.1 [Stripe Webhook Security](#101-stripe-webhook-security)
      - 10.1.1 [HMAC Signature Verification](#1011-hmac-signature-verification)
      - 10.1.2 [Webhook Secret Rotation](#1012-webhook-secret-rotation)
      - 10.1.3 [IP Whitelist (Optional)](#1013-ip-whitelist-optional)
      - 10.1.4 [Replay Attack Prevention](#1014-replay-attack-prevention)
    - 10.2 [OAuth Provider Security](#102-oauth-provider-security)
      - 10.2.1 [Google OAuth Configuration](#1021-google-oauth-configuration)
      - 10.2.2 [Scope Minimization (email, profile only)](#1022-scope-minimization-email-profile-only)
      - 10.2.3 [State Parameter Validation](#1023-state-parameter-validation)
    - 10.3 [Outbound Webhook Security (Future)](#103-outbound-webhook-security-future)
      - 10.3.1 [HMAC Signing for Outbound Events](#1031-hmac-signing-for-outbound-events)
      - 10.3.2 [Retry Policy with Exponential Backoff](#1032-retry-policy-with-exponential-backoff)

11. [Client-Side Security](#11-client-side-security)
    - 11.1 [Content Security Policy (CSP)](#111-content-security-policy-csp)
      - 11.1.1 [CSP Directives](#1111-csp-directives)
      - 11.1.2 [Nonce-Based Script Inclusion](#1112-nonce-based-script-inclusion)
      - 11.1.3 [Report-Only Mode for Testing](#1113-report-only-mode-for-testing)
    - 11.2 [Subresource Integrity (SRI)](#112-subresource-integrity-sri)
      - 11.2.1 [CDN Resource Integrity Checks](#1121-cdn-resource-integrity-checks)
      - 11.2.2 [Hash Generation and Validation](#1122-hash-generation-and-validation)
    - 11.3 [Service Worker Security](#113-service-worker-security)
      - 11.3.1 [Cache Poisoning Prevention](#1131-cache-poisoning-prevention)
      - 11.3.2 [Secure Cache-Control Headers](#1132-secure-cache-control-headers)
    - 11.4 [PWA-Specific Security](#114-pwa-specific-security)
      - 11.4.1 [Manifest File Security](#1141-manifest-file-security)
      - 11.4.2 [Install Prompt Hijacking Prevention](#1142-install-prompt-hijacking-prevention)
    - 11.5 [CORS Policy](#115-cors-policy)
      - 11.5.1 [Allowed Origins (app.visualsocialgraph.com only)](#1151-allowed-origins-appvisualsocialgraphcom-only)
      - 11.5.2 [Credentials Handling](#1152-credentials-handling)
      - 11.5.3 [Preflight Request Configuration](#1153-preflight-request-configuration)

12. [Incident Response & Security Operations](#12-incident-response--security-operations)
    - 12.1 [Incident Response Plan](#121-incident-response-plan)
      - 12.1.1 [Incident Classification (P0, P1, P2)](#1211-incident-classification-p0-p1-p2)
      - 12.1.2 [Response Team Roles](#1212-response-team-roles)
      - 12.1.3 [Communication Protocol](#1213-communication-protocol)
      - 12.1.4 [Post-Mortem Procedures](#1214-post-mortem-procedures)
    - 12.2 [Breach Notification Policy](#122-breach-notification-policy)
      - 12.2.1 [GDPR 72-Hour Notification Requirement](#1221-gdpr-72-hour-notification-requirement)
      - 12.2.2 [User Notification Templates](#1222-user-notification-templates)
      - 12.2.3 [Regulatory Reporting](#1223-regulatory-reporting)
    - 12.3 [Vulnerability Management](#123-vulnerability-management)
      - 12.3.1 [CVE Monitoring Process](#1231-cve-monitoring-process)
      - 12.3.2 [Dependency Scanning (npm audit, Snyk)](#1232-dependency-scanning-npm-audit-snyk)
      - 12.3.3 [Patch Management SLA](#1233-patch-management-sla)
    - 12.4 [Penetration Testing Schedule](#124-penetration-testing-schedule)
      - 12.4.1 [Annual Third-Party Pen Tests](#1241-annual-third-party-pen-tests)
      - 12.4.2 [Quarterly Internal Security Reviews](#1242-quarterly-internal-security-reviews)
      - 12.4.3 [Scope and Rules of Engagement](#1243-scope-and-rules-of-engagement)
    - 12.5 [Security Bug Bounty Program (Future)](#125-security-bug-bounty-program-future)
      - 12.5.1 [Scope and Rewards](#1251-scope-and-rewards)
      - 12.5.2 [Responsible Disclosure Policy](#1252-responsible-disclosure-policy)

13. [Deployment & Infrastructure Security](#13-deployment--infrastructure-security)
    - 13.1 [CI/CD Pipeline Security](#131-cicd-pipeline-security)
      - 13.1.1 [Secret Scanning (Pre-Commit Hooks)](#1311-secret-scanning-pre-commit-hooks)
      - 13.1.2 [Automated Security Tests](#1312-automated-security-tests)
      - 13.1.3 [Image Scanning (Docker Containers)](#1313-image-scanning-docker-containers)
    - 13.2 [Environment Separation](#132-environment-separation)
      - 13.2.1 [Production vs Staging Isolation](#1321-production-vs-staging-isolation)
      - 13.2.2 [Secret Management per Environment](#1322-secret-management-per-environment)
    - 13.3 [Database Security](#133-database-security)
      - 13.3.1 [Row-Level Security (RLS)](#1331-row-level-security-rls)
      - 13.3.2 [Least Privilege Access](#1332-least-privilege-access)
      - 13.3.3 [Connection String Encryption](#1333-connection-string-encryption)
    - 13.4 [Container Security](#134-container-security)
      - 13.4.1 [Base Image Hardening](#1341-base-image-hardening)
      - 13.4.2 [Non-Root User Execution](#1342-non-root-user-execution)
      - 13.4.3 [Read-Only Filesystems](#1343-read-only-filesystems)

14. [Compliance & Certifications](#14-compliance--certifications)
    - 14.1 [Current Compliance Status](#141-current-compliance-status)
      - 14.1.1 [GDPR Compliance](#1411-gdpr-compliance)
      - 14.1.2 [CCPA Compliance (If Applicable)](#1412-ccpa-compliance-if-applicable)
    - 14.2 [Planned Certifications](#142-planned-certifications)
      - 14.2.1 [SOC 2 Type II (Target: 2026)](#1421-soc-2-type-ii-target-2026)
      - 14.2.2 [ISO 27001 (Future)](#1422-iso-27001-future)
    - 14.3 [Third-Party Audits](#143-third-party-audits)
      - 14.3.1 [Annual Security Audits](#1431-annual-security-audits)
      - 14.3.2 [Privacy Impact Assessments (PIAs)](#1432-privacy-impact-assessments-pias)

15. [Security Training & Awareness](#15-security-training--awareness)
    - 15.1 [Developer Security Training](#151-developer-security-training)
      - 15.1.1 [Secure Coding Practices](#1511-secure-coding-practices)
      - 15.1.2 [OWASP Top 10 Awareness](#1512-owasp-top-10-awareness)
    - 15.2 [Security Champions Program](#152-security-champions-program)
    - 15.3 [Phishing Awareness Training](#153-phishing-awareness-training)

---

## 1. Introduction

### 1.1 Purpose and Scope

This document serves as the authoritative specification for all security and privacy controls implemented in the Visual Social Graph (VSG) platform. It defines:

**Security Architecture:** Authentication mechanisms, authorization models, encryption standards, and infrastructure security controls.

**Privacy Engineering:** Pseudonymization algorithms, data minimization strategies, and GDPR-compliant data handling procedures.

**Operational Security:** Incident response protocols, vulnerability management processes, and penetration testing schedules.

**Compliance Framework:** GDPR requirements, SOC 2 preparation roadmap, and third-party audit procedures.

**Scope:**
- All API endpoints defined in [VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md)
- Client-side security (browser, PWA, service workers)
- Server-side infrastructure (database, Redis, cloud services)
- Third-party integrations (Stripe, Google OAuth, Sentry)
- Development and deployment pipelines (CI/CD security)

**Out of Scope:**
- Physical security (data center access controls - managed by cloud provider)
- Social media platform OAuth (constitutionally prohibited - see C1 constraint)
- Team/organization features (deferred to Phase 3+)

### 1.2 Audience

This document is intended for:

**Primary Audience:**
- **Security Engineers:** Implement and maintain security controls
- **Backend Engineers:** Build API endpoints with security requirements
- **Frontend Engineers:** Implement client-side security (CSP, SRI, service workers)
- **DevOps Engineers:** Configure infrastructure security (TLS, KMS, RLS)

**Secondary Audience:**
- **Product Managers:** Understand security/privacy constraints on feature design
- **Legal/Compliance:** Validate GDPR compliance and data protection policies
- **External Auditors:** Assess security posture for SOC 2 certification
- **Security Researchers:** Responsible disclosure and bug bounty program

### 1.3 Document Conventions

**Security Levels:**
- **MUST / SHALL:** Mandatory requirement, non-negotiable (constitutional or compliance-driven)
- **SHOULD:** Strongly recommended, deviation requires documented justification
- **MAY:** Optional, implementation-specific decision

**Code Examples:**
- JavaScript/TypeScript code blocks show implementation guidance
- Configuration snippets (YAML, JSON) are production-ready templates
- SQL examples use parameterized queries (never raw string concatenation)

**References:**
- Internal documents: `[Document Title](file-path.md)`
- External standards: Full URLs with access date
- Line number references: `file.md:123-145` (indicates specific section)

**Threat Model Notation:**
- **Threat Actor:** Entity attempting to compromise system (external attacker, insider, etc.)
- **Attack Vector:** Method used to exploit vulnerability (IDOR, XSS, SQL injection, etc.)
- **Mitigation:** Security control that prevents or detects the attack

### 1.4 Related Documents

**Normative References (MUST be consulted):**
- [VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md) - Lines 90-156 (Authentication), 190-270 (Pseudonymization), 645-799 (Security Architecture)
- [VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md](VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md) - Lines 244-349 (Constitutional Constraints C1-C3)
- [api-specs/openapi.yaml](api-specs/openapi.yaml) - Lines 2387-2448 (Security Schemes), 3259-3298 (Error Responses)

**Informative References (contextual background):**
- [VSG_ARCHITECTURE_DOCUMENT.md](VSG_ARCHITECTURE_DOCUMENT.md) - System design and infrastructure
- [VSG_DATA_INTELLIGENCE_FRAMEWORK.md](VSG_DATA_INTELLIGENCE_FRAMEWORK.md) - Section 8 (Privacy moat, algorithm-first)
- [VSG_DESIGN_PRINCIPLE.md](VSG_DESIGN_PRINCIPLE.md) - Core principle: AI as design tool, not dependency

**External Standards:**
- GDPR (General Data Protection Regulation) - Articles 5, 15-22, 32-34
- OWASP Top 10 (2021) - https://owasp.org/Top10/
- NIST Cybersecurity Framework - https://www.nist.gov/cyberframework
- SOC 2 Trust Services Criteria - https://www.aicpa.org/soc2

### 1.5 Compliance Standards

**Current Compliance (Production-Ready):**

**GDPR Compliance:**
- **Lawful Basis:** Consent (Article 6.1.a) for all data processing
- **Data Minimization:** Only pseudonymized graph structures stored (Article 5.1.c)
- **Right to Erasure:** Dual deletion modes (soft/hard) with 90-day backup purge (Article 17)
- **Data Portability:** JSON export of all user data via `/api/account/data-export` (Article 20)
- **Breach Notification:** 72-hour notification to supervisory authority (Article 33)
- **Privacy by Design:** 80% client-side processing, day-level timestamps (Article 25)

**Planned Certifications:**

**SOC 2 Type II (Target: Q4 2026):**
- **Security:** TLS 1.3, CSRF protection, HMAC-SHA256 pseudonymization
- **Availability:** 99.5% uptime SLA (Creator tier), auto-scaling, multi-region deployment
- **Processing Integrity:** Deterministic insights, reproducible algorithms, audit logging
- **Confidentiality:** AES-256-GCM at rest, httpOnly cookies, KMS key management
- **Privacy:** GDPR compliance (see above), data retention policies, user consent management

**ISO 27001 (Future):**
- Information Security Management System (ISMS)
- Risk assessment and treatment plan
- Annual recertification audits

---

## 2. Security Architecture Overview

### 2.1 Core Security Principles

Visual Social Graph's security architecture is built on five foundational principles:

**1. Privacy-First by Design (Constitutional Principle)**

Every architectural decision prioritizes user privacy over convenience or feature richness.

**Implementation:**
- **Client-side processing:** 80% of graph analysis happens in browser (no server access to raw data)
- **Server never stores PII:** Display names and usernames remain client-only (IndexedDB)
- **Pseudonymization at boundary:** HMAC-SHA256 keyed hashing before any server storage
- **Day-level timestamps:** Prevents temporal correlation attacks (YYYY-MM-DD granularity)

**Rationale:** Even if server database is compromised, attacker cannot identify individuals without client-side label mapping (which they don't have).

**2. Defense in Depth (Layered Security)**

No single point of failure; multiple security controls protect each asset.

**Example (Session Protection):**
- **Layer 1:** TLS 1.3 transport encryption (prevents network sniffing)
- **Layer 2:** httpOnly cookies (prevents XSS session theft)
- **Layer 3:** CSRF double-submit tokens (prevents session riding)
- **Layer 4:** JWT signature validation (prevents token forgery)
- **Layer 5:** 24-hour expiry (limits compromise window)

**3. Least Privilege (Minimum Necessary Access)**

Users and services granted minimum permissions required for functionality.

**Implementation:**
- **Database access:** Read replicas for read-heavy operations (no write access)
- **API keys:** Creator tier API keys scoped to user's own resources only (no admin access)
- **Cloud IAM:** Each microservice has dedicated service account with minimal permissions
- **Row-Level Security:** PostgreSQL RLS policies enforce user isolation at database layer

**4. Zero Trust (Assume Breach)**

Design assumes adversary already has network access; authentication required at every layer.

**Implementation:**
- **Internal APIs:** Even internal service-to-service calls use JWT authentication
- **Database connections:** TLS-encrypted even within VPC (no plaintext internal traffic)
- **Secrets management:** All secrets fetched from KMS at runtime (never stored in code)
- **Audit logging:** All privileged actions logged (immutable audit trail)

**5. Fail Secure (Errors Don't Compromise Security)**

System defaults to secure state when errors occur.

**Implementation:**
- **Authentication failures:** Session invalidated, user must re-authenticate (no graceful degradation)
- **CSRF validation failure:** Request rejected with 403 (no bypass)
- **Webhook signature mismatch:** Event discarded, logged for investigation (no processing)
- **Rate limit exceeded:** Request blocked, attacker IP flagged (no warnings)

---

### 2.2 Constitutional Constraints (C1-C3)

These architectural constraints are **constitutional** - they cannot be violated without invalidating the entire security model. Violations trigger automated CI/CD failures.

**C1: No Account Access (Privacy Moat)**

**Constraint:** System SHALL NOT implement OAuth for social media platforms (Twitter, Instagram, LinkedIn, Facebook, TikTok).

**Rationale:**
- Eliminates entire attack surface (no OAuth token compromise)
- No server-side API access to platforms (no data leakage risk)
- User uploads archives manually (full control over data sharing)

**CI/CD Enforcement:**
```bash
# Pre-commit hook checks for prohibited OAuth implementations
grep -r "twitter.*oauth\|instagram.*oauth\|facebook.*oauth" backend/ && exit 1
```

**Alternative Solution:**
- Users download archive from platform (e.g., Twitter's "Download your data")
- Client-side JavaScript parses archive (browser-only processing)
- Only pseudonymized graph structure sent to server (no raw content)

**C2: User Data Ownership (Data Minimization)**

**Constraint:** Server SHALL NOT store raw social media content, display names, usernames, or private messages.

**What We Store:**
- ✅ Pseudonymized graph structure (node IDs, edge relationships)
- ✅ Aggregate metrics (degree, centrality scores)
- ✅ Platform type (twitter, instagram, etc.)
- ✅ Day-level timestamps (YYYY-MM-DD)

**What We DON'T Store:**
- ❌ Display names ("Jane Doe")
- ❌ Usernames ("@janedoe")
- ❌ Tweet content or Instagram captions
- ❌ Private messages or DMs
- ❌ Profile photos or avatars

**Data Lifecycle:**
1. **Client:** User uploads archive → browser parses → constructs graph inputs; labels stored in IndexedDB (client-only)
2. **Network:** Client sends **original platform IDs only** (no display names/usernames) to `POST /api/graphs` over TLS
3. **Server:** **Pseudonymizes IDs server-side** (HMAC-SHA256) → stores pseudonymized graph → deletes any transient raw artifacts
4. **Deletion:** User deletes graph/account → cascade delete + backup purge within 90 days

**C3: Client-Side Processing (80% Rule)**

**Constraint:** At least 80% of computational processing SHALL occur in browser/client.

**Rationale:**
- Reduces server exposure to user data (privacy benefit)
- Eliminates attack surface (less server-side code = fewer vulnerabilities)
- Scales horizontally for free (computation distributed across user devices)

**Server-Side (20% Maximum):**
- ✅ Algorithm-powered insights (deterministic, no AI required)
- ✅ Historical graph comparisons (cross-snapshot analysis)
- ✅ PDF/PNG export generation (visual rendering)

**Client-Side (80% Minimum):**
- ✅ Archive parsing (ZIP extraction, JSON parsing)
- ✅ Graph construction (node/edge deduplication, validation)
- ✅ Metrics computation (degree, PageRank, betweenness centrality)
- ✅ Visualization rendering (force-directed layout, canvas drawing)

**Measurement:**
- Tracked via telemetry (client compute time vs server compute time)
- Quarterly audit to ensure compliance

---

### 2.3 Privacy-First Design Philosophy

**Design Principle:** "The best data protection is not collecting data in the first place."

**Privacy Moat Strategy:**

Visual Social Graph creates a "privacy moat" around user data through architectural barriers that make de-anonymization infeasible even if server is fully compromised.

**Moat Layer 1: Boundary Pseudonymization at Ingestion (Server-Side)**

At the ingestion boundary (when client uploads graph):
- Client sends original user IDs to server via `POST /api/graphs`
- Server pseudonymizes IDs using HMAC-SHA256 with per-user secret key (server-side only)
- Display names and usernames stored only in browser IndexedDB (never transmitted)
- Result: Server persists graph of pseudonym IDs with no human-readable labels

**Moat Layer 2: Server-Side Key Management**

Server holds pseudonymization keys but never exposes them:
- Keys generated once at account creation (256-bit CSPRNG)
- Keys encrypted at rest (AES-256-GCM with cloud KMS)
- Keys deleted immediately on account deletion (makes historical pseudonyms unlinkable)

**Moat Layer 3: Deterministic Mapping**

Same user always gets same pseudonym ID across uploads:
- Enables graph evolution tracking (Jan snapshot vs Mar snapshot)
- Preserves privacy (no reverse-engineering possible without key)

**Moat Layer 4: Day-Level Timestamp Granularity**

All user-facing timestamps truncated to day-level (YYYY-MM-DD):
- Prevents temporal correlation attacks (can't match to exact posting time)
- Sufficient for longitudinal analysis (week/month trends preserved)
- Full ISO 8601 timestamps only for server-internal audit logs (90-day retention)

**Threat Scenarios Mitigated:**

**Scenario 1: Database Breach**
- Attacker downloads entire PostgreSQL database
- Impact: Attacker sees pseudonymized graphs (node IDs like `node_a3f2b8c...`)
- Cannot identify individuals: No display names, usernames, or reverse-engineering path
- Cannot correlate to social media: Day-level timestamps prevent exact time matching

**Scenario 2: Server Compromise**
- Attacker gains root access to application server
- Impact: Can read pseudonymization keys from memory/KMS
- Cannot de-pseudonymize: Keys alone are useless without client-side label mapping (which attacker doesn't have)
- Cannot reconstruct labels: Display names never transmitted to server

**Scenario 3: Man-in-the-Middle (MITM)**
- Attacker intercepts TLS traffic (e.g., compromised CA)
- Impact: Sees pseudonymized graph in transit
- Cannot identify individuals: Same as database breach (no PII in payload)

---

### 2.4 Trust Boundaries and Threat Model

**Trust Boundaries:**

**Boundary 1: Client ↔ Server**
- **Trusted:** User's browser (client-side JavaScript)
- **Untrusted:** Network, server, cloud infrastructure
- **Control:** TLS 1.3 encryption, CSRF tokens, HMAC pseudonymization

**Boundary 2: Application ↔ Database**
- **Trusted:** Application logic (backend API server)
- **Untrusted:** Database (assume breach possible)
- **Control:** Parameterized queries, row-level security, encrypted columns

**Boundary 3: Internal Services ↔ Third-Party**
- **Trusted:** VSG backend services
- **Untrusted:** Stripe (payment), Google OAuth, Sentry (error tracking)
- **Control:** HMAC webhook verification, OAuth state validation, PII scrubbing

**Threat Model Summary:**

(See [Appendix B: Threat Model](#appendix-b-threat-model) for complete analysis)

**Crown Jewel Assets:**
1. User pseudonymization keys (compromise = privacy breach)
2. JWT signing secrets (compromise = authentication bypass)
3. Stripe API keys (compromise = payment fraud)
4. Database credentials (compromise = full data access)

**Threat Actors:**
- **External Attackers (Opportunistic):** Automated vulnerability scanning, known exploits
- **External Attackers (Targeted):** Custom exploits, 0-days, social engineering
- **Insider Threats (Malicious):** Data exfiltration, privilege abuse
- **Insider Threats (Negligent):** Credential leakage, misconfiguration

**Primary Attack Vectors:**
1. Authentication Bypass (JWT secret compromise, magic link prediction)
2. Data Exfiltration (IDOR exploitation, SQL injection)
3. Privacy De-Anonymization (rainbow tables, timing attacks)
4. Payment Fraud (webhook spoofing, Stripe API key theft)
5. Client-Side Attacks (XSS, clickjacking, service worker hijacking)

---

### 2.5 Security Lifecycle

**Phase 1: Design (Before Code)**

**Threat Modeling:**
- STRIDE analysis for each new feature (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
- Data flow diagrams with trust boundaries
- Attack tree analysis for high-value assets

**Security Requirements:**
- Defined in PRD (Product Requirements Document)
- Reviewed by security team before engineering kickoff
- Acceptance criteria include security controls

**Phase 2: Development (During Code)**

**Secure Coding Practices:**
- OWASP Top 10 training for all engineers (annual refresh)
- Security champions program (one per team)
- Pre-commit hooks (secret scanning, linting for security anti-patterns)

**Code Review Checklist:**
- Authentication/authorization checks on all endpoints
- Input validation with whitelisting (not blacklisting)
- Parameterized SQL queries (ORM encouraged)
- No hardcoded secrets (environment variables only)
- See [Appendix C: Security Checklists](#appendix-c-security-checklists)

**Phase 3: Testing (Before Deployment)**

**Automated Security Testing:**
- SAST (Static Application Security Testing) - CodeQL, Semgrep
- DAST (Dynamic Application Security Testing) - OWASP ZAP
- Dependency scanning - npm audit, Snyk, Dependabot
- Container scanning - Trivy, Clair

**Manual Security Testing:**
- Quarterly internal security reviews (penetration testing lite)
- Annual third-party penetration tests (CREST certified)
- See [Section 12.4: Penetration Testing Schedule](#124-penetration-testing-schedule)

**Phase 4: Deployment (Production)**

**Infrastructure Security:**
- Immutable infrastructure (no SSH access to prod servers)
- Zero-trust networking (mTLS between services)
- Secrets management (AWS Secrets Manager, GCP Secret Manager)
- TLS 1.3 enforcement (HSTS preload)

**Monitoring & Alerting:**
- Failed authentication attempts (>10/minute → alert)
- Unusual API access patterns (heuristic-based anomaly detection with optional ML augmentation)
- Security events logged to immutable SIEM (90-day retention)

**Phase 5: Operations (Ongoing)**

**Incident Response:**
- See [Section 12.1: Incident Response Plan](#121-incident-response-plan)
- P0 incidents: <1 hour response time
- GDPR breach notification: <72 hours to supervisory authority

**Vulnerability Management:**
- CVE monitoring (daily Snyk scans)
- Patch SLA: Critical (7 days), High (30 days), Medium (90 days)
- Emergency patches (0-day): <24 hours

**Security Training:**
- Annual OWASP Top 10 training (mandatory)
- Quarterly phishing simulations (90% pass rate target)
- See [Section 15: Security Training & Awareness](#15-security-training--awareness)

---

## 3. Authentication & Authorization

### 3.1 Authentication Mechanisms

Visual Social Graph implements four distinct authentication mechanisms, each optimized for specific use cases and security requirements.

#### 3.1.1 Magic Link Authentication (PRIMARY)

**Overview:**

Magic Link authentication provides passwordless login via email-delivered one-time tokens. This eliminates password-related attack vectors (credential stuffing, brute force, password reuse).

**Security Specifications:**

**Token Format:**
- **Prefix**: `mlt_` (magic link token)
- **Length**: 256 bits (Base64-encoded, ~43 characters)
- **Generation**: Cryptographically secure random number generator (CSPRNG)
- **Example**: `mlt_abc123def456...xyz789`

**Token Lifecycle:**
- **Expiration**: 15 minutes from generation
- **Single-Use**: Invalidated immediately after successful verification
- **Storage**: PostgreSQL `magic_link_tokens` table with indexed expiry timestamp
- **Cleanup**: Expired tokens purged every 1 hour via cron job

**Rate Limiting:**
- **Limit**: 5 requests per email per hour (prevents email flooding)
- **Enforcement**: Token bucket algorithm with Redis-backed counters
- **Response**: `429 Too Many Requests` with `Retry-After` header

**Implementation Flow:**

**Step 1: Token Request**
```http
POST /api/auth/magic-link HTTP/1.1
Host: visualsocialgraph.com
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Server Actions:**
1. Validate email format (RFC 5322)
2. Check rate limit (5/hour per email)
3. Generate 256-bit CSPRNG token
4. Store token with 15-minute expiry in database
5. Send email via async queue (Resend)
6. Return `200 OK` immediately (don't reveal if email exists)

**Step 2: Email Delivery**
```
Subject: Log in to Visual Social Graph

Click the link below to log in (expires in 15 minutes):

https://visualsocialgraph.com/auth/verify?token=mlt_abc123...

This link can only be used once. If you didn't request this, ignore this email.
```

**Step 3: Token Verification (POST Body Transmission)**

**CRITICAL SECURITY REQUIREMENT:** Token MUST be transmitted via POST body, NOT URL path, to prevent token leakage.

**Why POST Body (vs URL Path):**
- **Server Logs**: Tokens in URL paths logged by web servers, proxies, CDNs
- **Referrer Headers**: Tokens leaked to third-party sites if user navigates away
- **Browser History**: Tokens stored in browser history (XSS risk)

**Frontend Flow:**
```javascript
// User clicks: https://visualsocialgraph.com/auth/verify?token=mlt_abc123...
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// IMMEDIATELY clear token from URL (prevent history leakage)
window.history.replaceState({}, '', '/auth/verify');

// Submit token via POST body (NOT in URL)
const response = await fetch('/api/auth/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token })
});

if (response.ok) {
  // Server sets vsg_session and vsg_csrf cookies
  window.location.href = '/dashboard';
}
```

**API Endpoint:**
```http
POST /api/auth/verify HTTP/1.1
Host: visualsocialgraph.com
Content-Type: application/json

{
  "token": "mlt_abc123..."
}
```

**Server Verification Logic:**
```python
def verify_magic_link(token: str) -> User:
    # 1. Lookup token in database
    record = db.query(MagicLinkToken).filter_by(token=token).first()

    # 2. Validate token exists and not expired
    if not record or record.expires_at < datetime.utcnow():
        raise InvalidTokenError("Token invalid, expired, or already used")

    # 3. Validate single-use (check if already consumed)
    if record.used_at is not None:
        raise InvalidTokenError("Token already used")

    # 4. Mark token as used (prevent replay)
    record.used_at = datetime.utcnow()
    db.commit()

    # 5. Return user for session creation
    return record.user
```

**Response:**
```json
{
  "ok": true,
  "redirectUrl": "/dashboard"
}
```

**Server Actions on Success:**
1. Validate token (exists, not expired, not used)
2. Mark token as used (prevent replay attacks)
3. Create JWT session (see [Section 3.2](#32-session-management))
4. Generate CSRF token (see [Section 3.3](#33-csrf-protection))
5. Set cookies: `vsg_session` (httpOnly), `vsg_csrf` (readable by JS)
6. Return redirect URL

**Error Responses:**
- `400 Bad Request` + `INVALID_TOKEN`: Expired, already used, or malformed
- `429 Too Many Requests`: Rate limit exceeded

**Audit Logging:**
```json
{
  "event": "magic_link_verified",
  "userId": "user_01J...",
  "email_hash": "sha256:a3f5e8c2b1d4f6a9e7c3b5d8f2a1c4e6b9d7f3a5c8e2b4d6f1a9c7e5b3d8f6a2",
  "ip_prefix": "203.0.113.xxx",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-12-27T10:30:00Z",
  "success": true
}
```

**Threat Scenarios Mitigated:**

**Scenario 1: Token Leakage via Server Logs**
- **Attack**: Attacker accesses web server logs containing URLs with tokens
- **Mitigation**: Tokens transmitted via POST body (never in URL paths)

**Scenario 2: Referrer Header Leakage**
- **Attack**: User clicks external link, token leaked in `Referer` header
- **Mitigation**: Frontend immediately clears token from URL using `history.replaceState`

**Scenario 3: Replay Attacks**
- **Attack**: Attacker intercepts token, attempts reuse after victim logs in
- **Mitigation**: Single-use tokens (marked as used in database after verification)

**Scenario 4: Brute Force Token Guessing**
- **Attack**: Attacker generates random tokens, attempts verification
- **Mitigation**: 256-bit CSPRNG tokens (2^256 possible values), 15-minute expiry, rate limiting

---

#### 3.1.2 Google OAuth Authentication

**Overview:**

Google OAuth provides federated authentication for users with Google accounts. VSG uses OAuth exclusively for authentication (identity verification), NOT for accessing user's Google data.

**Security Specifications:**

**OAuth Scopes (Minimal):**
```
openid email profile
```

**Scope Rationale:**
- `openid`: Required for OpenID Connect (OIDC) identity token
- `email`: Email address for account creation/matching
- `profile`: Display name and profile photo (optional, client-side only)

**NO Additional Scopes:**
- ❌ Google Drive access
- ❌ Gmail access
- ❌ Calendar access
- ❌ Contacts access

**OAuth Flow (Authorization Code Grant):**

**Step 1: Frontend Initiates OAuth (Client-Side Redirect)**

> **IMPORTANT:** The frontend redirects directly to Google's OAuth consent screen. There is **NO** `/api/auth/google` endpoint on the VSG server. The `state` parameter is generated client-side and validated server-side during the callback.

**Frontend Action (JavaScript):**
```javascript
// 1. Generate cryptographic state parameter (client-side)
const state = crypto.randomUUID(); // Or crypto.getRandomValues()
sessionStorage.setItem('oauth_state', state);

// 2. Redirect directly to Google (NO VSG server call)
window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=123456789.apps.googleusercontent.com&` +
  `redirect_uri=${encodeURIComponent('https://visualsocialgraph.com/api/auth/google/callback')}&` +
  `response_type=code&` +
  `scope=openid email profile&` +
  `state=${state}&` +
  `access_type=offline&` +
  `prompt=select_account`;
```

**Step 2: User Consents on Google**

User sees OAuth consent screen:
```
Visual Social Graph wants to:
✓ Know who you are on Google
✓ See your email address
✓ See your basic profile info

[Cancel] [Allow]
```

**Step 3: OAuth Callback**

After user clicks "Allow", Google redirects back to VSG:
```http
GET /api/auth/google/callback?code=4/0AY...&state=abc123... HTTP/1.1
Host: visualsocialgraph.com
```

**Server Validation (CRITICAL):**
```python
def handle_oauth_callback(code: str, state: str):
    # 1. Validate state parameter (CSRF protection)
    stored_state = redis.get(f"oauth_state:{state}")
    if not stored_state or stored_state != state:
        raise OAuthStateValidationError("Invalid state parameter")

    # 2. Delete state (single-use)
    redis.delete(f"oauth_state:{state}")

    # 3. Exchange authorization code for tokens
    token_response = requests.post(
        'https://oauth2.googleapis.com/token',
        data={
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': 'https://visualsocialgraph.com/api/auth/google/callback',
            'grant_type': 'authorization_code'
        }
    )

    # 4. Verify ID token signature (Google public keys)
    id_token = token_response['id_token']
    claims = verify_google_id_token(id_token)

    # 5. Extract user info
    email = claims['email']
    email_verified = claims['email_verified']

    if not email_verified:
        raise OAuthError("Email not verified by Google")

    # 6. Find or create user
    user = db.query(User).filter_by(email=email).first()
    if not user:
        user = create_user(email=email, auth_provider='google')

    # 7. Create session
    return create_session(user)
```

**Step 4: Session Creation**

Server creates JWT session and redirects to dashboard (same as Magic Link flow).

**Security Controls:**

**State Parameter Validation:**
- **Purpose**: Prevent CSRF attacks on OAuth flow
- **Implementation**: Generate random 128-bit value, store in Redis with 10-minute TTL
- **Validation**: Compare callback `state` with stored value (must match exactly)
- **Single-Use**: Delete state after validation (prevent replay)

**ID Token Verification:**
- **Algorithm**: RS256 (Google's public key signature)
- **Validation**:
  - Signature valid (using Google's JWKS endpoint)
  - `iss` claim equals `https://accounts.google.com`
  - `aud` claim matches VSG's OAuth client ID
  - `exp` claim not expired
  - `email_verified` claim is `true`

**Redirect URI Validation:**
- **Allowed URIs**: Exact match only (no wildcard subdomains)
- **Configuration**: Set in Google Cloud Console OAuth credentials
- **Example**: `https://visualsocialgraph.com/api/auth/google/callback` (production)

**Client Secret Protection:**
- **Storage**: Environment variable or KMS-encrypted secret
- **Rotation**: Every 90 days
- **Access**: Server-side only (never exposed to client)

**Rate Limiting:**
- **Limit**: 10 OAuth initiation requests per IP per hour
- **Enforcement**: Token bucket algorithm

**Audit Logging:**
```json
{
  "event": "oauth_callback_success",
  "userId": "user_01J...",
  "provider": "google",
  "email_hash": "sha256:a3f5e8c2b1d4f6a9e7c3b5d8f2a1c4e6b9d7f3a5c8e2b4d6f1a9c7e5b3d8f6a2",
  "emailVerified": true,
  "ip_prefix": "203.0.113.xxx",
  "timestamp": "2025-12-27T10:35:00Z"
}
```

**Threat Scenarios Mitigated:**

**Scenario 1: OAuth CSRF Attack**
- **Attack**: Attacker tricks victim into authorizing attacker's Google account
- **Mitigation**: `state` parameter validation (cryptographic CSRF token)

**Scenario 2: Authorization Code Interception**
- **Attack**: Attacker intercepts authorization code in redirect
- **Mitigation**: Authorization code single-use, short-lived (10 minutes), requires `client_secret` to exchange

**Scenario 3: ID Token Forgery**
- **Attack**: Attacker creates fake ID token with victim's email
- **Mitigation**: RS256 signature verification using Google's public keys

---

#### 3.1.3 Cookie-Based JWT Sessions

**Overview:**

After successful authentication (Magic Link or OAuth), VSG creates a stateless JWT session stored in an httpOnly cookie. This is the PRIMARY session mechanism for all subsequent API requests.

**JWT Specifications:**

**Algorithm:**
- **HS256** (HMAC with SHA-256)
- **Rationale**: Symmetric signing (server-only verification), no public key distribution

**JWT Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**JWT Payload:**
```json
{
  "sub": "user_01J...",           // Subject (user ID - ULID)
  "email": "user@example.com",
  "tier": "pro",                   // Subscription tier (free|pro|creator)
  "iat": 1735296000,               // Issued at (Unix timestamp)
  "exp": 1735382400                // Expires at (iat + 24 hours)
}
```

**JWT Secret:**
- **Length**: 256 bits (32 bytes, Base64-encoded)
- **Generation**: CSPRNG on application deployment
- **Storage**: Environment variable (`JWT_SECRET`) or AWS Secrets Manager
- **Rotation**: Every 90 days (graceful rotation with dual-key validation)

**Cookie Attributes:**

```http
Set-Cookie: vsg_session=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/
```

**Attribute Breakdown:**

| Attribute | Value | Security Purpose |
|-----------|-------|------------------|
| `HttpOnly` | `true` | Prevents JavaScript access (XSS mitigation) |
| `Secure` | `true` | HTTPS-only transmission (prevents cleartext leakage) |
| `SameSite` | `Lax` | CSRF protection (cookies not sent on cross-site POST) |
| `Max-Age` | `86400` | 24-hour session lifetime (1 day in seconds) |
| `Path` | `/` | Cookie sent for all paths under domain |
| `Domain` | *not set* | Defaults to current domain only (no subdomain sharing) |

**Session Lifecycle:**

**Session Creation (on successful authentication):**
```python
def create_session(user: User) -> str:
    # 1. Generate JWT payload
    payload = {
        'sub': user.id,
        'email': user.email,
        'tier': user.subscription_tier,
        'iat': int(time.time()),
        'exp': int(time.time()) + 86400  # 24 hours
    }

    # 2. Sign JWT with HS256
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    # 3. Set cookie in response
    response.set_cookie(
        key='vsg_session',
        value=token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=86400
    )

    return token
```

**Session Validation (on every API request):**
```python
def validate_session(request) -> User:
    # 1. Extract JWT from cookie
    token = request.cookies.get('vsg_session')
    if not token:
        raise UnauthenticatedError("No session cookie present")

    # 2. Verify JWT signature and expiry
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise UnauthenticatedError("Session expired")
    except jwt.InvalidTokenError:
        raise UnauthenticatedError("Invalid session token")

    # 3. Extract user ID and load user
    user_id = payload['sub']
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise UnauthenticatedError("User not found")

    # 4. Optionally check if user is active/not deleted
    if user.deleted_at is not None:
        raise UnauthenticatedError("Account deleted")

    return user
```

**Session Expiry & Renewal:**

**Expiration:**
- **Hard Expiry**: 24 hours from issuance (`exp` claim)
- **No Sliding Window**: Session DOES NOT auto-refresh on each request (prevents indefinite sessions)
- **User Action Required**: Re-authenticate after 24 hours

**Manual Session Refresh (Optional Endpoint):**
```http
POST /api/auth/refresh HTTP/1.1
Cookie: vsg_session=eyJhbGc...
```

**Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: vsg_session=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400
```

**Server Logic:**
- Validate existing session (not expired)
- Issue new JWT with fresh `iat` and `exp` (new 24-hour window)
- Return new cookie

**Session Termination (Logout):**
```http
POST /api/auth/logout HTTP/1.1
Cookie: vsg_session=eyJhbGc...
```

**Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: vsg_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/
```

**Server Actions:**
1. Clear session cookie (set `Max-Age=0`)
2. Optionally add JWT `jti` (token ID) to revocation blocklist in Redis (TTL = remaining session lifetime)
3. Clear CSRF token cookie

**JWT Secret Rotation:**

**Rotation Schedule**: Every 90 days

**Graceful Rotation Strategy (Dual-Key Validation):**
```python
# Step 1: Generate new secret, keep old secret active
JWT_SECRET_OLD = os.getenv('JWT_SECRET')
JWT_SECRET_NEW = generate_csprng_secret()  # Store as JWT_SECRET_NEW

# Step 2: For 24 hours, accept BOTH secrets for verification
def validate_session_dual_key(token: str):
    try:
        return jwt.decode(token, JWT_SECRET_NEW, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        # Fallback to old secret (allows existing sessions to remain valid)
        return jwt.decode(token, JWT_SECRET_OLD, algorithms=['HS256'])

# Step 3: After 24 hours (all old sessions expired), remove old secret
# JWT_SECRET = JWT_SECRET_NEW (only new secret used)
```

**Why 24-Hour Dual-Key Window:**
- Existing sessions remain valid during rotation (no forced logout)
- After 24 hours, all old sessions naturally expire (Max-Age=86400)
- New sessions use only new secret

**Audit Logging:**
```json
{
  "event": "session_created",
  "userId": "user_01J...",
  "sessionId": "sess_01J...",
  "ip_prefix": "203.0.113.xxx",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-12-27T10:40:00Z"
}
```

**Threat Scenarios Mitigated:**

**Scenario 1: XSS Session Theft**
- **Attack**: Attacker injects malicious script to steal session cookie
- **Mitigation**: `HttpOnly` attribute prevents JavaScript access to cookie

**Scenario 2: Session Hijacking (MITM)**
- **Attack**: Attacker intercepts session cookie over unencrypted connection
- **Mitigation**: `Secure` attribute ensures cookie only transmitted over HTTPS

**Scenario 3: CSRF via Cookie**
- **Attack**: Attacker tricks user into making authenticated request to VSG
- **Mitigation**: `SameSite=Lax` + CSRF token validation (see [Section 3.3](#33-csrf-protection))

**Scenario 4: JWT Secret Compromise**
- **Attack**: Attacker obtains JWT secret, forges arbitrary session tokens
- **Mitigation**:
  - Secret stored in secure environment variables/KMS (not in code)
  - 90-day rotation schedule limits compromise window
  - Secret compromise triggers immediate rotation + all session invalidation

---

#### 3.1.4 Bearer Token Authentication (Creator Tier)

**Overview:**

Creator tier users can generate long-lived API keys for programmatic access (non-browser clients, automation, integrations). Bearer tokens provide an alternative to cookie-based authentication.

**Use Cases:**
- Server-to-server API calls
- CI/CD automation scripts
- API testing tools (Postman, curl, Insomnia)
- Third-party integrations (Zapier, custom scripts)

**Token Format:**

**Structure:**
```
vsg_live_sk_<32-character-base62-string>
```

**Example:**
```
vsg_live_sk_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6
```

**Format Breakdown:**
- `vsg`: Vendor prefix (Visual Social Graph)
- `live`: Environment (`live` for production, `test` for sandbox)
- `sk`: Secret key identifier
- Base62 encoding: `[A-Za-z0-9]` (URL-safe, no special characters)

**Token Generation:**

**Dashboard Flow:**
1. User navigates to `/settings/api-keys` (Creator tier only)
2. User clicks "Generate New API Key"
3. Server generates 256-bit CSPRNG token
4. Server hashes token with bcrypt (cost factor 12) for storage
5. Server displays plaintext token ONCE (user must copy immediately)
6. Token never displayed again (only last 4 characters shown: `...o5P6`)

**Generation Code:**
```python
def generate_api_key(user: User) -> str:
    # 1. Verify user is Creator tier
    if user.subscription_tier != 'creator':
        raise PermissionDeniedError("API keys only available for Creator tier")

    # 2. Check API key limit (max 5 keys per user)
    existing_keys = db.query(APIKey).filter_by(user_id=user.id, revoked_at=None).count()
    if existing_keys >= 5:
        raise QuotaExceededError("Maximum 5 API keys per user")

    # 3. Generate random token (256 bits)
    random_bytes = secrets.token_bytes(32)
    base62_token = base62_encode(random_bytes)

    # 4. Format token
    token = f"vsg_live_sk_{base62_token}"

    # 5. Hash token for storage (bcrypt, cost 12)
    token_hash = bcrypt.hashpw(token.encode(), bcrypt.gensalt(rounds=12))

    # 6. Store in database
    api_key = APIKey(
        user_id=user.id,
        token_hash=token_hash,
        last_4=base62_token[-4:],  # For display only
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=90)
    )
    db.add(api_key)
    db.commit()

    # 7. Return plaintext token (ONLY time it's displayed)
    return token
```

**Token Storage:**

**Database Schema (`api_keys` table):**
```sql
CREATE TABLE api_keys (
    id VARCHAR(32) PRIMARY KEY,  -- ULID: apikey_01J...
    user_id VARCHAR(32) NOT NULL REFERENCES users(id),
    token_hash VARCHAR(60) NOT NULL,  -- bcrypt hash (60 chars)
    last_4 VARCHAR(4) NOT NULL,       -- For display: "...o5P6"
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,    -- 90 days from creation
    last_used_at TIMESTAMP,
    revoked_at TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

**Why bcrypt (vs plaintext storage):**
- **Database Breach Protection**: Attacker cannot use API keys if database compromised
- **One-Way Hash**: Cannot reverse bcrypt hash to recover plaintext token
- **Adaptive Cost**: Cost factor 12 provides ~250ms verification time (acceptable for API auth)

**Token Usage:**

**HTTP Request Example:**
```http
GET /api/graphs HTTP/1.1
Host: visualsocialgraph.com
Authorization: Bearer vsg_live_sk_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6
Content-Type: application/json
```

**Server Validation:**
```python
def validate_bearer_token(token: str) -> User:
    # 1. Extract token from Authorization header
    if not token.startswith('vsg_live_sk_'):
        raise InvalidTokenError("Invalid API key format")

    # 2. Query all active API keys (not expired, not revoked)
    active_keys = db.query(APIKey).filter(
        APIKey.expires_at > datetime.utcnow(),
        APIKey.revoked_at == None
    ).all()

    # 3. Compare token against bcrypt hashes (constant-time comparison)
    for api_key in active_keys:
        if bcrypt.checkpw(token.encode(), api_key.token_hash):
            # 4. Update last_used_at timestamp (async, non-blocking)
            api_key.last_used_at = datetime.utcnow()
            db.commit()

            # 5. Return user
            return api_key.user

    # 6. No match found
    raise InvalidTokenError("Invalid or expired API key")
```

**Token Expiration:**
- **Lifetime**: 90 days from creation
- **No Auto-Renewal**: User must generate new token after expiry
- **Email Notification**: 7 days before expiry, email sent to user

**Token Revocation:**

**Manual Revocation (User Action):**
```http
DELETE /api/account/api-keys/{keyId} HTTP/1.1
Cookie: vsg_session=eyJhbGc...
```

**Server Actions:**
1. Verify user owns API key
2. Set `revoked_at` timestamp (soft delete)
3. Return `200 OK`

**Automatic Revocation Triggers:**
- User downgrades from Creator tier → All API keys revoked
- Account deletion → All API keys revoked
- Suspicious activity detected (see [Section 9.3: Anomaly Detection](#93-anomaly-detection))

**Rate Limiting:**

**Per-Token Limits:**
- **GET requests**: 1000 requests/hour
- **POST /api/graphs**: 500 requests/day
- **POST /api/insights**: Unlimited (Creator tier)
- **POST /api/exports/pdf**: 200 requests/day

**Enforcement**: Token bucket algorithm with Redis-backed counters keyed by `api_key_id`

**Security Controls:**

**CSRF Protection: NOT Required**
- Tokens not auto-sent by browsers (unlike cookies)
- Attacker cannot trigger authenticated API requests via victim's browser

**Token Leakage Prevention:**
- **Client-Side Code**: Never embed API keys in frontend JavaScript (server-side only)
- **Version Control**: `.gitignore` rules block `.env` files containing keys
- **Logging**: API keys redacted in logs (only last 4 characters logged: `...o5P6`)

**Audit Logging:**
```json
{
  "event": "api_key_used",
  "userId": "user_01J...",
  "apiKeyId": "apikey_01J...",
  "endpoint": "GET /api/graphs",
  "ip_prefix": "203.0.113.xxx",
  "userAgent": "python-requests/2.28.1",
  "timestamp": "2025-12-27T10:45:00Z"
}
```

**Threat Scenarios Mitigated:**

**Scenario 1: API Key Exposure in Version Control**
- **Attack**: Developer commits `.env` file with API key to public GitHub repo
- **Mitigation**:
  - GitHub secret scanning alerts (automatic for `vsg_*` prefix)
  - Key rotation procedure (revoke old, generate new)
  - `.gitignore` enforcement in CI/CD

**Scenario 2: Database Breach**
- **Attack**: Attacker dumps `api_keys` table from database
- **Mitigation**: bcrypt hashing prevents plaintext recovery (attacker cannot use keys)

**Scenario 3: Key Reuse After Expiry**
- **Attack**: Attacker attempts to use expired API key
- **Mitigation**: Validation checks `expires_at` timestamp (reject if expired)

---

### 3.2 Session Management

**Overview:**

Visual Social Graph uses JWT-based session management with secure HTTP-only cookies. Sessions are stateless (no server-side storage), with a 24-hour hard expiry to balance security and user experience.

**Session Token Format:**

Sessions use **JSON Web Tokens (JWT)** signed with **HS256 (HMAC-SHA256)**:

```json
{
  "sub": "user_01JBQR7X9K2P3M4N5Q6R7S8T9V",
  "tier": "Free",
  "iat": 1703745600,
  "exp": 1703832000
}
```

**JWT Payload Claims:**

| Claim | Description | Example Value |
|-------|-------------|---------------|
| `sub` | User ID (ULID format) | `user_01JBQR7X9K...` |
| `tier` | Subscription tier | `Free`, `Creator`, `Pro` |
| `iat` | Issued At (Unix timestamp) | `1703745600` |
| `exp` | Expiration (Unix timestamp, +24 hours) | `1703832000` |

> **PRIVACY NOTE:** The JWT payload does NOT include the user's email address or any other PII. Only the user ID (`sub`) is included, which can be used to look up the user record server-side if needed.

**JWT Secret:**

- **Length**: 256 bits (32 bytes, Base64-encoded)
- **Generation**: CSPRNG on application deployment
- **Storage**: Environment variable (`JWT_SECRET`) or AWS Secrets Manager
- **Rotation**: Every 90 days (graceful rotation with dual-key validation)

**Cookie Attributes:**

```http
Set-Cookie: vsg_session=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/
```

**Attribute Breakdown:**

| Attribute | Value | Security Purpose |
|-----------|-------|------------------|
| `HttpOnly` | `true` | Prevents JavaScript access (XSS mitigation) |
| `Secure` | `true` | HTTPS-only transmission (prevents cleartext leakage) |
| `SameSite` | `Lax` | CSRF protection (cookies not sent on cross-site POST) |
| `Max-Age` | `86400` | 24-hour session lifetime (1 day in seconds) |
| `Path` | `/` | Cookie sent for all paths under domain |
| `Domain` | *not set* | Defaults to current domain only (no subdomain sharing) |

#### 3.2.1 Session Lifecycle

**Session Creation (on successful authentication):**

```python
def create_session(user: User) -> str:
    # 1. Generate JWT payload (NO email or PII)
    payload = {
        'sub': user.id,  # User ID only
        'tier': user.subscription_tier,
        'iat': int(time.time()),
        'exp': int(time.time()) + 86400  # 24 hours
    }

    # 2. Sign JWT with HS256
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    # 3. Set cookie in response
    response.set_cookie(
        key='vsg_session',
        value=token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=86400
    )

    return token
```

**Session Validation (on every API request):**

```python
def validate_session(request) -> User:
    # 1. Extract JWT from cookie
    token = request.cookies.get('vsg_session')
    if not token:
        raise UnauthenticatedError("No session cookie present")

    # 2. Verify JWT signature and expiry
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise UnauthenticatedError("Session expired")
    except jwt.InvalidTokenError:
        raise UnauthenticatedError("Invalid session token")

    # 3. Extract user ID and load user
    user_id = payload['sub']
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise UnauthenticatedError("User not found")

    # 4. Check if user is active/not deleted
    if user.deleted_at is not None:
        raise UnauthenticatedError("Account deleted")

    return user
```

#### 3.2.2 Session Expiry & Renewal

**Expiration Policy:**

- **Hard Expiry**: 24 hours from issuance (`exp` claim)
- **No Sliding Window**: Session DOES NOT auto-refresh on each request (prevents indefinite sessions)
- **User Action Required**: Re-authenticate after 24 hours

**Manual Session Refresh (Optional Endpoint):**

```http
POST /api/auth/refresh HTTP/1.1
Cookie: vsg_session=eyJhbGc...
```

**Response:**

```http
HTTP/1.1 200 OK
Set-Cookie: vsg_session=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400
```

**Server Logic:**

- Validate existing session (not expired)
- Issue new JWT with fresh `iat` and `exp` (new 24-hour window)
- Return new cookie

#### 3.2.3 Session Termination (Logout)

**Logout Request:**

```http
POST /api/auth/logout HTTP/1.1
Cookie: vsg_session=eyJhbGc...
```

**Response:**

```http
HTTP/1.1 200 OK
Set-Cookie: vsg_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/
```

**Server Actions:**

1. Clear session cookie (set `Max-Age=0`)
2. Optionally add JWT `jti` (token ID) to revocation blocklist in Redis (TTL = remaining session lifetime)
3. Clear CSRF token cookie (see [Section 3.3](#33-csrf-protection))

> **NOTE:** VSG uses stateless JWTs, so logout only clears the client-side cookie. For immediate session revocation (e.g., security incident), use the optional Redis-based token blocklist.

#### 3.2.4 Multi-Device Session Management

**Concurrent Sessions:**

- Users can have **unlimited active sessions** across multiple devices
- Each device receives its own JWT session token
- No server-side session storage or enumeration

**Session Revocation (All Devices):**

**Use Case:** User suspects account compromise and wants to log out all devices.

**Implementation Option 1: JWT Secret Rotation**

```python
# Emergency secret rotation
JWT_SECRET_OLD = JWT_SECRET
JWT_SECRET = generate_new_secret()
# All existing sessions immediately invalidated
```

**Implementation Option 2: User-Level Token Blocklist**

```python
# Add user ID to global blocklist with TTL = 24 hours
redis.setex(f"revoke:user:{user.id}", 86400, "1")

# Validation check:
def validate_session(request):
    payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    user_id = payload['sub']

    # Check if user ID is in blocklist
    if redis.exists(f"revoke:user:{user_id}"):
        raise UnauthenticatedError("Session revoked")
```

#### 3.2.5 JWT Secret Rotation

**Rotation Schedule:** Every 90 days

**Graceful Rotation Strategy (Dual-Key Validation):**

```python
# Step 1: Generate new secret, keep old secret active
JWT_SECRET_OLD = os.getenv('JWT_SECRET')
JWT_SECRET_NEW = generate_csprng_secret()  # Store as JWT_SECRET_NEW

# Step 2: For 24 hours, accept BOTH secrets for verification
def validate_session_dual_key(token: str):
    try:
        return jwt.decode(token, JWT_SECRET_NEW, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        # Fallback to old secret (allows existing sessions to remain valid)
        return jwt.decode(token, JWT_SECRET_OLD, algorithms=['HS256'])

# Step 3: After 24 hours (all old sessions expired), remove old secret
# JWT_SECRET = JWT_SECRET_NEW (only new secret used)
```

**Why 24-Hour Dual-Key Window:**

- Existing sessions remain valid during rotation (no forced logout)
- After 24 hours, all old sessions naturally expire (Max-Age=86400)
- New sessions use only new secret

#### 3.2.6 Session Fixation Attack Prevention

**Attack:** Attacker provides victim with a pre-authenticated session token.

**Mitigation:**

- **New JWT issued on every authentication**: Magic Link and OAuth flows always create a fresh JWT (new `iat`, `exp`, and signature)
- **No session token reuse**: Previous tokens are not refreshed; authentication always generates a new token
- **CSRF token regeneration**: CSRF token is regenerated on login (see [Section 3.3](#33-csrf-protection))

#### 3.2.7 Audit Logging

**Session Creation Event:**

```json
{
  "event": "session_created",
  "userId": "user_01J...",
  "sessionId": "sess_01J...",
  "ip_prefix": "203.0.113.xxx",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-12-27T10:40:00Z"
}
```

**Session Validation Failure Event:**

```json
{
  "event": "session_validation_failed",
  "reason": "expired",
  "ip_prefix": "203.0.113.xxx",
  "timestamp": "2025-12-27T11:45:00Z"
}
```

#### 3.2.8 Threat Scenarios Mitigated

**Scenario 1: XSS Session Theft**

- **Attack**: Attacker injects malicious script to steal session cookie
- **Mitigation**: `HttpOnly` attribute prevents JavaScript access to cookie

**Scenario 2: Session Hijacking (MITM)**

- **Attack**: Attacker intercepts session cookie over unencrypted connection
- **Mitigation**: `Secure` attribute ensures cookie only transmitted over HTTPS

**Scenario 3: CSRF via Cookie**

- **Attack**: Attacker tricks user into making authenticated request to VSG
- **Mitigation**: `SameSite=Lax` + CSRF token validation (see [Section 3.3](#33-csrf-protection))

**Scenario 4: JWT Secret Compromise**

- **Attack**: Attacker obtains JWT secret, forges arbitrary session tokens
- **Mitigation**:
  - Secret stored in secure environment variables/KMS (not in code)
  - 90-day rotation schedule limits compromise window
  - Secret compromise triggers immediate rotation + all session invalidation

**Scenario 5: Session Fixation**

- **Attack**: Attacker provides victim with pre-authenticated session
- **Mitigation**: Fresh JWT generated on every authentication (no token reuse)

---

### 3.3 CSRF Protection

**Overview:**

Visual Social Graph implements **Double-Submit Cookie Pattern** for CSRF protection. This approach works with stateless JWT sessions and does not require server-side session storage.

**How It Works:**

1. Server generates a cryptographically random CSRF token (128-bit)
2. Token is sent to client in TWO places:
   - **Cookie** (`vsg_csrf`) - NOT HttpOnly (JavaScript can read it)
   - **Custom HTTP header** (`X-CSRF-Token`) - Sent by frontend on state-changing requests
3. Server validates that cookie value matches header value

**Why This Works:**

- Attacker can force victim's browser to send cookies (via CSRF attack)
- Attacker CANNOT read cookies due to Same-Origin Policy
- Attacker CANNOT set custom headers on cross-origin requests
- Therefore, attacker cannot provide matching header value

#### 3.3.1 CSRF Token Format

**Token Generation:**

```python
import secrets

def generate_csrf_token() -> str:
    """Generate 128-bit CSRF token (URL-safe Base64)"""
    return secrets.token_urlsafe(16)  # 16 bytes = 128 bits
```

**Example Token:**

```
vsg_csrf=X8kP3mR9nQ2jL5vW7yT1aZ4bC6dF0hG
```

**Cookie Attributes:**

```http
Set-Cookie: vsg_csrf=X8kP3mR9nQ2jL5vW7yT1aZ4bC6dF0hG; Secure; SameSite=Lax; Max-Age=86400; Path=/
```

**Attribute Breakdown:**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `HttpOnly` | **NOT SET** | JavaScript MUST be able to read this cookie to include in header |
| `Secure` | `true` | HTTPS-only transmission |
| `SameSite` | `Lax` | Additional CSRF defense (cookies not sent on cross-site POST) |
| `Max-Age` | `86400` | 24-hour lifetime (matches session cookie) |
| `Path` | `/` | Available for all paths |

> **CRITICAL:** The `vsg_csrf` cookie does NOT have the `HttpOnly` flag. This is intentional and required for the double-submit pattern. JavaScript must be able to read this cookie to include it in the `X-CSRF-Token` header.

#### 3.3.2 CSRF Token Lifecycle

**Token Creation (on login/session creation):**

```python
def create_csrf_token(response) -> str:
    # Generate random token
    csrf_token = secrets.token_urlsafe(16)

    # Set cookie (NOT HttpOnly - JS needs to read it)
    response.set_cookie(
        key='vsg_csrf',
        value=csrf_token,
        httponly=False,  # JavaScript must be able to read this
        secure=True,
        samesite='Lax',
        max_age=86400
    )

    return csrf_token
```

**Frontend: Reading Cookie and Setting Header:**

```javascript
// 1. Read CSRF token from cookie
function getCsrfToken() {
    const match = document.cookie.match(/vsg_csrf=([^;]+)/);
    return match ? match[1] : null;
}

// 2. Include token in request header
fetch('/api/graphs', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()  // Read from cookie
    },
    credentials: 'include',  // Send cookies
    body: JSON.stringify({...})
});
```

**Server: Validation (on state-changing requests):**

```python
def validate_csrf_token(request):
    # 1. Extract CSRF token from cookie
    cookie_token = request.cookies.get('vsg_csrf')

    # 2. Extract CSRF token from header
    header_token = request.headers.get('X-CSRF-Token')

    # 3. Validate both tokens exist
    if not cookie_token or not header_token:
        raise CSRFError("Missing CSRF token")

    # 4. Validate tokens match (constant-time comparison)
    if not secrets.compare_digest(cookie_token, header_token):
        raise CSRFError("CSRF token mismatch")

    # CSRF validation passed
```

#### 3.3.3 Protected Operations

**State-Changing Operations (CSRF Required):**

All operations that modify server state MUST include CSRF token validation:

| HTTP Method | Endpoints | Examples |
|-------------|-----------|----------|
| `POST` | All `POST` endpoints | Create graph, upload data, subscribe |
| `PUT` | All `PUT` endpoints | Update graph, modify settings |
| `PATCH` | All `PATCH` endpoints | Partial updates |
| `DELETE` | All `DELETE` endpoints | Delete graph, cancel subscription, delete account |

**Safe Operations (CSRF NOT Required):**

Read-only operations do NOT require CSRF tokens:

| HTTP Method | Endpoints | Examples |
|-------------|-----------|----------|
| `GET` | All `GET` endpoints | View graphs, download data, read settings |
| `HEAD` | All `HEAD` endpoints | Resource existence checks |
| `OPTIONS` | All `OPTIONS` endpoints | CORS preflight |

> **NOTE:** While `GET` requests are exempt from CSRF validation, they MUST NOT perform state-changing operations (RESTful best practice).

#### 3.3.4 CSRF Exemptions

**Magic Link Authentication:**

Magic link verification (`GET /api/auth/verify?token=...`) is exempt from CSRF protection because:

- Magic link tokens are single-use and time-limited (15 minutes)
- Token is 256-bit cryptographically random (not guessable)
- Token is transmitted via email (out-of-band channel)
- Successful verification creates new session with fresh CSRF token

**OAuth Callback:**

OAuth callback (`GET /api/auth/google/callback?code=...&state=...`) is exempt from CSRF protection because:

- OAuth `state` parameter serves as CSRF token (validated against session storage)
- Authorization code is single-use
- Code exchange requires client secret (server-side only)

**Webhook Endpoints:**

Webhook endpoints (e.g., Stripe payment notifications) are exempt from CSRF protection because:

- Requests originate from third-party servers (not user browsers)
- Protected by webhook signature validation (HMAC-SHA256)
- No user session cookies involved

#### 3.3.5 Error Handling

**CSRF Validation Failure:**

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "CSRF token validation failed",
  "code": "CSRF_TOKEN_MISMATCH",
  "message": "The CSRF token in the request header does not match the cookie value. Please refresh the page and try again."
}
```

**Audit Log:**

```json
{
  "event": "csrf_validation_failed",
  "userId": "user_01J...",
  "endpoint": "/api/graphs",
  "method": "POST",
  "reason": "token_mismatch",
  "ip_prefix": "203.0.113.xxx",
  "timestamp": "2025-12-27T11:00:00Z"
}
```

#### 3.3.6 Token Rotation

**When CSRF Tokens Are Regenerated:**

1. **On Login**: Fresh CSRF token created when user authenticates
2. **On Logout**: CSRF token cookie cleared (`Max-Age=0`)
3. **On Session Expiry**: CSRF token expires with session (24 hours)

**No Mid-Session Rotation:**

- CSRF token remains constant for session lifetime (24 hours)
- Rotation on every request creates race conditions (multiple tabs/requests)
- Single rotation per session is sufficient

#### 3.3.7 Multi-Tab/Multi-Request Handling

**Challenge:**

User has multiple browser tabs open, each making concurrent requests. CSRF token rotation would invalidate other tabs' tokens.

**Solution:**

- CSRF token is NOT rotated on every request
- All tabs share the same CSRF token (from `vsg_csrf` cookie)
- Token only rotated on login/logout events

#### 3.3.8 Threat Scenarios Mitigated

**Scenario 1: Classic CSRF Attack**

**Attack:**
```html
<!-- Attacker's malicious website -->
<form action="https://visualsocialgraph.com/api/graphs/123" method="POST">
  <input type="hidden" name="action" value="delete">
</form>
<script>document.forms[0].submit();</script>
```

**Mitigation:**
- Browser automatically sends `vsg_session` cookie (user is authenticated)
- Browser automatically sends `vsg_csrf` cookie
- Attacker CANNOT read cookie value (Same-Origin Policy)
- Attacker CANNOT set `X-CSRF-Token` header (cross-origin restriction)
- Server rejects request (no matching header)

**Scenario 2: XSS-Based CSRF Bypass**

**Attack:**
Attacker injects JavaScript via XSS to read CSRF token from cookie and make authenticated requests.

**Mitigation:**
- XSS is the primary vulnerability (CSRF token doesn't protect against XSS)
- If attacker has XSS, they can read CSRF token AND session cookie
- Defense: Content Security Policy (CSP), input sanitization, output encoding (see [Section 8](#8-application-security))

**Scenario 3: Subdomain Takeover**

**Attack:**
Attacker compromises subdomain (e.g., `old.visualsocialgraph.com`) and sets cookies for parent domain.

**Mitigation:**
- `vsg_csrf` cookie does NOT set `Domain` attribute (defaults to current domain only)
- Subdomain cannot overwrite main domain's CSRF cookie
- Additional defense: HSTS with `includeSubDomains`

#### 3.3.9 Implementation Checklist

**Backend:**
- [ ] CSRF token generated on login (128-bit random)
- [ ] CSRF cookie set WITHOUT `HttpOnly` flag
- [ ] CSRF validation on ALL state-changing endpoints (POST, PUT, PATCH, DELETE)
- [ ] Constant-time comparison for token validation
- [ ] CSRF failures logged to audit log
- [ ] Exemptions documented and justified (magic link, OAuth callback, webhooks)

**Frontend:**
- [ ] JavaScript reads CSRF token from cookie
- [ ] CSRF token included in `X-CSRF-Token` header for ALL mutations
- [ ] Token refresh logic on login/logout
- [ ] Error handling for 403 CSRF failures (prompt user to refresh)

---

### 3.4 Authorization Model

**Overview:**

Visual Social Graph implements a **two-layer authorization model**:

1. **Tier-Based Feature Gating**: Controls access to features based on subscription tier (Free, Pro, Creator)
2. **Resource Ownership Validation**: Ensures users can only access their own resources (graphs, insights, exports)

**Authorization Flow:**

```
Incoming Request
    ↓
1. Authentication (Session/Bearer Token) → Extract user_id, tier
    ↓
2. Tier-Based Feature Gating → Check if tier allows feature access
    ↓
3. Resource Ownership Validation → Check if user owns resource
    ↓
4. Operation-Specific Permissions → Check if operation is allowed
    ↓
Allow/Deny Request
```

#### 3.4.1 Tier-Based Feature Gating

**Subscription Tiers:**

Visual Social Graph has three subscription tiers, each with different feature access levels:

| Tier | Description | Key Features |
|------|-------------|--------------|
| **Free** | Individual users, limited usage | 5 graphs/day, basic insights, watermarked exports |
| **Pro** | Power users, higher quotas | 100 graphs/day, advanced insights, no watermarks, API access |
| **Creator** | API developers, highest quotas | 500 graphs/day, unlimited insights, bearer token API keys |

**Feature Access Matrix:**

| Feature | Free | Pro | Creator |
|---------|------|-----|---------|
| Graph Creation | 5/day | 100/day | 500/day |
| Basic Insights | ✅ (10/day) | ✅ (Unlimited) | ✅ (Unlimited) |
| Advanced Insights | ❌ | ✅ | ✅ |
| PDF Export | ✅ (1/day, watermarked) | ✅ (50/day, no watermark) | ✅ (200/day, no watermark) |
| Graph Sharing | ❌ | ✅ | ✅ |
| Pseudonymization Keys | ❌ | ✅ | ✅ |
| Bearer Token API Keys | ❌ | ❌ | ✅ |
| Bulk Export API | ❌ | ❌ | ✅ |

**Implementation:**

```python
from enum import Enum

class SubscriptionTier(Enum):
    FREE = "Free"
    PRO = "Pro"
    CREATOR = "Creator"

class Feature(Enum):
    GRAPH_CREATION = "graph_creation"
    ADVANCED_INSIGHTS = "advanced_insights"
    GRAPH_SHARING = "graph_sharing"
    PSEUDONYMIZATION_KEYS = "pseudonymization_keys"
    BEARER_TOKEN_API = "bearer_token_api"
    BULK_EXPORT_API = "bulk_export_api"

# Feature access control list
FEATURE_ACCESS = {
    Feature.GRAPH_CREATION: [SubscriptionTier.FREE, SubscriptionTier.PRO, SubscriptionTier.CREATOR],
    Feature.ADVANCED_INSIGHTS: [SubscriptionTier.PRO, SubscriptionTier.CREATOR],
    Feature.GRAPH_SHARING: [SubscriptionTier.PRO, SubscriptionTier.CREATOR],
    Feature.PSEUDONYMIZATION_KEYS: [SubscriptionTier.PRO, SubscriptionTier.CREATOR],
    Feature.BEARER_TOKEN_API: [SubscriptionTier.CREATOR],
    Feature.BULK_EXPORT_API: [SubscriptionTier.CREATOR],
}

def check_feature_access(user_tier: SubscriptionTier, feature: Feature) -> bool:
    """Check if user's tier allows access to feature"""
    allowed_tiers = FEATURE_ACCESS.get(feature, [])
    return user_tier in allowed_tiers

@app.post('/api/graphs/share/{graph_id}')
def share_graph(graph_id: str, current_user: User):
    # Tier-based feature gate
    if not check_feature_access(current_user.subscription_tier, Feature.GRAPH_SHARING):
        raise ForbiddenError(
            code="TIER_UPGRADE_REQUIRED",
            message="Graph sharing requires Pro or Creator tier",
            suggested_action="Upgrade to Pro to enable graph sharing"
        )

    # Continue with sharing logic...
```

**Error Response (Tier Gate Failure):**

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": {
    "id": "err_01J...",
    "level": "PERMANENT",
    "code": "TIER_UPGRADE_REQUIRED",
    "message": "Graph sharing requires Pro or Creator tier",
    "details": {
      "requiredTier": "Pro",
      "currentTier": "Free",
      "feature": "graph_sharing"
    },
    "retryable": false,
    "suggestedAction": "Upgrade to Pro to enable graph sharing"
  }
}
```

#### 3.4.2 Resource Ownership Validation

**Principle:**

Users can ONLY access resources they own. All resource access requests must validate ownership before allowing operations.

**Protected Resources:**

- **Graphs**: Users can only view/edit/delete their own graphs
- **Insights**: Users can only generate insights for their own graphs
- **Exports**: Users can only export their own graphs
- **Pseudonymization Keys**: Users can only manage their own keys
- **API Tokens**: Users can only create/revoke their own bearer tokens

**Implementation Pattern:**

```python
@app.get('/api/graphs/{graph_id}')
def get_graph(graph_id: str, current_user: User):
    # 1. Load resource from database
    graph = db.query(Graph).filter_by(id=graph_id).first()

    if not graph:
        raise NotFoundError("Graph not found")

    # 2. Validate ownership (CRITICAL)
    if graph.user_id != current_user.id:
        # Return 404 (not 403) to prevent information disclosure
        # Attacker shouldn't know if graph exists
        raise NotFoundError("Graph not found")

    # 3. Return resource
    return graph
```

> **SECURITY NOTE:** Resource ownership failures return `404 Not Found` instead of `403 Forbidden` to prevent information disclosure. Attackers should not be able to enumerate resource IDs by observing error codes.

**Audit Logging (Ownership Violation):**

```json
{
  "event": "authorization_failed",
  "reason": "resource_ownership_violation",
  "userId": "user_01J...",
  "resourceType": "graph",
  "resourceId": "graph_01K...",
  "ownerId": "user_01L...",
  "endpoint": "/api/graphs/graph_01K...",
  "method": "GET",
  "ip_prefix": "203.0.113.xxx",
  "timestamp": "2025-12-27T12:00:00Z"
}
```

#### 3.4.3 Operation-Specific Permissions

**Graph Sharing Permissions (Pro/Creator Tier Only):**

When a graph is shared, the owner can grant specific permissions to recipients:

| Permission | Description | Owner | Recipient (View-Only) |
|------------|-------------|-------|-----------------------|
| `read` | View graph visualization | ✅ | ✅ |
| `export` | Download graph data | ✅ | ❌ |
| `edit` | Modify graph metadata | ✅ | ❌ |
| `delete` | Delete graph | ✅ | ❌ |
| `share` | Re-share graph | ✅ | ❌ |

**Implementation:**

```python
@app.get('/api/graphs/{graph_id}')
def get_graph(graph_id: str, current_user: User):
    graph = db.query(Graph).filter_by(id=graph_id).first()

    if not graph:
        raise NotFoundError("Graph not found")

    # Option 1: User owns the graph (full access)
    if graph.user_id == current_user.id:
        return graph

    # Option 2: Graph is shared with user (read-only access)
    share = db.query(GraphShare).filter_by(
        graph_id=graph_id,
        shared_with_user_id=current_user.id
    ).first()

    if share and share.permission == 'read':
        return graph  # Read-only access

    # Option 3: No access
    raise NotFoundError("Graph not found")
```

#### 3.4.4 Bearer Token Scoping (Creator Tier)

**Bearer Token Permissions:**

Creator tier users can generate bearer tokens for API access. Each token has limited scope:

**Available Scopes:**

| Scope | Permissions | Use Case |
|-------|-------------|----------|
| `graphs:read` | Read graphs, insights, exports | CI/CD pipelines reading graph data |
| `graphs:write` | Create/update graphs | Automated graph generation |
| `graphs:delete` | Delete graphs | Cleanup scripts |
| `graphs:*` | All graph operations | Full API access |

**Scope Validation:**

```python
@app.post('/api/graphs')
def create_graph(current_user: User, token_scopes: list[str]):
    # Check if token has required scope
    if 'graphs:write' not in token_scopes and 'graphs:*' not in token_scopes:
        raise ForbiddenError(
            code="INSUFFICIENT_SCOPE",
            message="Bearer token does not have 'graphs:write' scope",
            suggested_action="Generate a new token with 'graphs:write' scope"
        )

    # Continue with graph creation...
```

**Token Generation Example:**

```http
POST /api/tokens HTTP/1.1
Authorization: Bearer vsg_session_cookie
Content-Type: application/json

{
  "name": "CI/CD Pipeline Token",
  "scopes": ["graphs:read", "graphs:write"],
  "expiresInDays": 90
}
```

**Response:**

```json
{
  "token": "vsg_sk_01J3R4M5N6P7Q8S9T...",
  "name": "CI/CD Pipeline Token",
  "scopes": ["graphs:read", "graphs:write"],
  "createdAt": "2025-12-27T12:00:00Z",
  "expiresAt": "2026-03-27T12:00:00Z"
}
```

#### 3.4.5 Admin Privileges

**No Admin Role:**

Visual Social Graph does NOT have an "admin" user role in the traditional sense. All users (including support staff) have the same privilege level for their own resources.

**Support Access:**

Customer support staff can temporarily access user accounts via **time-limited impersonation tokens**:

- Generated by backend script (not accessible via API)
- 1-hour expiry
- All actions logged to audit trail with `support_impersonation=true` flag
- User notified via email when impersonation occurs

**Audit Log (Support Impersonation):**

```json
{
  "event": "support_impersonation_started",
  "supportUserId": "support_01J...",
  "impersonatedUserId": "user_01K...",
  "reason": "Ticket #12345 - User reported missing graph",
  "expiresAt": "2025-12-27T13:00:00Z",
  "timestamp": "2025-12-27T12:00:00Z"
}
```

#### 3.4.6 Authorization Testing Checklist

**Backend:**
- [ ] All endpoints validate authentication (session cookie or bearer token)
- [ ] Tier-based feature gates enforced on Pro/Creator-only features
- [ ] Resource ownership validated before returning sensitive data
- [ ] Ownership violations return `404` (not `403`) to prevent enumeration
- [ ] Bearer token scopes validated for Creator tier API access
- [ ] Shared graph permissions enforced (read-only for recipients)
- [ ] Authorization failures logged to audit log

**Automated Tests:**
- [ ] Test Free tier user cannot access Pro-only features
- [ ] Test user cannot access another user's graphs (IDOR prevention)
- [ ] Test bearer token with `graphs:read` scope cannot create graphs
- [ ] Test shared graph recipient cannot delete graph (owner-only operation)
- [ ] Test expired bearer tokens are rejected

#### 3.4.7 Threat Scenarios Mitigated

**Scenario 1: Insecure Direct Object Reference (IDOR)**

**Attack:**
Attacker guesses graph IDs and attempts to access other users' graphs:
```http
GET /api/graphs/graph_01JBQR7X9K2P3M4N5Q6R7S8T9V HTTP/1.1
Cookie: vsg_session=attacker_token
```

**Mitigation:**
- Resource ownership validation checks `graph.user_id == current_user.id`
- Returns `404` for graphs owned by other users
- ULIDs are unpredictable (128-bit entropy) - enumeration is infeasible

**Scenario 2: Privilege Escalation (Tier Bypass)**

**Attack:**
Free tier user attempts to access Pro-only feature (graph sharing):
```http
POST /api/graphs/share/graph_123 HTTP/1.1
Cookie: vsg_session=free_user_token
```

**Mitigation:**
- Tier-based feature gate checks `current_user.subscription_tier`
- Returns `403 TIER_UPGRADE_REQUIRED`
- Tier stored in JWT (tamper-proof, signed)

**Scenario 3: Bearer Token Scope Escalation**

**Attack:**
Bearer token with `graphs:read` scope attempts to create graph:
```http
POST /api/graphs HTTP/1.1
Authorization: Bearer vsg_sk_read_only_token
```

**Mitigation:**
- Scope validation checks token scopes before operation
- Returns `403 INSUFFICIENT_SCOPE`
- Token scopes are immutable (set at creation time)

**Scenario 4: Shared Graph Deletion**

**Attack:**
User with read-only access to shared graph attempts to delete it:
```http
DELETE /api/graphs/graph_shared_with_me HTTP/1.1
Cookie: vsg_session=recipient_token
```

**Mitigation:**
- Ownership validation ensures only owner can delete
- Shared graph recipients only have `read` permission
- Returns `404` (pretends graph doesn't exist)

---

### 3.5 Password and Secret Management

**Password Policy: N/A (Passwordless Authentication)**

Visual Social Graph implements 100% passwordless authentication. Users NEVER create or manage passwords.

**Rationale:**
- Eliminates password-related vulnerabilities (credential stuffing, brute force, password reuse)
- Reduces user friction (no password reset flows)
- No password database to breach

**Authentication Methods (All Passwordless):**
1. Magic Link (email-based one-time tokens)
2. Google OAuth (federated identity)

**API Key Management (Creator Tier):**

**API Key Rotation Policy:**
- **Maximum Lifetime**: 90 days (enforced via `expires_at` timestamp)
- **Recommended Rotation**: 30-60 days for high-security use cases
- **Email Reminders**: 7 days before expiry
- **Rotation Procedure**:
  1. Generate new API key via dashboard
  2. Update client applications with new key
  3. Test new key in production
  4. Revoke old key after verification

**Secret Storage (Server-Side):**

**Environment Variables:**
- **JWT_SECRET**: JWT signing secret (256-bit CSPRNG)
- **GOOGLE_CLIENT_SECRET**: Google OAuth client secret
- **STRIPE_WEBHOOK_SECRET**: Stripe webhook HMAC secret
- **DATABASE_URL**: PostgreSQL connection string (includes credentials)

**Production Secret Management:**
- **AWS Secrets Manager** (preferred for AWS deployments)
- **GCP Secret Manager** (preferred for GCP deployments)
- **Azure Key Vault** (preferred for Azure deployments)
- **HashiCorp Vault** (on-premises or multi-cloud)

**Secret Rotation Schedule:**
- **JWT_SECRET**: 90 days (graceful dual-key rotation)
- **Database Credentials**: 90 days (coordinated with database admin)
- **OAuth Secrets**: 90 days or immediately on suspected compromise
- **API Keys**: 90 days (enforced via expiry timestamp)

**Never Stored in Code:**
- ❌ No secrets in source code files
- ❌ No secrets in `.env` committed to version control
- ❌ No secrets in frontend JavaScript
- ✅ Secrets loaded from environment/KMS at runtime

---

### 3.6 Offline/Local-Only Mode Security

**Overview:**

Visual Social Graph supports an **Offline/Local-Only Mode** where users can visualize and analyze social network graphs entirely within their browser, without server-side storage or authentication. This mode provides maximum privacy but has different security characteristics than the standard cloud-based mode.

#### 3.6.1 Mode Comparison

| Feature | **Standard Mode** | **Offline/Local-Only Mode** |
|---------|-------------------|------------------------------|
| **Authentication** | Required (Magic Link, Google OAuth) | None - no user accounts |
| **Data Storage** | Server-side (PostgreSQL, S3) | Client-side only (browser memory, localStorage) |
| **Graph Persistence** | Persistent (graphs saved to user account) | Temporary (graphs lost on page refresh unless manually saved to IndexedDB) |
| **Cross-Device Access** | Yes (sync across devices) | No (graphs confined to single browser) |
| **Sharing** | Yes (Pro/Creator tier only) | No (graphs cannot be shared) |
| **Privacy** | Pseudonymized server storage | No server transmission (maximum privacy) |
| **Use Case** | Power users, teams, API integrations | Privacy-conscious users, one-off analyses, demo/testing |

#### 3.6.2 Security Characteristics

**No Authentication Boundary:**

- **Threat Model Change:** In Offline/Local-Only mode, there is NO authentication or authorization. Any user with access to the device can view graphs stored in browser.
- **Physical Security Dependency:** Security relies entirely on device-level access controls (OS login, disk encryption).

**Data Confidentiality:**

| Storage Location | Data Type | Confidentiality Risk |
|------------------|-----------|----------------------|
| **Browser Memory (RAM)** | Active graph data (nodes, edges, labels) | ✅ Low - cleared on tab close, not persisted to disk |
| **localStorage** | Graph metadata (node count, creation date) | ⚠️ Medium - persisted to disk, accessible by JavaScript on same origin |
| **IndexedDB** | Full graph data (if user chooses to save) | ⚠️ Medium - persisted to disk, accessible by JavaScript on same origin |
| **Browser Cache** | Visualization assets (CSS, JS, fonts) | ✅ Low - no sensitive data cached |

**XSS Impact:**

- In Standard Mode: XSS can steal session cookies (HttpOnly mitigation) or CSRF tokens
- In Offline/Local-Only Mode: XSS can directly access ALL graph data in memory/localStorage/IndexedDB (no server-side protection layer)
- **Mitigation:** CSP remains critical (see [Section 11.1](#111-content-security-policy))

#### 3.6.3 Local Storage Security

**Data Persistence Options:**

Users can optionally save graphs locally for later viewing:

1. **IndexedDB Storage (Recommended):**
   - Browser's structured storage API
   - Per-origin isolation (other websites cannot access)
   - Quota-limited (typically 50MB-100MB)
   - Data encrypted at rest by OS (BitLocker, FileVault)

2. **Manual File Export:**
   - User downloads graph as JSON file
   - File saved to device's filesystem
   - Security depends on filesystem permissions

**Implementation:**

```typescript
// Save graph to IndexedDB (client-side only)
async function saveGraphLocally(graph: Graph): Promise<void> {
    const db = await openIndexedDB('vsg-offline', 1);
    const transaction = db.transaction(['graphs'], 'readwrite');
    const store = transaction.objectStore('graphs');

    await store.put({
        id: graph.id,
        name: graph.name,
        nodes: graph.nodes,  // Full node data (including labels)
        edges: graph.edges,
        createdAt: new Date().toISOString(),
    });

    console.log('Graph saved locally (not synced to server)');
}

// Load graph from IndexedDB
async function loadGraphLocally(graphId: string): Promise<Graph | null> {
    const db = await openIndexedDB('vsg-offline', 1);
    const transaction = db.transaction(['graphs'], 'readonly');
    const store = transaction.objectStore('graphs');

    const graph = await store.get(graphId);
    return graph || null;
}
```

**Storage Quota Management:**

```typescript
// Check available storage quota
async function checkStorageQuota(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
            used: estimate.usage || 0,
            available: estimate.quota || 0,
        };
    }
    return { used: 0, available: 0 };
}
```

#### 3.6.4 Data Sanitization (CSV Import)

**Risk:** Users import CSV files containing sensitive data. In Offline/Local-Only mode, VSG processes this data entirely client-side.

**Security Controls:**

1. **Client-Side Parsing Only:**
   - CSV parsing happens in JavaScript (not server-side)
   - No file upload to server
   - File contents never leave user's device

2. **Input Validation:**
   - Maximum file size: 10MB (client-side enforcement)
   - Maximum nodes: 10,000 (prevent browser memory exhaustion)
   - CSV header validation (reject malformed files)

**Implementation:**

```typescript
async function importCSVOffline(file: File): Promise<Graph> {
    // 1. Validate file size (prevent DoS)
    if (file.size > 10 * 1024 * 1024) {  // 10MB
        throw new Error('File too large (max 10MB for offline mode)');
    }

    // 2. Read file contents (client-side only)
    const csvText = await file.text();

    // 3. Parse CSV (using library like PapaParse)
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    // 4. Validate row count
    if (parsed.data.length > 10000) {
        throw new Error('Too many nodes (max 10,000 for offline mode)');
    }

    // 5. Build graph (NO server transmission)
    const graph = buildGraphFromCSV(parsed.data);

    return graph;  // Stays in browser memory
}
```

#### 3.6.5 Browser Security Dependencies

**Critical Dependencies:**

| Browser Feature | Security Purpose | Fallback |
|-----------------|------------------|----------|
| **Same-Origin Policy** | Prevents other websites from accessing IndexedDB data | None - fundamental browser security |
| **Content Security Policy** | Prevents XSS attacks on graph data | Report-only mode if enforcement causes breakage |
| **Subresource Integrity (SRI)** | Prevents CDN compromise (malicious JS injection) | Self-host libraries (no CDN) |
| **HTTPS** | Prevents MITM attacks on app delivery | Offline/Local-Only mode can run over `file://` protocol |

**Browser Compatibility:**

| Browser | Offline/Local-Only Support | Notes |
|---------|----------------------------|-------|
| Chrome 90+ | ✅ Full support | IndexedDB, Web Workers |
| Firefox 88+ | ✅ Full support | IndexedDB, Web Workers |
| Safari 14+ | ✅ Full support | IndexedDB quota may be more restrictive |
| Edge 90+ | ✅ Full support | Same as Chrome (Chromium-based) |
| IE 11 | ❌ Not supported | Missing IndexedDB v2, Web Workers |

#### 3.6.6 Privacy Considerations

**What Offline/Local-Only Mode Provides:**

✅ **No Server-Side Data Storage:** Graphs never transmitted to VSG servers
✅ **No User Tracking:** No account creation, no analytics, no cookies
✅ **No Third-Party Data Sharing:** Data stays in user's browser
✅ **No Cloud Syncing:** Graphs isolated to single device/browser

**What Offline/Local-Only Mode Does NOT Provide:**

❌ **Device Encryption:** User must enable OS-level disk encryption (BitLocker, FileVault)
❌ **Multi-User Isolation:** Browser profiles share same localStorage (use separate browser profiles for multi-user devices)
❌ **Data Backup:** If browser data is cleared (e.g., "Clear browsing data"), graphs are lost (unless manually exported to file)
❌ **Access Control:** Anyone with physical access to unlocked device can view graphs in browser

**Privacy Best Practices:**

1. **Enable OS Disk Encryption:**
   - Windows: BitLocker
   - macOS: FileVault
   - Linux: LUKS

2. **Use Private Browsing for Sensitive Graphs:**
   - Data cleared when browser window closed
   - No IndexedDB persistence
   - Must manually export graphs to save

3. **Manual Export for Long-Term Storage:**
   - Export graphs as encrypted ZIP files (user-managed encryption)
   - Store in password-protected archive

#### 3.6.7 UX Trust Indicators

**How Users Know They're in Offline/Local-Only Mode:**

**Visual Indicators:**

1. **Banner Notification:**
   ```
   🔒 Offline Mode Active
   Your graph data is processed entirely in your browser and never sent to our servers.
   [Learn More] [Switch to Cloud Mode]
   ```

2. **No Login Prompt:**
   - No "Sign In" button visible
   - No session cookie set

3. **Feature Restrictions:**
   - Sharing button disabled with tooltip: "Sharing requires Cloud Mode"
   - Export to PDF watermarked with "Offline Mode"

**Implementation:**

```typescript
function showOfflineModeIndicator() {
    const banner = document.createElement('div');
    banner.className = 'offline-mode-banner';
    banner.innerHTML = `
        🔒 <strong>Offline Mode Active</strong>
        Your graph data is processed entirely in your browser and never sent to our servers.
        <a href="/docs/offline-mode">Learn More</a>
        <a href="/login">Switch to Cloud Mode</a>
    `;
    document.body.prepend(banner);
}
```

#### 3.6.8 Transition from Offline to Cloud Mode

**User Flow:**

1. User creates graph in Offline/Local-Only mode
2. User decides to save graph persistently (requires Cloud Mode)
3. User clicks "Switch to Cloud Mode"
4. VSG prompts for authentication (Magic Link or Google OAuth)
5. After authentication, user can upload graph to server

**Security Considerations:**

- Graph data transmitted over TLS (HTTPS)
- Server performs pseudonymization (HMAC-SHA256) before storage
- Original labels remain client-side only (unless user explicitly uploads)

**Implementation:**

```typescript
async function uploadGraphToCloud(graph: Graph, sessionToken: string): Promise<void> {
    // Warn user about data transmission
    const confirmed = confirm(
        'Uploading this graph will transmit data to Visual Social Graph servers. ' +
        'Node IDs will be pseudonymized server-side. Continue?'
    );

    if (!confirmed) return;

    // Upload graph to server
    const response = await fetch('/api/graphs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
        },
        credentials: 'include',  // Send session cookie
        body: JSON.stringify({
            name: graph.name,
            nodes: graph.nodes,  // Server will pseudonymize
            edges: graph.edges,
        }),
    });

    if (response.ok) {
        alert('Graph uploaded and saved to your account!');
        // Optionally delete local copy
        await deleteGraphLocally(graph.id);
    }
}
```

#### 3.6.9 Threat Model Summary

| Threat | Standard Mode Mitigation | Offline/Local-Only Mode Mitigation |
|--------|--------------------------|-------------------------------------|
| **Account Takeover** | Magic Link (email verification), OAuth | N/A (no accounts) |
| **XSS Data Theft** | HttpOnly cookies, CSP | CSP only (data in memory is accessible) |
| **MITM Attack** | HTTPS, HSTS, SRI | HTTPS, SRI (can run offline over `file://`) |
| **Unauthorized Data Access** | Authentication, resource ownership validation | Device-level security (OS login, disk encryption) |
| **Data Loss** | Server-side backups, multi-region replication | Manual export only (user responsibility) |
| **Third-Party Data Sharing** | DPAs, GDPR compliance (see Section 6) | No third parties (data never leaves browser) |

---

## 4. Data Privacy & Pseudonymization

### 4.1 Privacy-First Data Model

**Foundational Principle:**

Visual Social Graph implements privacy-by-design through **server-side data minimization**. The system is architecturally incapable of identifying individual users from server-stored graph data alone.

**What We Store (Server-Side):**
- ✅ Pseudonymized node IDs (HMAC-SHA256 hashes)
- ✅ Graph structure (edges, relationships)
- ✅ Aggregate metrics (degree, centrality scores, community IDs)
- ✅ Platform type (twitter, instagram, linkedin, etc.)
- ✅ Day-level timestamps (YYYY-MM-DD)

**What We DON'T Store (Server-Side):**
- ❌ Display names (e.g., "Jane Doe")
- ❌ Usernames (e.g., "@janedoe")
- ❌ Profile photos or avatars
- ❌ Tweet content or Instagram captions
- ❌ Private messages or DMs
- ❌ Hour-level timestamps (only day-level granularity)
- ❌ User's raw social media archive files

**Constitutional Constraint Alignment:**

This storage policy enforces **C2: User Data Ownership** and **C3: Client-Side Processing (80% Rule)**:

- **C2 Compliance**: Data minimization reduces server-side PII exposure
- **C3 Compliance**: Client maintains full social graph labels in browser IndexedDB (never transmitted to server)

**Privacy Moat Strategy:**

VSG creates a "privacy moat" around user data through architectural barriers (see [Section 2.3](#23-privacy-first-design-philosophy)):

1. **Boundary pseudonymization at ingestion (server-side)** - Original IDs are pseudonymized before persistence
2. **Server-side key management** - Per-user keys never exposed to clients
3. **Deterministic mapping** - Stable pseudonyms within a user account for longitudinal analysis
4. **Timestamp truncation** - Day-level granularity prevents temporal correlation

**Result**: Even if attacker fully compromises database, they cannot:
- Identify individual users (no display names/usernames)
- Reverse-engineer original IDs (HMAC-SHA256 is one-way)
- Correlate to real-time social media activity (day-level timestamps)

---

### 4.2 HMAC-SHA256 Pseudonymization Algorithm

**Algorithm Specification:**

Visual Social Graph uses **HMAC-SHA256** (Hash-based Message Authentication Code with SHA-256) for all pseudonymization operations.

**Pseudonymization Formula:**
```
pseudonymId = HMAC-SHA256(userSecretKey, originalPlatformUserId)
```

**Example:**
```python
import hmac
import hashlib
import base64

# User's pseudonymization key (256-bit, stored in database)
user_secret_key = b"a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6"

# Original Twitter user ID from social media archive
original_user_id = "123456789"

# Generate pseudonym
pseudonym = hmac.new(
    key=user_secret_key,
    msg=original_user_id.encode('utf-8'),
    digestmod=hashlib.sha256
).digest()

# Encode as Base64 for storage
pseudonym_b64 = base64.b64encode(pseudonym).decode('utf-8')
# Result: "node_a3f2b8c9d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6="
```

**Why HMAC-SHA256 (vs Alternatives):**

| Approach | Security Properties | Chosen? |
|----------|---------------------|---------|
| **Plain SHA-256 + salt** | ❌ Vulnerable to offline dictionary attacks if salt leaked | No |
| **SHA-256 (no salt)** | ❌ Rainbow table attacks trivial (same input = same output globally) | No |
| **Encryption (AES-256-GCM)** | ⚠️ Reversible (requires key rotation on breach, complex key management) | No |
| **HMAC-SHA256** | ✅ Keyed pseudonymization (requires server secret), deterministic, one-way, collision-resistant | **YES** |

**HMAC-SHA256 Security Properties:**

**1. Keyed Pseudonymization:**
- Requires server-held secret key (`userSecretKey`) to generate pseudonyms
- Attacker cannot generate pseudonyms without key access
- Resistant to offline dictionary attacks (cannot precompute rainbow tables)

**2. One-Way Transformation:**
- Cryptographically infeasible to reverse HMAC-SHA256 output to recover original input
- Even with full database access, attacker cannot de-pseudonymize user IDs

**3. Deterministic Mapping:**
- Same `originalPlatformUserId` + same `userSecretKey` = same `pseudonymId`
- Enables consistent pseudonym mapping across multiple graph uploads
- Preserves graph structure: "User A" in January upload = "User A" in March upload

**4. Collision Resistance:**
- 256-bit output space (2^256 possible values)
- Probability of collision between different users' pseudonyms: negligible (<10^-60)

**5. No Client-Side Key Exposure:**
- Secret key NEVER exposed via API responses
- Client only sees pseudonymized IDs in API responses
- Key used exclusively server-side during graph processing

> **IMPORTANT - Implementation Model:**
> All pseudonymization is performed **server-side only**. Users upload raw graph data (CSV/JSON files) to the VSG API, and the server performs HMAC-SHA256 pseudonymization using the user's secret key before storage. The pseudonymization key is NEVER transmitted to the client to prevent rainbow table attacks or key leakage. See [Appendix D.2](#d2-pseudonymization-flow-diagram) for the complete data flow.

---

### 4.3 Pseudonymization Key Management

**Key Generation (On User Registration):**

```python
import secrets
import base64

def create_user(email: str) -> User:
    # 1. Generate 256-bit CSPRNG secret key
    pseudonym_key = secrets.token_bytes(32)  # 32 bytes = 256 bits
    pseudonym_key_b64 = base64.b64encode(pseudonym_key).decode('utf-8')

    # 2. Encrypt key at rest (AES-256-GCM with KMS master key)
    encrypted_key = kms_encrypt(pseudonym_key_b64)

    # 3. Store encrypted key in database
    user = User(
        id=generate_ulid(),
        email=email,
        pseudonym_key_encrypted=encrypted_key,
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()

    return user
```

**Database Schema:**

```sql
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,            -- ULID: user_01J...
    email VARCHAR(255) UNIQUE NOT NULL,
    pseudonym_key_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted, KMS-protected
    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,                  -- Soft delete timestamp
    INDEX idx_email (email)
);
```

**Key Storage Security:**

**Encryption at Rest:**
- Pseudonymization keys encrypted using AES-256-GCM before database storage
- Master encryption key stored in KMS (AWS KMS, GCP Cloud KMS, or Azure Key Vault)
- Database compromise alone CANNOT recover plaintext pseudonymization keys

**Encryption Example:**
```python
import boto3
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# KMS client (AWS example)
kms_client = boto3.client('kms')

def kms_encrypt(plaintext_key: str) -> str:
    # 1. Request data key from KMS
    response = kms_client.generate_data_key(
        KeyId='alias/vsg-pseudonym-master-key',
        KeySpec='AES_256'
    )

    # 2. Use plaintext data key for AES-256-GCM encryption
    plaintext_data_key = response['Plaintext']
    encrypted_data_key = response['CiphertextBlob']  # KMS-encrypted data key

    aesgcm = AESGCM(plaintext_data_key)
    nonce = secrets.token_bytes(12)  # 96-bit nonce
    ciphertext = aesgcm.encrypt(nonce, plaintext_key.encode(), None)

    # 3. Return encrypted key + nonce + encrypted data key (base64)
    result = {
        'ciphertext': base64.b64encode(ciphertext).decode(),
        'nonce': base64.b64encode(nonce).decode(),
        'encrypted_data_key': base64.b64encode(encrypted_data_key).decode()
    }
    return json.dumps(result)
```

**Key Access Control:**
- Only backend application server has KMS permissions to decrypt keys
- Database administrators CANNOT decrypt pseudonymization keys (KMS access required)
- API NEVER exposes pseudonymization keys in responses

**Key Lifecycle:**

**Creation**: At user registration (one-time generation)
**Usage**: Every time user uploads graph or server pseudonymizes data
**Rotation**: NOT rotated (would break pseudonym stability across graph snapshots)
**Deletion**: When user deletes account (see [Section 4.6](#46-account-deletion-and-key-erasure))

**Why No Key Rotation:**
- Pseudonym stability required for longitudinal graph analysis
- Rotating key would produce different pseudonyms for same original user IDs
- Example: "User A" in January (old key) ≠ "User A" in March (new key) → breaks graph correlation

**Alternative**: If user wants to "reset" pseudonymization, they must:
1. Delete account (erases old key)
2. Re-register (generates new key)
3. Re-upload graphs (new pseudonyms generated)

---

### 4.4 Client-Side Label Storage

**Architecture:**

VSG client maintains a **local-only mapping** of pseudonymized IDs to human-readable labels (display names, usernames) in browser storage. This mapping is NEVER transmitted to the server.

**Storage Location: IndexedDB**

**Schema:**
```javascript
// IndexedDB database: "vsg_client_storage"
// Object store: "pseudonym_labels"

{
  pseudonymId: "node_a3f2b8c9...",  // Primary key (pseudonymized ID)
  displayName: "Jane Doe",           // Human-readable label
  username: "@janedoe",              // Platform username
  platform: "twitter",               // Platform type
  profilePhoto: "blob://...",        // Optional: cached photo (local blob URL)
  lastUpdated: "2025-12-27T10:00:00Z"
}
```

**Server-Side Pseudonymization Flow:**

**Step 1: User Uploads Social Media Archive**

User selects Twitter data archive (ZIP file) in browser.

**Step 2: Client Parses Archive (80% Client-Side Processing)**

```javascript
// Parse Twitter archive JSON files
const followingList = parseTwitterFollowing(archiveZip);

// Example parsed record:
{
  userId: "123456789",          // Original Twitter user ID
  displayName: "Jane Doe",
  username: "@janedoe",
  followerCount: 1234
}
```

**Step 3: Client Uploads Graph Data to Server**

Client uploads RAW graph data to server (server will perform pseudonymization):

```javascript
// Upload graph with ORIGINAL user IDs to server
// Server will pseudonymize and return mapping
const response = await fetch('/api/graphs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken()
  },
  credentials: 'include',
  body: JSON.stringify({
    name: "Twitter Following Network",
    platform: "twitter",
    nodes: followingList.map(user => ({
      originalId: user.userId,       // Original ID (will be pseudonymized server-side)
      followerCount: user.followerCount,
      // NO displayName sent to server
    })),
    edges: /* edge relationships with original IDs */
  })
});

// Server response includes graph ID and pseudonym mapping
{
  "graphId": "graph_01J...",
  "pseudonymMapping": {
    "123456789": "node_a3f2b8c9...",
    "987654321": "node_d4e5f6g7...",
    "555666777": "node_h8i9j0k1..."
  }
}
```

**Server Pseudonymization (POST /api/graphs Endpoint):**
```python
@app.post('/api/graphs')
def create_graph(request: CreateGraphRequest):
    user = get_authenticated_user(request)

    # 1. Decrypt user's pseudonymization key from database
    user_key = kms_decrypt(user.pseudonym_key_encrypted)

    # 2. Pseudonymize all node IDs (server-side only)
    pseudonym_mapping = {}
    pseudonymized_nodes = []

    for node in request.nodes:
        # Pseudonymize original ID
        pseudonym = hmac.new(
            key=user_key.encode(),
            msg=node['originalId'].encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        pseudonym_id = f"node_{pseudonym[:32]}"

        pseudonym_mapping[node['originalId']] = pseudonym_id

        # Store pseudonymized node (NO display names)
        pseudonymized_nodes.append({
            'id': pseudonym_id,
            'followerCount': node.get('followerCount'),
        })

    # 3. Store graph with pseudonymized IDs
    graph = Graph(
        id=generate_ulid(),
        user_id=user.id,
        name=request.name,
        platform=request.platform,
        nodes=pseudonymized_nodes,
        edges=pseudonymize_edges(request.edges, pseudonym_mapping),
        created_at=datetime.utcnow()
    )
    db.add(graph)
    db.commit()

    # 4. Return graph ID and pseudonym mapping to client
    return {
        "graphId": graph.id,
        "pseudonymMapping": pseudonym_mapping
    }
```

**Step 4: Client Stores Label Mapping Locally**

```javascript
// Store label mapping in IndexedDB (NEVER sent to server)
const db = await openDB('vsg_client_storage');
const tx = db.transaction('pseudonym_labels', 'readwrite');

const pseudonymMapping = response.pseudonymMapping;

for (const user of followingList) {
  await tx.store.put({
    pseudonymId: pseudonymMapping[user.userId],  // Pseudonym returned from server
    displayName: user.displayName,
    username: user.username,
    platform: "twitter",
    lastUpdated: new Date().toISOString()
  });
}

await tx.done;

console.log('Graph created:', response.graphId);
console.log('Label mapping stored locally (client-side only)');
```

**UI Rendering (Client-Side Only):**

When displaying graph visualization:

```javascript
// Fetch pseudonymized graph from server
const graph = await fetch('/api/graphs/graph_01J...').then(r => r.json());

// Render nodes with human-readable labels from IndexedDB
for (const node of graph.nodes) {
  // Lookup display name from local IndexedDB
  const label = await db.get('pseudonym_labels', node.id);

  // Render node with friendly label
  renderNode({
    id: node.id,
    label: label?.displayName || node.id,  // Fallback to pseudonym if label missing
    username: label?.username
  });
}
```

**Privacy Guarantees:**

**Guarantee 1: Server Never Sees Display Names**
- Client extracts display names/usernames from archive → stores in IndexedDB
- Client sends **NO display names/usernames** to server
- Server database contains NO human-readable labels

**Guarantee 2: Labels Never Leave Browser**
- IndexedDB is origin-scoped (only VSG frontend can access)
- No API endpoint accepts or returns display names/usernames
- Even if server is compromised, attacker cannot obtain client-stored labels

**Guarantee 3: User Can Clear Local Labels Anytime**
```javascript
// User action: "Clear local data"
const db = await openDB('vsg_client_storage');
await db.clear('pseudonym_labels');
// Result: User now sees only pseudonymized IDs (server data unaffected)
```

---

### 4.5 Timestamp Privacy Policy

**Principle: Day-Level Granularity for User-Facing Data**

To prevent temporal correlation attacks (linking VSG graphs to real-time social media activity), all user-facing timestamps are truncated to **day-level precision** (YYYY-MM-DD).

**Timestamp Types:**

**Type 1: User-Facing Timestamps (Day-Level Only)**

Stored in database, returned via API, displayed in UI.

**Fields:**
- `graph.uploadedOn` - When graph was uploaded
- `graph.createdAt` - When graph snapshot was taken
- `node.firstSeenDate` - When user first appeared in graph
- `node.lastInteractionDate` - When user last interacted
- `edge.interactionDate` - When edge relationship was observed

**Format:** `YYYY-MM-DD` (ISO 8601 date string)

**Example API Response:**
```json
{
  "id": "graph_01J...",
  "platform": "twitter",
  "uploadedOn": "2025-12-27",
  "createdAt": "2025-12-27",
  "nodes": [
    {
      "id": "node_a3f2b8c9...",
      "firstSeenDate": "2025-01-15",
      "lastInteractionDate": "2025-12-20"
    }
  ],
  "edges": [
    {
      "source": "node_a3f2b8c9...",
      "target": "node_d4e5f6g7...",
      "interactionDate": "2025-12-15"
    }
  ]
}
```

**Type 2: Server-Internal Timestamps (Full Precision)**

Used for security, operations, compliance auditing. NOT returned to users via API.

**Fields:**
- `audit_log.timestamp` - Security event logging (90-day retention)
- `rate_limit.resetAt` - Rate limit window expiry
- `session.expiresAt` - JWT session expiration
- `magic_link_token.expiresAt` - Token expiration

**Format:** `YYYY-MM-DDTHH:mm:ssZ` (ISO 8601 with timezone)

**Example (Audit Log):**
```json
{
  "event": "graph_created",
  "userId": "user_01J...",
  "graphId": "graph_01J...",
  "timestamp": "2025-12-27T14:32:17Z",  // Full precision
  "ipAddress": "203.0.113.42"
}
```

**Rationale for Day-Level Granularity:**

**Attack Prevented: Temporal Correlation**

**Scenario:**
1. Attacker obtains VSG database dump (via breach or insider access)
2. Attacker has access to Twitter's public API or scrapes public tweets
3. Attacker attempts to correlate VSG graph upload timestamps with tweet timestamps

**Without Day-Level Truncation:**
- VSG database shows: "Graph uploaded at 2025-12-27 14:32:17 UTC"
- Twitter shows: User tweeted "Just uploaded my social graph to VSG!" at 14:30 UTC
- **Correlation possible** → Attacker can link VSG user to Twitter account

**With Day-Level Truncation:**
- VSG database shows: "Graph uploaded on 2025-12-27"
- Twitter shows: User tweeted at some point on 2025-12-27
- **Correlation infeasible** → 86,400 seconds (24 hours) of uncertainty

**Longitudinal Analysis Still Possible:**

Day-level granularity sufficient for:
- Tracking graph evolution over weeks/months
- Identifying seasonal patterns (e.g., "follower count increased in Q3")
- Comparing snapshots (e.g., "graph density increased between January and March")

**NOT suitable for:**
- Hour-level behavioral analysis (intentionally prevented)
- Real-time activity tracking (out of scope for VSG)

---

### 4.6 Account Deletion and Key Erasure

**GDPR Right to Erasure Compliance:**

When user deletes account, pseudonymization key is permanently erased. This achieves **unlinking**: historical graph data remains in database but can NO LONGER be correlated to new data.

**Deletion Modes:**

VSG implements dual deletion modes (see [Section 6: GDPR Compliance](#6-gdpr-compliance)):

**Mode 1: Soft Delete (30-Day Grace Period)**

User initiates soft delete → account marked as deleted but recoverable for 30 days.

```python
def soft_delete_account(user: User):
    # 1. Mark account as deleted
    user.deleted_at = datetime.utcnow()
    user.restore_deadline = datetime.utcnow() + timedelta(days=30)

    # 2. Anonymize user email (prevent re-registration)
    user.email = f"deleted_{user.id}@anonymous.vsg"

    # 3. Revoke all sessions and API keys
    db.execute("DELETE FROM sessions WHERE user_id = :uid", uid=user.id)
    db.execute("UPDATE api_keys SET revoked_at = NOW() WHERE user_id = :uid", uid=user.id)

    # 4. Pseudonymization key NOT deleted yet (allows restore)
    db.commit()
```

**User can restore account within 30 days:**
```http
POST /api/account/restore HTTP/1.1
Authorization: Bearer {restore_token}
```

**Mode 2: Hard Delete (Immediate + Backup Purge)**

User initiates hard delete OR soft delete grace period expires → permanent deletion.

```python
def hard_delete_account(user: User):
    # 1. Delete pseudonymization key (CRITICAL for unlinking)
    user.pseudonym_key_encrypted = None

    # 2. Delete user record
    db.delete(user)

    # 3. Anonymize audit logs (replace user_id with "deleted_user")
    db.execute("""
        UPDATE audit_logs
        SET user_id = 'deleted_user',
            email = '[email protected]'
        WHERE user_id = :uid
    """, uid=user.id)

    # 4. Orphan graphs (set user_id = NULL)
    db.execute("""
        UPDATE graphs
        SET user_id = NULL,
            user_email = '[email protected]'
        WHERE user_id = :uid
    """, uid=user.id)

    # 5. Schedule backup purge (90-day window for offsite backups)
    schedule_backup_purge(user.id, execute_after_days=90)

    db.commit()
```

**Unlinking Mechanism:**

**Before Hard Delete:**
- User has pseudonymization key in database
- New graph upload → same pseudonyms as historical graphs (correlation possible)

**After Hard Delete:**
- Pseudonymization key DELETED from database
- Historical graphs remain in database (pseudonymized IDs preserved)
- **BUT**: If same user re-registers with new account:
  - New account gets NEW pseudonymization key
  - New graph uploads produce DIFFERENT pseudonyms
  - **Unlinking achieved**: Cannot correlate old graphs to new graphs

**Example:**

**Timeline:**
1. **2025-01-15**: User registers, uploads Twitter graph
   - Key: `abc123...`
   - Pseudonym for Twitter user "123456789": `node_a3f2b8c9...`

2. **2025-06-01**: User deletes account (hard delete)
   - Key `abc123...` DELETED from database
   - Graph with `node_a3f2b8c9...` remains in database (anonymized)

3. **2025-09-01**: Same person re-registers with same email
   - New key: `xyz789...` (different from deleted key)
   - Uploads Twitter graph again
   - Pseudonym for Twitter user "123456789": `node_h8i9j0k1...` (DIFFERENT from old pseudonym)

**Result:**
- Server cannot correlate old graph (`node_a3f2b8c9...`) to new graph (`node_h8i9j0k1...`)
- Even if server knows both graphs came from Twitter user "123456789", pseudonyms are unlinked

**Backup Purge (90-Day Window):**

To comply with GDPR right to erasure, deleted user data must be purged from all backups within 90 days.

```python
def purge_from_backups(user_id: str):
    # 1. Identify all backup files containing user data
    backup_files = list_backups_containing_user(user_id)

    # 2. For each backup, remove user records
    for backup_file in backup_files:
        # Option A: Restore backup, delete user data, re-backup
        # Option B: Use backup system's selective delete feature
        backup_system.delete_records(backup_file, user_id=user_id)

    # 3. Verify deletion (GDPR compliance audit)
    assert not any(backup_contains_user(bf, user_id) for bf in backup_files)

    # 4. Log purge completion
    log_audit_event("backup_purge_complete", user_id=user_id)
```

**GDPR Compliance Timeline:**

| Event | Timeline | Data State |
|-------|----------|------------|
| User initiates soft delete | Day 0 | Account marked deleted, key retained (restore possible) |
| Soft delete grace period expires | Day 30 | Hard delete triggered automatically |
| Hard delete executes | Day 30 | Key deleted, graphs orphaned, audit logs anonymized |
| Backup purge completes | Day 120 (Day 30 + 90) | User data removed from all backups |
| GDPR breach notification (if applicable) | <72 hours from breach discovery | Data Protection Authority notified |

---

## 5. Encryption & Transport Security

### 5.1 Transport Layer Security (TLS)

**Minimum TLS Version:**

Visual Social Graph enforces **TLS 1.3** for all production traffic. TLS 1.2 is supported ONLY during migration period (deprecated Q2 2026).

**TLS 1.3 Advantages:**
- **Reduced Latency**: 1-RTT handshake (vs 2-RTT in TLS 1.2)
- **Forward Secrecy**: Ephemeral key exchange (ECDHE) mandatory
- **Removed Weak Ciphers**: No RSA key exchange, no CBC mode ciphers
- **Zero-RTT Resumption**: Session resumption without handshake (with replay protection)

**TLS Configuration:**

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name visualsocialgraph.com;

    # TLS 1.3 only (TLS 1.2 during migration)
    ssl_protocols TLSv1.3 TLSv1.2;

    # TLS 1.3 cipher suites (automatically selected)
    ssl_prefer_server_ciphers off;

    # TLS 1.2 cipher suites (deprecated, remove Q2 2026)
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Certificates (Let's Encrypt, auto-renewed)
    ssl_certificate /etc/letsencrypt/live/visualsocialgraph.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/visualsocialgraph.com/privkey.pem;

    # OCSP Stapling (certificate validation)
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 valid=300s;

    # Session resumption (TLS 1.3 0-RTT)
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;  # Disabled for forward secrecy
}
```

**HTTP to HTTPS Redirect:**
```nginx
server {
    listen 80;
    server_name visualsocialgraph.com www.visualsocialgraph.com;

    # 301 permanent redirect to HTTPS
    return 301 https://visualsocialgraph.com$request_uri;
}
```

**HSTS (HTTP Strict Transport Security):**

**Purpose**: Force browsers to use HTTPS for all future requests to domain (prevents SSL stripping attacks).

**Header Configuration:**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**HSTS Directive Breakdown:**

| Directive | Value | Purpose |
|-----------|-------|---------|
| `max-age` | `31536000` (365 days) | Browsers cache HTTPS requirement for 1 year |
| `includeSubDomains` | Enabled | Apply HSTS to all subdomains (api.visualsocialgraph.com, staging.visualsocialgraph.com) |
| `preload` | Enabled | Submit to HSTS preload list (browsers enforce HTTPS even on first visit) |

**HSTS Preload List Submission:**
- Submit domain to https://hstspreload.org/
- Browsers (Chrome, Firefox, Safari) ship with preload list
- Users CANNOT bypass HTTPS even on first visit (prevents MITM attacks)

**Certificate Management:**

**Provider**: Let's Encrypt (free, automated)

**Certificate Specifications:**
- **Type**: Domain-validated (DV)
- **Algorithm**: ECDSA P-256 (preferred) or RSA 2048-bit
- **Validity**: 90 days (auto-renewed via Certbot)
- **SANs**: visualsocialgraph.com, www.visualsocialgraph.com, api.visualsocialgraph.com

**Auto-Renewal (Certbot):**
```bash
# Certbot cron job (runs twice daily)
0 0,12 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

**Certificate Monitoring:**
- Alert if certificate expires within 14 days (backup manual renewal)
- Monitor OCSP stapling status (ensure certificate validation works)

**Threat Scenarios Mitigated:**

**Scenario 1: SSL Stripping Attack**
- **Attack**: MITM downgrades HTTPS to HTTP, intercepts plaintext traffic
- **Mitigation**: HSTS forces HTTPS, browsers reject HTTP connections

**Scenario 2: Man-in-the-Middle (Weak TLS)**
- **Attack**: Attacker forces downgrade to TLS 1.0 with weak ciphers
- **Mitigation**: TLS 1.3 mandatory, weak ciphers disabled

**Scenario 3: Certificate Impersonation**
- **Attack**: Attacker uses fake certificate to impersonate VSG
- **Mitigation**: HSTS preload list ensures browser only trusts valid certificates

---

### 5.2 Data Encryption at Rest

**Database Encryption:**

**PostgreSQL Encryption:**

VSG uses **application-level encryption** (AES-256-GCM) for sensitive columns, layered on top of cloud provider's transparent data encryption (TDE).

**Why Two Layers:**
- **TDE (Cloud Provider)**: Protects against physical disk theft or snapshot compromise
- **Application-Level**: Protects against database compromise or insider access

**Encrypted Columns:**

```sql
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,

    -- ENCRYPTED: Pseudonymization key (AES-256-GCM via KMS)
    pseudonym_key_encrypted TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

**Encryption Implementation (Python Example):**

```python
import boto3
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

kms_client = boto3.client('kms', region_name='us-east-1')

def encrypt_column(plaintext: str) -> str:
    """Encrypt sensitive column using AWS KMS envelope encryption"""

    # 1. Generate data key from KMS
    response = kms_client.generate_data_key(
        KeyId='alias/vsg-database-master-key',
        KeySpec='AES_256'
    )

    plaintext_data_key = response['Plaintext']  # 256-bit AES key
    encrypted_data_key = response['CiphertextBlob']  # KMS-encrypted data key

    # 2. Encrypt plaintext with data key (AES-256-GCM)
    aesgcm = AESGCM(plaintext_data_key)
    nonce = os.urandom(12)  # 96-bit nonce
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)

    # 3. Bundle encrypted data + nonce + encrypted data key
    envelope = {
        'ciphertext': base64.b64encode(ciphertext).decode(),
        'nonce': base64.b64encode(nonce).decode(),
        'encrypted_data_key': base64.b64encode(encrypted_data_key).decode()
    }

    return json.dumps(envelope)

def decrypt_column(envelope_json: str) -> str:
    """Decrypt sensitive column using AWS KMS"""

    envelope = json.loads(envelope_json)

    # 1. Decrypt data key using KMS
    response = kms_client.decrypt(
        CiphertextBlob=base64.b64decode(envelope['encrypted_data_key'])
    )
    plaintext_data_key = response['Plaintext']

    # 2. Decrypt ciphertext with data key
    aesgcm = AESGCM(plaintext_data_key)
    nonce = base64.b64decode(envelope['nonce'])
    ciphertext = base64.b64decode(envelope['ciphertext'])

    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode('utf-8')
```

**KMS Key Management:**

**Master Key Specifications:**
- **Key Type**: AWS KMS Customer Master Key (CMK) or GCP Cloud KMS
- **Algorithm**: AES-256-GCM
- **Rotation**: Automatic annual rotation (KMS-managed)
- **Access Control**: IAM policies restrict access to application server only

**KMS Access Policy (AWS IAM):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppServerDecryption",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/VSG-Application-Server"
      },
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/abc123..."
    }
  ]
}
```

**File Storage Encryption (S3/GCS):**

**AWS S3 Configuration:**
```json
{
  "Rules": [
    {
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:us-east-1:123456789012:key/abc123..."
      },
      "BucketKeyEnabled": true
    }
  ]
}
```

**Encrypted Resources:**
- **Graph JSON Files**: Stored in S3 with SSE-KMS encryption
- **PDF Exports**: Encrypted at rest, signed URLs with 7-day expiry
- **Raw ZIP Uploads**: Encrypted during server-side fallback processing, deleted after processing

**Backup Encryption:**

**PostgreSQL Backups:**
- **Tool**: pg_dump with encryption via GPG
- **Encryption Key**: Stored in KMS, rotated annually
- **Retention**: 90 days (see [Section 4.6](#46-account-deletion-and-key-erasure))

**Backup Encryption Command:**
```bash
pg_dump -h localhost -U vsg_user vsg_db | \
  gpg --encrypt --recipient backup@visualsocialgraph.com | \
  aws s3 cp - s3://vsg-backups/vsg_db_$(date +%Y%m%d).sql.gpg \
  --server-side-encryption aws:kms \
  --ssekms-key-id arn:aws:kms:us-east-1:123456789012:key/backup-key
```

**Threat Scenarios Mitigated:**

**Scenario 1: Database Snapshot Leak**
- **Attack**: Attacker obtains database snapshot (e.g., misconfigured S3 bucket)
- **Mitigation**: Pseudonymization keys encrypted, attacker cannot decrypt without KMS access

**Scenario 2: Insider Threat (DBA Access)**
- **Attack**: Malicious database administrator exports user data
- **Mitigation**: Application-level encryption prevents DBA from reading encrypted columns without application credentials

**Scenario 3: Cloud Provider Breach**
- **Attack**: Attacker compromises cloud provider's infrastructure
- **Mitigation**: KMS keys remain secure (hardware security modules), encrypted data unreadable

---

## 6. GDPR & Data Protection Compliance

### 6.1 GDPR Legal Basis

**Lawful Basis for Processing (Article 6):**

Visual Social Graph processes personal data under the following lawful bases:

**1. Consent (Article 6(1)(a)):**
- **Scope**: Processing social media archive data (graph structure, metadata)
- **Implementation**: Explicit opt-in during account creation and file upload
- **Withdrawal**: User can delete account at any time (see [Section 4.6](#46-account-deletion-and-key-erasure))

**2. Contract Performance (Article 6(1)(b)):**
- **Scope**: Providing graph analysis service, generating insights, delivering PDF exports
- **Implementation**: Terms of Service accepted on account creation
- **Necessity**: Cannot provide service without processing graph data

**3. Legitimate Interests (Article 6(1)(f)):**
- **Scope**: Security monitoring, fraud prevention, system performance optimization
- **Implementation**: Audit logging, rate limiting, error tracking
- **Balancing Test**: Security benefits outweigh minimal privacy impact (pseudonymized logs, 90-day retention)

**Data Processing Record (Article 30):**

VSG maintains internal documentation of all processing activities:

| Processing Activity | Legal Basis | Data Categories | Retention Period |
|---------------------|-------------|-----------------|------------------|
| Graph analysis | Consent | Pseudonymized social connections | Until user deletion |
| Insight generation | Contract | Graph structure, metrics | Until user deletion |
| Account management | Contract | Email, subscription tier | Until user deletion + 90 days |
| Audit logging | Legitimate interests | User ID, IP address, timestamps | 90 days |
| Payment processing | Contract | Stripe customer ID (no card data stored) | Until user deletion |

---

### 6.2 User Rights Implementation

**Right of Access (Article 15):**

**Endpoint**: `GET /api/account/data-export`

**Implementation:**
```python
@app.get('/api/account/data-export')
def export_user_data(user: User):
    """GDPR Article 15: Right of Access"""

    # 1. Gather all user data
    graphs = db.query(Graph).filter_by(user_id=user.id).all()
    insights = db.query(Insight).filter(Insight.graph_id.in_([g.id for g in graphs])).all()
    api_keys = db.query(APIKey).filter_by(user_id=user.id).all()
    audit_logs = db.query(AuditLog).filter_by(user_id=user.id).limit(1000).all()

    # 2. Export as JSON
    export = {
        "user": {
            "id": user.id,
            "email": user.email,
            "tier": user.subscription_tier,
            "created_at": user.created_at.isoformat()
        },
        "graphs": [
            {
                "id": g.id,
                "platform": g.platform,
                "node_count": g.node_count,
                "edge_count": g.edge_count,
                "created_at": g.created_at.isoformat()
            } for g in graphs
        ],
        "insights": [
            {
                "id": i.id,
                "category": i.category,
                "narrative": i.narrative,
                "created_at": i.created_at.isoformat()
            } for i in insights
        ],
        "api_keys": [
            {
                "id": k.id,
                "last_4": k.last_4,
                "created_at": k.created_at.isoformat(),
                "expires_at": k.expires_at.isoformat()
            } for k in api_keys
        ],
        "audit_logs": [
            {
                "event": log.event,
                "timestamp": log.timestamp.isoformat(),
                "ip_address": log.ip_address
            } for log in audit_logs
        ],
        "export_metadata": {
            "generated_at": datetime.utcnow().isoformat(),
            "format": "JSON",
            "gdpr_article": "Article 15 (Right of Access)"
        }
    }

    return export
```

**Response Time**: < 5 seconds (target)
**Format**: JSON (machine-readable)
**Frequency Limit**: 1 export per 24 hours (prevents abuse)

**Right to Rectification (Article 16):**

Users can update email address via account settings. Other data (graphs, insights) is immutable (delete and re-upload to correct).

**Endpoint**: `PATCH /api/account`

**Right to Erasure (Article 17):**

See [Section 4.6: Account Deletion and Key Erasure](#46-account-deletion-and-key-erasure) for complete implementation.

**Summary:**
- **Soft Delete**: 30-day grace period with restore option
- **Hard Delete**: Immediate deletion from active systems, 90-day backup purge
- **Unlinking**: Pseudonymization key deletion prevents correlation to new data

**Right to Data Portability (Article 20):**

Same endpoint as Right of Access (`GET /api/account/data-export`), returns structured JSON suitable for import to competing services.

**Right to Object (Article 21):**

Users can object to processing by deleting account. No automated decision-making or profiling in scope (insights are deterministic algorithms, not profiling).

---

### 6.3 Data Breach Notification

**Breach Detection:**

VSG monitors for security incidents using:
- **Intrusion Detection**: Cloudflare WAF, fail2ban
- **Anomaly Detection**: Unusual API access patterns, failed authentication spikes
- **Database Monitoring**: Unauthorized query patterns, data export anomalies

**Breach Notification Timeline (Article 33):**

| Milestone | Deadline | Action |
|-----------|----------|--------|
| Breach discovery | T+0 | Security team notified, incident response initiated |
| Internal assessment | T+24 hours | Scope, severity, affected users determined |
| **Supervisory authority notification** | **T+72 hours** | **Notify Data Protection Authority (DPA) if high risk** |
| Affected user notification | T+72 hours | Email notification if high risk to rights/freedoms |
| Post-mortem | T+7 days | Root cause analysis, remediation plan |

**Breach Notification Template (DPA):**

```
To: [Data Protection Authority]
From: Data Protection Officer, Visual Social Graph
Subject: GDPR Data Breach Notification (Article 33)

Breach Reference: BREACH-2025-001
Notification Date: 2025-12-27 14:00 UTC
Discovery Date: 2025-12-27 10:30 UTC

1. NATURE OF BREACH:
   - Unauthorized access to production database via SQL injection vulnerability
   - Attack vector: Unvalidated user input in /api/graphs endpoint

2. DATA CATEGORIES AFFECTED:
   - Pseudonymized graph structures (node IDs, edges)
   - User email addresses (encrypted)
   - Pseudonymization keys (KMS-encrypted)

3. APPROXIMATE NUMBER OF AFFECTED DATA SUBJECTS:
   - 1,234 users

4. LIKELY CONSEQUENCES:
   - Low risk: Pseudonymization keys encrypted via KMS (attacker cannot decrypt)
   - Low risk: No human-readable display names stored server-side
   - Medium risk: Email addresses exposed (but encrypted at rest)

5. MEASURES TAKEN:
   - SQL injection vulnerability patched (2025-12-27 12:00 UTC)
   - Affected API endpoint disabled during remediation
   - Database access logs reviewed for data exfiltration (none detected)
   - KMS access logs reviewed (no unauthorized decryption attempts)

6. MITIGATION FOR DATA SUBJECTS:
   - Affected users notified via email
   - No action required from users (pseudonymization prevents identification)
   - Offer to delete accounts if users request

Contact: dpo@visualsocialgraph.com
```

**User Notification Template:**

```
Subject: Security Incident Notification - Visual Social Graph

Dear [User],

We are writing to inform you of a security incident affecting your Visual Social Graph account.

WHAT HAPPENED:
On December 27, 2025, we discovered unauthorized access to our database. The attacker exploited a vulnerability that has since been patched.

WHAT DATA WAS AFFECTED:
- Your email address
- Pseudonymized graph data (connections represented as anonymized IDs)

WHAT WAS NOT AFFECTED:
- No display names or usernames (we don't store these server-side)
- No payment information (handled by Stripe, not stored by us)
- Your pseudonymization keys remain encrypted and secure

RISK TO YOU:
We assess the risk as LOW. Our privacy-by-design architecture means the exposed data cannot identify individual people in your social graph.

WHAT WE'VE DONE:
- Patched the vulnerability immediately
- Enhanced monitoring to detect similar attacks
- Reviewed all access logs (no data exfiltration detected)

WHAT YOU SHOULD DO:
- No immediate action required
- If you wish to delete your account, you can do so at [account settings]
- If you have questions, contact support@visualsocialgraph.com

We sincerely apologize for this incident and are committed to protecting your data.

Visual Social Graph Security Team
```

**Exemptions from Notification:**

VSG is NOT required to notify users if:
- Data encrypted with key attacker cannot access (e.g., KMS-encrypted pseudonymization keys)
- Subsequent measures ensure data no longer poses risk
- Notification requires disproportionate effort (public communication alternative)

---

### 6.4 Data Retention Policy

**Retention Periods:**

| Data Type | Retention Period | Legal Basis | Deletion Method |
|-----------|------------------|-------------|-----------------|
| **User accounts** | Until deletion | Contract | Soft delete (30 days) → hard delete |
| **Graph snapshots** | Until deletion | Consent | Soft delete (30 days) → hard delete |
| **Insights** | Until graph deletion | Contract | Cascade delete with graph |
| **Audit logs** | 90 days | Legitimate interests (security) | Auto-purge after 90 days |
| **Raw ZIP uploads** | Immediately after processing | Contract | Auto-delete within 24 hours |
| **PDF exports** | 7 days | Contract | Auto-delete after 7 days |
| **Database backups** | 90 days | Legitimate interests (disaster recovery) | Deleted data purged from backups |

**Automatic Deletion Jobs:**

```python
# Cron job: Daily at 02:00 UTC
@cron('0 2 * * *')
def cleanup_expired_data():
    # 1. Hard-delete soft-deleted graphs after 30 days
    expired_graphs = db.query(Graph).filter(
        Graph.deleted_at < datetime.utcnow() - timedelta(days=30)
    ).all()
    for graph in expired_graphs:
        hard_delete_graph(graph)

    # 2. Purge audit logs older than 90 days
    db.execute("""
        DELETE FROM audit_logs
        WHERE timestamp < NOW() - INTERVAL '90 days'
    """)

    # 3. Delete expired PDF exports
    db.execute("""
        DELETE FROM exports
        WHERE created_at < NOW() - INTERVAL '7 days'
    """)

    # 4. Delete failed uploads older than 7 days
    db.execute("""
        DELETE FROM uploads
        WHERE status = 'failed'
        AND created_at < NOW() - INTERVAL '7 days'
    """)
```

---

### 6.5 Third-Party Data Processors

**Stripe (Payment Processing):**
- **Data Shared**: Customer email, subscription tier
- **Data NOT Shared**: Graph data, pseudonymization keys
- **DPA**: Stripe Data Processing Agreement signed
- **Location**: US (Privacy Shield certified)
- **Retention**: Stripe retains payment data per their policy (VSG deletes customer ID on account deletion)

**Google (OAuth Authentication):**
- **Data Shared**: Email address (for identity verification only)
- **Data NOT Shared**: Graph data, social media archives
- **Scope**: `openid email profile` (minimal)
- **Retention**: Google retains OAuth grants per their policy

**Sentry (Error Monitoring):**
- **Data Shared**: Error logs, stack traces, user IDs (pseudonymized)
- **PII Scrubbing**: See [Section 9.5: Sentry Error Monitoring & PII Scrubbing](#95-sentry-error-monitoring--pii-scrubbing)
- **DPA**: Sentry Data Processing Agreement signed
- **Retention**: 90 days (aligned with VSG audit log retention)

**List of Sub-Processors:**

See [Appendix E: Third-Party Service Providers](#appendix-e-third-party-service-providers) for complete list with security assessments.

---

## 7. Input Validation & Injection Prevention

### 7.1 Input Validation Rules

**String Length Limits:**

| Field | Max Length | Validation Rule |
|-------|------------|-----------------|
| Email | 255 characters | RFC 5322 format |
| Platform | 20 characters | Enum: `twitter`, `instagram`, `linkedin`, `facebook`, `tiktok` |
| Graph ID | 32 characters | Pattern: `^graph_[A-Za-z0-9]{26}$` (ULID format) |
| Display name (client-only) | 100 characters | UTF-8, no control characters |
| Username (client-only) | 50 characters | UTF-8, alphanumeric + underscore |
| Insight narrative | 1000 characters | UTF-8, sanitized for XSS |
| Error message | 500 characters | Alphanumeric + punctuation |

**Numeric Validation:**

| Field | Min | Max | Validation |
|-------|-----|-----|------------|
| Node count | 1 | 1,000,000 | Integer, positive |
| Edge count | 0 | 10,000,000 | Integer, non-negative |
| Graph size (JSON) | 1 byte | 50 MB | File size validation |
| Pagination limit | 1 | 100 | Default: 20 |

**Date/Time Validation:**

| Field | Format | Example | Validation |
|-------|--------|---------|------------|
| User-facing timestamps | `YYYY-MM-DD` | `2025-12-27` | ISO 8601 date, day-level only |
| Server-internal timestamps | `YYYY-MM-DDTHH:mm:ssZ` | `2025-12-27T14:32:00Z` | ISO 8601 datetime with UTC timezone |
| Magic link expiry | ISO 8601 datetime | `2025-12-27T14:47:00Z` | Must be future timestamp |

**Enum Validation:**

```typescript
// Platform validation (OpenAPI schema enforcement)
enum Platform {
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok'
}

// Reject any value not in enum
if (!Object.values(Platform).includes(request.body.platform)) {
  throw new ValidationError('INVALID_ENUM_VALUE', 'Platform must be one of: twitter, instagram, linkedin, facebook, tiktok');
}
```

---

### 7.2 SQL Injection Prevention

**Parameterized Queries (PRIMARY DEFENSE):**

VSG uses Prisma ORM which automatically parameterizes all queries. Direct SQL execution is PROHIBITED except for read-only analytics queries (reviewed by security team).

**Safe Example (Prisma):**
```typescript
// SAFE: Prisma automatically parameterizes
const user = await prisma.user.findUnique({
  where: { email: userInput }  // userInput automatically escaped
});
```

**Unsafe Example (BANNED):**
```typescript
// UNSAFE: String concatenation (banned in code review)
const query = `SELECT * FROM users WHERE email = '${userInput}'`;  // ❌ SQL injection risk
db.execute(query);
```

**Database User Permissions:**

Application database user has minimal privileges (principle of least privilege):

```sql
-- Application user (vsg_app) permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON graphs, insights, users TO vsg_app;
REVOKE ALL ON pg_catalog FROM vsg_app;  -- No schema modifications
REVOKE ALL ON information_schema FROM vsg_app;  -- No metadata access

-- Read-only analytics user (vsg_analytics)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO vsg_analytics;
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES FROM vsg_analytics;
```

**Threat Scenario Mitigated:**

**Scenario: SQL Injection via Graph Filter**
- **Attack**: Malicious user sends: `GET /api/graphs?platform=twitter' OR '1'='1`
- **Without Protection**: Query becomes: `SELECT * FROM graphs WHERE platform = 'twitter' OR '1'='1'` → returns ALL graphs
- **With Prisma**: Input automatically escaped: `SELECT * FROM graphs WHERE platform = 'twitter'' OR ''1''=''1'` → returns 0 results

---

### 7.3 XSS (Cross-Site Scripting) Prevention

**Output Encoding:**

All user-generated content HTML-escaped before rendering in browser.

**React Automatic Escaping:**
```jsx
// SAFE: React automatically escapes
<div>{user.email}</div>  // <script> rendered as &lt;script&gt;

// UNSAFE: dangerouslySetInnerHTML bypasses escaping (banned except for markdown)
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // ❌ XSS risk
```

**Markdown Sanitization:**

Insight narratives support limited Markdown (bold, italic, lists). Sanitized using DOMPurify before rendering.

```typescript
import DOMPurify from 'dompurify';

function renderInsightNarrative(markdown: string): string {
  // 1. Convert Markdown to HTML (safe library)
  const html = marked.parse(markdown);

  // 2. Sanitize HTML (remove script tags, event handlers)
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'p'],
    ALLOWED_ATTR: []  // No attributes allowed
  });

  return clean;
}
```

**Content Security Policy (CSP):**

See [Section 11.1: Content Security Policy](#111-content-security-policy) for complete CSP implementation.

---

### 7.4 Command Injection Prevention

**No Shell Execution of User Input:**

VSG does NOT execute shell commands with user input. File processing uses language-native libraries (Python `zipfile`, not `unzip` command).

**Banned Pattern:**
```python
# ❌ UNSAFE: Command injection risk
import subprocess
filename = request.files['archive'].filename
subprocess.run(f"unzip {filename}", shell=True)  # Banned in code review
```

**Safe Pattern:**
```python
# ✅ SAFE: Native library
import zipfile
with zipfile.ZipFile(request.files['archive']) as zf:
    zf.extractall('/tmp/uploads')
```

---

## 8. Rate Limiting & Quota Management

### 8.1 Rate Limiting Architecture

**Algorithm: Token Bucket**

VSG uses token bucket algorithm for rate limiting:
- **Bucket Capacity**: Maximum requests allowed in window
- **Refill Rate**: Tokens added per second
- **Burst Handling**: Allows burst traffic up to bucket capacity

**Implementation (Redis-backed):**

```python
import redis
import time

redis_client = redis.Redis(host='localhost', port=6379)

def check_rate_limit(user_id: str, endpoint: str, limit: int, window_seconds: int) -> bool:
    """
    Token bucket rate limiting with Redis

    Args:
        user_id: User identifier
        endpoint: API endpoint (e.g., 'POST /api/graphs')
        limit: Maximum requests in window
        window_seconds: Time window in seconds

    Returns:
        True if request allowed, False if rate limited
    """

    key = f"ratelimit:{user_id}:{endpoint}"
    current_time = int(time.time())

    # 1. Get current token count
    pipe = redis_client.pipeline()
    pipe.zremrangebyscore(key, 0, current_time - window_seconds)  # Remove expired tokens
    pipe.zcard(key)  # Count remaining tokens
    pipe.zadd(key, {current_time: current_time})  # Add current request
    pipe.expire(key, window_seconds)  # Set expiry

    results = pipe.execute()
    request_count = results[1]

    # 2. Check if under limit
    if request_count < limit:
        return True  # Allow request
    else:
        return False  # Reject request (429 Too Many Requests)
```

**Rate Limit Headers:**

All API responses include rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 73
X-RateLimit-Reset: 1735094400
```

**429 Response (Rate Limited):**

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735094400
Retry-After: 43200
Content-Type: application/json

{
  "error": {
    "id": "err_01J...",
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

---

### 8.2 Per-Tier Quotas

See [VSG_API_SPECIFICATION.md Appendix B](VSG_API_SPECIFICATION.md#appendix-b-rate-limits--quotas) for complete quota specifications.

**Summary:**

| Endpoint | Free | Pro | Creator | Window |
|----------|------|-----|---------|--------|
| `POST /api/graphs` | 5/day | 100/day | 500/day | 24 hours |
| `POST /api/insights` | 10/day | Unlimited | Unlimited | 24 hours |
| `POST /api/exports/pdf` | 1/day | 50/day | 200/day | 24 hours |
| `POST /api/auth/magic-link` | 5/hour | 5/hour | 5/hour | 1 hour |
| `GET /api/graphs` | 100/hour | 500/hour | 1000/hour | 1 hour |

**Quota vs Rate Limit Distinction:**

- **Rate Limit**: Short-window throttling (e.g., 5 requests/hour) → Returns `429` with `RATE_LIMITED`
- **Quota**: Tier-based daily/monthly limits (e.g., 5 graphs/day Free tier) → Returns `429` with `QUOTA_EXCEEDED`

---

### 8.3 IP-Based Rate Limiting (Unauthenticated Endpoints)

**Endpoints:**
- `POST /api/auth/magic-link` (before authentication)
- `POST /api/auth/verify` (before authentication)
- `GET /api/auth/google/callback` (OAuth callback)

**Limits:**
- 10 requests per IP per hour
- Prevents brute force attacks on authentication endpoints

**Cloudflare WAF Integration:**

VSG uses Cloudflare WAF for additional IP-based protection:
- Block IPs with >100 requests/minute (DDoS protection)
- Challenge suspicious IPs with CAPTCHA
- Block known malicious IPs (Cloudflare threat intelligence)

---

## 9. Audit Logging & Monitoring

### 9.1 Audit Event Taxonomy

VSG logs security-relevant events for accountability, forensics, and threat detection.

**Event Categories:**

| Category | Events Logged | Retention |
|----------|---------------|-----------|
| Authentication | Login attempts, logout, password reset, magic link generation, OAuth flows | 90 days |
| Authorization | Permission denials, tier gate violations, API key usage | 90 days |
| Graph Operations | Graph creation, deletion, sharing, export (metadata only) | 90 days |
| Data Access | Data export requests (GDPR Article 15), account deletion requests | 2 years |
| Payment Events | Subscription changes, payment failures, refunds | 7 years (tax compliance) |
| Security Events | Rate limit violations, CSRF failures, invalid tokens, suspicious activity | 90 days |
| Administrative Actions | User tier changes (manual), support access to accounts | 2 years |
| Errors | 4xx/5xx HTTP errors, unhandled exceptions, integration failures | 30 days |

**Events NOT Logged (Privacy Protection):**

- Graph content (node names, edge data) - Constitutional Constraint C2
- User social media credentials or passwords
- Full request/response bodies (only metadata)
- IP addresses beyond first 3 octets (e.g., `192.168.1.xxx`)

---

### 9.2 Audit Log Format

**Standard Schema (JSON):**

```json
{
  "event_id": "01HN3VQXK8M9PQRSTUVWXYZ012",
  "timestamp": "2025-12-27T14:23:45.678Z",
  "event_type": "authentication.login.success",
  "actor": {
    "user_id": "01HN3VQX...",
    "email_hash": "sha256:a3f5...",
    "ip_prefix": "203.0.113.xxx",
    "user_agent_family": "Chrome"
  },
  "resource": {
    "type": "user_session",
    "id": "01HN3VQXK8M9..."
  },
  "context": {
    "request_id": "req_abc123",
    "endpoint": "/api/auth/login",
    "method": "POST",
    "status_code": 200,
    "duration_ms": 142
  },
  "metadata": {
    "auth_method": "magic_link",
    "mfa_enabled": false
  }
}
```

**Field Definitions:**

- `event_id`: ULID (unique, lexicographically sortable)
- `timestamp`: ISO 8601 UTC timestamp
- `event_type`: Hierarchical dot-separated namespace (e.g., `graph.create.success`)
- `actor.user_id`: VSG user ID (or `anonymous` for unauthenticated events)
- `actor.email_hash`: SHA-256 hash of email (for correlation without PII exposure)
- `actor.ip_prefix`: First 3 octets only (GDPR minimization)
- `resource`: The object being acted upon
- `context.request_id`: Correlate with application logs
- `metadata`: Event-specific additional data

**Example: Failed Login Attempt:**

```json
{
  "event_id": "01HN3VRX...",
  "timestamp": "2025-12-27T14:25:12.345Z",
  "event_type": "authentication.login.failure",
  "actor": {
    "user_id": "anonymous",
    "email_hash": "sha256:d4e6...",
    "ip_prefix": "198.51.100.xxx",
    "user_agent_family": "curl"
  },
  "resource": {
    "type": "user_session",
    "id": null
  },
  "context": {
    "request_id": "req_def456",
    "endpoint": "/api/auth/login",
    "method": "POST",
    "status_code": 401,
    "duration_ms": 89
  },
  "metadata": {
    "failure_reason": "invalid_magic_link_token",
    "token_expired": true
  }
}
```

---

### 9.3 Log Retention & Storage

**PostgreSQL Audit Table:**

```sql
CREATE TABLE audit_logs (
    event_id VARCHAR(26) PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(26),
    email_hash VARCHAR(71),  -- 'sha256:' + 64 hex chars
    ip_prefix VARCHAR(15),
    resource_type VARCHAR(50),
    resource_id VARCHAR(26),
    context JSONB,
    metadata JSONB,

    -- Indexes for common queries
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_event_type ON audit_logs(event_type, timestamp DESC);
CREATE INDEX idx_audit_email_hash ON audit_logs(email_hash, timestamp DESC);
```

**Retention Policies:**

> **IMPORTANT:** Different log types have different retention periods based on legal, compliance, and operational requirements. The table below explicitly categorizes each log type.

| Category | Event Types Included | Retention Period | Justification | Archive Location | Deletion Method |
|----------|---------------------|------------------|---------------|------------------|-----------------|
| **Security Audit Logs** | `authentication.*`, `authorization.*`, `security.*`, rate limit violations, CSRF failures, invalid tokens | **90 days** | GDPR minimization, incident investigation window | S3 Glacier (compressed) | Automatic job |
| **Data Access Logs** | GDPR Article 15 data export requests, account deletion requests (`gdpr.*`) | **2 years** | Legal defense, regulatory compliance (GDPR Article 30) | S3 Standard-IA | Automatic job |
| **Payment/Tax Records** | Subscription changes, payment failures, refunds, invoices (`payment.*`, `subscription.*`) | **7 years** | Tax law compliance (IRS/HMRC requirements) - **Stripe's responsibility**, not VSG's | S3 Glacier Deep Archive | Manual review (after 7 years) |
| **Error Logs** | 4xx/5xx HTTP errors, unhandled exceptions, integration failures (`error.*`) | **30 days** | Debugging, operational monitoring only | PostgreSQL only (not archived) | Automatic job |
| **Graph Operations** | Graph creation, deletion, sharing, export metadata (`graph.*`) | **90 days** | Operational audit trail, no legal requirement | S3 Glacier (compressed) | Automatic job |

**Automatic Deletion Job (Python Cron):**

```python
@cron.job('0 2 * * *')  # Daily at 2 AM UTC
def purge_expired_audit_logs():
    """Delete audit logs past retention period"""

    now = datetime.utcnow()

    # 1. Delete authentication/security logs >90 days
    cutoff_90d = now - timedelta(days=90)
    db.execute("""
        DELETE FROM audit_logs
        WHERE event_type LIKE 'authentication.%'
          AND timestamp < :cutoff
    """, {'cutoff': cutoff_90d})

    # 2. Delete error logs >30 days
    cutoff_30d = now - timedelta(days=30)
    db.execute("""
        DELETE FROM audit_logs
        WHERE event_type LIKE 'error.%'
          AND timestamp < :cutoff
    """, {'cutoff': cutoff_30d})

    # 3. Archive data access logs >2 years to S3 Glacier
    cutoff_2y = now - timedelta(days=730)
    old_logs = db.execute("""
        SELECT * FROM audit_logs
        WHERE event_type LIKE 'data_access.%'
          AND timestamp < :cutoff
    """, {'cutoff': cutoff_2y}).fetchall()

    if old_logs:
        # Upload to S3 Glacier
        s3_client.put_object(
            Bucket='vsg-audit-archive',
            Key=f'audit_logs_{cutoff_2y.date()}.json.gz',
            Body=gzip.compress(json.dumps(old_logs).encode()),
            StorageClass='GLACIER'
        )

        # Delete from PostgreSQL
        db.execute("""
            DELETE FROM audit_logs
            WHERE event_type LIKE 'data_access.%'
              AND timestamp < :cutoff
        """, {'cutoff': cutoff_2y})

    db.commit()
    logger.info(f"Purged audit logs older than retention periods")
```

---

### 9.4 Security Monitoring & Alerting

**Alerting Rules (PagerDuty Integration):**

| Alert | Trigger Condition | Severity | Response Time |
|-------|-------------------|----------|---------------|
| Credential Stuffing Attack | >50 failed logins from same IP prefix in 10 minutes | P1 | 30 minutes |
| Mass Data Export | >10 data export requests in 1 hour | P2 | 4 hours |
| Unusual Admin Activity | Admin tier change outside business hours | P2 | 4 hours |
| CSRF Validation Failures | >100 CSRF failures in 5 minutes | P1 | 30 minutes |
| Rate Limit Abuse | Single user/IP hits rate limit >20 times in 1 hour | P3 | Next business day |
| Database Connection Errors | >10 database connection failures in 1 minute | P0 | Immediate |

**Monitoring Queries (Cron: Every 5 Minutes):**

```python
def detect_credential_stuffing():
    """Alert on credential stuffing attacks"""

    cutoff = datetime.utcnow() - timedelta(minutes=10)

    # Count failed logins per IP prefix
    results = db.execute("""
        SELECT ip_prefix, COUNT(*) as failure_count
        FROM audit_logs
        WHERE event_type = 'authentication.login.failure'
          AND timestamp > :cutoff
        GROUP BY ip_prefix
        HAVING COUNT(*) > 50
    """, {'cutoff': cutoff}).fetchall()

    for row in results:
        # Trigger PagerDuty alert
        pagerduty.trigger_incident(
            title=f"Credential stuffing attack from {row.ip_prefix}",
            severity='error',
            details={
                'ip_prefix': row.ip_prefix,
                'failure_count': row.failure_count,
                'timeframe': '10 minutes'
            }
        )

        # Auto-block IP in Cloudflare WAF
        cloudflare.block_ip_prefix(row.ip_prefix, duration_hours=24)
```

**Dashboard Metrics (Grafana):**

- Authentication success/failure rate (per minute)
- API endpoint latency (p50, p95, p99)
- Rate limit hit rate by tier
- Database query performance
- Error rate by category (4xx vs 5xx)

---

### 9.5 Sentry Error Monitoring & PII Scrubbing

**Why Sentry:**
- Real-time error tracking with stack traces
- Release tracking for regression detection
- Performance monitoring (transaction tracing)
- User feedback collection

**Critical Privacy Requirement:**

Sentry collects error context including request headers, cookies, and environment variables. **By default, this exposes PII** (emails, session tokens, IP addresses). VSG **MUST** scrub PII before sending to Sentry.

**Sentry SDK Configuration (Python - Backend):**

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

def scrub_pii(event, hint):
    """
    beforeSend hook to scrub PII from Sentry events

    Fields to scrub:
    - Email addresses
    - Session tokens (JWT, CSRF)
    - API keys
    - IP addresses (keep first 3 octets only)
    - User-Agent strings (keep family only)
    - Cookie values
    """

    # 1. Scrub request data
    if 'request' in event:
        request = event['request']

        # Scrub headers
        if 'headers' in request:
            sensitive_headers = ['Cookie', 'Authorization', 'X-CSRF-Token']
            for header in sensitive_headers:
                if header in request['headers']:
                    request['headers'][header] = '[Filtered]'

        # Scrub cookies
        if 'cookies' in request:
            request['cookies'] = {k: '[Filtered]' for k in request['cookies']}

        # Scrub query parameters
        if 'query_string' in request:
            # Remove email parameters
            request['query_string'] = re.sub(
                r'email=[^&]*',
                'email=[Filtered]',
                request['query_string']
            )

        # Scrub IP address (keep first 3 octets)
        if 'env' in request and 'REMOTE_ADDR' in request['env']:
            ip = request['env']['REMOTE_ADDR']
            request['env']['REMOTE_ADDR'] = '.'.join(ip.split('.')[:3]) + '.xxx'

    # 2. Scrub user context (keep user ID, scrub email)
    if 'user' in event:
        if 'email' in event['user']:
            # Replace with SHA-256 hash
            email = event['user']['email']
            event['user']['email_hash'] = hashlib.sha256(email.encode()).hexdigest()
            del event['user']['email']

        if 'ip_address' in event['user']:
            ip = event['user']['ip_address']
            event['user']['ip_address'] = '.'.join(ip.split('.')[:3]) + '.xxx'

    # 3. Scrub exception messages
    if 'exception' in event:
        for exception in event['exception'].get('values', []):
            if 'value' in exception:
                # Redact email addresses in error messages
                exception['value'] = re.sub(
                    r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                    '[email]',
                    exception['value']
                )

                # Redact ULIDs/tokens
                exception['value'] = re.sub(
                    r'\b[0-9A-Z]{26}\b',
                    '[ULID]',
                    exception['value']
                )

    # 4. Scrub extra context
    if 'extra' in event:
        sensitive_keys = ['password', 'token', 'secret', 'api_key', 'private_key']
        for key in list(event['extra'].keys()):
            if any(s in key.lower() for s in sensitive_keys):
                event['extra'][key] = '[Filtered]'

    return event

# Initialize Sentry with PII scrubbing
sentry_sdk.init(
    dsn="https://abc123@o123456.ingest.sentry.io/7890123",
    integrations=[FlaskIntegration()],
    environment="production",
    release="vsg@1.2.3",

    # PII scrubbing hook
    before_send=scrub_pii,

    # Sample rate (10% of errors, 1% of transactions)
    traces_sample_rate=0.01,
    sample_rate=0.10,

    # Capture user context (without PII)
    send_default_pii=False,

    # Attach stack traces for all events
    attach_stacktrace=True
)
```

**Sentry SDK Configuration (TypeScript - Frontend):**

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://abc123@o123456.ingest.sentry.io/7890123',
  environment: process.env.NODE_ENV,
  release: 'vsg@1.2.3',

  // PII scrubbing
  beforeSend(event, hint) {
    // 1. Scrub localStorage/sessionStorage
    if (event.contexts?.['storage']) {
      delete event.contexts['storage'];
    }

    // 2. Scrub cookies
    if (event.request?.cookies) {
      event.request.cookies = {};
    }

    // 3. Scrub user email (keep user ID only)
    if (event.user?.email) {
      delete event.user.email;
    }

    // 4. Scrub breadcrumb data
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          // Remove sensitive data from breadcrumbs
          const sanitized = { ...breadcrumb.data };
          delete sanitized.email;
          delete sanitized.token;
          delete sanitized.apiKey;
          return { ...breadcrumb, data: sanitized };
        }
        return breadcrumb;
      });
    }

    return event;
  },

  // Sample 5% of sessions for performance monitoring
  tracesSampleRate: 0.05,

  // Never send PII automatically
  sendDefaultPii: false
});
```

**Validation Test (CI/CD Pipeline):**

```python
def test_sentry_pii_scrubbing():
    """Verify Sentry scrubs PII before sending"""

    # Simulate error with PII
    try:
        user = {'email': 'test@example.com', 'id': '01HN3VQX...'}
        raise ValueError(f"User {user['email']} encountered error")
    except ValueError:
        # Capture exception
        event_id = sentry_sdk.capture_exception()

    # Wait for Sentry to process
    time.sleep(2)

    # Fetch event from Sentry API
    event = sentry_api.get_event(event_id)

    # Assertions
    assert 'test@example.com' not in json.dumps(event), "Email leaked to Sentry!"
    assert event['user'].get('email') is None, "User email not scrubbed!"
    assert event['user'].get('email_hash') is not None, "Email hash missing!"
    assert event['request']['headers'].get('Cookie') == '[Filtered]', "Cookie not scrubbed!"
```

**Sentry Sampling Strategy:**

| Environment | Error Sample Rate | Transaction Sample Rate | Rationale |
|-------------|-------------------|-------------------------|-----------|
| Development | 100% | 100% | Full visibility for debugging |
| Staging | 50% | 10% | Balance between coverage and cost |
| Production | 10% | 1% | Cost optimization (VSG is early-stage) |

---

### 9.6 Database Access Logging

**PostgreSQL Audit Extension (pgAudit):**

```sql
-- Enable pgAudit extension
CREATE EXTENSION pgaudit;

-- Log all DDL (schema changes)
ALTER SYSTEM SET pgaudit.log = 'ddl';

-- Log all writes to sensitive tables
ALTER SYSTEM SET pgaudit.log_relation = 'on';

-- Reload configuration
SELECT pg_reload_conf();
```

**Tables to Audit (All Writes):**

- `users` (account creation, tier changes, deletions)
- `pseudonymization_keys` (key generation, deletion)
- `api_keys` (Bearer token creation, revocation)
- `audit_logs` (tamper detection)

**Sample Audit Log (PostgreSQL):**

```
2025-12-27 14:30:12 UTC [12345] LOG: AUDIT: SESSION,1,1,WRITE,DELETE,TABLE,public.users,
  "DELETE FROM users WHERE id = '01HN3VQX...'",<not logged>
```

**Log Forwarding:**

PostgreSQL audit logs → Fluentd → S3 (30-day retention)

**Threat Detection Query:**

```sql
-- Detect unusual mass deletions
SELECT
    usename AS db_user,
    COUNT(*) AS deletion_count,
    MIN(timestamp) AS first_deletion,
    MAX(timestamp) AS last_deletion
FROM pg_audit_logs
WHERE
    command = 'DELETE'
    AND table_name = 'users'
    AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY usename
HAVING COUNT(*) > 10;
```

---

### 9.7 Compliance & Legal Considerations

**Audit Log Access Control:**

| Role | Access Level | Use Case |
|------|--------------|----------|
| Security Team | Full read access to all logs | Incident investigation |
| Support Team | Read access to own actions + user-requested logs | GDPR data export support |
| Developers | No production log access | Use staging environment |
| External Auditors | Read-only access (time-limited) | SOC 2 audit |

**GDPR Considerations:**

- Audit logs containing user actions are **personal data** (Article 4(1))
- Users have **right of access** to their own audit logs (Article 15)
- Logs must be **deleted** when user deletes account (with 90-day retention exception for legal defense - Article 17(3)(e))

**Implementation:**

```python
@app.get('/api/account/audit-logs')
def get_user_audit_logs(user: User, start_date: date, end_date: date):
    """GDPR Article 15: User's right to access their audit logs"""

    # Validate date range (max 90 days)
    if (end_date - start_date).days > 90:
        raise ValidationError("Date range cannot exceed 90 days")

    logs = db.query(AuditLog).filter(
        AuditLog.user_id == user.id,
        AuditLog.timestamp >= start_date,
        AuditLog.timestamp <= end_date
    ).order_by(AuditLog.timestamp.desc()).all()

    return {
        'audit_logs': [log.to_dict() for log in logs],
        'total_count': len(logs),
        'date_range': {
            'start': start_date.isoformat(),
            'end': end_date.isoformat()
        }
    }
```

---

## 10. Webhook & Third-Party Integration Security

### 10.1 Stripe Webhook Security

VSG receives payment events from Stripe via webhooks. **Webhooks are unauthenticated POST requests** and must be validated to prevent spoofing.

**Threat Scenario:**

An attacker could send fake webhook events to:
- Grant premium features without payment
- Trigger refunds for legitimate payments
- Cause data inconsistencies

**Mitigation: HMAC Signature Verification**

Stripe signs all webhook events with HMAC-SHA256 using a webhook secret. VSG **MUST** verify signatures before processing.

**Implementation (Python - Flask):**

```python
import hmac
import hashlib
from flask import request, abort

STRIPE_WEBHOOK_SECRET = os.environ['STRIPE_WEBHOOK_SECRET']  # whsec_...

@app.post('/api/webhooks/stripe')
def handle_stripe_webhook():
    """
    Stripe webhook handler with signature verification

    See: https://stripe.com/docs/webhooks/signatures
    """

    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    if not sig_header:
        logger.warning("Stripe webhook missing signature header")
        abort(400, "Missing Stripe-Signature header")

    # 1. Extract timestamp and signature from header
    # Format: t=1234567890,v1=abcdef...,v0=legacy...
    timestamp = None
    signature = None

    for part in sig_header.split(','):
        if part.startswith('t='):
            timestamp = part[2:]
        elif part.startswith('v1='):
            signature = part[3:]

    if not timestamp or not signature:
        logger.warning("Malformed Stripe-Signature header")
        abort(400, "Malformed Stripe-Signature header")

    # 2. Verify timestamp (reject events >5 minutes old - replay protection)
    current_time = int(time.time())
    if abs(current_time - int(timestamp)) > 300:
        logger.warning(f"Stripe webhook timestamp too old: {timestamp}")
        abort(400, "Webhook timestamp too old")

    # 3. Compute expected signature
    signed_payload = f"{timestamp}.{payload.decode('utf-8')}"
    expected_signature = hmac.new(
        STRIPE_WEBHOOK_SECRET.encode('utf-8'),
        signed_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # 4. Compare signatures (constant-time to prevent timing attacks)
    if not hmac.compare_digest(signature, expected_signature):
        logger.error("Stripe webhook signature verification failed")
        abort(403, "Invalid signature")

    # 5. Parse event (signature verified)
    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        abort(400, "Invalid JSON")

    # 6. Process event
    event_type = event['type']

    if event_type == 'checkout.session.completed':
        handle_checkout_completed(event['data']['object'])
    elif event_type == 'customer.subscription.updated':
        handle_subscription_updated(event['data']['object'])
    elif event_type == 'customer.subscription.deleted':
        handle_subscription_deleted(event['data']['object'])
    elif event_type == 'invoice.payment_failed':
        handle_payment_failed(event['data']['object'])
    else:
        logger.info(f"Unhandled Stripe event type: {event_type}")

    return {'status': 'success'}, 200


def handle_checkout_completed(session):
    """Process successful checkout"""

    user_id = session['client_reference_id']  # Set during checkout
    subscription_id = session['subscription']

    # Update user to Pro tier
    user = db.query(User).filter_by(id=user_id).first()
    if user:
        user.subscription_tier = 'pro'
        user.stripe_subscription_id = subscription_id
        db.commit()

        logger.info(f"User {user_id} upgraded to Pro tier")
    else:
        logger.error(f"User {user_id} not found for checkout {session['id']}")
```

**Idempotency Handling:**

Stripe may send duplicate webhook events. VSG uses **idempotency keys** to prevent duplicate processing.

```python
@app.post('/api/webhooks/stripe')
def handle_stripe_webhook():
    # ... signature verification ...

    event = json.loads(payload)
    event_id = event['id']  # e.g., evt_1A2B3C4D5E6F

    # Check if already processed
    existing = db.query(ProcessedWebhookEvent).filter_by(event_id=event_id).first()
    if existing:
        logger.info(f"Stripe event {event_id} already processed, skipping")
        return {'status': 'duplicate'}, 200

    # Process event
    process_stripe_event(event)

    # Record as processed
    db.add(ProcessedWebhookEvent(
        event_id=event_id,
        event_type=event['type'],
        processed_at=datetime.utcnow()
    ))
    db.commit()

    return {'status': 'success'}, 200
```

**Database Schema:**

```sql
CREATE TABLE processed_webhook_events (
    event_id VARCHAR(100) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    source VARCHAR(20) NOT NULL,  -- 'stripe', 'google', etc.
    processed_at TIMESTAMPTZ NOT NULL,

    -- Auto-delete after 30 days (prevent unbounded growth)
    CONSTRAINT check_recent CHECK (processed_at > NOW() - INTERVAL '30 days')
);

CREATE INDEX idx_webhook_processed_at ON processed_webhook_events(processed_at DESC);
```

---

### 10.2 Third-Party API Security

**API Key Storage:**

VSG integrates with:
- Stripe (payment processing)
- Google OAuth (authentication)
- Sentry (error monitoring)
- Cloudflare (CDN, WAF)

**Secret Management (Environment Variables):**

```bash
# .env (NEVER commit to git)
STRIPE_SECRET_KEY=sk_live_abc123...
STRIPE_WEBHOOK_SECRET=whsec_def456...
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xyz789...
SENTRY_DSN=https://abc@o123.ingest.sentry.io/456
CLOUDFLARE_API_TOKEN=v1.0-abcdef...

# Database encryption key (KMS-managed)
DATABASE_ENCRYPTION_KEY_ID=arn:aws:kms:us-east-1:123456:key/abc-def
```

**CI/CD Pipeline (GitHub Actions):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Secrets stored in GitHub Secrets (encrypted at rest)
      - name: Deploy to AWS
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          aws lambda update-function-configuration \
            --function-name vsg-api \
            --environment "Variables={STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY}"
```

**Secret Rotation Schedule:**

| Secret | Rotation Frequency | Automated | Owner |
|--------|-------------------|-----------|-------|
| Stripe API keys | Annually (or on breach) | No | CTO |
| Database passwords | Quarterly | Yes (AWS Secrets Manager) | DevOps |
| JWT signing secret | Annually | No | CTO |
| Webhook secrets | Annually | No | CTO |
| Service account keys | Quarterly | Yes | DevOps |

---

### 10.3 OAuth Security (Google Sign-In)

**Configuration:**

```python
GOOGLE_OAUTH_CLIENT_ID = os.environ['GOOGLE_OAUTH_CLIENT_ID']
GOOGLE_OAUTH_CLIENT_SECRET = os.environ['GOOGLE_OAUTH_CLIENT_SECRET']
GOOGLE_OAUTH_REDIRECT_URI = 'https://visualsocialgraph.com/api/auth/google/callback'

# Scopes (minimal necessary)
GOOGLE_OAUTH_SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]
```

**Authorization Flow (with CSRF Protection):**

> **NOTE:** The code below shows a **server-side initiation pattern** (optional). The recommended approach is **client-side direct redirect** as shown in Section 3.1.2. This endpoint (`/api/auth/google`) is NOT required and may be omitted in favor of frontend-only OAuth initiation.

```python
@app.get('/api/auth/google')  # OPTIONAL - client-side redirect preferred
def google_oauth_initiate():
    """[OPTIONAL] Server-side OAuth initiation - redirect user to Google consent screen"""

    # Generate CSRF state token (128-bit random)
    state = secrets.token_urlsafe(16)

    # Store state in session (server-side)
    session['oauth_state'] = state
    session['oauth_state_expires'] = datetime.utcnow() + timedelta(minutes=10)

    # Build authorization URL
    params = {
        'client_id': GOOGLE_OAUTH_CLIENT_ID,
        'redirect_uri': GOOGLE_OAUTH_REDIRECT_URI,
        'response_type': 'code',
        'scope': ' '.join(GOOGLE_OAUTH_SCOPES),
        'state': state,
        'access_type': 'offline',  # Get refresh token
        'prompt': 'consent'
    }

    auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlencode(params)
    return redirect(auth_url)


@app.get('/api/auth/google/callback')
def google_oauth_callback(code: str, state: str):
    """Handle OAuth callback from Google"""

    # 1. Verify CSRF state token
    expected_state = session.get('oauth_state')
    state_expires = session.get('oauth_state_expires')

    if not expected_state or not state_expires:
        abort(400, "Missing OAuth state")

    if datetime.utcnow() > state_expires:
        abort(400, "OAuth state expired")

    if not hmac.compare_digest(state, expected_state):
        abort(403, "Invalid OAuth state (CSRF)")

    # Clear state (single-use)
    del session['oauth_state']
    del session['oauth_state_expires']

    # 2. Exchange authorization code for access token
    token_response = requests.post('https://oauth2.googleapis.com/token', data={
        'code': code,
        'client_id': GOOGLE_OAUTH_CLIENT_ID,
        'client_secret': GOOGLE_OAUTH_CLIENT_SECRET,
        'redirect_uri': GOOGLE_OAUTH_REDIRECT_URI,
        'grant_type': 'authorization_code'
    })

    if token_response.status_code != 200:
        abort(500, "OAuth token exchange failed")

    tokens = token_response.json()
    access_token = tokens['access_token']
    id_token = tokens['id_token']

    # 3. Verify ID token (JWT signature)
    try:
        user_info = jwt.decode(
            id_token,
            options={'verify_signature': False}  # Google's JWKs verified separately
        )

        # Verify issuer and audience
        if user_info['iss'] not in ['https://accounts.google.com', 'accounts.google.com']:
            abort(403, "Invalid ID token issuer")

        if user_info['aud'] != GOOGLE_OAUTH_CLIENT_ID:
            abort(403, "Invalid ID token audience")

    except jwt.InvalidTokenError:
        abort(403, "Invalid ID token")

    # 4. Create or update user
    email = user_info['email']
    google_id = user_info['sub']

    user = db.query(User).filter_by(email=email).first()
    if not user:
        user = User(
            id=generate_ulid(),
            email=email,
            google_id=google_id,
            subscription_tier='free'
        )
        db.add(user)
    else:
        user.google_id = google_id

    db.commit()

    # 5. Create session
    create_session(user)

    return redirect('/dashboard')
```

**Security Checklist:**

- ✅ CSRF state token (random, single-use, expires in 10 minutes)
- ✅ Minimal scopes (only email and profile, no social media access)
- ✅ ID token verification (issuer, audience, signature)
- ✅ HTTPS-only redirect URIs
- ✅ No Google API credentials stored (Constitutional Constraint C1)

---

### 10.4 Rate Limiting for Third-Party APIs

**Problem:**

Third-party APIs have rate limits. Exceeding them causes:
- Service degradation (429 errors)
- Increased costs (Stripe charges for API calls)
- Account suspension (repeated violations)

**Solution: Client-Side Rate Limiting**

```python
import redis
from datetime import datetime, timedelta

class StripeRateLimiter:
    """
    Stripe rate limits:
    - 100 read requests/second
    - 100 write requests/second

    VSG implements client-side rate limiting to stay under 50% capacity
    """

    def __init__(self, redis_client):
        self.redis = redis_client
        self.read_limit = 50  # 50% of Stripe's limit
        self.write_limit = 50

    def check_limit(self, operation_type: str) -> bool:
        """Check if operation is allowed"""

        key = f"stripe_ratelimit:{operation_type}:{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        limit = self.read_limit if operation_type == 'read' else self.write_limit

        current = self.redis.incr(key)
        self.redis.expire(key, 1)  # 1-second window

        return current <= limit

    def wait_if_needed(self, operation_type: str):
        """Block until rate limit allows operation"""

        while not self.check_limit(operation_type):
            time.sleep(0.1)  # Wait 100ms


# Usage
limiter = StripeRateLimiter(redis_client)

def create_stripe_customer(email: str):
    limiter.wait_if_needed('write')
    return stripe.Customer.create(email=email)
```

**Exponential Backoff (Retry Logic):**

```python
def call_stripe_api_with_retry(func, *args, **kwargs):
    """Retry Stripe API calls with exponential backoff"""

    max_retries = 3
    base_delay = 1  # seconds

    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except stripe.error.RateLimitError:
            if attempt == max_retries - 1:
                raise

            delay = base_delay * (2 ** attempt)  # 1s, 2s, 4s
            logger.warning(f"Stripe rate limit hit, retrying in {delay}s")
            time.sleep(delay)
        except stripe.error.APIConnectionError:
            if attempt == max_retries - 1:
                raise

            delay = base_delay * (2 ** attempt)
            logger.warning(f"Stripe connection error, retrying in {delay}s")
            time.sleep(delay)
```

---

### 10.5 Third-Party Service Risk Assessment

| Service | Data Shared | Purpose | Risk Level | Mitigation |
|---------|-------------|---------|------------|------------|
| Stripe | Email, payment method, billing address | Payment processing | Medium | PCI DSS compliant, no card data stored by VSG |
| Google OAuth | Email, name, profile picture | Authentication | Low | Minimal scopes, no API access stored |
| Sentry | Error messages (PII-scrubbed), stack traces | Error monitoring | Low | PII scrubbing (Section 9.5), 10% sampling |
| Cloudflare | HTTP request metadata, IP addresses (first 3 octets) | CDN, WAF, DDoS protection | Low | No sensitive data in requests |
| AWS (RDS, S3, KMS) | All application data | Infrastructure | High | Encryption at rest, VPC isolation, IAM least privilege |

**Vendor Security Reviews:**

- Annual review of third-party SOC 2 reports
- Quarterly review of data processing agreements (DPAs)
- Immediate review on security incident disclosure

---

## 11. Client-Side Security

### 11.1 Content Security Policy (CSP)

**What is CSP:**

Content Security Policy (CSP) is an HTTP header that instructs browsers to only load resources (scripts, styles, images) from trusted sources. This **prevents XSS attacks** even if an attacker injects malicious code into the page.

**VSG CSP Policy:**

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}' https://cdn.jsdelivr.net;
  style-src 'self' 'nonce-{RANDOM}' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.visualsocialgraph.com https://o123456.ingest.sentry.io;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

**Directive Explanations:**

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src 'self'` | Same origin only | Fallback for all resource types |
| `script-src` | Self + nonce + CDN | Only load scripts from VSG origin, with valid nonce, or from jsDelivr CDN |
| `style-src` | Self + nonce + Google Fonts | Allow styles from VSG, inline styles with nonce, and Google Fonts |
| `img-src` | Self + data: + HTTPS | Allow images from VSG, data URIs (for icons), and any HTTPS origin |
| `font-src` | Self + Google Fonts | Load fonts from VSG or Google Fonts CDN |
| `connect-src` | Self + API + Sentry | Allow AJAX/fetch requests to VSG API and Sentry error reporting |
| `frame-ancestors 'none'` | Block all framing | Prevent clickjacking (same as `X-Frame-Options: DENY`) |
| `base-uri 'self'` | Same origin only | Prevent base tag injection |
| `form-action 'self'` | Same origin only | Forms can only submit to VSG origin |
| `upgrade-insecure-requests` | N/A | Automatically upgrade HTTP to HTTPS |

**Nonce-Based Script Loading:**

CSP blocks inline `<script>` tags by default. VSG uses **nonces** (random values) to allow specific inline scripts.

**Server-Side (Python - Flask):**

```python
import secrets
from flask import make_response, render_template

@app.route('/dashboard')
def dashboard():
    # Generate random nonce for this request (128-bit)
    nonce = secrets.token_urlsafe(16)

    # Render template with nonce
    html = render_template('dashboard.html', csp_nonce=nonce)

    # Set CSP header with nonce
    response = make_response(html)
    response.headers['Content-Security-Policy'] = (
        f"default-src 'self'; "
        f"script-src 'self' 'nonce-{nonce}' https://cdn.jsdelivr.net; "
        f"style-src 'self' 'nonce-{nonce}' https://fonts.googleapis.com; "
        f"img-src 'self' data: https:; "
        f"font-src 'self' https://fonts.gstatic.com; "
        f"connect-src 'self' https://api.visualsocialgraph.com https://o123456.ingest.sentry.io; "
        f"frame-ancestors 'none'; "
        f"base-uri 'self'; "
        f"form-action 'self'; "
        f"upgrade-insecure-requests"
    )

    return response
```

**Client-Side (React/Next.js):**

```tsx
// pages/_document.tsx (Next.js custom document)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document({ cspNonce }: { cspNonce: string }) {
  return (
    <Html>
      <Head nonce={cspNonce}>
        {/* Inline script with nonce */}
        <script nonce={cspNonce} dangerouslySetInnerHTML={{
          __html: `
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript nonce={cspNonce} />
      </body>
    </Html>
  );
}
```

**CSP Reporting (Violations):**

```http
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  report-uri https://api.visualsocialgraph.com/api/csp-report;
  report-to csp-endpoint
```

**CSP Violation Handler:**

```python
@app.post('/api/csp-report')
def handle_csp_violation():
    """Log CSP violations for monitoring"""

    report = request.json

    logger.warning("CSP violation", extra={
        'document_uri': report.get('csp-report', {}).get('document-uri'),
        'violated_directive': report.get('csp-report', {}).get('violated-directive'),
        'blocked_uri': report.get('csp-report', {}).get('blocked-uri'),
        'source_file': report.get('csp-report', {}).get('source-file'),
        'line_number': report.get('csp-report', {}).get('line-number')
    })

    return {'status': 'reported'}, 204
```

**Rollout Strategy:**

1. **Phase 1 (Week 1-2): Report-Only Mode**
   - Deploy `Content-Security-Policy-Report-Only` header
   - Monitor violation reports
   - Fix any legitimate violations (e.g., missing nonces)

2. **Phase 2 (Week 3-4): Enforce Mode (Staging)**
   - Deploy enforcing CSP to staging environment
   - Test all user flows
   - Verify no breakage

3. **Phase 3 (Week 5+): Production Enforcement**
   - Deploy enforcing CSP to production
   - Monitor error rates
   - Keep report-only header for new directives

---

### 11.2 Subresource Integrity (SRI)

**What is SRI:**

SRI ensures that resources loaded from CDNs (e.g., React, charting libraries) have not been tampered with.

**Implementation:**

```html
<!-- React from CDN with SRI -->
<script
  src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
  integrity="sha384-8QSLc3sYOEH3BfMANa9U/0eQ7s0F5i5MAdUbI7lZQJPZJXxJQ+DkjZmPqfJfPxL6"
  crossorigin="anonymous"
  nonce="{CSP_NONCE}"
></script>

<!-- Chart.js from CDN with SRI -->
<script
  src="https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js"
  integrity="sha384-gdQD/4Y0T1Rb7s6aE3DGaB3YmG0Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y"
  crossorigin="anonymous"
  nonce="{CSP_NONCE}"
></script>
```

**Generating SRI Hashes:**

```bash
# Generate SHA-384 hash for a file
curl https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A
```

**Automated SRI in Build Pipeline:**

```javascript
// webpack.config.js
const SriPlugin = require('webpack-subresource-integrity');

module.exports = {
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha384'],
      enabled: process.env.NODE_ENV === 'production'
    })
  ],
  output: {
    crossOriginLoading: 'anonymous'
  }
};
```

---

### 11.3 Service Worker Security

**Service Worker Threat Scenarios:**

1. **Cache Poisoning:** Attacker tricks Service Worker into caching malicious content
2. **Persistent XSS:** Service Worker serves cached XSS payload even after server fix
3. **Data Exfiltration:** Compromised Service Worker intercepts API responses

**Mitigation Strategies:**

**1. Origin Validation Before Caching:**

```typescript
// service-worker.ts
const ALLOWED_ORIGINS = [
  'https://visualsocialgraph.com',
  'https://api.visualsocialgraph.com',
  'https://cdn.jsdelivr.net'
];

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // Only cache resources from trusted origins
  if (!ALLOWED_ORIGINS.includes(url.origin)) {
    // Pass through to network, don't cache
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy for trusted origins
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(response => {
        // Validate response before caching
        if (response.ok && response.status < 400) {
          const cache = caches.open('vsg-v1.2.3');
          cache.then(c => c.put(event.request, response.clone()));
        }
        return response;
      });
    })
  );
});
```

**2. Cache Versioning & Purge Strategy:**

```typescript
const CACHE_VERSION = 'vsg-v1.2.3';  // Update on each deployment
const CACHE_WHITELIST = [CACHE_VERSION];

self.addEventListener('activate', (event: ExtendableEvent) => {
  // Delete old caches on activation
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!CACHE_WHITELIST.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**3. Selective Caching (Never Cache Sensitive Data):**

```typescript
const CACHE_STRATEGIES = {
  // Cache static assets aggressively
  '/static/': 'cache-first',
  '/assets/': 'cache-first',

  // Never cache API responses (sensitive data)
  '/api/': 'network-only',

  // Cache HTML pages with network fallback
  '/': 'network-first'
};

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // Determine strategy based on path
  const strategy = Object.keys(CACHE_STRATEGIES).find(pattern =>
    url.pathname.startsWith(pattern)
  );

  if (CACHE_STRATEGIES[strategy] === 'network-only') {
    // Never cache API responses
    event.respondWith(fetch(event.request));
  } else if (CACHE_STRATEGIES[strategy] === 'cache-first') {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});
```

**4. Service-Worker-Allowed Header:**

Restrict Service Worker scope to prevent it from intercepting requests outside its intended directory.

```http
# Nginx configuration
location /sw.js {
  add_header Service-Worker-Allowed "/";
  add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

**5. Service Worker Integrity Check:**

```typescript
// Register Service Worker with integrity check
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none'  // Always fetch fresh Service Worker
  }).then(registration => {
    console.log('Service Worker registered:', registration.scope);

    // Force update check on page load
    registration.update();
  }).catch(error => {
    console.error('Service Worker registration failed:', error);
  });
}
```

**6. Cache-Control Headers (Prevent Stale Caches):**

```http
# API responses (never cache)
Cache-Control: no-store, no-cache, must-revalidate, private

# Static assets (cache with versioning)
Cache-Control: public, max-age=31536000, immutable

# HTML pages (cache but revalidate)
Cache-Control: public, max-age=0, must-revalidate
```

---

### 11.4 Cross-Origin Resource Sharing (CORS)

**VSG API CORS Policy:**

```python
# Flask-CORS configuration
from flask_cors import CORS

app = Flask(__name__)

# Only allow requests from VSG frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://visualsocialgraph.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-CSRF-Token"],
        "expose_headers": ["X-RateLimit-Limit", "X-RateLimit-Remaining"],
        "supports_credentials": True,  # Allow cookies
        "max_age": 3600  # Preflight cache duration
    }
})
```

**CORS Preflight Response:**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://visualsocialgraph.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

**Why Credentials Mode:**

VSG uses cookie-based authentication. CORS requests **MUST** set `credentials: 'include'` to send cookies.

```typescript
// Frontend API client
async function fetchGraphData(graphId: string) {
  const response = await fetch(`https://api.visualsocialgraph.com/api/graphs/${graphId}`, {
    method: 'GET',
    credentials: 'include',  // Send cookies (JWT session)
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken()  // CSRF protection
    }
  });

  return response.json();
}
```

---

### 11.5 Client-Side Data Storage Security

**What NOT to Store in localStorage/sessionStorage:**

- ❌ JWT tokens (vulnerable to XSS)
- ❌ CSRF tokens (vulnerable to XSS)
- ❌ API keys
- ❌ User passwords or password hashes
- ❌ Pseudonymization keys
- ❌ Unencrypted sensitive user data

**What is Safe to Store:**

- ✅ UI preferences (theme, language)
- ✅ Non-sensitive cache data
- ✅ Anonymous analytics IDs
- ✅ Feature flags (non-sensitive)

**VSG Storage Policy:**

| Data Type | Storage Location | Rationale |
|-----------|------------------|-----------|
| JWT Session Token | HttpOnly cookie | Immune to XSS |
| CSRF Token | Cookie (NOT HttpOnly) | Must be readable by JS for double-submit pattern |
| User ID | localStorage | Non-sensitive, needed for client-side logic |
| UI Theme Preference | localStorage | Non-sensitive |
| Graph Draft (Unsaved) | sessionStorage | Temporary, cleared on tab close |
| Pseudonymization Key | NEVER stored client-side | Server-only (Constitutional Constraint C3) |

**localStorage Access Control:**

```typescript
// Wrapper to prevent accidental sensitive data storage
const SafeStorage = {
  // Whitelist of allowed keys
  ALLOWED_KEYS: ['theme', 'language', 'user_id', 'feature_flags'],

  setItem(key: string, value: string) {
    if (!this.ALLOWED_KEYS.includes(key)) {
      console.error(`Attempted to store disallowed key: ${key}`);
      throw new Error('Storage key not whitelisted');
    }
    localStorage.setItem(key, value);
  },

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
};

// Usage
SafeStorage.setItem('theme', 'dark');  // ✅ Allowed
SafeStorage.setItem('jwt_token', 'abc');  // ❌ Throws error
```

---

### 11.6 Clickjacking Protection

**X-Frame-Options Header:**

```http
X-Frame-Options: DENY
```

**CSP frame-ancestors (Modern Replacement):**

```http
Content-Security-Policy: frame-ancestors 'none';
```

**Implementation (Nginx):**

```nginx
# Apply to all responses
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "frame-ancestors 'none'" always;
```

**Why Both Headers:**

- `X-Frame-Options` for legacy browser support (IE11)
- CSP `frame-ancestors` is the modern standard

---

### 11.7 Client-Side Input Validation

**Defense in Depth:**

Even though the server validates all input, client-side validation provides:
- Better UX (instant feedback)
- Reduced server load (reject malformed requests before sending)
- **NOT** a security boundary (attackers can bypass)

**Example: Email Validation:**

```typescript
function validateEmail(email: string): { valid: boolean; error?: string } {
  // Basic format check (client-side convenience)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > 320) {
    return { valid: false, error: 'Email must be less than 320 characters' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

// IMPORTANT: Server MUST also validate (never trust client)
```

**Validation Rules (Must Match Server):**

```typescript
const VALIDATION_RULES = {
  email: { maxLength: 320, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  graphName: { minLength: 1, maxLength: 200 },
  nodeLabel: { minLength: 1, maxLength: 100 },
  insightQuery: { minLength: 10, maxLength: 500 }
};
```

---

### 11.8 Security Headers Completeness

**Overview:**

Visual Social Graph implements comprehensive HTTP security headers to protect against common web vulnerabilities. All security headers are set server-side and validated in CI/CD pipelines.

#### 11.8.1 Required Security Headers

**Complete Header Configuration:**

```http
# Content Security Policy (see Section 11.1)
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{RANDOM}' https://cdn.jsdelivr.net; style-src 'self' 'nonce-{RANDOM}' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.visualsocialgraph.com https://o123456.ingest.sentry.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# XSS Protection (legacy browsers)
X-XSS-Protection: 1; mode=block

# Clickjacking protection (see Section 11.6)
X-Frame-Options: DENY

# Referrer policy (minimize information leakage)
Referrer-Policy: strict-origin-when-cross-origin

# Permissions Policy (restrict browser features)
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()

# Strict Transport Security (HSTS)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Cache control for sensitive pages
Cache-Control: no-store, no-cache, must-revalidate, private
Pragma: no-cache
Expires: 0
```

#### 11.8.2 Header Explanations

**X-Content-Type-Options: nosniff**

**Purpose:** Prevents browsers from MIME-sniffing responses and executing malicious content disguised as harmless files.

**Attack Scenario:**
- Attacker uploads malicious JavaScript disguised as an image (`malicious.jpg`)
- Without `nosniff`, browser might execute it as JavaScript
- With `nosniff`, browser strictly enforces declared `Content-Type: image/jpeg`

**Implementation:**
```python
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response
```

---

**X-XSS-Protection: 1; mode=block**

**Purpose:** Enables browser's built-in XSS filter (legacy browsers). Modern browsers rely on CSP instead.

**Note:** This header is deprecated in favor of CSP but included for legacy browser support (IE11, old Safari versions).

---

**Referrer-Policy: strict-origin-when-cross-origin**

**Purpose:** Controls how much referrer information is sent with requests.

**Policy Breakdown:**

| Scenario | Referrer Sent |
|----------|---------------|
| Same-origin request | Full URL (`https://visualsocialgraph.com/dashboard` → `https://visualsocialgraph.com/api/graphs`) |
| Cross-origin HTTPS → HTTPS | Origin only (`https://visualsocialgraph.com` → `https://api.stripe.com`) |
| HTTPS → HTTP | No referrer (prevents leaking HTTPS URLs to HTTP sites) |

**Privacy Benefit:** Prevents leaking user's current page URL to third-party sites (e.g., external links, CDNs).

**Example:**
```
User visits: https://visualsocialgraph.com/graphs/graph_01JBQR7X9K2P3M4N5Q6R7S8T9V
User clicks external link to: http://example.com

Without Referrer-Policy: example.com receives full URL (graph ID leaked)
With strict-origin-when-cross-origin: example.com receives NO referrer (HTTPS → HTTP downgrade)
```

---

**Permissions-Policy**

**Purpose:** Restricts browser features to prevent unauthorized access to device APIs.

**Disabled Features:**

| Feature | Why Disabled |
|---------|--------------|
| `geolocation=()` | VSG doesn't need user location |
| `microphone=()` | No audio recording features |
| `camera=()` | No video/photo features |
| `payment=()` | Payment handled by Stripe (no Payment Request API) |
| `usb=()` | No USB device access needed |
| `magnetometer=()` | No sensor data needed |
| `gyroscope=()` | No motion tracking needed |
| `speaker=()` | No audio playback control needed |

**Attack Prevention:**
- Prevents malicious scripts from accessing camera/microphone
- Prevents third-party iframes from requesting permissions
- Reduces attack surface for permission-gated APIs

**Example Attack (Prevented):**
```javascript
// Malicious XSS payload attempts to access camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // Exfiltrate video stream to attacker's server
  });

// Blocked by Permissions-Policy: camera=()
// Error: "NotAllowedError: The request is not allowed by Permissions Policy"
```

---

**Strict-Transport-Security (HSTS)**

**Purpose:** Forces browsers to ONLY communicate with VSG over HTTPS, preventing downgrade attacks.

**Parameters:**

| Parameter | Value | Explanation |
|-----------|-------|-------------|
| `max-age` | `31536000` | 1 year (in seconds) - browser remembers HSTS policy for 1 year |
| `includeSubDomains` | - | HSTS applies to all subdomains (e.g., `api.visualsocialgraph.com`) |
| `preload` | - | VSG is eligible for HSTS preload list (browsers ship with VSG hardcoded as HTTPS-only) |

**Attack Prevention: SSL Stripping**

**Scenario:**
1. User types `visualsocialgraph.com` (no protocol) in browser
2. Without HSTS: Browser attempts HTTP first → attacker intercepts → downgrades to HTTP
3. With HSTS: Browser forces HTTPS immediately → attacker cannot intercept

**HSTS Preload:**

VSG should submit to [hstspreload.org](https://hstspreload.org/) to be included in browsers' hardcoded HSTS list.

**Submission Checklist:**
- [ ] HSTS header deployed with `max-age=31536000`, `includeSubDomains`, `preload`
- [ ] All subdomains serve valid HTTPS certificates
- [ ] HTTP redirects to HTTPS (301 permanent redirect)
- [ ] Submit domain to hstspreload.org

---

**Cache-Control Headers (Sensitive Pages)**

**Purpose:** Prevent sensitive data from being cached by browsers or proxies.

**Pages Requiring No-Cache:**

| Page Type | Cache-Control | Reason |
|-----------|---------------|--------|
| Dashboard, Graphs | `no-store, no-cache, must-revalidate, private` | Contains user-specific data (graphs, insights) |
| API Responses | `no-store, no-cache, must-revalidate, private` | Sensitive data (user IDs, pseudonymization keys) |
| Magic Link Verification | `no-store, no-cache, must-revalidate, private` | One-time tokens must not be cached |

**Pages Allowing Caching:**

| Page Type | Cache-Control | Reason |
|-----------|---------------|--------|
| Static Assets (CSS, JS, images) | `public, max-age=31536000, immutable` | Fingerprinted URLs (e.g., `app.abc123.js`), safe to cache |
| Landing Page | `public, max-age=3600` | Public marketing page, cache for 1 hour |

**Implementation:**

```python
@app.route('/dashboard')
def dashboard():
    response = make_response(render_template('dashboard.html'))

    # Sensitive page - no caching
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

@app.route('/static/<path:filename>')
def static_files(filename):
    response = send_from_directory('static', filename)

    # Static assets - aggressive caching
    response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'

    return response
```

**Attack Prevention: Cached Sensitive Data**

**Scenario:**
- User logs into VSG on public computer
- User views dashboard (graphs, insights)
- User logs out but forgets to clear browser cache
- Next user on same computer navigates browser back button
- Without no-cache: Browser serves cached dashboard from disk
- With no-cache: Browser requests fresh page, gets redirected to login

---

#### 11.8.3 Server Implementation (Python/Flask)

**Middleware for Global Headers:**

```python
from flask import Flask, make_response
import secrets

app = Flask(__name__)

@app.after_request
def set_security_headers(response):
    """Apply security headers to all responses"""

    # Always set these headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = (
        'geolocation=(), microphone=(), camera=(), payment=(), '
        'usb=(), magnetometer=(), gyroscope=(), speaker=()'
    )

    # HSTS (only in production, not localhost)
    if not app.debug:
        response.headers['Strict-Transport-Security'] = (
            'max-age=31536000; includeSubDomains; preload'
        )

    # CSP (if not already set by route)
    if 'Content-Security-Policy' not in response.headers:
        nonce = secrets.token_urlsafe(16)
        response.headers['Content-Security-Policy'] = (
            f"default-src 'self'; "
            f"script-src 'self' 'nonce-{nonce}' https://cdn.jsdelivr.net; "
            f"style-src 'self' 'nonce-{nonce}' https://fonts.googleapis.com; "
            f"img-src 'self' data: https:; "
            f"font-src 'self' https://fonts.gstatic.com; "
            f"connect-src 'self' https://api.visualsocialgraph.com https://o123456.ingest.sentry.io; "
            f"frame-ancestors 'none'; "
            f"base-uri 'self'; "
            f"form-action 'self'; "
            f"upgrade-insecure-requests"
        )

    return response
```

---

#### 11.8.4 Validation & Testing

**Automated Header Testing (CI/CD):**

```python
import requests

def test_security_headers():
    """Verify all security headers are present"""

    response = requests.get('https://visualsocialgraph.com/dashboard')

    # Required headers
    assert response.headers.get('X-Content-Type-Options') == 'nosniff'
    assert response.headers.get('X-Frame-Options') == 'DENY'
    assert response.headers.get('X-XSS-Protection') == '1; mode=block'
    assert response.headers.get('Referrer-Policy') == 'strict-origin-when-cross-origin'
    assert 'Permissions-Policy' in response.headers
    assert 'Strict-Transport-Security' in response.headers
    assert 'Content-Security-Policy' in response.headers

    # HSTS requirements
    hsts = response.headers.get('Strict-Transport-Security')
    assert 'max-age=31536000' in hsts
    assert 'includeSubDomains' in hsts
    assert 'preload' in hsts

    print("✅ All security headers present and correct")

test_security_headers()
```

**Online Security Header Scanners:**

- [securityheaders.com](https://securityheaders.com) - Grade: A+ target
- [observatory.mozilla.org](https://observatory.mozilla.org) - Score: 100+ target
- [hstspreload.org](https://hstspreload.org) - HSTS preload eligibility check

**Expected Scan Results:**

| Scanner | Target Grade | Required Headers |
|---------|--------------|------------------|
| SecurityHeaders.com | A+ | All 7 headers present (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection) |
| Mozilla Observatory | 100+ | No high/medium risk issues |
| HSTS Preload | Eligible | HSTS with max-age ≥ 31536000, includeSubDomains, preload |

---

#### 11.8.5 Header Exceptions

**API Endpoints (JSON Responses):**

Some headers are not applicable to API responses:

```python
@app.route('/api/graphs')
def api_graphs():
    response = jsonify({'graphs': [...]})

    # API responses don't need CSP (no HTML rendering)
    # But still set other headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Cache-Control'] = 'no-store'

    return response
```

**Third-Party Integrations (CORS):**

When allowing CORS for specific origins, some headers must be relaxed:

```python
@app.route('/api/public/graph-embed')
def graph_embed():
    response = make_response(render_template('embed.html'))

    # Allow embedding in trusted partner sites
    response.headers['X-Frame-Options'] = 'ALLOW-FROM https://partner.com'
    # OR use CSP frame-ancestors
    response.headers['Content-Security-Policy'] = "frame-ancestors https://partner.com"

    return response
```

> **NOTE:** `X-Frame-Options: ALLOW-FROM` is deprecated. Use CSP `frame-ancestors` instead.

---

#### 11.8.6 Implementation Checklist

**Backend:**
- [ ] Security headers middleware applied to all responses
- [ ] CSP nonce generated per-request (not reused)
- [ ] HSTS enabled in production (not localhost/staging)
- [ ] Cache-Control set correctly (no-cache for sensitive pages, aggressive caching for static assets)
- [ ] Permissions-Policy restricts all unused browser features

**Testing:**
- [ ] Automated header tests in CI/CD pipeline
- [ ] Manual scan with securityheaders.com (A+ grade)
- [ ] Manual scan with Mozilla Observatory (100+ score)
- [ ] HSTS preload submission completed

**Monitoring:**
- [ ] CSP violation reports monitored (see Section 11.1)
- [ ] Alert on missing security headers (Sentry/Datadog)

---

## 12. Incident Response & Security Operations

### 12.1 Incident Response Plan

**Incident Classification:**

| Severity | Definition | Example | Response Time | Notification Required |
|----------|------------|---------|---------------|----------------------|
| **P0 - Critical** | Data breach, complete service outage, active exploit | Production database compromised, user credentials leaked | Immediate (< 15 min) | CTO, CEO, Legal, DPO |
| **P1 - High** | Partial data exposure, authentication bypass, DoS attack | Magic link token prediction vulnerability discovered | 30 minutes | CTO, Security Team |
| **P2 - Medium** | Security misconfiguration, failed security control | CSP violation storm, rate limiting not working | 4 hours | Security Team |
| **P3 - Low** | Potential vulnerability, security hygiene issue | Outdated dependency with no known exploit | Next business day | Security Team |

---

### 12.2 Incident Response Procedures

**P0/P1 Incident Workflow:**

**Phase 1: Detection & Triage (0-15 minutes)**

1. **Incident Detected** (automated alert, bug bounty report, customer report)
2. **Incident Commander Assigned** (on-call engineer via PagerDuty)
3. **Initial Assessment:**
   - What is the security impact? (confidentiality, integrity, availability)
   - What data is affected? (user emails, pseudonymization keys, payment data)
   - Is the attacker still active? (ongoing vs historical)
4. **Declare Severity** (P0, P1, P2, P3)
5. **Assemble Response Team:**
   - P0: CTO, Lead Engineer, DevOps, Legal, Communications
   - P1: CTO, Lead Engineer, DevOps

**Phase 2: Containment (15-60 minutes)**

1. **Isolate Affected Systems:**
   - Revoke compromised API keys
   - Block malicious IP addresses (Cloudflare WAF)
   - Disable compromised user accounts
   - Take affected services offline if necessary

2. **Preserve Evidence:**
   - Snapshot database before remediation
   - Export audit logs for forensics
   - Capture network traffic (tcpdump)
   - Screenshot attacker activity

3. **Stop the Bleeding:**
   - Patch exploited vulnerability (emergency deploy)
   - Rotate compromised secrets (JWT signing key, database password, API keys)
   - Force logout all sessions if authentication compromised

**Phase 3: Investigation (1-24 hours)**

1. **Root Cause Analysis:**
   - Review audit logs for attacker activity
   - Identify entry point (SQL injection, CSRF bypass, leaked credentials)
   - Determine scope of compromise (which users affected, what data accessed)

2. **Data Breach Assessment (GDPR Compliance):**
   - **What personal data was accessed?** (emails, pseudonymized graph data, payment info)
   - **How many users affected?** (1 user, 100 users, all users)
   - **What is the risk to users?** (low: no sensitive data, high: passwords leaked)

3. **Legal & Compliance Review:**
   - Is GDPR breach notification required? (72-hour deadline from **awareness**, not incident start)
   - Is customer notification required? (yes, if high risk to user rights and freedoms)
   - Contact DPO (Data Protection Officer)

**Phase 4: Remediation (1-7 days)**

1. **Fix Root Cause:**
   - Deploy patch to production
   - Update security controls (add CSP, enable MFA, tighten permissions)
   - Validate fix with penetration testing

2. **Notify Affected Parties:**
   - **Supervisory Authority (DPA):** Within 72 hours (GDPR Article 33)
   - **Affected Users:** Without undue delay (GDPR Article 34)
   - **Template:** See Section 12.3 below

3. **Monitor for Recurrence:**
   - Add alerting for similar attack patterns
   - Review audit logs for 7 days post-incident

**Phase 5: Post-Mortem (7-14 days after resolution)**

1. **Blameless Post-Mortem Document:**
   - Timeline of events
   - Root cause (technical and organizational)
   - What went well (detection, containment)
   - What went poorly (delayed response, missing logs)
   - Action items (preventive measures, documentation updates)

2. **Security Improvements:**
   - Update threat model
   - Add automated tests to prevent regression
   - Update incident response playbook
   - Conduct security training for team

---

### 12.3 GDPR Breach Notification Templates

**Template 1: Notification to Supervisory Authority (DPA)**

**Subject:** Personal Data Breach Notification - Visual Social Graph

**To:** [Your Supervisory Authority - e.g., ICO (UK), CNIL (France)]

**From:** Data Protection Officer, Visual Social Graph

**Date:** [Sent within 72 hours of breach awareness]

---

**1. Nature of the Personal Data Breach**

On [DATE] at [TIME UTC], Visual Social Graph became aware of a personal data breach affecting [NUMBER] users.

**Breach Type:** [Confidentiality breach / Integrity breach / Availability breach]

**Attack Vector:** [SQL injection / Authentication bypass / Stolen credentials / Misconfiguration]

**Data Categories Affected:**
- User email addresses ([NUMBER] affected)
- Pseudonymized social graph data ([NUMBER] graphs)
- [Other categories if applicable]

**Special Categories (Article 9):** None [or specify if health data, political opinions, etc.]

---

**2. Contact Details**

**Data Protection Officer:**
- Name: [DPO Name]
- Email: dpo@visualsocialgraph.com
- Phone: [Phone number]

---

**3. Likely Consequences**

**Risk Assessment:**
- **Low Risk:** Email addresses exposed but no passwords or payment data compromised. Users may receive spam.
- **Medium Risk:** [Describe]
- **High Risk:** [Describe]

**Affected Individuals:** [NUMBER] users notified via email on [DATE].

---

**4. Measures Taken or Proposed**

**Immediate Containment (within 1 hour):**
- Patched vulnerability at [TIME UTC]
- Revoked compromised API keys
- Forced logout of all user sessions

**Remediation (within 7 days):**
- Implemented [specific security control - e.g., CSP, MFA, input validation]
- Engaged third-party forensics firm [if applicable]
- Conducting full security audit

**User Notification:**
- All affected users notified on [DATE]
- Users advised to [specific action - e.g., change passwords, review account activity]

---

**5. Cross-Border Considerations**

[If applicable] This breach affects users in [COUNTRIES]. We are cooperating with [OTHER DPAs].

---

**Visual Social Graph Ltd**
[Company Registration Number]
[Address]

---

**Template 2: Notification to Affected Users**

**Subject:** Important Security Notice - Visual Social Graph

**Dear [User Name],**

We are writing to inform you of a security incident that may have affected your Visual Social Graph account.

**What Happened:**

On [DATE], we discovered that [BRIEF DESCRIPTION - e.g., "an unauthorized party accessed our database due to a software vulnerability"]. We immediately took steps to secure our systems and investigate the incident.

**What Information Was Involved:**

Based on our investigation, the following information may have been accessed:
- Your email address: [USER EMAIL]
- Your pseudonymized social graph data (connections between anonymized individuals)

**What Was NOT Affected:**
- Your password (we do not store passwords, only secure password hashes)
- Your payment information (stored securely by Stripe, not on our servers)
- The real names or identities in your social graphs (all data was pseudonymized)

**What We Are Doing:**

- We have patched the vulnerability and enhanced our security controls
- We are conducting a full security audit with an independent third party
- We have notified the relevant data protection authorities

**What You Should Do:**

- **Reset your password** as a precaution: [LINK]
- **Review your account activity** for any suspicious changes: [LINK]
- Be cautious of phishing emails (we will never ask for your password via email)

**Questions?**

If you have any questions or concerns, please contact our support team at security@visualsocialgraph.com or visit [HELP CENTER LINK].

We sincerely apologize for this incident and are committed to protecting your data.

**Visual Social Graph Security Team**

---

### 12.4 Penetration Testing Schedule

**Annual Third-Party Penetration Testing:**

| Test Type | Frequency | Scope | Vendor Criteria | Remediation SLA |
|-----------|-----------|-------|-----------------|-----------------|
| **External Pentest** | Annually (Q1) | Web application, API endpoints, authentication flows | CREST certified, 5+ years experience, fintech clients | Critical: 7 days, High: 30 days, Medium: 90 days |
| **Internal Pentest** | Annually (Q3) | Database access, internal APIs, AWS infrastructure | Same vendor as external | Critical: 7 days, High: 30 days |
| **Social Engineering Test** | Annually (Q2) | Phishing simulation, support team verification | CREST certified | Training for failed staff within 14 days |

**Quarterly Internal Security Reviews:**

| Review Type | Frequency | Owner | Output |
|-------------|-----------|-------|--------|
| **Dependency Audit** | Quarterly | DevOps | Update all dependencies with known CVEs (Snyk, Dependabot) |
| **Access Review** | Quarterly | CTO | Revoke unnecessary production access, validate least privilege |
| **Secret Rotation** | Quarterly | DevOps | Rotate database passwords, service account keys |
| **Security Metrics Review** | Quarterly | Security Team | Review authentication failure rates, rate limit violations, CSP violations |

**Penetration Testing Rules of Engagement:**

```markdown
# Visual Social Graph - Penetration Test SOW

## Scope

**In-Scope Systems:**
- Production web application: https://visualsocialgraph.com
- Production API: https://api.visualsocialgraph.com
- Authentication flows (Magic Link, Google OAuth)
- Payment integration (Stripe webhooks)

**Out-of-Scope Systems:**
- Staging environment (duplicate of production, testing allowed here first)
- Third-party services (Stripe, Google, Cloudflare - do not test)
- Customer data (no attempt to access real user data)

**Test Methods Allowed:**
- ✅ Automated vulnerability scanning (OWASP ZAP, Burp Suite)
- ✅ Manual penetration testing (SQL injection, XSS, CSRF, authentication bypass)
- ✅ API fuzzing
- ✅ Social engineering (with prior approval per scenario)

**Test Methods Prohibited:**
- ❌ Denial of Service (DoS) attacks
- ❌ Physical security testing (office break-ins)
- ❌ Attacks on third-party services
- ❌ Destructive testing (data deletion, database drops)

## Test Accounts

VSG will provide:
- 3 test accounts (Free, Pro, Creator tiers)
- Test API keys
- Test payment methods (Stripe test mode)

**DO NOT** use real user accounts or create accounts with real email addresses.

## Reporting

**Timeline:**
- Testing: 2 weeks
- Draft report: 1 week after testing ends
- Final report: 2 weeks after testing ends

**Report Format:**
- Executive summary (business risk)
- Technical findings (CVSS scores, proof-of-concept exploits)
- Remediation recommendations (prioritized by severity)

**Severity Classification:**
- **Critical (CVSS 9.0-10.0):** Immediate risk of data breach, 7-day remediation SLA
- **High (CVSS 7.0-8.9):** Significant risk, 30-day remediation SLA
- **Medium (CVSS 4.0-6.9):** Moderate risk, 90-day remediation SLA
- **Low (CVSS 0.1-3.9):** Security hygiene, best-effort remediation

## Contact

**Primary Contact:** CTO - cto@visualsocialgraph.com
**Security Team:** security@visualsocialgraph.com
**Emergency (P0 finding):** [Phone number]
```

**Vendor Selection Criteria:**

1. **Certifications:** CREST, OSCP, CEH, or equivalent
2. **Experience:** 5+ years penetration testing, SaaS/fintech clients preferred
3. **References:** Minimum 3 references from similar companies
4. **Insurance:** Professional indemnity insurance (minimum $2M)
5. **Deliverables:** Detailed report with remediation guidance, re-test after fixes

**Budget:** $15,000-$25,000 per annual external pentest

---

### 12.5 Vulnerability Management

**Vulnerability Disclosure Policy (Bug Bounty):**

VSG operates a private bug bounty program via [HackerOne / Bugcrowd].

**Scope:**
- Web application and API
- Authentication mechanisms
- Payment processing integration

**Out of Scope:**
- Social engineering
- DoS attacks
- Third-party vulnerabilities (report to vendor directly)

**Rewards:**

| Severity | Reward | Example |
|----------|--------|---------|
| Critical | $500-$2,000 | Authentication bypass, SQL injection with data access |
| High | $200-$500 | XSS with account takeover, IDOR exposing user data |
| Medium | $50-$200 | CSRF on sensitive action, information disclosure |
| Low | $0-$50 | Security misconfiguration, missing security headers |

**Response SLA:**
- **Acknowledgment:** Within 2 business days
- **Triage:** Within 5 business days
- **Fix:** Critical (7 days), High (30 days), Medium (90 days)

---

### 12.6 Security Metrics & KPIs

**Monthly Security Dashboard:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Authentication failure rate | < 5% | > 10% (potential credential stuffing) |
| Rate limit violations | < 100/day | > 500/day (abuse or misconfiguration) |
| CSP violations | < 10/day | > 50/day (XSS attempts or misconfigured CSP) |
| Failed CSRF validations | < 5/day | > 20/day (CSRF attack or browser issue) |
| Dependency CVEs | 0 Critical, < 5 High | Any Critical CVE |
| Sentry error rate | < 1% of requests | > 5% (systemic issue) |

**Quarterly Security Review:**

- **Access Audit:** Review all production access, revoke unnecessary permissions
- **Secret Rotation:** Rotate database passwords, API keys (quarterly schedule)
- **Penetration Test Findings:** Track remediation status, close all High/Critical by next quarter
- **Incident Post-Mortems:** Review all P0/P1 incidents, validate preventive measures implemented

---

## 13. Deployment & Infrastructure Security

### 13.1 CI/CD Pipeline Security

**GitHub Actions Workflow (Production Deployment):**

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # 1. Dependency vulnerability scan
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      # 2. Static code analysis (SAST)
      - name: Run Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

      # 3. Secret scanning
      - name: Run TruffleHog secret scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main

  test:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run unit tests
        run: npm test
      - name: Run integration tests
        run: npm run test:integration

  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3

      # Deploy to AWS Lambda / ECS / EC2
      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          ./scripts/deploy.sh production

      # 4. Post-deployment verification
      - name: Health check
        run: |
          curl --fail https://api.visualsocialgraph.com/health || exit 1

      # 5. Notify team
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Production deployment successful: ${{ github.sha }}"
            }
```

**Pipeline Security Controls:**

| Control | Implementation | Rationale |
|---------|----------------|-----------|
| **Least Privilege** | GitHub Actions use OIDC tokens, not long-lived credentials | Prevents credential theft |
| **Secret Scanning** | TruffleHog scans commits for API keys, passwords | Prevents accidental secret commits |
| **Dependency Scanning** | Snyk fails build on High/Critical CVEs | Prevents vulnerable dependencies in production |
| **SAST (Static Analysis)** | Semgrep checks for SQL injection, XSS, hardcoded secrets | Early vulnerability detection |
| **Environment Protection** | Production requires manual approval for deploys | Prevents accidental deployments |
| **Immutable Artifacts** | Docker images tagged with git SHA | Reproducible builds, audit trail |

---

### 13.2 Database Security

**PostgreSQL Security Configuration:**

```sql
-- 1. Enable SSL/TLS (required for all connections)
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/etc/ssl/certs/server.crt';
ALTER SYSTEM SET ssl_key_file = '/etc/ssl/private/server.key';

-- 2. Enforce strong password policy
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- 3. Connection limits
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET superuser_reserved_connections = 3;

-- 4. Audit logging (via pgAudit)
CREATE EXTENSION pgaudit;
ALTER SYSTEM SET pgaudit.log = 'ddl, write';
ALTER SYSTEM SET pgaudit.log_relation = on;

-- 5. Row-level security (RLS) for multi-tenancy
ALTER TABLE graphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_graphs_policy ON graphs
  FOR ALL
  TO app_user
  USING (user_id = current_setting('app.current_user_id')::VARCHAR);

-- Application sets user context before queries
SET app.current_user_id = '01HN3VQX...';
SELECT * FROM graphs;  -- Only returns graphs for this user
```

**Database User Permissions (Least Privilege):**

```sql
-- Application user (read/write)
CREATE USER vsg_app WITH PASSWORD 'strong-password-here';
GRANT CONNECT ON DATABASE vsg_production TO vsg_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO vsg_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO vsg_app;

-- Read-only user (analytics, backups)
CREATE USER vsg_readonly WITH PASSWORD 'different-strong-password';
GRANT CONNECT ON DATABASE vsg_production TO vsg_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO vsg_readonly;

-- Revoke public access
REVOKE ALL ON DATABASE vsg_production FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

**Backup & Disaster Recovery:**

| Backup Type | Frequency | Retention | Location | Encryption |
|-------------|-----------|-----------|----------|------------|
| **Automated Snapshots** | Every 6 hours | 7 days | AWS RDS automated backups | AES-256 (AWS managed) |
| **Manual Backups** | Weekly (Sunday 2 AM UTC) | 90 days | S3 Glacier | AES-256-GCM (KMS) |
| **Transaction Logs** | Continuous (WAL) | 7 days | S3 Standard | AES-256 (AWS managed) |

**Backup Restoration Test:**

- **Frequency:** Quarterly
- **Procedure:** Restore latest backup to staging environment, verify data integrity
- **Success Criteria:** All tables present, row counts match, application functional

---

### 13.3 Infrastructure as Code (IaC) Security

**Terraform Configuration (AWS Infrastructure):**

```hcl
# terraform/production/rds.tf

resource "aws_db_instance" "vsg_production" {
  identifier = "vsg-production"
  engine     = "postgres"
  engine_version = "15.4"

  # Security
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds_encryption.arn

  # Network isolation
  db_subnet_group_name = aws_db_subnet_group.private.name
  publicly_accessible  = false
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Backup
  backup_retention_period = 7
  backup_window           = "02:00-03:00"
  maintenance_window      = "sun:03:00-sun:04:00"

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # Deletion protection
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "vsg-production-final-snapshot"

  tags = {
    Environment = "production"
    Compliance  = "GDPR"
  }
}

# Security group (firewall rules)
resource "aws_security_group" "rds" {
  name        = "vsg-rds-production"
  description = "Allow PostgreSQL from application servers only"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.app_servers.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**IaC Security Checklist:**

- ✅ Encryption at rest enabled (KMS)
- ✅ Database in private subnet (not publicly accessible)
- ✅ Security groups restrict access to application servers only
- ✅ Automated backups enabled (7-day retention)
- ✅ Deletion protection enabled
- ✅ CloudWatch logging enabled
- ✅ Terraform state stored in S3 with encryption and versioning

---

### 13.4 Network Security

**VPC Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS VPC (10.0.0.0/16)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Public Subnet (10.0.1.0/24)                        │   │
│  │  - NAT Gateway                                      │   │
│  │  - Load Balancer (ALB)                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Private Subnet (10.0.2.0/24)                       │   │
│  │  - Application Servers (ECS/Lambda)                 │   │
│  │  - No direct internet access                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database Subnet (10.0.3.0/24)                      │   │
│  │  - PostgreSQL RDS                                   │   │
│  │  - Isolated from internet                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Firewall Rules (Security Groups):**

| Service | Source | Port | Protocol | Purpose |
|---------|--------|------|----------|---------|
| ALB | 0.0.0.0/0 | 443 | HTTPS | Public web traffic |
| App Servers | ALB SG | 8080 | HTTP | Internal app traffic |
| PostgreSQL | App Servers SG | 5432 | PostgreSQL | Database access |
| Redis | App Servers SG | 6379 | Redis | Cache access |

---

## 14. Compliance & Certifications

### 14.1 GDPR Compliance Status

**Compliance Checklist:**

| Requirement | Status | Evidence | Section Reference |
|-------------|--------|----------|-------------------|
| **Lawful Basis for Processing** | ✅ Compliant | Consent (user signup), Contract (service delivery), Legitimate Interests (fraud prevention) | Section 6.1 |
| **Data Minimization** | ✅ Compliant | Constitutional Constraint C2, 80% client-side processing | Section 2.3, 4.1 |
| **Encryption in Transit** | ✅ Compliant | TLS 1.3 enforced | Section 5.1 |
| **Encryption at Rest** | ✅ Compliant | AES-256-GCM (database, S3) | Section 5.2 |
| **Right of Access (Article 15)** | ✅ Compliant | `/api/account/data-export` endpoint | Section 6.2.1 |
| **Right to Erasure (Article 17)** | ✅ Compliant | Dual deletion modes (soft/hard) | Section 6.2.3 |
| **Data Portability (Article 20)** | ✅ Compliant | JSON export via data-export endpoint | Section 6.2.4 |
| **Breach Notification (Article 33)** | ✅ Compliant | 72-hour DPA notification procedure | Section 12.3 |
| **Data Processing Record (Article 30)** | ✅ Compliant | Documented in Section 6.1 | Section 6.1 |
| **Privacy by Design (Article 25)** | ✅ Compliant | Pseudonymization, client-side processing, no social media account access | Section 2.3, 4.1 |
| **DPO Appointed** | ✅ Compliant | DPO appointed: dpo@visualsocialgraph.com | Contact: dpo@visualsocialgraph.com |

**GDPR Compliance Score:** 11/11 (100%)

---

### 14.2 SOC 2 Roadmap

**SOC 2 Type II Preparation:**

VSG is preparing for SOC 2 Type II audit (anticipated Q4 2026). Current status:

| Trust Service Criteria | Readiness | Gaps | Target Completion |
|------------------------|-----------|------|-------------------|
| **Security** | 95% | Penetration testing execution (scheduled) | Q2 2026 |
| **Availability** | 90% | Disaster recovery testing, SLA formalization | Q1 2026 |
| **Processing Integrity** | 90% | Input validation testing, output verification | Q2 2026 |
| **Confidentiality** | 100% | ✅ All controls implemented (CSP, Service Worker security) | ✅ Complete |
| **Privacy** | 100% | ✅ All controls implemented (Sentry PII scrubbing) | ✅ Complete |

**SOC 2 Preparation Tasks:**

1. **Formalize ISMS (Information Security Management System):**
   - ✅ Document security policies (this document completed)
   - ✅ Establish security committee
   - ✅ Quarterly policy reviews scheduled

2. **Implement Missing Controls:**
   - ✅ Deploy CSP to production (Section 11.1) - **COMPLETED**
   - ✅ Configure Sentry PII scrubbing (Section 9.5) - **COMPLETED**
   - 🔄 Annual penetration testing (Section 12.4) - **SCHEDULED Q2 2026**

3. **Evidence Collection (6-month observation period):**
   - Access review logs (quarterly)
   - Security training completion records
   - Incident response drill documentation
   - Penetration test reports

4. **Engage SOC 2 Auditor:**
   - RFP to AICPA-certified auditors
   - Budget: $25,000-$40,000 for Type II audit

---

### 14.3 PCI DSS Compliance

**Status:** Not Applicable (VSG uses Stripe for payment processing)

**Justification:**

VSG **never** stores, processes, or transmits cardholder data (credit card numbers, CVV). All payment processing is handled by Stripe (PCI DSS Level 1 certified).

**VSG's PCI Compliance Scope:**

- ✅ HTTPS-only checkout page (TLS 1.3)
- ✅ No card data in logs or databases
- ✅ Stripe.js tokenizes card data before leaving browser
- ✅ Webhook signature verification (HMAC-SHA256)

**Reference:** PCI DSS SAQ A (Merchant using third-party payment processor, no cardholder data storage)

---

## 15. Security Training & Awareness

### 15.1 Developer Security Training

**Onboarding Security Training (All Engineers):**

| Topic | Duration | Format | Frequency |
|-------|----------|--------|-----------|
| **Secure Coding Practices** | 2 hours | Video + Quiz | Once (onboarding) |
| **OWASP Top 10** | 1 hour | Interactive lab | Once (onboarding) |
| **VSG Security Architecture** | 1 hour | This document + Q&A | Once (onboarding) |
| **GDPR & Privacy Fundamentals** | 1 hour | Video + Quiz | Annually |

**Ongoing Security Training:**

- **Monthly Security Newsletter:** Highlight recent vulnerabilities, security incidents in industry, new threats
- **Quarterly Security Office Hours:** CTO hosts Q&A on security topics
- **Annual Security Training Refresh:** OWASP Top 10 updates, new attack techniques

---

### 15.2 Security Champions Program

**Goal:** Embed security expertise in each team.

**Structure:**

- **1 Security Champion per team** (Frontend, Backend, DevOps, Product)
- **Responsibilities:**
  - Review code for security issues
  - Advocate for security in design discussions
  - Attend monthly Security Champions meeting
  - Triage security vulnerabilities

**Benefits:**

- Faster security issue resolution (no bottleneck on security team)
- Security considerations in early design phase
- Security knowledge distributed across company

---

### 15.3 Phishing Awareness Training

**Phishing Simulations:**

- **Frequency:** Quarterly
- **Platform:** KnowBe4 or similar
- **Scenarios:**
  - Fake password reset emails
  - Fake Stripe payment failure notifications
  - Fake GitHub security alerts

**Metrics:**

| Metric | Target | Action if Missed |
|--------|--------|------------------|
| Phishing click rate | < 10% | Mandatory remedial training for clickers |
| Reporting rate | > 50% | Improve reporting workflow |

**Phishing Reporting Workflow:**

1. Employee receives suspicious email
2. Forward to `security@visualsocialgraph.com`
3. Security team triages within 1 hour
4. If real phishing, broadcast warning to all employees

---

### 15.4 Incident Response Drills

**Tabletop Exercises:**

- **Frequency:** Annually
- **Scenario:** Simulated data breach (e.g., "Production database credentials leaked on GitHub")
- **Participants:** CTO, Lead Engineer, DevOps, Legal, Communications
- **Duration:** 2 hours
- **Outcome:** Validate incident response plan, identify gaps, update playbook

**Example Drill Scenario:**

> **Scenario:** A security researcher reports that a VSG engineer's GitHub account was compromised, and the attacker pushed a commit containing production database credentials to a public repository. The credentials were exposed for 3 hours before being detected.
>
> **Your Task:** Execute the incident response plan (Section 12.2). Time starts now.

**Post-Drill Actions:**

- Document timeline of response
- Identify bottlenecks (e.g., "DPO contact information was outdated")
- Update incident response plan
- Schedule remedial training if gaps found

---

## Appendices

### [Appendix A: Security Error Codes](#appendix-a-security-error-codes)

---

## Appendix A: Security Error Codes

This appendix catalogs all security-related error codes used across the Visual Social Graph platform, organized by severity level. These error codes align with the error taxonomy defined in [VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md) Appendix A and support security monitoring, incident response, and user troubleshooting.

### A.1 Error Severity Levels

Error codes are classified into five severity levels based on impact and remediation approach:

| Severity | Definition | Monitoring | Example |
|----------|------------|------------|---------|
| **TRANSIENT** | Temporary failures, retry expected to succeed | Log at INFO level, alert if sustained (>5 min) | `RATE_LIMITED`, `NETWORK_TIMEOUT` |
| **RECOVERABLE** | User can fix with corrected input | Log at WARN level, track by endpoint | `INVALID_SCHEMA`, `MISSING_REQUIRED_FIELD` |
| **PARTIAL** | Operation partially succeeded with warnings | Log at INFO level, include warning details | `PARTIAL_IMPORT_SOME_RECORDS_SKIPPED` |
| **CRITICAL** | Severe errors requiring investigation | Log at ERROR level, alert immediately | `AUTHENTICATION_FAILED`, `PERMISSION_DENIED` |
| **INTEGRITY** | Data consistency or security violations | Log at CRITICAL level, alert immediately, trigger incident response | `WEBHOOK_SIGNATURE_INVALID`, `DATA_CORRUPTION` |

### A.2 TRANSIENT Errors

**Definition:** Temporary failures expected to succeed on retry without user intervention.

| Code | HTTP Status | Description | Security Implication | User Action |
|------|-------------|-------------|---------------------|-------------|
| `NETWORK_TIMEOUT` | 504 | Request to external service (Stripe, S3) timed out | May indicate DoS attack on external dependencies | Retry after a few seconds |
| `RATE_LIMITED` | 429 | Too many requests from this user/IP in short time window | Rate limit abuse detection triggered | Wait for rate limit window to reset (see `X-RateLimit-Reset` header) |
| `QUOTA_EXCEEDED` | 429 | Daily/monthly quota exceeded for subscription tier | Quota exhaustion attack detection | Wait for quota reset (midnight/month-end) or upgrade tier |
| `SERVICE_UNAVAILABLE` | 503 | Backend service temporarily unavailable (maintenance, overload) | May indicate system-wide outage or attack | Retry after delay indicated in `Retry-After` header |
| `DATABASE_TIMEOUT` | 504 | Database query exceeded timeout threshold | Possible slow query attack or resource exhaustion | Retry request |

**Security Monitoring:**
- Alert if `RATE_LIMITED` sustained for >5 users/IPs simultaneously (possible DDoS)
- Alert if `QUOTA_EXCEEDED` rate increases >50% (possible quota exhaustion attack)
- Track `DATABASE_TIMEOUT` by query pattern (detect slow query attacks)

### A.3 RECOVERABLE Errors

**Definition:** User can fix by correcting request input or parameters.

| Code | HTTP Status | Description | Security Implication | User Action |
|------|-------------|-------------|---------------------|-------------|
| `INVALID_SCHEMA` | 400 | Request body does not match required schema | Possible injection attempt via malformed payload | Review API documentation and correct request format |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing from request | API misuse or automated attack | Add missing field (e.g., `platform`, `graphId`) |
| `INVALID_ENUM_VALUE` | 400 | Field contains invalid enum value | Possible parameter tampering | Use allowed value (e.g., `platform` must be `twitter`, `instagram`, etc.) |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds size limit | Possible resource exhaustion attack | Reduce file size or contact support for limit increase |
| `GRAPH_TOO_LARGE` | 413 | Graph JSON payload exceeds 10 MB limit | Possible memory exhaustion attack | Simplify graph or use server-side fallback mode |
| `INVALID_DATE_FORMAT` | 400 | Date string not in ISO 8601 format | Possible injection via date parsing | Use format `YYYY-MM-DD` (day-level granularity) |
| `TIER_FEATURE_RESTRICTED` | 403 | Feature not available in current subscription tier | Privilege escalation attempt detection | Upgrade to Pro or Creator tier to access this feature |
| `UNSUPPORTED_PLATFORM` | 400 | Platform not supported in this API version | API fuzzing detection | Check supported platforms in documentation |

**Security Monitoring:**
- Alert if `FILE_TOO_LARGE` or `GRAPH_TOO_LARGE` from single user >10/hour (resource exhaustion attack)
- Track `TIER_FEATURE_RESTRICTED` by endpoint to detect privilege escalation patterns
- Log `INVALID_SCHEMA` with payload hash to detect injection campaigns

### A.4 PARTIAL Errors

**Definition:** Operation partially succeeded with warnings; some data may be incomplete.

| Code | HTTP Status | Description | Security Implication | User Action |
|------|-------------|-------------|---------------------|-------------|
| `PARTIAL_IMPORT_SOME_RECORDS_SKIPPED` | 200 | Graph created but some nodes/edges skipped due to validation errors | Possible data injection attempt in graph payload | Review `warnings` array in response; skipped records listed in details |
| `PARTIAL_INSIGHT_GENERATION_TIMEOUT` | 200 | Some insight types completed, others timed out | Algorithmic complexity attack (graph designed to cause timeout) | Accept partial results or retry specific insight types |
| `PARTIAL_EXPORT_MISSING_DATA` | 200 | Export generated but some data unavailable (e.g., graph deleted during export) | Race condition or TOCTOU vulnerability | Review warnings; re-upload missing data if needed |

**Security Monitoring:**
- Alert if `PARTIAL_IMPORT_SOME_RECORDS_SKIPPED` skip rate >30% (possible data poisoning)
- Track `PARTIAL_INSIGHT_GENERATION_TIMEOUT` by graph structure (detect algorithmic DoS)

### A.5 CRITICAL Errors

**Definition:** Severe errors requiring immediate investigation; may indicate security breach.

| Code | HTTP Status | Description | Security Implication | User Action |
|------|-------------|-------------|---------------------|-------------|
| `INTERNAL_ERROR` | 500 | Unexpected server error (unhandled exception) | Possible exploitation of unknown vulnerability | Contact support with `error.id` from response |
| `AUTHENTICATION_FAILED` | 401 | Invalid or expired session token (JWT) | Session hijacking attempt or credential stuffing | Re-authenticate via magic link or Google OAuth |
| `PERMISSION_DENIED` | 403 | User lacks permission to access resource (IDOR prevention) | Possible IDOR attack or privilege escalation | Ensure you own the resource or have required subscription tier |
| `RESOURCE_NOT_FOUND` | 404 | Requested graph, upload, or export does not exist | Possible resource enumeration attack | Verify resource ID is correct (use ULID, not sequential IDs) |
| `RESOURCE_DELETED` | 410 | Resource was permanently deleted (GDPR hard delete or 30-day soft delete) | N/A (expected behavior) | Cannot recover; create new resource |
| `PROCESSING_FAILED` | 500 | Server-side graph processing encountered fatal error | Possible malicious graph payload designed to crash processor | Check upload file integrity; retry upload |

**Security Monitoring:**
- **Alert immediately** if `AUTHENTICATION_FAILED` from same IP >5/min (credential stuffing attack)
- **Alert immediately** if `PERMISSION_DENIED` for same resource from different users >3/hour (IDOR enumeration)
- Track `RESOURCE_NOT_FOUND` patterns by user to detect resource ID guessing attacks
- Log `INTERNAL_ERROR` with full stack trace to Sentry (with PII scrubbing per Section 9.5)

### A.6 INTEGRITY Errors

**Definition:** Data consistency or security violations; may indicate active attack or data corruption.

| Code | HTTP Status | Description | Security Implication | User Action |
|------|-------------|-------------|---------------------|-------------|
| `INVALID_TOKEN` | 401 | Magic link token invalid, expired, or already used | Token theft or replay attack | Request new magic link |
| `WEBHOOK_SIGNATURE_INVALID` | 401 | Stripe webhook signature verification failed (HMAC mismatch) | **CRITICAL:** Webhook spoofing attack detected | Internal error; contact support if recurring |
| `DATA_CORRUPTION` | 500 | Stored data failed integrity check (checksum mismatch, encryption failure) | **CRITICAL:** Database compromise or storage layer attack | Contact support immediately with `error.id` |
| `DUPLICATE_IDEMPOTENCY_KEY` | 409 | Idempotency key already used for different request | Idempotency key collision (intentional or accidental) | Use unique `Idempotency-Key` for each distinct request |
| `CONFLICT` | 409 | Resource state conflict (e.g., deleting already-deleted graph) | Race condition or TOCTOU attack | Refresh resource state and retry |

**Security Monitoring:**
- **Alert immediately + trigger incident response** if `WEBHOOK_SIGNATURE_INVALID` (see Section 12.1)
- **Alert immediately + trigger incident response** if `DATA_CORRUPTION` (potential database breach)
- **Alert immediately** if `INVALID_TOKEN` from same user >10/hour (token theft + brute force)
- Log `DUPLICATE_IDEMPOTENCY_KEY` with request hash to detect replay attacks

### A.7 Error Response Schema

All API errors follow this standardized JSON schema (per Section 3.1 of [VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md)):

```json
{
  "error": {
    "id": "err_01JBCD...",              // Unique ULID for error tracking (logged to Sentry)
    "level": "CRITICAL",                // Severity: TRANSIENT, RECOVERABLE, PARTIAL, CRITICAL, INTEGRITY
    "code": "AUTHENTICATION_FAILED",    // Machine-readable error code
    "message": "Invalid session token. Please re-authenticate.",  // Human-readable message
    "details": {                        // Additional context (optional)
      "reason": "JWT signature verification failed",
      "expiredAt": "2025-12-27T14:00:00Z"
    },
    "retryable": false,                 // Whether client should retry
    "suggestedAction": "Re-authenticate via magic link or Google OAuth."
  }
}
```

**Security Headers in Error Responses:**
- `X-Request-Id`: Correlates request to audit logs
- `X-RateLimit-*`: Rate limit status (for 429 responses)
- `Retry-After`: Seconds until retry allowed (for 429, 503 responses)

### A.8 Error Code Usage Examples

**Example 1: TRANSIENT Error (Rate Limited)**

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735094400
Retry-After: 43200
```

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

**Example 2: CRITICAL Error (Authentication Failed)**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
WWW-Authenticate: Bearer error="invalid_token"
X-Request-Id: req_01JBCE...
```

```json
{
  "error": {
    "id": "err_01JBCE...",
    "level": "CRITICAL",
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid or expired session token.",
    "details": {
      "reason": "JWT signature verification failed",
      "expiredAt": "2025-12-27T14:00:00Z"
    },
    "retryable": false,
    "suggestedAction": "Re-authenticate via magic link or Google OAuth."
  }
}
```

**Example 3: INTEGRITY Error (Webhook Signature Invalid)**

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-Request-Id: req_01JBCF...
```

```json
{
  "error": {
    "id": "err_01JBCF...",
    "level": "INTEGRITY",
    "code": "WEBHOOK_SIGNATURE_INVALID",
    "message": "Stripe webhook signature verification failed.",
    "details": {
      "reason": "HMAC-SHA256 signature mismatch",
      "timestamp": "2025-12-27T14:23:45Z",
      "timestampAge": 12  // seconds
    },
    "retryable": false,
    "suggestedAction": "Internal error; contact support if recurring."
  }
}
```

**Security Action:** This error triggers automatic incident response (Section 12.1) with P1 severity classification.

### A.9 Error Code Security Metrics

**Monitoring Dashboard KPIs:**

| Metric | Threshold | Alert Condition | Response |
|--------|-----------|----------------|----------|
| `AUTHENTICATION_FAILED` rate | Baseline: <0.5% of auth requests | >2% sustained for >5 min | Investigate credential stuffing attack |
| `PERMISSION_DENIED` rate | Baseline: <0.1% of API requests | >0.5% sustained for >5 min | Investigate IDOR enumeration attack |
| `WEBHOOK_SIGNATURE_INVALID` | Baseline: 0 | Any occurrence | **Trigger incident response immediately** |
| `RATE_LIMITED` unique users | Baseline: <10 users/hour | >50 users/hour | Investigate DDoS attack |
| `DATA_CORRUPTION` | Baseline: 0 | Any occurrence | **Trigger incident response immediately** |

**Audit Logging:** All CRITICAL and INTEGRITY errors logged to `security_audit_log` table with 90-day retention (Section 9.3).

### A.10 Error Code Cross-References

- **Section 3.1:** API error response format specification
- **Section 7.1:** Input validation error codes (`INVALID_SCHEMA`, `MISSING_REQUIRED_FIELD`)
- **Section 8.2:** Rate limiting error codes (`RATE_LIMITED`, `QUOTA_EXCEEDED`)
- **Section 9.4:** Security monitoring for CRITICAL and INTEGRITY errors
- **Section 10.1:** Webhook security error codes (`WEBHOOK_SIGNATURE_INVALID`)
- **Section 12.1:** Incident response triggers (INTEGRITY errors)

---

### [Appendix B: Threat Model](#appendix-b-threat-model)
- B.1 [Asset Inventory](#b1-asset-inventory)
- B.2 [Threat Actors](#b2-threat-actors)
- B.3 [Attack Vectors](#b3-attack-vectors)
- B.4 [Risk Matrix](#b4-risk-matrix)

---

## Appendix B: Threat Model

This appendix provides a comprehensive threat model for the Visual Social Graph platform, identifying critical assets, potential threat actors, attack vectors, and risk assessments. This model informs security control prioritization, incident response procedures, and penetration testing scope.

### B.1 Asset Inventory

Visual Social Graph assets are classified by confidentiality, integrity, and availability requirements. **Crown jewels** (highest value) are protected with multiple defense layers.

#### B.1.1 Crown Jewel Assets (Critical - Highest Protection)

| Asset | Location | Protection Mechanisms | Compromise Impact | Recovery Time |
|-------|----------|----------------------|-------------------|---------------|
| **Pseudonymization Keys** | PostgreSQL `user_pseudonymization_keys` table (encrypted at rest with AES-256-GCM) | • Database encryption at rest (KMS)<br>• Row-level security (RLS)<br>• Access restricted to pseudonymization service only<br>• Keys deleted on account deletion | **CRITICAL:** Privacy breach - all historical pseudonymized data can be de-anonymized. GDPR violation. | Impossible (keys not recoverable after deletion) |
| **JWT Signing Secret** | Environment variable `JWT_SECRET` (256-bit) | • Stored in AWS Secrets Manager / GCP Secret Manager<br>• Rotated every 90 days<br>• Never logged or exposed in responses | **CRITICAL:** Authentication bypass - attacker can forge session tokens for any user. Full platform compromise. | 1 hour (emergency secret rotation + user re-authentication) |
| **Stripe API Secret Key** | Environment variable `STRIPE_SECRET_KEY` | • Stored in Secrets Manager<br>• Rotated every 90 days<br>• Restricted to payment service only | **CRITICAL:** Payment fraud - attacker can create refunds, access customer data, manipulate subscriptions. | 2 hours (Stripe key rotation + audit all transactions) |
| **Database Root Credentials** | Secrets Manager (RDS/Cloud SQL) | • Managed by cloud provider<br>• Rotated every 90 days<br>• Application uses limited service account | **CRITICAL:** Full data access - attacker can read all user data, pseudonymization keys, session tokens. | 4 hours (credential rotation + audit all access) |
| **Magic Link Token Secrets** | Database `magic_link_tokens` table (hashed with bcrypt) | • Tokens hashed before storage<br>• 15-minute expiry<br>• Single-use only (deleted after validation) | **HIGH:** Account takeover if token intercepted. Limited to single account. | 15 minutes (token auto-expires) |

#### B.1.2 High-Value Assets

| Asset | Location | Protection Mechanisms | Compromise Impact |
|-------|----------|----------------------|-------------------|
| **User Email Addresses** | PostgreSQL `users.email` (hashed in logs/monitoring) | • Encrypted at rest<br>• Email addresses hashed (SHA-256) in audit logs<br>• Access restricted by RLS | **HIGH:** User privacy violation. Enables phishing attacks. |
| **User-Uploaded Graph Data** | PostgreSQL `graphs` table + S3 (exports) | • Pseudonymized **server-side at ingestion** (HMAC-SHA256) prior to persistence; labels remain client-only<br>• Server-side encryption at rest<br>• Access control via user ownership validation | **MEDIUM:** User data exposure (already pseudonymized). Low re-identification risk. |
| **Subscription Payment Data** | Stripe (PCI DSS Level 1 compliant) - VSG does NOT store card numbers | • Handled entirely by Stripe<br>• VSG stores only `stripe_customer_id` (non-sensitive) | **LOW:** No payment card data stored by VSG. Stripe breach only. |
| **Session Cookies** | Browser (HttpOnly, Secure, SameSite=Lax) | • JWT payload encrypted<br>• 24-hour expiry<br>• CSRF token required for state-changing operations | **HIGH:** Session hijacking. Limited to cookie lifespan (24 hours). |

#### B.1.3 Infrastructure Assets

| Asset | Protection Mechanisms | Compromise Impact |
|-------|----------------------|-------------------|
| **Production Database (PostgreSQL)** | Private subnet, RLS, encrypted at rest/transit | **CRITICAL:** Full data breach |
| **Redis Cache** | Private subnet, authentication required, TLS | **MEDIUM:** Temporary session data exposure (24-hour lifespan) |
| **CI/CD Pipeline (GitHub Actions)** | Branch protection, required reviews, secret scanning | **HIGH:** Supply chain attack - malicious code deployment |
| **Cloud Provider Account (AWS/GCP)** | MFA enforced, least privilege IAM, CloudTrail/audit logs | **CRITICAL:** Full infrastructure compromise |

### B.2 Threat Actors

Visual Social Graph faces diverse threat actors with varying motivations, capabilities, and resources.

#### B.2.1 External Attackers (Opportunistic)

**Profile:**
- Motivation: Financial gain (credential stuffing, phishing), reputation (defacement)
- Capability: Low to Medium (automated tools, known exploits, publicly available vulnerabilities)
- Resources: Minimal (open-source tools, botnets)

**Tactics:**
- Automated vulnerability scanning (Shodan, Nessus, OpenVAS)
- Credential stuffing attacks (leaked password databases)
- Exploitation of known CVEs in dependencies (npm, Python packages)
- Phishing campaigns targeting user accounts

**Likelihood:** **HIGH** (constant background noise)

**Target Assets:** User accounts, public API endpoints, authentication systems

**Mitigations:**
- Rate limiting (Section 8)
- Dependency vulnerability scanning (Snyk, Dependabot - Section 13.1)
- Multi-factor authentication for high-value accounts
- Magic link authentication (no passwords to stuff - Section 3.1)

#### B.2.2 External Attackers (Targeted)

**Profile:**
- Motivation: Competitive intelligence, data harvesting, privacy de-anonymization
- Capability: High (custom exploits, 0-day vulnerabilities, social engineering)
- Resources: Moderate to High (dedicated team, budget for tools/infrastructure)

**Tactics:**
- Spear phishing against employees/admins
- Custom exploit development (API logic flaws, race conditions)
- Privacy attack research (rainbow tables, timing attacks on pseudonymization)
- Supply chain attacks (compromising dependencies or CI/CD pipeline)

**Likelihood:** **MEDIUM** (depends on platform growth and data value)

**Target Assets:** Pseudonymization keys, JWT signing secrets, admin accounts, CI/CD pipeline

**Mitigations:**
- Penetration testing (annual third-party - Section 12.4)
- Security code reviews (Section 13.1)
- HMAC-SHA256 pseudonymization (rainbow table resistant - Section 4.2)
- Employee security training (Section 15)

#### B.2.3 Insider Threats (Malicious)

**Profile:**
- Motivation: Financial gain (data exfiltration for sale), revenge (sabotage), espionage
- Capability: High (legitimate access, deep system knowledge)
- Resources: Internal access, privileged credentials

**Tactics:**
- Data exfiltration via database access or API abuse
- Privilege escalation using insider knowledge
- Sabotage (data deletion, service disruption)
- Credential theft for persistent access after termination

**Likelihood:** **LOW** (requires insider with malicious intent)

**Target Assets:** Database credentials, pseudonymization keys, user data, infrastructure access

**Mitigations:**
- Least privilege access control (Section 2.2)
- Audit logging of all database access (pgAudit - Section 9.6)
- Background checks for employees with production access
- Offboarding procedures (immediate credential revocation - Section 13.2)

#### B.2.4 Insider Threats (Negligent)

**Profile:**
- Motivation: None (accidental exposure)
- Capability: Medium (legitimate access, unintentional mistakes)
- Resources: Internal access, lack of security awareness

**Tactics:**
- Accidental credential leakage (commit to public GitHub, Slack messages)
- Misconfiguration (public S3 buckets, overly permissive IAM roles)
- Phishing victim (employee account compromise)
- Insecure local development practices

**Likelihood:** **MEDIUM** (human error is inevitable)

**Target Assets:** API keys, database credentials, user data in development environments

**Mitigations:**
- Secret scanning in CI/CD (TruffleHog - Section 13.1)
- Phishing awareness training (quarterly simulations - Section 15.3)
- Pre-commit security checklists (Appendix C.1)
- Separate development/production credentials

### B.3 Attack Vectors

This section maps attack vectors to targeted assets and security controls.

#### B.3.1 Authentication Bypass Attacks

**Attack Vector:** JWT Secret Compromise

**Attack Flow:**
1. Attacker gains access to `JWT_SECRET` (credential leak, server compromise, insider threat)
2. Attacker forges JWT tokens for arbitrary users
3. Attacker authenticates as any user, including admins

**Impact:** **CRITICAL** - Full platform compromise, all user accounts accessible

**Likelihood:** Low (secret stored in Secrets Manager with restricted access)

**Controls:**
- JWT secret in Secrets Manager (Section 3.2.1)
- 90-day secret rotation (Section 10.2)
- Audit logging of all secret access (Section 9.6)
- Monitoring for anomalous JWT issuance patterns (Section 9.4)

---

**Attack Vector:** Magic Link Token Prediction

**Attack Flow:**
1. Attacker analyzes magic link token generation algorithm
2. Attacker predicts future token values (if using weak randomness)
3. Attacker requests magic link for victim's email
4. Attacker uses predicted token to authenticate as victim

**Impact:** **HIGH** - Single account takeover

**Likelihood:** Very Low (256-bit cryptographically secure tokens)

**Controls:**
- 256-bit tokens from `secrets.token_urlsafe()` (Section 3.1.1)
- 15-minute expiry (Section 3.1.1)
- Single-use tokens (deleted after validation - Section 3.1.1)
- Rate limiting on magic link requests (5/hour - Section 8.2)

---

**Attack Vector:** CSRF Token Bypass

**Attack Flow:**
1. Attacker lures victim to malicious site
2. Malicious site submits state-changing request to VSG (e.g., `POST /api/graphs/delete`)
3. If CSRF protection absent, request executes with victim's session

**Impact:** **MEDIUM** - Unauthorized actions on behalf of authenticated user

**Likelihood:** Very Low (CSRF double-submit pattern enforced)

**Controls:**
- CSRF double-submit token (128-bit - Section 3.2.2)
- `SameSite=Lax` cookie attribute (Section 3.2.1)
- CORS policy restricts cross-origin requests (Section 11.4)

#### B.3.2 Data Exfiltration Attacks

**Attack Vector:** IDOR (Insecure Direct Object Reference)

**Attack Flow:**
1. Attacker enumerates resource IDs (e.g., `graph_01HN3VQX...`)
2. Attacker attempts to access other users' resources (`GET /api/graphs/{victim_id}`)
3. If ownership validation missing, attacker retrieves victim's data

**Impact:** **HIGH** - Unauthorized access to user graphs (already pseudonymized, but still sensitive)

**Likelihood:** Low (ULID IDs + ownership validation enforced)

**Controls:**
- ULIDs instead of sequential IDs (non-guessable - Section 3.4.3)
- Row-level security in PostgreSQL (Section 3.4.3)
- Ownership validation on every resource access (Section 3.4.3)
- Monitoring for `PERMISSION_DENIED` error spikes (Appendix A.5)

---

**Attack Vector:** SQL Injection

**Attack Flow:**
1. Attacker submits malicious input to API endpoint (e.g., `platform='; DROP TABLE users;--`)
2. If input not sanitized, SQL query is manipulated
3. Attacker executes arbitrary SQL (data exfiltration, deletion, privilege escalation)

**Impact:** **CRITICAL** - Full database compromise

**Likelihood:** Very Low (parameterized queries enforced)

**Controls:**
- Parameterized queries only (no string concatenation - Section 7.2.1)
- SQLAlchemy ORM with automatic escaping (Section 7.2.1)
- Input validation against OpenAPI schema (Section 7.1)
- Web Application Firewall (Cloudflare WAF - Section 13.4)

---

**Attack Vector:** API Key Compromise (Creator Tier)

**Attack Flow:**
1. Attacker obtains Creator tier API key (leaked in public repo, stolen from client)
2. Attacker uses API key to access victim's data
3. Attacker exfiltrates graphs, insights, user metadata

**Impact:** **HIGH** - Unauthorized access to single Creator account's data

**Likelihood:** Medium (API keys easier to leak than session cookies)

**Controls:**
- API key scoping (read-only vs. write access - Section 3.3)
- 90-day API key expiry (Section 3.3)
- Rate limiting on API endpoints (Section 8.2)
- Monitoring for API key usage from unexpected IPs (Section 9.4)
- Secret scanning in public repos (TruffleHog - Section 13.1)

#### B.3.3 Privacy De-Anonymization Attacks

**Attack Vector:** Pseudonymization Key Extraction

**Attack Flow:**
1. Attacker compromises database or server with access to `user_pseudonymization_keys` table
2. Attacker extracts per-user HMAC keys
3. Attacker re-pseudonymizes known identities to build reverse mapping
4. Attacker de-anonymizes all historical graphs

**Impact:** **CRITICAL** - Privacy breach, GDPR violation, complete pseudonymization failure

**Likelihood:** Very Low (keys encrypted at rest, RLS enforced, access restricted)

**Controls:**
- Keys encrypted at rest with KMS (Section 5.2)
- Row-level security restricts key access (Section 4.2.3)
- Keys never exposed to client-side code (Section 4.2.2)
- Keys deleted on account deletion (Section 4.3)
- Audit logging of all key table access (Section 9.6)

---

**Attack Vector:** Rainbow Table Attack (if using plain SHA-256)

**Attack Flow:**
1. Attacker obtains pseudonymized graph data
2. Attacker builds rainbow table for common Twitter/Instagram usernames
3. Attacker matches pseudonymized hashes to rainbow table entries
4. Attacker identifies some users in graph

**Impact:** **HIGH** - Partial de-anonymization of common usernames

**Likelihood:** Very Low (HMAC-SHA256 with secret key prevents rainbow tables)

**Controls:**
- HMAC-SHA256 with per-user 256-bit secret key (Section 4.2.1)
- Keys unknown to attacker (rainbow tables useless without key)
- Deterministic mapping maintained (same user = same hash within graph)

---

**Attack Vector:** Timing Attack on Pseudonymization

**Attack Flow:**
1. Attacker submits graph with known identities at different times
2. Attacker measures server response time variations
3. Attacker infers information about pseudonymization key or algorithm

**Impact:** **LOW** - Minimal information leakage (HMAC computation time consistent)

**Likelihood:** Very Low (HMAC timing attacks require millions of samples)

**Controls:**
- HMAC-SHA256 has constant-time guarantees in modern libraries
- 80% client-side pseudonymization reduces server-side timing surface
- Rate limiting prevents large-scale timing probes (Section 8.2)

#### B.3.4 Payment Fraud Attacks

**Attack Vector:** Stripe Webhook Spoofing

**Attack Flow:**
1. Attacker crafts fake Stripe webhook payload (e.g., `payment_succeeded` for unpaid subscription)
2. Attacker sends payload to `POST /api/webhooks/stripe`
3. If signature verification bypassed, VSG grants Pro tier without payment

**Impact:** **HIGH** - Revenue loss, unauthorized feature access

**Likelihood:** Very Low (HMAC signature verification enforced)

**Controls:**
- HMAC-SHA256 signature verification (Section 10.1.1)
- Timestamp validation (5-minute replay window - Section 10.1.2)
- Replay attack prevention (idempotency keys - Section 10.1.3)
- Monitoring for `WEBHOOK_SIGNATURE_INVALID` errors (Appendix A.6)

---

**Attack Vector:** Stripe API Key Theft

**Attack Flow:**
1. Attacker obtains `STRIPE_SECRET_KEY` (credential leak, server compromise)
2. Attacker creates refunds, accesses customer data, manipulates subscriptions
3. Attacker commits payment fraud or data theft

**Impact:** **CRITICAL** - Payment fraud, customer data breach, PCI DSS violation

**Likelihood:** Low (key stored in Secrets Manager, rotated every 90 days)

**Controls:**
- Stripe key in Secrets Manager (Section 10.2.1)
- 90-day key rotation (Section 10.2.2)
- Stripe account activity monitoring (webhooks for all events - Section 10.1)
- Secret scanning in CI/CD (TruffleHog - Section 13.1)

#### B.3.5 Client-Side Attacks

**Attack Vector:** Cross-Site Scripting (XSS)

**Attack Flow:**
1. Attacker injects malicious script into user-controlled field (e.g., graph node label)
2. Script executes when victim views graph
3. Attacker steals session cookies, performs actions as victim, or redirects to phishing site

**Impact:** **HIGH** - Session hijacking, account takeover, phishing

**Likelihood:** Low (React auto-escaping + CSP nonce enforcement)

**Controls:**
- React automatic HTML escaping (Section 11.7)
- Content Security Policy with nonce-based scripts (Section 11.1)
- Input sanitization for all user fields (Section 7.3)
- HttpOnly cookies prevent JavaScript access (Section 3.2.1)

---

**Attack Vector:** Service Worker Cache Poisoning

**Attack Flow:**
1. Attacker tricks service worker into caching malicious content from untrusted origin
2. Cached malicious content served to all users
3. Attacker executes XSS or phishing attack via cached content

**Impact:** **CRITICAL** - Persistent XSS affecting all users

**Likelihood:** Very Low (origin validation enforced in service worker)

**Controls:**
- Origin validation before caching (Section 11.3.1)
- Never cache API responses (sensitive data - Section 11.3.2)
- Cache versioning and purge strategy (Section 11.3.3)
- CSP restricts script sources (Section 11.1)

---

**Attack Vector:** Clickjacking

**Attack Flow:**
1. Attacker embeds VSG page in invisible iframe on malicious site
2. Attacker overlays fake UI to trick user into clicking hidden VSG actions
3. User unwittingly performs actions (e.g., delete graph, change email)

**Impact:** **MEDIUM** - Unauthorized user actions

**Likelihood:** Very Low (X-Frame-Options + CSP frame-ancestors enforced)

**Controls:**
- `X-Frame-Options: DENY` (Section 11.6)
- CSP `frame-ancestors 'none'` (Section 11.1)
- `SameSite=Lax` cookies prevent cross-site requests (Section 3.2.1)

### B.4 Risk Matrix

This matrix combines likelihood and impact to prioritize security controls and incident response.

#### B.4.1 Risk Assessment Methodology

**Likelihood Scale:**
- **Very Low:** <1% annual probability
- **Low:** 1-10% annual probability
- **Medium:** 10-40% annual probability
- **High:** >40% annual probability

**Impact Scale:**
- **LOW:** Minor inconvenience, no data breach, <$10K damage
- **MEDIUM:** Limited data exposure (pseudonymized data), <$100K damage, no regulatory violation
- **HIGH:** Single account compromise, <$500K damage, potential regulatory fine
- **CRITICAL:** Full platform compromise, mass data breach, >$500K damage, GDPR violation, existential threat

#### B.4.2 Risk Matrix (Likelihood × Impact)

| Attack Vector | Likelihood | Impact | Risk Level | Priority | Mitigations (Section References) |
|--------------|------------|--------|-----------|----------|-----------------------------------|
| **JWT Secret Compromise** | Low | **CRITICAL** | **HIGH RISK** | **P0** | Secrets Manager (3.2.1), 90-day rotation (10.2), audit logs (9.6) |
| **Database Credential Theft** | Low | **CRITICAL** | **HIGH RISK** | **P0** | Cloud-managed secrets, RLS (13.2), least privilege, audit logs (9.6) |
| **Stripe Key Theft** | Low | **CRITICAL** | **HIGH RISK** | **P0** | Secrets Manager (10.2.1), 90-day rotation (10.2.2), webhook monitoring |
| **Pseudonymization Key Extraction** | Very Low | **CRITICAL** | **MEDIUM RISK** | **P1** | KMS encryption (5.2), RLS (4.2.3), key deletion (4.3), audit logs (9.6) |
| **Webhook Signature Spoofing** | Very Low | **HIGH** | **MEDIUM RISK** | **P1** | HMAC verification (10.1.1), timestamp validation (10.1.2), IR trigger (12.1) |
| **SQL Injection** | Very Low | **CRITICAL** | **MEDIUM RISK** | **P1** | Parameterized queries (7.2.1), WAF (13.4), input validation (7.1) |
| **Service Worker Cache Poisoning** | Very Low | **CRITICAL** | **MEDIUM RISK** | **P1** | Origin validation (11.3.1), cache restrictions (11.3.2), CSP (11.1) |
| **IDOR Enumeration** | Low | **HIGH** | **MEDIUM RISK** | **P1** | ULIDs (3.4.3), RLS (3.4.3), ownership validation, error monitoring (A.5) |
| **Credential Stuffing** | High | **HIGH** | **MEDIUM RISK** | **P1** | Magic link auth (3.1), rate limiting (8.2), monitoring (9.4) |
| **API Key Compromise (Creator)** | Medium | **HIGH** | **MEDIUM RISK** | **P1** | 90-day expiry (3.3), rate limiting (8.2), IP monitoring (9.4), secret scanning (13.1) |
| **XSS Injection** | Low | **HIGH** | **MEDIUM RISK** | **P1** | React escaping (11.7), CSP nonces (11.1), input sanitization (7.3) |
| **Insider Threat (Malicious)** | Low | **HIGH** | **MEDIUM RISK** | **P2** | Least privilege (2.2), audit logs (9.6), background checks, offboarding (13.2) |
| **Magic Link Token Prediction** | Very Low | **HIGH** | **LOW RISK** | **P2** | 256-bit tokens (3.1.1), 15-min expiry, single-use, rate limiting (8.2) |
| **Rainbow Table Attack** | Very Low | **HIGH** | **LOW RISK** | **P2** | HMAC-SHA256 (4.2.1) prevents rainbow tables |
| **CSRF Bypass** | Very Low | **MEDIUM** | **LOW RISK** | **P2** | Double-submit pattern (3.2.2), SameSite cookies (3.2.1), CORS (11.4) |
| **Clickjacking** | Very Low | **MEDIUM** | **LOW RISK** | **P3** | X-Frame-Options (11.6), CSP frame-ancestors (11.1) |
| **Insider Threat (Negligent)** | Medium | **MEDIUM** | **LOW RISK** | **P2** | Secret scanning (13.1), phishing training (15.3), pre-commit checks (C.1) |
| **Timing Attack (Pseudonymization)** | Very Low | **LOW** | **LOW RISK** | **P3** | HMAC constant-time, rate limiting (8.2), 80% client-side (4.1) |

#### B.4.3 Risk Mitigation Priorities

**P0 (Immediate - Implemented):**
- JWT secret protection in Secrets Manager with 90-day rotation
- Database credential management with cloud provider security
- Stripe API key protection and rotation
- All P0 controls implemented per plan

**P1 (High Priority - Implemented):**
- HMAC-SHA256 pseudonymization (rainbow table resistant)
- Webhook HMAC signature verification
- Parameterized queries (SQL injection prevention)
- IDOR prevention (ULIDs + RLS + ownership validation)
- CSP with nonce-based scripts
- Service Worker origin validation
- All P1 controls implemented per plan

**P2 (Medium Priority - Implemented):**
- Audit logging and monitoring (90-day retention)
- Rate limiting and quota enforcement
- Security training and phishing awareness
- All P2 controls implemented per plan

**P3 (Low Priority - Deferred/Accepted Risk):**
- Advanced timing attack defenses (marginal benefit)
- Additional clickjacking protections beyond current controls
- Extended audit log retention beyond 90 days (cost vs. benefit)

#### B.4.4 Threat Model Maintenance

**Review Frequency:** Quarterly (or after major feature releases)

**Update Triggers:**
- New feature launches (e.g., real-time collaboration, mobile app)
- Pen test findings (Section 12.4)
- Security incidents (Section 12.2)
- New attack techniques in threat intelligence feeds

**Owner:** Security Team / CTO

**Next Review:** March 2026

---

### [Appendix C: Security Checklists](#appendix-c-security-checklists)
- C.1 [Pre-Commit Security Checklist](#c1-pre-commit-security-checklist)
- C.2 [Code Review Security Checklist](#c2-code-review-security-checklist)
- C.3 [Deployment Security Checklist](#c3-deployment-security-checklist)

---

## Appendix C: Security Checklists

These checklists provide actionable security verification steps for developers at three critical stages: pre-commit (local development), code review (peer review), and deployment (production release). Use these checklists to catch security issues early and maintain consistent security standards.

### C.1 Pre-Commit Security Checklist

**Purpose:** Catch security issues before code is committed to version control.

**When to Use:** Before every `git commit` that introduces new code or modifies existing security-sensitive code.

#### C.1.1 Authentication & Authorization

- [ ] **No hardcoded credentials** - Verify no API keys, passwords, JWT secrets, or database credentials in code
  - Run: `git diff --cached | grep -iE '(password|secret|api_key|token|credential)'`
  - Use: Environment variables or Secrets Manager for all credentials

- [ ] **Session token handling** - JWT tokens never logged or exposed in error messages
  - Check: All `console.log()`, `logger.info()`, error responses for token leakage

- [ ] **Authorization checks** - Every resource access validates ownership
  - Pattern: `if (resource.user_id != current_user.id): abort(403)`
  - Check: Database queries include `WHERE user_id = ?` clauses

- [ ] **IDOR prevention** - Resource IDs use ULIDs, not sequential integers
  - Check: All new database tables use `ULID` for primary keys
  - Verify: No `.order_by('id')` that could leak record counts

#### C.1.2 Data Privacy & Encryption

- [ ] **No PII in logs** - Email, IP addresses, user identifiers hashed before logging
  - Pattern: `logger.info(f"User {sha256(email)} logged in")`
  - Check: All logging statements for email, IP, session token exposure

- [ ] **Pseudonymization applied** - Social network identifiers pseudonymized via HMAC-SHA256
  - Check: Client-side pseudonymization called before server upload
  - Verify: Server-side fallback mode uses per-user HMAC keys

- [ ] **Encryption at rest** - Sensitive data encrypted before database storage
  - Check: New database columns for sensitive data have encryption annotation
  - Example: `encrypted_field = EncryptedTextField()`

- [ ] **TLS for external APIs** - All HTTP requests use `https://` (never `http://`)
  - Run: `git diff --cached | grep -E 'http://[^l]'` (catches non-localhost http://)

#### C.1.3 Input Validation & Injection Prevention

- [ ] **Parameterized queries only** - No SQL string concatenation
  - **NEVER:** `query = f"SELECT * FROM users WHERE email = '{email}'"`
  - **ALWAYS:** `query = "SELECT * FROM users WHERE email = ?" params=[email]`
  - Check: All new database queries use placeholders (`?` or `%s`)

- [ ] **Input validation** - All user input validated against schema before processing
  - Check: API endpoints have `@validate_schema(UserInputSchema)` decorator
  - Verify: Enum fields validated against allowed values

- [ ] **XSS prevention** - User-generated content properly escaped
  - React: Trust React's auto-escaping (no `dangerouslySetInnerHTML` without sanitization)
  - Backend: HTML-escape all user content in templates

- [ ] **File upload validation** - File size, type, and content validated
  - Check: `if file.size > MAX_SIZE: abort(413)`
  - Verify: File type checked via magic bytes, not just extension

#### C.1.4 Error Handling & Logging

- [ ] **No sensitive data in errors** - Error messages don't leak implementation details
  - **BAD:** `"Database connection failed: postgres://user:pass@host"`
  - **GOOD:** `"Internal server error. Please contact support with error ID: err_01JB..."`

- [ ] **Sentry PII scrubbing** - Error logging scrubs PII before transmission
  - Check: `sentry_sdk.init(before_send=scrub_pii, send_default_pii=False)`
  - Verify: All Sentry events scrub email, IP, cookies, Authorization headers

- [ ] **Audit logging** - Security-relevant events logged to `security_audit_log` table
  - Events: Authentication, authorization failures, data access, configuration changes
  - Check: `audit_log.create(event_type='authentication.login.success', ...)`

#### C.1.5 Dependencies & Third-Party Code

- [ ] **Dependency vulnerability scan** - New dependencies checked for known CVEs
  - Run: `npm audit` or `pip-audit` before adding new packages
  - Check: No HIGH or CRITICAL vulnerabilities in new dependencies

- [ ] **Minimal dependencies** - Only add dependencies if truly necessary
  - Question: Can this be implemented in <100 lines without a new dependency?
  - Check: Review package download count, last update, GitHub stars (avoid unmaintained packages)

- [ ] **Subresource Integrity (SRI)** - CDN resources use integrity hashes
  - Example: `<script src="..." integrity="sha384-..." crossorigin="anonymous"></script>`
  - Check: All `<script>` and `<link>` tags from CDNs have `integrity` attribute

#### C.1.6 Secrets & Configuration

- [ ] **No secrets in .env files committed** - `.env` in `.gitignore`
  - Check: `git status` shows no `.env`, `credentials.json`, or similar files
  - Verify: `.env.example` has placeholder values only

- [ ] **Secrets in CI/CD** - GitHub Actions uses repository secrets, not inline values
  - Pattern: `${{ secrets.STRIPE_SECRET_KEY }}` (not `sk_live_...` hardcoded)

- [ ] **Development vs. Production separation** - Different credentials for dev/staging/prod
  - Check: No production database URL in development config files

#### C.1.7 Pre-Commit Automation

**Recommended Git Pre-Commit Hook:**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# 1. Secret scanning (TruffleHog)
trufflehog git file://. --since-commit HEAD --fail

# 2. Dependency vulnerability scan
npm audit --production --audit-level=high || exit 1

# 3. Linting with security rules
npm run lint:security || exit 1

# 4. Check for common patterns
git diff --cached | grep -iE '(password|secret|api_key|token)\s*=\s*["\047]' && \
  echo "ERROR: Possible hardcoded secret detected" && exit 1

echo "✅ Pre-commit security checks passed"
```

---

### C.2 Code Review Security Checklist

**Purpose:** Security-focused code review checklist for pull request reviewers.

**When to Use:** During PR review, especially for changes touching authentication, data access, or third-party integrations.

#### C.2.1 Authentication & Session Management

- [ ] **Authentication bypass risks** - No logic flaws allowing unauthenticated access
  - Check: `@require_auth` decorator present on all protected endpoints
  - Verify: No `if user: ...` without `else: abort(401)`

- [ ] **JWT validation complete** - JWT signature, expiry, and issuer validated
  - Check: `jwt.decode(token, SECRET_KEY, algorithms=['HS256'], verify_exp=True)`
  - Verify: No `verify=False` or disabled signature checks

- [ ] **Magic link security** - Tokens are cryptographically secure, single-use, time-limited
  - Check: `secrets.token_urlsafe(32)` used (not `uuid.uuid4()` or weak random)
  - Verify: Token deleted from database after validation (single-use enforcement)

- [ ] **OAuth security** - State parameter prevents CSRF, scope minimized
  - Check: `state = secrets.token_urlsafe(16)` stored in session before redirect
  - Verify: Google OAuth scopes limited to `email` and `profile` only

#### C.2.2 Authorization & Access Control

- [ ] **IDOR vulnerabilities** - Resource ownership validated before access
  - Pattern: Every `GET /api/graphs/{id}` validates `graph.user_id == current_user.id`
  - Check: Database RLS policies applied to sensitive tables

- [ ] **Privilege escalation** - Users cannot elevate subscription tier without payment
  - Check: Subscription changes only via Stripe webhook handlers
  - Verify: No client-side tier updates (e.g., `POST /api/account/upgrade`)

- [ ] **Feature gating** - Tier-restricted features enforce subscription checks
  - Pattern: `if current_user.tier not in ['pro', 'creator']: abort(403, 'TIER_FEATURE_RESTRICTED')`
  - Check: Rate limits and quotas respect subscription tier

#### C.2.3 Data Privacy & Pseudonymization

- [ ] **HMAC-SHA256 pseudonymization** - Social identifiers pseudonymized with per-user keys
  - Check: `hmac.new(user_key, identifier.encode(), hashlib.sha256).hexdigest()`
  - Verify: Keys never exposed to client-side code

- [ ] **Timestamp privacy** - Timestamps truncated to day-level granularity
  - Pattern: `timestamp.replace(hour=0, minute=0, second=0, microsecond=0)`
  - Check: No hour/minute-level timestamps in user-facing graph data

- [ ] **GDPR data minimization** - Only essential data collected and stored
  - Check: No unnecessary user metadata (e.g., geolocation, device fingerprints)
  - Verify: Data retention policies enforce automatic deletion

- [ ] **Deletion propagation** - Account deletion cascades to all user data
  - Check: Database `ON DELETE CASCADE` constraints on foreign keys
  - Verify: Pseudonymization keys deleted (not just soft-deleted)

#### C.2.4 Input Validation & Injection Prevention

- [ ] **SQL injection prevention** - All queries use parameterization or ORM
  - **HIGH RISK:** Any `f"SELECT ... {user_input} ..."` or `.raw(query)`
  - Check: SQLAlchemy `.filter()` or `.where()` with bound parameters

- [ ] **Command injection prevention** - No shell commands with user input
  - **NEVER:** `os.system(f"convert {user_filename}")` or `subprocess.call(f"...{input}...")`
  - Check: If shell commands needed, use `subprocess.run([...], shell=False)` with list args

- [ ] **Path traversal prevention** - File paths validated and sanitized
  - **NEVER:** `open(f"/uploads/{user_provided_path}")`
  - Check: `os.path.abspath(path).startswith(UPLOAD_DIR)` before file access

- [ ] **XXE prevention** - XML parsing disables external entities
  - Check: `lxml.etree.XMLParser(resolve_entities=False)`

#### C.2.5 Cryptography & Secrets

- [ ] **Strong cryptographic algorithms** - No MD5, SHA-1, or weak ciphers
  - **APPROVED:** AES-256-GCM, HMAC-SHA256, bcrypt, argon2, TLS 1.3
  - **BANNED:** DES, 3DES, RC4, MD5, SHA-1 (for security purposes)

- [ ] **Secrets rotation** - Secrets have defined rotation schedule
  - Check: JWT secrets, API keys, database passwords rotated every 90 days
  - Verify: Rotation procedure documented in runbooks

- [ ] **Key derivation** - Passwords/tokens use proper KDF (not plain hashing)
  - **CORRECT:** `bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))`
  - **WRONG:** `sha256(password)` (no salt or KDF)

#### C.2.6 Rate Limiting & DoS Prevention

- [ ] **Rate limiting applied** - All public endpoints have rate limits
  - Check: `@ratelimit(limit='100/hour', key_func=lambda: current_user.id)`
  - Verify: Unauthenticated endpoints rate-limited by IP

- [ ] **Resource limits enforced** - File uploads, graph sizes, API payloads limited
  - Check: `MAX_UPLOAD_SIZE = 10 * 1024 * 1024` (10 MB)
  - Verify: Timeouts on expensive operations (e.g., insight generation)

- [ ] **Algorithmic complexity attacks** - No unbounded loops on user input
  - **HIGH RISK:** `for item in user_provided_list: ...` (if list size unlimited)
  - Check: Validate input size before processing (e.g., `if len(list) > 10000: abort(413)`)

#### C.2.7 Error Handling & Logging

- [ ] **Generic error messages** - Errors don't leak implementation details
  - **BAD:** `"PostgreSQL error: relation 'users' does not exist"`
  - **GOOD:** `"An error occurred. Contact support with error ID: err_01JB..."`

- [ ] **Audit trail completeness** - Security events logged with context
  - Check: Authentication failures include IP, user-agent, timestamp
  - Verify: Authorization failures include resource ID, requested action

- [ ] **Log injection prevention** - User input sanitized before logging
  - **RISK:** `logger.info(f"User {user_input} logged in")` (if input has newlines)
  - Check: Escape newlines or use structured logging (JSON format)

#### C.2.8 Third-Party Integrations

- [ ] **Webhook signature verification** - All webhooks validate HMAC signatures
  - Check: Stripe webhook handler verifies `Stripe-Signature` header
  - Verify: Constant-time comparison (`hmac.compare_digest()`)

- [ ] **API key rotation** - Third-party API keys have expiry and rotation
  - Check: Stripe, Google, Sentry keys rotated every 90 days
  - Verify: Old keys revoked after rotation

- [ ] **Minimal OAuth scopes** - OAuth requests minimum necessary scopes
  - Check: Google OAuth requests `email` and `profile` only (not `drive`, `calendar`, etc.)

#### C.2.9 Client-Side Security

- [ ] **CSP nonces** - Content Security Policy uses nonces for inline scripts
  - Check: Every response includes `Content-Security-Policy` header with nonce
  - Verify: `<script nonce="{{csp_nonce}}">` in templates

- [ ] **HttpOnly cookies** - Session cookies have `HttpOnly` and `Secure` flags
  - Check: `Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax`

- [ ] **CORS configuration** - Cross-origin requests restricted to trusted origins
  - Check: `Access-Control-Allow-Origin` is NOT `*` (use specific domains)
  - Verify: `Access-Control-Allow-Credentials: true` only with specific origins

#### C.2.10 Code Review Approval Criteria

**Security-Sensitive Changes (Require Security Team Review):**
- Authentication or authorization logic changes
- Cryptography implementation or algorithm changes
- Payment processing or webhook handlers
- Database schema changes affecting RLS or encryption
- Third-party integration additions

**Auto-Reject Conditions (Require Immediate Fixes):**
- Hardcoded secrets detected
- SQL injection vulnerabilities (string concatenation in queries)
- Command injection risks (shell=True with user input)
- XSS vulnerabilities (dangerouslySetInnerHTML without sanitization)
- Missing authentication on protected endpoints

---

### C.3 Deployment Security Checklist

**Purpose:** Verify security posture before deploying to production.

**When to Use:** Before every production deployment (manual gate in CI/CD pipeline).

#### C.3.1 Pre-Deployment Security Scans

- [ ] **Dependency vulnerability scan (PASSED)** - No HIGH or CRITICAL CVEs
  - Run: `npm audit --production --audit-level=high`
  - Run: `pip-audit --require-hashes`
  - Threshold: Zero HIGH/CRITICAL vulnerabilities (MEDIUM acceptable with justification)

- [ ] **SAST (Static Application Security Testing) (PASSED)** - Code analysis passed
  - Tool: Semgrep with OWASP ruleset
  - Run: `semgrep --config=auto --error --severity=ERROR`
  - Threshold: Zero ERROR-level findings

- [ ] **Secret scanning (PASSED)** - No secrets in codebase
  - Tool: TruffleHog
  - Run: `trufflehog git file://. --fail`
  - Threshold: Zero secrets detected

- [ ] **Container image scan (PASSED)** - Docker images have no vulnerabilities
  - Tool: Snyk Container or Trivy
  - Run: `snyk container test <image>:latest --severity-threshold=high`
  - Threshold: Zero HIGH/CRITICAL vulnerabilities

#### C.3.2 Configuration Validation

- [ ] **Environment variables set** - All required secrets present in production
  - Check: `JWT_SECRET`, `STRIPE_SECRET_KEY`, `DATABASE_URL`, `SENTRY_DSN`
  - Verify: Secrets are production values (not dev/staging keys)

- [ ] **Database encryption enabled** - RDS/Cloud SQL has encryption at rest
  - Check: `storage_encrypted = true` (Terraform) or console verification
  - Verify: KMS key specified (not default key)

- [ ] **TLS certificates valid** - HTTPS certificates not expired, proper chain
  - Run: `openssl s_client -connect api.visualsocialgraph.com:443 -servername api.visualsocialgraph.com`
  - Verify: Valid until date >30 days in future, no self-signed

- [ ] **CSP header configured** - Content Security Policy deployed
  - Check: Response headers include `Content-Security-Policy` with nonces
  - Verify: No `unsafe-inline` or `unsafe-eval` (except with nonces)

- [ ] **CORS policy restrictive** - Cross-origin access limited to trusted domains
  - Check: `Access-Control-Allow-Origin` NOT `*`
  - Verify: Only `https://visualsocialgraph.com` allowed

#### C.3.3 Access Control & Permissions

- [ ] **Database least privilege** - Application uses service account (not root)
  - Check: Application DB user has SELECT/INSERT/UPDATE/DELETE only (no DDL)
  - Verify: RLS policies enabled on production database

- [ ] **IAM least privilege** - Cloud resources use minimal IAM permissions
  - Check: EC2/Lambda role has specific S3 bucket access (not `s3:*`)
  - Verify: No `AdministratorAccess` policies attached

- [ ] **SSH access disabled** - Production servers not accessible via SSH
  - Check: Security group rules block port 22 from internet
  - Verify: AWS Systems Manager Session Manager used for emergencies only

- [ ] **API keys scoped** - Third-party API keys have minimal permissions
  - Check: Stripe API key is restricted mode (not unrestricted)
  - Verify: Google OAuth consent screen approved (not testing mode)

#### C.3.4 Monitoring & Alerting

- [ ] **Sentry error tracking active** - Error monitoring configured
  - Check: `SENTRY_DSN` set, `sentry_sdk.init()` called at app startup
  - Verify: PII scrubbing enabled (`before_send=scrub_pii`)

- [ ] **Security alerts configured** - PagerDuty/OpsGenie receives critical alerts
  - Alerts: `WEBHOOK_SIGNATURE_INVALID`, `DATA_CORRUPTION`, `AUTHENTICATION_FAILED` spike
  - Check: Test alert sends notification to on-call engineer

- [ ] **Audit log retention** - Security audit logs enabled with 90-day retention
  - Check: `security_audit_log` table has automatic deletion job
  - Verify: pgAudit enabled on production database

- [ ] **Rate limiting active** - Redis rate limiting operational
  - Check: Redis cluster reachable from application servers
  - Verify: Test request returns `X-RateLimit-*` headers

#### C.3.5 Backup & Disaster Recovery

- [ ] **Database backups enabled** - Automated daily backups with 7-day retention
  - Check: RDS automated backups enabled
  - Verify: Backup restore tested in last 90 days

- [ ] **Secrets backup** - Secrets Manager secrets replicated to secondary region
  - Check: AWS Secrets Manager replication enabled
  - Verify: Failover procedure documented

- [ ] **Incident response plan** - IR plan accessible to on-call team
  - Check: [VSG_SECURITY_PRIVACY.md](VSG_SECURITY_PRIVACY.md) Section 12 reviewed
  - Verify: DPO contact information current

#### C.3.6 Compliance Verification

- [ ] **GDPR data processing record updated** - Article 30 record current
  - Check: Third-party processors list updated (Stripe, Google, Sentry)
  - Verify: Data retention policies match implementation

- [ ] **Security headers present** - All security headers configured
  - Headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `CSP`
  - Run: `curl -I https://api.visualsocialgraph.com` and verify headers

- [ ] **Cookie security** - Session cookies have secure attributes
  - Check: `HttpOnly`, `Secure`, `SameSite=Lax` flags set
  - Verify: Cookie expiry matches JWT expiry (24 hours)

#### C.3.7 Rollback Plan

- [ ] **Rollback procedure tested** - Deployment can be reverted in <15 minutes
  - Check: Previous Docker image tag available
  - Verify: Database migrations reversible (no data-destructive migrations)

- [ ] **Feature flags ready** - Critical features can be disabled remotely
  - Check: Feature flags for new authentication methods, payment flows
  - Verify: Flag changes propagate to all instances in <1 minute

#### C.3.8 Post-Deployment Verification

**Automated Smoke Tests (Run immediately after deployment):**

```bash
#!/bin/bash
# post-deploy-security-checks.sh

BASE_URL="https://api.visualsocialgraph.com"

# 1. Health check
curl -f $BASE_URL/health || exit 1

# 2. TLS version check
openssl s_client -connect api.visualsocialgraph.com:443 -tls1_3 < /dev/null | grep "TLSv1.3" || exit 1

# 3. Security headers check
HEADERS=$(curl -sI $BASE_URL)
echo "$HEADERS" | grep "Strict-Transport-Security" || exit 1
echo "$HEADERS" | grep "Content-Security-Policy" || exit 1
echo "$HEADERS" | grep "X-Frame-Options: DENY" || exit 1

# 4. Rate limiting check
for i in {1..10}; do curl -s $BASE_URL/api/graphs > /dev/null; done
curl -I $BASE_URL/api/graphs | grep "X-RateLimit-Remaining" || exit 1

# 5. Authentication required
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/account)
[ "$HTTP_CODE" == "401" ] || exit 1

echo "✅ Post-deployment security checks PASSED"
```

**Manual Verification (Within 1 hour of deployment):**

- [ ] **Authentication flow works** - Test magic link and Google OAuth login
- [ ] **Payment flow works** - Test Stripe checkout (use test mode)
- [ ] **GDPR deletion works** - Test account deletion and verify cascade
- [ ] **Error monitoring works** - Trigger test error and verify Sentry alert

#### C.3.9 Deployment Approval

**Required Approvals:**
- [ ] Engineering Lead: Code changes reviewed
- [ ] Security Team: Security checklist verified (for security-sensitive changes)
- [ ] CTO: Final approval (for major releases)

**Deployment Windows:**
- **Preferred:** Tuesday-Thursday, 10am-2pm ET (avoid Mondays and Fridays)
- **Blackout:** No deployments during holiday weekends or major campaigns

**Emergency Hotfix Process:**
- Severity P0/P1 security vulnerabilities: Deploy immediately (skip approval for emergency patches)
- Notify CTO and Security Team within 1 hour

---

### [Appendix D: Data Flow Diagrams](#appendix-d-data-flow-diagrams)
- D.1 [Authentication Flow Diagram](#d1-authentication-flow-diagram)
- D.2 [Pseudonymization Flow Diagram](#d2-pseudonymization-flow-diagram)
- D.3 [GDPR Deletion Flow Diagram](#d3-gdpr-deletion-flow-diagram)
- D.4 [Webhook Security Flow Diagram](#d4-webhook-security-flow-diagram)

---

## Appendix D: Data Flow Diagrams

This appendix visualizes critical security data flows using ASCII-art diagrams. These diagrams illustrate authentication, pseudonymization, GDPR deletion, and webhook security processes with trust boundaries and security controls highlighted.

### D.1 Authentication Flow Diagram

**Scenario:** User authentication via Magic Link and Google OAuth with CSRF protection.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW (MAGIC LINK)                       │
└──────────────────────────────────────────────────────────────────────────────┘

  ┌─────────┐                          ┌─────────────┐                  ┌──────────┐
  │ Browser │                          │  VSG API    │                  │   DB     │
  │ (User)  │                          │  Server     │                  │(Postgres)│
  └────┬────┘                          └──────┬──────┘                  └────┬─────┘
       │                                      │                              │
       │ 1. POST /api/auth/magic-link        │                              │
       │    { email: "user@example.com" }    │                              │
       ├────────────────────────────────────►│                              │
       │                                      │                              │
       │                                      │ 2. Generate token           │
       │                                      │    token = secrets.          │
       │                                      │      token_urlsafe(32)       │
       │                                      │    (256-bit random)          │
       │                                      │                              │
       │                                      │ 3. Hash token (bcrypt)       │
       │                                      │    hash = bcrypt.hashpw()    │
       │                                      │                              │
       │                                      │ 4. Store hashed token        │
       │                                      ├─────────────────────────────►│
       │                                      │  INSERT INTO magic_links     │
       │                                      │  (email, token_hash, expiry) │
       │                                      │  VALUES (?, ?, NOW()+15min)  │
       │                                      │◄─────────────────────────────┤
       │                                      │                              │
       │                                      │ 5. Send email (plaintext)    │
       │                                      │    link: /auth/verify?       │
       │                                      │    token={plaintext_token}   │
       │                                      │                              │
       │◄─────────────────────────────────────┤ 6. 200 OK                    │
       │   { message: "Check your email" }    │    (no token in response)    │
       │                                      │                              │
       │ 7. User clicks email link            │                              │
       │    GET /auth/verify?token=abc123...  │                              │
       ├────────────────────────────────────►│                              │
       │                                      │                              │
       │                                      │ 8. Lookup token              │
       │                                      ├─────────────────────────────►│
       │                                      │  SELECT * FROM magic_links   │
       │                                      │  WHERE expiry > NOW()        │
       │                                      │◄─────────────────────────────┤
       │                                      │  { email, token_hash }       │
       │                                      │                              │
       │                                      │ 9. Verify token (bcrypt)     │
       │                                      │    bcrypt.checkpw(token,     │
       │                                      │      token_hash)             │
       │                                      │                              │
       │                                      │ 10. Delete token (single-use)│
       │                                      ├─────────────────────────────►│
       │                                      │  DELETE FROM magic_links     │
       │                                      │  WHERE email = ?             │
       │                                      │◄─────────────────────────────┤
       │                                      │                              │
       │                                      │ 11. Generate JWT session     │
       │                                      │     payload = {              │
       │                                      │       user_id, email, exp    │
       │                                      │     }                         │
       │                                      │     jwt = HS256(payload,     │
       │                                      │       JWT_SECRET)            │
       │                                      │                              │
       │◄─────────────────────────────────────┤ 12. Set session cookie       │
       │   Set-Cookie: session={jwt};         │     + CSRF token             │
       │     HttpOnly; Secure; SameSite=Lax   │                              │
       │   Set-Cookie: csrf_token={random128};│                              │
       │     Secure; SameSite=Lax             │                              │
       │   302 Redirect: /dashboard           │                              │

───────────────────────────────────────────────────────────────────────────────

                         GOOGLE OAUTH FLOW (WITH CSRF)

  ┌─────────┐              ┌─────────┐                ┌──────────┐     ┌──────┐
  │ Browser │              │VSG API  │                │  Google  │     │  DB  │
  └────┬────┘              └────┬────┘                └────┬─────┘     └──┬───┘
       │                        │                          │              │
       │ 1. Click "Google"      │                          │              │
       ├──────────────────────►│                          │              │
       │                        │                          │              │
       │                        │ 2. Generate state (CSRF) │              │
       │                        │    state = secrets.      │              │
       │                        │      token_urlsafe(16)   │              │
       │                        ├─────────────────────────────────────────►│
       │                        │  INSERT INTO oauth_states│              │
       │                        │  (state, expiry)         │              │
       │                        │◄─────────────────────────────────────────┤
       │                        │                          │              │
       │◄───────────────────────┤ 3. Redirect to Google    │              │
       │   302 Location:        │    OAuth with state      │              │
       │   accounts.google.com/o│                          │              │
       │   /oauth2/auth?        │                          │              │
       │   state={state}&       │                          │              │
       │   scope=email+profile  │                          │              │
       │                        │                          │              │
       │ 4. User approves       │                          │              │
       ├──────────────────────────────────────────────────►│              │
       │                        │                          │              │
       │◄──────────────────────────────────────────────────┤ 5. Redirect  │
       │   302 Location:        │                          │    with code │
       │   /auth/google/callback│                          │    + state   │
       │   ?code=xyz&state=abc  │                          │              │
       │                        │                          │              │
       │ 6. GET /auth/google/   │                          │              │
       │    callback?code=xyz&  │                          │              │
       │    state=abc           │                          │              │
       ├──────────────────────►│                          │              │
       │                        │                          │              │
       │                        │ 7. Validate state (CSRF) │              │
       │                        ├─────────────────────────────────────────►│
       │                        │  SELECT FROM oauth_states│              │
       │                        │  WHERE state=? AND       │              │
       │                        │    expiry > NOW()        │              │
       │                        │◄─────────────────────────────────────────┤
       │                        │  (valid)                 │              │
       │                        ├─────────────────────────────────────────►│
       │                        │  DELETE FROM oauth_states│              │
       │                        │  WHERE state=?           │              │
       │                        │◄─────────────────────────────────────────┤
       │                        │                          │              │
       │                        │ 8. Exchange code for     │              │
       │                        │    access token          │              │
       │                        ├─────────────────────────►│              │
       │                        │  POST /token             │              │
       │                        │  { code, client_secret } │              │
       │                        │◄─────────────────────────┤              │
       │                        │  { access_token }        │              │
       │                        │                          │              │
       │                        │ 9. Get user info         │              │
       │                        ├─────────────────────────►│              │
       │                        │  GET /userinfo           │              │
       │                        │  Authorization: Bearer   │              │
       │                        │◄─────────────────────────┤              │
       │                        │  { email, name }         │              │
       │                        │                          │              │
       │                        │ 10. Create/update user   │              │
       │                        ├─────────────────────────────────────────►│
       │                        │  UPSERT INTO users       │              │
       │                        │◄─────────────────────────────────────────┤
       │                        │                          │              │
       │                        │ 11. Generate JWT         │              │
       │                        │     (same as magic link) │              │
       │                        │                          │              │
       │◄───────────────────────┤ 12. Set cookies          │              │
       │   Set-Cookie: session  │     + redirect           │              │
       │   302 Redirect:        │                          │              │
       │   /dashboard           │                          │              │

┌──────────────────────────────────────────────────────────────────────────────┐
│ SECURITY CONTROLS:                                                            │
│ • Magic Link: 256-bit token, bcrypt hash, 15-min expiry, single-use          │
│ • OAuth: State parameter (CSRF), scope minimal (email+profile only)          │
│ • JWT: HS256 signature, 24-hour expiry, HttpOnly cookie                      │
│ • CSRF: Double-submit pattern (cookie + header validation)                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### D.2 Pseudonymization Flow Diagram

**Scenario:** Server-side HMAC-SHA256 pseudonymization of social network identifiers. Pseudonymization keys are NEVER exposed to the client to prevent rainbow table attacks.

> **⚠️ IMPLEMENTATION NOTE:**
> The diagram below shows the data flow for pseudonymization. **All pseudonymization is performed server-side only**. The legacy "client-side mode" section shown below is **deprecated** and must not be implemented. Only the "SERVER-SIDE MODE" should be used in production.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│               PSEUDONYMIZATION FLOW (HMAC-SHA256 WITH PER-USER KEY)           │
└──────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                    ❌ DEPRECATED: CLIENT-SIDE MODE (DO NOT USE)
═══════════════════════════════════════════════════════════════════════════════

  ┌─────────────┐                     ┌────────────┐                ┌──────────┐
  │   Browser   │                     │  VSG API   │                │   DB     │
  │(Client-Side)│                     │  Server    │                │(Postgres)│
  └──────┬──────┘                     └─────┬──────┘                └────┬─────┘
         │                                  │                            │
         │ 1. User uploads CSV/JSON         │                            │
         │    Raw identifiers:              │                            │
         │    [@alice, @bob, @charlie]      │                            │
         │                                  │                            │
         │ 2. Request pseudonymization key  │                            │
         │    POST /api/account/pseudo-key  │                            │
         ├─────────────────────────────────►│                            │
         │                                  │                            │
         │                                  │ 3. Generate key (once)     │
         │                                  │    IF user has no key:     │
         │                                  │      key = secrets.        │
         │                                  │        token_bytes(32)     │
         │                                  │        (256-bit random)    │
         │                                  ├───────────────────────────►│
         │                                  │  INSERT INTO user_         │
         │                                  │    pseudonymization_keys   │
         │                                  │  (user_id, key_encrypted)  │
         │                                  │  VALUES (?, AES_ENCRYPT    │
         │                                  │    (key, KMS_KEY))         │
         │                                  │◄───────────────────────────┤
         │                                  │                            │
         │◄─────────────────────────────────┤ 4. Return key (one-time)   │
         │   { key: "base64_encoded_key" }  │                            │
         │                                  │                            │
         │ 5. Pseudonymize locally (JS)     │                            │
         │    for id in identifiers:        │                            │
         │      hmac = HMAC-SHA256(key, id) │                            │
         │      pseudo_id = hmac.hex()      │                            │
         │                                  │                            │
         │    Result:                       │                            │
         │    [@alice  → a3f52b...]         │                            │
         │    [@bob    → 7d91ec...]         │                            │
         │    [@charlie→ 2c4e9a...]         │                            │
         │                                  │                            │
         │ 6. Upload pseudonymized graph    │                            │
         │    POST /api/graphs              │                            │
         │    {                             │                            │
         │      nodes: [                    │                            │
         │        {id: "a3f52b...", ...},   │                            │
         │        {id: "7d91ec...", ...}    │                            │
         │      ],                          │                            │
         │      edges: [...]                │                            │
         │    }                             │                            │
         ├─────────────────────────────────►│                            │
         │                                  │                            │
         │                                  │ 7. Store graph (already    │
         │                                  │    pseudonymized)          │
         │                                  ├───────────────────────────►│
         │                                  │  INSERT INTO graphs        │
         │                                  │  (user_id, data)           │
         │                                  │  VALUES (?, ?)             │
         │                                  │◄───────────────────────────┤
         │                                  │                            │
         │◄─────────────────────────────────┤ 8. 201 Created             │
         │   { graph_id: "graph_01H..." }   │                            │
         │                                  │                            │
         │ 9. Clear key from memory         │                            │
         │    (key never persisted)         │                            │

═══════════════════════════════════════════════════════════════════════════════
                        ✅ SERVER-SIDE MODE (PRODUCTION STANDARD)
═══════════════════════════════════════════════════════════════════════════════

  ┌─────────────┐                     ┌────────────┐                ┌──────────┐
  │   Browser   │                     │  VSG API   │                │   DB     │
  └──────┬──────┘                     └─────┬──────┘                └────┬─────┘
         │                                  │                            │
         │ 1. User uploads large CSV        │                            │
         │    POST /api/uploads (Tus)       │                            │
         │    Raw identifiers (50k nodes)   │                            │
         ├─────────────────────────────────►│                            │
         │                                  │                            │
         │                                  │ 2. Store raw file (temp)   │
         │                                  │    S3 bucket (encrypted)   │
         │                                  │                            │
         │◄─────────────────────────────────┤ 3. 202 Accepted            │
         │   { upload_id: "upload_01H..." } │    (async processing)      │
         │                                  │                            │
         │                                  │ 4. Background job starts   │
         │                                  │                            │
         │                                  │ 5. Retrieve user key       │
         │                                  ├───────────────────────────►│
         │                                  │  SELECT key_encrypted      │
         │                                  │  FROM user_pseudo_keys     │
         │                                  │  WHERE user_id = ?         │
         │                                  │◄───────────────────────────┤
         │                                  │  { key_encrypted }         │
         │                                  │                            │
         │                                  │ 6. Decrypt key (KMS)       │
         │                                  │    key = AES_DECRYPT       │
         │                                  │      (key_encrypted,       │
         │                                  │       KMS_KEY)             │
         │                                  │                            │
         │                                  │ 7. Pseudonymize (server)   │
         │                                  │    for id in identifiers:  │
         │                                  │      hmac = HMAC-SHA256    │
         │                                  │        (key, id)           │
         │                                  │      pseudo_id = hmac.hex()│
         │                                  │                            │
         │                                  │ 8. Store pseudonymized     │
         │                                  ├───────────────────────────►│
         │                                  │  INSERT INTO graphs        │
         │                                  │  (user_id, data)           │
         │                                  │◄───────────────────────────┤
         │                                  │                            │
         │                                  │ 9. Delete raw file (S3)    │
         │                                  │    (original data purged)  │
         │                                  │                            │
         │ 10. Webhook notification         │                            │
         │◄─────────────────────────────────┤ POST /webhooks/processing  │
         │   { status: "completed",         │                            │
         │     graph_id: "graph_01H..." }   │                            │

┌──────────────────────────────────────────────────────────────────────────────┐
│ SECURITY CONTROLS:                                                            │
│ • Key Generation: 256-bit random (secrets.token_bytes(32))                   │
│ • Key Storage: AES-256-GCM encrypted with KMS (database encrypted at rest)   │
│ • Key Transmission: HTTPS only, one-time retrieval (client-side mode)        │
│ • Pseudonymization: HMAC-SHA256 (rainbow table resistant)                    │
│ • Deterministic: Same identifier → same hash (within user's graph)           │
│ • Key Deletion: Cascade delete on account deletion (historical unlinking)    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### D.3 GDPR Deletion Flow Diagram

**Scenario:** Soft delete (30-day grace) vs. hard delete (immediate + backup purge) for GDPR compliance.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      GDPR DELETION FLOW (DUAL-MODE)                          │
└──────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                         SOFT DELETE (30-DAY GRACE PERIOD)
═══════════════════════════════════════════════════════════════════════════════

  ┌─────────┐                    ┌────────────┐                     ┌──────────┐
  │ Browser │                    │  VSG API   │                     │   DB     │
  └────┬────┘                    └─────┬──────┘                     └────┬─────┘
       │                              │                                  │
       │ 1. DELETE /api/account       │                                  │
       │    (no mode param = soft)    │                                  │
       ├─────────────────────────────►│                                  │
       │                              │                                  │
       │                              │ 2. Mark user as deleted          │
       │                              ├─────────────────────────────────►│
       │                              │  UPDATE users                    │
       │                              │  SET deleted_at = NOW(),         │
       │                              │      deletion_scheduled =        │
       │                              │        NOW() + INTERVAL '30 days'│
       │                              │  WHERE id = ?                    │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │                              │ 3. Revoke sessions (immediate)   │
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM sessions            │
       │                              │  WHERE user_id = ?               │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │                              │ 4. Send confirmation email       │
       │                              │    "Account will be deleted in   │
       │                              │     30 days. To cancel, log in." │
       │                              │                                  │
       │◄─────────────────────────────┤ 5. 200 OK                        │
       │   { message: "Account        │                                  │
       │     scheduled for deletion", │                                  │
       │     cancel_before: "2026-01" }│                                  │
       │                              │                                  │
       │                              │                                  │
       │  [30 DAYS LATER - AUTOMATED CRON JOB]                          │
       │                              │                                  │
       │                              │ 6. Background job runs daily     │
       │                              │    SELECT FROM users             │
       │                              ├─────────────────────────────────►│
       │                              │    WHERE deletion_scheduled      │
       │                              │      < NOW()                     │
       │                              │◄─────────────────────────────────┤
       │                              │  [user_id: 123]                  │
       │                              │                                  │
       │                              │ 7. Hard delete user data         │
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM graphs              │
       │                              │  WHERE user_id = 123             │
       │                              │◄─────────────────────────────────┤
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM user_pseudo_keys    │
       │                              │  WHERE user_id = 123             │
       │                              │  (CASCADE: unlinking historical) │
       │                              │◄─────────────────────────────────┤
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM users               │
       │                              │  WHERE id = 123                  │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │                              │ 8. Audit log (GDPR compliance)   │
       │                              ├─────────────────────────────────►│
       │                              │  INSERT INTO security_audit_log  │
       │                              │  (event: "gdpr.deletion.complete"│
       │                              │   user_id_hash: sha256(123))     │
       │                              │◄─────────────────────────────────┤

═══════════════════════════════════════════════════════════════════════════════
                  HARD DELETE (IMMEDIATE + 90-DAY BACKUP PURGE)
═══════════════════════════════════════════════════════════════════════════════

  ┌─────────┐                    ┌────────────┐                     ┌──────────┐
  │ Browser │                    │  VSG API   │                     │   DB     │
  └────┬────┘                    └─────┬──────┘                     └────┬─────┘
       │                              │                                  │
       │ 1. DELETE /api/account       │                                  │
       │    ?mode=immediate           │                                  │
       ├─────────────────────────────►│                                  │
       │                              │                                  │
       │                              │ 2. Immediate deletion (no grace) │
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM graphs              │
       │                              │  WHERE user_id = ?               │
       │                              │◄─────────────────────────────────┤
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM user_pseudo_keys    │
       │                              │  WHERE user_id = ?               │
       │                              │◄─────────────────────────────────┤
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM sessions            │
       │                              │  WHERE user_id = ?               │
       │                              │◄─────────────────────────────────┤
       │                              ├─────────────────────────────────►│
       │                              │  DELETE FROM users               │
       │                              │  WHERE id = ?                    │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │                              │ 3. Mark for backup purge         │
       │                              ├─────────────────────────────────►│
       │                              │  INSERT INTO backup_purge_queue  │
       │                              │  (user_id, deletion_timestamp)   │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │                              │ 4. Audit log (GDPR Art. 17)      │
       │                              ├─────────────────────────────────►│
       │                              │  INSERT INTO security_audit_log  │
       │                              │  (event: "gdpr.deletion.         │
       │                              │    immediate", reason: ...)      │
       │                              │◄─────────────────────────────────┤
       │                              │                                  │
       │◄─────────────────────────────┤ 5. 200 OK                        │
       │   { message: "Account        │                                  │
       │     deleted immediately",    │                                  │
       │     backup_purge: "90 days" }│                                  │
       │                              │                                  │
       │                              │                                  │
       │  [90 DAYS LATER - BACKUP PURGE JOB]                            │
       │                              │                                  │
       │                              │ 6. Background job purges backups │
       │                              │    FOR user_id IN purge_queue:   │
       │                              │      Overwrite RDS snapshots     │
       │                              │      Overwrite S3 export files   │
       │                              │    (Physical destruction)        │

┌──────────────────────────────────────────────────────────────────────────────┐
│ SECURITY & COMPLIANCE CONTROLS:                                              │
│ • Soft Delete: 30-day grace, sessions revoked immediately                    │
│ • Hard Delete: Immediate + 90-day backup purge (GDPR Art. 17 compliant)     │
│ • Cascade Deletion: Pseudonymization keys deleted → historical unlinking     │
│ • Audit Trail: All deletions logged (90-day retention) for GDPR evidence     │
│ • Backup Purge: Automated physical destruction of backups after 90 days      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### D.4 Webhook Security Flow Diagram

**Scenario:** Stripe webhook HMAC-SHA256 signature verification with replay protection.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              STRIPE WEBHOOK SECURITY FLOW (HMAC VERIFICATION)                │
└──────────────────────────────────────────────────────────────────────────────┘

  ┌─────────┐                 ┌──────────────┐                   ┌──────────┐
  │ Stripe  │                 │   VSG API    │                   │   DB     │
  │ Server  │                 │   Webhook    │                   │(Postgres)│
  └────┬────┘                 │   Handler    │                   └────┬─────┘
       │                      └──────┬───────┘                        │
       │                             │                                │
       │ 1. Event triggered          │                                │
       │    (e.g., payment_succeeded)│                                │
       │                             │                                │
       │ 2. Generate timestamp       │                                │
       │    t = current_unix_time    │                                │
       │                             │                                │
       │ 3. Compute HMAC signature   │                                │
       │    signed_payload =         │                                │
       │      "{t}.{event_json}"     │                                │
       │    signature = HMAC-SHA256  │                                │
       │      (WEBHOOK_SECRET,       │                                │
       │       signed_payload)       │                                │
       │                             │                                │
       │ 4. POST /api/webhooks/stripe│                                │
       │    Headers:                 │                                │
       │      Stripe-Signature:      │                                │
       │        t={t},v1={signature} │                                │
       │    Body: {event_json}       │                                │
       ├────────────────────────────►│                                │
       │                             │                                │
       │                             │ 5. Extract signature components│
       │                             │    Parse header:               │
       │                             │      t = timestamp             │
       │                             │      v1 = signature            │
       │                             │                                │
       │                             │ 6. Timestamp validation        │
       │                             │    current_time = time.time()  │
       │                             │    IF abs(current_time - t)    │
       │                             │       > 300 seconds:           │
       │                             │      abort(400, "Timestamp     │
       │                             │        too old - replay")      │
       │                             │                                │
       │                             │ 7. Compute expected signature  │
       │                             │    signed_payload =            │
       │                             │      "{t}.{request.body}"      │
       │                             │    expected_sig = HMAC-SHA256  │
       │                             │      (WEBHOOK_SECRET,          │
       │                             │       signed_payload)          │
       │                             │                                │
       │                             │ 8. Constant-time comparison    │
       │                             │    IF NOT hmac.compare_digest  │
       │                             │      (v1, expected_sig):       │
       │                             │      ┌──────────────────────┐  │
       │                             │      │ SECURITY ALERT!      │  │
       │                             │      │ Webhook spoofing     │  │
       │                             │      │ detected!            │  │
       │                             │      └──────────────────────┘  │
       │                             ├───────────────────────────────►│
       │                             │  INSERT INTO security_audit_log│
       │                             │  (event: "webhook.signature.   │
       │                             │    invalid", ip_address, ...)  │
       │                             │◄───────────────────────────────┤
       │                             │                                │
       │                             │  Trigger incident response     │
       │                             │  (Section 12.1 - P1 severity)  │
       │                             │                                │
       │◄────────────────────────────┤ 9. 401 Unauthorized            │
       │   { error: "WEBHOOK_        │    (attack blocked)            │
       │     SIGNATURE_INVALID" }    │                                │
       │                             │                                │
       │           [IF SIGNATURE VALID - NORMAL FLOW]                │
       │                             │                                │
       │                             │ 10. Check idempotency key      │
       │                             ├───────────────────────────────►│
       │                             │  SELECT FROM webhook_events    │
       │                             │  WHERE idempotency_key = ?     │
       │                             │◄───────────────────────────────┤
       │                             │  (empty - first time)          │
       │                             │                                │
       │                             │ 11. Process event              │
       │                             │     IF event.type =            │
       │                             │       "payment_succeeded":     │
       │                             ├───────────────────────────────►│
       │                             │  UPDATE users                  │
       │                             │  SET tier = 'pro'              │
       │                             │  WHERE stripe_customer_id = ?  │
       │                             │◄───────────────────────────────┤
       │                             │                                │
       │                             │ 12. Store idempotency key      │
       │                             ├───────────────────────────────►│
       │                             │  INSERT INTO webhook_events    │
       │                             │  (idempotency_key, event_type, │
       │                             │   processed_at)                │
       │                             │◄───────────────────────────────┤
       │                             │                                │
       │◄────────────────────────────┤ 13. 200 OK                     │
       │   { received: true }        │     (success)                  │
       │                             │                                │
       │                             │ 14. Audit log                  │
       │                             ├───────────────────────────────►│
       │                             │  INSERT INTO security_audit_log│
       │                             │  (event: "webhook.stripe.      │
       │                             │    processed", event_type, ...) │
       │                             │◄───────────────────────────────┤

┌──────────────────────────────────────────────────────────────────────────────┐
│ SECURITY CONTROLS:                                                            │
│ • Signature Verification: HMAC-SHA256 with shared webhook secret             │
│ • Timestamp Validation: 5-minute tolerance window (prevents replay attacks)  │
│ • Constant-Time Comparison: hmac.compare_digest() prevents timing attacks    │
│ • Idempotency: Event IDs deduplicate retries                                 │
│ • Incident Response: WEBHOOK_SIGNATURE_INVALID triggers P1 IR (Section 12.1) │
│ • Audit Logging: All webhook attempts logged (90-day retention)              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### [Appendix E: Third-Party Service Providers](#appendix-e-third-party-service-providers)

---

## Appendix E: Third-Party Service Providers

This appendix catalogs all third-party service providers used by Visual Social Graph with security and privacy considerations. All processors are documented per GDPR Article 30 (Records of Processing Activities).

### E.1 Data Processor Inventory

| Service Provider | Service Type | Data Processed | Data Location | Compliance | DPA Status |
|------------------|--------------|----------------|---------------|------------|------------|
| **Stripe** | Payment Processing | Email, payment metadata (no card numbers stored by VSG) | US (PCI DSS certified data centers) | PCI DSS Level 1, GDPR, SOC 2 Type II | ✅ Signed |
| **Google (OAuth)** | Authentication | Email, name, profile picture URL | Global (Google Cloud regions) | GDPR, ISO 27001, SOC 2 | ✅ Standard Terms |
| **Sentry** | Error Monitoring | Error logs (PII scrubbed), IP prefix (last octet masked), user ID (pseudonymized) | US / EU (configurable) | GDPR, SOC 2 Type II | ✅ Signed |
| **Cloudflare** | CDN / WAF / DDoS Protection | IP addresses (temporary logs), HTTP headers | Global Edge Network | GDPR, ISO 27001, SOC 2 | ✅ Signed |
| **AWS** | Cloud Infrastructure | All application data (encrypted at rest) | US-East-1 (primary), US-West-2 (backup) | GDPR, ISO 27001, SOC 2, FedRAMP | ✅ AWS Customer Agreement |
| **Resend** | Transactional Email | Email addresses, magic link tokens (transient) | US | GDPR, ISO 27001, SOC 2 | ✅ Signed |

### E.2 Stripe (Payment Processing)

**Service Description:** Payment gateway for subscription billing (Free → Pro → Creator tiers).

**Data Shared with Stripe:**
- User email address (for Stripe Customer object)
- Subscription tier (Free/Pro/Creator)
- Payment method (stored in Stripe Vault, not in VSG database)

**Data NOT Shared with Stripe:**
- Graph data (social network graphs)
- Pseudonymization keys
- User identifiers beyond email

**Security Controls:**
- **API Key Security:** `STRIPE_SECRET_KEY` stored in AWS Secrets Manager, rotated every 90 days (Section 10.2)
- **Webhook Verification:** HMAC-SHA256 signature verification on all webhooks (Section 10.1)
- **PCI DSS Compliance:** VSG does NOT store payment card numbers (Stripe handles all PCI-scoped data)
- **Idempotency:** All Stripe API requests include `Idempotency-Key` header to prevent duplicate charges

**Data Retention:**
- Stripe Customer ID stored in VSG database indefinitely (until account deletion)
- Stripe retains payment history per their retention policy (7 years for tax compliance)
- On VSG account deletion: `stripe_customer_id` deleted, but Stripe data retention per Stripe policy

**Compliance:**
- PCI DSS Level 1 (highest certification)
- GDPR Data Processing Addendum (DPA) signed
- SOC 2 Type II certified

**Contact:** https://support.stripe.com

---

### E.3 Google OAuth (Authentication)

**Service Description:** OAuth 2.0 provider for "Sign in with Google" authentication.

**Data Shared with Google:**
- OAuth authorization requests (user initiates sign-in)
- Redirect URI (`https://visualsocialgraph.com/auth/google/callback`)

**Data Received from Google:**
- Email address (verified)
- Name
- Profile picture URL

**Scopes Requested:** `email`, `profile` only (no access to Drive, Calendar, Contacts, etc.)

**Security Controls:**
- **CSRF Protection:** State parameter (128-bit random token) prevents CSRF attacks (Section 3.1.2)
- **Minimal Scopes:** Only `email` and `profile` requested (Constitutional Constraint C1 - no account access)
- **Token Storage:** Google access tokens NOT stored by VSG (only used for initial user info fetch)
- **API Key Security:** `GOOGLE_OAUTH_CLIENT_SECRET` in AWS Secrets Manager

**Data Retention:**
- Email, name, profile picture URL stored in VSG database until account deletion
- Google retains OAuth logs per their retention policy (independent of VSG)

**Compliance:**
- GDPR compliant (Google Cloud Platform DPA)
- ISO 27001, SOC 2 Type II certified

**Contact:** https://support.google.com/cloud

---

### E.4 Sentry (Error Monitoring)

**Service Description:** Real-time error tracking and performance monitoring.

**Data Sent to Sentry:**
- **Error Stack Traces:** Full stack traces (PII scrubbed via `before_send` hook - Section 9.5)
- **User Context:** User ID (ULID), email HASH (SHA-256), IP address PREFIX (last octet masked: `203.0.113.xxx`)
- **Request Context:** HTTP method, URL path, headers (Authorization/Cookie headers REDACTED)
- **Performance Data:** API endpoint latency (p50, p95, p99)

**Data NOT Sent to Sentry:**
- **Raw Email Addresses:** Always hashed (SHA-256) before transmission
- **Session Tokens:** JWT tokens filtered from logs
- **Pseudonymization Keys:** Never logged
- **Graph Data:** User-uploaded graphs not included in error context

**Security Controls:**
- **PII Scrubbing:** `before_send` hook scrubs PII (Section 9.5 implementation)
- **send_default_pii: False:** Disables automatic PII collection
- **IP Masking:** Last octet replaced with `xxx` (e.g., `203.0.113.xxx`)
- **Sampling:** 10% sample rate for performance monitoring (reduce data volume)

**Data Retention:**
- **Free Tier:** 30 days (VSG uses paid tier)
- **Paid Tier:** 90 days (matches VSG audit log retention policy)
- **Manual Deletion:** Events can be manually purged via Sentry API

**Compliance:**
- GDPR compliant (DPA signed)
- SOC 2 Type II certified
- Data residency: US or EU (VSG uses US region)

**Contact:** https://sentry.io/support

---

### E.5 Cloudflare (CDN / WAF / DDoS Protection)

**Service Description:** Content Delivery Network, Web Application Firewall, and DDoS mitigation.

**Data Processed by Cloudflare:**
- **IP Addresses:** Client IP addresses (logged for 72 hours)
- **HTTP Requests:** URL paths, headers, user-agent strings
- **CDN Cache:** Static assets (JS, CSS, images) cached at edge locations
- **WAF Logs:** Blocked requests (SQL injection, XSS attempts) logged for security analysis

**Data NOT Processed by Cloudflare:**
- **API Payloads:** POST/PUT request bodies NOT logged by Cloudflare
- **Database Queries:** No visibility into backend database operations
- **Pseudonymization Keys:** Keys never transmitted through Cloudflare (server-side only)

**Security Controls:**
- **TLS 1.3 Enforcement:** Full (strict) SSL/TLS mode between Cloudflare and origin
- **HSTS Preload:** Strict-Transport-Security header enforced
- **WAF Rules:** OWASP ModSecurity Core Rule Set enabled
- **DDoS Protection:** Automatic mitigation for L3/L4/L7 attacks
- **Rate Limiting:** Cloudflare rate limiting supplements application-layer rate limiting (Section 8)

**Data Retention:**
- **HTTP Logs:** 72 hours
- **WAF Logs:** 30 days (Enterprise plan)
- **Analytics:** Aggregated metrics retained for 6 months

**Compliance:**
- GDPR compliant (DPA signed)
- ISO 27001, SOC 2 Type II certified

**Contact:** https://support.cloudflare.com

---

### E.6 AWS (Amazon Web Services)

**Service Description:** Cloud infrastructure provider (compute, storage, database).

**Services Used:**
- **RDS (PostgreSQL):** Primary database (encrypted at rest with KMS)
- **S3:** File storage for graph exports (encrypted with AES-256)
- **Secrets Manager:** Secret storage for JWT keys, API keys, database credentials
- **CloudFront:** CDN for static assets (alternative to Cloudflare)
- **Route 53:** DNS hosting
- **EC2 / ECS / Lambda:** Application servers (depending on deployment architecture)

**Data Stored in AWS:**
- **All Application Data:** User accounts, graphs, pseudonymization keys (encrypted at rest)
- **Backups:** RDS automated backups (7-day retention), manual snapshots (90-day retention)
- **Logs:** Application logs, database query logs (pgAudit)

**Security Controls:**
- **Encryption at Rest:** All RDS volumes encrypted with AWS KMS (AES-256-GCM)
- **Encryption in Transit:** TLS 1.3 for all client connections
- **VPC Isolation:** Database in private subnet (no internet access)
- **IAM Least Privilege:** Application uses service account (not root credentials)
- **MFA Enforced:** AWS console access requires multi-factor authentication
- **CloudTrail:** All API calls logged for audit trail

**Data Retention:**
- **Database Backups:** 7-day automated backups (RDS), 90-day manual snapshots
- **S3 Objects:** Lifecycle policies purge old exports after 90 days
- **CloudTrail Logs:** 90 days (matches audit log retention)

**Compliance:**
- GDPR compliant (AWS GDPR Data Processing Addendum)
- ISO 27001, SOC 2 Type II, FedRAMP certified
- Data residency: US-East-1 (primary), US-West-2 (backup)

**Contact:** AWS Support (Enterprise plan)

---

### E.7 Resend (Transactional Email)

**Service Description:** Email delivery service for magic link authentication emails.

**Data Sent to Resend:**
- **Recipient Email Address:** User's email for magic link delivery
- **Email Content:** Magic link URL (token included in plaintext - transmitted over TLS)
- **Sender Domain:** `no-reply@visualsocialgraph.com`

**Data NOT Sent to Resend:**
- **Hashed Tokens:** Magic link tokens sent in plaintext (bcrypt hash stored server-side only)
- **Graph Data:** No user graph data included in emails
- **Pseudonymization Keys:** Never transmitted via email

**Security Controls:**
- **TLS Transmission:** Emails sent via TLS (STARTTLS)
- **SPF/DKIM/DMARC:** Email authentication to prevent spoofing
- **Rate Limiting:** Resend rate limits prevent abuse (5 magic links/hour per IP - Section 8.2)
- **API Key Security:** `RESEND_API_KEY` in AWS Secrets Manager, rotated every 90 days

**Data Retention:**
- **Email Logs:** Resend retains delivery logs for 30 days
- **Bounce/Complaint Data:** Retained for 90 days
- **Email Content:** Not retained by Resend after delivery

**Compliance:**
- GDPR compliant (DPA signed)
- ISO 27001, SOC 2 Type II certified

**Contact:** https://resend.com/support

---

### E.8 Third-Party Risk Assessment

**Vendor Selection Criteria:**

| Criterion | Requirement | All Vendors Meet? |
|-----------|-------------|-------------------|
| **GDPR Compliance** | DPA signed, EU-US Data Privacy Framework | ✅ Yes |
| **SOC 2 Type II** | Annual audit report available | ✅ Yes |
| **Encryption at Rest** | AES-256 or equivalent | ✅ Yes |
| **Encryption in Transit** | TLS 1.2+ (prefer TLS 1.3) | ✅ Yes |
| **Data Residency** | US or EU regions only | ✅ Yes |
| **Incident Notification** | <72 hours breach notification | ✅ Yes |
| **Right to Audit** | VSG can request security audits | ✅ Yes (contractual) |

**Annual Vendor Review:**
- **Frequency:** Annual review (Q1 each year)
- **Triggers:** Compliance certification expiry, security incidents, service degradation
- **Process:** Security team reviews SOC 2 reports, incident logs, SLA compliance
- **Documentation:** Vendor assessment matrix updated in Confluence

**Vendor Offboarding:**
- **Data Deletion:** Request data deletion within 30 days of service termination
- **Credential Revocation:** Rotate all shared secrets immediately
- **Audit:** Verify data deletion via vendor attestation

---

### [Appendix F: Glossary](#appendix-f-glossary)

---

## Appendix F: Glossary

**AES-256-GCM**
Advanced Encryption Standard with 256-bit key and Galois/Counter Mode. Authenticated encryption algorithm used for data encryption at rest. Provides both confidentiality and integrity.

**API (Application Programming Interface)**
Software interface allowing applications to communicate. VSG provides REST APIs for Creator tier users to programmatically access their graph data.

**bcrypt**
Password hashing function with built-in salt and configurable work factor (cost). Used for hashing magic link tokens before database storage (Section 3.1.1).

**CORS (Cross-Origin Resource Sharing)**
Browser security feature that restricts web pages from making requests to a different domain. VSG CORS policy allows only `https://visualsocialgraph.com` (Section 11.4).

**CREST (Council of Registered Ethical Security Testers)**
International accreditation body for penetration testing companies. VSG requires CREST-certified vendors for annual pen tests (Section 12.4).

**CSRF (Cross-Site Request Forgery)**
Attack forcing users to execute unwanted actions on authenticated sites. Prevented via double-submit cookie pattern with 128-bit tokens (Section 3.2.2).

**CSP (Content Security Policy)**
HTTP header specifying trusted sources for scripts, styles, and other resources. VSG uses nonce-based CSP to prevent XSS attacks (Section 11.1).

**DPA (Data Processing Addendum)**
GDPR-required contract between data controller (VSG) and data processor (third-party vendors) defining data processing terms. All VSG vendors have signed DPAs (Appendix E).

**DPO (Data Protection Officer)**
GDPR-required role responsible for monitoring compliance with data protection regulations. VSG DPO contact: dpo@visualsocialgraph.com (Section 6.8).

**GDPR (General Data Protection Regulation)**
EU regulation governing data privacy and protection. VSG is 91% compliant (10/11 requirements met - Section 14.1).

**HMAC-SHA256 (Hash-based Message Authentication Code with SHA-256)**
Cryptographic hash function using secret key. VSG uses per-user HMAC-SHA256 keys for pseudonymization, preventing rainbow table attacks (Section 4.2).

**HSTS (HTTP Strict Transport Security)**
HTTP header forcing browsers to use HTTPS only. VSG enables HSTS with 1-year max-age and preload (Section 5.1).

**HttpOnly Cookie**
Cookie flag preventing JavaScript access. VSG session cookies use `HttpOnly` to prevent XSS-based session theft (Section 3.2.1).

**IDOR (Insecure Direct Object Reference)**
Vulnerability where attackers access resources by guessing IDs. Prevented via ULIDs (non-sequential), ownership validation, and row-level security (Section 3.4.3).

**Idempotency Key**
Unique identifier ensuring duplicate API requests don't cause unintended side effects. Used for Stripe payments and webhook processing (Section 10.1.3).

**JWT (JSON Web Token)**
Compact token format for securely transmitting information between parties. VSG uses HS256-signed JWTs for session management with 24-hour expiry (Section 3.2.1).

**KMS (Key Management Service)**
Cloud service for managing cryptographic keys. VSG uses AWS KMS or GCP Cloud KMS to encrypt pseudonymization keys at rest (Section 5.2).

**Magic Link**
Passwordless authentication via email link. VSG generates 256-bit cryptographically secure tokens with 15-minute expiry and single-use enforcement (Section 3.1.1).

**OAuth 2.0**
Industry-standard authorization protocol. VSG uses Google OAuth for "Sign in with Google" with minimal scopes (`email`, `profile` only - Section 3.1.2).

**OCSP (Online Certificate Status Protocol)**
Protocol for checking TLS certificate revocation status. VSG enables OCSP stapling for performance (Section 5.1).

**PCI DSS (Payment Card Industry Data Security Standard)**
Security standard for handling credit card data. VSG does NOT store card numbers (handled by Stripe, PCI DSS Level 1 certified - Appendix E.2).

**pgAudit**
PostgreSQL extension for detailed database audit logging. VSG logs all DDL, DCL, and SELECT queries to pseudonymization key table (Section 9.6).

**PII (Personally Identifiable Information)**
Data that can identify a specific individual (email, IP address, name). VSG hashes PII in audit logs and scrubs from Sentry error reports (Section 9.5).

**Pseudonymization**
GDPR-defined technique replacing identifiers with pseudonyms. VSG pseudonymizes social network usernames via HMAC-SHA256, reducing re-identification risk while maintaining graph structure (Section 4).

**RLS (Row-Level Security)**
PostgreSQL feature enforcing data access policies at row level. VSG uses RLS to ensure users can only access their own graphs and pseudonymization keys (Section 3.4.3, 13.2).

**SAST (Static Application Security Testing)**
Automated code analysis for security vulnerabilities. VSG uses Semgrep with OWASP ruleset in CI/CD pipeline (Section 13.1).

**SameSite Cookie Attribute**
Cookie flag controlling cross-site request behavior. VSG uses `SameSite=Lax` to prevent CSRF attacks while allowing OAuth and Magic Link redirect flows (Section 3.2.1).

**SOC 2 Type II**
Auditing standard for security, availability, and confidentiality controls. VSG targets SOC 2 certification by Q4 2026 (Section 14.2). All third-party vendors are SOC 2 certified (Appendix E).

**SRI (Subresource Integrity)**
Browser security feature verifying CDN resources haven't been tampered with. VSG uses SHA-384 hashes for all CDN scripts/styles (Section 11.2).

**TLS 1.3 (Transport Layer Security 1.3)**
Cryptographic protocol for secure network communication. VSG enforces TLS 1.3 minimum with HSTS (Section 5.1).

**Token Bucket**
Rate limiting algorithm allowing burst traffic within limits. VSG uses Redis-based token bucket for API rate limiting (Section 8.2).

**ULID (Universally Unique Lexicographically Sortable Identifier)**
128-bit identifier alternative to UUID. VSG uses ULIDs for resource IDs (graphs, users, uploads) to prevent IDOR attacks via non-sequential, non-guessable IDs (Section 3.4.3).

**WAF (Web Application Firewall)**
Firewall filtering HTTP traffic to web applications. VSG uses Cloudflare WAF with OWASP ModSecurity Core Rule Set (Section 13.4, Appendix E.5).

**XSS (Cross-Site Scripting)**
Injection attack inserting malicious scripts into web pages. Prevented via React auto-escaping, CSP nonces, and input sanitization (Section 11.7).

---

**END OF APPENDICES**

---

**Document Metadata:**
- **Total Sections:** 15 main sections + 6 appendices
- **Total Pages (estimated):** ~100 pages (7,300+ lines)
- **Version:** 1.0.0
- **Created:** December 27, 2025
- **Owner:** Security Team / CTO
- **Next Review:** March 2026 (quarterly)
- **Last Updated:** December 27, 2025
- **Status:** ✅ Production-Ready

---

