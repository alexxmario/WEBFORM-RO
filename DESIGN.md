---
name: WebForm
description: Professional website building service for Romanian businesses
colors:
  deep-navy: "#0d0f13"
  ink-white: "#eef0f3"
  surface-card: "#121519"
  muted-surface: "#1f2228"
  muted-ink: "#858a93"
  steel-blue: "#5599d4"
  warm-gold: "#c3a25e"
  quiet-violet: "#7e5fba"
  edge-line: "#25282e"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  sm: "0.625rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
spacing:
  xs: "0.375rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "4rem"
  section: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.steel-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "hsl(210 60% 52%)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.sm}"
    padding: "0 0.75rem"
  card-default:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  input-default:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.sm}"
    padding: "0 1rem"
    height: "2.75rem"
---

# Design System: WebForm

## 1. Overview

**Creative North Star: "The Quiet Authority"**

WebForm's design system speaks with the confidence of someone who knows exactly what they're doing and doesn't need to prove it. Like a well-tailored suit, the premium quality comes from restraint and precision — the cut of the typography, the rhythm of the spacing, the deliberate absence of decoration. Every element earns its place; nothing is ornamental.

The system explicitly rejects three patterns: the generic SaaS aesthetic (radial gradients, glass cards, purple-to-blue color stories that plague every AI-generated landing page), the cheap website builder look (template-preview dashboards, drag-and-drop metaphors, clip-art energy), and over-designed agency sites (parallax everything, navigation buried under effects, beauty at the cost of clarity).

The emotional register is professional warmth without friendliness-theater. Romanian business owners visiting this site should feel they're dealing with competent people who respect their time. Interactions feel smooth and effortless — fluid transitions that anticipate the user rather than react to them.

**Key Characteristics:**
- Dark-first, with depth conveyed through tonal layering rather than shadows
- Typography-driven hierarchy using Space Grotesk for authority and Inter for readability
- Generous whitespace as a signal of confidence, not emptiness
- Steel blue as the sole accent color — used sparingly, never decoratively
- Motion that reveals content naturally, never gates it

## 2. Colors

A restrained dark palette where depth comes from tonal steps in the navy family. Color is used surgically: steel blue marks actionable elements, warm gold appears only on the secondary/pricing CTA, and quiet violet is reserved for rare accent moments. The dark background isn't a trend choice — it's the right canvas for showcasing template previews and letting the product work speak.

