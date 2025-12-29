# Figma Import Instructions

These HTML mockups are designed to be imported directly into Figma to jumpstart the high-fidelity design process.

## Prerequisites
1. A Figma account.
2. The **"html.to.design"** plugin installed in Figma.

## Steps to Import

1. **Open Figma**: Create a new Design File.
2. **Run Plugin**:
   - Right-click on the canvas -> Plugins -> html.to.design.
3. **Select Source**:
   - **Option A (Chrome Extension)**: Install the html.to.design Chrome extension. Open `landing.html` or `app.html` in your browser, use the extension to download the `.h2d` file, and drag it into Figma.
   - **Option B (Localhost)**:
     1. Open a terminal in this folder (`SocialGraphVisual/ui-mockups`).
     2. Run `npx serve` or `python -m http.server`.
     3. In the Figma plugin, enter `http://localhost:3000/landing.html` (or the port provided).
4. **Refine**:
   - Once imported, the HTML elements will be converted to Figma Auto Layout frames.
   - Use the styles defined in `styles.css` (which will be imported as properties) to create your Figma Design System.
