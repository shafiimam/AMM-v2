# Accessibility Audit — AMM-v2 Shopify Theme

**Standard:** WCAG 2.2 Level AA
**Date:** 2026-06-19
**Scope:** Full theme — `layout/`, 93 sections, 73 snippets, 3 blocks, custom JS (`theme.js`, `amm-shop-the-look.js`, `360-knob.js`, `angle.js`, `wishlist-script.js`), CSS (`theme.css`, `custom.css`, `amm-shop-the-look.css`, `section-3d-gallery.css`). Minified vendor bundles excluded.
**Method:** 9 parallel domain audits (global/nav, forms, product/cart, widgets, media, content, JS, CSS, blocks).

---

## Executive Summary

The theme ships on a **well-built vendored framework** (Impulse/Shopify: `DialogElement`, `Modal`, `Drawer`, `Tabs`, `Listbox`, `AccordionDisclosure`, `EffectCarousel`). These handle focus trap, `aria-modal`, Escape, and focus restore correctly — **they are not the problem.**

**Nearly every real barrier lives in custom theme code** layered on top: hand-rolled modals/drawers, drag-only 3D viewers, AI-generated blocks, dynamic status updates with no live regions, and heading markup that renders visual headings as `<p>`.

**Top systemic gaps (fixing these clears the most findings):**

1. **Custom modals/drawers skip focus management** — newsletter popup, shop-the-look drawer/hotspots, both `ai_gen` block modals, image hotspots.
2. **Dynamic updates are silent** — no `aria-live`/`role="status"` on add-to-cart, free-shipping bar, inventory, search counts, filter counts, wishlist, form errors, countdown.
3. **Drag/3D widgets have no keyboard path** — 360-knob, 3D galleries, before/after slider.
4. **Heading semantics broken** — `heading_tag` settings render as `<p class>`; duplicate/illegal/skipped `h1`–`h6`.
5. **`prefers-reduced-motion` essentially absent** despite heavy AOS/marquee/carousel animation.
6. **Icon-only controls missing accessible names**; **form errors not programmatically associated**.

**Verdict:** Not AA-compliant in current state. No findings are unfixable; most are small, localized edits. Several are one-line bug fixes.

---

## Cross-Cutting Themes (fix once, resolve many)

| # | Theme | WCAG | Files affected |
|---|-------|------|----------------|
| A | Custom modals lack focus trap / move-in / restore / `aria-modal` / name | 2.1.2, 2.4.3, 4.1.2 | `newsletter-popup`, `amm-shop-the-look.js`, `ai_gen_block_219fc88`, `ai_gen_block_dc84923`, `image-hotspot` |
| B | Dynamic content not announced (no live region) | 4.1.3, 3.3.1 | `buy-buttons`/cart, `free-shipping-bar`, `inventory`, `predictive-search`, `main-collection`, `active-facets`, `wishlist-script`, `banner`, `countdown`, `amm-shop-the-look.js` |
| C | Drag/3D widgets keyboard-inoperable + no pointer alternative | 2.1.1, 2.5.7 | `360-knob`, `3d-gallery`, `3d-gallery-simple`, `angle.js`, `before-after` |
| D | Visual headings rendered as `<p>`; broken hierarchy | 1.3.1, 2.4.6 | `rich-text`, `multi-column`, `map-with-text`, `list-column`, `releases`, `events-section`, `timeline`, `jordan-2-header`, `multiple-media-with-text` |
| E | No global `prefers-reduced-motion` reset | 2.3.3 | `theme.css` + AOS, marquees (`jordan-2-infinity-images`, `scrolling-content`), autoplay videos |
| F | Icon-only buttons without accessible name | 1.1.1, 4.1.2 | `reviews-slider`, `aj4/amm-af1/amm95-3d-gallery`, header wishlist, `icons.liquid` SVGs |
| G | Autoplay/moving content without user pause control | 2.2.2 | `slideshow`, `announcement-bar`, marquees, autoplay videos |

---

## CRITICAL — block AT users; fix before merge

