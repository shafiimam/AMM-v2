# AMM Shop the Look — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `amm-shop-the-look` Shopify section that dynamically fetches outfit/product data from the Shop the Look app REST API and renders it in one of 5 premium luxury layouts.

**Architecture:** Purely client-side — Liquid renders the look image and skeleton with data attributes; a vanilla JS ES module (`amm-shop-the-look.js`) handles the API fetch and product card rendering. Five layout variants are selected via a section `select` setting and toggled via CSS classes. The bearer token is stored in global theme settings and output into the DOM as a `data-api-token` attribute.

**Tech Stack:** Shopify Liquid (OS 2.0 section schema), vanilla JS ES module, CSS custom properties, Shop the Look REST API v1 (`https://shopify.shopthelook.app/api/v1/shop/product-look`)

---

## Layout Reference

Each layout is selected via `section.settings.layout`. Understand these before coding.

### Layout 1: `editorial-split`
Desktop: CSS Grid `3fr 2fr`. Left = portrait look image (`object-fit: cover`, sticky). Right = sticky product panel with label "COMPLETE THE LOOK", vertical list of products (72px thumbnail + title + price + "Shop →" link). Products stagger-fade in from right on load.
Mobile: Stacked. Image full width, products list below.

### Layout 2: `hotspot`
Full-width landscape look image. Up to 4 pulsing numbered dot markers positioned via per-product `hotspot_N_x` / `hotspot_N_y` settings (%). Clicking a dot reveals a floating product card anchored near it; clicking again dismisses. A horizontal product strip renders below the image.
Mobile: Same behavior with touch-friendly 44px tap targets.

### Layout 3: `cinematic-drawer`
Full `100svh` section. Look image fills viewport with gradient overlay. Fixed black bar at image bottom: "SHOP THIS LOOK · N ITEMS ↑". Clicking the bar slides a drawer panel up (~50vh) with a horizontal product carousel inside. Backdrop click dismisses.

### Layout 4: `film-strip`
Desktop: Left column (40%, sticky) = look image with numbered dot indicators at bottom. Right column (60%) = horizontal-scroll product strip (snap-scroll); scrolling products highlights the corresponding dot. Mobile: Stacked — image top, horizontal product scroll below.

### Layout 5: `mosaic`
Full-bleed image (`min-height: 80vh`) with dark gradient over the bottom 40%. Section title centered over the image. Bottom edge: horizontal strip of compact product cards (150–200px wide) overlaid on the gradient. Hover lifts each card and reveals a "Shop" CTA button.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `config/settings_schema.json` | Modify | Add `stl_api_token` text field to new "App integrations" group |
| `sections/amm-shop-the-look.liquid` | Create | Section markup, look image rendering, data attributes, full schema |
| `assets/amm-shop-the-look.css` | Create | All 5 layout styles, animations, responsive rules |
| `assets/amm-shop-the-look.js` | Create | API fetch, product card rendering, layout-specific interactions |

---

## Task 1: Add STL API Token to Global Theme Settings

**Files:**
- Modify: `config/settings_schema.json`

- [ ] **1.1 Locate the closing bracket of the schema array**

```bash
tail -10 "config/settings_schema.json"
```
Expected: last entry is the `favicon` group, file ends with `}`, `]`.

- [ ] **1.2 Insert new "App integrations" group before the final `]`**

In `config/settings_schema.json`, replace the last `}` + `]` (the close of the `favicon` group + array) with:

```json
    ]
  },
  {
    "name": "App integrations",
    "settings": [
      {
        "type": "header",
        "content": "Shop the Look"
      },
      {
        "type": "text",
        "id": "stl_api_token",
        "label": "API token",
        "info": "Bearer token from the Shop the Look app Settings dashboard. Starts with stl_. This value is output in page HTML — do not enter a production token in public dev previews."
      }
    ]
  }
]
```

- [ ] **1.3 Validate JSON is well-formed**

```bash
shopify theme check
```
Expected: no JSON parse errors.

- [ ] **1.4 Commit**

```bash
git add config/settings_schema.json
git commit -m "feat: add STL api token field to global theme settings"
```

---

## Task 2: Section Liquid — Skeleton, Image Rendering, and Full Schema

**Files:**
- Create: `sections/amm-shop-the-look.liquid`

- [ ] **2.1 Create the section file**

`sections/amm-shop-the-look.liquid`:

