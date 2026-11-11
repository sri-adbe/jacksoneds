/* eslint-disable */
/* global WebImporter */
/**
 * Parser for address-card.
 * Source: div.contact-locations__state (office location on the contact-us map).
 * Output (blocks/address-card): row 1 = organisation name (header band); row 2 = address lines.
 */
function paras(document, el) {
  if (!el) return [];
  const out = [...el.querySelectorAll(':scope > p')]
    .filter((p) => p.textContent.trim())
    .map((p) => {
      const n = document.createElement('p');
      n.innerHTML = p.innerHTML.trim();
      n.querySelectorAll('[style]').forEach((s) => s.removeAttribute('style'));
      return n;
    });
  if (!out.length && el.textContent.trim()) {
    const n = document.createElement('p');
    n.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    out.push(n);
  }
  return out;
}

export default function parse(element, { document, params }) {
  const title = paras(document, element.querySelector('.contact-locations__title'));
  const address = paras(document, element.querySelector('.contact-locations__description'));
  if (!title.length && !address.length) {
    element.remove();
    return;
  }
  const cells = [];
  if (title.length) cells.push([title]);
  if (address.length) cells.push([address]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'address-card', cells });
  element.replaceWith(block);
}
