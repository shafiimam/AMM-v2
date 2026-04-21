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

  productUrl(item) {
    if (item.handle) return `/products/${item.handle}`;
    const variantId = item.variants?.[0]?.id?.replace('gid://shopify/ProductVariant/', '');
    return variantId ? `/?variant=${variantId}` : '#';
  }

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
    const dots = items.slice(0, 4).map((item, i) => {
      const p = this.hotspotPositions[i];
      return `<button class="amm-stl__hotspot-btn" data-index="${i}"
        style="top:${p.y}%;left:${p.x}%;"
        aria-label="${item.title || `Product ${i + 1}`}">${i + 1}</button>`;
    }).join('');
    if (this.hotspotsEl) this.hotspotsEl.innerHTML = dots;

    items.slice(0, 4).forEach((item, i) => {
      const p = this.hotspotPositions[i];
      const url = this.productUrl(item);
      const price = item.variants?.[0]?.formattedPrice || '';

      const card = document.createElement('div');
      card.className = 'amm-stl__hotspot-card';
      card.dataset.index = i;

      const anchorLeft  = p.x > 55 ? 'auto'                        : `calc(${p.x}% + 22px)`;
      const anchorRight = p.x > 55 ? `calc(${100 - p.x}% + 22px)` : 'auto';
      const anchorTop   = p.y > 60 ? 'auto'                        : `calc(${p.y}% - 16px)`;
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
    const indicators = document.createElement('div');
    indicators.className = 'amm-stl__film-indicators';
    indicators.innerHTML = items.map((_, i) =>
      `<div class="amm-stl__film-dot${i === 0 ? ' is-active' : ''}">${i + 1}</div>`
    ).join('');
    this.el.querySelector('.amm-stl__image-wrap')?.appendChild(indicators);

    const cards = items.map((item, i) =>
      this.cardHTML(item, i, { counter: true, total: items.length, shopLink: true })
    ).join('');
    this.productsEl.innerHTML = `<ul class="amm-stl__product-list">${cards}</ul>`;

    const list   = this.productsEl.querySelector('.amm-stl__product-list');
    const dots   = indicators.querySelectorAll('.amm-stl__film-dot');
    const cards2 = this.productsEl.querySelectorAll('.amm-stl__product-card');

    if (!list) return;

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