### Primary
- **Steel Blue** (hsl(210, 60%, 58%) / #5599d4): The single action color. Buttons, links, focus rings, active states. Its rarity on the page is the point — when steel blue appears, it means "do this."

### Secondary
- **Warm Gold** (hsl(40, 45%, 55%) / #c3a25e): Secondary CTAs and pricing emphasis only. Carries warmth without tipping into cheap territory. Never used for body text or decorative elements.

### Tertiary
- **Quiet Violet** (hsl(260, 40%, 56%) / #7e5fba): Rare accent for badges, tags, or differentiation moments. Maximum one instance per viewport.

### Neutral
- **Deep Navy** (hsl(220, 14%, 6%) / #0d0f13): Body background. Nearly black with enough blue to feel intentional, not generic.
- **Surface Card** (hsl(220, 14%, 8%) / #121519): Card and container backgrounds. One tonal step above the body — visible as a surface, not as a border.
- **Muted Surface** (hsl(220, 12%, 14%) / #1f2228): Input backgrounds, hover states, active wells. The "pressed in" layer.
- **Edge Line** (hsl(220, 10%, 16%) / #25282e): Borders and dividers. Visible on dark but never prominent.
- **Muted Ink** (hsl(220, 8%, 55%) / #858a93): Secondary text. Must maintain 4.5:1 contrast against Deep Navy.
- **Ink White** (hsl(220, 10%, 94%) / #eef0f3): Primary text. Slightly cool to match the navy family.

### Named Rules
**The One Action Rule.** Steel Blue is reserved for interactive elements. If an element isn't clickable, it isn't blue. Background decorations, illustrations, and ambient color never use the primary.

## 3. Typography

**Display Font:** Space Grotesk (with Inter, system-ui fallback)
**Body Font:** Inter (with Segoe UI, system-ui fallback)
**Mono Font:** JetBrains Mono (for code snippets, technical details)

**Character:** Space Grotesk's geometric precision paired with Inter's quiet readability. The display font has authority without being cold; the body font disappears into the content. Together they say "engineered, not decorated."

### Hierarchy
- **Display** (600, clamp(2rem, 5vw, 4.5rem), 1.08 line-height, -0.03em tracking): Hero headlines only. Font-display. One per page maximum.
- **Display-lg** (600, 3.5rem, 1.1, -0.025em): Section headings on the homepage. Font-display.
- **Display-md** (600, 2.5rem, 1.15, -0.02em): Page titles and major section headers. Font-display.
- **Display-sm** (600, 2rem, 1.2, -0.015em): Sub-section headers. Font-display.
- **Headline** (600, 1.5rem, 1.3, -0.01em): Card titles, feature headings. Font-display.
- **Title** (600, 1.25rem, 1.35, -0.01em): Component headers, list headers. Font-display.
- **Body** (400, 1rem, 1.6): Running text. Font-sans. Cap line length at 65ch.
- **Body-lg** (400, 1.125rem, 1.65): Lead paragraphs, feature descriptions. Font-sans.
- **Label** (500, 0.875rem, 1.55): Captions, metadata, navigation links. Font-sans.

### Named Rules
**The Display Ceiling Rule.** Display text never exceeds clamp(2rem, 5vw, 4.5rem). If a heading feels too small, the problem is hierarchy — promote it to a higher level, don't inflate the size.

**The Font-Display Boundary Rule.** Space Grotesk (font-display) is used exclusively at heading-sm and above. Body text, labels, captions, navigation, and form elements always use Inter (font-sans). Mixing them mid-hierarchy undermines the pairing's contrast.

## 4. Elevation

This system is flat by default. Depth is conveyed entirely through tonal layering: body (6% lightness) → card (8%) → muted (14%). No box-shadows are used in the token system. The only elevation effect is a subtle backdrop-blur on the floating header navigation bar, which uses `backdrop-filter: blur(4px)` to suggest it sits above the content without casting a shadow.

### Named Rules
**The Flat Surface Rule.** No box-shadows on cards, containers, or buttons. If an element needs to feel elevated, it gets a lighter background tone and a 1px border at Edge Line color. Shadows are reserved solely for dropdown menus and modal overlays where physical separation from the page is semantically necessary.

## 5. Components

### Buttons
Smooth and effortless — transitions feel fluid, not snappy. Every button has an active scale of 0.98 for tactile feedback.

- **Shape:** Gently curved (0.625rem / rounded-lg for sm/md, 0.75rem / rounded-xl for lg)
- **Primary:** Steel Blue background, white text, height 2.5rem (md), padding 0 1.25rem. The default and most common button.
- **Hover:** Background darkens to 90% opacity. 200ms ease-out transition on all properties.
- **Focus:** 2px ring at ring color (steel blue at 50% opacity), 2px offset matching background.
- **Active:** scale(0.98) — subtle press feedback.
- **Secondary:** Gold background, dark foreground text. Same shape and size scale.
- **Ghost:** Transparent background, 70% foreground text. Hover reveals 5% foreground background tint.
- **Outline:** 1px border at Edge Line, transparent background. Hover lightens border to 20% foreground.
- **Sizes:** sm (h-9, px-4, text-xs), md (h-10, px-5, text-sm), lg (h-12, px-6, text-base), icon (h-10, w-10).

### Cards
- **Corner Style:** 0.75rem (rounded-xl)
- **Background:** Surface Card (#121519)
- **Border:** 1px solid Edge Line (#25282e)
- **Internal Padding:** 1.5rem (p-6)
- **Hover:** 200ms color transition. No shadow, no scale, no lift.
- **Shadow Strategy:** None. See Elevation section.

### Inputs
- **Style:** 1px border at Edge Line, Deep Navy background, 0.625rem radius, height 2.75rem (h-11)
- **Placeholder:** Muted Ink at 60% opacity
- **Hover:** Border lightens to 80% opacity
- **Focus:** Border shifts to Steel Blue at 60%, plus 1px ring at Steel Blue 20%. 150ms transition.
- **Character:** Inputs are understated at rest, clearly active on focus. The focus state is the only time Steel Blue appears on form elements.

### Navigation
The header is a floating bar pinned to the top of the viewport. It uses the glass utility: `backdrop-filter: blur(4px)` with 95% background opacity and a 1px Edge Line border.

- **Typography:** Label size (0.875rem), medium weight, font-sans
- **Default:** 70% foreground opacity
- **Hover:** Full foreground opacity, no background change
- **Active:** Full foreground opacity (no underline, no background highlight)
- **Mobile:** Navigation links hidden below md breakpoint. Auth buttons remain visible.
- **Entry animation:** Framer Motion fade-down (opacity 0 → 1, y -8 → 0, 300ms)

### Footer (Signature Component)
A distinctive large-type treatment: the word "WEBFORM" rendered at 16vw in a near-invisible dark tone (#141414 on #050505), creating a watermark effect. This is the one place the design permits typographic drama — it earns its scale through restraint everywhere else.

- **Layout:** Two-column grid (links left, contact right) above the payment logos strip
- **Link style:** Uppercase, wide tracking (tracking-widest), text-xs, Muted Ink color
- **Note:** Currently uses hardcoded hex values outside the token system. These should be migrated to CSS variables.

## 6. Do's and Don'ts

### Do:
- **Do** use Steel Blue exclusively for interactive elements. If it's not clickable, it's not blue.
- **Do** maintain the tonal layering sequence: body → card → muted. Skip steps and the depth breaks.
- **Do** cap body text line length at 65ch. Romanian words are longer than English on average; without a cap, lines become unreadable.
- **Do** use Space Grotesk for all headings heading-sm and above. Use Inter for everything else.
- **Do** use `text-wrap: balance` on h1-h3 elements to prevent ragged line breaks.
- **Do** respect `prefers-reduced-motion` on every animation. Cross-fade or instant as the fallback.
- **Do** use the existing CSS variable system (`hsl(var(--primary))`) for all colors. Never hardcode hex values in component files.

### Don't:
- **Don't** use radial gradients, glass cards, or glowing orb effects for decoration. These are the generic SaaS tells the brand explicitly rejects.
- **Don't** make it look like a website builder. No drag-and-drop metaphors, no template-preview chrome, no "edit this" affordances on the marketing site.
- **Don't** bury navigation under effects or animations. Every page must be reachable within two clicks from the header.
- **Don't** use box-shadows on cards or buttons. Depth comes from tonal layering, not shadows.
- **Don't** add eyebrow kickers (tiny uppercase labels like "ABOUT" / "PROCESS" / "PRICING") above every section heading. One deliberate kicker is voice; kickers on every section is AI scaffolding.
- **Don't** use numbered section markers (01 / 02 / 03) as default decoration. Numbers earn their place only when the content is genuinely sequential.
- **Don't** hardcode colors outside the CSS variable system. The Footer's `#050505`, `#141414`, `text-neutral-500` pattern is the anti-example — migrate these to variables.
- **Don't** pair two similar sans-serifs. The system uses Space Grotesk (geometric) + Inter (humanist) — that contrast is intentional. Don't introduce a third sans-serif.
