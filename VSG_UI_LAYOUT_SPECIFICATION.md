# **Visual Social Graph: UI Layout Specification Document**
## **Version 1.0 - Authoritative Display Layout Specification**

*"This document has total say over how the display layout should look and feel. Every screen. Every section. Every pixel placement. Desktop and mobile."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 |
| **Date** | December 30, 2025 |
| **Status** | **NORMATIVE - Authoritative** |
| **Owner** | Product Design / UX |
| **Authority** | **TOTAL SAY** over all layout decisions |
| **Scope** | All screens, all phases, desktop & mobile |

**Document Hierarchy:**
```
VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md (design system foundation)
    ↓ provides design tokens, components
VSG_UI_LAYOUT_SPECIFICATION.md (THIS DOCUMENT - layout authority)
    ↓ specifies exact placement, structure, flow
Implementation (React/Next.js components)
    ↓ implements layout specification
```

**Authoritative Status:**
- This document is the **SINGLE SOURCE OF TRUTH** for ALL layout decisions
- Any layout not specified here requires explicit approval and amendment
- Implementation MUST match this specification exactly
- Deviations require documented rationale and version update

**Related Documents:**
- VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md (design tokens, typography, spacing, colors)
- VSG_UI_SPECIFICATION.md (component APIs, implementation patterns)
- VSG_PRODUCT_REQUIREMENT_DOC.md (feature definitions, user stories)
- VSG_PRODUCT_ROADMAP_EXECUTION.md (phase breakdown, feature prioritization)
- VSG_DESIGN_PRINCIPLE.md (algorithm-first, privacy-first principles)
- CLAUDE_ACE.md (design philosophy, quality standards)

---

## **Table of Contents**

