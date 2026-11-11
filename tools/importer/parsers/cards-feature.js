/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature (Jackson).
 * Shapes handled:
 *  - div.cta-list.v2 items (heading + description, no icon), optional trailing div.cta button
 *  - div.cta-icon-card items (icon | title + description + optional CTA)
 *      inside .main-content/.secondary-content  -> variant icon-left
 *      inside .three-column / .cta-icon-card-wrapper -> variant alt
 *  - div.feature-50-50 single card (image | heading + list + links)
 * Block rows: [icon/image | heading + text + optional list + optional CTA]
 */

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

// Keep the source heading level (h1 demoted to h2: one h1 per page); non-heading titles use
// the fallback level. A wrapper (e.g. .cta-list__header) holding one heading uses that heading's level.
function headingLevel(src, fallback) {
  const tag = /^H([1-6])$/.exec(src.tagName || '');
  let level = tag ? Number(tag[1]) : null;
  if (!level) {
    const inner = src.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (inner.length === 1) level = Number(inner[0].tagName[1]);
  }
  if (!level) return fallback;
  return Math.max(level, 2);
}

function makeHeading(document, src, fallback) {
  if (!src || !textOf(src)) return null;
  const h = document.createElement(`h${headingLevel(src, fallback)}`);
  // keep inline formatting such as <sup>
  h.innerHTML = src.innerHTML.trim();
  // flatten wrappers, keep inline formatting (sup, sub, em, strong, a)
  [...h.querySelectorAll('*')].forEach((d) => {
    if (!d.matches('sup, sub, em, strong, b, i, a, br')) d.replaceWith(...d.childNodes);
  });
  h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
  if (!textOf(h)) h.textContent = textOf(src);
  return h;
}

function cleanDescription(document, desc) {
  const out = [];
  if (!desc) return out;
  [...desc.children].forEach((child) => {
    if (!textOf(child) && !child.querySelector('img, picture')) return; // drop &nbsp; paragraphs
    child.removeAttribute('style');
    child.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
    out.push(child);
  });
  if (!out.length && textOf(desc)) {
    const p = document.createElement('p');
    p.textContent = textOf(desc);
    out.push(p);
  }
  return out;
}

function ctaParagraphs(document, links) {
  return links
    .filter((a) => a && a.getAttribute('href') && textOf(a))
    .map((a) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      if (a.getAttribute('title')) link.title = a.getAttribute('title');
      p.append(link);
      return p;
    });
}

function iconCell(img) {
  if (!img || !img.getAttribute('src')) return '';
  return img;
}

// Product cards (.cta-product-card-block): the catalog sometimes claims only the card's inner
// `.cta-section`, which would drop the title and description. Build the whole card instead and
// merge consecutive product cards into one block.
function productCardRow(document, card) {
  const body = [];
  const h = makeHeading(document, card.querySelector('.card-content > .title, .title'), 3);
  if (h) body.push(h);
  body.push(...cleanDescription(document, card.querySelector('.description')));
  body.push(...ctaParagraphs(document, [...card.querySelectorAll('.cta-section a[href]')]));
  return [body];
}

function parseProductCard(element, document) {
  const card = element.closest('.cta-product-card-block');
  // replace the card's outermost pure wrapper (single element child) so consecutive cards
  // become siblings; never climb into a container that holds other content
  let holder = card;
  while (holder.parentElement
    && holder.parentElement.children.length === 1
    && !holder.parentElement.matches('section, .body-content, .content-wrapper, body')) {
    holder = holder.parentElement;
  }
  const row = productCardRow(document, card);
  let prev = holder.previousElementSibling;
  while (prev && !prev.textContent.trim() && !prev.querySelector('img')) prev = prev.previousElementSibling;
  if (prev && prev.tagName === 'TABLE' && prev.dataset.excatProductCards === 'true') {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.append(...row[0]);
    tr.append(td);
    (prev.querySelector('tbody') || prev).append(tr);
    holder.remove();
    return;
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells: [row] });
  if (block.dataset) block.dataset.excatProductCards = 'true';
  holder.replaceWith(block);
}

// Sitemap (sitemap.html): each .section = header link + list of links -> one text-only card
// (single cell, no-images convention) per section.
function parseSitemap(element, document) {
  const rows = [...element.querySelectorAll('.sitemap .section')].map((section) => {
    const body = [];
    const head = section.querySelector('.header-link a[href]');
    if (head && textOf(head)) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = head.getAttribute('href');
      a.textContent = textOf(head);
      h.append(a);
      body.push(h);
    }
    const links = [...section.querySelectorAll(':scope > .link a[href]')].filter((a) => textOf(a));
    if (links.length) {
      const ul = document.createElement('ul');
      links.forEach((src) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = src.getAttribute('href');
        a.textContent = textOf(src);
        li.append(a);
        ul.append(li);
      });
      body.push(ul);
    }
    return body.length ? [body] : null;
  }).filter(Boolean);
  if (!rows.length) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature (alt)', cells: rows });
  element.replaceWith(block);
}