```liquid
{%- liquid
  assign color_scheme_hash = section.settings.color_scheme.settings.background_gradient | default: section.settings.color_scheme.settings.background | md5

  assign main_product_id = ''
  if section.settings.main_product != blank
    assign main_product_id = section.settings.main_product.id
  elsif request.page_type == 'product'
    assign main_product_id = product.id
  endif

  assign look_image = nil
  assign mobile_look_image = nil
  if section.settings.look_image_source == 'custom_image'
    assign look_image = section.settings.custom_image
    assign mobile_look_image = section.settings.mobile_custom_image
  elsif section.settings.look_image_source == 'product_image'
    assign img_idx = section.settings.product_image_index | default: 0
    if section.settings.main_product != blank
      assign look_image = section.settings.main_product.images[img_idx]
    elsif request.page_type == 'product'
      assign look_image = product.images[img_idx]
    endif
  endif
-%}

{%- if main_product_id != blank -%}
<section
  class="amm-stl amm-stl--{{ section.settings.layout }} color-scheme color-scheme--{{ section.settings.color_scheme.id }} color-scheme--bg-{{ color_scheme_hash }}{% if section.settings.separate_section_with_border %} bordered-section{% endif %}"
  id="shopify-section-{{ section.id }}"
  data-section-id="{{ section.id }}"
  data-main-product-id="{{ main_product_id }}"
  data-api-token="{{ settings.stl_api_token | escape }}"
  data-layout="{{ section.settings.layout }}"
  data-hotspot-1-x="{{ section.settings.hotspot_1_x }}"
  data-hotspot-1-y="{{ section.settings.hotspot_1_y }}"
  data-hotspot-2-x="{{ section.settings.hotspot_2_x }}"
  data-hotspot-2-y="{{ section.settings.hotspot_2_y }}"
  data-hotspot-3-x="{{ section.settings.hotspot_3_x }}"
  data-hotspot-3-y="{{ section.settings.hotspot_3_y }}"
  data-hotspot-4-x="{{ section.settings.hotspot_4_x }}"
  data-hotspot-4-y="{{ section.settings.hotspot_4_y }}"
>
  <div class="amm-stl__inner">

    {%- if section.settings.title != blank or section.settings.subheading != blank -%}
      {%- unless section.settings.layout == 'cinematic-drawer' or section.settings.layout == 'mosaic' -%}
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

      {%- comment -%}
        For cinematic-drawer and mosaic, the heading is overlaid on the image via CSS.
        We render it inside the stage so it sits inside the positioned container.
      {%- endcomment -%}
      {%- if section.settings.layout == 'cinematic-drawer' or section.settings.layout == 'mosaic' -%}
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
        {%- if look_image != blank -%}
          <picture>
            {%- if mobile_look_image != blank -%}
              <source
                media="(max-width: 699px)"
                srcset="
                  {{ mobile_look_image | image_url: width: 400 }} 400w,
                  {{ mobile_look_image | image_url: width: 800 }} 800w,
                  {{ mobile_look_image | image_url: width: 1000 }} 1000w
                "
                width="{{ mobile_look_image.width }}"
                height="{{ mobile_look_image.height }}"
              >
            {%- endif -%}
            {{-
              look_image
              | image_url: width: look_image.width
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

      <div class="amm-stl__products" aria-live="polite">
        <div class="amm-stl__loading" aria-label="{{ 'general.accessibility.loading' | t }}">
          <span class="amm-stl__loading-dot"></span>
          <span class="amm-stl__loading-dot"></span>
          <span class="amm-stl__loading-dot"></span>
        </div>
      </div>

    </div>

    {%- if section.settings.layout == 'cinematic-drawer' -%}
      <button
        class="amm-stl__drawer-trigger"
        aria-expanded="false"
        aria-controls="amm-stl-drawer-{{ section.id }}"
      >
        <span class="amm-stl__drawer-trigger-text">{{ section.settings.cta_text }}</span>
        <span class="amm-stl__drawer-count"></span>
        <span class="amm-stl__drawer-icon" aria-hidden="true">↑</span>
      </button>
      <div id="amm-stl-drawer-{{ section.id }}" class="amm-stl__drawer" hidden>
        <button class="amm-stl__drawer-close" aria-label="{{ 'general.accessibility.close' | t }}">✕</button>
        <div class="amm-stl__drawer-products"></div>
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
      "content": "Product data"
    },
    {
      "type": "product",
      "id": "main_product",
      "label": "Main product",
      "info": "The product configured as the look anchor in the Shop the Look app. Leave blank on product pages to use the current product automatically."
    },
    {
      "type": "header",
      "content": "Look image"
    },
    {
      "type": "select",
      "id": "look_image_source",
      "label": "Image source",
      "options": [
        { "value": "custom_image",   "label": "Custom upload" },
        { "value": "product_image",  "label": "Product image" }
      ],
      "default": "custom_image"
    },
    {
      "type": "image_picker",
      "id": "custom_image",
      "label": "Look image",
      "info": "Recommended: portrait ratio (3:4), min 1200px tall for best quality",
      "visible_if": "{{section.settings.look_image_source}} == 'custom_image'"
    },
    {
      "type": "image_picker",
      "id": "mobile_custom_image",
      "label": "Mobile look image (optional override)",
      "visible_if": "{{section.settings.look_image_source}} == 'custom_image'"
    },
    {
      "type": "range",
      "id": "product_image_index",
      "label": "Product image index",
      "min": 0,
      "max": 9,
      "step": 1,
      "default": 0,
      "info": "0 = first product image",
      "visible_if": "{{section.settings.look_image_source}} == 'product_image'"
    },
    {
      "type": "header",
      "content": "Hotspot positions",
      "info": "Only used in Hotspot Interactive layout. Set the X (left) and Y (top) position of each product dot as a percentage of the image dimensions."
    },
    {
      "type": "range",
      "id": "hotspot_1_x",
      "label": "Product 1 — left %",
      "min": 5, "max": 95, "step": 1, "default": 30
    },
    {
      "type": "range",
      "id": "hotspot_1_y",
      "label": "Product 1 — top %",
      "min": 5, "max": 95, "step": 1, "default": 30
    },
    {
      "type": "range",
      "id": "hotspot_2_x",
      "label": "Product 2 — left %",
      "min": 5, "max": 95, "step": 1, "default": 65
    },
    {
      "type": "range",
      "id": "hotspot_2_y",
      "label": "Product 2 — top %",
      "min": 5, "max": 95, "step": 1, "default": 45
    },
    {
      "type": "range",
      "id": "hotspot_3_x",
      "label": "Product 3 — left %",
      "min": 5, "max": 95, "step": 1, "default": 40
    },
    {
      "type": "range",
      "id": "hotspot_3_y",
      "label": "Product 3 — top %",
      "min": 5, "max": 95, "step": 1, "default": 70
    },
    {
      "type": "range",
      "id": "hotspot_4_x",
      "label": "Product 4 — left %",
      "min": 5, "max": 95, "step": 1, "default": 75
    },
    {
      "type": "range",
      "id": "hotspot_4_y",
      "label": "Product 4 — top %",
      "min": 5, "max": 95, "step": 1, "default": 75
    }
  ],
  "presets": [
    {
      "name": "AMM Shop the Look",
      "settings": {
        "layout": "editorial-split"
      }
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
git commit -m "feat: add amm-shop-the-look section skeleton and schema"
```

