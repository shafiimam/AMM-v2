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
