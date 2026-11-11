/* eslint-disable */
/* global WebImporter */

/**
 * cards-event parser.
 * Source shape (block-context/cards-event): div.cta-icon-card (icon, title span, description, CTA link).
 * Block rows: [date/time | icon + title heading + description | CTA link]; missing cells stay empty.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(document, src, tag) {
  const el = document.createElement(tag);
  el.innerHTML = src.innerHTML;
  el.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  el.innerHTML = el.innerHTML.trim();
  return el;
}

function parseCard(document, card) {
  const date = [];
  const body = [];
  const cta = [];

  const dateSrc = card.querySelector('.date, .event-date, time');
  if (dateSrc && text(dateSrc)) date.push(cleanInline(document, dateSrc, 'p'));

  const icon = card.querySelector('.icon-image img, .icon-image picture');
  if (icon) {
    const p = document.createElement('p');
    p.append(icon.closest('picture') || icon);
    body.push(p);
  }
  const title = card.querySelector('.card-content .title, .title, h2, h3, h4');
  if (title && text(title)) body.push(cleanInline(document, title, 'h3'));
  const desc = card.querySelector('.card-content .description, .description');
  if (desc) {
    const ps = [...desc.querySelectorAll(':scope > p, :scope > ul, :scope > ol')].filter((p) => text(p));
    if (ps.length) body.push(...ps);
    else if (text(desc)) body.push(cleanInline(document, desc, 'p'));
  }

  card.querySelectorAll('.cta-arrow-button-wrapper a[href], .card-content a.cta-arrow-button[href], .action a[href]').forEach((a) => {
    if (!text(a) || cta.some((p) => p.querySelector('a').getAttribute('href') === a.getAttribute('href'))) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    cta.push(p);
  });

  return [date.length ? date : '', body.length ? body : '', cta.length ? cta : ''];
}

// Event listing (FP design): div.event-listing = Date/Details header row + one div.event >
// .event__block per event. Cards convention: one row per card, 2 cells — first cell =
// date/time (media position), second cell = title heading, details, register link.
// Every part is conditional: an event without a date, details or link keeps an empty cell or
// just omits that element, and instances may hold 1 or 2 direct children (header only, header
// + events, or a single event). The catalog may claim the header and each event separately,
// so header-only instances (column labels) are dropped and consecutive events merge.
function eventCard(document, ev) {
  const first = [];
  const dateSrc = ev.querySelector('.event__date, :scope > .date');
  if (dateSrc && text(dateSrc)) first.push(cleanInline(document, dateSrc, 'p'));
  const textCell = [];
  const name = ev.querySelector('.event__name, :scope > .details > h1, :scope > .details > h2, :scope > .details > h3, :scope > .details > h4, :scope > .details > h5, :scope > .details > h6');
  if (name && text(name)) {
    const h = document.createElement('h3');
    h.textContent = text(name);
    textCell.push(h);
  }
  const details = ev.querySelector('.event__event-details, :scope > .details');
  if (details) {
    const ps = [...details.querySelectorAll(':scope > p')].filter((p) => text(p));
    if (ps.length) textCell.push(...ps);
    else if (text(details)) textCell.push(cleanInline(document, details, 'p'));
  }
  ev.querySelectorAll('.event__link a[href], :scope > .action a[href]').forEach((a) => {
    if (!text(a)) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    textCell.push(p);
  });
  return [first.length ? first : '', textCell.length ? textCell : ''];
}

function parseEventListing(element, document) {
  const sel = '.event__block, .item.event';
  const events = element.matches(sel) ? [element] : [...element.querySelectorAll(sel)];
  if (!events.length) {
    element.remove();
    return;
  }
  const rows = events.map((ev) => eventCard(document, ev)).filter((row) => row.some((c) => c));
  let prev = element.previousElementSibling;
  while (prev && !prev.textContent.trim() && prev.tagName !== 'TABLE') prev = prev.previousElementSibling;
  if (prev && prev.tagName === 'TABLE' && prev.dataset && prev.dataset.excatEvents === 'true') {
    const body = prev.querySelector('tbody') || prev;
    rows.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((cell) => {
        const td = document.createElement('td');
        (Array.isArray(cell) ? cell : [cell]).forEach((n) => { if (n) td.append(n); });
        tr.append(td);
      });
      body.append(tr);
    });
    element.remove();
    return;
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-event', cells: rows });
  if (block.dataset) block.dataset.excatEvents = 'true';
  element.replaceWith(block);
}

export default function parse(element, { document, params }) {
  if (element.closest('.event-listing') || element.querySelector('.event__block, .event-listing__table-header')) {
    parseEventListing(element, document);
    return;
  }
  let cards = [...element.querySelectorAll('.cta-icon-card-block')];
  if (!cards.length && element.matches('.cta-icon-card-block')) cards = [element];
  if (!cards.length) cards = [element];

  const cells = cards
    .map((c) => parseCard(document, c))
    .filter((row) => row.some((c) => c));

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-event', cells });
  element.replaceWith(block);
}
