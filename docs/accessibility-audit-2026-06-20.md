# Accessibility Audit — AMM-v2 Shopify Theme

**Standard:** WCAG 2.2 Level AA + [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) (accessibility subset)
**Date:** 2026-06-20
**Scope:** `layout/`, key sections (header, footer, nav, product, cart, search, widgets), 30+ snippets, custom JS (`theme.js`, `amm-shop-the-look.js`, `360-knob.js`, `angle.js`, `wishlist-script.js`), CSS (`theme.css`, `custom.css`, `amm-shop-the-look.css`, `section-3d-gallery.css`, `aos.css`). Minified vendor bundles excluded.
**Method:** 7 parallel domain audits (global/nav, forms, product/cart, widgets, JS, CSS, content/icons).
**Status:** READ-ONLY analysis. No code modified.

> Re-audit of [accessibility-audit.md](accessibility-audit.md) (2026-06-19) reflecting current state after recent a11y commits (cert seal, quantity-button labels, SKU copy). Several prior issues remain; several **new bugs** surfaced (see Quick-Win Bugs).

---

## Executive Summary

Vendored framework (Impulse/Shopify: `DialogElement`, `Modal`, `FocusTrap`, `Listbox`, etc.) handles focus trap, `aria-modal`, Escape, focus restore **correctly** — confirmed at `theme.js:2614-2706`. **Custom theme code layered on top carries nearly every real barrier.**

**Verdict:** Not AA-compliant in current state. No finding is unfixable; most are small, localized edits. Several are one-line bug fixes shipping live right now.

### Severity counts (this audit)

| Severity | Count | Meaning |
|----------|-------|---------|
| CRITICAL | 7 | Blocks AT/keyboard users entirely. Fix before merge. |
| HIGH | ~38 | Significant barrier or live bug. Should fix before merge. |
| MEDIUM | ~35 | Maintainability / partial barrier. |
| LOW | ~30 | Minor / verify. |

### Top systemic gaps (fix once → clears many)

| # | Theme | WCAG | Files |
|---|-------|------|-------|
| A | Custom modals/drawers: no focus move-in/trap/Escape/restore/`aria-modal` | 2.1.2, 2.4.3, 4.1.2 | `amm-shop-the-look.js`, `image-hotspot`, cart-drawer (verify), quick-buy (verify), header-search (verify) |
| B | Dynamic updates silent — no `aria-live`/`role=status` | 4.1.3, 3.3.1 | buy-buttons, cart-drawer, main-cart totals, price-list, inventory, free-shipping-bar, predictive-search, countdown, wishlist, banner |
| C | Drag/3D widgets keyboard-inoperable, no pointer alternative | 2.1.1, 2.5.7 | `360-knob`, `3d-gallery`(+simple), `before-after`, `perspective-slider` |
| D | Visual headings as `<p>`; multiple/illegal h1; broken hierarchy | 1.3.1, 2.4.6 | `rich-text`(h1 default), `map-with-text`(h1 default), `events-section`, `timeline`, `multi-column`, `multiple-media-with-text`, `jordan-2-header` |
| E | `prefers-reduced-motion` gaps on infinite/autoplay animation | 2.3.3 | `theme.css:6941/885`, `amm-shop-the-look.css:578/257`, image-hotspot radar, slideshow, perspective-slider, announcement-bar; `aos.css` empty |
| F | Icon-only controls without accessible name | 1.1.1, 4.1.2 | `reviews-slider` arrows, `main-search` submit, `star-rating-icon`, `icons.liquid` SVGs |
| G | Autoplay/moving content with no pause control | 2.2.2 | `slideshow`, `announcement-bar`, `perspective-slider` |
| H | Image links with no accessible name; misapplied `alt` default | 1.1.1, 2.4.4 | `product-card`, `product-card-horizontal`, `hero-with-logo`, `blog-post-card` |

---

## Quick-Win Bugs (one-line fixes, ship now)

These are live functional/a11y bugs, not architecture:

