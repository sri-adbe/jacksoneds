/* eslint-disable */
/* global WebImporter */

/**
 * cards-product parser.
 * Source shapes (block-context/cards-product):
 *   - div.cta-list.v2 (careers / tax resources / planning tools)
 *   - div.product-line-card.base-version (title span + description + CTA link)
 *   - div.product-line-card.v1 (whole card wrapped in a.product-line-card__cta)
 *   - div.logo-card (logo image only)
 *   - div.cta-product-card(.hidden) > div.cta-product-card-block (fund documents / product lists)
 *   - div.product-card.v1 (financial-professional firm-type cards: image + forward links)
 * Block rows follow the Cards convention: [image | heading + description + CTA links], or a single
 * text cell when no card has an image. Several link groups in one card become separate lists in
 * the body cell (link-columns option renders them side by side).
 * Variant "alt": cta-list cards with a vertical content area, logo cards, firm-type cards.
 *
 * Repeating units differ between instances: div.product-card.v1 directly under
 * .card-container__cards, or div.experiencefragment > .xf-content-height > .cta-product-card >
 * .cta-product-card-block under .two-column/.content. UNIT_SELECTORS lists the fallbacks; every
 * selector of a group is tried and the outermost matches define the cards.
 */
const UNIT_SELECTORS = {
  productCard: [
    'div.experiencefragment .cta-product-card .cta-product-card-block',
    'div.cta-product-card .cta-product-card-block',
    'div.cta-product-card.hidden .cta-product-card-block',
    '.cta-product-card-block',
  ],
  firmCard: ['div.product-card.v1', '.product-card__block'],
  // FP-design units: linked icon tiles and image feature cards
  iconCard: ['div.icon-card.v1', '.icon-card__block'],
  featureCard: ['div.feature-card.v1', '.feature-card__block'],
};

function unitsOf(root, selectors) {
  const found = [];
  selectors.forEach((sel) => {
    let list = [];
    try { list = [...root.querySelectorAll(sel)]; } catch (e) { list = []; }
    list.forEach((el) => { if (!found.includes(el)) found.push(el); });
  });
  return found.filter((el) => !found.some((o) => o !== el && o.contains(el)));
}

function inlineHeading(document, src, tag) {
  const h = document.createElement(tag);
  h.innerHTML = src.innerHTML;
  // unwrap layout wrappers (span/div) inside headings, keep sup/em/strong
  h.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  h.innerHTML = h.innerHTML.trim();
  return h;
}

