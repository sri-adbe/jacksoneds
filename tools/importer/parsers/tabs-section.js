/* eslint-disable */
/* global WebImporter */

/**
 * tabs-section parser (jackson.com div.tab.v4 / div.tab-container.v4).
 * Block structure (blocks/tabs-section): one row per tab: label | panel.
 * Text-only panels (rich text) are inlined. Panels holding components (cards,
 * columns, resource listings, images) become fragments: the panel cell holds a
 * bare link whose text equals its href, and the panel content is pushed to
 * params.fragments as { element, path } (the block loads it via loadFragment /
 * auto-blocking of /fragments/ links).
 *
 * Variants (from cached instances):
 *  - resource gallery panels           -> 'tabs-section (image-magenta-grey-shadow)'
 *  - state product panels (cta-product-card) -> 'tabs-section'
 *  - everything else                   -> 'tabs-section (alt-3)'
 */
const COMPONENT_SELECTOR = [
  '.cta-list', '.comparison-highlight-layout', '.cta-product-card', '.resource-listing',
  '.resource-filters-gallery', '.layout-container', '.permission-wrapper', '.background-container',
  '.accordion', '.experiencefragment', '.ibm-video', 'img', 'table', 'iframe', 'form',
].join(', ');

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
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) candidates.push(canonical.getAttribute('href'));
  for (const url of candidates) {
    try {
      const path = new URL(url, 'https://www.jackson.com').pathname
        .replace(/\.html?$/, '').replace(/\/+$/, '');
      if (path) return path.split('/').filter(Boolean).map(slugify).join('/');
    } catch (e) { /* ignore */ }
  }
  return 'page';
}

function labelContent(document, li) {
  const clone = li.cloneNode(true);
  clone.querySelectorAll('.hidden, .tab-form-number, .tab-archive-form-number').forEach((el) => el.remove());
  const parts = [];
  const icon = clone.querySelector('img');
  if (icon) parts.push(icon);
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

function textOnlyContent(panel) {
  if (panel.querySelector(COMPONENT_SELECTOR)) return null;
  const texts = [...panel.querySelectorAll('.cmp-text')];
  const roots = texts.length ? texts : [panel];
  const nodes = [];
  roots.forEach((root) => {
    [...root.children].forEach((child) => {
      if (child.textContent.trim()) nodes.push(child);
    });
  });
  return nodes.length ? nodes : null;
}

export default function parse(element, { document, params }) {
  const tabRoot = element.matches('.tab') ? element : (element.querySelector('.tab.v4, .tab') || element);
  const tabs = [...tabRoot.querySelectorAll('.tab-container ul[role="tablist"] > li, .tab-container ul > li[role="tab"]')]
    .filter((li, i, arr) => arr.indexOf(li) === i);
  const panels = [...tabRoot.querySelectorAll('.tab-content-wrappper > .tab-content, .tab-content[role="tabpanel"]')]
    .filter((p, i, arr) => arr.indexOf(p) === i);

  let variant = 'alt-3';
  if (tabRoot.querySelector('.resource-filters-gallery, .resource-listing')) variant = 'image-magenta-grey-shadow';
  else if (tabRoot.querySelector('.cta-product-card')) variant = null;

  const slug = pageSlug(document, params);
  const fragments = params && Array.isArray(params.fragments) ? params.fragments : null;
  const usedIds = new Set();

  const cells = [];
  tabs.forEach((li, index) => {
    const label = labelContent(document, li);
    const labelText = li.textContent.replace(/\s+/g, ' ').trim();
    if (!labelText && !label.length) return;

    const controls = li.getAttribute('aria-controls');
    let panel = controls ? panels.find((p) => p.id === controls) : null;
    if (!panel) panel = panels[index] || null;

    let panelCell = '';
    if (panel && (panel.textContent.trim() || panel.querySelector('img, iframe'))) {
      const inline = textOnlyContent(panel);
      if (inline) {
        panelCell = inline;
      } else {
        let id = slugify(li.id || labelText);
        const taken = (candidate) => usedIds.has(candidate)
          || (fragments && fragments.some((f) => f.path === `/fragments/${slug}/${candidate}`));
        let n = 2;
        const base = id;
        while (taken(id)) { id = `${base}-${n}`; n += 1; }
        usedIds.add(id);
        const path = `/fragments/${slug}/${id}`;
        const container = document.createElement('div');
        container.append(...panel.childNodes);
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

  const name = variant ? `tabs-section (${variant})` : 'tabs-section';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