- **`snippets/quantity-selector.liquid:93`** — [HIGH] Product **increase** button announces "Decrease quantity" (`sr-only` label wrong). The recent quantity-button commits missed this branch. FIX: `{{ 'product.quantity.increase_quantity' | t }}`.
- **`sections/reviews-slider.liquid:9,31`** — [HIGH] `<dib>`/`</dib>` typo (should be `<div>`) → invalid markup, corrupts a11y tree (SC 4.1.1).
- **`sections/jordan-2-header.liquid:35`** — [CRITICAL] Heading opens `<h1>` closes `</h2>` → invalid/broken heading semantics. FIX: close `</h1>`.
- **`snippets/product-info.liquid:412`** — [HIGH] `replate` typo (no such Liquid filter) → SKU normalization silently fails (intl-shipping logic misbehaves). Also `:410` malformed `{-%}`. FIX: `replace` / `-%}`.
- **`sections/footer.liquid:224-237`** — [HIGH] Accessibility-seal `<a>`/`<img>` rendered **outside** the `{% if settings.accessibility_seal != blank %}` guard → empty link + broken img when unset (SC 1.1.1, 2.4.4, 4.1.2). FIX: move markup inside the `{% if %}`.
- **`snippets/icons.liquid:6`** — [HIGH] Stray `{% else %}` before remaining `{% when %}` clauses → `online`/`offline`/`location`/etc. cases unreachable in Liquid `case`. FIX: remove the stray `else`.
- **`sections/hero-with-logo.liquid:8,14`** — [MEDIUM] Two `<img id="clipped">` duplicate IDs on one page (SC 4.1.1).
- **`snippets/countdown.liquid:25`** — [MEDIUM] `block.settigns` typo disables start flag; plus hardcoded `id="countdown"` breaks multi-instance.

---

## CRITICAL — block AT/keyboard users; fix before merge

### Keyboard operability (SC 2.1.1, 2.5.7)
- **`sections/image-hotspot.liquid:11` (+ JS `:201`)** — Hotspots are `<div>` + click-only: not focusable, no role, no name, no Escape. FIX: `<button type="button" aria-expanded aria-controls>` + `aria-label` from `block.settings.title`; toggle `aria-expanded`, manage focus on open.
- **`snippets/360-knob.liquid:22` + `assets/360-knob.js:108-117`** — `.knob` is a non-focusable `<div>`, rotates by mouse/touch drag only; no keyboard path. FIX: `role="slider" tabindex="0"` + `aria-valuemin/max/now` + `aria-label`; Arrow/Home/End → frame step; add prev/next `<button>`s as non-drag pointer alternative.
- **`sections/3d-gallery.liquid:13-26` & `sections/3d-gallery-simple.liquid:14-27`** — Same drag-only 360 viewer, fully keyboard-inoperable. FIX: keyboard prev/next buttons (`angle.js` exposes `.prev`/`.next`) or slider role + arrow keys.
- **`sections/perspective-slider.liquid:60-70`** — Flickity with `prevNextButtons:false` + `pageDots:false` → no keyboard-operable controls at all; slides are plain `<div>`. FIX: enable controls or add custom `<button aria-label>` prev/next; ensure Flickity keyboard nav on.

### Custom dialog focus management (SC 2.1.2 / 2.4.3 / 4.1.2)
- **`sections/amm-shop-the-look.liquid:418` + `assets/amm-shop-the-look.js:96-105`** — Cinematic drawer opens by removing `hidden` only: no `role="dialog"`, no `aria-modal`, no name, no focus move-in, no trap, no Escape, no restore. FIX: add dialog semantics; focus close btn on open; trap Tab; Escape → close; restore focus to `.amm-stl__drawer-trigger`.

### Status messages not announced (SC 4.1.3)
- **`sections/predictive-search.liquid:88,296`** — Results wrapper has no `aria-live`/`role`; `results_count` (`:84`) never announced. Results appear silently (also `header-search.liquid:33` + `theme.js:5886-5897`). FIX: render count into `aria-live="polite"` sr-only region; set `role="region" aria-live="polite"` on results.
- **`snippets/banner.liquid:17`** — Shared error/success container (contact, newsletter, login, register, reset, activate, address) is a plain `<div>`, no `role`. Failed submits silent. FIX: `role="alert"` when `status=='error'`, `role="status"` when success.

---

## HIGH — significant barrier / live bug

