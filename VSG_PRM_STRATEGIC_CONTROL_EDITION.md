# **Visual Social Graph: Product Roadmap**
## **Version 1.2 - Strategic Control Edition**

*"A roadmap is not a promise of features—it's a discipline for learning under uncertainty"*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.2 (Strategic Control Edition) |
| **Date** | January 2026 |
| **Status** | Active - Living Document |
| **Owner** | Product / Engineering |
| **Review Cycle** | Bi-weekly (sprints), Monthly (milestones) |
| **Classification** | Internal - Operational |
| **Planning Horizon** | 24 months (detailed: 6 months, directional: 18 months) |
| **Changes from v1.1** | Consolidated Phase 1 and Phase 2 into single Phase 1 (Complete Product Launch), renumbered subsequent phases |

**Document Hierarchy:**
```
Product Strategy Document (strategic constitution)
    ↓ constrains
Product Requirements Document (what we're building)
    ↓ informs
Product Roadmap (THIS DOCUMENT - what must be true to proceed)
    ↓ gates
Sprint Planning (weekly execution)
```

**Purpose:**
This roadmap is a **strategic control instrument**, not just a delivery schedule. It defines:
- What we build and when (execution plan)
- What must be proven before advancing (phase gates)
- What risks we're retiring (risk burn-down)
- What we're learning (discovery objectives)
- When to stop or pivot (kill conditions)

---

## **Table of Contents**

