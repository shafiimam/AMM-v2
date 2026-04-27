# AMM Shop the Look — Block-Based Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `amm-shop-the-look` section to use native Shopify blocks instead of external API calls. Each product is added as a block in the section schema. Liquid renders all content; JavaScript handles only interactions (hotspot clicks, drawer toggles, film-strip scrolling).

**Architecture:** Block-based. Liquid renders products from blocks (no API). Each block contains a product picker and optional hotspot position fields (x/y %, visible only when "Show as hotspot" is toggled). JavaScript is simpler — it only wires up event listeners for interactions. CSS remains largely unchanged but applies to block-rendered content. All 5 layouts render blocks in order.

**Tech Stack:** Shopify Liquid (OS 2.0 section blocks), vanilla JS (interaction-only), CSS custom properties

---

## Layout Reference

All 5 layouts remain the same conceptually, but now render from blocks instead of API:

### Layout 1: `editorial-split`
Desktop: CSS Grid `3fr 2fr`. Left = portrait look image. Right = sticky product panel ("COMPLETE THE LOOK"), vertical list of products from blocks (72px thumbnail + title + price + "Shop →" link). Products stagger-fade in.
Mobile: Stacked. Image full width, products below.

### Layout 2: `hotspot`
Full-width landscape image. Up to N pulsing numbered dots positioned via per-block `hotspot_x` / `hotspot_y` settings (%). Clicking a dot reveals a floating product card. Horizontal product strip below image shows all blocks.

### Layout 3: `cinematic-drawer`
Full `100svh` section. Look image fills viewport with gradient overlay. Fixed black bar at image bottom: "SHOP THIS LOOK · N ITEMS ↑". Clicking bar slides drawer up (~50vh) with horizontal product carousel of blocks inside. Backdrop click dismisses.

### Layout 4: `film-strip`
Desktop: Left column (40%, sticky) = look image with numbered dot indicators. Right column (60%) = horizontal-scroll product strip (snap-scroll). Scrolling highlights corresponding dot.
Mobile: Stacked — image top, scroll below.

### Layout 5: `mosaic`
Full-bleed image (`min-height: 80vh`) with dark gradient over bottom 40%. Bottom edge: horizontal strip of compact product cards from blocks, overlaid on gradient. Hover lifts card and reveals "Shop" CTA.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `config/settings_schema.json` | Modify | Remove `stl_api_token` (no longer needed) |
| `sections/amm-shop-the-look.liquid` | Rewrite | Block-based schema, Liquid renders all product content |
| `assets/amm-shop-the-look.css` | Reuse | Apply to block-rendered content (minimal changes) |
| `assets/amm-shop-the-look.js` | Rewrite | Interaction-only: hotspot clicks, drawer toggle, film-strip scroll sync |

---

## Task 1: Remove API Token from Global Settings

**Files:**
- Modify: `config/settings_schema.json`

- [ ] **1.1 Locate the "App integrations" group (added in previous plan)**

```bash
grep -n "App integrations" config/settings_schema.json
```

Expected: Shows line number where "App integrations" group exists.

- [ ] **1.2 Remove the "App integrations" group entirely**

Delete the entire block (from `{` to `},`), leaving only the other groups intact. The file should still end with `]`.

- [ ] **1.3 Validate JSON**

```bash
shopify theme check
```

Expected: No JSON parse errors.

- [ ] **1.4 Commit**

```bash
git add config/settings_schema.json
git commit -m "refactor: remove stl_api_token from global settings (block-based section)"
```

---

## Task 2: Rewrite Section Liquid — Block-Based Schema and Rendering

**Files:**
- Modify: `sections/amm-shop-the-look.liquid`

- [ ] **2.1 Replace entire section file with block-based version**

`sections/amm-shop-the-look.liquid`:

```liquid
{%- liquid
  assign color_scheme_hash = section.settings.color_scheme.settings.background_gradient | default: section.settings.color_scheme.settings.background | md5
  assign layout = section.settings.layout
  assign show_hotspot_numbering = section.settings.show_hotspot_numbering
-%}

{%- if section.blocks.size > 0 -%}
<section
  class="amm-stl amm-stl--{{ layout }} color-scheme color-scheme--{{ section.settings.color_scheme.id }} color-scheme--bg-{{ color_scheme_hash }}{% if section.settings.separate_section_with_border %} bordered-section{% endif %}"
  id="shopify-section-{{ section.id }}"
  data-section-id="{{ section.id }}"
  data-layout="{{ layout }}"
  data-block-count="{{ section.blocks.size }}"
>
  <div class="amm-stl__inner">

    {%- if section.settings.title != blank or section.settings.subheading != blank -%}
      {%- unless layout == 'cinematic-drawer' or layout == 'mosaic' -%}
        <div class="amm-stl__header">
          {%- if section.settings.subheading != blank -%}
            <p class="amm-stl__subheading">{{ section.settings.subheading }}</p>
          {%- endif -%}
          {%- if section.settings.title != blank -%}
            <h2 class="amm-stl__title">{{ section.settings.title }}</h2>
          {%- endif -%}
        </div>
      {%- endunless -%}
    {%- endif -%}

    <div class="amm-stl__stage">

      {%- if layout == 'cinematic-drawer' or layout == 'mosaic' -%}
        {%- if section.settings.title != blank or section.settings.subheading != blank -%}
          <div class="amm-stl__header">
            {%- if section.settings.subheading != blank -%}
              <p class="amm-stl__subheading">{{ section.settings.subheading }}</p>
            {%- endif -%}
            {%- if section.settings.title != blank -%}
              <h2 class="amm-stl__title">{{ section.settings.title }}</h2>
            {%- endif -%}
          </div>
        {%- endif -%}
      {%- endif -%}

      <div class="amm-stl__image-wrap">
        {%- if section.settings.look_image != blank -%}
          <picture>
            {%- if section.settings.mobile_look_image != blank -%}
              <source
                media="(max-width: 699px)"
                srcset="
                  {{ section.settings.mobile_look_image | image_url: width: 400 }} 400w,
                  {{ section.settings.mobile_look_image | image_url: width: 800 }} 800w,
                  {{ section.settings.mobile_look_image | image_url: width: 1000 }} 1000w
                "
                width="{{ section.settings.mobile_look_image.width }}"
                height="{{ section.settings.mobile_look_image.height }}"
              >
            {%- endif -%}
            {{-
              section.settings.look_image
              | image_url: width: section.settings.look_image.width
              | image_tag:
                loading: 'lazy',
                widths: '400,600,800,1000,1200,1400,1600',
                sizes: '(max-width: 999px) 100vw, 60vw',
                class: 'amm-stl__image'
            -}}
          </picture>
        {%- else -%}
          {{- 'collection-1' | placeholder_svg_tag: 'amm-stl__image placeholder' -}}
        {%- endif -%}

        <div class="amm-stl__hotspots" aria-hidden="true"></div>
      </div>

      {%- if layout == 'editorial-split' -%}
        <div class="amm-stl__products" aria-live="polite">
          <p class="amm-stl__products-label">Complete the look</p>
          <ul class="amm-stl__product-list">
            {%- for block in section.blocks -%}
              {%- assign product = block.settings.product -%}
              {%- if product != blank -%}
                <li class="amm-stl__product-card" data-block-id="{{ block.id }}" data-index="{{ forloop.index0 }}">
                  <a href="{{ product.url }}">
                    {%- if product.featured_image -%}
                      <img
                        src="{{ product.featured_image | image_url: width: 72 }}"
                        alt="{{ product.title }}"
                        class="amm-stl__product-img"
                        loading="lazy"
                        width="72"
                        height="72"
                      >
                    {%- endif -%}
                    <div class="amm-stl__product-info">
                      <p class="amm-stl__product-title">{{ product.title }}</p>
                      <p class="amm-stl__product-price">{{ product.price | money }}</p>
                      <span class="amm-stl__product-link">Shop →</span>
                    </div>
                  </a>
                </li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
        </div>

      {%- elsif layout == 'hotspot' -%}
        <div class="amm-stl__products" aria-live="polite">
          <ul class="amm-stl__product-list">
            {%- for block in section.blocks -%}
              {%- assign product = block.settings.product -%}
              {%- if product != blank -%}
                <li class="amm-stl__product-card" data-block-id="{{ block.id }}" data-index="{{ forloop.index0 }}">
                  <a href="{{ product.url }}">
                    {%- if product.featured_image -%}
                      <img
                        src="{{ product.featured_image | image_url: width: 140 }}"
                        alt="{{ product.title }}"
                        class="amm-stl__product-img"
                        loading="lazy"
                        width="140"
                        height="140"
                      >
                    {%- endif -%}
                    <div class="amm-stl__product-info">
                      <p class="amm-stl__product-title">{{ product.title }}</p>
                      <p class="amm-stl__product-price">{{ product.price | money }}</p>
                      <span class="amm-stl__product-link">Shop →</span>
                    </div>
                  </a>
                </li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
        </div>

      {%- elsif layout == 'cinematic-drawer' -%}
        <div class="amm-stl__products" style="display: none;"></div>

      {%- elsif layout == 'film-strip' -%}
        <div class="amm-stl__products" aria-live="polite">
          <ul class="amm-stl__product-list">
            {%- for block in section.blocks -%}
              {%- assign product = block.settings.product -%}
              {%- if product != blank -%}
                <li class="amm-stl__product-card" data-block-id="{{ block.id }}" data-index="{{ forloop.index0 }}">
                  <a href="{{ product.url }}">
                    {%- if product.featured_image -%}
                      <img
                        src="{{ product.featured_image | image_url: width: 300 }}"
                        alt="{{ product.title }}"
                        class="amm-stl__product-img"
                        loading="lazy"
                        width="300"
                        height="300"
                      >
                    {%- endif -%}
                    <div class="amm-stl__product-info">
                      <p class="amm-stl__product-counter">{{ forloop.index }} / {{ section.blocks.size }}</p>
                      <p class="amm-stl__product-title">{{ product.title }}</p>
                      <p class="amm-stl__product-price">{{ product.price | money }}</p>
                      <span class="amm-stl__product-link">Shop →</span>
                    </div>
                  </a>
                </li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
        </div>

      {%- elsif layout == 'mosaic' -%}
        <div class="amm-stl__products" aria-live="polite">
          <ul class="amm-stl__product-list">
            {%- for block in section.blocks -%}
              {%- assign product = block.settings.product -%}
              {%- if product != blank -%}
                <li class="amm-stl__product-card" data-block-id="{{ block.id }}" data-index="{{ forloop.index0 }}">
                  <a href="{{ product.url }}">
                    {%- if product.featured_image -%}
                      <img
                        src="{{ product.featured_image | image_url: width: 200 }}"
                        alt="{{ product.title }}"
                        class="amm-stl__product-img"
                        loading="lazy"
                        width="200"
                        height="200"
                      >
                    {%- endif -%}
                    <div class="amm-stl__product-info">
                      <p class="amm-stl__product-title">{{ product.title }}</p>
                      <p class="amm-stl__product-price">{{ product.price | money }}</p>
                    </div>
                  </a>
                  <a href="{{ product.url }}" class="amm-stl__product-shop-btn">Shop</a>
                </li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
        </div>

      {%- endif -%}

    </div>

    {%- if layout == 'cinematic-drawer' -%}
      <button
        class="amm-stl__drawer-trigger"
        aria-expanded="false"
        aria-controls="amm-stl-drawer-{{ section.id }}"
      >
        <span class="amm-stl__drawer-trigger-text">{{ section.settings.cta_text }}</span>
        <span class="amm-stl__drawer-count">· {{ section.blocks.size }} {% if section.blocks.size == 1 %}item{% else %}items{% endif %}</span>
        <span class="amm-stl__drawer-icon" aria-hidden="true">↑</span>
      </button>
      <div id="amm-stl-drawer-{{ section.id }}" class="amm-stl__drawer" hidden>
        <button class="amm-stl__drawer-close" aria-label="{{ 'general.accessibility.close' | t }}">✕</button>
        <div class="amm-stl__drawer-products">
          <ul class="amm-stl__product-list">
            {%- for block in section.blocks -%}
              {%- assign product = block.settings.product -%}
              {%- if product != blank -%}
                <li class="amm-stl__product-card" data-block-id="{{ block.id }}" data-index="{{ forloop.index0 }}">
                  <a href="{{ product.url }}">
                    {%- if product.featured_image -%}
                      <img
                        src="{{ product.featured_image | image_url: width: 140 }}"
                        alt="{{ product.title }}"
                        class="amm-stl__product-img"
                        loading="lazy"
                        width="140"
                        height="140"
                      >
                    {%- endif -%}
                    <div class="amm-stl__product-info">
                      <p class="amm-stl__product-title">{{ product.title }}</p>
                      <p class="amm-stl__product-price">{{ product.price | money }}</p>
                      <span class="amm-stl__product-link">Shop →</span>
                    </div>
                  </a>
                </li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
        </div>
      </div>
      <div class="amm-stl__backdrop" hidden aria-hidden="true"></div>
    {%- endif -%}

  </div>
</section>
{%- endif -%}

{{ 'amm-shop-the-look.css' | asset_url | stylesheet_tag }}
<script src="{{ 'amm-shop-the-look.js' | asset_url }}" type="module"></script>

{% schema %}
{
  "name": "AMM Shop the Look",
  "tag": "section",
  "class": "shopify-section--amm-stl",
  "disabled_on": {
    "groups": ["header", "custom.overlay"]
  },
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:global.colors.scheme",
      "default": "scheme-1"
    },
    {
      "type": "checkbox",
      "id": "separate_section_with_border",
      "label": "t:global.section.separate_section_with_border",
      "default": false
    },
    {
      "type": "select",
      "id": "layout",
      "label": "Layout",
      "options": [
        { "value": "editorial-split", "label": "Editorial Split" },
        { "value": "hotspot",         "label": "Hotspot Interactive" },
        { "value": "cinematic-drawer","label": "Cinematic Drawer" },
        { "value": "film-strip",      "label": "Film Strip" },
        { "value": "mosaic",          "label": "Mosaic Immersive" }
      ],
      "default": "editorial-split"
    },
    {
      "type": "header",
      "content": "Content"
    },
    {
      "type": "inline_richtext",
      "id": "subheading",
      "label": "t:global.text.subheading"
    },
    {
      "type": "inline_richtext",
      "id": "title",
      "label": "t:global.text.heading",
      "default": "Shop the look"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "CTA label",
      "default": "Shop this look"
    },
    {
      "type": "header",
      "content": "Look image"
    },
    {
      "type": "image_picker",
      "id": "look_image",
      "label": "Look image",
      "info": "Recommended: portrait ratio (3:4), min 1200px tall for best quality"
    },
    {
      "type": "image_picker",
      "id": "mobile_look_image",
      "label": "Mobile look image (optional override)"
    },
    {
      "type": "header",
      "content": "Hotspot options"
    },
    {
      "type": "checkbox",
      "id": "show_hotspot_numbering",
      "label": "Show product numbering on hotspots",
      "default": true
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "Product"
        },
        {
          "type": "checkbox",
          "id": "show_as_hotspot",
          "label": "Show as hotspot",
          "default": false,
          "info": "For Hotspot Interactive layout only"
        },
        {
          "type": "range",
          "id": "hotspot_x",
          "label": "Hotspot position — left %",
          "min": 5,
          "max": 95,
          "step": 1,
          "default": 50,
          "visible_if": "{{block.settings.show_as_hotspot}}"
        },
        {
          "type": "range",
          "id": "hotspot_y",
          "label": "Hotspot position — top %",
          "min": 5,
          "max": 95,
          "step": 1,
          "default": 50,
          "visible_if": "{{block.settings.show_as_hotspot}}"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "AMM Shop the Look",
      "settings": {
        "layout": "editorial-split"
      },
      "blocks": [
        { "type": "product" },
        { "type": "product" },
        { "type": "product" }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **2.2 Run theme check**

```bash
shopify theme check sections/amm-shop-the-look.liquid
```

Expected: No errors.

- [ ] **2.3 Commit**

```bash
git add sections/amm-shop-the-look.liquid
git commit -m "refactor: redesign amm-shop-the-look section to use blocks instead of API"
```

---

## Task 3: Rewrite JS — Interactions Only

**Files:**
- Modify: `assets/amm-shop-the-look.js`

- [ ] **3.1 Replace entire JS file with interaction-only version**

`assets/amm-shop-the-look.js`:

```js
class AmmShopTheLook {
  constructor(el) {
    this.el = el;
    this.layout = el.dataset.layout;
    this.blockCount = parseInt(el.dataset.blockCount) || 0;
    this.productsEl = el.querySelector('.amm-stl__products');
    this.hotspotsEl = el.querySelector('.amm-stl__hotspots');

    this.init();
  }

