---
title: "feat: Set up Tesouros da Europa branded homepage"
type: feat
status: active
date: 2026-03-22
---

# feat: Set up Tesouros da Europa branded homepage

## Overview

Transform a stock Rails 8.2 app into the branded Tesouros da Europa website with a fully styled homepage. The CLAUDE.md contains a comprehensive brand design system (colour palette, typography, spacing, components) that must be implemented as the CSS foundation, along with a homepage featuring hero, product cards, brand values, and footer — all in Brazilian Portuguese.

## Problem Statement / Motivation

The app is a fresh `rails new` with zero customisation. It has no routes, no controllers, no styles, no brand assets. The brand design system in CLAUDE.md is detailed and ready to be translated into code. This is the foundational setup that all future pages and features will build on.

## Proposed Solution

Build the branded homepage in a single pass, working bottom-up: CSS tokens → layout → partials → page content.

## Technical Approach

### Phase 1: Foundation (CSS + Layout + Config)

**1.1 CSS Design System** — `app/assets/stylesheets/`

Organise CSS into multiple files (Propshaft loads all files in the directory). Use numeric prefixes for load order:

| File | Contents |
|------|----------|
| `00-reset.css` | Minimal reset: box-sizing, margin/padding zero, img block display |
| `01-tokens.css` | All `:root` custom properties from CLAUDE.md (colours, typography, spacing, borders, shadows) |
| `02-typography.css` | Font-face assignments, type scale, heading/body/label rules |
| `03-layout.css` | Container max-width, section padding, responsive grid, breakpoints |
| `04-components.css` | `.btn`, `.badge`, `.field__*`, `.ornament`, `.section-label` |
| `05-nav.css` | Sticky navigation bar, mobile hamburger menu |
| `06-footer.css` | Footer layout and styles |
| `07-product-card.css` | Product card component |
| `08-pages-home.css` | Homepage-specific styles (hero, sections) |

Keep `application.css` as the Propshaft manifest (it auto-includes all files).

**1.2 Application Layout** — `app/views/layouts/application.html.erb`

- Set `<html lang="pt-BR">`
- Update `<title>` default to "Tesouros da Europa — Vintage & Mesa Posta"
- Update `<meta name="application-name">` to "Tesouros da Europa"
- Add Google Fonts `<link>` tags (preconnect + Cormorant Garamond + Cinzel)
- Add `<meta name="description">` with brand tagline in Portuguese
- Wrap `<%= yield %>` in `<main id="conteudo">`
- Add skip-to-content link for accessibility
- Render navigation partial before `<main>`
- Render footer partial after `<main>`
- Style Turbo progress bar to brand gold

**1.3 i18n Configuration**

- Set `config.i18n.default_locale = :"pt-BR"` in `config/application.rb`
- Create `config/locales/pt-BR.yml` with Rails defaults (date formats, number/currency with comma decimal, euro symbol)
- Hardcode Portuguese strings in views for now (i18n keys for Rails internals only)

**1.4 CSP Configuration** — `config/initializers/content_security_policy.rb`

- Enable CSP with `fonts.googleapis.com` in `style_src`
- Add `fonts.gstatic.com` in `font_src`
- Keep `default_src :self`
- Run in enforcing mode (not report-only)

### Phase 2: Navigation + Footer

**2.1 Navigation Partial** — `app/views/shared/_navigation.html.erb`

