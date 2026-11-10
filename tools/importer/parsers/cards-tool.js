/* eslint-disable */
/* global WebImporter */

/**
 * cards-tool parser.
 * Source shapes (block-context/cards-tool):
 *   - div.promo-card (image + title span + description + CTA)          -> cards-tool
 *   - div.resource-filter-listing__block with .logo-image-container     -> cards-tool (partner-logo)
 *   - div.resource-filter-listing__block with .card-title-additional    -> cards-tool (partner)
 * Block rows: [image or logo | tag paragraph + title + text + CTA link].
 */

function cleanInline(document, src, tag) {
  const el = document.createElement(tag);
  el.innerHTML = src.innerHTML;
  el.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  el.innerHTML = el.innerHTML.trim();
  return el;
}

function para(document, text) {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
}

function linkPara(document, a) {
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = a.textContent.trim();
  p.append(link);
  return p;
}

function imageOf(scope) {
  if (!scope) return null;
  return scope.querySelector('picture') || scope.querySelector('img');
}

function parsePromo(document, card) {
  const body = [];
  const title = card.querySelector('.card-content .title, .title');
  if (title && title.textContent.trim()) body.push(cleanInline(document, title, 'h3'));
  const desc = card.querySelector('.card-content .description, .description');
  if (desc) {
    const ps = [...desc.querySelectorAll(':scope > p, :scope > ul, :scope > ol')].filter((p) => p.textContent.trim());
    if (ps.length) body.push(...ps);
    else if (desc.textContent.trim()) body.push(cleanInline(document, desc, 'p'));
  }
  card.querySelectorAll('.action a[href]').forEach((a) => {
    if (a.textContent.trim()) body.push(linkPara(document, a));
  });
  return { image: imageOf(card.querySelector('.promo-image') || card), body };
}

function parsePartner(document, card) {
  const body = [];
  const tag = card.querySelector('.resource-filter-listing__header-text, .resource-filter-listing__mobile-header-text');
  if (tag && tag.textContent.trim()) body.push(para(document, tag.textContent.trim()));

  const logo = imageOf(card.querySelector('.logo-image-container'));

  // partner name (text tiles): text nodes of span.card-title__text in .card-title-additional
  const nameSrc = card.querySelector('.card-title-additional .card-title__text');
  if (nameSrc) {
    const name = [...nameSrc.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (name) {
      const h = document.createElement('h3');
      h.textContent = name;
      body.push(h);
    }
  }

  const links = [...card.querySelectorAll('.card-title a[href], .card-title-additional a[href]')]
    .filter((a) => a.textContent.trim());
  links.forEach((a) => body.push(linkPara(document, a)));

  // tiles with nothing but a tag (e.g. Third Party Aggregator) are a caption, not a card:
  // return it separately so it is placed as default content after the block.
  if (!logo && !nameSrc && !links.length) {
    const cap = card.querySelector('.resource-filter-listing__mobile-caption');
    const text = cap && cap.textContent.trim();
    return { image: null, body: [], caption: text ? para(document, text) : null };
  }
  return { image: logo, body };
}

export default function parse(element, { document, params }) {
  const root = element;
  let items = [];
  let variant = null;

  const partnerCards = [...root.querySelectorAll('.resource-filter-listing__block')];
  const promoCards = [...root.querySelectorAll('.promo-card')]
    .filter((c) => c.querySelector('.card-content, .title, .promo-image'));

  if (partnerCards.length) {
    items = partnerCards.map((c) => parsePartner(document, c));
    const hasLogos = !!root.querySelector('.logo-image-container img');
    const additional = root.matches('.resource-filter-listing__additional-options-block-wrapper')
      || !!root.querySelector('.card-title-additional');
    variant = hasLogos && !additional ? 'partner-logo' : 'partner';
  } else if (promoCards.length) {
    items = promoCards.map((c) => parsePromo(document, c));
  } else {
    items = [...root.querySelectorAll(':scope > div, :scope > * > div')]
      .filter((c) => c.querySelector('h2, h3, h4, .title'))
      .map((c) => parsePromo(document, c));
  }

  const captions = items.map((it) => it.caption).filter(Boolean);
  items = items.filter((it) => it.image || it.body.length);
  const hasImages = items.some((it) => it.image);
  const hasBodies = items.some((it) => it.body.length);
  const cells = items.map((it) => {
    if (hasImages && hasBodies) return [it.image || '', it.body];
    return [hasImages ? it.image : it.body];
  });

  const name = variant ? `cards-tool (${variant})` : 'cards-tool';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block, ...captions);
}