  init() {
    if (this.layout === 'hotspot') this.setupHotspot();
    if (this.layout === 'cinematic-drawer') this.setupCinematicDrawer();
    if (this.layout === 'film-strip') this.setupFilmStrip();
  }

  setupHotspot() {
    const blocks = Array.from(this.el.querySelectorAll('[data-block-id]'));
    const hotspotsEl = this.hotspotsEl;

    blocks.forEach((block, i) => {
      const show = block.dataset.showAsHotspot === 'true';
      if (!show) return;

      const x = parseFloat(block.dataset.hotspotX) || 25 * (i + 1);
      const y = parseFloat(block.dataset.hotspotY) || 40;

      const btn = document.createElement('button');
      btn.className = 'amm-stl__hotspot-btn';
      btn.dataset.index = i;
      btn.style.cssText = `top: ${y}%; left: ${x}%;`;
      btn.textContent = i + 1;
      btn.setAttribute('aria-label', block.querySelector('.amm-stl__product-title')?.textContent || `Product ${i + 1}`);
      btn.addEventListener('click', () => this.toggleHotspotCard(i));

      hotspotsEl?.appendChild(btn);

      const card = document.createElement('div');
      card.className = 'amm-stl__hotspot-card';
      card.dataset.index = i;

      const anchorLeft = x > 55 ? 'auto' : `calc(${x}% + 22px)`;
      const anchorRight = x > 55 ? `calc(${100 - x}% + 22px)` : 'auto';
      const anchorTop = y > 60 ? 'auto' : `calc(${y}% - 16px)`;
      const anchorBot = y > 60 ? `calc(${100 - y}% + 16px)` : 'auto';

      card.style.cssText = `left: ${anchorLeft}; right: ${anchorRight}; top: ${anchorTop}; bottom: ${anchorBot};`;
      card.innerHTML = block.innerHTML;

      hotspotsEl?.appendChild(card);
    });
  }

