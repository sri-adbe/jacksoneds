/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature (Jackson).
 * Block rows: one row, text column(s) | media column (image or video link), in source order.
 * Shapes handled:
 *  - .main-content / .secondary-content split (image|cta-list -> default; video|header,
 *    image|rte+icon card, header|video -> alt)
 *  - .three-column of .cta-list items (no media) -> dark
 *  - .card-container with .promo-image-card items -> product-intro
 */

const COMPONENTS = '.image, .ibm-video, .video-container, .header, .cta-list, .rte, .cta-icon-card, .promo-image-card';

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function flattenInline(document, src, tag) {
  const h = document.createElement(tag);
  h.innerHTML = src.innerHTML;
  [...h.querySelectorAll('*')].forEach((d) => {
    if (!d.matches('sup, sub, em, strong, b, i, a, br')) d.replaceWith(...d.childNodes);
  });
  h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
  return h;
}

function headingFrom(document, container, fallbackTag) {
  if (!container) return null;
  const h = container.matches('h1, h2, h3, h4, h5, h6')
    ? container
    : container.querySelector('h1, h2, h3, h4, h5, h6');
  const src = h || container;
  if (!textOf(src)) return null;
  const tag = h ? h.tagName.toLowerCase() : fallbackTag;
  return flattenInline(document, src, tag);
}

function richChildren(document, container) {
  const out = [];
  if (!container) return out;
  [...container.children].forEach((child) => {
    if (!textOf(child) && !child.querySelector('img')) return; // drop &nbsp; paragraphs
    child.removeAttribute('style');
    child.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
    // trailing <br>&nbsp; inside paragraphs
    child.innerHTML = child.innerHTML.replace(/(<br\s*\/?>\s*(&nbsp;| |\s)*)+$/i, '');
    out.push(child);
  });
  if (!out.length && textOf(container)) {
    const p = document.createElement('p');
    p.textContent = textOf(container);
    out.push(p);
  }
  return out;
}

function linkParas(document, links) {
  return links
    .filter((a) => a && a.getAttribute('href') && textOf(a))
    .map((a) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      p.append(link);
      return p;
    });
}

function imageEl(img) {
  if (!img || !img.getAttribute('src')) return null;
  return img;
}

function videoLink(document, iframe) {
  const src = iframe && (iframe.getAttribute('src') || iframe.getAttribute('data-src'));
  if (!src) return null;
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = src.startsWith('//') ? `https:${src}` : src;
  a.textContent = a.href;
  p.append(a);
  return p;
}

/** Convert one source component into clean authoring elements. */
function extractComponent(document, comp) {
  const out = [];
  if (comp.matches('.ibm-video, .video-container') || (comp.querySelector('iframe') && !textOf(comp))) {
    const v = videoLink(document, comp.querySelector('iframe'));
    if (v) out.push(v);
  } else if (comp.matches('.image')) {
    const img = imageEl(comp.querySelector('img'));
    if (img) out.push(img);
  } else if (comp.matches('.header')) {
    const h = headingFrom(document, comp.querySelector('.title'), 'h2');
    if (h) out.push(h);
    out.push(...richChildren(document, comp.querySelector('.description')));
    out.push(...linkParas(document, [...comp.querySelectorAll('.small-links a')]));
  } else if (comp.matches('.cta-list')) {
    const h = headingFrom(document, comp.querySelector('.cta-list__header'), 'h3');
    if (h) out.push(h);
    out.push(...richChildren(document, comp.querySelector('.cta-list__description')));
    out.push(...linkParas(document, [...comp.querySelectorAll('.customContent a, .cta-list__links a')]));
  } else if (comp.matches('.rte')) {
    out.push(...richChildren(document, comp.querySelector('.cmp-text') || comp));
  } else if (comp.matches('.cta-icon-card')) {
    const img = imageEl(comp.querySelector('.icon-image img'));
    if (img) {
      const p = document.createElement('p');
      p.append(img);
      out.push(p);
    }
    const title = comp.querySelector('.card-content .title');
    if (title && textOf(title)) {
      const p = document.createElement('p');
      const strong = flattenInline(document, title, 'strong');
      p.append(strong);
      out.push(p);
    }
    out.push(...richChildren(document, comp.querySelector('.description')));
    out.push(...linkParas(document, [...comp.querySelectorAll('.cta-arrow-button-wrapper a')]));
  } else if (comp.matches('.promo-image-card')) {
    const img = imageEl(comp.querySelector('.promo-image-card__image img'));
    if (img) {
      const p = document.createElement('p');
      p.append(img);
      out.push(p);
    }
    const h = headingFrom(document, comp.querySelector('.promo-image-card__title'), 'h3');
    if (h) out.push(h);
    out.push(...richChildren(document, comp.querySelector('.promo-image-card__description')));
    out.push(...linkParas(document, [...comp.querySelectorAll('.promo-image-card__link a')]));
  }
  return out;
}

function extractColumn(document, col) {
  const comps = [...col.querySelectorAll(COMPONENTS)]
    .filter((c, i, all) => !all.some((o) => o !== c && o.contains(c)));
  if (!comps.length) {
    // generic fallback
    const out = [];
    col.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, img').forEach((n) => {
      if (n.closest('p, ul, ol') && n.tagName !== 'P' && n.tagName !== 'UL' && n.tagName !== 'OL') return;
      if (n.matches('img') || textOf(n)) out.push(n);
    });
    const iframe = col.querySelector('iframe');
    if (iframe) out.push(videoLink(document, iframe));
    return out.filter(Boolean);
  }
  return comps.flatMap((c) => extractComponent(document, c));
}

export default function parse(element, { document, params }) {
  const cells = [];
  let variant = null;

  const main = element.querySelector('.main-content');
  const secondary = element.querySelector('.secondary-content');
  const promoCards = [...element.querySelectorAll('.promo-image-card')];

  if (main || secondary) {
    const row = [main, secondary].filter(Boolean).map((col) => extractColumn(document, col));
    cells.push(row.map((c) => (c.length ? c : '')));
    // default look: image beside a cta-list; other splits use the alt option
    const isDefault = main && secondary && main.querySelector('.image img')
      && secondary.querySelector('.cta-list');
    if (!isDefault) variant = 'alt';
  } else if (promoCards.length) {
    variant = 'product-intro';
    cells.push(promoCards.map((card) => extractComponent(document, card)));
  } else {
    const items = [...element.querySelectorAll('.cta-list')];
    if (items.length) {
      variant = 'dark';
      cells.push(items.map((item) => extractComponent(document, item)));
    } else {
      const col = extractColumn(document, element);
      if (col.length) cells.push([col]);
    }
  }

  const name = variant ? `columns-feature (${variant})` : 'columns-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