### Global / navigation / layout
- `layout/theme.liquid:169` — `<main>` wraps the footer group → footer not a top-level `contentinfo` landmark. FIX: move `footer-group` outside `<main>`.
- `layout/theme.liquid:150` — Skip link uses `sr-only` with no visible-on-focus class. FIX: confirm `.skip-to-content:focus` reveals it (add `focus:not-sr-only` if not).
- `sections/header.liquid:104` — Mobile menu toggle `aria-expanded` static in markup; verify `header-sidebar` JS toggles on open/close (else 4.1.2 fails).
- `sections/announcement-bar.liquid:48` — Autoplay carousel, no pause control + no `aria-live` (2.2.2, 4.1.3). FIX: pause button and/or `aria-live`; disable autoplay under reduced-motion.
- `sections/subcollection-nav.liquid:32-40` — Mouse-drag-only horizontal scroller, no keyboard/pointer alternative (2.5.7). FIX: rely on focusable links + native overflow scroll; remove drag-only dependence.
- `snippets/header-sidebar.liquid:47` — Drawer relies entirely on custom-element JS for trap/restore; verify present (2.4.3, 2.1.2).

### Forms / search
- `sections/main-search.liquid:258,280` — Submit button icon-only, no accessible name. FIX: `aria-label` + `aria-hidden` on SVG.
- `sections/main-search.liquid:65-237` — Tabs lack `aria-selected`/`aria-controls`/roving tabindex; verify `x-tabs` JS wires them.
- `sections/predictive-search.liquid:95-210` — Result items have no listbox/option roles, no arrow-key nav; no combobox on input. FIX: combobox/listbox pattern with arrow keys (or ensure all results tab-reachable).
- `sections/contact.liquid:8-55` — On error: no inline per-field errors, no `aria-describedby`, no focus to first invalid field; banner shows only first error. FIX: per-field errors + `aria-invalid` + focus-first-error; iterate all `form.errors`.
- `snippets/input.liquid:37-64` / `select.liquid:27-38` — No `aria-required`/`aria-invalid`/`aria-describedby` support (root cause of form findings). FIX: add ARIA passthrough params.
- `snippets/address-form.liquid:47,71` — Province `<select>` can be a focusable control with zero options. FIX: `disabled`+hide when empty.

### Product / cart (mostly missing live regions — SC 4.1.3)
- `snippets/buy-buttons.liquid:33-113` — No `aria-live` for add-to-cart result. FIX: sr-only `role="status" aria-live="polite"` updated by JS.
- `sections/cart-drawer.liquid:11-15` — Items list re-renders with no `aria-live`. FIX: `aria-live="polite"` on `.cart-drawer__items`.
- `sections/main-cart.liquid:103-126` — Totals/subtotal update silently on qty change. FIX: wrap `.cart-recap` in `aria-live="polite"`.
- `snippets/product-info.liquid:177` — Price block re-renders on variant change, no live region. FIX: wrap price `v-stack` in `aria-live="polite"`.
- `snippets/product-info.liquid:391-398` — Inventory re-renders silently. FIX: `aria-live="polite"` on inventory wrapper.
- `snippets/product-info.liquid:453-471` — Final-sale / no-intl-shipping warnings: plain `<span>`, color-only (`#CF0C28`), not announced. FIX: `role="status"`; ensure 4.5:1 + non-color indicator.
- `snippets/product-card.liquid:93-95,109-111` — `| default: product.title` applied to `image_tag` output, not `alt:` → blank-alt images get `alt=""` instead of title. FIX: `assign img_alt = featured_media.alt | default: product.title` then `alt: img_alt`.
- `snippets/product-card.liquid:66` — Media `<a>` has no accessible name (image alt blank). FIX: `aria-label="{{ product.title }}"` or `tabindex="-1"`/`aria-hidden` to dedupe with title link.
- `snippets/product-card-horizontal.liquid:18-20` — Image link no accessible name + no `alt` passed. FIX: pass `alt` / dedupe link.
- `snippets/product-info.liquid:90` — Stray `{{ product.tags }}` prints full tag array as visible text (SR reads it aloud). FIX: remove debug output.

