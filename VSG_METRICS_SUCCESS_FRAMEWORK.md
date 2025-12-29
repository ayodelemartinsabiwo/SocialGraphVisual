# **Visual Social Graph: Metrics & Success Framework**
## **North Star Document v1.0**

*"If you can't measure it, you can't improve it. If you measure the wrong thing, you'll optimize for failure."*

---

## **Document Control**

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | Dec 29, 2025 | Initial framework creation | Draft |

**Related Documents:**
- [Product Requirements Document (PRD)](VSG_EXECUTIVE_EDITION_PRD.md) - Product definition
- [Product Strategy](VSG_PRODUCT_STRATEGY.md) - Market positioning and competitive analysis
- [Product Roadmap](VSG_PRODUCT_ROADMAP_EXECUTION.md) - Execution timeline
- [QA Test Plan](VSG_QA_TEST_PLAN.md) - Quality assurance and testing
- [Architecture Document](VSG_ARCHITECTURE_DOCUMENT.md) - Technical implementation
- [System Requirements Specification](VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md) - Functional requirements

**Document Purpose:**
This framework defines HOW we measure success across all dimensions of the Visual Social Graph product. It establishes the canonical source of truth for metrics definitions, measurement methodologies, success thresholds, and decision frameworks.

**Canonical Frameworks Referenced:**
- **North Star Framework** - Product-led growth methodology by Amplitude
- **AARRR (Pirate Metrics)** - Dave McClure's SaaS growth framework
- **Lean Startup** - Eric Ries' validated learning approach
- **OKR (Objectives & Key Results)** - Google's goal-setting framework
- **SaaS Metrics Standards** - Christoph Janz, David Skok frameworks

---

## **0. Metrics Governance & Drift Prevention**

**CRITICAL**: This metrics framework is the SINGLE SOURCE OF TRUTH for all success measurement, reporting, and decision-making. All product decisions, roadmap prioritization, and go/no-go determinations MUST reference this document.

### **0.1 Canonical Metrics Authority**

**Normative Framework (MUST align with):**
- **This document** (`VSG_METRICS_SUCCESS_FRAMEWORK.md`) is authoritative for metric definitions
- **Product Strategy Document** provides market context and competitive benchmarks
- **Product Roadmap** provides phase-specific targets and timelines
- **QA Test Plan** provides instrumentation and measurement implementation

**Hierarchy of Authority:**
```
1. North Star Metric (this document) → Overrides all other metrics
2. Phase-specific OKRs (this document) → Guide quarterly planning
3. Weekly/Daily KPIs (this document) → Inform tactical execution
4. Supporting metrics (this document) → Provide diagnostic context
```

### **0.2 Metrics Governance Rules**

**Rule 1: MUST - Exact Definition Alignment**
- All metric calculations MUST use formulas specified in Section 3 exactly
- NEVER modify metric definitions mid-quarter without formal amendment
- All reporting tools MUST pull from single source of truth (PostHog/Mixpanel)
- Metric drift (redefinition without documentation) is a critical governance violation

**Rule 2: MUST - Measurement Methodology Consistency**
- Data collection MUST follow instrumentation spec (Section 6)
- Cohort definitions MUST remain consistent across reporting periods
- Time windows MUST be defined explicitly (calendar days, UTC timezone)
- Statistical significance MUST be >95% confidence for decisions

**Rule 3: MUST - Success Threshold Integrity**
- Success/failure thresholds defined in Section 4 are IMMUTABLE per phase
- Threshold changes require formal Product/Engineering/Leadership approval
- NEVER cherry-pick metrics to show favorable results
- Report both successes AND failures transparently

**Rule 4: MUST - Decision Framework Discipline**
- Go/No-Go decisions MUST reference Section 5 criteria exclusively
- Pivot thresholds are binding (no "wait and see" beyond defined timelines)
- Data-driven decisions override opinions (founder intuition informs, not overrides)
- All major decisions require metrics documentation trail

**Rule 5: MUST - North Star Primacy**
- When trade-offs exist, North Star Metric wins over secondary metrics
- NEVER optimize for revenue at expense of North Star in Phases 0-2
- Growth hacks that degrade North Star are automatically rejected
- North Star achievement predicts long-term success (validated assumption)

### **0.3 Drift Prevention Mechanisms**

**Weekly Review Protocol:**
```
Every Monday 9 AM:
├─ Review North Star Metric trend (7-day rolling average)
├─ Check for anomalies (>20% week-over-week change)
├─ Verify instrumentation health (event tracking completeness)
├─ Update phase-specific OKR dashboard
└─ Document insights and blockers
```

**Monthly Audit Process:**
```
First Monday of month:
├─ Validate metric definitions haven't drifted (compare to this doc)
├─ Review cohort analysis (retention curves, conversion funnels)
├─ Assess progress against phase targets (Section 4)
├─ Update forecast models (ARR, user growth projections)
├─ Generate stakeholder report (executive summary format)
└─ Decision checkpoint: Are we on track? Do we need to pivot?
```

**Quarterly Metrics Governance Review:**
```
End of quarter:
├─ Full framework audit (this document vs. implementation)
├─ Metric definition amendments (if needed, with justification)
├─ Success threshold calibration (based on learned reality)
├─ Tool evaluation (PostHog, Mixpanel, analytics stack fitness)
├─ Amendment changelog (version control for this document)
└─ Next quarter OKR setting (based on current quarter learnings)
```

### **0.4 When Metrics Conflict with Reality**

**If actual performance diverges significantly from targets:**

**DO:**
- ✅ Investigate root causes (user interviews, cohort analysis, funnel deep-dive)
- ✅ Document learnings (what assumptions were wrong?)
- ✅ Adjust targets for future phases (but NOT current phase mid-flight)
- ✅ Execute pivot if failure thresholds met (Section 5.4)
- ✅ Update this document with amendment notes (version control)

**DON'T:**
- ❌ Change metric definitions to make numbers look better
- ❌ Ignore failure signals and "wait one more month"
- ❌ Optimize for vanity metrics (signups) over North Star
- ❌ Blame external factors without data evidence
- ❌ Continue bad strategy because "we already started"

**Conflict Resolution Hierarchy:**
1. **Data wins over opinions** (when statistically significant)
2. **North Star wins over secondary metrics** (when trade-offs exist)
3. **Long-term value wins over short-term revenue** (Phases 0-2)
4. **User outcomes win over product usage** (strategy-grade metrics, Section 2.3)
5. **This document wins over verbal decisions** (unless formally amended)

---

## **1. Executive Summary: Why This Framework Exists**

### **1.1 The Problem with Traditional SaaS Metrics**

Most SaaS products measure:
- **Usage**: DAU, MAU, session length
- **Engagement**: Feature adoption, clicks, screen views
- **Retention**: Churn rate, LTV, cohort curves
- **Revenue**: MRR, ARR, ARPU, CAC

**These metrics are necessary but insufficient for Visual Social Graph.**

**Why?** Because we're not building a typical SaaS product. We're building a **Personal Network Intelligence** platform that should:
1. **Change user behavior** (not just track it)
2. **Improve decision quality** (not just provide data)
3. **Increase strategic clarity** (not just show pretty graphs)
4. **Create category adoption** (PNI as a new software category)

Traditional metrics tell us **IF** people use the product, but NOT:
- ❌ Whether insights drive better decisions
- ❌ Whether users' network behavior becomes more intentional
- ❌ Whether strategic clarity increases over time
- ❌ Whether the Personal Network Intelligence category is succeeding

### **1.2 Our Metrics Philosophy**

**Three-Tier Measurement System:**

**Tier 1: Product Metrics (Table Stakes)**
- Standard SaaS metrics (DAU, retention, MRR)
- Tell us if product is functional and growing
- Necessary for operational health
- Section 3: Core Metrics Framework

**Tier 2: Strategy-Grade Metrics (Differentiator)**
- Decision impact metrics (confidence increase, action rate)
- Behavioral change metrics (network intentionality)
- Strategic clarity metrics (self-awareness improvement)
- Section 2: Strategic Success Metrics

**Tier 3: Category Metrics (Long-term Vision)**
- Market adoption (PNI category awareness)
- Competitive positioning (privacy-first preference)
- Ecosystem development (integrations, partnerships)
- Section 2.4: Category-Level Success

### **1.3 North Star Metric (The One Metric That Rules Them All)**

**Definition:**
```
"Users who achieve their 'aha moment' within 7 days of signup"
```

**Why this metric?**
- ✅ Predicts retention (80% correlation from validation)
- ✅ Balances user effort with product value delivery
- ✅ Actionable (can optimize each step of funnel)
- ✅ Measures actual value delivery (not vanity metric)
- ✅ Aligns entire team (engineering, product, marketing)

**"Aha Moment" Defined (MUST meet ALL criteria within 7 days):**
1. ✅ Uploaded ≥1 platform's data (commitment signal)
2. ✅ Explored visualization ≥3 minutes (engagement signal)
3. ✅ Viewed ≥2 different insight views (value discovery signal)
4. ✅ Generated ≥1 strategic insight (value delivery signal)
5. ✅ Exported, shared, or saved something (value extraction signal)

**Target:** 40% of signups achieve aha moment within 7 days

**Current Assumptions:**
- Assumption validated in Phase 0 with 4/5 test users (80%)
- Production target conservative at 40% to account for self-selection bias
- Threshold for failure: <20% (would indicate fundamental product-market fit issue)

### **1.4 How to Use This Document**

**For Product/Engineering:**
- Section 3: Core metrics to instrument and track
- Section 6: Instrumentation specification
- Section 4: Phase-specific success criteria for roadmap planning

**For Leadership/Founders:**
- Section 1.3: North Star Metric (weekly check-in)
- Section 5: Decision frameworks (go/no-go, pivot criteria)
- Section 4: Phase targets and failure signals

**For Marketing/Growth:**
- Section 3.1: Acquisition metrics and channel performance
- Section 3.5: Viral coefficient and referral tracking
- Section 4: Conversion targets by phase

**For Investors/Board:**
- Section 2: Strategic success metrics (differentiation)
- Section 3.3: Revenue and unit economics
- Section 5: Risk mitigation and validation plan

---

## **2. Strategic Success Metrics (Beyond Product Metrics)**

### **2.1 Why We Need Strategy-Grade Metrics**

**Visual Social Graph is an intelligence product, not just a software tool.**

**Intelligence products succeed when they:**
1. Improve decision quality
2. Change user behavior
3. Increase strategic clarity
4. Create competitive advantage for users

**Therefore, we measure:**
- Decision impact (do users make better choices?)
- Behavioral change (do users act more intentionally?)
- Strategic clarity (do users understand themselves better?)
- Category adoption (is PNI becoming a recognized category?)

### **2.2 Tier 1: Decision Impact Metrics**

#### **Metric 2.2.1: Decision Confidence Increase**

**Definition:**
Change in user confidence about strategic decisions before vs. after using Visual Social Graph.

**Measurement Methodology:**
```
Step 1: Baseline Survey (on signup)
Question: "How confident are you about your social media strategy?"
Scale: 1 (not confident) to 10 (very confident)

Step 2: Follow-up Survey (30 days post-signup)
Question: "How confident are you now about your social media strategy?"
Scale: 1 (not confident) to 10 (very confident)

Step 3: Calculation
Confidence Δ = Average(30-day score) - Average(baseline score)

Step 4: Segmentation
├─ By user segment (micro-influencers vs. professionals)
├─ By insight type exposed to (positioning, engagement, growth)
├─ By platforms analyzed (single vs. multi-platform)
└─ By usage intensity (power users vs. light users)
```

**Targets:**
- **Success Target**: +2.5 point increase (e.g., 5.5 → 8.0)
- **Minimum Viable**: +2.0 point increase
- **Failure Threshold**: +1.0 or less (product not delivering strategic value)

**Validation Controls:**
- Control for Dunning-Kruger effect (false confidence from ignorance)
- Qualitative follow-up: "Why are you more confident?"
- Correlate with action completion rate (confidence must lead to action)
- Track confidence sustainability (does it hold at 90 days?)

**Dashboard Tracking:**
```
Weekly:
├─ Overall confidence delta (all users)
├─ Cohort analysis (by signup week)
├─ Segment breakdown (creators vs. professionals)
└─ Correlation with North Star achievement

Monthly:
├─ Trend analysis (improving or degrading over time?)
├─ Confidence persistence (30-day vs. 60-day vs. 90-day)
├─ Action correlation (does confidence predict action?)
└─ Churn correlation (do low-confidence users churn more?)
```

**Why This Matters:**
- Product-market fit signal (if confidence doesn't increase, insights aren't useful)
- Category validation (PNI should increase strategic clarity)
- Differentiation measure (vs. analytics tools that increase data volume, not confidence)

---

#### **Metric 2.2.2: Insight-Driven Action Rate**

**Definition:**
Percentage of users who take strategic action directly attributable to a Visual Social Graph insight within 30 days.

