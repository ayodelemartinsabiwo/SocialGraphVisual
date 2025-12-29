# **Visual Social Graph: Quick Start Guide**
## **Developer Onboarding (2 Pages)**

*Get your development environment running in under 15 minutes.*

---

## **Prerequisites**

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 20.x LTS | `node --version` |
| pnpm | 8.x+ | `pnpm --version` |
| Git | 2.x+ | `git --version` |
| VS Code | Latest | Recommended IDE |

**VS Code Extensions (Recommended):**
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- GitLens (`eamodio.gitlens`)

---

## **1. Clone & Install** (2 min)

```bash
# Clone repository
git clone https://github.com/your-org/visual-social-graph.git
cd visual-social-graph

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

---

## **2. Token Setup** (3 min)

Design tokens are the foundation. Ensure you understand the token hierarchy:

```
Primitive → Semantic → Component
   ↓           ↓          ↓
#F97316   →  primary   →  button.bg
```

**Token Files:**
```
src/styles/
├── tokens.css           # Light mode primitives + semantics
├── tokens-dark.css      # Dark mode overrides (.dark class)
└── globals.css          # Imports both, Tailwind directives
```

**Quick Token Reference:**
```css
/* Primary brand */
--vsg-primary: #F97316;          /* Orange-500 */
--vsg-primary-hover: #EA580C;    /* Orange-600 */

/* Text */
--vsg-text-primary: var(--vsg-color-gray-700);
--vsg-text-secondary: var(--vsg-color-gray-600);

/* Backgrounds */
--vsg-bg-primary: var(--vsg-color-white);
--vsg-bg-secondary: var(--vsg-color-gray-50);
```

📖 **Full Token Spec:** [VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md](./VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md) Section 2

---

## **3. Create Your First Component** (5 min)

All components follow this pattern:

```tsx
// src/components/ui/MyComponent.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const myComponentVariants = cva(
  // Base classes (always applied)
  'rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-vsg-primary',
  {
    variants: {
      variant: {
        primary: 'bg-vsg-primary text-white hover:bg-vsg-primary-hover',
        secondary: 'bg-vsg-neutral-100 text-vsg-neutral-700 hover:bg-vsg-neutral-200',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface MyComponentProps extends VariantProps<typeof myComponentVariants> {
  children: React.ReactNode;
}

export function MyComponent({ variant, size, children }: MyComponentProps) {
  return (
    <div className={myComponentVariants({ variant, size })}>
      {children}
    </div>
  );
}
```

📖 **Component Specs:** [VSG_UI_SPECIFICATION.md](./VSG_UI_SPECIFICATION.md) Section 4

---

## **4. Dark Mode Setup** (2 min)

Dark mode uses `next-themes` with system preference as default.

**Wrap your app:**
```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const theme = localStorage.getItem('vsg-theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          })();
        ` }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" storageKey="vsg-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Use the toggle:**
```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<ThemeToggle /> // Defaults to system preference
```

📖 **Theme Architecture:** [VSG_ARCHITECTURE_DOCUMENT.md](./VSG_ARCHITECTURE_DOCUMENT.md) Section 3.5

---

## **5. Run Development Server** (1 min)

```bash
# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

**Other Commands:**
```bash
pnpm build          # Production build
pnpm lint           # ESLint check
pnpm test           # Run tests
pnpm storybook      # Component playground
```

---

## **6. Storybook** (3 min)

Every component MUST have a Storybook story.

```bash
# Start Storybook
pnpm storybook
# Opens at http://localhost:6006
```

**Story Template:**
```tsx
// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Upload Network' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Processing...' },
};
```

---

## **7. Accessibility Check** (2 min)

Before committing any component:

```bash
# Run accessibility audit
pnpm test:a11y

# Or use browser extension
# axe DevTools: https://www.deque.com/axe/
```

**Non-Negotiable Requirements:**
- ✅ 4.5:1 contrast ratio for text
- ✅ 44×44px minimum touch targets
- ✅ Visible focus indicators (2px ring)
- ✅ All interactive elements keyboard-accessible
- ✅ `prefers-reduced-motion` respected

📖 **Accessibility Spec:** [VSG_UI_SPECIFICATION.md](./VSG_UI_SPECIFICATION.md) Section 5

---

## **Quick Reference Links**

| Document | Purpose |
|----------|---------|
| [CLAUDE_ACE.md](./CLAUDE_ACE.md) | Design philosophy & craft standards |
| [VSG_DESIGN_PRINCIPLE.md](./VSG_DESIGN_PRINCIPLE.md) | Algorithm-first core principle |
| [VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md](./VSG_UX_INTERACTION_DESIGN_SPECIFICATION.md) | Design tokens, UX patterns, interaction specs |
| [VSG_UI_SPECIFICATION.md](./VSG_UI_SPECIFICATION.md) | Component APIs, implementation patterns |
| [VSG_ARCHITECTURE_DOCUMENT.md](./VSG_ARCHITECTURE_DOCUMENT.md) | Technical architecture, theming, state |
| [VSG_ILLUSTRATION_ICON_GUIDE.md](./VSG_ILLUSTRATION_ICON_GUIDE.md) | Icons, illustrations, empty states |

---

## **Need Help?**

1. **Token questions:** UX Spec Section 2
2. **Component API:** UI Spec Section 4
3. **Dark mode:** Architecture Doc Section 3.5
4. **Icons/illustrations:** Illustration Guide Sections 2-5
5. **Accessibility:** UI Spec Section 5

---

*Last Updated: December 2025 | Version 1.0*