function descriptionNodes(document, src) {
  if (!src) return [];
  const blocks = [...src.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
  if (blocks.length) return blocks.filter((b) => b.textContent.trim() || b.querySelector('img'));
  if (!src.textContent.trim()) return [];
  const p = document.createElement('p');
  p.innerHTML = src.innerHTML.trim();
  return [p];
}

function makeLink(document, a) {
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = a.textContent.trim();
  if (a.getAttribute('title')) link.title = a.getAttribute('title');
  return link;
}

function ctaParagraph(document, a) {
  const p = document.createElement('p');
  p.append(makeLink(document, a));
  return p;
}

function linkList(document, links) {
  const ul = document.createElement('ul');
  links.forEach((a) => {
    const li = document.createElement('li');
    li.append(makeLink(document, a));
    ul.append(li);
  });
  return ul;
}

function imageFrom(card) {
  const pic = card.querySelector('picture');
  if (pic) return pic;
  const img = card.querySelector('img');
  return img || null;
}

function parseCtaList(document, card) {
  const body = [];
  const title = card.querySelector('.cta-list__header h1, .cta-list__header h2, .cta-list__header h3, .cta-list__header h4, .cta-list__header h5, .cta-list__header h6, .list-header h4');
  if (title && title.textContent.trim()) body.push(inlineHeading(document, title, 'h3'));
  body.push(...descriptionNodes(document, card.querySelector('.cta-list__description, .list-description')));
  const custom = card.querySelector('.customContent');
  if (custom && custom.textContent.trim()) body.push(...[...custom.children]);
  card.querySelectorAll('.cta-list__links a[href]').forEach((a) => {
    if (a.textContent.trim()) body.push(ctaParagraph(document, a));
  });
  return { image: imageFrom(card.querySelector('.cta-list__content') || card), body };
}

function parseProductLine(document, card) {
  const body = [];
  const wrapLink = card.querySelector('a.product-line-card__cta');
  const titleSrc = card.querySelector('.product-line-card__title');
  if (titleSrc && titleSrc.textContent.trim()) {
    const h = inlineHeading(document, titleSrc, 'h3');
    if (wrapLink && wrapLink.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = wrapLink.getAttribute('href');
      a.innerHTML = h.innerHTML;
      h.replaceChildren(a);
    }
    body.push(h);
  }
  body.push(...descriptionNodes(document, card.querySelector('.product-line-card__description')));
  card.querySelectorAll('a.product-line-card__action[href], a.cta-arrow-button[href]').forEach((a) => {
    if (a !== wrapLink && a.textContent.trim()) body.push(ctaParagraph(document, a));
  });
  return { image: imageFrom(card), body };
}

function parseLogoCard(document, card) {
  const body = [];
  const title = card.querySelector('.logo-title, .title, h2, h3, h4');
  if (title && title.textContent.trim()) body.push(inlineHeading(document, title, 'h3'));
  const link = card.querySelector('a[href]');
  if (link && link.textContent.trim()) body.push(ctaParagraph(document, link));
  return { image: imageFrom(card), body };
}

// .cta-product-card-block (fund documents, performance-center product list, product suites):
// title heading (keeps <sup>) + optional description + CTA links. Cards marked .hidden (toggled by
// the source's JS filters) are content too. Several .small-links groups become one list each
// inside the body (link columns).
function parseProductCard(document, card) {
  const body = [];
  const titleSrc = card.querySelector('.card-content > .title') || card.querySelector('.title');
  if (titleSrc && titleSrc.textContent.trim()) {
    const h = inlineHeading(document, titleSrc, 'h3');
    h.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((x) => x.replaceWith(...x.childNodes));
    h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
    body.push(h);
  }
  body.push(...descriptionNodes(document, card.querySelector('.description')));
  const groups = [...card.querySelectorAll('.cta-section .small-links')]
    .map((g) => [...g.querySelectorAll('a[href]')].filter((a) => a.textContent.trim()))
    .filter((g) => g.length);
  let columns = false;
  if (groups.length > 1) {
    groups.forEach((g) => body.push(linkList(document, g)));
    columns = true;
  } else {
    card.querySelectorAll('.cta-section a[href]').forEach((a) => {
      if (a.textContent.trim()) body.push(ctaParagraph(document, a));
    });
  }
  return { image: imageFrom(card), body, columns };
}

// div.product-card.v1: image (label baked into the artwork, alt carries it) + forward links.
function parseFirmCard(document, card) {
  const body = [];
  // Card row: image cell | text cell (title heading, description, CTA links). FP product cards
  // name the product in p.product-card__product-name with a .product-card__product-description.
  const title = card.querySelector('.product-card__title, .product-card__header, .product-card__product-name, h2, h3, h4');
  if (title && title.textContent.trim()) body.push(inlineHeading(document, title, 'h3'));
  body.push(...descriptionNodes(document, card.querySelector('.product-card__product-description')));
  const seen = new Set();
  card.querySelectorAll('.product-card__links a[href], .product-card__cta-section a[href]').forEach((a) => {
    const key = a.getAttribute('href');
    if (!a.textContent.trim() || seen.has(key)) return;
    seen.add(key);
    body.push(ctaParagraph(document, a));
  });
  return { image: imageFrom(card.querySelector('.product-card__image') || card), body };
}

// div.icon-card.v1: the whole tile is a link (icon is an icon font, so no image cell).
// Row: text cell = title heading, description, CTA link to the tile's destination.
function parseIconCard(document, card) {
  const body = [];
  const title = card.querySelector('.icon-card__title, h2, h3, h4');
  if (title && title.textContent.trim()) body.push(inlineHeading(document, title, 'h3'));
  body.push(...descriptionNodes(document, card.querySelector('.icon-card__description')));
  const a = card.querySelector('a.icon-card__link[href], a[href]');
  if (a) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = (title && title.textContent.replace(/\s+/g, ' ').trim()) || 'Learn more';
    p.append(link);
    body.push(p);
  }
  return { image: null, body };
}

// div.feature-card.v1: image | title heading, description, links.
function parseFeatureCard(document, card) {
  const body = [];
  const title = card.querySelector('.feature-card__title, h2, h3, h4');
  if (title && title.textContent.trim()) body.push(inlineHeading(document, title, 'h3'));
  body.push(...descriptionNodes(document, card.querySelector('.feature-card__description')));
  card.querySelectorAll('.feature-card__links a[href]').forEach((a) => {
    if (a.textContent.trim()) body.push(ctaParagraph(document, a));
  });
  return { image: imageFrom(card.querySelector('.feature-card__image') || card), body };
}

