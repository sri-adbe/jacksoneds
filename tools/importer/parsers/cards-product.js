/* eslint-disable */
/* global WebImporter */

/**
 * cards-product parser.
 * Source shapes (block-context/cards-product):
 *   - div.cta-list.v2 (careers / tax resources / planning tools)
 *   - div.product-line-card.base-version (title span + description + CTA link)
 *   - div.product-line-card.v1 (whole card wrapped in a.product-line-card__cta)
 *   - div.logo-card (logo image only)
 * Block rows: [image | eyebrow + heading + description + CTA links] (image cell only when any card has one).
 * Variant "alt": cta-list cards with a vertical content area, and logo cards.
 */

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

function ctaParagraph(document, a) {
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = a.textContent.trim();
  if (a.getAttribute('title')) link.title = a.getAttribute('title');
  p.append(link);
  return p;
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

export default function parse(element, { document, params }) {
  const root = element;
  let items = [];

  const ctaLists = [...root.querySelectorAll('.cta-list')];
  const productLines = [...root.querySelectorAll('.product-line-card')]
    .filter((c) => c.querySelector('.product-line-card__title, .product-line-card__description'));
  const logoCards = [...root.querySelectorAll('.logo-card')];

  if (ctaLists.length) items = ctaLists.map((c) => parseCtaList(document, c));
  else if (productLines.length) items = productLines.map((c) => parseProductLine(document, c));
  else if (logoCards.length) items = logoCards.map((c) => parseLogoCard(document, c));
  else {
    // generic fallback: any direct child card with a heading
    items = [...root.querySelectorAll(':scope > div, :scope > * > div')]
      .filter((c) => c.querySelector('h2, h3, h4'))
      .map((c) => {
        const body = [];
        const h = c.querySelector('h2, h3, h4');
        body.push(inlineHeading(document, h, 'h3'));
        c.querySelectorAll('p').forEach((p) => { if (p.textContent.trim()) body.push(p); });
        return { image: imageFrom(c), body };
      });
  }

  items = items.filter((it) => it.image || it.body.length);
  const hasImages = items.some((it) => it.image);
  const hasBodies = items.some((it) => it.body.length);
  items.forEach((it) => it.body.forEach((n) => n.removeAttribute && n.removeAttribute('style')));
  const cells = items.map((it) => {
    if (hasImages && hasBodies) return [it.image || '', it.body];
    return [hasImages ? it.image : it.body];
  });

  const isAlt = logoCards.length > 0 && !ctaLists.length && !productLines.length
    || !!root.querySelector('.cta-list .content-area.vertical');
  const name = isAlt ? 'cards-product (alt)' : 'cards-product';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