### Keyboard operability (SC 2.1.1)
- **`sections/image-hotspot.liquid:11-27, 200-209`** — Hotspots are `<div>` with click-only handlers: not focusable, no `role`, no name, no Escape. Keyboard/switch users cannot open any hotspot. **FIX:** render each as `<button aria-expanded aria-controls>` with `sr-only` title; wire keydown + Escape.
- **`sections/3d-gallery.liquid:13-27` & `sections/3d-gallery-simple.liquid:14-28` & `snippets/360-knob.liquid:22-27` & `assets/360-knob.js:65-120`** — 360 viewer rotates by mouse/touch drag only; knob is a non-focusable `<div>`, no keyboard, no `role`. **FIX:** make knob `role="slider" tabindex="0"` with `aria-valuemin/max/now` + `aria-label`; handle Arrow/Home/End to step frames; add prev/next `<button>`s as a non-drag pointer alternative.
- **`sections/before-after.liquid:113-121`** — Divider handle is `<div tabindex="0">` with only an `sr-only` label; no slider semantics, no arrow-key move, no pointer alternative to drag. **FIX:** `role="slider"` + `aria-valuemin/max/now` + ArrowLeft/Right handling.

### Custom modal focus management (SC 2.1.2 / 2.4.3 / 4.1.2)
- **`sections/newsletter-popup.liquid:12`** (extends `PopIn`, `theme.js:2905` `shouldTrapFocus=false`) — Auto-opening dialog does **not** trap focus, sets no `aria-modal`, never moves focus in. Keyboard users tab into the obscured page. **FIX:** render via `x-modal`, or override `shouldTrapFocus` + add `aria-modal` + `initial-focus`.
- **`assets/amm-shop-the-look.js:75-87` (hotspot card) & `:153-219` (product drawer)** — Open = class toggle only. No focus move-in, no trap, no Escape, no restore, no `aria-expanded`/`role=dialog`. **FIX:** move focus in, trap Tab, Escape to close, restore to trigger, toggle ARIA state.
- **`blocks/ai_gen_block_219fc88.liquid:644-651`** & **`blocks/ai_gen_block_dc84923.liquid:165-205`** — Modals open without focus trap; `219fc88` dialog also has no accessible name (`aria-labelledby` not wired to title at `:655`); `dc84923` calls `.focus()` on a div with no `tabindex="-1"` (no-op). Background not `inert`. **FIX:** `tabindex="-1"` + focus trap + move-in + `inert` background; add `id` to title and `aria-labelledby`. (Note: `dc84923` *does* restore focus on close — keep that.)

### Status messages not announced (SC 4.1.3 / 3.3.1)
- **`snippets/banner.liquid:17`** — Form error banner (login/register/contact/newsletter/reset/activate/address) is a plain `<div>`, no `role="alert"`. Failed submits are silent. **FIX:** add `role="alert"` on the error variant.
- **`snippets/free-shipping-bar.liquid:33` (+ `theme.js:2104-2128`)** — "X away / you qualified" text swapped via `innerHTML`, no live region. **FIX:** `role="status" aria-live="polite" aria-atomic="true"`; mark the duplicate progress fill `aria-hidden` or give it `role="progressbar"`.
- **`snippets/countdown.liquid:111`** — On expiry, JS replaces `#countdown` with bare "EXPIRED"; ticking digits have no `role="timer"`. **FIX:** `role="timer" aria-live="off"` on container; announce expiry via separate `role="status"` region instead of destroying structure.

### Text alternatives / contrast (SC 1.1.1 / 1.4.1 / 1.4.3)
- **`snippets/star-rating-icon.liquid:1-16`** — Rating is filled-vs-empty SVGs only; no text alternative, shape/color-only. SR users get nothing. **FIX:** add `<span class="sr-only">{{ rating }} out of 5 stars</span>` + `aria-hidden="true" focusable="false"` on SVGs.

### Navigation (SC 4.1.2 / 2.1.1 / 1.3.1)
- **`sections/header.liquid:104`** — Hamburger button has `aria-controls` but no `aria-expanded` / `aria-haspopup`; no state feedback. **FIX:** add `aria-expanded` (JS-toggled) + `aria-haspopup="dialog"`.
- **`snippets/header-sidebar.liquid:47`** — Drawer has no `role="dialog"` / `aria-modal` in markup. **FIX:** add both + `aria-label`; verify the custom element traps focus, closes on Escape, restores to hamburger.
- **`sections/header.liquid:146-200`** — Desktop mega-menu uses `<details>/<summary>` with `trigger="hover"`; hover-only config gives no guaranteed keyboard path, no `aria-expanded`/`aria-haspopup`. **FIX:** ensure Enter/Space toggle + Escape regardless of hover; expose ARIA state; confirm `data-follow-link` doesn't hijack keyboard activation.