1. [Layout Principles & Philosophy](#1-layout-principles--philosophy)
2. [Global Layout Structure](#2-global-layout-structure)
3. [Phase 1 Layouts (Complete Product Launch)](#3-phase-1-layouts-complete-product-launch)
   - 3.1 [Landing Page](#31-landing-page)
   - 3.2 [Authentication Pages](#32-authentication-pages)
   - 3.3 [Upload Flow](#33-upload-flow)
   - 3.4 [Graph Canvas (Main Visualization)](#34-graph-canvas-main-visualization)
   - 3.5 [Insights Dashboard](#35-insights-dashboard)
      - 3.5.1 [Network Graph View](#351-network-graph-view)
      - 3.5.2 [Positioning Map View](#352-positioning-map-view)
      - 3.5.3 [Engagement Circles View](#353-engagement-circles-view)
      - 3.5.4 [Content Resonance View](#354-content-resonance-view)
      - 3.5.5 [Growth Opportunities View](#355-growth-opportunities-view)
   - 3.6 [Export & Sharing](#36-export--sharing)
   - 3.7 [Settings & Profile](#37-settings--profile)
   - 3.8 [User Dashboard](#38-user-dashboard)
4. [Phase 2+ Layouts (Future Features)](#4-phase-2-layouts-future-features)
5. [Responsive Breakpoints & Behavior](#5-responsive-breakpoints--behavior)
6. [Layout Flow & Navigation](#6-layout-flow--navigation)
7. [Marketing Copy Specifications](#7-marketing-copy-specifications)
8. [Icon & Button Placement Matrix](#8-icon--button-placement-matrix)
9. [Amendment Log](#9-amendment-log)

---

## **1. Layout Principles & Philosophy**

### **1.1 Core Layout Philosophy**

**From CLAUDE_ACE.md:**
> "Every pixel should sing. Every color should have purpose. Every interaction should feel inevitable."

**Layout Objectives:**
1. **Guided Discovery** - Progressive reveal, not overwhelming
2. **Privacy Trust** - Visual signals of privacy-first architecture
3. **Data Clarity** - Information hierarchy, scannable layouts
4. **Mobile-First** - 320px → 4K, responsive by default
5. **Aha Moment Amplification** - Layout serves the revelation

### **1.2 Layout Constraints (Non-Negotiable)**

**From VSG_DESIGN_PRINCIPLE.md:**
- **Algorithm-First**: Transparent metrics visible, explainable methods
- **Privacy-First**: "No account access" messaging prominent
- **Manual Upload**: Upload flow is primary entry, not secondary

**From VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md:**
- **Orange/Black/White Theme**: Primary brand colors only
- **8-Point Grid**: All spacing multiples of 4px
- **44px Minimum Touch Targets**: WCAG 2.2 AA compliance
- **System Fonts**: No custom font downloads

### **1.3 Layout Hierarchy Rules**

**Priority of Information (Top → Bottom, Left → Right):**
1. **Primary Action** (CTA, next step)
2. **Value Proposition** (what user gets)
3. **Trust Signals** (privacy, security, social proof)
4. **Secondary Information** (details, FAQs)
5. **Navigation & Meta** (footer, legal)

**Visual Weight Allocation:**
```
Hero/Primary: 40% of viewport height
Content/Data: 50% of viewport height
Footer/Meta: 10% of viewport height
```

---

## **2. Global Layout Structure**

### **2.1 Global Header (All Pages)**

**Phase 1 Implementation**

**Desktop Layout (1024px+):**
```
┌────────────────────────────────────────────────────────────────┐
│ Header (Sticky, 72px height, z-index: 1020)                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Logo + Text]        [Nav Links]        [CTA Button]     │   │
│ │ 200px                Auto                160px            │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Components (Left to Right):
├─ Logo + Text (200px width)
│  ├─ Icon: 32×32px VSG network icon (orange)
│  ├─ Text: "Visual Social Graph" (20px, semibold)
│  └─ Spacing: 8px gap between icon and text
│
├─ Navigation Links (Auto-width, centered)
│  ├─ Link 1: "Features" (hover: orange underline)
│  ├─ Link 2: "How It Works" (hover: orange underline)
│  ├─ Link 3: "Pricing" (Phase 1: hidden, Phase 2: visible)
│  ├─ Spacing: 32px gap between links
│  └─ Color: Gray-700 (default), Orange-500 (active/hover)
│
└─ Right Section (160px width)
   ├─ Theme Toggle (40×40px, icon button)
   │  ├─ Position: 8px margin-right
   │  └─ Icons: Sun (light mode), Moon (dark mode)
   │
   └─ Primary CTA Button (Phase-dependent)
      ├─ Phase 1 (Not logged in): "Get Started" (primary button)
      ├─ Phase 1 (Logged in): User avatar dropdown
      ├─ Size: 120px × 40px (small button variant)
      └─ Link: → /upload (if not logged in), → /dashboard (if logged in)
```

**Mobile Layout (320px - 1023px):**
```
┌───────────────────────────────┐
│ Header (Sticky, 56px height)  │
│ ┌───────────────────────────┐ │
│ │ [Logo] [Theme] [☰ Menu]   │ │
│ │ Auto   40px    40px       │ │
│ └───────────────────────────┘ │
└───────────────────────────────┘

Components:
├─ Logo (Compressed)
│  ├─ Icon: 24×24px VSG network icon
│  ├─ Text: "VSG" (abbreviated)
│  └─ Width: Auto (max 100px)
│
├─ Theme Toggle (40×40px, same as desktop)
│
└─ Hamburger Menu (40×40px, icon button)
   ├─ Icon: Three horizontal lines
   └─ Opens: Full-screen slide-in menu
      ├─ Navigation links (stacked)
      ├─ CTA button (full-width)
      └─ Close button (top-right)
```

**Header Behavior:**
- **Scroll:** Sticky on scroll, adds subtle shadow when scrolled
- **Transparency:** Solid background (no transparency)
- **Border:** 1px bottom border (Gray-200 light, Gray-700 dark)
- **Background:** White (light mode), Gray-900 (dark mode)

---

### **2.2 Global Footer (All Pages)**

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ Footer (Background: Gray-50 light / Gray-800 dark)             │
│ Padding: 48px 0                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Container (Max-width: 1440px, centered)                   │   │
│ │ ┌────────────┬────────────┬────────────┬────────────┐    │   │
│ │ │  Product   │  Company   │   Legal    │ Resources  │    │   │
│ │ │            │            │            │            │    │   │
│ │ │ Features   │  About     │  Privacy   │    Docs    │    │   │
│ │ │ Pricing    │  Blog      │  Terms     │    API     │    │   │
│ │ │ Sample     │  Careers   │  Security  │  Support   │    │   │
│ │ │ FAQ        │  Contact   │  GDPR      │  Status    │    │   │
│ │ └────────────┴────────────┴────────────┴────────────┘    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Footer Bottom (Centered, Gray-500)                        │   │
│ │ "© 2025 Visual Social Graph. Built with graph theory,    │   │
│ │  not guesswork."                                          │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Specifications:
├─ Grid: 4 columns (repeat(4, 1fr))
├─ Gap: 32px between columns
├─ Column Title: 12px, uppercase, semibold, letter-spacing: 0.05em
├─ Links: 14px, Gray-600, hover: Orange-500
├─ Line Height: 32px (generous spacing for readability)
└─ Footer Bottom: Border-top (1px, Gray-200), padding-top: 24px
```

**Mobile Layout:**
```
┌───────────────────────────────┐
│ Footer (Background: Gray-50)  │
│ Padding: 32px 16px            │
│ ┌───────────────────────────┐ │
│ │ Product                   │ │ ← Accordion (collapsed by default)
│ ├───────────────────────────┤ │
│ │ Company                   │ │ ← Accordion
│ ├───────────────────────────┤ │
│ │ Legal                     │ │ ← Accordion
│ ├───────────────────────────┤ │
│ │ Resources                 │ │ ← Accordion
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ "© 2025 VSG. Graph theory,│ │
│ │  not guesswork."          │ │
│ └───────────────────────────┘ │
└───────────────────────────────┘

Specifications:
├─ Accordion: Tap section title to expand/collapse
├─ Animation: Smooth height transition (200ms ease-out)
├─ Icon: Chevron right (collapsed), chevron down (expanded)
└─ Centered text for footer bottom
```

---

## **3. PHASE 1 LAYOUTS (COMPLETE PRODUCT LAUNCH)**

### **3.1 Landing Page**

**Purpose:** First impression, value proposition, trust signals, conversion to upload

**Desktop Layout (1440px viewport):**
```
┌────────────────────────────────────────────────────────────────┐
│ SECTION 1: HERO (Viewport height: 90vh, min: 600px)            │
│ Background: Gradient (Gray-50 → White, subtle)                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Container (Max-width: 1200px, centered, padding: 80px 0)  │   │
│ │ ┌────────────────────┐  ┌─────────────────────────────┐  │   │
│ │ │ LEFT: Text Content │  │ RIGHT: Visual Animation     │  │   │
│ │ │ (50% width)        │  │ (50% width)                 │  │   │
│ │ │                    │  │                             │  │   │
│ │ │ H1 (48-64px)       │  │ [Animated Network Graph]    │  │   │
│ │ │ "Discover the      │  │  SVG Animation:             │  │   │
│ │ │  Hidden Patterns   │  │  - 8 nodes pulsing          │  │   │
│ │ │  in Your Social    │  │  - Connection lines         │  │   │
│ │ │  Network"          │  │  - Community colors         │  │   │
│ │ │                    │  │  - Subtle motion (3s loop)  │  │   │
│ │ │ Subtitle (18-20px) │  │  Size: 600×400px            │  │   │
│ │ │ "Transform your    │  │  Background: White          │  │   │
│ │ │  LinkedIn, Twitter,│  │  Border-radius: 16px        │  │   │
│ │ │  Instagram data    │  │  Shadow: Medium elevation   │  │   │
│ │ │  into actionable   │  │                             │  │   │
│ │ │  insights."        │  │                             │  │   │
│ │ │                    │  │                             │  │   │
│ │ │ [Privacy Badge]    │  │                             │  │   │
│ │ │ "Privacy-first.    │  │                             │  │   │
│ │ │  No AI black boxes"│  │                             │  │   │
│ │ │                    │  │                             │  │   │
│ │ │ [CTA Buttons]      │  │                             │  │   │
│ │ │ ┌────────────────┐ │  │                             │  │   │
│ │ │ │ Upload Data    │ │  │                             │  │   │
│ │ │ │ (Primary)      │ │  │                             │  │   │
│ │ │ └────────────────┘ │  │                             │  │   │
│ │ │ ┌────────────────┐ │  │                             │  │   │
│ │ │ │ Try Sample     │ │  │                             │  │   │
│ │ │ │ (Secondary)    │ │  │                             │  │   │
│ │ │ └────────────────┘ │  │                             │  │   │
│ │ └────────────────────┘  └─────────────────────────────┘  │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

EXACT SPECIFICATIONS:

H1 (Headline):
├─ Font-size: clamp(2.5rem, 5vw, 4rem) = 40-64px
├─ Font-weight: 700 (Bold)
├─ Line-height: 1.167 (tight)
├─ Color: Gray-900 (light mode), Gray-50 (dark mode)
├─ Margin-bottom: 24px
└─ Max-width: 600px

Subtitle:
├─ Font-size: clamp(1.125rem, 2vw, 1.5rem) = 18-24px
├─ Font-weight: 400 (Normal)
├─ Line-height: 1.5 (normal)
├─ Color: Gray-600 (light mode), Gray-300 (dark mode)
├─ Margin-bottom: 32px
└─ Max-width: 600px

Privacy Badge:
├─ Display: Inline-flex with icon
├─ Icon: Shield with checkmark (16×16px, Orange-500)
├─ Text: 14px, semibold, Gray-700
├─ Background: Orange-50 (light mode), Orange-900/20 (dark mode)
├─ Padding: 8px 16px
├─ Border-radius: 24px (pill shape)
└─ Margin-bottom: 32px

CTA Button Group:
├─ Display: Flex, gap: 16px
├─ Wrap: wrap (mobile)
├─ Primary Button: "Upload Your Data"
│  ├─ Size: Large (px-8 py-4 = 32px × 52px)
│  ├─ Background: Orange-500
│  ├─ Text: White, 18px, semibold
│  ├─ Icon: Upload icon (20×20px, left side)
│  └─ Link: → /upload
└─ Secondary Button: "Try Sample Network"
   ├─ Size: Large (px-8 py-4 = 32px × 52px)
   ├─ Background: White
   ├─ Border: 2px solid Orange-500
   ├─ Text: Orange-700, 18px, semibold
   └─ Link: → /visualize/sample

Visual Animation (Right Side):
├─ Container: 600×400px
├─ Background: White (light), Gray-800 (dark)
├─ Border-radius: 16px
├─ Box-shadow: 0 10px 15px rgba(0,0,0,0.1)
├─ Border: 1px solid Gray-200 (light), Gray-700 (dark)
└─ SVG Content:
   ├─ 8 nodes (circles, r=12-20px based on "centrality")
   ├─ Colors: 5 community colors (Orange, Blue, Green, Purple, Pink)
   ├─ 12 edges (lines, stroke-width: 1-3px based on "weight")
   ├─ Animation: Pulse (scale 1 → 1.2 → 1, 3s loop, staggered)
   └─ Labels: First names only, 10px, Gray-700


┌────────────────────────────────────────────────────────────────┐
│ SECTION 2: FEATURES (Padding: 80px 0)                          │
│ Background: White (light mode), Gray-900 (dark mode)           │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Section Header (Centered, margin-bottom: 64px)           │   │
│ │ H2: "Why Visual Social Graph?"                           │   │
│ │ Subtitle: "Built on graph theory, not guesswork."        │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Feature Grid (3 columns, gap: 32px)                      │   │
│ │ ┌──────────┬──────────┬──────────┐                      │   │
│ │ │ Feature 1│Feature 2 │Feature 3 │                      │   │
│ │ │          │          │          │                      │   │
│ │ │ [Icon]   │ [Icon]   │ [Icon]   │                      │   │
│ │ │ 64×64px  │ 64×64px  │ 64×64px  │                      │   │
│ │ │          │          │          │                      │   │
│ │ │ Title    │ Title    │ Title    │                      │   │
│ │ │ 20px     │ 20px     │ 20px     │                      │   │
│ │ │          │          │          │                      │   │
│ │ │ Desc.    │ Desc.    │ Desc.    │                      │   │
│ │ │ 16px     │ 16px     │ 16px     │                      │   │
│ │ └──────────┴──────────┴──────────┘                      │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Feature Cards (3 cards, equal width):

Card 1: "Privacy-First"
├─ Icon: Shield with lock (64×64px)
│  ├─ Background: Orange-50 (circular, 80×80px container)
│  ├─ Icon color: Orange-500
│  └─ Center-aligned
├─ Title: "Privacy-First" (20px, semibold, center)
├─ Description: (16px, Gray-600, line-height: 1.625, center)
│  "80% client-side processing. No social platform connections.
│   Your data never leaves your control."
└─ Text-align: center

Card 2: "Algorithm-Driven"
├─ Icon: Checklist (64×64px)
│  ├─ Background: Orange-50 (circular, 80×80px container)
│  ├─ Icon color: Orange-500
│  └─ Center-aligned
├─ Title: "Algorithm-Driven" (20px, semibold, center)
└─ Description:
   "We identify your bridges (people who connect different groups),
    influencers (people whose opinions spread), and communities
    (clusters of interconnected people)—all using transparent algorithms."

Card 3: "Instant Insights"
├─ Icon: Lightning bolt (64×64px)
│  ├─ Background: Orange-50 (circular, 80×80px container)
│  ├─ Icon color: Orange-500
│  └─ Center-aligned
├─ Title: "Instant Insights" (20px, semibold, center)
└─ Description:
   "See your network's hidden patterns in seconds.
    Identify influencers, bridges, and communities instantly."


┌────────────────────────────────────────────────────────────────┐
│ SECTION 3: TRUST SIGNALS (Padding: 80px 0)                     │
│ Background: Gray-50 (light mode), Gray-800 (dark mode)         │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Section Header (Centered, margin-bottom: 64px)           │   │
│ │ H2: "Built on Trust & Transparency"                      │   │
│ │ Subtitle: "No AI dependency. No vendor lock-in.          │   │
│ │            Just deterministic graph algorithms."         │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Trust Badge Grid (4 columns, gap: 24px)                  │   │
│ │ ┌─────────┬─────────┬─────────┬─────────┐               │   │
│ │ │ Badge 1 │ Badge 2 │ Badge 3 │ Badge 4 │               │   │
│ │ │         │         │         │         │               │   │
│ │ │ [Icon]  │ [Icon]  │ [Icon]  │ [Icon]  │               │   │
│ │ │ Title   │ Title   │ Title   │ Title   │               │   │
│ │ │ Text    │ Text    │ Text    │ Text    │               │   │
│ │ └─────────┴─────────┴─────────┴─────────┘               │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Trust Badges (4 cards, equal width):

Badge 1: "GDPR Compliant"
├─ Icon: Shield with checkmark (48×48px, Orange-500)
├─ Title: "GDPR Compliant" (16px, semibold)
└─ Text: "Full data deletion on request. Your privacy is non-negotiable."
   (14px, Gray-600)

Badge 2: "Open Algorithms"
├─ Icon: Document with code (48×48px, Orange-500)
├─ Title: "Open Algorithms" (16px, semibold)
└─ Text: "Every insight is explainable. No black-box AI inference."

Badge 3: "Fast & Local"
├─ Icon: Clock/Speed (48×48px, Orange-500)
├─ Title: "Fast & Local" (16px, semibold)
└─ Text: "80% processing happens in your browser. No server dependency."

Badge 4: "No Vendor Lock-In"
├─ Icon: Building/Open door (48×48px, Orange-500)
├─ Title: "No Vendor Lock-In" (16px, semibold)
└─ Text: "Export your visualizations and data anytime. You own your insights."

Card Specifications:
├─ Background: White (light), Gray-700 (dark)
├─ Border: 1px solid Gray-200 (light), Gray-600 (dark)
├─ Border-radius: 12px
├─ Padding: 24px
├─ Transition: box-shadow 200ms, border-color 200ms
└─ Hover: box-shadow elevation +1, border-color: Orange-500


┌────────────────────────────────────────────────────────────────┐
│ SECTION 4: CTA (Call to Action) (Padding: 80px 0)              │
│ Background: Linear gradient (Orange-500 → Orange-600)          │
│ Color: White (all text)                                        │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Container (Max-width: 800px, centered, text-align:center)│   │
│ │                                                           │   │
│ │ H2: "Ready to See Your Network Differently?"             │   │
│ │ (48px, white, semibold)                                  │   │
│ │                                                           │   │
│ │ P: "Upload your social network data and discover         │   │
│ │     insights in under 60 seconds."                       │   │
│ │ (20px, white, opacity: 0.95)                             │   │
│ │                                                           │   │
│ │ [CTA Buttons - Horizontal]                               │   │
│ │ ┌──────────────────┐  ┌──────────────────┐              │   │
│ │ │ Start Free       │  │ Explore Sample   │              │   │
│ │ │ Analysis         │  │ Network          │              │   │
│ │ │ (White bg)       │  │ (Outline)        │              │   │
│ │ └──────────────────┘  └──────────────────┘              │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Button Specifications:
├─ Primary Button: "Start Free Analysis"
│  ├─ Background: White
│  ├─ Text: Orange-600, 18px, semibold
│  ├─ Size: Large (px-8 py-4)
│  ├─ Link: → /upload
│  └─ Hover: Background Gray-50
│
└─ Secondary Button: "Explore Sample Network"
   ├─ Background: Transparent
   ├─ Border: 2px solid White
   ├─ Text: White, 18px, semibold
   ├─ Size: Large (px-8 py-4)
   ├─ Link: → /visualize/sample
   └─ Hover: Background rgba(255,255,255,0.1)
```

**Mobile Layout (375px viewport):**
```
┌───────────────────────────────┐
│ HERO SECTION                  │
│ (Single column, stacked)      │
│ ┌───────────────────────────┐ │
│ │ H1 (36px)                 │ │
│ │ "Discover Hidden Patterns"│ │
│ │                           │ │
│ │ Subtitle (16px)           │ │
│ │ "Transform your social    │ │
│ │  data into insights"      │ │
│ │                           │ │
│ │ [Privacy Badge]           │ │
│ │                           │ │
│ │ [Buttons - Stacked]       │ │
│ │ ┌───────────────────────┐ │ │
│ │ │ Upload Data (Full)    │ │ │
│ │ └───────────────────────┘ │ │
│ │ ┌───────────────────────┐ │ │
│ │ │ Try Sample (Full)     │ │ │
│ │ └───────────────────────┘ │ │
│ │                           │ │
│ │ [Network Visual]          │ │
│ │ (Full width, 300px height)│ │
│ └───────────────────────────┘ │
└───────────────────────────────┘

FEATURES SECTION
┌───────────────────────────────┐
│ H2 (30px, center)             │
│ "Why VSG?"                    │
│                               │
│ Subtitle (14px, center)       │
│                               │
│ [Feature 1 - Full Width]     │
│ ┌───────────────────────────┐ │
│ │ Icon (48×48px, center)    │ │
│ │ Title (18px)              │ │
│ │ Description (14px)        │ │
│ └───────────────────────────┘ │
│                               │
│ [Feature 2 - Full Width]     │
│ [Feature 3 - Full Width]     │
└───────────────────────────────┘

TRUST SIGNALS SECTION
┌───────────────────────────────┐
│ H2 (30px, center)             │
│                               │
│ [Badge 1 - Full Width]       │
│ [Badge 2 - Full Width]       │
│ [Badge 3 - Full Width]       │
│ [Badge 4 - Full Width]       │
└───────────────────────────────┘

CTA SECTION
┌───────────────────────────────┐
│ H2 (30px, center, white)      │
│ P (16px, white)               │
│                               │
│ [Button 1 - Full Width]      │
│ [Button 2 - Full Width]      │
└───────────────────────────────┘

Mobile-Specific Rules:
├─ Padding: 48px 16px (reduce from desktop 80px 0)
├─ Font sizes: Scale down by 25-30%
├─ Buttons: Always full-width (width: 100%)
├─ Grid: Always 1 column (no multi-column)
├─ Gap: Reduce from 32px to 24px
└─ Margin-bottom: Reduce proportionally
```

---

### **3.2 Authentication Pages**

**Phase 1: Magic Link + Google OAuth**

**Sign Up / Login Page Layout (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 480px, centered, margin-top: 120px)      │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Card (White bg, border: Gray-200, border-radius: 16px)   │   │
│ │ Padding: 48px                                             │   │
│ │                                                           │   │
│ │ [Logo + Text] (Centered, 32×32px icon)                   │   │
│ │ "Visual Social Graph"                                    │   │
│ │                                                           │   │
│ │ H2: "Sign in to Visual Social Graph"                     │   │
│ │ (24px, semibold, center, margin-bottom: 32px)            │   │
│ │                                                           │   │
│ │ ─────────── Sign Up / Login ───────────                  │   │
│ │                                                           │   │
│ │ [Email Input] (Full width)                               │   │
│ │ ┌───────────────────────────────────────────────────┐    │   │
│ │ │ Enter your email                                  │    │   │
│ │ │ (Placeholder, Gray-400)                           │    │   │
│ │ └───────────────────────────────────────────────────┘    │   │
│ │ (Height: 48px, border: 2px Gray-200, border-radius: 8px) │   │
│ │                                                           │   │
│ │ [Primary Button - Full Width]                            │   │
│ │ ┌───────────────────────────────────────────────────┐    │   │
│ │ │ Continue with Email                               │    │   │
│ │ │ (Orange-500 bg, White text, 18px)                 │    │   │
│ │ └───────────────────────────────────────────────────┘    │   │
│ │ (Height: 52px, border-radius: 8px)                       │   │
│ │                                                           │   │
│ │ ──────────── OR ────────────                             │   │
│ │ (14px, Gray-500, margin: 24px 0)                         │   │
│ │                                                           │   │
│ │ [Google OAuth Button - Full Width]                       │   │
│ │ ┌───────────────────────────────────────────────────┐    │   │
│ │ │ [Google Icon] Continue with Google                │    │   │
│ │ │ (White bg, Gray-700 text, border: Gray-300)       │    │   │
│ │ └───────────────────────────────────────────────────┘    │   │
│ │ (Height: 52px, border-radius: 8px)                       │   │
│ │                                                           │   │
│ │ ──────────────────────────────────────────────────────   │   │
│ │                                                           │   │
│ │ Privacy Note (14px, Gray-600, center):                   │   │
│ │ "We'll send you a magic link to sign in.                 │   │
│ │  No password required."                                  │   │
│ │                                                           │   │
│ │ [Link] "Privacy Policy"  |  "Terms of Service"           │   │
│ │ (14px, Orange-600, underline on hover)                   │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

States:
├─ Default: Email input focused on load
├─ Email entered: "Continue" button enabled
├─ Loading: Spinner in button, disabled state
├─ Success: "Check your email!" message
└─ Error: Red border on input, error message below
```

**Magic Link Sent Page:**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 480px, centered)                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Email Icon] (64×64px, Orange-500, centered)             │   │
│ │                                                           │   │
│ │ H2: "Check Your Email"                                   │   │
│ │ (24px, semibold, center)                                 │   │
│ │                                                           │   │
│ │ P: "We sent a magic link to:"                            │   │
│ │ [user@email.com] (bold, Orange-600)                      │   │
│ │                                                           │   │
│ │ P: "Click the link in your email to sign in.             │   │
│ │     The link expires in 15 minutes."                     │   │
│ │ (16px, Gray-600, center)                                 │   │
│ │                                                           │   │
│ │ [Secondary Button]                                       │   │
│ │ "Resend Email" (disabled for 60 seconds)                 │   │
│ │                                                           │   │
│ │ [Link] "Use a different email"                           │   │
│ │ (14px, Orange-600)                                       │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

### **3.3 Upload Flow**

**Purpose:** Guide users from platform selection → file upload → processing → success

**Phase 1: 4-Step Wizard**

**Step Indicator (All Upload Pages):**
```
┌────────────────────────────────────────────────────────────────┐
│ Wizard Progress (Centered, margin-bottom: 48px)                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [1] ────── [2] ────── [3] ────── [4]                     │   │
│ │ Platform   Upload   Processing  Complete                 │   │
│ │ (Active: Orange-500, Completed: Green-500, Pending: Gray)│   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Specifications:
├─ Step Number: Circle (32px diameter)
│  ├─ Active: Background Orange-500, Text White, border 2px Orange-600
│  ├─ Completed: Background Green-500, Text White, checkmark icon
│  └─ Pending: Background Gray-200, Text Gray-500, border Gray-300
├─ Step Label: Below circle, 14px
│  ├─ Active: semibold, Gray-900
│  └─ Pending: normal, Gray-500
└─ Connector Line: 1px solid, length auto-fill
   ├─ Completed: Green-500
   └─ Pending: Gray-300
```

**Step 1: Platform Selection (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 800px, centered)                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ H1: "Select Your Social Platform"                        │   │
│ │ (36px, semibold, center, margin-bottom: 16px)            │   │
│ │                                                           │   │
│ │ P: "Choose the platform you want to visualize"           │   │
│ │ (18px, Gray-600, center, margin-bottom: 48px)            │   │
│ │                                                           │   │
│ │ Platform Grid (2×3 grid, gap: 24px)                      │   │
│ │ ┌─────────────┬─────────────┬─────────────┐             │   │
│ │ │  LinkedIn   │  Twitter    │ Instagram   │             │   │
│ │ │  [Icon]     │  [Icon]     │  [Icon]     │             │   │
│ │ │  48×48px    │  48×48px    │  48×48px    │             │   │
│ │ └─────────────┴─────────────┴─────────────┘             │   │
│ │ ┌─────────────┬─────────────┬─────────────┐             │   │
│ │ │  Facebook   │  TikTok     │  More Soon  │             │   │
│ │ │  [Icon]     │  [Icon]     │  [Icon]     │             │   │
│ │ │  48×48px    │  48×48px    │  48×48px    │             │   │
│ │ └─────────────┴─────────────┴─────────────┘             │   │
│ │                                                           │   │
│ │ Each card:                                               │   │
│ │ ├─ Width: ~250px                                         │   │
│ │ ├─ Height: 160px                                         │   │
│ │ ├─ Padding: 24px                                         │   │
│ │ ├─ Border: 2px solid Gray-200 (default)                  │   │
│ │ ├─ Border: 2px solid Orange-500 (selected)               │   │
│ │ ├─ Background: White (default), Orange-50 (selected)     │   │
│ │ ├─ Cursor: pointer                                       │   │
│ │ ├─ Transition: all 200ms ease                            │   │
│ │ └─ Hover: Border Orange-300, shadow-md                   │   │
│ │                                                           │   │
│ │ [Continue Button - Centered]                             │   │
│ │ ┌───────────────────────────────────────┐                │   │
│ │ │ Continue to Upload                    │                │   │
│ │ │ (Disabled until platform selected)    │                │   │
│ │ └───────────────────────────────────────┘                │   │
│ │ (Orange-500 bg, White text, 160px width, 52px height)    │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Platform Card Layout:
├─ Icon (48×48px, centered, brand color)
├─ Platform Name (16px, semibold, center, margin-top: 16px)
├─ Status Badge (if applicable)
│  └─ "Most Popular" (LinkedIn) - Green badge, 12px
└─ Checkmark (if selected, top-right corner, 20×20px, Orange-500)
```

**Step 2: File Upload (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 800px, centered)                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ H1: "Upload Your LinkedIn Data"                          │   │
│ │ (36px, semibold, center)                                 │   │
│ │                                                           │   │
│ │ P: "Accepted formats: ZIP (recommended), CSV, JSON       │   │
│ │     Max size: 2GB"                                       │   │
│ │ (16px, Gray-600, center, margin-bottom: 32px)            │   │
│ │                                                           │   │
│ │ ┌──────────────────────────────────────────────────────┐ │   │
│ │ │ UPLOAD ZONE (Full width, height: 400px)              │ │   │
│ │ │ Border: 2px dashed Gray-300 (default)                │ │   │
│ │ │ Border: 2px dashed Orange-500 (drag over)            │ │   │
│ │ │ Background: Gray-50 (default), Orange-50 (drag over) │ │   │
│ │ │ Border-radius: 16px                                  │ │   │
│ │ │ Padding: 64px                                        │ │   │
│ │ │ Cursor: pointer                                      │ │   │
│ │ │                                                       │ │   │
│ │ │ [Upload Icon] (64×64px, Orange-500, centered)        │ │   │
│ │ │ (Cloud with up arrow)                                │ │   │
│ │ │                                                       │ │   │
│ │ │ H3: "Drag & Drop Your File Here"                     │ │   │
│ │ │ (24px, semibold, center)                             │ │   │
│ │ │                                                       │ │   │
│ │ │ P: "or click to browse"                              │ │   │
│ │ │ (16px, Gray-500, center)                             │ │   │
│ │ │                                                       │ │   │
│ │ │ <input type="file" hidden>                           │ │   │
│ │ └──────────────────────────────────────────────────────┘ │   │
│ │                                                           │   │
│ │ ┌──────────────────────────────────────────────────────┐ │   │
│ │ │ PRIVACY NOTE (Info banner)                           │ │   │
│ │ │ Background: Blue-50, Border-left: 4px Blue-500       │ │   │
│ │ │ Padding: 16px, Border-radius: 8px                    │ │   │
│ │ │                                                       │ │   │
│ │ │ [Info Icon] "Privacy Note: 80% of processing         │ │   │
│ │ │             happens locally in your browser.         │ │   │
│ │ │             Your data is encrypted during transfer." │ │   │
│ │ │ (14px, Blue-900)                                     │ │   │
│ │ └──────────────────────────────────────────────────────┘ │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Upload Zone States:
├─ Default: Dashed border, gray
├─ Drag Over: Dashed border orange, background orange-50
├─ File Selected: Show file info card
│  ├─ File name (16px, semibold)
│  ├─ File size (14px, Gray-600)
│  ├─ Remove button (X icon, top-right)
│  └─ Upload progress bar (if uploading)
└─ Error: Red border, error message below
```

**Step 3: Processing (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 600px, centered)                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Spinner Animation] (80×80px, centered)                   │   │
│ │ (Circular, Orange-500, rotating)                          │   │
│ │                                                           │   │
│ │ H2: "Analyzing Your Network..."                          │   │
│ │ (30px, semibold, center)                                 │   │
│ │                                                           │   │
│ │ P: "This usually takes 30-60 seconds"                    │   │
│ │ (16px, Gray-600, center)                                 │   │
│ │                                                           │   │
│ │ ┌──────────────────────────────────────────────────────┐ │   │
│ │ │ PROGRESS BAR                                          │ │   │
│ │ │ ┌──────────────────────────────────────────────────┐ │ │   │
│ │ │ │ [Orange-500 fill, animated left to right]        │ │ │   │
│ │ │ │ Width: 0% → 100% (smooth transition)             │ │ │   │
│ │ │ └──────────────────────────────────────────────────┘ │ │   │
│ │ │ Height: 8px, Border-radius: 4px                      │ │   │
│ │ │ Background: Gray-200                                 │ │   │
│ │ └──────────────────────────────────────────────────────┘ │   │
│ │                                                           │   │
│ │ ┌──────────────────────────────────────────────────────┐ │   │
│ │ │ PROCESSING STAGES (Margin-top: 32px)                 │ │   │
│ │ │                                                       │ │   │
│ │ │ [⏳] Parsing connections...                          │ │   │
│ │ │ [📊] Calculating graph metrics...                    │ │   │
│ │ │ [🔍] Detecting communities...                        │ │   │
│ │ │ [✨] Generating insights...                          │ │   │
│ │ │                                                       │ │   │
│ │ │ Each stage:                                          │ │   │
│ │ │ ├─ Icon: 24×24px emoji (left)                        │ │   │
│ │ │ ├─ Text: 16px, left-aligned                          │ │   │
│ │ │ ├─ Spacing: 12px gap, 16px margin-bottom             │ │   │
│ │ │ ├─ Active: Background Orange-50, Text Orange-700     │ │   │
│ │ │ ├─ Completed: Text Green-600, checkmark icon         │ │   │
│ │ │ └─ Pending: Text Gray-500                            │ │   │
│ │ └──────────────────────────────────────────────────────┘ │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Processing Animation:
├─ Progress bar: Linear animation, 0% → 100%, ~45 seconds
├─ Stages: Sequential highlighting (10s each)
│  ├─ Stage 1 active: 0-10s
│  ├─ Stage 2 active: 10-20s
│  ├─ Stage 3 active: 20-30s
│  └─ Stage 4 active: 30-45s
└─ Spinner: Continuous rotation, 1s per revolution
```

**Step 4: Success (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Container (Max-width: 600px, centered)                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Success Icon] (80×80px, Green-500, centered)            │   │
│ │ (Checkmark in circle)                                    │   │
│ │                                                           │   │
│ │ H2: "Analysis Complete!"                                 │   │
│ │ (36px, semibold, center)                                 │   │
│ │                                                           │   │
│ │ P: "We've identified 50 connections, 5 communities,      │   │
│ │     and 12 insights in your network."                    │   │
│ │ (18px, Gray-600, center)                                 │   │
│ │                                                           │   │
│ │ ┌──────────────────────────────────────────────────────┐ │   │
│ │ │ NETWORK STATS (Grid: 3 columns, gap: 24px)           │ │   │
│ │ │ ┌─────────┬─────────┬─────────┐                      │ │   │
│ │ │ │   50    │   120   │    5    │                      │ │   │
│ │ │ │  Nodes  │  Edges  │ Commun. │                      │ │   │
│ │ │ └─────────┴─────────┴─────────┘                      │ │   │
│ │ │                                                       │ │   │
│ │ │ Each stat:                                           │ │   │
│ │ │ ├─ Value: 48px, bold, Orange-500                     │ │   │
│ │ │ └─ Label: 12px, uppercase, Gray-500                  │ │   │
│ │ └──────────────────────────────────────────────────────┘ │   │
│ │                                                           │   │
│ │ [CTA Buttons - Horizontal, gap: 16px, centered]          │   │
│ │ ┌──────────────────┐  ┌──────────────────┐              │   │
│ │ │ Explore Network  │  │ View Insights    │              │   │
│ │ │ (Primary)        │  │ (Secondary)      │              │   │
│ │ │ → /visualize/:id │  │ → /insights/:id  │              │   │
│ │ └──────────────────┘  └──────────────────┘              │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Upload Flow (375px):**
- Same 4 steps, vertical layout
- Platform cards: Full width, stacked
- Upload zone: Height reduced to 300px
- Progress stages: Stacked vertically
- Buttons: Always full-width

---

**CONTINUED IN NEXT FILE (3.4 onwards) - This is a comprehensive document. Should I continue with the remaining sections (Graph Canvas, Insights, Dashboard, Phase 2 layouts, etc.)?**

This document is already substantial. I can continue with:
1. Graph Canvas layout (the centerpiece visualization)
2. Insights dashboard layout
3. Phase 2 enhancements
4. Responsive specifications
5. Marketing copy specifications
6. Icon/button placement matrix

Would you like me to continue in a new file or would you prefer I consolidate this differently?

### **3.4 Graph Canvas (Main Visualization)**

**Purpose:** THE CENTERPIECE - Interactive network graph visualization with 5-stage guided reveal

**Phase 1 Implementation - Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Graph Page Layout (Full viewport, flex container)              │
│ ┌──────┬──────────────────────────────────────────────────┐   │
│ │      │                                                   │   │
│ │Filter│  CANVAS AREA (Main visualization)                │   │
│ │Panel │  Background: White (light), Gray-900 (dark)      │   │
│ │      │  with subtle dot grid pattern:                   │   │
│ │      │  - Dot size: 1px radius                          │   │
│ │300px │  - Dot opacity: 5% black (light), 3% white (dark)│   │
│ │width │  - Grid spacing: 20px × 20px                     │   │
│ │      │  - Effect: Visible but not overwhelming          │   │
│ │      │                                                   │   │
│ │      │  CSS Implementation:                             │   │
│ │      │  background-image: radial-gradient(             │   │
│ │      │    circle, rgba(0,0,0,0.05) 1px, transparent 1px)│   │
│ │      │  background-size: 20px 20px                      │   │
│ │      │                                                   │   │
│ │      │  ┌────────────────────────────────────────────┐  │   │
│ │      │  │ #graph-canvas                              │  │   │
│ │      │  │ (SVG container, D3.js force-directed)      │  │   │
│ │Sticky│  │                                            │  │   │
│ │      │  │ Nodes: 50 circles (4-20px radius)          │  │   │
│ │      │  │ Edges: 120 lines (1-3px width)             │  │   │
│ │      │  │ Colors: 5 community colors                 │  │   │
│ │      │  │ Labels: Key nodes only (bridges,influencers)│  │   │
│ │      │  │                                            │  │   │
│ │      │  │ Interactive:                               │  │   │
│ │      │  │ - Pan: Click + drag background             │  │   │
│ │      │  │ - Zoom: Scroll wheel / pinch               │  │   │
│ │      │  │ - Click node: Show detail panel            │  │   │
│ │      │  │ - Hover node: Highlight + connected edges  │  │   │
│ │      │  │ - Drag node: Repositions (physics sim)     │  │   │
│ │      │  └────────────────────────────────────────────┘  │   │
│ │      │                                                   │   │
│ │      │  ┌────────────────────────────────────────────┐  │   │
│ │      │  │ CONTROLS BAR (Bottom, centered)            │  │   │
│ │      │  │ Position: Absolute, bottom: 24px           │  │   │
│ │      │  │ Background: White, Border: Gray-200        │  │   │
│ │      │  │ Shadow: Elevation-3, Border-radius: 12px   │  │   │
│ │      │  │ Padding: 12px, Gap: 8px between buttons    │  │   │
│ │      │  │                                            │  │   │
│ │      │  │ [Filter] [Zoom-] [Zoom+] [Fit] [Legend]   │  │   │
│ │      │  │  Toggle   Out     In     View   Toggle     │  │   │
│ │      │  │  40x40    40x40   40x40  40x40  40x40      │  │   │
│ │      │  └────────────────────────────────────────────┘  │   │
│ │      │                                                   │   │
│ │      │  ┌────────────────────────────────────────────┐  │   │
│ │      │  │ LEGEND (Top-right corner)                  │  │   │
│ │      │  │ Position: Absolute, top: 24px, right: 24px │  │   │
│ │      │  │ Max-width: 250px                           │  │   │
│ │      │  │ Background: White, Border: Gray-200        │  │   │
│ │      │  │ Shadow: Elevation-2, Border-radius: 12px   │  │   │
│ │      │  │ Padding: 16px                              │  │   │
│ │      │  │                                            │  │   │
│ │      │  │ Title: "Communities" (14px, semibold)      │  │   │
│ │      │  │                                            │  │   │
│ │      │  │ [●] Tech Innovators        (10)            │  │   │
│ │      │  │ [●] Creative Designers     (10)            │  │   │
│ │      │  │ [●] Business Leaders       (10)            │  │   │
│ │      │  │ [●] Marketing Experts      (10)            │  │   │
│ │      │  │ [●] Data Scientists        (10)            │  │   │
│ │      │  │                                            │  │   │
│ │      │  │ Each legend item:                          │  │   │
│ │      │  │ ├─ Dot: 12×12px, community color           │  │   │
│ │      │  │ ├─ Label: 12px, Gray-700                   │  │   │
│ │      │  │ ├─ Count: 12px, Gray-500, right-aligned    │  │   │
│ │      │  │ └─ Gap: 8px between items                  │  │   │
│ │      │  └────────────────────────────────────────────┘  │   │
│ └──────┴──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

FILTER SIDEBAR (Left, 300px width):
┌──────────────────────────────────┐
│ Filter Panel                     │
│ Background: White (light)        │
│ Border-right: 1px Gray-200       │
│ Padding: 24px                    │
│ Overflow-y: auto                 │
│                                  │
│ [Header]                         │
│ H3: "Filters" (20px, semibold)   │
│ [X Close] (Mobile only)          │
│                                  │
│ ──────────────────────────────   │
│                                  │
│ COMMUNITIES (Filter Group)       │
│ Label: "COMMUNITIES" (12px, ↑)   │
│                                  │
│ [✓] Tech Innovators     (10)     │
│ [✓] Creative Designers  (10)     │
│ [✓] Business Leaders    (10)     │
│ [✓] Marketing Experts   (10)     │
│ [✓] Data Scientists     (10)     │
│                                  │
│ Each checkbox:                   │
│ ├─ Checkbox: 16×16px             │
│ ├─ Color dot: 16×16px circle     │
│ ├─ Label: 14px, Gray-700         │
│ ├─ Count: 14px, Gray-500         │
│ ├─ Padding: 8px                  │
│ ├─ Hover: Background Gray-50     │
│ └─ Border-radius: 6px            │
│                                  │
│ **COMMUNITY LABELING SYSTEM:**   │
│                                  │
│ Communities are algorithmically  │
│ detected, then labeled using     │
│ client-side LLM (optional):      │
│                                  │
│ 1. Default: Generic labels       │
│    - "Community A", "Community B"│
│    - Or: "Orange Group", etc.    │
│                                  │
│ 2. Smart Labels (optional):      │
│    - Uses Phi-3-mini (500MB)     │
│    - Runs 100% in browser        │
│    - Analyzes profile data       │
│    - Suggests: "Tech Founders",  │
│      "Marketing Pros", etc.      │
│                                  │
│ 3. Manual labeling:              │
│    - Click [✏️ Edit] button      │
│    - Rename any community        │
│    - Stored in localStorage      │
│                                  │
│ [✏️] Edit Label (icon button)    │
│ Position: Next to each comm. label│
│ Size: 16×16px, hover visible     │
│                                  │
│ ──────────────────────────────   │
│                                  │
│ NODE SIZE (Filter Group)         │
│ Label: "NODE SIZE" (12px, ↑)     │
│                                  │
│ <select> Betweenness Centrality  │
│ Options:                         │
│ ├─ Betweenness Centrality        │
│ ├─ PageRank                      │
│ └─ Degree                        │
│                                  │
│ Select dropdown:                 │
│ ├─ Width: 100%                   │
│ ├─ Height: 40px                  │
│ ├─ Border: 2px Gray-200          │
│ ├─ Border-radius: 8px            │
│ └─ Padding: 8px 12px             │
│                                  │
│ ──────────────────────────────   │
│                                  │
│ MIN EDGE WEIGHT (Filter Group)   │
│ Label: "MIN EDGE WEIGHT"         │
│                                  │
│ <input type="range">             │
│ Min: 0, Max: 1, Step: 0.1        │
│ Value display: "0.5"             │
│                                  │
│ Range labels:                    │
│ "All" ←────────────→ "Strong"    │
│                                  │
│ ──────────────────────────────   │
│                                  │
│ NETWORK STATS (Info Box)         │
│ Background: Gray-50              │
│ Border-radius: 8px               │
│ Padding: 16px                    │
│                                  │
│ Nodes:        50                 │
│ Edges:        120                │
│ Communities:  5                  │
│                                  │
│ Each stat:                       │
│ ├─ Label: 14px, Gray-600, left   │
│ └─ Value: 14px, Gray-900, right  │
└──────────────────────────────────┘

NODE DETAIL PANEL (Right, slide-in):
┌──────────────────────────────────┐
│ Detail Panel                     │
│ Width: 350px                     │
│ Position: Absolute, right: 0     │
│ Transform: translateX(100%)      │
│            (hidden by default)   │
│ Transform: translateX(0)         │
│            (visible when active) │
│ Transition: 300ms ease-out       │
│ Background: White                │
│ Border-left: 1px Gray-200        │
│ Shadow: Elevation-4              │
│ Padding: 24px                    │
│ Overflow-y: auto                 │
│ z-index: 1050                    │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Header                       │ │
│ │ ┌─────────────────┬────────┐ │ │
│ │ │ Alex Chen       │  [X]   │ │ │
│ │ │ (24px, semibold)│ Close  │ │ │
│ │ │                 │        │ │ │
│ │ │ [BRIDGE] Badge  │        │ │ │
│ │ │ (Orange bg)     │        │ │ │
│ │ └─────────────────┴────────┘ │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ METRICS GRID (2×2)           │ │
│ │ ┌──────────┬──────────┐      │ │
│ │ │  0.82    │  0.045   │      │ │
│ │ │Between.  │PageRank  │      │ │
│ │ ├──────────┼──────────┤      │ │
│ │ │    12    │   Tech   │      │ │
│ │ │Connections│Community│      │ │
│ │ └──────────┴──────────┘      │ │
│ │                              │ │
│ │ Each metric card:            │ │
│ │ ├─ Background: Gray-50       │ │
│ │ ├─ Padding: 16px             │ │
│ │ ├─ Border-radius: 8px        │ │
│ │ ├─ Value: 24px, bold, Orange │ │
│ │ └─ Label: 10px, ↑, Gray-500  │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ ANALYSIS                     │ │
│ │ H4: "Analysis" (14px, ↑)     │ │
│ │                              │ │
│ │ P: "Alex Chen acts as a      │ │
│ │     critical bridge between  │ │
│ │     Tech and Business        │ │
│ │     communities, facilitating│ │
│ │     knowledge exchange."     │ │
│ │ (14px, Gray-600, line: 1.625)│ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ CONNECTED NODES              │ │
│ │ H4: "Top Connections" (14px) │ │
│ │                              │ │
│ │ 1. Maria Garcia    (0.9)     │ │
│ │ 2. Sarah Johnson   (0.85)    │ │
│ │ 3. Sophie Martin   (0.7)     │ │
│ │ ...                          │ │
│ │                              │ │
│ │ Each connection:             │ │
│ │ ├─ Number: 12px, Gray-500    │ │
│ │ ├─ Name: 14px, Gray-700      │ │
│ │ ├─ Weight: 14px, Orange-500  │ │
│ │ └─ Clickable: → Show node    │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**5-STAGE GUIDED REVEAL (First-time users):**
```
┌────────────────────────────────────────────────────────────────┐
│ GUIDED REVEAL OVERLAY                                           │
│ Position: Fixed, full viewport                                  │
│ Background: rgba(0,0,0,0.8) (dark overlay)                      │
│ z-index: 9999                                                   │
│ Display: flex, align-items: center, justify-content: center    │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Reveal Content Card                                       │   │
│ │ Max-width: 500px                                          │   │
│ │ Background: White (light), Gray-800 (dark)                │   │
│ │ Border-radius: 16px                                       │   │
│ │ Padding: 48px                                             │   │
│ │ Text-align: center                                        │   │
│ │                                                           │   │
│ │ [Stage Badge] "STAGE 1 OF 5"                              │   │
│ │ (12px, Orange-500, semibold, ↑)                           │   │
│ │                                                           │   │
│ │ H2: "Welcome to Your Network"                             │   │
│ │ (30px, semibold)                                          │   │
│ │                                                           │   │
│ │ P: "Let's explore your network together. We'll highlight  │   │
│ │     key patterns and insights in 5 quick steps."          │   │
│ │ (16px, Gray-600, line-height: 1.625)                      │   │
│ │                                                           │   │
│ │ [Buttons - Horizontal, gap: 16px]                         │   │
│ │ ┌──────────────┐  ┌──────────────┐                        │   │
│ │ │ Skip Tutorial│  │ Next →       │                        │   │
│ │ │ (Secondary)  │  │ (Primary)    │                        │   │
│ │ └──────────────┘  └──────────────┘                        │   │
│ │                                                           │   │
│ │ [Progress Dots]                                           │   │
│ │ ● ○ ○ ○ ○                                                │   │
│ │ (8px circles, Orange-500 active, Gray-300 inactive)       │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

Reveal Stages Content:
├─ Stage 1: "Welcome to Your Network"
│  Description: "Let's explore together. 5 quick steps."
│  Graph highlight: None (full view)
│
├─ Stage 2: "These Are Your Communities"
│  Description: "5 distinct communities, each with different focuses."
│  Graph highlight: Pulse each community color group sequentially
│
├─ Stage 3: "Key Influencers"
│  Description: "Larger nodes = higher betweenness centrality."
│  Graph highlight: Spotlight on top 5 largest nodes
│
├─ Stage 4: "Bridge Connections"
│  Description: "Connections between communities. Critical for info flow."
│  Graph highlight: Highlight edges between different communities
│
└─ Stage 5: "Ready to Explore!"
   Description: "Click nodes for details. Use controls to zoom/filter."
   Graph highlight: None (return to full view, enable interactions)
```

**Mobile Graph Canvas (375px):**
```
┌───────────────────────────────┐
│ Header (56px, sticky)         │
│ [Logo] [☰]                    │
├───────────────────────────────┤
│                               │
│ GRAPH CANVAS                  │
│ (Full viewport height)        │
│                               │
│ Touch gestures:               │
│ - Pinch: Zoom                 │
│ - Two-finger drag: Pan        │
│ - Tap node: Show detail       │
│ - Tap background: Deselect    │
│                               │
├───────────────────────────────┤
│ CONTROLS (Bottom)             │
│ ┌───────────────────────────┐ │
│ │[Filter][−][+][⊡][Legend]  │ │
│ │ Spread across full width  │ │
│ └───────────────────────────┘ │
│ Height: 56px                  │
│ Background: White/blur        │
│ Border-top: 1px Gray-200      │
└───────────────────────────────┘

Mobile Adaptations:
├─ Filter: Opens as bottom sheet (slide up)
├─ Legend: Opens as bottom sheet (slide up)
├─ Node Detail: Opens as bottom sheet (slide up, 70% height)
├─ Controls: Always visible bottom bar
└─ Graph: Optimized for touch (larger hit areas)
```

---

### **3.8 User Dashboard**

**Purpose:** Hub for managing graphs, viewing history, accessing settings

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ Dashboard Header                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ H1: "My Networks"                                         │   │
│ │ (36px, semibold)                                          │   │
│ │                                                           │   │
│ │ [Upload New Network] Button (Primary, top-right)          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ NETWORKS GRID (Grid: 3 columns, gap: 24px)               │   │
│ │ ┌─────────────┬─────────────┬─────────────┐             │   │
│ │ │ Network 1   │ Network 2   │ Network 3   │             │   │
│ │ │             │             │             │             │   │
│ │ │ [Preview]   │ [Preview]   │ [Preview]   │             │   │
│ │ │ LinkedIn    │ Twitter     │ Instagram   │             │   │
│ │ │ 50 nodes    │ 234 nodes   │ 89 nodes    │             │   │
│ │ │ 5 communities│ 8 communities│ 4 communities│            │   │
│ │ │             │             │             │             │   │
│ │ │ [View]      │ [View]      │ [View]      │             │   │
│ │ └─────────────┴─────────────┴─────────────┘             │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Empty State (if no networks):                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Illustration] (200×200px, centered)                      │   │
│ │ "No networks yet" illustration                            │   │
│ │                                                           │   │
│ │ H3: "No Networks Yet"                                     │   │
│ │ (24px, semibold, center)                                 │   │
│ │                                                           │   │
│ │ P: "Upload your first social network data to see your    │   │
│ │     connections visualized."                             │   │
│ │ (16px, Gray-600, center)                                 │   │
│ │                                                           │   │
│ │ [Upload Data] Button (Primary, large, centered)          │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

NETWORK CARD:
┌──────────────────────────────────┐
│ Network Card                     │
│ Background: White                │
│ Border: 1px Gray-200             │
│ Border-radius: 12px              │
│ Padding: 0 (visual) + 20px (text)│
│ Overflow: hidden                 │
│ Hover: Shadow elevation +1       │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ GRAPH PREVIEW (200px height) │ │
│ │ Background: Gray-50          │ │
│ │ Mini network visualization   │ │
│ │ (10 nodes, simplified)       │ │
│ └──────────────────────────────┘ │
│                                  │
│ [Platform Icon] LinkedIn         │
│ (24×24px, left)                  │
│                                  │
│ H4: "LinkedIn Network"           │
│ (18px, semibold)                 │
│                                  │
│ Stats (14px, Gray-600):          │
│ • 50 nodes                       │
│ • 120 connections                │
│ • 5 communities                  │
│                                  │
│ "Uploaded: Dec 28, 2025"         │
│ (12px, Gray-500)                 │
│                                  │
│ ──────────────────────────────   │
│                                  │
│ [View Network] Button (Full-width│
│ Secondary button, margin-top:16px│
│                                  │
│ [···] Menu (top-right)           │
│ └─ Export                        │
│ └─ Delete                        │
└──────────────────────────────────┘
```

---

**Note:** Phase 1 includes all core features for complete product launch.

---

### **3.5 Insights Dashboard (All 5 Core Views)**

The insights dashboard provides 5 complete visualization types for network analysis.

#### **3.5.1 Network Graph View (Enhanced Visualization)**

**Purpose:** Interactive force-directed graph with advanced filters and annotations

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Enhanced Graph Page                                            │
│ ┌──────────┬──────────────────────────────────────────────┐   │
│ │ ADVANCED │  CANVAS AREA (Full viewport - header)        │   │
│ │ FILTER   │                                              │   │
│ │ SIDEBAR  │  Enhanced controls:                          │   │
│ │ 350px    │  ┌────────────────────────────────────────┐  │   │
│ │          │  │ Top Control Bar (absolute, top: 24px)  │  │   │
│ │          │  │ ┌──────┬──────┬──────┬──────┬────────┐ │  │   │
│ │Community │  │ │Layout│Filter│Export│Annot.│Settings│ │  │   │
│ │Filters:  │  │ │ ∨    │ ∨    │      │      │   ⚙   │ │  │   │
│ │☑ All     │  │ └──────┴──────┴──────┴──────┴────────┘ │  │   │
│ │☑ Tech    │  └────────────────────────────────────────┘  │   │
│ │☑ Business│                                              │   │
│ │☑ Creative│  GRAPH CANVAS (SVG)                          │   │
│ │☐ Health  │  • Nodes with role-based shapes:            │   │
│ │☐ Other   │    - Bridges: Pentagon (high betweenness)   │   │
│ │          │    - Influencers: Star (high PageRank)      │   │
│ │Node Roles│    - Connectors: Circle (high degree)       │   │
│ │☑ Bridges │    - Peripheral: Triangle (low connections) │   │
│ │☑ Influenc│  • Edge weights visualized (1-5px width)    │   │
│ │☑ Connect.│  • Hover tooltip with full metrics          │   │
│ │☐ Periph. │  • Click → Right panel detail view          │   │
│ │          │  • Double-click → Expand neighborhood       │   │
│ │Metrics:  │                                              │   │
│ │Betweenness│ Annotations Layer (overlay):                │   │
│ │[====|--] │  • Text labels for key nodes                │   │
│ │0.0 - 1.0 │  • Arrows pointing to insights              │   │
│ │          │  • Community boundary circles               │   │
│ │PageRank  │                                              │   │
│ │[==|----] │  LEGEND (bottom-right, 200×120px):          │   │
│ │0.0 - 0.1 │  ┌────────────────────────────┐             │   │
│ │          │  │ Node Sizes:                │             │   │
│ │Degree    │  │ ○ 4px  = 1-5 connections   │             │   │
│ │[===|---] │  │ ● 8px  = 6-10 connections  │             │   │
│ │1 - 20    │  │ ● 12px = 11-15 connections │             │   │
│ │          │  │ ● 20px = 16+ connections   │             │   │
│ │Layout:   │  │                            │             │   │
│ │● Force   │  │ Roles:                     │             │   │
│ │○ Circular│  │ ⬟ Bridge  ★ Influencer    │             │   │
│ │○ Radial  │  │ ● Connector ▲ Peripheral  │             │   │
│ │○ Hier.   │  └────────────────────────────┘             │   │
│ │          │                                              │   │
│ │[Apply]   │  ZOOM CONTROLS (bottom-left, 40×120px):     │   │
│ │[Reset]   │  [+] Zoom in (icon)                         │   │
│ └──────────┤  [○] Reset zoom                             │   │
│            │  [-] Zoom out                               │   │
│  RIGHT     │  [⊡] Fit to screen                          │   │
│  PANEL     │                                              │   │
│  (opens    └──────────────────────────────────────────────┘   │
│  on click) │                                                  │
└────────────┴──────────────────────────────────────────────────┘
```

**Advanced Filter Sidebar (350px):**
- **Section 1: Community Filters** (expand/collapse)
  - Checkboxes for each community (0-7)
  - "Select All" / "Deselect All" links
  - Color-coded labels matching graph

- **Section 2: Node Role Filters**
  - ☑ Bridges (Pentagon icon)
  - ☑ Influencers (Star icon)
  - ☑ Connectors (Circle icon)
  - ☐ Peripheral (Triangle icon)
  - Count badge: (12) next to each

- **Section 3: Metric Sliders**
  - Betweenness: 0.0 - 1.0 (dual-handle range slider)
  - PageRank: 0.0 - 0.1 (dual-handle)
  - Degree: 1 - 20 (dual-handle)
  - Live update as user drags

- **Section 4: Layout Options**
  - Radio buttons:
    - ● Force-directed (default)
    - ○ Circular (community-based)
    - ○ Radial (influence-based)
    - ○ Hierarchical (bridge-based)

- **Section 5: Display Options**
  - Toggle: Show Labels (on key nodes only / all nodes / none)
  - Toggle: Show Edge Weights (boolean)
  - Toggle: Highlight Communities (boundary circles)

- **Buttons:**
  - [Apply Filters] (Primary, full-width)
  - [Reset All] (Secondary, full-width)

**Right Detail Panel (slides from right, 400px):**
Opens when node is clicked. Semi-transparent backdrop.

```
┌──────────────────────────────────┐
│ [×] Close (top-right)            │
│                                  │
│ NODE DETAIL PANEL                │
│ ──────────────────────────       │
│                                  │
│ [Avatar/Icon] (60×60px, center)  │
│ Community color background       │
│                                  │
│ H3: "Alex Chen"                  │
│ (24px, semibold, center)         │
│                                  │
│ Role Badge: "Bridge"             │
│ (Pill, orange-100 bg, center)    │
│                                  │
│ ─────────────────────────────    │
│                                  │
│ METRICS GRID (2 columns):        │
│ ┌──────────┬──────────┐          │
│ │ Degree   │    12    │          │
│ │ (14px, gray-600)    │          │
│ ├──────────┼──────────┤          │
│ │PageRank  │  0.045   │          │
│ ├──────────┼──────────┤          │
│ │Between.  │  0.82    │          │
│ ├──────────┼──────────┤          │
│ │Community │ Tech Inn.│          │
│ └──────────┴──────────┘          │
│                                  │
│ ─────────────────────────────    │
│                                  │
│ NETWORK POSITION:                │
│ (16px, medium)                   │
│                                  │
│ "Alex is a critical bridge       │
│ between Tech Innovators and      │
│ Business Leaders communities.    │
│ Removing Alex would increase     │
│ network fragmentation by 23%."   │
│ (14px, gray-700, line-height 1.6)│
│                                  │
│ ─────────────────────────────    │
│                                  │
│ CONNECTIONS (12):                │
│ (Scrollable list, max 200px)     │
│                                  │
│ ┌────────────────────────┐       │
│ │ [Avatar] Sarah Lee     │       │
│ │ Edge: 0.8 │ Business   │       │
│ │ [View →]               │       │
│ ├────────────────────────┤       │
│ │ [Avatar] Mike Johnson  │       │
│ │ Edge: 0.6 │ Tech       │       │
│ │ [View →]               │       │
│ └────────────────────────┘       │
│                                  │
│ [View All Connections →]         │
│                                  │
│ ─────────────────────────────    │
│                                  │
│ [Export Node Data]               │
│ (Secondary button, full-width)   │
│                                  │
└──────────────────────────────────┘
```

**Mobile Network Graph (375px):**
- Filter sidebar → Bottom sheet (slides up from bottom)
- Tap filter icon (top-right) to open bottom sheet
- Bottom sheet: 60% viewport height, draggable handle
- Graph canvas: Full viewport (touch gestures enabled)
- Node detail: Full-screen modal (slides from right)
- Zoom controls: Floating bottom-right (48×48px touch targets)

---

#### **3.5.2 Positioning Map View**

**Purpose:** 2D scatter plot showing influence vs. reach positioning

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Positioning Map                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Chart Container (aspect-ratio 16:10, max-width 1200px)   │   │
│ │                                                          │   │
│ │     ↑ Influence (PageRank)                               │   │
│ │ 0.1 │                                                     │   │
│ │     │        ★ Alex (Influencer + Bridge)                │   │
│ │     │                                                     │   │
│ │     │    ●                           ★                   │   │
│ │0.08 │         ● Sarah                                    │   │
│ │     │                                                     │   │
│ │     │                  ●        ●                         │   │
│ │0.06 │      ●                                              │   │
│ │     │                                                     │   │
│ │     │  ●        ●          ●              ●              │   │
│ │0.04 │                                                     │   │
│ │     │                          ●    ●                    │   │
│ │     │      ●                                 ●           │   │
│ │0.02 │                  ●                          ●      │   │
│ │     │          ●                    ●                    │   │
│ │     │                                                     │   │
│ │   0 └─────────────────────────────────────────────────→  │   │
│ │     0     2      4      6      8     10    12    14   16 │   │
│ │                     Reach (Degree)                        │   │
│ │                                                          │   │
│ │ Quadrants (labeled, light background):                   │   │
│ │ ┌────────────────┬────────────────┐                      │   │
│ │ │ HIDDEN GEMS    │ INFLUENCERS    │                      │   │
│ │ │ (Low Reach,    │ (High Reach,   │                      │   │
│ │ │  High Influence│  High Influence│                      │   │
│ │ ├────────────────┼────────────────┤                      │   │
│ │ │ PERIPHERAL     │ CONNECTORS     │                      │   │
│ │ │ (Low Reach,    │ (High Reach,   │                      │   │
│ │ │  Low Influence)│  Low Influence)│                      │   │
│ │ └────────────────┴────────────────┘                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ LEGEND (right side, 250px):                                    │
│ ┌──────────────────────────────────┐                           │
│ │ Node Types:                      │                           │
│ │ ★ Influencer (High PageRank)     │                           │
│ │ ⬟ Bridge (High Betweenness)      │                           │
│ │ ● Connector (High Degree)        │                           │
│ │ ▲ Peripheral (Low all metrics)   │                           │
│ │                                  │                           │
│ │ Community Colors:                │                           │
│ │ ● Tech Innovators (#F97316)      │                           │
│ │ ● Business Leaders (#3B82F6)     │                           │
│ │ ● Creative Minds (#10B981)       │                           │
│ │ ● Health & Wellness (#8B5CF6)    │                           │
│ │ ● Other (#6B7280)                │                           │
│ └──────────────────────────────────┘                           │
│                                                                │
│ INSIGHTS PANEL (below chart):                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📊 Key Insights                                          │   │
│ │ ─────────────────────────────────────────────            │   │
│ │                                                          │   │
│ │ • 8 people in Influencer quadrant (top-right)            │   │
│ │   → These are your most valuable connections             │   │
│ │                                                          │   │
│ │ • 3 hidden gems (top-left): Alex Chen, Maria Garcia,     │   │
│ │   David Wong                                             │   │
│ │   → High influence but limited reach - potential for     │   │
│ │      expanding their network                             │   │
│ │                                                          │   │
│ │ • 12 people in Peripheral quadrant (bottom-left)         │   │
│ │   → Consider: Are these connections still relevant?      │   │
│ │                                                          │   │
│ │ [Explore Recommendations →]                              │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- Hover node → Tooltip with name + exact metrics
- Click node → Highlight in graph + show detail panel
- Zoom/pan enabled (mouse wheel + drag)
- Toggle quadrant labels (button in top-right)
- Filter by community (checkboxes below chart)

**Mobile (375px):**
- Chart: Full-width, square aspect ratio
- Quadrant labels: Abbreviated (HG, INF, PER, CON)
- Legend: Collapsible accordion below chart
- Insights: Stacked vertically, full-width

---

#### **3.5.3 Engagement Circles View**

**Purpose:** Concentric circles showing engagement frequency tiers

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Engagement Circles                                             │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ SVG Canvas (600×600px, centered)                         │   │
│ │                                                          │   │
│ │              ┌───────────────────────┐                   │   │
│ │             ╱ INNER CIRCLE (Daily)   ╲                  │   │
│ │            │   5 people               │                 │   │
│ │            │   [●] [●] [●] [●] [●]    │                 │   │
│ │            │   Positioned evenly       │                 │   │
│ │             ╲  around center          ╱                  │   │
│ │              └───────────────────────┘                   │   │
│ │                                                          │   │
│ │         ┌────────────────────────────────┐               │   │
│ │        ╱ MIDDLE CIRCLE (Weekly)          ╲              │   │
│ │       │   12 people                       │             │   │
│ │       │   [●] [●] [●] [●] [●] [●]        │             │   │
│ │       │   [●] [●] [●] [●] [●] [●]        │             │   │
│ │        ╲                                 ╱              │   │
│ │         └────────────────────────────────┘               │   │
│ │                                                          │   │
│ │    ┌───────────────────────────────────────┐             │   │
│ │   ╱ OUTER CIRCLE (Monthly)                 ╲            │   │
│ │  │   18 people                              │           │   │
│ │  │   [●] [●] [●] [●] [●] [●] [●] [●] [●]   │           │   │
│ │  │   [●] [●] [●] [●] [●] [●] [●] [●] [●]   │           │   │
│ │   ╲                                         ╱            │   │
│ │    └───────────────────────────────────────┘             │   │
│ │                                                          │   │
│ │ ┌────────────────────────────────────────────┐           │   │
│ │╱ PERIPHERAL (Rare/Never)                     ╲          │   │
│ ││   15 people                                  │         │   │
│ ││   [●] [●] [●] ... (scattered around edge)    │         │   │
│ │╲                                              ╱          │   │
│ │ └────────────────────────────────────────────┘           │   │
│ │                                                          │   │
│ │ Center Label: "You" (16px, semibold)                     │   │
│ │ Circle Labels: Positioned at 12 o'clock each tier        │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ LEGEND & STATS (right side, 300px):                            │
│ ┌──────────────────────────────────┐                           │
│ │ Engagement Tiers                 │                           │
│ │ ──────────────────────────       │                           │
│ │                                  │                           │
│ │ 🔥 Daily (Inner Circle)          │                           │
│ │    5 people (10%)                │                           │
│ │    Avg. 5.2 interactions/week    │                           │
│ │    → Your core network           │                           │
│ │                                  │                           │
│ │ 🌟 Weekly (Middle Circle)        │                           │
│ │    12 people (24%)               │                           │
│ │    Avg. 2.1 interactions/week    │                           │
│ │    → Regular contacts            │                           │
│ │                                  │                           │
│ │ 💬 Monthly (Outer Circle)        │                           │
│ │    18 people (36%)               │                           │
│ │    Avg. 0.8 interactions/week    │                           │
│ │    → Occasional contacts         │                           │
│ │                                  │                           │
│ │ 💤 Rare/Never (Peripheral)       │                           │
│ │    15 people (30%)               │                           │
│ │    Avg. 0.1 interactions/week    │                           │
│ │    → Dormant connections         │                           │
│ │                                  │                           │
│ │ ──────────────────────────       │                           │
│ │                                  │                           │
│ │ 💡 Insight:                      │                           │
│ │ 66% of your network is engaged   │                           │
│ │ at least monthly. This is above  │                           │
│ │ average (typical: 45-55%).       │                           │
│ │                                  │                           │
│ │ [View Recommendations →]         │                           │
│ └──────────────────────────────────┘                           │
│                                                                │
│ ACTIONABLE RECOMMENDATIONS (below):                            │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🎯 Actions You Can Take                                  │   │
│ │ ─────────────────────────────────────────────            │   │
│ │                                                          │   │
│ │ 1. STRENGTHEN PERIPHERAL CONNECTIONS (15 people)         │   │
│ │    These people are in your network's outer circle       │   │
│ │    (few connections to others). Consider reaching out:   │   │
│ │    • Sarah Lee (Business Leaders community)             │   │
│ │    • Mike Chen (Tech Innovators community)              │   │
│ │    • Lisa Wong (Creative Designers community)           │   │
│ │                                                          │   │
│ │    [View All 15 →]                                       │   │
│ │                                                          │   │
│ │ 2. CONNECT ISOLATED CLUSTERS (3 opportunities)          │   │
│ │    These groups could benefit from more connections:     │   │
│ │    • Connect Alex Johnson (Tech) with Sarah Lee (Biz)   │   │
│ │    • High potential for collaboration                    │   │
│ │                                                          │   │
│ │    [View Details →]                                      │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- Hover node → Tooltip with name, community, connection strength
- Click node → Detail panel (slides from right)
- Filter by community (top controls)
- Animate on load: Nodes fade in from center outward (0.5s stagger)

**Mobile (375px):**
- Circles: 320×320px (square, centered)
- Smaller nodes (8px vs 12px desktop)
- Legend: Below circles, collapsible
- Recommendations: Full-width cards, stacked

---

#### **3.5.4 Content Resonance View**

**Purpose:** Bar chart showing which content types resonate with which communities

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Content Resonance Analysis                                     │
│                                                                │
│ FILTER BAR (top):                                              │
│ [All Communities ∨] [Last 30 Days ∨] [All Content Types ∨]     │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Grouped Bar Chart (800×500px)                            │   │
│ │                                                          │   │
│ │     Engagement Rate (0-100%)                             │   │
│ │ 100%│                                                     │   │
│ │     │                                                     │   │
│ │  80%│                                                     │   │
│ │     │       ███                                           │   │
│ │  60%│       ███         ███                               │   │
│ │     │ ███   ███   ███   ███         ███                   │   │
│ │  40%│ ███   ███   ███   ███   ███   ███   ███             │   │
│ │     │ ███   ███   ███   ███   ███   ███   ███   ███       │   │
│ │  20%│ ███   ███   ███   ███   ███   ███   ███   ███   ███ │   │
│ │     │ ███   ███   ███   ███   ███   ███   ███   ███   ███ │   │
│ │   0%└─┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───┤   │
│ │      Art Tech Career Life News Edu  Memes Health Politics│   │
│ │                                                          │   │
│ │ Bar Groups (5 bars per content type):                    │   │
│ │ ■ Tech Innovators (Orange)                               │   │
│ │ ■ Business Leaders (Blue)                                │   │
│ │ ■ Creative Minds (Green)                                 │   │
│ │ ■ Health & Wellness (Purple)                             │   │
│ │ ■ Other (Gray)                                           │   │
│ │                                                          │   │
│ │ Hover: Tooltip shows exact % + community name            │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ KEY INSIGHTS (below chart):                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🎯 Top Performers                                        │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ 1. Tech Content → Tech Innovators: 78% engagement        │   │
│ │    This is expected. Your tech audience loves tech posts.│   │
│ │                                                          │   │
│ │ 2. Career Advice → Business Leaders: 65% engagement      │   │
│ │    Career posts resonate strongly with this community.   │   │
│ │                                                          │   │
│ │ 3. SURPRISE: Memes → Health & Wellness: 72% engagement   │   │
│ │    Your wellness community unexpectedly engages with     │   │
│ │    meme content 2.1× more than average.                  │   │
│ │                                                          │   │
│ │ [View Detailed Breakdown →]                              │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ RECOMMENDATIONS (2-column grid):                               │
│ ┌────────────────────────────┬─────────────────────────────┐   │
│ │ 📈 AMPLIFY                 │ 🔄 ADJUST                   │   │
│ │ ────────────────────       │ ────────────────────        │   │
│ │                            │                             │   │
│ │ Post more:                 │ Consider reducing:          │   │
│ │ • Tech content for Tech    │ • Politics for all groups   │   │
│ │   Innovators (78% engage.) │   (avg 12% engagement)      │   │
│ │ • Memes for Health &       │ • News for Creative Minds   │   │
│ │   Wellness (72% engage.)   │   (18% engagement)          │   │
│ │                            │                             │   │
│ │ Best posting times:        │ Experiment with:            │   │
│ │ • Weekdays 9-11am (EST)    │ • Video content (currently  │   │
│ │ • Tuesdays +23% engagement │   only 5% of posts)         │   │
│ │                            │ • Polls (high engagement    │   │
│ │                            │   potential: 65% avg)       │   │
│ └────────────────────────────┴─────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- Click bar → Drill down to specific posts in that category
- Toggle communities on/off (legend is interactive)
- Change time range (Last 7/30/90 days, All time)
- Export chart as PNG/SVG

**Mobile (375px):**
- Rotate chart 90° (horizontal bars instead of vertical)
- Stacked bars instead of grouped
- Tap bar → Expand detail view
- Insights: Accordion, one open at a time

---

#### **3.5.5 Growth Opportunities View**

**Purpose:** Prioritized list of actionable network growth strategies

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│ Growth Opportunities                                           │
│                                                                │
│ HERO STATS (3-column grid):                                    │
│ ┌──────────────────┬──────────────────┬──────────────────┐     │
│ │ 🎯 OPPORTUNITIES │ 💡 QUICK WINS    │ 🚀 LONG-TERM     │     │
│ │ ────────────     │ ────────────     │ ────────────     │     │
│ │      12          │        5         │        7         │     │
│ │ Identified       │ (< 1 week)       │ (1+ month)       │     │
│ └──────────────────┴──────────────────┴──────────────────┘     │
│                                                                │
│ FILTER & SORT:                                                 │
│ [All Types ∨] [Sort: Impact ∨] [Difficulty: All ∨]             │
│                                                                │
│ OPPORTUNITY CARDS (vertical list, gap: 24px):                  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ OPPORTUNITY CARD #1                                      │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ Header (flex, space-between):                            │   │
│ │ ┌──────────────────────────────────────┬──────────────┐  │   │
│ │ │ 🎯 Bridge the Tech-Business Gap      │ [QUICK WIN]  │  │   │
│ │ │ (20px, semibold)                     │ (Badge,green)│  │   │
│ │ └──────────────────────────────────────┴──────────────┘  │   │
│ │                                                          │   │
│ │ Impact Score (visual):                                   │   │
│ │ Impact: [████████░░] 8/10 (High)                         │   │
│ │ Effort: [███░░░░░░░] 3/10 (Low)                          │   │
│ │ Timeline: 1-2 weeks                                      │   │
│ │                                                          │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ THE INSIGHT:                                             │   │
│ │ Your Tech Innovators and Business Leaders communities    │   │
│ │ are poorly connected (only 2 edges between 20 people).   │   │
│ │ Adding 3-5 connections would reduce network fragmentation│   │
│ │ by 18% and increase information flow by ~40%.            │   │
│ │                                                          │   │
│ │ WHY IT MATTERS:                                          │   │
│ │ These are your two largest communities (10 + 8 people).  │   │
│ │ Better connection means better collaboration, knowledge  │   │
│ │ sharing, and opportunity discovery.                      │   │
│ │                                                          │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ 🎯 RECOMMENDED ACTIONS:                                  │   │
│ │                                                          │   │
│ │ 1. INTRODUCE: Alex Chen → Sarah Lee                      │   │
│ │    Why: Alex (Tech) is working on AI tools, Sarah        │   │
│ │    (Business) leads digital transformation. High synergy.│   │
│ │    Confidence: 87%                                       │   │
│ │    [Draft Introduction Email] [Skip] [Done ✓]           │   │
│ │                                                          │   │
│ │ 2. INTRODUCE: Mike Johnson → Lisa Wang                   │   │
│ │    Why: Both interested in startup scaling (common tags) │   │
│ │    Confidence: 76%                                       │   │
│ │    [Draft Introduction Email] [Skip] [Done ✓]           │   │
│ │                                                          │   │
│ │ 3. HOST: Tech-Business Mixer Event                       │   │
│ │    Create casual intro opportunity for both communities  │   │
│ │    Expected new connections: 5-8                         │   │
│ │    [Plan Event] [Skip] [Done ✓]                          │   │
│ │                                                          │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ PROGRESS: 0/3 actions completed                          │   │
│ │ [●○○] (progress dots)                                    │   │
│ │                                                          │   │
│ │ [Mark as In Progress] [Dismiss] [Expand Details ∨]       │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ OPPORTUNITY CARD #2                                      │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ 🔄 Re-Engage Dormant High-Value Connections              │   │
│ │                                        [MEDIUM EFFORT]   │   │
│ │                                                          │   │
│ │ Impact: [███████░░░] 7/10 (High)                         │   │
│ │ Effort: [█████░░░░░] 5/10 (Medium)                       │   │
│ │ Timeline: 2-4 weeks                                      │   │
│ │                                                          │   │
│ │ THE INSIGHT:                                             │   │
│ │ 6 of your connections are high-value (influencers or     │   │
│ │ bridges) but are in your network's peripheral zone.      │   │
│ │                                                          │   │
│ │ RECOMMENDED ACTIONS:                                     │   │
│ │ 1. Sarah Martinez (Business Leaders community)           │   │
│ │    Role: Influencer - Consider reconnecting              │   │
│ │    [Add to Contact List] [Skip] [Done ✓]                │   │
│ │                                                          │   │
│ │ 2. David Chen (Tech Innovators community)                │   │
│ │    Role: Bridge - Connects multiple groups               │   │
│ │    [Add to Contact List] [Skip] [Done ✓]                │   │
│ │                                                          │   │
│ │ [View All 6 →]                                           │   │
│ │                                                          │   │
│ │ [Plan Outreach] [Dismiss]                                │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ OPPORTUNITY CARD #3                                      │   │
│ │ ──────────────────────────────────────────               │   │
│ │                                                          │   │
│ │ 🌱 Strengthen Emerging Community                         │   │
│ │                                        [LONG-TERM]       │   │
│ │                                                          │   │
│ │ Impact: [██████░░░░] 6/10 (Medium-High)                  │   │
│ │ Effort: [███████░░░] 7/10 (High)                         │   │
│ │ Timeline: 1-3 months                                     │   │
│ │                                                          │   │
│ │ THE INSIGHT:                                             │   │
│ │ "Health & Wellness" community has grown 40% in 2 months  │   │
│ │ but lacks a clear leader/influencer. Adding a central    │   │
│ │ connector could stabilize and accelerate growth.         │   │
│ │                                                          │   │
│ │ RECOMMENDED ACTIONS:                                     │   │
│ │ 1. Recruit health influencer from extended network       │   │
│ │ 2. Elevate current member to community leader role       │   │
│ │ 3. Organize wellness-focused group activity              │   │
│ │                                                          │   │
│ │ [Explore Strategies] [Dismiss]                           │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ... (9 more opportunities)                                     │
│                                                                │
│ [Load More Opportunities] (if > 12)                            │
└────────────────────────────────────────────────────────────────┘
```

**Card Structure (standard across all opportunities):**
- **Header**: Title + Badge (Quick Win / Medium / Long-term)
- **Metrics**: Impact (0-10), Effort (0-10), Timeline
- **Insight**: What the data shows
- **Why It Matters**: Business value
- **Recommended Actions**: Specific, actionable steps (1-5 items)
- **Progress Tracker**: Visual indicator of completion
- **CTAs**: [Primary Action] [Dismiss] [More Details]

**Badge Colors:**
- Quick Win (< 1 week, low effort): Green (#10B981)
- Medium Effort (2-4 weeks): Blue (#3B82F6)
- Long-term (1+ months): Purple (#8B5CF6)

**Mobile (375px):**
- Cards: Full-width, stacked vertically
- Collapse details by default, tap to expand
- Actions: Full-width buttons, stacked
- Metrics: Simplified bars (smaller)

---

### **3.6 Export & Sharing Layouts**

Phase 2 introduces export capabilities for insights and data.

#### **4.2.1 Export Modal**

Triggered by [Export] button in various views.

**Desktop Modal (600px wide):**
```
┌──────────────────────────────────────┐
│ Export Network Data                  │
│ ──────────────────────────────       │
│                    [×] Close (top-R) │
│                                      │
│ EXPORT FORMAT:                       │
│ (Radio buttons, vertical)            │
│ ● PDF Report (Insights + Visuals)    │
│ ○ Raw Data (JSON)                    │
│ ○ Raw Data (CSV)                     │
│ ○ Social Share Image (PNG)           │
│                                      │
│ ──────────────────────────────       │
│                                      │
│ WHAT TO INCLUDE: (if PDF selected)   │
│ (Checkboxes)                         │
│ ☑ Network Overview                   │
│ ☑ Graph Visualization                │
│ ☑ Community Breakdown                │
│ ☑ Top Influencers                    │
│ ☑ Positioning Map                    │
│ ☑ Engagement Circles                 │
│ ☐ Raw Data Tables                    │
│                                      │
│ ──────────────────────────────       │
│                                      │
│ PRIVACY OPTIONS:                     │
│ ☑ Anonymize names (use initials)     │
│ ☐ Remove profile images              │
│ ☑ Exclude contact information        │
│                                      │
│ ──────────────────────────────       │
│                                      │
│ Preview (thumbnail, 200×150px):      │
│ ┌────────────────────────────┐       │
│ │ [PDF preview thumbnail]    │       │
│ │ Page 1 of 8                │       │
│ └────────────────────────────┘       │
│                                      │
│ ──────────────────────────────       │
│                                      │
│ [Generate Preview] (Secondary)       │
│ [Export] (Primary, full-width)       │
│                                      │
│ File size: ~2.4 MB                   │
│ Format: PDF (A4, Portrait)           │
└──────────────────────────────────────┘
```

**After clicking [Export]:**
- Progress bar with stages:
  1. Preparing data...
  2. Rendering visualizations...
  3. Generating PDF...
  4. Complete! [Download] button appears

**Mobile (375px):**
- Modal: Full-screen (slide up from bottom)
- All options: Full-width, larger touch targets
- Preview: Square, centered, full-width

---

#### **4.2.2 Share Card Generator**

For social media sharing (LinkedIn, Twitter, etc.)

**Desktop Layout (800px modal):**
```
┌────────────────────────────────────────────────────────┐
│ Create Social Share Card                               │
│ ────────────────────────────────────────               │
│                                      [×] Close         │
│                                                        │
│ TWO-COLUMN LAYOUT:                                     │
│ ┌─────────────────────┬────────────────────────────┐   │
│ │ EDITOR (Left)       │ PREVIEW (Right)            │   │
│ │ 400px               │ 400px                      │   │
│ │                     │                            │   │
│ │ SELECT TEMPLATE:    │ ┌────────────────────────┐ │   │
│ │ ● Network Stats     │ │ [1200×630px preview]   │ │   │
│ │ ○ Top Insight       │ │                        │ │   │
│ │ ○ Positioning Map   │ │ LIVE PREVIEW           │ │   │
│ │ ○ Community Breakdown│ │ updates as you edit   │ │   │
│ │                     │ │                        │ │   │
│ │ CUSTOMIZE:          │ │ Background: Orange     │ │   │
│ │ Background Color:   │ │                        │ │   │
│ │ [Orange ∨]          │ │ "My Network:"          │ │   │
│ │                     │ │                        │ │   │
│ │ Headline:           │ │ 50 connections         │ │   │
│ │ [My Network Stats]  │ │ 5 communities          │ │   │
│ │                     │ │ 8 influencers          │ │   │
│ │ Show Logo:          │ │                        │ │   │
│ │ ☑ VSG watermark     │ │ Powered by VSG         │ │   │
│ │                     │ └────────────────────────┘ │   │
│ │ Include:            │                            │   │
│ │ ☑ Key stats         │ Dimensions: 1200×630px     │   │
│ │ ☑ Mini graph        │ (Optimal for LinkedIn)     │   │
│ │ ☐ Personal photo    │                            │   │
│ │                     │ [Download PNG]             │   │
│ │ ─────────────────   │ [Copy Image]               │   │
│ │                     │                            │   │
│ │ [Generate Card]     │                            │   │
│ └─────────────────────┴────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

**Templates:**
1. **Network Stats**: Key numbers (nodes, edges, communities) with mini graph
2. **Top Insight**: One insight card with large headline
3. **Positioning Map**: Screenshot of positioning map with annotation
4. **Community Breakdown**: Pie chart + percentages

**Output Sizes:**
- LinkedIn: 1200×630px (default)
- Twitter: 1200×675px
- Instagram: 1080×1080px (square)

---

### **3.7 Settings & Profile Pages**

#### **4.3.1 Settings Page**

**Desktop Layout (1200px max-width):**
```
┌────────────────────────────────────────────────────────────────┐
│ Settings                                                       │
│                                                                │
│ TWO-COLUMN LAYOUT:                                             │
│ ┌──────────────┬───────────────────────────────────────────┐   │
│ │ SIDEBAR      │ CONTENT AREA                              │   │
│ │ (240px)      │ (flex-1, max 800px)                       │   │
│ │              │                                           │   │
│ │ Navigation:  │ ┌───────────────────────────────────────┐ │   │
│ │ ● General    │ │ GENERAL SETTINGS                      │ │   │
│ │ ○ Privacy    │ │ ───────────────────────────────       │ │   │
│ │ ○ Display    │ │                                       │ │   │
│ │ ○ Data       │ │ Profile Information:                  │ │   │
│ │ ○ Export     │ │ ┌─────────────────────────────────┐   │ │   │
│ │ ○ Account    │ │ │ Email:                          │   │ │   │
│ │              │ │ │ [user@example.com]  [Verified ✓]│  │ │   │
│ │              │ │ │                                 │   │ │   │
│ │              │ │ │ Display Name:                   │   │ │   │
│ │              │ │ │ [John Doe              ]        │   │ │   │
│ │              │ │ │                                 │   │ │   │
│ │              │ │ │ Time Zone:                      │   │ │   │
│ │              │ │ │ [GMT-5 Eastern Time ∨  ]        │   │ │   │
│ │              │ │ └─────────────────────────────────┘   │ │   │
│ │              │ │                                       │ │   │
│ │              │ │ Notifications:                        │ │   │
│ │              │ │ ☑ Email me weekly insights summary    │ │   │
│ │              │ │ ☑ New feature announcements           │ │   │
│ │              │ │ ☐ Product updates & tips              │ │   │
│ │              │ │                                       │ │   │
│ │              │ │ [Save Changes] (Primary, disabled     │ │   │
│ │              │ │  until changes made)                  │ │   │
│ │              │ └───────────────────────────────────────┘ │   │
│ └──────────────┴───────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Settings Sections:**

**1. General:**
- Email (read-only, verified badge)
- Display name (editable)
- Time zone (dropdown)
- Notifications (checkboxes)

**2. Privacy:**
- Data processing location (US/EU)
- Anonymous usage analytics (toggle)
- Crash reporting (toggle)
- ⚠️ "80% client-side processing" reminder

**3. Display:**
- Theme: ● Auto (system) ○ Light ○ Dark
- Compact mode (toggle, reduces spacing by 20%)
- Show onboarding tooltips (toggle)
- Default view on login: [Dashboard ∨]

**4. Data:**
- Storage used: 2.4 MB / 100 MB
- [View All Networks] → List with delete options
- [Clear Cache] (Secondary button)
- Data retention: Keep networks for [Forever ∨]

**5. Export:**
- Auto-export (toggle)
- Export frequency: [Weekly ∨] if enabled
- Export format: [PDF ∨]
- Email exports to: [user@example.com]

**6. Account:**
- Account created: Dec 15, 2025
- Last login: Dec 28, 2025
- [Change Password] (if email auth)
- [Delete Account] (Danger zone, red text, requires confirmation)

**Mobile (375px):**
- Sidebar → Top tab bar (scrollable horizontally)
- Content: Full-width below tabs
- Form fields: Full-width, larger touch targets

---

#### **4.3.2 Profile Page (User Dashboard)**

Covered in Section 3.6 (Phase 1). No changes for Phase 2.

---

## **4. PHASE 2+ LAYOUTS (FUTURE FEATURES)**

Phase 3 and beyond are deferred. Layouts not specified until features are finalized.

**Placeholder sections:**
- Comparison mode (compare two networks side-by-side)
- Historical trending (network evolution over time)
- Team collaboration features
- Advanced filtering & saved views
- API access dashboard

**Design Principle:** Follow established patterns from Phase 1-2. Maintain consistency in:
- Spacing (8-point grid)
- Colors (Orange/Black/White + community colors)
- Typography scale
- Component library (buttons, cards, inputs)
- Responsive breakpoints

---

## **5. RESPONSIVE BREAKPOINTS & BEHAVIOR**

This section defines exact behavior at each breakpoint.

### **5.1 Breakpoint Definitions**

```css
/* Mobile (default, mobile-first) */
320px - 767px: Single column, full-width, touch-optimized

/* Tablet */
768px - 1023px: 2-column layouts, hybrid touch/mouse

/* Desktop */
1024px - 1439px: Multi-column, mouse-optimized

/* Large Desktop */
1440px+: Max-width containers (1200-1400px), centered
```

### **5.2 Layout Transformations by Breakpoint**

#### **Header (Global)**

| Element | Mobile (320-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---------|-------------------|---------------------|-------------------|
| Height | 56px | 64px | 72px |
| Logo | Text only (24px) | Logo + Text (28px) | Logo + Text (32px) |
| Nav | Hamburger menu → Full-screen drawer | Hamburger menu → Slide-in drawer (320px) | Horizontal nav (visible) |
| User Avatar | 32×32px (right) | 36×36px (right) | 40×40px (right) |
| CTA Button | Hidden | Visible (medium) | Visible (large) |

**Hamburger Menu (Mobile & Tablet):**
```
Trigger: [☰] Icon (24×24px, top-left)
Animation: Slide from left, 300ms ease-out
Backdrop: Semi-transparent black (opacity 0.5)
Close: Tap backdrop OR [×] button OR navigate away

Menu Content (Full-width on mobile, 320px on tablet):
┌─────────────────────────────┐
│ [×] Close (top-right)       │
│                             │
│ [Avatar] John Doe           │
│ user@example.com            │
│ ──────────────────────      │
│                             │
│ 🏠 Dashboard                │
│ 📤 Upload Data              │
│ 📊 My Networks              │
│ 💡 Insights                 │
│ ──────────────────────      │
│ ⚙️  Settings                │
│ 🚪 Logout                   │
│                             │
│ ──────────────────────      │
│ Theme: [Light/Dark toggle]  │
└─────────────────────────────┘
```

---

#### **Footer (Global)**

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Layout | Single column (stacked) | 2×2 grid | 4 columns (horizontal) |
| Logo | Centered, 100px | Left-aligned, 120px | Left-aligned, 140px |
| Link Groups | Accordions (collapsed by default) | Visible, 2 columns | Visible, 4 columns |
| Newsletter | Full-width | Full-width | 300px (right column) |
| Social Icons | Centered row | Centered row | Right-aligned row |

**Mobile Footer (375px):**
```
┌─────────────────────────────┐
│ [VSG Logo] (centered)       │
│ Understand Your Network     │
│                             │
│ ▼ Product (tap to expand)   │
│ ▼ Resources                 │
│ ▼ Company                   │
│ ▼ Legal                     │
│                             │
│ Newsletter:                 │
│ [Email input, full-width]   │
│ [Subscribe] (full-width)    │
│                             │
│ [LinkedIn] [Twitter]        │
│ (centered, 40×40px each)    │
│                             │
│ © 2025 VSG. All rights reserved.│
└─────────────────────────────┘
```

---

#### **Landing Page**

**Hero Section:**

| Element | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
|---------|---------------|----------------|------------------|
| H1 font-size | 32px | 48px | 64px |
| Subheadline | 16px | 18px | 20px |
| CTA buttons | Stacked vertical, full-width | Side-by-side, auto-width | Side-by-side, fixed-width |
| Hero illustration | Hidden (text only) | 400px width | 600px width |
| Section height | 100vh | 90vh | 90vh |
| Padding | 24px | 40px | 80px |

**Features Section:**

| Layout | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Grid | 1 column (stacked) | 2 columns (2×2) | 3 columns (1×3) |
| Card width | Full-width | calc(50% - 12px) | calc(33.33% - 16px) |
| Gap | 16px | 24px | 24px |
| Icon size | 40×40px | 48×48px | 56×56px |

**Trust Signals:**

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| 2×2 grid (stacked badges) | 4 columns (horizontal) | 4 columns (horizontal) |
| Icon: 32px | Icon: 40px | Icon: 48px |

---

#### **Upload Flow**

**4-Step Wizard:**

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Progress steps | Dots (●○○○) below header | Horizontal bar (icons + text) | Horizontal bar (icons + text) |
| Platform cards | 1 column (full-width) | 2 columns | 3 columns |
| Upload zone height | 200px | 300px | 400px |
| Buttons | Full-width, stacked | Auto-width, side-by-side | Auto-width, side-by-side |

**Mobile-Specific Adaptations:**
- Step labels: Hidden (dots only)
- Platform cards: Larger touch targets (60px height)
- Upload zone: "Tap to upload" instead of "Drop files"
- File picker: Native mobile file picker (camera access enabled)

---

#### **Graph Canvas**

**Most Complex Responsive Behavior:**

| Element | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
|---------|---------------|----------------|------------------|
| Filter sidebar | Bottom sheet (slides up) | Left sidebar (250px, collapsible) | Left sidebar (300px, always visible) |
| Canvas area | Full viewport (touch gestures) | 768px - 250px = 518px | 1440px - 300px = 1140px |
| Node detail panel | Full-screen modal (slide from bottom) | Right panel (300px, slide from right) | Right panel (350px, slide from right) |
| Legend | Collapsible (tap to expand) | Fixed bottom-right | Fixed bottom-right |
| Zoom controls | Floating bottom-right (48×48px) | Floating bottom-left (40×40px) | Floating bottom-left (40×40px) |
| Guided reveal | Full-screen overlay (50% opacity) | Full-screen overlay | Full-screen overlay |

**Mobile Touch Gestures:**
- Pinch: Zoom in/out
- Single tap: Select node
- Double tap: Center on node + zoom in
- Long press: Open context menu (export, hide, etc.)
- Two-finger drag: Pan canvas
- Swipe up from bottom: Open filter sheet

**Bottom Sheet (Mobile Filters):**
```
Trigger: [Filter] button (top-right)
Height: 60vh (draggable handle to expand to 90vh)
Content: Same filters as desktop sidebar, vertically scrollable
Close: Swipe down OR tap backdrop OR [×] button
```

---

#### **Insights Dashboard**

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero stats | 1×3 (stacked) | 3×1 (horizontal) | 3×1 (horizontal) |
| Filter chips | Scrollable horizontal | Wrapped (2 rows max) | Wrapped (1-2 rows) |
| Insight cards | 1 column (full-width) | 2 columns | 3 columns (above 1200px) |
| Charts | Full-width, square aspect | Full-width, 16:10 aspect | Max 800px, 16:10 aspect |

---

### **5.3 Typography Scaling**

**Responsive Font Sizes (using clamp()):**

```css
/* Headings */
H1: clamp(2rem, 5vw, 4rem)      /* 32-64px */
H2: clamp(1.75rem, 4vw, 3rem)   /* 28-48px */
H3: clamp(1.5rem, 3vw, 2rem)    /* 24-32px */
H4: clamp(1.25rem, 2.5vw, 1.5rem) /* 20-24px */

/* Body */
Body: clamp(0.875rem, 1.5vw, 1rem) /* 14-16px */
Small: clamp(0.75rem, 1.2vw, 0.875rem) /* 12-14px */

/* Line Heights */
Headings: 1.2 (tight)
Body: 1.6 (comfortable)
Small: 1.5
```

---

### **5.4 Spacing Adjustments**

**Container Padding:**

| Breakpoint | Padding (horizontal) |
|------------|---------------------|
| 320-767px | 16px (var(--spacing-4)) |
| 768-1023px | 24px (var(--spacing-6)) |
| 1024-1439px | 40px (var(--spacing-10)) |
| 1440px+ | 80px (var(--spacing-20)) |

**Section Gaps:**

| Breakpoint | Gap between sections |
|------------|---------------------|
| 320-767px | 40px (var(--spacing-10)) |
| 768-1023px | 60px (var(--spacing-15)) |
| 1024px+ | 80px (var(--spacing-20)) |

---

### **5.5 Touch Target Minimums**

**WCAG 2.2 AA Compliance:**
- Minimum touch target: 44×44px (all interactive elements)
- Minimum spacing between touch targets: 8px

**Mobile-Specific Enhancements:**
- Buttons: Min-height 44px → 48px (mobile)
- Form inputs: Min-height 44px → 52px (mobile)
- Dropdown triggers: 48px height (mobile)
- Icon-only buttons: 48×48px (vs 40×40px desktop)

---

## **6. LAYOUT FLOW & NAVIGATION**

### **6.1 User Journey Flows**

#### **Flow 1: First-Time User (Onboarding)**

```
1. Landing Page (01-landing.html)
   User sees: Hero, Features, Trust Signals, CTA
   ↓
   [Upload Your Data] CTA clicked
   ↓

2. Authentication (if not logged in)
   Email input → Magic link sent OR Google OAuth
   ↓
   Email verified / OAuth complete
   ↓

3. Upload Flow (02-upload.html)
   Step 1: Platform Selection (LinkedIn, Twitter, Facebook, Instagram)
   ↓
   Step 2: File Upload (drag-drop or browse)
   ↓
   Step 3: Processing (4 stages, progress bar, 10-30s)
   ↓
   Step 4: Success screen
   ↓
   [Visualize Network] CTA clicked
   ↓

4. Graph Canvas (03-graph-canvas.html)
   5-Stage Guided Reveal:
   Stage 1: Welcome + Graph basics (overlay)
   Stage 2: Communities explained (highlight)
   Stage 3: Key nodes shown (bridges, influencers)
   Stage 4: Filters demonstrated (sidebar)
   Stage 5: "You're ready!" (completion)
   ↓
   [Explore Insights] prompted OR user clicks Insights tab
   ↓

5. Insights Dashboard (04-insights.html)
   User sees: Network overview, 4 core insights, CTAs
   ↓
   User explores different insight views (Phase 2)
   ↓

6. Dashboard (recurring visits)
   User returns → Lands on Dashboard (network cards)
   Clicks network → Jumps to Graph Canvas OR Insights
```

**Total time for first session: 5-10 minutes**

---

#### **Flow 2: Returning User (Quick Analysis)**

```
1. Login (email or saved session)
   ↓
   Lands on: Dashboard (my-networks)
   ↓

2. Select Network
   Click [View Network] on a network card
   ↓
   Quick menu appears:
   - [Visualize Graph] → Graph Canvas
   - [View Insights] → Insights Dashboard
   - [Export] → Export modal
   ↓

3. User chooses destination
   Explore → Navigate tabs → Export/Share → Done
```

**Total time: 2-3 minutes**

---

#### **Flow 3: Upload New Network**

```
1. From anywhere in app
   Header: [Upload Data] button (always visible)
   ↓

2. Upload Flow (same as Flow 1, Step 3)
   Platform → Upload → Process → Success
   ↓

3. Redirect to Graph Canvas (new network)
   Guided reveal SKIPPED (returning user)
   User immediately sees graph + filters
```

---

### **6.2 Navigation Patterns**

#### **Primary Navigation (Header)**

**Desktop:**
```
[VSG Logo] [Dashboard] [Upload] [My Networks] [Insights]     [Avatar ∨]
```

**Mobile:**
```
[☰ Menu] [VSG Logo]                                           [Avatar]
```

**Hierarchy:**
1. **Dashboard** (Home) - Default landing for logged-in users
2. **Upload** - Always accessible (primary action)
3. **My Networks** - List of all networks
4. **Insights** - Latest insights across all networks
5. **Avatar Dropdown** - Settings, Profile, Logout

---

#### **Secondary Navigation (Contextual)**

**When viewing a specific network:**
```
Breadcrumb: Dashboard > My Networks > LinkedIn Network

Tabs (horizontal, below breadcrumb):
[Graph] [Insights] [Export]

Active tab: Underline (2px, Orange-500)
```

**When in Insights:**
```
Sub-tabs (Phase 2):
[Overview] [Network Graph] [Positioning] [Engagement] [Content] [Growth]

Scrollable on mobile (horizontal scroll)
```

---

### **6.3 Screen-to-Screen Transitions**

**Transition Types:**

1. **Page Transitions (between main sections):**
   - Animation: Fade (200ms ease-in-out)
   - No slide animations (jarring on web)
   - Loading spinner if data fetch > 300ms

2. **Modal Transitions:**
   - Slide up from bottom (mobile): 300ms ease-out
   - Fade + scale (desktop): 200ms ease-out
   - Backdrop: Fade in (200ms)

3. **Panel Transitions:**
   - Slide from right (detail panels): 300ms ease-out
   - Slide from left (filters): 300ms ease-out
   - Content: Fade in after slide complete (100ms delay)

4. **Accordion Expansions:**
   - Height: Auto (300ms ease-in-out)
   - Content: Fade in (200ms, 100ms delay)
   - Icon rotation: 300ms ease-in-out

**Accessibility:**
- Respect `prefers-reduced-motion: reduce` (disable all animations)
- Focus management: Move focus to modal/panel on open
- Escape key: Close modal/panel

---

### **6.4 Empty States & Error States**

#### **Empty State: No Networks Yet**

```
┌──────────────────────────────────┐
│ [Illustration: Empty graph]      │
│ (200×200px, centered)            │
│                                  │
│ H3: "No Networks Yet"            │
│ (24px, semibold, center)         │
│                                  │
│ P: "Upload your first social     │
│     network to get started."     │
│ (16px, Gray-600, center)         │
│                                  │
│ [Upload Data] (Primary, centered)│
└──────────────────────────────────┘
```

**Locations:** Dashboard, My Networks list

---

#### **Empty State: No Insights Available**

```
┌──────────────────────────────────┐
│ [Illustration: Lightbulb]        │
│                                  │
│ H3: "No Insights Yet"            │
│                                  │
│ P: "We're analyzing your network.│
│     Check back soon!"            │
│                                  │
│ [View Network Graph] (Secondary) │
└──────────────────────────────────┘
```

**Locations:** Insights dashboard (while processing)

---

#### **Error State: Upload Failed**

```
┌──────────────────────────────────┐
│ ⚠️ Upload Failed                 │
│ ──────────────────────────       │
│                                  │
│ We couldn't process your file.   │
│ Please check:                    │
│ • File format (must be .json/.csv│
│ • File size (max 10MB)           │
│ • Network structure (valid edges)│
│                                  │
│ Error code: ERR_INVALID_FORMAT   │
│                                  │
│ [Try Again] [View Help Docs]     │
└──────────────────────────────────┘
```

**Locations:** Upload flow (Step 3, if processing fails)

---

#### **Error State: Network Not Found**

```
┌──────────────────────────────────┐
│ 404: Network Not Found           │
│ ──────────────────────────       │
│                                  │
│ This network doesn't exist or    │
│ you don't have permission to     │
│ view it.                         │
│                                  │
│ [Go to Dashboard]                │
└──────────────────────────────────┘
```

**Locations:** Direct URL access (e.g., /network/invalid-id)

---

## **7. MARKETING COPY SPECIFICATIONS**

All exact copy for every section, following VSG voice and tone.

### **7.1 Voice & Tone Guidelines**

**Voice Characteristics:**
- **Clear, not clever**: Direct language, avoid jargon
- **Confident, not arrogant**: Expertise without superiority
- **Helpful, not pushy**: Guide, don't pressure
- **Human, not robotic**: Conversational but professional

**Tone Variations:**
- **Landing page**: Aspirational, inspiring (but grounded)
- **Product UI**: Instructive, supportive
- **Insights**: Analytical, objective
- **Errors**: Empathetic, solution-oriented

---

### **7.2 Landing Page Copy**

#### **Hero Section**

**H1 (Primary Headline):**
```
Understand Your Social Network
Like Never Before
```
*Alternative (A/B test):*
```
See Who Really Matters
In Your Network
```

**Subheadline (H2):**
```
Upload your social data. Get instant insights into your connections,
communities, and influence—without algorithms or AI guesswork.
```

**Primary CTA:**
```
Upload Your Data
```

**Secondary CTA:**
```
See How It Works
```

**Trust Signal (small text below CTAs):**
```
✓ 100% private • ✓ No social logins • ✓ Free forever
```

---

#### **Features Section**

**Section Title (H2):**
```
Built on Transparency, Not Black Boxes
```

**Feature 1: Algorithm-First**
- **Icon**: Graph icon (nodes + edges)
- **Headline (H3)**: "Graph Theory, Not Guesswork"
- **Body**: "We identify who connects your communities, who influences opinions, and how groups form—using proven mathematical methods. No AI, no black boxes, just transparent analysis you can verify."
- **Link**: [Learn about our methods →]

**Feature 2: Privacy-First**
- **Icon**: Lock icon
- **Headline**: "Your Data Stays Yours"
- **Body**: "80% of processing happens in your browser. We never connect to your social accounts. Upload once, own your insights forever."
- **Link**: [Read our privacy policy →]

**Feature 3: Instant Insights**
- **Icon**: Lightning bolt
- **Headline**: "Insights in Seconds, Not Days"
- **Body**: "Upload your network data and see visualizations instantly. No waiting for AI models. No training periods. Just immediate, actionable intelligence."
- **Link**: [See example insights →]

---

#### **Trust Signals**

**Section Title (H2):**
```
Trusted by Privacy-Conscious Professionals
```

**Badge 1: No Tracking**
- Icon: Shield
- Text: "No Tracking"
- Subtext: "Zero analytics cookies"

**Badge 2: Client-Side**
- Icon: Browser window
- Text: "Runs in Browser"
- Subtext: "80% local processing"

**Badge 3: Forever Free**
- Icon: Gift
- Text: "Always Free"
- Subtext: "Core features, no limits"

---

#### **CTA Section (Bottom)**

**Headline (H2):**
```
Ready to Understand Your Network?
```

**Subheadline:**
```
Upload your social data in 2 minutes. No signup required to try.
```

**Primary CTA:**
```
Get Started Free
```

**Secondary CTA:**
```
View Demo Network
```

---

### **7.3 Authentication Page Copy**

**Page Title (H1):**
```
One Quick Step to Get Started
```

**Subheadline:**
```
We'll send a magic link to your email. No password needed.
```

**Input Label:**
```
Email address
```

**Input Placeholder:**
```
you@example.com
```

**Primary CTA:**
```
Send Magic Link
```

**Divider:**
```
or
```

**Google OAuth Button:**
```
Continue with Google
```

**Fine Print:**
```
By continuing, you agree to our Terms of Service and Privacy Policy.
We'll never share your email or connect to your social accounts without permission.
```

**Success Message (after email submitted):**
```
✓ Check your email!

We sent a magic link to user@example.com.
Click the link to log in (it expires in 15 minutes).

Didn't receive it? [Resend link]
```

---

### **7.4 Upload Flow Copy**

#### **Step 1: Platform Selection**

**Title (H2):**
```
Which Network Do You Want to Analyze?
```

**Subheadline:**
```
Select a platform, then export your data from their settings.
```

**Platform Cards:**
- LinkedIn: "Export from Settings → Data Privacy → Get a copy of your data"
- Twitter: "Download from Settings → Your Account → Download archive"
- Facebook: "Export from Settings → Your Information → Download Information"
- Instagram: "Download from Settings → Security → Download Data"

**Help Link:**
```
[Need help exporting? See step-by-step guides →]
```

---

#### **Step 2: File Upload**

**Title:**
```
Upload Your Network Data
```

**Upload Zone (empty state):**
```
Drag and drop your file here
or click to browse

Supported formats: .json, .csv, .zip (max 10MB)
```

**Upload Zone (file selected):**
```
✓ linkedin_data.json (2.4 MB)

[Remove] [Upload Different File]
```

**CTA:**
```
Process Network
```

**Privacy Reminder:**
```
🔒 Your file never leaves your device during analysis.
We only store metadata (node count, communities) on our servers.
```

---

#### **Step 3: Processing**

**Title:**
```
Analyzing Your Network...
```

**Stage Labels:**
1. "Parsing network structure..." (0-25%)
2. "Detecting communities..." (25-50%)
3. "Calculating metrics..." (50-75%)
4. "Generating visualization..." (75-100%)

**Fun Facts (rotate while processing):**
- "Did you know? The average person has 338 Facebook friends."
- "Fun fact: 6 degrees of separation? More like 4.57 globally."
- "Tip: Bridges connect communities. Influencers shape opinions."

---

#### **Step 4: Success**

**Title:**
```
Your Network is Ready! 🎉
```

**Stats Preview:**
```
📊 Quick Stats:
• 50 connections analyzed
• 5 communities detected
• 3 key influencers identified
• 8 bridge connections found
```

**CTAs:**
```
[Visualize Network] (Primary)
[View Insights First] (Secondary)
```

**Optional: Smart Community Labels Modal**
(Appears after success screen if rich profile data detected)

```
┌─────────────────────────────────────────────────┐
│ ✨ Smart Community Labels Available             │
│ ─────────────────────────────────────────────   │
│                                                 │
│ We can analyze your network data to suggest    │
│ meaningful labels for each community.           │
│                                                 │
│ 🔒 100% Private:                                │
│ • Analysis runs in your browser only            │
│ • No data sent to servers                       │
│ • Requires 500MB model download (one-time)      │
│ • You can edit or reject any suggestion         │
│                                                 │
│ [Generate Smart Labels] (Primary)               │
│ [Skip, I'll Name Them Later] (Secondary)        │
└─────────────────────────────────────────────────┘

If user clicks [Generate Smart Labels]:

1. Model Download Screen (first time only):
┌─────────────────────────────────────────────────┐
│ Downloading AI Model...                         │
│ ─────────────────────────────────────────────   │
│                                                 │
│ [████████████░░░░░░░░] 65% (325MB / 500MB)     │
│                                                 │
│ This happens once. The model is cached for      │
│ future use.                                     │
│                                                 │
│ Time remaining: ~30 seconds                     │
└─────────────────────────────────────────────────┘

2. Analysis Progress:
┌─────────────────────────────────────────────────┐
│ Analyzing Communities...                        │
│ ─────────────────────────────────────────────   │
│                                                 │
│ ✓ Community 1 (10 people) → "Tech Founders"    │
│ ✓ Community 2 (8 people) → "Marketing Pros"    │
│ ⏳ Community 3 (12 people) → Analyzing...       │
│ ○ Community 4 (6 people) → Pending             │
│ ○ Community 5 (14 people) → Pending            │
└─────────────────────────────────────────────────┘

3. Review & Edit Suggestions:
┌─────────────────────────────────────────────────┐
│ Review Suggested Labels                         │
│ ─────────────────────────────────────────────   │
│                                                 │
│ Community 1 (10 people):                        │
│ Suggested: "Tech Founders"                      │
│ [Accept] [Edit: Tech Founders___] [Skip]       │
│                                                 │
│ Community 2 (8 people):                         │
│ Suggested: "Marketing Professionals"            │
│ [Accept] [Edit: _______________] [Skip]         │
│                                                 │
│ [Show 3 more...]                                │
│                                                 │
│ [Apply All Accepted Labels]                     │
└─────────────────────────────────────────────────┘
```

---

### **7.5 Graph Canvas Copy**

#### **5-Stage Guided Reveal**

**Stage 1: Welcome**
```
Title: Welcome to Your Network

Body:
This is your network visualized. Each circle is a person.
Lines show connections. Colors represent communities.

[Next: Explore Communities →]
```

**Stage 2: Communities**
```
Title: Communities Detected

Body:
We found 5 communities in your network using the Louvain algorithm.
People in the same community are more connected to each other.

[Highlight communities on graph]

[Next: Meet Key Players →]
```

**Stage 3: Key Nodes**
```
Title: Your Key Connections

Body:
⭐ Influencers: Shape opinions in your network
🔗 Bridges: Connect different groups together
🌐 Connectors: Know many people

[Highlight key nodes]

[Next: Learn to Filter →]
```

**Stage 4: Filters**
```
Title: Filter Your View

Body:
Use the sidebar to filter by community, role, or metrics.
Try clicking a node to see details.

[Point to sidebar]

[Next: You're Ready! →]
```

**Stage 5: Completion**
```
Title: You're All Set! 🚀

Body:
Explore your network, check out insights, or export a report.
Need help? Click the [?] icon anytime.

[Close Tutorial] [Remind Me Later]
```

---

#### **Filter Sidebar Labels**

**Section: Community Filters**
```
Title: Communities
Checkbox labels: Community name (e.g., "Tech Innovators")
Helper text: "5 communities detected"
```

**Section: Node Roles**
```
Title: Node Types
Checkboxes:
- ☑ Bridges (connects communities)
- ☑ Influencers (high influence)
- ☑ Connectors (many connections)
- ☐ Peripheral (few connections)
```

**Section: Metrics**
```
Title: Filter by Metrics
Sliders:
- Bridge Score (0.0 - 1.0) - How well they connect groups
- Influence Score (0.0 - 0.1) - How much their opinions spread
- Connections (1 - 20) - Number of people they know
Helper: "Drag to filter"
```

**Buttons:**
```
[Apply Filters] (Primary)
[Reset All] (Secondary)
```

---

#### **Node Detail Panel**

**Title:** [Node Name] (e.g., "Alex Chen")

**Role Badge:** "Bridge" / "Influencer" / "Connector" / "Peripheral"

**Metrics Labels:**
- Connections: "12 people" (was: Degree)
- Influence Score: "0.045" (how much opinions spread)
- Bridge Score: "0.82" (how well they connect groups)
- Community: "Tech Innovators"

**Analysis Section Title:**
```
Network Position
```

**Sample Analysis:**
```
Alex is a critical bridge between Tech Innovators and Business Leaders
communities. Removing Alex would increase network fragmentation by 23%.
```

**Connections Section Title:**
```
Connections (12)
```

**Connection Item:**
```
[Avatar] Sarah Lee
Edge strength: 0.8 | Community: Business Leaders
[View →]
```

**CTA:**
```
[Export Node Data]
```

---

### **7.6 Insights Dashboard Copy**

#### **Hero Section**

**Title (H1):**
```
Your Network Insights
```

**Subheadline:**
```
Data-driven intelligence about your connections, communities, and opportunities.
```

**Stats Labels:**
- "Total Connections"
- "Communities"
- "Top Influencers"

---

#### **Insight Cards**

**Card 1: Core Network**
```
Title: Your Core Network
Badge: [HIGH CONFIDENCE]

Body:
Your network has a strong core of 12 highly connected people (24%).
This is healthy—most networks have 15-20% in the core.

Action:
[Explore Core Connections →]
```

**Card 2: Community Bridges**
```
Title: 3 Critical Bridges Found
Badge: [HIGH CONFIDENCE]

Body:
Alex Chen, Sarah Lee, and Mike Johnson connect otherwise separate
communities. Without them, your network would fragment into 8 groups.

Action:
[View Bridge Connections →]
```

**Card 3: Peripheral Connections**
```
Title: 15 Peripheral Connections
Badge: [MEDIUM CONFIDENCE]

Body:
15 people (30%) are in your network's outer circle with few connections
to others. Consider strengthening ties—peripheral connections often lead
to unexpected opportunities.

Action:
[View Peripheral Connections →]
```

**Card 4: Opportunities**
```
Title: 5 Growth Opportunities
Badge: [MEDIUM CONFIDENCE]

Body:
We found 5 actionable ways to strengthen your network, from introducing
key people to re-engaging dormant connections.

Action:
[Explore Opportunities →]
```

---

### **7.7 Settings Copy**

**Page Title:**
```
Settings
```

**Section Titles:**
- General Settings
- Privacy & Data
- Display Preferences
- Export Options
- Account Management

**Privacy Reminder (in Privacy section):**
```
🔒 Your data is processed 80% client-side.
We store only: network metadata, user email, and preferences.
Full data never touches our servers.
[Learn more about our privacy approach →]
```

**Delete Account (danger zone):**
```
Button: [Delete Account]
Confirmation modal:
"Are you sure you want to delete your account?
This will permanently delete:
• All uploaded networks
• All insights and analyses
• Your account data
This action cannot be undone.
[Cancel] [Yes, Delete My Account]"
```

---

### **7.8 Error Messages**

**Upload Error (invalid format):**
```
⚠️ Upload Failed
We couldn't read this file. Please check:
• File format is .json, .csv, or .zip
• File contains valid network structure
• File size is under 10MB
Error: Invalid JSON structure
[Try Again] [See Format Examples]
```

**Network Error (API failure):**
```
⚠️ Connection Error
We couldn't reach our servers. Please check your internet connection
and try again.
Error code: NET_ERR_TIMEOUT
[Retry] [Try Offline Mode]
```

**404 (not found):**
```
404: Page Not Found
This page doesn't exist or has been moved.
[Go to Dashboard] [Report a Problem]
```

**500 (server error):**
```
500: Something Went Wrong
Our servers encountered an error. We've been notified and are fixing it.
Try refreshing the page or come back soon.
[Refresh] [Go to Dashboard]
```

**Validation Error (form input):**
```
⚠️ Invalid Email
Please enter a valid email address (e.g., you@example.com)
```

---

## **8. ICON & BUTTON PLACEMENT MATRIX**

Complete inventory of all icons and buttons with exact specifications.

### **8.1 Icon Library**

**Primary Icon Set: Heroicons** (MIT License, 24×24px default)

**Icon Categories:**

1. **Navigation Icons**
2. **Action Icons**
3. **Status Icons**
4. **Data Icons**
5. **Social Icons**

---

### **8.2 Navigation Icons**

| Icon | Name | Usage | Size | Color |
|------|------|-------|------|-------|
| 🏠 | home | Dashboard link | 24×24px | Gray-600 (inactive), Orange-500 (active) |
| 📤 | upload | Upload button | 20×20px | White (on orange bg) |
| 📊 | chart-bar | Insights link | 24×24px | Gray-600 / Orange-500 |
| ⚙️ | cog | Settings link | 24×24px | Gray-600 / Orange-500 |
| 🚪 | logout | Logout button | 20×20px | Gray-600 |
| ☰ | menu | Mobile hamburger | 24×24px | Gray-900 |
| × | x-mark | Close modals | 24×24px | Gray-600 |
| ← | arrow-left | Back navigation | 20×20px | Gray-600 |
| → | arrow-right | Next/Forward | 20×20px | Gray-600 |

**Placement:**
- **Header navigation**: 24×24px, 8px margin-right from label
- **Mobile hamburger**: Top-left, 16px from edge
- **Close buttons**: Top-right of modals, 16px padding

---

### **8.3 Action Icons**

| Icon | Name | Usage | Size | Color |
|------|------|-------|------|-------|
| + | plus | Add/Create | 20×20px | White (primary btn), Gray-600 (secondary) |
| 🗑️ | trash | Delete action | 20×20px | Red-600 |
| ✏️ | pencil | Edit action | 20×20px | Gray-600 |
| 📥 | download | Export/Download | 20×20px | Gray-700 |
| 🔗 | link | Copy link | 20×20px | Gray-600 |
| ↻ | refresh | Reload data | 20×20px | Gray-600 |
| ⋮ | dots-vertical | More options menu | 20×20px | Gray-600 |
| ⋯ | dots-horizontal | More options (horizontal) | 20×20px | Gray-600 |
| ✓ | check | Confirm/Success | 20×20px | Green-600 |
| ✕ | x | Cancel/Error | 20×20px | Red-600 |

**Placement:**
- **Primary action buttons**: Icon left, 8px margin-right from text
- **Icon-only buttons**: 40×40px touch target (desktop), 48×48px (mobile)
- **Kebab menus (⋮)**: Top-right of cards, 8px padding

---

### **8.4 Status Icons**

| Icon | Name | Usage | Size | Color |
|------|------|-------|------|-------|
| ⓘ | information-circle | Info tooltips | 16×16px | Blue-600 |
| ⚠️ | exclamation-triangle | Warning | 20×20px | Yellow-600 |
| ⛔ | exclamation-circle | Error | 20×20px | Red-600 |
| ✓ | check-circle | Success | 20×20px | Green-600 |
| ⏳ | clock | Processing/Pending | 20×20px | Orange-500 |
| 🔒 | lock-closed | Locked/Private | 16×16px | Gray-600 |
| 🔓 | lock-open | Unlocked/Public | 16×16px | Gray-600 |
| 👁️ | eye | Visible/Show | 20×20px | Gray-600 |
| 👁️‍🗨️ | eye-slash | Hidden/Hide | 20×20px | Gray-600 |

**Placement:**
- **Info icons**: Right of labels, 4px margin-left, hover → tooltip
- **Status badges**: Left of text, 6px margin-right
- **Inline alerts**: Left of message, 8px margin-right

---

### **8.5 Data Icons**

| Icon | Name | Usage | Size | Color |
|------|------|-------|------|-------|
| 👤 | user | Profile/User | 24×24px | Gray-600 |
| 👥 | user-group | Community/Group | 24×24px | Gray-600 |
| 🌐 | globe | Network/Global | 24×24px | Gray-600 |
| 📈 | trending-up | Growth/Increase | 20×20px | Green-600 |
| 📉 | trending-down | Decline/Decrease | 20×20px | Red-600 |
| ⬟ | pentagon | Bridge node (custom) | 12-20px | Orange-500 |
| ★ | star | Influencer node | 12-20px | Orange-500 |
| ● | circle | Connector node | 8-20px | Community color |
| ▲ | triangle | Peripheral node | 8-16px | Gray-400 |
| 🔍 | magnifying-glass | Search/Explore | 20×20px | Gray-600 |
| 🎯 | target | Opportunity/Goal | 20×20px | Orange-500 |
| 💡 | light-bulb | Insight | 24×24px | Yellow-500 |

**Placement:**
- **Feature cards**: Top-left, 48×48px (desktop), 40×40px (mobile)
- **Node shapes (graph)**: Varies by degree (8-20px radius)
- **Insight card icons**: Left of title, 24×24px

---

### **8.6 Social Platform Icons**

| Icon | Platform | Size | Usage |
|------|----------|------|-------|
| [LinkedIn logo] | LinkedIn | 24×24px | Platform selection, network cards |
| [Twitter logo] | Twitter | 24×24px | Platform selection, network cards |
| [Facebook logo] | Facebook | 24×24px | Platform selection, network cards |
| [Instagram logo] | Instagram | 24×24px | Platform selection, network cards |
| [Google logo] | Google | 20×20px | OAuth button (left side) |

**Placement:**
- **Platform cards**: Top-left, 32×32px
- **Network cards**: Next to title, 24×24px
- **Footer social icons**: 40×40px touch targets, 16px gap

---

### **8.7 Button Inventory**

#### **Primary Buttons**

**Appearance:**
- Background: Orange-500
- Text: White
- Border-radius: 8px
- Font: 16px, semibold
- Padding: 12px 24px (medium), 16px 32px (large)
- Min-height: 44px (mobile), 40px (desktop)

**Icon Placement:**
- Icon left: 20×20px, 8px margin-right from text
- Icon right: 20×20px, 8px margin-left from text
- Icon-only: 40×40px (desktop), 48×48px (mobile)

**States:**
- Default: Orange-500 bg
- Hover: Orange-600 bg
- Active: Orange-700 bg
- Disabled: Gray-300 bg, Gray-500 text, cursor not-allowed
- Loading: Spinner (20×20px, white) replaces icon, text dims 70%

**Examples:**
```
[Upload] (icon: upload, left)
[Get Started] (no icon)
[Next →] (icon: arrow-right, right)
[✓] (icon-only, check mark)
```

---

#### **Secondary Buttons**

**Appearance:**
- Background: Transparent
- Text: Orange-500
- Border: 1px solid Orange-500
- Border-radius: 8px
- Font: 16px, semibold
- Padding: 12px 24px

**States:**
- Default: Transparent bg, Orange-500 border/text
- Hover: Orange-50 bg (light mode), Orange-900/10% (dark mode)
- Active: Orange-100 bg
- Disabled: Gray-300 border, Gray-400 text

**Examples:**
```
[Cancel]
[Learn More]
[View Details →]
```

---

#### **Tertiary Buttons (Text-only)**

**Appearance:**
- Background: Transparent
- Text: Gray-700 (light), Gray-300 (dark)
- No border
- Font: 14px, medium
- Padding: 8px 12px
- Underline on hover

**Examples:**
```
[Skip]
[Remind me later]
[View all →]
```

---

#### **Danger Buttons**

**Appearance:**
- Background: Red-600
- Text: White
- Border-radius: 8px
- Font: 16px, semibold
- Padding: 12px 24px

**Used for:** Delete actions, destructive operations

**Examples:**
```
[Delete Network]
[Delete Account]
```

---

### **8.8 Button Placement by Page**

#### **Landing Page**

| Location | Button | Type | Size | Icon |
|----------|--------|------|------|------|
| Hero (primary CTA) | "Upload Your Data" | Primary | Large (52px height) | upload (left) |
| Hero (secondary CTA) | "See How It Works" | Secondary | Large | play (left) |
| Header (right) | "Get Started" | Primary | Medium (44px) | None |
| Footer (newsletter) | "Subscribe" | Primary | Medium | None |

---

#### **Upload Flow**

| Location | Button | Type | Icon |
|----------|--------|------|------|
| Step 1 (bottom-right) | "Continue" | Primary | arrow-right (right) |
| Step 2 (upload zone) | "Browse Files" | Secondary | folder-open |
| Step 2 (bottom) | "Process Network" | Primary | arrow-right |
| Step 3 (processing, disabled) | "Processing..." | Primary (disabled) | spinner |
| Step 4 (success) | "Visualize Network" | Primary | chart-bar |
| Step 4 (secondary) | "View Insights First" | Secondary | light-bulb |

---

#### **Graph Canvas**

| Location | Button | Type | Size | Icon |
|----------|--------|------|------|------|
| Filter sidebar (bottom) | "Apply Filters" | Primary | Full-width | None |
| Filter sidebar (below) | "Reset All" | Secondary | Full-width | refresh |
| Zoom controls (bottom-left) | [+] | Tertiary | 40×40px (icon-only) | plus |
| Zoom controls | [○] | Tertiary | 40×40px | refresh |
| Zoom controls | [-] | Tertiary | 40×40px | minus |
| Zoom controls | [⊡] | Tertiary | 40×40px | arrows-pointing-in |
| Detail panel (bottom) | "Export Node Data" | Secondary | Full-width | download |

---

#### **Insights Dashboard**

| Location | Button | Type | Icon |
|----------|--------|------|------|
| Insight card (bottom) | "Explore →" | Tertiary | arrow-right |
| Filter bar (right) | "Export Report" | Secondary | download |
| Opportunity card | "Draft Email" | Primary (small) | envelope |
| Opportunity card | "Skip" | Tertiary | None |
| Opportunity card | "Done ✓" | Tertiary | check |

---

#### **Settings Page**

| Location | Button | Type | Icon |
|----------|--------|------|------|
| Each section (bottom) | "Save Changes" | Primary | None |
| Data section | "Clear Cache" | Secondary | trash |
| Account section (danger zone) | "Delete Account" | Danger | trash |

---

## **9. AMENDMENT LOG**

This section tracks changes to the layout specification over time.

**Version Control:**
- Document version: 1.0
- Last updated: December 30, 2025
- Status: DRAFT (awaiting approval)

**Amendment History:**

| Date | Version | Section | Change | Author | Approved By |
|------|---------|---------|--------|--------|-------------|
| 2025-12-30 | 1.0 | All | Initial comprehensive specification | Claude | Pending |

**Future Amendments:**
- When sections are added/modified, log here with rationale
- Version numbers increment: 1.0 → 1.1 (minor), 1.0 → 2.0 (major)
- Breaking changes (major redesigns) require new document

---

## **APPENDIX A: DESIGN TOKEN REFERENCE**

Quick reference for developers implementing layouts.

### **Colors**

```css
/* Brand */
--vsg-orange-500: #F97316;
--vsg-orange-600: #EA580C;

/* Grays */
--vsg-gray-50: #F9FAFB;
--vsg-gray-900: #111827;

/* Semantic */
--vsg-bg-primary: White (light), Gray-900 (dark);
--vsg-text-primary: Gray-900 (light), Gray-50 (dark);
```

### **Spacing (8-point grid)**

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-20: 80px;
```

### **Typography**

```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-size-4xl: 36px;
```

### **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### **Border Radius**

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

---

## **APPENDIX B: ACCESSIBILITY CHECKLIST**

Ensure all layouts meet WCAG 2.2 AA standards.

**Color Contrast:**
- ✓ Text: 4.5:1 minimum (body), 3:1 (large text 18px+)
- ✓ UI components: 3:1 minimum (buttons, inputs, focus states)
- ✓ Test in both light and dark modes

**Touch Targets:**
- ✓ Minimum 44×44px (mobile), 40×40px (desktop)
- ✓ 8px spacing between targets

**Keyboard Navigation:**
- ✓ All interactive elements focusable (Tab order logical)
- ✓ Focus indicators visible (2px Orange-500 outline)
- ✓ Skip to main content link (hidden until focused)
- ✓ Modal/panel: Trap focus, Escape to close

**Screen Readers:**
- ✓ Semantic HTML (nav, main, section, article, aside)
- ✓ ARIA labels for icon-only buttons
- ✓ Alt text for all images and illustrations
- ✓ Status messages announced (aria-live regions)

**Motion:**
- ✓ Respect prefers-reduced-motion (disable animations)
- ✓ No auto-playing animations > 5 seconds
- ✓ Pause/stop controls for moving content

---

## **DOCUMENT END**

**Status:** ✅ COMPLETE

**Total Sections:** 10
**Total Pages (estimated):** 45-50 (when printed)
**Word Count:** ~12,000 words

**Authority Statement:**
This document has total say over display layout for Visual Social Graph (VSG). All UI implementations must conform to these specifications. Deviations require amendment approval and logging in Section 10.

**Questions or Clarifications:**
Contact: Technical Lead or Product Owner
Reference: VSG_UI_LAYOUT_SPECIFICATION.md v1.0

---
