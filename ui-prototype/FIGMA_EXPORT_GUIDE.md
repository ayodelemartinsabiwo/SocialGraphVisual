# Figma Export & Import Guide

This guide explains how to convert the HTML/CSS mockups into Figma for team collaboration and further design iteration.

## Quick Start

The UI prototype in this directory is a complete, pixel-perfect representation of Visual Social Graph. You can share these HTML files directly, or import them into Figma using the methods below.

## Method 1: html.to" design (Recommended)

The fastest way to convert HTML to Figma is using the [html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html.to.design) plugin.

### Steps:

1. **Open the HTML files in a browser**
   ```
   # Using a local server (recommended)
   cd ui-prototype
   python -m http.server 8080
   # Then open http://localhost:8080 in your browser
   ```

2. **Install the plugin**
   - Open Figma and go to Community
   - Search for "html.to.design"
   - Click "Install"

3. **Import each page**
   - In Figma, create a new file
   - Right-click → Plugins → html.to.design
   - Paste the URL or select "Current Tab"
   - The plugin will convert HTML elements to Figma frames

4. **Repeat for all pages:**
   - `index.html` - Landing page
   - `upload.html` - Upload flow (5 screens)
   - `canvas.html` - Graph visualization
   - `insights.html` - Insights dashboard
   - `settings.html` - Settings panel

### What Gets Converted:
- ✅ Layout structure (frames, auto-layout)
- ✅ Typography styles
- ✅ Colors and backgrounds
- ✅ Border radius and shadows
- ✅ Responsive breakpoints
- ⚠️ Animations (as static states)
- ⚠️ JavaScript interactions (manual recreation needed)

---

## Method 2: Manual Recreation with Design Tokens

For pixel-perfect accuracy, recreate components in Figma using our design tokens.

### Design Tokens Reference

#### Colors

**Primary (Orange)**
| Token | Hex | Usage |
|-------|-----|-------|
| Orange-50 | #FFF7ED | Subtle backgrounds |
| Orange-100 | #FFEDD5 | Hover states |
| Orange-500 | #F97316 | Primary accent ⭐ |
| Orange-600 | #EA580C | Hover/Active |
| Orange-700 | #C2410C | Dark accents |

**Grays**
| Token | Hex | Usage |
|-------|-----|-------|
| Gray-50 | #FAFAFA | Page backgrounds |
| Gray-100 | #F5F5F5 | Card backgrounds |
| Gray-200 | #E5E5E5 | Borders (light) |
| Gray-400 | #A3A3A3 | Tertiary text |
| Gray-600 | #525252 | Secondary text |
| Gray-900 | #171717 | Primary text |

**Semantic Colors**
| Color | Hex | Usage |
|-------|-----|-------|
| Success | #10B981 | Positive actions, confirmations |
| Warning | #F59E0B | Cautions, alerts |
| Error | #EF4444 | Destructive actions, errors |
| Info | #3B82F6 | Informational messages |

**Community Colors (Colorblind-safe)**
| Community | Hex |
|-----------|-----|
| Community 1 | #F97316 (Orange) |
| Community 2 | #3B82F6 (Blue) |
| Community 3 | #10B981 (Green) |
| Community 4 | #8B5CF6 (Purple) |
| Community 5 | #EC4899 (Pink) |
| Community 6 | #F59E0B (Amber) |
| Community 7 | #06B6D4 (Cyan) |
| Community 8 | #84CC16 (Lime) |

#### Typography

**Font Family:** System UI stack
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

**Type Scale**
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 48px | Bold (700) | 1.1 | Hero headlines |
| H1 | 36px | Bold (700) | 1.2 | Page titles |
| H2 | 30px | Semibold (600) | 1.3 | Section headers |
| H3 | 24px | Semibold (600) | 1.3 | Card titles |
| H4 | 20px | Semibold (600) | 1.4 | Subsections |
| Body | 16px | Regular (400) | 1.5 | Main content |
| Body SM | 14px | Regular (400) | 1.5 | Secondary text |
| Caption | 12px | Regular (400) | 1.4 | Labels, hints |

#### Spacing

Base unit: **4px**

| Token | Value |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |

#### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-xs | 2px | Checkboxes, small elements |
| radius-sm | 4px | Inputs, small cards |
| radius-md | 8px | Buttons, cards |
| radius-lg | 12px | Modals, large cards |
| radius-xl | 16px | Hero sections |
| radius-full | 9999px | Pills, avatars |

#### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-xs | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth |
| shadow-sm | 0 1px 3px rgba(0,0,0,0.1) | Cards, buttons |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Dropdowns |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals, popovers |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.1) | Large overlays |

---

## Method 3: Screenshot & Trace

For quick mockups, take screenshots and use Figma's trace feature.

### Capture Responsive Breakpoints:

1. **Desktop (1440px)**
   - Full experience with sidebar
   - 2-column insight grid

2. **Tablet (768px)**
   - Collapsed navigation
   - Adjusted spacing

3. **Mobile (375px)**
   - Bottom sheet patterns
   - Single column layouts

### Screenshot Commands:

```bash
# macOS
Cmd + Shift + 4 (area) or Cmd + Shift + 5 (window)

# Windows
Win + Shift + S (Snipping Tool)
```

---

## Component Library

Create these Figma components to build any screen:

### Core Components

1. **Button**
   - Variants: Primary, Secondary, Tertiary, Ghost, Danger
   - Sizes: SM (32px), MD (40px), LG (48px), XL (56px)
   - States: Default, Hover, Active, Disabled, Loading

2. **Input**
   - States: Default, Focus, Error, Success, Disabled
   - With: Label, Helper text, Error message

3. **Card**
   - Variants: Default, Interactive, Selected, Feature
   - With: Header, Body, Footer, Actions

4. **Badge**
   - Variants: Primary, Success, Warning, Error, Info, Neutral
   - Confidence levels for insights

5. **Upload Zone**
   - States: Idle, Dragover, Uploading, Success, Error

6. **Progress Bar**
   - With percentage label
   - Indeterminate variant

7. **Toggle Switch**
   - States: On, Off, Disabled

8. **Tabs**
   - Horizontal navigation
   - Active indicator

### Graph Components

1. **Node**
   - Sizes based on importance
   - Community color coding
   - Labels (optional)
   - Selection ring

2. **Edge**
   - Weight visualization
   - Hover highlight

3. **Community Legend**
   - Color dot + name + count

### Insight Components

1. **Insight Card**
   - Icon (Bridge, Dormant, Rising, Echo, etc.)
   - Title + Confidence badge
   - Description
   - Connection preview
   - Action buttons

2. **Connection Avatar**
   - Stack layout (overlapping)
   - "+N more" variant

---

## Animation Specs

Document these for handoff to developers:

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Page fade | 300ms | ease-out | Navigation |
| Card hover | 150ms | ease-out | Mouse enter |
| Button press | 100ms | ease-out | Click |
| Modal enter | 300ms | spring | Open |
| Modal exit | 200ms | ease-in | Close |
| Reveal stages | 300ms | ease-out | Auto-advance |
| Node pulse | 2s | ease-in-out | Continuous |

---

## File Organization

Recommended Figma file structure:

```
📁 Visual Social Graph
├── 📄 Cover
├── 📁 Design System
│   ├── 🎨 Colors
│   ├── 📝 Typography
│   ├── 📐 Spacing & Layout
│   └── 🧩 Components
├── 📁 Web Screens
│   ├── Landing Page
│   ├── Upload Flow
│   ├── Graph Canvas
│   ├── Insights Dashboard
│   └── Settings
├── 📁 Mobile Screens
│   ├── Landing (Mobile)
│   ├── Upload (Mobile)
│   ├── Canvas (Mobile)
│   ├── Insights (Mobile)
│   └── Settings (Mobile)
└── 📁 Prototyping
    ├── User Flow
    └── Interactive Prototype
```

---

## Exporting from Figma

### For Development

1. **Assets (icons, illustrations)**
   - Export as SVG
   - Include @2x variants for images

2. **Inspect Mode**
   - Enable Dev Mode
   - Share CSS properties

### For Presentation

1. **Prototype**
   - Link frames for flow
   - Add transitions
   - Present in fullscreen

2. **Export**
   - PNG for static mockups
   - PDF for documentation

---

## Support

If you need help with the Figma import:

1. Check the HTML files in browser first
2. Ensure all styles are loading correctly
3. Use browser DevTools to inspect specific styles
4. Reference `tokens.css` for exact values

The HTML prototype is the source of truth - Figma is for collaboration and iteration.