### Content / structure (SC 1.3.1 / 2.4.6)
- **`sections/events-section.liquid:1-2`** — Forces `<h1 class="sr-only">Events Section</h1>` that collides with the page/banner `h1`; events use `<h2>` under it. **FIX:** make section heading `<h2>` (sr-only ok), demote event titles to `<h3>`.
- **`sections/timeline.liquid:19, 137-141`** — Hardcoded `<h1>` in a reusable section; title also uses `background-clip:text` transparent fill (invisible to sighted users). **FIX:** `<h2>` (or `heading_tag` setting) + visible color fallback.
- **`sections/map-with-text.liquid:34-38`** — Raw merchant `{{ section.settings.map }}` output, no enforced `<iframe title>`. **FIX:** render iframe yourself with `title` + provide a text address alternative.

### Focus indicator (SC 2.4.7 / 2.4.11)
- **`assets/amm-shop-the-look.css:767-769`** — `.amm-stl-product-item__quick-add-btn:focus,:focus-visible { outline: none }` removes the keyboard focus ring entirely. **FIX:** `outline: 2px solid #000; outline-offset: 2px;` and drop the bare `:focus`.

---

## HIGH — real barriers; should fix before merge

### Status / live regions (SC 4.1.3)
- **`snippets/buy-buttons.liquid` + product-card quick-adds** — Add-to-cart has no success/cart-count announcement; only the drawer opening. **FIX:** visually-hidden `role="status"` updated on success.
- **`snippets/inventory.liquid:71-78`** — Variant stock change re-renders silently; `<progress-bar>` has `aria-valuenow/max` but no `role="progressbar"`/name (ARIA ignored without role). **FIX:** `aria-live="polite" role="status"` on `<variant-inventory>`; add `role="progressbar"` + `aria-label` (or `aria-hidden` if decorative).
- **`sections/main-collection.liquid:194-198`** & **`snippets/active-facets.liquid`** — Filtered result count + active filters update silently. **FIX:** `aria-live="polite"` / `role="status"` on the count + active-facets container.
- **`sections/predictive-search.liquid:87-219`** — No live region announcing result count; results not exposed as combobox options. **FIX:** add hidden `aria-live="polite"` announcing "N results"; verify host wires `role="combobox"` + `aria-controls`.
- **`assets/amm-shop-the-look.js:221-285, 302-323`** — Add-to-cart success + "Please select a size" error injected with no `role="alert"`/`aria-live`; error auto-removes after 4s. **FIX:** `role="alert"` (or persistent `aria-live`), don't auto-dismiss validation errors.

### Carousels / motion (SC 2.2.2)
- **`sections/slideshow.liquid:12-29`** — Autoplay (default on) has no pause/stop control; pause is only implicit (hover/visibility). **FIX:** keyboard-reachable Pause/Play toggle with `aria-pressed`, or default autoplay off.
- **`sections/slideshow.liquid:30-189`** — Non-current slides not `aria-hidden`/`inert`; SR announces all slides, keyboard lands on off-screen CTAs. **FIX:** `aria-hidden` + remove from tab order on inactive slides; add `aria-roledescription="carousel"`/`"slide"` + "X of N".
- **`assets/theme.js:1327-1332`** — Carousel Arrow nav only fires when the carousel element itself is focused, and slideshow renders no visible prev/next buttons → dots are the only control. **FIX:** render labeled Previous/Next `<button>`s.
- **`sections/announcement-bar.liquid:48-52`** — Auto-rotating, no `aria-live`, no pause. **FIX:** `aria-live="polite"` + pause control.
- **`sections/jordan-2-infinity-images.liquid:14-31`** — Infinite 45s marquee, no pause, ignores reduced-motion. **FIX:** pause control + disable under `prefers-reduced-motion`.
- **`sections/jordan-2-gallery.liquid:33-37`** — AOS fade animations, no reduced-motion gate. **FIX:** gate AOS behind `prefers-reduced-motion: no-preference`.