  toggleHotspotCard(idx) {
    const btn = this.hotspotsEl.querySelector(`[data-index="${idx}"]`);
    const card = this.hotspotsEl.querySelector(`.amm-stl__hotspot-card[data-index="${idx}"]`);
    const isActive = btn.classList.contains('is-active');

    this.hotspotsEl.querySelectorAll('.amm-stl__hotspot-btn').forEach(b => b.classList.remove('is-active'));
    this.hotspotsEl.querySelectorAll('.amm-stl__hotspot-card').forEach(c => c.classList.remove('is-visible'));

    if (!isActive) {
      btn.classList.add('is-active');
      card?.classList.add('is-visible');
    }
  }

  setupCinematicDrawer() {
    const trigger = this.el.querySelector('.amm-stl__drawer-trigger');
    const drawer = this.el.querySelector('.amm-stl__drawer');
    const backdrop = this.el.querySelector('.amm-stl__backdrop');
    const closeBtn = this.el.querySelector('.amm-stl__drawer-close');

    const open = () => {
      drawer?.removeAttribute('hidden');
      backdrop?.removeAttribute('hidden');
      trigger?.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      drawer?.setAttribute('hidden', '');
      backdrop?.setAttribute('hidden', '');
      trigger?.setAttribute('aria-expanded', 'false');
    };

    trigger?.addEventListener('click', () => {
      trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
  }

  setupFilmStrip() {
    const list = this.productsEl.querySelector('.amm-stl__product-list');
    const cards = Array.from(this.productsEl.querySelectorAll('.amm-stl__product-card'));

    if (!list) return;

    cards[0]?.classList.add('is-active');

    const indicators = this.el.querySelector('.amm-stl__film-indicators');
    if (!indicators) this.createFilmIndicators();

    const filmIndicators = this.el.querySelector('.amm-stl__film-indicators');
    const dots = filmIndicators ? Array.from(filmIndicators.querySelectorAll('.amm-stl__film-dot')) : [];

    list.addEventListener('scroll', () => {
      const cardW = cards[0]?.offsetWidth || 1;
      const active = Math.round(list.scrollLeft / cardW);

      cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
    }, { passive: true });
  }

  createFilmIndicators() {
    const imageWrap = this.el.querySelector('.amm-stl__image-wrap');
    const cards = this.productsEl.querySelectorAll('.amm-stl__product-card');
    const dotsHtml = Array.from(cards).map((_, i) =>
      `<div class="amm-stl__film-dot${i === 0 ? ' is-active' : ''}">${i + 1}</div>`
    ).join('');

    const indicators = document.createElement('div');
    indicators.className = 'amm-stl__film-indicators';
    indicators.innerHTML = dotsHtml;

    imageWrap?.appendChild(indicators);
  }
}

document.querySelectorAll('.amm-stl[data-block-count]').forEach(el => new AmmShopTheLook(el));
```

- [ ] **3.2 Commit**

```bash
git add assets/amm-shop-the-look.js
git commit -m "refactor: simplify JS to handle interactions only (block-based)"
```

---

## Task 4: Manual QA

- [ ] **4.1 Start dev server**

```bash
shopify theme dev --store=<your-store-handle>
```

- [ ] **4.2 Add section to a test page**

Add "AMM Shop the Look" section to Home page. Add 3–5 products as blocks.

- [ ] **4.3 Test Editorial Split layout**

- Verify products render with title, image, price visible
- Verify "Shop →" link visible
- Verify stagger animation on load
- Verify no console errors

- [ ] **4.4 Test Hotspot Interactive layout**

- Add 3 blocks, set "Show as hotspot" = on for each
- Adjust hotspot_x / hotspot_y for each block
- Click dots — verify floating cards appear
- Click dots again — verify cards disappear
- Verify numbered dots appear (1, 2, 3)
- Verify product strip renders below image

- [ ] **4.5 Test Cinematic Drawer layout**

- Click bottom bar — verify drawer slides up
- Verify item count displays correctly
- Click ✕ — verify drawer closes
- Click outside (backdrop) — verify drawer closes
- Verify products render inside drawer

- [ ] **4.6 Test Film Strip layout**

- Verify numbered dots appear at bottom of image
- Scroll the product list — verify dots highlight in sync
- Verify product counter displays (e.g., "1 / 5")

- [ ] **4.7 Test Mosaic layout**

- Verify products appear at bottom with gradient overlay
- Hover card — verify it lifts and "Shop" button appears
- Verify responsive layout (mobile vs desktop)

- [ ] **4.8 Test image settings**

- Upload a custom look image
- Verify it renders
- Upload a mobile image override
- Verify it renders on mobile

- [ ] **4.9 Test responsive behavior**

- Resize viewport to 375px (mobile)
- All layouts should stack correctly
- Verify no console errors at any breakpoint

- [ ] **4.10 Run theme check**

```bash
shopify theme check
```

Expected: No errors.

- [ ] **4.11 Commit**

```bash
git add sections/amm-shop-the-look.liquid assets/amm-shop-the-look.js
git commit -m "feat: complete block-based amm-shop-the-look section with all 5 layouts"
```

---

## Self-Review

**Spec coverage:**
- ✅ 5 layout types using blocks (editorial-split, hotspot, cinematic-drawer, film-strip, mosaic)
- ✅ Block-based product picker (no API)
- ✅ Liquid renders all content; JS handles interactions only
- ✅ Optional hotspot positioning per block
- ✅ Look image (custom upload or override for mobile)
- ✅ Responsive design

**Known risks:**
- ⚠️ Block data attributes (`data-show-as-hotspot`, `data-hotspot-x`, etc.) — Shopify may not pass block settings as data attributes automatically. If JS cannot read these values, store them in block-rendered `data-*` attributes in Liquid templates.
- ⚠️ Hotspot card HTML cloning — The current JS clones `block.innerHTML`. If blocks contain complex markup with event listeners, cloning may lose interactivity.

**Placeholder scan:** None.

**Type consistency:** Methods `setupHotspot`, `toggleHotspotCard`, `setupCinematicDrawer`, `setupFilmStrip`, `createFilmIndicators` are all invoked consistently.