### Widgets / media
- `sections/before-after.liquid:113` — Handle `<div tabindex="0">` with no slider role / arrow keys / value. FIX: `role="slider"` + `aria-valuemin/max/now` + ArrowLeft/Right.
- `sections/slideshow.liquid:12-29,73-76` — Autoplay (+autoplay videos), no pause control, no reduced-motion guard (2.2.2, 2.3.3). FIX: pause/play button; disable under reduced-motion.
- `sections/reviews-slider.liquid:35-36` — Prev/next icon-only, no `aria-label`.
- `snippets/free-shipping-bar.liquid:33,36-40` — Progress message span not a live region; bar is presentational `<div>` with no `role="progressbar"`. FIX: `role="status"` on message; `role="progressbar"` + aria-value* on bar.
- `snippets/countdown.liquid:1-24,111` — Per-frame rAF updates + expiry `innerHTML` swap, no live region/timer role. FIX: `role="timer"`; update text once/sec; expiry → `role="status"` region.
- `sections/amm-shop-the-look.liquid:106` — `.amm-stl__hotspots` hardcoded `aria-hidden="true"`, so JS-injected hotspot buttons are hidden from SR. FIX: remove `aria-hidden` once interactive.

### JS behaviors
- `assets/amm-shop-the-look.js:75,213-219` — Hotspot card + product drawer toggle by class only; no focus move/trap/Escape/restore, no `aria-expanded`. FIX: full focus management.
- `assets/amm-shop-the-look.js:235-236,302-323` — Add-to-cart text swap + "select a size" error injected silently, error auto-removed after 4s. FIX: `role="status"` / `role="alert"`; don't auto-expire critical errors.
- `assets/360-knob.js:17-35` — No `aria-valuenow`/`aria-valuetext` updates on rotation.
- `assets/wishlist-script.js:12-68` — Loading/error/empty states injected via `innerHTML`, silent. FIX: error→`role="alert"`, status→`aria-live="polite"`.
- `assets/wishlist-script.js:109-115` — `.smartwishlist` remove is click-only on a `<span>` (not focusable, no role). FIX: real `<button>` + `aria-label`.
- `assets/wishlist-script.js:59-84` — Grid rebuilt on remove; focus lost, no announcement. FIX: restore focus + live-region announce.
- `assets/theme.js:2118,5886-5897` — Free-shipping + predictive results swapped via innerHTML/replaceChildren, no live region (see Liquid findings).

### CSS
- `assets/theme.css:6941` — `.shop-the-look__hot-spot` infinite `ping` outside reduced-motion guard (2.3.3).
- `assets/theme.css:885` — `animateCircularProgress` (slideshow ring) no reduced-motion guard.
- `assets/amm-shop-the-look.css:766-770` — `:focus`/`:focus-visible { outline: none }` with no replacement → invisible keyboard focus on quick-add btn (2.4.7). FIX: `outline: 2px solid currentColor`.

### Content / icons / headings
- `sections/rich-text.liquid` (schema default `h1`) & `sections/map-with-text.liquid` (default `h1`) — heading_tag defaults to **h1** → multiple h1 / skipped levels. FIX: default to h2.
- `sections/events-section.liquid:2` — emits own `<h1 class="sr-only">` → second h1 on most templates. FIX: h2/configurable.
- `sections/timeline.liquid:19` — hardcoded `<h1>` title. FIX: h2.
- `sections/multiple-media-with-text.liquid:119,123` — subheading `<h2>` ranks above title `<h3>` (inverted order). FIX: reorder levels.
- `snippets/button.liquid:138` — Every `<button>` gets `aria-label` even with visible text → Label-in-Name desync risk (2.5.3, 4.1.2). FIX: only when icon-only/explicit.
- `snippets/icons.liquid:3-5` — SVGs lack `aria-hidden`/`focusable=false`, no label path; meaningful icons unnamed. FIX: `aria-hidden` decorative, `role=img`+`<title>` meaningful.
- `snippets/star-rating-icon.liquid:3-14` — 5 star SVGs, no accessible name, rating never exposed as text. FIX: wrap `role="img" aria-label="{{ rating }} out of 5 stars"`; hide individual SVGs.
- `sections/hero-with-logo.liquid:3` — Linked logo `alt=""` → unlabeled link. FIX: `alt="{{ shop.name }}"`.
- `snippets/blog-post-card.liquid:33` — Image link `aria-label` uses "Share" string (wrong label for nav link). FIX: "View article: {title}" or make image link decorative.

---

## MEDIUM (selected — see per-domain detail)