// promo cards (dash tools): imagery | heading + cmp-text + action CTA
function parsePromoCard(document, card) {
  const body = [];
  const heading = card.querySelector('.heading');
  if (heading && heading.textContent.trim()) body.push(inlineHeading(document, heading, 'h3'));
  body.push(...descriptionNodes(document, card.querySelector('.content .cmp-text') || card.querySelector('.content')));
  card.querySelectorAll('.action a[href]').forEach((a) => {
    if (a.textContent.trim()) body.push(ctaParagraph(document, a));
  });
  return { image: imageFrom(card.querySelector('.imagery') || card), body };
}

export default function parse(element, { document, params }) {
  const root = element;
  let items = [];

  const ctaLists = [...root.querySelectorAll('.cta-list')];
  const productLines = [...root.querySelectorAll('.product-line-card')]
    .filter((c) => c.querySelector('.product-line-card__title, .product-line-card__description'));
  const logoCards = [...root.querySelectorAll('.logo-card')];
  const productCards = unitsOf(root, UNIT_SELECTORS.productCard);
  const firmCards = unitsOf(root, UNIT_SELECTORS.firmCard);
  let firm = false;

  if (productCards.length && !ctaLists.length && !productLines.length && !logoCards.length) {
    items = productCards.map((c) => parseProductCard(document, c));
  } else if (ctaLists.length) items = ctaLists.map((c) => parseCtaList(document, c));
  else if (productLines.length) items = productLines.map((c) => parseProductLine(document, c));
  else if (logoCards.length) items = logoCards.map((c) => parseLogoCard(document, c));
  else if (firmCards.length) {
    items = firmCards.map((c) => parseFirmCard(document, c));
    firm = true;
  } else if (unitsOf(root, UNIT_SELECTORS.featureCard).length) {
    items = unitsOf(root, UNIT_SELECTORS.featureCard).map((c) => parseFeatureCard(document, c));
  } else if (unitsOf(root, UNIT_SELECTORS.iconCard).length) {
    items = unitsOf(root, UNIT_SELECTORS.iconCard).map((c) => parseIconCard(document, c));
  } else if (root.querySelector('.promo-card .card')) {
    items = [...root.querySelectorAll('.promo-card .card')].map((c) => parsePromoCard(document, c));
  } else {
    // generic fallback: any direct child card with a heading
    items = [...root.querySelectorAll(':scope > div, :scope > * > div')]
      .filter((c) => c.querySelector('h2, h3, h4'))
      .map((c) => {
        const body = [];
        const h = c.querySelector('h2, h3, h4');
        body.push(inlineHeading(document, h, 'h3'));
        c.querySelectorAll('p').forEach((p) => { if (p.textContent.trim()) body.push(p); });
        // app (.xhtml) action cards: links and server-side buttons become CTAs; a button has no
        // URL of its own, so it links to the live app page that runs it
        c.querySelectorAll('a[href], button').forEach((ctl) => {
          const label = ctl.textContent.replace(/\s+/g, ' ').trim();
          if (!label || ctl.closest('p')) return;
          const href = ctl.tagName === 'A' ? ctl.getAttribute('href') : (params && params.originalURL);
          if (!href || href === '#') return;
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = href;
          a.textContent = label;
          p.append(a);
          body.push(p);
        });
        return { image: imageFrom(c), body };
      });
  }

  items = items.filter((it) => it.image || it.body.length);
  // Client-rendered carousels (e.g. "Explore our retirement topics") are empty in the captured
  // source: drop the empty container instead of emitting an empty block.
  if (!items.length) {
    if (!element.textContent.trim() && !element.querySelector('img')) element.remove();
    return;
  }
  const hasImages = items.some((it) => it.image);
  const hasBodies = items.some((it) => it.body.length);
  items.forEach((it) => it.body.forEach((n) => n.removeAttribute && n.removeAttribute('style')));
  const linkColumns = items.some((it) => it.columns);
  const cells = items.map((it) => {
    if (hasImages && hasBodies) return [it.image || '', it.body];
    return [hasImages ? it.image : it.body];
  });

  const isAlt = firm || (logoCards.length > 0 && !ctaLists.length && !productLines.length)
    || !!root.querySelector('.cta-list .content-area.vertical');
  let name = isAlt ? 'cards-product (alt)' : 'cards-product';
  if (linkColumns) name = 'cards-product (link-columns)';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