export default function parse(element, { document, params }) {
  if (element.closest('.cta-product-card-block')) {
    parseProductCard(element, document);
    return;
  }
  if (element.querySelector('.sitemap .section') || element.matches('.sitemap')) {
    parseSitemap(element, document);
    return;
  }
  const cells = [];
  let variant = null;

  const iconCards = [...element.querySelectorAll('.cta-icon-card-block')];
  const ctaLists = [...element.querySelectorAll('.cta-list__content')];
  const feature = element.querySelector('.feature-50-50__content');
  const iconFeatures = [...element.querySelectorAll('.icon-feature')].filter((c) => !c.parentElement.closest('.icon-feature'));
  let trailing = [];

  if (iconCards.length) {
    if (element.querySelector('.main-content, .secondary-content')) variant = 'icon-left';
    else if (element.matches('.three-column, .cta-icon-card-wrapper') || element.querySelector('.cta-icon-card-wrapper') || element.closest('.three-column')) variant = 'alt';

    iconCards.forEach((card) => {
      const img = card.querySelector('.icon-image img, img');
      const body = [];
      const h = makeHeading(document, card.querySelector('.title'), 3);
      if (h) body.push(h);
      body.push(...cleanDescription(document, card.querySelector('.description')));
      body.push(...ctaParagraphs(document, [...card.querySelectorAll('.cta-arrow-button-wrapper a, .card-content > a')]));
      if (!body.length && !img) return;
      cells.push([iconCell(img), body]);
    });
  } else if (ctaLists.length) {
    // a single cta-list laid out beside an image column (.comparison-highlight-layout): the image
    // sits outside the list item
    const outerImgs = [...element.querySelectorAll('img')].filter((i) => !i.closest('.cta-list'));
    ctaLists.forEach((item) => {
      const img = item.querySelector('img') || (ctaLists.length === 1 ? outerImgs[0] : null);
      const body = [];
      const h = makeHeading(document, item.querySelector('.cta-list__header') || item.querySelector('h1, h2, h3, h4, h5, h6'), 3);
      if (h) body.push(h);
      body.push(...cleanDescription(document, item.querySelector('.cta-list__description')));
      // link lists can sit inside the item or beside it in the same .cta-list content area
      const area = item.closest('.content-area') || item;
      const linkEls = [...item.querySelectorAll('.customContent a, .cta-list__links a')];
      area.querySelectorAll(':scope > .cta-list__links a').forEach((a) => {
        if (!linkEls.includes(a)) linkEls.push(a);
      });
      body.push(...ctaParagraphs(document, linkEls));
      if (!body.length && !img) return;
      cells.push([iconCell(img), body]);
    });
    // stand-alone CTA buttons that follow the list become default content after the block
    trailing = ctaParagraphs(document, [...element.querySelectorAll('.cta a, .cta--text-center a')])
      .map((p) => {
        const strong = document.createElement('strong');
        const a = p.querySelector('a');
        a.replaceWith(strong);
        strong.append(a);
        return p;
      });
  } else if (iconFeatures.length) {
    // .card-container > .icon-feature cards (font icon | title + description + CTA button);
    // font icons carry no image, so the rows are text-only
    iconFeatures.forEach((card) => {
      const img = card.querySelector('.icon-feature__image img');
      const body = [];
      const h = makeHeading(document, card.querySelector('.icon-feature__title'), 3);
      if (h) body.push(h);
      body.push(...cleanDescription(document, card.querySelector('.icon-feature__description')));
      body.push(...ctaParagraphs(document, [...card.querySelectorAll('.icon-feature__link a[href]')]));
      if (!body.length && !img) return;
      cells.push([iconCell(img), body]);
    });
  } else if (feature) {
    const img = feature.querySelector('.feature-50-50__image img, img');
    const body = [];
    const h = makeHeading(document, feature.querySelector('.feature-50-50__title, h1, h2, h3, h4'), 3);
    if (h) body.push(h);
    body.push(...cleanDescription(document, feature.querySelector('.feature-50-50__description')));
    body.push(...ctaParagraphs(document, [...feature.querySelectorAll('.feature-50-50__links a')]));
    if (body.length || img) cells.push([iconCell(img), body]);
  } else {
    // generic fallback: each direct child with text becomes a card
    [...element.children].forEach((child) => {
      if (!textOf(child) && !child.querySelector('img')) return;
      const img = child.querySelector('img');
      const body = [];
      const h = makeHeading(document, child.querySelector('h1, h2, h3, h4, h5, h6, .title'), 3);
      if (h) body.push(h);
      child.querySelectorAll('p, ul, ol').forEach((p) => { if (textOf(p)) body.push(p); });
      // Call-to-Action goes at the bottom of the text cell: pick up stand-alone CTA links
      // (e.g. .small-links arrow buttons) that sit outside paragraphs. Repeating units that are
      // div.cta-icon-card are handled by the iconCards branch above; plain divs land here.
      const loose = [...child.querySelectorAll('.small-links a[href], .cta-arrow-button-wrapper a[href], a.primary-button[href], a.secondary-button[href]')]
        .filter((a, i, all) => all.indexOf(a) === i && !body.some((n) => n.contains && n.contains(a)));
      body.push(...ctaParagraphs(document, loose));
      if (!body.length && !img) return;
      // a links-only child (e.g. carousel header's "View all") belongs to the preceding card
      const prev = cells[cells.length - 1];
      if (!img && prev && body.every((n) => n.tagName === 'P' && n.querySelector('a') && textOf(n) === textOf(n.querySelector('a')))) {
        prev[1].push(...body);
        return;
      }
      // row = [image or icon, text content]
      cells.push([iconCell(img), body]);
    });
  }

  // text-only collections become single-column rows
  if (cells.length && cells.every((r) => r[0] === '')) {
    cells.forEach((r, i) => { cells[i] = [r[1]]; });
  }

  const name = variant ? `cards-feature (${variant})` : 'cards-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (trailing.length) element.after(...trailing);
  element.replaceWith(block);
}
