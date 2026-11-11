/* eslint-disable */
/* global WebImporter */

/**
 * tabs-product parser (jackson.com product page shell: div.step-progress-bar.v2, sometimes wrapped
 * in div.experiencefragment-personalization > #expVar-* > .xf-content-height > .parsys, with
 * <script> siblings between the repeating units).
 * Block structure (Tabs convention): one row per tab: label | panel. The product title (h1)
 * is placed as default content right before the block.
 *  - A panel that is only the product hero (div.image-herospace) is inlined as
 *    picture + heading + text + CTA (the block renders it as a photo with an inset text box).
 *  - Any other panel becomes a fragment: the cell holds a bare /fragments/<page>/<tab> link and
 *    the panel content goes onto params.fragments as { element, path }. Inside the fragment the
 *    hero is flattened to plain picture / heading / text so it reads as default content.
 */
const TAB_SELECTORS = [
  '.tab-container ul > li',
  'ul[role="tablist"] > li',
  'li[aria-controls]',
  '[role="tab"]',
];
const PANEL_SELECTORS = [
  '.tab-content-wrappper > .tab-content',
  '.tab-content',
  '[role="tabpanel"]',
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tab';
}

function pageSlug(document, params) {
  const candidates = [];
  if (params && params.originalURL) candidates.push(params.originalURL);
  const og = document.querySelector('meta[property="og:url"]');
  if (og) candidates.push(og.getAttribute('content'));
  for (const url of candidates) {
    try {
      const path = new URL(url, 'https://www.jackson.com').pathname
        .replace(/\.html?$/, '').replace(/\/+$/, '');
      if (path) return path.split('/').filter(Boolean).map(slugify).join('/');
    } catch (e) { /* ignore */ }
  }
  return 'page';
}

// first selector group that matches wins; outermost matches only, in document order
function firstMatching(root, selectors) {
  for (const sel of selectors) {
    let found = [];
    try { found = [...root.querySelectorAll(sel)]; } catch (e) { found = []; }
    found = found.filter((el, i, arr) => arr.indexOf(el) === i && !arr.some((o) => o !== el && o.contains(el)));
    if (found.length) return found;
  }
  return [];
}

function cleanInline(document, src, tag) {
  const el = document.createElement(tag);
  el.innerHTML = src.innerHTML.trim();
  [...el.querySelectorAll('*')].reverse().forEach((d) => {
    if (!d.matches('sup, sub, em, strong, b, i, br, a')) d.replaceWith(...d.childNodes);
  });
  el.innerHTML = el.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return el;
}

function labelContent(document, li) {
  const clone = li.cloneNode(true);
  clone.querySelectorAll('.hidden, .tab-form-number, .tab-archive-form-number').forEach((el) => el.remove());
  const parts = [];
  const icon = clone.querySelector('img');
  if (icon && icon.getAttribute('src')) parts.push(icon);
  const text = clone.textContent.replace(/\s+/g, ' ').trim();
  const link = clone.querySelector('a[href]');
  if (link && text) {
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = text;
    parts.push(a);
  } else if (text) {
    parts.push(text);
  }
  return parts;
}

// image-herospace -> [img, h2, p..., p>a...]
function heroNodes(document, hero) {
  const nodes = [];
  const img = hero.querySelector('.image-herospace__image img') || hero.querySelector('img');
  if (img && img.getAttribute('src')) nodes.push(img);
  const title = hero.querySelector('.image-herospace__title h1, .image-herospace__title h2')
    || hero.querySelector('.image-herospace__title')
    || hero.querySelector('h1, h2');
  if (title && title.textContent.trim()) nodes.push(cleanInline(document, title, 'h2'));
  const desc = hero.querySelector('.image-herospace__description');
  if (desc && desc.textContent.trim()) {
    const ps = [...desc.querySelectorAll('p')].filter((p) => p.textContent.trim());
    if (ps.length) ps.forEach((p) => nodes.push(cleanInline(document, p, 'p')));
    else nodes.push(cleanInline(document, desc, 'p'));
  }
  const seen = new Set();
  hero.querySelectorAll('.image-herospace__cta a[href], .image-herospace__content a[href]').forEach((a) => {
    const text = a.textContent.replace(/\s+/g, ' ').trim();
    const key = `${a.getAttribute('href')}|${text}`;
    if (!text || seen.has(key)) return;
    seen.add(key);
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text;
    p.append(link);
    nodes.push(p);
  });
  return nodes;
}

// per-tab form number(s): hidden in the tab label in source (shown in the page's form-number slot
// for the active tab) -> trailing paragraph(s) of that tab's panel
function formNumberNodes(document, li) {
  return [...li.querySelectorAll('.tab-form-number, .tab-archive-form-number')]
    .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
    .filter((t, i, all) => t && all.indexOf(t) === i)
    .map((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      return p;
    });
}

function isHeroOnly(panel) {
  const hero = panel.querySelector('.image-herospace');
  if (!hero) return false;
  const clone = panel.cloneNode(true);
  clone.querySelector('.image-herospace').remove();
  return !clone.textContent.trim() && !clone.querySelector('img, iframe, table');
}

export default function parse(element, { document, params }) {
  const root = element.matches('.step-progress-bar') ? element
    : (element.querySelector('.step-progress-bar') || element);
  root.querySelectorAll('script, style, noscript').forEach((el) => el.remove());

  const title = root.querySelector('.header .subpage-header-block .title h1')
    || root.querySelector('.header .title h1, .header h1')
    || root.querySelector('h1');
  const heading = title && title.textContent.trim() ? cleanInline(document, title, 'h1') : null;

  const tabRoot = root.querySelector('.tab') || root;
  const tabs = firstMatching(tabRoot, TAB_SELECTORS);
  const panels = firstMatching(tabRoot, PANEL_SELECTORS);

  const slug = pageSlug(document, params);
  const fragments = params && Array.isArray(params.fragments) ? params.fragments : null;
  const used = new Set();
  const cells = [];

  tabs.forEach((li, index) => {
    const label = labelContent(document, li);
    if (!label.length) return;
    const controls = li.getAttribute('aria-controls');
    const panel = (controls && panels.find((p) => p.id === controls)) || panels[index] || null;
    let panelCell = '';
    if (panel && (panel.textContent.trim() || panel.querySelector('img, iframe'))) {
      if (isHeroOnly(panel)) {
        panelCell = [...heroNodes(document, panel.querySelector('.image-herospace')), ...formNumberNodes(document, li)];
      } else {
        let id = slugify(li.id || li.textContent);
        const base = id;
        let n = 2;
        while (used.has(id) || (fragments && fragments.some((f) => f.path === `/fragments/${slug}/${id}`))) {
          id = `${base}-${n}`; n += 1;
        }
        used.add(id);
        const path = `/fragments/${slug}/${id}`;
        const container = document.createElement('div');
        container.append(...panel.childNodes);
        container.querySelectorAll('.image-herospace').forEach((hero) => {
          const wrap = document.createElement('div');
          wrap.append(...heroNodes(document, hero));
          hero.replaceWith(wrap);
        });
        container.querySelectorAll('.tab-form-number, .tab-archive-form-number').forEach((el) => el.remove());
        container.append(...formNumberNodes(document, li));
        if (fragments) fragments.push({ element: container, path });
        const a = document.createElement('a');
        a.href = path;
        a.textContent = path;
        const p = document.createElement('p');
        p.append(a);
        panelCell = [p];
      }
    }
    cells.push([label, panelCell]);
  });

  if (!cells.length) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-product', cells });
  if (heading) element.replaceWith(heading, block);
  else element.replaceWith(block);
}