### Forms (SC 3.3.1 / 3.3.2 / 4.1.2)
- **`snippets/input.liquid:62-64`** — Inputs never get `aria-invalid`/`aria-describedby` even when `form.errors` exist. **FIX:** emit both on errored fields, referencing per-field error text.
- **`sections/main-customers-activate-account.liquid:19,22`** — Password fields missing `required: true` (reset-password sets it). **FIX:** add `required: true` to both.
- **`snippets/checkbox.liquid:28-34` / `snippets/select.liquid:43`** — Required state via native attr only; no `aria-required` / visible indicator; `contact.liquid:45` hardcodes `required: true`. **FIX:** add `aria-required` + visible marker; pass `block.settings.required`.

### Headings rendered as `<p>` (SC 1.3.1 / 2.4.6)
- **`sections/rich-text.liquid:34`, `sections/multi-column.liquid:78`, `sections/map-with-text.liquid:51`** — `heading_tag` (h1–h6, often default h1) rendered as `<p class="{{ heading_tag }}">`. Pages may have **no real heading**. **FIX:** render `<{{ heading_tag }}>` for h1–h6; `<p>` only for the "Paragraph" option.
- **`sections/list-column.liquid:14-21`** — Item titles `<p class="h3">`, no real headings, no list semantics; hover-reveal image is mouse-only (also SC 2.1.1). **FIX:** real headings + `role="list"`; reveal on focus too.
- **`sections/releases.liquid:3,7,9-11`** — Skipped/inverted levels (`h2`→`h4`→`h3`) and redundant `aria-label` on `<h3>/<p>` duplicating visible text. **FIX:** single heading level per card; remove the `aria-label`s.

### Markup bugs harming AT (SC 1.3.1 / 4.1.1 / 1.1.1)
- **`sections/jordan-2-header.liquid:35-36`** — `<h1>…</h2>` (illegal close); also wraps `h1`+`p` inside one `<a>` (`:34-37`), and logo `alt="jordan-logo"` (`:5`). **FIX:** close `</h1>`; only wrap a discrete CTA; meaningful logo alt.
- **`sections/jordan-2-video.liquid:3`** — YouTube iframe has no `title`. **FIX:** add descriptive `title`.
- **`sections/hero-with-logo.liquid:8-15`** — `alt="background"` placeholder + duplicate `id="clipped"`. **FIX:** `alt=""` (decorative) + unique IDs.
- **`snippets/icon.liquid` + `sections/slideshow.liquid:225`** — Renders `'arrow-down-2'`, which is not a defined icon case → empty glyph on the next-section button. **FIX:** use `'arrow-down'` or add the case.

### Icon-only buttons (SC 1.1.1 / 4.1.2)
- **`sections/reviews-slider.liquid:35-36`** — `.glider-prev/next` are SVG-only, no name; also invalid `<dib>` typo (`:9,31`) and "image of {name}" alt (`:13`). **FIX:** `aria-label="Previous/Next reviews"`, fix `<div>`, drop "image of".
- **`sections/aj4/amm-af1/amm95-3d-gallery.liquid`** — Prev/next `<button>`s have SVG only, no `aria-label`, SVG not `aria-hidden`. **FIX:** add labels + `aria-hidden` SVGs.
- **`sections/header.liquid:249`** — Wishlist `<a>` outside `<li>`, icon-only, no name. **FIX:** wrap in `<li>` + `sr-only` "Wishlist".

### Over-labeling (SC 4.1.2 / 2.5.3 Label in Name)
- **`snippets/button.liquid:134,138`** — Every `<a>`/`<button>` gets an unconditional `aria-label` = content+title, overriding (and possibly diverging from) visible text; breaks voice-control "click <visible text>". **FIX:** only emit `aria-label` when explicitly passed or for icon-only controls.

### Misc HIGH
- **`snippets/blog-post-card.liquid:33,73,94`** — Three links to same article; image link mislabeled "Share: {title}". **FIX:** one named link per card; image link `aria-hidden`/empty.
- **`layout/theme.liquid:149`** — Skip link has `role="button"` on an `<a href="#main">` (misrepresented). **FIX:** remove `role`; verify visible-on-focus.

---

## MEDIUM — maintainability / partial barriers

