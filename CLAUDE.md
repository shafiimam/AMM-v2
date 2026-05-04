# AMM-v2 Shopify Theme — Claude Code Guide

## Quick Start

**Theme type:** Custom Shopify theme (Liquid + vanilla JS + CSS)  
**Build tool:** Shopify CLI  
**Key branches:** `master` (production), `ongoing-development` (active)

### Common Commands

```bash
# Watch theme in development
shopify theme dev

# Push theme to Shopify admin
shopify theme push

# Pull latest from Shopify
shopify theme pull

# View sections/snippets
ls sections/
ls snippets/
ls assets/
```

---

## Architecture

### Section + Asset Pairing

Each interactive section has a matching JS + CSS asset:

```
sections/amm-shop-the-look.liquid
├── assets/amm-shop-the-look.js    (class-based, ES module)
├── assets/amm-shop-the-look.css   (BEM naming)
```

**Pattern:** Section markup outputs data attributes → JS reads data attributes → JS manipulates DOM.

### Data Attributes (Liquid → JS)

Sections communicate state to JS via data attributes:

```liquid
<section
  id="shopify-section-{{ section.id }}"
  data-section-id="{{ section.id }}"
  data-layout="{{ section.settings.layout }}"
  data-block-count="{{ section.blocks.size }}"
>
```

JS reads these:
```javascript
class AmmShopTheLook {
  constructor(el) {
    this.layout = el.dataset.layout;
    this.blockCount = parseInt(el.dataset.blockCount);
    this.init();
  }
}
```

---

## File Organization

| Directory | Purpose |
|-----------|---------|
| `sections/` | Custom Shopify sections (.liquid). Each section can have blocks. |
| `snippets/` | Reusable Liquid components included by sections. |
| `assets/` | Static JS, CSS, images. Name asset to match section (e.g., `amm-shop-the-look.js` for section `amm-shop-the-look.liquid`). |
| `templates/` | Page templates (index.liquid, collection.liquid, etc.). Tied to Shopify store URLs. |
| `config/settings_schema.json` | Global theme settings and color schemes. Loaded into DOM via Liquid. |
| `layout/theme.liquid` | Master layout (header, footer, root HTML). |
| `locales/` | Translated strings (`.json`). |

---

## Liquid Conventions

### BEM Naming

All sections use **BEM** (`block__element--modifier`):

```liquid
<section class="amm-stl amm-stl--{{ layout }}">
  <div class="amm-stl__inner">
    <div class="amm-stl__image-wrap">
      <img class="amm-stl__image" />
    </div>
  </div>
</section>
```

**Benefits:** Class names are self-documenting. Easy to extend with modifiers.

### Section Schema

Each section has a schema with settings and blocks:

```liquid
{% schema %}
{
  "name": "Shop the Look",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Complete the look"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "Layout",
      "options": [
        { "value": "editorial-split", "label": "Editorial Split" },
        { "value": "hotspot", "label": "Hotspot" }
      ]
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product",
      "settings": [...]
    }
  ]
}
{% endschema %}
```

### Color Scheme Integration

Theme settings define color schemes. Sections apply them:

```liquid
{%- assign color_scheme_hash = section.settings.color_scheme.settings.background | md5 -%}
<section class="color-scheme color-scheme--{{ section.settings.color_scheme.id }}">
```

### Responsive Images

Always use `picture` element with `image_tag` filter:

```liquid
<picture>
  {%- if section.settings.mobile_image != blank -%}
    <source media="(max-width: 699px)" srcset="{{ section.settings.mobile_image | image_url: width: 400 }} 400w">
  {%- endif -%}
  {{- section.settings.look_image | image_url: width: 1200 | image_tag: widths: '400,600,800,1200' -}}
</picture>
```

---

## JavaScript Conventions

### Class-Based Components

Sections instantiate JS classes with the section DOM element:

```javascript
class AmmShopTheLook {
  constructor(el) {
    this.el = el;
    this.layout = el.dataset.layout;
    this.init();
  }

  init() {
    if (this.layout === 'hotspot') this.setupHotspot();
    if (this.layout === 'cinematic-drawer') this.setupCinematicDrawer();
  }

  setupHotspot() {
    // Layout-specific JS
  }
}
```

**Usage in Liquid:**
```liquid
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('#shopify-section-{{ section.id }}');
    new AmmShopTheLook(el);
  });
</script>
```

### DOM Querying

Use `querySelector` and `dataset` for interop with Liquid data attributes:

```javascript
const blocks = Array.from(this.el.querySelectorAll('[data-block-id]'));
blocks.forEach((block) => {
  const x = parseFloat(block.dataset.hotspotX);
});
```

### Avoid Mutation

Use immutable patterns. If cloning DOM, remove modals to avoid ID conflicts:

```javascript
const card = document.createElement('div');
card.innerHTML = block.innerHTML;
// Remove duplicate forms/modals so IDs stay unique
card.querySelectorAll('quick-buy-modal').forEach(el => el.remove());
```

---

## CSS Conventions

### BEM Naming (Already Established)

```css
.amm-stl { }
.amm-stl__image { }
.amm-stl--hotspot { }
.amm-stl__product.is-active { }
```

### Layout-Specific Styles

Use CSS classes to toggle layouts:

```css
/* Editorial split layout */
.amm-stl--editorial-split .amm-stl__stage {
  display: grid;
  grid-template-columns: 3fr 2fr;
}

/* Hotspot layout */
.amm-stl--hotspot .amm-stl__image-wrap {
  position: relative;
}
```

### Responsive Design

Mobile first. Use Shopify breakpoints:

```css
@media (min-width: 700px) {
  .amm-stl__stage {
    display: grid;
  }
}
```

---

## Git Workflow

**Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add hotspot layout to Shop the Look section
fix: resolve race condition in drawer interactions
refactor: update styles for Shop the Look feature
chore: remove outdated documentation
docs: update README with setup instructions
```

**Branch flow:** Feature branches → `ongoing-development` → `master` (production)

---

## Common Pitfalls

1. **Asset naming mismatch:** If you add `new-section.liquid`, create `new-section.js` + `new-section.css` with matching names.

2. **ID conflicts:** When cloning DOM (e.g., hotspot cards), remove modals and forms so IDs don't duplicate. Forward clicks to originals.

3. **Responsive images:** Always use `picture` + `image_url` filters. Never hardcode image widths.

4. **Data attributes:** Liquid outputs them; JS reads them. Don't hardcode JS logic that should come from Liquid settings.

5. **Color schemes:** Always check `section.settings.color_scheme` and apply the correct CSS class. Color scheme hash is used for CSS specificity.

6. **Shopify CLI sync:** Run `shopify theme dev` before making changes. Push changes with `shopify theme push` before merging to `master`.

---

## Related Documentation

- **Implementation Plans:** [docs/superpowers/plans/](docs/superpowers/plans/) — Feature scope and architecture
- **Shopify Docs:** [Shopify Liquid Reference](https://shopify.dev/api/liquid), [Shopify Theme Dev](https://shopify.dev/docs/themes)
- **Section Examples:** Browse [sections/](sections/) directory for patterns

---

## Development Checklist

Before committing:

- [ ] Section markup uses BEM naming
- [ ] Data attributes passed from Liquid to JS
- [ ] Responsive images use `picture` + `image_url` filter
- [ ] JS class properly instantiated in Liquid script tag
- [ ] Asset filenames match section names
- [ ] No hardcoded IDs in cloned DOM (risk of duplication)
- [ ] Shopify CLI theme dev tested locally
- [ ] Commit message follows Conventional Commits