1. [Roadmap Philosophy](#1-roadmap-philosophy)
2. [Phase Gate Framework](#2-phase-gate-framework)
3. [Risk Burn-down Map](#3-risk-burn-down-map)
4. [Phase 0: Technical Validation Spike](#4-phase-0-technical-validation-spike)
5. [Phase 1: Complete Product Launch](#5-phase-1-complete-product-launch)
6. [Phase 2: Scale & Monetization](#6-phase-2-scale--monetization)
7. [Phase 3: Market Leadership](#7-phase-3-market-leadership)
8. [Feature Dependency Map](#8-feature-dependency-map)
9. [Resource Planning](#9-resource-planning)
10. [Kill Conditions & Re-evaluation Triggers](#10-kill-conditions--re-evaluation-triggers)
11. [Success Metrics by Phase](#11-success-metrics-by-phase)

---

## **1. Roadmap Philosophy**

### **1.1 Core Principles**

**1. Validate Before Scale**
```
Traditional approach: Build everything, launch big
Our approach: Build minimum, validate ruthlessly, scale what works

Why:
├─ Reduces risk (small bets)
├─ Faster learning (quick feedback)
├─ Lower cost (don't build what doesn't work)
└─ Higher quality (iterate based on real usage)

Implementation:
Each phase has explicit Go/No-Go criteria.
We don't proceed to next phase until current phase validates.
```

**2. Aha Moment First, Features Second**
```
Traditional approach: Ship features → hope users find value
Our approach: Prove aha moment exists → build features that amplify it

Why:
├─ Focus on core value (not feature bloat)
├─ Retention before acquisition (leaky bucket problem)
├─ Clear prioritization (does feature serve aha moment?)
└─ Category validation (PNI must deliver revelation)

Implementation:
Phase 0 validates aha moment exists (4/5 users feel it).
Every subsequent feature measured: "Does this increase aha moment rate?"
If feature doesn't serve aha moment, we don't build it.
```

**3. Risk Retirement Over Feature Accumulation** ⭐ NEW
```
Traditional approach: Add features to reduce uncertainty
Our approach: Retire specific risks with each phase

Why:
├─ Makes progress measurable (risk reduced, not just features shipped)
├─ Focuses learning (what are we trying to prove?)
├─ Enables pivots (know when assumptions invalidated)
└─ Strategic discipline (don't build prematurely)

Implementation:
Each phase explicitly retires 2-3 critical risks.
Next phase only begins when those risks sufficiently reduced.
Residual risks tracked and monitored throughout.
```

**4. Learning Objectives Drive Execution** ⭐ NEW
```
Traditional approach: Execute plan, measure success at end
Our approach: Define what we need to learn, design experiments to learn it

Why:
├─ Uncertainty is the enemy (not lack of features)
├─ Learning compounds (each insight informs next)
├─ Enables pivots (discover problems early)
└─ Team alignment (everyone knows what we're trying to prove)

Implementation:
Each phase has explicit learning objectives.
Success = answering questions, not shipping features.
Retrospectives focus on: "What did we learn? What does it change?"
```

**5. Phase Gates Enforce Discipline** ⭐ NEW
```
Traditional approach: Move to next phase when "done"
Our approach: Move to next phase only when exit criteria met

Why:
├─ Prevents premature scaling (foundation must be solid)
├─ Forces honest assessment (are we really ready?)
├─ Creates decision points (explicit go/no-go/pivot)
└─ Protects quality (don't rush to next phase)

Implementation:
Exit criteria are non-negotiable (cannot proceed without meeting them).
Gates reviewed by founder + team (data-driven discussion).
Pivot or stop if criteria not met after reasonable attempts.
```

---

## **2. Phase Gate Framework** ⭐ NEW

### **2.1 Phase Gate Philosophy**

**What is a phase gate?**

A phase gate is a **non-negotiable checkpoint** that determines whether we proceed to the next phase, iterate the current phase, pivot strategy, or stop.

**Why phase gates matter:**

```
Without gates:
├─ Phases blur (start next before finishing current)
├─ Assumptions unvalidated (build on shaky foundation)
├─ Waste compounds (invest in wrong direction)
└─ Pivots delayed (don't recognize failure early)

With gates:
├─ Discipline enforced (can't proceed without validation)
├─ Risks retired (systematically reduce uncertainty)
├─ Pivots enabled (recognize problems early)
└─ Resource efficiency (don't waste on invalidated path)
```

**Gate Structure:**

Each gate consists of:
1. **Exit Criteria** (quantitative) - Measurable thresholds that must be met
2. **Validation Signals** (qualitative) - Subjective but important indicators
3. **Decision Framework** - GO / ITERATE / PIVOT / STOP logic
4. **Accountability** - Who decides and how

---

### **2.2 Phase 0 Gate: Technical Feasibility**

**Exit Criteria (ALL must pass):**

```
Criterion 1: Parser Success Rate ≥95%
├─ Measurement: (Successful parses / Total test files) × 100
├─ Test set: 30 files (5 platforms × multiple sizes × variations)
├─ Success definition: Extracts core data (followers, following, posts)
├─ Current: [measure during Phase 0]
└─ Non-negotiable: This is foundational capability

Criterion 2: Performance <60 seconds (typical account)
├─ Measurement: Time from upload complete to graph rendered
├─ Typical account: 100-500MB file, 1K-5K connections
├─ Test environment: Modern laptop, Chrome browser, 50 Mbps connection
├─ Current: [measure during Phase 0]
└─ Acceptable range: 30-60 seconds (optimize in Phase 1)

Criterion 3: Aha Moment Occurrence ≥4/5 users
├─ Measurement: Test with 5 diverse users (2 creators, 2 professionals, 1 technical)
├─ Aha moment definition: User verbalizes learning something new + emotional response (surprise/delight)
├─ Method: Observation + interview ("What did you discover?")
├─ Current: [measure during Phase 0]
└─ Critical: Without this, product doesn't deliver core value

Criterion 4: No Critical UX Blockers
├─ Critical definition: Prevents task completion (can't upload, graph never renders, browser crashes)
├─ Non-critical: Annoying but workable (confusing messaging, slow but functional)
├─ Test: 5 users complete full flow (download → upload → visualize)
├─ Current: [document blockers during Phase 0]
└─ Action: Fix all critical before Phase 1, defer non-critical
```

**Validation Signals (qualitative):**

```
Strong positive signals:
├─ Users say "Wow" or equivalent (unprompted emotion)
├─ Users spend >5 minutes exploring (curiosity/engagement)
├─ Users ask to share with friends (organic advocacy)
└─ Users describe specific insights (not vague "interesting")

Weak signals (concerning):
├─ Users politely positive but not excited ("That's nice")
├─ Users confused about what they're seeing ("What is this?")
├─ Users abandon quickly (<2 minutes)
└─ Users can't articulate value ("Not sure what this tells me")

If signals weak: Iterate on visualization or insight presentation before Phase 1
```

**Decision Framework:**

```
GO to Phase 1 if:
✅ ALL 4 exit criteria met
✅ Validation signals predominantly positive
✅ Team confidence: >80% that foundation is solid

ITERATE Phase 0 (+1 week extension) if:
⚠️ 3 of 4 exit criteria met (one improvable)
⚠️ Validation signals mixed (some positive, some weak)
⚠️ Team confidence: 60-80% (could be better with iteration)

PIVOT if:
⚠️ 2 of 4 exit criteria met (fundamental issues)
⚠️ Aha moment weak (2/5 or less) despite iteration
⚠️ Alternative approach identified (e.g., browser extension vs. manual upload)

STOP if:
❌ <2 of 4 exit criteria met (foundational failure)
❌ Aha moment absent (0-1/5 users) despite multiple iterations
❌ No viable alternative approach identified
```

**Accountability:**

```
Decision makers:
├─ Primary: Founder (final call)
├─ Input: Technical co-founder (if applicable)
├─ Input: Beta testers (via survey/interview)
└─ Advisory: Advisors/mentors (if available)

Decision process:
├─ Day 13: Compile all data (metrics, test results, feedback)
├─ Day 14: Team review (discuss findings, surface concerns)
├─ Day 14 EOD: Founder decision (GO / ITERATE / PIVOT / STOP)
└─ Day 15: Communication (if GO, start Phase 1 immediately)

Documentation:
├─ Decision recorded in: Project wiki + roadmap document
├─ Rationale documented: Why this decision? What data supported it?
├─ Adjustments noted: What did we learn that changes Phase 1 plan?
└─ Shared with: Team, advisors, investors (if applicable)
```

---

### **2.3 Phase 1 Gate: Complete Product Launch**

**Primary Risks Retired:**
1. "Users won't complete manual upload flow"
2. "Strangers won't find value" (cold audience test)
3. "Growth won't scale organically" (viral coefficient)

**Exit Criteria (5 of 7 must pass):**

```
Criterion 1: Upload Completion Rate ≥60%
├─ Measurement: (Uploads completed / Uploads started) × 100
├─ Population: Initial beta users (50) → public users (1,000)
├─ Acceptable threshold: ≥40% (minimum), ≥60% (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >60%: Friction acceptable, proceed
    ├─ 40-60%: Friction high but manageable, optimize
    ├─ 20-40%: Major friction, extend Phase 1 for UX improvements
    └─ <20%: Fundamental problem, pivot to browser extension

Criterion 2: Aha Moment Rate ≥40%
├─ Measurement: Users who verbalize insight + emotional response
├─ Method: Survey ("Did you learn something new?") + behavioral (time exploring >3 min)
├─ Population: Users who completed visualization (beta + public)
├─ Acceptable threshold: ≥30% (minimum), ≥40% (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >40%: Strong product-value fit, proceed
    ├─ 30-40%: Moderate fit, improve insights
    ├─ 20-30%: Weak fit, major insight redesign needed
    └─ <20%: No fit, fundamental product pivot required

Criterion 3: Net Promoter Score (NPS) ≥40
├─ Measurement: "Would you recommend VSG to a friend?" (0-10 scale)
├─ NPS = % Promoters (9-10) - % Detractors (0-6)
├─ Population: All users who completed upload
├─ Acceptable threshold: ≥40 (minimum), ≥50 (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >50: Excellent, strong word-of-mouth potential
    ├─ 40-50: Good, users satisfied and would recommend
    ├─ 30-40: Lukewarm, lacks enthusiasm
    └─ <30: Poor, users unhappy or indifferent

Criterion 4: 1,000 Users Acquired
├─ Measurement: Total users signed up (Product Hunt + organic + referrals)
├─ Timeframe: 12 weeks (Weeks 3-14)
├─ Acceptable threshold: ≥500 (minimum), ≥1,000 (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >1,000: Strong demand, proceed to scale
    ├─ 500-1,000: Moderate demand, optimize growth in Phase 2
    ├─ 300-500: Weak demand, extend Phase 1 or adjust positioning
    └─ <300: Insufficient demand, major pivot or stop

Criterion 5: Viral Coefficient ≥0.2
├─ Measurement: (New users from referrals / Total users)
├─ Calculation method: Track referral links, social shares with attribution
├─ Acceptable threshold: ≥0.2 (minimum), ≥0.3 (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >0.3: Strong viral potential, compounding growth
    ├─ 0.2-0.3: Moderate viral growth, optimize sharing features
    ├─ 0.1-0.2: Weak virality, growth will be primarily paid/content
    └─ <0.1: No viral growth, fundamental shareability problem

Criterion 6: D30 Retention ≥10%
├─ Measurement: % of users who return 30 days after signup
├─ Cohort: Users who achieved aha moment
├─ Acceptable threshold: ≥10% (minimum), ≥15% (target)
├─ Current: [measure during Phase 1, will have partial data]
└─ Interpretation:
    ├─ >15%: Strong retention, product is sticky
    ├─ 10-15%: Moderate retention, improve triggers in Phase 2
    ├─ 5-10%: Weak retention, product is novelty
    └─ <5%: No retention, fundamental value problem

Criterion 7: Free → Paid Conversion ≥3%
├─ Measurement: (Paid users / Total users) × 100
├─ Timeframe: Within 30 days of signup
├─ Acceptable threshold: ≥3% (minimum), ≥5% (target)
├─ Current: [measure during Phase 1]
└─ Interpretation:
    ├─ >5%: Excellent monetization, proceed with confidence
    ├─ 3-5%: Good monetization, optimize in Phase 2
    ├─ 1-3%: Weak monetization, pricing or value gap
    └─ <1%: No monetization path, business model issue
```

**Validation Signals:**

```
Strong signals (proceed to Phase 2):
├─ Users returning organically (Day 3, Day 7, Day 30 visits without prompts)
├─ Users sharing visualizations on social media (unprompted)
├─ Users providing detailed feedback (engaged, specific suggestions)
├─ Users referring friends (organic word-of-mouth)
├─ Users expressing urgency for paid features ("When can I upgrade?")
├─ Organic social media buzz (users sharing unprompted)
├─ Inbound press inquiries (journalists interested)
├─ Power users emerging (advocates, content creators)
└─ Feature requests aligning with vision (users want deeper PNI)

Weak signals (iterate or pivot):
├─ Users trying once, never returning (novelty product)
├─ Users completing flow but not exploring (no curiosity)
├─ Users confused about insights ("What does this mean?")
├─ Users skeptical about privacy (trust not established)
├─ Users viewing as "nice to have" not "must have"
├─ Launch spike, then plateau (no sustained growth)
├─ Low engagement (sign up, visualize, leave)
└─ Confusion about category ("Is this analytics?")
```

**Learning Objectives (Phase 1):**

```
Question 1: Will users complete a 5-10 minute manual upload flow?
├─ Hypothesis: Yes, if value is clear and UX is excellent
├─ Evidence: Upload completion rate, user feedback
├─ Answer by: Week 8 (beta), Week 14 (public)
└─ Implications: If no, pivot to browser extension or OAuth

Question 2: Does network visualization create "aha moments"?
├─ Hypothesis: Yes, users discover positioning, gaps, opportunities
├─ Evidence: Aha moment rate, qualitative interviews
├─ Answer by: Week 8 (beta), Week 14 (public)
└─ Implications: If no, fundamental product redesign or stop

Question 3: Is privacy-first positioning resonating?
├─ Hypothesis: Yes, users appreciate "no account access"
├─ Evidence: User feedback, trust signals in testimonials
├─ Answer by: Week 14
└─ Implications: If no, adjust messaging or offer OAuth option

Question 4: Which insights are most valuable?
├─ Hypothesis: Positioning and growth opportunities most valued
├─ Evidence: Time spent per insight, user feedback, feature requests
├─ Answer by: Week 14
└─ Implications: Prioritize most valued insights for Phase 2

Question 5: Do cold users (strangers) have same aha moment as beta users?
├─ Hypothesis: Yes, aha moment is universal (not just early adopters)
├─ Evidence: Aha moment rate (beta vs. public), qualitative feedback
├─ Answer by: Week 14
└─ Implications: If no, adjust onboarding or target niche segment

Question 6: Which acquisition channels work best?
├─ Hypothesis: Product Hunt, SEO, and viral sharing are primary
├─ Evidence: Attribution data, CAC by channel, quality by channel
├─ Answer by: Week 14
└─ Implications: Double down on best channels, kill ineffective ones

Question 7: Is "Personal Network Intelligence" resonating?
├─ Hypothesis: Yes, users adopt category language naturally
├─ Evidence: User testimonials, social media posts, support tickets
├─ Answer by: Week 14
└─ Implications: If yes, invest in category marketing; if no, refine messaging
```

**Decision Framework:**

```
GO to Phase 2 if:
✅ 5 of 7 exit criteria met (minimum)
✅ Validation signals predominantly strong
✅ Learning objectives answered (clear direction for Phase 2)
✅ Product Hunt: Top 10 (ideally Top 5)
✅ Team confidence: >70% ready for public scale

ITERATE Phase 1 (+2-4 weeks) if:
⚠️ 3-4 of 7 exit criteria met
⚠️ Validation signals mixed
⚠️ Key learning objective unanswered (need more data)
⚠️ Team confidence: 50-70% (iteration could achieve readiness)

PIVOT if:
⚠️ 2-3 of 7 exit criteria met
⚠️ Upload friction insurmountable (<20% completion despite iteration)
⚠️ Aha moment weak (<20%) despite visualization improvements
⚠️ Cold users don't resonate (aha moment <20% for non-beta)
⚠️ No viral growth (<0.1 coefficient)

STOP if:
❌ 0-2 of 7 exit criteria met
❌ No aha moment (<10% even in best case)
❌ NPS <20 (users actively unhappy)
❌ Can't reach 300 users in 12 weeks (insufficient demand)
❌ No monetization signal (<0.5% would pay)
```

**Accountability:**

```
Decision makers:
├─ Primary: Founder
├─ Input: Team (2-4 people by Week 14)
├─ Input: Beta users + public users (survey + interviews)
└─ Advisory: Advisors/investors

Decision process:
├─ Week 8: Beta checkpoint (compile beta data, assess readiness for public launch)
├─ Week 14 Day 1-2: Comprehensive data review (all metrics + qualitative)
├─ Week 14 Day 3: Team workshop (review findings, debate decision)
├─ Week 14 Day 4: Founder decision + rationale documentation
├─ Week 14 Day 5: Communication + Phase 2 kickoff (if GO)
└─ Retrospective: "What did we learn? What surprised us?"

Transparency:
├─ Users: Share decision + next steps
├─ Team: Full context (metrics, reasoning, plan)
├─ Advisors/investors: Update on progress
└─ Public: If proceeding, announce scale plans

Gate review includes:
├─ Quantitative: All metrics vs. thresholds
├─ Qualitative: User feedback themes, competitive positioning
├─ Financial: Burn rate, runway, need for funding
└─ Team: Morale, capacity, readiness to scale
```

---

### **2.4 Phase 2 Gate: Product-Market Fit**

**Primary Risk Retired:** "Can we scale predictably and sustainably?"

**Exit Criteria (ALL must pass for strong GO):**

```
Criterion 1: 10,000 Users Reached
├─ Measurement: Total users signed up
├─ Timeframe: 12 weeks (Weeks 15-26)
├─ Acceptable threshold: ≥7,000 (conditional), ≥10,000 (target)
├─ Current: [measure during Phase 3]
└─ Interpretation:
    ├─ >10,000: Demand validated, proceed to market leadership
    ├─ 7,000-10,000: Close, extend phase to hit target
    ├─ 5,000-7,000: Below goal, growth challenges remain
    └─ <5,000: Insufficient traction, strategic pivot needed

Criterion 2: $10K MRR Achieved
├─ Measurement: Monthly Recurring Revenue (Stripe dashboard)
├─ Timeframe: By Week 26
├─ Acceptable threshold: ≥$7K (conditional), ≥$10K (target)
├─ Current: [measure during Phase 3]
└─ Interpretation:
    ├─ >$10K: Monetization working, path to $1M ARR clear
    ├─ $7K-$10K: Close, optimize pricing/conversion
    ├─ $5K-$7K: Weak monetization, pricing/value issues
    └─ <$5K: Monetization not working, business model pivot

Criterion 3: Product-Market Fit Validated (Sean Ellis + Metrics)
├─ Measurement: Composite of 6 quantitative + 4 qualitative signals
├─ Quantitative (all must pass):
│  ├─ Aha moment rate: ≥40%
│  ├─ D30 retention: ≥15% (target: ≥20%)
│  ├─ NPS: ≥50
│  ├─ Free → paid conversion: ≥3% (target: ≥5%)
│  ├─ Monthly churn (paid): ≤5%
│  └─ LTV:CAC ratio: ≥3:1 (target: ≥5:1)
├─ Qualitative (3 of 4 must be strong):
│  ├─ Users become advocates (testimonials, social sharing)
│  ├─ "Personal Network Intelligence" resonates (category language)
│  ├─ Insights drive action (behavioral change)
│  └─ Paid users see ROI (low churn, renewal intent)
├─ Sean Ellis Test: ≥40% say "very disappointed" if product disappeared
└─ Current: [comprehensive assessment at Week 26]

Criterion 4: Growth Channels Validated (CAC <$30)
├─ Measurement: Customer Acquisition Cost by channel
├─ Channels tested: SEO, social/organic, viral, paid (if applicable)
├─ Target: At least 2 channels with CAC <$30
├─ Current: [measure during Phase 3]
└─ Interpretation:
    ├─ CAC <$20: Excellent, highly efficient growth
    ├─ CAC $20-$30: Good, sustainable growth
    ├─ CAC $30-$50: Acceptable, needs optimization
    └─ CAC >$50: Expensive, not yet sustainable
```

**Validation Signals:**

```
Strong PMF signals:
├─ Organic growth accelerating (week-over-week increase without paid spend)
├─ Retention cohorts flattening (users staying long-term)
├─ Conversion rate increasing (users more willing to pay over time)
├─ Support burden decreasing (product intuitive, less handholding)
├─ Competition emerging (others entering category, validation)
├─ Inbound partnerships (platforms, agencies interested)
└─ Media coverage (unsolicited press, thought leadership requests)

Weak PMF signals:
├─ Growth plateauing (hitting ceiling around 5K-7K users)
├─ High churn (users leaving as fast as joining)
├─ Price resistance (users unwilling to pay, asking for discounts)
├─ Feature confusion (users don't understand value)
├─ Category rejection ("I already have analytics tools")
└─ Team exhaustion (burning out trying to force growth)
```

**Learning Objectives:**

```
Question 1: Which user segment converts and retains best?
├─ Hypothesis: Micro-influencers (10K-100K followers)
├─ Evidence: Conversion rate, retention, LTV by segment
├─ Answer by: Week 26
└─ Implications: Double down on best segment in Phase 3

Question 2: What's the optimal pricing?
├─ Hypothesis: $12/mo for Pro, $29/mo for Creator
├─ Evidence: A/B tests, willingness-to-pay surveys, conversion rates
├─ Answer by: Week 26
└─ Implications: Adjust pricing for Phase 3 if data suggests

Question 3: Which features drive retention?
├─ Hypothesis: Historical tracking and algorithm-powered recommendations
├─ Evidence: Feature usage correlation with retention
├─ Answer by: Week 26
└─ Implications: Prioritize retention-driving features

Question 4: Is category ownership achievable?
├─ Hypothesis: Yes, "Personal Network Intelligence" can be owned
├─ Evidence: Brand awareness, competitor positioning, user language
├─ Answer by: Week 26
└─ Implications: If yes, invest heavily in category marketing in Phase 3
```

**Decision Framework:**

```
GO to Phase 3 if:
✅ ALL 4 exit criteria met
✅ Product-market fit clearly validated (quantitative + qualitative)
✅ Team consensus: "We found something real here"
✅ Path to $1M ARR visible (not just hopeful)

CONDITIONAL GO (extend Phase 2 by 4 weeks) if:
⚠️ 3 of 4 exit criteria met (close to targets)
⚠️ PMF signals: 5 of 6 quantitative pass, qualitative mixed
⚠️ Need: More time to optimize conversion or reduce CAC
⚠️ Confidence: 60-80% that iteration will achieve full GO

PIVOT if:
⚠️ 2 of 4 exit criteria met
⚠️ Growth stalled (5K-7K users, can't break through)
⚠️ Monetization weak ($5K-$7K MRR, pricing/value issues)
⚠️ PMF unclear (some signals positive, many weak)
⚠️ Options: Narrow to core segment, change business model, adjust positioning

STOP if:
❌ 0-1 of 4 exit criteria met
❌ Can't reach 5K users in 12 weeks (demand insufficient)
❌ Can't achieve $5K MRR (no monetization path)
❌ PMF definitively absent (<3 of 6 quantitative metrics pass)
❌ Team exhausted with no viable pivot options
```

**Accountability:**

```
Decision process (Week 26-27):
├─ Week 26: Comprehensive PMF assessment
│  ├─ Compile all metrics (aha moment, retention, NPS, etc.)
│  ├─ Run Sean Ellis survey (all users)
│  ├─ Conduct user interviews (20 users: promoters, passives, detractors)
│  ├─ Financial analysis (revenue, costs, runway)
│  └─ Competitive analysis (where do we stand?)
├─ Week 27: Analysis & decision
│  ├─ Team workshop (full day): Review all data
│  ├─ Founder intuition: "Does this feel like PMF?"
│  ├─ Advisor input (if applicable)
│  ├─ Decision: GO / CONDITIONAL GO / PIVOT / STOP
│  └─ Documentation: Decision rationale (evidence + reasoning)
└─ Week 28: Communication & execution
    ├─ Internal: Share with team (transparent)
    ├─ External: Update investors, advisors
    ├─ Users: Communicate roadmap
    └─ Execute: Begin Phase 3 OR pivot OR wind down

This is the most critical gate. Take the time to get it right.
```

---

## **3. Risk Burn-down Map** ⭐ NEW

### **3.1 Risk Burn-down Philosophy**

**What is risk burn-down?**

Risk burn-down tracks which critical risks are being **retired** (or sufficiently mitigated) in each phase, and which risks remain **active** and must be managed.

**Why it matters:**

```
Traditional roadmaps: Focus on features being built
Risk-aware roadmaps: Focus on uncertainties being resolved

Benefits:
├─ Strategic clarity (what are we trying to prove?)
├─ Resource allocation (invest in risk retirement, not just features)
├─ Pivot triggers (know when assumptions invalidated)
└─ Stakeholder communication (explain progress beyond features)
```

**Risk categories:**

1. **Technical Risk** - Can we build this?
2. **Product Risk** - Will users find value?
3. **Market Risk** - Is there sufficient demand?
4. **Business Risk** - Can we monetize sustainably?
5. **Category Risk** - Can we own "Personal Network Intelligence"?
6. **Execution Risk** - Can we deliver with quality?

---

### **3.2 Initial Risk Register (Start of Phase 0)**

**Critical Risks (Score 8-9: High Likelihood × High Impact):**

```
R1: Platform Format Instability [Technical]
├─ Risk: Social platforms change export formats frequently
├─ Impact: Parsers break, users frustrated, negative reviews
├─ Likelihood: High (Instagram changed 2024, Twitter changes often)
├─ Score: 3 × 3 = 9 (CRITICAL)
├─ Retirement plan: Parser versioning system (Phase 0-1)
└─ Residual risk after Phase 1: Medium (4-6)

R2: Manual Upload Friction [Product]
├─ Risk: Users abandon during 5-10 min download/upload process
├─ Impact: No uploads = no business
├─ Likelihood: High (manual process is inherently friction)
├─ Score: 3 × 3 = 9 (CRITICAL)
├─ Retirement plan: Validate completion rate >60% (Phase 0-1)
└─ Residual risk after Phase 1: Low-Medium (2-4) if validated

R3: No "Aha Moment" [Product]
├─ Risk: Visualization doesn't create revelation
├─ Impact: Product has no core value, can't retain/monetize
├─ Likelihood: Medium (beta users loved it, but will it scale?)
├─ Score: 2 × 3 = 6 (HIGH)
├─ Retirement plan: Validate aha moment rate >40% (Phase 0-1)
└─ Residual risk after Phase 1: Low (1-2) if validated

R4: Insights Feel Uncomfortable [Product/Behavioral]
├─ Risk: Users react negatively to uncomfortable truths
├─ Impact: Negative sentiment, poor retention, bad reviews
├─ Likelihood: Medium (some insights are ego-threatening)
├─ Score: 2 × 2 = 4 (MEDIUM)
├─ Retirement plan: Positive framing, confidence levels, behavioral strategy (Phase 1)
└─ Residual risk after Phase 1: Low-Medium (2-3)

R5: Insufficient Market Demand [Market]
├─ Risk: Addressable market smaller than projected (can't reach 10K users)
├─ Impact: Business not viable
├─ Likelihood: Low-Medium (creator economy large, but niche positioning)
├─ Score: 2 × 3 = 6 (HIGH)
├─ Retirement plan: Validate with public launch (Phase 1-2)
└─ Residual risk after Phase 2: Low (1-2) if 10K users achieved

R6: Monetization Not Viable [Business]
├─ Risk: Users unwilling to pay (conversion <1%)
├─ Impact: No revenue path, must pivot business model
├─ Likelihood: Medium (freemium is hard)
├─ Score: 2 × 3 = 6 (HIGH)
├─ Retirement plan: Validate conversion 3-5% (Phase 1-2)
└─ Residual risk after Phase 2: Low (1-2) if validated

R7: Category Confusion [Category]
├─ Risk: Users don't understand "Personal Network Intelligence"
├─ Impact: Positioning unclear, compete with analytics tools
├─ Likelihood: Medium (new category = education burden)
├─ Score: 2 × 2 = 4 (MEDIUM)
├─ Retirement plan: Measure category adoption (Phase 1-3)
└─ Residual risk after Phase 3: Low (1-2) if owned

R8: High Churn [Business]
├─ Risk: Users churn rapidly (>10% monthly)
├─ Impact: Growth unsustainable, LTV collapses
├─ Likelihood: Medium (retention is hard)
├─ Score: 2 × 3 = 6 (HIGH)
├─ Retirement plan: Build retention systems (Phase 2)
└─ Residual risk after Phase 2: Low-Medium (2-4)

R9: Competition Emerges [Market]
├─ Risk: Well-funded competitor copies approach
├─ Impact: Market share split, pricing pressure
├─ Likelihood: Medium (after we prove model)
├─ Score: 2 × 3 = 6 (HIGH)
├─ Retirement plan: Build moats (brand, community, quality) (Phase 2-3)
└─ Residual risk: Ongoing (must always defend)

R10: Platform API Restrictions [External]
├─ Risk: Platforms make data exports harder
├─ Impact: Manual upload even more friction or impossible
├─ Likelihood: Low (GDPR/CCPA legally mandate)
├─ Score: 1 × 3 = 3 (LOW but catastrophic if occurs)
├─ Retirement plan: Cannot fully retire (external risk)
└─ Mitigation: Multi-platform, advocacy, partnerships (ongoing)
```

---

### **3.3 Risk Burn-down by Phase**

**Phase 0: Technical Validation Spike**

**Primary Risks Addressed:**

```
R1: Platform Format Instability [Technical]
├─ Actions:
│  ├─ Test parsers with 30 real files (5 platforms × multiple sizes × variations)
│  ├─ Document exact file structures (screenshots, notes)
│  ├─ Build version detection logic (auto-detect format versions)
│  └─ Test edge cases (corrupted, incomplete, very old exports)
├─ Success criteria: Parser success rate ≥95%
├─ Risk reduction: Critical (9) → Medium (4-6)
└─ Residual risk: Format changes in future (ongoing monitoring)

R2: Manual Upload Friction [Product] (Initial Assessment)
├─ Actions:
│  ├─ Test upload flow with 5 users (observe friction points)
│  ├─ Measure time to complete (target <10 minutes)
│  ├─ Document where users get stuck
│  └─ Prototype solutions (better UX, clearer instructions)
├─ Success criteria: 4/5 users complete without assistance
├─ Risk reduction: Critical (9) → High (6-7)
└─ Full retirement: Phase 1 (with 50 beta users)

R3: No "Aha Moment" [Product] (Initial Validation)
├─ Actions:
│  ├─ Test visualization with 5 users
│  ├─ Observe emotional reactions (surprise, delight, curiosity)
│  ├─ Interview about discoveries ("What did you learn?")
│  └─ Iterate on reveal sequence if weak response
├─ Success criteria: 4/5 users verbalize insight + emotional response
├─ Risk reduction: High (6) → Medium (4)
└─ Full retirement: Phase 1 (validate at scale)

R6: Execution Risk (Technical Feasibility)
├─ Actions:
│  ├─ Build end-to-end prototype (upload → parse → visualize)
│  ├─ Test performance (can browsers handle it?)
│  ├─ Identify technical blockers
│  └─ Validate architecture decisions
├─ Success criteria: No critical technical blockers
├─ Risk reduction: Medium (4) → Low (2)
└─ Foundation solid for Phase 1
```

**Risks NOT Addressed (Accepted for Now):**

- R5: Market demand (too early to test)
- R6: Monetization (no pricing yet)
- R7: Category confusion (no public positioning yet)
- R8: High churn (no retention systems yet)
- R9: Competition (not validated yet, so no competition)

**Phase 0 Exit State:**

```
Critical risks retired: 0 (but 2 significantly reduced)
High risks retired: 0 (but 1 significantly reduced)
Medium risks retired: 1 (technical feasibility)
New risks identified: [document any surprises]

Confidence increase: 60% → 90% (technical feasibility validated)
Remaining uncertainty: Product-market fit, market size, monetization
```

---

**Phase 1: Complete Product Launch**

**Primary Risks Addressed:**

```
R2: Manual Upload Friction [Product] (Full Retirement Attempt)
├─ Actions:
│  ├─ Launch beta to 50 users (diverse cohort)
│  ├─ Measure upload completion rate (target ≥60%)
│  ├─ Gather qualitative feedback (where friction remains)
│  ├─ Iterate on UX based on feedback
│  └─ Add wait-time engagement (sample network during download wait)
├─ Success criteria: Upload completion rate ≥60%
├─ Risk reduction: High (6-7) → Low-Medium (2-4) if validated
└─ Decision: If <40%, pivot to browser extension

R3: No "Aha Moment" [Product] (Validation at Beta + Public Scale)
├─ Actions:
│  ├─ Measure aha moment rate with 50 beta users (Weeks 3-8)
│  ├─ Implement guided reveal sequence (progressive visualization)
│  ├─ Add confidence levels to insights (show uncertainty)
│  ├─ Test "What this means for you" narratives
│  ├─ User interviews (deep qualitative understanding)
│  ├─ Measure aha moment rate with cold audience (Product Hunt, public)
│  ├─ Compare beta users vs. public users (same rate?)
│  └─ A/B test different reveal sequences
├─ Success criteria: Aha moment rate ≥40% (beta + public)
├─ Risk reduction: Medium (4) → Retired if validated across audiences
└─ Decision: If <30% for public, adjust onboarding/targeting

R4: Insights Feel Uncomfortable [Product/Behavioral]
├─ Actions:
│  ├─ Implement behavioral strategy (positive framing, confidence levels)
│  ├─ Monitor user sentiment (NPS, feedback, support tickets)
│  ├─ Test different framings (A/B test messaging)
│  └─ Provide strategic support ("What to do next")
├─ Success criteria: NPS ≥40, negative sentiment <20%
├─ Risk reduction: Medium (4) → Low-Medium (2-3)
└─ Ongoing: Monitor sentiment closely

R5: Insufficient Market Demand [Market] (Initial Test)
├─ Actions:
│  ├─ Product Hunt launch (measure organic interest)
│  ├─ SEO + content marketing (early signals)
│  ├─ Social media organic growth (word-of-mouth)
│  └─ Viral coefficient measurement (sharing behavior)
├─ Success criteria: 1,000 users in 12 weeks, viral coefficient ≥0.2
├─ Risk reduction: High (6) → Medium (4) with initial validation
└─ Full retirement: Phase 2 (scale to 10K users)

R6: Monetization Not Viable [Business] (Early Signal + Real Conversion)
├─ Actions:
│  ├─ Survey beta users about willingness to pay
│  ├─ Test pricing messaging (what resonates?)
│  ├─ Identify which features drive upgrade intent
│  ├─ Launch Pro tier (Stripe integration)
│  ├─ Measure free → paid conversion (target 3-5%)
│  ├─ Test upgrade prompts and messaging
│  └─ Validate pricing ($12/mo for Pro)
├─ Success criteria: ≥3% conversion within 30 days
├─ Risk reduction: High (6) → Low-Medium (3) if validated
└─ Full retirement: Phase 2 (validate at scale, test pricing)

R7: Category Confusion [Category] (Initial Assessment)
├─ Actions:
│  ├─ Measure: Do users use "Personal Network Intelligence" language?
│  ├─ Gather feedback: How do users describe VSG to others?
│  ├─ Competitive positioning: Are we differentiated?
│  └─ Content marketing: SEO for category terms
├─ Success criteria: ≥30% use category language naturally
├─ Risk reduction: Medium (4) → Low-Medium (3) with early signals
└─ Full retirement: Phase 3 (category ownership)

R10: Execution Risk (Quality at Beta + Public Scale)
├─ Actions:
│  ├─ Rigorous testing (manual + automated)
│  ├─ Bug bash (team + external testers)
│  ├─ Performance optimization (60 FPS, <3 second load)
│  └─ Accessibility audit (WCAG AA compliance)
├─ Success criteria: No P0 bugs, Lighthouse score >90
├─ Risk reduction: Medium (4) → Low (2)
└─ Foundation: Quality bar established
```

**Risks NOT Addressed:**

- R1: Platform format changes (monitoring, not active mitigation)
- R8: High churn (retention systems in Phase 2)
- R9: Competition (moat building in Phase 2-3)

**Phase 1 Exit State:**

```
Critical risks retired: 2 (upload completion + aha moment validated)
High risks retired: 1 (market demand initial validation)
Medium risks retired: 3 (uncomfortable insights, execution quality, monetization early validation)
New risks identified: [any surprises from beta + public launch]

Confidence increase: 75% → 95% (product-value fit + public validation + early monetization)
Remaining uncertainty: Scale (10K+ users), retention, category ownership
```

---

**Phase 2: Scale & Monetization**

**Primary Risks Addressed:**

```
R5: Insufficient Market Demand [Market] (Full Retirement)
├─ Actions:
│  ├─ Scale to 10,000 users (10x from Phase 1)
│  ├─ Test multiple growth channels (SEO, paid, viral, community)
│  ├─ Measure CAC by channel (target <$30)
│  └─ Validate sustainable growth (not just launch spike)
├─ Success criteria: 10,000 users reached, CAC <$30
├─ Risk reduction: Medium (4) → Retired if achieved
└─ Confidence: Market demand validated at meaningful scale

R6: Monetization Not Viable [Business] (Full Retirement)
├─ Actions:
│  ├─ Achieve $10K MRR (validates business model)
│  ├─ Test pricing variations (optimize ARPU)
│  ├─ Measure LTV:CAC ratio (target ≥3:1)
│  └─ Validate freemium model (3-5% conversion)
├─ Success criteria: $10K MRR, conversion 3-5%, LTV:CAC ≥3:1
├─ Risk reduction: Low-Medium (3) → Retired if achieved
└─ Confidence: Sustainable monetization proven

R8: High Churn [Business] (Mitigation)
├─ Actions:
│  ├─ Build retention systems (email, in-app triggers, community)
│  ├─ Implement churn prevention (early warning, win-back)
│  ├─ Measure D30 retention (target ≥20%)
│  ├─ Validate paid churn rate (target <5% monthly)
│  └─ Identify retention-driving features
├─ Success criteria: D30 retention ≥20%, paid churn <5%
├─ Risk reduction: High (6) → Low-Medium (2-4)
└─ Ongoing: Retention requires continuous optimization

R9: Competition Emerges [Market] (Moat Building)
├─ Actions:
│  ├─ Build brand moat (category ownership, content marketing)
│  ├─ Build community moat (5K+ Discord members, ambassadors)
│  ├─ Build quality moat (execution excellence, polish)
│  └─ Build data moat (historical tracking creates switching costs)
├─ Success criteria: Recognized as category leader, NPS >50
├─ Risk reduction: High (6) → Medium (4-5) with early moats
└─ Ongoing: Competition requires continuous defense

R7: Category Confusion [Category] (Progress)
├─ Actions:
│  ├─ Content dominance (100+ blog posts, SEO #1 rankings)
│  ├─ Thought leadership (speaking, media, research)
│  ├─ User language adoption (measure category usage)
│  └─ Competitive differentiation (clear positioning)
├─ Success criteria: ≥40% use "Personal Network Intelligence" naturally
├─ Risk reduction: Low-Medium (3) → Low (2) with progress
└─ Full retirement: Phase 3 (category owned)
```

**Risks NOT Addressed:**

- R1: Platform format changes (ongoing monitoring)
- R10: Platform API restrictions (external, cannot control)

**Phase 2 Exit State:**

```
Critical risks retired: 2 (sustained across scale)
High risks retired: 3 (market demand + monetization + initial moat)
Medium risks retired: 2 (churn mitigation + category progress)
New risks identified: [competition, platform changes, team scaling]

Confidence increase: 90% → 95% (product-market fit validated)
Remaining uncertainty: Category ownership, competitive defense, international expansion
```

---

**Phase 3: Market Leadership**

**Primary Risks Addressed:**

```
R7: Category Confusion [Category] (Full Ownership)
├─ Actions:
│  ├─ Thought leadership (10+ conferences, regular press)
│  ├─ Research & data (annual "State of Personal Networks" report)
│  ├─ Content dominance (rank #1 for all category keywords)
│  ├─ Community leadership (5K+ members, PNI Summit event)
│  └─ Competitive validation (others enter category = validation)
├─ Success criteria: "Visual Social Graph" = "Personal Network Intelligence"
├─ Risk reduction: Low (2) → Retired (category owned)
└─ Defensibility: 3-5 year moat

R9: Competition Emerges [Market] (Sustained Defense)
├─ Actions:
│  ├─ Continuous innovation (stay 12 months ahead)
│  ├─ Brand strengthening (premium positioning)
│  ├─ Community deepening (network effects)
│  ├─ Quality obsession (execution excellence)
│  └─ Strategic partnerships (platforms, agencies)
├─ Success criteria: Maintain >50% market share in PNI category
├─ Risk reduction: Medium (4-5) → Medium (ongoing defense required)
└─ Acceptance: Competition is permanent, must always defend

R1: Platform Format Instability [Technical] (Ongoing Management)
├─ Actions:
│  ├─ Platform monitoring (proactive detection)
│  ├─ Community reporting (users flag changes)
│  ├─ Rapid response (24-hour fix SLA)
│  ├─ Parser versioning (graceful degradation)
│  └─ Platform partnerships (official API access if possible)
├─ Success criteria: <24 hour response time, <5% user impact
├─ Risk reduction: Medium (4-6) → Low-Medium (2-4)
└─ Acceptance: External risk, manage but cannot eliminate

New Risks Emerging:
├─ International expansion challenges (localization, regulations)
├─ Enterprise complexity (different needs, longer sales cycles)
├─ Team scaling (culture, quality, communication)
├─ Platform partnerships (integration complexity, dependencies)
└─ Exit timing (Series A, profitability, or acquisition)
```

**Phase 3 Exit State:**

```
Critical risks retired: All initial critical risks addressed
High risks retired: 4-5 (demand, monetization, churn, competition moats)
Medium risks retired: 3-4 (category, quality, execution)
Active risks: Competition (ongoing), platform changes (external)
New risks: Scaling, international, enterprise, exit timing

Confidence: 95%+ (category leadership, sustainable business)
Strategic optionality: Series A, profitability, or acquisition paths open
```

---

### **3.4 Risk Dashboard (Track Continuously)**

**Dashboard format:**

```
Risk ID | Risk Name | Initial Score | Current Score | Status | Owner | Next Review
--------|-----------|---------------|---------------|--------|-------|-------------
R1 | Platform Format | 9 | 4 | Active | Eng | Weekly
R2 | Upload Friction | 9 | 2 | Retired | Product | -
R3 | No Aha Moment | 6 | 1 | Retired | Product | -
R4 | Uncomfortable | 4 | 2 | Mitigated | Product | Monthly
R5 | Insufficient Demand | 6 | 1 | Retired | Growth | -
R6 | No Monetization | 6 | 2 | Retired | Product | -
R7 | Category Confusion | 4 | 2 | Active | Marketing | Quarterly
R8 | High Churn | 6 | 3 | Active | Product | Monthly
R9 | Competition | 6 | 4 | Active | Strategy | Quarterly
R10 | Platform API | 3 | 3 | Accepted | Strategy | Quarterly
```

**Status definitions:**
- **Active**: Currently being managed, mitigation in progress
- **Mitigated**: Risk reduced to acceptable level, ongoing monitoring
- **Retired**: Risk sufficiently addressed, no longer primary concern
- **Accepted**: Risk acknowledged but cannot be eliminated (external factors)

**Review cadence:**
- Weekly: Active technical risks (platform changes, performance)
- Monthly: Active product/business risks (churn, conversion, retention)
- Quarterly: Strategic risks (competition, category, market shifts)

---

## **4. Phase 0: Technical Validation Spike**

*(Content from v1.0, enhanced with phase gate and learning objectives)*

**Timeline:** 2 weeks (Weeks 1-2, January 2026)
**Team:** Founder (solo or with technical co-founder)
**Budget:** $0-500 (hosting, tools)
**Goal:** Validate all technical assumptions before committing to full build

**Primary Risks Addressed:** R1 (Platform Format Instability), R2 (Upload Friction - initial), R3 (Aha Moment - initial)

**Learning Objectives:**
1. Can we reliably parse all 5 platform formats? (Target: >95% success)
2. Can browsers handle the processing? (Target: <60 seconds)
3. Do users feel the "aha moment"? (Target: 4/5 test users)
4. Are there critical UX blockers? (Target: None)

### **4.1 Phase Overview**

**Why this phase exists:**

From PRD v2.1:
"V1.0 PRD had unvalidated assumptions about file formats.
 V2.0 corrected with real platform data.
 But we still need to prove we can actually build this."

**Key questions to answer:**
1. Can we reliably parse all 5 platform formats? (>95% success rate)
2. Can browsers handle the processing? (<60 seconds)
3. Do users feel the "aha moment"? (4/5 in testing)
4. Are there critical UX blockers? (show-stoppers)

**Success = GO to Phase 1**
**Failure = PIVOT or NO-GO**

This is the cheapest way to fail. Better to discover problems in 2 weeks than 2 months.

---

### **4.2 Week 1: Real Data Collection & Parser Prototyping**

*(Content from v1.0 - unchanged)*

---

### **4.3 Week 2: Visualization Prototype & Integration Testing**

*(Content from v1.0 - unchanged)*

---

### **4.4 Phase 0 Exit Gate**

**Refer to Section 2.2 for complete gate documentation.**

**Quick checklist:**

```
Exit Criteria:
☐ Parser success rate ≥95% (tested with 30 files)
☐ Performance <60 seconds (typical account)
☐ Aha moment 4/5 users (observed + interviewed)
☐ No critical UX blockers (all users can complete flow)

Validation Signals:
☐ Users say "Wow" or equivalent
☐ Users spend >5 minutes exploring
☐ Users ask to share with friends
☐ Users describe specific insights

Learning Objectives Answered:
☐ Parser reliability confirmed
☐ Performance acceptable
☐ Aha moment real
☐ UX blockers identified and addressed

Decision: [ ] GO  [ ] ITERATE  [ ] PIVOT  [ ] STOP
Rationale: _______________________________________________
Next steps: _______________________________________________
```

---

## **5. Phase 1: Complete Product Launch**

*(Content consolidated from v1.0 Phase 1 + Phase 2, enhanced with learning objectives)*

**Timeline:** 12 weeks (Weeks 3-14, February-May 2026)
**Team:** Founder + 1-3 (contractor/co-founder → growing to include designer/marketer)
**Budget:** $20K-45K (salaries, hosting, tools, marketing)
**Goal:** Launch beta to 50 users, then public launch to 1,000 users, validate product-market fit signals

**Primary Risks Addressed:** R2 (Upload Friction - full retirement), R3 (Aha Moment - beta + public scale), R4 (Uncomfortable Insights), R5 (Market Demand - initial), R6 (Monetization - real conversion), R7 (Category Confusion - initial)

**Learning Objectives:**
1. Will users complete 5-10 minute manual upload flow? (Target: >60% completion)
2. Does network visualization create aha moments at scale? (Target: >40% rate for beta + public)
3. Is privacy-first positioning resonating? (Qualitative signal)
4. Which insights are most valuable? (Feature usage data)
5. Do cold users (strangers) have same aha moment as beta users? (Target: same 40% rate)
6. Which acquisition channels work best? (SEO, Product Hunt, viral, paid?)
7. What drives upgrades to paid? (Advanced insights? Historical tracking?)
8. Is "Personal Network Intelligence" resonating? (Category language adoption)

### **5.1 Phase Overview**

**Why this phase exists:**

Phase 0 validated that the core idea works (technical feasibility + aha moment).
Phase 1 validates that we can deliver this to real users at quality (product excellence) and validates market demand with a public launch.

**Key questions to answer:**
1. Can we maintain quality while adding features?
2. Do 50 users have same aha moment as 5 users?
3. What's the upload completion rate? (need >60%)
4. Do users return? (retention signal)
5. What features are most valuable? (prioritization data)
6. Do cold users (strangers) find the same value as beta users?
7. Can we reach 1,000 users organically?

**Success = GO to Phase 2 (scale & monetization)**

---

### **5.2-5.5** *(Content from v1.0 - unchanged, but now governed by Phase 1 Exit Gate)*

---

### **5.6 Phase 1 Exit Gate**

**Refer to Section 2.3 for complete gate documentation.**

**Quick checklist:**

```
Exit Criteria (5 of 7 must pass):
☐ Upload completion rate ≥60% (measured with beta + public users)
☐ Aha moment rate ≥40% (survey + behavioral)
☐ NPS ≥40 (would recommend to friend)
☐ 1,000 users acquired (Product Hunt + organic + referrals)
☐ Viral coefficient ≥0.2 (organic sharing)
☐ D30 retention ≥10% (users returning)
☐ Free → paid conversion ≥3% (within 30 days)

Validation Signals:
☐ Users returning organically (D3, D7, D30 visits)
☐ Users sharing unprompted (social media)
☐ Users providing detailed feedback (engaged)
☐ Users expressing upgrade urgency ("When can I pay?")
☐ Organic social media buzz
☐ Inbound press inquiries
☐ Power users emerging

Learning Objectives Answered:
☐ Manual upload friction acceptable (or not)
☐ Aha moment scales beyond 5 users (or not)
☐ Privacy positioning resonates (or not)
☐ Most valued insights identified (prioritize for Phase 2)
☐ Cold users have same aha moment as beta users (or not)
☐ Best acquisition channels identified
☐ "Personal Network Intelligence" category resonates (or not)

Decision: [ ] GO  [ ] ITERATE  [ ] PIVOT  [ ] STOP
Rationale: _______________________________________________
Next steps: _______________________________________________
```

---

## **6. Phase 2: Scale & Monetization**

*(Content from v1.0, enhanced with learning objectives)*

**Timeline:** 12 weeks (Weeks 15-26, June-August 2026)
**Team:** 5-7 people (full product, eng, design, growth, support)
**Budget:** $50K-100K (salaries, paid acquisition, infrastructure)
**Goal:** 10,000 users, $10K MRR, product-market fit validated

**Primary Risks Addressed:** R5 (Market Demand - full retirement), R6 (Monetization - full retirement), R8 (High Churn), R9 (Competition - moat building), R7 (Category - progress)

**Learning Objectives:**
1. Which user segment converts and retains best? (Creators vs. professionals?)
2. What's the optimal pricing? ($9 vs. $12 vs. $15/mo?)
3. Which features drive retention? (Historical tracking? Algorithm-powered recommendations?)
4. Is category ownership achievable? (Brand awareness, user language)

---

*(Continue with Phase 2 content, now governed by comprehensive PMF Gate in Section 2.4)*

---

## **7. Phase 3: Market Leadership**

*(Content from v1.0 - directional, less prescriptive)*

**Timeline:** 12+ months (Week 28+, September 2026 onwards)
**Team:** 10-20 people (scale team as revenue grows)
**Budget:** $200K-500K+ (scale budget with revenue)
**Goal:** Category dominance, 100K-500K users, $1M-10M ARR

**Primary Risks Addressed:** R7 (Category Ownership - full), R9 (Competition - sustained defense), New risks (scaling, international, enterprise)

---

## **8. Feature Dependency Map**

*(Content from v1.0 - unchanged)*

---

## **9. Resource Planning**

*(Content from v1.0 - unchanged)*

---

## **10. Kill Conditions & Re-evaluation Triggers**

### **10.1 Stop Conditions Philosophy**

**Why explicit stop conditions matter:**

```
Traditional thinking: "We'll keep going until we succeed"
Reality: Some products should not be built, some markets don't exist

Benefits of clear stop conditions:
├─ Preserves capital (don't waste money on doomed path)
├─ Preserves time (founders can pivot to better opportunity)
├─ Preserves team morale (clarity better than grinding without progress)
├─ Preserves reputation (graceful exit better than slow death)
└─ Enables learning (retrospective on what didn't work)

This is not pessimism. This is discipline.
```

---

### **10.2 Phase-Specific Stop Conditions**

**Phase 0 Stop Conditions:**

```
STOP if ANY of:
❌ Parser success rate <80% after 2 weeks of effort
   └─ Implication: Platforms too inconsistent, fundamental technical barrier

❌ Performance >120 seconds (2 minutes) even after optimization
   └─ Implication: Browsers can't handle workload, need native app (too complex for MVP)

❌ Aha moment 0-1/5 users despite multiple visualization iterations
   └─ Implication: Network graphs don't reveal insights users care about

❌ Critical UX blocker that's unsolvable (e.g., platform makes exports impossible)
   └─ Implication: Fundamental flow broken, no workaround exists

Decision: Document learnings, consider pivot (e.g., LinkedIn-only, native app), or stop.
```

**Phase 1 Stop Conditions (Weeks 3-14):**

```
STOP if ANY of:
❌ Upload completion rate <20% after UX improvements
   └─ Implication: Manual upload friction insurmountable for target users

❌ Aha moment rate <20% with beta + public users
   └─ Implication: Product doesn't deliver value even to early adopters

❌ NPS <20 (users actively unhappy)
   └─ Implication: Product quality insufficient, fundamental issues

❌ Conversion interest <0.5% (no monetization signal)
   └─ Implication: No one willing to pay, business model invalid

❌ Can't reach 300 users in 12 weeks (insufficient organic interest)
   └─ Implication: Market demand lower than projected, TAM too small

❌ Retention <5% at D30 (pure novelty product)
   └─ Implication: No sustained value, users don't return

❌ Viral coefficient <0.05 (no organic sharing)
   └─ Implication: Product not share-worthy, growth will be expensive

❌ Category confusion persists (users don't understand positioning)
   └─ Implication: Messaging isn't working, competitive with analytics tools

❌ Team exhaustion without path forward
   └─ Implication: Burnout risk, better opportunities elsewhere

Decision: Retrospective (what did we learn?), pivot exploration, or graceful shutdown.
```

**Phase 2 Stop Conditions (Weeks 15-26):**

```
STOP if ANY of:
❌ Can't reach 5,000 users in 12 weeks
   └─ Implication: Growth plateau, insufficient demand at scale

❌ Can't achieve $5K MRR in 12 weeks
   └─ Implication: Monetization broken, no path to sustainability

❌ Product-market fit definitively absent (<3 of 6 metrics pass)
   └─ Implication: Not a viable business despite best efforts

❌ Burn rate unsustainable with no funding path
   └─ Implication: Running out of money, no investors interested

❌ Team collapse (key people leaving, burnout, conflict)
   └─ Implication: Cannot execute even with right strategy

Decision: Final assessment (Series A attempt, acquisition exploration, or wind down).
```

---

### **10.3 Re-evaluation Triggers (Pivot Signals)**

**These don't mean stop, but do mean pause and reassess:**

```
Trigger 1: Metrics plateau for 3+ months
├─ Example: Stuck at 5K users, can't grow further
├─ Action: Deep dive user research, identify growth blocker
├─ Timeline: 2-4 weeks analysis → pivot or double down

Trigger 2: Competitor raises significant capital ($10M+)
├─ Example: Well-funded startup enters PNI space
├─ Action: Assess competitive positioning, adjust strategy
├─ Timeline: 2 weeks analysis → fundraise, niche down, or compete on quality

Trigger 3: Platform makes major change affecting core product
├─ Example: LinkedIn stops allowing data exports (hypothetical)
├─ Action: Assess impact, explore alternatives (OAuth, partnerships)
├─ Timeline: Immediate (crisis mode)

Trigger 4: Key assumption invalidated
├─ Example: Discover users actually prefer OAuth over manual upload
├─ Action: Validate alternative approach, pivot if data supports
├─ Timeline: 4-6 weeks validation → pivot or maintain course

Trigger 5: Founder conviction wanes
├─ Example: Founder no longer believes in vision, burned out
├─ Action: Honest assessment (continue, pass leadership, or stop)
├─ Timeline: 1-2 weeks introspection → decision

Trigger 6: Better opportunity emerges
├─ Example: During building VSG, discover better product idea
├─ Action: Assess objectively (new opportunity vs. sunk cost fallacy)
├─ Timeline: 2-4 weeks analysis → commit to one or the other
```

**Re-evaluation process:**

```
Step 1: Acknowledge trigger (Week 1)
├─ Gather data (metrics, user feedback, competitive intel)
├─ Identify root cause (what's really happening?)
├─ Team workshop (brainstorm responses)
└─ Document options (continue, pivot, stop)

Step 2: Analysis (Week 2)
├─ Pro/con each option (be honest about prospects)
├─ Assess resources (runway, team capacity, founder energy)
├─ External input (advisors, investors, users)
└─ Founder intuition (what does gut say?)

Step 3: Decision (Week 3)
├─ Decide: Continue / Pivot / Stop
├─ If pivot: Define new strategy, timeline, success criteria
├─ If stop: Plan graceful wind-down, user communication
└─ Document: Learnings, reasoning, next steps

Step 4: Execute (Week 4+)
├─ Communicate to all stakeholders (team, users, investors)
├─ Execute decisively (no half-measures)
├─ Monitor: Is new approach working?
└─ Retrospective: What did we learn?
```

---

### **10.4 Graceful Shutdown Checklist (If Stop Decision Made)**

**If we decide to stop, here's how to do it with dignity:**

```
Week 1: Internal communication
├─ Team meeting (explain decision, reasoning, empathy)
├─ Individual conversations (address concerns, offer references)
├─ Document retrospective (what did we learn? for future founders)
└─ Financial assessment (remaining capital, obligations)

Week 2: External communication
├─ User notification:
│  ├─ Email: "Visual Social Graph is shutting down"
│  ├─ Timeline: "Service ends [date], export your data by then"
│  ├─ Reason: Honest but professional ("unable to achieve product-market fit")
│  └─ Gratitude: Thank users for support and feedback
├─ Investor notification (if applicable):
│  ├─ Email + call with key investors
│  ├─ Financial breakdown (capital deployed, remaining)
│  ├─ Return capital if possible (pro-rated based on time/spend)
│  └─ Appreciation for trust and support
├─ Advisor notification:
│  └─ Personal notes thanking for guidance

Week 3-4: Wind-down operations
├─ Data export:
│  ├─ Provide users easy way to export all their data
│  ├─ Offer to delete their data permanently (GDPR/CCPA)
│  └─ Ensure no data leaks during shutdown
├─ Service sunset:
│  ├─ Set end date (30-60 days from announcement)
│  ├─ Countdown timer on website
│  └─ Graceful degradation (free tier stays up longest)
├─ Financial closure:
│  ├─ Refund remaining subscriptions (pro-rated, if applicable)
│  ├─ Cancel all SaaS subscriptions (Stripe, hosting, tools)
│  ├─ Settle outstanding obligations (contractors, vendors)
│  └─ Close bank accounts / corporate entity (if applicable)
├─ Asset disposition:
│  ├─ Open-source code (if strategic, benefit community)
│  ├─ Sell/transfer domain (if valuable)
│  └─ Document learnings (public postmortem if willing)

Week 5: Personal closure
├─ Team farewell (celebration of effort, even if outcome disappointing)
├─ Founder reflection (journal, therapy, time off)
├─ Next steps (new job, new startup, sabbatical)
└─ Network maintenance (stay in touch with supporters)

Postmortem (Optional, Public or Private):
├─ What we built (product overview)
├─ What we learned (key insights for others)
├─ What went wrong (honest assessment)
├─ What we'd do differently (advice for future founders)
└─ Gratitude (to team, users, investors, supporters)

Example postmortem: "Why Visual Social Graph Failed"
(If published, helps other founders + demonstrates thoughtfulness)
```

**Mindset for shutdown:**

- Failure is part of entrepreneurship (most startups fail)
- Learning is valuable (apply to next venture)
- Relationships matter (maintain reputation and connections)
- Grace under pressure (how you handle failure defines you)

**This is not pessimism. This is responsible stewardship.**

---

### **10.5 Decision Authority for Stop/Pivot**

```
Phase 0-1 (Pre-funding):
└─ Founder (sole authority, consult co-founder if applicable)

Phase 2-3 (Post-launch, potential investors):
├─ Founder (primary authority)
├─ Co-founder (equal voice if equity partner)
└─ Investors (advisory input, not veto)

Phase 3 (Series A, board):
├─ Founder/CEO (recommendation)
├─ Board (approval required for major pivots or shutdown)
└─ Process: Board meeting with data presentation, vote

Golden rule: Founder always has moral authority to stop (burnout, health, conviction loss).
No investor or board can force founder to continue against will.
```

---

## **11. Success Metrics by Phase**

*(Content from v1.0, now integrated with phase gates and risk retirement)*

### **11.1 Metrics Dashboard (All Phases)**

```
Phase 0 (Weeks 1-2):
├─ Parser success rate: >95% ✓ [Retires R1 partially]
├─ Upload-to-visualization: <60 seconds ✓ [Retires R2 partially]
├─ Aha moment (5 users): 4/5 feel it ✓ [Retires R3 partially]
└─ Decision: GO/NO-GO

Phase 1 (Weeks 3-14) - Complete Product Launch:
├─ Beta users onboarded: 50 ✓ (Weeks 3-8)
├─ Upload completion rate: >60% (target), >40% (acceptable) [Retires R2 fully]
├─ Aha moment rate: >40% (target), >30% (acceptable) [Retires R3 at scale]
├─ NPS: >50 (target), >40 (acceptable) [Validates product quality]
├─ Total users: 1,000 ✓ (Weeks 9-14) [Retires R5 partially]
├─ Product Hunt ranking: Top 5 (target), Top 10 (acceptable)
├─ Viral coefficient: >0.3 (target), >0.2 (acceptable)
├─ D30 retention: >15% (target), >10% (acceptable)
├─ Free → paid conversion: >5% (target), >3% (acceptable) [Retires R6 partially]
└─ Decision: GO/NO-GO

Phase 2 (Weeks 15-26) - Scale & Monetization:
├─ Total users: 10,000 ✓ [Retires R5 fully]
├─ MRR: $10K ✓ [Retires R6 fully]
├─ D30 retention: >20% (improved from Phase 1) [Retires R8 partially]
├─ NPS: >50 ✓
├─ Monthly churn (paid): <5% ✓ [Validates retention]
├─ LTV:CAC: >3:1 ✓ [Validates unit economics]
├─ Sean Ellis: >40% "very disappointed" [Validates PMF]
└─ Decision: GO/PIVOT/NO-GO

Phase 3 (Week 27+) - Market Leadership:
├─ Total users: 100K-500K
├─ ARR: $1M-10M
├─ Category leadership: Top 3 recognition [Retires R7 fully]
├─ Profitability OR Series A
└─ Strategic optionality achieved
```

**Risk Retirement Summary:**

```
By Phase 1 Exit (Complete Product Launch):
├─ R2 (Upload Friction): Retired ✓
├─ R3 (Aha Moment): Retired at beta + public scale ✓
├─ R4 (Uncomfortable): Mitigated ✓
├─ R5 (Market Demand): Partially retired ✓
├─ R6 (Monetization): Partially retired ✓

By Phase 2 Exit (Scale & Monetization):
├─ R5 (Market Demand): Fully retired ✓
├─ R6 (Monetization): Fully retired ✓
├─ R8 (High Churn): Mitigated ✓
├─ R9 (Competition): Moats building ✓

By Phase 3 Exit (Market Leadership):
├─ R7 (Category): Owned ✓
├─ R9 (Competition): Defended (ongoing) ✓
├─ R1 (Platform): Managed (ongoing) ✓
```

---

## **Appendix A: Roadmap at a Glance**

*(Content from v1.0 - unchanged, but now with phase gates marked)*

---

## **Appendix B: Roadmap Principles Recap**

From "ultrathink" philosophy applied to this roadmap:

1. **Take a deep breath** - We're not rushing. Each phase validates before proceeding. **[Phase gates enforce this]**
2. **Think Different** - Manual upload, privacy-first, category creation (not feature competition).
3. **Obsess Over Details** - Every feature polished, every metric tracked, every user delighted.
4. **Plan Like Da Vinci** - This roadmap is our architectural sketch (clear, reasoned, beautiful). **[Risk burn-down makes progress visible]**
5. **Craft, Don't Code** - Quality over speed, always.
6. **Iterate Relentlessly** - Four iterations per feature (work → right → beautiful → fast).
7. **Simplify Ruthlessly** - Say no to most feature requests. Focus creates excellence.

**This roadmap v1.1 adds:**
- **Phase gates** (discipline for what must be true to proceed)
- **Risk burn-down** (systematic uncertainty reduction)
- **Learning objectives** (what questions we're answering)
- **Kill conditions** (honest about when to stop)

**This transforms the roadmap from a delivery plan to a strategic control instrument.**

---

## **Document Status**

- **Version:** 1.1 (Strategic Control Edition)
- **Date:** December 2025
- **Status:** Living Document (update bi-weekly with learning)
- **Owner:** Product / Engineering
- **Next Review:** End of Phase 0 (Week 2, January 2026)
- **Confidence:** 90% (Phases 0-2 detailed with gates, Phase 3 directional)
- **Maturity:** Strategic control level (was operational level in v1.0)

---

**End of Product Roadmap v1.2 (Strategic Control Edition)**

*"A roadmap is not a promise of features—it's a discipline for learning under uncertainty"*
*"Phase gates enforce what must be true before proceeding"*
*"Risk retirement is more important than feature accumulation"*

*January 2026*
*Visual Social Graph*
