// Header: reads all copy, links and images from the nav fragment (nav.plain.html) and
// builds the masthead (site-selector bar, primary row, utility row), click dropdowns,
// a search bar, and a slide-in mobile menu.

const isDesktop = window.matchMedia('(width >= 1200px)');

/**
 * Fetches the nav fragment. Metadata-independent dual fetch: /content first (local preview),
 * then the site root (Document Authoring / Edge Delivery).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Rewrites relative image sources so they resolve against the fragment URL.
 * @param {Element} root container
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|data:|\/)/.test(src)) img.src = new URL(src, base).href;
    img.loading = 'eager';
  });
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * Closes every open dropdown/search panel except the one passed.
 * @param {Element} nav nav element
 * @param {Element} [keep] trigger to keep open
 */
function closeAll(nav, keep) {
  nav.querySelectorAll('[aria-expanded="true"]').forEach((t) => {
    if (t !== keep && !t.classList.contains('nav-hamburger')) t.setAttribute('aria-expanded', 'false');
  });
  const search = nav.querySelector('.nav-search-panel');
  if (search && (!keep || !keep.classList.contains('nav-search-toggle'))) search.hidden = true;
}

/**
 * Builds a dropdown list item from a fragment <li> holding a label and a nested list.
 * @param {Element} li fragment list item
 * @param {number} index position
 * @param {Element} nav nav element (for closeAll)
 * @returns {Element} decorated list item
 */
function buildDropdown(li, index, nav) {
  const labelNode = li.querySelector(':scope > p') || li.firstChild;
  const label = (labelNode?.textContent || '').trim();
  const list = li.querySelector(':scope > ul');
  const item = el('li', 'nav-item nav-drop');
  const id = `nav-dropdown-${index}`;
  const isMore = label.toLowerCase() === 'menu';
  const trigger = el('button', 'nav-trigger', { type: 'button', 'aria-expanded': 'false', 'aria-controls': id });
  if (isMore) {
    item.classList.add('nav-more');
    trigger.setAttribute('aria-label', 'additional menu items');
    trigger.append(el('span', 'nav-bars'));
  } else {
    trigger.textContent = label;
  }
  item.append(trigger);
  if (list) {
    // panel > column > list (mirrors the source dropdown structure; columns can grow later)
    const panel = el('div', 'nav-dropdown', { id });
    const column = el('div', 'nav-dropdown-column');
    list.className = 'nav-dropdown-list';
    list.querySelectorAll(':scope > li').forEach((sub) => sub.classList.add('nav-dropdown-item'));
    if (!isMore) {
      // mobile sub-panel back control (hidden on desktop)
      const backBtn = el('button', 'nav-back-button', { type: 'button' });
      backBtn.textContent = label;
      panel.append(backBtn);
      backBtn.addEventListener('click', () => trigger.setAttribute('aria-expanded', 'false'));
    }
    column.append(list);
    panel.append(column);
    item.append(panel);
  }
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAll(nav, trigger);
    trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  return item;
}

/**
 * Builds the search toggle and the search bar panel (form controls live in JS, not the fragment).
 * @param {Element} section fragment section holding the search icon image
 * @param {Element} nav nav element
 * @returns {{item: Element, panel: Element}}
 */
function buildSearch(section, nav) {
  const icon = section.querySelector('img');
  const item = el('div', 'nav-search');
  const toggle = el('button', 'nav-trigger nav-search-toggle', { type: 'button', 'aria-label': 'site search', 'aria-expanded': 'false' });
  if (icon) toggle.append(icon);
  item.append(toggle);

  const panel = el('div', 'nav-search-panel');
  panel.hidden = true;
  const form = el('form', 'nav-search-form', { action: '/search', role: 'search' });
  const label = el('label', 'nav-search-label', { for: 'nav-search-input' });
  label.textContent = icon?.alt || 'Search';
  const input = el('input', 'nav-search-input', {
    type: 'text', id: 'nav-search-input', name: 'q', 'aria-label': 'Search', autocomplete: 'off',
  });
  const close = el('button', 'nav-search-close', { type: 'button', 'aria-label': 'Close search' });
  form.append(label, input);
  panel.append(form, close);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = toggle.getAttribute('aria-expanded') === 'true';
    closeAll(nav, toggle);
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
    if (!open) input.focus();
  });
  close.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  });
  panel.addEventListener('click', (e) => e.stopPropagation());
  return { item, panel };
}