---

## Task 3: CSS — Base Styles + Layout 1 (Editorial Split)

**Files:**
- Create: `assets/amm-shop-the-look.css`

- [ ] **3.1 Create the CSS file**

`assets/amm-shop-the-look.css`:

```css
/* ============================================================
   AMM SHOP THE LOOK — Base
   ============================================================ */

.amm-stl {
  --stl-font-heading: 'DINPro', sans-serif;
  --stl-font-body: 'Roboto', sans-serif;
  --stl-transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.amm-stl__header {
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.amm-stl__subheading {
  font-family: var(--stl-font-body);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.6rem;
}

.amm-stl__title {
  font-family: var(--stl-font-heading);
  font-size: clamp(1.6rem, 4vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0;
  line-height: 1;
}

.amm-stl__image-wrap {
  position: relative;
  overflow: hidden;
}

.amm-stl__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Loading */
.amm-stl__loading {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.amm-stl__loading-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
  animation: stl-pulse 1.2s ease-in-out infinite;
}

.amm-stl__loading-dot:nth-child(2) { animation-delay: 0.2s; }
.amm-stl__loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes stl-pulse {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50%       { opacity: 1;    transform: scale(1);   }
}

/* Shared product card */
.amm-stl__product-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.amm-stl__product-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.amm-stl__product-info {
  padding: 0.75rem 0 0;
}

.amm-stl__product-title {
  font-family: var(--stl-font-heading);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amm-stl__product-price {
  font-family: var(--stl-font-body);
  font-size: 0.78rem;
  opacity: 0.65;
  margin: 0;
}

.amm-stl__product-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.68rem;
  font-family: var(--stl-font-body);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Empty / error */
.amm-stl__empty,
.amm-stl__error {
  padding: 2.5rem;
  font-family: var(--stl-font-body);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.45;
}

/* ============================================================
   Layout 1: EDITORIAL SPLIT
   ============================================================ */

.amm-stl--editorial-split .amm-stl__stage {
  display: grid;
  grid-template-columns: 1fr;
}

.amm-stl--editorial-split .amm-stl__image-wrap {
  aspect-ratio: 3 / 4;
}

.amm-stl--editorial-split .amm-stl__products {
  padding: 2.5rem 1.5rem;
}

.amm-stl--editorial-split .amm-stl__products-label {
  font-family: var(--stl-font-body);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.45;
  margin: 0 0 2rem;
}

.amm-stl--editorial-split .amm-stl__product-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.amm-stl--editorial-split .amm-stl__product-card {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 1.1rem;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid currentColor;
  opacity: 0;
  transform: translateX(14px);
  animation: stl-slide-in var(--stl-transition) forwards;
}

.amm-stl--editorial-split .amm-stl__product-list > li:first-child {
  border-top: 1px solid currentColor;
}

.amm-stl--editorial-split .amm-stl__product-card:nth-child(1) { animation-delay: 0.08s; }
.amm-stl--editorial-split .amm-stl__product-card:nth-child(2) { animation-delay: 0.18s; }
.amm-stl--editorial-split .amm-stl__product-card:nth-child(3) { animation-delay: 0.28s; }
.amm-stl--editorial-split .amm-stl__product-card:nth-child(4) { animation-delay: 0.38s; }

@keyframes stl-slide-in {
  to { opacity: 1; transform: translateX(0); }
}

.amm-stl--editorial-split .amm-stl__product-img {
  width: 72px;
  height: 72px;
}

.amm-stl--editorial-split .amm-stl__product-info {
  padding: 0;
}

@media screen and (min-width: 1000px) {
  .amm-stl--editorial-split .amm-stl__stage {
    grid-template-columns: 3fr 2fr;
  }

  .amm-stl--editorial-split .amm-stl__image-wrap {
    aspect-ratio: auto;
    min-height: 75vh;
  }

  .amm-stl--editorial-split .amm-stl__products {
    position: sticky;
    top: 80px;
    align-self: start;
    padding: 4rem 3.5rem;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }
}
```

