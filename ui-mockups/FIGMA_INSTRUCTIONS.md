# Figma Import Instructions

These mockups are ready for high-fidelity import into Figma, preserving layout, typography, and the guided-reveal states.

## Prerequisites
1. Figma account
2. **html.to.design** plugin (or Chrome extension)

## Import Steps
1. Open Figma → New Design File.
2. Run **Plugins → html.to.design**.
3. Choose a source:
   - **Localhost** (recommended):
     1. From `SocialGraphVisual/ui-mockups`, run `npx serve` (or `python -m http.server`).
     2. In the plugin, enter `http://localhost:3000/landing.html` or `app.html`.
   - **Chrome Extension**: Open `landing.html` or `app.html` in your browser, click the extension, export `.h2d`, then drag into Figma.
4. Import; the plugin will convert elements to Figma frames and Auto Layout.

## Component Notes
- **Tokens**: Colors (#F97316 primary), spacing (8pt), radii, and shadows live in `styles.css` as CSS variables—import them as Figma color/text styles.
- **Hero & Sections**: Landing includes hero, How-it-works, feature grid, testimonials, CTA.
- **App States**: `app.html` contains the 5-stage guided reveal (YOU → inner circle → full network → spotlight → controls) and the mobile bottom-sheet for insights.
- **Icons**: Inline glyphs; replace with Lucide/Heroicons in Figma if desired.
- **Cards & Glass**: Use elevation/shadow tokens from `styles.css` to build consistent components.

## After Import
- Create Figma styles from imported tokens (color, text, effects).
- Turn repeating pieces (chips, cards, buttons, insight card, bottom sheet) into components/variants.
- Annotate the guided-reveal timeline (0-2s center, 2-5s inner, 5-8s full, 8-10s spotlight, 10s+ controls).