- `sections/footer.liquid:100` — Newsletter title `<p class="h6">` while siblings are `<h2>` (inconsistent heading nav).
- `sections/main-cart.liquid:39-72` — Order table `<th>` missing `scope="col"`, no `<caption>`.
- `snippets/product-card-horizontal.liquid:38-52` — Two duplicate add-to-cart buttons both in tab order; multi-variant trigger lacks `aria-haspopup="dialog"`.
- `snippets/product-gallery.liquid:122` — `<scroll-carousel role="region">` no `aria-label`.
- `snippets/price-list.liquid:48` — "Sale price" sr-only label printed even when not on sale.
- `snippets/mega-menu.liquid:29-44` — Modulo column logic can emit `<a>` outside any `<li>` (invalid list structure).
- `snippets/mega-menu-images.liquid:25,44` — Promo image link may have no accessible name when image-only.
- `image-hotspot.liquid:114-115` — Hotspot target 20×20px (< 24px, SC 2.5.8).
- `amm-shop-the-look.css:459` — Drawer close button below 24px target.
- `amm-shop-the-look.css:578,257` — `stl-ring` infinite animation outside the existing reduced-motion block.
- `slideshow.liquid:184` — Slide `role="group"` with no accessible name.
- `icons.liquid:3-135` / `star-rating-icon.liquid:4,10` — hardcoded `fill`/`stroke` (e.g. `fill="white"` X icon) instead of `currentColor` → breaks forced-colors / contrast.
- `header.liquid:279,293` — Search/cart disclosure `<a aria-controls>` with no `aria-expanded`.

---

## LOW / verify

- `theme.css:1452/2408/3858/5506` — `outline:none` on inputs, **covered** by global `:focus-visible` ring at `custom.css:630` (downgraded).
- `theme.css:2108/2118` — PhotoSwipe `.pswp` `outline:0` no replacement; add `:focus-visible` on controls.
- `payment-icons.liquid` — clean; only risk is duplicate IDs if rendered twice.
- `share-buttons.liquid`, `product-rating.liquid`, `icon.liquid` — **clean**.
- `aos.css` — file is **empty** (0 lines); if AOS animations load elsewhere, AOS does not honor reduced-motion by default — add a `@media (prefers-reduced-motion: reduce)` override.
- `custom.css` — has **no** reduced-motion query but carries the global focus-visible remediation (good).

---

## What's confirmed GOOD (don't touch)

- `theme.js:2614-2706` — Vendor `DialogElement`/`Modal` + `FocusTrap`: correct focus move-in, Tab trap, `aria-modal`, focus restore. Cart drawer & modals inherit this.
- `theme.js:3968-3996` — ProductForm toggles `aria-busy` on submit.
- `snippets/icon.liquid` — all ~80 SVGs `aria-hidden="true" focusable="false"`.
- `snippets/share-buttons.liquid` — per-network `aria-label`, list semantics, `rel="noopener"`.
- `snippets/product-rating.liquid` — `role="img"` + `aria-label`, numeric fallback.
- `snippets/payment-icons.liquid` — `role="img"` + `aria-labelledby`/`<title>`.
- `address-form.liquid` — correct `autocomplete` tokens on all personal-data fields.
- No paste-blocking (`onPaste`+preventDefault) anywhere. `.sr-only` uses correct clip-rect (not `display:none`).

---

## Suggested remediation order

1. **Quick-Win Bugs** (above) — minutes each, several are live bugs. Start here.
2. **Theme B (live regions)** — biggest WCAG 4.1.3 win: add `aria-live`/`role=status` to buy-buttons, cart-drawer, main-cart totals, price-list, inventory, free-shipping-bar, predictive-search, wishlist, banner.
3. **Theme A (dialog focus mgmt)** — `amm-shop-the-look.js` drawer + hotspots; image-hotspot; verify cart-drawer/quick-buy/header-search use the vendor `DialogElement`.
4. **Theme C (keyboard for drag/3D)** — 360-knob slider role + buttons; before-after slider; perspective-slider controls.
5. **Theme D (headings)** — flip `rich-text`/`map-with-text` defaults to h2; fix `jordan-2-header`, `events-section`, `timeline`, `multiple-media-with-text`, `multi-column` (render real heading element).
6. **Theme E/G (motion + pause)** — global reduced-motion sweep (`theme.css:6941/885`, amm-stl rings, AOS); pause controls on slideshow/announcement-bar/perspective-slider.
7. **Theme F/H (names + alt)** — icon-only labels, `icons.liquid`/`star-rating-icon` SVG roles, image-link names, `product-card` alt-default fix, `button.liquid` aria-label gating.

---

*Findings reference `file:line` (VS Code clickable). Items marked "verify" depend on custom-element JS not fully in scope — confirm before closing.*
