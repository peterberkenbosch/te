# Tesouros da Europa — Website Development Guide

> This file instructs Claude on how to build, maintain and extend the
> Tesouros da Europa website. Read it fully before touching any code.

---

## Project Overview

**Tesouros da Europa** is a Brazilian e-commerce brand selling vintage European
tableware (mesa posta) sourced from European flea markets and antique fairs.
The website must reflect the brand's core values: **elegância, tradição,
exclusividade**. Every line of code and every design decision should feel
curated, not generated.

- **Language:** Portuguese (Brazilian)
- **Stack:** (to be defined per project — see Stack section below)
- **Tone:** Luxury vintage. Never discount, never loud, never generic.

---

## Stack & Conventions

### Preferred Stack
- **Framework:** Rails 8 (Hotwire / Turbo / Stimulus) — no React unless explicitly requested
- **CSS:** Plain CSS with custom properties — no Tailwind unless explicitly requested
- **JS:** Stimulus controllers only — no heavy JS frameworks
- **Fonts:** Google Fonts — Cormorant Garamond + Cinzel (see Typography below)
- **Images:** Lazy-loaded, always with descriptive `alt` text in Portuguese

### File Conventions
- CSS custom properties defined in `:root` in `application.css`
- One Stimulus controller per behaviour — keep them small
- Partials for all repeated UI elements (cards, badges, ornaments)
- No inline styles except for dynamic values (e.g. colour swatches)

### Rails Conventions
- Follow DHH / 37signals idiomatic Rails — boring is good
- Hotwire for all interactivity before reaching for JS
- Turbo Frames for product filtering, cart updates
- No JavaScript build pipeline — importmap only

---

## Brand Design System

### Colour Palette

All colours must be applied via CSS custom properties. Never hardcode hex
values in component CSS — always reference a token.

```css
:root {
  /* Gold — Primary */
  --color-gold-primary:   #C4973A;
  --color-gold-light:     #D4A84A;
  --color-gold-highlight: #E8B84A;
  --color-gold-dark:      #8B6820;
  --color-gold-deep:      #6A4C10;

  /* Botanical — Secondary */
  --color-sage:           #8A7540;
  --color-sage-light:     #A8924C;

  /* Cream — Backgrounds */
  --color-cream:          #FAF7F0;
  --color-cream-mid:      #F2EDE2;
  --color-cream-dark:     #E8DFC8;

  /* Ink — Text & Dark surfaces */
  --color-ink-deep:       #1A1510;
  --color-ink-dark:       #2C2218;
  --color-ink-mid:        #4A3820;
  --color-ink-light:      #7A6A45;
}
```

**Colour rules:**
- Primary background: `--color-cream`
- Body text: `--color-ink-mid`
- All gold decorative elements: `--color-gold-primary`
- Dark sections (nav, footer, hero overlays): `--color-ink-deep`
- Hover states: shift one step lighter on gold, one step darker on cream
- Never use pure `#000000` or `#FFFFFF` — always use ink/cream tokens

---

### Typography

```css
:root {
  --font-display: 'Cormorant Garamond', Palatino, 'Book Antiqua', serif;
  --font-label:   'Cinzel', 'Trajan Pro', serif;
  --font-body:    'Cormorant Garamond', Palatino, serif;
}
```

