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

export default function parse(element, { document, params }) {
  let cards = [...element.querySelectorAll('.cta-icon-card-block')];
  if (!cards.length && element.matches('.cta-icon-card-block')) cards = [element];
  if (!cards.length) cards = [element];

  const cells = cards
    .map((c) => parseCard(document, c))
    .filter((row) => row.some((c) => c));

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-event', cells });
  element.replaceWith(block);
}
