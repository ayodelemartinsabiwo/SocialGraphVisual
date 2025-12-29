# **Visual Social Graph: UI Specification**
## **Implementation Standards & Component API v1.0**

*"Every component should be predictable. Every prop should have purpose. Every implementation should be accessible by default."*

---

## **Document Control**

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | Dec 29, 2025 | Initial UI specification creation | Draft |
| 1.1 | Dec 29, 2025 | **Critical Architecture Enhancements**: (1) Subordinated to UX Spec & API contracts, (2) Added Component Contract Matrix (Section 4.8), (3) Added API Error to UI Mapping (Section 5.4), (4) Added Non-Negotiable Accessibility Defaults (Section 5.0), (5) Added Mode-Aware UI Behavior (Section 8.3), (6) Defined Token Source of Truth (Section 0.5) | **Normative** |
| 1.2 | Dec 29, 2025 | **Normative Hierarchy Hardening**: (1) Added Security & Privacy as highest priority (Section 0.1), (2) Added System Requirements to hierarchy, (3) Added UI Stack Declaration (Section 2.9), (4) Upgraded WCAG baseline to 2.2 AA, (5) Added Contract Hooks for validation testing (Section 9.6) | **Normative** |
| 1.2.1 | Dec 29, 2025 | **Internal Consistency Fixes**: (1) Fixed token naming to use consistent `--vsg-*` prefix throughout (Section 3.1), (2) Fixed ErrorSeverity enum mismatch in contract test example (changed `'error'` to `'CRITICAL'` in Appendix F.1), (3) Replaced all hardcoded Tailwind color classes with token-backed utilities (`bg-orange-500` → `bg-vsg-primary`, `text-gray-700` → `text-vsg-neutral-700`, etc.) across all component examples | **Normative** |

**Normative Contract Hierarchy (MUST comply in order of priority):**

This document is **subordinate** to the following normative contracts. In the event of conflict, the order below applies:

1. **Security & Privacy (HIGHEST PRIORITY)**
   - **[VSG_SECURITY_PRIVACY.md](VSG_SECURITY_PRIVACY.md)** - AUTHORITATIVE for privacy boundaries, PII handling, logging constraints, pseudonymization

2. **System Requirements**
   - **[VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md](VSG_SYSTEM_REQUIREMENTS_SPECIFICATION.md)** - AUTHORITATIVE for functional requirements, performance targets, compatibility

3. **API Contract**
   - **[api-specs/openapi.yaml](api-specs/openapi.yaml)** - AUTHORITATIVE for API schemas, error envelopes, state models (normative)
   - **[VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md)** - AUTHORITATIVE for error handling semantics, GDPR compliance, retention policies (narrative)

4. **UX Interaction & Behavior**
   - **[VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md](VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md)** - AUTHORITATIVE for design tokens, visual standards, typography, spacing, motion, interaction timings, keyboard maps, reduced motion

5. **This Document (UI Implementation Specification)**
   - AUTHORITATIVE for component APIs, implementation patterns, code standards, testing requirements

**Supporting Documents:**
- [VSG_DESIGN_PRINCIPLE.md](VSG_DESIGN_PRINCIPLE.md) - Algorithm-first core principle, AI as tool not dependency
- [CLAUDE_ACE.md](CLAUDE_ACE.md) - Design philosophy and craft standards
- [VSG_ARCHITECTURE_DOCUMENT.md](VSG_ARCHITECTURE_DOCUMENT.md) - Technical implementation, mode definitions
- [VSG_EXECUTIVE_EDITION_PRD.md](VSG_EXECUTIVE_EDITION_PRD.md) - Product definition
- [VSG_METRICS_SUCCESS_FRAMEWORK.md](VSG_METRICS_SUCCESS_FRAMEWORK.md) - Success measurement

**UI Implementation MUST:**
- ✅ **NEVER violate privacy boundaries** (no label leakage to server; no PII in logs; no display names transmitted)
- ✅ **Match OpenAPI schemas and error envelope behavior** (all error codes mapped to UI patterns)
- ✅ **Match UX interaction rules** (states, timings, keyboard maps, reduced motion, accessibility)
- ✅ **Respect system requirements** (performance budgets, browser compatibility, offline capability)

**Document Purpose:**
This UI Specification defines HOW to implement the visual interface layer of Visual Social Graph. While the UX/Interaction Design Specification defines WHAT interactions occur and WHY they work that way, this document specifies the exact implementation details, component APIs, code standards, and visual quality gates.

**Canonical Standards Referenced:**
- **Material Design 3 Expressive** (2025) - Component patterns, accessibility standards
- **Apple Human Interface Guidelines** (2025) - Touch targets, typography, accessibility
- **WCAG 2.2 Level AA** - Accessibility compliance minimum (upgraded from 2.1)
- **React Composition Patterns** (2025) - Compound components, Context API architecture