**Google Fonts embed (place in `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap" rel="stylesheet">
```

**Type scale:**

| Token          | Size                    | Font                          | Weight | Use                          |
|----------------|-------------------------|-------------------------------|--------|------------------------------|
| `--fs-hero`    | `clamp(48px, 8vw, 96px)`| Cormorant Garamond Italic     | 300    | Hero wordmark                |
| `--fs-h1`      | `clamp(32px, 5vw, 48px)`| Cormorant Garamond Italic     | 400    | Page headings                |
| `--fs-h2`      | `clamp(24px, 3.5vw, 36px)`| Cormorant Garamond Italic   | 400    | Section titles               |
| `--fs-label`   | `10px`                  | Cinzel, letter-spacing: 4px   | 500    | Labels, badges, nav, ribbon  |
| `--fs-body`    | `17px`                  | Cormorant Garamond            | 400    | Running text                 |
| `--fs-caption` | `13px`                  | Cormorant Garamond            | 400    | Captions, meta               |
| `--fs-micro`   | `9px`                   | Cinzel, letter-spacing: 4px   | 400    | Circular text, micro labels  |

**Typography rules:**
- `h1`, `h2`, `h3` — always Cormorant Garamond **italic**
- Labels, nav items, badges, button text — always Cinzel **uppercase** with letter-spacing ≥ 3px
- Body copy — Cormorant Garamond upright, never italic for running text
- Line height: 1.7 for body, 1.1–1.15 for display headings
- Never set the brand name "Europa" upright — it is always italic
- Never use system fonts (Arial, Helvetica, sans-serif) anywhere visible

---

### Spacing Scale

```css
:root {
  --space-1:  4px;    /* micro gaps, letter-spacing adjustments */
  --space-2:  8px;    /* icon-to-label, tight stacks */
  --space-3:  16px;   /* card padding, list gaps */
  --space-4:  24px;   /* section sub-spacing, grid gaps */
  --space-5:  40px;   /* card-to-card, component groups */
  --space-6:  64px;   /* section internal padding */
  --space-7:  96px;   /* section vertical rhythm */
  --space-8:  128px;  /* hero padding, major page breaks */
}
```

---

### Borders, Radius & Shadows

```css
:root {
  --radius-sm: 2px;    /* buttons, badges — barely rounded */
  --radius-md: 4px;    /* cards, inputs, image containers */
  --radius-lg: 8px;    /* large cards, modals */

  --border-gold:       1px solid var(--color-gold-primary);
  --border-gold-faint: 1px solid var(--color-cream-dark);
  --border-gold-inner: 0.6px solid var(--color-gold-primary);

  --shadow-card: 0 2px 24px rgba(26, 21, 16, 0.10);
  --shadow-lift: 0 8px 40px rgba(26, 21, 16, 0.15);
}
```

---

### Brand Assets (SVG)

All brand SVG assets live in `app/assets/images/brand/`. Reference them as
inline SVG where possible (for colour control) or as `<img>` for static use.

| File                                  | Use                                    |
|---------------------------------------|----------------------------------------|
| `tesouros_da_europa_logotype.svg`     | Header, footer, OG image              |
| `tesouros_da_europa_seal.svg`         | About page, packaging references      |
| `tesouros_da_europa_thankyou_card.svg`| Order confirmation email preview      |

**SVG colour overrides:** The logotype SVG uses hardcoded brand hex values.
Do not attempt to override via CSS `fill` unless the SVG has been refactored
to use `currentColor`.

---

### Ornamental System

The brand uses a consistent set of SVG ornaments. Always use these — never
substitute with emoji, icon libraries, or border tricks.

**Diamond rule (horizontal divider):**
```html
<div class="ornament">
  <div class="ornament__line"></div>
  <div class="ornament__dot"></div>
  <div class="ornament__diamond"></div>
  <div class="ornament__dot"></div>
  <div class="ornament__line"></div>
</div>
```
```css
.ornament { display: flex; align-items: center; gap: 12px; opacity: 0.45; }
.ornament__line    { flex: 1; height: 1px; background: var(--color-gold-primary); max-width: 200px; }
.ornament__diamond { width: 7px; height: 7px; background: var(--color-gold-primary); transform: rotate(45deg); flex-shrink: 0; }
.ornament__dot     { width: 3px; height: 3px; background: var(--color-gold-primary); border-radius: 50%; flex-shrink: 0; }
```

**Section label (eyebrow text):**
```html
<p class="section-label">Colecção</p>
```
```css
.section-label {
  font-family: var(--font-label);
  font-size: var(--fs-label);
  letter-spacing: 5px;
  color: var(--color-gold-primary);
  text-transform: uppercase;
}
```

---

## UI Components

### Buttons

```css
.btn {
  font-family: var(--font-label);
  font-size: 9px;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

/* Primary */
.btn--primary { background: var(--color-gold-primary); color: var(--color-ink-deep); }
.btn--primary:hover { background: var(--color-gold-light); }

/* Outline */
.btn--outline { background: transparent; color: var(--color-gold-primary); border: 1px solid var(--color-gold-primary); }
.btn--outline:hover { background: var(--color-gold-primary); color: var(--color-ink-deep); }

/* Dark */
.btn--dark { background: var(--color-ink-deep); color: var(--color-gold-primary); border: 1px solid var(--color-gold-dark); }
.btn--dark:hover { border-color: var(--color-gold-primary); }
```

### Badges

```css
.badge {
  font-family: var(--font-label);
  font-size: 8px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: var(--radius-sm);
}
.badge--gold    { background: #FBF2E0; color: var(--color-gold-dark); border: 1px solid #EFD898; }
.badge--sage    { background: #EFF0E6; color: #5A5A28; border: 1px solid #C8C89A; }
.badge--ink     { background: var(--color-ink-deep); color: var(--color-gold-primary); }
.badge--outline { background: transparent; color: var(--color-gold-primary); border: 1px solid var(--color-gold-primary); }
```

### Form Fields

```css
.field__label {
  font-family: var(--font-label);
  font-size: 8px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-ink-light);
  display: block;
  margin-bottom: 6px;
}
.field__input {
  font-family: var(--font-body);
  font-size: 15px;
  padding: 11px 14px;
  border: 1px solid var(--color-cream-dark);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  color: var(--color-ink-deep);
  width: 100%;
  transition: border-color 0.2s;
}
.field__input:focus { outline: none; border-color: var(--color-gold-primary); }
```

### Product Card

```css
.product-card {
  border: 1px solid var(--color-cream-dark);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover { box-shadow: var(--shadow-lift); transform: translateY(-2px); }

.product-card__image  { aspect-ratio: 4/3; background: var(--color-cream-mid); overflow: hidden; }
.product-card__image img { width: 100%; height: 100%; object-fit: cover; }
.product-card__body   { padding: var(--space-3) var(--space-3) var(--space-4); }
.product-card__cat    { font-family: var(--font-label); font-size: 7.5px; letter-spacing: 3px; text-transform: uppercase; color: var(--color-gold-primary); display: block; margin-bottom: 6px; }
.product-card__title  { font-family: var(--font-display); font-size: 20px; font-style: italic; font-weight: 400; color: var(--color-ink-deep); line-height: 1.2; margin-bottom: 8px; }
.product-card__price  { font-family: var(--font-label); font-size: 11px; letter-spacing: 1px; color: var(--color-gold-dark); }
```

### Navigation

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-ink-deep);
  border-bottom: 1px solid var(--color-gold-dark);
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-5);
  justify-content: space-between;
}
.nav__brand {
  font-family: var(--font-label);
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--color-gold-primary);
  text-transform: uppercase;
  text-decoration: none;
}
.nav__link {
  font-family: var(--font-label);
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--color-cream-dark);
  text-decoration: none;
  text-transform: uppercase;
  opacity: 0.7;
  transition: opacity 0.2s, color 0.2s;
}
.nav__link:hover { opacity: 1; color: var(--color-gold-primary); }
```

---

## Page Structure

### Layout Conventions
- Max content width: `1100px`, centred, `padding: 0 40px`
- Mobile padding: `0 20px`
- Sections: `padding: 80px 0 64px`, `border-bottom: 1px solid var(--color-cream-dark)`
- Hero sections: full-width, `background: var(--color-ink-deep)`
- Grid: CSS Grid, no Bootstrap, no frameworks

### Responsive Breakpoints
```css
/* Mobile first */
@media (min-width: 640px)  { /* sm — tablet portrait */ }
@media (min-width: 768px)  { /* md — tablet landscape */ }
@media (min-width: 1024px) { /* lg — desktop */ }
@media (min-width: 1280px) { /* xl — wide */ }
```

---

## Content & Copy Rules

### Language
- All UI copy in **Portuguese (Brazilian)**
- Product descriptions may include origin country in parentheses: "Porto, Portugal"
- Prices always formatted as: `R$ 285,00` (Real sign, space, comma decimal)

### Canonical Brand Phrases
Use these exact strings — do not paraphrase:

| Phrase | Context |
|--------|---------|
| `Garimpado na Europa` | Product provenance badge |
| `Qualidade Premium` | Seal / badge label |
| `Elegância · Tradição · Exclusividade` | Brand values tagline |
| `Vintage & Mesa Posta` | Brand descriptor — always follows logotype |
| `Mesa Posta de Época` | Category label for full table setting items |
| `Peça garimada na Europa` | Short provenance note on cards/receipts |
| `Curadoria especial para sua mesa` | Secondary tagline, order confirmation |
| `Com elegância e tradição,` | Sign-off on cards and emails |

### Tone Rules
- Write like a knowledgeable, warm curator — never a sales machine
- No exclamation marks in product descriptions
- No urgency language ("últimas unidades!" is acceptable only in stock alerts, never in editorial copy)
- Capitalise "Europa" — it is always a proper noun in brand context
- Always use `&` (ampersand) in the brand name, never "e" or "and"

---

## Voice & Tone (do / don't)

| ✓ Do | ✗ Don't |
|------|---------|
| "Garimpada nas feiras de Paris, esta peça carrega a história de outra época." | "Compra já! Oferta limitada!" |
| "Curadoria com olhar atento para a beleza que o tempo aperfeiçoa." | "Os melhores preços do mercado." |
| "Cada peça é única — escolhida a mão, transportada com cuidado." | Emojis, slang, or casual shorthand |
| "Para a sua mesa, o melhor da Europa." | "Promoção especial só hoje." |

---

## Accessibility

- All images must have descriptive `alt` text in Portuguese
- Colour contrast: gold on cream must meet WCAG AA (`#C4973A` on `#FAF7F0` = 3.2:1 — use for large text only; for body text use `--color-ink-mid` on cream)
- Focus states: `outline: 2px solid var(--color-gold-primary); outline-offset: 3px`
- Never remove focus outlines — style them on-brand instead
- `font-size` never below `12px` for any readable content