- [ ] **3.2 Commit**

```bash
git add assets/amm-shop-the-look.css
git commit -m "feat: add amm-stl CSS base and editorial-split layout"
```

---

## Task 4: CSS — Layout 2 (Hotspot)

**Files:**
- Modify: `assets/amm-shop-the-look.css`

- [ ] **4.1 Append hotspot CSS to end of `assets/amm-shop-the-look.css`**

```css
/* ============================================================
   Layout 2: HOTSPOT INTERACTIVE
   ============================================================ */

.amm-stl--hotspot .amm-stl__stage {
  display: flex;
  flex-direction: column;
}

.amm-stl--hotspot .amm-stl__image-wrap {
  position: relative;
  aspect-ratio: 3 / 2;
  width: 100%;
}

.amm-stl--hotspot .amm-stl__hotspots {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.amm-stl__hotspot-btn {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  border: none;
  cursor: pointer;
  transform: translate(-50%, -50%);
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--stl-font-heading);
  font-size: 0.62rem;
  font-weight: 700;
  color: #000;
  transition: transform 0.2s ease, background 0.2s ease;
  z-index: 2;
  min-width: 44px;
  min-height: 44px;
}

.amm-stl__hotspot-btn::before {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.55);
  animation: stl-ring 2.2s ease-in-out infinite;
}

.amm-stl__hotspot-btn:hover,
.amm-stl__hotspot-btn.is-active {
  background: #000;
  color: #fff;
  transform: translate(-50%, -50%) scale(1.1);
}

@keyframes stl-ring {
  0%, 100% { transform: scale(1);   opacity: 0.5; }
  50%       { transform: scale(1.5); opacity: 0;   }
}

.amm-stl__hotspot-card {
  position: absolute;
  z-index: 10;
  width: 175px;
  background: #fff;
  color: #000;
  padding: 0.8rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.amm-stl__hotspot-card.is-visible {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
}

.amm-stl__hotspot-card .amm-stl__product-img {
  margin-bottom: 0.5rem;
}

.amm-stl--hotspot .amm-stl__products {
  padding: 2rem 1.5rem 1.5rem;
}

.amm-stl--hotspot .amm-stl__product-list {
  display: flex;
  gap: 1.1rem;
  overflow-x: auto;
  list-style: none;
  margin: 0;
  padding: 0 0 1rem;
  scrollbar-width: none;
}

.amm-stl--hotspot .amm-stl__product-list::-webkit-scrollbar { display: none; }

.amm-stl--hotspot .amm-stl__product-card {
  width: 140px;
  flex-shrink: 0;
}

@media screen and (min-width: 1000px) {
  .amm-stl--hotspot .amm-stl__image-wrap {
    aspect-ratio: 16 / 9;
  }

  .amm-stl--hotspot .amm-stl__product-card {
    width: 180px;
  }
}
```

- [ ] **4.2 Commit**

```bash
git add assets/amm-shop-the-look.css
git commit -m "feat: add hotspot layout CSS"
```

---

## Task 5: CSS — Layout 3 (Cinematic Drawer)

**Files:**
- Modify: `assets/amm-shop-the-look.css`

- [ ] **5.1 Append cinematic-drawer CSS to end of `assets/amm-shop-the-look.css`**

```css
/* ============================================================
   Layout 3: CINEMATIC DRAWER
   ============================================================ */

.amm-stl--cinematic-drawer {
  position: relative;
}

.amm-stl--cinematic-drawer .amm-stl__stage {
  position: relative;
  height: 100svh;
  min-height: 520px;
}

.amm-stl--cinematic-drawer .amm-stl__image-wrap {
  position: absolute;
  inset: 0;
}

.amm-stl--cinematic-drawer .amm-stl__image-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 45%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.amm-stl--cinematic-drawer .amm-stl__products {
  display: none;
}

.amm-stl--cinematic-drawer .amm-stl__header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -58%);
  z-index: 2;
  color: #fff;
  text-align: center;
  padding: 0;
  width: 90%;
  pointer-events: none;
}

.amm-stl__drawer-trigger {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: rgba(8, 8, 8, 0.82);
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 1.15rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--stl-font-heading);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transition: background 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.amm-stl__drawer-trigger:hover {
  background: rgba(8, 8, 8, 0.96);
}

.amm-stl__drawer-count {
  opacity: 0.55;
  font-size: 0.62rem;
}

.amm-stl__drawer-icon {
  margin-left: auto;
  font-size: 1.1rem;
  transition: transform 0.35s ease;
}

.amm-stl__drawer-trigger[aria-expanded="true"] .amm-stl__drawer-icon {
  transform: rotate(180deg);
}

.amm-stl__drawer {
  position: absolute;
  bottom: 3.55rem;
  left: 0;
  right: 0;
  z-index: 4;
  background: rgba(10, 10, 10, 0.95);
  color: #fff;
  max-height: 52vh;
  padding: 2rem 1.5rem 1.25rem;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.amm-stl__drawer:not([hidden]) {
  display: block;
  transform: translateY(0);
}

.amm-stl__drawer-close {
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.55);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.amm-stl__drawer-close:hover { color: #fff; }

.amm-stl__drawer-products {
  overflow-x: auto;
  scrollbar-width: none;
}

.amm-stl__drawer-products::-webkit-scrollbar { display: none; }

.amm-stl__drawer-products .amm-stl__product-list {
  display: flex;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0 0 0.5rem;
}

.amm-stl__drawer-products .amm-stl__product-card {
  width: 140px;
  flex-shrink: 0;
  color: #fff;
}

.amm-stl__drawer-products .amm-stl__product-title { color: #fff; }
.amm-stl__drawer-products .amm-stl__product-price { color: rgba(255, 255, 255, 0.55); }
.amm-stl__drawer-products .amm-stl__product-link  { color: #fff; }

.amm-stl__backdrop {
  position: fixed;
  inset: 0;
  z-index: 3;
  background: transparent;
  cursor: default;
}
```