**Measurement Methodology:**
```
Step 1: Insight Exposure Tracking
├─ Log: When user views specific insight (timestamp, insight ID)
├─ Categorize: Insight type (network management, content strategy, collaboration, positioning)
└─ Confidence level: High/Medium/Low (per insight card)

Step 2: Action Attribution Tracking
Mechanism A: In-App Self-Reporting
├─ UI: "I took action on this insight" button on insight cards
├─ Follow-up: "What did you do?" (free text + categorized actions)
└─ Timestamp: When action was marked complete

Mechanism B: Behavioral Detection (future enhancement)
├─ Detect: Engagement spike with recommended accounts
├─ Detect: Content topic shift aligned with insights
└─ Confidence: Probabilistic attribution (requires baseline comparison)

Mechanism C: Survey-Based Attribution
├─ 30-day email: "Which insights did you act on?"
├─ Present: List of insights user was exposed to
└─ Select: Multiple choice + "Other"

Step 3: Calculation
Action Rate = (Users who took ≥1 attributed action / Users who saw ≥1 insight) × 100

Step 4: Segmentation
├─ By insight type (which drive most action?)
├─ By confidence level (do high-confidence insights → higher action?)
├─ By user segment (who acts most on insights?)
└─ By time to action (immediate vs. delayed)
```

