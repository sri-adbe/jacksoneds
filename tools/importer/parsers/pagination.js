/* eslint-disable */
/* global WebImporter */
/**
 * Parser for pagination.
 * Source: nav.pagination-control__items — client-side page buttons (no hrefs) over an article
 * gallery that is imported in full on one page. When the source has real page links they become
 * a pagination block (one link per paragraph, current page unlinked); button-only pagination is
 * dropped because it has no destination to link to.
 */
export default function parse(element, { document, params }) {
  const links = [...element.querySelectorAll('a[href]')].filter((a) => a.textContent.trim());
  if (!links.length) {
    element.remove();
    return;
  }
  const cell = links.map((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
    p.append(link);
    return p;
  });
  const block = WebImporter.Blocks.createBlock(document, { name: 'pagination', cells: [[cell]] });
  element.replaceWith(block);
}
