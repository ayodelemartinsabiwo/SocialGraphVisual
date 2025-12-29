# **Visual Social Graph: Illustration & Icon Style Guide**
## **Version 1.0 - Asset Specifications**

*"Every visual element should reinforce trust, clarity, and delight."*

---

## **Document Control**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 |
| **Date** | December 2025 |
| **Status** | Active |
| **Owner** | Design / Engineering |
| **Review Cycle** | Quarterly |
| **Classification** | Internal - Design System |

**Document Hierarchy:**
```
VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md (design authority)
    ↓ references
VSG_ILLUSTRATION_ICON_GUIDE.md (THIS DOCUMENT - asset specifications)
    ↓ implements
/public/assets/ (actual files)
```

**Related Documents:**
- VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md (design tokens, components)
- VSG_UI_SPECIFICATION.md (implementation contracts)
- VSG_ARCHITECTURE_DOCUMENT.md (theming architecture)

---

## **Table of Contents**

1. [Icon Library](#1-icon-library)
2. [Open-Source Illustration Library](#2-open-source-illustration-library)
3. [Asset Directory Structure](#3-asset-directory-structure)
4. [Custom VSG Icon Definitions](#4-custom-vsg-icon-definitions)
5. [Empty State Illustrations](#5-empty-state-illustrations)
6. [Animation Specifications](#6-animation-specifications)
7. [Licensing & Attribution](#7-licensing--attribution)
8. [Implementation Guidelines](#8-implementation-guidelines)

---

## **1. Icon Library**

### **1.1 Primary Icon Library**

| Attribute | Value |
|-----------|-------|
| **Library** | [Heroicons](https://heroicons.com/) |
| **License** | MIT |
| **Rationale** | Designed by Tailwind Labs, visually consistent with TailwindCSS |
| **Style** | Outline (default), Solid (emphasis/active states) |
| **Format** | SVG |

### **1.2 Icon Sizes**

| Size Name | Dimensions | Usage | CSS Class |
|-----------|------------|-------|-----------|
| **XS** | 12×12px | Inline badges, compact UI | `w-3 h-3` |
| **SM** | 16×16px | Inline with text, tight spaces | `w-4 h-4` |
| **MD** | 20×20px | Default size, buttons, inputs | `w-5 h-5` |
| **LG** | 24×24px | Standalone icons, headers, nav | `w-6 h-6` |
| **XL** | 32×32px | Empty states, feature highlights | `w-8 h-8` |
| **2XL** | 48×48px | Hero illustrations, onboarding | `w-12 h-12` |
| **3XL** | 64×64px | Large empty states, errors | `w-16 h-16` |

### **1.3 Icon Styles**

**Outline (Default):**
```
Stroke width: 1.5px (Heroicons default)
Use for: Navigation, buttons, form inputs, labels
Color: currentColor (inherits from text color)
```

**Solid (Emphasis):**
```
Fill: Solid color
Use for: Active states, selected items, primary actions
Example: Selected nav item, active filter
```

### **1.4 Icon Colors**

| Context | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| **Default** | Gray-500 (#6B7280) | Gray-400 (#9CA3AF) | Standard icons |
| **Primary** | Gray-700 (#374151) | Gray-200 (#E5E7EB) | Important icons |
| **Interactive** | Orange-500 (#F97316) | Orange-400 (#FB923C) | Hover, focus states |
| **Active** | Orange-600 (#EA580C) | Orange-500 (#F97316) | Selected, pressed |
| **Disabled** | Gray-400 (#9CA3AF) | Gray-600 (#4B5563) | Disabled states |
| **Success** | Green-600 (#16A34A) | Green-400 (#4ADE80) | Success indicators |
| **Warning** | Amber-600 (#D97706) | Amber-400 (#FBBF24) | Warning indicators |
| **Error** | Red-600 (#DC2626) | Red-400 (#F87171) | Error indicators |

**Implementation:**
```tsx
// Icons inherit color from parent text
<span className="text-gray-500 dark:text-gray-400">
  <ChartBarIcon className="w-5 h-5" />
</span>

// Or use currentColor explicitly
<ChartBarIcon className="w-5 h-5 text-current" />
```

---

## **2. Open-Source Illustration Library**

### **2.1 Primary Illustration Source**

| Attribute | Value |
|-----------|-------|
| **Library** | [unDraw](https://undraw.co/) |
| **License** | MIT (free for commercial use) |
| **Style** | Flat vector, customizable accent color |
| **Format** | SVG |
| **Accent Color** | Orange-500 (#F97316) - VSG brand color |

**Why unDraw:**
- Consistent minimalist style matches VSG aesthetic
- Single accent color customization (brand alignment)
- Large library covering diverse scenarios
- MIT license (no attribution required, but appreciated)
- SVG format (scalable, theme-aware)

### **2.2 Alternative Illustration Source**

| Attribute | Value |
|-----------|-------|
| **Library** | [Humaaans](https://humaaans.com/) |
| **License** | CC0 (public domain) |
| **Style** | Modular human figures |
| **Use Case** | People-focused scenes, diversity representation |
| **Accent Color** | Match VSG palette |

**When to Use Humaaans:**
- Onboarding flows showing user personas
- Team/community illustrations
- "About us" or "How it works" sections

### **2.3 Illustration Style Guidelines**

**DO:**
```
✓ Use Orange-500 (#F97316) as primary accent
✓ Keep backgrounds transparent (works on any surface)
✓ Maintain consistent illustration style across app
✓ Use line-art style for consistency with Heroicons
✓ Ensure illustrations work in both light and dark modes
```

**DON'T:**
```
✗ Mix illustration styles (unDraw + different styles)
✗ Use illustrations with busy backgrounds
✗ Use illustrations that don't match product context
✗ Use illustrations with text baked in (localization issues)
```

---

## **3. Asset Directory Structure**

```
/public/assets/
├── icons/
│   ├── custom/                    # VSG-specific icons
│   │   ├── network-graph.svg
│   │   ├── insight-spark.svg
│   │   ├── community-cluster.svg
│   │   ├── bridge-connector.svg
│   │   ├── influence-wave.svg
│   │   ├── upload-data.svg
│   │   ├── privacy-shield.svg
│   │   ├── network-empty.svg
│   │   ├── insight-empty.svg
│   │   ├── connection-error.svg
│   │   ├── offline-mode.svg
│   │   └── theme-toggle.svg
│   │
│   └── app/                       # App icons (PWA manifest)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       ├── icon-512x512.png
│       └── apple-touch-icon.png
│
├── illustrations/
│   ├── empty-states/
│   │   ├── no-networks.svg        # "No networks yet" state
│   │   ├── no-insights.svg        # "No insights available" state
│   │   ├── parse-error.svg        # File parsing failed
│   │   ├── offline-mode.svg       # Working offline
│   │   └── upload-success.svg     # Upload completed
│   │
│   ├── onboarding/
│   │   ├── welcome.svg            # Welcome screen
│   │   ├── how-it-works-1.svg     # Step 1: Download data
│   │   ├── how-it-works-2.svg     # Step 2: Upload to VSG
│   │   ├── how-it-works-3.svg     # Step 3: Discover insights
│   │   └── privacy-first.svg      # Privacy explanation
│   │
│   └── features/
│       ├── network-visualization.svg
│       ├── community-detection.svg
│       ├── insight-generation.svg
│       └── export-share.svg
│
├── animations/
│   └── lottie/
│       ├── loading-graph.json     # Graph building animation
│       ├── parsing-file.json      # File parsing progress
│       ├── success-check.json     # Success confirmation
│       └── network-pulse.json     # Network activity pulse
│
└── ATTRIBUTION.md                 # License attribution file
```

### **3.1 Naming Conventions**

| Type | Convention | Example |
|------|------------|---------|
| **Custom icons** | `kebab-case.svg` | `network-graph.svg` |
| **Illustrations** | `kebab-case.svg` | `no-networks.svg` |
| **Lottie animations** | `kebab-case.json` | `loading-graph.json` |
| **App icons** | `icon-{size}x{size}.png` | `icon-192x192.png` |

### **3.2 Asset Creation Timeline**

| Phase | Assets | Owner |
|-------|--------|-------|
| **Phase 1 Week 3** | 12 custom icons, 5 empty state illustrations | Design |
| **Phase 1 Week 4** | Onboarding illustrations, loading animations | Design |
| **Phase 2** | Feature illustrations, additional Lottie animations | Design |

---

## **4. Custom VSG Icon Definitions**

These 12 icons are specific to VSG concepts and should be created as modifications of Heroicons base icons.

### **4.1 Icon Specifications**

| Icon Name | Purpose | Base Icon (Heroicons) | Modifications |
|-----------|---------|----------------------|---------------|
| `network-graph` | Graph visualization | `share` | Add node circles at endpoints, denser connection lines |
| `insight-spark` | Insight indicator | `light-bulb` | Add spark/ray lines emanating outward |
| `community-cluster` | Community detection | `user-group` | Arrange figures in cluster formation with connecting lines |
| `bridge-connector` | Bridge node indicator | `arrows-right-left` | Add node circles at endpoints, bridge shape |
| `influence-wave` | Influence metric | `signal` | Add concentric ripple circles |
| `upload-data` | Data upload action | `cloud-arrow-up` | Add file icon overlay on cloud |
| `privacy-shield` | Privacy indicator | `shield-check` | Add lock icon in center of shield |
| `network-empty` | No networks state | `chart-bar` | Dashed/dotted outline style, empty bars |
| `insight-empty` | No insights state | `magnifying-glass` | Add question mark inside lens |
| `connection-error` | Error state | `exclamation-triangle` | Add broken connection line |
| `offline-mode` | Offline indicator | `signal-slash` | Add device icon (mobile/desktop) |
| `theme-toggle` | Theme toggle button | `moon` / `sun` | Combined sun-moon with transition state |

### **4.2 Custom Icon Design Specifications**

```
Format: SVG
Viewbox: 24×24 (matches Heroicons)
Stroke width: 1.5px (matches Heroicons outline)
Stroke linecap: round
Stroke linejoin: round
Color: currentColor (inherits from parent)
```

**Template:**
```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-6 h-6"
>
  <!-- Icon paths here -->
</svg>
```

### **4.3 Example: Network Graph Icon**

```svg
<!-- /public/assets/icons/custom/network-graph.svg -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
>
  <!-- Central node -->
  <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />

  <!-- Outer nodes -->
  <circle cx="5" cy="7" r="1.5" fill="currentColor" stroke="none" />
  <circle cx="19" cy="7" r="1.5" fill="currentColor" stroke="none" />
  <circle cx="5" cy="17" r="1.5" fill="currentColor" stroke="none" />
  <circle cx="19" cy="17" r="1.5" fill="currentColor" stroke="none" />

  <!-- Connection lines -->
  <path d="M12 12L5 7M12 12L19 7M12 12L5 17M12 12L19 17" />
  <path d="M5 7L5 17M19 7L19 17" />
</svg>
```

---

## **5. Empty State Illustrations**

### **5.1 Style Guidelines**

| Attribute | Value |
|-----------|-------|
| **Max dimensions** | 200×200px (display size) |
| **Style** | Line-art, minimal, single accent color |
| **Accent color** | Orange-500 (#F97316) |
| **Background** | Transparent |
| **Format** | SVG with `currentColor` support |

### **5.2 Dark Mode Adaptation**

Empty state illustrations must work in both light and dark modes:

```css
/* Light mode (default) */
.illustration-empty-state {
  --illustration-stroke: #374151;  /* Gray-700 */
  --illustration-accent: #F97316;  /* Orange-500 */
  --illustration-fill: #F3F4F6;    /* Gray-100 */
}

/* Dark mode */
html.dark .illustration-empty-state {
  --illustration-stroke: #E5E7EB;  /* Gray-200 */
  --illustration-accent: #FB923C;  /* Orange-400 */
  --illustration-fill: #374151;    /* Gray-700 */
}
```

### **5.3 Required Empty State Illustrations**

| Illustration | Context | unDraw Source | Fallback Icon |
|--------------|---------|---------------|---------------|
| `no-networks.svg` | Dashboard with no uploads | `undraw_connected_world` | `network-empty` |
| `no-insights.svg` | Insights panel with no insights | `undraw_searching` | `insight-empty` |
| `parse-error.svg` | File parsing failed | `undraw_warning` | `connection-error` |
| `offline-mode.svg` | Working without connection | `undraw_signal_searching` | `offline-mode` |
| `upload-success.svg` | Upload completed successfully | `undraw_completed` | `check-circle` |

### **5.4 Empty State Component Pattern**

```tsx
// /components/ui/EmptyState.tsx

interface EmptyStateProps {
  illustration: 'no-networks' | 'no-insights' | 'parse-error' | 'offline-mode';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Illustration */}
      <div className="w-48 h-48 mb-6 illustration-empty-state">
        <img
          src={`/assets/illustrations/empty-states/${illustration}.svg`}
          alt=""
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## **6. Animation Specifications**

### **6.1 Lottie Animations**

| Attribute | Value |
|-----------|-------|
| **Format** | Lottie JSON |
| **Library** | [lottie-react](https://www.npmjs.com/package/lottie-react) |
| **Loop** | Ambient animations: `true`, Transitions: `false` |
| **Autoplay** | Ambient: `true`, User-triggered: `false` |

### **6.2 Animation Durations**

| Animation Type | Duration | Loop | Use Case |
|----------------|----------|------|----------|
| **Ambient** | 2-4 seconds | Yes | Loading states, background decoration |
| **Transition** | 300-500ms | No | State changes, success confirmations |
| **Progress** | Variable | Yes (until complete) | Upload progress, parsing progress |
| **Celebration** | 1-2 seconds | No | Upload complete, insight discovered |

### **6.3 Required Lottie Animations**

| Animation | Purpose | Duration | Loop |
|-----------|---------|----------|------|
| `loading-graph.json` | Graph building/loading | 3s | Yes |
| `parsing-file.json` | File parsing progress | 2s | Yes |
| `success-check.json` | Success confirmation | 500ms | No |
| `network-pulse.json` | Network activity indicator | 2s | Yes |

### **6.4 Dark Mode Color Remapping**

Lottie animations support runtime color changes:

```tsx
// /hooks/useLottieTheme.ts

import { useMemo } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function useLottieTheme() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => ({
    // Map color layers to theme-aware values
    colorFilters: resolvedTheme === 'dark'
      ? [
          { keypath: 'Primary', color: '#FB923C' },  // Orange-400
          { keypath: 'Secondary', color: '#E5E7EB' }, // Gray-200
          { keypath: 'Background', color: '#111827' }, // Gray-900
        ]
      : [
          { keypath: 'Primary', color: '#F97316' },  // Orange-500
          { keypath: 'Secondary', color: '#374151' }, // Gray-700
          { keypath: 'Background', color: '#FFFFFF' }, // White
        ],
  }), [resolvedTheme]);
}
```

---

## **7. Licensing & Attribution**

### **7.1 License Summary**

| Asset Source | License | Attribution Required | Commercial Use |
|--------------|---------|---------------------|----------------|
| **Heroicons** | MIT | No (appreciated) | ✅ Yes |
| **unDraw** | MIT | No | ✅ Yes |
| **Humaaans** | CC0 | No | ✅ Yes |
| **Custom VSG Icons** | Proprietary | N/A | VSG only |
| **Lottie Animations** | Per-animation | Check source | Check source |

### **7.2 Attribution File**

```markdown
<!-- /public/assets/ATTRIBUTION.md -->

# Asset Attribution

Visual Social Graph uses the following open-source assets:

## Icons

### Heroicons
- **Source:** https://heroicons.com/
- **License:** MIT License
- **Copyright:** © Tailwind Labs, Inc.

## Illustrations

### unDraw
- **Source:** https://undraw.co/
- **License:** MIT License (open-source license)
- **Copyright:** © Katerina Limpitsouni
- **Note:** Illustrations customized with VSG brand color (#F97316)

### Humaaans
- **Source:** https://humaaans.com/
- **License:** CC0 1.0 Universal (Public Domain)
- **Copyright:** © Pablo Stanley

## Modifications

All modifications to open-source assets are documented in source control.
Custom VSG icons are original works based on Heroicons design language.

---

MIT License (Heroicons, unDraw):

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## **8. Implementation Guidelines**

### **8.1 Icon Import Pattern**

```tsx
// Preferred: Import from Heroicons React package
import { ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarSolid } from '@heroicons/react/24/solid';

// Custom icons: Import as React components
import { NetworkGraphIcon } from '@/components/icons/NetworkGraphIcon';

// Or use Next.js Image for custom SVGs
import Image from 'next/image';
<Image src="/assets/icons/custom/network-graph.svg" alt="" width={24} height={24} />
```

### **8.2 Custom Icon Component Pattern**

```tsx
// /components/icons/NetworkGraphIcon.tsx

import { SVGProps } from 'react';

export function NetworkGraphIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      {/* SVG paths */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 12L5 7M12 12L19 7M12 12L5 17M12 12L19 17M5 7L5 17M19 7L19 17" />
    </svg>
  );
}
```

### **8.3 Illustration Usage Pattern**

```tsx
// /components/features/NoNetworksState.tsx

import { EmptyState } from '@/components/ui/EmptyState';

export function NoNetworksState() {
  return (
    <EmptyState
      illustration="no-networks"
      title="No Networks Yet"
      description="Upload your first social network data to see your connections visualized."
      action={{
        label: "Upload Data",
        onClick: () => router.push('/dashboard/upload'),
      }}
    />
  );
}
```

### **8.4 Accessibility Requirements**

**Icons:**
```tsx
// Decorative icons (no alt text needed)
<ChartBarIcon className="w-5 h-5" aria-hidden="true" />

// Meaningful icons (need accessible label)
<button aria-label="View network graph">
  <NetworkGraphIcon className="w-5 h-5" />
</button>
```

**Illustrations:**
```tsx
// Illustrations are decorative, always hide from screen readers
<img
  src="/assets/illustrations/empty-states/no-networks.svg"
  alt=""
  aria-hidden="true"
/>
```

---

## **Appendix: Icon Checklist**

Before adding a new icon to the system:

- [ ] Check if Heroicons has a suitable icon first
- [ ] If custom, follow 24×24 viewbox, 1.5px stroke guidelines
- [ ] Use `currentColor` for all strokes/fills
- [ ] Test in both light and dark modes
- [ ] Add to asset directory with correct naming
- [ ] Create React component wrapper
- [ ] Document in this guide
- [ ] Update ATTRIBUTION.md if using external source

---

*This document is the authoritative source for all illustration and icon specifications in Visual Social Graph.*