**Targets:**
- **Success Target**: 40% of users take action on ≥1 insight within 30 days
- **Minimum Viable**: 30%
- **Failure Threshold**: <20% (insights aren't actionable enough)

**Action Types Tracked:**
```
1. Network Management Actions:
   ├─ Follow/unfollow based on bridge account insight
   ├─ Engage with super-fan accounts (respond to comments)
   ├─ Prune ghost followers (unfollow non-engagers)
   └─ Connect with collaboration opportunities

2. Content Strategy Actions:
   ├─ Shift topic focus (aligned with resonance insights)
   ├─ Adjust posting frequency (based on engagement patterns)
   ├─ Change content tone (formal vs. casual based on audience)
   └─ Cross-post strategy (leverage multi-platform insights)

3. Positioning Actions:
   ├─ Update bio/profile (reflect strategic positioning)
   ├─ Join communities (expand network deliberately)
   ├─ Shift platform allocation (focus time where positioned best)
   └─ Professional decisions (speaking, partnerships, collaborations)

4. Collaboration Actions:
   ├─ Reach out to bridge accounts (partnership inquiry)
   ├─ Co-create content (based on shared audience insights)
   ├─ Cross-promotion (strategic audience overlap)
   └─ Event participation (based on community insights)
```

**Dashboard Tracking:**
```
Real-time:
├─ Action rate by insight type (which insights drive action?)
├─ Action completion time distribution (immediate vs. delayed)
├─ Self-reported action success rate (did it work?)
└─ Non-action reasons ("Why didn't you act?" survey)

Weekly:
├─ Action rate trend (improving over time?)
├─ Cohort analysis (early users vs. recent signups)
├─ Power user identification (users taking 3+ actions)
└─ Insight effectiveness ranking (by action rate)

Monthly:
├─ Long-term action outcomes (did actions improve metrics?)
├─ Action-to-retention correlation (do acting users retain better?)
├─ Insight type optimization (double down on high-action insights)
└─ Product iteration signals (why low-action insights fail)
```

**Why This Matters:**
- Value delivery proof (insights must drive action, not just awareness)
- Product iteration signal (which insights are most vs. least actionable)
- ROI justification (users pay for insights that change behavior, not just information)
- Engagement predictor (users who act are more likely to retain)

---

#### **Metric 2.2.3: Strategic Decision Outcome Score**

**Definition:**
User-reported success of decisions made based on Visual Social Graph insights, measured over 30, 60, and 90-day windows.

**Measurement Methodology:**
```
Step 1: Decision Commitment Tracking
├─ User marks insight as "Acting on this"
├─ User describes decision (free text: "What are you going to do?")
├─ System tags decision type (collaboration, content, network, positioning)
└─ Timestamp recorded

Step 2: Outcome Follow-up Surveys
30-day follow-up:
Question: "You decided to [user's decision]. How did it work out?"
Scale: -2 (much worse) to +2 (much better), with 0 = no change
Optional: "Tell us more" (qualitative feedback)

60-day follow-up:
Question: "Looking back, was [decision] the right strategic choice?"
Scale: -2 (regret it) to +2 (very glad I did it)
Optional: "What would you do differently?"

90-day follow-up:
Question: "Did [decision] have lasting impact on your network/career?"
Scale: -2 (negative impact) to +2 (significant positive impact)
Optional: "Measurable outcomes?" (follower growth, opportunities, etc.)

Step 3: Calculation
Outcome Score = Average of all outcome ratings (weighted by time window)
├─ 30-day weight: 50% (immediate outcomes)
├─ 60-day weight: 30% (strategic validation)
└─ 90-day weight: 20% (long-term impact)

Step 4: Control Group (if possible)
├─ Track users who saw insight but didn't act (counterfactual)
├─ Compare outcomes for similar decisions made without VSG
└─ Calculate attribution confidence (VSG impact vs. external factors)
```

**Targets:**
- **Success Target**: +1.2 average outcome score (users report positive outcomes)
- **Minimum Viable**: +0.8
- **Failure Threshold**: +0.3 or less (insights don't lead to better outcomes)

**Decision Types Tracked:**
```
1. Collaboration Decisions:
   ├─ Who to partner with (co-create content, cross-promote)
   ├─ What communities to join (based on positioning insights)
   └─ Which events to attend/speak at (strategic network expansion)

2. Content Strategy Decisions:
   ├─ What topics to focus on (based on resonance insights)
   ├─ What tone/style to adopt (based on audience analysis)
   ├─ What frequency to post (based on engagement patterns)
   └─ What platforms to prioritize (based on ROI analysis)

3. Network Pruning Decisions:
   ├─ Who to unfollow (ghost followers, negative influences)
   ├─ What communities to leave (echo chambers, low-value)
   └─ What platforms to deprioritize (poor positioning)

4. Professional Decisions:
   ├─ Job changes (based on professional network insights)
   ├─ Speaking opportunities (audience alignment)
   ├─ Partnership opportunities (shared network overlap)
   └─ Product launches (audience readiness, positioning)
```

**Long-term Outcome Tracking:**
```
30-day outcomes (Immediate):
├─ Did the action work as intended?
├─ Were there unexpected consequences?
├─ Would you do it again?
└─ Quick wins vs. setbacks

60-day outcomes (Strategic):
├─ Was it the right decision looking back?
├─ Did it align with long-term goals?
├─ What did you learn from this decision?
└─ Strategic fit vs. tactical fit

90-day outcomes (Impact):
├─ Measurable results (follower growth, engagement, opportunities)
├─ Career/business impact (deals closed, partnerships formed)
├─ Life impact (satisfaction, clarity, confidence)
└─ Would you recommend this decision to others?

365-day outcomes (Legacy - future)
├─ Life-changing impact assessment
├─ Attribution to VSG (how much credit does VSG get?)
├─ Compounding effects (one decision → cascade of outcomes)
└─ Testimonial-worthy stories (case study material)
```

**Dashboard Tracking:**
```
Weekly:
├─ New decisions tracked (commitment rate)
├─ 30-day outcome survey completion rate
├─ Average outcome score (rolling 7-day)
└─ Outcome distribution (histogram of -2 to +2)

Monthly:
├─ Outcome score by decision type (which decisions work best?)
├─ Outcome score by user segment (who benefits most?)
├─ Regret rate (% with negative outcomes)
├─ Success stories (qualitative highlights for marketing)
└─ Time-to-outcome analysis (how long until users see results?)

Quarterly:
├─ Long-term outcome validation (90-day scores)
├─ Outcome persistence (do 30-day wins sustain?)
├─ Attribution modeling (VSG contribution vs. external factors)
├─ Case study pipeline (identify testimonial candidates)
└─ Product feedback loop (why do some decisions fail?)
```

**Why This Matters:**
- Ultimate validation (do insights actually improve real-world outcomes?)
- Long-term value proof (justify subscription renewal at month 12)
- Category credibility (PNI must deliver real strategic value, not just pretty graphs)
- Differentiation (competitors provide data, we provide outcomes)

---

### **2.3 Tier 2: Behavioral Change Metrics**

#### **Metric 2.3.1: Network Intentionality Index**

**Definition:**
Degree to which user's network actions become more deliberate (strategic vs. random) over time, measured 0-100 scale.

**Conceptual Framework:**
```
Low Intentionality (0-30):
├─ Random following/unfollowing
├─ No apparent strategy in network building
├─ Reactive engagement (only respond to notifications)
└─ Platform usage driven by boredom, not goals

Medium Intentionality (31-70):
├─ Some strategic choices (follow thought leaders in niche)
├─ Occasional deliberate engagement (reach out to potential collaborators)
├─ Platform allocation somewhat strategic
└─ Mix of reactive and proactive behavior

High Intentionality (71-100):
├─ All network actions align with stated goals
├─ Proactive engagement with strategic accounts
├─ Deliberate community participation
├─ Consistent execution of network strategy
└─ Regular reflection and adjustment
```

**Measurement Methodology:**
```
Baseline (Before VSG):
├─ Survey: "How strategic are your social media actions?" (1-10)
├─ Behavioral proxy: Variance in engagement patterns (high variance = random)
├─ Network composition: Homogeneity vs. diversity (random = homogeneous)
└─ Engagement reciprocity: Do they engage back? (random = low reciprocity)

Post-VSG (After insights exposure):
├─ Track: Action-insight alignment (do actions match recommendations?)
├─ Track: Strategic consistency (do actions align with stated goals?)
├─ Survey: "Do you feel more intentional about your network?" (1-10)
└─ Behavioral: Variance reduction (more consistent = more intentional)

Calculation:
Intentionality Index = Weighted average of:
├─ Action-insight alignment (40% weight)
├─ Strategic consistency (30% weight)
├─ Self-reported intentionality (20% weight)
└─ Behavioral variance reduction (10% weight)

Normalize to 0-100 scale
```

**Intentionality Signals (Behavioral Proxies):**
```
High Intentionality Signals:
✅ Follows accounts recommended by VSG insights (bridge accounts, thought leaders)
✅ Unfollows ghost followers systematically (network pruning)
✅ Engages with super-fan accounts consistently
✅ Posts content aligned with resonance insights
✅ Participates in communities strategically (not randomly)
✅ Adjusts strategy based on quarterly VSG refresh

Low Intentionality Signals:
❌ Follows random accounts (no strategic pattern)
❌ Never unfollows (accumulation without curation)
❌ Engagement driven only by notifications (reactive)
❌ Content topics shift randomly (no strategic focus)
❌ Never revisits VSG insights (one-and-done usage)
❌ No observable behavior change post-insights
```

**Targets:**
- **Success Target**: Average intentionality index increases from 45 (baseline) to 72 (post-VSG at 90 days)
- **Minimum Viable**: Increase of +20 points
- **Failure Threshold**: Increase of <10 points (VSG not changing behavior)

**Dashboard Tracking:**
```
Weekly:
├─ Average intentionality index (cohort of users at 30+ days)
├─ Distribution curve (how many high vs. low intentionality users?)
├─ Correlation with North Star (do high-intentionality users hit aha moment?)
└─ Power user identification (intentionality index >80)

Monthly:
├─ Intentionality trend (improving over time?)
├─ Behavioral signal analysis (which signals predict high intentionality?)
├─ Segment analysis (creators vs. professionals)
├─ Action-insight alignment rate (are users following recommendations?)
└─ Variance analysis (are engagement patterns becoming more consistent?)

Quarterly:
├─ Long-term intentionality persistence (does it sustain?)
├─ Network outcomes for high-intentionality users (follower quality, engagement)
├─ Case studies (qualitative interviews with high-index users)
└─ Product feedback (what features helped increase intentionality?)
```

**Why This Matters:**
- Behavioral change proof (VSG should make users more strategic, not just informed)
- Category validation (PNI creates intentional network builders)
- Retention predictor (intentional users likely retain longer)
- Differentiation (analytics tools inform, we transform behavior)

---

#### **Metric 2.3.2: Self-Awareness Improvement Score**

**Definition:**
Increase in user's accurate understanding of their own network positioning, audience, and influence.

**Measurement Methodology:**
```
Step 1: Baseline Self-Assessment (Pre-VSG)
Survey questions (1-10 scale):
1. "How well do you understand your network's structure?" (1 = not at all, 10 = completely)
2. "How accurately can you identify your most engaged followers?"
3. "How confident are you about your positioning in your niche?"
4. "How well do you know which content resonates most?"
5. "How aware are you of collaboration opportunities in your network?"

Calculate: Baseline Self-Awareness Score (average of 5 questions)

Step 2: VSG Insight Exposure
├─ User uploads data, explores visualization
├─ Views insights (positioning map, engagement circles, etc.)
├─ Generates strategic insights
└─ Spends time exploring network structure

Step 3: Post-VSG Assessment (30 days)
Repeat same 5 questions
Calculate: Post-VSG Self-Awareness Score

Additionally:
6. "Did Visual Social Graph show you something you didn't know?" (Yes/No)
7. "What surprised you most?" (Free text)
8. "How has your understanding of your network changed?" (Free text)

Step 4: Accuracy Validation (Objective Reality Check)
├─ Compare: User's self-assessment vs. actual data
├─ Example: User says "I think 20% of my followers engage" → Actual = 8%
├─ Calculate: Self-awareness accuracy (how close are perceptions to reality?)
└─ Track: Does VSG reduce perception-reality gap?

Step 5: Calculation
Self-Awareness Improvement = (Post-score - Baseline score) + Accuracy improvement bonus
```

**Targets:**
- **Success Target**: +2.5 point increase in self-awareness score (e.g., 6.2 → 8.7)
- **Accuracy Target**: Perception-reality gap reduces by 50% (e.g., 30% gap → 15% gap)
- **Surprise Target**: >70% say "VSG showed me something I didn't know"
- **Failure Threshold**: <+1.0 improvement or no gap reduction (VSG not adding insight)

**Surprise Insights Tracking (Qualitative):**
```
Common "Aha" Moments (from user interviews):
├─ "I had no idea I was in an echo chamber"
├─ "I didn't realize [person] was a super-fan"
├─ "I thought my content resonated, but it's actually only with 5% of followers"
├─ "I'm positioned totally wrong in my niche"
├─ "I've been wasting time on ghost followers"
├─ "I didn't see the collaboration opportunity with [bridge account]"
└─ "My network is way more homogeneous than I thought"

Categorize insights:
1. Network structure surprises (echo chambers, communities, isolation)
2. Engagement reality checks (super-fans vs. ghosts)
3. Positioning revelations (where I sit in my niche)
4. Content resonance mismatches (what I think works vs. what actually works)
5. Opportunity blindness (missed collaborations, bridge accounts)
```

**Dashboard Tracking:**
```
Weekly:
├─ Average self-awareness improvement (cohort at 30+ days)
├─ Surprise insight rate (% who learned something new)
├─ Most common surprises (categorized)
└─ Perception-reality gap reduction

Monthly:
├─ Self-awareness improvement by segment (creators vs. professionals)
├─ Correlation with action rate (does awareness → action?)
├─ Qualitative insight themes (text analysis of "what surprised you?")
├─ Testimonial pipeline (identify great "aha" stories)
└─ Product feedback (which insights drive most awareness?)

Quarterly:
├─ Long-term awareness persistence (does insight stick?)
├─ Re-assessment at 90 days (do users maintain awareness or regress?)
├─ Network outcome correlation (does awareness → better outcomes?)
└─ Case study development (in-depth user stories)
```

**Why This Matters:**
- Core value proposition ("See Your Digital Self" - must actually reveal hidden truths)
- Product-market fit indicator (if no surprises, product isn't adding value)
- Category validation (PNI should create "mirror for digital soul")
- Retention predictor (self-aware users understand ongoing value)

---

### **2.4 Tier 3: Category-Level Success Metrics**

#### **Metric 2.4.1: Personal Network Intelligence (PNI) Category Awareness**

**Definition:**
Market recognition of "Personal Network Intelligence" as a distinct software category (vs. "social media analytics").

**Measurement Methodology:**
```
Search Volume Tracking:
├─ Google Trends: "Personal Network Intelligence" (monthly search volume)
├─ Google Trends: "PNI software" OR "network intelligence tool"
├─ Keyword tracking: VSG-related terms vs. competitor terms
└─ Target: 10x increase in PNI-related searches by Month 12

Media Coverage Tracking:
├─ Category mentions: Articles/podcasts discussing PNI as category
├─ VSG positioning: % of coverage that calls VSG "PNI tool" vs. "social analytics"
├─ Thought leadership: Guest posts, podcast appearances defining PNI
└─ Target: 20+ category-defining articles by Month 12

Competitive Positioning:
├─ Competitor response: Do competitors start using "PNI" language?
├─ Differentiation clarity: Do users understand VSG ≠ social analytics?
├─ Survey: "What category is Visual Social Graph in?" (open text)
└─ Target: >60% identify VSG as PNI (not social media analytics)

Community Formation:
├─ Subreddit/forum: "Personal Network Intelligence" community size
├─ LinkedIn hashtag: #PersonalNetworkIntelligence usage growth
├─ User-generated content: Blog posts, videos about PNI concept
└─ Target: 500+ community members by Month 12
```

**Targets:**
- **Month 6**: 100+ monthly searches for "Personal Network Intelligence"
- **Month 12**: 1,000+ monthly searches, 20+ category articles, 60% correct categorization
- **Month 24**: Category established, competitors using PNI language

**Why This Matters:**
- Category creation is massive competitive moat (first-mover advantage)
- Premium pricing justified (new categories command higher willingness to pay)
- Market education (when category exists, sales/marketing becomes easier)
- Long-term defensibility (hard to compete against category definer)

---

#### **Metric 2.4.2: Privacy-First Preference Rate**

**Definition:**
Percentage of users who explicitly prefer manual upload (privacy-first) over API/OAuth account access.

**Measurement Methodology:**
```
Survey (at signup):
Question: "If we offered automatic account sync (connect your accounts), would you prefer that over manual upload?"
Options:
├─ "Yes, automatic would be better" (convenience preference)
├─ "No, I prefer manual upload for privacy" (privacy preference)
├─ "I'd want both options available" (flexibility preference)
└─ "Not sure / Doesn't matter to me"

Calculate:
Privacy-First Preference % = ("No, prefer manual" / Total responses) × 100

Track by segment:
├─ By demographic (age, profession)
├─ By platform (Twitter users vs. LinkedIn users)
├─ By region (GDPR regions vs. non-GDPR)
└─ By tech-savviness (self-reported)

Follow-up (30 days):
Question: "Now that you've used manual upload, do you still prefer it over automatic?"
Options: Same as above

Calculate:
Sustained Privacy Preference % = % who still prefer manual after using product
```

**Targets:**
- **Signup Preference**: >70% prefer manual for privacy
- **Sustained Preference** (30 days): >60% still prefer manual
- **Failure Threshold**: <50% prefer manual (core assumption invalidated, consider pivot)

**Why This Matters:**
- Core assumption validation (is privacy-first a moat or a weakness?)
- Competitive differentiation (if true preference, massive advantage)
- Pivot signal (if false, may need to add OAuth option)
- Brand positioning (informs "We don't connect to your accounts" messaging)

---

## **3. Core Product Metrics (Standard SaaS Framework)**

### **3.1 Acquisition Metrics (AARRR: Acquisition)**

#### **3.1.1 Top-of-Funnel Metrics**

**Landing Page Performance:**
```
Landing page unique visitors
├─ Target: 10,000/month by Month 3, 50,000/month by Month 6
├─ Segmentation: By traffic source (organic, social, referral, paid)
└─ Tracking: Google Analytics, Plausible

Landing page → Signup conversion rate
├─ Target: 15%
├─ Failure threshold: <8% (messaging/value prop unclear)
├─ A/B test: Headlines, hero images, social proof
└─ Tracking: PostHog funnel analysis

Time on landing page
├─ Target: >45 seconds (enough to read value prop)
├─ Engagement signal: Scroll depth >60%
└─ Bounce rate: <60%
```

**Traffic Source Mix:**
```
Phase 1 (Months 1-3):
├─ Organic search: 10% (SEO just starting)
├─ Social (organic): 40% (Twitter, Reddit, HN)
├─ Referral: 20% (Product Hunt, tech blogs)
├─ Direct: 20% (word-of-mouth, returning visitors)
└─ Paid: 10% (if testing acquisition channels)

Phase 2 (Months 4-6):
├─ Organic search: 25% (SEO maturing)
├─ Social (organic): 30% (viral loops kicking in)
├─ Referral: 25% (partnerships, integrations)
├─ Direct: 15% (brand recognition)
└─ Paid: 5% (only if LTV:CAC >3:1)

Phase 3 (Months 7-12):
├─ Organic search: 40% (SEO dominance)
├─ Social (organic): 20% (sustainable virality)
├─ Referral: 20% (ecosystem growth)
├─ Direct: 15% (brand strength)
└─ Paid: 5% (optimization only)
```

**Channel-Specific Targets:**
```
Organic Search:
├─ Target keywords: "social network visualization", "see your network", "personal network intelligence"
├─ Ranking target: Top 10 for 20+ keywords by Month 6
├─ Content strategy: 50+ SEO-optimized articles by Month 6
└─ Traffic target: 10,000 organic visitors/month by Month 6

Social (Organic):
├─ Twitter: 100 tweets/month, 10,000 impressions/tweet target
├─ Reddit: Top post in r/dataisbeautiful, r/SideProject, r/SocialMedia (1x each)
├─ Hacker News: Front page 3x (Show HN, Launch HN, Updates)
└─ LinkedIn: 20 posts/month, 5,000 impressions/post target

Referral:
├─ Product Hunt: Top 5 launch, 500+ upvotes, 2,000 visitors
├─ Tech blogs: 10+ feature articles by Month 6
├─ Influencer mentions: 20+ micro-influencers share VSG
└─ Partnership traffic: 5+ integration partners by Month 12

Direct:
├─ Brand recognition: 1,000+ direct visitors/month by Month 6
├─ Returning visitors: 30% of direct traffic
└─ URL recall: "visualsocialgraph.com" is memorable, typeable
```

#### **3.1.2 Paid Acquisition (If Applicable)**

**Cost Per Acquisition (CPA):**
```
Target: <$30 per user
├─ Free tier users: <$20 CPA
├─ Paid tier users: <$100 CPA (higher LTV justifies higher CAC)
└─ Failure threshold: >$50 CPA with <$12 ARPU (unit economics broken)

Channels (test in order):
1. Twitter Ads (targeting creators, influencers)
2. LinkedIn Ads (targeting professionals, thought leaders)
3. Reddit Ads (targeting niche communities)
4. Google Search Ads (targeting intent keywords)
5. Facebook/Instagram Ads (creative-heavy campaigns)
```

**LTV:CAC Ratio:**
```
Target: >3:1 (industry standard for healthy SaaS)
├─ Phase 1: Don't optimize (focus on product, not paid growth)
├─ Phase 2: Test at small scale ($500/month budget)
├─ Phase 3: Scale if LTV:CAC >3:1, otherwise stay organic
└─ Failure signal: <1.5:1 LTV:CAC (burning cash, unsustainable)

Payback Period:
Target: <6 months
├─ Calculate: CAC / (ARPU × Gross Margin)
├─ Example: $30 CAC / ($10 ARPU × 80% margin) = 3.75 months ✅
└─ Failure threshold: >12 months (too long to recover acquisition cost)
```

---

### **3.2 Activation Metrics (AARRR: Activation)**

#### **3.2.1 Signup → First Upload Funnel**

**Signup Completion Rate:**
```
Target: 60% of signup attempts complete (email verified, account created)
├─ Drop-off points: Email verification (10%), password creation (5%), CAPTCHA (3%)
├─ Optimization: Passwordless login, social sign-on, progressive profiling
└─ Tracking: PostHog funnel (signup_start → signup_complete)

Time to First Upload:
Target: <24 hours
├─ Ideal: Within first session (<5 minutes)
├─ Acceptable: Within 24 hours
├─ Problem: >48 hours (users lose motivation)
└─ Activation email: "Ready to see your network? Upload takes 2 minutes"

Upload Abandonment Rate:
Target: <20%
├─ Drop-off points: Download instructions (8%), file selection (5%), upload wait (7%)
├─ Optimization: Guided onboarding, wait-time engagement, progress indicators
└─ Recovery: Email campaign "Complete your upload and unlock insights"
```

**Platform-Specific Upload Rates:**
```
Twitter:
├─ Download difficulty: MEDIUM (requires Settings → Your Account → Download archive)
├─ Wait time: 24 hours (Twitter sends email when ready)
├─ Target upload rate: 50% of signups
├─ Optimization: Video tutorial, wait-time engagement ("Explore sample while you wait")

Instagram:
├─ Download difficulty: EASY (Settings → Security → Download Data)
├─ Wait time: 48 hours
├─ Target upload rate: 40% (longer wait time)
├─ Optimization: Multi-step email nurture during wait

LinkedIn:
├─ Download difficulty: EASY (Settings → Data Privacy → Get a copy of your data)
├─ Wait time: 10 minutes - 24 hours
├─ Target upload rate: 55% (faster wait time)
├─ Optimization: "Start with LinkedIn" recommendation

Facebook:
├─ Download difficulty: MEDIUM (Settings → Your Facebook Information → Download)
├─ Wait time: Variable (minutes to days)
├─ Target upload rate: 35% (large files, privacy concerns)
├─ Optimization: Selective download guide (just connections, not all data)

TikTok:
├─ Download difficulty: EASY (Settings → Privacy → Download your data)
├─ Wait time: 2-4 days
├─ Target upload rate: 30% (newer platform, less creator focus)
├─ Optimization: Defer to Phase 2 unless user requests
```

#### **3.2.2 Upload → Visualization Funnel**

**Parser Success Rate:**
```
Target: >95% of uploads successfully parsed
├─ Twitter parser: >95%
├─ Instagram parser: >95%
├─ LinkedIn parser: >98% (more structured data)
├─ Facebook parser: >90% (complex format)
├─ TikTok parser: >92% (evolving format)

Tracking:
├─ Error types: Format version mismatch, corrupted files, incomplete archives
├─ Degradation strategy: Partial parse (show what works, flag what doesn't)
└─ User feedback loop: "Upload failed? Send us your file for investigation"

Failure response:
├─ <24 hour fix deployment for platform format changes
├─ Email affected users with timeline
├─ Compensation: Free Pro month for affected users
└─ Status page transparency (communicate issues openly)
```

**Upload → Complete Visualization:**
```
Target: 80% of successful uploads → complete visualization
├─ Drop-off points: Performance issues (5%), browser crashes (3%), user abandonment (12%)
├─ Time target: <60 seconds from upload to first render
├─ Optimization: Progressive rendering, skeleton screens, engagement during load

Visualization Load Abandonment:
Target: <10%
├─ Causes: Too slow (>60 sec), browser crash, cognitive overload
├─ Mitigation: Performance optimization, progressive reveal, guided first experience
└─ Tracking: PostHog event (upload_complete → visualization_rendered → visualization_explored)
```

#### **3.2.3 Visualization → "Aha Moment" Funnel**

**First Visualization → 3+ Minute Exploration:**
```
Target: 50% of users who see visualization explore for 3+ minutes
├─ Engagement signals: Pan/zoom interactions, node clicks, view switching
├─ Failure signals: <30 seconds (immediate bounce), no interactions (passive viewing)
├─ Optimization: Guided reveal (Stage 1: Center → Stage 5: Full control), tooltips, prompts

Views Per Session:
Target: 2.5 insight views per session
├─ Primary view: Network Graph (100% see this)
├─ Secondary views: Positioning Map (60%), Engagement Circles (50%), Growth Opportunities (40%)
├─ Optimization: Contextual prompts ("Want to see where you're positioned?")

Insight Generation:
Target: 3 strategic insights generated per user (first session)
├─ Insight types: Positioning, engagement quality, echo chamber, collaboration opportunities
├─ Confidence levels: High/Medium/Low (tracked separately)
├─ Tracking: Which insights drive "aha moment"? (correlation analysis)

Export/Share Action:
Target: 30% take action (export PDF, share card, save visualization)
├─ Export PDF: 20%
├─ Social share: 15% (viral loop)
├─ Save/bookmark: 10%
└─ Value extraction signal: Taking action = perceived value
```

---

### **3.3 Revenue Metrics (AARRR: Revenue)**

#### **3.3.1 Conversion Metrics**

**Free → One-Time Report:**
```
Target: 5% of free users purchase one-time report ($12)
├─ Timing: Within first 7 days (while value is fresh)
├─ Trigger: "Export professional PDF report for $12" CTA
├─ Conversion point: After aha moment (value demonstrated)
└─ Use case: Users who want report but not ongoing subscription

Free → Pro Monthly:
Target: 3-5% of free users convert to Pro ($12/month)
├─ Timing: 30-60 days (after they see value, before they churn)
├─ Triggers: Hit free tier limits (1 platform), want historical tracking, multi-platform
├─ Optimization: Trial period (7 days free Pro), feature gating, upgrade prompts
└─ Use case: Active users who need ongoing insights

Free → Pro Annual:
Target: 1-2% of free users convert to annual ($120/year, ~$10/month)
├─ Timing: After 90 days (highly engaged users)
├─ Discount: 17% savings vs. monthly ($120 vs. $144)
├─ Optimization: Annual-only features, early access, priority support
└─ Use case: Committed users who want best value

One-Time → Pro Upgrade (90 days):
Target: 15-20% of one-time purchasers upgrade to Pro within 90 days
├─ Nurture campaign: Monthly emails with new features, insights
├─ Discount offer: $5 off first month ($7 instead of $12)
├─ Use case: Users who bought report, returned for update, realized ongoing value
└─ This is critical funnel (one-time is gateway drug to subscription)

Pro → Creator:
Target: 10% of Pro users upgrade to Creator ($29/month)
├─ Timing: After 6 months on Pro
├─ Triggers: Team features needed, white-label desired, API access requested
├─ Use case: Professionals, agencies, power users
└─ Phase 3 focus (don't optimize early)
```

**Conversion Funnel Summary:**
```
1,000 Free Signups →
├─ 50 One-Time Purchases (5%) → $600 revenue
│   └─ 8 Upgrade to Pro within 90 days (15%) → $96/month recurring
├─ 40 Pro Monthly (4%) → $480/month recurring
├─ 15 Pro Annual (1.5%) → $150/month effective recurring
└─ Total: $726/month MRR from 1,000 free signups = $0.73 ARPU (blended)

Over 12 months:
├─ Cohort LTV: ~$150-200 (accounting for churn)
├─ If CAC <$30, LTV:CAC >5:1 ✅
└─ Sustainable unit economics
```

#### **3.3.2 Revenue Growth Metrics**

**Monthly Recurring Revenue (MRR):**
```
Phase 1 (Months 1-3): $0 → $2,000 MRR
├─ Focus: Product validation, not monetization
├─ Pro tier gating in place but not aggressively promoted
└─ Goal: Prove users will pay, not optimize revenue

Phase 2 (Months 4-6): $2,000 → $10,000 MRR
├─ Growth rate target: 50% month-over-month
├─ New MRR: From free → paid conversions
├─ Expansion MRR: Minimal (few Pro → Creator upgrades)
└─ Goal: Prove conversion model works

Phase 3 (Months 7-12): $10,000 → $34,000 MRR
├─ Growth rate target: 20-30% month-over-month
├─ New MRR: 70% from conversions, 30% from expansion
├─ Optimization: Pricing experiments, feature gating, upgrade flows
└─ Goal: $400K ARR run rate by Month 12

Formula:
MRR = (Pro Monthly × $12) + (Pro Annual × $10) + (Creator × $29)
├─ Expansion MRR: Upgrades (Pro → Creator)
├─ Contraction MRR: Downgrades (Creator → Pro)
├─ Churn MRR: Cancellations
└─ Net New MRR: New + Expansion - Contraction - Churn
```

**Annual Recurring Revenue (ARR):**
```
Target: $400K ARR by Month 12
├─ Calculation: MRR × 12
├─ Actual: Account for seasonality, churn, growth trends
└─ Investor metric: ARR used for valuation, fundraising

Year 1 Projection:
├─ Month 3: $2K MRR → $24K ARR run rate
├─ Month 6: $10K MRR → $120K ARR run rate
├─ Month 9: $20K MRR → $240K ARR run rate
├─ Month 12: $34K MRR → $408K ARR run rate ✅
└─ Assumptions: 20% MoM growth (conservative), <5% churn
```

**Average Revenue Per User (ARPU):**
```
Blended ARPU (all users):
Target: $8-10/month
├─ Calculation: Total MRR / Total active users
├─ Includes: Free users (ARPU = $0), Paid users (ARPU = $12-29)
├─ Phase 1: Low (85% free, 15% paid) → ~$2 ARPU
├─ Phase 2: Growing (80% free, 20% paid) → ~$4 ARPU
└─ Phase 3: Maturing (75% free, 25% paid) → ~$8 ARPU

Paid ARPU (paid users only):
Target: $13-15/month
├─ Mix: 80% Pro Monthly ($12), 15% Pro Annual ($10), 5% Creator ($29)
├─ Weighted: (0.8 × $12) + (0.15 × $10) + (0.05 × $29) = $12.55
└─ Optimization: Encourage annual (higher LTV), upsell Creator

One-Time Revenue Per User (separate):
├─ 5% of free users × $12 = $0.60 per signup (one-time)
├─ Not recurring, but helps with early cash flow
└─ Bridge revenue (converts to MRR over time)
```

**Customer Lifetime Value (LTV):**
```
Calculation:
LTV = ARPU × Gross Margin / Monthly Churn Rate

Assumptions:
├─ ARPU: $12 (Pro Monthly)
├─ Gross Margin: 80% (software-level margins)
├─ Monthly Churn: 5% (target)
└─ LTV = $12 × 0.80 / 0.05 = $192

Segmented LTV:
├─ Pro Monthly: $192 (12-month average lifespan)
├─ Pro Annual: $300 (20-month average lifespan, lower churn)
├─ Creator: $580 (30-month average lifespan, sticky)
└─ Blended LTV: ~$220

LTV:CAC Target:
├─ Target: >3:1 (healthy SaaS)
├─ Example: $220 LTV / $30 CAC = 7.3:1 ✅
├─ Allows for: Paid acquisition, growth investment
└─ Failure threshold: <2:1 (unit economics broken)
```

**Gross Margin:**
```
Target: 80%+
├─ Revenue: MRR from subscriptions
├─ COGS: Infrastructure (hosting, APIs, storage), payment processing (3%)
├─ Calculation: (Revenue - COGS) / Revenue × 100

Cost Structure:
├─ Infrastructure: ~$2,000/month (Vercel, Railway, Cloudflare)
├─ Payment processing: 3% of revenue (Stripe fees)
├─ Support: Minimal (self-service, AI chatbot)
├─ ML/Compute: Mostly client-side (low server cost)
└─ Total COGS: ~15-20% of revenue at scale

Tracking:
├─ Monitor: Infrastructure cost per user (<$0.50/user)
├─ Optimize: Client-side processing (reduce server load)
├─ Alert: If COGS >25% of revenue (investigate cost spike)
└─ Benchmark: Software SaaS should be 80-90% gross margin
```

---

### **3.4 Retention Metrics (AARRR: Retention)**

#### **3.4.1 Short-Term Retention (First 30 Days)**

**Day 1 Retention:**
```
Definition: % of signups who return within 24 hours
Target: 40%
├─ High engagement signal (product is sticky)
├─ Triggers: Email reminder, unfinished upload, new insight available
├─ Benchmark: SaaS average is 20-30%, 40% is excellent
└─ Failure signal: <20% (product not compelling enough)

Tracking:
├─ Cohort: By signup date
├─ Segment: By acquisition source (organic vs. paid)
├─ Correlation: With North Star achievement (do D1 returners hit aha moment?)
└─ Optimization: Activation email, push notifications, value reminders
```

**Day 7 Retention:**
```
Definition: % of signups who are active within 7 days
Target: 30%
├─ Includes: Users who hit aha moment (40% target)
├─ Active definition: Login + view visualization OR generate insight
├─ Critical milestone: Week 1 determines long-term retention
└─ Failure signal: <15% (activation funnel broken)

Tracking:
├─ Cohort curves: By signup week
├─ Segment: By platform uploaded (Twitter users retain better?)
├─ Correlation: D7 retention → D30 retention (80% correlation)
└─ Optimization: Weekly digest email, new insights notification
```

**Day 30 Retention:**
```
Definition: % of signups who are active within 30 days
Target: 15%
├─ Benchmark: Consumer SaaS average is 8-12%, 15% is strong
├─ Critical for: LTV calculation, product-market fit signal
├─ Returning user value prop: New insights, data refresh, historical comparison
└─ Failure signal: <8% (product is one-and-done, not ongoing value)

Tracking:
├─ Cohort analysis: Retention curves by month
├─ Segment: Free vs. paid (paid should be 60%+)
├─ Churn reasons: Exit survey for lost users
└─ Win-back: Re-engagement campaign at Day 20 (before fully churned)
```

**Monthly Data Refresh Rate:**
```
Definition: % of active users who re-upload data monthly
Target: 40% of active users refresh monthly
├─ Value signal: Users see ongoing value, not one-time
├─ Engagement driver: New insights from updated data
├─ Revenue predictor: Refresh users convert to paid at 3x rate
└─ Failure signal: <20% (product perceived as one-time checkup)

Tracking:
├─ Refresh frequency: Weekly, bi-weekly, monthly, quarterly
├─ Trigger effectiveness: Email reminders, in-app prompts
├─ Platform preference: Which platforms users refresh most
└─ Insight value: Do refreshes generate new insights? (quality check)
```

#### **3.4.2 Long-Term Retention (90+ Days)**

**90-Day Retention:**
```
Definition: % of signups still active after 90 days
Target: 10%
├─ Benchmark: Consumer SaaS average is 5-7%, 10% is good
├─ Paid users: Should be 40%+ (paying users retain much better)
├─ Free users: Expect 5-8% (most will be inactive but reachable)
└─ Failure signal: <5% overall (product has no long-term stickiness)

Tracking:
├─ Cohort curves: Flattening indicates product-market fit
├─ Retention by segment: Power users (5%+) should retain at 60%+
├─ Feature usage: Which features drive retention? (correlation analysis)
└─ Resurrection: % of churned users who return (win-back campaigns)
```

**Quarterly Refresh Rate:**
```
Definition: % of users who return every quarter (90 days)
Target: 25% of signups (quarterly checkup behavior)
├─ Use case: Quarterly network review (strategic planning cadence)
├─ Product positioning: "Quarterly network health checkup"
├─ Engagement: Seasonal insights (Q1 vs. Q4 comparison)
└─ Retention alternative: If monthly retention is low, quarterly is acceptable

Tracking:
├─ Cadence identification: Are users naturally quarterly?
├─ Seasonal patterns: Do users refresh in January (New Year), September (back to school)?
├─ Conversion opportunity: Quarterly users convert to paid when?
└─ Product fit: Maybe VSG is naturally a quarterly tool, not daily (adjust expectations)
```

**Power User Emergence:**
```
Definition: % of users who become "power users" (5+ sessions, 3+ uploads)
Target: 5% of signups become power users
├─ Characteristics: High engagement, multi-platform, frequent refresh, paid conversion
├─ Revenue: Power users account for 50%+ of MRR (Pareto principle)
├─ Advocacy: Power users drive 80% of referrals, testimonials
└─ Retention: Power users retain at 80%+ (very sticky)

Tracking:
├─ Identification: Behavioral scoring (sessions, uploads, features used)
├─ Journey analysis: What path do power users take? (replicate)
├─ Conversion: 90%+ of power users convert to paid (validate with data)
└─ Advocacy: Net Promoter Score for power users (should be 70+)
```

#### **3.4.3 Churn Metrics**

**Monthly Churn Rate (Paid Users):**
```
Definition: % of paid subscribers who cancel each month
Target: <5% monthly churn
├─ Benchmark: Consumer SaaS average is 5-10%, <5% is excellent
├─ Acceptable: 5-7% (early stages)
├─ Warning: 7-10% (investigate reasons)
├─ Crisis: >10% (fundamental value delivery problem)

Formula:
Monthly Churn % = (Cancellations this month / Paid users start of month) × 100

Tracking:
├─ Cohort churn: Do early users churn more/less than recent?
├─ Churn by tier: Pro vs. Creator (Creator should churn less)
├─ Churn by acquisition: Organic vs. paid (paid users churn faster? bad targeting)
└─ Time to churn: Most churn at Month 2 (value not sustained) or Month 6 (initial value fades)?
```

**Annual Churn Rate (Paid Users):**
```
Target: <40% annual churn (implies avg. customer lifespan of 2.5 years)
├─ Calculation: 1 - (1 - Monthly Churn)^12
├─ Example: 5% monthly churn → 43% annual churn (close to target)
├─ Benchmark: Annual churn <40% is healthy for consumer SaaS
└─ Optimization: Focus on reducing churn in first 6 months (critical window)
```

**Churn Reasons (Exit Survey):**
```
Survey: "Why are you canceling?" (multiple choice + optional text)
Options:
├─ "Too expensive for the value" (pricing issue)
├─ "Don't use it enough" (engagement/value delivery issue)
├─ "Got the insights I needed, don't need ongoing" (product positioning issue)
├─ "Technical issues / bugs" (quality issue)
├─ "Privacy concerns" (trust issue)
├─ "Competitor is better" (competitive issue)
├─ "Other" (free text)

Analysis:
├─ Top 3 reasons: Focus product/pricing fixes here
├─ Cohort analysis: Do reasons change over time?
├─ Win-back offers: Targeted based on reason (e.g., pricing → discount offer)
└─ Product roadmap: Feature requests from churned users (win them back)
```

**Churn Recovery (Win-Back Campaigns):**
```
Target: 15% of churned users return within 90 days
├─ Email campaign: "We've added new features since you left"
├─ Discount offer: 50% off for 3 months (conditional on reason)
├─ Feature updates: New platforms, new insights, performance improvements
└─ Testimonials: Social proof from active users

Tracking:
├─ Win-back rate: % who reactivate
├─ Win-back LTV: Do they retain better second time? (learned value)
├─ Cost-effectiveness: CAC for win-back vs. new acquisition
└─ Cohort: Track "resurrected" users separately (different behavior)
```

**Net Revenue Retention (NRR):**
```
Definition: Revenue from existing customers this month / last month (includes expansion, contraction, churn)
Target: 90%+ (consumer SaaS), 100%+ is exceptional (means expansion > churn)

Formula:
NRR = [(MRR start of month + Expansion MRR - Contraction MRR - Churn MRR) / MRR start of month] × 100

Example:
├─ Start: $10,000 MRR
├─ Expansion: +$500 (Pro → Creator upgrades)
├─ Contraction: -$200 (Creator → Pro downgrades)
├─ Churn: -$500 (cancellations)
├─ End: $9,800 MRR
└─ NRR: 98% ✅ (acceptable, close to 100%)

Tracking:
├─ Monthly NRR trend (improving or degrading?)
├─ Expansion opportunities: Which users should we upsell?
├─ Contraction patterns: Why are Creator users downgrading?
└─ Churn mitigation: Focus on high-MRR customers (save revenue)
```

---

### **3.5 Referral Metrics (AARRR: Referral)**

#### **3.5.1 Viral Coefficient (k-factor)**

**Definition:**
Average number of new users each existing user brings through referrals/sharing.

**Formula:**
```
Viral Coefficient (k) = (Invites sent per user) × (Conversion rate of invites)

Example:
├─ Average user sends 2 invites (shares visualization card on Twitter)
├─ 15% of those who see it sign up
├─ k = 2 × 0.15 = 0.3
└─ Interpretation: Every 10 users bring 3 new users

Target: k = 0.3-0.5 (sustainable virality)
├─ k < 0.3: Weak virality, rely on paid acquisition
├─ k = 0.3-0.5: Healthy virality, organic growth engine
├─ k = 0.5-1.0: Strong virality, exponential growth potential
├─ k > 1.0: Viral loop (each user brings >1 user, exponential growth) - RARE
└─ Note: k = 0.5 + paid acquisition can drive hypergrowth
```

**Tracking:**
```
Invites/Shares Per User:
├─ Social share card: How many users share?
├─ Referral link: How many users send invite links?
├─ Public gallery: How many users publish visualizations?
└─ Word-of-mouth: Survey "How did you hear about us?" (track referral source)

Invite Conversion Rate:
├─ Click-through: % who click shared link
├─ Signup: % who create account after clicking
├─ Upload: % who complete upload (full activation)
└─ Referrer reward: Give credit to original user (gamification)

Viral Cycle Time:
├─ Time from user signup → first share: Target <7 days
├─ Time from share → new signup: Target <24 hours
├─ Shorter cycle = faster compounding growth
└─ Optimization: Encourage sharing immediately after aha moment
```

#### **3.5.2 Social Sharing Metrics**

**Share Rate:**
```
Definition: % of users who share visualization or insight on social media
Target: 30% of users share at least once

Share Types:
├─ Visualization card: "Here's my network visualization" (Twitter, LinkedIn, Instagram)
├─ Insight card: "I just learned I'm in an echo chamber" (insight-specific share)
├─ Comparison card: "My network vs. average creator" (Phase 3 feature)
└─ Public gallery: Publish visualization to VSG gallery (discoverability)

Tracking:
├─ Share button clicks (intent)
├─ Confirmed shares (completed action)
├─ Impressions: How many people saw shared content? (Twitter API, LinkedIn API)
├─ Conversions: How many signups from shared content? (UTM tracking)
└─ Viral loops: Do shares trigger more shares? (cascade effect)
```

**Organic Referral Sources:**
```
"How did you hear about us?" Survey (on signup):
Options:
├─ Search engine (Google, Bing)
├─ Social media (Twitter, Reddit, LinkedIn, Instagram, TikTok)
├─ Friend/colleague told me
├─ Article/blog post
├─ Product Hunt
├─ Hacker News
├─ Podcast
├─ Other (free text)

Target Distribution (Phase 2):
├─ Friend/colleague: 30%+ (organic word-of-mouth)
├─ Social media: 25% (viral sharing)
├─ Search engine: 20% (SEO working)
├─ Product Hunt / HN: 15% (launch momentum)
├─ Article/blog: 10% (PR / content marketing)
└─ Tracking: Tag acquisition source, measure quality (retention, conversion by source)
```

#### **3.5.3 Net Promoter Score (NPS)**

**Definition:**
Likelihood that users would recommend Visual Social Graph to friends/colleagues.

**Survey:**
```
Question: "How likely are you to recommend Visual Social Graph to a friend or colleague?"
Scale: 0 (not at all likely) to 10 (extremely likely)

Timing:
├─ After aha moment (within 7 days)
├─ After 30 days (sustained value check)
├─ After upgrade to paid (paid user satisfaction)
└─ Quarterly (long-term tracking)

Calculation:
├─ Promoters (9-10): Loyal enthusiasts, will refer others
├─ Passives (7-8): Satisfied but unenthusiastic, won't actively refer
├─ Detractors (0-6): Unhappy users, may spread negative word-of-mouth
└─ NPS = % Promoters - % Detractors (range: -100 to +100)
```

**Targets:**
```
Phase 1 (Months 1-3): NPS >30 (acceptable for early product)
Phase 2 (Months 4-6): NPS >40 (good product-market fit)
Phase 3 (Months 7-12): NPS >50 (excellent, strong advocacy)

Benchmarks:
├─ NPS <0: Crisis (more detractors than promoters)
├─ NPS 0-30: Needs improvement
├─ NPS 30-50: Good (industry average)
├─ NPS 50-70: Excellent (category leaders)
├─ NPS >70: World-class (Apple, Tesla territory)
```

**Segmented NPS:**
```
Track separately:
├─ Power users: Should be >70 (high engagement = high satisfaction)
├─ Paid users: Should be >60 (paying = they see value)
├─ Free users: May be 30-40 (haven't unlocked full value yet)
├─ By platform: Twitter users vs. LinkedIn users (different satisfaction?)
└─ By acquisition source: Organic vs. paid (quality of acquisition)
```

**NPS Follow-Up:**
```
Promoters (9-10):
├─ Ask: "What do you love most?" (testimonial sourcing)
├─ Request: Referral (send invite links, share on social)
├─ Offer: Beta access to new features (reward advocacy)
└─ Case study: Interview for in-depth story (marketing content)

Passives (7-8):
├─ Ask: "What would make this a 10?" (product improvement ideas)
├─ Offer: Personalized tips (help them get more value)
├─ Nudge: Upgrade prompt (unlock Pro features)
└─ Monitor: Risk of churn (passives can become detractors)

Detractors (0-6):
├─ Urgent: "What went wrong?" (prevent churn, gather feedback)
├─ Fix: Address specific issue if possible (win them back)
├─ Learn: Root cause analysis (product/quality issues?)
└─ Prevent: Improve onboarding/quality to reduce detractors
```

---

## **4. Phase-Specific Success Criteria**

### **4.1 Phase 0: Technical Validation Spike (Weeks 1-2)**

**Timeline:** January 2026 (2 weeks)

**Objective:** Validate core technical approach before full development investment.

**Success Criteria (ALL must pass for GO decision):**

**Technical Validation:**
```
✅ Parser Success Rate: >95% across all 5 platforms
├─ Twitter: Parse followers, following, DMs, engagement → Graph structure
├─ Instagram: Parse followers, following, comments, likes → Graph structure
├─ LinkedIn: Parse connections, interactions → Graph structure
├─ Facebook: Parse friends, comments, reactions → Graph structure
├─ TikTok: Parse followers, following, interactions → Graph structure
├─ Validation: Test with 10+ real archives per platform (50+ total tests)
└─ Failure: <90% success rate (format too unstable, pivot to browser extension)

✅ Performance Benchmarks (Browser-Based)
├─ 1K nodes: Render <5 seconds, 30+ FPS pan/zoom
├─ 5K nodes: Render <15 seconds, 20+ FPS
├─ 10K nodes: Render <30 seconds, 15+ FPS (acceptable degradation)
├─ Memory: <500MB peak (no browser crashes)
├─ File upload: 100MB file → parse in <60 seconds
├─ Browser compatibility: Chrome 120+, Safari 17+, Firefox 121+ (full support)
└─ Failure: Any browser crashes, >60 sec load times (fundamental perf issue, rethink architecture)

✅ User Validation ("Aha Moment" Test)
├─ Test with 5 real users (diverse: creators, professionals, different platforms)
├─ Success: 4/5 say "I would definitely use this" (80% intent)
├─ Success: 4/5 report "I learned something I didn't know" (aha moment felt)
├─ Success: Average time to first insight <5 minutes (low friction)
├─ Success: No critical UX blockers identified (usability acceptable)
└─ Failure: <3/5 positive responses (product not compelling enough, pivot)
```

**GO/NO-GO/PIVOT Decision:**
```
GO (Proceed to Phase 1):
├─ ALL technical criteria met (parsers work, performance acceptable, users feel aha moment)
├─ Confidence: 90%+ that product will work at scale
├─ Decision: Greenlight Phase 1 development (6 weeks)
└─ Next: Begin Phase 1 Foundation (landing page, upload flow, beta launch)

PIVOT (Adjust Approach):
├─ Parsers work but performance unacceptable (>60 sec loads, browser crashes)
├─ OR: Users feel aha moment but upload process too complex (completion <20%)
├─ Decision: Adjust technical approach (browser extension, server-side parsing, etc.)
├─ Timeline: 1 additional week to prototype pivot, retest
└─ Re-evaluate: GO/NO-GO after pivot prototype

NO-GO (Stop Project):
├─ Parsers unreliable (<90% success) AND no clear fix path
├─ OR: Users don't feel aha moment (<3/5 positive), fundamental product issue
├─ OR: Technical constraints unsolvable (performance, browser limits)
├─ Decision: Product not viable, stop development
└─ Learnings: Document why, consider if problem worth solving differently
```

**Metrics Dashboard (Phase 0):**
```
Daily tracking:
├─ Parser test results (success rate by platform)
├─ Performance benchmarks (render time, FPS, memory)
├─ User test feedback (qualitative notes)
└─ Blockers identified (critical issues preventing GO)

End of Week 2 Decision Document:
├─ Technical validation summary (pass/fail by criterion)
├─ User validation summary (quotes, feedback, aha moment rate)
├─ GO/NO-GO/PIVOT recommendation (data-driven)
├─ Next steps (Phase 1 plan or pivot plan or stop)
└─ Confidence level (% confidence in decision)
```

---

### **4.2 Phase 1: Foundation (Months 1-3)**

**Timeline:** February-April 2026 (12 weeks)

**Objective:** Launch beta to 50 users, validate product-market fit hypothesis, achieve 40% North Star metric.

**Success Criteria:**

**Acquisition:**
```
✅ 50 Beta Users Onboarded (hand-picked, diverse)
├─ Segment mix: 50% creators, 30% professionals, 20% other
├─ Platform mix: Twitter (30), Instagram (20), LinkedIn (25), Facebook (10), TikTok (5)
├─ Engagement level: All users actively use their platforms (not dormant accounts)
└─ Quality: Real users with genuine need (not friends/family charity signups)

Target: 50 users by end of Month 2
Failure signal: <30 users (activation funnel broken, value prop unclear)
```

**Activation:**
```
✅ Upload Completion: 60%+ of signups complete upload
├─ Current benchmark: Unknown (validate in Phase 1)
├─ Drop-off tracking: Where do users abandon? (download instructions, wait time, file upload)
├─ Optimization: Guided onboarding, wait-time engagement, progress indicators
└─ Failure: <40% completion (friction too high, consider browser extension pivot)

✅ Visualization Success: 80%+ of uploads → complete visualization
├─ Parser success: >95% (from Phase 0)
├─ Render time: <60 seconds
├─ No crashes: <5% of users experience browser crash
└─ Failure: <70% success (performance issues, need optimization)

✅ North Star Metric: 40%+ achieve "aha moment" within 7 days
├─ Definition: Upload + 3 min exploration + 2 views + 1 insight + 1 export/share
├─ Critical: This is THE metric, all else is secondary
├─ Tracking: PostHog funnel (signup → upload → visualization → aha moment)
└─ Failure: <20% (fundamental product-market fit issue, pivot or stop)
```

**Engagement:**
```
✅ Day 7 Retention: 30%+
├─ Active definition: Return to platform, view visualization OR generate insight
├─ Engagement loop: Weekly digest email, new insights available
└─ Failure: <15% (product not sticky, one-and-done usage)

✅ Feature Adoption: 60%+ users view >1 insight view
├─ Views: Network Graph (100%), Positioning Map (target 60%), Engagement Circles (50%)
├─ Depth: Users who explore more views retain better (validate hypothesis)
└─ Failure: <40% (single-view usage, not discovering value)
```

**Learning Objectives (Answer These Questions):**
```
1. Which user segment has highest North Star achievement?
   ├─ Hypothesis: Micro-influencers (10K-100K followers)
   ├─ Method: Cohort analysis by segment
   └─ Decision: Double down on highest-performing segment

2. What drives "aha moment"?
   ├─ Hypothesis: Specific insights (echo chamber, engagement quality, positioning)
   ├─ Method: Correlation analysis (which insights → aha moment)
   └─ Decision: Feature prioritization for Phase 2

3. Is manual upload acceptable or too much friction?
   ├─ Hypothesis: 60% complete upload (acceptable)
   ├─ Method: Track completion rate, survey "was this too hard?"
   └─ Decision: If <40%, pivot to browser extension in Phase 2

4. Which platform uploads convert best?
   ├─ Hypothesis: Twitter/LinkedIn (professional networks)
   ├─ Method: Track North Star by platform
   └─ Decision: Marketing focus on best-converting platforms

5. Do users want ongoing insights or one-time checkup?
   ├─ Hypothesis: 40% return within 30 days (ongoing value)
   ├─ Method: Track Day 30 retention, survey "when will you return?"
   └─ Decision: Product positioning (ongoing tool vs. quarterly checkup)
```

**GO/NO-GO Decision (End of Month 3):**
```
GO to Phase 2 (Enhancement):
├─ North Star: ≥30% (close to 40% target, trending up)
├─ Upload completion: ≥50% (friction acceptable)
├─ User feedback: Majority positive ("I'd pay for this", "I'll return")
├─ Decision: Proceed to Phase 2 (all 5 insight views, Pro tier, Product Hunt launch)

PIVOT:
├─ North Star: 20-30% (below target but users engage)
├─ Upload completion: 30-50% (friction too high)
├─ Pivot options: Browser extension (reduce friction), better onboarding, or adjust target segment
├─ Timeline: 4 weeks to implement pivot, retest
└─ Re-evaluate: GO/NO-GO after pivot

NO-GO (Stop):
├─ North Star: <20% (users don't feel value)
├─ Upload completion: <30% (product model broken)
├─ User feedback: Negative ("won't use again", "not valuable")
├─ Decision: Product-market fit not achieved, stop or major pivot (different product)
```

---

### **4.3 Phase 2: Enhancement & Launch (Months 4-6)**

**Timeline:** May-July 2026 (12 weeks)

**Objective:** Product Hunt launch, reach 1,000 users, validate freemium conversion (3-5% free → paid).

**Success Criteria:**

**Acquisition:**
```
✅ 1,000 Total Users (10x growth from Phase 1)
├─ Product Hunt: 500 users (Day 1-3 launch surge)
├─ Organic social: 300 users (viral loops, sharing)
├─ SEO/content: 100 users (articles, search traffic)
├─ Referral: 100 users (word-of-mouth from beta users)
└─ Failure: <500 users (launch didn't resonate, limited virality)

✅ Product Hunt Top 5 Launch
├─ Upvotes: 500+ (indicates strong interest)
├─ Comments: 100+ (community engagement)
├─ Ranking: Top 5 for the day (visibility)
├─ Traffic: 2,000+ landing page visitors on launch day
└─ Failure: <300 upvotes, not Top 10 (messaging didn't resonate)

✅ Landing → Signup: 15%+
├─ Current: Unknown (validate in Phase 2)
├─ Optimization: A/B test headlines, hero images, value props
└─ Failure: <10% (value prop unclear, messaging needs work)
```

**Activation:**
```
✅ North Star Sustained: 40%+ achieve aha moment within 7 days
├─ Validation: Phase 1 target now must hold at scale
├─ Cohort tracking: Week-over-week consistency
├─ Segment analysis: Which acquisition sources drive highest North Star?
└─ Failure: <30% (quality of users dropped, onboarding degraded at scale)

✅ Upload Completion: 60%+ (maintain from Phase 1)
├─ At scale validation: Does it hold with 1,000 users?
├─ Platform mix: Track by platform (Twitter higher than TikTok?)
└─ Failure: <50% (scale introduced friction, optimize)
```

**Revenue (NEW - Freemium Validation):**
```
✅ Free → Paid Conversion: 3-5%
├─ Target: 30-50 paid users out of 1,000 free
├─ MRR: $360-$600 (30 × $12 to 50 × $12)
├─ Timing: Within 30-60 days of signup (don't rush)
├─ Triggers: Hit free limits, want multi-platform, need historical tracking
└─ Failure: <1% (<10 paid users) (pricing wrong, value prop weak, or free tier too generous)

✅ One-Time Report Sales: 5%+ of free users
├─ Target: 50 one-time purchases (50 × $12 = $600 one-time revenue)
├─ Timing: Within first 7 days (while value fresh)
├─ Bridge to subscription: 15-20% should upgrade to Pro within 90 days
└─ Failure: <2% (pricing wrong, export feature too good in free tier)

✅ Monthly Churn (Paid): <7%
├─ Early days: Expect higher churn (users testing)
├─ Acceptable: 5-7% monthly churn
├─ Warning: 7-10% churn (investigate reasons)
└─ Failure: >10% churn (value not sustained, users canceling quickly)
```

**Engagement:**
```
✅ Day 30 Retention: 15%+
├─ Benchmark: Consumer SaaS average is 8-12%
├─ Validation: Users return for data refresh, new insights
└─ Failure: <10% (one-and-done behavior, no ongoing value)

✅ Viral Coefficient: 0.3-0.5
├─ Calculation: (Shares per user) × (Conversion rate)
├─ Target: Each user brings 0.3-0.5 new users (sustainable virality)
├─ Tracking: Social shares, referral links, word-of-mouth survey
└─ Failure: <0.2 (weak virality, need to optimize sharing features)

✅ NPS: 40+
├─ Survey: 30-day users ("How likely to recommend?")
├─ Target: NPS >40 (good product-market fit)
├─ Segment: Power users should be >60
└─ Failure: NPS <20 (users not satisfied, won't recommend)
```

**Learning Objectives:**
```
1. Which features justify Pro pricing?
   ├─ Hypothesis: Multi-platform, historical tracking, export quality
   ├─ Method: Feature adoption tracking, upgrade surveys
   └─ Decision: Feature roadmap prioritization for Phase 3

2. Is freemium model working?
   ├─ Hypothesis: 3-5% convert free → paid (viable)
   ├─ Method: Conversion funnel analysis, pricing experiments
   └─ Decision: Adjust free tier limits or pricing if needed

3. What drives virality?
   ├─ Hypothesis: Social sharing of visualization cards
   ├─ Method: Track shares, viral loops, referral sources
   └─ Decision: Optimize sharing features, viral loops

4. Do users refresh data monthly?
   ├─ Hypothesis: 40% refresh monthly (ongoing value)
   ├─ Method: Track upload frequency, survey "when will you update?"
   └─ Decision: Product positioning (monthly tool or quarterly checkup)
```

**GO/NO-GO Decision (End of Month 6):**
```
GO to Phase 3 (Scale & Monetization):
├─ Users: ≥750 (close to 1,000 target)
├─ North Star: ≥35% (sustaining)
├─ Conversion: ≥2% (proving willingness to pay)
├─ Retention: D30 ≥12% (users returning)
├─ Decision: Scale acquisition, optimize monetization

PIVOT:
├─ Users: 500-750 (growth slower than expected)
├─ Conversion: 1-2% (low but not zero)
├─ Pivot options: Pricing adjustment, free tier rebalance, different acquisition channels
├─ Timeline: 4 weeks to test pivot, measure

NO-GO:
├─ Users: <500 (launch failed, no traction)
├─ Conversion: <0.5% (users won't pay)
├─ Churn: >15% (users cancel immediately)
├─ Decision: Fundamental model broken, major pivot or stop
```

---

### **4.4 Phase 3: Scale & Monetization (Months 7-12)**

**Timeline:** August 2026 - January 2027 (24 weeks)

**Objective:** Reach 10,000 users, $10K MRR, achieve product-market fit, sustainable unit economics.

**Success Criteria:**

**Acquisition:**
```
✅ 10,000 Total Users (10x growth from Phase 2)
├─ Monthly growth: 1,000-1,500 new users/month
├─ Organic mix: 60% organic (SEO, social, referral), 40% other
├─ CAC: <$30 per user (if using paid acquisition)
└─ Failure: <5,000 users (growth stalled, need new acquisition channels)

✅ Organic Traffic: 50,000 visitors/month
├─ SEO: 40% (20,000 visitors from search)
├─ Social: 30% (15,000 from Twitter, Reddit, LinkedIn)
├─ Referral: 20% (10,000 from partnerships, integrations)
├─ Direct: 10% (5,000 brand recall)
└─ Landing conversion: 15% (7,500 signups/month)
```

**Revenue:**
```
✅ $10K Monthly Recurring Revenue
├─ Target mix: 800 Pro monthly ($9,600), 50 Pro annual (~$400 effective MRR), 20 Creator ($580)
├─ Total: ~$10,580 MRR ✅
├─ One-time revenue: ~$3,000/month additional (not MRR)
└─ Failure: <$5K MRR (conversion or pricing broken)

✅ Free → Paid Conversion: 3-5% sustained
├─ Cohort tracking: Does it hold across months?
├─ Optimization: A/B test pricing, features, messaging
└─ Failure: <2% (need to revisit pricing or value prop)

✅ Monthly Churn: <5%
├─ Benchmark: <5% is excellent for consumer SaaS
├─ Cohort analysis: Do early users churn more/less?
├─ Exit surveys: Why are users canceling?
└─ Failure: >7% churn (value not sustained, fix retention)

✅ LTV:CAC Ratio: >3:1
├─ LTV: ~$192 (ARPU $12 × 0.8 margin / 0.05 churn)
├─ CAC: <$30 target
├─ Ratio: $192 / $30 = 6.4:1 ✅ (healthy economics)
└─ Failure: <2:1 (unsustainable, reduce CAC or increase LTV)

✅ Gross Margin: >80%
├─ Revenue: $10K MRR
├─ COGS: <$2K (infrastructure, payment processing)
├─ Margin: 80%+ (software-level margins)
└─ Failure: <70% (infrastructure costs too high, optimize)
```

**Engagement & Retention:**
```
✅ Day 30 Retention: 15%+ sustained
├─ Cohort curves flattening (product-market fit signal)
├─ Paid users: 50%+ D30 retention
└─ Failure: <12% (degrading retention)

✅ Monthly Data Refresh: 40%+ of active users
├─ Users see ongoing value (return for updates)
├─ Engagement driver: New insights from refreshed data
└─ Failure: <25% (one-time checkup behavior dominant)

✅ Power Users: 5%+ of total users
├─ Definition: 5+ sessions, 3+ uploads, multi-platform
├─ Revenue contribution: 50%+ of MRR (80/20 rule)
├─ Retention: 80%+ (highly sticky)
└─ NPS: 70+ (strong advocates)

✅ NPS: 50+
├─ Benchmark: Excellent product-market fit
├─ Power users: >70
├─ Paid users: >60
└─ Failure: <40 (satisfaction declining)
```

**Product-Market Fit Signals (Qualitative):**
```
✅ Organic word-of-mouth: >30% signups from referrals
✅ Unsolicited testimonials: Users sharing success stories without prompting
✅ Media coverage: Inbound press requests, podcast invitations
✅ Inbound partnerships: Integration requests, collaboration inquiries
✅ Feature requests: Users actively suggesting improvements (engagement signal)
✅ Social proof: Twitter/LinkedIn posts praising product (viral signal)
```

**GO/NO-GO Decision (End of Month 12):**
```
PRODUCT-MARKET FIT ACHIEVED (Scale):
├─ Users: ≥8,000 (close to 10K target)
├─ MRR: ≥$8K (close to $10K target, accelerating)
├─ North Star: ≥35% sustained (validated)
├─ Churn: <5% (value sustained long-term)
├─ NPS: ≥45 (strong satisfaction)
├─ Unit economics: LTV:CAC >3:1, gross margin >80%
├─ Decision: Product-market fit achieved, ready to scale aggressively
└─ Next: Fundraising (if needed), aggressive growth investment, team expansion

CONTINUE (Not Yet PMF, But Progressing):
├─ Users: 5,000-8,000 (slower growth, but growing)
├─ MRR: $5K-$8K (monetization working, needs optimization)
├─ North Star: 30-35% (acceptable, close to target)
├─ Decision: Continue optimizing, don't scale yet (not ready for aggressive growth)
└─ Timeline: 6 more months to achieve PMF, then reassess

PIVOT:
├─ Users: 3,000-5,000 (growth stalled)
├─ MRR: <$5K (conversion broken or pricing wrong)
├─ Churn: 5-7% (value not fully sustained)
├─ Pivot options: Pricing model (annual-only?), target segment (B2B?), product positioning
├─ Timeline: 8 weeks to test pivot, measure
└─ Decision: Major strategic adjustment needed

NO-GO (Shut Down or Major Pivot):
├─ Users: <3,000 (growth stopped, no traction)
├─ MRR: <$3K (users won't pay at scale)
├─ Churn: >7% (value not sustained)
├─ Burn rate: Unsustainable (running out of runway)
├─ Decision: Product-market fit not achievable with current approach
└─ Options: Shut down, sell, or pivot to entirely different product
```

---

## **5. Decision Frameworks & Failure Thresholds**

### **5.1 Decision Framework Hierarchy**

**Level 1: Data-Driven Decisions (Override Opinions)**
```
When metrics meet defined thresholds:
├─ GO criteria met → Proceed to next phase (no debate)
├─ PIVOT criteria met → Execute pivot (defined timeline, no "wait and see")
├─ NO-GO criteria met → Stop or major pivot (don't throw good money after bad)
└─ Ambiguous → Extend timeline 4 weeks max, gather more data, then decide
```

**Level 2: North Star Primacy (Trade-Off Resolution)**
```
When metrics conflict (e.g., high revenue but low North Star):
├─ North Star wins in Phases 0-2 (long-term value > short-term revenue)
├─ Example: Don't optimize for paid conversion if it degrades North Star
├─ Example: Don't gate features aggressively if it prevents aha moment
└─ Phase 3+: Balance North Star with revenue (but North Star still leads)
```

**Level 3: Validated Learning (Hypothesis Testing)**
```
Every phase has learning objectives (Section 4):
├─ Answer questions with data (not assumptions)
├─ Update beliefs based on evidence (Bayesian updating)
├─ Document learnings (this document evolves)
└─ Avoid confirmation bias (actively seek disconfirming evidence)
```

**Level 4: Time-Bound Decisions (No Endless Iteration)**
```
Each phase has GO/NO-GO checkpoint:
├─ Phase 0: 2 weeks (End of Week 2)
├─ Phase 1: 3 months (End of Month 3)
├─ Phase 2: 3 months (End of Month 6)
├─ Phase 3: 6 months (End of Month 12)
└─ No exceptions: Decide on schedule (data-driven, no emotions)
```

### **5.2 Failure Threshold Matrix**

**Critical Failures (Immediate Action Required):**

| Metric | Threshold | Action | Timeline |
|--------|-----------|--------|----------|
| North Star | <20% | PIVOT or STOP | 2 weeks |
| Upload completion | <30% | PIVOT (browser ext.) | 4 weeks |
| Parser success | <90% | FIX or PIVOT | 1 week |
| Browser crashes | >10% | FIX immediately | 48 hours |
| Paid churn | >10%/month | Investigate, fix retention | 2 weeks |
| LTV:CAC | <1.5:1 | Stop paid acquisition | Immediate |

**Warning Signals (Monitor Closely):**

| Metric | Threshold | Action | Timeline |
|--------|-----------|--------|----------|
| North Star | 20-30% | Optimize onboarding | 4 weeks |
| Upload completion | 30-50% | Improve UX, reduce friction | 4 weeks |
| Free → Paid | <2% | Test pricing, features | 4 weeks |
| D30 retention | <12% | Improve engagement loops | 4 weeks |
| NPS | <30 | User interviews, quality improvements | 2 weeks |
| Viral coefficient | <0.2 | Optimize sharing features | 4 weeks |

**Success Signals (Double Down):**

| Metric | Threshold | Action | Timeline |
|--------|-----------|--------|----------|
| North Star | >50% | Study why, replicate | Immediate |
| Upload completion | >70% | Identify what works, amplify | 2 weeks |
| Free → Paid | >7% | Scale acquisition | Immediate |
| NPS | >60 | Capture testimonials, case studies | 1 week |
| Viral coefficient | >0.5 | Optimize viral loops, scale | Immediate |
| Power user % | >10% | Study behavior, build for them | 2 weeks |

### **5.3 Pivot Decision Framework**

**When to Consider Pivot:**
```
Trigger conditions (ANY met):
├─ Core assumption invalidated (e.g., users won't download data)
├─ Critical threshold missed for 2 consecutive checkpoints
├─ Competitive threat emerges (someone executes better)
├─ Market shift (platform policies change, making product unviable)
└─ Founder conviction lost (team no longer believes in vision)
```

**Pivot Options Playbook:**

**Pivot Type 1: Product Pivot (Change HOW)**
```
Scenario: Users love insights but upload too hard (<30% completion)
Pivot: Browser extension (automated data collection)
Timeline: 6 weeks to build, test
Validate: Upload completion >60%, North Star maintained
```

**Pivot Type 2: Segment Pivot (Change WHO)**
```
Scenario: Professionals convert 3x better than creators
Pivot: Focus exclusively on LinkedIn professionals (B2B positioning)
Timeline: 4 weeks to reposition, retest
Validate: Conversion >5%, retention >20%
```

**Pivot Type 3: Business Model Pivot (Change HOW WE CHARGE)**
```
Scenario: Free → paid conversion <1%, but one-time sales strong
Pivot: Annual-only pricing ($99/year, no monthly option)
Timeline: 2 weeks to implement, 8 weeks to validate
Validate: Annual sales >5% of free users, churn <30% annually
```

**Pivot Type 4: Platform Pivot (Change WHAT)**
```
Scenario: Users want real-time insights, not manual uploads
Pivot: API-connected dashboard (OAuth model)
Timeline: 12 weeks to rebuild, relaunch
Validate: Connection rate >70%, North Star >40%
```

**Pivot Type 5: Go-To-Market Pivot (Change HOW WE REACH)**
```
Scenario: Organic growth stalled, paid acquisition unprofitable
Pivot: B2B sales (agencies, enterprises)
Timeline: 8 weeks to build team features, sales motion
Validate: 5 enterprise deals closed, $5K ACV each
```

### **5.4 No-Go Decision Framework**

**When to Stop (Shut Down Project):**

**Scenario 1: Technical Infeasibility**
```
Indicators:
├─ Parser success <90% persistently (platforms too unstable)
├─ Performance unsolvable (browser crashes, >2 min loads)
├─ Platform policy changes (e.g., platforms ban data downloads)
└─ Decision: Core technical approach not viable, no pivot path

Action: Document learnings, shut down gracefully, notify users
```

**Scenario 2: No Product-Market Fit (After 12 Months)**
```
Indicators:
├─ North Star <20% after 12 months (users don't feel value)
├─ Upload completion <30% (friction too high, users won't use)
├─ Free → paid <0.5% (users won't pay)
├─ Churn >10% monthly (value not sustained)
├─ NPS <10 (users unhappy, negative word-of-mouth)
└─ Decision: Market doesn't want this product (or we can't execute it)

Action: Pivot to entirely different product or shut down
```

**Scenario 3: Unsustainable Economics**
```
Indicators:
├─ LTV:CAC <1.5:1 persistently (losing money on every user)
├─ Gross margin <60% (infrastructure costs too high)
├─ Burn rate unsustainable (running out of runway, can't raise)
└─ Decision: Business model doesn't work, no path to profitability

Action: Attempt pricing pivot (last chance), otherwise shut down
```

**Scenario 4: Competitive Defeat**
```
Indicators:
├─ Well-funded competitor launches superior product
├─ Market share declining (users switching to competitor)
├─ Differentiation eroded (privacy-first not valued anymore)
└─ Decision: Can't compete, market has moved on

Action: Acquihire, sell, or pivot to different market
```

**Scenario 5: Founder/Team Exhaustion**
```
Indicators:
├─ Founder conviction lost (no longer believe in vision)
├─ Team attrition (key people leaving)
├─ Burnout (unsustainable pace, health impact)
└─ Decision: Can't continue for human reasons

Action: Graceful shutdown, communicate honestly with users
```

---

## **6. Instrumentation & Measurement Framework**

### **6.1 Analytics Stack**

**Primary Tools:**
```
PostHog (Product Analytics):
├─ Event tracking (all user actions)
├─ Funnel analysis (signup → aha moment)
├─ Cohort analysis (retention curves)
├─ Session recording (UX debugging)
├─ Feature flags (A/B testing)
└─ Self-hosted option (privacy-preserving)

Stripe (Payment & Revenue):
├─ Subscription management
├─ MRR/ARR tracking (automatic)
├─ Churn tracking
├─ Dunning management (failed payments)
└─ Revenue analytics (Stripe Sigma)

Plausible / Google Analytics (Traffic):
├─ Landing page visitors
├─ Traffic sources
├─ Conversion tracking (visitor → signup)
├─ Privacy-preserving (Plausible preferred)
└─ Fallback: Google Analytics for SEO insights
```

**Secondary Tools:**
```
Sentry (Error Tracking):
├─ Parser failures
├─ Browser errors
├─ Performance monitoring
└─ Uptime monitoring

Typeform / Tally (Surveys):
├─ NPS surveys (30-day, 90-day)
├─ Churn surveys (exit interviews)
├─ Learning surveys (Phase objectives)
└─ User research (qualitative feedback)

Notion / Airtable (Dashboard):
├─ Weekly metrics snapshot
├─ OKR tracking
├─ Decision log (GO/NO-GO decisions)
└─ Learnings repository
```

### **6.2 Event Tracking Specification**

**Core Events (MUST Track):**

**Acquisition:**
```
event: landing_page_view
properties: {source, medium, campaign, device}

event: signup_started
properties: {source, device}

event: signup_completed
properties: {user_id, signup_method, source}
```

**Activation:**
```
event: upload_started
properties: {user_id, platform, file_size}

event: upload_completed
properties: {user_id, platform, parse_success, parse_time, node_count, edge_count}

event: visualization_rendered
properties: {user_id, platform, render_time, node_count}

event: visualization_explored
properties: {user_id, session_duration, interactions, views_visited}

event: insight_generated
properties: {user_id, insight_type, confidence_level}

event: aha_moment_achieved
properties: {user_id, time_since_signup, actions_completed}
```

**Engagement:**
```
event: session_started
properties: {user_id, platform, days_since_signup}

event: view_switched
properties: {user_id, from_view, to_view}

event: export_initiated
properties: {user_id, export_type (PDF, CSV, image)}

event: social_share
properties: {user_id, share_type, platform}
```

**Revenue:**
```
event: upgrade_viewed
properties: {user_id, tier_viewed, trigger_source}

event: upgrade_completed
properties: {user_id, tier, price, billing_period}

event: subscription_canceled
properties: {user_id, tier, cancel_reason, days_subscribed}
```

**Retention:**
```
event: data_refresh_started
properties: {user_id, platform, days_since_last_upload}

event: email_clicked
properties: {user_id, email_type, link_clicked}
```

### **6.3 Metric Calculation Methods**

**North Star Metric Calculation:**
```sql
-- Aha Moment Achieved (within 7 days)
SELECT
  DATE_TRUNC('week', signup_date) AS cohort_week,
  COUNT(DISTINCT user_id) AS signups,
  COUNT(DISTINCT CASE
    WHEN uploaded >= 1
      AND exploration_time >= 180 -- 3 minutes
      AND views_visited >= 2
      AND insights_generated >= 1
      AND (exported OR shared)
      AND aha_timestamp <= signup_date + INTERVAL '7 days'
    THEN user_id
  END) AS aha_users,
  (aha_users::FLOAT / signups * 100) AS aha_rate
FROM user_cohorts
GROUP BY cohort_week
ORDER BY cohort_week DESC;
```

**Retention Curve Calculation:**
```sql
-- D1, D7, D30, D90 Retention
SELECT
  cohort_week,
  COUNT(DISTINCT user_id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN active_day_1 THEN user_id END) AS d1_active,
  COUNT(DISTINCT CASE WHEN active_day_7 THEN user_id END) AS d7_active,
  COUNT(DISTINCT CASE WHEN active_day_30 THEN user_id END) AS d30_active,
  COUNT(DISTINCT CASE WHEN active_day_90 THEN user_id END) AS d90_active,
  (d1_active::FLOAT / cohort_size * 100) AS d1_retention,
  (d7_active::FLOAT / cohort_size * 100) AS d7_retention,
  (d30_active::FLOAT / cohort_size * 100) AS d30_retention,
  (d90_active::FLOAT / cohort_size * 100) AS d90_retention
FROM retention_analysis
GROUP BY cohort_week;
```

**LTV Calculation:**
```sql
-- Customer Lifetime Value
SELECT
  tier,
  AVG(monthly_revenue) AS avg_arpu,
  AVG(customer_lifespan_months) AS avg_lifespan,
  (avg_arpu * avg_lifespan * 0.80) AS ltv -- 80% gross margin
FROM user_revenue
WHERE tier IS NOT NULL
GROUP BY tier;
```

### **6.4 Dashboard Requirements**

**Weekly Metrics Dashboard (Founder View):**
```
Section 1: North Star
├─ This week's aha moment rate (%)
├─ Trend: Last 4 weeks (sparkline)
├─ Target: 40% (visual indicator: on track / below / above)
└─ Alert: Red if <30%, Green if >40%

Section 2: Growth
├─ New signups this week
├─ Total active users (D30 active)
├─ Growth rate % (week-over-week)
└─ Traffic sources breakdown (pie chart)

Section 3: Revenue
├─ MRR (current)
├─ New MRR this week
├─ Churn MRR this week
├─ Net MRR growth
└─ Paid user count

Section 4: Engagement
├─ D7 retention (this week's cohort)
├─ D30 retention (4-week-old cohort)
├─ Avg. session duration
└─ Power user count

Section 5: Quality
├─ Parser success rate
├─ Avg. render time
├─ Error rate
├─ NPS (rolling 30-day)

Section 6: Alerts
├─ Critical issues (red flags from Section 5.2)
├─ Opportunities (success signals from Section 5.2)
└─ Action items (based on thresholds)
```

**Monthly Board Dashboard (Investor View):**
```
Section 1: Traction
├─ Total users (graph: last 6 months)
├─ MRR (graph: last 6 months)
├─ ARR (run rate)
└─ Month-over-month growth %

Section 2: Unit Economics
├─ LTV (by tier)
├─ CAC (blended)
├─ LTV:CAC ratio
├─ Payback period (months)
└─ Gross margin %

Section 3: Product-Market Fit
├─ North Star metric (40% target)
├─ NPS (50+ target)
├─ Retention curves (cohort analysis)
└─ Viral coefficient

Section 4: Key Milestones
├─ Phase progress (Phase 0, 1, 2, 3 status)
├─ GO/NO-GO decision status
├─ Next checkpoint date
└─ Confidence level (%)

Section 5: Risks & Mitigations
├─ Red flags (from Section 5.2)
├─ Mitigation actions taken
├─ Timeline to resolution
└─ Contingency plans
```

---

## **7. Conclusion: Using This Framework**

### **7.1 Framework Application Checklist**

**Weekly (Every Monday 9 AM):**
```
□ Review North Star Metric (Section 1.3)
  └─ Current week's aha moment rate vs. 40% target

□ Check Weekly Dashboard (Section 6.4)
  └─ Traffic, signups, revenue, engagement, quality

□ Identify Alerts (Section 5.2)
  └─ Any critical thresholds crossed? (red flags)

□ Review Action Items
  └─ What needs to be fixed this week?

□ Update Team
  └─ Share key metrics, wins, concerns (transparency)
```

**Monthly (First Monday of Month):**
```
□ Full Metrics Audit (Section 3: Core Metrics)
  └─ Acquisition, Activation, Revenue, Retention, Referral

□ Cohort Analysis (Section 3.4)
  └─ Retention curves, churn analysis

□ Learning Objectives Review (Section 4: Phase-Specific)
  └─ Are we answering the key questions?

□ Strategy Metrics (Section 2)
  └─ Decision impact, behavioral change, strategic clarity

□ Board Dashboard Update (Section 6.4)
  └─ Prepare investor/stakeholder report

□ Drift Check (Section 0.3)
  └─ Are metric definitions still aligned with this document?
```

**Quarterly (End of Quarter):**
```
□ Full Framework Audit (Section 0.2)
  └─ Validate no metric drift, definitions unchanged

□ Phase Checkpoint (Section 4)
  └─ GO/NO-GO/PIVOT decision (data-driven)

□ OKR Setting (Next Quarter)
  └─ Based on current phase targets

□ Document Amendments (Section 0.4)
  └─ Update framework based on learnings (version control)

□ Strategic Review
  └─ Are we on track for product-market fit? Adjustments needed?
```

### **7.2 Success Definition (12-Month Horizon)**

**By August 2027 (Month 18), Visual Social Graph will have achieved Product-Market Fit if:**

```
✅ North Star: 40%+ of users achieve aha moment within 7 days (sustained)
✅ Users: 10,000+ total users (demonstrating market demand)
✅ Revenue: $10K+ MRR ($120K ARR run rate, proving willingness to pay)
✅ Retention: D30 15%+ (users return, ongoing value demonstrated)
✅ Economics: LTV:CAC >3:1, Gross Margin >80% (sustainable unit economics)
✅ NPS: 50+ (users love it, will recommend)
✅ Virality: k >0.3 (organic growth engine working)
✅ Churn: <5% monthly (value sustained long-term)

This means:
- Product delivers genuine value (North Star, NPS)
- Market wants this product (Users, Revenue growth)
- Business is sustainable (Economics, Retention, Churn)
- Ready to scale (Virality, Organic growth)
```

**If achieved:** Product-market fit validated, ready for aggressive growth investment.

**If not achieved:** Honest assessment required (pivot or stop, per Section 5.4).

### **7.3 Final Principles**

**1. Data Over Opinions**
- When data conflicts with intuition, investigate but trust data
- Statistical significance required for major decisions (>95% confidence)
- Anecdotes inform, metrics decide

**2. North Star Guides All**
- When trade-offs exist, North Star wins (Phases 0-2)
- Don't optimize for revenue at expense of North Star early
- Long-term value beats short-term metrics

**3. Time-Bound Decisions**
- Decide on schedule (Phase checkpoints are binding)
- No endless iteration ("one more month" syndrome)
- Pivot or stop decisively when thresholds met

**4. Honest Reporting**
- Report both wins and losses (no cherry-picking)
- Failure signals are valuable (early warning system)
- Transparency with team, investors, users

**5. Framework Evolves**
- This document is living (version controlled)
- Update based on learnings (Section 0.4 process)
- But core principles stay constant (Section 0.2 rules)

---

## **Document Status**

- **Version:** 1.0
- **Status:** Draft - Ready for Review
- **Last Updated:** December 29, 2025
- **Next Review:** Post-Phase 0 (February 2026)
- **Confidence:** 85% (based on industry best practices, validated assumptions)
- **Owner:** Product/Founder
- **Stakeholders:** Engineering, Marketing, Leadership, Investors

---

## **Appendix A: Glossary**

**North Star Metric:** Single metric that best predicts long-term product success. For VSG: "Users who achieve aha moment within 7 days."

**Aha Moment:** When user realizes significant value from product (defined specifically in Section 1.3).

**Product-Market Fit (PMF):** When product satisfies strong market demand. Evidenced by: high retention, NPS >50, organic growth, sustainable economics.

**Churn Rate:** Percentage of paying customers who cancel each month. Target: <5%.

**LTV (Lifetime Value):** Total revenue expected from average customer over their lifetime. Calculation: ARPU × Gross Margin / Churn Rate.

**CAC (Customer Acquisition Cost):** Average cost to acquire one new customer (marketing + sales costs / new customers).

**LTV:CAC Ratio:** Lifetime value divided by acquisition cost. Target: >3:1 (healthy SaaS).

**Viral Coefficient (k-factor):** Average number of new users each existing user brings. Formula: (Invites per user) × (Conversion rate).

**NPS (Net Promoter Score):** Likelihood users would recommend product. Range: -100 to +100. Target: >50.

**MRR (Monthly Recurring Revenue):** Predictable revenue from subscriptions each month.

**ARR (Annual Recurring Revenue):** MRR × 12 (run rate for annual revenue).

**ARPU (Average Revenue Per User):** Total revenue / Total users (blended or paid-only).

**Gross Margin:** (Revenue - COGS) / Revenue × 100. Target: >80% for software.

**Cohort Analysis:** Grouping users by signup period to track behavior over time (retention curves).

---

## **Appendix B: Metric Reference Quick Sheet**

| Metric | Target | Failure Threshold | Phase |
|--------|--------|-------------------|-------|
| **North Star** | 40% | <20% | All |
| Parser Success | >95% | <90% | 0+ |
| Upload Completion | 60% | <30% | 1+ |
| Visualization Render | <60 sec | >120 sec | 0+ |
| D7 Retention | 30% | <15% | 1+ |
| D30 Retention | 15% | <10% | 2+ |
| Free → Paid | 3-5% | <1% | 2+ |
| Monthly Churn | <5% | >10% | 2+ |
| NPS | 50+ | <20 | 2+ |
| Viral Coefficient | 0.3-0.5 | <0.2 | 2+ |
| LTV:CAC | >3:1 | <1.5:1 | 3+ |
| Gross Margin | >80% | <60% | 3+ |
| MRR | $10K | <$5K | 3 (Month 12) |

---

## **Appendix C: Amendment Log**

**Version 1.0 (December 29, 2025):**
- Initial framework creation
- Established North Star Metric: Aha moment within 7 days (40% target)
- Defined phase-specific success criteria (Phases 0-3)
- Created three-tier metrics system (Product, Strategy-Grade, Category)
- Established governance rules and drift prevention mechanisms
- Built decision frameworks (GO/NO-GO/PIVOT criteria)
- Specified instrumentation requirements (PostHog, Stripe, surveys)

**Future Amendments:**
- Post-Phase 0 (February 2026): Validate technical assumptions, adjust targets if needed
- Post-Phase 1 (April 2026): Update based on beta learnings, refine North Star definition if needed
- Post-Phase 2 (July 2026): Adjust conversion targets based on actual data, pricing optimization
- Post-Phase 3 (January 2027): PMF assessment, framework evolution for scale phase

---

**End of Metrics & Success Framework v1.0**

*"If you can't measure it, you can't improve it. If you measure the wrong thing, you'll optimize for failure."*

*The North Star guides us. Data decides. Time bounds us. Product-market fit awaits.*

**December 2025**