- [ ] **5.2 Commit**

```bash
git add assets/amm-shop-the-look.css
git commit -m "feat: add cinematic-drawer layout CSS"
```

---

## Task 6: CSS — Layout 4 (Film Strip)

**Files:**
- Modify: `assets/amm-shop-the-look.css`

- [ ] **6.1 Append film-strip CSS to end of `assets/amm-shop-the-look.css`**

```css
/* ============================================================
   Layout 4: FILM STRIP
   ============================================================ */

.amm-stl--film-strip .amm-stl__stage {
  display: grid;
  grid-template-columns: 1fr;
}

.amm-stl--film-strip .amm-stl__image-wrap {
  aspect-ratio: 3 / 4;
  position: relative;
}

.amm-stl__film-indicators {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.amm-stl__film-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--stl-font-heading);
  font-size: 0.55rem;
  font-weight: 700;
  color: #fff;
  transition: background 0.25s ease, transform 0.25s ease;
}

.amm-stl__film-dot.is-active {
  background: #fff;
  color: #000;
  transform: scale(1.25);
}

.amm-stl--film-strip .amm-stl__products {
  padding: 0;
}

.amm-stl--film-strip .amm-stl__product-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.amm-stl--film-strip .amm-stl__product-list::-webkit-scrollbar { display: none; }

.amm-stl--film-strip .amm-stl__product-card {
  width: 100%;
  flex-shrink: 0;
  padding: 2.5rem 1.75rem;
  border-left: 1px solid currentColor;
  scroll-snap-align: start;
  opacity: 0.35;
  transition: opacity 0.35s ease;
}

.amm-stl--film-strip .amm-stl__product-card.is-active {
  opacity: 1;
}

.amm-stl--film-strip .amm-stl__product-counter {
  font-family: var(--stl-font-body);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  opacity: 0.38;
  margin-bottom: 1.25rem;
}

@media screen and (min-width: 1000px) {
  .amm-stl--film-strip .amm-stl__stage {
    grid-template-columns: 2fr 3fr;
    min-height: 72vh;
  }

  .amm-stl--film-strip .amm-stl__image-wrap {
    aspect-ratio: auto;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .amm-stl--film-strip .amm-stl__product-card {
    width: 50%;
  }
}
```

- [ ] **6.2 Commit**

```bash
git add assets/amm-shop-the-look.css
git commit -m "feat: add film-strip layout CSS"
```

---

## Task 7: CSS — Layout 5 (Mosaic Immersive)

**Files:**
- Modify: `assets/amm-shop-the-look.css`

- [ ] **7.1 Append mosaic CSS to end of `assets/amm-shop-the-look.css`**

```css
/* ============================================================
   Layout 5: MOSAIC IMMERSIVE
   ============================================================ */

.amm-stl--mosaic {
  position: relative;
}

.amm-stl--mosaic .amm-stl__stage {
  position: relative;
  min-height: 80vh;
}

.amm-stl--mosaic .amm-stl__image-wrap {
  position: absolute;
  inset: 0;
}

.amm-stl--mosaic .amm-stl__image-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 38%, rgba(0, 0, 0, 0.78) 100%);
  pointer-events: none;
}

.amm-stl--mosaic .amm-stl__header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  z-index: 3;
  color: #fff;
  text-align: center;
  padding: 0;
  width: 90%;
  pointer-events: none;
}

.amm-stl--mosaic .amm-stl__products {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 1.5rem;
}

.amm-stl--mosaic .amm-stl__product-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  list-style: none;
  margin: 0;
  padding: 0 0 0.5rem;
  scrollbar-width: none;
}

.amm-stl--mosaic .amm-stl__product-list::-webkit-scrollbar { display: none; }

.amm-stl--mosaic .amm-stl__product-card {
  width: 148px;
  flex-shrink: 0;
  color: #fff;
  transition: transform 0.3s ease;
}

.amm-stl--mosaic .amm-stl__product-card:hover {
  transform: translateY(-6px);
}

.amm-stl--mosaic .amm-stl__product-card:hover .amm-stl__product-shop-btn {
  opacity: 1;
  transform: translateY(0);
}

.amm-stl--mosaic .amm-stl__product-title { color: #fff; }
.amm-stl--mosaic .amm-stl__product-price { color: rgba(255, 255, 255, 0.6); }

.amm-stl__product-shop-btn {
  display: block;
  width: 100%;
  margin-top: 0.6rem;
  padding: 0.5rem;
  background: #fff;
  color: #000;
  font-family: var(--stl-font-heading);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

@media screen and (min-width: 1000px) {
  .amm-stl--mosaic .amm-stl__product-card {
    width: 195px;
  }

  .amm-stl--mosaic .amm-stl__products {
    padding: 2rem 3rem;
  }
}
```