- **`snippets/quantity-selector.liquid:92-95`** — Product-page **increase** (`+`) button announces "decrease quantity" (wrong `sr-only` string). *(Confirmed by two audits.)* **FIX:** `'product.quantity.increase_quantity' | t`. *(Borderline HIGH — trivial one-line fix.)*
- **`snippets/variant-picker.liquid:65-90` / `option-value.liquid:175-177`** — Selected-value span not tied to group (no `aria-live`); legend hardcodes trailing `:`; verify selected/disabled swatch state isn't color-only. **FIX:** `aria-live` on value; move `:` to CSS; non-color selected/disabled indicators.
- **`snippets/product-quick-buy.liquid` / product-card(-horizontal)`** — Cloned `<template>` may inject duplicate `id`s when multiple quick-buys open. **FIX:** uniquify cloned IDs per CLAUDE.md rule.
- **`snippets/product-card.liquid:84-111` / `product-card-horizontal.liquid:19`** — `| default:` applied to whole `image_tag` string, so blank media alt yields `alt=""` instead of product-title fallback. **FIX:** compute `img_alt` first, pass as `alt:`.
- **Autoplay looping videos** — `multiple-media-with-text:98`, `media-grid:72`, `split-media-heo:96-130`, `image-with-text:62-73`, `multi-column` video, `ai_gen_block_219fc88:565-574`: loop with controls hidden, no reduced-motion gate (muted, so no audio issue). **FIX:** keep controls available or honor `prefers-reduced-motion`.
- **Contrast over merchant images** — `hero-with-logo:20`, `jordan-2-header:53-67`, `beach-location-banner:4-5`: white text over uploaded bg, no scrim. **FIX:** configurable overlay/scrim.
- **`sections/main-customers-account.liquid:98`** — `<tr onclick=…>` mouse-only row nav (mobile cards have real links). **FIX:** real `<a>` on order name.
- **`sections/text-with-icons.liquid:50` / `timeline.liquid:27`** — `role="region"` / carousel-navigation without accessible name. **FIX:** add `aria-label`.
- **`sections/featureed-image-and-products.liquid:4-9`** — Featured image gets no `alt`. **FIX:** pass alt.
- **`sections/collection-list.liquid:116`** — `aria-label` reads "…the  collection" when title blank; label-in-name risk. **FIX:** guard blank + match visible text.
- **`sections/scrolling-content.liquid:14`** — Marquee pause only on hover. **FIX:** reduced-motion + visible pause.
- **`snippets/countdown.liquid:25`** — Typo `block.settigns` (gate never works) + duplicate `id="countdown"`. **FIX:** `block.settings`; use unique class selector.
- **`snippets/localization-selector.liquid:44-66`** — `role="option"` children but container has no `role="listbox"`/name. **FIX:** ensure `<x-listbox>` exposes listbox role + name + keyboard + Escape.
- **`assets/wishlist-script.js`** — No `aria-live` on state container (`:59-84`); `.smartwishlist` remove is a `<span>` click-only (`:109-131`); Flickity a11y unverified. **FIX:** `role="status"`; make remove a `<button>`; confirm `accessibility:true`.
- **`sections/tabs.liquid` + `theme.js:5748-5758`** — Tabs lack Home/End + roving tabindex. **FIX:** add per WAI-ARIA Tabs pattern.
- **`sections/perspective-slider.liquid:59-71`** — Flickity init `prevNextButtons:false, pageDots:false` → no keyboard controls; slides `alt="Image"`. **FIX:** enable controls + real alt.

---

## LOW — minor / polish

- **`layout/theme.liquid:126`** — iOS viewport locks `maximum-scale=1` (blocks pinch-zoom). **FIX:** allow `user-scalable=yes`. (SC 1.4.4)
- **`layout/theme.liquid:26`** — `<meta nam=…>` typo (theme-color ignored). **FIX:** `name`.
- **`layout/theme.liquid:168-179`** — `footer-group` nested inside `<main>`. **FIX:** move `<footer>` outside `</main>`.
- **`layout/password.liquid:1`** — No `<html lang>`/`<title>`/`<main>` if Shopify doesn't wrap it. **FIX:** verify wrapper / provide full document.
- **3D gallery frame alts** — `3d-gallery`, `aj4/amm-af1/amm95`: 40–50 sequential `alt="01".."44"`/`DSC04…` create SR noise. **FIX:** one descriptive alt, `alt=""` on the rest.
- **`snippets/icons.liquid`** — SVGs lack `aria-hidden`/`focusable="false"`; `case` has `{% else %}` before a `{% when %}` (`:6-8`, unreachable branch). **FIX:** add attrs; reorder `else` last.
- **`sections/main-cart.liquid:50-69`** — `<th>` cells without `scope`. **FIX:** `scope="col"`.
- **`sections/main-article.liquid:69`** — `<time>` without `datetime`. **FIX:** use `time_tag`.
- **`snippets/pagination.liquid:19`** — redundant `role="navigation"` on `<nav>`. **FIX:** remove.
- **`assets/section-3d-gallery.css:53-65`** — `.top-text/.bottom-text { color: rgba(36,36,36,0.15) }` ~1.1:1. **FIX:** `aria-hidden` if decorative, else darken.
- **`assets/custom.css:365-369`** — `.collection-products-count { color:#797979 }` ~4.0:1. **FIX:** darken to ≥4.5:1.
- **`assets/amm-shop-the-look.css:496,713`** — low-alpha white price text, borderline over image. **FIX:** ≥`rgba(255,255,255,0.85)` + scrim.
- **`assets/theme.css:2408,3858,5506`** — `outline:none` on text input `:focus` (not `:focus-visible`), no replacement. **FIX:** add `:focus-within` ring on wrapper.
- **Target size 24×24** — verify `.tap-area`, dot buttons, quantity `--sm`, social icons, knob meet SC 2.5.8 (most pass via `.tap-area`/grid sizing; cart `--sm` steppers + dots are the risk).

---

## Quick Wins (one-line / trivial bug fixes)

| File:line | Fix |
|-----------|-----|
| `quantity-selector.liquid:93` | `decrease_quantity` → `increase_quantity` on `+` button |
| `jordan-2-header.liquid:36` | `</h2>` → `</h1>` |
| `reviews-slider.liquid:9,31` | `<dib>` → `<div>` |
| `countdown.liquid:25` | `block.settigns` → `block.settings` |
| `theme.liquid:26` | `nam` → `name` |
| `slideshow.liquid:225` | `arrow-down-2` → `arrow-down` |
| `icons.liquid:6-8` | move `{% else %}` after all `{% when %}` |
| `hero-with-logo.liquid:8,14` | dedupe `id="clipped"` |
| `banner.liquid:17` | add `role="alert"` to error variant |
| `theme.liquid:149` | drop `role="button"` from skip link |

---

## Recommended Remediation Order

1. **Quick-win bug fixes** (table above) — broken/incorrect, near-zero risk.
2. **Theme E — global `prefers-reduced-motion` reset** in `theme.css` — one block, broad coverage.
3. **Theme B — live regions** for cart / shipping / inventory / search / filters / errors / wishlist.
4. **Theme A — custom modal focus management** (newsletter popup, shop-the-look, both ai_gen blocks, image hotspots).
5. **Theme C — keyboard for drag/3D widgets** (360-knob, galleries, before/after).
6. **Theme D — heading semantics** (`heading_tag` → real elements; fix hierarchy).
7. **Theme F/G — icon names + carousel pause/aria-roledescription**.
8. **Forms** — `aria-invalid`/`aria-describedby`, required indicators.
9. **MEDIUM/LOW polish** — contrast, target size, iframe titles, table scopes.

---

## Notes

- **Slideshow CTA dropdown:** the recently-deleted `assets/slideshow-dropdown.js` / `.css` were **not reimplemented** anywhere. Repo-wide grep for `data-dropdown-trigger`, `role="menuitem"`, `cta-dropdown`, `slideshow-dropdown` returns no matches. `blocks/ai_gen_block_dc84923.liquid` is a text + `role="dialog"` modal CTA, **not** a menu — so menu-pattern concerns (`aria-haspopup`, `role=menu`, arrow-key) do not currently apply.
- **Vendored framework is sound:** `DialogElement`/`Modal`/`Drawer` focus trap + `aria-modal` + Escape + restore (`theme.js`), `Tabs` Arrow nav, `Player` visibility-pause, `payment-icons`, `accordion` (native `<details>`), `address-form` (full autocomplete + `id_prefix`), `product-gallery`, `share-buttons` all pass. One nuance: `DialogElement` initial focus is gated on `supports-hover` (`theme.js:2628`), so touch + screen-reader users may not get focus moved into vendored modals — vendor behavior, out of scope unless modified.
- Exact color-contrast ratios for the flagged candidates need a contrast checker against actual rendered backgrounds; declared colors + selectors are listed so they can be verified directly.