---

## What Claude Should Never Do

- ❌ Use `Arial`, `Helvetica`, `Inter`, `Roboto` or any sans-serif font
- ❌ Use purple, blue, or any colour not in the brand palette for UI elements
- ❌ Add Bootstrap, Bulma, or any CSS framework unless explicitly asked
- ❌ Use React, Vue, or any SPA framework unless explicitly asked
- ❌ Hardcode hex values in component CSS — always use tokens
- ❌ Write copy with exclamation marks in editorial contexts
- ❌ Set headings in upright (non-italic) Cormorant Garamond for brand headings
- ❌ Use rounded corners > `8px` (except for circular elements like the seal)
- ❌ Use emoji anywhere in the UI
- ❌ Generate placeholder content in English — always use Portuguese

---

## Asset Inventory

```
app/assets/images/brand/
├── tesouros_da_europa_logotype.svg        # Primary wordmark
├── tesouros_da_europa_seal.svg            # Wax seal (both colourways)
├── tesouros_da_europa_thankyou_card.svg   # Thank-you card front
├── tesouros_card_back_no_text.svg         # Card back — decoration only
└── tesouros_card_back_with_text.svg       # Card back — with Obrigada message

public/
└── tesouros_da_europa_styleguide.html     # Full brand style guide (internal)
```

---

## Quick Reference

```
Brand name:      Tesouros da Europa
Descriptor:      Vintage & Mesa Posta
Primary colour:  #C4973A  (Gold Primary)
Background:      #FAF7F0  (Cream)
Dark surface:    #1A1510  (Ink Deep)
Display font:    Cormorant Garamond Italic 300/400
Label font:      Cinzel 400/500 uppercase
Body font:       Cormorant Garamond 400 upright
Base font size:  17px
Line height:     1.7
Max width:       1100px
Border radius:   2px (elements) / 4px (cards)
```

---

*Last updated: 2025 · Tesouros da Europa · Confidential*