- [ ] **7.2 Commit**

```bash
git add assets/amm-shop-the-look.css
git commit -m "feat: add mosaic-immersive layout CSS"
```

---

## Task 8: JS — API Fetch and Product Rendering (All Layouts)

**Files:**
- Create: `assets/amm-shop-the-look.js`

- [ ] **8.1 Create the JS module**

`assets/amm-shop-the-look.js`:

```js
const STL_API = 'https://shopify.shopthelook.app/api/v1/shop/product-look';

class AmmShopTheLook {
  constructor(el) {
    this.el = el;
    this.mainProductId = el.dataset.mainProductId;
    this.apiToken = el.dataset.apiToken;
    this.layout = el.dataset.layout;
    this.productsEl = el.querySelector('.amm-stl__products');
    this.hotspotsEl = el.querySelector('.amm-stl__hotspots');

    if (!this.mainProductId || !this.apiToken) {
      this.productsEl?.querySelector('.amm-stl__loading')?.remove();
      return;
    }

    this.hotspotPositions = [1, 2, 3, 4].map(i => ({
      x: parseFloat(el.dataset[`hotspot${i}X`]) || 25 * i,
      y: parseFloat(el.dataset[`hotspot${i}Y`]) || 40,
    }));

    this.init();
  }

  async init() {
    try {
      const res = await fetch(`${STL_API}?mainProductId=${this.mainProductId}`, {
        headers: { Authorization: `Bearer ${this.apiToken}` },
      });

      if (!res.ok) throw new Error(`STL ${res.status}`);

      const data = await res.json();
      const items = data.items || [];

      this.productsEl?.querySelector('.amm-stl__loading')?.remove();

      if (items.length === 0) {
        this.renderEmpty();
        return;
      }

      this.render(items);
    } catch (err) {
      console.warn('[AMM STL]', err.message);
      this.productsEl?.querySelector('.amm-stl__loading')?.remove();
      this.renderError();
    }
  }

  /* Build a product URL from whatever the API provides */
  productUrl(item) {
    if (item.handle) return `/products/${item.handle}`;
    const variantId = item.variants?.[0]?.id?.replace('gid://shopify/ProductVariant/', '');
    return variantId ? `/?variant=${variantId}` : '#';
  }

  /* Render a single <li> product card */
  cardHTML(item, index, opts = {}) {
    const url = this.productUrl(item);
    const price = item.variants?.[0]?.formattedPrice || '';
    const img = item.image
      ? `<img src="${item.image}" alt="${item.title || ''}" class="amm-stl__product-img" loading="lazy" width="400" height="400">`
      : '';

    const counter = opts.counter
      ? `<p class="amm-stl__product-counter">${String(index + 1).padStart(2, '0')} / ${String(opts.total || index + 1).padStart(2, '0')}</p>`
      : '';

    const shopLink = opts.shopLink
      ? `<span class="amm-stl__product-link">Shop →</span>`
      : '';

    const shopBtn = opts.shopBtn
      ? `<a href="${url}" class="amm-stl__product-shop-btn">Shop</a>`
      : '';

    return `
      <li class="amm-stl__product-card" data-index="${index}">
        <a href="${url}">
          ${img}
          <div class="amm-stl__product-info">
            ${counter}
            <p class="amm-stl__product-title">${item.title || ''}</p>
            <p class="amm-stl__product-price">${price}</p>
            ${shopLink}
          </div>
        </a>
        ${shopBtn}
      </li>`;
  }

  render(items) {
    const dispatch = {
      'editorial-split':  () => this.renderEditorialSplit(items),
      'hotspot':          () => this.renderHotspot(items),
      'cinematic-drawer': () => this.renderCinematicDrawer(items),
      'film-strip':       () => this.renderFilmStrip(items),
      'mosaic':           () => this.renderMosaic(items),
    };
    (dispatch[this.layout] || dispatch['editorial-split'])();
  }

  renderEditorialSplit(items) {
    const cards = items.map((item, i) => this.cardHTML(item, i, { shopLink: true })).join('');
    this.productsEl.innerHTML = `
      <p class="amm-stl__products-label">Complete the look</p>
      <ul class="amm-stl__product-list">${cards}</ul>`;
  }

  renderHotspot(items) {
    /* Numbered dots on the image */
    const dots = items.slice(0, 4).map((item, i) => {
      const p = this.hotspotPositions[i];
      return `<button class="amm-stl__hotspot-btn" data-index="${i}"
        style="top:${p.y}%;left:${p.x}%;"
        aria-label="${item.title || `Product ${i + 1}`}">${i + 1}</button>`;
    }).join('');
    if (this.hotspotsEl) this.hotspotsEl.innerHTML = dots;

    /* Floating cards anchored near each dot */
    items.slice(0, 4).forEach((item, i) => {
      const p = this.hotspotPositions[i];
      const url = this.productUrl(item);
      const price = item.variants?.[0]?.formattedPrice || '';

      const card = document.createElement('div');
      card.className = 'amm-stl__hotspot-card';
      card.dataset.index = i;

      const anchorLeft  = p.x > 55 ? 'auto'                       : `calc(${p.x}% + 22px)`;
      const anchorRight = p.x > 55 ? `calc(${100 - p.x}% + 22px)` : 'auto';
      const anchorTop   = p.y > 60 ? 'auto'                       : `calc(${p.y}% - 16px)`;
      const anchorBot   = p.y > 60 ? `calc(${100 - p.y}% + 16px)` : 'auto';

      card.style.cssText = `left:${anchorLeft};right:${anchorRight};top:${anchorTop};bottom:${anchorBot};`;
      card.innerHTML = `
        <a href="${url}">
          ${item.image ? `<img src="${item.image}" alt="${item.title || ''}" class="amm-stl__product-img" loading="lazy" width="200" height="200">` : ''}
          <p class="amm-stl__product-title">${item.title || ''}</p>
          <p class="amm-stl__product-price">${price}</p>
        </a>`;
      this.hotspotsEl?.appendChild(card);
    });

    /* Dot click interactions */
    this.hotspotsEl?.querySelectorAll('.amm-stl__hotspot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.index;
        const active = btn.classList.contains('is-active');
        this.hotspotsEl.querySelectorAll('.amm-stl__hotspot-btn').forEach(b => b.classList.remove('is-active'));
        this.hotspotsEl.querySelectorAll('.amm-stl__hotspot-card').forEach(c => c.classList.remove('is-visible'));
        if (!active) {
          btn.classList.add('is-active');
          this.hotspotsEl.querySelector(`.amm-stl__hotspot-card[data-index="${idx}"]`)?.classList.add('is-visible');
        }
      });
    });

    /* Product strip below image */
    const cards = items.map((item, i) => this.cardHTML(item, i, { shopLink: true })).join('');
    this.productsEl.innerHTML = `<ul class="amm-stl__product-list">${cards}</ul>`;
  }

  renderCinematicDrawer(items) {
    const trigger     = this.el.querySelector('.amm-stl__drawer-trigger');
    const drawer      = this.el.querySelector('.amm-stl__drawer');
    const drawerProds = this.el.querySelector('.amm-stl__drawer-products');
    const backdrop    = this.el.querySelector('.amm-stl__backdrop');
    const closeBtn    = this.el.querySelector('.amm-stl__drawer-close');
    const countEl     = this.el.querySelector('.amm-stl__drawer-count');

    if (countEl) {
      countEl.textContent = `· ${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    }

    const cards = items.map((item, i) => this.cardHTML(item, i, { shopLink: true })).join('');
    if (drawerProds) drawerProds.innerHTML = `<ul class="amm-stl__product-list">${cards}</ul>`;

    const open  = () => { drawer?.removeAttribute('hidden'); backdrop?.removeAttribute('hidden'); trigger?.setAttribute('aria-expanded', 'true');  };
    const close = () => { drawer?.setAttribute('hidden', '');  backdrop?.setAttribute('hidden', '');  trigger?.setAttribute('aria-expanded', 'false'); };

    trigger?.addEventListener('click', () => trigger.getAttribute('aria-expanded') === 'true' ? close() : open());
    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
  }

  renderFilmStrip(items) {
    /* Dot indicators injected into the image wrapper */
    const dotsHtml = items.map((_, i) =>
      `<div class="amm-stl__film-dot${i === 0 ? ' is-active' : ''}">${i + 1}</div>`
    ).join('');
    const indicators = document.createElement('div');
    indicators.className = 'amm-stl__film-indicators';
    indicators.innerHTML = dotsHtml;
    this.el.querySelector('.amm-stl__image-wrap')?.appendChild(indicators);

    const cards = items.map((item, i) =>
      this.cardHTML(item, i, { counter: true, total: items.length, shopLink: true })
    ).join('');
    this.productsEl.innerHTML = `<ul class="amm-stl__product-list">${cards}</ul>`;

    const list  = this.productsEl.querySelector('.amm-stl__product-list');
    const dots  = indicators.querySelectorAll('.amm-stl__film-dot');
    const cards2 = this.productsEl.querySelectorAll('.amm-stl__product-card');

    if (!list) return;

    /* Mark first card active immediately */
    cards2[0]?.classList.add('is-active');

    list.addEventListener('scroll', () => {
      const cardW = cards2[0]?.offsetWidth || 1;
      const active = Math.round(list.scrollLeft / cardW);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      cards2.forEach((c, i) => c.classList.toggle('is-active', i === active));
    }, { passive: true });
  }

  renderMosaic(items) {
    const cards = items.map((item, i) => this.cardHTML(item, i, { shopBtn: true })).join('');
    this.productsEl.innerHTML = `<ul class="amm-stl__product-list">${cards}</ul>`;
  }

  renderEmpty() {
    this.productsEl.innerHTML =
      '<p class="amm-stl__empty">No look configured for this product.</p>';
  }

  renderError() {
    this.productsEl.innerHTML =
      '<p class="amm-stl__error">Unable to load look data. Please check the API token in Theme Settings.</p>';
  }
}

