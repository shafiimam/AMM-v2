(function () {
  if (window.customElements.get('slideshow-cta-dropdown')) return;

  class SlideshowCtaDropdown extends HTMLElement {
  constructor() {
    super();
    this.trigger = null;
    this.menu = null;
    this.items = [];
    this.isOpen = false;
    this.alignment = 'start';

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
  }

  connectedCallback() {
    this.trigger = this.querySelector('[data-dropdown-trigger]');
    this.menu = this.querySelector('[data-dropdown-menu]');
    if (!this.trigger || !this.menu) return;

    this.menuOriginParent = this.menu.parentNode;
    this.menuOriginNext = this.menu.nextSibling;

    this.items = Array.from(this.menu.querySelectorAll('[role="menuitem"]'));

    this.trigger.addEventListener('click', this.handleTriggerClick);
    this.items.forEach((item) => item.addEventListener('click', this.handleItemClick));
    this.addEventListener('keydown', this.handleKeydown);
    this.menu.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick, true);
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    this.removeEventListener('keydown', this.handleKeydown);
    if (this.menu) this.menu.removeEventListener('keydown', this.handleKeydown);
    if (this.isOpen && this.menu && this.menuOriginParent) {
      this.menuOriginParent.insertBefore(this.menu, this.menuOriginNext);
    }
  }

  resolveAlignment() {
    const group = this.closest('.button-group');
    if (!group) return 'start';
    const isDesktop = window.matchMedia('(min-width: 700px)').matches;
    const tokens = Array.from(group.classList);
    const find = (prefix) => tokens.find((t) => t.startsWith(prefix));
    const mobileToken = find('justify-');
    const smToken = find('sm:justify-');
    const active = isDesktop && smToken ? smToken : mobileToken;
    if (!active) return 'start';
    if (active.endsWith('-center')) return 'center';
    if (active.endsWith('-end')) return 'end';
    return 'start';
  }

  positionMenu() {
    const rect = this.trigger.getBoundingClientRect();
    const gap = 8;
    let left;
    if (this.alignment === 'center') {
      left = rect.left + rect.width / 2;
    } else if (this.alignment === 'end') {
      left = rect.right;
    } else {
      left = rect.left;
    }
    this.menu.style.top = `${rect.bottom + gap}px`;
    this.menu.style.left = `${left}px`;
  }

  open() {
    if (this.isOpen) return;
    this.alignment = this.resolveAlignment();
    if (this.alignment === 'start') {
      delete this.menu.dataset.align;
    } else {
      this.menu.dataset.align = this.alignment;
    }
    this.isOpen = true;
    document.body.appendChild(this.menu);
    this.menu.hidden = false;
    this.positionMenu();
    this.trigger.setAttribute('aria-expanded', 'true');
    this.classList.add('is-open');
    requestAnimationFrame(() => this.menu.classList.add('is-open'));
    document.addEventListener('click', this.handleDocumentClick, true);
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('scroll', this.handleViewportChange, true);
  }

  close({ restoreFocus = false } = {}) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.menu.classList.remove('is-open');
    this.menu.hidden = true;
    if (this.menuOriginParent) {
      this.menuOriginParent.insertBefore(this.menu, this.menuOriginNext);
    }
    this.trigger.setAttribute('aria-expanded', 'false');
    this.classList.remove('is-open');
    document.removeEventListener('click', this.handleDocumentClick, true);
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    if (restoreFocus) this.trigger.focus();
  }

  handleViewportChange() {
    this.positionMenu();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  focusItem(index) {
    if (!this.items.length) return;
    const wrapped = ((index % this.items.length) + this.items.length) % this.items.length;
    this.items[wrapped].focus();
  }

  handleTriggerClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
    if (this.isOpen) {
      requestAnimationFrame(() => this.focusItem(0));
    }
  }

  handleItemClick() {
    this.close();
  }

  handleDocumentClick(event) {
    if (this.contains(event.target) || this.menu.contains(event.target)) return;
    this.close();
  }

  handleKeydown(event) {
    const { key } = event;

    if (key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close({ restoreFocus: true });
      return;
    }

    const activeIndex = this.items.indexOf(document.activeElement);

    if (key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen) {
        this.open();
        requestAnimationFrame(() => this.focusItem(0));
        return;
      }
      this.focusItem(activeIndex + 1);
      return;
    }

    if (key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen) {
        this.open();
        requestAnimationFrame(() => this.focusItem(this.items.length - 1));
        return;
      }
      this.focusItem(activeIndex - 1);
      return;
    }

    if (key === 'Home' && this.isOpen) {
      event.preventDefault();
      this.focusItem(0);
      return;
    }

    if (key === 'End' && this.isOpen) {
      event.preventDefault();
      this.focusItem(this.items.length - 1);
      return;
    }

    if (key === 'Tab' && this.isOpen) {
      this.close();
    }
  }
}

  window.customElements.define('slideshow-cta-dropdown', SlideshowCtaDropdown);
})();
