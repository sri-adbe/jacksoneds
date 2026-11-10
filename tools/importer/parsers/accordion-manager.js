/* eslint-disable */
/* global WebImporter */

/**
 * accordion-manager parser.
 * Source shapes:
 *  - div.three-column with div.promo-area tiles (logo, h5 name, description, optional CTA)
 *  - div.two-column with div.accordion items (button title, .accordion-description body)
 * Block structure (blocks/accordion-manager): one row per tile:
 *   logo image | name | details (rich text). Logo cell left empty when missing.
 */
function cleanHeading(document, el, fallbackTag) {
  const tag = el && /^H[1-6]$/.test(el.tagName) ? el.tagName.toLowerCase() : fallbackTag;
  const h = document.createElement(tag);
  if (!el) return h;
  // keep footnote marks (<sup>/<sub>) as real superscripts; flatten everything else to text
  const walk = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        h.append(document.createTextNode(n.textContent.replace(/\s+/g, ' ')));
      } else if (n.nodeType === 1 && /^(SUP|SUB)$/.test(n.tagName)) {
        const s = document.createElement(n.tagName.toLowerCase());
        s.textContent = n.textContent.trim();
        h.append(s);
      } else if (n.nodeType === 1) {
        walk(n);
      }
    });
  };
  walk(el);
  h.normalize();
  if (h.firstChild && h.firstChild.nodeType === 3) h.firstChild.textContent = h.firstChild.textContent.trimStart();
  if (h.lastChild && h.lastChild.nodeType === 3) h.lastChild.textContent = h.lastChild.textContent.trimEnd();
  return h;
}

function bodyContent(container) {
  if (!container) return [];
  const text = container.querySelector('.cmp-text') || container;
  const kids = [...text.children].filter((c) => c.textContent.trim() || c.querySelector('img'));
  return kids;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const promoItems = [...element.querySelectorAll('.promo-area__content-area')];
  if (promoItems.length) {
    promoItems.forEach((item) => {
      const img = item.querySelector('.promo-area__image-wrapper img');
      const headingEl = item.querySelector('.promo-area__heading h1, .promo-area__heading h2, .promo-area__heading h3, .promo-area__heading h4, .promo-area__heading h5, .promo-area__heading h6')
        || item.querySelector('.promo-area__heading');
      const name = headingEl && headingEl.textContent.trim() ? cleanHeading(document, headingEl, 'h5') : '';
      const details = bodyContent(item.querySelector('.promo-area__description'));
      const action = item.querySelector('.promo-area__action');
      if (action) {
        [...action.querySelectorAll('a[href]')].filter((a) => a.textContent.trim()).forEach((a) => {
          const p = document.createElement('p');
          p.append(a);
          details.push(p);
        });
      }
      if (!img && !name && !details.length) return;
      const row = [img || '', name];
      if (details.length) row.push(details);
      else row.push('');
      cells.push(row);
    });
  } else {
    const items = [...element.querySelectorAll('.accordion-item')];
    items.forEach((item) => {
      const titleEl = item.querySelector('.accordion-title button, .accordion-title');
      const name = titleEl && titleEl.textContent.trim() ? cleanHeading(document, null, 'h5') : '';
      if (name) name.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
      const img = item.querySelector('.accordion-title img');
      const details = bodyContent(item.querySelector('.accordion-description'));
      if (!name && !details.length) return;
      cells.push([img || '', name, details.length ? details : '']);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-manager', cells });
  element.replaceWith(block);
}
