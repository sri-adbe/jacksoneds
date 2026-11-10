/* eslint-disable */
/* global WebImporter */

/**
 * Parser for location-tiles.
 * Block rows (blocks/location-tiles): one row per location,
 *   photo | location name | description + link
 * Source: div.locations-row > div.locations-column (image, name, description).
 */

const NBSP_ONLY = /^[\s ]*$/;

function clean(el) {
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
    n.removeAttribute('id');
  });
  return el;
}

export default function parse(element, { document, params }) {
  let columns = [...element.querySelectorAll('.locations-column')];
  if (!columns.length) columns = [...element.children];
  const cells = [];

  columns.forEach((col) => {
    const img = col.querySelector('.location-image img, img');
    const nameEl = col.querySelector('.location-name');
    const name = nameEl ? nameEl.textContent.replace(/\s+/g, ' ').trim() : '';

    const details = [];
    const desc = col.querySelector('.location-description');
    if (desc) {
      [...desc.children].forEach((c) => {
        // links without text (duplicated overlay anchors) are dropped
        c.querySelectorAll('a').forEach((a) => {
          if (NBSP_ONLY.test(a.textContent) && !a.querySelector('img')) a.remove();
        });
        if (NBSP_ONLY.test(c.textContent) && !c.querySelector('img')) return;
        details.push(clean(c.cloneNode(true)));
      });
      if (!details.length && !NBSP_ONLY.test(desc.textContent)) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        details.push(p);
      }
    }

    if (!img && !name && !details.length) return;
    let nameCell = '';
    if (name) {
      const p = document.createElement('p');
      p.textContent = name;
      nameCell = p;
    }
    cells.push([img ? clean(img.cloneNode(true)) : '', nameCell, details.length ? details : '']);
  });
  if (!cells.length) cells.push(['', '', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'location-tiles', cells });
  element.replaceWith(block);
}
