/* eslint-disable */
/* global WebImporter */

/**
 * cards-team parser.
 * Source shape (block-context/cards-team): div.cta-icon-card grid (headshot in .icon-image,
 * name in .title, job title in .description). Empty spacer cards are skipped.
 * Block rows: [headshot | name heading + job title (+ optional CTA)].
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

/** Copy inline content, unwrapping layout span/div and dropping trailing <br>. */
function cleanInline(document, src, tag) {
  const el = document.createElement(tag);
  el.innerHTML = src.innerHTML;
  el.querySelectorAll('div, span').forEach((w) => w.replaceWith(...w.childNodes));
  const trimBr = (node) => {
    let last = node.lastChild;
    while (last && ((last.nodeType === 3 && !last.textContent.trim()) || last.nodeName === 'BR')) {
      last.remove();
      last = node.lastChild;
    }
    if (last && last.nodeType === 1) trimBr(last);
  };
  trimBr(el);
  el.innerHTML = el.innerHTML.trim();
  return el;
}

function parseCard(document, card) {
  const image = card.querySelector('.icon-image picture, .icon-image img');
  const body = [];
  const title = card.querySelector('.card-content .title, .title');
  if (title && text(title)) body.push(cleanInline(document, title, 'h3'));
  const desc = card.querySelector('.card-content .description, .description');
  if (desc) {
    const ps = [...desc.querySelectorAll(':scope > p')].filter((p) => text(p));
    if (ps.length) ps.forEach((p) => body.push(cleanInline(document, p, 'p')));
    else if (text(desc)) body.push(cleanInline(document, desc, 'p'));
  }
  card.querySelectorAll('.cta-arrow-button-wrapper a[href], .action a[href]').forEach((a) => {
    if (!text(a)) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    body.push(p);
  });
  return { image: image ? (image.closest('picture') || image) : null, body };
}

export default function parse(element, { document, params }) {
  let cards = [...element.querySelectorAll('.cta-icon-card-block')];
  if (!cards.length) cards = [...element.querySelectorAll('.cta-icon-card')];
  if (!cards.length) cards = [element];

  const cells = cards
    .map((c) => parseCard(document, c))
    .filter((it) => it.image || it.body.length)
    .map((it) => [it.image || '', it.body.length ? it.body : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
