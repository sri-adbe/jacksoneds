/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-schedule (Jackson).
 * Block rows:
 *  row 1: heading + text | optional caption
 *  rows 2+: table rows (first = header row, first cell may be empty; first cell of
 *           later rows = row label)
 * Source: .comparison-highlight-layout with a .cta-list (intro) beside a .table (dates).
 */

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function flattenInline(document, src, tag) {
  const h = document.createElement(tag);
  h.innerHTML = src.innerHTML;
  [...h.querySelectorAll('*')].forEach((d) => {
    const keep = d.matches('sup, sub, em, strong, b, i, br') || (d.matches('a') && d.getAttribute('href'));
    if (!keep) d.replaceWith(...d.childNodes);
  });
  h.innerHTML = h.innerHTML.replace(/\s+/g, ' ').trim();
  return h;
}

function richChildren(document, container) {
  const out = [];
  if (!container) return out;
  [...container.children].forEach((child) => {
    if (!textOf(child) && !child.querySelector('img')) return;
    child.removeAttribute('style');
    child.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
    out.push(child);
  });
  if (!out.length && textOf(container)) {
    const p = document.createElement('p');
    p.textContent = textOf(container);
    out.push(p);
  }
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const table = element.querySelector('table');

  // intro text: everything that is not the table
  const intro = [];
  const introRoot = element.querySelector('.main-content') || element;
  const header = introRoot.querySelector('.cta-list__header, .title');
  const hSrc = header && (header.querySelector('h1, h2, h3, h4, h5, h6') || header);
  if (hSrc && textOf(hSrc) && !(table && table.contains(hSrc))) {
    const tag = hSrc.matches('h1, h2, h3, h4, h5, h6') ? hSrc.tagName.toLowerCase() : 'h3';
    intro.push(flattenInline(document, hSrc, tag));
  }
  intro.push(...richChildren(document, introRoot.querySelector('.cta-list__description, .description, .cmp-text')));
  introRoot.querySelectorAll('.cta-list__links a, .customContent a, .small-links a').forEach((a) => {
    if (!a.getAttribute('href') || !textOf(a)) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = textOf(a);
    p.append(link);
    intro.push(p);
  });

  // caption: table caption if any
  const captionEl = table && table.querySelector('caption');
  const caption = captionEl && textOf(captionEl) ? textOf(captionEl) : '';

  // table rows
  const tableRows = [];
  if (table) {
    [...table.querySelectorAll('tr')].forEach((tr, i) => {
      const row = [...tr.children].filter((c) => c.matches('th, td')).map((c, j) => {
        const t = textOf(c).replace(/ /g, ' ').trim();
        if (!t) return '';
        if (i === 0 || j === 0) return t; // header / row label: plain text
        const span = flattenInline(document, c, 'p');
        return span.childNodes.length ? [...span.childNodes] : t;
      });
      if (row.some((c) => c !== '')) tableRows.push(row);
    });
  }

  const maxCols = Math.max(2, ...tableRows.map((r) => r.length));
  const first = [intro.length ? intro : '', caption];
  while (first.length < maxCols) first.push('');
  cells.push(first);
  tableRows.forEach((r) => {
    while (r.length < maxCols) r.push('');
    cells.push(r);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-schedule', cells });
  element.replaceWith(block);
}