/**
 * Opens or closes the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean} [force] desired state
 */
function toggleMenu(nav, force) {
  const open = force ?? nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  const ham = nav.querySelector('.nav-hamburger');
  ham.setAttribute('aria-expanded', open ? 'true' : 'false');
  ham.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu');
  document.body.style.overflowY = open && !isDesktop.matches ? 'hidden' : '';
  if (!open) closeAll(nav);
}

/**
 * Decorates the header block.
 * @param {Element} block header block
 */
export default async function decorate(block) {
  const frag = await fetchNav();
  if (!frag) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = frag.html;
  resolveImages(tmp, frag.base);
  const sections = [...tmp.querySelectorAll(':scope > div')];
  const [selectorSec, brandSec, navSec, toolsSec, utilitySec] = sections;

  block.textContent = '';
  const nav = el('nav', 'nav', { id: 'nav', 'aria-expanded': 'false', 'aria-label': 'Main navigation' });

  // Row 0: site selector bar
  const selector = el('div', 'nav-site-selector');
  if (selectorSec) {
    const list = selectorSec.querySelector('ul');
    if (list) {
      list.className = 'nav-site-selector-list';
      const here = window.location.pathname;
      const fp = here.startsWith('/financial-professional');
      [...list.children].forEach((li, i) => {
        const a = li.querySelector('a');
        if (a && ((i === 0 && !fp) || (i > 0 && fp))) a.setAttribute('aria-current', 'page');
      });
      selector.append(list);
    }
  }

  // Row 1: primary
  const primary = el('div', 'nav-primary');
  const brand = el('div', 'nav-brand');
  if (brandSec) brand.append(...brandSec.childNodes);
  brand.querySelector('a')?.setAttribute('aria-label', 'Jackson home');

  const sectionsWrap = el('div', 'nav-sections');
  const navList = el('ul', 'nav-list');
  const topList = navSec?.querySelector(':scope > ul');
  [...(topList?.children || [])].forEach((li, i) => navList.append(buildDropdown(li, i, nav)));

  const tools = el('div', 'nav-tools');
  let searchPanel;
  if (toolsSec) {
    const { item, panel } = buildSearch(toolsSec, nav);
    tools.append(item);
    searchPanel = panel;
    const cta = toolsSec.querySelector('a');
    if (cta) {
      cta.className = 'nav-cta';
      tools.append(cta);
    }
  }
  sectionsWrap.append(navList);

  const hamburger = el('button', 'nav-hamburger', {
    type: 'button', 'aria-controls': 'nav', 'aria-expanded': 'false', 'aria-label': 'Open Menu',
  });
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span><span class="nav-hamburger-label">Menu</span>';
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(nav);
  });

  primary.append(brand, hamburger, sectionsWrap, tools);

  // Row 2: utility (phone + share)
  const utility = el('div', 'nav-utility');
  if (utilitySec) {
    const paras = [...utilitySec.querySelectorAll(':scope > p')];
    if (paras[0]) {
      paras[0].className = 'nav-utility-phone';
      utility.append(paras[0]);
    }
    const share = el('div', 'nav-utility-share');
    if (paras[1]) {
      paras[1].className = 'nav-utility-share-label';
      share.append(paras[1]);
    }
    const social = utilitySec.querySelector(':scope > ul');
    if (social) {
      social.className = 'nav-social';
      share.append(social);
    }
    utility.append(share);
  }

  nav.append(selector, primary, utility);
  if (searchPanel) nav.append(searchPanel);

  document.addEventListener('click', () => closeAll(nav));
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) toggleMenu(nav, false);
    else closeAll(nav);
  });
  // viewport resize: reset menus and panels when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, false);
    closeAll(nav);
  });

  const wrapper = el('div', 'nav-wrapper');
  wrapper.append(nav);
  block.append(wrapper);
}