- Semantic `<nav>` element with `role="navigation"` and `aria-label`
- Brand wordmark as text (Cinzel uppercase, since SVG logotype doesn't exist yet)
- Nav links as anchor links to homepage sections: Colecção (`#colecao`), Sobre (`#sobre`), Contato (`#contato`)
- Mobile: hamburger toggle → full-screen overlay menu
- Requires a `menu_controller.js` Stimulus controller for mobile toggle

**2.2 Footer Partial** — `app/views/shared/_footer.html.erb`

- Semantic `<footer>` element
- Brand name in Cinzel
- Tagline: "Elegância · Tradição · Exclusividade"
- Repeated nav links
- Copyright: "© 2026 Tesouros da Europa. Todos os direitos reservados."
- Ornamental diamond divider above footer

### Phase 3: Homepage

**3.1 PagesController** — `app/controllers/pages_controller.rb`

- Single `home` action (empty — view handles everything)

**3.2 Routes** — `config/routes.rb`

- `root "pages#home"`

**3.3 Homepage View** — `app/views/pages/home.html.erb`

Sections in order:

1. **Hero** — Full-width, `--color-ink-deep` background
   - Headline: "Tesouros da *Europa*" in `--fs-hero` (Europa italic)
   - Subtitle: "Vintage & Mesa Posta"
   - CTA button: "Explorar Colecção" → `#colecao`
   - Diamond ornament below CTA

2. **Featured Products** (`id="colecao"`) — Cream background
   - Section label: "Colecção"
   - Heading: "Peças Garimpadas na *Europa*"
   - 4 placeholder product cards in responsive grid (1-col mobile, 2-col tablet, 4-col desktop)
   - Each card: placeholder cream background image area, category badge "Garimpado na Europa", Portuguese product name, price in `€ XXX,00` format
   - Placeholder products:
     - "Conjunto de Chá Limoges" — Porcelana · € 285,00
     - "Travessa Oval Delft" — Faiança · € 195,00
     - "Taças de Cristal Baccarat" — Cristal · € 420,00
     - "Prato de Sobremesa Meissen" — Porcelana · € 165,00

3. **Brand Values** — Cream-mid background with ornament dividers
   - Section label: "Nossa Essência"
   - Three value columns: Elegância, Tradição, Exclusividade
   - Each with a short 1-2 sentence description in Portuguese curator voice
   - Diamond ornament between sections

4. **About Teaser** (`id="sobre"`) — Cream background
   - Section label: "Sobre Nós"
   - Heading: "Curadoria com olhar atento"
   - 2-3 paragraphs about the brand story (sourcing from European flea markets)
   - No CTA (no about page exists yet)

5. **Contact Teaser** (`id="contato"`) — Ink-deep background
   - Section label: "Contato"
   - Brief text: "Entre em contato para peças especiais e encomendas"
   - Email placeholder (styled, not a functional form)

### Phase 4: Stimulus + Cleanup

**4.1 Remove `hello_controller.js`**

**4.2 Create `menu_controller.js`** — Mobile navigation toggle
- Toggles a `data-menu-open` attribute on the nav
- Accessible: manages `aria-expanded`, traps focus when open

**4.3 Turbo progress bar override**
- In `application.css` or `05-nav.css`: `.turbo-progress-bar { background-color: var(--color-gold-primary); }`

### Phase 5: Database + Verification

**5.1 Run `db:create` and `db:migrate`**
- Creates SQLite databases and Solid Cache/Queue/Cable tables
- No application migrations (products are placeholder HTML, not models)

**5.2 Smoke test**
- Create `test/controllers/pages_controller_test.rb` — assert root returns 200
- Create `test/system/homepage_test.rb` — assert homepage renders hero heading, nav, footer

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CSS file organisation | Numbered prefix files | Propshaft loads alphabetically; prefixes guarantee load order |
| Nav links | Anchor links to homepage sections | No additional pages exist yet; avoids 404s |
| Mobile nav | Hamburger → overlay | Standard pattern, requires minimal Stimulus |
| Product data | Hardcoded HTML placeholders | No Product model yet; avoids premature database design |
| i18n approach | Hardcoded Portuguese + pt-BR locale for Rails internals | Speed over future-proofing; can retrofit later |
| Brand logotype | Text fallback (Cinzel) | SVG assets don't exist in the repo |
| CSS reset | Minimal custom reset | No external dependency, just box-sizing + margin/padding |

## Acceptance Criteria

- [ ] Homepage loads at `/` without errors
- [ ] Google Fonts (Cormorant Garamond + Cinzel) render correctly
- [ ] All CSS custom properties from CLAUDE.md are defined and used (no hardcoded hex in component CSS)
- [ ] Navigation is sticky, dark background, brand name in gold Cinzel uppercase
- [ ] Navigation works on mobile (hamburger toggle)
- [ ] Hero section: full-width dark background, "Tesouros da Europa" in display font
- [ ] 4 product cards render in responsive grid
- [ ] Brand values section with 3 columns
- [ ] Footer with brand name, tagline, copyright
- [ ] `<html lang="pt-BR">` is set
- [ ] CSP allows Google Fonts without console errors
- [ ] Turbo progress bar uses brand gold colour
- [ ] Skip-to-content link present for accessibility
- [ ] All visible text is in Brazilian Portuguese
- [ ] No system fonts (Arial, Helvetica, etc.) visible anywhere
- [ ] No hardcoded hex values in component CSS (only in `:root` tokens)
- [ ] `hello_controller.js` is removed
- [ ] `bin/rails test` passes (smoke tests)

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| SVG brand assets don't exist | Use text-based Cinzel fallback; logotype can be swapped later |
| Google Fonts blocked by CSP | CSP config must whitelist both googleapis.com and gstatic.com |
| Propshaft CSS load order | Numeric prefixes enforce correct cascade |
| Rails 8.2 alpha edge behaviour | App is on `main` branch of Rails; pin to stable if issues arise |

## Files to Create/Modify

### New Files
- `app/assets/stylesheets/00-reset.css`
- `app/assets/stylesheets/01-tokens.css`
- `app/assets/stylesheets/02-typography.css`
- `app/assets/stylesheets/03-layout.css`
- `app/assets/stylesheets/04-components.css`
- `app/assets/stylesheets/05-nav.css`
- `app/assets/stylesheets/06-footer.css`
- `app/assets/stylesheets/07-product-card.css`
- `app/assets/stylesheets/08-pages-home.css`
- `app/controllers/pages_controller.rb`
- `app/views/pages/home.html.erb`
- `app/views/shared/_navigation.html.erb`
- `app/views/shared/_footer.html.erb`
- `app/javascript/controllers/menu_controller.js`
- `config/locales/pt-BR.yml`
- `test/controllers/pages_controller_test.rb`
- `test/system/homepage_test.rb`

### Modified Files
- `app/views/layouts/application.html.erb` — full overhaul
- `app/assets/stylesheets/application.css` — keep as manifest, may add Turbo bar override
- `config/routes.rb` — add root route
- `config/application.rb` — set default locale
- `config/initializers/content_security_policy.rb` — enable and configure

### Deleted Files
- `app/javascript/controllers/hello_controller.js`

## Sources & References

- Brand design system: `CLAUDE.md` (project root)
- Rails 8 Propshaft docs: asset pipeline auto-includes all files in `app/assets/stylesheets/`
- Google Fonts API: Cormorant Garamond + Cinzel families
- WCAG 2.1 AA: contrast ratios, lang attribute, skip navigation