**Sources:**
- [Material Design 3](https://m3.material.io/)
- [Material 3 Expressive (2025)](https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [iOS Design Guidelines 2025](https://tapptitude.com/blog/i-os-app-design-guidelines-for-2025)
- [React Compound Components Pattern](https://www.patterns.dev/react/compound-pattern/)
- [Modern React Design Patterns 2025](https://www.inexture.com/modern-react-design-patterns-ui-architecture-examples/)

---

## **Table of Contents**

0. [UI Implementation Governance](#0-ui-implementation-governance)
   - 0.1 [Canonical UI Authority](#01-canonical-ui-authority)
   - 0.2 [UI Governance Rules](#02-ui-governance-rules)
   - 0.3 [UI Drift Prevention Mechanisms](#03-ui-drift-prevention-mechanisms)
   - 0.4 [When UI Reality Conflicts with Specification](#04-when-ui-reality-conflicts-with-specification)
   - 0.5 [Design Token Source of Truth Location](#05-design-token-source-of-truth-location)

1. [Scope: UI vs UX Specification](#1-scope-ui-vs-ux-specification)
   - 1.1 [What This Document IS](#11-what-this-document-is)
   - 1.2 [What This Document IS NOT](#12-what-this-document-is-not)
   - 1.3 [Critical Distinctions](#13-critical-distinctions)

2. [Modern UI Standards Integration (2025)](#2-modern-ui-standards-integration-2025)
   - 2.1 [Material Design 3 Expressive (2025)](#21-material-design-3-expressive-2025)
   - 2.2 [Apple Human Interface Guidelines (2025)](#22-apple-human-interface-guidelines-2025)
   - 2.3 [Compound Component Pattern (2025 Best Practice)](#23-compound-component-pattern-2025-best-practice)
   - 2.4 [UI Stack Declaration (Implementation Target)](#24-ui-stack-declaration-implementation-target)

3. [Design Tokens (Single Source of Truth)](#3-design-tokens-single-source-of-truth)
   - 3.1 [Token Architecture](#31-token-architecture)
   - 3.2 [Color Tokens](#32-color-tokens)
   - 3.3 [Spacing Tokens (4px Grid)](#33-spacing-tokens-4px-grid)
   - 3.4 [Typography Tokens](#34-typography-tokens)
   - 3.5 [Shadow Tokens (Elevation)](#35-shadow-tokens-elevation)
   - 3.6 [Border Radius Tokens](#36-border-radius-tokens)
   - 3.7 [Z-Index Tokens (Layering)](#37-z-index-tokens-layering)
   - 3.8 [Animation Tokens](#38-animation-tokens)

4. [Component Specifications](#4-component-specifications)
   - 4.1 [Button Component](#41-button-component)
   - 4.2 [Input Component](#42-input-component)
   - 4.3 [Card Component](#43-card-component)
   - 4.4 [Upload Zone Component](#44-upload-zone-component)
   - 4.5 [Progress Indicator Component](#45-progress-indicator-component)
   - 4.6 [Select Component (Compound Pattern)](#46-select-component-compound-pattern)
   - 4.7 [Modal Component](#47-modal-component)
   - 4.8 [Component Contract Matrix](#48-component-contract-matrix)

5. [Accessibility Testing Requirements](#5-accessibility-testing-requirements)
   - 5.0 [Non-Negotiable Accessibility Defaults](#50-non-negotiable-accessibility-defaults)
   - 5.1 [Automated Testing](#51-automated-testing)
   - 5.2 [Manual Testing Checklist](#52-manual-testing-checklist)
   - 5.3 [WCAG 2.2 Level AA Compliance](#53-wcag-22-level-aa-compliance)
   - 5.4 [API Error to UI Mapping (ErrorEnvelope Contract)](#54-api-error-to-ui-mapping-errorenvelope-contract)

6. [Visual Regression Testing](#6-visual-regression-testing)
   - 6.1 [Tool Selection](#61-tool-selection)
   - 6.2 [Component Stories (Storybook)](#62-component-stories-storybook)
   - 6.3 [Visual Testing Strategy](#63-visual-testing-strategy)

7. [Performance Budgets](#7-performance-budgets)
   - 7.1 [Lighthouse Score Targets](#71-lighthouse-score-targets)
   - 7.2 [Bundle Size Budgets](#72-bundle-size-budgets)
   - 7.3 [Image Optimization](#73-image-optimization)

8. [Implementation Checklist](#8-implementation-checklist)
   - 8.1 [Component Creation Checklist](#81-component-creation-checklist)
   - 8.2 [Sprint Implementation Plan](#82-sprint-implementation-plan)
   - 8.3 [Mode-Aware UI Behavior](#83-mode-aware-ui-behavior)

9. [Appendices](#9-appendices)
   - 9.1 [Glossary](#appendix-a-glossary)
   - 9.2 [Component API Quick Reference](#appendix-b-component-api-quick-reference)
   - 9.3 [Design Token Reference](#appendix-c-design-token-reference)
   - 9.4 [Browser Support Matrix](#appendix-d-browser-support-matrix)
   - 9.5 [Amendment Log](#appendix-e-amendment-log)
   - 9.6 [Contract Hooks & Validation Testing](#appendix-f-contract-hooks--validation-testing)

---

## **0. UI Implementation Governance**

**CRITICAL**: This UI Specification is the SINGLE SOURCE OF TRUTH for all visual implementation, component APIs, and code standards. All React components, CSS styles, and UI code MUST reference this document.

### **0.1 Canonical UI Authority**

**Normative Sources (MUST align with):**
- **[VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md](VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md)** - AUTHORITATIVE for all design tokens, visual standards, typography, spacing, motion, and interaction physics
- **[api-specs/openapi.yaml](api-specs/openapi.yaml)** - AUTHORITATIVE for all API contracts, error envelopes, state models
- **[VSG_API_SPECIFICATION.md](VSG_API_SPECIFICATION.md)** - AUTHORITATIVE for error handling semantics, GDPR compliance, retention policies
- **This document** (`VSG_UI_SPECIFICATION.md`) - AUTHORITATIVE for implementation patterns, component APIs, code standards
- **[VSG_DESIGN_PRINCIPLE.md](VSG_DESIGN_PRINCIPLE.md)** - AUTHORITATIVE for architectural constraints (algorithm-first, AI as tool not dependency)

**Hierarchy of Authority:**
```
1. UX Specification → Design tokens, visual standards, typography, spacing, motion (SOURCE OF TRUTH)
2. API Specification + OpenAPI → Error models, state contracts, data shapes (SOURCE OF TRUTH)
3. This Document (UI Spec) → Component APIs, implementation patterns, code standards
4. Design Principles → Philosophical constraints (algorithm-first, privacy-first)
5. Industry Standards (Material 3, HIG) → Patterns and best practices (when not specified above)
```

**Critical Subordination Rule:**
- If ANY conflict exists between this document and the UX Specification regarding visual values (colors, spacing, typography, motion), **the UX Specification wins**.
- If ANY conflict exists between component state/error handling and the API Specification/OpenAPI schema, **the API contracts win**.
- This document's authority is limited to HOW to implement (code patterns, TypeScript interfaces, testing), NOT WHAT values to use (design tokens) or WHAT states exist (API models).

### **0.2 UI Governance Rules**

**Rule 1: MUST - Component API Exactness**
- All component props MUST match TypeScript interfaces defined in Section 4
- NEVER add undocumented props or implicit behaviors
- NEVER modify component APIs mid-sprint without formal amendment
- Component drift (adding features without documentation) is a critical governance violation

**Rule 2: MUST - Visual Consistency Standards (Zero Hardcoded Values)**
- All measurements MUST use design tokens from Section 3 and UX Specification (NEVER hardcoded pixel values)
- All colors MUST use CSS custom properties from UX Specification (NEVER hardcoded hex codes like `#F97316`)
- All spacing MUST use spacing tokens from 8-point grid system (NEVER magic numbers like `margin: 12px`)
- All typography MUST use type scale tokens (NEVER inline font-size declarations)
- **FORBIDDEN**: Hardcoded values like `color: #F97316`, `padding: 12px`, `font-size: 14px`, `z-index: 999`
- **REQUIRED**: Token-based values like `color: var(--vsg-color-primary)`, `padding: var(--spacing-3)`, `className: "text-body"`
- **Enforcement**: Pre-commit hook scans for hardcoded hex colors (`#[0-9A-Fa-f]{3,6}`), hardcoded pixel values in style objects, and magic numbers

**Rule 3: MUST - Accessibility by Default**
- All components MUST pass WCAG 2.2 Level AA (Section 5.3)
- All interactive elements MUST have 44px minimum touch target
- All text MUST meet 4.5:1 contrast ratio minimum
- All components MUST support keyboard navigation

**Rule 4: MUST - Code Quality Gates**
- All components MUST have TypeScript types (no `any`)
- All components MUST have Storybook stories
- All components MUST pass visual regression tests
- All components MUST have accessibility tests (axe-core)

**Rule 5: MUST - Mobile-First Implementation**
- All components MUST work on mobile first (320px width minimum)
- All touch interactions MUST work before mouse interactions
- All responsive breakpoints MUST be tested
- All performance budgets MUST be met (Section 8)

### **0.3 UI Drift Prevention Mechanisms**

**Component Review Protocol (Every Sprint):**
```
Before Sprint Close:
├─ Visual regression test suite passes (Percy, Chromatic, or similar)
├─ Accessibility audit passes (axe-core, Lighthouse)
├─ Component API documentation updated (Storybook + this doc)
├─ Design tokens audit (no hardcoded values snuck in)
└─ Cross-browser testing complete (Chrome, Safari, Firefox, Edge)
```

**Monthly Visual Audit:**
```
First Friday of month:
├─ Design token usage scan (grep for hardcoded hex values, px values)
├─ Component prop drift check (compare Storybook to this doc)
├─ Accessibility regression scan (run axe on all pages)
├─ Performance budget check (Lighthouse scores)
├─ Visual consistency review (screenshot comparison grid)
└─ Amendment log update (version control this document)
```

**Quarterly Design System Health Check:**
```
End of quarter:
├─ Full design system audit (this doc vs. implementation)
├─ Component usage analytics (which components used where?)
├─ Dead code elimination (unused components, styles)
├─ Modern standard alignment (Material 3, HIG updates)
├─ Developer experience survey (is the system helping or hindering?)
└─ Roadmap for next quarter improvements
```

### **0.4 When UI Reality Conflicts with Specification**

**If implementation doesn't match this specification:**

**DO:**
- ✅ Fix implementation to match spec (spec is authoritative)
- ✅ Document why drift occurred (root cause analysis)
- ✅ Update tests to prevent regression
- ✅ Add visual regression test for that specific case
- ✅ Amend this document if spec was wrong (version control)

**DON'T:**
- ❌ Change spec to match bad implementation ("works on my machine")
- ❌ Add inline style overrides to "fix" inconsistencies
- ❌ Use !important to force styles
- ❌ Ignore accessibility failures ("we'll fix it later")
- ❌ Ship with "TODO: Fix this" comments

**Conflict Resolution Hierarchy:**
1. **Accessibility wins over aesthetics** (WCAG compliance is non-negotiable)
2. **Mobile wins over desktop** (mobile-first, progressive enhancement)
3. **Performance wins over features** (fast is a feature)
4. **Simplicity wins over complexity** (fewer components, clearer API)
5. **This document wins over opinions** (unless formally amended)

### **0.5 Design Token Source of Truth Location**

**CRITICAL**: All visual values (colors, spacing, typography, shadows, animations) MUST be consumed from a single canonical location. NEVER duplicate token values across files.

**Token Location (Single Source of Truth):**
```
Primary Source:   src/styles/tokens.css (CSS Custom Properties at :root)
TypeScript Import: src/tokens/index.ts (exports for runtime access)
Tailwind Config:   tailwind.config.js (extends theme with token references)
Documentation:     VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md (semantic definitions)
```

**Implementation Pattern:**

**Option A: CSS Custom Properties (Recommended for styling)**
```css
/* src/styles/tokens.css - SINGLE SOURCE OF TRUTH */
:root {
  /* Brand Tokens (from UX Spec Section 3.3.1) */
  --vsg-color-orange-50: #FFF7ED;
  --vsg-color-orange-500: #F97316;
  --vsg-color-orange-900: #7C2D12;

  /* Semantic Tokens (from UX Spec Section 3.3.2) */
  --vsg-color-primary: var(--vsg-color-orange-500);
  --vsg-color-action: var(--vsg-color-primary);

  /* Component Tokens (from UX Spec Section 3.3.3) */
  --vsg-button-bg-primary: var(--vsg-color-action);
  --vsg-button-bg-primary-hover: var(--vsg-color-orange-600);

  /* Spacing (8-point grid from UX Spec Section 3.5) */
  --spacing-0: 0;
  --spacing-1: 4px;   /* 0.25rem */
  --spacing-2: 8px;   /* 0.5rem */
  --spacing-3: 12px;  /* 0.75rem */
  --spacing-4: 16px;  /* 1rem */
  --spacing-6: 24px;  /* 1.5rem */
  --spacing-8: 32px;  /* 2rem */
}

/* Component Usage */
.button-primary {
  background-color: var(--vsg-button-bg-primary);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
}
```

**Option B: TypeScript/JavaScript Import (for runtime logic)**
```typescript
// src/tokens/index.ts - Re-exports from UX Spec values
export const colors = {
  primary: 'var(--vsg-color-primary)',
  orange: {
    50: 'var(--vsg-color-orange-50)',
    500: 'var(--vsg-color-orange-500)',
    900: 'var(--vsg-color-orange-900)',
  },
} as const;

export const spacing = {
  0: 'var(--spacing-0)',
  1: 'var(--spacing-1)',
  2: 'var(--spacing-2)',
  3: 'var(--spacing-3)',
  4: 'var(--spacing-4)',
} as const;

// Component Usage
import { colors, spacing } from '@/tokens';

const buttonStyle = {
  backgroundColor: colors.primary,
  padding: `${spacing[3]} ${spacing[6]}`,
};
```

**Option C: Tailwind Config Extension (for utility classes)**
```javascript
// tailwind.config.js - References CSS custom properties
module.exports = {
  theme: {
    extend: {
      colors: {
        'vsg-primary': 'var(--vsg-color-primary)',
        'vsg-orange': {
          50: 'var(--vsg-color-orange-50)',
          500: 'var(--vsg-color-orange-500)',
          900: 'var(--vsg-color-orange-900)',
        },
      },
      spacing: {
        // Uses default 4px base (matches UX Spec 8-point grid when doubled)
      },
    },
  },
};

// Component Usage (Tailwind classes)
<button className="bg-vsg-primary px-6 py-3 rounded-md">
  Primary Button
</button>
```

**Enforcement Rules:**
1. **NEVER define color/spacing values in component files** - Always import from tokens
2. **NEVER use hardcoded hex codes** - All colors MUST reference CSS custom properties
3. **NEVER use magic numbers** - All spacing MUST use spacing scale tokens
4. **Pre-commit hook MUST scan for violations**:
   ```bash
   # Detects hardcoded hex colors in .tsx/.ts files
   grep -r "#[0-9A-Fa-f]\{3,6\}" src/ --include="*.tsx" --include="*.ts"

   # Detects hardcoded pixel values in style objects
   grep -r "padding: [0-9]\+px" src/ --include="*.tsx"
   ```

**Token Update Process:**
1. **Change UX Specification** (authoritative semantic definition)
2. **Update `src/styles/tokens.css`** (implementation of UX Spec values)
3. **Run visual regression tests** (ensure no unintended changes)
4. **Document in Amendment Log** (Section 9.5)

---

## **1. Scope: UI vs UX Specification**

### **1.1 What This Document IS**

**UI Specification (This Document):**
- **Component APIs**: Exact TypeScript interfaces, prop definitions, default values
- **Visual Implementation**: CSS-in-JS patterns, Tailwind classes (token-backed), CSS custom property references (no hardcoded hex in components)
- **Code Standards**: File structure, naming conventions, testing requirements
- **Quality Gates**: Visual regression, accessibility tests, performance budgets
- **Implementation Patterns**: Compound components, composition, state management

**Example: Button Component**
```typescript
// THIS DOCUMENT SPECIFIES:
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  leftIcon,
  children,
  onClick
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200';
  const variantClasses = {
    primary: 'bg-vsg-primary text-white hover:bg-vsg-primary-hover active:bg-vsg-primary-active',
    secondary: 'bg-white text-vsg-primary border-2 border-vsg-primary hover:bg-vsg-primary-hover-subtle',
    tertiary: 'bg-transparent text-vsg-primary hover:bg-vsg-primary-hover-subtle'
  };
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[36px]',
    medium: 'px-5 py-3 text-base min-h-[44px]',
    large: 'px-6 py-4 text-lg min-h-[52px]'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};
```

### **1.2 What This Document IS NOT**

**UX/Interaction Design Specification (Separate Document):**
- **User Flows**: When buttons appear, what happens when clicked
- **Interaction Patterns**: Drag & drop, hover states, loading sequences
- **Information Architecture**: Page structure, navigation hierarchy
- **Content Strategy**: Microcopy, error messages, empty states
- **Animation Choreography**: Multi-step sequences, page transitions

**Example: Upload Flow (UX Spec Responsibility)**
- Step-by-step flow: Platform selection → File drop → Processing → Success
- Error handling: What to show when parse fails
- Progress communication: How to indicate 80% client-side processing
- Emotional design: Guided reveal, aha moment creation

**This Document's Role in Upload Flow:**
- Component APIs: `<UploadZone>`, `<ProgressIndicator>`, `<StatusBanner>`
- Visual specifications: Upload zone border styles, progress bar colors
- Code implementation: File validation logic, event handlers
- Quality gates: Accessibility of dropzone, performance of file parsing

### **1.3 Critical Distinctions**

| Concern | UX Specification | UI Specification (This Doc) |
|---------|------------------|----------------------------|
| **When to show a tooltip** | ✅ UX (interaction pattern) | ❌ Not UI |
| **Tooltip component API** | ❌ Not UX | ✅ UI (implementation) |
| **Animation duration philosophy** | ✅ UX (perceived performance) | ❌ Not UI |
| **Exact millisecond timing** | ❌ Not UX | ✅ UI (code standard) |
| **Color palette reasoning** | ✅ UX (trust, differentiation) | ❌ Not UI |
| **Exact token names / CSS variable names** | ❌ Not UX | ✅ UI (design tokens) |
| **Mobile-first strategy** | ✅ UX (responsive approach) | ❌ Not UI |
| **Breakpoint pixel values** | ❌ Not UX | ✅ UI (CSS media queries) |

---

## **2. Modern UI Standards Integration (2025)**

### **2.1 Material Design 3 Expressive (2025)**

**Key Learnings Applied to VSG:**

**1. Springy, Natural Animations**
```typescript
// Material 3 Expressive uses spring-based animations
// VSG applies this to button interactions, graph pan/zoom

const springConfig = {
  tension: 170,  // Spring tension (higher = stiffer)
  friction: 26,  // Spring friction (higher = less bouncy)
  mass: 1        // Spring mass
};

// Example: Button press animation (react-spring)
const [styles, api] = useSpring(() => ({
  scale: 1,
  config: springConfig
}));

return (
  <animated.button
    style={{ transform: styles.scale.to(s => `scale(${s})`) }}
    onMouseDown={() => api.start({ scale: 0.95 })}
    onMouseUp={() => api.start({ scale: 1 })}
  >
    Click Me
  </animated.button>
);
```

**2. Depth Through Elevation**
```css
/* Material 3 elevation system adapted for VSG */
--elevation-0: none; /* Flat elements */
--elevation-1: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Subtle lift */
--elevation-2: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* Cards */
--elevation-3: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Popovers */
--elevation-4: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Modals */
--elevation-5: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Maximum */
```

**3. Component Shape Language**
```css
/* Material 3 recommends varied corner radii for hierarchy */
--radius-xs: 4px;   /* Small chips, tags */
--radius-sm: 8px;   /* Buttons, inputs */
--radius-md: 12px;  /* Cards, containers */
--radius-lg: 16px;  /* Large cards, modals */
--radius-xl: 24px;  /* Hero sections */
--radius-full: 9999px; /* Circular avatars, pills */
```

**Why These Standards:**
- ✅ Spring animations feel more natural than linear/ease (human perception)
- ✅ Subtle elevation creates depth without heavy shadows (modern, clean)
- ✅ Varied radii create visual hierarchy (not everything needs same rounding)

### **2.2 Apple Human Interface Guidelines (2025)**

**Key Learnings Applied to VSG:**

**1. Touch Target Minimum (Non-Negotiable)**
```typescript
// Apple HIG mandates 44x44pt minimum
// Research shows <44px missed by 25%+ of users

const TOUCH_TARGET_MINIMUM = 44; // px

// Enforce in components:
interface TouchableProps {
  minHeight?: number;
  minWidth?: number;
}

const TouchableArea: React.FC<TouchableProps> = ({
  minHeight = TOUCH_TARGET_MINIMUM,
  minWidth = TOUCH_TARGET_MINIMUM,
  children
}) => {
  return (
    <div
      style={{
        minHeight: `${minHeight}px`,
        minWidth: `${minWidth}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </div>
  );
};
```

**2. Typography Scaling (Dynamic Type Support)**
```css
/* Apple HIG emphasizes text that scales with user preferences */
/* VSG uses clamp() for fluid typography */

--text-h1: clamp(2.25rem, 2vw + 1.5rem, 3rem); /* 36px - 48px */
--text-h2: clamp(1.875rem, 1.5vw + 1.25rem, 2.25rem); /* 30px - 36px */
--text-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem); /* 16px - 18px */

/* User preference scaling */
@media (prefers-reduced-motion: no-preference) {
  * {
    transition: font-size 0.3s ease;
  }
}
```

**3. Contrast & Accessibility (4.5:1 Minimum)**
```typescript
// Apple HIG mandates WCAG compliance
// VSG enforces at component level

const validateContrast = (foreground: string, background: string): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  const WCAG_AA_MINIMUM = 4.5;

  if (ratio < WCAG_AA_MINIMUM) {
    console.error(
      `Contrast ratio ${ratio.toFixed(2)}:1 fails WCAG AA (4.5:1 minimum)`
    );
    return false;
  }
  return true;
};

// Usage in components:
const Text: React.FC<{color: string; bgColor: string}> = ({color, bgColor, children}) => {
  if (process.env.NODE_ENV !== 'production') {
    validateContrast(color, bgColor);
  }
  return <p style={{color, backgroundColor: bgColor}}>{children}</p>;
};
```

**Why These Standards:**
- ✅ 44px targets prevent accessibility failures (motor impairments, aging users)
- ✅ Dynamic type respects user preferences (vision impairments, reading comfort)
- ✅ Contrast validation prevents shipping inaccessible UIs

### **2.3 Compound Component Pattern (2025 Best Practice)**

**Why Compound Components:**
- ✅ Flexible: Child components can be rearranged, omitted, repeated
- ✅ Avoids Prop Drilling: Shared state via Context, not 10 levels of props
- ✅ Semantic: `<Select.Trigger>` is clearer than `<SelectTrigger>`
- ✅ Maintainable: State management separate from UI rendering

**VSG Implementation Example:**
```typescript
// Modern 2025 pattern: Compound components with Context API

interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }
  return context;
};

// Parent compound component
export const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}> & {
  Trigger: typeof SelectTrigger;
  Content: typeof SelectContent;
  Item: typeof SelectItem;
} = ({ value, onChange, children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

// Child components
const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOpen } = useSelectContext();
  return (
    <button
      className="min-h-[44px] px-4 py-2 border-2 border-vsg-neutral-300 rounded-lg"
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = useSelectContext();
  if (!open) return null;
  return (
    <div className="absolute z-10 mt-2 bg-white border-2 border-vsg-neutral-200 rounded-lg shadow-lg">
      {children}
    </div>
  );
};

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children
}) => {
  const { onChange, setOpen, value: selectedValue } = useSelectContext();
  const isSelected = value === selectedValue;

  return (
    <button
      className={`w-full px-4 py-2 text-left hover:bg-vsg-primary-hover-subtle ${
        isSelected ? 'bg-vsg-primary-selected font-semibold' : ''
      }`}
      onClick={() => {
        onChange(value);
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
};

// Attach children to parent
Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;

// Usage (flexible, semantic):
<Select value={platform} onChange={setPlatform}>
  <Select.Trigger>
    {platform || 'Select platform'}
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="twitter">Twitter</Select.Item>
    <Select.Item value="instagram">Instagram</Select.Item>
    <Select.Item value="linkedin">LinkedIn</Select.Item>
  </Select.Content>
</Select>
```

**Why This Pattern:**
- ✅ Flexibility: Can rearrange, omit children (e.g., `<Select.Trigger>` only)
- ✅ No Prop Drilling: State in Context, not passed through every child
- ✅ Type Safety: TypeScript enforces correct composition
- ✅ Modern 2025 Standard: Radix UI, Headless UI, Ark UI all use this pattern

**Sources:**
- [Compound Components Pattern](https://www.patterns.dev/react/compound-pattern/)
- [Modern React Design Patterns 2025](https://www.inexture.com/modern-react-design-patterns-ui-architecture-examples/)

### **2.4 UI Stack Declaration (Implementation Target)**

**CRITICAL**: This section declares the normative technology stack for Visual Social Graph UI implementation. All components MUST conform to this stack.

**Framework & Runtime:**
- **Framework**: React 18+ (with React Server Components where applicable)
- **Language**: TypeScript 5+ (strict mode enabled, no `any` types)
- **Build Tool**: Vite 5+ (for fast HMR, optimized production builds)
- **Package Manager**: npm 10+ or pnpm 8+ (lock file MUST be committed)

**Component Architecture:**
- **Component Model**: Compound Components with Context API (per Section 2.3)
- **State Management**:
  - Local state: React `useState` + `useReducer`
  - Global state: Context API for theme, mode (Offline/Standard), user session
  - Server state: TanStack Query (React Query) for API data caching
- **Refs & Composition**: `forwardRef` for all interactive components (enables composition)

**Styling System:**
- **Primary**: Tailwind CSS 4+ with VSG custom theme config
- **CSS Variables**: `src/styles/tokens.css` (single source of truth for design tokens)
- **CSS-in-JS**: PROHIBITED (performance + SSR complexity; use Tailwind + CSS vars only)
- **Tailwind Config Location**: `tailwind.config.ts` (extends with VSG token references)
- **Global Styles**: `src/styles/globals.css` (imports tokens.css, Tailwind directives, font files)

**Token Implementation (Tailwind + CSS Variables):**
```typescript
// tailwind.config.ts - References CSS custom properties from tokens.css
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Reference CSS variables from src/styles/tokens.css
        'vsg-primary': 'var(--vsg-color-primary)',
        'vsg-orange': {
          50: 'var(--vsg-color-orange-50)',
          500: 'var(--vsg-color-orange-500)',
          900: 'var(--vsg-color-orange-900)',
        },
        'vsg-error': 'var(--vsg-color-error-500)',
        'vsg-success': 'var(--vsg-color-success-500)',
      },
      spacing: {
        // Tailwind's default 4px base matches VSG 8-point grid (when doubled)
        // Custom additions if needed
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Routing:**
- **Router**: React Router 7+ (or TanStack Router for type-safe routing)
- **File-based Routing**: OPTIONAL (framework-dependent; not required)

**Graph Visualization:**
- **Primary Library**: Sigma.js 3+ (WebGL-accelerated, handles 10k+ nodes)
- **Layout Algorithm**: GraphologyJS layout algorithms (force-directed, circular)
- **Canvas Rendering**: WebGL via Sigma.js (fallback to Canvas 2D for old browsers)

**Form Handling:**
- **Library**: React Hook Form 7+ (performance, minimal re-renders)
- **Validation**: Zod 3+ (TypeScript-first schema validation, generates types from OpenAPI)

**Testing:**
- **Unit Tests**: Vitest (Vite-native, fast)
- **Component Tests**: Testing Library (React Testing Library)
- **Accessibility Tests**: jest-axe + axe-core
- **E2E Tests**: Playwright (cross-browser, visual regression)
- **Visual Regression**: Chromatic + Storybook

**Build & Deployment:**
- **Storybook**: Storybook 8+ (component documentation + visual regression)
- **Bundle Analysis**: `vite-bundle-visualizer` (track bundle size budgets)
- **CI/CD**: GitHub Actions (lint, test, build, deploy)

**Browser Support (MUST):**
| Browser | Minimum Version | Market Share Target |
|---------|----------------|---------------------|
| Chrome | 120+ (2024) | Primary |
| Firefox | 121+ (2024) | Primary |
| Safari | 17+ (2023) | Primary |
| Edge | 120+ (Chromium) | Primary |
| Mobile Safari (iOS) | 17+ | Primary |
| Mobile Chrome (Android) | 120+ | Primary |

**Polyfills:**
- NONE required for target browsers (all support ES2022, CSS Variables, WebGL)
- Graceful degradation for WebGL (fallback to Canvas 2D, reduced node limit)

**Performance Targets (Lighthouse, Moto G4 4x slowdown):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1

**Code Quality Gates:**
- **Linting**: ESLint 9+ with `@typescript-eslint`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`
- **Formatting**: Prettier 3+ (auto-format on save, pre-commit hook)
- **Type Checking**: TypeScript strict mode (no `any`, no implicit any)
- **Pre-commit Hooks**: Husky + lint-staged (lint, format, type-check before commit)

**Prohibited Technologies:**
- ❌ CSS-in-JS libraries (styled-components, emotion, etc.) - use Tailwind + CSS vars
- ❌ jQuery or legacy libraries - React-only
- ❌ Class components - functional components + hooks only
- ❌ Inline styles for layout/colors - use Tailwind classes or CSS custom properties
- ❌ Non-TypeScript files - all `.js` → `.ts`, all `.jsx` → `.tsx`

**Migration Path (if codebase exists):**
If existing code doesn't match this stack:
1. Document current stack in Section 2.4 (this section)
2. Create migration plan in Section 8 (Implementation Checklist)
3. Set timeline for full stack alignment (e.g., Sprint 3)
4. No new code may use non-compliant stack after Sprint 1

**Definition of Done:**
- ✅ All components use React 18+ functional components + hooks
- ✅ All styling uses Tailwind CSS classes or CSS custom properties from `tokens.css`
- ✅ All TypeScript files pass strict type checking (no `any`)
- ✅ All components have Storybook stories
- ✅ All tests pass (Vitest unit, RTL component, jest-axe accessibility)
- ✅ Lighthouse scores meet targets (90/95/95/90)
- ✅ Bundle size within budget (see Section 7.2)

---

## **3. Design Tokens (Single Source of Truth)**

### **3.1 Token Architecture**

**Three-Tier Token System:**
```
Primitive Tokens (Raw Values)
    ↓
Semantic Tokens (Contextual Meaning)
    ↓
Component Tokens (Specific Use)
```

**Example Flow:**
```css
/* PRIMITIVE (raw value) */
--vsg-color-orange-500: #F97316;

/* SEMANTIC (contextual meaning) */
--vsg-color-primary: var(--vsg-color-orange-500);
--vsg-color-action: var(--vsg-color-primary);

/* COMPONENT (specific use) */
--vsg-button-bg-primary: var(--vsg-color-action);
--vsg-button-bg-primary-hover: var(--vsg-color-orange-600);
```

**Benefits:**
- ✅ Single source of truth (change one token → update entire system)
- ✅ Semantic naming prevents magic values (`--vsg-color-primary` not `#F97316`)
- ✅ **Consistent `--vsg-*` prefix** for all VSG tokens (NEVER use bare `--color-*` or `--button-*`)
- ✅ Easy theming (swap primitive tokens for dark mode)
- ✅ Type safety (TypeScript types from tokens)

### **3.2 Color Tokens**

**Primitive Color Palette:**
```css
/* src/styles/tokens.css (single source of truth for raw values) */
:root {
  --vsg-color-orange-500: #F97316;
  --vsg-color-orange-600: #EA580C;
  --vsg-color-orange-700: #C2410C;

  --vsg-color-gray-50: #FAFAFA;
  --vsg-color-gray-100: #F5F5F5;
  --vsg-color-gray-200: #E5E5E5;
  --vsg-color-gray-300: #D4D4D4;
  --vsg-color-gray-400: #A3A3A3;
  --vsg-color-gray-500: #737373;
  --vsg-color-gray-600: #525252;
  --vsg-color-gray-700: #404040;
  --vsg-color-gray-900: #171717;

  --vsg-color-white: #FFFFFF;
}
```

**Semantic Color Tokens:**
```typescript
// src/tokens/index.ts (references CSS custom properties; no raw hex here)
export const semanticColors = {
  // Brand
  primary: 'var(--vsg-color-orange-500)',
  primaryHover: 'var(--vsg-color-orange-600)',
  primaryActive: 'var(--vsg-color-orange-700)',

  // Text
  textPrimary: 'var(--vsg-color-gray-700)',
  textSecondary: 'var(--vsg-color-gray-600)',
  textTertiary: 'var(--vsg-color-gray-500)',
  textDisabled: 'var(--vsg-color-gray-400)',
  textInverse: 'var(--vsg-color-white)',

  // Backgrounds
  bgPrimary: 'var(--vsg-color-white)',
  bgSecondary: 'var(--vsg-color-gray-50)',
  bgTertiary: 'var(--vsg-color-gray-100)',
  bgInverse: 'var(--vsg-color-gray-900)',

  // Borders
  borderLight: 'var(--vsg-color-gray-200)',
  borderMedium: 'var(--vsg-color-gray-300)',
  borderStrong: 'var(--vsg-color-gray-400)',
} as const;
```

**Component Color Tokens:**
```typescript
// tokens/components.ts
import { semanticColors } from './semantic';

export const componentTokens = {
  button: {
    // Primary variant
    primaryBg: semanticColors.primary,
    primaryBgHover: semanticColors.primaryHover,
    primaryText: semanticColors.bgPrimary,
    // Additional variants and state tokens omitted for brevity
  },

  input: {
    bg: semanticColors.bgTertiary,
    bgFocus: semanticColors.bgPrimary,
    border: semanticColors.borderLight,
    borderFocus: semanticColors.primary,
    text: semanticColors.textPrimary,
    placeholder: semanticColors.textTertiary
  },

  card: {
    bg: semanticColors.bgPrimary,
    border: semanticColors.borderLight,
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }
} as const;
```

### **3.3 Spacing Tokens (4px Grid)**

```typescript
// tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '4px',   // 0.25rem
  2: '8px',   // 0.5rem
  3: '12px',  // 0.75rem
  4: '16px',  // 1rem
  5: '20px',  // 1.25rem
  6: '24px',  // 1.5rem
  8: '32px',  // 2rem
  10: '40px', // 2.5rem
  12: '48px', // 3rem
  16: '64px', // 4rem
  20: '80px', // 5rem
  24: '96px', // 6rem
  32: '128px' // 8rem
} as const;

// Component-specific spacing
export const componentSpacing = {
  buttonPaddingSmall: `${spacing[2]} ${spacing[4]}`, // 8px 16px
  buttonPaddingMedium: `${spacing[3]} ${spacing[5]}`, // 12px 20px
  buttonPaddingLarge: `${spacing[4]} ${spacing[6]}`, // 16px 24px

  cardPaddingMobile: spacing[4], // 16px
  cardPaddingDesktop: spacing[6], // 24px

  inputPadding: `${spacing[3]} ${spacing[4]}`, // 12px 16px

  sectionSpacingMobile: spacing[12], // 48px
  sectionSpacingDesktop: spacing[16] // 64px
} as const;
```

### **3.4 Typography Tokens**

```typescript
// tokens/typography.ts
export const typography = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", "Courier New", monospace'
  },

  // Font sizes (fluid typography with clamp)
  fontSize: {
    h1: 'clamp(2.25rem, 2vw + 1.5rem, 3rem)',      // 36px - 48px
    h2: 'clamp(1.875rem, 1.5vw + 1.25rem, 2.25rem)', // 30px - 36px
    h3: 'clamp(1.5rem, 1vw + 1.125rem, 1.875rem)',   // 24px - 30px
    h4: 'clamp(1.25rem, 0.5vw + 1rem, 1.5rem)',      // 20px - 24px
    h5: 'clamp(1.125rem, 0.25vw + 1rem, 1.25rem)',   // 18px - 20px
    h6: '1.125rem',                                   // 18px
    bodyLg: '1.125rem',                               // 18px
    body: '1rem',                                     // 16px
    bodySm: '0.875rem',                               // 14px
    caption: '0.75rem'                                // 12px
  },

  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // Line heights
  lineHeight: {
    tight: 1.167,  // Headings
    snug: 1.375,   // Subheadings
    normal: 1.5,   // Body text
    relaxed: 1.625 // Large text
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em' // All-caps labels
  }
} as const;
```

### **3.5 Shadow Tokens (Elevation)**

```typescript
// tokens/shadows.ts
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
} as const;

// Component-specific elevation
export const elevation = {
  flat: shadows.none,
  card: shadows.sm,
  cardHover: shadows.md,
  popover: shadows.lg,
  modal: shadows.xl,
  dropdown: shadows.md
} as const;
```

### **3.6 Border Radius Tokens**

```typescript
// tokens/radii.ts
export const radii = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px'
} as const;

// Component-specific radii
export const componentRadii = {
  button: radii.sm,       // 8px
  input: radii.sm,        // 8px
  card: radii.md,         // 12px
  modal: radii.lg,        // 16px
  avatar: radii.full,     // Circular
  badge: radii.full       // Pill shape
} as const;
```

### **3.7 Z-Index Tokens (Layering)**

```typescript
// tokens/zIndex.ts
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
} as const;
```

### **3.8 Animation Tokens**

```typescript
// tokens/animations.ts
export const animations = {
  // Durations (milliseconds)
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Approximates spring
  },

  // Spring config (for react-spring)
  spring: {
    default: { tension: 170, friction: 26, mass: 1 },
    gentle: { tension: 120, friction: 14, mass: 1 },
    wobbly: { tension: 180, friction: 12, mass: 1 },
    stiff: { tension: 210, friction: 20, mass: 1 },
    slow: { tension: 280, friction: 60, mass: 1 }
  }
} as const;
```

---

## **4. Component Specifications**

### **4.1 Button Component**

**Purpose:** Primary interaction element for all user actions.

**Variants:**
- **Primary**: High-emphasis actions (upload, submit, confirm)
- **Secondary**: Medium-emphasis actions (cancel, go back)
- **Tertiary**: Low-emphasis actions (dismiss, skip)

**TypeScript Interface:**
```typescript
interface ButtonProps {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state (shows spinner, disables interaction)
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button (spans container)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode;

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * HTML button type
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label (required if children is icon-only)
   */
  'aria-label'?: string;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { componentTokens } from '@/tokens';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
  ...rest
}) => {
  // Base classes (shared across all variants)
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vsg-focus focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  ];

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-vsg-primary text-white',
      'hover:bg-vsg-primary-hover active:bg-vsg-primary-active',
      'shadow-sm hover:shadow-md'
    ],
    secondary: [
      'bg-white text-vsg-primary',
      'border-2 border-vsg-primary',
      'hover:bg-vsg-primary-hover-subtle active:bg-vsg-primary-selected'
    ],
    tertiary: [
      'bg-transparent text-vsg-primary',
      'hover:bg-vsg-primary-hover-subtle active:bg-vsg-primary-selected'
    ]
  };

  // Size classes
  const sizeClasses = {
    small: 'px-4 py-2 text-sm rounded-md min-h-[36px] gap-2',
    medium: 'px-5 py-3 text-base rounded-lg min-h-[44px] gap-2',
    large: 'px-6 py-4 text-lg rounded-lg min-h-[52px] gap-3'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
```

**Accessibility Requirements:**
- ✅ Minimum touch target: 44px height (all sizes meet this)
- ✅ Focus visible: 2px orange ring with 2px offset
- ✅ Disabled state: `opacity-50`, `cursor-not-allowed`, `pointer-events-none`
- ✅ Loading state: `aria-busy="true"`, spinner visible
- ✅ Icon-only buttons: Require `aria-label`
- ✅ Keyboard navigation: Native `<button>` support

**Visual States:**
| State | Visual Change | Duration |
|-------|---------------|----------|
| Hover | Background darkens (orange-600), shadow lifts | 300ms |
| Active | Background darkens further (orange-700) | 0ms (instant) |
| Focus | Orange ring (2px, 2px offset) | 0ms (instant) |
| Disabled | Opacity 50%, grayscale (implicit) | 0ms |
| Loading | Spinner appears, content grays out | 300ms fade |

**Usage Examples:**
```typescript
// Primary action
<Button variant="primary" size="medium">
  Upload Graph
</Button>

// With left icon
<Button variant="primary" leftIcon={<Upload size={16} />}>
  Upload Graph
</Button>

// Loading state
<Button variant="primary" loading>
  Processing...
</Button>

// Secondary action
<Button variant="secondary">
  Cancel
</Button>

// Tertiary (low-emphasis)
<Button variant="tertiary">
  Skip for now
</Button>

// Full width
<Button variant="primary" fullWidth>
  Continue
</Button>

// Icon-only (requires aria-label)
<Button variant="tertiary" aria-label="Close dialog">
  <X size={20} />
</Button>
```

**Quality Gates:**
- ✅ Contrast ratio: White on orange-500 = 3.04:1 (WCAG AA Large Text ✅)
- ✅ Touch target: All sizes ≥44px ✅
- ✅ Focus visible: Ring visible on keyboard focus ✅
- ✅ Screen reader: `aria-label` enforced for icon-only ✅
- ✅ States tested: Hover, active, focus, disabled, loading ✅

---

### **4.2 Input Component**

**Purpose:** Text input for forms (platform selection, settings, etc.)

**TypeScript Interface:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text (required for accessibility)
   */
  label: string;

  /**
   * Error message (displays below input when present)
   */
  error?: string;

  /**
   * Helper text (displays below input when no error)
   */
  helperText?: string;

  /**
   * Whether label is visually hidden (still accessible to screen readers)
   * @default false
   */
  labelHidden?: boolean;

  /**
   * Icon to display on the left side of input
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display on the right side of input
   */
  rightIcon?: React.ReactNode;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { semanticColors } from '@/tokens';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      labelHidden = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      disabled,
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium text-vsg-neutral-700',
            labelHidden && 'sr-only'
          )}
        >
          {label}
        </label>

        {/* Input container */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-vsg-neutral-500">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              'w-full px-4 py-3 text-base',
              'bg-vsg-neutral-100 border-2 border-vsg-neutral-200 rounded-lg',
              'text-vsg-neutral-900 placeholder:text-vsg-neutral-500',
              'transition-all duration-200',

              // Focus state
              'focus:outline-none focus:bg-white focus:border-vsg-focus focus:ring-2 focus:ring-vsg-focus/20',

              // Disabled state
              'disabled:bg-vsg-neutral-100 disabled:text-vsg-neutral-500 disabled:cursor-not-allowed',

              // Error state
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',

              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',

              className
            )}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(errorId, helperId).trim() || undefined}
            {...rest}
          />

          {/* Right icon (error icon takes precedence) */}
          {error ? (
            <div className="absolute right-3 text-red-500">
              <AlertCircle size={20} />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3 pointer-events-none text-vsg-neutral-500">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {/* Error or helper text */}
        {error && (
          <p id={errorId} className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-vsg-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Accessibility Requirements:**
- ✅ Label required: Always present (visually or `sr-only`)
- ✅ Error handling: `aria-invalid`, `aria-describedby`, `role="alert"`
- ✅ Helper text: Linked via `aria-describedby`
- ✅ Disabled state: `disabled` attribute + visual styling
- ✅ Touch target: 44px height (12px padding + 16px text + 12px padding = ~44px)

**Visual States:**
| State | Border | Background | Ring |
|-------|--------|------------|------|
| Default | Gray-200 (2px) | Gray-100 | None |
| Focus | Orange-500 (2px) | White | Orange-500/20 (2px) |
| Error | Red-500 (2px) | Gray-100 | Red-500/20 (2px, focus) |
| Disabled | Gray-200 (2px) | Gray-100 | None |

**Usage Examples:**
```typescript
// Basic input
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
/>

// With helper text
<Input
  label="Username"
  helperText="This will be your public display name"
  placeholder="johndoe"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With left icon
<Input
  label="Search"
  leftIcon={<Search size={20} />}
  placeholder="Search graphs..."
/>

// Hidden label (still accessible)
<Input
  label="Search"
  labelHidden
  leftIcon={<Search size={20} />}
  placeholder="Search..."
/>
```

---

### **4.3 Card Component**

**Purpose:** Container for content grouping (insights, stats, platform summaries)

**TypeScript Interface:**
```typescript
interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined';

  /**
   * Padding size
   * @default 'medium'
   */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Whether card is hoverable (cursor pointer, hover state)
   * @default false
   */
  hoverable?: boolean;

  /**
   * Click handler (if card is interactive)
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA role (e.g., 'article', 'region')
   */
  role?: string;

  /**
   * ARIA label (if card is clickable)
   */
  'aria-label'?: string;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { elevation, radii, spacing } from '@/tokens';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  onClick,
  className,
  role,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const baseClasses = [
    'bg-white rounded-lg transition-all duration-200'
  ];

  const variantClasses = {
    default: 'border-2 border-vsg-neutral-200',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-vsg-primary-subtle'
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',  // 16px
    medium: 'p-6', // 24px
    large: 'p-8'   // 32px
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverable && 'cursor-pointer hover:shadow-md hover:border-vsg-primary',
        onClick && 'text-left w-full',
        className
      )}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Component>
  );
};
```

**Accessibility Requirements:**
- ✅ Semantic HTML: `<div>` for static, `<button>` for interactive
- ✅ Clickable cards: `aria-label` required if no visible text
- ✅ Keyboard navigation: Native `<button>` support if interactive
- ✅ Focus visible: Inherits focus ring from button styles

**Visual States:**
| Variant | Border | Shadow | Hover |
|---------|--------|--------|-------|
| Default | Gray-200 (2px) | None | Border → Orange-300 |
| Elevated | None | md → lg | Shadow lifts |
| Outlined | Orange-200 (2px) | None | Border → Orange-300 |

**Usage Examples:**
```typescript
// Basic card
<Card>
  <h3>Insight Title</h3>
  <p>Insight content...</p>
</Card>

// Elevated card (for emphasis)
<Card variant="elevated">
  <StatDisplay value={150} label="Total Connections" />
</Card>

// Interactive card
<Card
  hoverable
  onClick={() => navigateTo('/insights/123')}
  aria-label="View insight details"
>
  <InsightPreview data={insight} />
</Card>

// Custom padding
<Card padding="none">
  <img src="/preview.jpg" alt="Graph preview" className="w-full rounded-t-lg" />
  <div className="p-6">
    <h3>Graph Title</h3>
  </div>
</Card>
```

---

### **4.4 Upload Zone Component**

**Purpose:** Drag-and-drop file upload area for platform data

**TypeScript Interface:**
```typescript
interface UploadZoneProps {
  /**
   * File types accepted (e.g., '.json', '.csv')
   */
  accept?: string;

  /**
   * Whether upload is in progress
   * @default false
   */
  loading?: boolean;

  /**
   * Upload progress percentage (0-100)
   */
  progress?: number;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Success message to display
   */
  success?: string;

  /**
   * Handler for file drop/select
   */
  onFileSelect: (file: File) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  loading = false,
  progress,
  error,
  success,
  onFileSelect,
  className
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center',
        'min-h-[240px] p-8',
        'border-2 border-dashed rounded-lg',
        'transition-all duration-200',
        isDragActive && 'border-vsg-primary bg-vsg-primary-hover-subtle',
        !isDragActive && !error && !success && 'border-vsg-neutral-300 bg-vsg-neutral-50',
        error && 'border-red-500 bg-red-50',
        success && 'border-green-500 bg-green-50',
        !loading && 'cursor-pointer hover:border-vsg-primary-hover hover:bg-vsg-primary-hover-subtle',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="sr-only"
        id="file-upload"
        disabled={loading}
      />

      <label htmlFor="file-upload" className="flex flex-col items-center gap-4 cursor-pointer">
        {/* Icon */}
        {success ? (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
            <Check size={32} className="text-green-600" />
          </div>
        ) : error ? (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        ) : (
          <div className={cn(
            'w-16 h-16 flex items-center justify-center rounded-full',
            isDragActive ? 'bg-vsg-primary-selected' : 'bg-vsg-neutral-200'
          )}>
            <Upload size={32} className={isDragActive ? 'text-vsg-primary' : 'text-vsg-neutral-600'} />
          </div>
        )}

        {/* Text */}
        <div className="text-center">
          {success ? (
            <p className="text-base font-semibold text-green-700">{success}</p>
          ) : error ? (
            <p className="text-base font-semibold text-red-700">{error}</p>
          ) : loading ? (
            <div>
              <p className="text-base font-semibold text-vsg-neutral-700">Uploading...</p>
              {progress !== undefined && (
                <p className="text-sm text-vsg-neutral-600 mt-1">{progress}% complete</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-vsg-neutral-700">
                {isDragActive ? 'Drop file here' : 'Drop file or click to upload'}
              </p>
              <p className="text-sm text-vsg-neutral-600 mt-1">
                {accept ? `Accepted: ${accept}` : 'Any file type'}
              </p>
            </div>
          )}
        </div>
      </label>

      {/* Progress bar */}
      {loading && progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-vsg-neutral-200 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-vsg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  );
};
```

**Accessibility Requirements:**
- ✅ Keyboard accessible: `tabIndex={0}`, native file input
- ✅ Screen reader: `aria-label="Upload file"`, `role="button"`
- ✅ Progress indicator: `role="progressbar"`, `aria-valuenow`
- ✅ Error/success: Announced via visible text change
- ✅ Hidden input: `sr-only` class, linked to visible label

**Visual States:**
| State | Border | Background | Icon |
|-------|--------|------------|------|
| Default | Gray-300 dashed | Gray-50 | Gray Upload |
| Drag Active | Orange-500 dashed | Orange-50 | Orange Upload |
| Error | Red-500 dashed | Red-50 | Red Alert |
| Success | Green-500 dashed | Green-50 | Green Check |

**Usage Examples:**
```typescript
// Basic upload
<UploadZone
  accept=".json"
  onFileSelect={(file) => handleUpload(file)}
/>

// With progress
<UploadZone
  accept=".json"
  loading={isUploading}
  progress={uploadProgress}
  onFileSelect={(file) => handleUpload(file)}
/>

// With error
<UploadZone
  accept=".json"
  error="Invalid JSON format. Please check your file."
  onFileSelect={(file) => handleUpload(file)}
/>

// With success
<UploadZone
  accept=".json"
  success="File uploaded successfully!"
  onFileSelect={(file) => handleUpload(file)}
/>
```

---

### **4.5 Progress Indicator Component**

**Purpose:** Visual feedback for loading states, processing steps

**TypeScript Interface:**
```typescript
interface ProgressIndicatorProps {
  /**
   * Progress value (0-100 for determinate, undefined for indeterminate)
   */
  value?: number;

  /**
   * Visual variant
   * @default 'linear'
   */
  variant?: 'linear' | 'circular';

  /**
   * Size (circular only)
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Label text (displayed next to progress)
   */
  label?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  variant = 'linear',
  size = 'medium',
  label,
  className
}) => {
  const isIndeterminate = value === undefined;

  if (variant === 'circular') {
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };

    return (
      <div className={cn('flex items-center gap-3', className)}>
        {isIndeterminate ? (
          <Loader2 className={cn('animate-spin text-vsg-primary', sizeClasses[size])} />
        ) : (
          <svg className={sizeClasses[size]} viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-vsg-neutral-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - (value || 0) / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-300 text-vsg-primary"
            />
          </svg>
        )}
        {label && <span className="text-sm text-vsg-neutral-700">{label}</span>}
      </div>
    );
  }

  // Linear variant
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-vsg-neutral-700">{label}</span>
          {!isIndeterminate && (
            <span className="text-sm text-vsg-neutral-600">{value}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-vsg-neutral-200 rounded-full overflow-hidden">
        {isIndeterminate ? (
          <div className="h-full bg-vsg-primary rounded-full animate-pulse" style={{ width: '50%' }} />
        ) : (
          <div
            className="h-full bg-vsg-primary rounded-full transition-all duration-300"
            style={{ width: `${value}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
      </div>
    </div>
  );
};
```

**Accessibility Requirements:**
- ✅ Determinate progress: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- ✅ Indeterminate progress: Spinning icon with implicit loading state
- ✅ Label: Visible text label for context
- ✅ Percentage: Visible for determinate linear progress

**Usage Examples:**
```typescript
// Linear determinate
<ProgressIndicator
  variant="linear"
  value={65}
  label="Parsing graph data"
/>

// Linear indeterminate
<ProgressIndicator
  variant="linear"
  label="Processing..."
/>

// Circular determinate
<ProgressIndicator
  variant="circular"
  value={80}
  size="large"
  label="80% complete"
/>

// Circular indeterminate (spinner)
<ProgressIndicator
  variant="circular"
  size="small"
/>
```

---

### **4.6 Select Component (Compound Pattern)**

**Purpose:** Dropdown selection (platform choice, filter options)

**Note:** This component demonstrates the full Compound Component pattern discussed in Section 2.3.

**TypeScript Interfaces:**
```typescript
interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}

interface SelectTriggerProps {
  children?: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

// Context for shared state
const SelectContext = createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }
  return context;
};

// Parent compound component
export const Select: React.FC<SelectProps> & {
  Trigger: typeof SelectTrigger;
  Content: typeof SelectContent;
  Item: typeof SelectItem;
} = ({ value, onChange, children, placeholder = 'Select...' }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// Trigger button
const SelectTrigger: React.FC<SelectTriggerProps> = ({ children }) => {
  const { setOpen, open } = useSelectContext();

  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-between gap-2',
        'w-full min-h-[44px] px-4 py-3',
        'bg-vsg-neutral-100 border-2 border-vsg-neutral-200 rounded-lg',
        'text-base text-left',
        'transition-all duration-200',
        'hover:bg-vsg-neutral-50 hover:border-vsg-neutral-300',
        'focus:outline-none focus:bg-white focus:border-vsg-focus focus:ring-2 focus:ring-vsg-focus/20',
        open && 'bg-white border-vsg-focus ring-2 ring-vsg-focus/20'
      )}
      onClick={() => setOpen(!open)}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <span className="truncate">{children}</span>
      <ChevronDown
        size={20}
        className={cn(
          'shrink-0 text-vsg-neutral-500 transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  );
};

// Dropdown content
const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-10 mt-2',
        'w-full max-h-60 overflow-auto',
        'bg-white border-2 border-vsg-neutral-200 rounded-lg shadow-lg',
        'py-2'
      )}
      role="listbox"
    >
      {children}
    </div>
  );
};

// Individual option
const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const { onChange, setOpen, value: selectedValue } = useSelectContext();
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-between gap-2',
        'w-full px-4 py-2 min-h-[44px]',
        'text-base text-left',
        'transition-colors duration-150',
        isSelected && 'bg-vsg-primary-selected text-vsg-primary font-semibold',
        !isSelected && 'text-vsg-neutral-700 hover:bg-vsg-neutral-50'
      )}
      onClick={() => {
        onChange(value);
        setOpen(false);
      }}
      role="option"
      aria-selected={isSelected}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check size={20} className="shrink-0 text-vsg-primary" />}
    </button>
  );
};

// Attach children to parent
Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;
```

**Accessibility Requirements:**
- ✅ Keyboard navigation: Arrow keys, Enter, Escape
- ✅ ARIA attributes: `aria-haspopup="listbox"`, `aria-expanded`, `role="option"`, `aria-selected`
- ✅ Focus management: Returns focus to trigger after selection
- ✅ Touch targets: 44px minimum on all interactive elements
- ✅ Screen reader: Announces selected value, options count

**Usage Examples:**
```typescript
// Basic select
const [platform, setPlatform] = useState('');

<Select value={platform} onChange={setPlatform}>
  <Select.Trigger>
    {platform || 'Select platform'}
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="twitter">Twitter</Select.Item>
    <Select.Item value="instagram">Instagram</Select.Item>
    <Select.Item value="linkedin">LinkedIn</Select.Item>
  </Select.Content>
</Select>

// With custom display
<Select value={filterValue} onChange={setFilterValue}>
  <Select.Trigger>
    {filterLabels[filterValue] || 'All'}
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="all">All Connections</Select.Item>
    <Select.Item value="strong">Strong Ties Only</Select.Item>
    <Select.Item value="weak">Weak Ties Only</Select.Item>
  </Select.Content>
</Select>
```

**Why Compound Pattern:**
- ✅ Flexible composition: Can rearrange, omit, add custom elements between components
- ✅ No prop drilling: State managed in Context, accessible to all children
- ✅ Type safety: TypeScript enforces correct usage
- ✅ Modern standard: Matches Radix UI, Headless UI patterns

---

### **4.7 Modal Component**

**Purpose:** Dialog overlays for confirmations, forms, detailed views

**TypeScript Interface:**
```typescript
interface ModalProps {
  /**
   * Whether modal is open
   */
  open: boolean;

  /**
   * Handler for close action
   */
  onClose: () => void;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Modal title (required for accessibility)
   */
  title: string;

  /**
   * Size of modal
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'full';

  /**
   * Whether to show close button
   * @default true
   */
  showClose?: boolean;

  /**
   * Whether clicking backdrop closes modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Additional CSS classes for modal content
   */
  className?: string;
}
```

**Implementation:**
```typescript
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  size = 'medium',
  showClose = true,
  closeOnBackdropClick = true,
  className
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl',
          'flex flex-col',
          sizeClasses[size],
          'max-h-[90vh]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-vsg-neutral-200">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-vsg-neutral-900"
          >
            {title}
          </h2>
          {showClose && (
            <button
              type="button"
              className={cn(
                'p-2 -mr-2',
                'text-vsg-neutral-500 hover:text-vsg-neutral-700',
                'rounded-lg hover:bg-vsg-neutral-100',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-vsg-focus'
              )}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal (outside React root)
  return createPortal(modal, document.body);
};
```

**Accessibility Requirements:**
- ✅ Focus trap: Focus stays within modal when open
- ✅ Keyboard: Escape key closes modal
- ✅ ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- ✅ Body scroll: Prevented when modal open
- ✅ Close button: Visible, keyboard accessible
- ✅ Backdrop: Click to close (optional)

**Visual Hierarchy:**
```
Z-Index Layering:
├─ Backdrop (z-50, bg-black/50, backdrop-blur-sm)
└─ Modal Content (z-50, relative, bg-white, shadow-xl)
```

**Usage Examples:**
```typescript
// Basic modal
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
>
  <p className="text-vsg-neutral-700">
    Are you sure you want to delete this graph?
  </p>
  <div className="flex gap-3 mt-6">
    <Button variant="primary" onClick={handleDelete}>
      Delete
    </Button>
    <Button variant="secondary" onClick={() => setOpen(false)}>
      Cancel
    </Button>
  </div>
</Modal>

// Form modal (larger)
<Modal
  open={settingsOpen}
  onClose={() => setSettingsOpen(false)}
  title="Settings"
  size="large"
>
  <SettingsForm onSave={handleSave} />
</Modal>

// No backdrop close (critical action)
<Modal
  open={criticalOpen}
  onClose={() => setCriticalOpen(false)}
  title="Critical Action Required"
  closeOnBackdropClick={false}
>
  <ImportantWarning />
</Modal>
```

### **4.8 Component Contract Matrix**

**Purpose**: This matrix defines the MINIMUM VIABLE contract for each component. Every component MUST implement all specified contracts before being considered production-ready.

| Component | Purpose | Props (TypeScript Interface) | States | Accessibility Requirements | Keyboard Behavior | Performance Notes |
|-----------|---------|------------------------------|--------|---------------------------|-------------------|-------------------|
| **Button** | Primary user action trigger | `ButtonProps` (Section 4.1) | `default`, `hover`, `active`, `disabled`, `loading` | WCAG AA (4.5:1 contrast), 44px touch target, focus visible (2px ring), `role="button"`, `aria-disabled` | `Tab` (focus), `Enter`/`Space` (activate), `Escape` (blur if in modal) | Bundle: <2KB, Lighthouse: 100/100, No layout shift |
| **Input** | Text/number data entry | `InputProps` (Section 4.2) | `default`, `focus`, `disabled`, `error`, `success`, `loading` | WCAG AA contrast, 44px touch target, `aria-invalid`, `aria-describedby` (error text), visible label | `Tab` (focus/blur), `Esc` (clear/blur), `Enter` (submit form) | Debounce validation (300ms), No re-render on keystroke |
| **Select** | Single/multi choice picker | `SelectProps` (Section 4.6) | `closed`, `open`, `disabled`, `error`, `loading` | `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-labelledby`, keyboard navigation | `Tab` (focus), `Enter`/`Space` (open), `↑`/`↓` (navigate), `Enter` (select), `Esc` (close) | Virtual scrolling for 100+ items, Bundle: <5KB |
| **Modal** | Critical action overlay | `ModalProps` (Section 4.7) | `closed`, `opening`, `open`, `closing` | Focus trap, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape to close | `Tab` (cycle focus within), `Shift+Tab` (reverse), `Esc` (close), Focus first interactive element on open | Portal rendering, Body scroll lock, Unmount on close |
| **Card** | Content grouping container | `CardProps` (Section 4.3) | `default`, `hover` (if clickable), `active`, `disabled` | Semantic HTML (`<article>`, `<section>`, or `<div>`), `role` if interactive, `aria-label` if no visible heading | `Tab` (focus if clickable), `Enter`/`Space` (activate if button) | Lazy image loading, Intersection Observer for below-fold |
| **Upload Zone** | Drag-and-drop file upload | `UploadZoneProps` (Section 4.4) | `idle`, `dragover`, `uploading`, `success`, `error` | `role="button"`, `aria-label="Upload files"`, `aria-busy` during upload, error announcement via `aria-live` | `Tab` (focus), `Enter`/`Space` (open file picker), Focus visible | Chunk uploads (5MB chunks), Progress tracking, Abort support |
| **Progress** | Task completion indicator | `ProgressProps` (Section 4.5) | `indeterminate`, `determinate` (0-100%) | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label` | Not focusable (status indicator only) | requestAnimationFrame for smooth animation, Respect `prefers-reduced-motion` |
| **Toast** | Transient notification | `ToastProps` (TBD) | `entering`, `visible`, `exiting`, `dismissed` | `role="status"` (info) or `role="alert"` (error), `aria-live="polite"` or `"assertive"`, auto-dismiss after 5s | `Esc` (dismiss), `Tab` (focus action button if present) | Max 3 visible toasts, Queue overflow, Auto-dismiss timer pause on hover |
| **Tooltip** | Contextual help on hover | `TooltipProps` (TBD) | `hidden`, `visible`, `transitioning` | `role="tooltip"`, `aria-describedby` on trigger, Not focusable (supplementary), Hover delay 300ms | Not keyboard-focusable (use `aria-label` instead for keyboard users) | Position calculation (Popper.js or Floating UI), Boundary collision detection |
| **Tabs** | Content section switcher | `TabsProps` (TBD) | `active`, `inactive`, `disabled` per tab | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby` | `Tab` (focus), `←`/`→` (navigate tabs), `Home`/`End` (first/last), `Enter`/`Space` (activate) | Lazy load tab panels, Keyboard roving tabindex |
| **Drawer** | Side panel overlay | `DrawerProps` (TBD) | `closed`, `opening`, `open`, `closing` | Focus trap when open, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape to close | `Tab` (cycle focus within), `Esc` (close), Focus first element on open | CSS transform (not width), GPU acceleration, Backdrop overlay |
| **GraphCanvas** | Network visualization | `GraphCanvasProps` (TBD) | `loading`, `ready`, `interacting`, `error` | `role="img"`, `aria-label` (graph description), Keyboard-accessible node selection, Screen reader node list fallback | `Tab` (focus canvas), `←`/`↑`/`→`/`↓` (pan), `+`/`-` (zoom), `Enter` (select node), `Esc` (clear selection) | WebGL rendering (Sigma.js), 60 FPS target, Virtualization for 10k+ nodes, Web Worker for layout |
| **MiniMap** | Canvas navigation aid | `MiniMapProps` (TBD) | `visible`, `hidden`, `interacting` | `role="img"`, `aria-label="Graph overview minimap"`, Not keyboard-focusable (visual aid only) | Not focusable (decorative) | Canvas 2D API, 30 FPS throttle, <100ms render time |
| **NodeInspector** | Node detail panel | `NodeInspectorProps` (TBD) | `closed`, `loading`, `ready`, `error` | `role="complementary"`, `aria-labelledby` (node name), Keyboard-accessible links/buttons | `Tab` (navigate within), `Esc` (close panel), Standard link/button navigation | Lazy load node details, Debounced fetch (500ms), Cache recent nodes |
| **CommunityLegend** | Graph color key | `CommunityLegendProps` (TBD) | `visible`, `hidden` | `role="region"`, `aria-label="Community color legend"`, List of communities with colors | `Tab` (focus legend), `Enter`/`Space` (toggle community visibility) | Static rendering (no updates during interaction), <50ms render |
| **Search** | Node/edge search input | `SearchProps` (TBD) | `idle`, `focused`, `searching`, `results`, `no-results`, `error` | `role="search"`, `aria-label`, `aria-autocomplete="list"`, `aria-activedescendant`, Live region for result count | `Tab` (focus), `↓` (first result), `↑`/`↓` (navigate), `Enter` (select), `Esc` (clear) | Debounce search (300ms), Fuzzy matching (Fuse.js), Virtual list for 100+ results, <100ms search time |

**Notes:**

1. **Props (TypeScript Interface)**: All components MUST have exhaustive TypeScript interfaces with JSDoc comments. See Section 4 for detailed interfaces.

2. **States**: Components MUST support all listed states. State transitions MUST be animated (respect `prefers-reduced-motion`).

3. **Accessibility Requirements**: All requirements are WCAG 2.2 Level AA minimums. Non-negotiable. Components failing accessibility audits MUST NOT ship.

4. **Keyboard Behavior**: All interactive components MUST be fully keyboard-accessible. Mouse-only interactions are governance violations.

5. **Performance Notes**: Bundle size measured gzipped. Lighthouse scores measured on Moto G4 (4x CPU slowdown). All targets MUST be met before production.

6. **Component Status**: Components marked "TBD" (To Be Defined) require full specification before implementation. DO NOT implement without formal contract definition.

**Usage:**

Before implementing a component, developers MUST:
1. Review this matrix to understand the contract
2. Read the detailed specification in Section 4 (if available)
3. Implement ALL states, accessibility features, and keyboard behaviors
4. Write automated tests for each state and interaction
5. Pass visual regression, accessibility, and performance audits
6. Update this matrix if contract gaps are discovered

---

## **5. Accessibility Testing Requirements**

### **5.0 Non-Negotiable Accessibility Defaults**

**CRITICAL**: The following accessibility standards are MANDATORY for ALL components. These are not aspirational guidelines—they are enforceable contracts. Components failing these requirements MUST NOT pass code review.

**Default 1: Focus Visible (Universal)**

All interactive elements MUST have a visible focus indicator meeting WCAG 2.2 SC 2.4.7 (Focus Visible) and SC 2.4.11 (Focus Appearance, Enhanced).

```css
/* Global focus style token (defined in src/styles/tokens.css) */
:root {
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  --focus-ring-color: var(--vsg-color-orange-500);
}

/* Default focus style (applied to all interactive elements) */
*:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-md); /* Matches component border radius */
}

/* Remove default browser outline (replaced with custom) */
*:focus {
  outline: none;
}
```

**Enforcement:**
- ✅ MUST be visible on ALL interactive elements (`<button>`, `<a>`, `<input>`, `<select>`, `[role="button"]`, `[tabindex="0"]`)
- ✅ MUST have 2px minimum width and 2px offset (WCAG 2.4.11 Focus Appearance, Level AA)
- ✅ MUST use `--vsg-color-orange-500` (4.5:1 contrast against white background)
- ❌ NEVER use `outline: none` without replacing with custom focus indicator
- ❌ NEVER hide focus without providing an accessible replacement (the universal `*:focus-visible` style above is the replacement)

**Default 2: Touch Targets (44px Minimum)**

All interactive elements MUST meet 44×44 CSS pixel minimum touch target size (WCAG 2.5.5, Level AAA; Apple HIG minimum).

```typescript
// Enforced in component contracts (Section 4.8)
const MIN_TOUCH_TARGET = 44; // pixels

// Example: Button component MUST enforce minimum
interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'min-h-[44px] min-w-[44px] px-4 py-2',  // Small still meets 44px minimum
  medium: 'min-h-[48px] min-w-[48px] px-6 py-3', // 48px recommended (Material Design)
  large: 'min-h-[56px] min-w-[56px] px-8 py-4',  // 56px for high-touch areas
};
```

**Enforcement:**
- ✅ MUST be 44×44px minimum for ALL interactive elements (buttons, links, inputs, checkboxes, icons)
- ✅ Icon-only buttons MUST have explicit padding to reach 44px (not just icon size)
- ✅ Small text links MUST have adequate padding/margin to reach target size
- ❌ NEVER ship interactive elements <44px in any dimension
- ❌ NEVER assume "mobile-only" or "desktop-only" exemptions (responsive design must meet minimums everywhere)

**Default 3: Reduced Motion (Respects User Preference)**

All animations MUST respect `prefers-reduced-motion` media query (WCAG 2.3.3, Level AAA; best practice).

```css
/* Animation tokens (defined in Section 3.8) */
:root {
  --transition-duration-fast: 150ms;
  --transition-duration-base: 200ms;
  --transition-duration-slow: 300ms;
  --transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Enforcement:**
- ✅ MUST apply `prefers-reduced-motion` globally (no per-component overrides)
- ✅ Animations MUST be non-essential (UI must be functional without them)
- ✅ Loading spinners/progress indicators are allowed (essential state communication)
- ❌ NEVER use animations for critical state changes (e.g., error visibility)
- ❌ NEVER ignore `prefers-reduced-motion` for "brand consistency"

**Default 4: ARIA Defaults (Semantic HTML First)**

All components MUST use semantic HTML by default. ARIA attributes are ONLY added when semantic HTML is insufficient.

**Decision Tree:**
```
1. Can I use semantic HTML? (<button>, <a>, <input>, <select>, <nav>, <main>, <article>)
   ✅ YES → Use semantic HTML, no ARIA needed
   ❌ NO  → Proceed to step 2

2. Is this a standard UI pattern with ARIA support? (dialog, tooltip, combobox, tabs)
   ✅ YES → Use ARIA pattern from APG (https://www.w3.org/WAI/ARIA/apg/)
   ❌ NO  → Reconsider if this is necessary (avoid custom patterns)

3. Does this component convey information visually that's missing for screen readers?
   ✅ YES → Add aria-label, aria-labelledby, or aria-describedby
   ❌ NO  → No ARIA needed
```

**Common ARIA Patterns (Mandatory):**

| Component | Semantic HTML | Required ARIA | Example |
|-----------|---------------|---------------|---------|
| **Button** | `<button>` | `aria-label` (icon-only), `aria-disabled` (disabled state) | `<button aria-label="Close">×</button>` |
| **Input** | `<input>` + `<label>` | `aria-invalid` (error), `aria-describedby` (error/help text) | `<input aria-invalid="true" aria-describedby="error-id">` |
| **Modal** | `<dialog>` (or `<div role="dialog">`) | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` | `<div role="dialog" aria-modal="true" aria-labelledby="title-id">` |
| **Tooltip** | N/A (ARIA-only) | `role="tooltip"`, `aria-describedby` on trigger | `<button aria-describedby="tooltip-id">Hover</button>` |
| **Tabs** | `<div>` | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` | See ARIA APG Tabs pattern |
| **Combobox** | `<input>` + `<select>` hybrid | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` | See ARIA APG Combobox pattern |

**Enforcement:**
- ✅ MUST use semantic HTML when available (prefer `<button>` over `<div role="button">`)
- ✅ MUST follow ARIA Authoring Practices Guide patterns (no custom variations)
- ✅ MUST test with screen readers (NVDA on Windows, VoiceOver on macOS/iOS)
- ❌ NEVER use `role="button"` on `<button>` (redundant, indicates lack of understanding)
- ❌ NEVER add ARIA to hide content from screen readers without explicit justification (`aria-hidden="true"` use cases: decorative icons, duplicated content)

**Default 5: Error Handling (Accessibility)**

All form errors MUST be communicated to screen readers via ARIA live regions and field associations.

```typescript
// Standard error pattern for Input component (Section 4.2)
<div>
  <label htmlFor="email" id="email-label">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-labelledby="email-label"
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <div
      id="email-error"
      role="alert"
      aria-live="assertive"
      className="text-error-500"
    >
      {error}
    </div>
  )}
</div>
```

**Enforcement:**
- ✅ MUST link errors to inputs via `aria-describedby`
- ✅ MUST set `aria-invalid="true"` on invalid inputs
- ✅ MUST announce errors via `role="alert"` or `aria-live="assertive"`
- ✅ MUST keep error text visible (not hidden, not tooltip-only)
- ❌ NEVER rely on color alone to indicate errors (must have text/icon)
- ❌ NEVER hide error messages after timeout (user must dismiss)

**Automated Enforcement Mechanisms**

All defaults are enforced via:

1. **Pre-commit Hook (ESLint + Stylelint)**
   ```javascript
   // .eslintrc.js
   module.exports = {
     extends: ['plugin:jsx-a11y/recommended'],
     rules: {
       'jsx-a11y/no-autofocus': 'error',
       'jsx-a11y/aria-role': 'error',
       'jsx-a11y/interactive-supports-focus': 'error',
       'jsx-a11y/no-noninteractive-tabindex': 'error',
     },
   };
   ```

2. **CI/CD Accessibility Audit**
   ```yaml
   # .github/workflows/accessibility.yml
   - name: Run axe-core tests
     run: npm run test:a11y
   - name: Lighthouse CI
     run: npx @lhci/cli autorun
   # Fail build if accessibility score <95%
   ```

3. **Visual Regression Tests (Storybook)**
   - Focus states for all interactive components
   - Keyboard navigation flows
   - Screen reader announcements (via Storybook a11y addon)

4. **Manual Testing (Monthly)**
   - Keyboard-only navigation (unplug mouse)
   - Screen reader testing (NVDA, VoiceOver, JAWS)
   - Touch target verification (use mobile device or Chrome DevTools mobile emulation)

**Non-Compliance Consequences**

- ❌ **PR Rejection**: Automated accessibility failures MUST be fixed before merge
- ❌ **Sprint Blocking**: Components with accessibility violations cannot be marked "Done"
- ❌ **Production Rollback**: Accessibility regressions in production trigger immediate rollback + postmortem

---

### **5.1 Automated Testing**

**Tools Required:**
- **axe-core**: Accessibility testing library
- **jest-axe**: Jest matcher for axe-core
- **@testing-library/react**: Component testing with accessibility queries
- **Lighthouse CI**: Automated Lighthouse audits in CI/CD

**Automated Test Suite:**
```typescript
// components/__tests__/Button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should have no accessibility violations (primary)', async () => {
    const { container } = render(<Button variant="primary">Click Me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible name when icon-only', async () => {
    const { getByRole } = render(
      <Button aria-label="Close dialog">
        <X size={20} />
      </Button>
    );
    const button = getByRole('button', { name: 'Close dialog' });
    expect(button).toBeInTheDocument();
  });

  it('should indicate loading state to screen readers', async () => {
    const { getByRole } = render(<Button loading>Processing</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should meet contrast ratio requirements', async () => {
    const { container } = render(<Button variant="primary">Submit</Button>);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });
});
```

**CI/CD Integration (GitHub Actions):**
```yaml
# .github/workflows/a11y.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:a11y
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/upload
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

**Lighthouse Config:**
```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "onlyCategories": ["accessibility", "best-practices"]
      }
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }]
      }
    }
  }
}
```

### **5.2 Manual Testing Checklist**

**Every Component MUST Pass:**
```
Keyboard Navigation:
├─ [ ] Tab order is logical
├─ [ ] All interactive elements focusable
├─ [ ] Focus visible (ring or outline)
├─ [ ] Escape closes modals/dropdowns
├─ [ ] Enter/Space activates buttons
├─ [ ] Arrow keys navigate within component (if applicable)
└─ [ ] No keyboard traps

Screen Reader Testing (NVDA/JAWS/VoiceOver):
├─ [ ] All images have alt text
├─ [ ] All buttons/links have accessible names
├─ [ ] Form inputs have labels
├─ [ ] Error messages announced
├─ [ ] Loading states announced
├─ [ ] Dynamic content changes announced (aria-live)
└─ [ ] Landmarks used correctly (nav, main, aside, footer)

Touch Targets:
├─ [ ] All interactive elements ≥44px height
├─ [ ] All interactive elements ≥44px width (or inline text)
├─ [ ] Adequate spacing between targets (8px min)
└─ [ ] No overlapping hit areas

Color & Contrast:
├─ [ ] Text contrast ≥4.5:1 (normal text)
├─ [ ] Text contrast ≥3:1 (large text 18px+)
├─ [ ] UI component contrast ≥3:1 (borders, icons)
├─ [ ] Color not sole indicator (use icons + color)
└─ [ ] High contrast mode supported

Motion & Animation:
├─ [ ] Respects prefers-reduced-motion
├─ [ ] No autoplaying videos
├─ [ ] Animations can be paused
└─ [ ] No flashing content (seizure risk)
```

### **5.3 WCAG 2.2 Level AA Compliance**

**Required Compliance Criteria (WCAG 2.2 upgrades from 2.1):**
| Criterion | Level | Requirement | VSG Status | WCAG 2.2 New |
|-----------|-------|-------------|------------|--------------|
| 1.1.1 Non-text Content | A | All images have alt text | ✅ Required | |
| 1.3.1 Info and Relationships | A | Semantic HTML (headings, lists, labels) | ✅ Required | |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 text, 3:1 UI | ✅ Required | |
| 2.1.1 Keyboard | A | All functionality via keyboard | ✅ Required | |
| 2.1.2 No Keyboard Trap | A | Focus can always escape | ✅ Required | |
| 2.4.3 Focus Order | A | Logical tab order | ✅ Required | |
| 2.4.7 Focus Visible | AA | Visible focus indicator | ✅ Required | |
| **2.4.11 Focus Appearance** | **AA** | **Focus indicator ≥ 2px perimeter/4px area** | ✅ Required | **✨ NEW in 2.2** |
| **2.5.7 Dragging Movements** | **AA** | **Single-pointer alternative for drag operations** | ✅ Required | **✨ NEW in 2.2** |
| **2.5.8 Target Size (Minimum)** | **AA** | **24×24px minimum touch target** | ✅ Required (VSG uses 44px) | **✨ NEW in 2.2** |
| **3.2.6 Consistent Help** | **A** | **Help links in consistent location** | ✅ Required | **✨ NEW in 2.2** |
| **3.3.7 Redundant Entry** | **A** | **No re-entering same info in session** | ✅ Required | **✨ NEW in 2.2** |
| **3.3.8 Accessible Authentication** | **AA** | **No cognitive tests for auth (allow paste/autofill)** | ✅ Required | **✨ NEW in 2.2** |
| 3.1.1 Language of Page | A | `<html lang="en">` | ✅ Required | |
| 3.2.1 On Focus | A | No context change on focus | ✅ Required | |
| 3.3.1 Error Identification | A | Errors clearly identified | ✅ Required | |
| 3.3.2 Labels or Instructions | A | All inputs have labels | ✅ Required | |
| 4.1.2 Name, Role, Value | A | ARIA for custom components | ✅ Required | |

**WCAG 2.2 Key Changes Applied to VSG:**
1. **SC 2.4.11 Focus Appearance (AA)**: VSG uses 2px ring + 2px offset (exceeds minimum)
2. **SC 2.5.7 Dragging (AA)**: Graph pan/zoom supports single-click alternatives (zoom controls, arrow keys for pan)
3. **SC 2.5.8 Target Size (AA)**: VSG uses 44px minimum (Apple HIG), exceeds WCAG 2.2's 24px minimum
4. **SC 3.2.6 Consistent Help (A)**: Help/support link in consistent header location
5. **SC 3.3.7 Redundant Entry (A)**: Form autofill, no re-entering graph metadata in same session
6. **SC 3.3.8 Accessible Auth (AA)**: Password managers allowed, no CAPTCHA cognitive tests

**Failure Modes (Auto-Reject PR):**
- ❌ Lighthouse accessibility score <95%
- ❌ axe-core violations in tests
- ❌ Missing `aria-label` on icon-only buttons
- ❌ Contrast ratio <4.5:1 for text
- ❌ Interactive elements <44px touch target

### **5.4 API Error to UI Mapping (ErrorEnvelope Contract)**

**Purpose**: Define standard patterns for consuming API errors (per [openapi.yaml](api-specs/openapi.yaml) ErrorEnvelope schema) and displaying them in the UI.

**ErrorEnvelope Schema (Source of Truth: openapi.yaml:3143)**

All API errors MUST conform to this structure:

```typescript
// Canonical TypeScript definition (auto-generated from OpenAPI schema)
interface ErrorEnvelope {
  error: {
    id: string;              // Format: 'err_[A-Za-z0-9]{26}' - Unique error ID for support
    level: ErrorSeverity;    // OpenAPI enum (TRANSIENT/RECOVERABLE/PARTIAL/CRITICAL/INTEGRITY)
    code: string;            // Machine-readable error code (e.g., 'QUOTA_EXCEEDED')
    message: string;         // Human-readable error message (max 500 chars)
    details?: object | null; // Additional context (e.g., { tier: 'free', limit: 5, used: 5 })
    retryable: boolean;      // Whether client should retry the request
    suggestedAction?: string | null; // User-facing next step (max 500 chars)
  };
}

type ErrorSeverity = 'TRANSIENT' | 'RECOVERABLE' | 'PARTIAL' | 'CRITICAL' | 'INTEGRITY';
```

**Standard Error Codes (from openapi.yaml)**

| Error Code | HTTP Status | Level | Retryable | UI Component | Display Pattern |
|------------|-------------|-------|-----------|--------------|-----------------|
| `RATE_LIMITED` | 429 | `TRANSIENT` | ✅ Yes (after delay) | Toast | "Too many requests. Please wait {retryAfter}s before trying again." |
| `QUOTA_EXCEEDED` | 429 | `RECOVERABLE` | ❌ No | Banner + Modal | "Daily quota exceeded ({used}/{limit}). {suggestedAction}" - Persistent until quota resets |
| `TIER_FEATURE_RESTRICTED` | 403 | `RECOVERABLE` | ❌ No | Inline message | "This feature requires {requiredTier} tier. [Upgrade]" - Show upgrade CTA |
| `AUTHENTICATION_FAILED` | 401 | `CRITICAL` | ❌ No | Full-page error | Redirect to login, show "Please sign in again" |
| `INVALID_TOKEN` | 400 | `INTEGRITY` | ❌ No | Full-page error | Auth flow only: show "Magic link expired" and CTA to request a new link |
| `GRAPH_TOO_LARGE` | 413 | `RECOVERABLE` | ❌ No | Inline error | "File exceeds {maxSize} limit. Current: {actualSize}. Try filtering." |
| `RESOURCE_NOT_FOUND` | 404 | `CRITICAL` | ❌ No | Inline message | "Graph not found. It may have been deleted." - Show link to graphs list |
| `INVALID_SCHEMA` | 400 | `RECOVERABLE` | ❌ No | Form field error | Extract relevant details (e.g., `details.field`, `details.issue`) and map to input `error` prop |
| `INTERNAL_ERROR` | 500 | `CRITICAL` | ❌ No | Toast + Fallback | "Something went wrong. Error ID: {id}" - Show "Report Issue" button |
| `NETWORK_ERROR` | N/A (client) | `TRANSIENT` | ✅ Yes (immediate) | Toast | "Network connection lost. Retrying..." - Auto-dismiss on reconnect |

**Standard UI Components for Errors**

**1. ErrorBanner (Persistent, High Priority)**
```typescript
// Use for: QUOTA_EXCEEDED, TIER_FEATURE_RESTRICTED, critical warnings
interface ErrorBannerProps {
  error: ErrorEnvelope['error'];
  onDismiss?: () => void;
  dismissible?: boolean; // Default: false for errors, true for warnings
}

// Example Usage:
<ErrorBanner
  error={{
    id: 'err_01JBCD...',
    level: 'RECOVERABLE',
    code: 'QUOTA_EXCEEDED',
    message: 'Daily graph creation quota exceeded for Free tier (5/day).',
    details: { tier: 'free', limit: 5, used: 5, resetAt: '2025-12-30T00:00:00Z' },
    retryable: false,
    suggestedAction: 'Upgrade to Pro tier for 100 graphs/day or wait until quota resets at midnight UTC.',
  }}
  dismissible={false}
/>
```

**2. ErrorToast (Transient, Medium Priority)**
```typescript
// Use for: RATE_LIMITED, NETWORK_ERROR, other transient failures
interface ErrorToastProps {
  error: ErrorEnvelope['error'];
  duration?: number; // Auto-dismiss after N milliseconds (default: 5000)
  action?: { label: string; onClick: () => void }; // Optional action button
}

// Example Usage:
<ErrorToast
  error={{
    id: 'err_01JBEF...',
    level: 'TRANSIENT',
    code: 'RATE_LIMITED',
    message: 'Too many requests. Please wait before trying again.',
    details: { retryAfter: 60 },
    retryable: true,
    suggestedAction: null,
  }}
  duration={10000}
  action={{ label: 'Retry', onClick: retryRequest }}
/>
```

**3. InlineError (Field-Level, Form Context)**
```typescript
// Use for: INVALID_SCHEMA, field-specific errors in forms
interface InlineErrorProps {
  message: string;
  errorId?: string; // For linking to support (optional)
}

// Example Usage (in Input component):
<Input
  label="Graph Name"
  value={name}
  onChange={setName}
  error="Graph name must be 3-50 characters."
  aria-describedby="graph-name-error"
/>
<InlineError
  message="Graph name must be 3-50 characters."
  errorId="err_01JBGH..."
/>
```

**4. ErrorModal (Blocking, Critical Errors)**
```typescript
// Use for: AUTHENTICATION_FAILED (session expired), critical state that blocks all actions
interface ErrorModalProps {
  error: ErrorEnvelope['error'];
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

// Example Usage:
<ErrorModal
  error={{
    id: 'err_01JBIJ...',
    level: 'CRITICAL',
    code: 'AUTHENTICATION_FAILED',
    message: 'Your session has expired. Please sign in again.',
    details: null,
    retryable: false,
    suggestedAction: 'Click below to return to the login page.',
  }}
  primaryAction={{ label: 'Log In', onClick: () => router.push('/login') }}
  secondaryAction={{ label: 'Continue Offline', onClick: () => switchToOfflineMode() }}
/>
```

**Error Handling Implementation Pattern**

```typescript
// Standard error handling in API client
async function createGraph(data: GraphInput): Promise<Graph> {
  try {
    const response = await fetch('/api/v1/graphs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorEnvelope: ErrorEnvelope = await response.json();

      // Map error code to UI component
      switch (errorEnvelope.error.code) {
        case 'QUOTA_EXCEEDED':
          // Show persistent banner (blocks graph creation)
          showErrorBanner(errorEnvelope.error);
          break;

        case 'RATE_LIMITED':
          // Show transient toast with retry
          showErrorToast(errorEnvelope.error, {
            action: { label: 'Retry', onClick: () => createGraph(data) },
          });
          break;

        case 'INVALID_SCHEMA':
          // Map schema error details to form inputs (field/issue)
          const field = (errorEnvelope.error.details as any)?.field;
          const issue = (errorEnvelope.error.details as any)?.issue;
          if (field && issue) setFormErrors({ [field]: issue });
          break;

        case 'TIER_FEATURE_RESTRICTED':
          // Show upgrade prompt
          showUpgradeModal(errorEnvelope.error);
          break;

        default:
          // Generic error toast
          showErrorToast(errorEnvelope.error);
      }

      throw new Error(errorEnvelope.error.message);
    }

    return await response.json();
  } catch (networkError) {
    // Client-side network error (no response from server)
    showErrorToast({
      id: `err_client_${Date.now()}`,
      level: 'TRANSIENT',
      code: 'NETWORK_ERROR',
      message: 'Network connection lost. Please check your internet connection.',
      retryable: true,
      suggestedAction: 'Retry when connection is restored.',
    });
    throw networkError;
  }
}
```

**Retry Logic (for `retryable: true` errors)**

```typescript
// Exponential backoff for retryable errors
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      const errorEnvelope = error as ErrorEnvelope;

      if (!errorEnvelope.error?.retryable || attempt === maxRetries - 1) {
        throw error; // Not retryable or max retries reached
      }

      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

**Support/Debug Affordances**

When displaying errors with `error.id` (all server errors):

1. **Always show error ID** in a copyable format: `Error ID: err_01JBCD... [Copy]`
2. **Add "Report Issue" button** for `level: 'CRITICAL'` errors that pre-fills support form with:
   - Error ID
   - Error code
   - Timestamp
   - User context (tier, browser, etc.)
3. **Log to console** (development only):
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.error('[API Error]', {
       id: error.id,
       code: error.code,
       message: error.message,
       details: error.details,
     });
   }
   ```

**Accessibility Requirements for Error Components**

1. **ErrorBanner**: `role="alert"`, `aria-live="assertive"` (announces immediately)
2. **ErrorToast**: `role="status"` (info) or `role="alert"` (error), `aria-live="polite"`
3. **InlineError**: Linked to input via `aria-describedby`, `aria-invalid="true"` on input
4. **ErrorModal**: `role="alertdialog"`, focus trap, `aria-labelledby`, `aria-describedby`

**Testing Requirements**

All error states MUST have:
1. **Storybook stories** for each error code (visual regression)
2. **Unit tests** for error mapping logic
3. **Integration tests** for retry logic
4. **Accessibility tests** (axe-core) for all error components

---

## **6. Visual Regression Testing**

### **6.1 Tool Selection**

**Recommended: Chromatic (Storybook Integration)**
- ✅ Automatic screenshot comparison
- ✅ CI/CD integration
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Responsive viewports
- ✅ Delay/threshold configuration

**Alternative: Percy (Standalone)**
- ✅ Works without Storybook
- ✅ Snapshot DOM, not just screenshots
- ✅ Responsive testing

**Setup (Chromatic):**
```bash
npm install --save-dev chromatic
```

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<PROJECT_TOKEN>"
  }
}
```

```yaml
# .github/workflows/chromatic.yml
name: Chromatic

on: push

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run chromatic
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

### **6.2 Component Stories (Storybook)**

**Every component MUST have Storybook stories covering:**
- All variants (primary, secondary, tertiary)
- All sizes (small, medium, large)
- All states (default, hover, active, focus, disabled, loading, error)
- Responsive viewports (mobile 375px, tablet 768px, desktop 1440px)

**Example: Button Stories**
```typescript
// components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Upload } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    chromatic: {
      viewports: [375, 768, 1440], // Mobile, tablet, desktop
      delay: 300, // Wait for transitions
      diffThreshold: 0.2 // 20% diff threshold
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary']
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default state
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Upload Graph'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Skip for now'
  }
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Upload size={16} />,
    children: 'Upload'
  }
};

// States
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Processing...'
  }
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Submit'
  }
};

// Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </div>
  )
};

// Full width
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Continue'
  }
};
```

### **6.3 Visual Testing Strategy**

**Approval Workflow:**
```
Developer makes change
  ↓
Chromatic detects diff
  ↓
Review screenshot comparison
  ↓
├─ Accept (intentional change) → Update baseline
└─ Reject (regression) → Fix code
```

**Baseline Management:**
```bash
# Establish baseline (first run)
npm run chromatic -- --auto-accept-changes

# Future runs (detect changes)
npm run chromatic

# Accept all changes (after review)
npm run chromatic -- --auto-accept-changes
```

**Diff Threshold Configuration:**
```typescript
// .storybook/preview.ts
export const parameters = {
  chromatic: {
    // Global defaults
    diffThreshold: 0.2,        // 20% pixel diff threshold
    delay: 300,                // Wait 300ms for animations
    pauseAnimationAtEnd: true, // Pause animations at final frame
    viewports: [375, 768, 1440] // Test responsive layouts
  }
};
```

---

## **7. Performance Budgets**

### **7.1 Lighthouse Score Targets**

**Minimum Scores (CI/CD gate):**
| Category | Minimum Score | Ideal Score |
|----------|---------------|-------------|
| Performance | 90 | 95+ |
| Accessibility | 95 | 100 |
| Best Practices | 90 | 95+ |
| SEO | 90 | 95+ |

**Performance Metrics:**
| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint (FCP) | <1.8s | <2.5s |
| Largest Contentful Paint (LCP) | <2.5s | <4.0s |
| Total Blocking Time (TBT) | <200ms | <600ms |
| Cumulative Layout Shift (CLS) | <0.1 | <0.25 |
| Speed Index | <3.4s | <5.8s |

### **7.2 Bundle Size Budgets**

**JavaScript Bundle Limits:**
```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/js/main.*.js",
      "maxSize": "150 KB",
      "compression": "gzip"
    },
    {
      "path": "./dist/js/vendor.*.js",
      "maxSize": "300 KB",
      "compression": "gzip"
    },
    {
      "path": "./dist/css/main.*.css",
      "maxSize": "30 KB",
      "compression": "gzip"
    }
  ]
}
```

**Bundle Analysis:**
```bash
# Vite bundle analyzer
npm run build -- --mode analyze

# webpack-bundle-analyzer (if using Webpack)
npm install --save-dev webpack-bundle-analyzer
```

**Code Splitting Strategy:**
```typescript
// Lazy load routes
const UploadPage = lazy(() => import('./pages/Upload'));
const VisualizationPage = lazy(() => import('./pages/Visualization'));

// Lazy load heavy components
const NetworkGraph = lazy(() => import('./components/NetworkGraph'));

// Usage with Suspense
<Suspense fallback={<ProgressIndicator variant="circular" />}>
  <NetworkGraph data={graphData} />
</Suspense>
```

### **7.3 Image Optimization**

**Requirements:**
- ✅ All images served in modern formats (WebP, AVIF with JPEG/PNG fallback)
- ✅ Responsive images with `srcset` and `sizes`
- ✅ Lazy loading for below-the-fold images
- ✅ Proper dimensions specified (prevent CLS)

**Implementation:**
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean; // Above-the-fold images
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false
}) => {
  return (
    <picture>
      <source
        srcSet={`${src}.avif`}
        type="image/avif"
      />
      <source
        srcSet={`${src}.webp`}
        type="image/webp"
      />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
};
```

---

## **8. Implementation Checklist**

### **8.1 Component Creation Checklist**

**Before Starting:**
- [ ] Read UX Specification for interaction requirements
- [ ] Check if similar component already exists (reuse over rebuild)
- [ ] Review design tokens for colors, spacing, typography

**During Development:**
- [ ] Create TypeScript interface with JSDoc comments
- [ ] Implement component with accessibility by default
- [ ] Use design tokens (no hardcoded colors, spacing, etc.)
- [ ] Add all visual states (hover, active, focus, disabled, loading, error)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Verify 44px minimum touch targets
- [ ] Check contrast ratios (4.5:1 minimum)

**Before PR:**
- [ ] Write Storybook stories (all variants, sizes, states)
- [ ] Write accessibility tests (jest-axe)
- [ ] Run `npm run test:a11y` (all pass)
- [ ] Run `npm run chromatic` (visual regression baseline)
- [ ] Run Lighthouse audit (95+ accessibility score)
- [ ] Update this documentation (Section 4: Component Specifications)
- [ ] Add to component index/exports

**PR Review Requirements:**
- [ ] Design review approved (visual accuracy)
- [ ] Accessibility review approved (WCAG compliance)
- [ ] Code review approved (TypeScript, patterns, performance)
- [ ] Chromatic approved (no unintended visual changes)
- [ ] CI/CD passed (tests, a11y, Lighthouse, bundle size)

### **8.2 Sprint Implementation Plan**

**Sprint 1: Foundation (Week 1-2)**
```
Goal: Design system infrastructure + core components
├─ [ ] Set up design tokens (colors, spacing, typography)
├─ [ ] Configure Tailwind with VSG theme
├─ [ ] Set up Storybook
├─ [ ] Configure Chromatic
├─ [ ] Set up accessibility testing (jest-axe, Lighthouse CI)
├─ [ ] Implement Button component
├─ [ ] Implement Input component
├─ [ ] Implement Card component
└─ [ ] Write documentation for implemented components

Definition of Done:
- All components have Storybook stories
- All components pass axe-core tests
- Chromatic baseline established
- CI/CD pipeline green
```

**Sprint 2: Interactive Components (Week 3-4)**
```
Goal: Forms, selections, feedback components
├─ [ ] Implement Select component (compound pattern)
├─ [ ] Implement UploadZone component
├─ [ ] Implement ProgressIndicator component
├─ [ ] Implement Modal component
├─ [ ] Implement Toast/Banner component (error, success, warning)
├─ [ ] Implement Tooltip component
└─ [ ] Integration testing (component combinations)

Definition of Done:
- All components keyboard accessible
- All components screen reader tested
- Visual regression tests passing
- Performance budgets met
```

**Sprint 3: Specialized Components (Week 5-6)**
```
Goal: Domain-specific VSG components
├─ [ ] Implement NetworkGraphViewer component
├─ [ ] Implement InsightCard component
├─ [ ] Implement StatDisplay component
├─ [ ] Implement PlatformSelector component
├─ [ ] Implement FilterPanel component
├─ [ ] Responsive testing (mobile, tablet, desktop)
└─ [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)

Definition of Done:
- All components work on mobile (320px width)
- All components work on all browsers
- Lighthouse scores >95 across the board
- Bundle size within budget
```

### **8.3 Mode-Aware UI Behavior**

**Purpose**: Define how UI components behave differently in **Offline/Local-only mode** vs **Standard mode** (per VSG_ARCHITECTURE_DOCUMENT.md and VSG_DESIGN_PRINCIPLE.md).

**Context**: Visual Social Graph supports two operational modes with distinct privacy and functionality characteristics. The UI MUST adapt to reflect these modes clearly and prevent user confusion.

---

#### **8.3.1 Mode Definitions**

**Offline/Local-only Mode (Privacy-First)**

**Characteristics:**
- ✅ No server communication (all processing client-side)
- ✅ No authentication required (no login, no account)
- ✅ No data persistence beyond current session (unless user explicitly exports)
- ✅ Limited export formats (CSV, JSON; no server-side rendering or advanced formats)
- ✅ No tier restrictions (full algorithmic functionality available)
- ✅ Maximum privacy (no telemetry, no analytics, no tracking)

**When Active:**
- User selects "Continue without account" on landing page
- User explicitly switches from Standard mode via settings
- Session expires or auth fails, user chooses to continue offline

**Standard Mode (Account + Sync)**

**Characteristics:**
- ✅ Server communication enabled (graph persistence, cloud storage)
- ✅ Authentication required (login with account)
- ✅ Data persistence (graphs saved to account, sync across devices)
- ✅ Full export formats (PDF reports, interactive HTML, advanced visualizations)
- ✅ Tier-based features (Free, Pro, Enterprise tiers with quotas)
- ✅ Minimal telemetry (error reporting, usage analytics per privacy policy)

**When Active:**
- User logs in or creates account
- User explicitly switches from Offline mode via "Log In" button
- Default mode for authenticated sessions

---

#### **8.3.2 UI Indicators for Current Mode**

**Mode Badge (Persistent, Top-Right Corner)**

```typescript
// Always visible in app header
<div className="flex items-center gap-2">
  {mode === 'offline' ? (
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
      <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-700">Offline Mode</span>
      <Tooltip content="Your data never leaves your device. No account required.">
        <InfoIcon className="w-4 h-4 text-blue-500 cursor-help" />
      </Tooltip>
    </div>
  ) : (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
      <CloudIcon className="w-4 h-4 text-green-600" />
      <span className="text-sm font-medium text-green-700">Standard Mode</span>
      <span className="text-xs text-green-600">({user.tier})</span>
    </div>
  )}
</div>
```

**Enforcement:**
- ✅ MUST be visible on every page/view
- ✅ MUST use distinct colors (blue for offline, green for standard)
- ✅ MUST include tooltip explaining mode implications
- ✅ MUST show tier badge in Standard mode (Free/Pro/Enterprise)
- ❌ NEVER allow ambiguity about current mode

**Mode Switcher (Settings or Landing Page)**

```typescript
// User can switch modes via Settings panel
<div className="space-y-4">
  <h3>Data & Privacy Mode</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Offline Mode Card */}
    <Card
      variant={mode === 'offline' ? 'elevated' : 'outlined'}
      onClick={() => switchToOfflineMode()}
      hoverable
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
          <h4 className="font-semibold">Offline Mode</h4>
        </div>
        <ul className="text-sm text-vsg-neutral-600 space-y-1">
          <li>✅ Maximum privacy (no server communication)</li>
          <li>✅ No account required</li>
          <li>✅ Full algorithmic features</li>
          <li>⚠️ Limited exports (CSV, JSON only)</li>
          <li>⚠️ No cloud sync or persistence</li>
        </ul>
      </div>
    </Card>

    {/* Standard Mode Card */}
    <Card
      variant={mode === 'standard' ? 'elevated' : 'outlined'}
      onClick={() => switchToStandardMode()}
      hoverable
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CloudIcon className="w-6 h-6 text-green-600" />
          <h4 className="font-semibold">Standard Mode</h4>
        </div>
        <ul className="text-sm text-vsg-neutral-600 space-y-1">
          <li>✅ Cloud sync across devices</li>
          <li>✅ Advanced exports (PDF, HTML reports)</li>
          <li>✅ Save graphs to account</li>
          <li>⚠️ Account required (login)</li>
          <li>⚠️ Tier quotas apply (Free/Pro/Enterprise)</li>
        </ul>
      </div>
    </Card>
  </div>
</div>
```

---

#### **8.3.3 Component Behavior Differences by Mode**

| Component | Offline/Local-only Mode Behavior | Standard Mode Behavior |
|-----------|----------------------------------|------------------------|
| **Header/Navigation** | "Continue without account" → No login button, Mode badge shows "Offline Mode" | Login/Account button visible, Mode badge shows "Standard Mode ({tier})" |
| **Graph Upload** | Upload works, file processed client-side, no server validation | Upload works, file validated server-side, saved to account cloud storage |
| **Graph List** | Only shows current session graph (ephemeral), "Save to account" disabled | Shows all user's saved graphs (paginated), "Save" button saves to cloud |
| **Export Menu** | Limited formats: CSV (nodes/edges), JSON (raw data), PNG (screenshot) | Full formats: CSV, JSON, PNG, **PDF report**, **interactive HTML**, **embeddable widget** |
| **Insights Panel** | Full algorithmic insights (community detection, centrality, influence) - No restrictions | Full algorithmic insights + **algorithm-generated narratives** (computed from graph metrics), tier quotas apply |
| **Settings Panel** | Privacy settings only (no account settings), Mode switcher visible | Full settings (account, privacy, billing, notifications), Mode switcher visible |
| **Error Handling** | No server errors (except initial upload if needed), No quota errors | Server errors displayed (per Section 5.4), Quota exceeded errors trigger upgrade prompt |
| **Save/Persistence** | "Download" button (exports file), No "Save to account" option | "Save to account" button (cloud persistence), Download also available |
| **Share Feature** | Disabled (no server to host shared graphs) with tooltip: "Share requires an account (Standard mode)" | Enabled: Generate shareable link, embed code, public/private toggle |
| **Billing/Tier UI** | Hidden completely (not applicable in offline mode) | Visible: Current tier badge, usage quotas, upgrade prompts (for Free tier) |
| **Privacy Indicators** | "🔒 Your data never leaves your device" banner on upload page | "🔒 Data encrypted in transit and at rest. See Privacy Policy." link in footer |
| **Telemetry/Analytics** | No telemetry, no error reporting (except console logs), No cookies (except session state) | Minimal telemetry (error reporting, usage analytics), Cookies for auth (httpOnly, Secure) |

---

#### **8.3.4 Disabled Features in Offline Mode**

**Features Unavailable (with Clear Messaging)**

The following features MUST be visually disabled (grayed out, not clickable) with tooltips explaining why:

1. **"Save to Account" Button**
   - **Visual**: Button disabled, grayed out
   - **Tooltip**: "Saving to account requires Standard mode. Switch modes in Settings or log in."
   - **Alternative**: "Download" button remains enabled (exports file to user's device)

2. **"Share Graph" Feature**
   - **Visual**: Share icon disabled in toolbar
   - **Tooltip**: "Sharing requires an account to host the graph. Switch to Standard mode to enable sharing."
   - **Alternative**: "Export as HTML" available (user can self-host)

3. **"Collaborate" Feature** (if implemented)
   - **Visual**: Collaborate button hidden (not just disabled)
   - **Alternative**: N/A (collaboration requires server)

4. **Advanced Export Formats** (PDF, Interactive HTML with embed)
   - **Visual**: Export menu shows limited options (CSV, JSON, PNG)
   - **Tooltip on disabled items**: "PDF and advanced exports require Standard mode. Upgrade to enable."
   - **Alternative**: Basic exports still available

**Implementation Pattern:**

```typescript
// Standard pattern for mode-aware feature gating
function SaveButton({ graph, mode }: { graph: Graph; mode: 'offline' | 'standard' }) {
  const canSaveToAccount = mode === 'standard';

  return (
    <div className="flex gap-2">
      {/* Always available: Download to device */}
      <Button
        variant="secondary"
        onClick={() => downloadGraph(graph)}
        leftIcon={<DownloadIcon />}
      >
        Download
      </Button>

      {/* Conditional: Save to account (Standard mode only) */}
      {mode === 'standard' ? (
        <Button
          variant="primary"
          onClick={() => saveGraphToAccount(graph)}
          leftIcon={<CloudIcon />}
        >
          Save to Account
        </Button>
      ) : (
        <Tooltip content="Saving to account requires Standard mode. Log in to enable.">
          <Button
            variant="primary"
            disabled
            leftIcon={<CloudIcon />}
            aria-disabled="true"
            aria-label="Save to Account (requires login)"
          >
            Save to Account
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
```

---

#### **8.3.5 Mode Transition Flows**

**Offline → Standard (User Logs In)**

```
1. User clicks "Log In" or "Save to Account" in Offline mode
2. Show auth modal (login or create account)
3. On successful auth:
   a. Mode badge updates to "Standard Mode"
   b. Toast: "Switched to Standard mode. Your current graph is still in memory. Click 'Save to Account' to persist it."
   c. Enable previously disabled features (Share, Advanced Exports, Save to Account)
   d. Preserve current graph in memory (don't lose work)
   e. Prompt: "Save current graph to account?" [Yes] [No, create new]
4. User can now save current session graph or start new
```

**Standard → Offline (User Logs Out or Switches)**

```
1. User clicks "Log Out" or switches to Offline mode in Settings
2. Show confirmation modal:
   "Switch to Offline mode? Your saved graphs will remain in your account, but you won't be able to access them until you log back in. Current session data will be lost unless you download it."
   [Download Current Graph] [Switch to Offline] [Cancel]
3. On confirm:
   a. Clear auth tokens, session data
   b. Mode badge updates to "Offline Mode"
   c. Disable features (Share, Save to Account, Advanced Exports)
   d. Clear graph list (show only new empty state)
   e. Toast: "Switched to Offline mode. Upload a new graph to get started."
4. User starts fresh in Offline mode
```

**Handling Mode Ambiguity (Error Recovery)**

If mode state is unclear (e.g., token expired but UI thinks user is logged in):

```typescript
// Automatic mode detection and recovery
async function detectMode(): Promise<'offline' | 'standard'> {
  const token = getAuthToken();

  if (!token) {
    return 'offline'; // No token = offline mode
  }

  try {
    // Verify token is valid
    const response = await fetch('/api/v1/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      return 'standard'; // Valid token = standard mode
    } else {
      // Invalid token, clear auth and switch to offline
      clearAuthToken();
      showToast({
        level: 'warning', // UI-only toast severity (not ErrorEnvelope.level)
        message: 'Your session expired. Switched to Offline mode.',
      });
      return 'offline';
    }
  } catch (error) {
    // Network error, assume offline mode (graceful degradation)
    showToast({
      level: 'info', // UI-only toast severity (not ErrorEnvelope.level)
      message: 'Network unavailable. Working in Offline mode.',
    });
    return 'offline';
  }
}
```

---

#### **8.3.6 Privacy Banners by Mode**

**Offline Mode Privacy Banner (Upload Page)**

```typescript
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <div className="flex items-start gap-3">
    <ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-blue-900 mb-1">Maximum Privacy Mode Active</h4>
      <p className="text-sm text-blue-700">
        Your data never leaves your device. All graph processing happens in your browser.
        No account, no tracking, no cloud storage. Your file is not uploaded to any server.
      </p>
    </div>
  </div>
</div>
```

**Standard Mode Privacy Notice (Upload Page)**

```typescript
<div className="bg-vsg-neutral-50 border border-vsg-neutral-200 rounded-lg p-4 mb-6">
  <div className="flex items-start gap-3">
    <LockIcon className="w-6 h-6 text-vsg-neutral-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-vsg-neutral-900 mb-1">Your Data is Encrypted</h4>
      <p className="text-sm text-vsg-neutral-700">
        Files are encrypted in transit (TLS 1.3) and at rest. We never see your followers' display names.
        Data is pseudonymized and deleted per your account settings.{' '}
        <a href="/privacy" className="text-primary underline">Privacy Policy</a>
      </p>
    </div>
  </div>
</div>
```

---

#### **8.3.7 Testing Mode Transitions**

**Required Test Cases:**

1. **Offline → Standard → Offline** (round-trip without data loss)
2. **Mode detection on session expire** (auto-switch to Offline)
3. **Disabled features in Offline mode** (all buttons grayed out, tooltips visible)
4. **Privacy banners display correctly** (different messages by mode)
5. **Export menu filtering** (limited formats in Offline, full in Standard)
6. **Mode badge visibility** (persistent on every page)
7. **Graph persistence** (Offline: ephemeral, Standard: saved to account)
8. **Error handling by mode** (no server errors in Offline, quota errors in Standard)

**Automated Tests:**

```typescript
describe('Mode-Aware UI Behavior', () => {
  it('should disable "Save to Account" in Offline mode', () => {
    render(<SaveButton mode="offline" graph={mockGraph} />);
    const saveButton = screen.getByRole('button', { name: /Save to Account/i });
    expect(saveButton).toBeDisabled();
  });

  it('should enable "Save to Account" in Standard mode', () => {
    render(<SaveButton mode="standard" graph={mockGraph} />);
    const saveButton = screen.getByRole('button', { name: /Save to Account/i });
    expect(saveButton).not.toBeDisabled();
  });

  it('should show Offline mode badge when not authenticated', () => {
    render(<Header mode="offline" />);
    expect(screen.getByText('Offline Mode')).toBeInTheDocument();
  });

  it('should show Standard mode badge when authenticated', () => {
    render(<Header mode="standard" user={{ tier: 'free' }} />);
    expect(screen.getByText('Standard Mode')).toBeInTheDocument();
    expect(screen.getByText('(free)')).toBeInTheDocument();
  });
});
```

---

## **9. Appendices**

### **Appendix A: Glossary**

**Component API**: The TypeScript interface defining props, types, and behavior of a React component.

**Compound Component**: A React pattern where a parent component shares state with child components via Context API, enabling flexible composition.

**Design Token**: A named constant representing a design decision (color, spacing, typography) used consistently across the system.

**Elevation**: Visual hierarchy created through shadows, giving the appearance of layered surfaces.

**Fluid Typography**: Text sizing that scales smoothly between min/max values using CSS `clamp()`.

**WCAG (Web Content Accessibility Guidelines)**: International standard for web accessibility. VSG targets Level AA compliance.

**Focus Trap**: Accessibility pattern where keyboard focus remains within a modal/dialog until closed.

**Semantic HTML**: Using HTML elements for their intended purpose (`<button>` for buttons, `<nav>` for navigation) rather than generic `<div>`/`<span>`.

**Touch Target**: The interactive area of an element. Minimum 44x44px for accessibility.

**Visual Regression**: Automated comparison of UI screenshots to detect unintended visual changes.

**Contrast Ratio**: Measurement of luminance difference between text and background. 4.5:1 minimum for WCAG AA.

**Accessible Name**: The text announced by screen readers for an element (from label, aria-label, or content).

**ARIA (Accessible Rich Internet Applications)**: HTML attributes (`aria-*`) that provide semantic meaning for assistive technologies.

**Screen Reader**: Assistive technology that reads web content aloud (NVDA, JAWS, VoiceOver).

**Chromatic**: Visual regression testing tool integrated with Storybook.

**Lighthouse**: Google's automated tool for measuring performance, accessibility, SEO, and best practices.

### **Appendix B: Component API Quick Reference**

| Component | Required Props | Optional Props | Accessibility Notes |
|-----------|----------------|----------------|---------------------|
| Button | `children` | `variant`, `size`, `disabled`, `loading`, `onClick`, `aria-label` | `aria-label` required if icon-only |
| Input | `label` | `error`, `helperText`, `leftIcon`, `rightIcon`, `type` | Label always required (can be `sr-only`) |
| Card | `children` | `variant`, `padding`, `hoverable`, `onClick`, `aria-label` | `aria-label` required if clickable without text |
| UploadZone | `onFileSelect` | `accept`, `loading`, `progress`, `error`, `success` | Keyboard accessible via hidden input |
| ProgressIndicator | - | `value`, `variant`, `size`, `label` | `role="progressbar"` for determinate |
| Select | `value`, `onChange`, `children` | `placeholder` | Keyboard: Arrow keys, Enter, Escape |
| Modal | `open`, `onClose`, `title`, `children` | `size`, `showClose`, `closeOnBackdropClick` | Focus trap, Escape to close |

### **Appendix C: Design Token Reference**

**Color Tokens:**
```typescript
// Source of truth: src/styles/tokens.css
// Primary: var(--vsg-color-primary)
// Text: var(--vsg-color-gray-700)
// Background: var(--vsg-color-white)
// Border: var(--vsg-color-gray-200)
```

**Spacing Tokens (4px grid):**
```typescript
// spacing[1] = 4px
// spacing[2] = 8px
// spacing[4] = 16px
// spacing[6] = 24px
// spacing[8] = 32px
```

**Typography Tokens:**
```typescript
// fontSize.h1 = clamp(2.25rem, 2vw + 1.5rem, 3rem)
// fontSize.body = 1rem (16px)
// fontWeight.regular = 400
// fontWeight.semibold = 600
// fontWeight.bold = 700
```

**Shadow Tokens:**
```typescript
// elevation.card = shadows.sm
// elevation.popover = shadows.lg
// elevation.modal = shadows.xl
```

### **Appendix D: Browser Support Matrix**

**Supported Browsers:**
| Browser | Minimum Version | Market Share | Notes |
|---------|----------------|--------------|-------|
| Chrome | 90+ | ~65% | Primary development target |
| Safari | 14+ | ~20% | Test on macOS + iOS |
| Firefox | 88+ | ~5% | Test responsive + accessibility |
| Edge | 90+ | ~5% | Chromium-based, similar to Chrome |

**Polyfills Required:**
- None (targeting modern browsers only)
- ES2020+ features natively supported

**Testing Strategy:**
- **Primary**: Chrome (automated CI/CD)
- **Secondary**: Safari (manual testing each sprint)
- **Tertiary**: Firefox, Edge (manual testing before release)

### **Appendix E: Amendment Log**

| Version | Date | Section | Change | Reason |
|---------|------|---------|--------|--------|
| 1.0 | Dec 29, 2025 | All | Initial creation | Establish UI implementation standards |
| - | - | - | - | - |

**How to Amend This Document:**
1. Identify drift or needed change (component API, visual standard, process)
2. Create proposal with rationale (why change is necessary)
3. Review with design + engineering leads
4. Update affected sections
5. Add entry to Amendment Log (version, date, section, change, reason)
6. Update `Document Control` table with new version
7. Announce changes to team (Slack, standup)
8. Update implementation to match new spec (within 1 sprint)

### **Appendix F: Contract Hooks & Validation Testing**

**Purpose**: Define automated validation tests that ensure UI implementation remains synchronized with normative source contracts (OpenAPI, UX Spec, Security/Privacy).

**Critical Context**: The UI is subordinate to multiple normative contracts (see Document Control hierarchy). Manual synchronization is error-prone. Contract hooks MUST automatically validate that UI implementation respects these boundaries.

---

#### **F.1 OpenAPI Schema Synchronization (MUST)**

**Requirement**: UI TypeScript types MUST match OpenAPI schema definitions. Manual type maintenance leads to drift.

**Implementation (Contract Test):**
```typescript
// tests/contracts/openapi-sync.test.ts
import { describe, it, expect } from 'vitest';
import openapiSchema from '@/api-specs/openapi.yaml';
import { generateTypesFromOpenAPI } from 'openapi-typescript';
import { ErrorEnvelope, GraphMetadata, User } from '@/types/api';

describe('OpenAPI Contract Synchronization', () => {
  it('MUST generate types from OpenAPI without errors', async () => {
    // This test fails if openapi.yaml is invalid
    const types = await generateTypesFromOpenAPI(openapiSchema);
    expect(types).toBeDefined();
  });

  it('MUST have ErrorEnvelope matching OpenAPI ErrorEnvelope schema', () => {
    // Manual type check: ErrorEnvelope structure must match OpenAPI
    const mockError: ErrorEnvelope = {
      error: {
        id: 'err_01JBCD...',
        level: 'CRITICAL',
        code: 'QUOTA_EXCEEDED',
        message: 'Test error',
        retryable: false,
      },
    };

    // If this compiles, types match. If OpenAPI changes, this will break.
    expect(mockError.error.id).toMatch(/^err_[A-Za-z0-9]{26}$/);
  });

  it('MUST have all error codes from OpenAPI mapped in UI error handler', () => {
    const openapiErrorCodes = extractErrorCodesFromOpenAPI(openapiSchema);
    const uiMappedCodes = Object.keys(ERROR_CODE_TO_UI_MAPPING); // from Section 5.4

    // Every OpenAPI error code MUST have UI mapping
    openapiErrorCodes.forEach((code) => {
      expect(uiMappedCodes).toContain(code);
    });
  });

  it('MUST NOT have unmapped error codes (no unknown fallback abuse)', () => {
    // Inverse test: UI shouldn't map codes that don't exist in OpenAPI
    const openapiErrorCodes = extractErrorCodesFromOpenAPI(openapiSchema);
    const uiMappedCodes = Object.keys(ERROR_CODE_TO_UI_MAPPING);

    uiMappedCodes.forEach((code) => {
      if (code !== 'NETWORK_ERROR') { // Client-side code, not in OpenAPI
        expect(openapiErrorCodes).toContain(code);
      }
    });
  });
});
```

**Enforcement:**
- Run in CI/CD on every PR
- Fail build if types don't match OpenAPI
- Auto-generate types from OpenAPI using `openapi-typescript` or `@hey-api/openapi-ts`

---

#### **F.2 Mode-Aware API Call Prevention (MUST)**

**Requirement**: Offline/Local-only mode MUST NEVER call server APIs (Section 8.3 contract).

**Implementation (Runtime Guard + Test):**
```typescript
// src/utils/api-client.ts
import { getMode } from '@/contexts/ModeContext';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const mode = getMode();

  // CONTRACT ENFORCEMENT: Offline mode blocks all API calls
  if (mode === 'offline') {
    throw new Error(
      `[CONTRACT VIOLATION] API call attempted in Offline mode: ${endpoint}. ` +
      `See VSG_UI_SPECIFICATION.md Section 8.3. All API calls MUST be guarded by mode check.`
    );
  }

  return fetch(`/api${endpoint}`, options);
}

// tests/contracts/mode-aware-api.test.ts
describe('Mode-Aware API Contract', () => {
  it('MUST throw error when API called in Offline mode', () => {
    setMode('offline'); // Test utility to override mode

    expect(() => fetchAPI('/graphs')).toThrow(/CONTRACT VIOLATION.*Offline mode/);
  });

  it('MUST allow API calls in Standard mode', async () => {
    setMode('standard');
    mockFetch({ ok: true, json: async () => ({ graphs: [] }) });

    await expect(fetchAPI('/graphs')).resolves.toBeDefined();
  });

  it('MUST NOT have direct fetch() calls bypassing fetchAPI wrapper', async () => {
    // Scan codebase for unguarded fetch() calls
    const sourceFiles = await globby(['src/**/*.{ts,tsx}']);
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const content = await fs.readFile(file, 'utf-8');

      // Match: fetch('...') or fetch(`...`) but NOT fetchAPI(...)
      const unguardedFetch = /\bfetch\s*\(['`"]/.test(content) &&
                            !/fetchAPI\s*\(/.test(content);

      if (unguardedFetch && !file.includes('api-client.ts')) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });
});
```

**Enforcement:**
- Runtime error in dev mode (mode === 'offline' && API call → crash immediately)
- Lint rule: no direct `fetch()` calls (must use `fetchAPI()` wrapper)
- CI test: scan codebase for unguarded API calls

---

#### **F.3 Privacy Boundary Validation (MUST)**

**Requirement**: Display names/usernames MUST NEVER be sent to server (VSG_SECURITY_PRIVACY.md contract).

**Implementation (Contract Test):**
```typescript
// tests/contracts/privacy-boundaries.test.ts
describe('Privacy Boundary Contract', () => {
  it('MUST NOT send display names to server in API payloads', async () => {
    const mockGraph = {
      nodes: [
        { id: 'n1', label: 'Alice', pseudonym: 'user_abc123' },
        { id: 'n2', label: 'Bob', pseudonym: 'user_def456' },
      ],
      edges: [{ source: 'n1', target: 'n2' }],
    };

    // Mock fetch to intercept request
    const sentPayload = await interceptFetchPayload(() => {
      return uploadGraph(mockGraph); // Function from Section 4.4
    });

    // Contract: payload MUST NOT contain "Alice" or "Bob"
    expect(JSON.stringify(sentPayload)).not.toContain('Alice');
    expect(JSON.stringify(sentPayload)).not.toContain('Bob');

    // Contract: payload MUST contain pseudonyms only
    expect(JSON.stringify(sentPayload)).toContain('user_abc123');
    expect(JSON.stringify(sentPayload)).toContain('user_def456');
  });

  it('MUST NOT log PII to console or error tracking', () => {
    const mockError = new Error('Graph processing failed for user Alice');

    // Simulate error logging
    const logSpy = vi.spyOn(console, 'error');
    logError(mockError); // Logging utility from app

    // Contract: "Alice" MUST be redacted from logs
    const loggedMessage = logSpy.mock.calls[0][0];
    expect(loggedMessage).not.toContain('Alice');
    expect(loggedMessage).toMatch(/user_[a-z0-9]+/); // Pseudonym format
  });

  it('MUST strip display names from local storage keys', () => {
    const graph = { name: 'Alice Network', id: 'graph_123' };

    saveGraphToLocalStorage(graph);

    const storageKeys = Object.keys(localStorage);
    storageKeys.forEach((key) => {
      expect(key).not.toContain('Alice');
    });

    // Acceptable: localStorage keys like "vsg_graph_graph_123"
  });
});
```

**Enforcement:**
- CI test: intercept all fetch() payloads in integration tests, scan for PII patterns
- Lint rule: no hardcoded names in API calls (detect string literals in fetch bodies)
- Runtime monitoring (dev mode): warn if suspected PII detected in outgoing requests

---

#### **F.4 UX Spec Token Synchronization (SHOULD)**

**Requirement**: CSS tokens in `tokens.css` SHOULD match values from UX Specification (Section 0.5 contract).

**Implementation (Contract Test):**
```typescript
// tests/contracts/ux-token-sync.test.ts
describe('UX Spec Token Synchronization', () => {
  it('SHOULD have CSS tokens matching UX Spec color values', async () => {
    const tokensCSS = await fs.readFile('src/styles/tokens.css', 'utf-8');

    // Extract from UX Spec (automated or manual reference)
    const uxSpecColors = {
      '--vsg-color-orange-500': '#F97316',
      '--vsg-color-primary': 'var(--vsg-color-orange-500)',
    };

    Object.entries(uxSpecColors).forEach(([token, expectedValue]) => {
      const regex = new RegExp(`${token}:\\s*${expectedValue}`);
      expect(tokensCSS).toMatch(regex);
    });
  });

  it('SHOULD NOT have hardcoded colors in components (zero tolerance)', async () => {
    const componentFiles = await globby(['src/components/**/*.{ts,tsx}']);
    const violations: Array<{ file: string; line: number; hex: string }> = [];

    for (const file of componentFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Match: #F97316 or color: #... or backgroundColor: '#...'
        const hexMatch = line.match(/#([0-9A-Fa-f]{3,6})\b/);
        if (hexMatch && !line.includes('// @allow-hardcoded-color')) {
          violations.push({ file, line: index + 1, hex: hexMatch[0] });
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
```

**Enforcement:**
- CI test: warn (not fail) if tokens drift from UX Spec
- Pre-commit hook: block commits with hardcoded hex colors
- Documentation: update Section 0.5 with sync process

---

#### **F.5 WCAG 2.2 AA Compliance Contract (MUST)**

**Requirement**: All components MUST pass WCAG 2.2 AA automated checks (Section 5.3 contract).

**Implementation (Contract Test):**
```typescript
// tests/contracts/wcag-compliance.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('WCAG 2.2 AA Compliance Contract', () => {
  const components = [
    { name: 'Button', component: <Button>Click Me</Button> },
    { name: 'Input', component: <Input label="Name" /> },
    { name: 'Modal', component: <Modal open={true} title="Test">Content</Modal> },
    // ... all components from Section 4.8
  ];

  components.forEach(({ name, component }) => {
    it(`${name} MUST have no WCAG 2.2 AA violations`, async () => {
      const { container } = render(component);
      const results = await axe(container, {
        // Enable WCAG 2.2 rules
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag22aa'],
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  it('MUST have focus visible on all interactive elements', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');

    button.focus();

    // Check computed styles for focus ring
    const styles = window.getComputedStyle(button);
    expect(styles.outline).not.toBe('none');
    expect(styles.outlineWidth).toBe('2px'); // Per Section 5.0
  });
});
```

**Enforcement:**
- CI/CD: run axe-core on all Storybook stories
- Fail PR if any WCAG 2.2 AA violations detected
- Lighthouse CI: fail if accessibility score <95%

---

#### **F.6 Contract Test Execution (CI/CD)**

**GitHub Actions Workflow:**
```yaml
# .github/workflows/contract-tests.yml
name: Contract Validation Tests

on: [pull_request, push]

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run OpenAPI sync tests
        run: npm run test:contracts:openapi

      - name: Run mode-aware API tests
        run: npm run test:contracts:mode

      - name: Run privacy boundary tests
        run: npm run test:contracts:privacy

      - name: Run UX token sync tests
        run: npm run test:contracts:tokens
        continue-on-error: true # Warn, don't fail

      - name: Run WCAG compliance tests
        run: npm run test:contracts:wcag

      - name: Upload contract test results
        uses: actions/upload-artifact@v3
        with:
          name: contract-test-results
          path: test-results/
```

**Definition of Done:**
- ✅ All contract tests pass in CI/CD
- ✅ No hardcoded values detected in components
- ✅ No unguarded API calls in Offline mode
- ✅ No PII leakage in API payloads or logs
- ✅ All components pass WCAG 2.2 AA axe-core scans

---

## **Conclusion**

This UI Specification provides the complete implementation blueprint for Visual Social Graph's visual interface layer. By following these standards, the engineering team ensures:

✅ **Consistency**: Design tokens guarantee visual coherence across all components
✅ **Accessibility**: WCAG 2.2 Level AA compliance built into every component by default (upgraded from 2.1)
✅ **Maintainability**: Compound component patterns, TypeScript interfaces, and clear documentation
✅ **Quality**: Visual regression testing, accessibility audits, and performance budgets prevent regressions
✅ **Modern Standards**: Material Design 3, Apple HIG, and React best practices (2025)

**Remember the Governance Hierarchy:**
1. **Accessibility wins over aesthetics** (WCAG compliance non-negotiable)
2. **Mobile wins over desktop** (mobile-first, progressive enhancement)
3. **Performance wins over features** (fast is a feature)
4. **Simplicity wins over complexity** (fewer components, clearer API)
5. **This document wins over opinions** (unless formally amended)

**Next Steps:**
- [ ] Review this specification with design + engineering teams
- [ ] Set up infrastructure (Storybook, Chromatic, jest-axe, Lighthouse CI)
- [ ] Begin Sprint 1: Foundation components (Button, Input, Card)
- [ ] Establish visual regression baselines
- [ ] Schedule weekly design system sync (drift prevention)

**Questions or Clarifications:**
- For design questions: Reference UX Specification for interaction patterns
- For implementation questions: This document is authoritative
- For governance questions: Section 0 defines conflict resolution hierarchy
- For amendment requests: Follow Appendix E amendment process

---

**Document Version:** 1.0
**Last Updated:** December 29, 2025
**Status:** Complete - Ready for Implementation
**Next Review:** Sprint 1 Retrospective (Week 2)