document.querySelectorAll('.amm-stl[data-main-product-id]').forEach(el => new AmmShopTheLook(el));
```

- [ ] **8.2 Commit**

```bash
git add assets/amm-shop-the-look.js
git commit -m "feat: add STL API client and all five layout renderers"
```

---

## Task 9: Manual QA

No automated tests exist for Shopify sections. Use `shopify theme dev` for all validation.

- [ ] **9.1 Start dev server**

```bash
shopify theme dev --store=<your-store-handle>
```

- [ ] **9.2 Set API token in theme settings**

In the Shopify theme editor: go to **Theme Settings → App Integrations → API token** and paste the `stl_` token from the Shop the Look app dashboard.

- [ ] **9.3 Add section to homepage and test each layout**

Add "AMM Shop the Look" section to Home page. Set a Main Product that has a look configured in the Shop the Look app. For each of the five layout values:

- [ ] Products render (title, image, price visible)
- [ ] Look image renders correctly from "Custom upload" source
- [ ] Look image renders correctly from "Product image" source (set `product_image_index` to 0)
- [ ] No JS errors in browser console (`F12 → Console`)

- [ ] **9.4 Test product page auto-detection**

Add the section to a product template (e.g., `templates/product.json`). Leave "Main product" blank. Navigate to a product page whose ID is configured in the Shop the Look app. Verify products load without setting `main_product`.

- [ ] **9.5 Test Hotspot layout positioning**

Select "Hotspot Interactive" layout. Adjust `hotspot_1_x` / `hotspot_1_y` sliders in the theme editor and confirm the dot moves on the look image. Click dot — confirm product card appears. Click dot again — confirm card dismisses.

- [ ] **9.6 Test Cinematic Drawer open/close**

Select "Cinematic Drawer" layout. Click the bottom bar — confirm drawer slides up. Click ✕ — confirm drawer closes. Click outside the drawer (backdrop) — confirm drawer closes.

- [ ] **9.7 Test Film Strip scroll sync**

Select "Film Strip" layout. Scroll the product list horizontally — confirm numbered dots in the image highlight in sync with the visible card.

- [ ] **9.8 Test error and empty states**

- Set an invalid API token → verify error message renders, no JS crash.
- Set a product with no look in the STL app → verify empty message renders.

- [ ] **9.9 Run theme check**

```bash
shopify theme check
```
Expected: No errors.

- [ ] **9.10 Commit**

```bash
git add sections/amm-shop-the-look.liquid assets/amm-shop-the-look.css assets/amm-shop-the-look.js
git commit -m "feat: complete amm-shop-the-look section — 5 luxury layouts with STL API integration"
```

---

## Self-Review

**Spec coverage:**
- ✅ 5 layout types: editorial-split, hotspot, cinematic-drawer, film-strip, mosaic
- ✅ API bearer token stored in global theme settings (`settings.stl_api_token`)
- ✅ Main product picker for non-product pages; auto-fallback to `product.id` on product pages
- ✅ Look image: custom upload or product image index, `visible_if` conditional display
- ✅ Section usable on all page types (no `disabled_on` for product/collection pages)
- ✅ New section — does not modify existing `shop-the-look.liquid`
- ✅ Premium/luxury aesthetic: DINPro, uppercase tracking, staggered animations, minimal palette

**Known risks to verify during QA:**
- ⚠️ **CORS** — The STL API must allow cross-origin requests from the storefront domain. If `fetch()` is blocked, a Shopify App Proxy will be needed (separate work item).
- ⚠️ **`item.handle`** — The STL API docs don't explicitly confirm this field exists. The `productUrl()` method falls back to `/?variant=<id>` if `handle` is absent. Verify the actual API response during QA.
- ⚠️ **`visible_if` syntax** — Shopify's `visible_if` is an OS 2.0 feature. If the theme editor shows all fields regardless, verify the syntax `{{section.settings.look_image_source}} == 'custom_image'` against the Shopify changelog for the version in use.

**Placeholder scan:** None. All code, commands, and expected outputs are complete.

**Type/name consistency:** All method names (`cardHTML`, `renderEditorialSplit`, `renderHotspot`, `renderCinematicDrawer`, `renderFilmStrip`, `renderMosaic`, `renderEmpty`, `renderError`, `productUrl`) are consistent between the `render()` dispatcher and their definitions.
